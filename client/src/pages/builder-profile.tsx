import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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
import { SimilarBuilders } from "@/components/ai/SimilarBuilders";
import { VideoIntroduction } from "@/components/VideoIntroduction";
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
  Instagram,
  Youtube,
  Send,
  TrendingUp,
  Users,
  Eye,
  Code,
  Github,
  FileCheck,
  BarChart3,
  Target,
  DollarSign,
  Zap,
  Shield,
  PlayCircle,
  ImageIcon,
} from "lucide-react";
import type { Builder, Service, Review, BuilderProject } from "@shared/schema";

export default function BuilderProfile() {
  const [, params] = useRoute("/builder/:id");
  const builderId = params?.id;
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  const servicesSection = useScrollReveal();
  const reviewsSection = useScrollReveal();
  const projectsSection = useScrollReveal();

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

  useEffect(() => {
    if (builderId) {
      fetch(`/api/builders/${builderId}/track-view`, {
        method: "POST"
      }).catch(() => {
        // Silently fail view tracking
      });
    }
  }, [builderId]);

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

  // Check if this is a grant/consulting agency profile (special layout)
  const isGrantConsulting = builder.category === 'grants-funding' || 
    builder.category === 'strategy-consulting' || 
    builder.category === 'documentation';

  // Render specialized layout for grant consultants
  if (isGrantConsulting) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
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

  // Default builder profile layout
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
          <TabsList className="grid w-full max-w-3xl grid-cols-5">
            <TabsTrigger value="about" data-testid="tab-about">About</TabsTrigger>
            <TabsTrigger value="portfolio" data-testid="tab-portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="projects" data-testid="tab-projects">
              Projects ({projects?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="services" data-testid="tab-services">
              Services ({services?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="reviews" data-testid="tab-reviews">
              Reviews ({builder.reviewCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            {builder.videoIntroUrl && (
              <VideoIntroduction
                videoUrl={builder.videoIntroUrl}
                builderName={builder.name}
              />
            )}

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
                <CardTitle>Stats & Metrics</CardTitle>
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
                  
                  {builder.category === "KOLs" && (
                    <>
                      {builder.twitterFollowers && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Twitter className="h-3 w-3" /> Twitter Followers
                          </p>
                          <p className="text-2xl font-bold">{builder.twitterFollowers.toLocaleString()}</p>
                        </div>
                      )}
                      {builder.instagramFollowers && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Instagram className="h-3 w-3" /> Instagram Followers
                          </p>
                          <p className="text-2xl font-bold">{builder.instagramFollowers.toLocaleString()}</p>
                        </div>
                      )}
                      {builder.engagementRate && (
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> Engagement Rate
                          </p>
                          <p className="text-2xl font-bold">{builder.engagementRate}%</p>
                        </div>
                      )}
                    </>
                  )}
                  
                  {builder.category === "Marketing" && builder.avgROI && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Target className="h-3 w-3" /> Average ROI
                      </p>
                      <p className="text-2xl font-bold text-chart-3">{builder.avgROI}%</p>
                    </div>
                  )}
                  
                  {builder.category === "Development" && builder.deployedContracts && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Code className="h-3 w-3" /> Deployed Contracts
                      </p>
                      <p className="text-2xl font-bold">{builder.deployedContracts}</p>
                    </div>
                  )}
                  
                  {builder.category === "Volume" && builder.tradingExperience && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <BarChart3 className="h-3 w-3" /> Years Trading
                      </p>
                      <p className="text-2xl font-bold">{builder.tradingExperience}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="portfolio" className="space-y-6">
            {builder.category === "KOLs" && (
              <Card>
                <CardHeader>
                  <CardTitle>Social Presence & Influence</CardTitle>
                  <CardDescription>Verified reach across multiple platforms</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {builder.twitterHandle && (
                      <div className="flex items-start gap-3 p-4 rounded-md border">
                        <Twitter className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1 space-y-1">
                          <p className="font-semibold">Twitter</p>
                          <p className="text-sm text-muted-foreground">@{builder.twitterHandle}</p>
                          <p className="text-lg font-bold">{builder.twitterFollowers?.toLocaleString()} followers</p>
                        </div>
                      </div>
                    )}
                    {builder.instagramHandle && (
                      <div className="flex items-start gap-3 p-4 rounded-md border">
                        <Instagram className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1 space-y-1">
                          <p className="font-semibold">Instagram</p>
                          <p className="text-sm text-muted-foreground">@{builder.instagramHandle}</p>
                          <p className="text-lg font-bold">{builder.instagramFollowers?.toLocaleString()} followers</p>
                        </div>
                      </div>
                    )}
                    {builder.youtubeChannel && (
                      <div className="flex items-start gap-3 p-4 rounded-md border">
                        <Youtube className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1 space-y-1">
                          <p className="font-semibold">YouTube</p>
                          <p className="text-sm text-muted-foreground">{builder.youtubeChannel}</p>
                          <p className="text-lg font-bold">{builder.youtubeSubscribers?.toLocaleString()} subscribers</p>
                        </div>
                      </div>
                    )}
                    {builder.telegramHandle && (
                      <div className="flex items-start gap-3 p-4 rounded-md border">
                        <Send className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex-1 space-y-1">
                          <p className="font-semibold">Telegram</p>
                          <p className="text-sm text-muted-foreground">@{builder.telegramHandle}</p>
                          <p className="text-lg font-bold">{builder.telegramMembers?.toLocaleString()} members</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {(builder.engagementRate || builder.audienceDemographics) && (
                    <>
                      <Separator />
                      <div className="grid gap-4 sm:grid-cols-2">
                        {builder.engagementRate && (
                          <div className="space-y-2">
                            <p className="text-sm font-semibold flex items-center gap-1">
                              <TrendingUp className="h-4 w-4" /> Engagement Rate
                            </p>
                            <p className="text-3xl font-bold text-chart-3">{builder.engagementRate}%</p>
                          </div>
                        )}
                        {builder.audienceDemographics && (
                          <div className="space-y-2">
                            <p className="text-sm font-semibold flex items-center gap-1">
                              <Users className="h-4 w-4" /> Audience
                            </p>
                            <p className="text-sm text-muted-foreground">{builder.audienceDemographics}</p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  
                  {builder.contentNiches && builder.contentNiches.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">Content Niches</p>
                        <div className="flex flex-wrap gap-2">
                          {builder.contentNiches.map((niche, i) => (
                            <Badge key={i} variant="secondary">{niche}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  
                  {builder.brandPartnerships && builder.brandPartnerships.length > 0 && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">Brand Partnerships</p>
                        <div className="flex flex-wrap gap-2">
                          {builder.brandPartnerships.map((brand, i) => (
                            <Badge key={i} variant="outline">{brand}</Badge>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
            
            {builder.category === "3D Content" && (
              <>
                {(builder.portfolioMedia && builder.portfolioMedia.length > 0) || builder.videoShowreel ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Visual Portfolio</CardTitle>
                      <CardDescription>Showcasing previous work and creative capabilities</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {builder.videoShowreel && (
                        <div className="space-y-2">
                          <p className="text-sm font-semibold flex items-center gap-1">
                            <PlayCircle className="h-4 w-4" /> Video Showreel
                          </p>
                          <a
                            href={builder.videoShowreel}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:underline"
                          >
                            <ExternalLink className="h-4 w-4" />
                            View Showreel
                          </a>
                        </div>
                      )}
                      
                      {builder.portfolioMedia && builder.portfolioMedia.length > 0 && (
                        <>
                          <Separator />
                          <div className="space-y-2">
                            <p className="text-sm font-semibold flex items-center gap-1">
                              <ImageIcon className="h-4 w-4" /> Portfolio Media
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {builder.portfolioMedia.map((media, i) => (
                                <button
                                  key={i}
                                  onClick={() => {
                                    setLightboxIndex(i);
                                    setLightboxOpen(true);
                                  }}
                                  className="aspect-video rounded-md border hover-elevate overflow-hidden cursor-pointer"
                                  data-testid={`button-portfolio-${i}`}
                                  aria-label={`View portfolio image ${i + 1}`}
                                >
                                  <img
                                    src={media}
                                    alt={`Portfolio ${i + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <PortfolioLightbox
                            items={builder.portfolioMedia.map((url) => ({ url, type: "image" }))}
                            initialIndex={lightboxIndex}
                            isOpen={lightboxOpen}
                            onClose={() => setLightboxOpen(false)}
                          />
                        </>
                      )}
                    </CardContent>
                  </Card>
                ) : null}
                
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Skills</CardTitle>
                    <CardDescription>Software and expertise</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {builder.software3D && builder.software3D.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">3D Software</p>
                        <div className="flex flex-wrap gap-2">
                          {builder.software3D.map((software, i) => (
                            <Badge key={i} variant="secondary">{software}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {builder.renderEngines && builder.renderEngines.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">Render Engines</p>
                        <div className="flex flex-wrap gap-2">
                          {builder.renderEngines.map((engine, i) => (
                            <Badge key={i} variant="outline">{engine}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {builder.styleSpecialties && builder.styleSpecialties.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">Style Specialties</p>
                        <div className="flex flex-wrap gap-2">
                          {builder.styleSpecialties.map((style, i) => (
                            <Badge key={i}>{style}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {builder.animationExpertise && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">Animation Expertise</p>
                        <p className="text-sm text-muted-foreground">{builder.animationExpertise}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            )}
            
            {builder.category === "Marketing" && (
              <Card>
                <CardHeader>
                  <CardTitle>Marketing Expertise</CardTitle>
                  <CardDescription>Platforms, strategies, and proven results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {builder.avgROI && (
                    <div className="flex items-center gap-3 p-4 rounded-md border bg-chart-3/10">
                      <Target className="h-8 w-8 text-chart-3" />
                      <div>
                        <p className="text-sm text-muted-foreground">Average ROI Delivered</p>
                        <p className="text-3xl font-bold text-chart-3">{builder.avgROI}%</p>
                      </div>
                    </div>
                  )}
                  
                  {builder.marketingPlatforms && builder.marketingPlatforms.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Marketing Platforms</p>
                      <div className="flex flex-wrap gap-2">
                        {builder.marketingPlatforms.map((platform, i) => (
                          <Badge key={i} variant="secondary">{platform}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {builder.growthStrategies && builder.growthStrategies.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Growth Strategies</p>
                      <div className="flex flex-wrap gap-2">
                        {builder.growthStrategies.map((strategy, i) => (
                          <Badge key={i}>{strategy}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {builder.clientIndustries && builder.clientIndustries.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Client Industries</p>
                      <div className="flex flex-wrap gap-2">
                        {builder.clientIndustries.map((industry, i) => (
                          <Badge key={i} variant="outline">{industry}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {builder.category === "Development" && (
              <Card>
                <CardHeader>
                  <CardTitle>Development Expertise</CardTitle>
                  <CardDescription>Languages, frameworks, and blockchain experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {builder.githubProfile && (
                    <div className="flex items-center gap-3 p-4 rounded-md border">
                      <Github className="h-6 w-6" />
                      <div className="flex-1">
                        <p className="font-semibold">GitHub Profile</p>
                        <a
                          href={builder.githubProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          {builder.githubProfile.replace("https://github.com/", "")}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    {builder.deployedContracts && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Code className="h-3 w-3" /> Deployed Contracts
                        </p>
                        <p className="text-2xl font-bold">{builder.deployedContracts}</p>
                      </div>
                    )}
                  </div>
                  
                  {builder.programmingLanguages && builder.programmingLanguages.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Programming Languages</p>
                      <div className="flex flex-wrap gap-2">
                        {builder.programmingLanguages.map((lang, i) => (
                          <Badge key={i} variant="secondary">{lang}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {builder.blockchainFrameworks && builder.blockchainFrameworks.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">Blockchain Frameworks</p>
                      <div className="flex flex-wrap gap-2">
                        {builder.blockchainFrameworks.map((framework, i) => (
                          <Badge key={i}>{framework}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {builder.certifications && builder.certifications.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold flex items-center gap-1">
                        <FileCheck className="h-4 w-4" /> Certifications
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {builder.certifications.map((cert, i) => (
                          <Badge key={i} variant="outline">{cert}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {builder.auditReports && builder.auditReports.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold flex items-center gap-1">
                        <Shield className="h-4 w-4" /> Security Audits
                      </p>
                      <div className="space-y-1">
                        {builder.auditReports.map((audit, i) => (
                          <a
                            key={i}
                            href={audit}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View Audit Report {i + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {builder.category === "Volume" && (
              <Card>
                <CardHeader>
                  <CardTitle>Volume Trading Experience</CardTitle>
                  <CardDescription>Expertise, capabilities, and compliance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {builder.tradingExperience && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <BarChart3 className="h-3 w-3" /> Years of Experience
                        </p>
                        <p className="text-2xl font-bold">{builder.tradingExperience}</p>
                      </div>
                    )}
                    {builder.complianceKnowledge && (
                      <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-chart-3" />
                        <div>
                          <p className="text-sm font-semibold">Compliance Knowledge</p>
                          <p className="text-xs text-muted-foreground">Regulatory aware</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {builder.volumeCapabilities && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold flex items-center gap-1">
                        <Zap className="h-4 w-4" /> Volume Capabilities
                      </p>
                      <p className="text-sm text-muted-foreground">{builder.volumeCapabilities}</p>
                    </div>
                  )}
                  
                  {builder.dexExpertise && builder.dexExpertise.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">DEX Expertise</p>
                      <div className="flex flex-wrap gap-2">
                        {builder.dexExpertise.map((dex, i) => (
                          <Badge key={i} variant="secondary">{dex}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {builder.cexExpertise && builder.cexExpertise.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold">CEX Expertise</p>
                      <div className="flex flex-wrap gap-2">
                        {builder.cexExpertise.map((cex, i) => (
                          <Badge key={i}>{cex}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {builder.volumeProof && builder.volumeProof.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold flex items-center gap-1">
                        <FileCheck className="h-4 w-4" /> Volume Proof
                      </p>
                      <div className="space-y-1">
                        {builder.volumeProof.map((proof, i) => (
                          <a
                            key={i}
                            href={proof}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            View Proof {i + 1}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            
            {(!builder.category || !["KOLs", "3D Content", "Marketing", "Development", "Volume"].includes(builder.category)) && (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">Portfolio information not available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            {projectsLoading ? (
              <div className="grid gap-6">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            ) : projects && projects.length > 0 ? (
              <div className="grid gap-6">
                {projects.map((project) => (
                  <Card key={project.id} data-testid={`card-project-${project.id}`}>
                    <CardHeader>
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="space-y-1">
                          <CardTitle className="text-xl">{project.title}</CardTitle>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            {project.clientName && <span>{project.clientName}</span>}
                            {project.clientName && <span>•</span>}
                            <span>{project.projectDate}</span>
                          </div>
                        </div>
                        <Badge variant="secondary">{project.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <p className="text-muted-foreground">{project.description}</p>
                      
                      {project.results && project.results.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-semibold">Key Results</p>
                          <ul className="space-y-1">
                            {project.results.map((result, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircle2 className="h-4 w-4 text-chart-3 mt-0.5 flex-shrink-0" />
                                {result}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {(project.twitterReach || project.engagementGenerated || project.followersGained || project.roiPercentage || project.revenueGenerated || project.volumeDelivered) && (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {project.twitterReach && (
                            <div className="space-y-1 p-3 rounded-md border">
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Eye className="h-3 w-3" /> Twitter Reach
                              </p>
                              <p className="text-xl font-bold">{project.twitterReach.toLocaleString()}</p>
                            </div>
                          )}
                          {project.engagementGenerated && (
                            <div className="space-y-1 p-3 rounded-md border">
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" /> Engagement
                              </p>
                              <p className="text-xl font-bold">{project.engagementGenerated.toLocaleString()}</p>
                            </div>
                          )}
                          {project.followersGained && (
                            <div className="space-y-1 p-3 rounded-md border">
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Users className="h-3 w-3" /> Followers Gained
                              </p>
                              <p className="text-xl font-bold">{project.followersGained.toLocaleString()}</p>
                            </div>
                          )}
                          {project.roiPercentage && (
                            <div className="space-y-1 p-3 rounded-md border bg-chart-3/10">
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Target className="h-3 w-3" /> ROI
                              </p>
                              <p className="text-xl font-bold text-chart-3">{project.roiPercentage}%</p>
                            </div>
                          )}
                          {project.revenueGenerated && (
                            <div className="space-y-1 p-3 rounded-md border">
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <DollarSign className="h-3 w-3" /> Revenue Generated
                              </p>
                              <p className="text-xl font-bold">${parseFloat(project.revenueGenerated).toLocaleString()}</p>
                            </div>
                          )}
                          {project.volumeDelivered && (
                            <div className="space-y-1 p-3 rounded-md border">
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <BarChart3 className="h-3 w-3" /> Volume Delivered
                              </p>
                              <p className="text-xl font-bold">${parseFloat(project.volumeDelivered).toLocaleString()}</p>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {project.mediaUrls && project.mediaUrls.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-semibold">Project Media</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {project.mediaUrls.map((url, i) => (
                              <a
                                key={i}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="aspect-video rounded-md border hover-elevate overflow-hidden"
                              >
                                <img
                                  src={url}
                                  alt={`Project media ${i + 1}`}
                                  className="w-full h-full object-cover"
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {(project.liveUrl || project.contractAddress) && (
                        <div className="flex flex-wrap gap-3">
                          {project.liveUrl && (
                            <Button variant="outline" size="sm" asChild className="hover-elevate">
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View Live Project
                              </a>
                            </Button>
                          )}
                          {project.contractAddress && (
                            <Button variant="outline" size="sm" asChild className="hover-elevate">
                              <a href={`https://etherscan.io/address/${project.contractAddress}`} target="_blank" rel="noopener noreferrer">
                                <Code className="h-3 w-3 mr-1" />
                                View Contract
                              </a>
                            </Button>
                          )}
                        </div>
                      )}
                      
                      {project.testimonial && (
                        <div className="p-4 rounded-md border bg-muted/30">
                          <p className="text-sm italic text-muted-foreground mb-2">"{project.testimonial}"</p>
                          {project.testimonialAuthor && (
                            <p className="text-xs font-semibold">— {project.testimonialAuthor}</p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No previous projects showcased yet</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            {servicesLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            ) : services && services.length > 0 ? (
              <div ref={servicesSection.ref as any} className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${servicesSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}>
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
            ) : (
              <div ref={reviewsSection.ref as any} className={`${reviewsSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}>
                <ReviewList
                  reviews={reviews || []}
                  builderId={builderId}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <SimilarBuilders builderId={builderId!} />
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
