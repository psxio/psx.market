import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ServerCrash, Home, RefreshCw, MessageCircle } from "lucide-react";
import { Link } from "wouter";

export default function ServerError() {
  useEffect(() => {
    document.title = "500 - Server Error | Create.psx";
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4" data-testid="page-500">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-3">
              <ServerCrash className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>500 - Server Error</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Something went wrong on our end. We've been notified and are working to fix it.
          </p>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium mb-2">What you can do:</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Wait a few moments and try again</li>
              <li>Clear your browser cache and cookies</li>
              <li>Contact support if the issue persists</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button onClick={handleReload} variant="outline" className="flex-1 gap-2" data-testid="button-reload">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Link href="/">
              <Button className="flex-1 gap-2 w-full" data-testid="button-home">
                <Home className="h-4 w-4" />
                Go Home
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t">
            <Link href="/faq">
              <Button variant="ghost" size="sm" className="w-full gap-2" data-testid="link-support">
                <MessageCircle className="h-4 w-4" />
                Contact Support
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            Error ID: {Date.now().toString(36)} • {new Date().toISOString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
