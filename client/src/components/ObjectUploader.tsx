// Placeholder component - Uppy dependencies temporarily removed
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onGetUploadParameters: () => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (result: any) => void;
  buttonClassName?: string;
  buttonVariant?: "default" | "outline" | "ghost" | "secondary" | "destructive";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  children: ReactNode;
  disabled?: boolean;
  "data-testid"?: string;
}

export function ObjectUploader({
  buttonClassName,
  buttonVariant = "default",
  buttonSize = "default",
  children,
  disabled = false,
  "data-testid": testId,
}: ObjectUploaderProps) {
  return (
    <Button
      type="button"
      variant={buttonVariant}
      size={buttonSize}
      className={buttonClassName}
      disabled={disabled}
      data-testid={testId}
      onClick={() => alert("File upload feature temporarily disabled")}
    >
      {children}
    </Button>
  );
}
