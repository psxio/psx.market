# Smart Contract Escrow System - Deployment Guide

## Overview

Create.psx now includes a comprehensive smart contract-based escrow system for secure USDC payments on the Base blockchain. This guide covers deployment, configuration, and usage.

## Features

✅ **Milestone-Based Payments**: Break projects into trackable milestones  
✅ **Smart Contract Protection**: Funds held in auditable Solidity contracts  
✅ **Dispute Resolution**: Built-in arbitration system for conflicts  
✅ **Automated Refunds**: Time-locked payment releases with auto-refund capability  
✅ **Platform Fees**: Configurable fee system (default 2.5%)  
✅ **Real-Time Tracking**: On-chain transaction history and status  
✅ **Multi-Network Support**: Base mainnet and Sepolia testnet  

---

## Prerequisites

Before deploying the escrow contracts, ensure you have:

1. **Base Blockchain Access**
   - Base mainnet RPC: `https://mainnet.base.org`
   - Base Sepolia testnet RPC: `https://sepolia.base.org`

2. **Wallet with Funds**
   - ETH for gas fees on Base
   - Deployer private key for contract deployment

3. **Environment Variables**
   ```bash
   # Required for deployment
   DEPLOYER_PRIVATE_KEY=your_private_key_here
   
   # Optional: For contract verification on BaseScan
   BASESCAN_API_KEY=your_basescan_api_key
   
   # Admin wallet for dispute resolution
   ADMIN_WALLET_PRIVATE_KEY=admin_private_key_here
   ```

4. **USDC Contract Addresses** (Pre-configured)
   - Base Mainnet: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
   - Base Sepolia: `0x036CbD53842c5426634e7929541eC2318f3dCF7e`

---

## Deployment Steps

### 1. Compile the Smart Contract

```bash
npx hardhat compile
```

This compiles `contracts/USDCEscrow.sol` and generates ABI artifacts in `artifacts/`.

### 2. Deploy to Base Sepolia (Testnet)

**Test deployment first:**

```bash
npx hardhat run scripts/deploy.ts --network baseSepolia
```

**Output:**
```
Deploying USDCEscrow contract to Base blockchain...
Network: baseSepolia (Chain ID: 84532)
Using USDC address: 0x036CbD53842c5426634e7929541eC2318f3dCF7e
Deployer address: 0x...
Platform wallet: 0x...

USDCEscrow deployed to: 0xYOUR_CONTRACT_ADDRESS

=== Next Steps ===
1. Verify contract on BaseScan
2. Update .env with contract address
3. Update client/src/lib/escrowContract.ts
```

### 3. Verify Contract on BaseScan

```bash
npx hardhat verify --network baseSepolia \
  YOUR_CONTRACT_ADDRESS \
  0x036CbD53842c5426634e7929541eC2318f3dCF7e \
  YOUR_PLATFORM_WALLET_ADDRESS
```

### 4. Deploy to Base Mainnet (Production)

**⚠️ Only after thorough testing on Sepolia:**

```bash
npx hardhat run scripts/deploy.ts --network base
```

### 5. Update Environment Variables

Add the deployed contract addresses to your `.env` file:

```bash
# Escrow Contract Addresses
ESCROW_CONTRACT_SEPOLIA=0xYOUR_SEPOLIA_CONTRACT_ADDRESS
ESCROW_CONTRACT_MAINNET=0xYOUR_MAINNET_CONTRACT_ADDRESS

# Frontend Environment Variables
VITE_ESCROW_CONTRACT_SEPOLIA=0xYOUR_SEPOLIA_CONTRACT_ADDRESS
VITE_ESCROW_CONTRACT_MAINNET=0xYOUR_MAINNET_CONTRACT_ADDRESS
```

### 6. Update Frontend Configuration

Edit `client/src/lib/escrowContract.ts`:

```typescript
export const ESCROW_CONTRACT_ADDRESSES: { [key: number]: string } = {
  84532: "0xYOUR_SEPOLIA_CONTRACT_ADDRESS", // Base Sepolia testnet
  8453: "0xYOUR_MAINNET_CONTRACT_ADDRESS",  // Base mainnet
};
```

---

## Architecture

### Smart Contract Components

