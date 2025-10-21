import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import {
  connectWallet,
  getCurrentAccount,
  getPSXBalance,
  formatAddress,
  disconnectWallet,
} from "@/lib/baseAccount";

export function WalletConnectButton() {
  const [isConnected, setIsConnected] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [psxBalance, setPsxBalance] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  // Check for existing connection on mount
  useEffect(() => {
    checkExistingConnection();
    
    // Listen for wallet events
    const handleDisconnect = () => {
      setIsConnected(false);
      setPsxBalance(null);
      setWalletAddress("");
    };
    
    const handleAccountChanged = (event: any) => {
      const newAddress = event.detail.address;
      setWalletAddress(newAddress);
      // Refresh PSX balance for new account
      getPSXBalance(newAddress).then(setPsxBalance);
    };
    
    window.addEventListener('wallet-disconnected', handleDisconnect);
    window.addEventListener('wallet-account-changed', handleAccountChanged as EventListener);
    
    return () => {
      window.removeEventListener('wallet-disconnected', handleDisconnect);
      window.removeEventListener('wallet-account-changed', handleAccountChanged as EventListener);
    };
  }, []);

  const checkExistingConnection = async () => {
    try {
      const account = await getCurrentAccount();
      if (account?.address) {
        setWalletAddress(account.address);
        setIsConnected(true);
        
        // Fetch PSX balance (getPSXBalance will handle chain verification internally)
        try {
          const balance = await getPSXBalance(account.address);
          setPsxBalance(balance);
        } catch (balanceError: any) {
          console.error('Error fetching balance on existing connection:', balanceError);
          // Show toast if wrong network or other issue
          if (balanceError.message?.includes('switch to Base network')) {
            toast({
              title: "Wrong Network",
              description: "Please switch to Base network to view your PSX balance",
              variant: "destructive",
            });
          }
          setPsxBalance('0');
        }
      }
    } catch (error) {
      console.error('Error checking existing connection:', error);
    }
  };

  const handleConnect = async () => {
    setShowDialog(true);
    setIsConnecting(true);

    try {
      // Connect to Base wallet
      const address = await connectWallet();
      setWalletAddress(address);
      
      // Fetch PSX balance
      const balance = await getPSXBalance(address);
      setPsxBalance(balance);
      
      setIsConnected(true);
      setShowDialog(false);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${formatAddress(address)} on Base network`,
      });
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      setShowDialog(false);
      
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      setIsConnected(false);
      setPsxBalance(null);
      setWalletAddress("");
      
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected",
      });
    } catch (error) {
      console.error('Disconnect error:', error);
    }
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
            {formatAddress(walletAddress)}
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
        disabled={isConnecting}
        data-testid="button-wallet-connect"
      >
        <Wallet className="h-4 w-4" />
        {isConnecting ? "Connecting..." : "Connect Wallet"}
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
              the connection in your wallet extension or app.
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
