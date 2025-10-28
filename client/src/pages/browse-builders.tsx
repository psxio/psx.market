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
import { Search, SlidersHorizontal, Star, CheckCircle2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Builder, Category } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
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

export default function BrowseBuilders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const [selectedAvailability, setSelectedAvailability] = useState<string | null>(null);
  const [selectedBudgetRange, setSelectedBudgetRange] = useState<typeof budgetRanges[0] | null>(null);
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
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-sm font-medium">Categories</Label>
        <div className="space-y-2">
          {categories && categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.name)}
                onCheckedChange={() => toggleCategory(category.name)}
                data-testid={`checkbox-category-${category.slug}`}
              />
              <label
                htmlFor={category.id}
                className="text-sm cursor-pointer flex-1"
              >
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Rating</Label>
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
                className="text-sm cursor-pointer flex-1 flex items-center gap-1"
              >
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                {rating}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Languages</Label>
        <div className="space-y-2">
          {languages.map((language) => (
            <div key={language} className="flex items-center space-x-2">
              <Checkbox 
                id={language}
                checked={selectedLanguages.includes(language)}
                onCheckedChange={() => toggleLanguage(language)}
                data-testid={`language-${language.toLowerCase()}`}
              />
              <label
                htmlFor={language}
                className="text-sm cursor-pointer flex-1"
              >
                {language}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label className="text-sm font-medium">Budget Range</Label>
        <div className="space-y-2">
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
                className="text-sm cursor-pointer flex-1"
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

      <div className="py-16 md:py-24 bg-background">
        <div className="container mx-auto max-w-7xl px-6 md:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-3">Browse Builders</h1>
            <p className="text-lg text-muted-foreground mb-8">Find verified Web3 talent</p>
            
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search builders by name, skills, or expertise..."
                  className="h-14 pl-12 text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-builders-search"
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]" data-testid="select-sort">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="projects">Most Projects</SelectItem>
                </SelectContent>
              </Select>

              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="outline" className="gap-2" data-testid="button-filters">
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
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 border-r pr-6">
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
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
                  <h3 className="mb-2 text-lg font-semibold">Failed to load builders</h3>
                  <p className="text-sm text-muted-foreground">
                    Please try again later
                  </p>
                </div>
              ) : buildersData && buildersData.length > 0 ? (
                <div>
                  <div className="mb-4 text-sm text-muted-foreground" data-testid="text-results-count">
                    {buildersData.length} results
                  </div>
                  <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" data-testid="grid-builders">
                    {buildersData.map((builder) => (
                      <Card key={builder.id} className="p-6 hover:shadow-md transition-shadow" data-testid={`card-builder-${builder.id}`}>
                        <CardContent className="p-0 space-y-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={builder.profileImage || undefined} alt={builder.name} />
                              <AvatarFallback className="text-lg font-semibold">
                                {builder.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-lg font-semibold truncate">{builder.name}</h3>
                                {builder.verified && (
                                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {builder.headline || "Web3 Builder"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                              <span className="font-medium">
                                {builder.rating ? 
                                  (Number.isFinite(Number(builder.rating)) ? 
                                    Number(builder.rating).toFixed(1) : 
                                    builder.rating) : 
                                  '5.0'}
                              </span>
                              <span className="text-muted-foreground">({builder.reviewCount || 0})</span>
                            </div>
                            {builder.responseTime && (
                              <span className="text-muted-foreground">
                                {builder.responseTime}
                              </span>
                            )}
                          </div>

                          {(builder.hourlyRate || builder.minProjectBudget) && (
                            <div className="text-sm font-medium">
                              {builder.hourlyRate ? (
                                <>From ${parseFloat(builder.hourlyRate).toLocaleString()}/hr</>
                              ) : builder.minProjectBudget ? (
                                <>From ${parseFloat(builder.minProjectBudget).toLocaleString()}</>
                              ) : null}
                            </div>
                          )}

                          <Button 
                            asChild 
                            variant="outline" 
                            className="w-full"
                            data-testid={`button-view-profile-${builder.id}`}
                          >
                            <Link href={`/builder/${builder.id}`}>
                              View Profile
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
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
    </div>
  );
}
