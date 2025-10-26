import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  Shield, 
  Heart, 
  MessageCircle, 
  Bell, 
  Gift,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from "lucide-react";

interface WhyConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect?: () => void;
}

export function WhyConnectWalletModal({ isOpen, onClose, onConnect }: WhyConnectWalletModalProps) {
  const handleConnect = () => {
    if (onConnect) {
      onConnect();
    } else {
      const connectButton = document.querySelector('[data-testid="button-connect-wallet"]') as HTMLButtonElement;
      if (connectButton) {
        connectButton.click();
      }
    }
    onClose();
  };

  const features = [
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Book services and pay with USDC through smart contract escrow for guaranteed protection",
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      icon: Heart,
      title: "Save Favorites",
      description: "Bookmark your favorite builders and services for quick access later",
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      icon: MessageCircle,
      title: "Direct Messaging",
      description: "Chat with builders, discuss projects, negotiate terms, and get quotes",
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Get instant updates on orders, messages, and project milestones",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Gift,
      title: "Token Holder Benefits",
      description: "Hold $CREATE or $PSX for 60% fee discount, priority support, and exclusive perks",
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="modal-why-connect-wallet">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-chart-2/20 border border-primary/30">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Why Connect Your Wallet?</DialogTitle>
              <DialogDescription>
                Unlock the full power of port444 marketplace
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Key Features */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              What You'll Get
            </h3>
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg border hover-elevate"
                data-testid={`feature-${index}`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${feature.bgColor}`}>
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold mb-1">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Security & Privacy */}
          <div className="rounded-lg border-2 border-chart-4/30 bg-gradient-to-r from-chart-4/10 to-transparent p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-chart-4" />
              <h3 className="font-semibold">Safe & Secure</h3>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-chart-4 shrink-0 mt-0.5" />
                <span>We never ask for your private keys or seed phrase</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-chart-4 shrink-0 mt-0.5" />
                <span>Your wallet is only used for authentication and payments you approve</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-chart-4 shrink-0 mt-0.5" />
                <span>All payments are protected by smart contract escrow on Base blockchain</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-chart-4 shrink-0 mt-0.5" />
                <span>You maintain full control and can disconnect anytime</span>
              </li>
            </ul>
          </div>

          {/* Token Benefits Highlight */}
          <div className="rounded-lg border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-chart-2/10 to-background p-4">
            <div className="flex items-center gap-2 mb-3">
              <Gift className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Bonus: Token Holder Perks</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              If you hold $CREATE or $PSX tokens, you automatically get:
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="default" className="shrink-0">60% off</Badge>
                <span>Platform fees (1% vs 2.5%)</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="default" className="shrink-0">2x faster</Badge>
                <span>Priority support</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="default" className="shrink-0">VIP</Badge>
                <span>Exclusive badge</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="default" className="shrink-0">Early</Badge>
                <span>Beta features access</span>
              </div>
            </div>
          </div>

          {/* No Wallet? */}
          <div className="rounded-lg border bg-card/50 p-4">
            <h3 className="font-semibold mb-2 text-sm">Don't have a wallet?</h3>
            <p className="text-sm text-muted-foreground mb-3">
              No problem! We recommend MetaMask or Rainbow Wallet for beginners.
            </p>
            <div className="flex flex-wrap gap-2">
              <a href="https://metamask.io/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2 hover-elevate" data-testid="button-get-metamask">
                  <ExternalLink className="h-3 w-3" />
                  Get MetaMask
                </Button>
              </a>
              <a href="https://rainbow.me/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" className="gap-2 hover-elevate" data-testid="button-get-rainbow">
                  <ExternalLink className="h-3 w-3" />
                  Get Rainbow
                </Button>
              </a>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              variant="default" 
              size="lg" 
              className="flex-1 gap-2" 
              onClick={handleConnect}
              data-testid="button-modal-connect"
            >
              <Wallet className="h-4 w-4" />
              Connect Wallet Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={onClose}
              className="hover-elevate"
              data-testid="button-modal-close"
            >
              Maybe Later
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            You can still browse services and builders without connecting. Some features will be limited.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
