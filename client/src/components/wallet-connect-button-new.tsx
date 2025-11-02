import { useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContracts } from 'wagmi';
import { usePrivy } from '@privy-io/react-auth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { erc20Abi } from 'viem';
import { FaGoogle, FaTwitter, FaDiscord } from 'react-icons/fa';
import { Mail, Wallet } from 'lucide-react';

// Token contract addresses
const PSX_TOKEN_ADDRESS = import.meta.env.VITE_PSX_TOKEN_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000' as `0x${string}`;
const CREATE_TOKEN_ADDRESS = '0x3849cC93e7B71b37885237cd91a215974135cD8D' as `0x${string}`;

export function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { ready: privyReady, authenticated: privyAuthenticated, login: privyLogin } = usePrivy();
  const [showAccountModal, setShowAccountModal] = useState(false);

  // Fetch both token balances in parallel
  const { data: tokenData } = useReadContracts({
    contracts: [
      {
        address: PSX_TOKEN_ADDRESS,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
      },
      {
        address: CREATE_TOKEN_ADDRESS,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
      },
    ],
  });

  const psxBalance = tokenData?.[0]?.result;
  const createBalance = tokenData?.[1]?.result;

  // Format token balances
  const formatBalance = (balance: bigint | undefined): string => {
    if (!balance) return '0';
    return (Number(balance) / 1e18).toFixed(2);
  };

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected && !privyAuthenticated) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover-elevate active-elevate-2 h-9 px-4 py-2"
                    data-testid="button-create-account"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <line x1="19" y1="8" x2="19" y2="14" />
                      <line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                    Create Account
                  </button>
                );
              }

              if (chain?.unsupported) {
                return (
                  <button 
                    onClick={openChainModal} 
                    type="button"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground shadow-sm hover-elevate active-elevate-2 h-9 px-4 py-2"
                  >
                    Wrong network
                  </button>
                );
              }

              const hasCreateTokens = createBalance !== undefined && Number(createBalance) > 0;
              const hasPsxTokens = psxBalance !== undefined && Number(psxBalance) > 0;
              
              return (
                <div className="flex items-center gap-2">
                  {hasCreateTokens ? (
                    <Badge variant="secondary" className="px-3 py-1.5 font-mono">
                      <span className="text-chart-2 font-semibold">{formatBalance(createBalance)}</span>
                      <span className="ml-1 text-muted-foreground">$CREATE</span>
                    </Badge>
                  ) : null}
                  {hasPsxTokens ? (
                    <Badge variant="secondary" className="px-3 py-1.5 font-mono">
                      <span className="text-chart-4 font-semibold">{formatBalance(psxBalance)}</span>
                      <span className="ml-1 text-muted-foreground">$PSX</span>
                    </Badge>
                  ) : null}

                  <button
                    onClick={openChainModal}
                    type="button"
                    className="inline-flex items-center gap-2 h-9 px-3 rounded-md text-sm font-medium border border-input bg-background hover-elevate active-elevate-2"
                  >
                    {chain?.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: 'hidden',
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 16, height: 16 }}
                          />
                        )}
                      </div>
                    )}
                    <span className="hidden md:inline">{chain?.name}</span>
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="inline-flex items-center gap-2 h-9 px-3 rounded-md text-sm font-medium border border-input bg-background hover-elevate active-elevate-2"
                    data-testid="button-wallet-disconnect"
                  >
                    <div className="h-2 w-2 rounded-full bg-chart-3"></div>
                    <span className="hidden md:inline font-mono text-xs">
                      {account?.displayName}
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-chart-3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
