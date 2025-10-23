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
import { Search, SlidersHorizontal, Users, Sparkles, TrendingUp, Code, BarChart3, Palette, Star, MapPin, Globe } from "lucide-react";
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
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-base font-semibold">Categories</Label>
        <div className="space-y-2">
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

      <div className="space-y-3">
        <Label className="text-base font-semibold">Languages</Label>
        <div className="flex flex-wrap gap-2">
          {languages.map((language) => (
            <Badge
              key={language}
              variant={selectedLanguages.includes(language) ? "default" : "outline"}
              className="cursor-pointer no-default-hover-elevate hover-elevate active-elevate-2"
              onClick={() => toggleLanguage(language)}
              data-testid={`language-${language.toLowerCase()}`}
            >
              {language}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold">Rating</Label>
        <div className="space-y-2">
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

      <div className="space-y-3">
        <Label className="text-base font-semibold">Availability</Label>
        <div className="space-y-2">
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
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div ref={headerSection.ref as any} className={`mb-8 space-y-4 ${headerSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Browse Builders</h1>
              <p className="mt-2 text-muted-foreground">
                Discover talented builders for your Web3 projects
              </p>
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]" data-testid="select-sort">
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

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search builders by name, skills, or expertise..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-builders-search"
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
                  <Skeleton key={i} className="h-[320px] w-full" />
                ))}
              </div>
            ) : isError ? (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
                <h3 className="mb-2 text-lg font-semibold">Failed to load builders</h3>
                <p className="text-sm text-muted-foreground">
                  Please try again later
                </p>
              </div>
            ) : buildersData && buildersData.length > 0 ? (
              <div ref={buildersGrid.ref as any} className={buildersGrid.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}>
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {buildersData.length} results
                </div>
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {buildersData.map((builder) => (
                    <Link key={builder.id} href={`/builder/${builder.id}`}>
                      <Card className="h-full hover-elevate active-elevate-2 cursor-pointer transition-all" data-testid={`card-builder-${builder.id}`}>
                        <CardHeader className="space-y-4 pb-4">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={builder.profileImage || undefined} alt={builder.name} />
                              <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-purple-500 to-cyan-500 text-white">
                                {builder.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
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
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              <span className="font-semibold">
                                {builder.rating ? 
                                  (Number.isFinite(Number(builder.rating)) ? 
                                    Number(builder.rating).toFixed(1) : 
                                    builder.rating) : 
                                  '5.0'}
                              </span>
                              <span className="text-muted-foreground">({builder.reviewCount || 0})</span>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {builder.availability || 'available'}
                            </Badge>
                          </div>

                          {builder.category && (
                            <Badge variant="secondary" className="w-fit">
                              {builder.category}
                            </Badge>
                          )}

                          {builder.specializations && builder.specializations.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {builder.specializations.slice(0, 3).map((spec, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {spec}
                                </Badge>
                              ))}
                              {builder.specializations.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{builder.specializations.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                            {builder.languages && builder.languages.length > 0 && (
                              <div className="flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                <span>{builder.languages.slice(0, 2).join(', ')}</span>
                              </div>
                            )}
                            {builder.country && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{builder.country}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t text-sm">
                            <span className="text-muted-foreground">{builder.completedProjects || 0} projects</span>
                            <span className="font-semibold text-primary">View Profile</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
                <Search className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No builders found</h3>
                <p className="text-sm text-muted-foreground">
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
