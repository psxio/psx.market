import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link, useLocation } from "wouter";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { RecommendedServices } from "@/components/ai/RecommendedServices";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Star,
  Shield,
  TrendingUp,
  Package,
  MessageSquare,
  Share2,
  Heart,
  Sparkles,
  Tag as TagIcon,
} from "lucide-react";
import type { Service, Builder } from "@shared/schema";

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [customRequirements, setCustomRequirements] = useState("");

  const { data: serviceData, isLoading, isError } = useQuery<{
    service: Service;
    builder: Builder;
  }>({
    queryKey: ["/api/services", id],
  });

  const service = serviceData?.service;
  const builder = serviceData?.builder;

  // Update document head for SEO
  useEffect(() => {
    if (service && builder) {
      // Set page title
      document.title = `${service.title} by ${builder.name} - Create.psx Marketplace`;

      // Create unique meta tags that we can clean up later
      const metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      metaDescription.setAttribute("content", service.description);
      metaDescription.setAttribute("data-service-detail", "true");
      document.head.appendChild(metaDescription);

      // Create Open Graph tags
      const ogTags = [
        { property: "og:title", content: `${service.title} by ${builder.name}` },
        { property: "og:description", content: service.description },
        { property: "og:type", content: "product" },
        { property: "og:url", content: window.location.href },
      ];

      ogTags.forEach(({ property, content }) => {
        const tag = document.createElement("meta");
        tag.setAttribute("property", property);
        tag.setAttribute("content", content);
        tag.setAttribute("data-service-detail", "true");
        document.head.appendChild(tag);
      });

      // Add structured data for rich snippets
      const structuredData = document.createElement("script");
      structuredData.setAttribute("type", "application/ld+json");
      structuredData.setAttribute("data-service-detail", "true");
      structuredData.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.title,
        description: service.description,
        provider: {
          "@type": "Person",
          name: builder.name,
        },
        offers: {
          "@type": "Offer",
          price: service.basicPrice,
          priceCurrency: "USD",
        },
      });
      document.head.appendChild(structuredData);

      // Cleanup function to remove all service detail tags
      return () => {
        document.title = "Create.psx - Web3 Talent Marketplace";
        document.querySelectorAll('[data-service-detail="true"]').forEach((el) => el.remove());
      };
    }
  }, [service, builder]);

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: {
      builderId: string;
      serviceId: string;
      packageType: string;
      title: string;
      requirements: string;
      budget: string;
      deliveryDays: number;
    }) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/clients/me/orders"] });
      toast({
        title: "Order Created Successfully",
        description: `Your ${selectedPackage} package order has been created. ${builder?.name} will be notified!`,
      });
      setBookingDialogOpen(false);
      setCustomRequirements("");
      setSelectedPackage(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message || "Failed to create order. Please try again or log in as a client.",
      });
    },
  });

  const handleBooking = (packageName: string) => {
    setSelectedPackage(packageName);
    setBookingDialogOpen(true);
  };

  const handleConfirmBooking = () => {
    if (!service || !builder || !selectedPackage) return;

    // Get package details
    const packagePrice =
      selectedPackage === "Basic"
        ? service.basicPrice
        : selectedPackage === "Standard"
        ? service.standardPrice
        : service.premiumPrice;

    // Parse delivery days from deliveryTime string
    const deliveryDays = parseInt(service.deliveryTime.match(/\d+/)?.[0] || "7");

    createOrderMutation.mutate({
      builderId: builder.id,
      serviceId: service.id,
      packageType: selectedPackage,
      title: service.title,
      requirements: customRequirements || "No specific requirements",
      budget: packagePrice?.toString() || "0",
      deliveryDays,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
          <Skeleton className="mb-4 h-8 w-32" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-96 w-full rounded-lg" />
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !service || !builder) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The service you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/marketplace">
            <Button data-testid="button-back-marketplace">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Marketplace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const packages = [
    {
      name: "Basic",
      price: service.basicPrice,
      description: service.basicDescription,
      deliverables: service.basicDeliverables || [],
    },
    ...(service.standardPrice
      ? [
          {
            name: "Standard",
            price: service.standardPrice,
            description: service.standardDescription,
            deliverables: service.standardDeliverables || [],
            popular: true,
          },
        ]
      : []),
    ...(service.premiumPrice
      ? [
          {
            name: "Premium",
            price: service.premiumPrice,
            description: service.premiumDescription,
            deliverables: service.premiumDeliverables || [],
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/marketplace" className="hover:text-foreground transition-colors">
            Marketplace
          </Link>
          <span>/</span>
          <span className="text-foreground">{service.title}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Service Header */}
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="gap-1 border-primary/40 bg-primary/10 text-primary">
                  <TagIcon className="h-3 w-3" />
                  {service.category}
                </Badge>
                {service.featured && (
                  <Badge className="gap-1 bg-gradient-to-r from-chart-3 to-chart-2 border-0">
                    <Sparkles className="h-3 w-3" />
                    Featured
                  </Badge>
                )}
                {service.tokenTickers?.map((ticker) => (
                  <Badge key={ticker} variant="secondary" className="gap-1">
                    <TrendingUp className="h-3 w-3" />
                    ${ticker}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl mb-4">
                {service.title}
              </h1>
              <p className="text-lg text-muted-foreground">{service.description}</p>

              <div className="mt-6 flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold">Delivery Time</div>
                    <div className="text-muted-foreground">{service.deliveryTime}</div>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-chart-2" />
                  <div>
                    <div className="font-semibold">{packages.length} Packages</div>
                    <div className="text-muted-foreground">Starting at ${service.basicPrice}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Media Gallery */}
            {(service.portfolioMedia?.length || service.videoUrls?.length) && (
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio & Media</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {service.portfolioMedia?.slice(0, 4).map((media, i) => (
                      <div
                        key={i}
                        className="relative aspect-video overflow-hidden rounded-lg border bg-muted"
                      >
                        <img
                          src={media}
                          alt={`Portfolio ${i + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                    {service.videoUrls?.slice(0, 2).map((video, i) => (
                      <div
                        key={`video-${i}`}
                        className="relative aspect-video overflow-hidden rounded-lg border bg-muted"
                      >
                        <video src={video} controls className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Package Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Compare Packages</CardTitle>
                <CardDescription>
                  Choose the package that best fits your project needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {packages.map((pkg) => (
                    <Card
                      key={pkg.name}
                      className={`relative overflow-hidden ${
                        pkg.popular ? "border-2 border-primary" : ""
                      }`}
                    >
                      {pkg.popular && (
                        <div className="absolute top-0 right-0">
                          <Badge className="rounded-bl-lg rounded-tr-none bg-primary">
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="text-xl">{pkg.name}</CardTitle>
                        <div className="mt-2">
                          <span className="text-3xl font-bold">${pkg.price}</span>
                        </div>
                        <CardDescription className="mt-2">{pkg.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          {pkg.deliverables.map((item, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                        <Button
                          className="w-full"
                          variant={pkg.popular ? "default" : "outline"}
                          data-testid={`button-select-${pkg.name.toLowerCase()}`}
                          onClick={() => handleBooking(pkg.name)}
                        >
                          Select {pkg.name}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Additional Details Tabs */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Service Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {service.tags && service.tags.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-2">Tags & Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {service.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold mb-2">Category</h3>
                      <p className="text-muted-foreground">{service.category}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Delivery Time</h3>
                      <p className="text-muted-foreground">{service.deliveryTime}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="faq">
                <Card>
                  <CardHeader>
                    <CardTitle>Frequently Asked Questions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">What's included in the service?</h4>
                      <p className="text-sm text-muted-foreground">
                        All packages include the deliverables listed in the package details above.
                        Additional revisions and rush delivery may be available upon request.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">How does payment work?</h4>
                      <p className="text-sm text-muted-foreground">
                        Payments are securely processed through our platform using USDC on the Base
                        network. Funds are held in escrow until delivery is complete.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Can I request custom requirements?</h4>
                      <p className="text-sm text-muted-foreground">
                        Yes! Contact the builder directly to discuss custom requirements and
                        pricing.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reviews">
                <Card>
                  <CardHeader>
                    <CardTitle>Reviews</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Reviews will be displayed here once available.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Builder Profile Card */}
            <Card>
              <CardHeader>
                <CardTitle>About the Builder</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href={`/builder/${builder.id}`} className="block group">
                  <div className="flex items-center gap-3 hover-elevate active-elevate-2 rounded-lg p-3 -m-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={builder.profileImage || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl">
                        {builder.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{builder.name}</h3>
                        {builder.verified && (
                          <Shield className="h-4 w-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{builder.headline}</p>
                    </div>
                  </div>
                </Link>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-semibold">
                        {builder.rating || "5.0"} ({builder.reviewCount || 0})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Completed Projects</span>
                    <span className="font-semibold">{builder.completedProjects || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Response Time</span>
                    <span className="font-semibold">{builder.responseTime || "24 hours"}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Link href={`/builder/${builder.id}`} className="flex-1">
                    <Button variant="outline" className="w-full" data-testid="button-view-profile">
                      View Profile
                    </Button>
                  </Link>
                  <Button
                    variant="default"
                    className="flex-1"
                    data-testid="button-contact-builder"
                    onClick={() => {
                      // TODO: Open messaging
                      alert("Messaging coming soon!");
                    }}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Heart className="h-4 w-4" />
                  Save to Favorites
                </Button>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Service
                </Button>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-medium">Token-Gated Quality</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-5 w-5 text-chart-3" />
                  <span className="font-medium">Verified Builder</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-5 w-5 text-chart-2" />
                  <span className="font-medium">Secure USDC Payments</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Recommended Services */}
        {id && (
          <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
            <RecommendedServices serviceId={id} />
          </div>
        )}

        {/* Booking Dialog */}
        <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
          <DialogContent className="sm:max-w-[500px]" data-testid="dialog-booking">
            <DialogHeader>
              <DialogTitle>Book {selectedPackage} Package</DialogTitle>
              <DialogDescription>
                Send a booking request to {builder?.name} for the {selectedPackage} package
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Service</h4>
                <p className="text-sm text-muted-foreground">{service?.title}</p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Package</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedPackage} - $
                  {selectedPackage === "Basic"
                    ? service?.basicPrice
                    : selectedPackage === "Standard"
                    ? service?.standardPrice
                    : service?.premiumPrice}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="requirements">Custom Requirements (Optional)</Label>
                <Textarea
                  id="requirements"
                  placeholder="Describe any specific requirements or details for your project..."
                  value={customRequirements}
                  onChange={(e) => setCustomRequirements(e.target.value)}
                  rows={4}
                  data-testid="textarea-requirements"
                />
              </div>
              <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                <div className="flex items-start gap-2 text-sm">
                  <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Secure Payment</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Payment will be held in escrow until delivery is complete
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setBookingDialogOpen(false)}
                data-testid="button-cancel-booking"
                disabled={createOrderMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmBooking}
                data-testid="button-confirm-booking"
                disabled={createOrderMutation.isPending}
              >
                {createOrderMutation.isPending ? "Creating Order..." : "Confirm Booking"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
