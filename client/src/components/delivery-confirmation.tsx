import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ExternalLink,
  Download,
  FileText
} from "lucide-react";
import { format } from "date-fns";
import type { ProjectDeliverable } from "@shared/schema";

interface DeliveryConfirmationProps {
  orderId: string;
  clientId: string;
}

export function DeliveryConfirmation({
  orderId,
  clientId,
}: DeliveryConfirmationProps) {
  const [selectedDeliverable, setSelectedDeliverable] = useState<ProjectDeliverable | null>(null);
  const [reviewAction, setReviewAction] = useState<"accept" | "reject" | "revision" | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: deliverables = [], isLoading } = useQuery<ProjectDeliverable[]>({
    queryKey: ["/api/orders", orderId, "deliverables"],
    enabled: !!orderId,
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ 
      deliverableId, 
      accepted, 
      notes, 
      reason 
    }: { 
      deliverableId: string; 
      accepted: boolean; 
      notes: string; 
      reason?: string;
    }) => {
      return await apiRequest("POST", `/api/deliverables/${deliverableId}/review`, {
        reviewedBy: clientId,
        reviewNotes: notes,
        accepted,
        rejectionReason: reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders", orderId, "deliverables"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders", orderId] });
      toast({
        title: "Success",
        description: reviewAction === "accept" 
          ? "Deliverable accepted successfully" 
          : "Deliverable rejected with feedback",
      });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to review deliverable",
        variant: "destructive",
      });
    },
  });

  const revisionMutation = useMutation({
    mutationFn: async ({ 
      deliverableId, 
      notes 
    }: { 
      deliverableId: string; 
      notes: string;
    }) => {
      return await apiRequest("POST", `/api/deliverables/${deliverableId}/request-revision`, {
        reviewNotes: notes,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders", orderId, "deliverables"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders", orderId] });
      toast({
        title: "Success",
        description: "Revision requested successfully",
      });
      handleCloseDialog();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to request revision",
        variant: "destructive",
      });
    },
  });

  const handleCloseDialog = () => {
    setSelectedDeliverable(null);
    setReviewAction(null);
    setReviewNotes("");
    setRejectionReason("");
  };

  const handleReview = () => {
    if (!selectedDeliverable || !reviewAction) return;

    if (reviewAction === "revision") {
      revisionMutation.mutate({
        deliverableId: selectedDeliverable.id,
        notes: reviewNotes,
      });
    } else {
      reviewMutation.mutate({
        deliverableId: selectedDeliverable.id,
        accepted: reviewAction === "accept",
        notes: reviewNotes,
        reason: reviewAction === "reject" ? rejectionReason : undefined,
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "default";
      case "rejected":
        return "destructive";
      case "revision_requested":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle2 className="w-4 h-4 text-primary" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-destructive" />;
      case "revision_requested":
        return <AlertCircle className="w-4 h-4 text-warning" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const pendingDeliverables = deliverables.filter(d => d.status === "pending");
  const reviewedDeliverables = deliverables.filter(d => d.status !== "pending");

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="p-4 border rounded-md animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3 mb-2" />
              <div className="h-3 bg-muted rounded w-2/3" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Deliverable Review</h2>
        </div>

        {deliverables.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No deliverables submitted yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pendingDeliverables.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  Pending Review ({pendingDeliverables.length})
                </h3>
                <div className="space-y-3">
                  {pendingDeliverables.map((deliverable) => (
                    <div
                      key={deliverable.id}
                      className="p-4 border rounded-md hover-elevate"
                      data-testid={`deliverable-${deliverable.id}`}
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold" data-testid={`text-deliverable-title-${deliverable.id}`}>
                              {deliverable.title}
                            </h3>
                            <Badge variant={getStatusColor(deliverable.status)}>
                              {deliverable.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {deliverable.description}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline">{deliverable.deliveryType}</Badge>
                            <span>•</span>
                            <time dateTime={deliverable.submittedAt}>
                              Submitted {format(new Date(deliverable.submittedAt), "MMM d, yyyy")}
                            </time>
                          </div>
                        </div>
                      </div>

                      {deliverable.fileUrls && deliverable.fileUrls.length > 0 && (
                        <div className="space-y-2 mb-4">
                          <p className="text-sm font-medium">Files:</p>
                          {deliverable.fileUrls.map((url, index) => (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-sm text-primary hover:underline"
                              data-testid={`link-file-${deliverable.id}-${index}`}
                            >
                              <ExternalLink className="w-3 h-3" />
                              File {index + 1}
                            </a>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedDeliverable(deliverable);
                            setReviewAction("accept");
                          }}
                          data-testid={`button-accept-${deliverable.id}`}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedDeliverable(deliverable);
                            setReviewAction("revision");
                          }}
                          data-testid={`button-request-revision-${deliverable.id}`}
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Request Revision
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedDeliverable(deliverable);
                            setReviewAction("reject");
                          }}
                          data-testid={`button-reject-${deliverable.id}`}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {reviewedDeliverables.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">
                  Reviewed ({reviewedDeliverables.length})
                </h3>
                <div className="space-y-3">
                  {reviewedDeliverables.map((deliverable) => (
                    <div
                      key={deliverable.id}
                      className="p-4 border rounded-md"
                      data-testid={`deliverable-reviewed-${deliverable.id}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(deliverable.status)}
                            <h3 className="font-semibold">{deliverable.title}</h3>
                            <Badge variant={getStatusColor(deliverable.status)}>
                              {deliverable.status.replace(/_/g, " ")}
                            </Badge>
                          </div>
                          {deliverable.reviewNotes && (
                            <p className="text-sm text-muted-foreground mt-2">
                              <span className="font-medium">Review Notes:</span> {deliverable.reviewNotes}
                            </p>
                          )}
                          {deliverable.reviewedAt && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Reviewed {format(new Date(deliverable.reviewedAt), "MMM d, yyyy h:mm a")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      <Dialog open={!!selectedDeliverable && !!reviewAction} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === "accept" && "Accept Deliverable"}
              {reviewAction === "reject" && "Reject Deliverable"}
              {reviewAction === "revision" && "Request Revision"}
            </DialogTitle>
            <DialogDescription>
              {reviewAction === "accept" && "Confirm that this deliverable meets your requirements."}
              {reviewAction === "reject" && "Provide feedback on why this deliverable is being rejected."}
              {reviewAction === "revision" && "Provide specific feedback on what needs to be revised."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Review Notes</label>
              <Textarea
                placeholder="Add your feedback here..."
                rows={4}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                data-testid="input-review-notes"
              />
            </div>

            {reviewAction === "reject" && (
              <div>
                <label className="text-sm font-medium mb-2 block">Rejection Reason</label>
                <Textarea
                  placeholder="Explain why this deliverable is being rejected..."
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  data-testid="input-rejection-reason"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              data-testid="button-cancel-review"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReview}
              disabled={reviewMutation.isPending || revisionMutation.isPending}
              variant={reviewAction === "reject" ? "destructive" : "default"}
              data-testid="button-confirm-review"
            >
              {(reviewMutation.isPending || revisionMutation.isPending) ? "Processing..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
