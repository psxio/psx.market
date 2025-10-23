import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Transaction {
  id: string;
  transactionType: string;
  amount: string;
  txHash: string;
  fromAddress: string | null;
  toAddress: string | null;
  status: string;
  createdAt: string;
  confirmedAt: string | null;
  blockNumber: number | null;
}

interface TransactionHistoryProps {
  orderId: string;
}

export function TransactionHistory({ orderId }: TransactionHistoryProps) {
  const { data: transactionsData, isLoading } = useQuery({
    queryKey: ['/api/escrow', orderId, 'transactions'],
    enabled: !!orderId,
  });

  const transactions: Transaction[] = transactionsData?.transactions || [];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Clock className="h-6 w-6 animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading transactions...</p>
        </CardContent>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No blockchain transactions yet
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blockchain Transactions</CardTitle>
        <CardDescription>
          All on-chain transactions for this escrow order
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {transactions.map((tx) => (
          <div
            key={tx.id}
            className="border rounded-lg p-4 space-y-3"
            data-testid={`transaction-${tx.id}`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <TransactionIcon type={tx.transactionType} />
                  <span className="font-semibold capitalize">
                    {tx.transactionType.replace(/_/g, ' ')}
                  </span>
                  <TransactionStatusBadge status={tx.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(tx.createdAt), { addSuffix: true })}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">${tx.amount}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {tx.fromAddress && (
                <div>
                  <span className="text-muted-foreground">From:</span>
                  <p className="font-mono break-all">
                    {tx.fromAddress.slice(0, 10)}...{tx.fromAddress.slice(-8)}
                  </p>
                </div>
              )}
              {tx.toAddress && (
                <div>
                  <span className="text-muted-foreground">To:</span>
                  <p className="font-mono break-all">
                    {tx.toAddress.slice(0, 10)}...{tx.toAddress.slice(-8)}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <a
                href={`https://basescan.org/tx/${tx.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                data-testid={`link-view-tx-${tx.id}`}
              >
                View on BaseScan
                <ExternalLink className="h-3 w-3" />
              </a>
              {tx.blockNumber && (
                <span className="text-xs text-muted-foreground">
                  Block #{tx.blockNumber.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TransactionIcon({ type }: { type: string }) {
  if (type.includes('approved') || type.includes('paid')) {
    return <CheckCircle2 className="h-4 w-4 text-green-600" />;
  }
  if (type.includes('dispute') || type.includes('refund')) {
    return <XCircle className="h-4 w-4 text-red-600" />;
  }
  return <Clock className="h-4 w-4 text-blue-600" />;
}

function TransactionStatusBadge({ status }: { status: string }) {
  const variants: Record<string, any> = {
    pending: 'secondary',
    confirmed: 'success',
    failed: 'destructive',
  };

  return (
    <Badge variant={variants[status] || 'secondary'} data-testid={`badge-tx-status-${status}`}>
      {status}
    </Badge>
  );
}
