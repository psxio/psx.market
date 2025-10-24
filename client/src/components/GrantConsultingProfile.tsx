import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Award,
  Briefcase,
  MessageCircle,
  Clock,
  BarChart3,
  Zap,
  Shield,
  FileCheck,
  ArrowRight,
  Star,
} from "lucide-react";
import type { Builder, Service, Review } from "@shared/schema";
import { OrderBookingDialog } from "@/components/order-booking-dialog";
import { ReviewList } from "@/components/ReviewWithResponse";

interface GrantConsultingProfileProps {
  builder: Builder;
  services?: Service[];
  reviews?: Review[];
  servicesLoading?: boolean;
  reviewsLoading?: boolean;
}

export function GrantConsultingProfile({
  builder,
  services,
  reviews,
  servicesLoading,
  reviewsLoading,
}: GrantConsultingProfileProps) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);

  const successMetrics = [
    {
      icon: Target,
      label: "Success Rate",
      value: "91%",
      subtitle: "vs 2-5% industry average",
      color: "text-chart-3",
    },
    {
      icon: DollarSign,
      label: "Total Raised",
      value: "$18M+",
      subtitle: "For our clients",
      color: "text-chart-4",
    },
    {
      icon: Users,
      label: "Clients Served",
      value: "350+",
      subtitle: "Across all verticals",
      color: "text-chart-1",
    },
    {
      icon: Award,
      label: "Avg Grant Size",
      value: "$200K",
      subtitle: "Per successful application",
      color: "text-chart-2",
    },
  ];

  const processSteps = [
    {
      number: 1,
      title: "Due Diligence",
      duration: "3-8 days",
      description: "Comprehensive project assessment and foundation eligibility screening",
      items: ["Project viability analysis", "Technical stack review", "Legal & risk assessment", "Grant budget planning"],
    },
    {
      number: 2,
      title: "Application Review",
      duration: "2 weeks",
      description: "Professional preparation of pitch deck, whitepaper, and narrative materials",
      items: ["Pitch deck optimization", "Executive summary", "Technical documentation", "Financial projections"],
    },
    {
      number: 3,
      title: "Customization & Sending",
      duration: "2 weeks",
      description: "Tailored applications customized for each foundation's requirements",
      items: ["Foundation matching", "Application customization", "Supporting materials", "Initial outreach"],
    },
    {
      number: 4,
      title: "Foundation Exchange",
      duration: "3-5 weeks",
      description: "Direct communication with foundation managers and milestone negotiations",
      items: ["Foundation Q&A", "Milestone planning", "Budget negotiation", "Timeline alignment"],
    },
    {
      number: 5,
      title: "Final Interview",
      duration: "Variable",
      description: "Founder preparation and support for final presentations to foundations",
      items: ["Interview preparation", "Founder coaching", "Q&A sessions", "Deal closing support"],
    },
  ];

  const verticals = [
    "DeFi",
    "AI & ML",
    "RWA",
    "Gaming",
    "ReFi",
    "ZK & Privacy",
    "DePIN",
    "Infrastructure",
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section with Success Metrics */}
      <div className="bg-gradient-to-br from-primary/10 via-chart-3/10 to-chart-4/10 rounded-lg p-8 border">
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold">Expert Grant Advisory</h2>
              </div>
              {builder.verified && (
                <CheckCircle2 className="h-7 w-7 text-chart-3" />
              )}
            </div>
            <p className="text-lg text-muted-foreground max-w-3xl">
              {builder.headline}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {successMetrics.map((metric, index) => (
              <Card key={index} className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-background ${metric.color}`}>
                      <metric.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <div className="text-sm font-medium text-muted-foreground">{metric.label}</div>
                      <div className="text-xs text-muted-foreground mt-1">{metric.subtitle}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" className="gap-2" data-testid="button-contact-agency">
              <MessageCircle className="h-5 w-5" />
              Start Your Application
            </Button>
            <Button size="lg" variant="outline" className="gap-2" data-testid="button-success-stories">
              <FileCheck className="h-5 w-5" />
              View Success Stories
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="process" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="process" data-testid="tab-process">Process</TabsTrigger>
          <TabsTrigger value="services" data-testid="tab-services">
            Services ({services?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="about" data-testid="tab-about">About</TabsTrigger>
          <TabsTrigger value="reviews" data-testid="tab-reviews">
            Reviews ({builder.reviewCount})
          </TabsTrigger>
        </TabsList>

        {/* Process Tab */}
        <TabsContent value="process" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-chart-4" />
                Our Proven 5-Step Process
              </CardTitle>
              <CardDescription>
                Industry-leading methodology with 91% success rate
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {processSteps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-lg">
                        {step.number}
                      </div>
                      {index < processSteps.length - 1 && (
                        <div className="h-full w-px bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{step.title}</h3>
                        <Badge variant="outline" className="gap-1.5">
                          <Clock className="h-3 w-3" />
                          {step.duration}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{step.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {step.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-chart-3 flex-shrink-0" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supported Verticals</CardTitle>
              <CardDescription>
                We specialize across all major Web3 ecosystems and grant programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {verticals.map((vertical, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-1.5 px-3">
                    {vertical}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          {servicesLoading ? (
            <div className="text-center py-8">Loading services...</div>
          ) : services && services.length > 0 ? (
            <div className="grid gap-4">
              {services.map((service) => (
                <Card key={service.id} className="hover-elevate">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                        <CardDescription>{service.description}</CardDescription>
                      </div>
                      {service.featured && (
                        <Badge variant="default" className="gap-1.5">
                          <Star className="h-3 w-3" />
                          Featured
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-2xl font-bold">
                            ${parseFloat(service.basicPrice).toLocaleString()} - ${parseFloat(service.premiumPrice || service.basicPrice).toLocaleString()}
                          </div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            {service.deliveryTime} delivery
                          </div>
                        </div>
                        <Button 
                          onClick={() => {
                            setSelectedService(service);
                            setBookingDialogOpen(true);
                          }}
                          className="gap-2"
                          data-testid={`button-book-${service.id}`}
                        >
                          Get Started
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No services available
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>About {builder.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                {builder.description || builder.bio}
              </div>
            </CardContent>
          </Card>

          {builder.skills && builder.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {builder.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-chart-3" />
                Why Choose Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-chart-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">300+ Foundation Network</div>
                    <div className="text-sm text-muted-foreground">
                      Direct access to ecosystem managers and grant programs
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-chart-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">20+ Expert Consultants</div>
                    <div className="text-sm text-muted-foreground">
                      Specialized team across all Web3 verticals
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-chart-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">$1.7B+ Grant Market Access</div>
                    <div className="text-sm text-muted-foreground">
                      Connected to major Web3 ecosystems and programs
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-chart-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Fast Response Time</div>
                    <div className="text-sm text-muted-foreground">
                      {builder.responseTime} average response time
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-4">
          {reviewsLoading ? (
            <Card>
              <CardContent className="py-12 text-center">Loading reviews...</CardContent>
            </Card>
          ) : reviews && reviews.length > 0 ? (
            <ReviewList reviews={reviews} builderId={builder.id} />
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No reviews yet
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {selectedService && (
        <OrderBookingDialog
          open={bookingDialogOpen}
          onOpenChange={setBookingDialogOpen}
          service={selectedService}
          builder={builder}
        />
      )}
    </div>
  );
}