```
USDCEscrow.sol
├── Order Management
│   ├── createEscrow() - Initialize escrow with milestones
│   ├── getOrder() - Fetch order details
│   └── refundOrder() - Full refund (before releases)
├── Milestone System
│   ├── submitMilestone() - Builder submits work
│   ├── approveMilestone() - Client approves & releases payment
│   └── autoApproveMilestone() - Time-locked auto-approval
├── Dispute Resolution
│   ├── raiseDispute() - Freeze payments, escalate to admin
│   └── resolveDispute() - Admin arbitration with percentage split
└── Platform Fees
    ├── platformFeePercent (default: 250 = 2.5%)
    └── updatePlatformFee() - Admin adjustable fee
```

### Database Schema

**New Tables:**

1. **escrow_transactions** - On-chain transaction log
2. **escrow_disputes** - Dispute tracking with evidence

**Updated Tables:**

1. **orders** - Added escrow fields:
   - `escrowContractAddress`
   - `escrowCreatedTxHash`
   - `escrowStatus`
   - `escrowReleasedAmount`
   - `inDispute`

2. **milestones** - Added escrow fields:
   - `milestoneIndex`
   - `approvalDeadline`
   - `escrowStatus`
   - `escrowTxHash`

---

## Usage Workflows

### For Clients (Creating Orders)

1. **Connect Wallet** (RainbowKit)
2. **Select Builder & Service**
3. **Create Order with Milestones**
   - Define milestone descriptions
   - Allocate payment per milestone
   - Set approval deadlines (e.g., 7 days)
4. **Approve USDC Spending**
   - Client approves total + platform fee
5. **Create Escrow On-Chain**
   - Funds locked in smart contract
6. **Approve Milestones**
   - Review builder deliverables
   - Approve or request revisions
   - Payment auto-releases on approval
7. **Dispute if Needed**
   - Raise dispute to freeze payments
   - Admin arbitration decides outcome

### For Builders (Completing Work)

1. **Accept Order**
2. **Work on Milestones Sequentially**
3. **Submit Milestone for Approval**
   - Upload deliverables
   - Trigger on-chain submission event
4. **Wait for Client Approval**
   - Client has X days to review
   - Auto-approval after deadline
5. **Receive USDC Payment**
   - Funds auto-transfer to wallet
6. **Complete All Milestones**
   - Platform fee charged at final milestone

### For Admins (Dispute Resolution)

1. **Monitor Active Disputes**
2. **Review Evidence from Both Parties**
3. **Make Fair Decision**
   - CLIENT_WINS: Full refund to client
   - BUILDER_WINS: Full payment to builder
   - PARTIAL: Percentage split (e.g., 60% client, 40% builder)
4. **Execute On-Chain Resolution**
   - Funds distributed per decision
   - Dispute marked resolved

---

## Frontend Components

### EscrowManager Component

**Usage:**

```tsx
import { EscrowManager } from '@/components/escrow/EscrowManager';

<EscrowManager
  orderId="order-123"
  userType="client" // or "builder"
  isTestnet={true}
/>
```

**Features:**
- Escrow status overview
- Milestone timeline
- Dispute interface
- Transaction history

### Integration Example

```tsx
// In order details page
import { EscrowManager } from '@/components/escrow/EscrowManager';

function OrderDetailsPage({ orderId }) {
  const { data: order } = useQuery(`/api/orders/${orderId}`);
  const userType = determineUserType(order); // "client" or "builder"
  
  return (
    <div>
      <h1>Order #{orderId}</h1>
      
      {order.escrowStatus !== 'none' && (
        <EscrowManager
          orderId={orderId}
          userType={userType}
          isTestnet={false} // Set based on environment
        />
      )}
    </div>
  );
}
```

---

## API Endpoints

### Escrow Management

```
POST   /api/escrow/:orderId/sync
POST   /api/escrow/:orderId/milestones/:milestoneIndex/sync
GET    /api/escrow/:orderId/milestones
PATCH  /api/escrow/milestones/:milestoneId
```

### Transactions

```
POST   /api/escrow/transactions
PATCH  /api/escrow/transactions/:txHash
GET    /api/escrow/:orderId/transactions
```

### Disputes

