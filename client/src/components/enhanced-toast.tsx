import { useToast as useToastOriginal } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { X, Undo2 } from "lucide-react";

interface EnhancedToastProps {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  action?: {
    label: string;
    onClick: () => void;
  };
  undo?: {
    onUndo: () => void;
    duration?: number;
  };
}

export function useEnhancedToast() {
  const { toast: originalToast } = useToastOriginal();

  const toast = (props: EnhancedToastProps) => {
    const { title, description, variant, action, undo } = props;

    return originalToast({
      title,
      description,
      variant,
      action: undo ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            undo.onUndo();
          }}
          className="gap-1.5"
        >
          <Undo2 className="h-3 w-3" />
          Undo
        </Button>
      ) : action ? (
        <Button variant="outline" size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      ) : undefined,
    });
  };

  return { toast };
}

// Success toast with action
export function showSuccessToast(
  title: string,
  description?: string,
  action?: { label: string; onClick: () => void }
) {
  const { toast } = useToastOriginal();
  toast({
    title,
    description,
    action: action ? (
      <Button variant="outline" size="sm" onClick={action.onClick}>
        {action.label}
      </Button>
    ) : undefined,
  });
}

// Destructive toast with undo
export function showUndoableToast(
  title: string,
  description: string,
  onUndo: () => void,
  duration: number = 5000
) {
  const { toast } = useToastOriginal();
  toast({
    title,
    description,
    variant: "destructive",
    duration,
    action: (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          onUndo();
        }}
        className="gap-1.5"
      >
        <Undo2 className="h-3 w-3" />
        Undo
      </Button>
    ),
  });
}
