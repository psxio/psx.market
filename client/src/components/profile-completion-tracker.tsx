import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface ProfileCompletionTrackerProps {
  builder: any;
}

interface CompletionItem {
  id: string;
  label: string;
  isComplete: boolean;
  weight: number;
  editPath?: string;
}

export function ProfileCompletionTracker({ builder }: ProfileCompletionTrackerProps) {
  const items: CompletionItem[] = [
    {
      id: "basic-info",
      label: "Basic Info (Name, Headline, Bio)",
      isComplete: !!(builder.name && builder.headline && builder.bio),
      weight: 15,
      editPath: "/builder/profile/edit",
    },
    {
      id: "profile-image",
      label: "Profile Image",
      isComplete: !!builder.profileImage,
      weight: 10,
      editPath: "/builder/profile/edit",
    },
    {
      id: "portfolio",
      label: "Portfolio Media (At least 3 items)",
      isComplete: builder.portfolioMedia && builder.portfolioMedia.length >= 3,
      weight: 20,
      editPath: "/builder/profile/edit",
    },
    {
      id: "service",
      label: "Create Your First Service",
      isComplete: builder.hasServices,
      weight: 25,
      editPath: "/Dashboard?tab=services",
    },
    {
      id: "skills",
      label: "Add Skills & Specializations",
      isComplete: builder.skills && builder.skills.length > 0,
      weight: 10,
      editPath: "/builder/profile/edit",
    },
    {
      id: "languages",
      label: "Languages Spoken",
      isComplete: builder.languages && builder.languages.length > 0,
      weight: 5,
      editPath: "/builder/profile/edit",
    },
    {
      id: "timezone",
      label: "Location & Timezone",
      isComplete: !!(builder.timezone && builder.country),
      weight: 5,
      editPath: "/builder/profile/edit",
    },
    {
      id: "faqs",
      label: "FAQs (Help clients understand your work)",
      isComplete: builder.faqs && builder.faqs.length >= 2,
      weight: 10,
      editPath: "/builder/profile/edit",
    },
  ];

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  const completedWeight = items
    .filter((item) => item.isComplete)
    .reduce((sum, item) => sum + item.weight, 0);
  const completionPercentage = Math.round((completedWeight / totalWeight) * 100);

  const completedItems = items.filter((item) => item.isComplete).length;
  const totalItems = items.length;

  const getCompletionMessage = () => {
    if (completionPercentage === 100) {
      return "Your profile is complete! Great job!";
    } else if (completionPercentage >= 75) {
      return "Almost there! Just a few more items to go.";
    } else if (completionPercentage >= 50) {
      return "Good progress! Keep building your profile.";
    } else if (completionPercentage >= 25) {
      return "You're getting started! Complete more to attract clients.";
    }
    return "Let's get your profile set up to start attracting clients!";
  };

  const getCompletionColor = () => {
    if (completionPercentage === 100) return "text-chart-4";
    if (completionPercentage >= 75) return "text-chart-3";
    if (completionPercentage >= 50) return "text-chart-2";
    return "text-primary";
  };

  return (
    <Card className="border-2" data-testid="card-profile-completion">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <CardTitle>Profile Completion</CardTitle>
          </div>
          <Badge variant={completionPercentage === 100 ? "default" : "secondary"} className="gap-1">
            {completionPercentage === 100 ? (
              <>
                <CheckCircle2 className="h-3 w-3" />
                Complete
              </>
            ) : (
              `${completedItems}/${totalItems}`
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className={`text-3xl font-bold ${getCompletionColor()}`}>
              {completionPercentage}%
            </span>
            <span className="text-sm text-muted-foreground">Profile Strength</span>
          </div>
          <Progress value={completionPercentage} className="h-2" data-testid="progress-profile" />
          <p className="text-sm text-muted-foreground">{getCompletionMessage()}</p>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm hover-elevate"
              data-testid={`completion-item-${item.id}`}
            >
              <div className="flex items-center gap-2 flex-1">
                {item.isComplete ? (
                  <CheckCircle2 className="h-4 w-4 text-chart-4 shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground shrink-0" />
                )}
                <span className={item.isComplete ? "text-muted-foreground" : ""}>
                  {item.label}
                </span>
              </div>
              {!item.isComplete && item.editPath && (
                <Link href={item.editPath}>
                  <Button variant="ghost" size="sm" className="gap-1" data-testid={`button-complete-${item.id}`}>
                    Complete
                    <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </div>

        {completionPercentage === 100 && (
          <div className="rounded-lg border-2 border-chart-4/30 bg-gradient-to-r from-chart-4/10 to-transparent p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-chart-4" />
              <h4 className="font-semibold text-chart-4">Profile Complete!</h4>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Your profile is fully optimized. You're ready to attract premium clients!
            </p>
            <Link href="/marketplace">
              <Button variant="default" className="w-full gap-2" data-testid="button-start-getting-clients">
                Start Getting Clients
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
