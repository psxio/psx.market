import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";

interface Service {
  id: string;
  title: string;
  builderId: string;
  builderName: string;
  builderProfileImage?: string;
  category: string;
  basicPrice: string;
  rating?: string;
  reviewCount: number;
  image?: string;
  tokenTickers?: string[];
  deliveryTime: string;
}

interface SwipeableServiceGridProps {
  services: Service[];
  onSave?: (serviceId: string) => void;
}

export function SwipeableServiceGrid({ services, onSave }: SwipeableServiceGridProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  const [savedServices, setSavedServices] = useState<Set<string>>(new Set());
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const handleSave = (serviceId: string) => {
    const newSaved = new Set(savedServices);
    if (newSaved.has(serviceId)) {
      newSaved.delete(serviceId);
    } else {
      newSaved.add(serviceId);
    }
    setSavedServices(newSaved);
    onSave?.(serviceId);
  };

  return (
    <div className="relative md:hidden" data-testid="swipeable-service-grid">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 touch-pan-y">
          {services.map((service) => (
            <div
              key={service.id}
              className="flex-[0_0_85%] min-w-0"
              data-testid={`swipeable-card-${service.id}`}
            >
              <Card className="overflow-hidden h-full border-2 hover-elevate active-elevate-2">
                <Link href={`/service/${service.id}`}>
                  {/* Image Section - Square Aspect Ratio */}
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={service.image || `https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=600&fit=crop`}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = `https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=600&fit=crop`;
                      }}
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleSave(service.id);
                      }}
                      className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center hover-elevate active-elevate-2"
                      data-testid={`save-service-${service.id}`}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          savedServices.has(service.id)
                            ? "fill-destructive text-destructive"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  </div>
                </Link>

                {/* Content Section */}
                <div className="p-4 space-y-3">
                  {/* Builder Info */}
                  <Link href={`/builder/${service.builderId}`}>
                    <div className="flex items-center gap-2 hover-elevate active-elevate-2 -mx-1 -my-1 p-1 rounded-md">
                      <img
                        src={service.builderProfileImage || `https://api.dicebear.com/7.x/avataaars/svg?seed=${service.builderName}`}
                        alt={service.builderName}
                        className="w-7 h-7 rounded-full"
                      />
                      <span className="text-sm font-medium truncate">{service.builderName}</span>
                    </div>
                  </Link>

                  {/* Service Title */}
                  <Link href={`/service/${service.id}`}>
                    <h3 className="font-semibold text-base line-clamp-2 min-h-[3rem] hover:text-primary transition-colors">
                      {service.title}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm">{service.rating || "5.0"}</span>
                    <span className="text-sm text-muted-foreground">
                      ({service.reviewCount})
                    </span>
                  </div>

                  {/* Token Tickers */}
                  {service.tokenTickers && service.tokenTickers.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {service.tokenTickers.slice(0, 3).map((token) => (
                        <Badge key={token} variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-mono text-xs px-2 py-0.5">
                          {token}
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
                    <Badge variant="outline" className="text-xs">
                      {service.deliveryTime}
                    </Badge>
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground mb-0.5">Starting at</div>
                      <div className="font-bold text-lg">${Number(service.basicPrice).toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {canScrollPrev && (
        <Button
          size="icon"
          variant="outline"
          onClick={scrollPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/95 backdrop-blur-sm shadow-lg z-10"
          data-testid="swipe-prev"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}

      {canScrollNext && (
        <Button
          size="icon"
          variant="outline"
          onClick={scrollNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/95 backdrop-blur-sm shadow-lg z-10"
          data-testid="swipe-next"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}

      {/* Scroll Indicators */}
      <div className="flex justify-center gap-1.5 mt-4">
        {services.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 rounded-full transition-all ${
              index === 0 ? "w-6 bg-primary" : "w-1.5 bg-muted"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
