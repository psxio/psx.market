import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Clock, DollarSign, Users, Calendar, Eye, Send } from "lucide-react";
import type { BuyerRequest } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

interface BuyerRequestCardProps {
  request: BuyerRequest;
  onSubmitProposal?: (requestId: string) => void;
  showProposalButton?: boolean;
}

export function BuyerRequestCard({ 
  request, 
  onSubmitProposal,
  showProposalButton = true 
}: BuyerRequestCardProps) {
  const timeRemaining = request.expiresAt 
    ? formatDistanceToNow(new Date(request.expiresAt), { addSuffix: true })
    : null;

  const getBudgetTypeLabel = (type: string) => {
    switch (type) {
      case "fixed":
        return "Fixed Price";
      case "hourly":
        return "Hourly Rate";
      case "range":
        return "Budget Range";
      default:
        return "Fixed Price";
    }
  };

  return (
    <Card className="hover-elevate transition-all" data-testid={`card-request-${request.id}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{request.category}</Badge>
              {request.status === "open" && (
                <Badge variant="default">Open</Badge>
              )}
              {request.status === "in_progress" && (
                <Badge variant="secondary">In Progress</Badge>
              )}
              {request.status === "closed" && (
                <Badge variant="outline">Closed</Badge>
              )}
            </div>
            <CardTitle className="text-xl" data-testid={`text-title-${request.id}`}>
              {request.title}
            </CardTitle>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Avatar className="h-5 w-5">
                  <AvatarFallback>{request.clientName[0]}</AvatarFallback>
                </Avatar>
                <span>{request.clientName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</span>
              </div>
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="flex items-center gap-1 text-lg font-bold text-primary">
              <DollarSign className="h-5 w-5" />
              <span data-testid={`text-budget-${request.id}`}>
                ${parseFloat(request.budget).toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{getBudgetTypeLabel(request.budgetType)}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <CardDescription className="line-clamp-3">
          {request.description}
        </CardDescription>

        {request.requiredSkills && request.requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {request.requiredSkills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        )}

        <Separator />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {request.deadline && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Deadline</p>
                <p className="font-medium">{new Date(request.deadline).toLocaleDateString()}</p>
              </div>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Proposals</p>
              <p className="font-medium" data-testid={`text-proposals-${request.id}`}>
                {request.proposalsCount}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Views</p>
              <p className="font-medium">{request.viewsCount}</p>
            </div>
          </div>

          {timeRemaining && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Expires</p>
                <p className="font-medium">{timeRemaining}</p>
              </div>
            </div>
          )}
        </div>

        {showProposalButton && request.status === "open" && (
          <>
            <Separator />
            <Button
              className="w-full"
              onClick={() => onSubmitProposal?.(request.id)}
              data-testid={`button-submit-proposal-${request.id}`}
            >
              <Send className="h-4 w-4 mr-2" />
              Submit Proposal
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

interface BuyerRequestsBoardProps {
  requests: BuyerRequest[];
  onSubmitProposal?: (requestId: string) => void;
  showProposalButton?: boolean;
  emptyState?: React.ReactNode;
}

export function BuyerRequestsBoard({
  requests,
  onSubmitProposal,
  showProposalButton = true,
  emptyState
}: BuyerRequestsBoardProps) {
  if (requests.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No active requests</h3>
          <p className="text-muted-foreground">
            Check back later for new project opportunities
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {requests.map((request) => (
        <BuyerRequestCard
          key={request.id}
          request={request}
          onSubmitProposal={onSubmitProposal}
          showProposalButton={showProposalButton}
        />
      ))}
    </div>
  );
}
