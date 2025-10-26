import { useQuery } from "@tanstack/react-query";

interface ServiceStats {
  viewsLast24Hours: number;
  bookingsLastWeek: number;
  lastBookedAt: string | null;
  totalBookings: number;
}

export function useServiceStats(serviceId: string) {
  return useQuery<ServiceStats>({
    queryKey: ['/api/services', serviceId, 'stats'],
    enabled: !!serviceId,
    staleTime: 60000, // Cache for 1 minute
    refetchInterval: 60000, // Refetch every minute
  });
}
