import { Link } from "wouter";
import { WalletConnectButton } from "./wallet-connect-button";
import { Button } from "@/components/ui/button";
import { Search, Menu, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const categories = [
  { name: "KOLs", slug: "kols" },
  { name: "3D Content", slug: "3d-content" },
  { name: "Marketing", slug: "marketing" },
  { name: "Development", slug: "development" },
  { name: "Volume", slug: "volume" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2" data-testid="link-home">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-lg">
                P
              </div>
              <span className="hidden text-xl font-bold tracking-tight sm:inline-block">
                Create x PSX Marketplace
              </span>
            </Link>

            <nav className="hidden items-center gap-1 lg:flex">
              {categories.map((category) => (
                <Link key={category.slug} href={`/category/${category.slug}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover-elevate"
                    data-testid={`link-category-${category.slug}`}
                  >
                    {category.name}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden flex-1 max-w-md md:flex">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search services..."
                className="pl-9"
                data-testid="input-search"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admin/login" className="hidden md:block">
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs hover-elevate" data-testid="link-admin">
                <Shield className="h-3.5 w-3.5" />
                Admin
              </Button>
            </Link>
            
            <div className="hidden md:flex">
              <WalletConnectButton />
            </div>

            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
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
                    />
                  </div>

                  <nav className="flex flex-col gap-2">
                    {categories.map((category) => (
                      <Link key={category.slug} href={`/category/${category.slug}`}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start hover-elevate"
                        >
                          {category.name}
                        </Button>
                      </Link>
                    ))}
                  </nav>

                  <div className="border-t pt-4 mt-4">
                    <Link href="/admin/login">
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 hover-elevate"
                        data-testid="link-admin-mobile"
                      >
                        <Shield className="h-4 w-4" />
                        Admin Dashboard
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
