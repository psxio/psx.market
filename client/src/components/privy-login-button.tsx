import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, Mail } from 'lucide-react';
import { FaGoogle, FaTwitter, FaDiscord } from 'react-icons/fa';

export function PrivyLoginButton() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  if (!ready) {
    return (
      <Button variant="outline" disabled data-testid="button-privy-loading">
        <Mail className="w-4 h-4 mr-2" />
        Loading...
      </Button>
    );
  }

  if (authenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground">
          {user.email?.address || user.wallet?.address?.slice(0, 6) + '...' + user.wallet?.address?.slice(-4)}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          data-testid="button-privy-logout"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={login}
      variant="default"
      data-testid="button-privy-login"
      className="gap-2"
    >
      <LogIn className="w-4 h-4" />
      Sign In
    </Button>
  );
}

export function PrivyLoginMethods() {
  const { login } = usePrivy();

  return (
    <div className="flex flex-col gap-3 w-full max-w-sm">
      <Button
        onClick={() => login()}
        variant="outline"
        className="w-full gap-2"
        data-testid="button-privy-google"
      >
        <FaGoogle className="w-5 h-5" />
        Continue with Google
      </Button>
      <Button
        onClick={() => login()}
        variant="outline"
        className="w-full gap-2"
        data-testid="button-privy-twitter"
      >
        <FaTwitter className="w-5 h-5" />
        Continue with Twitter
      </Button>
      <Button
        onClick={() => login()}
        variant="outline"
        className="w-full gap-2"
        data-testid="button-privy-discord"
      >
        <FaDiscord className="w-5 h-5" />
        Continue with Discord
      </Button>
      <Button
        onClick={() => login()}
        variant="outline"
        className="w-full gap-2"
        data-testid="button-privy-email"
      >
        <Mail className="w-5 h-5" />
        Continue with Email
      </Button>
    </div>
  );
}
