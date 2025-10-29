import { Link, useLocation } from "wouter";
import { WalletConnectButton } from "./wallet-connect-button-new";
import { NotificationCenter } from "./notification-center";
import { Button } from "@/components/ui/button";
import { Search, Menu, Shield, MessageCircle, Grid3x3, LayoutDashboard, Sparkles, Rocket, Image } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import psxLogo from "@assets/ezgif.com-webp-maker_1761694278873.webp";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
  const { isClient, isBuilder, client, builder } = useWalletAuth();
  const [, setLocation] = useLocation();
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");

  const handleMobileSearch = (query: string) => {
    if (query.trim()) {
      setLocation(`/browse-services?search=${encodeURIComponent(query.trim())}`);
      setMobileSearchQuery("");
    }
  };

  const handleMobileKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleMobileSearch(mobileSearchQuery);
    }
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-transparent backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home">
            <img 
              src={psxLogo} 
              alt="PSX" 
              className="h-10 w-auto object-contain brightness-110"
            />
            <span className="hidden text-xl font-bold tracking-tight sm:inline-block bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              PSX
            </span>
          </Link>


          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs hover-elevate hidden md:flex" data-testid="link-browse-services">
              <Link href="/marketplace">
                <Sparkles className="h-3.5 w-3.5" />
                Browse Services
              </Link>
            </Button>

            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs hover-elevate hidden md:flex" data-testid="link-browse-builders">
              <Link href="/builders">
                <Grid3x3 className="h-3.5 w-3.5" />
                Browse Builders
              </Link>
            </Button>

            <Button asChild variant="default" size="sm" className="gap-1.5 text-xs hover-elevate hidden md:flex bg-gradient-to-r from-purple-500 to-cyan-500" data-testid="link-getting-started">
              <Link href="/getting-started">
                <Rocket className="h-3.5 w-3.5" />
                Getting Started
              </Link>
            </Button>
            
            {(isClient || isBuilder) && (
              <>
                <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs hover-elevate hidden md:flex" data-testid="link-dashboard">
                  <Link href={isClient ? "/dashboard" : "/builder-dashboard"}>
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    Dashboard
                  </Link>
                </Button>
                {(client || builder) && (
                  <>
                    <NotificationCenter 
                      userId={client?.id || builder?.id || ""} 
                      userType={client ? "client" : "builder"} 
                    />
                    <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs hover-elevate hidden md:flex" data-testid="link-messages">
                      <Link href="/messages">
                        <MessageCircle className="h-3.5 w-3.5" />
                        Messages
                      </Link>
                    </Button>
                  </>
                )}
              </>
            )}
            
            <ThemeToggle />
            
            <div className="hidden md:flex">
              <WalletConnectButton />
            </div>

            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" data-testid="button-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  <div className="md:hidden mb-4">
                    <WalletConnectButton />
                  </div>
                  
                  <div className="relative md:hidden mb-4">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search services, builders, skills..."
                      className="pl-9"
                      value={mobileSearchQuery}
                      onChange={(e) => setMobileSearchQuery(e.target.value)}
                      onKeyDown={handleMobileKeyDown}
                      data-testid="input-search-mobile"
                    />
                  </div>

                  <nav className="flex flex-col gap-2">
                    <Button asChild variant="ghost" className="w-full justify-start gap-2 hover-elevate" data-testid="link-browse-services-mobile">
                      <Link href="/marketplace">
                        <Sparkles className="h-4 w-4" />
                        Browse Services
                      </Link>
                    </Button>

                    <Button asChild variant="ghost" className="w-full justify-start gap-2 hover-elevate" data-testid="link-browse-builders-mobile">
                      <Link href="/builders">
                        <Grid3x3 className="h-4 w-4" />
                        Browse Builders
                      </Link>
                    </Button>

                    <Button asChild variant="ghost" className="w-full justify-start gap-2 hover-elevate" data-testid="link-getting-started-mobile">
                      <Link href="/getting-started">
                        <Rocket className="h-4 w-4" />
                        Getting Started
                      </Link>
                    </Button>
                    
                    {(isClient || isBuilder) && (
                      <Button asChild variant="ghost" className="w-full justify-start gap-2 hover-elevate" data-testid="link-dashboard-mobile">
                        <Link href={isClient ? "/dashboard" : "/builder-dashboard"}>
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                      </Button>
                    )}
                    
                    {client && (
                      <Button asChild variant="ghost" className="w-full justify-start gap-2 hover-elevate" data-testid="link-messages-mobile">
                        <Link href="/messages">
                          <MessageCircle className="h-4 w-4" />
                          Messages
                        </Link>
                      </Button>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
