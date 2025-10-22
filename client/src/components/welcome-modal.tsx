import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  Sparkles, Users, Shield, DollarSign, MessageCircle, TrendingUp, 
  X, ChevronRight, CheckCircle
} from "lucide-react";

interface WelcomeModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function WelcomeModal({ open: controlledOpen, onOpenChange }: WelcomeModalProps) {
  const [step, setStep] = useState(0);
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  useEffect(() => {
    // Check if user has seen the welcome modal before
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcome");
    if (!hasSeenWelcome && controlledOpen === undefined) {
      // Only auto-show if not controlled
      setInternalOpen(true);
    }
  }, [controlledOpen]);

  const handleClose = (open: boolean) => {
    if (!open) {
      localStorage.setItem("hasSeenWelcome", "true");
      setStep(0);
    }
    setIsOpen(open);
  };

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      handleClose(false);
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const steps = [
    {
      title: "Welcome to Create.psx",
      description: "The premier Web3 marketplace connecting top builders with quality clients",
      icon: <Sparkles className="h-12 w-12 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <p className="text-muted-foreground text-center">
            Create.psx is a dual token-gated marketplace where premium Web3 builders and clients collaborate on cutting-edge crypto projects.
          </p>
          <div className="grid gap-4 mt-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Token-Gated Access</p>
                <p className="text-sm text-muted-foreground">Hold $CREATE or $PSX tokens to access premium features</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Secure Payments</p>
                <p className="text-sm text-muted-foreground">USDC payments with smart contract escrow protection</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Quality Community</p>
                <p className="text-sm text-muted-foreground">Vetted builders and verified clients only</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "For Clients",
      description: "Find and hire top Web3 talent for your project",
      icon: <Users className="h-12 w-12 text-cyan-500" />,
      content: (
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border-cyan-500/20">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-cyan-500 mt-0.5" />
                <div>
                  <p className="font-medium">Browse Verified Builders</p>
                  <p className="text-sm text-muted-foreground">Access our curated directory of skilled Web3 professionals</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-cyan-500 mt-0.5" />
                <div>
                  <p className="font-medium">Milestone-Based Payments</p>
                  <p className="text-sm text-muted-foreground">Pay securely through escrow as work progresses</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-cyan-500 mt-0.5" />
                <div>
                  <p className="font-medium">Direct Communication</p>
                  <p className="text-sm text-muted-foreground">Real-time messaging with builders throughout your project</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="text-center pt-2">
            <Link href="/marketplace">
              <Button variant="outline" className="gap-2" data-testid="button-browse-marketplace-modal">
                Browse Marketplace
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      ),
    },
    {
      title: "For Builders",
      description: "Showcase your skills and earn with Web3 projects",
      icon: <TrendingUp className="h-12 w-12 text-purple-500" />,
      content: (
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border-purple-500/20">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium">Create Your Profile</p>
                  <p className="text-sm text-muted-foreground">Showcase your portfolio, skills, and previous work</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium">Set Your Own Rates</p>
                  <p className="text-sm text-muted-foreground">Control your pricing and only pay a 2.5% platform fee</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium">Guaranteed Payments</p>
                  <p className="text-sm text-muted-foreground">Escrow protection ensures you get paid for completed work</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="text-center pt-2">
            <Link href="/builders">
              <Button variant="outline" className="gap-2" data-testid="button-learn-more-modal">
                Learn More
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      ),
    },
    {
      title: "Ready to Get Started?",
      description: "Choose your path and join the Create.psx community",
      icon: <CheckCircle className="h-12 w-12 text-green-500" />,
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/become-client">
              <Card className="hover-elevate cursor-pointer h-full transition-all">
                <CardContent className="p-6 text-center space-y-3">
                  <Users className="h-10 w-10 text-cyan-500 mx-auto" />
                  <div>
                    <p className="font-bold text-lg">I'm a Client</p>
                    <p className="text-sm text-muted-foreground">I need to hire Web3 talent</p>
                  </div>
                  <Button className="w-full" data-testid="button-client-path-modal">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </Link>
            <Link href="/builders">
              <Card className="hover-elevate cursor-pointer h-full transition-all">
                <CardContent className="p-6 text-center space-y-3">
                  <TrendingUp className="h-10 w-10 text-purple-500 mx-auto" />
                  <div>
                    <p className="font-bold text-lg">I'm a Builder</p>
                    <p className="text-sm text-muted-foreground">I want to earn with my skills</p>
                  </div>
                  <Button className="w-full" data-testid="button-builder-path-modal">
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </div>
          <div className="text-center">
            <Link href="/how-it-works">
              <Button variant="ghost" className="gap-2" data-testid="button-learn-how-modal">
                Learn How It Works
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      ),
    },
  ];

  const currentStep = steps[step];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl" data-testid="dialog-welcome-modal">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4"
          onClick={() => handleClose(false)}
          data-testid="button-close-modal"
        >
          <X className="h-4 w-4" />
        </Button>

        <DialogHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            {currentStep.icon}
          </div>
          <DialogTitle className="text-2xl">{currentStep.title}</DialogTitle>
          <DialogDescription className="text-base">
            {currentStep.description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">{currentStep.content}</div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-2">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 w-2 rounded-full transition-all ${
                  idx === step
                    ? "bg-primary w-6"
                    : idx < step
                    ? "bg-primary/60"
                    : "bg-muted"
                }`}
                data-testid={`indicator-step-${idx}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <Button
                variant="ghost"
                onClick={handlePrevious}
                data-testid="button-previous-modal"
              >
                Previous
              </Button>
            )}
            <Button
              onClick={handleNext}
              data-testid="button-next-modal"
            >
              {step === steps.length - 1 ? "Get Started" : "Next"}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
