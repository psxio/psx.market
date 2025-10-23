import { useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Clock, Package, Mail, ArrowRight, MessageCircle, FileText } from "lucide-react";
import { OrderTimeline } from "@/components/OrderTimeline";
import type { Order } from "@shared/schema";

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();

  const { data: order, isLoading, isError } = useQuery<Order>({
    queryKey: ["/api/orders", id],
    enabled: !!id,
  });

  useEffect(() => {
    if (order) {
      document.title = `Order Confirmation - Create.psx`;
    }
  }, [order]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="rounded-full bg-destructive/10 p-3 mb-4">
                <Package className="h-12 w-12 text-destructive" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
              <p className="text-muted-foreground mb-6 text-center">
                We couldn't find the order you're looking for.
              </p>
              <Link href="/dashboard">
                <Button data-testid="button-view-orders">
                  View My Orders
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    in_progress: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    delivered: "bg-green-500/10 text-green-500 border-green-500/20",
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        <div className="space-y-6">
          <div className="text-center space-y-3 fadeInUp">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-500/10 p-4">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold">Order Placed Successfully!</h1>
            <p className="text-muted-foreground text-lg">
              Your order has been submitted and the builder will be notified.
            </p>
          </div>

          <Card className="fadeInUp" style={{ animationDelay: "0.1s" }} data-testid="card-order-details">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-xl sm:text-2xl">{order.title}</CardTitle>
                  <CardDescription className="mt-1">Order ID: {order.id}</CardDescription>
                </div>
                <Badge 
                  className={`${statusColors[order.status] || ''} px-3 py-1 text-sm font-semibold capitalize w-fit`}
                  data-testid="badge-order-status"
                >
                  {order.status.replace('_', ' ')}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    Package Type
                  </div>
                  <p className="text-base font-semibold capitalize" data-testid="text-package-type">
                    {order.packageType}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Estimated Delivery
                  </div>
                  <p className="text-base font-semibold" data-testid="text-delivery-days">
                    {order.deliveryDays} days
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    Budget
                  </div>
                  <p className="text-2xl font-bold text-primary" data-testid="text-budget">
                    ${order.budget}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    Order Date
                  </div>
                  <p className="text-base font-semibold" data-testid="text-created-at">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-muted-foreground">Project Requirements</h3>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm whitespace-pre-wrap" data-testid="text-requirements">
                    {order.requirements}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="fadeInUp" style={{ animationDelay: "0.15s" }}>
            <OrderTimeline
              orderId={order.id}
              status={order.status}
              deliveryDate={new Date(Date.now() + order.deliveryDays * 24 * 60 * 60 * 1000).toISOString()}
            />
          </div>

          <Card className="bg-primary/5 border-primary/20 fadeInUp" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <CardTitle className="text-lg">What Happens Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email Confirmation</p>
                  <p className="text-sm text-muted-foreground">
                    You'll receive an email confirmation with your order details.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                  <MessageCircle className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Builder Review</p>
                  <p className="text-sm text-muted-foreground">
                    The builder will review your requirements and confirm the order.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2 mt-0.5">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Work Begins</p>
                  <p className="text-sm text-muted-foreground">
                    Once confirmed, the builder will start working on your project.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-3 fadeInUp" style={{ animationDelay: "0.3s" }}>
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full" data-testid="button-view-dashboard">
                <ArrowRight className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/messages" className="flex-1">
              <Button className="w-full" data-testid="button-view-messages">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message Builder
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
