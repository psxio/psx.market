import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Header } from "@/components/header";
import { EmptyState } from "@/components/empty-state";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, AlertCircle, Star } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Builder, Service, Category } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

const ratings = ["5 Stars", "4+ Stars", "3+ Stars"];
const deliveryTimes = ["24 hours", "3 days", "7 days", "14 days"];
const popularTags = [
  "Photoshop", "Blender", "Solidity", "React", "Twitter",
  "Discord", "Smart Contracts", "3D Animation", "UI/UX",
  "Viral Marketing", "Trading Bots", "Music Production"
];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, []);

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategories.length > 0) params.set("categories", selectedCategories.join(","));
    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
    if (sortBy && sortBy !== "relevance") params.set("sortBy", sortBy);
    
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < 10000) params.set("maxPrice", priceRange[1].toString());
    
    if (selectedRating) {
      const ratingMap: Record<string, string> = {
        "5 Stars": "5",
        "4+ Stars": "4",
        "3+ Stars": "3",
      };
      params.set("minRating", ratingMap[selectedRating]);
    }
    
    if (selectedDeliveryTime) {
      params.set("deliveryTime", selectedDeliveryTime);
    }
    
    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  };

  const { data: servicesData, isLoading, isError } = useQuery<
    Array<{ builder: Builder; service: Service }>
  >({
    queryKey: [
      "/api/services",
      searchQuery,
      selectedCategories.join(","),
      selectedTags.join(","),
      sortBy,
      priceRange[0],
      priceRange[1],
      selectedRating,
      selectedDeliveryTime,
    ],
    queryFn: async () => {
      const queryString = buildQueryString();
      const url = `/api/services${queryString}`;
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
      return response.json();
    },
  });

  const toggleCategory = (categorySlug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categorySlug)
        ? prev.filter((c) => c !== categorySlug)
        : [...prev, categorySlug]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Categories</Label>
        <div className="space-y-2">
          {categories && categories.map((category) => (
            <div 
              key={category.id} 
              className="flex items-center space-x-2 cursor-pointer hover-elevate active-elevate-2 rounded-md px-2 py-1.5 -mx-2"
              onClick={() => toggleCategory(category.slug)}
              data-testid={`filter-category-${category.slug}`}
            >
              <Checkbox
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={() => {}}
                className="pointer-events-none"
                data-testid={`checkbox-category-${category.slug}`}
              />
              <span className="text-sm">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Skills & Tools</Label>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer no-default-hover-elevate hover-elevate active-elevate-2"
              onClick={() => toggleTag(tag)}
              data-testid={`tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </Label>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={10000}
          step={100}
          className="py-4"
          data-testid="slider-price"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Rating</Label>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <div 
              key={rating} 
              className="flex items-center space-x-2 cursor-pointer hover-elevate active-elevate-2 rounded-md px-2 py-1.5 -mx-2"
              onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
              data-testid={`filter-rating-${rating.toLowerCase().replace(/\s+/g, '-').replace(/\+/g, 'plus')}`}
            >
              <Checkbox 
                checked={selectedRating === rating}
                onCheckedChange={() => {}}
                className="pointer-events-none"
                data-testid={`checkbox-rating-${rating.toLowerCase().replace(/\s+/g, '-').replace(/\+/g, 'plus')}`}
              />
              <span className="text-sm">
                {rating}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Delivery Time</Label>
        <div className="space-y-2">
          {deliveryTimes.map((time) => (
            <div 
              key={time} 
              className="flex items-center space-x-2 cursor-pointer hover-elevate active-elevate-2 rounded-md px-2 py-1.5 -mx-2"
              onClick={() => setSelectedDeliveryTime(selectedDeliveryTime === time ? null : time)}
              data-testid={`filter-delivery-${time.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Checkbox 
                checked={selectedDeliveryTime === time}
                onCheckedChange={() => {}}
                className="pointer-events-none"
                data-testid={`checkbox-delivery-${time.toLowerCase().replace(/\s+/g, '-')}`}
              />
              <span className="text-sm">
                {time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const ServiceCard = ({ builder, service }: { builder: Builder; service: Service }) => {
    const initials = builder.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <Link href={`/service/${service.id}`}>
        <Card 
          className="p-4 rounded-lg border hover:shadow-md transition-shadow cursor-pointer h-full"
          data-testid={`card-service-${service.id}`}
        >
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={builder.profileImage || undefined} alt={builder.name} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{builder.name}</p>
            </div>
          </div>

          <h3 className="text-base font-medium mb-2 line-clamp-2">
            {service.title}
          </h3>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
            {service.description}
          </p>

          {builder.rating && (
            <div className="flex items-center gap-1 mb-3">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{builder.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({builder.reviewCount || 0})
              </span>
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t">
            <div>
              <span className="font-semibold">From ${service.basicPrice}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {service.deliveryTime}
            </span>
          </div>
        </Card>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Browse Services - Web3 Marketplace | port444"
        description="Discover premium Web3 services: KOLs, 3D artists, developers, marketers, and volume services. Browse verified builders and book services with USDC on Base blockchain."
        keywords="web3 services, crypto services, KOL marketing, 3D design, blockchain development, volume trading, memecoin services"
        ogType="website"
      />
      <Header />

      <div className="py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-6 md:px-8">
          <div className="mb-12 space-y-6">
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-bold">Browse Services</h1>
              <p className="text-lg text-muted-foreground">
                Explore Web3 services by category
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search services, builders, or skills..."
                  className="h-14 pl-12 bg-background border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-marketplace-search"
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" size="default" className="gap-2" data-testid="button-filters">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>

              <div className="ml-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]" data-testid="select-sort">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="recent">Most Recent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {(selectedCategories.length > 0 || selectedTags.length > 0) && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {selectedCategories.map((category) => (
                  <Button
                    key={category}
                    variant="secondary"
                    size="sm"
                    onClick={() => toggleCategory(category)}
                    className="gap-1"
                    data-testid={`active-filter-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {category}
                    <span className="text-muted-foreground">×</span>
                  </Button>
                ))}
                {selectedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer no-default-hover-elevate"
                    onClick={() => toggleTag(tag)}
                    data-testid={`active-filter-tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 bg-background border-r pr-6">
                <FilterSidebar />
              </div>
            </aside>

            <div>
              {isLoading ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {[...Array(9)].map((_, i) => (
                    <Skeleton key={i} className="h-[240px] w-full" />
                  ))}
                </div>
              ) : isError ? (
                <EmptyState
                  icon={AlertCircle}
                  title="Failed to load services"
                  description="We couldn't load services at this time. Please try again later."
                  actionLabel="Retry"
                  onAction={() => window.location.reload()}
                />
              ) : servicesData && servicesData.length > 0 ? (
                <div>
                  <div className="mb-6 text-sm text-muted-foreground" data-testid="text-results-count">
                    {servicesData.length} {servicesData.length === 1 ? 'service' : 'services'} found
                  </div>
                  
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" data-testid="grid-services">
                    {servicesData.map(({ builder, service }) => (
                      <ServiceCard key={service.id} builder={builder} service={service} />
                    ))}
                  </div>
                </div>
              ) : (
                <EmptyState
                  icon={Search}
                  title="No services found"
                  description="Try adjusting your search terms or filters to find what you're looking for."
                  actionLabel="Clear Filters"
                  onAction={() => {
                    setSearchQuery("");
                    setSelectedCategories([]);
                    setSelectedTags([]);
                    setPriceRange([0, 10000]);
                    setSelectedRating(null);
                    setSelectedDeliveryTime(null);
                  }}
                  secondaryActionLabel="Browse All"
                  onSecondaryAction={() => {
                    setSearchQuery("");
                    setSelectedCategories([]);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
