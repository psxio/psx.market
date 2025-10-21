import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, CheckCircle2, AlertCircle } from "lucide-react";
import { processPayment, calculatePlatformFee } from "@/lib/basepay";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Service, Order } from "@shared/schema";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order;
  service?: Service;
  clientId: string;
  builderId: string;
}

export function PaymentDialog({
  open,
  onOpenChange,
  order,
  service,
  clientId,
  builderId,
}: PaymentDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const { toast } = useToast();

  const amount = parseFloat(order.budget);
  const { platformFee, builderAmount, total } = calculatePlatformFee(amount);

  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentStatus("processing");
    setErrorMessage("");

    try {
      const paymentData = {
        orderId: order.id,
        clientId,
        builderId,
        amount: total.toString(),
        currency: "USDC",
        paymentMethod: "base_pay",
        platformFee: platformFee.toString(),
        platformFeePercentage: "2.5",
        builderAmount: builderAmount.toString(),
        payerEmail: "",
      };

      const response = await apiRequest("POST", "/api/payments", paymentData);
      const { payment } = await response.json() as { payment: any; invoice: any };

      const result = await processPayment({
        amount: (total * 1_000_000).toString(),
        recipient: builderId,
        testnet: true,
      });

      if (result.success && result.transactionHash) {
        await fetch(`/api/payments/${payment.id}/confirm`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transactionHash: result.transactionHash,
            blockNumber: 0,
          }),
        });

        await queryClient.invalidateQueries({ queryKey: ["/api/orders", order.id] });
        await queryClient.invalidateQueries({ queryKey: ["/api/orders", "client", clientId] });

        setPaymentStatus("success");
        toast({
          title: "Payment Successful",
          description: `Payment of ${total} USDC completed successfully`,
        });

        setTimeout(() => {
          onOpenChange(false);
          setPaymentStatus("idle");
        }, 2000);
      } else {
        throw new Error(result.error || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Payment failed");
      toast({
        title: "Payment Failed",
        description: error instanceof Error ? error.message : "Payment failed",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" data-testid="dialog-payment">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
          <DialogDescription>
            Pay securely with USDC on Base using Base Pay
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2 rounded-md border p-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service Amount</span>
              <span className="font-medium" data-testid="text-service-amount">${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Platform Fee (2.5%)</span>
              <span className="font-medium" data-testid="text-platform-fee">${platformFee.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total (USDC)</span>
              <span data-testid="text-total-amount">${total.toFixed(2)}</span>
            </div>
            <div className="text-xs text-muted-foreground pt-2">
              Builder receives: ${builderAmount.toFixed(2)}
            </div>
          </div>

          {paymentStatus === "success" && (
            <div className="flex items-center gap-2 rounded-md bg-green-50 dark:bg-green-950 p-3 text-sm text-green-800 dark:text-green-200" data-testid="status-payment-success">
              <CheckCircle2 className="h-4 w-4" />
              <span>Payment completed successfully!</span>
            </div>
          )}

          {paymentStatus === "error" && (
            <div className="flex items-center gap-2 rounded-md bg-red-50 dark:bg-red-950 p-3 text-sm text-red-800 dark:text-red-200" data-testid="status-payment-error">
              <AlertCircle className="h-4 w-4" />
              <span>{errorMessage || "Payment failed. Please try again."}</span>
            </div>
          )}

          {paymentStatus === "processing" && (
            <div className="flex items-center gap-2 rounded-md bg-blue-50 dark:bg-blue-950 p-3 text-sm text-blue-800 dark:text-blue-200" data-testid="status-payment-processing">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing payment on Base blockchain...</span>
            </div>
          )}

          <div className="space-y-2 text-xs text-muted-foreground">
            <p>• Payment will be held in escrow until work is delivered</p>
            <p>• Milestone-based releases available for larger projects</p>
            <p>• Secure on-chain payment via Base Pay</p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
            data-testid="button-cancel-payment"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePayment}
            disabled={isProcessing || paymentStatus === "success"}
            data-testid="button-confirm-payment"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay {total.toFixed(2)} USDC
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
