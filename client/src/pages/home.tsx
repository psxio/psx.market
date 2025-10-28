import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import { Header } from "@/components/header";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Megaphone,
  Box,
  TrendingUp,
  Code,
  BarChart3,
  Palette,
  Music,
  Boxes,
  Network,
  Coins,
  Lightbulb,
  Search,
  FileText,
  Shield,
  Star,
  CheckCircle2,
} from "lucide-react";
import type { Builder, Service } from "@shared/schema";

const serviceCategories = [
  { name: "KOLs", slug: "KOLs & Influencers", icon: Megaphone },
  { name: "Developers", slug: "Script Development", icon: Code },
  { name: "3D Artists", slug: "3D Content Creation", icon: Boxes },
  { name: "Volume", slug: "Volume Services", icon: BarChart3 },
  { name: "Marketing", slug: "Marketing & Growth", icon: TrendingUp },
  { name: "Strategy", slug: "Strategy Consulting", icon: Lightbulb },
  { name: "Design", slug: "Graphic Design", icon: Palette },
  { name: "Social", slug: "Social Media Management", icon: Network },
  { name: "Docs", slug: "Documentation & Paperwork", icon: FileText },
  { name: "Grants", slug: "grants-funding", icon: Coins },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("KOLs & Influencers");

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

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="port444 - Find Web3 Talent"
        description="Browse premium Web3 builders by category. Connect with developers, designers, marketers, and more for your crypto projects."
        keywords="web3, marketplace, builders, freelancers, developers, designers, crypto"
        ogType="website"
      />
      <Header />

      {/* Hero Section - Clean and Minimal */}
      <section className="border-b bg-white">
        <div className="container mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h1 className="text-5xl font-bold tracking-tight" data-testid="heading-hero">
              Find Web3 Talent
            </h1>
            <p className="text-xl text-muted-foreground">
              Browse builders by category
            </p>
            <p className="text-sm text-muted-foreground">
              12,000+ builders • 50k+ projects
            </p>
          </div>
        </div>
      </section>

      {/* Category Icons Grid */}
      <section className="border-b bg-white">
        <div className="container mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {serviceCategories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`flex flex-col items-center justify-center gap-3 p-4 rounded-lg border transition-all hover:shadow-md ${
                    isSelected 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border bg-white'
                  }`}
                  data-testid={`button-category-${cat.slug.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="h-20 w-20 flex items-center justify-center">
                    <Icon 
                      className={`h-8 w-8 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} 
                      strokeWidth={1.5}
                    />
                  </div>
                  <span className={`text-sm font-medium text-center ${
                    isSelected ? 'text-primary' : 'text-foreground'
                  }`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-background">
        <div className="container mx-auto max-w-7xl px-6 py-16 md:px-8 md:py-24">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">
              {serviceCategories.find(c => c.slug === selectedCategory)?.name || 'All Services'}
            </h2>
            <p className="text-sm text-muted-foreground" data-testid="text-services-count">
              {servicesLoading ? 'Loading...' : `${servicesData?.length || 0} services available`}
            </p>
          </div>

          {servicesLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-[280px] w-full rounded-lg" />
              ))}
            </div>
          ) : servicesError ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white py-16 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Failed to load services</h3>
              <p className="text-sm text-muted-foreground">Please try again later</p>
            </div>
          ) : !servicesData || servicesData.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-white py-16 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No services found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                No services available in this category
              </p>
              <Link href="/marketplace">
                <Button variant="outline" data-testid="button-browse-all">
                  Browse All Services
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="grid-category-services">
                {servicesData.map(({ builder, service }) => (
                  <Link key={service.id} href={`/service/${service.id}`}>
                    <Card 
                      className="p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer"
                      data-testid={`card-service-${service.id}`}
                    >
                      {/* Builder Info */}
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={builder?.profileImage || undefined} />
                          <AvatarFallback>
                            {builder?.name?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm truncate">
                              {builder?.name || 'Anonymous'}
                            </p>
                            {builder?.verified && (
                              <CheckCircle2 className="h-4 w-4 text-cyan-500 flex-shrink-0" />
                            )}
                          </div>
                          {builder?.rating && (
                            <div className="flex items-center gap-1 text-sm">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium">{Number(builder.rating).toFixed(1)}</span>
                              {builder.reviewCount && builder.reviewCount > 0 && (
                                <span className="text-muted-foreground">({builder.reviewCount})</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Service Title */}
                      <h3 className="font-medium text-base mb-2 line-clamp-2">
                        {service.title}
                      </h3>

                      {/* Service Description */}
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {service.description}
                      </p>

                      {/* Price and Delivery */}
                      <div className="flex items-center justify-between pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Starting at</p>
                          <p className="text-lg font-semibold">${service.basicPrice}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Delivery</p>
                          <p className="text-sm font-medium">{service.deliveryTime}</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {servicesData.length > 0 && (
                <div className="mt-12 text-center">
                  <Link href={`/marketplace?categories=${selectedCategory}`}>
                    <Button variant="outline" size="lg" data-testid="button-view-all-category">
                      View All {serviceCategories.find(c => c.slug === selectedCategory)?.name}
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Token Benefits - Small Bottom Mention */}
      <section className="border-t bg-background">
        <div className="container mx-auto max-w-7xl px-6 py-8 md:px-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Hold $CREATE or $PSX tokens for 60% lower fees (1% vs 2.5%) and priority support.{' '}
              <a 
                href="https://app.uniswap.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Learn more
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
