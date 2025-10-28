import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Clock, Heart, CheckCircle2 } from "lucide-react";
import type { Builder, Service } from "@shared/schema";

interface ServiceCardProps {
  builder: Builder;
  service: Service;
}

export function ServiceCard({ builder, service }: ServiceCardProps) {
  const initials = builder.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const serviceImage = service.portfolioMedia?.[0] || 
    `https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=600&fit=crop`;

  return (
    <Card 
      className="group hover-elevate active-elevate-2 h-full overflow-hidden border-2 transition-all"
      data-testid={`card-service-${service.id}`}
    >
      {/* Image Section - Fiverr Style - Clickable to service */}
      <Link href={`/service/${service.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted cursor-pointer">
          <img 
            src={serviceImage}
            alt={service.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = `https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=600&fit=crop`;
            }}
          />
          
          {/* Save Button Overlay */}
          <button 
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover-elevate active-elevate-2"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            data-testid={`button-save-${service.id}`}
          >
            <Heart className="h-4 w-4 text-muted-foreground" />
          </button>

          {/* Verified Badge */}
          {builder.verified && (
            <div className="absolute bottom-3 left-3">
              <Badge variant="secondary" className="gap-1 bg-background/90 backdrop-blur-sm">
                <CheckCircle2 className="h-3 w-3 text-chart-3" />
                <span className="text-xs font-medium">Verified</span>
              </Badge>
            </div>
          )}
        </div>
      </Link>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Builder Info - Clickable to builder */}
        <Link href={`/builder/${builder.id}`}>
          <div className="flex items-center gap-2 -mx-1 -my-1 p-1 rounded-md hover-elevate active-elevate-2 cursor-pointer">
            <Avatar className="h-7 w-7">
              <AvatarImage src={builder.profileImage || undefined} alt={builder.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground truncate">
              {builder.name}
            </span>
          </div>
        </Link>

        {/* Service Title - Clickable to service */}
        <Link href={`/service/${service.id}`}>
          <h3 className="font-semibold text-base line-clamp-2 min-h-[3rem] cursor-pointer hover:text-primary transition-colors">
            {service.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold text-sm">
            {builder.rating ? Number(builder.rating).toFixed(1) : "5.0"}
          </span>
          <span className="text-sm text-muted-foreground">
            ({builder.reviewCount || 0})
          </span>
        </div>

        {/* Token Tickers */}
        {service.tokenTickers && service.tokenTickers.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {service.tokenTickers.slice(0, 3).map((ticker, idx) => (
              <Badge 
                key={idx}
                variant="secondary" 
                className="bg-primary/10 text-primary border-primary/20 font-mono text-xs px-2 py-0.5"
                data-testid={`token-ticker-${idx}`}
              >
                {ticker}
              </Badge>
            ))}
            {service.tokenTickers.length > 3 && (
              <Badge variant="secondary" className="text-xs font-mono px-2 py-0.5">
                +{service.tokenTickers.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Price and Delivery */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-xs">{service.deliveryTime}</span>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground mb-0.5">Starting at</div>
            <div className="font-bold text-lg text-foreground">
              ${Number(service.basicPrice).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
