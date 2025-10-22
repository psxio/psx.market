import { Link, useLocation } from "wouter";
import { WalletConnectButton } from "./wallet-connect-button-new";
import { NotificationCenter } from "./notification-center";
import { Button } from "@/components/ui/button";
import { Search, Menu, Shield, MessageCircle, Grid3x3, LayoutDashboard, Sparkles, Rocket } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { useState } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setLocation(`/marketplace?search=${encodeURIComponent(query.trim())}`);
      setSearchQuery("");
      setMobileSearchQuery("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, query: string) => {
    if (e.key === "Enter") {
      handleSearch(query);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2" data-testid="link-home">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-lg">
              P
            </div>
            <span className="hidden text-xl font-bold tracking-tight sm:inline-block">
              Create x PSX Marketplace
            </span>
          </Link>

          <div className="hidden flex-1 max-w-md md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search services..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, searchQuery)}
                data-testid="input-search"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs hover-elevate hidden md:flex" data-testid="link-browse-builders">
              <Link href="/builders">
                <Grid3x3 className="h-3.5 w-3.5" />
                Browse Builders
              </Link>
            </Button>

            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs hover-elevate hidden md:flex" data-testid="link-getting-started">
              <Link href="/getting-started">
                <Rocket className="h-3.5 w-3.5" />
                Getting Started
              </Link>
            </Button>

            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs hover-elevate hidden md:flex" data-testid="link-faq">
              <Link href="/faq">
                <Shield className="h-3.5 w-3.5" />
                Help
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
            
            <Button asChild variant="ghost" size="sm" className="gap-1.5 text-xs hover-elevate hidden md:flex" data-testid="link-admin">
              <Link href="/admin/login">
                <Shield className="h-3.5 w-3.5" />
                Admin
              </Link>
            </Button>
            
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
                      placeholder="Search services..."
                      className="pl-9"
                      value={mobileSearchQuery}
                      onChange={(e) => setMobileSearchQuery(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, mobileSearchQuery)}
                      data-testid="input-search-mobile"
                    />
                  </div>

                  <nav className="flex flex-col gap-2">
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

                    <Button asChild variant="ghost" className="w-full justify-start gap-2 hover-elevate" data-testid="link-faq-mobile">
                      <Link href="/faq">
                        <Shield className="h-4 w-4" />
                        Help
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
                    
                    <Button asChild variant="ghost" className="w-full justify-start gap-2 hover-elevate" data-testid="link-admin-mobile">
                      <Link href="/admin/login">
                        <Shield className="h-4 w-4" />
                        Admin
                      </Link>
                    </Button>
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
