import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, Download, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPWAPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const isIOSDevice = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    setIsIOS(isIOSDevice);

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const hasBeenDismissed = localStorage.getItem('pwa-install-dismissed');

    if (isStandalone || hasBeenDismissed) {
      return;
    }

    if (isIOSDevice) {
      const iosInstalled = (window.navigator as any).standalone;
      if (!iosInstalled) {
        setTimeout(() => setShowPrompt(true), 3000);
      }
    } else {
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setTimeout(() => setShowPrompt(true), 3000);
      };

      window.addEventListener('beforeinstallprompt', handler);

      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:max-w-md">
      <Card className="border-2 shadow-lg">
        <CardContent className="p-4">
          <button
            onClick={handleDismiss}
            className="absolute right-2 top-2 p-1 rounded-md hover-elevate"
            aria-label="Dismiss"
            data-testid="button-dismiss-pwa-prompt"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-sm">Install create.psx</h3>
              <p className="text-xs text-muted-foreground">
                {isIOS
                  ? "Add to your home screen for quick access and offline support"
                  : "Install our app for a better experience with offline access"}
              </p>

              {isIOS ? (
                <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted rounded-md">
                  Tap the Share button <Download className="h-3 w-3 inline" /> and select "Add to Home Screen"
                </p>
              ) : (
                <Button
                  size="sm"
                  onClick={handleInstallClick}
                  className="w-full mt-2"
                  data-testid="button-install-pwa"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Install App
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
