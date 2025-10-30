import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles, ArrowRight } from "lucide-react";
import type { Builder, Service } from "@shared/schema";

interface RecommendedService {
  service: Service;
  builder: Builder | null;
  reasoning: string;
}

interface RecommendedServicesProps {
  serviceId: string;
}

export function RecommendedServices({ serviceId }: RecommendedServicesProps) {
  const { data: recommendations, isLoading } = useQuery<RecommendedService[]>({
    queryKey: ["/api/ai/recommended-services", serviceId],
    queryFn: async () => {
      const res = await fetch(`/api/ai/recommended-services/${serviceId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch recommendations");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Recommended Services
          </CardTitle>
          <CardDescription>Finding complementary services...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-24 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          You Might Also Need
        </CardTitle>
        <CardDescription>
          AI-recommended complementary services for your project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <Link key={rec.service.id} href={`/services/${rec.service.id}`}>
              <Card className="hover-elevate cursor-pointer" data-testid={`card-recommended-${rec.service.id}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold">{rec.service.title}</h4>
                          {rec.builder && (
                            <p className="text-sm text-muted-foreground">
                              by {rec.builder.name}
                            </p>
                          )}
                        </div>
                        <Badge className="text-xs">{rec.service.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {rec.service.description}
                      </p>
                      <p className="text-xs text-primary italic">
                        <Sparkles className="h-3 w-3 inline mr-1" />
                        {rec.reasoning}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            From ${rec.service.basicPrice}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {rec.service.deliveryTime}
                          </span>
                        </div>
                        <Button size="sm" variant="outline" data-testid={`button-view-service-${rec.service.id}`} asChild>
                          <span>
                            View Service
                            <ArrowRight className="h-3 w-3 ml-2" />
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
