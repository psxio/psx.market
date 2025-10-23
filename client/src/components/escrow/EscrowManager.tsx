import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle2, Clock, Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAccount, useWalletClient } from 'wagmi';
import { ethers } from 'ethers';
import {
  approveMilestoneOnChain,
  submitMilestoneOnChain,
  raiseDisputeOnChain,
  refundOrderOnChain,
  autoApproveMilestoneOnChain,
} from '@/lib/escrowContract';
import { MilestoneTimeline } from './MilestoneTimeline';
import { DisputeInterface } from './DisputeInterface';
import { TransactionHistory } from './TransactionHistory';

interface EscrowManagerProps {
  orderId: string;
  userType: 'client' | 'builder';
  isTestnet?: boolean;
}

export function EscrowManager({ orderId, userType, isTestnet = true }: EscrowManagerProps) {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('milestones');
  
  const getSigner = async () => {
    if (!walletClient) throw new Error("Wallet not connected");
    const provider = new ethers.BrowserProvider(walletClient as any);
    return await provider.getSigner();
  };

  // Fetch order escrow data
  const { data: orderData, isLoading: orderLoading } = useQuery({
    queryKey: ['/api/orders', orderId],
    enabled: !!orderId,
  });

  // Fetch milestones
  const { data: milestonesData, isLoading: milestonesLoading } = useQuery({
    queryKey: ['/api/escrow', orderId, 'milestones'],
    enabled: !!orderId,
  });

  // Fetch disputes
  const { data: disputesData } = useQuery({
    queryKey: ['/api/escrow', orderId, 'disputes'],
    enabled: !!orderId,
  });

  // Sync escrow status
  const syncEscrowMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/escrow/${orderId}/sync`, { isTestnet });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders', orderId] });
      toast({
        title: "Escrow synced",
        description: "On-chain status updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Sync failed",
        description: error.message || "Failed to sync escrow status",
      });
    },
  });

  // Submit milestone
  const submitMilestoneMutation = useMutation({
    mutationFn: async (milestoneIndex: number) => {
      const signer = await getSigner();
      const tx = await submitMilestoneOnChain(signer, orderId, milestoneIndex);
      await tx.wait();
      
      // Log transaction
      await apiRequest('POST', '/api/escrow/transactions', {
        orderId,
        transactionType: 'milestone_submitted',
        amount: milestonesData?.milestones[milestoneIndex]?.amount || '0',
        txHash: tx.hash,
      });
      
      return tx.hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/escrow', orderId, 'milestones'] });
      toast({
        title: "Milestone submitted",
        description: "Waiting for client approval",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: error.message || "Failed to submit milestone",
      });
    },
  });

  // Approve milestone
  const approveMilestoneMutation = useMutation({
    mutationFn: async (milestoneIndex: number) => {
      const signer = await getSigner();
      const tx = await approveMilestoneOnChain(signer, orderId, milestoneIndex);
      await tx.wait();
      
      // Log transaction
      await apiRequest('POST', '/api/escrow/transactions', {
        orderId,
        transactionType: 'milestone_approved',
        amount: milestonesData?.milestones[milestoneIndex]?.amount || '0',
        txHash: tx.hash,
      });
      
      return tx.hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/escrow', orderId, 'milestones'] });
      queryClient.invalidateQueries({ queryKey: ['/api/orders', orderId] });
      toast({
        title: "Milestone approved",
        description: "Payment released to builder",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Approval failed",
        description: error.message || "Failed to approve milestone",
      });
    },
  });

  // Raise dispute
  const raiseDisputeMutation = useMutation({
    mutationFn: async (data: { reason: string; description: string; evidence: string[] }) => {
      const signer = await getSigner();
      
      // Raise on-chain
      const tx = await raiseDisputeOnChain(signer, orderId);
      await tx.wait();
      
      // Create dispute record
      await apiRequest('POST', `/api/escrow/${orderId}/disputes`, {
        initiatedBy: address,
        initiatorType: userType,
        reason: data.reason,
        description: data.description,
        evidence: data.evidence,
      });
      
      return tx.hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders', orderId] });
      queryClient.invalidateQueries({ queryKey: ['/api/escrow', orderId, 'disputes'] });
      toast({
        title: "Dispute raised",
        description: "An admin will review your case",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Dispute failed",
        description: error.message || "Failed to raise dispute",
      });
    },
  });

  // Refund order
  const refundOrderMutation = useMutation({
    mutationFn: async () => {
      const signer = await getSigner();
      const tx = await refundOrderOnChain(signer, orderId);
      await tx.wait();
      
      // Log transaction
      await apiRequest('POST', '/api/escrow/transactions', {
        orderId,
        transactionType: 'refund',
        amount: orderData?.budget || '0',
        txHash: tx.hash,
      });
      
      return tx.hash;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/orders', orderId] });
      toast({
        title: "Order refunded",
        description: "Funds returned to client",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Refund failed",
        description: error.message || "Failed to refund order",
      });
    },
  });

  if (orderLoading || milestonesLoading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex items-center justify-center">
            <Clock className="h-6 w-6 animate-spin mr-2" />
            <span>Loading escrow data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const order = orderData;
  const milestones = milestonesData?.milestones || [];
  const disputes = disputesData?.disputes || [];
  const activeDispute = disputes.find((d: any) => d.status === 'open');

  const escrowProgress = order?.budget 
    ? (parseFloat(order.escrowReleasedAmount || '0') / parseFloat(order.budget)) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Escrow Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Smart Contract Escrow
              </CardTitle>
              <CardDescription>Secure milestone-based payment system</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => syncEscrowMutation.mutate()}
              disabled={syncEscrowMutation.isPending}
              data-testid="button-sync-escrow"
            >
              {syncEscrowMutation.isPending ? "Syncing..." : "Sync Status"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">${order?.budget || '0'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Released</p>
              <p className="text-2xl font-bold text-green-600">
                ${order?.escrowReleasedAmount || '0'}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={
                order?.escrowStatus === 'active' ? 'default' :
                order?.escrowStatus === 'completed' ? 'success' :
                order?.escrowStatus === 'disputed' ? 'destructive' :
                'secondary'
              } data-testid="badge-escrow-status">
                {order?.escrowStatus || 'none'}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{escrowProgress.toFixed(0)}%</span>
            </div>
            <Progress value={escrowProgress} />
          </div>

          {order?.inDispute && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This order is currently in dispute. Milestone payments are frozen.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="milestones" data-testid="tab-milestones">
            Milestones ({milestones.length})
          </TabsTrigger>
          <TabsTrigger value="disputes" data-testid="tab-disputes">
            Disputes ({disputes.length})
          </TabsTrigger>
          <TabsTrigger value="transactions" data-testid="tab-transactions">
            Transactions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="space-y-4">
          <MilestoneTimeline
            milestones={milestones}
            userType={userType}
            onSubmit={(index) => submitMilestoneMutation.mutate(index)}
            onApprove={(index) => approveMilestoneMutation.mutate(index)}
            isSubmitting={submitMilestoneMutation.isPending}
            isApproving={approveMilestoneMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="disputes" className="space-y-4">
          <DisputeInterface
            orderId={orderId}
            disputes={disputes}
            activeDispute={activeDispute}
            userType={userType}
            onRaiseDispute={(data) => raiseDisputeMutation.mutate(data)}
            isRaising={raiseDisputeMutation.isPending}
          />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <TransactionHistory orderId={orderId} />
        </TabsContent>
      </Tabs>

      {/* Actions */}
      {userType === 'client' && !order?.inDispute && order?.escrowStatus === 'active' && (
        <Card>
          <CardHeader>
            <CardTitle>Order Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button
              variant="destructive"
              onClick={() => refundOrderMutation.mutate()}
              disabled={refundOrderMutation.isPending || parseFloat(order?.escrowReleasedAmount || '0') > 0}
              data-testid="button-refund-order"
            >
              {refundOrderMutation.isPending ? "Processing..." : "Refund Order"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
