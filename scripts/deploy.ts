import { ethers } from "hardhat";

async function main() {
  console.log("Deploying USDCEscrow contract to Base blockchain...");

  // Get network
  const network = await ethers.provider.getNetwork();
  console.log(`Network: ${network.name} (Chain ID: ${network.chainId})`);

  // USDC addresses on Base
  const USDC_ADDRESSES: { [key: number]: string } = {
    84532: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia testnet
    8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",  // Base mainnet
  };

  const usdcAddress = USDC_ADDRESSES[Number(network.chainId)];
  if (!usdcAddress) {
    throw new Error(`No USDC address configured for chain ID ${network.chainId}`);
  }

  console.log(`Using USDC address: ${usdcAddress}`);

  // Platform wallet (should be set to admin wallet)
  const [deployer] = await ethers.getSigners();
  const platformWallet = deployer.address; // Change this to actual platform wallet

  console.log(`Deployer address: ${deployer.address}`);
  console.log(`Platform wallet: ${platformWallet}`);

  // Deploy contract
  const USDCEscrow = await ethers.getContractFactory("USDCEscrow");
  const escrow = await USDCEscrow.deploy(usdcAddress, platformWallet);

  await escrow.waitForDeployment();

  const escrowAddress = await escrow.getAddress();
  console.log(`\nUSDCEscrow deployed to: ${escrowAddress}`);

  // Log configuration
  const platformFee = await escrow.platformFeePercent();
  console.log(`Platform fee: ${platformFee / 100}%`);

  console.log("\n=== Deployment Summary ===");
  console.log(`Contract Address: ${escrowAddress}`);
  console.log(`USDC Address: ${usdcAddress}`);
  console.log(`Platform Wallet: ${platformWallet}`);
  console.log(`Owner: ${deployer.address}`);

  console.log("\n=== Next Steps ===");
  console.log("1. Verify contract on BaseScan:");
  console.log(`   npx hardhat verify --network ${network.name} ${escrowAddress} ${usdcAddress} ${platformWallet}`);
  console.log("2. Update .env with contract address:");
  console.log(`   ESCROW_CONTRACT_ADDRESS=${escrowAddress}`);
  console.log("3. Update client/src/lib/escrowContract.ts with the contract address");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
