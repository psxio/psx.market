import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, Reply, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import type { Review } from "@shared/schema";

interface ReviewWithResponseProps {
  review: Review;
  canRespond?: boolean;
  builderId?: string;
}

export function ReviewWithResponse({ review, canRespond = false, builderId }: ReviewWithResponseProps) {
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [responseText, setResponseText] = useState(review.builderResponse || "");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitResponse = async () => {
    if (!responseText.trim()) {
      toast({
        title: "Response Required",
        description: "Please enter a response to this review",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest("POST", `/api/reviews/${review.id}/respond`, {
        response: responseText,
      });

      toast({
        title: "Response Posted",
        description: "Your response has been published successfully",
      });

      setShowResponseForm(false);
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      queryClient.invalidateQueries({ queryKey: [`/api/builders/${builderId}/reviews`] });
    } catch (error) {
      toast({
        title: "Failed to Post Response",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card data-testid={`card-review-${review.id}`}>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Client Review */}
          <div className="flex items-start gap-4">
            <Avatar>
              <AvatarFallback>{review.clientName[0]}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{review.clientName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(review.rating)}
                    <span className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <Badge variant="outline" data-testid={`badge-rating-${review.id}`}>
                  {review.rating}.0
                </Badge>
              </div>

              {review.projectTitle && (
                <p className="text-sm text-muted-foreground italic">
                  Project: {review.projectTitle}
                </p>
              )}

              <p className="text-sm leading-relaxed" data-testid={`text-comment-${review.id}`}>
                {review.comment}
              </p>
            </div>
          </div>

          {/* Builder Response */}
          {review.builderResponse && (
            <div className="ml-16 pl-4 border-l-2 border-primary/20 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Reply className="h-4 w-4 text-primary" />
                <span className="font-semibold">Builder Response</span>
                {review.builderResponseAt && (
                  <span className="text-muted-foreground">
                    {formatDistanceToNow(new Date(review.builderResponseAt), { addSuffix: true })}
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed" data-testid={`text-response-${review.id}`}>
                {review.builderResponse}
              </p>
            </div>
          )}

          {/* Response Form */}
          {canRespond && !review.builderResponse && (
            <>
              {!showResponseForm ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-16"
                  onClick={() => setShowResponseForm(true)}
                  data-testid={`button-respond-${review.id}`}
                >
                  <Reply className="h-4 w-4 mr-2" />
                  Respond to Review
                </Button>
              ) : (
                <div className="ml-16 space-y-3">
                  <Textarea
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    placeholder="Write a professional response to this review..."
                    rows={4}
                    data-testid={`textarea-response-${review.id}`}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSubmitResponse}
                      disabled={submitting}
                      data-testid={`button-submit-response-${review.id}`}
                    >
                      {submitting ? "Posting..." : "Post Response"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowResponseForm(false);
                        setResponseText(review.builderResponse || "");
                      }}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Edit Response Option */}
          {canRespond && review.builderResponse && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-16"
              onClick={() => {
                setShowResponseForm(true);
                setResponseText(review.builderResponse!);
              }}
              data-testid={`button-edit-response-${review.id}`}
              aria-label="Edit your response to this review"
            >
              Edit Response
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface ReviewListProps {
  reviews: Review[];
  canRespond?: boolean;
  builderId?: string;
}

export function ReviewList({ reviews, canRespond = false, builderId }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
          <p className="text-muted-foreground">
            {canRespond
              ? "You'll receive reviews after completing orders"
              : "Be the first to leave a review"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewWithResponse
          key={review.id}
          review={review}
          canRespond={canRespond}
          builderId={builderId}
        />
      ))}
    </div>
  );
}
