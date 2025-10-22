import { useQuery } from "@tanstack/react-query";

interface UseUnreadMessageCountProps {
  userId: string | undefined;
  userType: "client" | "builder" | null;
}

export function useUnreadMessageCount({ userId, userType }: UseUnreadMessageCountProps) {
  const { data } = useQuery<{ count: number }>({
    queryKey: ["/api/messages/unread-count", userType, userId],
    queryFn: async () => {
      if (!userId || !userType) return { count: 0 };
      
      const response = await fetch(`/api/messages/unread-count?userId=${userId}&userType=${userType}`);
      if (!response.ok) return { count: 0 };
      
      return response.json();
    },
    enabled: !!userId && !!userType,
    refetchInterval: 30000,
  });

  return {
    unreadCount: data?.count || 0,
    hasUnread: (data?.count || 0) > 0,
  };
}
