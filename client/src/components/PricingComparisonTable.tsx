import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Zap, Star } from "lucide-react";
import type { Service } from "@shared/schema";

interface PricingTier {
  name: string;
  price: string;
  description: string;
  deliverables: string[];
  deliveryTime: string;
  icon: any;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "outline";
}

interface PricingComparisonTableProps {
  service: Service;
  onSelectTier?: (tier: "basic" | "standard" | "premium") => void;
  selectedTier?: "basic" | "standard" | "premium";
}

export function PricingComparisonTable({ 
  service, 
  onSelectTier,
  selectedTier 
}: PricingComparisonTableProps) {
  const tiers: PricingTier[] = [
    {
      name: "Basic",
      price: `$${parseFloat(service.basicPrice).toLocaleString()}`,
      description: service.basicDescription,
      deliverables: service.basicDeliverables || [],
      deliveryTime: service.deliveryTime,
      icon: Check,
      badge: "Essential",
      badgeVariant: "outline"
    },
    {
      name: "Standard",
      price: service.standardPrice ? `$${parseFloat(service.standardPrice).toLocaleString()}` : "",
      description: service.standardDescription || "",
      deliverables: service.standardDeliverables || [],
      deliveryTime: service.deliveryTime ? `${Math.floor(parseInt(service.deliveryTime.split(" ")[0]) * 0.85)} days` : "",
      icon: Zap,
      badge: "Most Popular",
      badgeVariant: "default"
    },
    {
      name: "Premium",
      price: service.premiumPrice ? `$${parseFloat(service.premiumPrice).toLocaleString()}` : "",
      description: service.premiumDescription || "",
      deliverables: service.premiumDeliverables || [],
      deliveryTime: service.deliveryTime ? `${Math.floor(parseInt(service.deliveryTime.split(" ")[0]) * 0.7)} days` : "",
      icon: Star,
      badge: "Best Value",
      badgeVariant: "secondary"
    }
  ];

  const activeTiers = tiers.filter(tier => tier.price !== "");

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTiers.map((tier, index) => {
          const tierKey = tier.name.toLowerCase() as "basic" | "standard" | "premium";
          const isSelected = selectedTier === tierKey;
          const isPopular = tier.name === "Standard";
          const Icon = tier.icon;

          return (
            <Card
              key={tier.name}
              className={`relative flex flex-col ${
                isPopular ? "border-primary shadow-lg scale-105" : ""
              } ${isSelected ? "ring-2 ring-primary" : ""} transition-all hover-elevate`}
              data-testid={`card-pricing-${tierKey}`}
            >
              {tier.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant={tier.badgeVariant} className="shadow-sm">
                    {tier.badge}
                  </Badge>
                </div>
              )}

              <div className="p-6 space-y-4 flex-1">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <h3 className="text-xl font-bold" data-testid={`text-tier-${tierKey}`}>
                      {tier.name}
                    </h3>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-3xl font-bold" data-testid={`text-price-${tierKey}`}>
                      {tier.price}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {tier.description}
                    </p>
                  </div>

                  {tier.deliveryTime && (
                    <div className="flex items-center justify-center gap-1 text-sm">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">{tier.deliveryTime}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">
                    What's Included:
                  </p>
                  <ul className="space-y-2">
                    {tier.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-6 pt-0">
                <Button
                  className="w-full"
                  variant={isSelected ? "default" : isPopular ? "default" : "outline"}
                  onClick={() => onSelectTier?.(tierKey)}
                  data-testid={`button-select-${tierKey}`}
                >
                  {isSelected ? "Selected" : `Select ${tier.name}`}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
