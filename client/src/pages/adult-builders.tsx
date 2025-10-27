import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import type { Builder } from "@shared/schema";

export default function AdultBuilders() {
  const [, setLocation] = useLocation();
  const [hasAccepted, setHasAccepted] = useState(false);
  const [showWarning, setShowWarning] = useState(true);
  const [confirmAge, setConfirmAge] = useState(false);

  useEffect(() => {
    const accepted = sessionStorage.getItem('adult-content-accepted');
    if (accepted === 'true') {
      setHasAccepted(true);
      setShowWarning(false);
    }
  }, []);

  const { data: builders, isLoading } = useQuery<Builder[]>({
    queryKey: ['/api/builders/adult'],
    enabled: hasAccepted,
  });

  const handleAccept = () => {
    if (!confirmAge) return;
    sessionStorage.setItem('adult-content-accepted', 'true');
    setHasAccepted(true);
    setShowWarning(false);
  };

  const handleDecline = () => {
    setLocation('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-full bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <DialogTitle className="text-xl">Adult Content Warning</DialogTitle>
            </div>
            <DialogDescription className="space-y-3 pt-2">
              <p className="font-medium">
                You are about to enter a section containing adult-themed builders and services.
              </p>
              <p className="text-sm">
                This section may include content related to adult entertainment, NSFW art, mature themes, and similar services. 
                Some projects in the crypto/Web3 space require these specialized skills.
              </p>
              <p className="text-sm font-medium text-foreground">
                port444 does not tolerate racist, discriminatory, or illegal content. All builders must comply with platform guidelines and local laws.
              </p>
              <div className="flex items-start gap-2 pt-2">
                <Checkbox 
                  id="age-confirm" 
                  checked={confirmAge}
                  onCheckedChange={(checked) => setConfirmAge(checked as boolean)}
                  data-testid="checkbox-age-confirm"
                />
                <label htmlFor="age-confirm" className="text-sm cursor-pointer">
                  I am 18 years of age or older and wish to proceed
                </label>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={handleDecline}
              className="w-full sm:w-auto"
              data-testid="button-decline"
            >
              Go Back
            </Button>
            <Button 
              onClick={handleAccept}
              disabled={!confirmAge}
              className="w-full sm:w-auto"
              data-testid="button-accept"
            >
              I Understand, Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {hasAccepted && (
        <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold">Adult-Themed Builders</h1>
              <Badge variant="destructive" className="text-xs">18+</Badge>
            </div>
            <p className="text-muted-foreground">
              Specialized builders for mature, adult-oriented, and NSFW projects
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading builders...</p>
            </div>
          ) : builders && builders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {builders.map((builder) => {
                const initials = builder.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);

                return (
                  <Link key={builder.id} href={`/builder/${builder.id}`}>
                    <Card className="hover-elevate active-elevate-2 cursor-pointer transition-all" data-testid={`card-builder-${builder.id}`}>
                      <CardHeader className="pb-4">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={builder.profileImage || undefined} alt={builder.name} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-lg truncate">{builder.name}</CardTitle>
                              <Badge variant="destructive" className="text-xs shrink-0">18+</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {builder.headline}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-chart-4 text-chart-4" />
                            <span className="font-semibold">{builder.rating || "5.0"}</span>
                          </div>
                          <span className="text-muted-foreground">
                            {builder.completedProjects} projects
                          </span>
                        </div>
                        <Badge variant="outline">{builder.category}</Badge>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <Card className="p-12">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  No adult-themed builders available at this time
                </p>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
