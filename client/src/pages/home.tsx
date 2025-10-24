import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import { Header } from "@/components/header";
import { WelcomeModal } from "@/components/welcome-modal";
import { BuilderCard } from "@/components/builder-card";
import { SEOHead } from "@/components/seo-head";
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
} from "lucide-react";
import type { Builder, Service } from "@shared/schema";

const serviceCategories = [
  { name: "3D Artists", slug: "3D & 2D Content Creation", icon: Boxes },
  { name: "KOLs & Influencers", slug: "KOLs & Influencers", icon: Megaphone },
  { name: "Marketing", slug: "Marketing & Growth", icon: TrendingUp },
  { name: "Developers", slug: "Script Development", icon: Code },
  { name: "Creative & Design", slug: "Graphic Design", icon: Palette },
  { name: "Audio & Production", slug: "Audio & Production", icon: Music },
  { name: "Volume Services", slug: "Volume Services", icon: BarChart3 },
  { name: "Social Media", slug: "Social Media Management", icon: Network },
  { name: "Grants & Funding", slug: "Grants & Funding", icon: Coins },
  { name: "Strategy", slug: "Strategy Consulting", icon: Lightbulb },
  { name: "Documentation", slug: "Documentation & Paperwork", icon: FileText },
];

export default function Home() {
  // Default to 3D Artists category
  const [selectedCategory, setSelectedCategory] = useState("3D & 2D Content Creation");

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
        title="Create.psx - Web3 Talent Marketplace | $CREATE & $PSX"
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

          {/* Category Browser - Main Focal Point */}
          <div className="space-y-8">
            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {serviceCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <Button
                    key={cat.slug}
                    variant={selectedCategory === cat.slug ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className="gap-2 hover-elevate active-elevate-2 whitespace-nowrap"
                    data-testid={`button-category-${cat.slug.toLowerCase().replace(/\s+/g, '-')}`}
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
                    Showing {servicesData.length} {selectedCategory ? serviceCategories.find(c => c.slug === selectedCategory)?.name : ''} services
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
                    <Link href={`/marketplace?categories=${selectedCategory}`}>
                      <Button variant="outline" size="lg" className="gap-2 hover-elevate" data-testid="button-view-all-category">
                        View All {serviceCategories.find(c => c.slug === selectedCategory)?.name} Services
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

      {/* Token Holder Benefits Section */}
      <section ref={benefitsSection.ref as any} className={`border-b bg-gradient-to-br from-primary/5 via-chart-2/5 to-background py-16 ${benefitsSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}>
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 gap-1.5 border-primary/40 bg-primary/10 text-primary">
              <Gift className="h-3 w-3" />
              Exclusive Rewards
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight mb-3">Token Holder Benefits</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hold $CREATE or $PSX tokens to unlock exclusive platform perks, discounts, and priority access
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-2">
              <div className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
                  <DollarSign className="h-6 w-6 text-chart-3" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">60% Lower Fees</h3>
                  <p className="text-sm text-muted-foreground">
                    Pay only 1% platform fee instead of 2.5% standard rate on all orders
                  </p>
                </div>
                <Badge variant="secondary" className="w-full justify-center">
                  Save on every order
                </Badge>
              </div>
            </Card>

            <Card className="border-2">
              <div className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                  <Zap className="h-6 w-6 text-chart-2" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Priority Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Get faster response times and dedicated assistance from our team
                  </p>
                </div>
                <Badge variant="secondary" className="w-full justify-center">
                  VIP treatment
                </Badge>
              </div>
            </Card>

            <Card className="border-2">
              <div className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
                  <CheckCircle2 className="h-6 w-6 text-chart-4" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Verified Badge</h3>
                  <p className="text-sm text-muted-foreground">
                    Display token holder badge on your profile to build trust with builders
                  </p>
                </div>
                <Badge variant="secondary" className="w-full justify-center">
                  Stand out
                </Badge>
              </div>
            </Card>

            <Card className="border-2">
              <div className="p-6 space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Early Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Be first to access new features, exclusive services, and premium builders
                  </p>
                </div>
                <Badge variant="secondary" className="w-full justify-center">
                  Beta features
                </Badge>
              </div>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Don't have tokens yet? Platform is fully accessible to everyone - benefits are optional rewards!
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="https://app.uniswap.org" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="gap-2 hover-elevate" data-testid="button-get-tokens">
                  <ExternalLink className="h-4 w-4" />
                  Get $PSX Tokens
                </Button>
              </a>
              <Link href="/marketplace">
                <Button className="gap-2" data-testid="button-browse-without-tokens">
                  Browse Without Tokens
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
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
