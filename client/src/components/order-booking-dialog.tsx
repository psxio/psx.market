import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useClientAuth } from "@/hooks/use-client-auth";
import { useAccount } from "wagmi";
import { erc20Abi } from "viem";
import { useReadContracts } from "wagmi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, CheckCircle2, Clock, RefreshCcw, Gift, Star, TrendingDown } from "lucide-react";
import type { Service, Builder } from "@shared/schema";

const PSX_TOKEN_ADDRESS = import.meta.env.VITE_PSX_TOKEN_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000' as `0x${string}`;
const CREATE_TOKEN_ADDRESS = '0x3849cC93e7B71b37885237cd91a215974135cD8D' as `0x${string}`;

interface OrderBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: Service;
  builder: Builder;
}

export function OrderBookingDialog({
  open,
  onOpenChange,
  service,
  builder,
}: OrderBookingDialogProps) {
  const { client } = useClientAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { address } = useAccount();
  const [selectedPackage, setSelectedPackage] = useState<"basic" | "standard" | "premium">("basic");
  const [requirements, setRequirements] = useState("");
  const [offerAllocation, setOfferAllocation] = useState(false);
  const [allocationPercentage, setAllocationPercentage] = useState("");
  const [allocationDetails, setAllocationDetails] = useState("");

  // Check token balances for discounts
  const { data: tokenData } = useReadContracts({
    contracts: [
      {
        address: PSX_TOKEN_ADDRESS,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
      },
      {
        address: CREATE_TOKEN_ADDRESS,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
      },
    ],
  });

  const psxBalance = tokenData?.[0]?.result;
  const createBalance = tokenData?.[1]?.result;
  
  // User is a token holder if they have either PSX or CREATE tokens
  const isTokenHolder = (psxBalance && psxBalance > BigInt(0)) || (createBalance && createBalance > BigInt(0));

  const packages = [
    {
      id: "basic",
      name: "Basic",
      price: service.basicPrice,
      deliveryTime: service.deliveryTime,
      features: service.basicDeliverables || ["Essential features", "Basic delivery", "Professional quality"],
      revisions: 0,
    },
    {
      id: "standard",
      name: "Standard",
      price: service.standardPrice || service.basicPrice,
      deliveryTime: service.deliveryTime,
      features: service.standardDeliverables || ["All Basic features", "Priority support", "1 revision included"],
      revisions: 1,
    },
    {
      id: "premium",
      name: "Premium",
      price: service.premiumPrice || service.basicPrice,
      deliveryTime: service.deliveryTime,
      features: service.premiumDeliverables || ["All Standard features", "Premium support", "2 revisions included"],
      revisions: 2,
    },
  ];

  const selectedPkg = packages.find((p) => p.id === selectedPackage);

  // Calculate platform fees and savings
  const servicePrice = parseFloat(selectedPkg?.price || "0");
  const standardFeeRate = 0.025; // 2.5%
  const tokenHolderFeeRate = 0.01; // 1%
  
  const feeRate = isTokenHolder ? tokenHolderFeeRate : standardFeeRate;
  const platformFee = servicePrice * feeRate;
  const totalPrice = servicePrice + platformFee;
  
  const savings = isTokenHolder ? servicePrice * (standardFeeRate - tokenHolderFeeRate) : 0;
  const savingsPercentage = isTokenHolder ? ((standardFeeRate - tokenHolderFeeRate) / standardFeeRate * 100).toFixed(0) : 0;

  const createOrderMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create order");
      }
      return response.json();
    },
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients/me/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      onOpenChange(false);
      setRequirements("");
      setSelectedPackage("basic");
      setOfferAllocation(false);
      setAllocationPercentage("");
      setAllocationDetails("");
      // Navigate to order confirmation page
      navigate(`/order-confirmation/${order.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!client) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to place an order.",
        variant: "destructive",
      });
      return;
    }

    if (!requirements.trim()) {
      toast({
        title: "Requirements Missing",
        description: "Please provide project requirements.",
        variant: "destructive",
      });
      return;
    }

    createOrderMutation.mutate({
      serviceId: service.id,
      builderId: builder.id,
      packageType: selectedPackage,
      title: service.title,
      requirements: requirements.trim(),
      budget: String(selectedPkg?.price || 0),
      deliveryDays: parseInt(selectedPkg?.deliveryTime?.match(/\d+/)?.[0] || "7"),
      revisionsIncluded: selectedPkg?.revisions || 0,
      projectAllocationOffered: offerAllocation,
      projectAllocationPercentage: offerAllocation && allocationPercentage ? allocationPercentage : null,
      projectAllocationDetails: offerAllocation && allocationDetails ? allocationDetails.trim() : null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">{service.title}</DialogTitle>
          <DialogDescription className="text-sm">
            Book a service with {builder.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label className="text-base font-semibold mb-3 block">Select Package</Label>
            <RadioGroup
              value={selectedPackage}
              onValueChange={(value: any) => setSelectedPackage(value)}
              className="grid gap-3 grid-cols-1 sm:grid-cols-3"
            >
              {packages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`cursor-pointer transition-all ${
                    selectedPackage === pkg.id
                      ? "border-primary ring-2 ring-primary"
                      : "hover-elevate"
                  }`}
                  onClick={() => setSelectedPackage(pkg.id as any)}
                >
                  <CardContent className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <RadioGroupItem
                        value={pkg.id}
                        id={pkg.id}
                        className="sr-only"
                      />
                      <Label htmlFor={pkg.id} className="text-base sm:text-lg font-semibold cursor-pointer">
                        {pkg.name}
                      </Label>
                      {selectedPackage === pkg.id && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-primary">
                      ${pkg.price}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{pkg.deliveryTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <RefreshCcw className="h-4 w-4" />
                        <span>{pkg.revisions} revision{pkg.revisions !== 1 ? "s" : ""}</span>
                      </div>
                    </div>
                    {pkg.features && pkg.features.length > 0 && (
                      <>
                        <Separator />
                        <ul className="space-y-1 text-sm">
                          {pkg.features.slice(0, 3).map((feature: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 mt-0.5 text-chart-3 flex-shrink-0" />
                              <span className="text-muted-foreground">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="requirements" className="text-base font-semibold">
              Project Requirements <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="requirements"
              placeholder="Describe your project requirements in detail. Include any specific needs, deadlines, or preferences..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              rows={6}
              className="resize-none"
              data-testid="textarea-requirements"
            />
            <p className="text-sm text-muted-foreground">
              Be as specific as possible to help the builder deliver exactly what you need.
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="offer-allocation"
                checked={offerAllocation}
                onCheckedChange={(checked) => setOfferAllocation(checked as boolean)}
                data-testid="checkbox-offer-allocation"
              />
              <div className="flex-1 space-y-1">
                <Label htmlFor="offer-allocation" className="text-base font-semibold cursor-pointer flex items-center gap-2">
                  <Gift className="h-4 w-4 text-primary" />
                  Offer Project Allocation (Optional)
                </Label>
                <p className="text-sm text-muted-foreground">
                  In addition to USDC payment, offer the builder equity, tokens, or revenue share in your project
                </p>
              </div>
            </div>

            {offerAllocation && (
              <div className="ml-7 space-y-4 p-4 bg-muted/30 rounded-md border">
                <div className="space-y-2">
                  <Label htmlFor="allocation-percentage" className="text-sm font-medium">
                    Allocation Percentage
                  </Label>
                  <Input
                    id="allocation-percentage"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="e.g., 5"
                    value={allocationPercentage}
                    onChange={(e) => setAllocationPercentage(e.target.value)}
                    className="w-32"
                    data-testid="input-allocation-percentage"
                  />
                  <p className="text-xs text-muted-foreground">
                    Percentage of equity, tokens, or revenue
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allocation-details" className="text-sm font-medium">
                    Allocation Details
                  </Label>
                  <Textarea
                    id="allocation-details"
                    placeholder="Describe the allocation offer. E.g., '5% token allocation with 6-month vesting' or '10% revenue share for first year'"
                    value={allocationDetails}
                    onChange={(e) => setAllocationDetails(e.target.value)}
                    rows={3}
                    className="resize-none"
                    data-testid="textarea-allocation-details"
                  />
                  <p className="text-xs text-muted-foreground">
                    Specify terms, vesting schedule, or other relevant details
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {isTokenHolder && (
            <Alert className="border-chart-3 bg-chart-3/10">
              <Star className="h-4 w-4 text-chart-3" />
              <AlertDescription className="text-chart-3 font-medium">
                Token Holder Discount Active! You're saving {savingsPercentage}% on platform fees
              </AlertDescription>
            </Alert>
          )}

          <Card className="bg-muted/50">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Selected Package</span>
                <Badge variant="secondary">{selectedPkg?.name}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Service Price</span>
                <span className="font-medium">${servicePrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  Platform Fee
                  {isTokenHolder && (
                    <Badge variant="outline" className="text-xs gap-1 border-chart-3/40 bg-chart-3/10 text-chart-3">
                      <TrendingDown className="h-2.5 w-2.5" />
                      {feeRate * 100}%
                    </Badge>
                  )}
                  {!isTokenHolder && (
                    <span className="text-muted-foreground">({feeRate * 100}%)</span>
                  )}
                </span>
                <span className="font-medium">${platformFee.toFixed(2)}</span>
              </div>
              {isTokenHolder && savings > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-chart-3 font-medium">Token Holder Savings</span>
                  <span className="text-chart-3 font-bold">-${savings.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Price</span>
                <span className="text-2xl font-bold text-primary">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Estimated Delivery</span>
                <span className="font-medium">{selectedPkg?.deliveryTime}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Revisions Included</span>
                <span className="font-medium">{selectedPkg?.revisions}</span>
              </div>
            </CardContent>
          </Card>

          {!isTokenHolder && address && (
            <Alert className="border-primary/40 bg-primary/10">
              <Gift className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                Hold $CREATE or $PSX tokens to save {savingsPercentage}% on platform fees! 
                <a href="https://app.uniswap.org" target="_blank" rel="noopener noreferrer" className="underline ml-1 font-medium">
                  Get tokens →
                </a>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={createOrderMutation.isPending}
              data-testid="button-cancel-order"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={createOrderMutation.isPending || !requirements.trim()}
              data-testid="button-confirm-order"
            >
              {createOrderMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  Place Order - ${totalPrice.toFixed(2)}
                  {isTokenHolder && savings > 0 && (
                    <Badge variant="outline" className="ml-2 text-xs border-chart-3/40 bg-chart-3/10 text-chart-3">
                      Save ${savings.toFixed(2)}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          </div>

          {!client && (
            <div className="text-center p-4 bg-muted/50 rounded-md">
              <p className="text-sm text-muted-foreground">
                You need to be signed in to place an order
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
