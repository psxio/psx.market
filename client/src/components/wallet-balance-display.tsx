import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getPSXBalance, getCREATEBalance, getUSDCBalance } from "@/lib/baseAccount";
import { Wallet, TrendingUp, DollarSign } from "lucide-react";

interface WalletBalanceDisplayProps {
  address: string;
  variant?: "card" | "inline" | "compact";
}

export function WalletBalanceDisplay({ address, variant = "card" }: WalletBalanceDisplayProps) {
  const [psxBalance, setPsxBalance] = useState<string | null>(null);
  const [createBalance, setCreateBalance] = useState<string | null>(null);
  const [usdcBalance, setUsdcBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!address) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const [psx, create, usdc] = await Promise.all([
          getPSXBalance(address),
          getCREATEBalance(address),
          getUSDCBalance(address)
        ]);
        
        setPsxBalance(psx);
        setCreateBalance(create);
        setUsdcBalance(usdc);
      } catch (error) {
        console.error("Error fetching balances:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalances();
  }, [address]);

  if (variant === "inline") {
    return (
      <div className="flex flex-wrap items-center gap-3" data-testid="wallet-balances-inline">
        {isLoading ? (
          <>
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-24" />
          </>
        ) : (
          <>
            <Badge variant="outline" className="gap-1.5" data-testid="balance-psx">
              <TrendingUp className="h-3 w-3" />
              <span className="font-mono">{psxBalance} PSX</span>
            </Badge>
            <Badge variant="outline" className="gap-1.5" data-testid="balance-create">
              <TrendingUp className="h-3 w-3" />
              <span className="font-mono">{createBalance} CREATE</span>
            </Badge>
            <Badge variant="outline" className="gap-1.5" data-testid="balance-usdc">
              <DollarSign className="h-3 w-3" />
              <span className="font-mono">{usdcBalance} USDC</span>
            </Badge>
          </>
        )}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="space-y-2" data-testid="wallet-balances-compact">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">PSX:</span>
          {isLoading ? (
            <Skeleton className="h-4 w-20" />
          ) : (
            <span className="font-mono font-medium" data-testid="balance-psx">{psxBalance}</span>
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">CREATE:</span>
          {isLoading ? (
            <Skeleton className="h-4 w-20" />
          ) : (
            <span className="font-mono font-medium" data-testid="balance-create">{createBalance}</span>
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">USDC:</span>
          {isLoading ? (
            <Skeleton className="h-4 w-20" />
          ) : (
            <span className="font-mono font-medium" data-testid="balance-usdc">{usdcBalance}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <Card data-testid="wallet-balances-card">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-3">
        <CardTitle className="text-sm font-medium">Wallet Balances</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-chart-1" />
            <span className="text-sm text-muted-foreground">PSX</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-5 w-24" />
          ) : (
            <span className="text-lg font-bold font-mono" data-testid="balance-psx">
              {psxBalance}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-chart-2" />
            <span className="text-sm text-muted-foreground">CREATE</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-5 w-24" />
          ) : (
            <span className="text-lg font-bold font-mono" data-testid="balance-create">
              {createBalance}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-chart-3" />
            <span className="text-sm text-muted-foreground">USDC</span>
          </div>
          {isLoading ? (
            <Skeleton className="h-5 w-24" />
          ) : (
            <span className="text-lg font-bold font-mono" data-testid="balance-usdc">
              {usdcBalance}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
