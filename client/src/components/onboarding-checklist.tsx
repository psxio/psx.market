import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, ArrowRight, User, Package, Image, DollarSign, Shield, ChevronUp, ChevronDown, Sparkles, type LucideIcon } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: LucideIcon;
  action?: {
    label: string;
    href: string;
  };
}

interface OnboardingChecklistProps {
  builderId: string;
  onboardingData?: {
    stepProfileComplete: boolean;
    stepServicesAdded: boolean;
    stepPortfolioAdded: boolean;
    stepPaymentSetup: boolean;
    stepVerificationComplete: boolean;
    completionPercentage: number;
    isComplete: boolean;
  };
}

export function OnboardingChecklist({ builderId, onboardingData }: OnboardingChecklistProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!onboardingData) {
    return null;
  }

  const { isComplete, completionPercentage } = onboardingData;

  const steps: OnboardingStep[] = [
    {
      id: "profile",
      title: "Complete Your Profile",
      description: "Add your bio, headline, skills, and profile image",
      icon: User,
      completed: onboardingData.stepProfileComplete,
      action: {
        label: "Edit Profile",
        href: `/builder/${builderId}/edit-profile`
      }
    },
    {
      id: "services",
      title: "Add Your First Service",
      description: "Create at least one service listing with pricing",
      icon: Package,
      completed: onboardingData.stepServicesAdded,
      action: {
        label: "Create Service",
        href: `/builder/${builderId}/create-service`
      }
    },
    {
      id: "portfolio",
      title: "Showcase Your Portfolio",
      description: "Add portfolio links or previous project examples",
      icon: Image,
      completed: onboardingData.stepPortfolioAdded,
      action: {
        label: "Add Portfolio",
        href: `/builder/${builderId}/edit-profile`
      }
    },
    {
      id: "payment",
      title: "Set Up Payment",
      description: "Connect your wallet to receive USDC payments",
      icon: DollarSign,
      completed: onboardingData.stepPaymentSetup,
      action: {
        label: "Setup Payment",
        href: `/builder/${builderId}/payment-settings`
      }
    },
    {
      id: "verification",
      title: "Complete Verification",
      description: "Verify your social accounts or GitHub profile",
      icon: Shield,
      completed: onboardingData.stepVerificationComplete,
      action: {
        label: "Verify Account",
        href: `/builder/${builderId}/verification`
      }
    }
  ];

  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;

  return (
    <Card className="border-primary/20" data-testid="card-onboarding-checklist">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">
                {isComplete ? "Onboarding Complete!" : "Complete Your Profile"}
              </CardTitle>
              {isComplete && (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Done
                </Badge>
              )}
            </div>
            <CardDescription>
              {isComplete
                ? "You've completed all onboarding steps. You're ready to win clients!"
                : `${completedSteps} of ${totalSteps} steps completed`}
            </CardDescription>
            <div className="space-y-2">
              <Progress value={completionPercentage} className="h-2" data-testid="progress-onboarding" />
              <p className="text-xs text-muted-foreground font-medium">
                {completionPercentage}% Complete
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            data-testid="button-toggle-checklist"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                step.completed
                  ? "bg-green-500/5 border-green-500/20"
                  : "bg-muted/30 border-muted hover-elevate"
              }`}
              data-testid={`checklist-item-${step.id}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {step.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" data-testid={`icon-completed-${step.id}`} />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" data-testid={`icon-pending-${step.id}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <step.icon className="h-4 w-4 text-muted-foreground" />
                      <p className={`font-medium text-sm ${step.completed ? "text-muted-foreground" : ""}`}>
                        {step.title}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                  {!step.completed && step.action && (
                    <Link href={step.action.href}>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-1 flex-shrink-0"
                        data-testid={`button-action-${step.id}`}
                      >
                        {step.action.label}
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}

          {!isComplete && (
            <div className="pt-3 mt-3 border-t">
              <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Sparkles className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">Why Complete Your Profile?</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Complete profiles get 5x more client inquiries</li>
                    <li>• Higher search rankings in marketplace</li>
                    <li>• Builds trust and credibility with clients</li>
                    <li>• Unlock featured builder placement</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {isComplete && (
            <div className="pt-3 mt-3 border-t">
              <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-foreground mb-1">You're All Set!</p>
                  <p className="text-xs text-muted-foreground">
                    Your profile is complete and optimized. Clients can now discover you in the marketplace and send project inquiries.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
