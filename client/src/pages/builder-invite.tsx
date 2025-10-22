import { useEffect } from "react";
import { useRoute, useLocation } from "wouter";

export default function BuilderInvite() {
  const [, params] = useRoute("/builder-invite/:token");
  const [, setLocation] = useLocation();
  const token = params?.token;

  useEffect(() => {
    // Redirect to the For Builders landing page with invite token
    // This gives invited builders the full onboarding experience
    if (token) {
      setLocation(`/builders?invite=${token}`);
    } else {
      setLocation("/builders");
    }
  }, [token, setLocation]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-muted-foreground">Redirecting...</div>
    </div>
  );
}
