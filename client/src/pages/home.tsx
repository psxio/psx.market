import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import { Header } from "@/components/header";
import { WelcomeModal } from "@/components/welcome-modal";
import { BuilderCard } from "@/components/builder-card";
import { CategoryCard } from "@/components/category-card";
import { CategoryPill } from "@/components/category-pill";
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
  Users,
  CheckCircle2,
  Shield,
  ExternalLink,
  Handshake,
  Radio,
  Zap,
  Palette,
  Music,
  Boxes,
  Network,
  DollarSign,
  Gift,
  Lock,
} from "lucide-react";
import type { Builder, Service, Category } from "@shared/schema";

const categoryIcons = {
  kols: Megaphone,
  "3d-content": Box,
  marketing: TrendingUp,
  development: Code,
  volume: BarChart3,
  other: Sparkles,
};

const liveCategories = [
  { name: "All Categories", slug: "", icon: Zap },
  { name: "KOLs & Influencers", slug: "KOLs & Influencers", icon: Megaphone },
  { name: "3D Artists", slug: "3D Content Creation", icon: Boxes },
  { name: "Marketing", slug: "Marketing & Growth", icon: TrendingUp },
  { name: "Developers", slug: "Script Development", icon: Code },
  { name: "Creative & Design", slug: "Creative & Design", icon: Palette },
  { name: "Audio & Production", slug: "Audio & Production", icon: Music },
  { name: "Volume Services", slug: "Volume Services", icon: BarChart3 },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: builders, isLoading: buildersLoading, isError: buildersError } = useQuery<Builder[]>({
    queryKey: ["/api/builders/featured"],
  });

  const { data: liveBuilders, isLoading: liveLoading, isError: liveError } = useQuery<Builder[]>({
    queryKey: ["/api/builders/live", selectedCategory],
  });

  const { data: servicesData, isLoading: servicesLoading, isError: servicesError } = useQuery<
    Array<{ builder: Builder; service: Service }>
  >({
    queryKey: ["/api/services/featured"],
  });

  const agencySection = useScrollReveal();
  const liveSection = useScrollReveal();
  const servicesSection = useScrollReveal();
  const buildersSection = useScrollReveal();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <WelcomeModal />

      <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
        
        <div className="container relative mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="w-fit gap-1.5 border-primary/40 bg-primary/10 text-primary">
                    <Gift className="h-3 w-3" />
                    Token Holder Benefits
                  </Badge>
                  <Badge variant="default" className="w-fit gap-1.5 animate-pulse">
                    <Sparkles className="h-3 w-3" />
                    Save Up to 60% with Tokens
                  </Badge>
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Web3 Talent
                  <span className="block bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                    Meets Opportunity
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl">
                  The open Web3 marketplace connecting premium builders with memecoin
                  and crypto projects. Hold $CREATE or $PSX tokens for exclusive benefits and reduced fees.
                </p>
                <div className="rounded-lg border border-chart-3/30 bg-chart-3/5 p-4">
                  <p className="text-sm font-medium text-chart-3 flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    Token Holder Perks: 60% lower platform fees (1% vs 2.5%), priority support, exclusive badges, and early access to new features!
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href="/marketplace">
                  <Button size="lg" className="gap-2 text-base" data-testid="button-browse-services">
                    Browse Services
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

              <div className="flex flex-wrap items-center gap-6 border-t pt-8 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold">500+ Builders</div>
                    <div className="text-muted-foreground">Ready to deliver</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-chart-3" />
                  <div>
                    <div className="font-semibold">2,000+ Projects</div>
                    <div className="text-muted-foreground">Successfully completed</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-chart-2" />
                  <div>
                    <div className="font-semibold">Token Holder Benefits</div>
                    <div className="text-muted-foreground">Exclusive perks & savings</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative h-[500px] w-full">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-chart-2/20 to-chart-3/20 blur-3xl" />
                <div className="relative flex h-full items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 p-8">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="h-32 w-32 rounded-xl border bg-card/50 backdrop-blur-sm"
                        style={{
                          animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Token Holder Benefits Section */}
      <section className="border-b bg-gradient-to-br from-primary/5 via-chart-2/5 to-background py-16">
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

      <section ref={liveSection.ref as any} className={`relative overflow-hidden border-b py-16 ${liveSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-chart-3/5 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-chart-2/10 via-transparent to-transparent" />
        
        <div className="container relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-chart-3 animate-pulse" />
              <Badge variant="outline" className="gap-1.5 border-chart-3/40 bg-chart-3/10 text-chart-3">
                <Radio className="h-3 w-3" />
                Live Now
              </Badge>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-center mb-3">Buy on Demand</h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              Connect instantly with builders who are currently online and ready to start your project
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {liveCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Button
                  key={cat.slug}
                  variant={selectedCategory === cat.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className="gap-2 hover-elevate active-elevate-2 whitespace-nowrap"
                  data-testid={`button-filter-${cat.slug || 'all'}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{cat.name}</span>
                </Button>
              );
            })}
          </div>

          {liveLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-[340px] w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : liveError ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-card/50 backdrop-blur-sm py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
                <Radio className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Failed to load live builders</h3>
              <p className="text-sm text-muted-foreground">Please try again later</p>
            </div>
          ) : !liveBuilders || liveBuilders.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-card/50 backdrop-blur-sm py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Radio className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No builders live right now</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {selectedCategory ? `No ${selectedCategory} builders are currently online` : "Check back soon or browse all builders"}
              </p>
              <Link href="/marketplace">
                <Button variant="outline" className="gap-2 hover-elevate">
                  Browse All Builders
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {liveBuilders.map((builder) => (
                  <div key={builder.id} className="relative group">
                    <div className="absolute -top-2 -right-2 z-10">
                      <Badge className="gap-1.5 bg-chart-3 border-0 text-white shadow-lg animate-pulse">
                        <div className="h-2 w-2 rounded-full bg-white" />
                        Live
                      </Badge>
                    </div>
                    <BuilderCard builder={builder} />
                  </div>
                ))}
              </div>
              
              {liveBuilders.length > 0 && (
                <div className="mt-8 text-center">
                  <Link href="/marketplace">
                    <Button variant="outline" className="gap-2 hover-elevate" data-testid="button-view-marketplace">
                      View All Builders
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section ref={servicesSection.ref as any} className={`border-b py-16 ${servicesSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}>
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <Badge variant="default" className="mb-3 gap-1.5">
                <CheckCircle2 className="h-3 w-3" />
                Ready to Book
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight">Featured Services & Offerings</h2>
              <p className="mt-2 text-muted-foreground">
                Browse specific services with pricing, portfolios, and instant booking
              </p>
            </div>
            <Link href="/marketplace">
              <Button variant="ghost" className="gap-2 hover-elevate" data-testid="button-view-all-services">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {servicesLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-[280px] w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : servicesError ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
              <h3 className="mb-2 text-lg font-semibold">Failed to load services</h3>
              <p className="text-sm text-muted-foreground">Please try again later</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {servicesData?.slice(0, 4).map(({ builder, service }) => (
                <BuilderCard
                  key={service.id}
                  builder={builder}
                  service={service}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section ref={buildersSection.ref as any} className={`relative overflow-hidden border-t py-24 ${buildersSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-chart-2/5 to-chart-3/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-chart-3/10 to-transparent" />
        
        <div className="container relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mb-6 inline-flex items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary" />
              <Badge variant="default" className="gap-1.5 bg-gradient-to-r from-primary via-chart-2 to-chart-3 border-0 text-base px-4 py-1.5">
                <Sparkles className="h-4 w-4 animate-pulse" />
                Elite Talent Showcase
              </Badge>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary" />
            </div>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              <span className="bg-gradient-to-r from-foreground via-primary to-chart-2 bg-clip-text text-transparent">
                Top Builders
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto md:text-xl">
              Verified experts with proven track records, exceptional ratings, and thousands of successful deliveries
            </p>
            
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-foreground">100% Verified</div>
                  <div className="text-muted-foreground text-xs">Background checked</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-3/10 border border-chart-3/20">
                  <Users className="h-5 w-5 text-chart-3" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-foreground">4.9+ Rating</div>
                  <div className="text-muted-foreground text-xs">Average score</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-chart-2/10 border border-chart-2/20">
                  <Shield className="h-5 w-5 text-chart-2" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-foreground">Token Gated</div>
                  <div className="text-muted-foreground text-xs">Quality assured</div>
                </div>
              </div>
            </div>
          </div>

          {buildersLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-[360px] w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : buildersError ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed bg-card/50 backdrop-blur-sm py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
                <Shield className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Failed to load builders</h3>
              <p className="text-sm text-muted-foreground">Please try again later</p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {builders?.map((builder, index) => (
                  <div
                    key={builder.id}
                    className="relative group"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    {index === 0 && (
                      <div className="absolute -top-4 -right-4 z-10">
                        <Badge className="bg-gradient-to-r from-chart-4 via-chart-3 to-primary border-0 text-white px-3 py-1 shadow-lg animate-pulse">
                          #1 Top Rated
                        </Badge>
                      </div>
                    )}
                    {index === 1 && (
                      <div className="absolute -top-4 -right-4 z-10">
                        <Badge className="bg-gradient-to-r from-chart-3 to-chart-2 border-0 text-white px-3 py-1 shadow-lg">
                          Featured
                        </Badge>
                      </div>
                    )}
                    <BuilderCard builder={builder} />
                  </div>
                ))}
              </div>
              
              <div className="mt-12 text-center">
                <Link href="/marketplace">
                  <Button size="lg" variant="outline" className="gap-2 hover-elevate group border-2" data-testid="button-view-all-builders">
                    <span>Explore All Builders</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
