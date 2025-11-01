import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';

// Get environment variables
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'default-project-id';
export const privyAppId = import.meta.env.VITE_PRIVY_APP_ID || '';

export const config = getDefaultConfig({
  appName: 'port444',
  projectId: walletConnectProjectId,
  chains: [base, baseSepolia],
  ssr: false,
});
