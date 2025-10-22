import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { BuilderCard } from "@/components/builder-card";
import { CategoryCard } from "@/components/category-card";
import { CategoryPill } from "@/components/category-pill";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export default function Home() {
  const { data: builders, isLoading: buildersLoading, isError: buildersError } = useQuery<Builder[]>({
    queryKey: ["/api/builders/featured"],
  });

  const { data: servicesData, isLoading: servicesLoading, isError: servicesError } = useQuery<
    Array<{ builder: Builder; service: Service }>
  >({
    queryKey: ["/api/services/featured"],
  });

  const { data: categories, isLoading: categoriesLoading, isError: categoriesError } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const agencySection = useScrollReveal();
  const categoriesSection = useScrollReveal();
  const servicesSection = useScrollReveal();
  const buildersSection = useScrollReveal();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
        
        <div className="container relative mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="w-fit gap-1.5 border-primary/40 bg-primary/10 text-primary">
                    <Shield className="h-3 w-3" />
                    Token-Gated Premium Services
                  </Badge>
                  <Badge variant="default" className="w-fit gap-1.5 animate-pulse">
                    <Sparkles className="h-3 w-3" />
                    First 50 Builders + 2 Clients FREE
                  </Badge>
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Web3 Talent
                  <span className="block bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                    Meets Opportunity
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl">
                  The dual token-gated marketplace connecting premium builders with memecoin
                  and crypto projects. Quality assured through $CREATE and $PSX holdings.
                </p>
                <div className="rounded-lg border border-chart-3/30 bg-chart-3/5 p-4">
                  <p className="text-sm font-medium text-chart-3">
                    🎉 Launch Special: The first 50 approved builders and first 2 clients get FREE whitelisted access — no tokens required!
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
                  <Shield className="h-5 w-5 text-chart-2" />
                  <div>
                    <div className="font-semibold">$CREATE & $PSX Gated</div>
                    <div className="text-muted-foreground">Quality guaranteed</div>
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

      <section ref={categoriesSection.ref as any} className={`border-b bg-gradient-to-b from-background to-muted/20 py-16 ${categoriesSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}>
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge variant="outline" className="mb-4 gap-1.5 border-primary/40 bg-primary/10 text-primary">
              <Sparkles className="h-3 w-3" />
              Explore Categories
            </Badge>
            <h2 className="text-4xl font-bold tracking-tight">Browse by Category</h2>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover premium Web3 builders across all specialized verticals
            </p>
          </div>

          {categoriesLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-[280px] w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories?.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  builderCount={category.builderCount}
                />
              ))}
            </div>
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
              {[...Array(8)].map((_, i) => (
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
              {servicesData?.map(({ builder, service }) => (
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

      <section ref={buildersSection.ref as any} className={`border-t bg-muted/30 py-16 ${buildersSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}>
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Top Builders</h2>
              <p className="mt-2 text-muted-foreground">
                Verified experts with proven track records
              </p>
            </div>
            <Link href="/marketplace">
              <Button variant="ghost" className="gap-2 hover-elevate" data-testid="button-view-all-builders">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {buildersLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-[260px] w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : buildersError ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
              <h3 className="mb-2 text-lg font-semibold">Failed to load builders</h3>
              <p className="text-sm text-muted-foreground">Please try again later</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {builders?.map((builder) => (
                <BuilderCard key={builder.id} builder={builder} />
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="border-t py-12">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-lg">
                  C
                </div>
                <span className="text-lg font-bold">Create.psx</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Dual token-gated marketplace powered by $CREATE and $PSX
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Categories</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>KOLs & Influencers</li>
                <li>3D Content Creators</li>
                <li>Marketing & Growth</li>
                <li>Development</li>
                <li>Volume Services</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About PSX</li>
                <li>How It Works</li>
                <li>Token Requirements</li>
                <li>Base Network</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookie-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 PSX Agency. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}
