import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, Clock, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import type { Builder, Service } from "@shared/schema";

interface BuilderCategoryCardProps {
  builder: Builder;
  services: Service[];
}

export function BuilderCategoryCard({ builder, services }: BuilderCategoryCardProps) {
  const topServices = services.slice(0, 3);
  const lowestPrice = Math.min(...services.map(s => parseFloat(s.basicPrice)));
  const averageDelivery = Math.round(
    services.reduce((sum, s) => sum + (s.basicDeliveryDays || parseInt(s.deliveryTime)), 0) / services.length
  );

  return (
    <Card className="group overflow-hidden hover-elevate transition-all duration-300 flex flex-col h-full">
      <CardContent className="p-0 flex flex-col flex-1">
        {/* Builder Header */}
        <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
          <div className="flex items-start gap-4">
            <Link href={`/builder/${builder.id}`}>
              <Avatar className="h-16 w-16 border-2 border-background shadow-lg cursor-pointer">
                <AvatarImage src={builder.profileImage || undefined} alt={builder.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                  {builder.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex-1 min-w-0">
              <Link href={`/builder/${builder.id}`}>
                <h3 className="font-semibold text-lg text-foreground hover:text-primary transition-colors line-clamp-1 cursor-pointer" data-testid={`text-builder-name-${builder.id}`}>
                  {builder.name}
                </h3>
              </Link>
              {builder.headline && (
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1" data-testid={`text-builder-headline-${builder.id}`}>
                  {builder.headline}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {builder.rating !== null && builder.completedProjects && builder.completedProjects > 0 && (
                  <div className="flex items-center gap-1 text-xs font-medium">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span>{parseFloat(builder.rating).toFixed(1)}</span>
                    <span className="text-muted-foreground">({builder.completedProjects})</span>
                  </div>
                )}
                <Badge variant="secondary" className="text-xs">
                  {services.length} {services.length === 1 ? 'Service' : 'Services'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Services Preview */}
        <div className="p-6 pt-4 space-y-3 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Available Services
            </h4>
            {builder.tokenGateWhitelisted && (
              <Badge variant="outline" className="gap-1 border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400">
                <Sparkles className="h-3 w-3" />
                Token Perks
              </Badge>
            )}
          </div>
          
          <div className="space-y-2 flex-1">
            {topServices.map((service) => (
              <Link key={service.id} href={`/service/${service.id}`}>
                <div 
                  className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group/service"
                  data-testid={`service-preview-${service.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-1 group-hover/service:text-primary transition-colors">
                      {service.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{service.basicDeliveryDays || service.deliveryTime} day{parseInt(service.basicDeliveryDays?.toString() || service.deliveryTime) !== 1 ? 's' : ''}</span>
                      </div>
                      {service.basicRevisions && service.basicRevisions > 0 && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          <span>{service.basicRevisions} revision{service.basicRevisions !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <p className="font-bold text-primary text-sm">
                      ${parseFloat(service.basicPrice).toLocaleString()}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {services.length > 3 && (
            <p className="text-xs text-muted-foreground text-center pt-1">
              + {services.length - 3} more service{services.length - 3 !== 1 ? 's' : ''}
            </p>
          )}

          {/* Quick Stats */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="text-sm">
              <span className="text-muted-foreground">Starting from </span>
              <span className="font-bold text-primary">${lowestPrice.toLocaleString()}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              ~{averageDelivery} day delivery
            </div>
          </div>

          {/* CTA */}
          <Link href={`/builder/${builder.id}`}>
            <Button 
              variant="outline" 
              className="w-full mt-2 group/btn"
              data-testid={`button-view-profile-${builder.id}`}
            >
              View Full Profile
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
