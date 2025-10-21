import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Star, Loader2 } from "lucide-react";
import type { Review } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface BuilderResponseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: Review;
  builderId: string;
}

export function BuilderResponseDialog({
  open,
  onOpenChange,
  review,
  builderId,
}: BuilderResponseDialogProps) {
  const { toast } = useToast();
  const [response, setResponse] = useState(review.builderResponse || "");

  const addResponseMutation = useMutation({
    mutationFn: async (responseText: string) => {
      const res = await fetch(`/api/reviews/${review.id}/response`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: responseText }),
        credentials: "include",
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add response");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/builders", builderId, "reviews"] });
      toast({
        title: "Response Added!",
        description: "Your response has been posted successfully.",
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Response",
        description: error.message || "Failed to add response. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!response.trim()) {
      toast({
        title: "Response Required",
        description: "Please provide a response to this review.",
        variant: "destructive",
      });
      return;
    }

    if (response.trim().length < 10) {
      toast({
        title: "Response Too Short",
        description: "Please provide at least 10 characters in your response.",
        variant: "destructive",
      });
      return;
    }

    addResponseMutation.mutate(response.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Respond to Review</DialogTitle>
          <DialogDescription>
            Add your response to this client review
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{review.clientName}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                  </p>
                </div>
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
              </div>
              {review.projectTitle && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Project</p>
                  <p className="text-sm">{review.projectTitle}</p>
                </div>
              )}
              <div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{review.comment}</p>
              </div>
            </CardContent>
          </Card>

          <div>
            <Label htmlFor="response" className="text-base font-semibold mb-3 block">
              Your Response
            </Label>
            <Textarea
              id="response"
              data-testid="input-builder-response"
              placeholder="Thank your client and address any specific points mentioned in their review..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={6}
              maxLength={1000}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground mt-2">
              {response.length}/1000 characters (minimum 10)
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">Response Guidelines</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Thank the client for their feedback</li>
              <li>• Address any specific concerns or praise</li>
              <li>• Keep your response professional and constructive</li>
              <li>• Avoid getting defensive or argumentative</li>
            </ul>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              data-testid="button-cancel-response"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={addResponseMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              data-testid="button-submit-response"
              onClick={handleSubmit}
              disabled={addResponseMutation.isPending || !response.trim() || response.trim().length < 10}
            >
              {addResponseMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {review.builderResponse ? "Update Response" : "Add Response"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
