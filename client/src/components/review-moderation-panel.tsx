import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Star, CheckCircle, XCircle, AlertCircle, Loader2, MessageSquare } from "lucide-react";
import type { Review } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export function ReviewModerationPanel() {
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [moderationNotes, setModerationNotes] = useState("");

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["/api/builders"],
    select: (builders: any[]) => {
      const allReviews: any[] = [];
      builders.forEach((builder) => {
        if (builder.reviews) {
          builder.reviews.forEach((review: Review) => {
            allReviews.push({ ...review, builderName: builder.name });
          });
        }
      });
      return allReviews.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ reviewId, status, notes }: { reviewId: string; status: string; notes?: string }) => {
      const response = await fetch(`/api/reviews/${reviewId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update status");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/builders"] });
      toast({
        title: "Status Updated",
        description: "Review status has been updated successfully.",
      });
      setSelectedReview(null);
      setModerationNotes("");
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update review status.",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (review: Review) => {
    updateStatusMutation.mutate({
      reviewId: review.id,
      status: "approved",
      notes: moderationNotes.trim() || undefined,
    });
  };

  const handleReject = (review: Review) => {
    if (!moderationNotes.trim()) {
      toast({
        title: "Notes Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }
    updateStatusMutation.mutate({
      reviewId: review.id,
      status: "rejected",
      notes: moderationNotes.trim(),
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredReviews = reviews?.filter((review) => {
    if (statusFilter === "all") return true;
    return review.status === statusFilter;
  });

  const statusCounts = {
    all: reviews?.length || 0,
    pending: reviews?.filter((r) => r.status === "pending").length || 0,
    approved: reviews?.filter((r) => r.status === "approved").length || 0,
    rejected: reviews?.filter((r) => r.status === "rejected").length || 0,
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-12 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Review Moderation</CardTitle>
          <CardDescription>Approve or reject client reviews</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-2">
            <Label>Filter by Status:</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]" data-testid="select-status-filter">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All ({statusCounts.all})</SelectItem>
                <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
                <SelectItem value="approved">Approved ({statusCounts.approved})</SelectItem>
                <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredReviews && filteredReviews.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No reviews found</p>
            </div>
          )}

          <div className="space-y-4">
            {filteredReviews?.map((review) => (
              <Card key={review.id} data-testid={`review-moderation-${review.id}`}>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{getInitials(review.clientName)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold">{review.clientName}</p>
                          <span className="text-sm text-muted-foreground">→</span>
                          <p className="text-sm text-muted-foreground">{review.builderName}</p>
                          {review.status === "pending" && (
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                              Pending
                            </Badge>
                          )}
                          {review.status === "approved" && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-500">
                              Approved
                            </Badge>
                          )}
                          {review.status === "rejected" && (
                            <Badge variant="outline" className="bg-red-500/10 text-red-500">
                              Rejected
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {review.projectTitle && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">Project</p>
                      <p className="text-sm">{review.projectTitle}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm leading-relaxed">{review.comment}</p>
                  </div>

                  {review.builderResponse && (
                    <>
                      <Separator />
                      <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-3 w-3 text-primary" />
                          <p className="text-xs font-semibold">Builder Response</p>
                        </div>
                        <p className="text-sm">{review.builderResponse}</p>
                      </div>
                    </>
                  )}

                  {review.moderatorNotes && (
                    <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                      <p className="text-xs font-semibold text-muted-foreground">Moderator Notes</p>
                      <p className="text-sm">{review.moderatorNotes}</p>
                    </div>
                  )}

                  {review.status === "pending" && (
                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        data-testid={`button-moderate-${review.id}`}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedReview(review);
                          setModerationNotes("");
                        }}
                      >
                        Moderate
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedReview} onOpenChange={(open) => !open && setSelectedReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Moderate Review</DialogTitle>
            <DialogDescription>
              Approve or reject this review with optional notes
            </DialogDescription>
          </DialogHeader>

          {selectedReview && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4 space-y-2">
                  <p className="font-semibold">{selectedReview.clientName}</p>
                  <p className="text-sm">{selectedReview.comment}</p>
                </CardContent>
              </Card>

              <div>
                <Label htmlFor="notes">Moderation Notes (Optional for approval, required for rejection)</Label>
                <Textarea
                  id="notes"
                  data-testid="input-moderation-notes"
                  placeholder="Add notes about why this review was approved or rejected..."
                  value={moderationNotes}
                  onChange={(e) => setModerationNotes(e.target.value)}
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  data-testid="button-reject-review"
                  variant="outline"
                  onClick={() => handleReject(selectedReview)}
                  disabled={updateStatusMutation.isPending}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  data-testid="button-approve-review"
                  onClick={() => handleApprove(selectedReview)}
                  disabled={updateStatusMutation.isPending}
                >
                  {updateStatusMutation.isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
