import { useNotificationToasts } from "@/hooks/use-notification-toasts";
import { useWalletAuth } from "@/hooks/use-wallet-auth";

export function NotificationToastListener() {
  const { client, builder, isClient, isBuilder } = useWalletAuth();
  
  const userId = client?.id || builder?.id;
  const userType = isClient ? "client" : isBuilder ? "builder" : null;
  
  useNotificationToasts({
    userId,
    userType,
    enabled: !!(userId && userType),
  });

  return null;
}
