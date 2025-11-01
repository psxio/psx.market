import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { toPrivyWallet } from '@privy-io/cross-app-connect/rainbow-kit';
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
      groupName: 'Social Login',
      wallets: [
        toPrivyWallet({
          id: privyAppId,
          name: 'Google / Email',
          iconUrl: 'https://www.google.com/favicon.ico',
        }),
      ],
    },
    {
      groupName: 'Popular',
      wallets: [
        rainbowWallet,
        metaMaskWallet,
        coinbaseWallet,
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
