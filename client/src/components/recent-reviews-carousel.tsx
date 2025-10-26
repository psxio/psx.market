import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect } from "react";

interface Review {
  id: string;
  rating: number;
  comment: string;
  clientName: string;
  projectTokenTicker: string | null;
  createdAt: string;
}

interface Builder {
  id: string;
  name: string;
  profileImage: string | null;
  category: string;
}

interface Service {
  id: string;
  title: string;
}

interface ReviewWithDetails {
  review: Review;
  builder: Builder | null;
  service: Service | null;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const days = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function RecentReviewsCarousel() {
  const { data: reviews = [], isLoading } = useQuery<ReviewWithDetails[]>({
    queryKey: ['/api/reviews/highlights'],
    refetchInterval: 60000, // Refresh every minute
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: 'start',
      containScroll: 'trimSnaps',
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 768px)': { slidesToScroll: 2 },
        '(min-width: 1024px)': { slidesToScroll: 3 }
      }
    },
    [Autoplay({ delay: 4000, stopOnInteraction: false })]
  );

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit();
    }
  }, [emblaApi, reviews]);

  if (isLoading || reviews.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Recent Reviews</h2>
          <p className="text-sm text-muted-foreground mt-1">
            What clients are saying about our builders
          </p>
        </div>
        <Badge variant="secondary" className="gap-2">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span>5.0 Average</span>
        </Badge>
      </div>

      <div className="overflow-hidden" ref={emblaRef} data-testid="container-reviews-carousel">
        <div className="flex gap-4">
          {reviews.map(({ review, builder, service }) => (
            <motion.div
              key={review.id}
              className="flex-[0_0_100%] min-w-0 md:flex-[0_0_calc(50%-0.5rem)] lg:flex-[0_0_calc(33.333%-0.667rem)]"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card 
                className="h-full hover-elevate transition-all"
                data-testid={`card-review-${review.id}`}
              >
                <CardContent className="p-6">
                  {/* Rating & Time */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-4 h-4 fill-yellow-400 text-yellow-400" 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(review.createdAt)}
                    </span>
                  </div>

                  {/* Review Comment */}
                  <p className="text-sm text-foreground mb-4 line-clamp-3">
                    {review.comment}
                  </p>

                  {/* Service & Token */}
                  {service && (
                    <div className="mb-4">
                      <p className="text-xs text-muted-foreground mb-1">Service:</p>
                      <p className="text-sm font-medium text-foreground line-clamp-1">
                        {service.title}
                      </p>
                      {review.projectTokenTicker && (
                        <Badge 
                          variant="secondary" 
                          className="mt-2 text-xs"
                        >
                          {review.projectTokenTicker}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Client Info */}
                  <div className="flex items-center gap-3 pt-4 border-t">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="" alt={review.clientName} />
                      <AvatarFallback className="text-xs bg-primary/10 text-primary">
                        {getInitials(review.clientName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {review.clientName}
                      </p>
                      {builder && (
                        <p className="text-xs text-muted-foreground truncate">
                          hired {builder.name}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Navigation hint */}
      <div className="flex justify-center mt-4 gap-2">
        {reviews.slice(0, Math.min(5, reviews.length)).map((_, idx) => (
          <div 
            key={idx} 
            className="w-2 h-2 rounded-full bg-muted-foreground/30"
          />
        ))}
      </div>
    </div>
  );
}
