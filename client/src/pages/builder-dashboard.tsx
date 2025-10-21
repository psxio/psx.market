import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { NotificationCenter } from "@/components/notification-center";
import { 
  DollarSign, 
  Package, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Edit,
  Plus
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Builder, Order, Service } from "@shared/schema";

export default function BuilderDashboard() {
  const [builderId] = useState("1");

  const { data: builder, isLoading: builderLoading } = useQuery<Builder>({
    queryKey: ["/api/builders", builderId],
  });

  const { data: analytics, isLoading: analyticsLoading } = useQuery<{
    totalEarnings: string;
    availableBalance: string;
    pendingPayouts: string;
    activeOrders: number;
    completedOrders: number;
    successRate: string;
    avgResponseTime: number;
    onTimeDeliveryRate: string;
  }>({
    queryKey: ["/api/builders", builderId, "analytics"],
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ["/api/builders", builderId, "orders"],
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: ["/api/builders", builderId, "services"],
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: async (accepting: boolean) => {
      return apiRequest("PATCH", `/api/builders/${builderId}/availability`, { accepting });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/builders", builderId] });
    },
  });

  const handleAvailabilityToggle = (checked: boolean) => {
    toggleAvailabilityMutation.mutate(checked);
  };

  if (builderLoading || analyticsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!builder || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-lg font-semibold">Builder not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Builder Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {builder.name}</p>
        </div>
        <div className="flex items-center gap-4">
          <NotificationCenter userId={builderId} userType="builder" />
          <div className="flex items-center gap-2">
            <Switch
              id="accepting-orders"
              checked={builder.acceptingOrders}
              onCheckedChange={handleAvailabilityToggle}
              disabled={toggleAvailabilityMutation.isPending}
              data-testid="switch-accepting-orders"
            />
            <Label htmlFor="accepting-orders" className="cursor-pointer">
              {builder.acceptingOrders ? "Accepting Orders" : "Not Accepting Orders"}
            </Label>
          </div>
          <Button variant="outline" size="default" data-testid="button-edit-profile">
            <Edit className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card data-testid="card-total-earnings">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-total-earnings">
              ${analytics.totalEarnings}
            </div>
            <p className="text-xs text-muted-foreground">
              All-time revenue
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-available-balance">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-available-balance">
              ${analytics.availableBalance}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready to withdraw
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-active-orders">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-active-orders">
              {analytics.activeOrders}
            </div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-success-rate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-success-rate">
              {analytics.successRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {analytics.completedOrders} completed
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card data-testid="card-response-time">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-response-time">
              {analytics.avgResponseTime}h
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-delivery-rate">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-delivery-rate">
              {analytics.onTimeDeliveryRate}%
            </div>
          </CardContent>
        </Card>

        <Card data-testid="card-pending-payouts">
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid="text-pending-payouts">
              ${analytics.pendingPayouts}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList data-testid="tabs-builder-dashboard">
          <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
          <TabsTrigger value="services" data-testid="tab-services">Services</TabsTrigger>
          <TabsTrigger value="earnings" data-testid="tab-earnings">Earnings</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Active Orders</h2>
          </div>
          {ordersLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No orders yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id} data-testid={`card-order-${order.id}`}>
                  <CardHeader>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg" data-testid={`text-order-id-${order.id}`}>
                          Order #{order.id.slice(0, 8)}
                        </CardTitle>
                        <CardDescription>
                          Service: {order.serviceId}
                        </CardDescription>
                      </div>
                      <Badge data-testid={`badge-status-${order.id}`}>
                        {order.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="text-sm text-muted-foreground">Package:</span>
                        <span className="text-sm font-medium">{order.packageType}</span>
                      </div>
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="text-sm text-muted-foreground">Amount:</span>
                        <span className="text-sm font-medium">${order.budget}</span>
                      </div>
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="text-sm text-muted-foreground">Created:</span>
                        <span className="text-sm font-medium">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" data-testid={`button-view-order-${order.id}`}>
                        View Details
                      </Button>
                      {order.status === "pending" && (
                        <Button size="sm" variant="outline" data-testid={`button-accept-order-${order.id}`}>
                          Accept Order
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Services</h2>
            <Button data-testid="button-add-service">
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </div>
          {servicesLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : services.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No services listed yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {services.map((service) => (
                <Card key={service.id} data-testid={`card-service-${service.id}`}>
                  <CardHeader>
                    <CardTitle data-testid={`text-service-title-${service.id}`}>
                      {service.title}
                    </CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="text-sm text-muted-foreground">Starting at:</span>
                        <span className="text-sm font-medium">${service.basicPrice}</span>
                      </div>
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="text-sm text-muted-foreground">Delivery:</span>
                        <span className="text-sm font-medium">{service.deliveryTime}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" data-testid={`button-edit-service-${service.id}`}>
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="earnings" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Earnings History</h2>
            <Button variant="outline" data-testid="button-request-payout">
              Request Payout
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>
                Detailed earnings breakdown and payout history will be available here.
              </CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
