import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/header";
import { WelcomeModal } from "@/components/welcome-modal";
import { BuilderCard } from "@/components/builder-card";
import { ServiceCard } from "@/components/service-card";
import { SEOHead } from "@/components/seo-head";
import { LiveActivityTicker } from "@/components/live-activity-ticker";
import { RecentReviewsCarousel } from "@/components/recent-reviews-carousel";
import { GuestBrowseBanner } from "@/components/guest-browse-banner";
import { MobileStickyCTA } from "@/components/mobile-sticky-cta";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import {
  Megaphone,
  Box,
  TrendingUp,
  Code,
  BarChart3,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Handshake,
  Zap,
  Palette,
  Music,
  Boxes,
  Network,
  DollarSign,
  Gift,
  FileText,
  Coins,
  Lightbulb,
  Search,
  CheckCircle2,
  Layers,
  Shield,
  Clock,
  Briefcase,
  Star,
  MapPin,
  Award,
  User,
} from "lucide-react";
import type { Builder, Service } from "@shared/schema";

const serviceCategories = [
  { name: "3D Artists", slug: "3D Content Creation", icon: Boxes },
  { name: "Video Editors", slug: "Video Editing", icon: Music },
  { name: "Mods & Raiders", slug: "Mods & Raiders", icon: Shield },
  { name: "KOLs & Influencers", slug: "KOLs & Influencers", icon: Megaphone },
  { name: "Developers", slug: "Script Development", icon: Code },
  { name: "Marketing", slug: "Marketing & Growth", icon: TrendingUp },
  { name: "Graphic Design", slug: "Graphic Design", icon: Palette },
  { name: "Volume Services", slug: "Volume Services", icon: BarChart3 },
  { name: "Social Media", slug: "Social Media Management", icon: Network },
  { name: "Grants & Funding", slug: "grants-funding", icon: Coins },
  { name: "Strategy", slug: "Strategy Consulting", icon: Lightbulb },
  { name: "Documentation", slug: "Documentation & Paperwork", icon: FileText },
];

interface SearchSuggestion {
  type: "service" | "builder" | "category" | "recent" | "popular";
  label: string;
  value: string;
  searchQuery?: string;
  subtitle?: string;
  icon?: any;
}

