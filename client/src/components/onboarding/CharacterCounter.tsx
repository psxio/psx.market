import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface CharacterCounterProps {
  current: number;
  min?: number;
  max?: number;
  recommended?: number;
  className?: string;
}

export function CharacterCounter({
  current,
  min,
  max,
  recommended,
  className,
}: CharacterCounterProps) {
  const getStatus = () => {
    if (min && current < min) return "error";
    if (max && current > max) return "error";
    if (recommended && current < recommended) return "warning";
    return "success";
  };

  const status = getStatus();

  const getMessage = () => {
    if (min && current < min) return `Minimum ${min} characters required`;
    if (max && current > max) return `Maximum ${max} characters exceeded`;
    if (recommended && current < recommended) return `Recommended: ${recommended}+ characters`;
    return "Looks good!";
  };

  return (
    <div className={cn("flex items-center justify-between text-xs", className)}>
      <div className="flex items-center gap-1.5">
        {status === "error" && (
          <AlertCircle className="h-3 w-3 text-destructive" />
        )}
        {status === "warning" && (
          <AlertCircle className="h-3 w-3 text-yellow-500" />
        )}
        {status === "success" && (
          <CheckCircle2 className="h-3 w-3 text-chart-3" />
        )}
        <span
          className={cn(
            status === "error" && "text-destructive",
            status === "warning" && "text-yellow-500",
            status === "success" && "text-chart-3"
          )}
        >
          {getMessage()}
        </span>
      </div>
      <span className="text-muted-foreground">
        {current}
        {max && `/${max}`} characters
      </span>
    </div>
  );
}
