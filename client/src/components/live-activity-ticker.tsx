import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Clock, Users, Star, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PlatformActivity {
  id: string;
  activityType: string;
  entityType: string;
  entityId: string;
  actorName: string | null;
  actorWallet: string | null;
  metadata: any;
  createdAt: string;
}

function getActivityIcon(activityType: string) {
  switch (activityType) {
    case 'service_booked':
    case 'milestone_completed':
      return <TrendingUp className="w-4 h-4 text-green-400" />;
    case 'review_submitted':
      return <Star className="w-4 h-4 text-yellow-400" />;
    case 'builder_joined':
      return <Users className="w-4 h-4 text-purple-400" />;
    default:
      return <Clock className="w-4 h-4 text-cyan-400" />;
  }
}

function formatActivityMessage(activity: PlatformActivity): string {
  const metadata = activity.metadata || {};
  const actorName = activity.actorName || "Someone";
  
  switch (activity.activityType) {
    case 'service_booked':
      return `${actorName} just booked ${metadata.serviceName || 'a service'}`;
    case 'review_submitted':
      return `${actorName} left a ${metadata.rating}-star review`;
    case 'milestone_completed':
      return `${actorName} completed a milestone`;
    case 'builder_joined':
      return `${actorName} joined as a builder`;
    case 'service_viewed':
      return `${actorName} is viewing ${metadata.serviceName || 'a service'}`;
    default:
      return `Recent activity on port444`;
  }
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function LiveActivityTicker() {
  const { data: activities = [], isLoading } = useQuery<PlatformActivity[]>({
    queryKey: ['/api/platform/activity'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activities.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length);
    }, 5000); // Change activity every 5 seconds

    return () => clearInterval(interval);
  }, [activities.length]);

  if (isLoading || activities.length === 0) {
    return null; // Don't show if loading or no activities
  }

  const currentActivity = activities[currentIndex];

  return (
    <Card 
      className="bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-purple-500/10 border-purple-500/20 overflow-hidden"
      data-testid="container-activity-ticker"
    >
      <div className="px-4 py-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentActivity.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3"
            data-testid="activity-item"
          >
            {/* Icon */}
            <div className="flex-shrink-0">
              {getActivityIcon(currentActivity.activityType)}
            </div>

            {/* Message */}
            <p className="text-sm flex-1 text-foreground">
              {formatActivityMessage(currentActivity)}
            </p>

            {/* Time */}
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {getTimeAgo(currentActivity.createdAt)}
            </span>

            {/* Activity indicator dots */}
            <div className="flex gap-1">
              {activities.slice(0, 5).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1 h-1 rounded-full transition-all ${
                    idx === currentIndex % 5 
                      ? 'bg-purple-400 w-2' 
                      : 'bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
}
