import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, CheckCircle2, Clock, Users, Sparkles, Code, TrendingUp, BarChart3, X, Palette, Music, Network } from "lucide-react";
import type { Builder, Service } from "@shared/schema";

interface BuilderCardProps {
  builder: Builder;
  service?: Service;
}

const categoryVisuals = {
  "KOLs & Influencers": {
    icon: Users,
    gradient: "from-purple-500/20 via-pink-500/20 to-red-500/20",
    borderColor: "border-l-purple-500",
    patternClass: "kol-pattern",
    badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/20"
  },
  "3D Content Creation": {
    icon: Sparkles,
    gradient: "from-cyan-500/20 via-blue-500/20 to-indigo-500/20",
    borderColor: "border-l-cyan-500",
    patternClass: "pattern-3d",
    badgeColor: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20"
  },
  "Marketing & Growth": {
    icon: TrendingUp,
    gradient: "from-green-500/20 via-emerald-500/20 to-teal-500/20",
    borderColor: "border-l-green-500",
    patternClass: "marketing-pattern",
    badgeColor: "bg-green-500/10 text-green-500 border-green-500/20"
  },
  "Script Development": {
    icon: Code,
    gradient: "from-blue-500/20 via-indigo-500/20 to-violet-500/20",
    borderColor: "border-l-blue-500",
    patternClass: "dev-pattern",
    badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20"
  },
  "Volume Services": {
    icon: BarChart3,
    gradient: "from-orange-500/20 via-amber-500/20 to-yellow-500/20",
    borderColor: "border-l-orange-500",
    patternClass: "volume-pattern",
    badgeColor: "bg-orange-500/10 text-orange-500 border-orange-500/20"
  },
  "Creative & Design": {
    icon: Palette,
    gradient: "from-pink-500/20 via-rose-500/20 to-red-500/20",
    borderColor: "border-l-pink-500",
    patternClass: "creative-pattern",
    badgeColor: "bg-pink-500/10 text-pink-500 border-pink-500/20"
  },
  "Audio & Production": {
    icon: Music,
    gradient: "from-violet-500/20 via-purple-500/20 to-fuchsia-500/20",
    borderColor: "border-l-violet-500",
    patternClass: "audio-pattern",
    badgeColor: "bg-violet-500/10 text-violet-500 border-violet-500/20"
  },
  "Connectors & Network": {
    icon: Network,
    gradient: "from-teal-500/20 via-cyan-500/20 to-blue-500/20",
    borderColor: "border-l-teal-500",
    patternClass: "network-pattern",
    badgeColor: "bg-teal-500/10 text-teal-500 border-teal-500/20"
  }
};

const isVideoUrl = (url: string): boolean => {
  return /\.(mp4|webm|ogg|mov)$/i.test(url);
};

const isAudioUrl = (url: string): boolean => {
  return /\.(mp3|wav|ogg|m4a)$/i.test(url);
};

const isPartnerData = (url: string): boolean => {
  return url.startsWith('partner:');
};

const getPartnerName = (url: string): string => {
  return url.replace('partner:', '');
};

