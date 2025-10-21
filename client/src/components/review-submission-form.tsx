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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Star, Loader2 } from "lucide-react";
import type { Builder } from "@shared/schema";

interface ReviewSubmissionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  builder: Builder;
  orderId?: string;
  serviceId?: string;
}

export function ReviewSubmissionForm({
  open,
  onOpenChange,
  builder,
  orderId,
  serviceId,
}: ReviewSubmissionFormProps) {
  const { client } = useClientAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [projectTitle, setProjectTitle] = useState("");

  const createReviewMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit review");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/builders", builder.id, "reviews"] });
      toast({
        title: "Review Submitted!",
        description: "Your review has been submitted and will be visible after moderation.",
      });
      onOpenChange(false);
      setRating(5);
      setComment("");
      setProjectTitle("");
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!client) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a review.",
        variant: "destructive",
      });
      return;
    }

    if (!comment.trim()) {
      toast({
        title: "Review Required",
        description: "Please provide your review comments.",
        variant: "destructive",
      });
      return;
    }

    if (comment.trim().length < 20) {
      toast({
        title: "Review Too Short",
        description: "Please provide at least 20 characters in your review.",
        variant: "destructive",
      });
      return;
    }

    createReviewMutation.mutate({
      builderId: builder.id,
      rating,
      comment: comment.trim(),
      projectTitle: projectTitle.trim() || null,
      serviceId: serviceId || null,
      orderId: orderId || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience working with {builder.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <Label className="text-base font-semibold mb-3 block">Rating</Label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  data-testid={`button-star-${star}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {rating} {rating === 1 ? "star" : "stars"}
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="projectTitle" className="text-base font-semibold mb-3 block">
              Project Title <span className="text-muted-foreground text-sm font-normal">(Optional)</span>
            </Label>
            <Input
              id="projectTitle"
              data-testid="input-project-title"
              placeholder="e.g., Token Launch Campaign"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              maxLength={100}
            />
          </div>

          <div>
            <Label htmlFor="comment" className="text-base font-semibold mb-3 block">
              Your Review
            </Label>
            <Textarea
              id="comment"
              data-testid="input-review-comment"
              placeholder="Share details about your experience, the quality of work, communication, and whether you'd recommend this builder to others..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={6}
              maxLength={2000}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {comment.length}/2000 characters (minimum 20)
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">Review Guidelines</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Be honest and constructive in your feedback</li>
              <li>• Focus on the builder's work quality and professionalism</li>
              <li>• Reviews are moderated before being published</li>
              <li>• Avoid including personal information or contact details</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              data-testid="button-cancel-review"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createReviewMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              data-testid="button-submit-review"
              onClick={handleSubmit}
              disabled={createReviewMutation.isPending || !comment.trim() || comment.trim().length < 20}
            >
              {createReviewMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Review
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
