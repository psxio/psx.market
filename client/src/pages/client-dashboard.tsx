import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useClientAuth } from "@/hooks/use-client-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/header";
import { User, LogOut, Shield, Wallet, Mail, Building2, Clock, Package, Calendar, ArrowRight } from "lucide-react";
import type { Order } from "@shared/schema";

export default function ClientDashboard() {
  const { client, isAuthenticated, logout, updateProfile } = useClientAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [bio, setBio] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/become-client");
    }
  }, [isAuthenticated, setLocation]);

  useEffect(() => {
    if (client) {
      setName(client.name);
      setEmail(client.email);
      setCompanyName(client.companyName || "");
      setBio(client.bio || "");
    }
  }, [client]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      await updateProfile({
        name,
        email,
        companyName: companyName || undefined,
        bio: bio || undefined,
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  if (!client) {
    return null;
  }

  const tierColors = {
    bronze: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    silver: "bg-gray-400/10 text-gray-400 border-gray-400/20",
    gold: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    platinum: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Client Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Manage your profile and projects
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2"
            data-testid="button-logout"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Profile</CardTitle>
                  {client.verified && (
                    <Badge variant="default" className="gap-1">
                      <Shield className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{client.name}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{client.email}</span>
                  </div>

                  {client.companyName && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{client.companyName}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-sm">
                    <Wallet className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono text-xs text-muted-foreground">
                      {client.walletAddress.slice(0, 6)}...{client.walletAddress.slice(-4)}
                    </span>
                  </div>

                  <div className="pt-2">
                    <Label className="text-xs text-muted-foreground mb-2 block">PSX Tier</Label>
                    <Badge
                      variant="outline"
                      className={`capitalize ${tierColors[client.psxTier as keyof typeof tierColors]}`}
                    >
                      {client.psxTier}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                    <CardDescription>Update your profile information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleUpdateProfile} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          data-testid="input-name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          data-testid="input-email"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          data-testid="input-company"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          rows={4}
                          data-testid="input-bio"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isUpdating}
                        data-testid="button-update"
                      >
                        {isUpdating ? "Updating..." : "Update Profile"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                <OrdersList />
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your recent actions and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No activity yet</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrdersList() {
  const [, setLocation] = useLocation();
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ["/api/clients/me/orders"],
  });

  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    accepted: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    in_progress: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    delivered: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    completed: "bg-green-500/10 text-green-500 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>View and manage your service orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-2">No orders yet</p>
            <p className="text-sm mb-4">Browse the marketplace to find services and place your first order!</p>
            <Button
              variant="default"
              onClick={() => setLocation("/marketplace")}
              data-testid="button-browse-marketplace"
            >
              Browse Marketplace
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Orders</CardTitle>
        <CardDescription>
          {orders.length} order{orders.length !== 1 ? "s" : ""} total
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedOrders.map((order) => (
          <Card key={order.id} className="hover-elevate" data-testid={`card-order-${order.id}`}>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className={statusColors[order.status as keyof typeof statusColors]}
                    >
                      {order.status.replace("_", " ")}
                    </Badge>
                    <Badge variant="secondary" className="capitalize">
                      {order.packageType}
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {order.requirements}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{order.estimatedDelivery}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-primary">${order.price}</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="gap-2 sm:self-center"
                  onClick={() => setLocation(`/order/${order.id}`)}
                  data-testid={`button-view-order-${order.id}`}
                >
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
