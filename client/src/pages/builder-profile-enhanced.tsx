import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useAccount } from "wagmi";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { OrderBookingDialog } from "@/components/order-booking-dialog";
import { SimilarBuilders } from "@/components/ai/SimilarBuilders";
import { PortfolioLightbox } from "@/components/PortfolioLightbox";
import { ReviewList } from "@/components/ReviewWithResponse";
import { GrantConsultingProfile } from "@/components/GrantConsultingProfile";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  Star,
  CheckCircle2,
  Clock,
  Twitter,
  ExternalLink,
  Package,
  MessageCircle,
  Heart,
  TrendingUp,
  Award,
  Zap,
  Eye,
  Users,
  Calendar,
  CircleDot,
  ShieldCheck,
  Coins,
  ArrowRight,
  Github,
  CheckCircle,
  Network,
} from "lucide-react";
import type { Builder, Service, Review, BuilderProject } from "@shared/schema";

export default function BuilderProfileEnhanced() {
  const [, params] = useRoute("/builder/:id");
  const builderId = params?.id;
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const { address } = useAccount();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  

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

  const { data: projects, isLoading: projectsLoading } = useQuery<BuilderProject[]>({
    queryKey: ["/api/builders", builderId, "projects"],
    enabled: !!builderId,
  });

  // Check if builder is favorited
  const { data: favoriteStatus } = useQuery<{ isFavorited: boolean }>({
    queryKey: ["/api/favorites", address, builderId, "check"],
    enabled: !!address && !!builderId,
  });

  // Save/Unsave builder mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!address || !builderId) {
        throw new Error("Wallet not connected");
      }

      if (favoriteStatus?.isFavorited) {
        // Unsave
        await apiRequest("DELETE", `/api/favorites/${address}/${builderId}`);
      } else {
        // Save
        await apiRequest("POST", "/api/favorites", {
          userId: address,
          builderId,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites", address, builderId, "check"] });
      toast({
        title: favoriteStatus?.isFavorited ? "Builder removed from favorites" : "Builder saved to favorites",
        description: favoriteStatus?.isFavorited 
          ? "You can find your saved builders in your profile" 
          : "Builder added to your favorites",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create chat thread and navigate to messages
  const sendMessageMutation = useMutation({
    mutationFn: async () => {
      if (!address || !builderId) {
        throw new Error("Wallet not connected");
      }

      const response = await apiRequest("POST", "/api/chat/threads", {
        clientId: address,
        builderId,
      });

      return await response.json();
    },
    onSuccess: (thread: any) => {
      setLocation(`/messages?thread=${thread.id}`);
      toast({
        title: "Message thread created",
        description: "Redirecting to messages...",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create message thread. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveBuilder = () => {
    if (!address) {
      toast({
        title: "Connect wallet",
        description: "Please connect your wallet to save builders",
        variant: "destructive",
      });
      return;
    }
    saveMutation.mutate();
  };

  const handleSendMessage = () => {
    if (!address) {
      toast({
        title: "Connect wallet",
        description: "Please connect your wallet to send messages",
        variant: "destructive",
      });
      return;
    }
    sendMessageMutation.mutate();
  };

  useEffect(() => {
    if (builderId) {
      fetch(`/api/builders/${builderId}/track-view`, {
        method: "POST"
      }).catch(() => {});
    }
  }, [builderId]);

  if (builderLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!builder) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-7xl px-4 py-16 text-center">
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

  // Check if specialized profile
  const isGrantConsulting = builder.category === 'grants-funding' || 
    builder.category === 'strategy-consulting' || 
    builder.category === 'documentation';

  if (isGrantConsulting) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <GrantConsultingProfile 
            builder={builder}
            services={services}
            reviews={reviews}
            servicesLoading={servicesLoading}
            reviewsLoading={reviewsLoading}
          />
        </div>
      </div>
    );
  }

  // Calculate rating as percentage for visual display
  const ratingPercentage = ((parseFloat(builder.rating || "5.0") / 5) * 100);
  const onTimeRate = parseFloat(builder.onTimeDeliveryRate || "100");
  const successRate = parseFloat(builder.successRate || "100");
  const responseRate = parseFloat(builder.responseRate || "100");

  // Get recent reviews for preview
  const recentReviews = reviews?.slice(0, 3) || [];

  // Get featured services
  const featuredServices = services?.slice(0, 2) || [];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Cover Image Banner */}
      {builder.coverImage && (
        <div className="relative h-64 w-full overflow-hidden bg-muted">
          <img
            src={builder.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      {/* Enhanced Hero Section */}
      <div className={`border-b bg-muted/30 ${builder.coverImage ? '-mt-24' : ''}`}>
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
            {/* Profile Image with Online Status */}
            <div className="relative">
              <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-xl">
                <AvatarImage src={builder.profileImage || undefined} alt={builder.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-4xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* Online Status Indicator */}
              {builder.isLive && (
                <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-chart-3 text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg">
                  <CircleDot className="h-3 w-3 animate-pulse" />
                  Online
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              {/* Name, Verification, and Badges */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight" data-testid="text-builder-name">
                    {builder.name}
                  </h1>
                  {builder.verified && (
                    <ShieldCheck className="h-7 w-7 text-chart-3 fill-chart-3/20" data-testid="icon-verified" />
                  )}
                  {builder.isChaptersMember && (
                    <Badge variant="secondary" className="gap-1.5 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20" data-testid="badge-chapters-enhanced">
                      <Network className="h-3.5 w-3.5" />
                      Chapters Member
                    </Badge>
                  )}
                  {builder.isTrending && (
                    <Badge variant="default" className="gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Trending
                    </Badge>
                  )}
                </div>

                <p className="text-lg md:text-xl text-muted-foreground">{builder.headline}</p>

                {/* Category and Token Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-sm">
                    {builder.category}
                  </Badge>
                  {builder.tokenTickers && builder.tokenTickers.length > 0 && (
                    <>
                      {builder.tokenTickers.slice(0, 4).map((ticker, i) => (
                        <Badge key={i} variant="outline" className="gap-1">
                          <Coins className="h-3 w-3" />
                          {ticker}
                        </Badge>
                      ))}
                    </>
                  )}
                </div>
              </div>

              {/* Key Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-chart-4 text-chart-4" />
                    <span className="font-bold text-lg">{builder.rating || "5.0"}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{builder.reviewCount} reviews</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="font-bold text-lg">{builder.completedProjects}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">completed</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-bold text-lg">{builder.responseTime}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">response time</p>
                </div>

                {builder.repeatClientsCount > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="font-bold text-lg">{builder.repeatClientsCount}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">repeat clients</p>
                  </div>
                )}
              </div>

              {/* Availability Status */}
              {builder.availability && (
                <div className="flex items-center gap-2 p-3 bg-chart-3/10 border border-chart-3/20 rounded-md">
                  <CheckCircle className="h-5 w-5 text-chart-3" />
                  <div>
                    <p className="font-semibold text-sm">{builder.availability === "available" ? "Available Now" : builder.availability}</p>
                    <p className="text-xs text-muted-foreground">Typically responds within {builder.responseTime}</p>
                  </div>
                </div>
              )}

              {/* Enhanced CTAs */}
              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="gap-2" data-testid="button-view-services">
                  <Package className="h-5 w-5" />
                  View Services
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="gap-2" 
                  onClick={handleSendMessage}
                  disabled={sendMessageMutation.isPending}
                  data-testid="button-send-message"
                >
                  <MessageCircle className="h-5 w-5" />
                  {sendMessageMutation.isPending ? "Creating chat..." : "Send Message"}
                </Button>
                <Button 
                  size="lg" 
                  variant={favoriteStatus?.isFavorited ? "default" : "ghost"} 
                  className="gap-2" 
                  onClick={handleSaveBuilder}
                  disabled={saveMutation.isPending}
                  data-testid="button-save-builder"
                >
                  <Heart className={`h-5 w-5 ${favoriteStatus?.isFavorited ? "fill-current" : ""}`} />
                  {saveMutation.isPending ? "Saving..." : favoriteStatus?.isFavorited ? "Saved" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 pt-8 md:pt-12 pb-16 md:pb-20">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle>About {builder.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {builder.description || builder.bio}
                </p>

                {builder.skills && builder.skills.length > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="font-semibold">Skills & Expertise</h3>
                      <div className="flex flex-wrap gap-2">
                        {builder.skills.map((skill, i) => (
                          <Badge key={i} variant="secondary">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Member Since */}
                {builder.memberSince && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Member since {new Date(builder.memberSince).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Portfolio Gallery Upfront */}
            {builder.portfolioMedia && builder.portfolioMedia.length > 0 && (
              <Card data-testid="section-portfolio">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-primary" />
                    Portfolio Showcase
                  </CardTitle>
                  <CardDescription>Recent work and creative projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {builder.portfolioMedia.slice(0, 6).map((media, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setLightboxIndex(i);
                          setLightboxOpen(true);
                        }}
                        className="aspect-video rounded-lg border hover-elevate overflow-hidden cursor-pointer group relative"
                        data-testid={`button-portfolio-${i}`}
                      >
                        <img
                          src={media}
                          alt={`Portfolio ${i + 1}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ))}
                  </div>
                  {builder.portfolioMedia.length > 6 && (
                    <Button variant="outline" className="w-full mt-4">
                      View All {builder.portfolioMedia.length} Portfolio Items
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Featured Services */}
            {featuredServices.length > 0 && (
              <Card data-testid="section-services">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Featured Services</CardTitle>
                      <CardDescription>Popular offerings from {builder.name}</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1">
                      View All
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {featuredServices.map((service) => (
                    <Card key={service.id} className="hover-elevate cursor-pointer" data-testid={`card-service-${service.id}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{service.title}</CardTitle>
                            <CardDescription className="line-clamp-2 mt-1">
                              {service.description}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Starting at</p>
                            <p className="text-2xl font-bold text-primary">${service.basicPrice}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {service.deliveryTime}
                            </span>
                          </div>
                          <Button size="sm" onClick={() => {
                            setSelectedService(service);
                            setBookingDialogOpen(true);
                          }}>
                            Book Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Reviews Preview */}
            {recentReviews.length > 0 && (
              <Card data-testid="section-reviews">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Client Reviews</CardTitle>
                      <CardDescription>{builder.reviewCount} verified reviews</CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1">
                      See All
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="space-y-2 pb-4 border-b last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-chart-4 text-chart-4"
                                  : "text-muted"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-semibold text-sm">{review.clientName}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">{review.comment}</p>
                      {review.projectTitle && (
                        <p className="text-xs text-muted-foreground">
                          Project: {review.projectTitle}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* FAQs Section */}
            {builder.faqs && builder.faqs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {builder.faqs.map((faq, i) => {
                    try {
                      const parsed = typeof faq === 'string' ? JSON.parse(faq) : faq;
                      return (
                        <div key={i} className="space-y-2">
                          <h4 className="font-semibold">{parsed.question}</h4>
                          <p className="text-sm text-muted-foreground">{parsed.answer}</p>
                        </div>
                      );
                    } catch {
                      return null;
                    }
                  })}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Enhanced Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Quality Rating</span>
                    <span className="font-bold">{builder.rating || "5.0"} / 5.0</span>
                  </div>
                  <Progress value={ratingPercentage} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">On-Time Delivery</span>
                    <span className="font-bold">{onTimeRate}%</span>
                  </div>
                  <Progress value={onTimeRate} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Success Rate</span>
                    <span className="font-bold">{successRate}%</span>
                  </div>
                  <Progress value={successRate} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Response Rate</span>
                    <span className="font-bold">{responseRate}%</span>
                  </div>
                  <Progress value={responseRate} className="h-2" />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{builder.activeOrders}</p>
                    <p className="text-xs text-muted-foreground">Active Orders</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{builder.profileViews}</p>
                    <p className="text-xs text-muted-foreground">Profile Views</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credentials & Badges */}
            {(builder.badges && builder.badges.length > 0) || builder.verificationBadges && builder.verificationBadges.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Credentials & Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {builder.verificationBadges && builder.verificationBadges.map((badge, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                      <ShieldCheck className="h-5 w-5 text-chart-3" />
                      <span className="text-sm font-medium">{badge}</span>
                    </div>
                  ))}
                  {builder.badges && builder.badges.map((badge, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                      <Award className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{badge}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Category-Specific Credentials */}
            {builder.category === "Development" && (builder.programmingLanguages || builder.githubProfile) && (
              <Card>
                <CardHeader>
                  <CardTitle>Technical Skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {builder.programmingLanguages && builder.programmingLanguages.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Languages</p>
                      <div className="flex flex-wrap gap-2">
                        {builder.programmingLanguages.map((lang, i) => (
                          <Badge key={i} variant="secondary">{lang}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {builder.blockchainFrameworks && builder.blockchainFrameworks.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Frameworks</p>
                      <div className="flex flex-wrap gap-2">
                        {builder.blockchainFrameworks.map((framework, i) => (
                          <Badge key={i} variant="outline">{framework}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {builder.githubProfile && (
                    <Button variant="outline" className="w-full gap-2" asChild>
                      <a href={builder.githubProfile} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                        View GitHub
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Social Links */}
            {(builder.twitterHandle || builder.linkedinProfile || builder.websiteUrl) && (
              <Card>
                <CardHeader>
                  <CardTitle>Connect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {builder.twitterHandle && (
                    <Button variant="outline" className="w-full gap-2 justify-start" asChild>
                      <a href={`https://twitter.com/${builder.twitterHandle}`} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-4 w-4" />
                        Twitter
                        <ExternalLink className="h-3 w-3 ml-auto" />
                      </a>
                    </Button>
                  )}
                  {builder.linkedinProfile && (
                    <Button variant="outline" className="w-full gap-2 justify-start" asChild>
                      <a href={builder.linkedinProfile} target="_blank" rel="noopener noreferrer">
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                        LinkedIn
                        <ExternalLink className="h-3 w-3 ml-auto" />
                      </a>
                    </Button>
                  )}
                  {builder.websiteUrl && (
                    <Button variant="outline" className="w-full gap-2 justify-start" asChild>
                      <a href={builder.websiteUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        Website
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Similar Builders */}
        <div className="mt-12">
          <SimilarBuilders builderId={builderId!} />
        </div>
      </div>

      {/* Dialogs */}
      {selectedService && (
        <OrderBookingDialog
          open={bookingDialogOpen}
          onOpenChange={setBookingDialogOpen}
          service={selectedService}
          builder={builder}
        />
      )}

      {builder.portfolioMedia && (
        <PortfolioLightbox
          items={builder.portfolioMedia.map(url => ({ url, type: "image" as const }))}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          initialIndex={lightboxIndex}
        />
      )}
    </div>
  );
}
