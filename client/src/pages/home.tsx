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

      {/* Unified Hero + Category Browser Section */}
      <section className="border-b bg-background">
        <div className="container mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:px-8 lg:py-24">
          {/* Branding Header */}
          <div className="mx-auto max-w-3xl text-center space-y-6 mb-16">
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline" className="gap-1.5">
                <Gift className="h-3 w-3" />
                Token Holder Benefits
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <Sparkles className="h-3 w-3" />
                Save Up to 60% with Tokens
              </Badge>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Buy on Demand
              <span className="block mt-2">
                Web3 Talent Marketplace
              </span>
            </h1>

            <p className="text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              The open Web3 marketplace connecting premium builders with memecoin
              and crypto projects. Hold $CREATE or $PSX tokens for exclusive benefits and reduced fees.
            </p>

            <div className="rounded-lg border p-4 max-w-2xl mx-auto">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
                <Gift className="h-4 w-4 text-primary" />
                Token Holder Perks: 60% lower fees (1% vs 2.5%), priority support, exclusive badges, early access!
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/marketplace">
                <Button size="lg" className="gap-2" data-testid="button-browse-all-services">
                  Browse All Services
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/become-client">
                <Button size="lg" variant="outline" className="gap-2" data-testid="button-become-client">
                  Become a Client
                </Button>
              </Link>
              <Link href="/apply">
                <Button size="lg" variant="outline" className="gap-2" data-testid="button-become-builder">
                  Become a Builder
                </Button>
              </Link>
            </div>
          </div>

          {/* Live Activity Ticker */}
          <div className="max-w-4xl mx-auto mb-8">
            <LiveActivityTicker />
          </div>

          {/* Category Browser - Main Focal Point */}
          <div className="space-y-8">
            {/* Category Pills - Mobile Optimized */}
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              {serviceCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Button
                    key={cat.slug || 'all'}
                    variant={selectedCategory === cat.slug ? "default" : "outline"}
                    size="default"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className="gap-2 hover-elevate active-elevate-2 whitespace-nowrap min-h-10 md:min-h-9 px-4 md:px-3 text-sm md:text-base"
                    data-testid={`button-category-${cat.slug ? cat.slug.toLowerCase().replace(/\s+/g, '-') : 'all'}`}
                  >
                    <Icon className="h-4 w-4 md:h-3.5 md:w-3.5" />
                    <span>{cat.name}</span>
                  </Button>
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
                <div className="mb-4 text-center">
                  <p className="text-sm text-muted-foreground" data-testid="text-services-count">
                    Showing {servicesData.length} {selectedCategory ? serviceCategories.find(c => c.slug === selectedCategory)?.name : 'All'} service{servicesData.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" data-testid="grid-category-services">
                  {servicesData.map(({ builder, service }) => (
                    <BuilderCard
                      key={service.id}
                      builder={builder}
                      service={service}
                    />
                  ))}
                </div>
                
                {servicesData.length > 0 && (
                  <div className="mt-8 text-center pb-8">
                    <Link href={selectedCategory ? `/marketplace?categories=${selectedCategory}` : "/marketplace"}>
                      <Button variant="outline" size="lg" className="gap-2 hover-elevate" data-testid="button-view-all-category">
                        View All {selectedCategory ? serviceCategories.find(c => c.slug === selectedCategory)?.name : ''} Services
                        <ArrowRight className="h-4 w-4" />
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
      <section ref={benefitsSection.ref as any} className={`relative border-b bg-gradient-to-br from-primary/5 via-chart-2/5 to-background py-12 overflow-hidden ${benefitsSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}>
        {/* Background decorations */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
        
        <div className="container relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          {/* Compact Header with Key Info */}
          <div className="text-center mb-8">
            <Badge variant="outline" className="mb-3 gap-1.5 border-primary/40 bg-primary/10 text-primary">
              <Gift className="h-3 w-3" />
              Token Holder Benefits
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              Save 60% with $CREATE or $PSX
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto mb-6">
              Hold either token to unlock 1% platform fees (vs 2.5%), priority support, exclusive badges, and early access
            </p>

            {/* Inline Token Info & CTAs */}
            <div className="flex flex-wrap gap-3 justify-center items-center">
              <Badge variant="default" className="gap-2 px-4 py-2">
                <Layers className="h-4 w-4" />
                <span className="font-semibold">$CREATE</span>
              </Badge>
              <Badge variant="default" className="gap-2 px-4 py-2 bg-chart-2 hover:bg-chart-2">
                <Zap className="h-4 w-4" />
                <span className="font-semibold">$PSX</span>
              </Badge>
              <a href="https://app.uniswap.org" target="_blank" rel="noopener noreferrer">
                <Button variant="default" className="gap-2" data-testid="button-get-tokens">
                  <Coins className="h-4 w-4" />
                  Get Tokens
                </Button>
              </a>
            </div>
          </div>

          {/* Compact Benefits Summary */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6 max-w-5xl mx-auto">
            <div className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-chart-3/10">
                <DollarSign className="h-5 w-5 text-chart-3" />
              </div>
              <div>
                <div className="font-bold text-chart-3">60% Off</div>
                <div className="text-xs text-muted-foreground">1% fees vs 2.5%</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-chart-2/10">
                <Zap className="h-5 w-5 text-chart-2" />
              </div>
              <div>
                <div className="font-bold text-chart-2">2x Faster</div>
                <div className="text-xs text-muted-foreground">Priority support</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-chart-4/10">
                <CheckCircle2 className="h-5 w-5 text-chart-4" />
              </div>
              <div>
                <div className="font-bold">VIP Badge</div>
                <div className="text-xs text-muted-foreground">Stand out</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border bg-card/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="font-bold text-primary">Early Access</div>
                <div className="text-xs text-muted-foreground">Beta features</div>
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
                        <th className="text-center p-3">
                          <span className="font-semibold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                            Token Holder
                          </span>
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
                  <div className="p-4 rounded-lg border bg-gradient-to-br from-primary/5 to-background">
                    <div className="flex items-center gap-2 mb-3">
                      <Layers className="h-5 w-5 text-primary" />
                      <h3 className="font-bold">$CREATE</h3>
                      <Badge variant="default" className="gap-1 text-xs ml-auto">
                        <Sparkles className="h-3 w-3" />
                        Active
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      The Creators Token - powering the port444 ecosystem
                    </p>
                    <ul className="space-y-1.5 mb-4 text-xs">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-chart-4 shrink-0" />
                        <span>1% platform fees (60% discount)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-chart-4 shrink-0" />
                        <span>Priority support & dispute resolution</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-chart-4 shrink-0" />
                        <span>Exclusive token holder badge</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-chart-4 shrink-0" />
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

                  <div className="p-4 rounded-lg border bg-gradient-to-br from-chart-2/5 to-background">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="h-5 w-5 text-chart-2" />
                      <h3 className="font-bold">$PSX</h3>
                      <Badge variant="default" className="gap-1 text-xs ml-auto bg-chart-2 hover:bg-chart-2">
                        <Sparkles className="h-3 w-3" />
                        Active
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      PSX Agency Token - your gateway to premium access
                    </p>
                    <ul className="space-y-1.5 mb-4 text-xs">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-chart-4 shrink-0" />
                        <span>1% platform fees (60% discount)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-chart-4 shrink-0" />
                        <span>Priority support & dispute resolution</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-chart-4 shrink-0" />
                        <span>Exclusive token holder badge</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="h-3 w-3 text-chart-4 shrink-0" />
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
                  <div className="text-center p-4 rounded-lg border bg-card/50">
                    <div className="text-2xl font-bold text-primary mb-1">5,000+</div>
                    <div className="text-xs text-muted-foreground">Token Holders</div>
                  </div>
                  <div className="text-center p-4 rounded-lg border bg-card/50">
                    <div className="text-2xl font-bold text-chart-2 mb-1">$2.5M+</div>
                    <div className="text-xs text-muted-foreground">Fees Saved</div>
                  </div>
                  <div className="text-center p-4 rounded-lg border bg-card/50">
                    <div className="text-2xl font-bold text-chart-3 mb-1">2.1K+</div>
                    <div className="text-xs text-muted-foreground">Projects Done</div>
                  </div>
                  <div className="text-center p-4 rounded-lg border bg-card/50">
                    <div className="text-2xl font-bold text-chart-4 mb-1">4.9/5</div>
                    <div className="text-xs text-muted-foreground">Avg Rating</div>
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
      <section ref={agencySection.ref as any} className={`border-b bg-gradient-to-r from-primary/10 via-chart-2/10 to-chart-3/10 py-12 ${agencySection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}>
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 rounded-xl border bg-card/50 p-8 backdrop-blur-sm lg:flex-row lg:gap-8 hover-lift">
            <div className="flex flex-1 flex-col gap-3 text-center lg:text-left">
              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <Badge variant="outline" className="w-fit gap-1.5 border-chart-2/40 bg-chart-2/10 text-chart-2">
                  <Handshake className="h-3 w-3" />
                  Direct B2B Services
                </Badge>
              </div>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Need Direct Talent Support?
              </h2>
              <p className="text-muted-foreground md:text-lg">
                Visit <span className="font-semibold text-foreground">psx.agency</span> for our dedicated talent line offering direct B2B and coin-to-coin business partnerships. 
                Powered by <span className="font-semibold text-primary">$Create</span> and <span className="font-semibold text-primary">$PSX</span> on Base. 
                Proudly partnered with <a href="https://thecreators.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">The Creators</a> at <span className="font-semibold text-foreground">thecreators.com</span>.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a href="https://psx.agency" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="default" className="gap-2 text-base" data-testid="button-visit-agency">
                  Visit PSX Agency
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
              <a href="https://thecreators.com" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="gap-2 text-base hover-elevate" data-testid="button-based-creators">
                  The Creators
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
