import { useQuery } from '@tanstack/react-query';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, AlertCircle, Info, DollarSign, BarChart3, Target, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PriceSanityHintsProps {
  category: string;
  currentPrice: number;
}

export function PriceSanityHints({ category, currentPrice }: PriceSanityHintsProps) {
  const { data: hints, isLoading } = useQuery({
    queryKey: [`/api/services/price-hints/${category}`],
    enabled: !!category
  });
  
  if (!category || isLoading) {
    return null;
  }
  
  if (!hints || hints.min === 0) {
    return (
      <Card className="p-4 border-dashed" data-testid="card-no-data">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Info className="h-4 w-4" />
          <span className="text-sm">Not enough pricing data for {category} yet</span>
        </div>
      </Card>
    );
  }
  
  const { min, max, median, p25, p75 } = hints;
  
  const percentile = calculatePercentile(currentPrice, min, max);
  const position = getPositionLabel(currentPrice, p25, median, p75);
  
  let variant: 'default' | 'destructive' = 'default';
  let icon = Info;
  let iconColor = 'text-blue-600';
  let title = 'Competitive Pricing';
  let message = '';
  let bgColor = 'from-blue-50 to-cyan-50';
  
  if (currentPrice < p25) {
    variant = 'destructive';
    icon = TrendingDown;
    iconColor = 'text-red-600';
    title = '⚠️ Price May Be Too Low';
    bgColor = 'from-red-50 to-orange-50';
    message = `Your price is below 75% of ${category} services. Consider pricing at $${p25.toFixed(0)}+ to match market standards and reflect your value.`;
  } else if (currentPrice > p75) {
    icon = TrendingUp;
    iconColor = 'text-purple-600';
    title = '✨ Premium Pricing Tier';
    bgColor = 'from-purple-50 to-pink-50';
    message = `You're in the top 25% pricing tier for ${category}. Make sure your portfolio and reviews justify this premium positioning.`;
  } else if (currentPrice >= p25 && currentPrice <= median) {
    iconColor = 'text-green-600';
    title = '✓ Competitive Market Price';
    bgColor = 'from-green-50 to-emerald-50';
    message = `Your price aligns well with typical ${category} rates. Good balance of value and competitiveness.`;
  } else {
    iconColor = 'text-blue-600';
    title = '↗ Above Average Pricing';
    bgColor = 'from-blue-50 to-cyan-50';
    message = `You're priced higher than average for ${category}. Ensure your service description highlights what makes you worth more.`;
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4" 
      data-testid="container-price-hints"
    >
      {/* Main Alert */}
      <Alert 
        variant={variant} 
        className={`border-2 bg-gradient-to-br ${bgColor}`}
        data-testid="alert-price-guidance"
      >
        <div className={`${iconColor}`}>
          <icon className="h-5 w-5" />
        </div>
        <AlertTitle className="font-semibold text-base mb-2">{title}</AlertTitle>
        <AlertDescription className="text-sm leading-relaxed">
          {message}
        </AlertDescription>
      </Alert>
      
      {/* Market Positioning Card */}
      <Card className="p-5 space-y-4 bg-gradient-to-br from-muted/30 to-muted/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h4 className="font-semibold">Market Position: {category}</h4>
          </div>
          <Badge variant="outline" className="font-mono">
            {position.label}
          </Badge>
        </div>
        
        {/* Visual Price Range */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Your price positioning</span>
            <span className="font-bold text-primary">{percentile.toFixed(0)}th percentile</span>
          </div>
          
          {/* Animated Progress Bar */}
          <div className="relative h-3 bg-gradient-to-r from-red-100 via-yellow-100 via-green-100 to-purple-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentile}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute h-full bg-gradient-to-r from-primary/20 to-primary/60"
            />
            <motion.div
              initial={{ left: 0 }}
              animate={{ left: `${percentile}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            >
              <div className="relative">
                <div className="w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg" />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-primary text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                  ${currentPrice}
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Range Labels */}
          <div className="flex justify-between text-xs text-muted-foreground">
            <div className="flex flex-col items-start">
              <span className="font-medium text-foreground">${min.toFixed(0)}</span>
              <span>Minimum</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-medium text-foreground">${median.toFixed(0)}</span>
              <span>Median</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-medium text-foreground">${max.toFixed(0)}</span>
              <span>Maximum</span>
            </div>
          </div>
        </div>
      </Card>
      
      {/* Detailed Breakdown */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className={`p-4 text-center hover-elevate transition-all ${currentPrice < p25 ? 'border-green-300 bg-green-50/50' : ''}`}>
            <Target className="h-5 w-5 mx-auto mb-2 text-green-600" />
            <div className="text-xs text-muted-foreground mb-1">Budget Tier</div>
            <div className="font-bold text-lg" data-testid="text-p25">${p25.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground mt-1">25th %ile</div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={`p-4 text-center hover-elevate transition-all ${currentPrice >= p25 && currentPrice <= p75 ? 'border-blue-300 bg-blue-50/50' : ''}`}>
            <DollarSign className="h-5 w-5 mx-auto mb-2 text-blue-600" />
            <div className="text-xs text-muted-foreground mb-1">Standard Tier</div>
            <div className="font-bold text-lg" data-testid="text-median">${median.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground mt-1">50th %ile</div>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className={`p-4 text-center hover-elevate transition-all ${currentPrice > p75 ? 'border-purple-300 bg-purple-50/50' : ''}`}>
            <Sparkles className="h-5 w-5 mx-auto mb-2 text-purple-600" />
            <div className="text-xs text-muted-foreground mb-1">Premium Tier</div>
            <div className="font-bold text-lg" data-testid="text-p75">${p75.toFixed(0)}</div>
            <div className="text-xs text-muted-foreground mt-1">75th %ile</div>
          </Card>
        </motion.div>
      </div>
      
      {/* Smart Recommendations */}
      <AnimatePresence>
        {currentPrice < p25 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">💡 Pricing Recommendations</h5>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Consider raising to <strong className="text-foreground">${p25.toFixed(0)}</strong> to match market standards</li>
                    <li>• Low prices can signal lower quality to clients</li>
                    <li>• You deserve to be paid fairly for your expertise</li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
        
        {currentPrice > p75 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">✨ Premium Positioning Tips</h5>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Showcase your best work in your portfolio</li>
                    <li>• Highlight unique skills or certifications</li>
                    <li>• Include client testimonials and results</li>
                    <li>• Offer premium deliverables to justify higher rates</li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function calculatePercentile(price: number, min: number, max: number): number {
  if (price <= min) return 0;
  if (price >= max) return 100;
  return ((price - min) / (max - min)) * 100;
}

function getPositionLabel(price: number, p25: number, median: number, p75: number): { label: string; color: string } {
  if (price < p25) return { label: 'Budget', color: 'text-green-600' };
  if (price < median) return { label: 'Competitive', color: 'text-blue-600' };
  if (price < p75) return { label: 'Above Average', color: 'text-cyan-600' };
  return { label: 'Premium', color: 'text-purple-600' };
}
