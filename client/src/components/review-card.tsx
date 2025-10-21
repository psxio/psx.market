import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useClientAuth } from "@/hooks/use-client-auth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Star, ThumbsUp, ThumbsDown, MessageSquare, AlertCircle } from "lucide-react";
import type { Review } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface ReviewCardProps {
  review: Review;
  builderId: string;
  onDisputeClick?: () => void;
}

export function ReviewCard({ review, builderId, onDisputeClick }: ReviewCardProps) {
  const { client } = useClientAuth();
  const { toast } = useToast();
  const [userVote, setUserVote] = useState<string | null>(null);

  const voteMutation = useMutation({
    mutationFn: async (voteType: "helpful" | "not_helpful") => {
      const response = await fetch(`/api/reviews/${review.id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voteType }),
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to vote");
      }
      return response.json();
    },
    onSuccess: (data, voteType) => {
      setUserVote(voteType);
      queryClient.invalidateQueries({ queryKey: ["/api/builders", builderId, "reviews"] });
      toast({
        title: "Vote Recorded",
        description: "Thank you for your feedback!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Vote Failed",
        description: error.message || "Failed to record vote.",
        variant: "destructive",
      });
    },
  });

  const removeVoteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/reviews/${review.id}/vote`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to remove vote");
      }
      return response.json();
    },
    onSuccess: () => {
      setUserVote(null);
      queryClient.invalidateQueries({ queryKey: ["/api/builders", builderId, "reviews"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Remove Vote",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleVote = (voteType: "helpful" | "not_helpful") => {
    if (!client) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to vote on reviews.",
        variant: "destructive",
      });
      return;
    }

    if (userVote === voteType) {
      removeVoteMutation.mutate();
    } else {
      voteMutation.mutate(voteType);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const statusColor = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    approved: "bg-green-500/10 text-green-500 border-green-500/20",
    rejected: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  if (review.status === "rejected") {
    return null;
  }

  return (
    <Card data-testid={`review-card-${review.id}`}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{getInitials(review.clientName)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold">{review.clientName}</p>
                {review.status === "pending" && (
                  <Badge variant="outline" className={statusColor.pending}>
                    Pending Review
                  </Badge>
                )}
                {review.onchainVerified && (
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    On-Chain Verified
                  </Badge>
                )}
                {review.isDisputed && (
                  <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                    Disputed
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
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
            <p className="text-sm font-medium text-muted-foreground">Project</p>
            <p className="text-sm">{review.projectTitle}</p>
          </div>
        )}

        <div>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{review.comment}</p>
        </div>

        {review.builderResponse && (
          <>
            <Separator />
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <p className="text-sm font-semibold">Builder Response</p>
                {review.builderResponseAt && (
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(review.builderResponseAt), { addSuffix: true })}
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {review.builderResponse}
              </p>
            </div>
          </>
        )}

        {review.status === "approved" && (
          <>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Was this review helpful?</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  data-testid={`button-helpful-${review.id}`}
                  variant="outline"
                  size="sm"
                  onClick={() => handleVote("helpful")}
                  disabled={voteMutation.isPending || removeVoteMutation.isPending}
                  className={userVote === "helpful" ? "bg-primary/10" : ""}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {review.helpfulCount}
                </Button>
                <Button
                  data-testid={`button-not-helpful-${review.id}`}
                  variant="outline"
                  size="sm"
                  onClick={() => handleVote("not_helpful")}
                  disabled={voteMutation.isPending || removeVoteMutation.isPending}
                  className={userVote === "not_helpful" ? "bg-destructive/10" : ""}
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  {review.notHelpfulCount}
                </Button>
                {client && !review.isDisputed && onDisputeClick && (
                  <Button
                    data-testid={`button-dispute-${review.id}`}
                    variant="ghost"
                    size="sm"
                    onClick={onDisputeClick}
                  >
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Dispute
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
