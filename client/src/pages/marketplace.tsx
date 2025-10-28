import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/header";
import { BuilderCard } from "@/components/builder-card";
import { SwipeableServiceGrid } from "@/components/swipeable-service-grid";
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
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  const headerSection = useScrollReveal();
  const servicesGrid = useScrollReveal();

  // Read URL parameters on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    // Search query
    const searchParam = params.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    
    // Categories
    const categoriesParam = params.get("categories");
    if (categoriesParam) {
      const categoryArray = categoriesParam.split(',').map(c => c.trim()).filter(Boolean);
      setSelectedCategories(categoryArray);
    }
    
    // Tags
    const tagsParam = params.get("tags");
    if (tagsParam) {
      const tagArray = tagsParam.split(',').map(t => t.trim()).filter(Boolean);
      setSelectedTags(tagArray);
    }
    
    // Sort
    const sortByParam = params.get("sortBy");
    if (sortByParam) {
      setSortBy(sortByParam);
    }
    
    // Price range
    const minPriceParam = params.get("minPrice");
    const maxPriceParam = params.get("maxPrice");
    if (minPriceParam || maxPriceParam) {
      setPriceRange([
        minPriceParam ? parseInt(minPriceParam) : 0,
        maxPriceParam ? parseInt(maxPriceParam) : 10000
      ]);
    }
    
    // Rating
    const minRatingParam = params.get("minRating");
    if (minRatingParam) {
      const ratingReverseMap: Record<string, string> = {
        "5": "5 Stars",
        "4": "4+ Stars",
        "3": "3+ Stars",
      };
      setSelectedRating(ratingReverseMap[minRatingParam] || null);
    }
    
    // Delivery time
    const deliveryTimeParam = params.get("deliveryTime");
    if (deliveryTimeParam) {
      setSelectedDeliveryTime(deliveryTimeParam);
    }
    
    setInitialLoad(false);
  }, []);

  // Sync URL with filter state changes
  useEffect(() => {
    // Skip URL update on initial load
    if (initialLoad) return;
    
    const params = new URLSearchParams();
    
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategories.length > 0) params.set("categories", selectedCategories.join(","));
    if (selectedTags.length > 0) params.set("tags", selectedTags.join(","));
    if (sortBy && sortBy !== "relevance") params.set("sortBy", sortBy);
    
    // Price range
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < 10000) params.set("maxPrice", priceRange[1].toString());
    
    // Rating
    if (selectedRating) {
      const ratingMap: Record<string, string> = {
        "5 Stars": "5",
        "4+ Stars": "4",
        "3+ Stars": "3",
      };
      params.set("minRating", ratingMap[selectedRating]);
    }
    
    // Delivery time
    if (selectedDeliveryTime) {
      params.set("deliveryTime", selectedDeliveryTime);
    }
    
    const queryString = params.toString();
    const newUrl = queryString ? `/marketplace?${queryString}` : '/marketplace';
    
    // Update URL without adding to history
    window.history.replaceState({}, '', newUrl);
  }, [searchQuery, selectedCategories, selectedTags, sortBy, priceRange, selectedRating, selectedDeliveryTime, initialLoad]);

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
    <div className="space-y-8">
      <div className="space-y-4">
        <Label className="text-lg font-bold">Categories</Label>
        <div className="space-y-2.5">
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

      <div className="space-y-4">
        <Label className="text-lg font-bold">Skills & Tools</Label>
        <div className="flex flex-wrap gap-2.5">
          {popularTags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? "default" : "outline"}
              className="cursor-pointer no-default-hover-elevate hover-elevate active-elevate-2 text-sm px-3 py-1"
              onClick={() => toggleTag(tag)}
              data-testid={`tag-${tag.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-bold">
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

      <div className="space-y-4">
        <Label className="text-lg font-bold">Rating</Label>
        <div className="space-y-2.5">
          {ratings.map((rating) => (
            <div 
              key={rating} 
              className="flex items-center space-x-3 cursor-pointer hover-elevate active-elevate-2 rounded-lg px-3 py-2 -mx-3"
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

      <div className="space-y-4">
        <Label className="text-lg font-bold">Delivery Time</Label>
        <div className="space-y-2.5">
          {deliveryTimes.map((time) => (
            <div 
              key={time} 
              className="flex items-center space-x-3 cursor-pointer hover-elevate active-elevate-2 rounded-lg px-3 py-2 -mx-3"
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
        title="Browse Services - Web3 Marketplace | port444"
        description="Discover premium Web3 services: KOLs, 3D artists, developers, marketers, and volume services. Browse verified builders and book services with USDC on Base blockchain."
        keywords="web3 services, crypto services, KOL marketing, 3D design, blockchain development, volume trading, memecoin services"
        ogType="website"
      />
      <Header />

      <div className="container mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:px-8">
        <div ref={headerSection.ref as any} className={`mb-12 space-y-6 ${headerSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Browse Services</h1>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
                Discover premium Web3 services from verified builders
              </p>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[200px] h-12" data-testid="select-sort">
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

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search services, builders, or skills..."
                className="pl-11 h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-marketplace-search"
              />
            </div>

            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="lg" className="gap-2 h-12 px-6" data-testid="button-filters">
                  <SlidersHorizontal className="h-5 w-5" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-xl">Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-8">
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

        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6 rounded-xl border-2 bg-card p-6 shadow-sm">
              <h2 className="text-xl font-bold">Filters</h2>
              <FilterSidebar />
            </div>
          </aside>

          <div>
            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(9)].map((_, i) => (
                  <Skeleton key={i} className="h-[340px] w-full rounded-xl" />
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
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-base md:text-lg font-semibold" data-testid="text-results-count">
                    {servicesData.length} {servicesData.length === 1 ? 'service' : 'services'} found
                  </div>
                </div>
                
                {/* Mobile Swipeable Grid */}
                <SwipeableServiceGrid
                  services={servicesData.map(({ builder, service }) => ({
                    id: service.id,
                    title: service.title,
                    builderId: builder.id,
                    builderName: builder.name,
                    builderProfileImage: builder.profileImage || undefined,
                    category: service.category,
                    basicPrice: service.basicPrice,
                    rating: builder.rating || undefined,
                    reviewCount: builder.reviewCount,
                    image: service.portfolioMedia?.[0],
                    tokenTickers: service.tokenTickers || undefined,
                    deliveryTime: service.deliveryTime,
                  }))}
                />

                {/* Desktop Grid */}
                <div className="hidden md:grid gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid="grid-services">
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