export default function Home() {
  // Default to 3D Artists category
  const [selectedCategory, setSelectedCategory] = useState("3D Content Creation");
  
  // Search autocomplete state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();

  // Parallax refs
  const heroBackgroundRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const buildersContainerRef = useRef<HTMLDivElement>(null);

  // Add scroll listener for parallax effect with direct DOM manipulation
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          
          // Apply parallax transforms directly to DOM elements
          if (heroBackgroundRef.current) {
            heroBackgroundRef.current.style.transform = `translateY(${scrollY * 0.5}px)`;
          }
          if (heroContentRef.current) {
            heroContentRef.current.style.transform = `translateY(${-scrollY * 0.1}px)`;
          }
          if (buildersContainerRef.current) {
            buildersContainerRef.current.style.transform = `translateY(${-scrollY * 0.05}px)`;
          }
          
          ticking = false;
        });
        
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Call once to set initial position
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch top builders sorted by rating and completed projects
  const { data: topBuilders, isLoading: buildersLoading, isError: buildersError} = useQuery<Builder[]>({
    queryKey: ["/api/builders", "top"],
    queryFn: async () => {
      const params = new URLSearchParams({
        sortBy: "rating",
        limit: "12"
      });
      const response = await fetch(`/api/builders?${params.toString()}`, { credentials: "include" });
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
      return response.json();
    },
  });

  // Fetch services filtered by selected category
  const { data: filteredServices, isLoading: servicesLoading } = useQuery<Array<{ builder: Builder; service: Service }>>({
    queryKey: ["/api/services", selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory) {
        params.set("categories", selectedCategory);
      }
      const url = `/api/services${params.toString() ? `?${params.toString()}` : ""}`;
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
      return response.json();
    },
  });

  const agencySection = useScrollReveal();
  const benefitsSection = useScrollReveal();

  // Search suggestions (same as AutocompleteSearch component)
  const searchSuggestions: SearchSuggestion[] = [
    // Recent searches (shown when search is empty)
    ...(searchQuery.length === 0
      ? [
          { type: "recent" as const, label: "KOL Marketing", value: "kol", searchQuery: "KOL", icon: Clock },
          { type: "recent" as const, label: "Volume Trading", value: "volume", searchQuery: "Volume", icon: Clock },
          { type: "recent" as const, label: "Grants & Funding", value: "grants", searchQuery: "Grant", icon: Clock },
        ]
      : []),
    
    // KOL & Influencers
    ...(searchQuery.toLowerCase().includes("kol") || searchQuery.toLowerCase().includes("influencer") || searchQuery.toLowerCase().includes("marketing")
      ? [
          { type: "category" as const, label: "KOL & Influencer Services", value: "kol", searchQuery: "KOL", subtitle: "Marketing", icon: TrendingUp },
          { type: "service" as const, label: "KOL Management", value: "kol-management", searchQuery: "KOL Management", subtitle: "Marketing", icon: Briefcase },
        ]
      : []),
    
    // Volume Services
    ...(searchQuery.toLowerCase().includes("vol") || searchQuery.toLowerCase().includes("trading")
      ? [
          { type: "category" as const, label: "Volume Services", value: "volume", searchQuery: "Volume", subtitle: "Trading", icon: TrendingUp },
          { type: "service" as const, label: "Custom Volume Generation", value: "volume-gen", searchQuery: "Volume", subtitle: "Trading", icon: Briefcase },
        ]
      : []),
    
    // 3D & 2D Content Creation
    ...(searchQuery.toLowerCase().includes("3d") || searchQuery.toLowerCase().includes("2d") || searchQuery.toLowerCase().includes("design") || searchQuery.toLowerCase().includes("art") || searchQuery.toLowerCase().includes("character") || searchQuery.toLowerCase().includes("animation")
      ? [
          { type: "category" as const, label: "3D & 2D Content Creation", value: "3d", searchQuery: "3D", subtitle: "Design", icon: TrendingUp },
          { type: "service" as const, label: "3D Character Design", value: "3d-character", searchQuery: "3D Character", subtitle: "Design", icon: Briefcase },
        ]
      : []),
    
    // Grants & Funding
    ...(searchQuery.toLowerCase().includes("grant") || searchQuery.toLowerCase().includes("fund") || searchQuery.toLowerCase().includes("raise") || searchQuery.toLowerCase().includes("investment")
      ? [
          { type: "category" as const, label: "Grants & Funding", value: "grants", searchQuery: "Grant", subtitle: "Funding", icon: TrendingUp },
          { type: "service" as const, label: "Grant Application Support", value: "grant-app", searchQuery: "Grant", subtitle: "Funding", icon: Briefcase },
        ]
      : []),
    
    // Strategy & Consulting
    ...(searchQuery.toLowerCase().includes("strategy") || searchQuery.toLowerCase().includes("consult") || searchQuery.toLowerCase().includes("tokenomics") || searchQuery.toLowerCase().includes("advisor")
      ? [
          { type: "category" as const, label: "Strategy Consulting", value: "strategy", searchQuery: "Strategy", subtitle: "Consulting", icon: TrendingUp },
          { type: "service" as const, label: "Web3 Strategy Consulting", value: "strategy-consult", searchQuery: "Strategy Consulting", subtitle: "Consulting", icon: Briefcase },
        ]
      : []),
    
    // Documentation & Paperwork
    ...(searchQuery.toLowerCase().includes("doc") || searchQuery.toLowerCase().includes("paper") || searchQuery.toLowerCase().includes("whitepaper") || searchQuery.toLowerCase().includes("pitch") || searchQuery.toLowerCase().includes("deck")
      ? [
          { type: "category" as const, label: "Documentation & Paperwork", value: "documentation", searchQuery: "Documentation", subtitle: "Writing", icon: TrendingUp },
          { type: "service" as const, label: "Whitepaper Creation", value: "whitepaper", searchQuery: "Whitepaper", subtitle: "Documentation", icon: Briefcase },
        ]
      : []),
    
    // Script Development
    ...(searchQuery.toLowerCase().includes("dev") || searchQuery.toLowerCase().includes("code") || searchQuery.toLowerCase().includes("smart contract") || searchQuery.toLowerCase().includes("website") || searchQuery.toLowerCase().includes("app") || searchQuery.toLowerCase().includes("script")
      ? [
          { type: "category" as const, label: "Script Development", value: "development", searchQuery: "Development", subtitle: "Development", icon: TrendingUp },
          { type: "service" as const, label: "Smart Contract Development", value: "smart-contract", searchQuery: "Smart Contract", subtitle: "Development", icon: Briefcase },
        ]
      : []),
    
    // Social Media Management
    ...(searchQuery.toLowerCase().includes("social") || searchQuery.toLowerCase().includes("twitter") || searchQuery.toLowerCase().includes("tg") || searchQuery.toLowerCase().includes("telegram") || searchQuery.toLowerCase().includes("community") || searchQuery.toLowerCase().includes("discord")
      ? [
          { type: "category" as const, label: "Social Media Management", value: "social", searchQuery: "Social Media", subtitle: "Marketing", icon: TrendingUp },
          { type: "service" as const, label: "Community Management", value: "community", searchQuery: "Community Management", subtitle: "Marketing", icon: Briefcase },
        ]
      : []),
    
    // Graphic Design
    ...(searchQuery.toLowerCase().includes("graphic") || searchQuery.toLowerCase().includes("logo") || searchQuery.toLowerCase().includes("banner") || searchQuery.toLowerCase().includes("visual") || searchQuery.toLowerCase().includes("branding")
      ? [
          { type: "category" as const, label: "Graphic Design", value: "graphic", searchQuery: "Graphic Design", subtitle: "Design", icon: TrendingUp },
          { type: "service" as const, label: "Logo & Branding", value: "logo", searchQuery: "Logo Design", subtitle: "Design", icon: Briefcase },
        ]
      : []),
    
    // Marketing & Growth
    ...(searchQuery.toLowerCase().includes("market") || searchQuery.toLowerCase().includes("growth") || searchQuery.toLowerCase().includes("promo") || searchQuery.toLowerCase().includes("campaign")
      ? [
          { type: "category" as const, label: "Marketing & Growth", value: "marketing", searchQuery: "Marketing", subtitle: "Marketing", icon: TrendingUp },
          { type: "service" as const, label: "Marketing Campaign", value: "campaign", searchQuery: "Marketing Campaign", subtitle: "Marketing", icon: Briefcase },
        ]
      : []),
  ];

  const filteredSearchSuggestions = searchQuery.length > 0
    ? searchSuggestions.filter(
        (s) =>
          s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchSuggestions.slice(0, 5);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedSearchIndex(0);
  }, [searchQuery]);

  const handleSearch = (searchValue: string) => {
    if (searchValue.trim()) {
      setLocation(`/marketplace?search=${encodeURIComponent(searchValue)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearchOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedSearchIndex((prev) =>
          prev < filteredSearchSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedSearchIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredSearchSuggestions[selectedSearchIndex]) {
          const suggestion = filteredSearchSuggestions[selectedSearchIndex];
          handleSearch(suggestion.searchQuery || suggestion.label);
        } else {
          handleSearch(searchQuery);
        }
        break;
      case "Escape":
        setIsSearchOpen(false);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="port444 - Web3 Talent Marketplace | $CREATE & $PSX"
        description="Open Web3 marketplace connecting premium builders with memecoin and crypto projects. Hold $CREATE or $PSX tokens for 60% lower fees, priority support, and exclusive benefits."
        keywords="web3, marketplace, crypto, memecoin, builders, freelancers, KOLs, developers, $CREATE, $PSX, Base blockchain"
        ogType="website"
      />
      <Header />
      <WelcomeModal />
      <GuestBrowseBanner />
      <MobileStickyCTA />

      {/* Buy on Demand Hero */}
      <section className="relative border-b overflow-hidden bg-background">
        {/* Animated Mesh Gradient Background with Parallax */}
        <div ref={heroBackgroundRef} className="absolute inset-0 z-0" style={{ willChange: 'transform' }}>
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 dark:bg-primary/30 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/15 dark:bg-cyan-500/25 rounded-full blur-3xl animate-float-slower" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl animate-float" />
        </div>
        
        <div className="container relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:px-8">
          {/* Hero Content - Buy on Demand Style */}
          <div ref={heroContentRef} className="mx-auto max-w-5xl text-center space-y-6" style={{ willChange: 'transform' }}>

            <div className="flex items-center justify-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Buy on Demand
                <span className="block mt-2 bg-gradient-to-r from-primary via-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  Web3 Talent Marketplace
                </span>
              </h1>
              
              {/* Token Benefits Tooltip */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 border border-green-500/30 hover:bg-green-500/20 transition-all mt-2">
                      <Gift className="h-4 w-4 text-green-500" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-sm p-4">
                    <div className="space-y-2">
                      <p className="font-semibold text-sm flex items-center gap-2">
                        <Gift className="h-4 w-4 text-green-500" />
                        Token Holder Perks
                      </p>
                      <ul className="text-xs space-y-1 text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>60% lower fees (1% vs 2.5%)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Priority customer support</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Exclusive verified badges</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Early access to new features</span>
                        </li>
                      </ul>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              The open Web3 marketplace connecting premium builders with memecoin and crypto projects.
            </p>

            {/* Prominent Search Bar - Functional Autocomplete */}
            <div className="max-w-3xl mx-auto relative">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search for any service..."
                  className="w-full h-16 pl-6 pr-24 rounded-lg border-2 border-border bg-card text-base text-foreground placeholder:text-muted-foreground shadow-lg hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  data-testid="input-homepage-search"
                />
                <button 
                  onClick={() => handleSearch(searchQuery)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors flex items-center gap-2"
                  data-testid="button-hero-search"
                >
                  <Search className="h-5 w-5" />
                  Search
                </button>
              </div>

              {/* Autocomplete Suggestions Dropdown */}
              {isSearchOpen && filteredSearchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background border-2 border-border rounded-lg shadow-lg z-50 overflow-hidden">
                  <Command>
                    <CommandList>
                      {searchQuery.length === 0 && (
                        <div className="px-3 py-2 text-xs text-muted-foreground border-b">
                          Recent Searches
                        </div>
                      )}
                      
                      <CommandGroup>
                        {filteredSearchSuggestions.map((suggestion, index) => {
                          const Icon = suggestion.icon || Search;
                          const isSelected = index === selectedSearchIndex;

                          return (
                            <CommandItem
                              key={`${suggestion.type}-${suggestion.value}`}
                              value={suggestion.value}
                              onSelect={() => handleSearch(suggestion.searchQuery || suggestion.label)}
                              className={`cursor-pointer ${isSelected ? "bg-accent" : ""}`}
                              data-testid={`suggestion-${index}`}
                            >
                              <Icon className="h-4 w-4 mr-2 text-muted-foreground" />
                              <div className="flex-1">
                                <div className="font-medium">{suggestion.label}</div>
                                {suggestion.subtitle && (
                                  <div className="text-xs text-muted-foreground">
                                    {suggestion.subtitle}
                                  </div>
                                )}
                              </div>
                              {suggestion.type === "popular" && (
                                <TrendingUp className="h-3 w-3 text-primary" />
                              )}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>

            {/* Quick-Search Category Pills */}
            <div className="flex flex-wrap gap-2 justify-center items-center text-sm">
              <span className="text-muted-foreground font-medium">Popular:</span>
              {[
                { name: "3D Artists", slug: "3D Content Creation" },
                { name: "KOLs", slug: "KOLs & Influencers" },
                { name: "Developers", slug: "Script Development" },
                { name: "Marketing", slug: "Marketing & Growth" },
                { name: "Volume Services", slug: "Volume Services", badge: "NEW" }
              ].map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    document.getElementById('explore-services')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-4 py-2 rounded-full border-2 border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all flex items-center gap-2"
                >
                  {cat.name}
                  {cat.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {cat.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Action Buttons - In Hero */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <Link href="/getting-started?tab=client">
                <Button size="lg" variant="outline" className="gap-2" data-testid="button-become-client">
                  Become a Client
                </Button>
              </Link>
              <Link href="/getting-started?tab=builder">
                <Button size="lg" variant="outline" className="gap-2" data-testid="button-become-builder">
                  Become a Builder
                </Button>
              </Link>
            </div>

            {/* Trust Badges - Clean Style */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
              <span className="text-muted-foreground text-sm font-medium">Powered by:</span>
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-card border-2 border-border hover-elevate">
                <Layers className="h-5 w-5 text-primary" />
                <span className="font-semibold">Base</span>
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-card border-2 border-border hover-elevate">
                <Coins className="h-5 w-5 text-primary" />
                <span className="font-semibold">$CREATE</span>
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-card border-2 border-border hover-elevate">
                <Coins className="h-5 w-5 text-primary" />
                <span className="font-semibold">$PSX</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Buy on Demand - Category Filtering & Services */}
      <section id="explore-services" className="bg-background py-16">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">

          {/* Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
            {serviceCategories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all border-2 ${
                    isSelected 
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
                      : 'bg-background text-foreground border-border hover:border-primary/50 hover-elevate'
                  }`}
                  data-testid={`button-category-${cat.slug.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Icon className="h-4 w-4" />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Service Count */}
          {filteredServices && (
            <div className="text-center mb-8">
              <p className="text-base md:text-lg font-semibold" data-testid="text-service-count">
                Showing {filteredServices.length} {serviceCategories.find(c => c.slug === selectedCategory)?.name || 'services'}
              </p>
            </div>
          )}

          {/* Filtered Services Grid */}
          {servicesLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
              ))}
            </div>
          ) : filteredServices && filteredServices.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-testid="grid-filtered-services">
              {filteredServices.slice(0, 8).map(({ builder, service }) => (
                <ServiceCard
                  key={service.id}
                  builder={builder}
                  service={service}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No services found in this category.</p>
              <Link href="/marketplace">
                <Button variant="outline" className="mt-4 gap-2">
                  Browse All Services
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}

          {/* View More Button */}
          {filteredServices && filteredServices.length > 8 && (
            <div className="text-center mt-10">
              <Link href={`/marketplace?categories=${selectedCategory}`}>
                <Button size="lg" variant="outline" className="gap-2">
                  View All {serviceCategories.find(c => c.slug === selectedCategory)?.name} Services
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Top Builders Section - Fiverr Style with Parallax */}
      <section className="border-t bg-muted/20 relative overflow-hidden">
        <div ref={buildersContainerRef} className="container mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:px-8" style={{ willChange: 'transform' }}>
          {/* Section Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Top Builders</h2>
              <p className="text-muted-foreground text-base md:text-lg">Work with the best talent in Web3</p>
            </div>
            <Link href="/builders">
              <Button variant="outline" className="gap-2 hidden md:flex" data-testid="button-view-all-builders">
                View All Builders
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Builders Grid */}
          {buildersLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-[340px] w-full rounded-xl" />
              ))}
            </div>
          ) : buildersError ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-card/50 backdrop-blur-sm py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
                <User className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Failed to load builders</h3>
              <p className="text-sm text-muted-foreground">Please try again later</p>
            </div>
          ) : !topBuilders || topBuilders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-card/50 backdrop-blur-sm py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <User className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No builders found</h3>
              <p className="text-sm text-muted-foreground mb-4">Check back soon or browse our services</p>
              <Link href="/marketplace">
                <Button variant="outline" className="gap-2 hover-elevate">
                  Browse Services
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-testid="grid-top-builders">
                {topBuilders.slice(0, 8).map((builder) => (
                  <Link
                    key={builder.id}
                    href={`/builder/${builder.id}`}
                    className="group block"
                    data-testid={`link-builder-${builder.id}`}
                  >
                    <Card className="overflow-hidden hover-elevate active-elevate-2 h-full border-2">
                      {/* Builder Avatar - Large */}
                      <div className="relative aspect-square w-full overflow-hidden bg-muted">
                        {builder.profileImage ? (
                          <img
                            src={builder.profileImage}
                            alt={builder.name}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-primary/10">
                            <User className="h-20 w-20 text-primary/40" />
                          </div>
                        )}
                        
                        {/* Verified Badge */}
                        {builder.verified && (
                          <div className="absolute top-3 left-3">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-lg">
                              <Shield className="h-4 w-4 text-primary-foreground" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Builder Info */}
                      <div className="p-4 space-y-3">
                        {/* Name and Headline */}
                        <div>
                          <h3 className="font-semibold text-lg mb-1 truncate">
                            {builder.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {builder.headline || builder.category}
                          </p>
                        </div>

                        {/* Specialization */}
                        {builder.specializations && builder.specializations.length > 0 && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {builder.specializations[0]}
                          </p>
                        )}

                        {/* Rating and Stats */}
                        <div className="flex items-center justify-between pt-2 border-t">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-sm">
                              {builder.rating ? Number(builder.rating).toFixed(1) : '5.0'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({builder.completedProjects || 0})
                            </span>
                          </div>
                          {builder.completedProjects !== undefined && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Award className="h-3.5 w-3.5" />
                              <span>{builder.completedProjects} orders</span>
                            </div>
                          )}
                        </div>

                        {/* Starting Price */}
                        {builder.hourlyRate && (
                          <div className="pt-2 border-t">
                            <div className="flex items-baseline gap-1">
                              <span className="text-xs text-muted-foreground">Starting at</span>
                              <span className="font-bold text-lg">${builder.hourlyRate}</span>
                              <span className="text-xs text-muted-foreground">/hr</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
              
              {/* Mobile View All Button */}
              <div className="text-center mt-8 md:hidden">
                <Link href="/builders">
                  <Button size="lg" className="gap-2 w-full max-w-md" data-testid="button-view-all-builders-mobile">
                    View All Builders
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Token Holder Benefits Section - Compact */}
      <section className="border-b bg-muted/20 py-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          {/* Compact Header with Key Info */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 gap-1.5 px-3 py-1.5 text-xs font-medium">
              <Gift className="h-3.5 w-3.5" />
              Token Holder Benefits
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Save 60% with <span className="text-primary">$CREATE</span> or <span className="text-primary">$PSX</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Hold either token to unlock 1% platform fees (vs 2.5%), priority support, exclusive badges, and early access
            </p>

            {/* Inline Token Info & CTAs */}
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <Badge variant="outline" className="gap-2 px-5 py-2.5 text-sm font-semibold">
                <Layers className="h-4 w-4" />
                $CREATE
              </Badge>
              <Badge variant="outline" className="gap-2 px-5 py-2.5 text-sm font-semibold">
                <Zap className="h-4 w-4" />
                $PSX
              </Badge>
              <a href="https://app.uniswap.org" target="_blank" rel="noopener noreferrer">
                <Button className="gap-2 px-6 shadow-md" data-testid="button-get-tokens">
                  <Coins className="h-4 w-4" />
                  Get Tokens
                </Button>
              </a>
            </div>
          </div>

          {/* Compact Benefits Summary */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8 max-w-6xl mx-auto">
            <div className="flex items-start gap-4 p-6 rounded-xl border bg-card shadow-sm hover-elevate">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-bold text-lg mb-1">60% Off</div>
                <div className="text-sm text-muted-foreground">1% fees vs 2.5%</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl border bg-card shadow-sm hover-elevate">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-bold text-lg mb-1">2x Faster</div>
                <div className="text-sm text-muted-foreground">Priority support</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl border bg-card shadow-sm hover-elevate">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-bold text-lg mb-1">VIP Badge</div>
                <div className="text-sm text-muted-foreground">Stand out</div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl border bg-card shadow-sm hover-elevate">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="font-bold text-lg mb-1">Early Access</div>
                <div className="text-sm text-muted-foreground">Beta features</div>
              </div>
            </div>
          </div>

          {/* Collapsible Details */}
          <Accordion type="single" collapsible className="max-w-5xl mx-auto">
            <AccordionItem value="comparison" data-testid="accordion-comparison">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  View Full Comparison Table
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="overflow-x-auto pt-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Feature</th>
                        <th className="text-center p-3 font-semibold">Standard</th>
                        <th className="text-center p-3 font-semibold">
                          Token Holder
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      <tr className="border-b">
                        <td className="p-3">Platform Fee</td>
                        <td className="text-center p-3 text-muted-foreground">2.5%</td>
                        <td className="text-center p-3">
                          <span className="font-bold text-chart-3">1%</span>
                          <span className="text-xs text-muted-foreground ml-2">(60% off)</span>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">Support Response</td>
                        <td className="text-center p-3 text-muted-foreground">24-48h</td>
                        <td className="text-center p-3">
                          <span className="font-bold text-chart-2">4-12h</span>
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">Dispute Resolution</td>
                        <td className="text-center p-3 text-muted-foreground">Standard</td>
                        <td className="text-center p-3 font-bold">Priority</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">Profile Badge</td>
                        <td className="text-center p-3 text-muted-foreground">-</td>
                        <td className="text-center p-3">
                          <CheckCircle2 className="h-4 w-4 text-chart-4 inline" />
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3">Early Access</td>
                        <td className="text-center p-3 text-muted-foreground">-</td>
                        <td className="text-center p-3">
                          <CheckCircle2 className="h-4 w-4 text-chart-4 inline" />
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3">Exclusive Services</td>
                        <td className="text-center p-3 text-muted-foreground">-</td>
                        <td className="text-center p-3">
                          <CheckCircle2 className="h-4 w-4 text-chart-4 inline" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="token-details" data-testid="accordion-tokens">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4" />
                  Token Details & How to Get Them
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid gap-4 md:grid-cols-2 pt-4">
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 mb-3">
                      <Layers className="h-5 w-5" />
                      <h3 className="font-bold">$CREATE</h3>
                      <Badge variant="outline" className="gap-1 text-xs ml-auto">
                        <Sparkles className="h-3 w-3" />
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      The Creators Token - powering the port444 ecosystem
                    </p>
                    <ul className="space-y-2 mb-4 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>1% platform fees (60% discount)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>Priority support & dispute resolution</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>Exclusive token holder badge</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>Early access to new features</span>
                      </li>
                    </ul>
                    <a href="https://app.uniswap.org" target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="outline" size="sm" className="w-full gap-2" data-testid="button-get-create">
                        <ExternalLink className="h-3 w-3" />
                        Get on Uniswap
                      </Button>
                    </a>
                  </div>

                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-5 w-5" />
                      <h3 className="font-bold">$PSX</h3>
                      <Badge variant="outline" className="gap-1 text-xs ml-auto">
                        <Sparkles className="h-3 w-3" />
                        Active
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      PSX Agency Token - your gateway to premium access
                    </p>
                    <ul className="space-y-2 mb-4 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>1% platform fees (60% discount)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>Priority support & dispute resolution</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>Exclusive token holder badge</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>Early access to new features</span>
                      </li>
                    </ul>
                    <a href="https://app.uniswap.org" target="_blank" rel="noopener noreferrer" className="block">
                      <Button variant="outline" size="sm" className="w-full gap-2" data-testid="button-get-psx">
                        <ExternalLink className="h-3 w-3" />
                        Get on Uniswap
                      </Button>
                    </a>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Holding either token unlocks all benefits. No minimum amount required.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="stats" data-testid="accordion-stats">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Platform Stats & Social Proof
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="text-center p-4 rounded-lg border bg-card">
                    <div className="text-2xl font-bold mb-1">5,000+</div>
                    <div className="text-sm text-muted-foreground">Token Holders</div>
                  </div>
                  <div className="text-center p-4 rounded-lg border bg-card">
                    <div className="text-2xl font-bold mb-1">$2.5M+</div>
                    <div className="text-sm text-muted-foreground">Fees Saved</div>
                  </div>
                  <div className="text-center p-4 rounded-lg border bg-card">
                    <div className="text-2xl font-bold mb-1">2.1K+</div>
                    <div className="text-sm text-muted-foreground">Projects Done</div>
                  </div>
                  <div className="text-center p-4 rounded-lg border bg-card">
                    <div className="text-2xl font-bold mb-1">4.9/5</div>
                    <div className="text-sm text-muted-foreground">Avg Rating</div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Footer Note */}
          <p className="text-center text-xs text-muted-foreground mt-6">
            Platform is fully accessible to everyone - token benefits are optional rewards!
          </p>
        </div>
      </section>

      {/* Recent Reviews Carousel */}
      <section className="border-b bg-background py-16">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <RecentReviewsCarousel />
        </div>
      </section>

      {/* PSX Agency Section */}
      <section className="border-b bg-background py-20">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 rounded-2xl border bg-card p-10 lg:flex-row lg:gap-12 shadow-lg">
            <div className="flex flex-1 flex-col gap-5 text-center lg:text-left">
              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <Badge variant="outline" className="w-fit gap-1.5 px-3 py-1.5 text-xs font-medium">
                  <Handshake className="h-3.5 w-3.5" />
                  Direct B2B Services
                </Badge>
              </div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                Need Direct Talent Support?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Visit <span className="font-semibold text-primary">psx.agency</span> for our dedicated talent line offering direct B2B and coin-to-coin business partnerships. 
                Powered by <span className="font-semibold text-foreground">$Create</span> and <span className="font-semibold text-foreground">$PSX</span> on Base. 
                Proudly partnered with <a href="https://thecreators.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">The Creators</a> at <span className="font-semibold text-foreground">thecreators.com</span>.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row lg:flex-col">
              <a href="https://psx.agency" target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="gap-2 px-8 py-6 text-base font-medium shadow-md" data-testid="button-visit-agency">
                  Visit PSX Agency
                  <ExternalLink className="h-5 w-5" />
                </Button>
              </a>
              <a href="https://thecreators.com" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="gap-2 px-8 py-6 text-base font-medium" data-testid="button-based-creators">
                  The Creators
                  <ExternalLink className="h-5 w-5" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
