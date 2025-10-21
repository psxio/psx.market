import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Download, ExternalLink, CreditCard } from "lucide-react";
import { format } from "date-fns";
import type { Payment, Invoice } from "@shared/schema";

interface PaymentHistoryProps {
  clientId: string;
}

export function PaymentHistory({ clientId }: PaymentHistoryProps) {
  const { data: payments, isLoading } = useQuery<Payment[]>({
    queryKey: ["/api/clients", clientId, "payments"],
  });

  const { data: invoices } = useQuery<Invoice[]>({
    queryKey: ["/api/clients", clientId, "invoices"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "paid":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "failed":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>No payments yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <CreditCard className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Your payment history will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
        <CardDescription>View all your payments and invoices</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {payments.map((payment) => {
          const invoice = invoices?.find((inv) => inv.paymentId === payment.id);
          
          return (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 border rounded-md hover-elevate"
              data-testid={`payment-${payment.id}`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium" data-testid="text-payment-amount">
                    ${parseFloat(payment.amount).toFixed(2)} USDC
                  </p>
                  <Badge className={getStatusColor(payment.status)} data-testid={`badge-payment-status-${payment.status}`}>
                    {payment.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {payment.paidAt
                    ? `Paid ${format(new Date(payment.paidAt), "MMM d, yyyy 'at' h:mm a")}`
                    : `Created ${format(new Date(payment.createdAt), "MMM d, yyyy")}`}
                </p>
                {payment.transactionHash && (
                  <p className="text-xs text-muted-foreground font-mono">
                    Tx: {payment.transactionHash.slice(0, 10)}...{payment.transactionHash.slice(-8)}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                {payment.transactionHash && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`https://basescan.org/tx/${payment.transactionHash}`, "_blank")}
                    data-testid="button-view-transaction"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Tx
                  </Button>
                )}
                {invoice && (
                  <Button
                    size="sm"
                    variant="outline"
                    data-testid="button-download-invoice"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Invoice
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
