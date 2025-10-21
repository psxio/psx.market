import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Check, Circle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function WalletConnectButton() {
  const [isConnected, setIsConnected] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [psxBalance, setPsxBalance] = useState<string | null>(null);

  const handleConnect = () => {
    setShowDialog(true);
    setTimeout(() => {
      setIsConnected(true);
      setPsxBalance("10,000");
      setShowDialog(false);
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setPsxBalance(null);
  };

  if (isConnected && psxBalance) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="secondary" className="px-3 py-1.5 font-mono">
          <span className="text-chart-4 font-semibold">{psxBalance}</span>
          <span className="ml-1 text-muted-foreground">$PSX</span>
        </Badge>
        <Button
          variant="outline"
          size="default"
          onClick={handleDisconnect}
          className="gap-2"
          data-testid="button-wallet-disconnect"
        >
          <Circle className="h-4 w-4 fill-primary text-primary" />
          <span className="hidden md:inline font-mono text-xs">
            {`${isConnected ? "0x742d...9a3f" : ""}`}
          </span>
          <Check className="h-4 w-4 text-chart-3" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={handleConnect}
        variant="default"
        size="default"
        className="gap-2"
        data-testid="button-wallet-connect"
      >
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent data-testid="dialog-wallet-connect">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Circle className="h-5 w-5 fill-primary text-primary" />
              Connect to Base Network
            </DialogTitle>
            <DialogDescription>
              Connecting your wallet to access the PSX Marketplace. Please approve
              the connection in your wallet.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
