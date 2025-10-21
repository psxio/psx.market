import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Dispute, Order } from "@shared/schema";

interface DisputeResolutionProps {
  order: Order;
  clientId?: string;
}

export function DisputeResolution({ order, clientId }: DisputeResolutionProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [disputeReason, setDisputeReason] = useState("");

  const { data: disputes, isLoading } = useQuery<Dispute[]>({
    queryKey: ["/api/orders", order.id, "disputes"],
  });

  const createDisputeMutation = useMutation({
    mutationFn: async (disputeData: any) => {
      const response = await apiRequest("POST", "/api/disputes", disputeData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders", order.id, "disputes"] });
      toast({
        title: "Dispute created",
        description: "Your dispute has been submitted for review",
      });
      setIsDialogOpen(false);
      setReason("");
      setDescription("");
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create dispute",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    },
  });

  const handleCreateDispute = () => {
    if (!reason || !description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createDisputeMutation.mutate({
      paymentId: order.id,
      orderId: order.id,
      raisedBy: clientId || order.clientId,
      raisedByType: "client",
      reason: disputeReason,
      description,
      evidence: [],
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "open":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "closed":
        return "bg-gray-500/10 text-gray-700 dark:text-gray-400";
      default:
        return "bg-blue-500/10 text-blue-700 dark:text-blue-400";
    }
  };

  const hasOpenDispute = disputes?.some(d => d.status === "open");

  return (
    <div className="space-y-4">
      {disputes && disputes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Disputes</CardTitle>
            <CardDescription>Track and manage disputes for this order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {disputes.map((dispute) => (
              <div
                key={dispute.id}
                className="p-4 border rounded-md space-y-2"
                data-testid={`dispute-${dispute.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <p className="font-medium">{dispute.reason}</p>
                  </div>
                  <Badge className={getStatusColor(dispute.status)} data-testid={`badge-dispute-status-${dispute.status}`}>
                    {dispute.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{dispute.description}</p>
                <p className="text-xs text-muted-foreground">
                  Raised {format(new Date(dispute.createdAt), "MMM d, yyyy")}
                </p>
                {dispute.resolution && (
                  <div className="mt-2 p-3 bg-green-50 dark:bg-green-950 rounded-md">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Resolution
                      </p>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {dispute.resolution}
                    </p>
                    {dispute.resolvedAt && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Resolved {format(new Date(dispute.resolvedAt), "MMM d, yyyy")}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {!hasOpenDispute && order.status !== "completed" && order.status !== "cancelled" && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full gap-2" data-testid="button-raise-dispute">
              <AlertTriangle className="h-4 w-4" />
              Raise a Dispute
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md" data-testid="dialog-raise-dispute">
            <DialogHeader>
              <DialogTitle>Raise a Dispute</DialogTitle>
              <DialogDescription>
                Submit a dispute if you're unsatisfied with the service or delivery
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="dispute-reason">Reason</Label>
                <Select value={disputeReason} onValueChange={setDisputeReason}>
                  <SelectTrigger id="dispute-reason" data-testid="select-dispute-reason">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="quality_issues">Quality Issues</SelectItem>
                    <SelectItem value="delayed_delivery">Delayed Delivery</SelectItem>
                    <SelectItem value="incomplete_work">Incomplete Work</SelectItem>
                    <SelectItem value="not_as_described">Not As Described</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dispute-description">Description</Label>
                <Textarea
                  id="dispute-description"
                  placeholder="Please provide details about your dispute..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  data-testid="textarea-dispute-description"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                data-testid="button-cancel-dispute"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateDispute}
                disabled={createDisputeMutation.isPending}
                data-testid="button-submit-dispute"
              >
                {createDisputeMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Dispute"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
