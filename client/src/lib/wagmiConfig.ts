import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import {
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

// Get environment variables
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'default-project-id';
export const privyAppId = import.meta.env.VITE_PRIVY_APP_ID || '';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Popular',
      wallets: [
        metaMaskWallet,
        coinbaseWallet,
        rainbowWallet,
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: 'port444',
    projectId: walletConnectProjectId,
  }
);

export const config = createConfig({
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  connectors,
  ssr: false,
});
