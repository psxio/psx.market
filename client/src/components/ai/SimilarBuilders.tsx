import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BuilderCard } from "@/components/builder-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";
import type { Builder } from "@shared/schema";

interface BuilderScore {
  builder: Builder;
  score: number;
  reasoning: string;
  matchedSkills: string[];
}

interface SimilarBuildersProps {
  builderId: string;
}

export function SimilarBuilders({ builderId }: SimilarBuildersProps) {
  const { data: similarBuilders, isLoading } = useQuery<BuilderScore[]>({
    queryKey: ["/api/ai/similar-builders", builderId],
    queryFn: async () => {
      const res = await fetch(`/api/ai/similar-builders/${builderId}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch similar builders");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Similar Builders
          </CardTitle>
          <CardDescription>Discovering similar experts...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!similarBuilders || similarBuilders.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Similar Builders You Might Like
        </CardTitle>
        <CardDescription>
          AI-powered recommendations based on skills and expertise
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {similarBuilders.map((match) => (
            <div key={match.builder.id} className="space-y-2">
              <BuilderCard builder={match.builder} />
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {match.score}% Match
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {match.reasoning}
                </p>
                {match.matchedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {match.matchedSkills.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
