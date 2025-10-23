import { ethers } from 'ethers';
import { db } from './db';
import { orders, milestones, escrowTransactions, escrowDisputes } from '@shared/schema';
import { eq, and } from 'drizzle-orm';

// Contract addresses (should match deployed contracts)
const ESCROW_CONTRACT_ADDRESSES: { [key: number]: string } = {
  84532: process.env.ESCROW_CONTRACT_SEPOLIA || "", // Base Sepolia testnet
  8453: process.env.ESCROW_CONTRACT_MAINNET || "",  // Base mainnet
};

// USDC addresses on Base
const USDC_ADDRESSES: { [key: number]: string } = {
  84532: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia
  8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",  // Base mainnet
};

// Escrow Contract ABI
const ESCROW_ABI = [
  "function createEscrow(string orderId, address builder, uint256 totalAmount, uint256[] milestoneAmounts, string[] milestoneDescriptions, uint256[] milestoneDeadlines) external",
  "function submitMilestone(string orderId, uint256 milestoneIndex) external",
  "function approveMilestone(string orderId, uint256 milestoneIndex) external",
  "function autoApproveMilestone(string orderId, uint256 milestoneIndex) external",
  "function raiseDispute(string orderId) external",
  "function resolveDispute(string orderId, uint8 outcome, uint256 clientPercentage) external",
  "function refundOrder(string orderId) external",
  "function getOrder(string orderId) external view returns (address client, address builder, uint256 totalAmount, uint256 platformFee, uint256 releasedAmount, uint8 status, bool inDispute, uint256 milestoneCount)",
  "function getMilestone(string orderId, uint256 milestoneIndex) external view returns (uint256 amount, string description, uint8 status, uint256 submittedAt, uint256 approvalDeadline)",
  "function platformFeePercent() external view returns (uint256)",
];

/**
 * Get provider for Base blockchain
 */
export function getProvider(isTestnet: boolean = true): ethers.Provider {
  const rpcUrl = isTestnet 
    ? "https://sepolia.base.org"
    : "https://mainnet.base.org";
  
  return new ethers.JsonRpcProvider(rpcUrl);
}

/**
 * Get signer for server operations (admin operations only)
 */
export function getSigner(isTestnet: boolean = true): ethers.Wallet {
  const privateKey = process.env.ADMIN_WALLET_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("ADMIN_WALLET_PRIVATE_KEY not configured");
  }
  
  const provider = getProvider(isTestnet);
  return new ethers.Wallet(privateKey, provider);
}

/**
 * Get escrow contract instance
 */
export function getEscrowContract(
  providerOrSigner: ethers.Provider | ethers.Signer,
  isTestnet: boolean = true
): ethers.Contract {
  const chainId = isTestnet ? 84532 : 8453;
  const contractAddress = ESCROW_CONTRACT_ADDRESSES[chainId];
  
  if (!contractAddress) {
    throw new Error(`Escrow contract not deployed on chain ${chainId}`);
  }
  
  return new ethers.Contract(contractAddress, ESCROW_ABI, providerOrSigner);
}

/**
 * Log escrow transaction to database
 */
export async function logEscrowTransaction(
  orderId: string,
  transactionType: string,
  amount: string,
  txHash: string,
  fromAddress?: string,
  toAddress?: string,
  metadata?: any
) {
  try {
    await db.insert(escrowTransactions).values({
      orderId,
      transactionType,
      amount,
      txHash,
      fromAddress,
      toAddress,
      status: 'pending',
      metadata: metadata ? JSON.stringify(metadata) : null,
    });
  } catch (error) {
    console.error("Error logging escrow transaction:", error);
  }
}

/**
 * Update transaction status
 */
export async function updateTransactionStatus(
  txHash: string,
  status: 'confirmed' | 'failed',
  errorMessage?: string
) {
  try {
    await db.update(escrowTransactions)
      .set({
        status,
        errorMessage: errorMessage || null,
        confirmedAt: status === 'confirmed' ? new Date().toISOString() : null,
      })
      .where(eq(escrowTransactions.txHash, txHash));
  } catch (error) {
    console.error("Error updating transaction status:", error);
  }
}

/**
 * Sync order escrow status from blockchain
 */
