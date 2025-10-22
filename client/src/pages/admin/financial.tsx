import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  DollarSign, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  Shield,
  FileText,
  Settings as SettingsIcon,
  Search,
  Filter,
  ChevronDown,
  Wallet,
  CreditCard
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

export default function AdminFinancial() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [paymentFilters, setPaymentFilters] = useState({
    status: "all",
    dateFrom: "",
    dateTo: "",
    builderId: "",
    clientId: "",
  });
  const [transactionFilters, setTransactionFilters] = useState({
    type: "all",
    status: "all",
    search: "",
  });
  const [revenuePeriod, setRevenuePeriod] = useState("30");
  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([]);
  const [feeEditPaymentId, setFeeEditPaymentId] = useState<string | null>(null);
  const [newFeePercentage, setNewFeePercentage] = useState("");

  // Queries
  const { data: revenueAnalytics } = useQuery<{
    period: number;
    totalRevenue: number;
    totalPlatformFees: number;
    totalBuilderPayouts: number;
    totalTransactions: number;
    avgTransactionValue: number;
    dailyData: Array<{
      date: string;
      revenue: number;
      platformFees: number;
      builderPayouts: number;
      transactions: number;
    }>;
  }>({
    queryKey: ["/api/admin/financial/revenue-analytics", revenuePeriod],
    enabled: activeTab === "dashboard",
  });

  const { data: payments = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/financial/payments", paymentFilters],
    enabled: activeTab === "payments",
  });

  const { data: payoutQueue } = useQuery<{
    payouts: any[];
    totalPending: number;
    count: number;
  }>({
    queryKey: ["/api/admin/financial/payout-queue"],
    enabled: activeTab === "payouts",
  });

  const { data: transactions = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/financial/transactions", transactionFilters],
    enabled: activeTab === "transactions",
  });

  const { data: failedPayments = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/financial/failed-payments"],
    enabled: activeTab === "failed",
  });

  const { data: escrowData } = useQuery<{
    payments: any[];
    totalInEscrow: number;
    totalBuilderAmount: number;
    count: number;
  }>({
    queryKey: ["/api/admin/financial/escrow"],
    enabled: activeTab === "escrow",
  });

  const { data: platformFees } = useQuery<{
    fees: any[];
    totalFees: number;
    avgFeePercentage: number;
    totalPayments: number;
  }>({
    queryKey: ["/api/admin/financial/platform-fees"],
    enabled: activeTab === "fees",
  });

  // Mutations
  const processPayoutsMutation = useMutation({
    mutationFn: async (payoutIds: string[]) => {
      const response = await fetch("/api/admin/financial/process-payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payoutIds }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to process payouts");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/financial/payout-queue"] });
      toast({
        title: "Payouts Processing",
        description: "Selected payouts are being processed",
      });
      setSelectedPayouts([]);
    },
  });

  const retryPaymentMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      const response = await fetch(`/api/admin/financial/retry-payment/${paymentId}`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to retry payment");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/financial/failed-payments"] });
      toast({
        title: "Payment Retry Initiated",
        description: "The failed payment has been queued for retry",
      });
    },
  });

  const adjustFeeMutation = useMutation({
    mutationFn: async ({ paymentId, feePercentage }: { paymentId: string; feePercentage: number }) => {
      const response = await fetch(`/api/admin/financial/adjust-fee/${paymentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platformFeePercentage: feePercentage }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to adjust fee");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/financial/platform-fees"] });
      toast({
        title: "Fee Adjusted",
        description: "Platform fee has been updated",
      });
      setFeeEditPaymentId(null);
      setNewFeePercentage("");
    },
  });

  const downloadReportMutation = useMutation({
    mutationFn: async (format: "json" | "csv") => {
      const params = new URLSearchParams({ format });
      if (paymentFilters.dateFrom) params.append("dateFrom", paymentFilters.dateFrom);
      if (paymentFilters.dateTo) params.append("dateTo", paymentFilters.dateTo);
      
      const response = await fetch(`/api/admin/financial/reports?${params}`);
      
      if (format === "csv") {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `financial-report-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const data = await response.json();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `financial-report-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    },
    onSuccess: () => {
      toast({
        title: "Report Downloaded",
        description: "Financial report has been downloaded",
      });
    },
  });

  const formatCurrency = (amount: number | string) => {
    const num = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(num);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      pending: "secondary",
      failed: "destructive",
      processing: "outline",
      escrowed: "secondary",
    };

    return (
      <Badge variant={variants[status] || "secondary"} data-testid={`badge-status-${status}`}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Financial Management</h1>
          <p className="text-muted-foreground">Manage platform finances, payouts, and revenue analytics</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/admin/financial"] })}
            data-testid="button-refresh"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button
            onClick={() => downloadReportMutation.mutate("csv")}
            disabled={downloadReportMutation.isPending}
            data-testid="button-export-csv"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="dashboard" data-testid="tab-dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="payments" data-testid="tab-payments">Payments</TabsTrigger>
          <TabsTrigger value="payouts" data-testid="tab-payouts">Payouts</TabsTrigger>
          <TabsTrigger value="transactions" data-testid="tab-transactions">Transactions</TabsTrigger>
          <TabsTrigger value="escrow" data-testid="tab-escrow">Escrow</TabsTrigger>
          <TabsTrigger value="fees" data-testid="tab-fees">Fees</TabsTrigger>
          <TabsTrigger value="failed" data-testid="tab-failed">Failed</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-total-revenue">
                  {formatCurrency(revenueAnalytics?.totalRevenue || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Last {revenuePeriod} days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-platform-fees">
                  {formatCurrency(revenueAnalytics?.totalPlatformFees || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {revenueAnalytics?.totalTransactions || 0} transactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Builder Payouts</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-builder-payouts">
                  {formatCurrency(revenueAnalytics?.totalBuilderPayouts || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Paid to builders
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="text-avg-transaction">
                  {formatCurrency(revenueAnalytics?.avgTransactionValue || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Per transaction
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Period Selector */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>Track platform revenue over time</CardDescription>
                </div>
                <Select value={revenuePeriod} onValueChange={setRevenuePeriod}>
                  <SelectTrigger className="w-[180px]" data-testid="select-revenue-period">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueAnalytics?.dailyData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => formatCurrency(value)}
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.6}
                    name="Total Revenue"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="platformFees" 
                    stroke="hsl(var(--accent))" 
                    fill="hsl(var(--accent))" 
                    fillOpacity={0.6}
                    name="Platform Fees"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Transaction Volume Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Volume</CardTitle>
              <CardDescription>Daily transaction count</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={revenueAnalytics?.dailyData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  />
                  <YAxis />
                  <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
                  <Bar dataKey="transactions" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Dashboard</CardTitle>
              <CardDescription>View and filter all platform payments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label>Status</Label>
                  <Select 
                    value={paymentFilters.status} 
                    onValueChange={(value) => setPaymentFilters({ ...paymentFilters, status: value })}
                  >
                    <SelectTrigger data-testid="select-payment-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="escrowed">Escrowed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Date From</Label>
                  <Input 
                    type="date" 
                    value={paymentFilters.dateFrom}
                    onChange={(e) => setPaymentFilters({ ...paymentFilters, dateFrom: e.target.value })}
                    data-testid="input-date-from"
                  />
                </div>

                <div>
                  <Label>Date To</Label>
                  <Input 
                    type="date" 
                    value={paymentFilters.dateTo}
                    onChange={(e) => setPaymentFilters({ ...paymentFilters, dateTo: e.target.value })}
                    data-testid="input-date-to"
                  />
                </div>

                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setPaymentFilters({ status: "all", dateFrom: "", dateTo: "", builderId: "", clientId: "" })}
                    data-testid="button-clear-filters"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              </div>

              {/* Payments Table */}
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Builder</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Platform Fee</TableHead>
                      <TableHead>Builder Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>TX Hash</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {payments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center text-muted-foreground">
                          No payments found
                        </TableCell>
                      </TableRow>
                    ) : (
                      payments.map((payment: any) => (
                        <TableRow key={payment.id} data-testid={`row-payment-${payment.id}`}>
                          <TableCell className="font-medium">
                            {payment.orderTitle || payment.orderId.slice(0, 8)}
                          </TableCell>
                          <TableCell>{payment.clientName || "Unknown"}</TableCell>
                          <TableCell>{payment.builderName || "Unknown"}</TableCell>
                          <TableCell>{formatCurrency(payment.amount)}</TableCell>
                          <TableCell>{formatCurrency(payment.platformFee)}</TableCell>
                          <TableCell>{formatCurrency(payment.builderAmount)}</TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell className="text-xs">{formatDate(payment.createdAt)}</TableCell>
                          <TableCell>
                            {payment.transactionHash ? (
                              <code className="text-xs bg-muted px-1 rounded">
                                {payment.transactionHash.slice(0, 10)}...
                              </code>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Payout Queue</CardTitle>
                  <CardDescription>
                    {payoutQueue?.count || 0} pending payouts totaling {formatCurrency(payoutQueue?.totalPending || 0)}
                  </CardDescription>
                </div>
                <Button
                  onClick={() => processPayoutsMutation.mutate(selectedPayouts)}
                  disabled={selectedPayouts.length === 0 || processPayoutsMutation.isPending}
                  data-testid="button-process-payouts"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Process {selectedPayouts.length} Payout{selectedPayouts.length !== 1 ? "s" : ""}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedPayouts.length === (payoutQueue?.payouts?.length || 0)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPayouts(payoutQueue?.payouts?.map((p: any) => p.id) || []);
                            } else {
                              setSelectedPayouts([]);
                            }
                          }}
                          data-testid="checkbox-select-all-payouts"
                        />
                      </TableHead>
                      <TableHead>Builder</TableHead>
                      <TableHead>Wallet</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Currency</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!payoutQueue?.payouts || payoutQueue.payouts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          No pending payouts
                        </TableCell>
                      </TableRow>
                    ) : (
                      payoutQueue.payouts.map((payout: any) => (
                        <TableRow key={payout.id} data-testid={`row-payout-${payout.id}`}>
                          <TableCell>
                            <Checkbox
                              checked={selectedPayouts.includes(payout.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedPayouts([...selectedPayouts, payout.id]);
                                } else {
                                  setSelectedPayouts(selectedPayouts.filter(id => id !== payout.id));
                                }
                              }}
                              data-testid={`checkbox-payout-${payout.id}`}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{payout.builderName || "Unknown"}</TableCell>
                          <TableCell>
                            <code className="text-xs bg-muted px-1 rounded">
                              {payout.builderWallet.slice(0, 6)}...{payout.builderWallet.slice(-4)}
                            </code>
                          </TableCell>
                          <TableCell>{formatCurrency(payout.amount)}</TableCell>
                          <TableCell>{payout.currency}</TableCell>
                          <TableCell>{getStatusBadge(payout.status)}</TableCell>
                          <TableCell className="text-xs">{formatDate(payout.createdAt)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>Complete history of all blockchain transactions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Type</Label>
                  <Select 
                    value={transactionFilters.type} 
                    onValueChange={(value) => setTransactionFilters({ ...transactionFilters, type: value })}
                  >
                    <SelectTrigger data-testid="select-transaction-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="payment">Payments</SelectItem>
                      <SelectItem value="payout">Payouts</SelectItem>
                      <SelectItem value="refund">Refunds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Status</Label>
                  <Select 
                    value={transactionFilters.status} 
                    onValueChange={(value) => setTransactionFilters({ ...transactionFilters, status: value })}
                  >
                    <SelectTrigger data-testid="select-transaction-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="TX hash, name..." 
                      value={transactionFilters.search}
                      onChange={(e) => setTransactionFilters({ ...transactionFilters, search: e.target.value })}
                      className="pl-9"
                      data-testid="input-search-transactions"
                    />
                  </div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>TX Hash</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          No transactions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      transactions.map((tx: any) => (
                        <TableRow key={tx.id} data-testid={`row-transaction-${tx.id}`}>
                          <TableCell>
                            <Badge variant="outline">{tx.type}</Badge>
                          </TableCell>
                          <TableCell>{tx.fromName || "-"}</TableCell>
                          <TableCell>{tx.toName || "-"}</TableCell>
                          <TableCell>{formatCurrency(tx.amount)}</TableCell>
                          <TableCell>{getStatusBadge(tx.status)}</TableCell>
                          <TableCell>
                            {tx.transactionHash ? (
                              <code className="text-xs bg-muted px-1 rounded">
                                {tx.transactionHash.slice(0, 10)}...
                              </code>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-xs">{formatDate(tx.createdAt)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Escrow Tab */}
        <TabsContent value="escrow" className="space-y-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Escrow Monitoring</CardTitle>
                <CardDescription>
                  {escrowData?.count || 0} payments in escrow totaling {formatCurrency(escrowData?.totalInEscrow || 0)}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total in Escrow</CardTitle>
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(escrowData?.totalInEscrow || 0)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Builder Amount</CardTitle>
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(escrowData?.totalBuilderAmount || 0)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Payments Count</CardTitle>
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {escrowData?.count || 0}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Builder</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Order Status</TableHead>
                        <TableHead>Escrow Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!escrowData?.payments || escrowData.payments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            No payments in escrow
                          </TableCell>
                        </TableRow>
                      ) : (
                        escrowData.payments.map((payment: any) => (
                          <TableRow key={payment.id} data-testid={`row-escrow-${payment.id}`}>
                            <TableCell className="font-medium">
                              {payment.orderTitle || payment.orderId.slice(0, 8)}
                            </TableCell>
                            <TableCell>{payment.clientName || "Unknown"}</TableCell>
                            <TableCell>{payment.builderName || "Unknown"}</TableCell>
                            <TableCell>{formatCurrency(payment.amount)}</TableCell>
                            <TableCell>{getStatusBadge(payment.status)}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{payment.orderStatus || "Unknown"}</Badge>
                            </TableCell>
                            <TableCell className="text-xs">{formatDate(payment.createdAt)}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platform Fees Tab */}
        <TabsContent value="fees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Fee Manager</CardTitle>
              <CardDescription>
                Total fees collected: {formatCurrency(platformFees?.totalFees || 0)} from {platformFees?.totalPayments || 0} payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Platform Fees</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {formatCurrency(platformFees?.totalFees || 0)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Average Fee %</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {platformFees?.avgFeePercentage?.toFixed(2) || "0"}%
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Payment ID</TableHead>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Platform Fee</TableHead>
                        <TableHead>Fee %</TableHead>
                        <TableHead>Paid At</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {!platformFees?.fees || platformFees.fees.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground">
                            No fee data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        platformFees.fees.map((fee: any) => (
                          <TableRow key={fee.paymentId} data-testid={`row-fee-${fee.paymentId}`}>
                            <TableCell>
                              <code className="text-xs bg-muted px-1 rounded">
                                {fee.paymentId.slice(0, 8)}
                              </code>
                            </TableCell>
                            <TableCell>
                              <code className="text-xs bg-muted px-1 rounded">
                                {fee.orderId.slice(0, 8)}
                              </code>
                            </TableCell>
                            <TableCell>{formatCurrency(fee.amount)}</TableCell>
                            <TableCell>{formatCurrency(fee.platformFee)}</TableCell>
                            <TableCell>
                              {feeEditPaymentId === fee.paymentId ? (
                                <Input
                                  type="number"
                                  step="0.1"
                                  min="0"
                                  max="100"
                                  value={newFeePercentage}
                                  onChange={(e) => setNewFeePercentage(e.target.value)}
                                  className="w-20"
                                  data-testid="input-new-fee-percentage"
                                />
                              ) : (
                                `${parseFloat(fee.platformFeePercentage).toFixed(2)}%`
                              )}
                            </TableCell>
                            <TableCell className="text-xs">
                              {fee.paidAt ? formatDate(fee.paidAt) : "-"}
                            </TableCell>
                            <TableCell>
                              {feeEditPaymentId === fee.paymentId ? (
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      adjustFeeMutation.mutate({
                                        paymentId: fee.paymentId,
                                        feePercentage: parseFloat(newFeePercentage),
                                      });
                                    }}
                                    disabled={adjustFeeMutation.isPending}
                                    data-testid="button-save-fee"
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setFeeEditPaymentId(null);
                                      setNewFeePercentage("");
                                    }}
                                    data-testid="button-cancel-fee-edit"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setFeeEditPaymentId(fee.paymentId);
                                    setNewFeePercentage(fee.platformFeePercentage);
                                  }}
                                  data-testid={`button-edit-fee-${fee.paymentId}`}
                                >
                                  <SettingsIcon className="w-3 h-3" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Failed Payments Tab */}
        <TabsContent value="failed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Failed Payment Recovery</CardTitle>
              <CardDescription>
                {failedPayments.length} failed payment{failedPayments.length !== 1 ? "s" : ""} requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Builder</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Failed At</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {failedPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No failed payments
                        </TableCell>
                      </TableRow>
                    ) : (
                      failedPayments.map((payment: any) => (
                        <TableRow key={payment.id} data-testid={`row-failed-${payment.id}`}>
                          <TableCell className="font-medium">
                            {payment.orderTitle || payment.orderId.slice(0, 8)}
                          </TableCell>
                          <TableCell>{payment.clientName || "Unknown"}</TableCell>
                          <TableCell>{payment.builderName || "Unknown"}</TableCell>
                          <TableCell>{formatCurrency(payment.amount)}</TableCell>
                          <TableCell className="text-xs">{formatDate(payment.updatedAt)}</TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => retryPaymentMutation.mutate(payment.id)}
                              disabled={retryPaymentMutation.isPending}
                              data-testid={`button-retry-${payment.id}`}
                            >
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Retry
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
