import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, 
  UserPlus, 
  Briefcase, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Star,
  Activity,
  Shield,
  CheckCircle2,
  AlertCircle,
  Clock,
  Package,
  Award,
  Target,
  Zap,
  Settings,
  UserCheck,
  FileCheck,
  Plus,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";

interface ActivityItem {
  id: string;
  type: 'order' | 'application' | 'payment' | 'review';
  action: string;
  timestamp: string;
  data: any;
}

interface DashboardStats {
  stats: {
    totalBuilders: number;
    totalClients: number;
    activeServices: number;
    totalOrders: number;
    pendingApplications: number;
    totalRevenue: string;
    platformFees: string;
    averageOrderValue: string;
    completedOrders: number;
    activeOrders: number;
    averageRating: string;
  };
  growth: {
    orders: number;
    revenue: number;
  };
  chartData: Array<{
    date: string;
    orders: number;
    revenue: number;
    newBuilders: number;
    newClients: number;
  }>;
}

interface TopPerformer {
  id: string;
  name: string;
  profileImage: string | null;
  category: string;
  revenue: number;
  ordersCount: number;
  completedOrders: number;
  rating: number;
  reviewCount: number;
}

interface TopPerformers {
  topByRevenue: TopPerformer[];
  topByRating: TopPerformer[];
  topByOrders: TopPerformer[];
}

interface ConversionStage {
  stage: string;
  count: number;
  percentage: number;
}

interface PlatformHealth {
  score: number;
  status: 'excellent' | 'good' | 'fair' | 'critical';
  metrics: {
    activeOrders: number;
    recentActivity: number;
    failedPayments: number;
    pendingApplications: number;
    verifiedBuilders: number;
    totalBuilders: number;
  };
}

