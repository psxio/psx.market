import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance, useReadContracts } from 'wagmi';
import { Badge } from '@/components/ui/badge';
import { erc20Abi } from 'viem';

// Token contract addresses
const PSX_TOKEN_ADDRESS = import.meta.env.VITE_PSX_TOKEN_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000' as `0x${string}`;
const CREATE_TOKEN_ADDRESS = '0x3849cC93e7B71b37885237cd91a215974135cD8D' as `0x${string}`;

export function WalletConnectButton() {
  const { address, isConnected } = useAccount();

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
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover-elevate active-elevate-2 h-9 px-4 py-2"
                    data-testid="button-wallet-connect"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
                      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
                    </svg>
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
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

              return (
                <div className="flex items-center gap-2">
                  {createBalance && Number(createBalance) > 0 && (
                    <Badge variant="secondary" className="px-3 py-1.5 font-mono">
                      <span className="text-chart-2 font-semibold">{formatBalance(createBalance)}</span>
                      <span className="ml-1 text-muted-foreground">$CREATE</span>
                    </Badge>
                  )}
                  {psxBalance && Number(psxBalance) > 0 && (
                    <Badge variant="secondary" className="px-3 py-1.5 font-mono">
                      <span className="text-chart-4 font-semibold">{formatBalance(psxBalance)}</span>
                      <span className="ml-1 text-muted-foreground">$PSX</span>
                    </Badge>
                  )}

                  <button
                    onClick={openChainModal}
                    type="button"
                    className="inline-flex items-center gap-2 h-9 px-3 rounded-md text-sm font-medium border border-input bg-background hover-elevate active-elevate-2"
                  >
                    {chain.hasIcon && (
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
                    <span className="hidden md:inline">{chain.name}</span>
                  </button>

                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="inline-flex items-center gap-2 h-9 px-3 rounded-md text-sm font-medium border border-input bg-background hover-elevate active-elevate-2"
                    data-testid="button-wallet-disconnect"
                  >
                    <div className="h-2 w-2 rounded-full bg-chart-3"></div>
                    <span className="hidden md:inline font-mono text-xs">
                      {account.displayName}
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
