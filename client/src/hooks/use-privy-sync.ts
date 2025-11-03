import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/queryClient';

export function usePrivySync() {
  const { authenticated, user, ready } = usePrivy();
  const [synced, setSynced] = useState(false);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!ready || !authenticated || !user || synced || syncing) {
      return;
    }

    const syncUser = async () => {
      setSyncing(true);
      try {
        const authProvider = user.google ? 'google' 
          : user.twitter ? 'twitter'
          : user.discord ? 'discord'
          : user.email ? 'email'
          : user.wallet ? 'wallet'
          : 'unknown';

        await apiRequest('/api/auth/privy/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-privy-user-id': user.id,
          },
          body: JSON.stringify({
            privyId: user.id,
            walletAddress: user.wallet?.address,
            email: user.email?.address || user.google?.email || user.twitter?.email,
            name: user.google?.name || user.twitter?.name || user.discord?.username,
            profileImage: user.google?.pictureUrl || user.twitter?.profilePictureUrl,
            authProvider,
          }),
        });

        setSynced(true);
      } catch (error) {
        console.error('Failed to sync user with backend:', error);
      } finally {
        setSyncing(false);
      }
    };

    syncUser();
  }, [ready, authenticated, user, synced, syncing]);

  return { synced, syncing };
}
