import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, MessageSquare, Shield } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Dispute {
  id: string;
  reason: string;
  description: string;
  initiatedBy: string;
  initiatorType: string;
  status: string;
  outcome: string | null;
  createdAt: string;
  resolvedAt: string | null;
  resolutionNotes: string | null;
}

interface DisputeInterfaceProps {
  orderId: string;
  disputes: Dispute[];
  activeDispute: Dispute | null;
  userType: 'client' | 'builder';
  onRaiseDispute: (data: { reason: string; description: string; evidence: string[] }) => void;
  isRaising: boolean;
}

export function DisputeInterface({
  disputes,
  activeDispute,
  userType,
  onRaiseDispute,
  isRaising,
}: DisputeInterfaceProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!reason.trim() || !description.trim()) return;

    onRaiseDispute({
      reason: reason.trim(),
      description: description.trim(),
      evidence: [],
    });

    setReason('');
    setDescription('');
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      {activeDispute ? (
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <CardTitle>Active Dispute</CardTitle>
            </div>
            <CardDescription>
              Raised {formatDistanceToNow(new Date(activeDispute.createdAt), { addSuffix: true })}
              {' by '}
              {activeDispute.initiatorType}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Reason</Label>
              <p className="text-sm text-muted-foreground mt-1">{activeDispute.reason}</p>
            </div>
            <div>
              <Label className="text-sm font-semibold">Description</Label>
              <p className="text-sm text-muted-foreground mt-1">{activeDispute.description}</p>
            </div>
            <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
              <Shield className="h-4 w-4 text-blue-600" />
              <p className="text-sm">
                An admin is reviewing this dispute. You will be notified of the resolution.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Dispute Resolution</CardTitle>
            <CardDescription>
              Raise a dispute if you have concerns about this order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" data-testid="button-raise-dispute">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Raise Dispute
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Raise a Dispute</DialogTitle>
                  <DialogDescription>
                    Explain the issue and an admin will review your case
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason</Label>
                    <Textarea
                      id="reason"
                      placeholder="Brief summary of the issue"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows={2}
                      data-testid="input-dispute-reason"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Detailed Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide detailed information about the dispute"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={6}
                      data-testid="input-dispute-description"
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
                    variant="destructive"
                    onClick={handleSubmit}
                    disabled={!reason.trim() || !description.trim() || isRaising}
                    data-testid="button-submit-dispute"
                  >
                    {isRaising ? "Submitting..." : "Submit Dispute"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}

      {/* Dispute History */}
      {disputes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Dispute History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {disputes.map((dispute) => (
              <div
                key={dispute.id}
                className="border rounded-lg p-4 space-y-2"
                data-testid={`dispute-${dispute.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-sm">{dispute.reason}</span>
                  </div>
                  <Badge
                    variant={dispute.status === 'resolved' ? 'success' : 'default'}
                    data-testid={`badge-dispute-status-${dispute.id}`}
                  >
                    {dispute.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{dispute.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>
                    Raised {formatDistanceToNow(new Date(dispute.createdAt), { addSuffix: true })}
                  </span>
                  {dispute.resolvedAt && (
                    <span>
                      Resolved {formatDistanceToNow(new Date(dispute.resolvedAt), { addSuffix: true })}
                    </span>
                  )}
                </div>
                {dispute.outcome && (
                  <div className="mt-2 p-2 bg-muted rounded">
                    <Label className="text-xs font-semibold">Outcome</Label>
                    <p className="text-xs text-muted-foreground mt-1">{dispute.outcome}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
