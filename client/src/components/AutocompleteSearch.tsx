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
  searchQuery?: string; // The actual query to search for
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

  // Comprehensive suggestions covering all categories
  const mockSuggestions: SearchSuggestion[] = [
    // Recent searches (shown when search is empty)
    ...(query.length === 0
      ? [
          { type: "recent" as const, label: "KOL Marketing", value: "kol", searchQuery: "KOL", icon: Clock },
          { type: "recent" as const, label: "Volume Trading", value: "volume", searchQuery: "Volume", icon: Clock },
          { type: "recent" as const, label: "Grants & Funding", value: "grants", searchQuery: "Grant", icon: Clock },
        ]
      : []),
    
    // KOL & Influencers
    ...(query.toLowerCase().includes("kol") || query.toLowerCase().includes("influencer") || query.toLowerCase().includes("marketing")
      ? [
          { type: "category" as const, label: "KOL & Influencer Services", value: "kol", searchQuery: "KOL", subtitle: "Marketing", icon: TrendingUp },
          { type: "service" as const, label: "KOL Management", value: "kol-management", searchQuery: "KOL Management", subtitle: "Marketing", icon: Briefcase },
        ]
      : []),
    
    // Volume Services
    ...(query.toLowerCase().includes("vol") || query.toLowerCase().includes("trading")
      ? [
          { type: "category" as const, label: "Volume Services", value: "volume", searchQuery: "Volume", subtitle: "Trading", icon: TrendingUp },
          { type: "service" as const, label: "Custom Volume Generation", value: "volume-gen", searchQuery: "Volume", subtitle: "Trading", icon: Briefcase },
        ]
      : []),
    
    // 3D & 2D Content Creation
    ...(query.toLowerCase().includes("3d") || query.toLowerCase().includes("2d") || query.toLowerCase().includes("design") || query.toLowerCase().includes("art") || query.toLowerCase().includes("character") || query.toLowerCase().includes("animation")
      ? [
          { type: "category" as const, label: "3D & 2D Content Creation", value: "3d", searchQuery: "3D", subtitle: "Design", icon: TrendingUp },
          { type: "service" as const, label: "3D Character Design", value: "3d-character", searchQuery: "3D Character", subtitle: "Design", icon: Briefcase },
          { type: "service" as const, label: "3D Animations", value: "3d-animation", searchQuery: "3D Animation", subtitle: "Design", icon: Briefcase },
        ]
      : []),
    
    // Grants & Funding
    ...(query.toLowerCase().includes("grant") || query.toLowerCase().includes("fund") || query.toLowerCase().includes("raise") || query.toLowerCase().includes("investment")
      ? [
          { type: "category" as const, label: "Grants & Funding", value: "grants", searchQuery: "Grant", subtitle: "Funding", icon: TrendingUp },
          { type: "service" as const, label: "Grant Application Support", value: "grant-app", searchQuery: "Grant", subtitle: "Funding", icon: Briefcase },
          { type: "service" as const, label: "Grant Acceleration", value: "grant-accel", searchQuery: "Grant Acceleration", subtitle: "Funding", icon: Briefcase },
        ]
      : []),
    
    // Strategy & Consulting
    ...(query.toLowerCase().includes("strategy") || query.toLowerCase().includes("consult") || query.toLowerCase().includes("tokenomics") || query.toLowerCase().includes("advisor")
      ? [
          { type: "category" as const, label: "Strategy Consulting", value: "strategy", searchQuery: "Strategy", subtitle: "Consulting", icon: TrendingUp },
          { type: "service" as const, label: "Web3 Strategy Consulting", value: "strategy-consult", searchQuery: "Strategy Consulting", subtitle: "Consulting", icon: Briefcase },
          { type: "service" as const, label: "Tokenomics Design", value: "tokenomics", searchQuery: "Tokenomics", subtitle: "Consulting", icon: Briefcase },
        ]
      : []),
    
    // Documentation & Paperwork
    ...(query.toLowerCase().includes("doc") || query.toLowerCase().includes("paper") || query.toLowerCase().includes("whitepaper") || query.toLowerCase().includes("pitch") || query.toLowerCase().includes("deck")
      ? [
          { type: "category" as const, label: "Documentation & Paperwork", value: "documentation", searchQuery: "Documentation", subtitle: "Writing", icon: TrendingUp },
          { type: "service" as const, label: "Whitepaper Creation", value: "whitepaper", searchQuery: "Whitepaper", subtitle: "Documentation", icon: Briefcase },
          { type: "service" as const, label: "Pitch Deck Design", value: "pitch-deck", searchQuery: "Pitch Deck", subtitle: "Documentation", icon: Briefcase },
        ]
      : []),
    
    // Script Development (Smart Contracts, Websites, Apps)
    ...(query.toLowerCase().includes("dev") || query.toLowerCase().includes("code") || query.toLowerCase().includes("smart contract") || query.toLowerCase().includes("website") || query.toLowerCase().includes("app") || query.toLowerCase().includes("script")
      ? [
          { type: "category" as const, label: "Script Development", value: "development", searchQuery: "Development", subtitle: "Development", icon: TrendingUp },
          { type: "service" as const, label: "Smart Contract Development", value: "smart-contract", searchQuery: "Smart Contract", subtitle: "Development", icon: Briefcase },
          { type: "service" as const, label: "Website Development", value: "website", searchQuery: "Website Development", subtitle: "Development", icon: Briefcase },
        ]
      : []),
    
    // Social Media Management
    ...(query.toLowerCase().includes("social") || query.toLowerCase().includes("twitter") || query.toLowerCase().includes("tg") || query.toLowerCase().includes("telegram") || query.toLowerCase().includes("community") || query.toLowerCase().includes("discord")
      ? [
          { type: "category" as const, label: "Social Media Management", value: "social", searchQuery: "Social Media", subtitle: "Marketing", icon: TrendingUp },
          { type: "service" as const, label: "Social Media Management", value: "social-mgmt", searchQuery: "Social Media Management", subtitle: "Marketing", icon: Briefcase },
          { type: "service" as const, label: "Community Management", value: "community", searchQuery: "Community Management", subtitle: "Marketing", icon: Briefcase },
        ]
      : []),
    
    // Graphic Design
    ...(query.toLowerCase().includes("graphic") || query.toLowerCase().includes("logo") || query.toLowerCase().includes("banner") || query.toLowerCase().includes("visual") || query.toLowerCase().includes("branding")
      ? [
          { type: "category" as const, label: "Graphic Design", value: "graphic", searchQuery: "Graphic Design", subtitle: "Design", icon: TrendingUp },
          { type: "service" as const, label: "Logo & Branding", value: "logo", searchQuery: "Logo Design", subtitle: "Design", icon: Briefcase },
          { type: "service" as const, label: "Banner Design", value: "banner", searchQuery: "Banner Design", subtitle: "Design", icon: Briefcase },
        ]
      : []),
    
    // Marketing & Growth
    ...(query.toLowerCase().includes("market") || query.toLowerCase().includes("growth") || query.toLowerCase().includes("promo") || query.toLowerCase().includes("campaign")
      ? [
          { type: "category" as const, label: "Marketing & Growth", value: "marketing", searchQuery: "Marketing", subtitle: "Marketing", icon: TrendingUp },
          { type: "service" as const, label: "Marketing Campaign", value: "campaign", searchQuery: "Marketing Campaign", subtitle: "Marketing", icon: Briefcase },
          { type: "service" as const, label: "Growth Strategy", value: "growth", searchQuery: "Growth Strategy", subtitle: "Marketing", icon: Briefcase },
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
      setLocation(`/marketplace?search=${encodeURIComponent(searchValue)}`);
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
          const suggestion = filteredSuggestions[selectedIndex];
          handleSearch(suggestion.searchQuery || suggestion.label);
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
                      onSelect={() => handleSearch(suggestion.searchQuery || suggestion.label)}
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
