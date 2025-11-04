import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { usePrivy } from "@privy-io/react-auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, ShoppingBag, Sparkles, CheckCircle } from "lucide-react";
import { DualPlatformOnboarding } from "@/components/DualPlatformOnboarding";

export function OnboardingRoleSelector() {
  const { address, isConnected } = useAccount();
  const { ready: privyReady, authenticated: privyAuthenticated, user: privyUser } = usePrivy();
  const [, setLocation] = useLocation();
  const [showModal, setShowModal] = useState(false);
  const [showDualPlatformModal, setShowDualPlatformModal] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const { data: builderData } = useQuery({
    queryKey: ['/api/builders/me'],
    enabled: isConnected && !!address,
    retry: false,
  });

  const { data: clientData } = useQuery({
    queryKey: ['/api/clients/me'],
    enabled: isConnected && !!address,
    retry: false,
  });

  useEffect(() => {
    if (privyReady && privyAuthenticated && !hasChecked) {
      const hasSocialLogin = privyUser?.google || privyUser?.twitter || privyUser?.discord || privyUser?.email;
      
      if (hasSocialLogin) {
        const timer = setTimeout(() => {
          const hasBuilderAccount = builderData && typeof builderData === 'object' && !('error' in builderData);
          const hasClientAccount = clientData && typeof clientData === 'object' && !('error' in clientData);

          if (!hasBuilderAccount && !hasClientAccount) {
            setHasChecked(true);
            setShowDualPlatformModal(true);
          }
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
    
    if (!isConnected || !address || hasChecked) {
      return;
    }

    const timer = setTimeout(() => {
      const hasBuilderAccount = builderData && typeof builderData === 'object' && !('error' in builderData);
      const hasClientAccount = clientData && typeof clientData === 'object' && !('error' in clientData);

      if (!hasBuilderAccount && !hasClientAccount) {
        setShowModal(true);
      }
      setHasChecked(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isConnected, address, builderData, clientData, hasChecked, privyReady, privyAuthenticated, privyUser]);

  useEffect(() => {
    if (!isConnected && !privyAuthenticated) {
      setHasChecked(false);
      setShowModal(false);
    }
  }, [isConnected, privyAuthenticated]);

  const handleRoleSelection = (role: 'builder' | 'client') => {
    setShowModal(false);
    if (role === 'builder') {
      setLocation('/builder-onboarding');
    } else {
      setLocation('/become-client');
    }
  };

  const handleDualPlatformComplete = (data: any) => {
    setShowDualPlatformModal(false);
    
    if (data?.accounts?.port444) {
      setLocation('/builder-dashboard');
    } else {
      setLocation('/');
    }
  };

  return (
    <>
    <Dialog open={showDualPlatformModal} onOpenChange={setShowDualPlatformModal}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        <DualPlatformOnboarding onComplete={handleDualPlatformComplete} />
      </DialogContent>
    </Dialog>
    
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Welcome to port444!
          </DialogTitle>
          <DialogDescription className="text-base">
            Tell us about yourself so we can personalize your experience
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Card 
            className="cursor-pointer hover-elevate active-elevate-2 transition-all border-2 hover:border-primary"
            onClick={() => handleRoleSelection('builder')}
            data-testid="card-role-builder"
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">I'm a Builder</CardTitle>
              <CardDescription>
                Offer your services and get hired by clients in the Web3 space
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                <span>Create your professional profile</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                <span>List your services and set your rates</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                <span>Earn $CREATE and $PSX token benefits</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                <span>Receive milestone-based USDC payments</span>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover-elevate active-elevate-2 transition-all border-2 hover:border-primary"
            onClick={() => handleRoleSelection('client')}
            data-testid="card-role-client"
          >
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-chart-4/10 flex items-center justify-center mb-2">
                <ShoppingBag className="w-6 h-6 text-chart-4" />
              </div>
              <CardTitle className="text-xl">I'm a Client</CardTitle>
              <CardDescription>
                Find and hire top Web3 builders for your projects
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                <span>Browse vetted builder profiles</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                <span>AI-powered builder matching</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                <span>Save with token holder discounts</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                <span>Secure escrow payments on Base</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-2">
          You can always switch roles later in your account settings
        </p>
      </DialogContent>
    </Dialog>
    </>
  );
}
