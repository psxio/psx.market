import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Lock, Unlock, CheckCircle2, Clock } from "lucide-react";
import { format } from "date-fns";
import { AnimatedLoader } from "@/components/animated-loader";
import type { MilestonePayment } from "@shared/schema";

interface MilestoneTrackerProps {
  orderId: string;
  onReleaseMilestone?: (milestoneId: string) => void;
}

export function MilestoneTracker({ orderId, onReleaseMilestone }: MilestoneTrackerProps) {
  const { data: milestonePayments, isLoading } = useQuery<MilestonePayment[]>({
    queryKey: ["/api/orders", orderId, "milestone-payments"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <AnimatedLoader 
            size="lg" 
            text="Loading milestone payments..." 
            variant="pulse" 
          />
        </CardContent>
      </Card>
    );
  }

  if (!milestonePayments || milestonePayments.length === 0) {
    return null;
  }

  const totalAmount = milestonePayments.reduce(
    (sum, mp) => sum + parseFloat(mp.amount),
    0
  );
  const releasedAmount = milestonePayments
    .filter((mp) => mp.status === "released")
    .reduce((sum, mp) => sum + parseFloat(mp.amount), 0);
  const progressPercentage = (releasedAmount / totalAmount) * 100;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "released":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "locked":
        return <Lock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "released":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "locked":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Milestone Payments</CardTitle>
        <CardDescription>
          Track progress and release funds for completed milestones
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-medium" data-testid="text-milestone-progress">
              ${releasedAmount.toFixed(2)} / ${totalAmount.toFixed(2)} USDC
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" data-testid="progress-milestones" />
          <p className="text-xs text-muted-foreground text-right">
            {progressPercentage.toFixed(0)}% released
          </p>
        </div>

        <div className="space-y-3">
          {milestonePayments.map((milestone, index) => (
            <div
              key={milestone.id}
              className="flex items-center justify-between p-4 border rounded-md hover-elevate"
              data-testid={`milestone-${milestone.id}`}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-shrink-0">{getStatusIcon(milestone.status)}</div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Milestone {index + 1}</p>
                    <Badge className={getStatusColor(milestone.status)} data-testid={`badge-milestone-status-${milestone.status}`}>
                      {milestone.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span data-testid="text-milestone-amount">${parseFloat(milestone.amount).toFixed(2)} USDC</span>
                    <span>({parseFloat(milestone.percentage).toFixed(0)}%)</span>
                  </div>
                  {milestone.releasedAt && (
                    <p className="text-xs text-muted-foreground">
                      Released {format(new Date(milestone.releasedAt), "MMM d, yyyy")}
                    </p>
                  )}
                </div>
              </div>

              {milestone.status === "locked" && onReleaseMilestone && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onReleaseMilestone(milestone.id)}
                  data-testid="button-release-milestone"
                >
                  <Unlock className="h-4 w-4 mr-1" />
                  Release Funds
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
