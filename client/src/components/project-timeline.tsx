import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  TrendingUp, 
  XCircle,
  Package,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import type { Order, Milestone, ProjectDeliverable, ProgressUpdate } from "@shared/schema";

interface ProjectTimelineProps {
  orderId: string;
}

export function ProjectTimeline({ orderId }: ProjectTimelineProps) {
  const { data: order, isLoading: orderLoading } = useQuery<Order>({
    queryKey: ["/api/orders", orderId],
  });

  const { data: milestones = [], isLoading: milestonesLoading } = useQuery<Milestone[]>({
    queryKey: ["/api/milestones", orderId],
    enabled: !!orderId,
  });

  const { data: deliverables = [], isLoading: deliverablesLoading } = useQuery<ProjectDeliverable[]>({
    queryKey: ["/api/orders", orderId, "deliverables"],
    enabled: !!orderId,
  });

  const { data: progressUpdates = [], isLoading: progressLoading } = useQuery<ProgressUpdate[]>({
    queryKey: ["/api/orders", orderId, "progress"],
    enabled: !!orderId,
  });

  const isLoading = orderLoading || milestonesLoading || deliverablesLoading || progressLoading;

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 animate-pulse">
              <div className="w-12 h-12 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">Order not found</p>
      </Card>
    );
  }

  const timelineItems: Array<{
    id: string;
    type: "order" | "milestone" | "deliverable" | "progress";
    date: string;
    title: string;
    description: string;
    status: string;
    icon: typeof Clock;
  }> = [];

  timelineItems.push({
    id: order.id,
    type: "order",
    date: order.createdAt,
    title: "Project Started",
    description: `Order placed for ${order.title}`,
    status: order.status,
    icon: Package,
  });

  milestones.forEach((milestone) => {
    timelineItems.push({
      id: milestone.id,
      type: "milestone",
      date: milestone.createdAt,
      title: milestone.title,
      description: milestone.description,
      status: milestone.status,
      icon: CheckCircle2,
    });
  });

  deliverables.forEach((deliverable) => {
    timelineItems.push({
      id: deliverable.id,
      type: "deliverable",
      date: deliverable.submittedAt,
      title: deliverable.title,
      description: deliverable.description,
      status: deliverable.status,
      icon: FileText,
    });
  });

  progressUpdates.forEach((update) => {
    timelineItems.push({
      id: update.id,
      type: "progress",
      date: update.createdAt,
      title: update.title,
      description: update.description,
      status: `${update.progressPercentage}%`,
      icon: TrendingUp,
    });
  });

  timelineItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "accepted":
      case "delivered":
        return "default";
      case "in_progress":
      case "pending":
        return "secondary";
      case "rejected":
      case "cancelled":
        return "destructive";
      case "revision_requested":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "accepted":
        return <CheckCircle2 className="w-4 h-4 text-primary" />;
      case "rejected":
      case "cancelled":
        return <XCircle className="w-4 h-4 text-destructive" />;
      case "revision_requested":
        return <AlertCircle className="w-4 h-4 text-warning" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Project Timeline</h2>
      </div>

      <div className="space-y-6">
        {timelineItems.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No timeline events yet</p>
        ) : (
          timelineItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="relative">
                {index < timelineItems.length - 1 && (
                  <div className="absolute left-6 top-12 bottom-0 w-px bg-border" />
                )}
                
                <div className="flex gap-4" data-testid={`timeline-item-${item.type}-${item.id}`}>
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-card border-2 border-border flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>

                  <div className="flex-1 pb-6">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm" data-testid={`text-timeline-title-${item.id}`}>
                            {item.title}
                          </h3>
                          {item.status && (
                            <Badge variant={getStatusColor(item.status)} data-testid={`status-${item.status}-${item.id}`}>
                              {item.status.replace(/_/g, " ")}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {getStatusIcon(item.status)}
                        <time dateTime={item.date} data-testid={`text-date-${item.id}`}>
                          {format(new Date(item.date), "MMM d, yyyy h:mm a")}
                        </time>
                      </div>
                    </div>

                    {item.type === "progress" && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium" data-testid={`text-progress-${item.id}`}>{item.status}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: item.status }}
                            data-testid={`progress-bar-${item.id}`}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {index < timelineItems.length - 1 && <Separator className="my-0" />}
              </div>
            );
          })
        )}
      </div>

      {order && (
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary" data-testid="text-milestone-count">
                {milestones.length}
              </div>
              <div className="text-xs text-muted-foreground">Milestones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary" data-testid="text-deliverable-count">
                {deliverables.length}
              </div>
              <div className="text-xs text-muted-foreground">Deliverables</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary" data-testid="text-progress-count">
                {progressUpdates.length}
              </div>
              <div className="text-xs text-muted-foreground">Updates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary" data-testid="text-days-remaining">
                {order.deliveryDays}
              </div>
              <div className="text-xs text-muted-foreground">Days Total</div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
