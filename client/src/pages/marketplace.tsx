import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { BuilderCard } from "@/components/builder-card";
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
import { Search, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Builder, Service } from "@shared/schema";

const categories = [
  { name: "KOLs & Influencers", value: "KOLs & Influencers" },
  { name: "3D Content Creators", value: "3D Content Creators" },
  { name: "Marketing & Growth", value: "Marketing & Growth" },
  { name: "Script Development", value: "Script Development" },
  { name: "Volume Services", value: "Volume Services" },
];

const ratings = ["5 Stars", "4+ Stars", "3+ Stars"];
const deliveryTimes = ["24 hours", "3 days", "7 days", "14 days"];

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("relevance");

  const buildQueryString = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (selectedCategories.length > 0) params.set("categories", selectedCategories.join(","));
    if (sortBy && sortBy !== "relevance") params.set("sortBy", sortBy);
    const queryString = params.toString();
    return queryString ? `?${queryString}` : "";
  };

  const { data: servicesData, isLoading, isError } = useQuery<
    Array<{ builder: Builder; service: Service }>
  >({
    queryKey: ["/api/services" + buildQueryString()],
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-base font-semibold">Categories</Label>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.value} className="flex items-center space-x-2">
              <Checkbox
                id={category.value}
                checked={selectedCategories.includes(category.value)}
                onCheckedChange={() => toggleCategory(category.value)}
                data-testid={`checkbox-category-${category.value.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
              />
              <label
                htmlFor={category.value}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {category.name}
              </label>
            </div>
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
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox id={rating} />
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
        <Label className="text-base font-semibold">Delivery Time</Label>
        <div className="space-y-2">
          {deliveryTimes.map((time) => (
            <div key={time} className="flex items-center space-x-2">
              <Checkbox id={time} />
              <label
                htmlFor={time}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {time}
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
        <div className="mb-8 space-y-4">
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

            <Sheet>
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

          {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {selectedCategories.map((category) => (
                <Button
                  key={category}
                  variant="secondary"
                  size="sm"
                  onClick={() => toggleCategory(category)}
                  className="gap-1"
                >
                  {category}
                  <span className="text-muted-foreground">×</span>
                </Button>
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
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
                <h3 className="mb-2 text-lg font-semibold">Failed to load services</h3>
                <p className="text-sm text-muted-foreground">
                  Please try again later
                </p>
              </div>
            ) : servicesData && servicesData.length > 0 ? (
              <>
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
              </>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
                <Search className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No services found</h3>
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
