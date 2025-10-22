import { useNotificationToasts } from "@/hooks/use-notification-toasts";
import { useWalletAuth } from "@/hooks/use-wallet-auth";

export function NotificationToastListener() {
  const { client, builder } = useWalletAuth();
  
  const userId = client?.id || builder?.id;
  const userType = client ? "client" : builder ? "builder" : null;
  
  useNotificationToasts({
    userId,
    userType,
    enabled: !!(userId && userType),
  });

  return null;
}
