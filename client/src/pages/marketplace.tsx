import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { BuilderCard } from "@/components/builder-card";
import { EmptyState } from "@/components/empty-state";
import { SEOHead } from "@/components/seo-head";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, Users, Sparkles, TrendingUp, Code, BarChart3, Palette, Music, Network, Coins, Lightbulb, FileText, RefreshCw, AlertCircle } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import type { Builder, Service, Category } from "@shared/schema";
import { Badge } from "@/components/ui/badge";

const ratings = ["5 Stars", "4+ Stars", "3+ Stars"];
const deliveryTimes = ["24 hours", "3 days", "7 days", "14 days"];
const popularTags = [
  "Photoshop", "Blender", "Solidity", "React", "Twitter",
  "Discord", "Smart Contracts", "3D Animation", "UI/UX",
  "Viral Marketing", "Trading Bots", "Music Production"
];

const categoryIcons: Record<string, any> = {
  "KOLs & Influencers": Users,
  "3D Content Creation": Sparkles,
  "3D & 2D Content Creation": Sparkles,
  "Marketing & Growth": TrendingUp,
  "Script Development": Code,
  "Volume Services": BarChart3,
  "Creative & Design": Palette,
  "Graphic Design": Palette,
  "Audio & Production": Music,
  "Connectors & Network": Network,
  "Social Media Management": Network,
  "Grants & Funding": Coins,
  "Strategy Consulting": Lightbulb,
  "Documentation & Paperwork": FileText,
};

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const headerSection = useScrollReveal();
  const servicesGrid = useScrollReveal();

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
        <Label className="text-base font-semibold">Categories</Label>
        <div className="space-y-2">
          {categories && categories.map((category) => {
            const CategoryIcon = categoryIcons[category.name] || Code;
            return (
              <div 
                key={category.id} 
                className="flex items-center space-x-2 cursor-pointer hover-elevate active-elevate-2 rounded-md px-2 py-1 -mx-2"
                onClick={() => toggleCategory(category.slug)}
                data-testid={`filter-category-${category.slug}`}
              >
                <Checkbox
                  checked={selectedCategories.includes(category.slug)}
                  onCheckedChange={() => {}}
                  className="pointer-events-none"
                  data-testid={`checkbox-category-${category.slug}`}
                />
                <div className="flex items-center gap-2 flex-1">
                  <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    {category.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">Skills & Tools</Label>
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
        <Label className="text-base font-semibold">
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
        <Label className="text-base font-semibold">Rating</Label>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <div 
              key={rating} 
              className="flex items-center space-x-2 cursor-pointer hover-elevate active-elevate-2 rounded-md px-2 py-1 -mx-2"
              onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
              data-testid={`filter-rating-${rating.toLowerCase().replace(/\s+/g, '-').replace(/\+/g, 'plus')}`}
            >
              <Checkbox 
                checked={selectedRating === rating}
                onCheckedChange={() => {}}
                className="pointer-events-none"
                data-testid={`checkbox-rating-${rating.toLowerCase().replace(/\s+/g, '-').replace(/\+/g, 'plus')}`}
              />
              <span className="text-sm font-medium">
                {rating}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">Delivery Time</Label>
        <div className="space-y-2">
          {deliveryTimes.map((time) => (
            <div 
              key={time} 
              className="flex items-center space-x-2 cursor-pointer hover-elevate active-elevate-2 rounded-md px-2 py-1 -mx-2"
              onClick={() => setSelectedDeliveryTime(selectedDeliveryTime === time ? null : time)}
              data-testid={`filter-delivery-${time.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Checkbox 
                checked={selectedDeliveryTime === time}
                onCheckedChange={() => {}}
                className="pointer-events-none"
                data-testid={`checkbox-delivery-${time.toLowerCase().replace(/\s+/g, '-')}`}
              />
              <span className="text-sm font-medium">
                {time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Browse Services - Web3 Marketplace | Create.psx"
        description="Discover premium Web3 services: KOLs, 3D artists, developers, marketers, and volume services. Browse verified builders and book services with USDC on Base blockchain."
        keywords="web3 services, crypto services, KOL marketing, 3D design, blockchain development, volume trading, memecoin services"
        ogType="website"
      />
      <Header />

      <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div ref={headerSection.ref as any} className={`mb-8 space-y-4 ${headerSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Browse Services</h1>
              <p className="mt-2 text-muted-foreground">
                Find the perfect builder for your project
              </p>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-sort">
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

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search services, builders, or skills..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-marketplace-search"
              />
            </div>

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
            <div className="sticky top-24 space-y-6 rounded-lg border bg-card p-6">
              <h2 className="text-lg font-semibold">Filters</h2>
              <FilterSidebar />
            </div>
          </aside>

          <div>
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(9)].map((_, i) => (
                  <Skeleton key={i} className="h-[280px] w-full" />
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
              <div ref={servicesGrid.ref as any} className={servicesGrid.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}>
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {servicesData.length} results
                </div>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {servicesData.map(({ builder, service }) => (
                    <BuilderCard
                      key={service.id}
                      builder={builder}
                      service={service}
                    />
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
  );
}
