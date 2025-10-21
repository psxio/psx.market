import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useClientAuth } from "@/hooks/use-client-auth";
import { connectWallet, getCurrentAccount, formatAddress } from "@/lib/baseAccount";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/header";
import { UserPlus, Wallet, CheckCircle2 } from "lucide-react";

export default function BecomeClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [bio, setBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  
  const { register, isAuthenticated } = useClientAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    const account = await getCurrentAccount();
    if (account?.address) {
      setWalletAddress(account.address);
      setIsConnected(true);
    }
  };

  const handleConnectWallet = async () => {
    try {
      const account = await connectWallet();
      if (account?.address) {
        setWalletAddress(account.address);
        setIsConnected(true);
        toast({
          title: "Wallet connected",
          description: formatAddress(account.address),
        });
      }
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !walletAddress) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    if (!name || !email) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        walletAddress,
        name,
        email,
        companyName: companyName || undefined,
        bio: bio || undefined,
        psxTier: "bronze",
      });

      toast({
        title: "Registration successful!",
        description: "Welcome to PSX Marketplace",
      });

      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-3xl px-4 py-12 md:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Become a Client
          </h1>
          <p className="mt-2 text-muted-foreground">
            Join PSX Marketplace to hire premium Web3 builders
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Client Registration</CardTitle>
            <CardDescription>
              Fill in your information to create your client account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="wallet">Wallet Address *</Label>
                  {!isConnected ? (
                    <Button
                      type="button"
                      onClick={handleConnectWallet}
                      variant="outline"
                      className="w-full gap-2"
                      data-testid="button-connect-wallet"
                    >
                      <Wallet className="h-4 w-4" />
                      Connect Wallet
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2 rounded-md border bg-muted p-3">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="font-mono text-sm">{formatAddress(walletAddress)}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    data-testid="input-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name (Optional)</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Corp"
                    data-testid="input-company"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio (Optional)</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself and your project..."
                    rows={4}
                    data-testid="input-bio"
                  />
                </div>
              </div>

              <div className="rounded-lg border bg-muted/50 p-4">
                <h3 className="mb-2 font-semibold text-sm">Token Gating</h3>
                <p className="text-sm text-muted-foreground">
                  Your wallet must hold $PSX tokens to access premium services. Higher
                  PSX holdings unlock better tiers and exclusive features.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={!isConnected || isSubmitting}
                data-testid="button-submit"
              >
                {isSubmitting ? "Creating Account..." : "Create Client Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
