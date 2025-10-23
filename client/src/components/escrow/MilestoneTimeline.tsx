import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Clock, Upload, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Milestone {
  id: string;
  title: string;
  description: string;
  amount: string;
  escrowStatus: string;
  milestoneIndex: number;
  submittedAt: string | null;
  approvedAt: string | null;
  paidAt: string | null;
  approvalDeadline: number;
}

interface MilestoneTimelineProps {
  milestones: Milestone[];
  userType: 'client' | 'builder';
  onSubmit: (index: number) => void;
  onApprove: (index: number) => void;
  isSubmitting: boolean;
  isApproving: boolean;
}

export function MilestoneTimeline({
  milestones,
  userType,
  onSubmit,
  onApprove,
  isSubmitting,
  isApproving,
}: MilestoneTimelineProps) {
  if (milestones.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No milestones configured for this order
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {milestones.map((milestone, index) => (
        <Card key={milestone.id} data-testid={`milestone-${index}`}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <CardTitle className="text-lg">
                    Milestone {milestone.milestoneIndex + 1}
                  </CardTitle>
                  <MilestoneStatusBadge status={milestone.escrowStatus} />
                </div>
                <CardDescription>{milestone.title}</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${milestone.amount}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{milestone.description}</p>

            {/* Timeline */}
            <div className="flex items-center gap-2 text-sm">
              <MilestoneIcon status={milestone.escrowStatus} />
              <span className="text-muted-foreground">
                {getMilestoneStatusText(milestone)}
              </span>
            </div>

            {/* Actions */}
            {userType === 'builder' && milestone.escrowStatus === 'pending' && (
              <Button
                onClick={() => onSubmit(milestone.milestoneIndex)}
                disabled={isSubmitting}
                className="w-full md:w-auto"
                data-testid={`button-submit-milestone-${index}`}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isSubmitting ? "Submitting..." : "Submit for Approval"}
              </Button>
            )}

            {userType === 'client' && milestone.escrowStatus === 'submitted' && (
              <div className="flex flex-col md:flex-row gap-2">
                <Button
                  onClick={() => onApprove(milestone.milestoneIndex)}
                  disabled={isApproving}
                  className="flex-1"
                  data-testid={`button-approve-milestone-${index}`}
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  {isApproving ? "Approving..." : "Approve & Release Payment"}
                </Button>
              </div>
            )}

            {milestone.escrowStatus === 'paid' && milestone.paidAt && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  Payment released {formatDistanceToNow(new Date(milestone.paidAt), { addSuffix: true })}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function MilestoneStatusBadge({ status }: { status: string }) {
  const variants: Record<string, any> = {
    pending: 'secondary',
    submitted: 'default',
    approved: 'default',
    paid: 'success',
    disputed: 'destructive',
  };

  return (
    <Badge variant={variants[status] || 'secondary'} data-testid={`badge-milestone-${status}`}>
      {status}
    </Badge>
  );
}

function MilestoneIcon({ status }: { status: string }) {
  switch (status) {
    case 'paid':
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case 'submitted':
    case 'approved':
      return <Clock className="h-4 w-4 text-blue-600" />;
    case 'disputed':
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
}

function getMilestoneStatusText(milestone: Milestone): string {
  switch (milestone.escrowStatus) {
    case 'pending':
      return 'Waiting for builder to submit deliverable';
    case 'submitted':
      return milestone.submittedAt
        ? `Submitted ${formatDistanceToNow(new Date(milestone.submittedAt), { addSuffix: true })}`
        : 'Submitted, waiting for client approval';
    case 'approved':
      return 'Approved, payment processing';
    case 'paid':
      return 'Payment completed';
    case 'disputed':
      return 'Under dispute';
    default:
      return 'Unknown status';
  }
}
