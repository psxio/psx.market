import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedLoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  text?: string;
  variant?: "default" | "dots" | "pulse" | "spinner";
  className?: string;
}

export function AnimatedLoader({ 
  size = "md", 
  text, 
  variant = "spinner",
  className 
}: AnimatedLoaderProps) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
    xl: "h-12 w-12",
  };

  if (variant === "dots") {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
        <div className="flex gap-2">
          <div className={cn("rounded-full bg-primary animate-bounce", sizes[size])} style={{ animationDelay: "0ms" }} />
          <div className={cn("rounded-full bg-primary animate-bounce", sizes[size])} style={{ animationDelay: "150ms" }} />
          <div className={cn("rounded-full bg-primary animate-bounce", sizes[size])} style={{ animationDelay: "300ms" }} />
        </div>
        {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
        <div className={cn("rounded-full bg-primary/20 flex items-center justify-center animate-pulse", sizes[size])}>
          <div className={cn("rounded-full bg-primary", size === "sm" ? "h-2 w-2" : size === "md" ? "h-3 w-3" : size === "lg" ? "h-4 w-4" : "h-6 w-6")} />
        </div>
        {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizes[size])} />
      {text && <p className="text-sm text-muted-foreground animate-pulse">{text}</p>}
    </div>
  );
}

export function SkeletonLoader({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="h-4 bg-muted rounded animate-pulse" />
      <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
      <div className="h-4 bg-muted rounded animate-pulse w-4/6" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4 animate-pulse">
      <div className="h-6 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-full" />
      <div className="h-4 bg-muted rounded w-5/6" />
      <div className="flex gap-2 mt-4">
        <div className="h-10 bg-muted rounded w-24" />
        <div className="h-10 bg-muted rounded w-24" />
      </div>
    </div>
  );
}

export function BuilderCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card overflow-hidden animate-pulse">
      <div className="h-48 bg-muted" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
        </div>
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-3 border rounded animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/6" />
          <div className="h-4 bg-muted rounded w-1/5" />
        </div>
      ))}
    </div>
  );
}