export default function AdminHome() {
  const [timePeriod, setTimePeriod] = useState('7');

  const { data: activities, isLoading: activitiesLoading } = useQuery<ActivityItem[]>({
    queryKey: ['/api/admin/analytics/activity-feed'],
  });

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/analytics/dashboard', timePeriod],
    queryFn: async () => {
      const res = await fetch(`/api/admin/analytics/dashboard?period=${timePeriod}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to fetch dashboard data');
      return res.json();
    },
  });

  const { data: topPerformers, isLoading: performersLoading } = useQuery<TopPerformers>({
    queryKey: ['/api/admin/analytics/top-performers'],
  });

  const { data: conversionFunnel, isLoading: funnelLoading } = useQuery<ConversionStage[]>({
    queryKey: ['/api/admin/analytics/conversion-funnel'],
  });

  const { data: platformHealth, isLoading: healthLoading } = useQuery<PlatformHealth>({
    queryKey: ['/api/admin/analytics/platform-health'],
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart className="h-4 w-4" />;
      case 'application': return <FileText className="h-4 w-4" />;
      case 'payment': return <DollarSign className="h-4 w-4" />;
      case 'review': return <Star className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'order': return 'from-blue-500 to-blue-600';
      case 'application': return 'from-purple-500 to-purple-600';
      case 'payment': return 'from-green-500 to-green-600';
      case 'review': return 'from-yellow-500 to-yellow-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'from-green-500 to-green-600';
      case 'good': return 'from-blue-500 to-blue-600';
      case 'fair': return 'from-yellow-500 to-yellow-600';
      case 'critical': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'excellent': return <CheckCircle2 className="h-5 w-5 text-white" />;
      case 'good': return <Shield className="h-5 w-5 text-white" />;
      case 'fair': return <AlertCircle className="h-5 w-5 text-white" />;
      case 'critical': return <AlertCircle className="h-5 w-5 text-white" />;
      default: return <Activity className="h-5 w-5 text-white" />;
    }
  };

  if (dashboardLoading || healthLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats;
  const growth = dashboardData?.growth;
  const chartData = dashboardData?.chartData || [];

  return (
    <div className="space-y-6" data-testid="admin-dashboard">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Analytics</h2>
          <p className="text-muted-foreground">
            Comprehensive platform insights and metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={timePeriod} onValueChange={setTimePeriod}>
            <TabsList>
              <TabsTrigger value="7" data-testid="filter-7days">7 Days</TabsTrigger>
              <TabsTrigger value="30" data-testid="filter-30days">30 Days</TabsTrigger>
              <TabsTrigger value="90" data-testid="filter-90days">90 Days</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Platform Health Score */}
      {platformHealth && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Platform Health</CardTitle>
                <CardDescription>Overall system health and status</CardDescription>
              </div>
              <div className={`h-16 w-16 rounded-full bg-gradient-to-br ${getHealthColor(platformHealth.status)} flex items-center justify-center`}>
                {getHealthIcon(platformHealth.status)}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold">{platformHealth.score}</div>
                <div className="flex-1">
                  <div className="h-4 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getHealthColor(platformHealth.status)} transition-all`}
                      style={{ width: `${platformHealth.score}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 capitalize">
                    Status: {platformHealth.status}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Active Orders</p>
                  <p className="text-2xl font-semibold">{platformHealth.metrics.activeOrders}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Recent Activity</p>
                  <p className="text-2xl font-semibold">{platformHealth.metrics.recentActivity}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Failed Payments</p>
                  <p className="text-2xl font-semibold">{platformHealth.metrics.failedPayments}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Apps</p>
                  <p className="text-2xl font-semibold">{platformHealth.metrics.pendingApplications}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Verified Builders</p>
                  <p className="text-2xl font-semibold">{platformHealth.metrics.verifiedBuilders}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Builders</p>
                  <p className="text-2xl font-semibold">{platformHealth.metrics.totalBuilders}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2" data-testid="action-create-builder">
              <Link href="/admin/builders">
                <UserPlus className="h-5 w-5" />
                <span className="text-sm">Add Builder</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2" data-testid="action-review-applications">
              <Link href="/admin/applications">
                <FileCheck className="h-5 w-5" />
                <span className="text-sm">Review Apps</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2" data-testid="action-manage-services">
              <Link href="/admin/services">
                <Package className="h-5 w-5" />
                <span className="text-sm">Manage Services</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto py-4 flex-col gap-2" data-testid="action-create-invite">
              <Link href="/admin/builder-invites">
                <Plus className="h-5 w-5" />
                <span className="text-sm">Create Invite</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics with Growth */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total-revenue">${stats?.totalRevenue}</div>
            {growth && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {growth.revenue >= 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">+{growth.revenue.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-red-500" />
                    <span className="text-red-500">{growth.revenue.toFixed(1)}%</span>
                  </>
                )}
                <span>from last period</span>
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <ShoppingCart className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total-orders">{stats?.totalOrders}</div>
            {growth && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {growth.orders >= 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-green-500">+{growth.orders.toFixed(1)}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-3 w-3 text-red-500" />
                    <span className="text-red-500">{growth.orders.toFixed(1)}%</span>
                  </>
                )}
                <span>from last period</span>
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Builders</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-total-builders">{stats?.totalBuilders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.activeServices} active services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="stat-platform-fees">${stats?.platformFees}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Avg order: ${stats?.averageOrderValue}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalClients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Orders</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingApplications}</div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Orders Trend</CardTitle>
            <CardDescription>Daily performance over selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis yAxisId="left" fontSize={12} />
                <YAxis yAxisId="right" orientation="right" fontSize={12} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: any) => [value, '']}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue ($)"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New builders and clients over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis fontSize={12} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Legend />
                <Bar dataKey="newBuilders" name="New Builders" fill="#a855f7" />
                <Bar dataKey="newClients" name="New Clients" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers & Conversion Funnel */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performers
            </CardTitle>
            <CardDescription>Leading builders by different metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="revenue">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="revenue" data-testid="tab-top-revenue">Revenue</TabsTrigger>
                <TabsTrigger value="rating" data-testid="tab-top-rating">Rating</TabsTrigger>
                <TabsTrigger value="orders" data-testid="tab-top-orders">Orders</TabsTrigger>
              </TabsList>
              
              <TabsContent value="revenue" className="space-y-3 mt-4">
                {!performersLoading && topPerformers?.topByRevenue.map((builder, index) => (
                  <div key={builder.id} className="flex items-center gap-3 p-2 rounded-lg hover-elevate" data-testid={`top-revenue-${index}`}>
                    <div className="text-lg font-bold text-muted-foreground w-6">#{index + 1}</div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={builder.profileImage || undefined} />
                      <AvatarFallback>{builder.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{builder.name}</p>
                      <p className="text-sm text-muted-foreground">{builder.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">${builder.revenue.toFixed(0)}</p>
                      <p className="text-xs text-muted-foreground">{builder.completedOrders} orders</p>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="rating" className="space-y-3 mt-4">
                {!performersLoading && topPerformers?.topByRating.map((builder, index) => (
                  <div key={builder.id} className="flex items-center gap-3 p-2 rounded-lg hover-elevate" data-testid={`top-rating-${index}`}>
                    <div className="text-lg font-bold text-muted-foreground w-6">#{index + 1}</div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={builder.profileImage || undefined} />
                      <AvatarFallback>{builder.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{builder.name}</p>
                      <p className="text-sm text-muted-foreground">{builder.category}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <p className="font-semibold">{builder.rating.toFixed(1)}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{builder.reviewCount} reviews</p>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="orders" className="space-y-3 mt-4">
                {!performersLoading && topPerformers?.topByOrders.map((builder, index) => (
                  <div key={builder.id} className="flex items-center gap-3 p-2 rounded-lg hover-elevate" data-testid={`top-orders-${index}`}>
                    <div className="text-lg font-bold text-muted-foreground w-6">#{index + 1}</div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={builder.profileImage || undefined} />
                      <AvatarFallback>{builder.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{builder.name}</p>
                      <p className="text-sm text-muted-foreground">{builder.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-blue-600">{builder.completedOrders}</p>
                      <p className="text-xs text-muted-foreground">completed</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Conversion Funnel
            </CardTitle>
            <CardDescription>Builder application to first order journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!funnelLoading && conversionFunnel?.map((stage, index) => (
                <div key={stage.stage} className="space-y-2" data-testid={`funnel-stage-${index}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${
                        index === 0 ? 'from-purple-500 to-purple-600' :
                        index === 1 ? 'from-blue-500 to-blue-600' :
                        index === 2 ? 'from-cyan-500 to-cyan-600' :
                        'from-green-500 to-green-600'
                      } flex items-center justify-center text-white text-sm font-bold`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{stage.stage}</p>
                        <p className="text-sm text-muted-foreground">{stage.count} total</p>
                      </div>
                    </div>
                    <Badge variant={stage.percentage >= 50 ? "default" : "secondary"}>
                      {stage.percentage.toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-cyan-500 transition-all"
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Activity Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Real-time Activity Feed
              </CardTitle>
              <CardDescription>Live stream of platform actions</CardDescription>
            </div>
            <Badge variant="outline" className="animate-pulse">
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {activitiesLoading ? (
                <p className="text-center text-muted-foreground py-8">Loading activities...</p>
              ) : activities && activities.length > 0 ? (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover-elevate"
                    data-testid={`activity-${activity.type}`}
                  >
                    <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${getActivityColor(activity.type)} flex items-center justify-center shrink-0`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">
                        {activity.type === 'order' && `New order: ${activity.data.title}`}
                        {activity.type === 'application' && `Application ${activity.action}: ${activity.data.name}`}
                        {activity.type === 'payment' && `Payment ${activity.action}: $${activity.data.amount}`}
                        {activity.type === 'review' && `New ${activity.data.rating}-star review`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.type === 'order' && `$${activity.data.amount} - ${activity.data.status}`}
                        {activity.type === 'application' && activity.data.category}
                        {activity.type === 'payment' && activity.data.method}
                        {activity.type === 'review' && `by ${activity.data.clientName}`}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground shrink-0">
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No recent activity</p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
