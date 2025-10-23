import { ethers } from 'ethers';

// Contract addresses (update after deployment)
export const ESCROW_CONTRACT_ADDRESSES: { [key: number]: string } = {
  84532: process.env.VITE_ESCROW_CONTRACT_SEPOLIA || "", // Base Sepolia testnet
  8453: process.env.VITE_ESCROW_CONTRACT_MAINNET || "",  // Base mainnet
};

// USDC addresses on Base
export const USDC_ADDRESSES: { [key: number]: string } = {
  84532: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia
  8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",  // Base mainnet
};

// Escrow Contract ABI (essential functions only)
export const ESCROW_ABI = [
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
  
  "event EscrowCreated(string indexed orderId, address indexed client, address indexed builder, uint256 totalAmount, uint256 platformFee)",
  "event MilestoneSubmitted(string indexed orderId, uint256 milestoneIndex, uint256 timestamp)",
  "event MilestoneApproved(string indexed orderId, uint256 milestoneIndex, uint256 amount)",
  "event MilestonePaid(string indexed orderId, uint256 milestoneIndex, uint256 amount, address indexed builder)",
  "event DisputeRaised(string indexed orderId, address indexed initiator, uint256 timestamp)",
  "event DisputeResolved(string indexed orderId, uint8 outcome, uint256 clientAmount, uint256 builderAmount)",
  "event OrderRefunded(string indexed orderId, address indexed client, uint256 amount)",
];

// USDC ABI (essential functions)
export const USDC_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
];

// Enum mappings
export enum EscrowOrderStatus {
  ACTIVE = 0,
  COMPLETED = 1,
  CANCELLED = 2,
  DISPUTED = 3,
}

export enum EscrowMilestoneStatus {
  PENDING = 0,
  SUBMITTED = 1,
  APPROVED = 2,
  PAID = 3,
  DISPUTED = 4,
}

export enum DisputeOutcome {
  NONE = 0,
  CLIENT_WINS = 1,
  BUILDER_WINS = 2,
  PARTIAL = 3,
}

/**
 * Get contract instance
 */
export async function getEscrowContract(
  provider: ethers.Provider,
  signer?: ethers.Signer
) {
  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);
  const contractAddress = ESCROW_CONTRACT_ADDRESSES[chainId];
  
  if (!contractAddress) {
    throw new Error(`Escrow contract not deployed on chain ${chainId}`);
  }
  
  return new ethers.Contract(
    contractAddress,
    ESCROW_ABI,
    signer || provider
  );
}

/**
 * Get USDC contract instance
 */
export async function getUSDCContract(
  provider: ethers.Provider,
  signer?: ethers.Signer
) {
  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);
  const usdcAddress = USDC_ADDRESSES[chainId];
  
  if (!usdcAddress) {
    throw new Error(`USDC not available on chain ${chainId}`);
  }
  
  return new ethers.Contract(
    usdcAddress,
    USDC_ABI,
    signer || provider
  );
}

/**
 * Calculate platform fee
 */
export async function calculatePlatformFee(
  provider: ethers.Provider,
  totalAmount: bigint
): Promise<bigint> {
  try {
    const contract = await getEscrowContract(provider);
    const feePercent = await contract.platformFeePercent();
    return (totalAmount * feePercent) / BigInt(10000);
  } catch (error) {
    console.error("Error calculating platform fee:", error);
    // Default to 2.5% if contract not available
    return (totalAmount * BigInt(250)) / BigInt(10000);
  }
}

/**
 * Approve USDC spending for escrow
 */
export async function approveUSDC(
  signer: ethers.Signer,
  amount: bigint
): Promise<ethers.TransactionResponse> {
  const usdcContract = await getUSDCContract(await signer.provider!, signer);
  const provider = await signer.provider!;
  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);
  const escrowAddress = ESCROW_CONTRACT_ADDRESSES[chainId];
  
  if (!escrowAddress) {
    throw new Error(`Escrow contract not deployed on chain ${chainId}`);
  }
  
  return await usdcContract.approve(escrowAddress, amount);
}

/**
 * Check USDC allowance
 */
export async function checkUSDCAllowance(
  provider: ethers.Provider,
  owner: string
): Promise<bigint> {
  const usdcContract = await getUSDCContract(provider);
  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);
  const escrowAddress = ESCROW_CONTRACT_ADDRESSES[chainId];
  
  if (!escrowAddress) {
    return BigInt(0);
  }
  
  return await usdcContract.allowance(owner, escrowAddress);
}

