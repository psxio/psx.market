import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Star, CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "wouter";

interface PortfolioItem {
  id: string;
  builderId: string;
  builderName: string;
  builderCategory: string;
  builderVerified: boolean;
  builderRating: number;
  mediaUrl: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  type: 'project' | 'media';
}

export default function BrowsePortfolios() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: portfolioItems, isLoading } = useQuery<PortfolioItem[]>({
    queryKey: ['/api/portfolio-items', debouncedSearch],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }
      const response = await fetch(`/api/portfolio-items?${params}`);
      if (!response.ok) throw new Error('Failed to fetch portfolio items');
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Browse for <span className="text-primary">Ideas</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Discover work from top builders and find the perfect match for your next project
            </p>
          </div>

          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder='Try searching "schizo art" or "token launch video"...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
              data-testid="input-portfolio-search"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !portfolioItems || portfolioItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">No portfolio items found</h3>
            <p className="text-muted-foreground">
              {searchQuery ? 'Try a different search term' : 'Check back soon for amazing work from our builders'}
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {portfolioItems.map((item) => (
              <Link key={item.id} href={`/builder/${item.builderId}`}>
                <Card className="group overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all duration-200 break-inside-avoid mb-4" data-testid={`card-portfolio-${item.id}`}>
                  <div className="relative overflow-hidden bg-muted">
                    <img
                      src={item.mediaUrl}
                      alt={item.title || `Work by ${item.builderName}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      data-testid={`img-portfolio-${item.id}`}
                    />
                    {item.title && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-semibold text-sm line-clamp-2" data-testid={`text-title-${item.id}`}>
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="text-white/80 text-xs mt-1 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm truncate" data-testid={`text-builder-${item.id}`}>
                            {item.builderName}
                          </span>
                          {item.builderVerified && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.builderCategory}
                        </p>
                      </div>
                      
                      {item.builderRating > 0 && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">
                            {item.builderRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>

                    {item.category && (
                      <Badge variant="secondary" className="text-xs">
                        {item.category}
                      </Badge>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {portfolioItems && portfolioItems.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Showing {portfolioItems.length} portfolio {portfolioItems.length === 1 ? 'item' : 'items'}
            </p>
            <Button variant="outline" asChild data-testid="button-browse-builders">
              <Link href="/builders">View All Builders</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
