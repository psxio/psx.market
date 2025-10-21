import { createBaseAccountSDK, getCryptoKeyAccount } from '@base-org/account';

const BASE_MAINNET_CHAIN_ID = 8453;
const BASE_SEPOLIA_CHAIN_ID = 84532;
const BASE_MAINNET_HEX = '0x2105';
const BASE_SEPOLIA_HEX = '0x14a34';

// Token contract addresses on Base
const PSX_TOKEN_ADDRESS = import.meta.env.VITE_PSX_TOKEN_ADDRESS || '0x0000000000000000000000000000000000000000';
const CREATE_TOKEN_ADDRESS = '0x3849cC93e7B71b37885237cd91a215974135cD8D';

interface BaseAccountManager {
  sdk: any;
  provider: any;
}

let accountManager: BaseAccountManager | null = null;
let eventListenersAttached = false;

export function initializeBaseAccount() {
  if (accountManager) return accountManager;

  const sdk = createBaseAccountSDK({
    appName: 'Create.psx - Token-Gated Marketplace',
    appLogoUrl: `${window.location.origin}/logo.png`,
    appChainIds: [BASE_MAINNET_CHAIN_ID, BASE_SEPOLIA_CHAIN_ID],
    preference: {
      options: 'all', // Allow both smart wallets and EOA
      attribution: {
        auto: true,
      }
    }
  });

  const provider = sdk.getProvider();

  accountManager = { sdk, provider };
  return accountManager;
}

export async function getCurrentAccount() {
  try {
    const cryptoAccount = await getCryptoKeyAccount();
    return cryptoAccount?.account || null;
  } catch (error) {
    console.error('Error getting current account:', error);
    return null;
  }
}

export async function connectWallet(): Promise<string> {
  const manager = initializeBaseAccount();
  
  try {
    // Request account access
    const addresses = await manager.provider.request({
      method: 'eth_requestAccounts'
    });
    
    if (!addresses || addresses.length === 0) {
      throw new Error('No addresses returned from wallet');
    }

    // Verify we're on Base network
    await ensureBaseNetwork(manager.provider);
    
    // Attach event listeners if not already attached
    if (!eventListenersAttached) {
      attachProviderListeners(manager.provider);
      eventListenersAttached = true;
    }

    return addresses[0];
  } catch (error: any) {
    // Handle EIP-1193 user rejection error
    if (error.code === 4001) {
      throw new Error('User denied account access');
    }
    throw error;
  }
}

async function ensureBaseNetwork(provider: any): Promise<void> {
  try {
    const chainId = await provider.request({ method: 'eth_chainId' });
    
    // Check if already on Base (mainnet or testnet)
    if (chainId === BASE_MAINNET_HEX || chainId === BASE_SEPOLIA_HEX) {
      return;
    }

    // Try to switch to Base mainnet
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BASE_MAINNET_HEX }],
      });
    } catch (switchError: any) {
      // Chain not added to wallet (error 4902), try adding it
      if (switchError.code === 4902) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: BASE_MAINNET_HEX,
            chainName: 'Base',
            nativeCurrency: {
              name: 'Ethereum',
              symbol: 'ETH',
              decimals: 18,
            },
            rpcUrls: ['https://mainnet.base.org'],
            blockExplorerUrls: ['https://basescan.org'],
          }],
        });
      } else {
        throw switchError;
      }
    }
  } catch (error) {
    console.error('Error ensuring Base network:', error);
    throw new Error('Failed to switch to Base network. Please switch manually.');
  }
}

function attachProviderListeners(provider: any): void {
  // Listen for account changes
  provider.on('accountsChanged', (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected
      window.dispatchEvent(new CustomEvent('wallet-disconnected'));
    } else {
      // Account changed
      window.dispatchEvent(new CustomEvent('wallet-account-changed', { 
        detail: { address: accounts[0] } 
      }));
    }
  });

  // Listen for chain changes
  provider.on('chainChanged', (chainId: string) => {
    // Reload page on chain change as recommended by MetaMask
    window.location.reload();
  });

  // Listen for disconnect
  provider.on('disconnect', () => {
    window.dispatchEvent(new CustomEvent('wallet-disconnected'));
  });
}

