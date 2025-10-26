import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Sparkles, TrendingUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileStrengthWidgetProps {
  score: number;
  suggestions: string[];
  className?: string;
}

export function ProfileStrengthWidget({
  score,
  suggestions,
  className,
}: ProfileStrengthWidgetProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-chart-3";
    if (score >= 60) return "text-yellow-500";
    return "text-destructive";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { label: "Excellent", variant: "default" as const, color: "bg-chart-3" };
    if (score >= 60) return { label: "Good", variant: "secondary" as const, color: "bg-yellow-500" };
    if (score >= 40) return { label: "Fair", variant: "secondary" as const, color: "bg-orange-500" };
    return { label: "Needs Work", variant: "destructive" as const, color: "bg-destructive" };
  };

  const badge = getScoreBadge(score);

  const completedCount = Math.max(0, Math.floor((score / 100) * suggestions.length) - suggestions.length);
  const totalItems = suggestions.length + Math.abs(completedCount);

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Profile Strength
          </CardTitle>
          <Badge variant={badge.variant} className="text-xs">
            {badge.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={cn("text-3xl font-bold", getScoreColor(score))}>
              {score}%
            </span>
            {score >= 80 && (
              <div className="flex items-center gap-1 text-xs text-chart-3">
                <TrendingUp className="h-3 w-3" />
                <span>Great profile!</span>
              </div>
            )}
          </div>
          <Progress value={score} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {score < 60 && "Complete your profile to stand out to clients"}
            {score >= 60 && score < 80 && "You're doing well! A few more improvements will make your profile shine"}
            {score >= 80 && "Your profile is optimized and ready to attract clients!"}
          </p>
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              Quick Wins
            </h4>
            <div className="space-y-1.5">
              {suggestions.slice(0, 4).map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <Circle className="h-3.5 w-3.5 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground leading-tight">
                    {suggestion}
                  </span>
                </div>
              ))}
              {suggestions.length > 4 && (
                <p className="text-xs text-muted-foreground italic pl-5">
                  +{suggestions.length - 4} more suggestions
                </p>
              )}
            </div>
          </div>
        )}

        {suggestions.length === 0 && score >= 80 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-chart-3/10 border border-chart-3/20">
            <CheckCircle2 className="h-4 w-4 text-chart-3 flex-shrink-0" />
            <p className="text-sm text-chart-3 font-medium">
              Profile complete! You're ready to attract clients.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
