import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useAccount } from "wagmi";

export function MobileStickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const { isConnected } = useAccount();

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky button after scrolling past hero section (800px)
      setIsVisible(window.scrollY > 800);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="md:hidden fixed bottom-4 left-4 right-4 z-40 animate-in slide-in-from-bottom duration-300"
      data-testid="mobile-sticky-cta"
    >
      <Link href="/getting-started">
        <Button 
          size="lg" 
          className="w-full gap-2 shadow-lg text-base"
          data-testid="button-mobile-get-started"
        >
          <Sparkles className="h-5 w-5" />
          Get Started
          <ArrowRight className="h-5 w-5" />
        </Button>
      </Link>
    </div>
  );
}
