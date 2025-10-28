import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, Users, Sparkles, TrendingUp, Code, BarChart3, Palette, Star, DollarSign, Image } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import type { Builder, Category } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ratings = ["5 Stars", "4+ Stars", "3+ Stars"];
const availabilityOptions = ["available", "busy", "away"];
const languages = ["English", "Spanish", "Mandarin", "French", "German", "Japanese", "Portuguese"];

const budgetRanges = [
  { label: "Under $500", min: 0, max: 500 },
  { label: "$500 - $1,000", min: 500, max: 1000 },
  { label: "$1,000 - $2,500", min: 1000, max: 2500 },
  { label: "$2,500 - $5,000", min: 2500, max: 5000 },
  { label: "$5,000 - $10,000", min: 5000, max: 10000 },
  { label: "$10,000 - $20,000", min: 10000, max: 20000 },
  { label: "$20,000+", min: 20000, max: 999999 },
];

const categoryIcons: Record<string, any> = {
  "KOLs & Influencers": Users,
  "3D & 2D Content Creation": Sparkles,
  "Marketing & Growth": TrendingUp,
  "Script Development": Code,
  "Volume Services": BarChart3,
  "Graphic Design": Palette,
  "Social Media Management": Users,
};

export default function BrowseBuilders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [selectedAvailability, setSelectedAvailability] = useState<string | null>(null);
  const [selectedBudgetRange, setSelectedBudgetRange] = useState<typeof budgetRanges[0] | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  const headerSection = useScrollReveal();
  const buildersGrid = useScrollReveal();

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
    if (selectedLanguages.length > 0) params.set("languages", selectedLanguages.join(","));
    if (sortBy && sortBy !== "relevance") params.set("sortBy", sortBy);
    
    if (selectedRating) {
      const ratingMap: Record<string, string> = {
        "5 Stars": "5",
        "4+ Stars": "4",
        "3+ Stars": "3",
      };
      params.set("minRating", ratingMap[selectedRating]);
    }
    
    if (selectedAvailability) {
      params.set("availability", selectedAvailability);
    }
    
    if (selectedBudgetRange) {
      params.set("minBudget", selectedBudgetRange.min.toString());
      params.set("maxBudget", selectedBudgetRange.max.toString());
    }
    
    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  };

  const { data: buildersData, isLoading, isError } = useQuery<Builder[]>({
    queryKey: [
      "/api/builders",
      searchQuery,
      selectedCategories.join(","),
      selectedLanguages.join(","),
      sortBy,
      selectedRating,
      selectedAvailability,
      selectedBudgetRange?.min,
      selectedBudgetRange?.max,
    ],
    queryFn: async () => {
      const queryString = buildQueryString();
      const url = `/api/builders${queryString}`;
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
      return response.json();
    },
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleLanguage = (language: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((l) => l !== language)
        : [...prev, language]
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
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={selectedCategories.includes(category.name)}
                  onCheckedChange={() => toggleCategory(category.name)}
                  data-testid={`checkbox-category-${category.slug}`}
                />
                <label
                  htmlFor={category.id}
                  className="flex items-center gap-2 flex-1 cursor-pointer"
                >
                  <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {category.name}
                  </span>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-bold">Languages</Label>
        <div className="flex flex-wrap gap-2.5">
          {languages.map((language) => (
            <Badge
              key={language}
              variant={selectedLanguages.includes(language) ? "default" : "outline"}
              className="cursor-pointer no-default-hover-elevate hover-elevate active-elevate-2 text-sm px-3 py-1"
              onClick={() => toggleLanguage(language)}
              data-testid={`language-${language.toLowerCase()}`}
            >
              {language}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-bold">Rating</Label>
        <div className="space-y-2.5">
          {ratings.map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox 
                id={rating}
                checked={selectedRating === rating}
                onCheckedChange={(checked) => setSelectedRating(checked ? rating : null)}
                data-testid={`checkbox-rating-${rating.toLowerCase().replace(/\s+/g, '-').replace(/\+/g, 'plus')}`}
              />
              <label
                htmlFor={rating}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {rating}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-bold">Availability</Label>
        <div className="space-y-2.5">
          {availabilityOptions.map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox 
                id={status}
                checked={selectedAvailability === status}
                onCheckedChange={(checked) => setSelectedAvailability(checked ? status : null)}
                data-testid={`checkbox-availability-${status}`}
              />
              <label
                htmlFor={status}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer capitalize"
              >
                {status}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-lg font-bold">Budget Range</Label>
        <div className="space-y-2.5">
          {budgetRanges.map((range) => (
            <div key={range.label} className="flex items-center space-x-2">
              <Checkbox 
                id={range.label}
                checked={selectedBudgetRange?.label === range.label}
                onCheckedChange={(checked) => setSelectedBudgetRange(checked ? range : null)}
                data-testid={`checkbox-budget-${range.label.toLowerCase().replace(/[\s$,+]/g, '-')}`}
              />
              <label
                htmlFor={range.label}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {range.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <div ref={headerSection.ref as any} className={`mb-12 space-y-6 ${headerSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">Browse Builders</h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
                Discover talented builders for your Web3 projects
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
              <Button asChild variant="outline" size="lg" className="gap-2" data-testid="link-browse-portfolios">
                <Link href="/portfolios">
                  <Image className="h-5 w-5" />
                  Browse Portfolios
                </Link>
              </Button>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[200px]" data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="projects">Most Projects</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search builders by name, skills, or expertise..."
                className="pl-11 h-12 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-builders-search"
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

          {(selectedCategories.length > 0 || selectedLanguages.length > 0) && (
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
              {selectedLanguages.map((language) => (
                <Badge
                  key={language}
                  variant="secondary"
                  className="cursor-pointer no-default-hover-elevate"
                  onClick={() => toggleLanguage(language)}
                  data-testid={`active-filter-language-${language.toLowerCase()}`}
                >
                  {language} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-10 lg:grid-cols-[320px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8 rounded-2xl border-2 bg-card p-8 shadow-sm">
              <h2 className="text-2xl font-bold">Filters</h2>
              <FilterSidebar />
            </div>
          </aside>

          <div>
            {isLoading ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(9)].map((_, i) => (
                  <Skeleton key={i} className="h-[360px] w-full rounded-2xl" />
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-24 text-center">
                <h3 className="mb-3 text-2xl font-bold">Failed to load builders</h3>
                <p className="text-base text-muted-foreground">
                  Please try again later
                </p>
              </div>
            ) : buildersData && buildersData.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-base md:text-lg font-semibold" data-testid="text-results-count">
                    {buildersData.length} {buildersData.length === 1 ? 'builder' : 'builders'} found
                  </div>
                </div>
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3" data-testid="grid-builders">
                  {buildersData.map((builder) => (
                    <Link key={builder.id} href={`/builder/${builder.id}`}>
                      <Card className="h-full hover-elevate active-elevate-2 cursor-pointer transition-all rounded-2xl border-2" data-testid={`card-builder-${builder.id}`}>
                        <CardHeader className="space-y-4 pb-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-16 w-16 border-2 border-border">
                              <AvatarImage src={builder.profileImage || undefined} alt={builder.name} />
                              <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-purple-500 to-cyan-500 text-white">
                                {builder.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <CardTitle className="text-lg truncate">{builder.name}</CardTitle>
                                {builder.verified && (
                                  <Badge variant="default" className="text-xs shrink-0">
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {builder.headline}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                              <span className="font-bold text-base">
                                {builder.rating ? 
                                  (Number.isFinite(Number(builder.rating)) ? 
                                    Number(builder.rating).toFixed(1) : 
                                    builder.rating) : 
                                  '5.0'}
                              </span>
                              <span className="text-muted-foreground text-sm">({builder.reviewCount || 0})</span>
                            </div>
                          </div>

                          {builder.category && (
                            <Badge variant="secondary" className="w-fit">
                              {builder.category}
                            </Badge>
                          )}

                          {(builder.minProjectBudget || builder.hourlyRate) && (
                            <div className="flex items-center gap-2 pt-2 border-t">
                              <DollarSign className="h-5 w-5 text-primary" />
                              <span className="text-sm font-bold">
                                {builder.hourlyRate ? (
                                  <>Starting ${parseFloat(builder.hourlyRate).toLocaleString()}/hr</>
                                ) : builder.minProjectBudget ? (
                                  <>Starting ${parseFloat(builder.minProjectBudget).toLocaleString()}</>
                                ) : null}
                              </span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-24 text-center">
                <Search className="mb-6 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-3 text-2xl font-bold">No builders found</h3>
                <p className="text-base text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
