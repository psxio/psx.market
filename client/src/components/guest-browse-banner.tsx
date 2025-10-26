import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Wallet, Gift, Sparkles } from "lucide-react";
import { useAccount } from "wagmi";

export function GuestBrowseBanner() {
  const { isConnected } = useAccount();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("guest-banner-dismissed");
    if (!isConnected && !dismissed) {
      setTimeout(() => setIsVisible(true), 2000);
    }
  }, [isConnected]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    localStorage.setItem("guest-banner-dismissed", "true");
  };

  const handleConnectWallet = () => {
    const connectButton = document.querySelector('[data-testid="button-connect-wallet"]') as HTMLButtonElement;
    if (connectButton) {
      connectButton.click();
    }
  };

  if (isConnected || isDismissed || !isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in slide-in-from-bottom duration-500"
      data-testid="banner-guest-browse"
    >
      <Card className="border-2 border-primary/50 bg-gradient-to-r from-primary/20 via-chart-2/20 to-background backdrop-blur-sm shadow-lg">
        <div className="p-4 md:p-5">
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 rounded-lg hover-elevate"
            data-testid="button-dismiss-banner"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20 border border-primary/30">
              <Wallet className="h-6 w-6 text-primary" />
            </div>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold">You're Browsing as a Guest</h3>
                <Badge variant="secondary" className="gap-1 text-xs">
                  <Sparkles className="h-3 w-3" />
                  Limited Features
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Connect your wallet to save favorites, message builders, book services, and unlock token holder benefits
              </p>
            </div>

            <Button 
              variant="default" 
              className="gap-2 shrink-0"
              onClick={handleConnectWallet}
              data-testid="button-banner-connect"
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Connect Wallet</span>
              <span className="sm:hidden">Connect</span>
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground border-t pt-3">
            <div className="flex items-center gap-1.5">
              <Gift className="h-3 w-3 text-chart-3" />
              <span>Hold $CREATE or $PSX for 60% fee discount</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary" />
              <span>Save favorites & get notifications</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
