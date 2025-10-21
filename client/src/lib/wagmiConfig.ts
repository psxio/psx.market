import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';

// Get environment variables
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'default-project-id';

export const config = getDefaultConfig({
  appName: 'Create.psx',
  projectId: walletConnectProjectId,
  chains: [base, baseSepolia],
  ssr: false,
});