/**
 * Create escrow on-chain
 */
export async function createEscrowOnChain(
  signer: ethers.Signer,
  orderId: string,
  builderAddress: string,
  totalAmount: bigint,
  milestoneAmounts: bigint[],
  milestoneDescriptions: string[],
  milestoneDeadlines: number[]
): Promise<ethers.TransactionResponse> {
  const contract = await getEscrowContract(await signer.provider!, signer);
  
  return await contract.createEscrow(
    orderId,
    builderAddress,
    totalAmount,
    milestoneAmounts,
    milestoneDescriptions,
    milestoneDeadlines
  );
}

/**
 * Submit milestone on-chain
 */
export async function submitMilestoneOnChain(
  signer: ethers.Signer,
  orderId: string,
  milestoneIndex: number
): Promise<ethers.TransactionResponse> {
  const contract = await getEscrowContract(await signer.provider!, signer);
  return await contract.submitMilestone(orderId, milestoneIndex);
}

/**
 * Approve milestone on-chain
 */
export async function approveMilestoneOnChain(
  signer: ethers.Signer,
  orderId: string,
  milestoneIndex: number
): Promise<ethers.TransactionResponse> {
  const contract = await getEscrowContract(await signer.provider!, signer);
  return await contract.approveMilestone(orderId, milestoneIndex);
}

/**
 * Auto-approve milestone on-chain
 */
export async function autoApproveMilestoneOnChain(
  signer: ethers.Signer,
  orderId: string,
  milestoneIndex: number
): Promise<ethers.TransactionResponse> {
  const contract = await getEscrowContract(await signer.provider!, signer);
  return await contract.autoApproveMilestone(orderId, milestoneIndex);
}

/**
 * Raise dispute on-chain
 */
export async function raiseDisputeOnChain(
  signer: ethers.Signer,
  orderId: string
): Promise<ethers.TransactionResponse> {
  const contract = await getEscrowContract(await signer.provider!, signer);
  return await contract.raiseDispute(orderId);
}

/**
 * Resolve dispute on-chain (admin only)
 */
export async function resolveDisputeOnChain(
  signer: ethers.Signer,
  orderId: string,
  outcome: DisputeOutcome,
  clientPercentage: number
): Promise<ethers.TransactionResponse> {
  const contract = await getEscrowContract(await signer.provider!, signer);
  return await contract.resolveDispute(orderId, outcome, clientPercentage);
}

/**
 * Refund order on-chain
 */
export async function refundOrderOnChain(
  signer: ethers.Signer,
  orderId: string
): Promise<ethers.TransactionResponse> {
  const contract = await getEscrowContract(await signer.provider!, signer);
  return await contract.refundOrder(orderId);
}

/**
 * Get order details from contract
 */
export async function getOrderFromContract(
  provider: ethers.Provider,
  orderId: string
) {
  const contract = await getEscrowContract(provider);
  const orderData = await contract.getOrder(orderId);
  
  return {
    client: orderData[0],
    builder: orderData[1],
    totalAmount: orderData[2],
    platformFee: orderData[3],
    releasedAmount: orderData[4],
    status: orderData[5],
    inDispute: orderData[6],
    milestoneCount: orderData[7],
  };
}

/**
 * Get milestone details from contract
 */
export async function getMilestoneFromContract(
  provider: ethers.Provider,
  orderId: string,
  milestoneIndex: number
) {
  const contract = await getEscrowContract(provider);
  const milestoneData = await contract.getMilestone(orderId, milestoneIndex);
  
  return {
    amount: milestoneData[0],
    description: milestoneData[1],
    status: milestoneData[2],
    submittedAt: milestoneData[3],
    approvalDeadline: milestoneData[4],
  };
}

/**
 * Wait for transaction confirmation and return receipt
 */
export async function waitForTransaction(
  tx: ethers.TransactionResponse,
  confirmations: number = 1
): Promise<ethers.TransactionReceipt> {
  const receipt = await tx.wait(confirmations);
  if (!receipt) {
    throw new Error("Transaction receipt not available");
  }
  return receipt;
}

/**
 * Convert USDC amount to wei (6 decimals)
 */
export function usdcToWei(amount: number): bigint {
  return BigInt(Math.floor(amount * 1_000_000));
}

/**
 * Convert wei to USDC amount (6 decimals)
 */
export function weiToUsdc(wei: bigint): number {
  return Number(wei) / 1_000_000;
}
