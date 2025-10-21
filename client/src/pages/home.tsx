import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { BuilderCard } from "@/components/builder-card";
import { CategoryPill } from "@/components/category-pill";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
        
        <div className="container relative mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="w-fit gap-1.5 border-primary/40 bg-primary/10 text-primary">
                  <Shield className="h-3 w-3" />
                  Token-Gated Premium Services
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Web3 Talent
                  <span className="block bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                    Meets Opportunity
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl">
                  The token-gated marketplace connecting premium builders with memecoin
                  and crypto projects. Quality assured through $PSX holdings.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/marketplace">
                  <Button size="lg" className="gap-2 text-base" data-testid="button-browse-services">
                    Browse Services
                    <ArrowRight className="h-4 w-4" />
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
                    <div className="font-semibold">$PSX Token Gated</div>
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

      <section className="border-b bg-background py-12">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Browse by Category</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Find specialized Web3 builders across all categories
              </p>
            </div>
          </div>

          {categoriesLoading ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-64 flex-shrink-0 rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {categories?.map((category) => {
                const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || Sparkles;
                return (
                  <Link key={category.id} href={`/category/${category.slug}`}>
                    <div className="group relative h-32 w-64 flex-shrink-0 overflow-hidden rounded-lg border bg-card p-5 transition-all hover-elevate active-elevate-2" data-testid={`category-card-${category.slug}`}>
                      <div className="flex h-full items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex flex-1 min-w-0 flex-col justify-between h-full">
                          <div>
                            <h3 className="mb-1 font-semibold text-base">{category.name}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {category.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              <span className="font-semibold text-foreground">{category.builderCount}</span> builders
                            </div>
                            <ArrowRight className="h-3 w-3 text-muted-foreground transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Featured Services</h2>
              <p className="mt-2 text-muted-foreground">
                Top-rated builders ready to bring your project to life
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

      <section className="border-t bg-muted/30 py-16">
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
                  P
                </div>
                <span className="text-lg font-bold">PSX Marketplace</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Token-gated marketplace for premium Web3 services
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
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Terms of Service</li>
                <li>Privacy Policy</li>
                <li>Cookie Policy</li>
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
