import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchX, Home, ArrowLeft, Search } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  useEffect(() => {
    document.title = "404 - Page Not Found | Create.psx";
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4" data-testid="page-404">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-destructive/10 p-3">
              <SearchX className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle>404 - Page Not Found</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button onClick={handleGoBack} variant="outline" className="flex-1 gap-2" data-testid="button-go-back">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Link href="/">
              <Button className="flex-1 gap-2 w-full" data-testid="button-home">
                <Home className="h-4 w-4" />
                Home Page
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm font-medium mb-2">Quick Links:</p>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/marketplace">
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sm" data-testid="link-marketplace">
                  <Search className="h-3 w-3" />
                  Browse Services
                </Button>
              </Link>
              <Link href="/builders">
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sm" data-testid="link-builders">
                  <Search className="h-3 w-3" />
                  Find Builders
                </Button>
              </Link>
              <Link href="/faq">
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-sm col-span-2" data-testid="link-faq">
                  <Search className="h-3 w-3" />
                  Help & FAQ
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
