import { Home, Search, MessageCircle, ShoppingBag, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

export function MobileNav() {
  const [location] = useLocation();
  
  // Get unread message count
  const { data: threads } = useQuery({
    queryKey: ['/api/chat/threads'],
    enabled: true,
  });

  const unreadCount = Array.isArray(threads) 
    ? threads.filter((t: any) => t.hasUnread).length 
    : 0;

  const navItems = [
    {
      icon: Home,
      label: "Browse",
      path: "/marketplace",
      testId: "mobile-nav-browse"
    },
    {
      icon: Search,
      label: "Search",
      path: "/marketplace",
      testId: "mobile-nav-search"
    },
    {
      icon: MessageCircle,
      label: "Messages",
      path: "/messages",
      badge: unreadCount,
      testId: "mobile-nav-messages"
    },
    {
      icon: ShoppingBag,
      label: "Orders",
      path: "/dashboard",
      testId: "mobile-nav-orders"
    },
    {
      icon: User,
      label: "Profile",
      path: "/profile",
      testId: "mobile-nav-profile"
    },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location === "/";
    }
    return location.startsWith(path);
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t md:hidden"
      data-testid="mobile-nav"
    >
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.testId}
              href={item.path}
              className={`flex flex-col items-center justify-center gap-1 relative transition-colors ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-testid={item.testId}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${active ? "fill-primary/20" : ""}`} />
                {item.badge && item.badge > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center"
                    data-testid={`${item.testId}-badge`}
                  >
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${active ? "font-semibold" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
