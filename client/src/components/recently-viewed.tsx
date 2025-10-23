import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, User } from "lucide-react";
import { Link } from "wouter";

interface RecentlyViewedItem {
  id: string;
  type: "builder" | "service";
  name: string;
  image?: string;
  category?: string;
  rating?: number;
  price?: string;
  viewedAt: number;
}

const MAX_RECENT_ITEMS = 5;
const STORAGE_KEY = "recentlyViewed";

export function RecentlyViewed() {
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    loadRecentlyViewed();
  }, []);

  const loadRecentlyViewed = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: RecentlyViewedItem[] = JSON.parse(stored);
        setItems(parsed.sort((a, b) => b.viewedAt - a.viewedAt).slice(0, MAX_RECENT_ITEMS));
      }
    } catch (error) {
      console.error("Error loading recently viewed:", error);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <Card data-testid="recently-viewed">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">Recently Viewed</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => {
          const href = item.type === "builder" ? `/builder/${item.id}` : `/service/${item.id}`;
          return (
            <Link key={item.id} href={href}>
              <a
                className="flex items-center gap-3 p-2 rounded-lg hover-elevate transition-colors"
                data-testid={`recent-item-${item.id}`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={item.image} />
                  <AvatarFallback>
                    {item.type === "builder" ? (
                      <User className="h-5 w-5" />
                    ) : (
                      item.name.charAt(0).toUpperCase()
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {item.category && (
                      <span className="text-xs text-muted-foreground truncate">
                        {item.category}
                      </span>
                    )}
                    {item.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium">{item.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
                {item.price && (
                  <Badge variant="secondary" className="shrink-0">
                    ${item.price}
                  </Badge>
                )}
              </a>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}

// Helper function to track viewed items
export function trackRecentlyViewed(item: Omit<RecentlyViewedItem, "viewedAt">) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let items: RecentlyViewedItem[] = stored ? JSON.parse(stored) : [];

    // Remove existing entry for this item
    items = items.filter((i) => !(i.id === item.id && i.type === item.type));

    // Add new entry at the beginning
    items.unshift({
      ...item,
      viewedAt: Date.now(),
    });

    // Keep only the most recent items
    items = items.slice(0, MAX_RECENT_ITEMS);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Error tracking recently viewed:", error);
  }
}
