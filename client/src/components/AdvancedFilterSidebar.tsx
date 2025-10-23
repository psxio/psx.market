import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, SlidersHorizontal } from "lucide-react";

export interface FilterState {
  categories: string[];
  budgetRange: [number, number];
  deliveryTime: string[];
  rating: number;
  verified: boolean;
  languages: string[];
  availability: string[];
}

interface AdvancedFilterSidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
}

const categories = [
  "Volume Services",
  "3D & 2D Design",
  "Social Media Management",
  "KOLs & Influencers",
  "Script Development",
  "Graphic Design",
  "Marketing",
];

const deliveryTimeOptions = [
  { label: "Express (1-3 days)", value: "1-3" },
  { label: "Fast (4-7 days)", value: "4-7" },
  { label: "Standard (8-14 days)", value: "8-14" },
  { label: "Extended (15+ days)", value: "15+" },
];

const languages = [
  "English",
  "Spanish",
  "Mandarin",
  "French",
  "German",
  "Japanese",
  "Korean",
  "Russian",
];

const availabilityOptions = [
  { label: "Available Now", value: "available" },
  { label: "Busy", value: "busy" },
  { label: "Away", value: "away" },
];

export function AdvancedFilterSidebar({
  filters,
  onFiltersChange,
  onReset,
}: AdvancedFilterSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter((c) => c !== category)
      : [...filters.categories, category];
    updateFilter("categories", newCategories);
  };

  const toggleDeliveryTime = (time: string) => {
    const newDeliveryTime = filters.deliveryTime.includes(time)
      ? filters.deliveryTime.filter((t) => t !== time)
      : [...filters.deliveryTime, time];
    updateFilter("deliveryTime", newDeliveryTime);
  };

  const toggleLanguage = (language: string) => {
    const newLanguages = filters.languages.includes(language)
      ? filters.languages.filter((l) => l !== language)
      : [...filters.languages, language];
    updateFilter("languages", newLanguages);
  };

  const toggleAvailability = (availability: string) => {
    const newAvailability = filters.availability.includes(availability)
      ? filters.availability.filter((a) => a !== availability)
      : [...filters.availability, availability];
    updateFilter("availability", newAvailability);
  };

  const activeFiltersCount = 
    filters.categories.length +
    filters.deliveryTime.length +
    filters.languages.length +
    filters.availability.length +
    (filters.verified ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0);

  if (isCollapsed) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsCollapsed(false)}
        className="w-full"
        data-testid="button-expand-filters"
      >
        <SlidersHorizontal className="h-4 w-4 mr-2" />
        Show Filters
        {activeFiltersCount > 0 && (
          <Badge className="ml-2">{activeFiltersCount}</Badge>
        )}
      </Button>
    );
  }

  return (
    <Card className="sticky top-4 z-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            data-testid="button-reset-filters"
          >
            <X className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Categories */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Categories</Label>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category} className="flex items-center gap-2">
                <Checkbox
                  id={`category-${category}`}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={() => toggleCategory(category)}
                  data-testid={`checkbox-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                />
                <Label
                  htmlFor={`category-${category}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Budget Range */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-semibold">Budget Range</Label>
            <span className="text-sm text-muted-foreground">
              ${filters.budgetRange[0].toLocaleString()} - ${filters.budgetRange[1].toLocaleString()}
            </span>
          </div>
          <Slider
            value={filters.budgetRange}
            onValueChange={(value) => updateFilter("budgetRange", value as [number, number])}
            min={0}
            max={20000}
            step={500}
            className="pt-2"
            data-testid="slider-budget"
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>$0</span>
            <span>$20,000+</span>
          </div>
        </div>

        <Separator />

        {/* Delivery Time */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Delivery Time</Label>
          <div className="space-y-2">
            {deliveryTimeOptions.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={`delivery-${option.value}`}
                  checked={filters.deliveryTime.includes(option.value)}
                  onCheckedChange={() => toggleDeliveryTime(option.value)}
                  data-testid={`checkbox-delivery-${option.value}`}
                />
                <Label
                  htmlFor={`delivery-${option.value}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Rating */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Minimum Rating</Label>
          <Select
            value={filters.rating.toString()}
            onValueChange={(value) => updateFilter("rating", parseFloat(value))}
          >
            <SelectTrigger data-testid="select-rating">
              <SelectValue placeholder="Any rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Any rating</SelectItem>
              <SelectItem value="3.5">3.5+ ⭐</SelectItem>
              <SelectItem value="4.0">4.0+ ⭐⭐</SelectItem>
              <SelectItem value="4.5">4.5+ ⭐⭐⭐</SelectItem>
              <SelectItem value="4.8">4.8+ ⭐⭐⭐⭐</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        {/* Verified Only */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="verified"
            checked={filters.verified}
            onCheckedChange={(checked) => updateFilter("verified", !!checked)}
            data-testid="checkbox-verified"
          />
          <Label htmlFor="verified" className="text-sm cursor-pointer">
            Verified builders only
          </Label>
        </div>

        <Separator />

        {/* Languages */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Languages</Label>
          <div className="space-y-2">
            {languages.map((language) => (
              <div key={language} className="flex items-center gap-2">
                <Checkbox
                  id={`language-${language}`}
                  checked={filters.languages.includes(language)}
                  onCheckedChange={() => toggleLanguage(language)}
                  data-testid={`checkbox-language-${language.toLowerCase()}`}
                />
                <Label
                  htmlFor={`language-${language}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {language}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Availability */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Availability</Label>
          <div className="space-y-2">
            {availabilityOptions.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <Checkbox
                  id={`availability-${option.value}`}
                  checked={filters.availability.includes(option.value)}
                  onCheckedChange={() => toggleAvailability(option.value)}
                  data-testid={`checkbox-availability-${option.value}`}
                />
                <Label
                  htmlFor={`availability-${option.value}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
