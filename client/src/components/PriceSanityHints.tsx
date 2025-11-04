import { useQuery } from '@tanstack/react-query';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';

interface PriceSanityHintsProps {
  category: string;
  currentPrice: number;
}

export function PriceSanityHints({ category, currentPrice }: PriceSanityHintsProps) {
  const { data: hints } = useQuery({
    queryKey: [`/api/services/price-hints/${category}`],
    enabled: !!category
  });
  
  if (!hints || !category) {
    return null;
  }
  
  const { min, max, median, p25, p75 } = hints;
  
  const percentile = calculatePercentile(currentPrice, min, max);
  
  let variant: 'default' | 'destructive' = 'default';
  let icon = Info;
  let title = 'Pricing Guidance';
  let message = '';
  
  if (currentPrice < p25) {
    variant = 'destructive';
    icon = TrendingDown;
    title = 'Price May Be Too Low';
    message = `Your price is below 75% of similar ${category} services. Consider raising it to $${p25.toFixed(2)} or higher to match market rates.`;
  } else if (currentPrice > p75) {
    icon = TrendingUp;
    title = 'Premium Pricing';
    message = `Your price is above 75% of similar ${category} services. This is premium pricing - make sure your service justifies the higher cost.`;
  } else {
    message = `Your price is in the typical range for ${category} services.`;
  }
  
  return (
    <div className="space-y-3" data-testid="container-price-hints">
      <Alert variant={variant} data-testid="alert-price-guidance">
        <icon className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      
      <div className="space-y-2">
        <div className="text-sm font-medium">Market Price Range for {category}</div>
        <div className="relative">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all"
              style={{ width: `${percentile}%` }}
              data-testid="bar-price-percentile"
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span data-testid="text-min-price">${min.toFixed(0)}</span>
            <span data-testid="text-median-price">Median: ${median.toFixed(0)}</span>
            <span data-testid="text-max-price">${max.toFixed(0)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
          <div className="p-2 bg-muted rounded">
            <div className="text-muted-foreground">25th percentile</div>
            <div className="font-medium" data-testid="text-p25">${p25.toFixed(2)}</div>
          </div>
          <div className="p-2 bg-muted rounded">
            <div className="text-muted-foreground">Median</div>
            <div className="font-medium" data-testid="text-median">${median.toFixed(2)}</div>
          </div>
          <div className="p-2 bg-muted rounded">
            <div className="text-muted-foreground">75th percentile</div>
            <div className="font-medium" data-testid="text-p75">${p75.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculatePercentile(price: number, min: number, max: number): number {
  if (price <= min) return 0;
  if (price >= max) return 100;
  return ((price - min) / (max - min)) * 100;
}