export async function syncOrderEscrowStatus(
  orderId: string,
  isTestnet: boolean = true
) {
  try {
    const provider = getProvider(isTestnet);
    const contract = getEscrowContract(provider, isTestnet);
    
    const orderData = await contract.getOrder(orderId);
    
    await db.update(orders)
      .set({
        escrowStatus: getEscrowStatusString(Number(orderData[5])),
        escrowReleasedAmount: (Number(orderData[4]) / 1_000_000).toString(),
        inDispute: orderData[6],
        updatedAt: new Date().toISOString(),
      })
      .where(eq(orders.id, orderId));
    
    return {
      status: getEscrowStatusString(Number(orderData[5])),
      releasedAmount: Number(orderData[4]) / 1_000_000,
      inDispute: orderData[6],
    };
  } catch (error) {
    console.error("Error syncing order escrow status:", error);
    throw error;
  }
}

/**
 * Sync milestone escrow status from blockchain
 */
export async function syncMilestoneEscrowStatus(
  orderId: string,
  milestoneIndex: number,
  isTestnet: boolean = true
) {
  try {
    const provider = getProvider(isTestnet);
    const contract = getEscrowContract(provider, isTestnet);
    
    const milestoneData = await contract.getMilestone(orderId, milestoneIndex);
    
    const milestoneRecords = await db.select()
      .from(milestones)
      .where(and(
        eq(milestones.projectId, orderId),
        eq(milestones.milestoneIndex, milestoneIndex)
      ));
    
    if (milestoneRecords.length > 0) {
      const milestoneId = milestoneRecords[0].id;
      
      await db.update(milestones)
        .set({
          escrowStatus: getMilestoneStatusString(Number(milestoneData[2])),
          submittedAt: milestoneData[3] > 0 
            ? new Date(Number(milestoneData[3]) * 1000).toISOString()
            : null,
        })
        .where(eq(milestones.id, milestoneId));
      
      return {
        status: getMilestoneStatusString(Number(milestoneData[2])),
        submittedAt: milestoneData[3] > 0 
          ? new Date(Number(milestoneData[3]) * 1000).toISOString()
          : null,
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error syncing milestone escrow status:", error);
    throw error;
  }
}

/**
 * Convert escrow status enum to string
 */
function getEscrowStatusString(status: number): string {
  const statusMap: { [key: number]: string } = {
    0: 'active',
    1: 'completed',
    2: 'cancelled',
    3: 'disputed',
  };
  return statusMap[status] || 'unknown';
}

/**
 * Convert milestone status enum to string
 */
function getMilestoneStatusString(status: number): string {
  const statusMap: { [key: number]: string } = {
    0: 'pending',
    1: 'submitted',
    2: 'approved',
    3: 'paid',
    4: 'disputed',
  };
  return statusMap[status] || 'unknown';
}

/**
 * Monitor escrow events for an order
 */
export async function monitorEscrowEvents(
  orderId: string,
  isTestnet: boolean = true,
  fromBlock: number = 0
) {
  try {
    const provider = getProvider(isTestnet);
    const contract = getEscrowContract(provider, isTestnet);
    
    // Listen for all escrow events for this order
    const filter = contract.filters;
    
    const escrowCreatedFilter = filter.EscrowCreated(orderId);
    const milestoneSubmittedFilter = filter.MilestoneSubmitted(orderId);
    const milestoneApprovedFilter = filter.MilestoneApproved(orderId);
    const milestonePaidFilter = filter.MilestonePaid(orderId);
    const disputeRaisedFilter = filter.DisputeRaised(orderId);
    const disputeResolvedFilter = filter.DisputeResolved(orderId);
    const orderRefundedFilter = filter.OrderRefunded(orderId);
    
    // Query historical events
    const events = await Promise.all([
      contract.queryFilter(escrowCreatedFilter, fromBlock),
      contract.queryFilter(milestoneSubmittedFilter, fromBlock),
      contract.queryFilter(milestoneApprovedFilter, fromBlock),
      contract.queryFilter(milestonePaidFilter, fromBlock),
      contract.queryFilter(disputeRaisedFilter, fromBlock),
      contract.queryFilter(disputeResolvedFilter, fromBlock),
      contract.queryFilter(orderRefundedFilter, fromBlock),
    ]);
    
    return events.flat();
  } catch (error) {
    console.error("Error monitoring escrow events:", error);
    throw error;
  }
}

export const escrowService = {
  getProvider,
  getSigner,
  getEscrowContract,
  logEscrowTransaction,
  updateTransactionStatus,
  syncOrderEscrowStatus,
  syncMilestoneEscrowStatus,
  monitorEscrowEvents,
};
