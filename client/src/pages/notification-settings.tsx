import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Bell, Mail, Smartphone, Check, X } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useClientAuth } from "@/hooks/use-client-auth";
import type { NotificationPreferences } from "@shared/schema";

export default function NotificationSettings() {
  const { client } = useClientAuth();
  const { toast } = useToast();
  const [pushSupported, setPushSupported] = useState(false);
  const [pushPermission, setPushPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      setPushSupported(true);
      setPushPermission(Notification.permission);
    }
  }, []);

  const { data: preferences, isLoading } = useQuery<NotificationPreferences>({
    queryKey: ["/api/notification-preferences", "client", client?.id],
    queryFn: async () => {
      if (!client) throw new Error("Not authenticated");
      const response = await fetch(`/api/notification-preferences/client/${client.id}`);
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error("Failed to fetch preferences");
      }
      return response.json();
    },
    enabled: !!client,
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: async (data: Partial<NotificationPreferences>) => {
      if (!client) throw new Error("Not authenticated");
      return apiRequest("PUT", `/api/notification-preferences/client/${client.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notification-preferences"] });
      toast({
        title: "Preferences updated",
        description: "Your notification preferences have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update notification preferences.",
        variant: "destructive",
      });
    },
  });

  const handlePreferenceChange = (key: keyof NotificationPreferences, value: boolean) => {
    updatePreferencesMutation.mutate({ [key]: value });
  };

  const requestPushPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "Not supported",
        description: "Push notifications are not supported in this browser.",
        variant: "destructive",
      });
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);
      
      if (permission === "granted") {
        toast({
          title: "Permission granted",
          description: "You will now receive push notifications.",
        });
      } else {
        toast({
          title: "Permission denied",
          description: "You won't receive push notifications.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error requesting push permission:", error);
      toast({
        title: "Error",
        description: "Failed to request notification permission.",
        variant: "destructive",
      });
    }
  };

  if (!client) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
            <p className="text-sm text-muted-foreground">
              Please connect your wallet to manage notification settings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Notification Settings</h1>
        <p className="text-muted-foreground">
          Manage how you receive notifications from create.psx
        </p>
      </div>

      <Card data-testid="card-push-notifications">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Push Notifications
              </CardTitle>
              <CardDescription className="mt-2">
                Receive real-time notifications on your device
              </CardDescription>
            </div>
            {pushSupported && pushPermission === "granted" && (
              <Badge variant="default" className="gap-1">
                <Check className="h-3 w-3" />
                Enabled
              </Badge>
            )}
            {pushSupported && pushPermission === "denied" && (
              <Badge variant="destructive" className="gap-1">
                <X className="h-3 w-3" />
                Blocked
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!pushSupported ? (
            <p className="text-sm text-muted-foreground">
              Push notifications are not supported in this browser.
            </p>
          ) : pushPermission === "default" ? (
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                Enable push notifications to receive instant updates even when you're not browsing.
              </p>
              <Button onClick={requestPushPermission} data-testid="button-enable-push">
                Enable Push Notifications
              </Button>
            </div>
          ) : pushPermission === "denied" ? (
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Push notifications are blocked. To enable them, please update your browser settings.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-orders" className="flex flex-col gap-1 cursor-pointer">
                  <span className="font-medium">Order Updates</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    Status changes, deliveries, and revisions
                  </span>
                </Label>
                <Switch
                  id="push-orders"
                  checked={preferences?.pushOrderUpdates ?? true}
                  onCheckedChange={(value) => handlePreferenceChange("pushOrderUpdates", value)}
                  disabled={updatePreferencesMutation.isPending}
                  data-testid="switch-push-orders"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="push-messages" className="flex flex-col gap-1 cursor-pointer">
                  <span className="font-medium">Messages</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    New messages from builders
                  </span>
                </Label>
                <Switch
                  id="push-messages"
                  checked={preferences?.pushMessages ?? true}
                  onCheckedChange={(value) => handlePreferenceChange("pushMessages", value)}
                  disabled={updatePreferencesMutation.isPending}
                  data-testid="switch-push-messages"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="push-reviews" className="flex flex-col gap-1 cursor-pointer">
                  <span className="font-medium">Reviews</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    Builder responses to your reviews
                  </span>
                </Label>
                <Switch
                  id="push-reviews"
                  checked={preferences?.pushReviews ?? true}
                  onCheckedChange={(value) => handlePreferenceChange("pushReviews", value)}
                  disabled={updatePreferencesMutation.isPending}
                  data-testid="switch-push-reviews"
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="push-payments" className="flex flex-col gap-1 cursor-pointer">
                  <span className="font-medium">Payments</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    Payment confirmations and refunds
                  </span>
                </Label>
                <Switch
                  id="push-payments"
                  checked={preferences?.pushPayments ?? true}
                  onCheckedChange={(value) => handlePreferenceChange("pushPayments", value)}
                  disabled={updatePreferencesMutation.isPending}
                  data-testid="switch-push-payments"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card data-testid="card-email-notifications">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Notifications
          </CardTitle>
          <CardDescription>
            Receive notifications via email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-orders" className="flex flex-col gap-1 cursor-pointer">
              <span className="font-medium">Order Updates</span>
              <span className="text-xs text-muted-foreground font-normal">
                Status changes, deliveries, and revisions
              </span>
            </Label>
            <Switch
              id="email-orders"
              checked={preferences?.emailOrderUpdates ?? true}
              onCheckedChange={(value) => handlePreferenceChange("emailOrderUpdates", value)}
              disabled={updatePreferencesMutation.isPending}
              data-testid="switch-email-orders"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="email-messages" className="flex flex-col gap-1 cursor-pointer">
              <span className="font-medium">Messages</span>
              <span className="text-xs text-muted-foreground font-normal">
                New messages from builders
              </span>
            </Label>
            <Switch
              id="email-messages"
              checked={preferences?.emailMessages ?? true}
              onCheckedChange={(value) => handlePreferenceChange("emailMessages", value)}
              disabled={updatePreferencesMutation.isPending}
              data-testid="switch-email-messages"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="email-reviews" className="flex flex-col gap-1 cursor-pointer">
              <span className="font-medium">Reviews</span>
              <span className="text-xs text-muted-foreground font-normal">
                Builder responses to your reviews
              </span>
            </Label>
            <Switch
              id="email-reviews"
              checked={preferences?.emailReviews ?? true}
              onCheckedChange={(value) => handlePreferenceChange("emailReviews", value)}
              disabled={updatePreferencesMutation.isPending}
              data-testid="switch-email-reviews"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="email-payments" className="flex flex-col gap-1 cursor-pointer">
              <span className="font-medium">Payments</span>
              <span className="text-xs text-muted-foreground font-normal">
                Payment confirmations and refunds
              </span>
            </Label>
            <Switch
              id="email-payments"
              checked={preferences?.emailPayments ?? true}
              onCheckedChange={(value) => handlePreferenceChange("emailPayments", value)}
              disabled={updatePreferencesMutation.isPending}
              data-testid="switch-email-payments"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="email-marketing" className="flex flex-col gap-1 cursor-pointer">
              <span className="font-medium">Marketing & Updates</span>
              <span className="text-xs text-muted-foreground font-normal">
                Platform news, features, and promotions
              </span>
            </Label>
            <Switch
              id="email-marketing"
              checked={preferences?.emailMarketing ?? false}
              onCheckedChange={(value) => handlePreferenceChange("emailMarketing", value)}
              disabled={updatePreferencesMutation.isPending}
              data-testid="switch-email-marketing"
            />
          </div>
        </CardContent>
      </Card>

      <Card data-testid="card-inapp-notifications">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            In-App Notifications
          </CardTitle>
          <CardDescription>
            Control what appears in your notification center
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="inapp-orders" className="flex flex-col gap-1 cursor-pointer">
              <span className="font-medium">Order Updates</span>
              <span className="text-xs text-muted-foreground font-normal">
                Status changes, deliveries, and revisions
              </span>
            </Label>
            <Switch
              id="inapp-orders"
              checked={preferences?.inAppOrderUpdates ?? true}
              onCheckedChange={(value) => handlePreferenceChange("inAppOrderUpdates", value)}
              disabled={updatePreferencesMutation.isPending}
              data-testid="switch-inapp-orders"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="inapp-messages" className="flex flex-col gap-1 cursor-pointer">
              <span className="font-medium">Messages</span>
              <span className="text-xs text-muted-foreground font-normal">
                New messages from builders
              </span>
            </Label>
            <Switch
              id="inapp-messages"
              checked={preferences?.inAppMessages ?? true}
              onCheckedChange={(value) => handlePreferenceChange("inAppMessages", value)}
              disabled={updatePreferencesMutation.isPending}
              data-testid="switch-inapp-messages"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="inapp-reviews" className="flex flex-col gap-1 cursor-pointer">
              <span className="font-medium">Reviews</span>
              <span className="text-xs text-muted-foreground font-normal">
                Builder responses to your reviews
              </span>
            </Label>
            <Switch
              id="inapp-reviews"
              checked={preferences?.inAppReviews ?? true}
              onCheckedChange={(value) => handlePreferenceChange("inAppReviews", value)}
              disabled={updatePreferencesMutation.isPending}
              data-testid="switch-inapp-reviews"
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label htmlFor="inapp-payments" className="flex flex-col gap-1 cursor-pointer">
              <span className="font-medium">Payments</span>
              <span className="text-xs text-muted-foreground font-normal">
                Payment confirmations and refunds
              </span>
            </Label>
            <Switch
              id="inapp-payments"
              checked={preferences?.inAppPayments ?? true}
              onCheckedChange={(value) => handlePreferenceChange("inAppPayments", value)}
              disabled={updatePreferencesMutation.isPending}
              data-testid="switch-inapp-payments"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