export async function getPSXBalance(address: string): Promise<string> {
  const manager = initializeBaseAccount();
  
  try {
    // Check if token address is configured
    if (!PSX_TOKEN_ADDRESS || PSX_TOKEN_ADDRESS === '0x0000000000000000000000000000000000000000') {
      throw new Error('PSX token address not configured');
    }

    // Ensure we're on Base network before fetching balance
    await ensureBaseNetwork(manager.provider);

    // Get token decimals first
    const decimals = await getTokenDecimals(manager.provider, PSX_TOKEN_ADDRESS);
    
    // ERC-20 balanceOf function signature: 0x70a08231
    // Correct ABI encoding: function selector + padded address (no 0x prefix)
    const addressWithoutPrefix = address.slice(2);
    const balanceOfCalldata = '0x70a08231' + addressWithoutPrefix.toLowerCase().padStart(64, '0');
    
    const result = await manager.provider.request({
      method: 'eth_call',
      params: [
        {
          to: PSX_TOKEN_ADDRESS,
          data: balanceOfCalldata
        },
        'latest'
      ]
    });

    // Parse the result using BigInt to avoid precision loss
    const balanceWei = BigInt(result);
    
    // Handle edge case: decimals === 0 (no fractional part)
    if (decimals === 0) {
      return balanceWei.toLocaleString('en-US');
    }
    
    // Convert using BigInt division to maintain precision
    // Build divisor using BigInt to avoid Number precision loss
    let divisor = BigInt(1);
    for (let i = 0; i < decimals; i++) {
      divisor = divisor * BigInt(10);
    }
    
    const balanceWhole = balanceWei / divisor;
    const balanceRemainder = balanceWei % divisor;
    
    // Format with decimals (show up to 2 decimal places)
    const remainderStr = balanceRemainder.toString().padStart(decimals, '0');
    const decimalPart = remainderStr.slice(0, Math.min(2, decimals));
    
    // Build the formatted string directly from BigInt values
    // Use Intl.NumberFormat for the whole part, append decimals manually
    const wholeFormatted = balanceWhole.toLocaleString('en-US');
    
    // Only show decimal part if it's non-zero
    if (decimalPart && BigInt(decimalPart) > BigInt(0)) {
      return wholeFormatted + '.' + decimalPart;
    }
    
    return wholeFormatted;
  } catch (error) {
    console.error('Error fetching PSX balance:', error);
    // Return 0 on error - do NOT return fake balance
    return '0';
  }
}

async function getTokenDecimals(provider: any, tokenAddress: string): Promise<number> {
  try {
    // ERC-20 decimals function signature: 0x313ce567
    const result = await provider.request({
      method: 'eth_call',
      params: [
        {
          to: tokenAddress,
          data: '0x313ce567'
        },
        'latest'
      ]
    });
    
    return parseInt(result, 16);
  } catch (error) {
    console.error('Error fetching token decimals, assuming 18:', error);
    // Default to 18 decimals if query fails
    return 18;
  }
}

export async function getRawPSXBalance(address: string): Promise<{ value: bigint, decimals: number } | null> {
  const manager = initializeBaseAccount();
  
  try {
    // Check if token address is configured
    if (!PSX_TOKEN_ADDRESS || PSX_TOKEN_ADDRESS === '0x0000000000000000000000000000000000000000') {
      throw new Error('PSX token address not configured');
    }

    // Ensure we're on Base network before fetching balance
    await ensureBaseNetwork(manager.provider);

    // Get token decimals first
    const decimals = await getTokenDecimals(manager.provider, PSX_TOKEN_ADDRESS);
    
    // ERC-20 balanceOf function call
    const addressWithoutPrefix = address.slice(2);
    const balanceOfCalldata = '0x70a08231' + addressWithoutPrefix.toLowerCase().padStart(64, '0');
    
    const result = await manager.provider.request({
      method: 'eth_call',
      params: [
        {
          to: PSX_TOKEN_ADDRESS,
          data: balanceOfCalldata
        },
        'latest'
      ]
    });

    return {
      value: BigInt(result),
      decimals
    };
  } catch (error) {
    console.error('Error fetching raw PSX balance:', error);
    return null;
  }
}

export function hasMinPSXBalance(balance: string, minRequired: string): boolean {
  try {
    // Remove commas and parse as decimal strings
    const balanceStr = balance.replace(/,/g, '');
    const minStr = minRequired.replace(/,/g, '');
    
    // Parse both as decimals and compare
    // This is safe for comparison since we're using the same decimal precision
    const balanceNum = parseFloat(balanceStr);
    const minNum = parseFloat(minStr);
    
    return balanceNum >= minNum;
  } catch (error) {
    console.error('Error comparing PSX balances:', error);
    return false;
  }
}

