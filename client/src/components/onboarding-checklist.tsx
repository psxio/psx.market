import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
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
  if (!onboardingData) {
    return null;
  }

  const { isComplete, completionPercentage } = onboardingData;

  const steps: OnboardingStep[] = [
    {
      id: "profile",
      title: "Complete Your Profile",
      description: "Add your bio, headline, skills, and profile image",
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
      completed: onboardingData.stepVerificationComplete,
      action: {
        label: "Verify Account",
        href: `/builder/${builderId}/verification`
      }
    }
  ];

  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;

  if (isComplete) {
    return null;
  }

  return (
    <Card className="border-primary/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span>Complete Your Onboarding</span>
              <Badge variant="secondary">{completedSteps}/{totalSteps}</Badge>
            </CardTitle>
            <CardDescription>
              Set up your builder profile to start receiving orders
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        <div className="space-y-3">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                step.completed 
                  ? 'bg-muted/30 border-muted' 
                  : 'bg-background border-border'
              }`}
            >
              <div className="mt-0.5">
                {step.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-chart-3" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1 space-y-1">
                <h4 className={`font-medium ${step.completed ? 'text-muted-foreground line-through' : ''}`}>
                  {step.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>

              {!step.completed && step.action && (
                <Link href={step.action.href}>
                  <Button variant="ghost" size="sm" className="gap-1">
                    {step.action.label}
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>

        {completedSteps >= 3 && completedSteps < totalSteps && (
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm">
              <strong>Almost there!</strong> Complete the remaining {totalSteps - completedSteps} step{totalSteps - completedSteps > 1 ? 's' : ''} to unlock full platform features.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Badge({ variant, children }: { variant: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium">
      {children}
    </span>
  );
}