```
POST   /api/escrow/:orderId/disputes
GET    /api/escrow/:orderId/disputes
PATCH  /api/escrow/disputes/:disputeId/resolve
```

### Events

```
GET    /api/escrow/:orderId/events
```

---

## Security Considerations

### Smart Contract Security

1. **OpenZeppelin Standards**
   - Using battle-tested `ReentrancyGuard`
   - Using `SafeERC20` for token transfers
   - Using `Ownable` for admin functions

2. **Access Control**
   - Only client can approve milestones
   - Only builder can submit milestones
   - Only admin can resolve disputes

3. **State Management**
   - State updates before external calls (CEI pattern)
   - Reentrancy protection on all fund transfers

### Best Practices

1. **Never Store Private Keys in Code**
2. **Use Environment Variables for Secrets**
3. **Audit Contracts Before Mainnet Deployment**
4. **Test Thoroughly on Sepolia First**
5. **Monitor Gas Prices on Base**
6. **Set Reasonable Approval Deadlines**
7. **Keep Platform Fee Below 10%**

---

## Testing

### Local Testing with Hardhat

```bash
# Run unit tests (create test/USDCEscrow.test.ts)
npx hardhat test

# Test coverage
npx hardhat coverage
```

### Integration Testing

Use the `run_test` tool with Playwright to test end-to-end flows:

```typescript
// Example test plan
1. [Browser] Connect wallet as client
2. [Browser] Create order with 3 milestones
3. [Browser] Approve USDC spending
4. [API] Verify escrow created on-chain
5. [Browser] Switch to builder wallet
6. [Browser] Submit milestone 1
7. [Browser] Switch to client wallet
8. [Browser] Approve milestone 1
9. [API] Verify payment released to builder
```

---

## Troubleshooting

### Common Issues

**1. "Insufficient allowance" error**
- Client hasn't approved USDC spending
- Solution: Call `approveUSDC()` before `createEscrow()`

**2. "Order already exists" error**
- Trying to create duplicate escrow
- Solution: Use unique order IDs

**3. "Only client can approve" error**
- Builder trying to approve their own milestone
- Solution: Switch to client wallet

**4. "Approval deadline not reached" error**
- Trying to auto-approve too early
- Solution: Wait for deadline or use client approval

**5. Transaction fails with "out of gas"**
- Insufficient ETH for gas fees
- Solution: Add ETH to wallet

---

## Gas Costs (Estimated on Base)

| Operation | Gas Cost | USD Cost (@ $0.01/gas) |
|-----------|----------|------------------------|
| createEscrow | ~150,000 | ~$0.15 |
| submitMilestone | ~50,000 | ~$0.05 |
| approveMilestone | ~100,000 | ~$0.10 |
| raiseDispute | ~60,000 | ~$0.06 |
| resolveDispute | ~120,000 | ~$0.12 |

*Base has significantly lower gas costs than Ethereum mainnet.*

---

## Monitoring & Analytics

### Track On-Chain Events

```typescript
import { escrowService } from '@/server/escrowService';

// Monitor all events for an order
const events = await escrowService.monitorEscrowEvents(orderId);

// Filter by event type
const milestoneApprovals = events.filter(e => 
  e.event === 'MilestoneApproved'
);
```

### Sync Status Regularly

```typescript
// Sync escrow status from blockchain
await syncEscrowMutation.mutate();

// Sync milestone status
await syncMilestoneEscrowStatus(orderId, milestoneIndex);
```

---

## Future Enhancements

- [ ] Multi-signature dispute resolution (3-of-5 arbiters)
- [ ] Automated dispute detection using AI
- [ ] Support for multiple payment tokens (ETH, USDT)
- [ ] Partial milestone approvals
- [ ] Builder insurance pool
- [ ] Reputation-based automatic release periods
- [ ] Integration with Chainlink oracles for off-chain verification

---

## Support

For questions or issues:
1. Check BaseScan for transaction details
2. Review smart contract code in `contracts/USDCEscrow.sol`
3. Examine frontend integration in `client/src/lib/escrowContract.ts`
4. Contact admin for dispute assistance

---

## License

Smart contracts are MIT licensed. See `contracts/` directory for details.
