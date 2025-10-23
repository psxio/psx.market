import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calculator, DollarSign, Clock, Zap } from "lucide-react";

interface PriceCalculatorProps {
  basicPrice: number;
  standardPrice?: number;
  premiumPrice?: number;
  basicDelivery: string;
  standardDelivery?: string;
  premiumDelivery?: string;
}

export function PriceCalculator({
  basicPrice,
  standardPrice,
  premiumPrice,
  basicDelivery,
  standardDelivery,
  premiumDelivery,
}: PriceCalculatorProps) {
  const [selectedPackage, setSelectedPackage] = useState<"basic" | "standard" | "premium">("basic");
  const [platformFeePercentage] = useState(2.5);
  const [quantity, setQuantity] = useState([1]);

  const packages = [
    { value: "basic", label: "Basic", price: basicPrice, delivery: basicDelivery, icon: Zap },
    ...(standardPrice
      ? [{ value: "standard" as const, label: "Standard", price: standardPrice, delivery: standardDelivery || "7 days", icon: Clock }]
      : []),
    ...(premiumPrice
      ? [{ value: "premium" as const, label: "Premium", price: premiumPrice, delivery: premiumDelivery || "14 days", icon: DollarSign }]
      : []),
  ];

  const selectedPkg = packages.find((p) => p.value === selectedPackage);
  const subtotal = (selectedPkg?.price || 0) * quantity[0];
  const platformFee = subtotal * (platformFeePercentage / 100);
  const total = subtotal + platformFee;

  return (
    <Card data-testid="price-calculator">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>Price Calculator</CardTitle>
        </div>
        <CardDescription>Estimate your total project cost</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Package Type</Label>
          <RadioGroup value={selectedPackage} onValueChange={(v) => setSelectedPackage(v as "basic" | "standard" | "premium")}>
            {packages.map((pkg) => {
              const Icon = pkg.icon;
              return (
                <div
                  key={pkg.value}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover-elevate cursor-pointer"
                  onClick={() => setSelectedPackage(pkg.value)}
                  data-testid={`package-${pkg.value}`}
                >
                  <RadioGroupItem value={pkg.value} id={pkg.value} />
                  <Label
                    htmlFor={pkg.value}
                    className="flex-1 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{pkg.label}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">${pkg.price.toFixed(2)}</div>
                      <div className="text-xs text-muted-foreground">{pkg.delivery}</div>
                    </div>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Quantity</Label>
            <Badge variant="outline" data-testid="quantity-value">{quantity[0]}</Badge>
          </div>
          <Slider
            value={quantity}
            onValueChange={setQuantity}
            min={1}
            max={10}
            step={1}
            className="w-full"
            data-testid="quantity-slider"
          />
        </div>

        <div className="space-y-2 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium" data-testid="subtotal">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Platform Fee ({platformFeePercentage}%)</span>
            <span className="font-medium" data-testid="platform-fee">${platformFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t">
            <span>Total</span>
            <span className="text-primary" data-testid="total">${total.toFixed(2)} USDC</span>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
          <p>
            Estimated delivery: <span className="font-medium">{selectedPkg?.delivery}</span>
          </p>
          <p className="mt-1">
            Final price will be confirmed with the builder before project starts.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
