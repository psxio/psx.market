import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Search, Clock, TrendingUp, User, Briefcase } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

interface SearchSuggestion {
  type: "service" | "builder" | "category" | "recent" | "popular";
  label: string;
  value: string;
  subtitle?: string;
  icon?: any;
}

interface AutocompleteSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export function AutocompleteSearch({
  placeholder = "Search services, builders, or categories...",
  onSearch,
  className = "",
}: AutocompleteSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();

  // Fetch popular searches and recent searches
  const { data: suggestions = [] } = useQuery<SearchSuggestion[]>({
    queryKey: ["/api/search/suggestions", query],
    enabled: query.length > 0,
  });

  // Mock suggestions for now
  const mockSuggestions: SearchSuggestion[] = [
    // Recent searches
    ...(query.length === 0
      ? [
          { type: "recent" as const, label: "Volume Trading", value: "volume", icon: Clock },
          { type: "recent" as const, label: "3D Character Design", value: "3d character", icon: Clock },
        ]
      : []),
    
    // Popular services
    ...(query.toLowerCase().includes("vol") || query === ""
      ? [
          { type: "popular" as const, label: "Volume Services", value: "volume", subtitle: "Trending", icon: TrendingUp },
        ]
      : []),
    
    // Services
    ...(query.toLowerCase().includes("3d") || query.toLowerCase().includes("design")
      ? [
          { type: "service" as const, label: "3D Character Design", value: "3d-character", subtitle: "Design", icon: Briefcase },
          { type: "service" as const, label: "3D Animations", value: "3d-animation", subtitle: "Design", icon: Briefcase },
        ]
      : []),
    
    // Builders
    ...(query.length > 0
      ? [
          { type: "builder" as const, label: "Top Rated Developers", value: "developer", subtitle: "50+ builders", icon: User },
        ]
      : []),
  ];

  const filteredSuggestions = query.length > 0
    ? mockSuggestions.filter(
        (s) =>
          s.label.toLowerCase().includes(query.toLowerCase()) ||
          s.value.toLowerCase().includes(query.toLowerCase())
      )
    : mockSuggestions.slice(0, 5);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSearch = (searchValue: string) => {
    if (searchValue.trim()) {
      onSearch?.(searchValue);
      // Navigate to search results
      setLocation(`/browse-services?search=${encodeURIComponent(searchValue)}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredSuggestions[selectedIndex]) {
          handleSearch(filteredSuggestions[selectedIndex].value);
        } else {
          handleSearch(query);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="pl-10"
          data-testid="input-autocomplete-search"
        />
      </div>

      {isOpen && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 overflow-hidden">
          <Command>
            <CommandList>
              {query.length === 0 && (
                <div className="px-3 py-2 text-xs text-muted-foreground border-b">
                  Recent Searches
                </div>
              )}
              
              <CommandGroup>
                {filteredSuggestions.map((suggestion, index) => {
                  const Icon = suggestion.icon || Search;
                  const isSelected = index === selectedIndex;

                  return (
                    <CommandItem
                      key={`${suggestion.type}-${suggestion.value}`}
                      value={suggestion.value}
                      onSelect={() => handleSearch(suggestion.value)}
                      className={`cursor-pointer ${isSelected ? "bg-accent" : ""}`}
                      data-testid={`suggestion-${index}`}
                    >
                      <Icon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div className="flex-1">
                        <div className="font-medium">{suggestion.label}</div>
                        {suggestion.subtitle && (
                          <div className="text-xs text-muted-foreground">
                            {suggestion.subtitle}
                          </div>
                        )}
                      </div>
                      {suggestion.type === "popular" && (
                        <TrendingUp className="h-3 w-3 text-primary" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>

              {filteredSuggestions.length === 0 && query.length > 0 && (
                <CommandEmpty>
                  <div className="py-6 text-center">
                    <p className="text-sm text-muted-foreground">No results found</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Try searching for services, builders, or categories
                    </p>
                  </div>
                </CommandEmpty>
              )}
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
