import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useClientAuth } from "@/hooks/use-client-auth";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, CheckCircle2, Clock, RefreshCcw } from "lucide-react";
import type { Service, Builder } from "@shared/schema";

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
  const [selectedPackage, setSelectedPackage] = useState<"basic" | "standard" | "premium">("basic");
  const [requirements, setRequirements] = useState("");

  const packages = [
    {
      id: "basic",
      name: "Basic",
      price: service.basicPrice,
      deliveryTime: service.deliveryTime,
      features: ["Essential features", "Basic delivery", "Professional quality"],
      revisions: 0,
    },
    {
      id: "standard",
      name: "Standard",
      price: service.standardPrice || service.basicPrice,
      deliveryTime: service.deliveryTime,
      features: ["All Basic features", "Priority support", "1 revision included"],
      revisions: 1,
    },
    {
      id: "premium",
      name: "Premium",
      price: service.premiumPrice || service.basicPrice,
      deliveryTime: service.deliveryTime,
      features: ["All Standard features", "Premium support", "2 revisions included"],
      revisions: 2,
    },
  ];

  const selectedPkg = packages.find((p) => p.id === selectedPackage);

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients/me/orders"] });
      toast({
        title: "Order Placed!",
        description: "Your order has been submitted successfully. The builder will be notified.",
      });
      onOpenChange(false);
      setRequirements("");
      setSelectedPackage("basic");
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
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{service.title}</DialogTitle>
          <DialogDescription>
            Book a service with {builder.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label className="text-base font-semibold mb-3 block">Select Package</Label>
            <RadioGroup
              value={selectedPackage}
              onValueChange={(value: any) => setSelectedPackage(value)}
              className="grid gap-4 md:grid-cols-3"
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
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <RadioGroupItem
                        value={pkg.id}
                        id={pkg.id}
                        className="sr-only"
                      />
                      <Label htmlFor={pkg.id} className="text-lg font-semibold cursor-pointer">
                        {pkg.name}
                      </Label>
                      {selectedPackage === pkg.id && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div className="text-3xl font-bold text-primary">
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

          <Card className="bg-muted/50">
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Selected Package</span>
                <Badge variant="secondary">{selectedPkg?.name}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Price</span>
                <span className="text-2xl font-bold text-primary">
                  ${selectedPkg?.price}
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
                `Place Order - $${selectedPkg?.price}`
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
