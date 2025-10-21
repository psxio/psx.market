import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, CheckCircle2, Clock } from "lucide-react";
import type { Builder, Service } from "@shared/schema";

interface BuilderCardProps {
  builder: Builder;
  service?: Service;
}

export function BuilderCard({ builder, service }: BuilderCardProps) {
  const initials = builder.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link href={`/builder/${builder.id}`}>
      <Card className="group hover-elevate active-elevate-2 h-full cursor-pointer overflow-visible transition-all" data-testid={`card-builder-${builder.id}`}>
        <CardHeader className="space-y-0 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-12 w-12">
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
            <div>
              <h4 className="font-medium text-sm mb-1 line-clamp-2">{service.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
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
            <Badge variant="secondary" className="text-xs">
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
      </Card>
    </Link>
  );
}