export async function hasMinPSXBalancePrecise(address: string, minRequired: string): Promise<boolean> {
  try {
    const rawBalance = await getRawPSXBalance(address);
    if (!rawBalance) return false;
    
    // Use the decimals from rawBalance to ensure consistency
    const decimals = rawBalance.decimals;
    
    // Parse minRequired as a decimal string and convert to base units (BigInt)
    const parts = minRequired.split('.');
    const wholePart = parts[0] || '0';
    const decimalPart = (parts[1] || '').padEnd(decimals, '0').slice(0, decimals);
    
    const minRequiredBigInt = BigInt(wholePart + decimalPart);
    
    return rawBalance.value >= minRequiredBigInt;
  } catch (error) {
    console.error('Error in precise balance comparison:', error);
    return false;
  }
}

// CREATE Token balance functions
export async function getCREATEBalance(address: string): Promise<string> {
  const manager = initializeBaseAccount();
  
  try {
    // Ensure we're on Base network before fetching balance
    await ensureBaseNetwork(manager.provider);

    // Get token decimals first
    const decimals = await getTokenDecimals(manager.provider, CREATE_TOKEN_ADDRESS);
    
    // ERC-20 balanceOf function signature: 0x70a08231
    const addressWithoutPrefix = address.slice(2);
    const balanceOfCalldata = '0x70a08231' + addressWithoutPrefix.toLowerCase().padStart(64, '0');
    
    const result = await manager.provider.request({
      method: 'eth_call',
      params: [
        {
          to: CREATE_TOKEN_ADDRESS,
          data: balanceOfCalldata
        },
        'latest'
      ]
    });

    // Parse the result using BigInt to avoid precision loss
    const balanceWei = BigInt(result);
    
    // Handle edge case: decimals === 0 (no fractional part)
    if (decimals === 0) {
      return balanceWei.toLocaleString('en-US');
    }
    
    // Convert using BigInt division to maintain precision
    let divisor = BigInt(1);
    for (let i = 0; i < decimals; i++) {
      divisor = divisor * BigInt(10);
    }
    
    const balanceWhole = balanceWei / divisor;
    const balanceRemainder = balanceWei % divisor;
    
    // Format with decimals (show up to 2 decimal places)
    const remainderStr = balanceRemainder.toString().padStart(decimals, '0');
    const decimalPart = remainderStr.slice(0, Math.min(2, decimals));
    
    const wholeFormatted = balanceWhole.toLocaleString('en-US');
    
    // Only show decimal part if it's non-zero
    if (decimalPart && BigInt(decimalPart) > BigInt(0)) {
      return wholeFormatted + '.' + decimalPart;
    }
    
    return wholeFormatted;
  } catch (error) {
    console.error('Error fetching CREATE balance:', error);
    return '0';
  }
}

export async function getRawCREATEBalance(address: string): Promise<{ value: bigint, decimals: number } | null> {
  const manager = initializeBaseAccount();
  
  try {
    // Ensure we're on Base network before fetching balance
    await ensureBaseNetwork(manager.provider);

    // Get token decimals first
    const decimals = await getTokenDecimals(manager.provider, CREATE_TOKEN_ADDRESS);
    
    // ERC-20 balanceOf function call
    const addressWithoutPrefix = address.slice(2);
    const balanceOfCalldata = '0x70a08231' + addressWithoutPrefix.toLowerCase().padStart(64, '0');
    
    const result = await manager.provider.request({
      method: 'eth_call',
      params: [
        {
          to: CREATE_TOKEN_ADDRESS,
          data: balanceOfCalldata
        },
        'latest'
      ]
    });

    return {
      value: BigInt(result),
      decimals
    };
  } catch (error) {
    console.error('Error fetching raw CREATE balance:', error);
    return null;
  }
}

// Check if user has required balance of EITHER PSX or CREATE token
export async function hasRequiredTokenBalance(address: string, minRequired: string): Promise<{ hasAccess: boolean; psxBalance: string; createBalance: string }> {
  try {
    // Fetch both token balances in parallel
    const [psxBalance, createBalance] = await Promise.all([
      getPSXBalance(address),
      getCREATEBalance(address)
    ]);

    // User needs to hold at least the minimum of EITHER token
    const hasPSX = hasMinPSXBalance(psxBalance, minRequired);
    const hasCREATE = hasMinPSXBalance(createBalance, minRequired); // Reuse comparison logic

    return {
      hasAccess: hasPSX || hasCREATE,
      psxBalance,
      createBalance
    };
  } catch (error) {
    console.error('Error checking token balances:', error);
    return {
      hasAccess: false,
      psxBalance: '0',
      createBalance: '0'
    };
  }
}

export async function disconnectWallet() {
  try {
    if (accountManager && accountManager.provider) {
      // Remove all event listeners before clearing
      accountManager.provider.removeAllListeners();
    }
    
    // Clear local state and reset listener flag
    accountManager = null;
    eventListenersAttached = false;
  } catch (error) {
    console.error('Error disconnecting wallet:', error);
  }
}

export function formatAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
