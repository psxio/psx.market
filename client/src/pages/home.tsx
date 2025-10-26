import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import { Header } from "@/components/header";
import { WelcomeModal } from "@/components/welcome-modal";
import { BuilderCard } from "@/components/builder-card";
import { SEOHead } from "@/components/seo-head";
import { LiveActivityTicker } from "@/components/live-activity-ticker";
import { RecentReviewsCarousel } from "@/components/recent-reviews-carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
} from "lucide-react";
import type { Builder, Service } from "@shared/schema";

const serviceCategories = [
  { name: "3D Artists", slug: "3D Content Creation", icon: Boxes },
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

      {/* Unified Hero + Category Browser Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-chart-2/10 via-transparent to-transparent" />
        
        <div className="container relative mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16 lg:px-8 lg:py-20">
          {/* Branding Header */}
          <div className="mx-auto max-w-4xl text-center space-y-6 mb-12">
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge variant="outline" className="gap-1.5 border-primary/40 bg-primary/10 text-primary">
                <Gift className="h-3 w-3" />
                Token Holder Benefits
              </Badge>
              <Badge variant="default" className="gap-1.5 animate-pulse">
                <Sparkles className="h-3 w-3" />
                Save Up to 60% with Tokens
              </Badge>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Buy on Demand
              <span className="block mt-2 bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                Web3 Talent Marketplace
              </span>
            </h1>

            <p className="text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
              The open Web3 marketplace connecting premium builders with memecoin
              and crypto projects. Hold $CREATE or $PSX tokens for exclusive benefits and reduced fees.
            </p>

            <div className="rounded-lg border border-chart-3/30 bg-chart-3/5 p-4 max-w-2xl mx-auto">
              <p className="text-sm font-medium text-chart-3 flex items-center justify-center gap-2 flex-wrap">
                <Gift className="h-4 w-4" />
                Token Holder Perks: 60% lower fees (1% vs 2.5%), priority support, exclusive badges, early access!
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row justify-center">
              <Link href="/marketplace">
                <Button size="lg" className="gap-2 text-base" data-testid="button-browse-all-services">
                  Browse All Services
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/become-client">
                <Button size="lg" variant="outline" className="gap-2 text-base hover-elevate" data-testid="button-become-client">
                  Become a Client
                </Button>
              </Link>
              <Link href="/apply">
                <Button size="lg" variant="outline" className="gap-2 text-base hover-elevate" data-testid="button-become-builder">
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
            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {serviceCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Button
                    key={cat.slug || 'all'}
                    variant={selectedCategory === cat.slug ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className="gap-2 hover-elevate active-elevate-2 whitespace-nowrap"
                    data-testid={`button-category-${cat.slug ? cat.slug.toLowerCase().replace(/\s+/g, '-') : 'all'}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
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

      {/* Token Holder Benefits Section - Enhanced */}
      <section ref={benefitsSection.ref as any} className={`relative border-b bg-gradient-to-br from-primary/5 via-chart-2/5 to-background py-20 overflow-hidden ${benefitsSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}>
        {/* Background decorations */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary/20 via-chart-2/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-chart-3/20 via-chart-4/20 to-transparent rounded-full blur-3xl" />
        
        <div className="container relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 gap-1.5 border-primary/40 bg-primary/10 text-primary animate-pulse">
              <Gift className="h-3 w-3" />
              Exclusive Rewards for Token Holders
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Unlock Premium Benefits
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Hold $CREATE or $PSX tokens to unlock exclusive platform perks, massive discounts, and VIP treatment. 
              Join thousands of holders enjoying premium access.
            </p>
          </div>

          {/* Token Showcase Cards */}
          <div className="grid gap-6 md:grid-cols-2 mb-12 max-w-4xl mx-auto">
            {/* $CREATE Token Card */}
            <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-background to-background hover-elevate">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/20 border border-primary/30">
                      <Layers className="h-7 w-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">$CREATE</h3>
                      <p className="text-sm text-muted-foreground">The Creators Token</p>
                    </div>
                  </div>
                  <Badge variant="default" className="gap-1">
                    <Sparkles className="h-3 w-3" />
                    Active
                  </Badge>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-chart-4" />
                    <span>1% platform fees (60% off)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-chart-4" />
                    <span>Priority support & dispute resolution</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-chart-4" />
                    <span>Exclusive token holder badge</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-chart-4" />
                    <span>Early access to new features</span>
                  </div>
                </div>
                <a href="https://app.uniswap.org" target="_blank" rel="noopener noreferrer" className="block">
                  <Button variant="outline" className="w-full gap-2 hover-elevate" data-testid="button-get-create">
                    <ExternalLink className="h-4 w-4" />
                    Get $CREATE on Uniswap
                  </Button>
                </a>
              </div>
            </Card>

            {/* $PSX Token Card */}
            <Card className="border-2 border-chart-2/30 bg-gradient-to-br from-chart-2/10 via-background to-background hover-elevate">
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-chart-2/20 border border-chart-2/30">
                      <Zap className="h-7 w-7 text-chart-2" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">$PSX</h3>
                      <p className="text-sm text-muted-foreground">PSX Agency Token</p>
                    </div>
                  </div>
                  <Badge variant="default" className="gap-1 bg-chart-2 hover:bg-chart-2">
                    <Sparkles className="h-3 w-3" />
                    Active
                  </Badge>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-chart-4" />
                    <span>1% platform fees (60% off)</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-chart-4" />
                    <span>Priority support & dispute resolution</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-chart-4" />
                    <span>Exclusive token holder badge</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-chart-4" />
                    <span>Early access to new features</span>
                  </div>
                </div>
                <a href="https://app.uniswap.org" target="_blank" rel="noopener noreferrer" className="block">
                  <Button variant="outline" className="w-full gap-2 hover-elevate" data-testid="button-get-psx">
                    <ExternalLink className="h-4 w-4" />
                    Get $PSX on Uniswap
                  </Button>
                </a>
              </div>
            </Card>
          </div>

          {/* Benefits Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
            <Card className="border-2 hover-elevate transition-all duration-300">
              <div className="p-6 space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-chart-3/20 to-chart-3/10 border border-chart-3/30">
                  <DollarSign className="h-7 w-7 text-chart-3" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-chart-3">60%</span>
                    <span className="text-sm text-muted-foreground">savings</span>
                  </div>
                  <h3 className="font-semibold mb-2">Massive Fee Discount</h3>
                  <p className="text-sm text-muted-foreground">
                    Pay only 1% vs 2.5% standard rate. Save hundreds on every project.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-2 hover-elevate transition-all duration-300">
              <div className="p-6 space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-chart-2/20 to-chart-2/10 border border-chart-2/30">
                  <Zap className="h-7 w-7 text-chart-2" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-chart-2">2x</span>
                    <span className="text-sm text-muted-foreground">faster</span>
                  </div>
                  <h3 className="font-semibold mb-2">Priority Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Jump the queue with dedicated VIP support and faster response times.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-2 hover-elevate transition-all duration-300">
              <div className="p-6 space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-chart-4/20 to-chart-4/10 border border-chart-4/30">
                  <CheckCircle2 className="h-7 w-7 text-chart-4" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-chart-4">VIP</span>
                    <span className="text-sm text-muted-foreground">status</span>
                  </div>
                  <h3 className="font-semibold mb-2">Verified Badge</h3>
                  <p className="text-sm text-muted-foreground">
                    Stand out with an exclusive token holder badge that builders trust.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="border-2 hover-elevate transition-all duration-300">
              <div className="p-6 space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-primary">1st</span>
                    <span className="text-sm text-muted-foreground">access</span>
                  </div>
                  <h3 className="font-semibold mb-2">Beta Features</h3>
                  <p className="text-sm text-muted-foreground">
                    Get exclusive early access to new features and premium builders.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Comparison Table */}
          <Card className="border-2 mb-12 max-w-5xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 md:p-6 font-semibold">Feature</th>
                    <th className="text-center p-4 md:p-6 font-semibold">Standard</th>
                    <th className="text-center p-4 md:p-6">
                      <div className="flex flex-col items-center gap-2">
                        <span className="font-semibold bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
                          Token Holder
                        </span>
                        <Badge variant="default" className="gap-1 text-xs">
                          <Gift className="h-3 w-3" />
                          Premium
                        </Badge>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 md:p-6">Platform Fee</td>
                    <td className="text-center p-4 md:p-6 text-muted-foreground">2.5%</td>
                    <td className="text-center p-4 md:p-6">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-bold text-chart-3">1%</span>
                        <Badge variant="secondary" className="text-xs">60% off</Badge>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 md:p-6">Support Response Time</td>
                    <td className="text-center p-4 md:p-6 text-muted-foreground">24-48h</td>
                    <td className="text-center p-4 md:p-6">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-bold text-chart-2">4-12h</span>
                        <Badge variant="secondary" className="text-xs">Priority</Badge>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 md:p-6">Dispute Resolution</td>
                    <td className="text-center p-4 md:p-6 text-muted-foreground">Standard</td>
                    <td className="text-center p-4 md:p-6">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-chart-4" />
                        <span className="font-bold">Priority</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 md:p-6">Profile Badge</td>
                    <td className="text-center p-4 md:p-6 text-muted-foreground">-</td>
                    <td className="text-center p-4 md:p-6">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-chart-4" />
                        <span className="font-bold">Token Holder</span>
                      </div>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 md:p-6">Early Access</td>
                    <td className="text-center p-4 md:p-6 text-muted-foreground">-</td>
                    <td className="text-center p-4 md:p-6">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-chart-4" />
                        <span className="font-bold">Beta Features</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 md:p-6">Exclusive Services</td>
                    <td className="text-center p-4 md:p-6 text-muted-foreground">-</td>
                    <td className="text-center p-4 md:p-6">
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-chart-4" />
                        <span className="font-bold">Premium Builders</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>

          {/* CTA Section */}
          <div className="text-center space-y-6">
            <div className="max-w-2xl mx-auto">
              <p className="text-sm text-muted-foreground mb-1">
                Platform is fully accessible to everyone - token benefits are optional rewards!
              </p>
              <p className="text-xs text-muted-foreground">
                Holding either $CREATE or $PSX unlocks all benefits. No minimum amount required.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a href="https://app.uniswap.org" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="default" className="gap-2 text-base" data-testid="button-get-tokens">
                  <Coins className="h-4 w-4" />
                  Get Tokens & Save 60%
                </Button>
              </a>
              <Link href="/marketplace">
                <Button size="lg" variant="outline" className="gap-2 text-base hover-elevate" data-testid="button-browse-without-tokens">
                  Browse Without Tokens
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-8 border-t">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">5,000+</div>
                  <div className="text-xs text-muted-foreground">Token Holders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-chart-2 mb-1">$2.5M+</div>
                  <div className="text-xs text-muted-foreground">Fees Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-chart-3 mb-1">2.1K+</div>
                  <div className="text-xs text-muted-foreground">Projects Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-chart-4 mb-1">4.9/5</div>
                  <div className="text-xs text-muted-foreground">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
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
                Powered by <span className="font-semibold text-primary">Create</span> and <span className="font-semibold text-primary">PSX</span> tokens. 
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
