import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calculator, TrendingUp, DollarSign, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function PricingCalculator() {
  const [category, setCategory] = useState("3d-artists");
  const [experience, setExperience] = useState("intermediate");
  const [deliveryTime, setDeliveryTime] = useState("7");
  const [complexity, setComplexity] = useState("standard");

  const calculateSuggestedPrice = () => {
    const baseRates: Record<string, Record<string, number>> = {
      "3d-artists": { beginner: 300, intermediate: 600, expert: 1200 },
      "volume-services": { beginner: 500, intermediate: 1000, expert: 2000 },
      "social-media": { beginner: 250, intermediate: 500, expert: 1000 },
      "marketing": { beginner: 400, intermediate: 800, expert: 1600 },
      "development": { beginner: 500, intermediate: 1000, expert: 2500 },
      "design": { beginner: 200, intermediate: 400, expert: 800 },
    };

    const complexityMultipliers: Record<string, number> = {
      basic: 0.7,
      standard: 1.0,
      premium: 1.5,
    };

    const urgencyMultipliers: Record<string, number> = {
      "1": 1.8,
      "3": 1.4,
      "7": 1.0,
      "14": 0.9,
      "30": 0.85,
    };

    const basePrice = baseRates[category]?.[experience] || 500;
    const complexityMultiplier = complexityMultipliers[complexity] || 1;
    const urgencyMultiplier = urgencyMultipliers[deliveryTime] || 1;

    const suggestedPrice = Math.round(basePrice * complexityMultiplier * urgencyMultiplier);

    return {
      basic: Math.round(suggestedPrice * 0.7),
      standard: suggestedPrice,
      premium: Math.round(suggestedPrice * 1.5),
    };
  };

  const prices = calculateSuggestedPrice();
  const platformFee = Math.round(prices.standard * 0.025);
  const tokenHolderFee = Math.round(prices.standard * 0.01);
  const netEarnings = prices.standard - platformFee;
  const tokenHolderEarnings = prices.standard - tokenHolderFee;

  return (
    <Card className="border-2" data-testid="card-pricing-calculator">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <CardTitle>Pricing Calculator</CardTitle>
            <CardDescription>
              Get competitive pricing suggestions based on your category and experience
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Service Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" data-testid="select-category">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3d-artists">3D & 2D Artists</SelectItem>
                <SelectItem value="volume-services">Volume Services</SelectItem>
                <SelectItem value="social-media">Social Media</SelectItem>
                <SelectItem value="marketing">Marketing & Growth</SelectItem>
                <SelectItem value="development">Development</SelectItem>
                <SelectItem value="design">Graphic Design</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Your Experience Level</Label>
            <Select value={experience} onValueChange={setExperience}>
              <SelectTrigger id="experience" data-testid="select-experience">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                <SelectItem value="expert">Expert (5+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery">Delivery Time</Label>
            <Select value={deliveryTime} onValueChange={setDeliveryTime}>
              <SelectTrigger id="delivery" data-testid="select-delivery">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 day (Rush)</SelectItem>
                <SelectItem value="3">3 days (Fast)</SelectItem>
                <SelectItem value="7">7 days (Standard)</SelectItem>
                <SelectItem value="14">14 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="complexity">Project Complexity</Label>
            <Select value={complexity} onValueChange={setComplexity}>
              <SelectTrigger id="complexity" data-testid="select-complexity">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic</SelectItem>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium/Complex</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-lg border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-background p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">Suggested Pricing Tiers</h4>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-lg border bg-card p-3">
              <div className="text-xs text-muted-foreground mb-1">Basic</div>
              <div className="text-2xl font-bold text-primary" data-testid="text-price-basic">
                ${prices.basic}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Entry-level offering</div>
            </div>

            <div className="rounded-lg border-2 border-primary/50 bg-gradient-to-br from-primary/5 to-card p-3">
              <div className="flex items-center justify-between mb-1">
                <div className="text-xs text-muted-foreground">Standard</div>
                <Badge variant="default" className="text-xs">Recommended</Badge>
              </div>
              <div className="text-2xl font-bold text-primary" data-testid="text-price-standard">
                ${prices.standard}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Most popular tier</div>
            </div>

            <div className="rounded-lg border bg-card p-3">
              <div className="text-xs text-muted-foreground mb-1">Premium</div>
              <div className="text-2xl font-bold text-primary" data-testid="text-price-premium">
                ${prices.premium}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Full-service package</div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card/50 p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Gross Revenue (Standard)</span>
            <span className="font-medium">${prices.standard}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Platform Fee (2.5%)</span>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Standard platform fee for non-token holders</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <span className="font-medium text-destructive">-${platformFee}</span>
          </div>
          <div className="border-t pt-2 flex items-center justify-between">
            <span className="font-semibold">Your Net Earnings</span>
            <span className="text-xl font-bold text-chart-4" data-testid="text-net-earnings">
              ${netEarnings}
            </span>
          </div>

          <div className="rounded-lg border-2 border-chart-3/30 bg-gradient-to-r from-chart-3/10 to-transparent p-3 mt-3">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-chart-3" />
              <span className="text-sm font-semibold text-chart-3">With Token Holder Benefits</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Platform Fee (1%)</span>
              <span className="font-medium text-destructive">-${tokenHolderFee}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="font-semibold">Your Net Earnings</span>
              <span className="font-bold text-chart-3" data-testid="text-token-earnings">
                ${tokenHolderEarnings}
              </span>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              Save ${platformFee - tokenHolderFee} per project with $CREATE or $PSX tokens
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Prices are suggestions based on market data. Adjust based on your unique value proposition.
        </p>
      </CardContent>
    </Card>
  );
}
