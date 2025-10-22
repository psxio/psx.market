import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";

export default function BuilderInvite() {
  const [, params] = useRoute("/builder-invite/:token");
  const [, setLocation] = useLocation();
  const token = params?.token;

  useEffect(() => {
    // Redirect to the comprehensive onboarding wizard
    if (token) {
      setLocation(`/builder-onboarding/${token}`);
    } else {
      setLocation("/builder-onboarding");
    }
  }, [token, setLocation]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-muted-foreground">Redirecting to onboarding...</div>
    </div>
  );
}
