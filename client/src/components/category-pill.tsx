import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface CategoryPillProps {
  name: string;
  slug: string;
  icon: LucideIcon;
  count?: number;
}

export function CategoryPill({ name, slug, icon: Icon, count }: CategoryPillProps) {
  return (
    <Link href={`/category/${slug}`}>
      <Button
        variant="outline"
        size="default"
        className="gap-2 hover-elevate active-elevate-2 whitespace-nowrap"
        data-testid={`button-category-${slug}`}
      >
        <Icon className="h-4 w-4" />
        <span>{name}</span>
        {count !== undefined && (
          <span className="text-muted-foreground">({count})</span>
        )}
      </Button>
    </Link>
  );
}
