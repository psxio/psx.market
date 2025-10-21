import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, DollarSign, ExternalLink, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import type { Payout, Payment } from "@shared/schema";

interface BuilderPayoutsProps {
  builderId: string;
}

export function BuilderPayouts({ builderId }: BuilderPayoutsProps) {
  const { data: payouts, isLoading: payoutsLoading } = useQuery<Payout[]>({
    queryKey: ["/api/builders", builderId, "payouts"],
  });

  const { data: payments } = useQuery<Payment[]>({
    queryKey: ["/api/builders", builderId, "payments"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "pending":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "failed":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
    }
  };

  const completedPayments = payments?.filter(p => p.status === "completed" && !p.releasedAt) || [];
  const pendingEarnings = completedPayments.reduce(
    (sum, payment) => sum + parseFloat(payment.builderAmount),
    0
  );

  const completedPayouts = payouts?.filter(p => p.status === "completed") || [];
  const totalEarned = completedPayouts.reduce(
    (sum, payout) => sum + parseFloat(payout.amount),
    0
  );

  if (payoutsLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-earnings">
              ${totalEarned.toFixed(2)} USDC
            </div>
            <p className="text-xs text-muted-foreground">
              From {completedPayouts.length} completed payout{completedPayouts.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-pending-earnings">
              ${pendingEarnings.toFixed(2)} USDC
            </div>
            <p className="text-xs text-muted-foreground">
              From {completedPayments.length} completed project{completedPayments.length !== 1 ? "s" : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payout History</CardTitle>
          <CardDescription>Track your earnings and payout status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!payouts || payouts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <DollarSign className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No payouts yet</p>
              <p className="text-sm mt-2">Complete projects to start earning</p>
            </div>
          ) : (
            payouts.map((payout) => (
              <div
                key={payout.id}
                className="flex items-center justify-between p-4 border rounded-md hover-elevate"
                data-testid={`payout-${payout.id}`}
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium" data-testid="text-payout-amount">
                      ${parseFloat(payout.amount).toFixed(2)} USDC
                    </p>
                    <Badge className={getStatusColor(payout.status)} data-testid={`badge-payout-status-${payout.status}`}>
                      {payout.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {payout.processedAt
                      ? `Processed ${format(new Date(payout.processedAt), "MMM d, yyyy")}`
                      : `Requested ${format(new Date(payout.createdAt), "MMM d, yyyy")}`}
                  </p>
                  {payout.transactionHash && (
                    <p className="text-xs text-muted-foreground font-mono">
                      Tx: {payout.transactionHash.slice(0, 10)}...{payout.transactionHash.slice(-8)}
                    </p>
                  )}
                </div>

                {payout.transactionHash && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`https://basescan.org/tx/${payout.transactionHash}`, "_blank")}
                    data-testid="button-view-payout-transaction"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Tx
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
