import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, CheckCircle2, Clock, Users, Sparkles, Code, TrendingUp, BarChart3 } from "lucide-react";
import type { Builder, Service } from "@shared/schema";

interface BuilderCardProps {
  builder: Builder;
  service?: Service;
}

const categoryVisuals = {
  "KOLs": {
    icon: Users,
    gradient: "from-purple-500/20 via-pink-500/20 to-red-500/20",
    borderColor: "border-l-purple-500",
    patternClass: "kol-pattern",
    badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/20"
  },
  "3D Content": {
    icon: Sparkles,
    gradient: "from-cyan-500/20 via-blue-500/20 to-indigo-500/20",
    borderColor: "border-l-cyan-500",
    patternClass: "3d-pattern",
    badgeColor: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
  },
  "Marketing": {
    icon: TrendingUp,
    gradient: "from-green-500/20 via-emerald-500/20 to-teal-500/20",
    borderColor: "border-l-green-500",
    patternClass: "marketing-pattern",
    badgeColor: "bg-green-500/10 text-green-500 border-green-500/20"
  },
  "Development": {
    icon: Code,
    gradient: "from-blue-500/20 via-indigo-500/20 to-violet-500/20",
    borderColor: "border-l-blue-500",
    patternClass: "dev-pattern",
    badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20"
  },
  "Volume": {
    icon: BarChart3,
    gradient: "from-orange-500/20 via-amber-500/20 to-yellow-500/20",
    borderColor: "border-l-orange-500",
    patternClass: "volume-pattern",
    badgeColor: "bg-orange-500/10 text-orange-500 border-orange-500/20"
  }
};

export function BuilderCard({ builder, service }: BuilderCardProps) {
  const initials = builder.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const categoryKey = builder.category as keyof typeof categoryVisuals;
  const visual = categoryVisuals[categoryKey] || categoryVisuals["Development"];
  const CategoryIcon = visual.icon;

  return (
    <Link href={`/builder/${builder.id}`}>
      <Card 
        className={`group hover-elevate active-elevate-2 hover-lift h-full cursor-pointer overflow-hidden transition-all border-l-4 ${visual.borderColor}`}
        data-testid={`card-builder-${builder.id}`}
      >
        {/* Animated background pattern */}
        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${visual.patternClass}`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${visual.gradient} animate-gradient`} />
        </div>

        {/* Category indicator badge in top right */}
        <div className="absolute top-3 right-3 z-10">
          <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${visual.badgeColor} backdrop-blur-sm border transition-all duration-300 group-hover:scale-125 group-hover:rotate-12`}>
            <CategoryIcon className="h-4 w-4" />
          </div>
        </div>

        <div className="relative z-[1]">
          <CardHeader className="space-y-0 pb-4">
            <div className="flex items-start justify-between gap-4 pr-10">
              <div className="flex items-start gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-border group-hover:ring-primary/50 transition-all">
                  <AvatarImage src={builder.profileImage || undefined} alt={builder.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <h3 className="font-semibold text-base truncate">{builder.name}</h3>
                    {builder.verified && (
                      <CheckCircle2 className="h-4 w-4 text-chart-3 flex-shrink-0" data-testid="icon-verified" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {builder.headline}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pb-4 space-y-3">
            {service && (
              <div className="rounded-md bg-muted/50 p-3 border">
                <h4 className="font-medium text-sm mb-1 line-clamp-2">{service.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {service.description}
                </p>
              </div>
            )}

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-chart-4 text-chart-4" />
                <span className="font-semibold">{builder.rating || "5.0"}</span>
                <span className="text-muted-foreground">
                  ({builder.reviewCount})
                </span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{builder.responseTime}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              <Badge 
                variant="outline" 
                className={`text-xs ${visual.badgeColor}`}
              >
                {builder.category}
              </Badge>
              {builder.skills?.slice(0, 2).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between gap-4 pt-0">
            {service ? (
              <>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Starting at</span>
                  <span className="text-lg font-bold">${service.basicPrice}</span>
                </div>
                <Button size="sm" variant="outline" className="hover-elevate" data-testid="button-view-service">
                  View Details
                </Button>
              </>
            ) : (
              <>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">Projects</span>
                  <span className="font-semibold">{builder.completedProjects}</span>
                </div>
                <Button size="sm" variant="outline" className="hover-elevate" data-testid="button-view-profile">
                  View Profile
                </Button>
              </>
            )}
          </CardFooter>
        </div>
      </Card>
    </Link>
  );
}
