import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderBookingDialog } from "@/components/order-booking-dialog";
import {
  Star,
  CheckCircle2,
  Clock,
  Twitter,
  ExternalLink,
  Package,
  MessageCircle,
} from "lucide-react";
import type { Builder, Service, Review } from "@shared/schema";

export default function BuilderProfile() {
  const [, params] = useRoute("/builder/:id");
  const builderId = params?.id;
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  const { data: builder, isLoading: builderLoading } = useQuery<Builder>({
    queryKey: ["/api/builders", builderId],
    enabled: !!builderId,
  });

  const { data: services, isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/builders", builderId, "services"],
    enabled: !!builderId,
  });

  const { data: reviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/builders", builderId, "reviews"],
    enabled: !!builderId,
  });

  if (builderLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!builder) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold">Builder not found</h1>
        </div>
      </div>
    );
  }

  const initials = builder.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="border-b bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
              <AvatarImage src={builder.profileImage || undefined} alt={builder.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight" data-testid="text-builder-name">
                    {builder.name}
                  </h1>
                  {builder.verified && (
                    <CheckCircle2 className="h-6 w-6 text-chart-3" data-testid="icon-verified" />
                  )}
                  <Badge variant="secondary" className="ml-2">
                    {builder.category}
                  </Badge>
                </div>
                <p className="text-lg text-muted-foreground">{builder.headline}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-chart-4 text-chart-4" />
                  <span className="font-semibold">{builder.rating || "5.0"}</span>
                  <span className="text-muted-foreground">
                    ({builder.reviewCount} reviews)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Responds in {builder.responseTime}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>{builder.completedProjects} projects completed</span>
                </div>
                {builder.twitterHandle && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Twitter className="h-4 w-4" />
                    <span>{builder.twitterFollowers?.toLocaleString()} followers</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {builder.skills?.map((skill, index) => (
                  <Badge key={index} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button className="gap-2" data-testid="button-contact-builder">
                  <MessageCircle className="h-4 w-4" />
                  Contact Builder
                </Button>
                {builder.twitterHandle && (
                  <Button variant="outline" className="gap-2 hover-elevate" asChild>
                    <a
                      href={`https://twitter.com/${builder.twitterHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="link-twitter"
                    >
                      <Twitter className="h-4 w-4" />
                      Twitter
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <Tabs defaultValue="about" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="about" data-testid="tab-about">About</TabsTrigger>
            <TabsTrigger value="services" data-testid="tab-services">
              Services ({services?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="reviews" data-testid="tab-reviews">
              Reviews ({builder.reviewCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{builder.bio}</p>

                {builder.portfolioLinks && builder.portfolioLinks.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="font-semibold">Portfolio</h3>
                      <div className="flex flex-col gap-2">
                        {builder.portfolioLinks.map((link, index) => (
                          <a
                            key={index}
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {link}
                          </a>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Projects Completed</p>
                    <p className="text-2xl font-bold">{builder.completedProjects}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                    <p className="text-2xl font-bold">{builder.rating || "5.0"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Response Time</p>
                    <p className="text-2xl font-bold">{builder.responseTime}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">PSX Tier</p>
                    <Badge variant="secondary" className="text-base">
                      {builder.psxTier}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            {servicesLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            ) : services && services.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((service) => (
                  <Card key={service.id} className="hover-elevate active-elevate-2" data-testid={`card-service-${service.id}`}>
                    <CardHeader>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-1.5">
                        {service.tags?.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Starting at</span>
                          <span className="text-xl font-bold">${service.basicPrice}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Delivery</span>
                          <span className="font-medium">{service.deliveryTime}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">PSX Required</span>
                          <span className="font-mono font-semibold text-chart-4">
                            {service.psxRequired}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full"
                        data-testid={`button-view-package-${service.id}`}
                        onClick={() => {
                          setSelectedService(service);
                          setBookingDialogOpen(true);
                        }}
                      >
                        Book Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No services listed yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {reviewsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : reviews && reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} data-testid={`card-review-${review.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-base">{review.clientName}</CardTitle>
                          {review.projectTitle && (
                            <CardDescription>{review.projectTitle}</CardDescription>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-chart-4 text-chart-4"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No reviews yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {selectedService && builder && (
        <OrderBookingDialog
          open={bookingDialogOpen}
          onOpenChange={setBookingDialogOpen}
          service={selectedService}
          builder={builder}
        />
      )}
    </div>
  );
}
