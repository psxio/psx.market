import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { Notification } from "@shared/schema";

interface UseNotificationToastsProps {
  userId: string | undefined;
  userType: "client" | "builder" | null;
  enabled?: boolean;
}

export function useNotificationToasts({ userId, userType, enabled = true }: UseNotificationToastsProps) {
  const { toast } = useToast();
  const lastNotificationIdRef = useRef<string | null>(null);

  const { data: unreadNotifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications", userType, userId, "unread"],
    queryFn: async () => {
      if (!userId || !userType) return [];
      const response = await fetch(
        `/api/notifications/${userType}/${userId}?limit=5&unreadOnly=true`
      );
      if (!response.ok) return [];
      return response.json();
    },
    enabled: enabled && !!userId && !!userType,
    refetchInterval: 15000,
  });

  useEffect(() => {
    if (!unreadNotifications || unreadNotifications.length === 0) {
      return;
    }

    const latestNotification = unreadNotifications[0];

    if (
      latestNotification &&
      lastNotificationIdRef.current !== latestNotification.id
    ) {
      lastNotificationIdRef.current = latestNotification.id;

      const notificationIcons: Record<string, string> = {
        order_update: "📦",
        message: "💬",
        payment: "💰",
        review: "⭐",
        milestone: "🎯",
        dispute: "⚠️",
      };

      toast({
        title: `${notificationIcons[latestNotification.type] || "🔔"} ${latestNotification.title}`,
        description: latestNotification.message,
        duration: 5000,
      });
    }
  }, [unreadNotifications, toast]);

  return {
    hasUnreadNotifications: unreadNotifications.length > 0,
    unreadCount: unreadNotifications.length,
  };
}
