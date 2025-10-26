import { ethers } from "ethers";
import { readFileSync } from "fs";
import { join } from "path";

// USDC addresses on Base
const USDC_ADDRESSES: { [key: number]: string } = {
  84532: "0x036CbD53842c5426634e7929541eC2318f3dCF7e", // Base Sepolia testnet
  8453: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",  // Base mainnet
};

async function main() {
  console.log("Deploying USDCEscrow contract to Base blockchain...\n");

  // Get network from command line or default to Sepolia
  const networkArg = process.argv[2] || "sepolia";
  const isMainnet = networkArg === "mainnet";
  
  const rpcUrl = isMainnet 
    ? "https://mainnet.base.org"
    : "https://sepolia.base.org";
  
  const chainId = isMainnet ? 8453 : 84532;
  const networkName = isMainnet ? "Base Mainnet" : "Base Sepolia";

  console.log(`Network: ${networkName} (Chain ID: ${chainId})`);
  console.log(`RPC URL: ${rpcUrl}\n`);

  // Setup provider and wallet
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  
  if (!privateKey) {
    throw new Error("DEPLOYER_PRIVATE_KEY not found in environment variables");
  }
  
  const wallet = new ethers.Wallet(privateKey, provider);
  console.log(`Deployer address: ${wallet.address}`);
  
  // Check balance
  const balance = await provider.getBalance(wallet.address);
  console.log(`Balance: ${ethers.formatEther(balance)} ETH\n`);
  
  if (balance === 0n) {
    throw new Error("Deployer wallet has no ETH. Please fund it with testnet ETH.");
  }

  // Get USDC address for this network
  const usdcAddress = USDC_ADDRESSES[chainId];
  if (!usdcAddress) {
    throw new Error(`No USDC address configured for chain ID ${chainId}`);
  }
  console.log(`USDC address: ${usdcAddress}`);
  
  // Platform wallet is the deployer
  const platformWallet = wallet.address;
  console.log(`Platform wallet: ${platformWallet}\n`);

  // Read compiled contract
  const artifactPath = join(process.cwd(), "artifacts/contracts/USDCEscrow.sol/USDCEscrow.json");
  let artifact;
  
  try {
    artifact = JSON.parse(readFileSync(artifactPath, "utf8"));
  } catch (error) {
    console.error("Contract not compiled. Run: npx hardhat compile");
    throw error;
  }

  const { abi, bytecode } = artifact;

  // Create contract factory
  const factory = new ethers.ContractFactory(abi, bytecode, wallet);

  console.log("Deploying contract...");
  const contract = await factory.deploy(usdcAddress, platformWallet);
  
  console.log(`Transaction hash: ${contract.deploymentTransaction()?.hash}`);
  console.log("Waiting for deployment confirmation...");
  
  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("\n✅ Deployment successful!");
  console.log("\n=== Deployment Summary ===");
  console.log(`Contract Address: ${contractAddress}`);
  console.log(`USDC Address: ${usdcAddress}`);
  console.log(`Platform Wallet: ${platformWallet}`);
  console.log(`Owner: ${wallet.address}`);
  console.log(`Network: ${networkName}`);

  // Get platform fee
  const platformFee = await contract.platformFeePercent();
  console.log(`Platform Fee: ${Number(platformFee) / 100}%`);

  console.log("\n=== Next Steps ===");
  console.log("1. Update .env with contract address:");
  if (isMainnet) {
    console.log(`   VITE_ESCROW_CONTRACT_MAINNET=${contractAddress}`);
  } else {
    console.log(`   VITE_ESCROW_CONTRACT_SEPOLIA=${contractAddress}`);
  }
  
  console.log("\n2. Verify contract on BaseScan:");
  const basescanUrl = isMainnet 
    ? "https://basescan.org"
    : "https://sepolia.basescan.org";
  console.log(`   ${basescanUrl}/address/${contractAddress}`);
  
  if (process.env.BASESCAN_API_KEY) {
    console.log("\n3. Run verification:");
    console.log(`   npx hardhat verify --network ${isMainnet ? 'base' : 'baseSepolia'} ${contractAddress} ${usdcAddress} ${platformWallet}`);
  }
  
  console.log("\n4. Update client/src/lib/escrowContract.ts with the contract address");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
