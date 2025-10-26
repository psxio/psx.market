import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, DollarSign, TrendingUp, ExternalLink, Sparkles } from "lucide-react";

export function TokenBenefitsCalculator() {
  const [projectBudget, setProjectBudget] = useState("1000");

  const calculateSavings = () => {
    const budget = parseFloat(projectBudget) || 0;
    const standardFee = budget * 0.025; // 2.5%
    const tokenHolderFee = budget * 0.01; // 1%
    const savings = standardFee - tokenHolderFee;
    const savingsPercentage = 60; // (1.5% / 2.5%) * 100
    
    return {
      budget,
      standardFee: standardFee.toFixed(2),
      tokenHolderFee: tokenHolderFee.toFixed(2),
      savings: savings.toFixed(2),
      savingsPercentage,
      monthlySavings: (savings * 5).toFixed(2), // Assume 5 projects/month
      yearlySavings: (savings * 60).toFixed(2), // Assume 60 projects/year
    };
  };

  const stats = calculateSavings();
  const isValidBudget = parseFloat(projectBudget) > 0;

  return (
    <Card className="border-2" data-testid="card-token-calculator">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <div>
            <CardTitle>Token Holder Savings Calculator</CardTitle>
            <CardDescription>
              See how much you'll save with $CREATE or $PSX tokens
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="budget">Project Budget (USDC)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="budget"
              type="number"
              min="0"
              step="100"
              value={projectBudget}
              onChange={(e) => setProjectBudget(e.target.value)}
              className="pl-9"
              placeholder="Enter project amount..."
              data-testid="input-project-budget"
            />
          </div>
        </div>

        {isValidBudget && (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border bg-card/50 p-4">
                <div className="text-xs text-muted-foreground mb-1">Standard Fee (2.5%)</div>
                <div className="text-2xl font-bold text-destructive" data-testid="text-standard-fee">
                  ${stats.standardFee}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Without tokens</div>
              </div>

              <div className="rounded-lg border-2 border-chart-3/30 bg-gradient-to-br from-chart-3/10 to-card p-4">
                <div className="text-xs text-muted-foreground mb-1">Token Holder Fee (1%)</div>
                <div className="text-2xl font-bold text-chart-3" data-testid="text-token-fee">
                  ${stats.tokenHolderFee}
                </div>
                <div className="text-xs text-muted-foreground mt-1">With $CREATE or $PSX</div>
              </div>
            </div>

            <div className="rounded-lg border-2 border-primary/30 bg-gradient-to-r from-primary/10 via-chart-2/10 to-background p-5">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary" />
                <h4 className="font-bold">Your Savings</h4>
              </div>

              <div className="space-y-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Per Project</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-chart-3" data-testid="text-savings-per-project">
                      ${stats.savings}
                    </span>
                    <Badge variant="default" className="text-xs">
                      {stats.savingsPercentage}% off
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2 pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Monthly (5 projects)</span>
                    <span className="font-bold text-chart-2" data-testid="text-monthly-savings">
                      ${stats.monthlySavings}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Yearly (60 projects)</span>
                    <span className="font-bold text-chart-4" data-testid="text-yearly-savings">
                      ${stats.yearlySavings}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card/50 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold">Why It Matters</span>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-chart-3 shrink-0 mt-0.5">•</span>
                  <span>More earnings in your pocket from every project</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-chart-3 shrink-0 mt-0.5">•</span>
                  <span>Compound savings grow significantly over time</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-chart-3 shrink-0 mt-0.5">•</span>
                  <span>Plus priority support, exclusive badges, and early access</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a href="https://app.uniswap.org" target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="default" className="w-full gap-2" data-testid="button-get-tokens-calc">
                  <Sparkles className="h-4 w-4" />
                  Get Tokens & Start Saving
                </Button>
              </a>
              <Button variant="outline" className="gap-2 hover-elevate" data-testid="button-learn-more-calc">
                <ExternalLink className="h-4 w-4" />
                Learn More
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
