import { ChevronRight, Home } from "lucide-react";
import { Link } from "wouter";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbNav({ items, className = "" }: BreadcrumbNavProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-sm ${className}`}
      data-testid="breadcrumb-nav"
    >
      <Link href="/">
        <a className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors hover-elevate px-2 py-1 rounded-md" data-testid="breadcrumb-home">
          <Home className="h-3.5 w-3.5" />
          <span className="sr-only">Home</span>
        </a>
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          {item.href && index < items.length - 1 ? (
            <Link href={item.href}>
              <a
                className="text-muted-foreground hover:text-foreground transition-colors hover-elevate px-2 py-1 rounded-md"
                data-testid={`breadcrumb-${index}`}
              >
                {item.label}
              </a>
            </Link>
          ) : (
            <span
              className="font-medium text-foreground px-2 py-1"
              data-testid={`breadcrumb-${index}`}
              aria-current={index === items.length - 1 ? "page" : undefined}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
