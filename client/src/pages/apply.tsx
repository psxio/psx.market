import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Apply() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to the comprehensive onboarding wizard
    setLocation("/builder-onboarding");
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-muted-foreground">Redirecting to application...</div>
    </div>
  );
}