export function BuilderCard({ builder, service }: BuilderCardProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Handle services without assigned builder - show as generic service card
  if (!builder && service) {
    const categoryKey = service.category as keyof typeof categoryVisuals;
    const visual = categoryVisuals[categoryKey] || categoryVisuals["Script Development"];
    const CategoryIcon = visual.icon;

    return (
      <Link href={`/marketplace?categories=${encodeURIComponent(service.category)}`}>
        <Card 
          className={`group hover-elevate active-elevate-2 hover-lift h-full cursor-pointer overflow-visible transition-all border-l-4 ${visual.borderColor}`}
          data-testid={`card-service-${service.id}`}
        >
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${visual.patternClass}`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${visual.gradient} animate-gradient`} />
          </div>

          <div className="absolute top-3 right-3 z-10">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${visual.badgeColor} backdrop-blur-sm border transition-all duration-300 group-hover:scale-125 group-hover:rotate-12`}>
              <CategoryIcon className="h-4 w-4" />
            </div>
          </div>

          <div className="relative z-[1]">
            <CardHeader className="space-y-0 pb-3">
              <div className="flex items-start justify-between gap-4 pr-10">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline">{service.category}</Badge>
                    {service.tokenTickers && service.tokenTickers.length > 0 && (
                      <>
                        {service.tokenTickers.slice(0, 3).map((ticker, idx) => (
                          <Badge 
                            key={idx}
                            variant="secondary" 
                            className="bg-primary/10 text-primary border-primary/20 font-mono text-xs"
                            data-testid={`token-ticker-${idx}`}
                          >
                            {ticker}
                          </Badge>
                        ))}
                        {service.tokenTickers.length > 3 && (
                          <Badge variant="secondary" className="text-xs font-mono">
                            +{service.tokenTickers.length - 3}
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            {service.portfolioMedia && service.portfolioMedia.length > 0 && (
              <div className="px-6 pb-3 relative">
                {isPartnerData(service.portfolioMedia[0]) ? (
                  // Partner grid layout
                  <div className="grid grid-cols-4 gap-2">
                    {service.portfolioMedia.slice(0, 8).map((mediaUrl, index) => {
                      const partnerName = getPartnerName(mediaUrl);
                      return (
                        <div 
                          key={index}
                          className="flex items-center justify-center p-3 rounded-lg bg-muted/50 border border-border hover-elevate active-elevate-2 transition-all"
                          data-testid={`partner-${index}`}
                        >
                          <span className="text-xs font-medium text-center line-clamp-2">
                            {partnerName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Regular media grid (images, videos, audio)
                  <div className="grid grid-cols-2 gap-2">
                    {service.portfolioMedia.slice(0, 4).map((mediaUrl, index) => {
                      const isVideo = isVideoUrl(mediaUrl);
                      const isAudio = isAudioUrl(mediaUrl);
                      const isHovered = hoveredIndex === index;
                      return (
                        <div 
                          key={index} 
                          className={`relative aspect-video rounded-md bg-muted transition-all duration-300 ${
                            isHovered 
                              ? 'scale-150 z-50 shadow-2xl ring-2 ring-primary' 
                              : 'scale-100 z-10'
                          }`}
                          style={{
                            transformOrigin: index === 0 ? 'top left' : index === 1 ? 'top right' : index === 2 ? 'bottom left' : 'bottom right'
                          }}
                          data-testid={`preview-${index}`}
                          onMouseEnter={(e) => {
                            e.stopPropagation();
                            setHoveredIndex(index);
                            // Auto-play audio on hover (wrapped in try-catch for browser restrictions)
                            if (isAudio) {
                              const audioEl = e.currentTarget.querySelector('audio') as HTMLAudioElement;
                              if (audioEl) {
                                audioEl.currentTime = 0;
                                audioEl.play().catch(() => {
                                  // Browser blocked autoplay - this is expected behavior
                                });
                              }
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.stopPropagation();
                            setHoveredIndex(null);
                            // Pause audio on hover out
                            if (isAudio) {
                              const audioEl = e.currentTarget.querySelector('audio') as HTMLAudioElement;
                              if (audioEl) {
                                audioEl.pause();
                                audioEl.currentTime = 0;
                              }
                            }
                          }}
                        >
                          <div className="w-full h-full rounded-md overflow-hidden">
                            {isVideo ? (
                              <video
                                src={mediaUrl}
                                className="w-full h-full object-cover"
                                autoPlay={isHovered}
                                loop
                                muted
                                playsInline
                                data-testid={`video-thumbnail-${index}`}
                              />
                            ) : isAudio ? (
                              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 p-4">
                                <Music className={`h-8 w-8 mb-2 transition-all duration-300 ${isHovered ? 'text-primary animate-pulse' : 'text-muted-foreground'}`} />
                                <span className="text-xs text-center font-medium">
                                  {isHovered ? 'Playing...' : 'Hover to Play'}
                                </span>
                                <audio src={mediaUrl} preload="auto" />
                              </div>
                            ) : (
                              <img 
                                src={mediaUrl} 
                                alt={`${service.title} preview ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {service.portfolioMedia.length > (isPartnerData(service.portfolioMedia[0]) ? 8 : 4) && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    +{service.portfolioMedia.length - (isPartnerData(service.portfolioMedia[0]) ? 8 : 4)} more
                  </p>
                )}
              </div>
            )}

            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Starting at</span>
                <span className="font-semibold text-lg">${service.basicPrice}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-medium">{service.deliveryTime}</span>
              </div>
              <Button variant="default" className="w-full mt-2" size="sm" data-testid="button-view-service">
                View Service Details
              </Button>
            </CardContent>
          </div>
        </Card>
      </Link>
    );
  }

  // Handle null builder without service
  if (!builder) {
    return null;
  }

  const initials = builder.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const categoryKey = builder.category as keyof typeof categoryVisuals;
  const visual = categoryVisuals[categoryKey] || categoryVisuals["Script Development"];
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

            {builder.tokenTickers && builder.tokenTickers.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {builder.tokenTickers.slice(0, 4).map((ticker, idx) => (
                  <Badge 
                    key={idx}
                    variant="secondary" 
                    className="bg-primary/10 text-primary border-primary/20 font-mono text-xs"
                    data-testid={`builder-token-ticker-${idx}`}
                  >
                    {ticker}
                  </Badge>
                ))}
                {builder.tokenTickers.length > 4 && (
                  <Badge variant="secondary" className="text-xs font-mono">
                    +{builder.tokenTickers.length - 4}
                  </Badge>
                )}
              </div>
            )}
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
