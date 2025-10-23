import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Clock, AlertCircle, Package, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface TimelineStep {
  id: string;
  label: string;
  status: "completed" | "in_progress" | "pending";
  date?: string;
  icon: any;
}

interface OrderTimelineProps {
  orderId: string;
  status: string;
  deliveryDate: string;
  steps?: TimelineStep[];
}

const defaultSteps: TimelineStep[] = [
  { id: "placed", label: "Order Placed", status: "completed", icon: Check },
  { id: "requirements", label: "Requirements Submitted", status: "completed", icon: Check },
  { id: "in_progress", label: "Work in Progress", status: "in_progress", icon: Clock },
  { id: "delivery", label: "Delivered", status: "pending", icon: Package },
  { id: "review", label: "Review & Complete", status: "pending", icon: Star },
];

export function OrderTimeline({ orderId, status, deliveryDate, steps = defaultSteps }: OrderTimelineProps) {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const delivery = new Date(deliveryDate);
      const diff = delivery.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("Overdue");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (days > 0) {
        setTimeRemaining(`${days} day${days > 1 ? 's' : ''} ${hours}h`);
      } else {
        setTimeRemaining(`${hours} hour${hours > 1 ? 's' : ''}`);
      }
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [deliveryDate]);

  useEffect(() => {
    const completedSteps = steps.filter((s) => s.status === "completed").length;
    setProgress((completedSteps / steps.length) * 100);
  }, [steps]);

  const getStatusColor = (stepStatus: string) => {
    switch (stepStatus) {
      case "completed":
        return "text-green-500";
      case "in_progress":
        return "text-primary";
      case "pending":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusBg = (stepStatus: string) => {
    switch (stepStatus) {
      case "completed":
        return "bg-green-500/10 border-green-500";
      case "in_progress":
        return "bg-primary/10 border-primary";
      case "pending":
        return "bg-muted border-muted-foreground/20";
      default:
        return "bg-muted border-muted-foreground/20";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Order Timeline</CardTitle>
            <CardDescription>Track your order progress</CardDescription>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium" data-testid="text-time-remaining">
                {timeRemaining}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">until delivery</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="font-semibold">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" data-testid="progress-order" />
        </div>

        {/* Timeline Steps */}
        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.id} className="relative">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        rounded-full p-2 border-2 
                        ${getStatusBg(step.status)}
                      `}
                      data-testid={`icon-step-${step.id}`}
                    >
                      <Icon className={`h-4 w-4 ${getStatusColor(step.status)}`} />
                    </div>
                    {!isLast && (
                      <div
                        className={`
                          w-0.5 h-12 my-1
                          ${step.status === "completed" ? "bg-green-500" : "bg-muted"}
                        `}
                      />
                    )}
                  </div>

                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium" data-testid={`text-step-${step.id}`}>
                          {step.label}
                        </p>
                        {step.date && (
                          <p className="text-xs text-muted-foreground">{step.date}</p>
                        )}
                      </div>
                      {step.status === "completed" && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <Check className="h-3 w-3 mr-1" />
                          Done
                        </Badge>
                      )}
                      {step.status === "in_progress" && (
                        <Badge variant="default">
                          <Clock className="h-3 w-3 mr-1 animate-pulse" />
                          In Progress
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Countdown Timer for Urgent Deliveries */}
        {timeRemaining && timeRemaining !== "Overdue" && parseInt(timeRemaining) < 48 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <div className="flex-1">
              <p className="text-sm font-medium">Delivery soon</p>
              <p className="text-xs text-muted-foreground">
                Your order will be delivered in {timeRemaining}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
