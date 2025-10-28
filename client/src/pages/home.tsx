import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import { Header } from "@/components/header";
import { WelcomeModal } from "@/components/welcome-modal";
import { BuilderCard } from "@/components/builder-card";
import { SEOHead } from "@/components/seo-head";
import { LiveActivityTicker } from "@/components/live-activity-ticker";
import { RecentReviewsCarousel } from "@/components/recent-reviews-carousel";
import { GuestBrowseBanner } from "@/components/guest-browse-banner";
import { MobileStickyCTA } from "@/components/mobile-sticky-cta";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function Home() {
  // Default to 3D Artists category
  const [selectedCategory, setSelectedCategory] = useState("3D Content Creation");

  const { data: servicesData, isLoading: servicesLoading, isError: servicesError } = useQuery<
    Array<{ builder: Builder; service: Service }>
  >({
    queryKey: ["/api/services", selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory) {
        params.set("categories", selectedCategory);
      }
      const queryString = params.toString();
      const url = `/api/services${queryString ? `?${queryString}` : ""}`;
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
      return response.json();
    },
  });

  const agencySection = useScrollReveal();
  const benefitsSection = useScrollReveal();

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

      {/* Fiverr-Style Hero with Background */}
      <section className="relative border-b overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-background/95 z-0" />
        
        <div className="container relative z-10 mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-24 lg:px-8 lg:py-32">
          {/* Fiverr-Style Hero Content */}
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-white">
              Premium Web3 builders
              <span className="block mt-2">will take it from here</span>
            </h1>

            {/* Prominent Fiverr-Style Search Bar */}
            <div className="max-w-3xl mx-auto">
              <Link href="/marketplace">
                <div className="relative group cursor-pointer">
                  <input
                    type="text"
                    placeholder="Search for any service..."
                    className="w-full h-16 pl-6 pr-24 rounded-lg border-0 bg-white text-base text-foreground placeholder:text-muted-foreground shadow-xl focus:outline-none focus:ring-2 focus:ring-white/50"
                    readOnly
                    data-testid="input-homepage-search"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 rounded-md bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-colors flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Search
                  </button>
                </div>
              </Link>
            </div>

            {/* Quick-Search Category Pills (Fiverr-style) */}
            <div className="flex flex-wrap gap-2 justify-center items-center text-sm">
              <span className="text-white/90 font-medium">Popular:</span>
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
                  className="px-4 py-2 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:border-white/50 transition-all flex items-center gap-2"
                >
                  {cat.name}
                  {cat.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-white text-primary text-xs font-bold">
                      {cat.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Trust Badges - Fiverr Style */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
              <span className="text-white/80 text-sm font-medium">Powered by:</span>
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm">
                <Layers className="h-5 w-5 text-white" />
                <span className="text-white font-semibold">Base</span>
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm">
                <Coins className="h-5 w-5 text-white" />
                <span className="text-white font-semibold">$CREATE</span>
              </div>
              <div className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm">
                <Coins className="h-5 w-5 text-white" />
                <span className="text-white font-semibold">$PSX</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Token Benefits Banner */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Gift className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Token Holder Perks</p>
                <p className="text-sm text-muted-foreground">60% lower fees with $CREATE or $PSX</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Priority Support</p>
                <p className="text-sm text-muted-foreground">Fast response & exclusive access</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Verified Badge</p>
                <p className="text-sm text-muted-foreground">Stand out in the marketplace</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Explore Services Section */}
      <section id="explore-services" className="bg-background">
        <div className="container mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:px-8">
          {/* Section Header */}
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">Explore Services</h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">Browse by category to find the perfect builder for your project</p>
          </div>

          <div className="space-y-12">
            {/* Category Cards Grid - Smaller */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
              {serviceCategories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.slug || 'all'}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`group relative flex flex-col items-center justify-center p-4 md:p-5 rounded-xl border-2 transition-all hover-elevate active-elevate-2 ${
                      isSelected 
                        ? 'bg-primary border-primary text-primary-foreground shadow-xl shadow-primary/30' 
                        : 'bg-card border-border hover:border-primary/50'
                    }`}
                    data-testid={`button-category-${cat.slug ? cat.slug.toLowerCase().replace(/\s+/g, '-') : 'all'}`}
                  >
                    <div className={`mb-2 p-2.5 rounded-lg transition-all ${
                      isSelected 
                        ? 'bg-primary-foreground/20' 
                        : 'bg-primary/10 group-hover:bg-primary/20'
                    }`}>
                      <Icon className={`h-6 w-6 md:h-7 md:w-7 ${
                        isSelected ? 'text-primary-foreground' : 'text-primary'
                      }`} />
                    </div>
                    <span className={`text-xs md:text-sm font-semibold text-center ${
                      isSelected ? 'text-primary-foreground' : 'text-foreground'
                    }`}>
                      {cat.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Services Grid */}
            {servicesLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-[300px] w-full rounded-lg" />
                ))}
              </div>
            ) : servicesError ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-card/50 backdrop-blur-sm py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
                  <Search className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">Failed to load services</h3>
                <p className="text-sm text-muted-foreground">Please try again later</p>
              </div>
            ) : !servicesData || servicesData.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-card/50 backdrop-blur-sm py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">No services found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedCategory ? `No services available in ${selectedCategory} category` : "Check back soon or try another category"}
                </p>
                <Link href="/marketplace">
                  <Button variant="outline" className="gap-2 hover-elevate">
                    Browse All Services
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {/* Featured Section Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold">
                        {selectedCategory ? serviceCategories.find(c => c.slug === selectedCategory)?.name : 'All Services'}
                      </h3>
                      <p className="text-muted-foreground mt-1">
                        {servicesData.length} service{servicesData.length !== 1 ? 's' : ''} available
                      </p>
                    </div>
                    <Link href={selectedCategory ? `/marketplace?categories=${selectedCategory}` : "/marketplace"}>
                      <Button variant="outline" className="gap-2" data-testid="button-view-all-category">
                        View All
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="h-px bg-border" />
                </div>

                {/* Services Grid - Large Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="grid-category-services">
                  {servicesData.slice(0, 6).map(({ builder, service }) => (
                    <BuilderCard
                      key={service.id}
                      builder={builder}
                      service={service}
                    />
                  ))}
                </div>
                
                {/* Load More CTA */}
                {servicesData.length > 6 && (
                  <div className="text-center pt-4">
                    <Link href={selectedCategory ? `/marketplace?categories=${selectedCategory}` : "/marketplace"}>
                      <Button size="lg" className="gap-2 px-8 py-6 text-base font-medium shadow-lg shadow-primary/20" data-testid="button-load-more">
                        Load More
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
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
