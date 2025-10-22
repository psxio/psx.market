import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Lightbulb, 
  Award, 
  DollarSign,
  Users,
  BarChart3,
  LineChart,
  Star,
  MessageSquare,
  Zap,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface ProfileScoreData {
  overallScore: number;
  maxScore: number;
  profileCompletion: number;
  serviceQuality: number;
  portfolioStrength: number;
  credibilityScore: number;
  recommendations: string[];
  breakdown: {
    profile: { score: number; max: number };
    services: { score: number; max: number };
    portfolio: { score: number; max: number };
    credibility: { score: number; max: number };
  };
}

interface ServiceAnalytics {
  serviceId: string;
  title: string;
  category: string;
  viewCount: number;
  inquiryCount: number;
  conversionCount: number;
  conversionRate: number;
  totalRevenue: string;
  averagePrice: string;
  totalOrders: number;
  active: boolean;
}

interface RevenueForecast {
  currentMonth: {
    actual: string;
    projected: string;
  };
  nextMonth: {
    conservative: string;
    moderate: string;
    optimistic: string;
  };
  pipelineValue: string;
  activeOrders: number;
  avgOrderValue: string;
}

interface BenchmarkingData {
  category: string;
  totalBuilders: number;
  yourRanking: number;
  percentile: number;
  comparison: {
    rating: {
      yours: string;
      average: string;
      difference: string;
      status: string;
    };
    completedProjects: {
      yours: number;
      average: number;
      difference: number;
      status: string;
    };
    responseTime: {
      yours: number;
      average: number;
      difference: number;
      status: string;
    };
  };
  topPerformers: Array<{
    rank: number;
    name: string;
    rating: string;
    completedProjects: number;
    isYou: boolean;
  }>;
}

interface PricingIntelligence {
  category: string;
  marketData: {
    basicPrice: {
      average: string;
      min: string;
      max: string;
      sampleSize: number;
    };
    standardPrice: {
      average: string;
      min: string;
      max: string;
      sampleSize: number;
    };
    premiumPrice: {
      average: string;
      min: string;
      max: string;
      sampleSize: number;
    };
  };
  yourServices: Array<{
    title: string;
    basicPrice: string;
    standardPrice?: string;
    premiumPrice?: string;
    comparison: {
      basic: string;
      standard: string;
      premium: string;
    };
  }>;
  recommendations: string[];
}

interface BuilderAnalyticsProps {
  builderId: string;
}

export default function BuilderAnalytics({ builderId }: BuilderAnalyticsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  const { data: profileScore, isLoading: scoreLoading } = useQuery<ProfileScoreData>({
    queryKey: [`/api/builders/${builderId}/profile-score`],
  });
  
  const { data: serviceAnalytics, isLoading: analyticsLoading } = useQuery<ServiceAnalytics[]>({
    queryKey: [`/api/builders/${builderId}/service-analytics`],
  });
  
  const { data: revenueForecast, isLoading: forecastLoading } = useQuery<RevenueForecast>({
    queryKey: [`/api/builders/${builderId}/revenue-forecast`],
  });
  
  const { data: benchmarking, isLoading: benchmarkingLoading } = useQuery<BenchmarkingData>({
    queryKey: [`/api/builders/${builderId}/benchmarking`],
  });
  
  const { data: pricingIntel, isLoading: pricingLoading } = useQuery<PricingIntelligence>({
    queryKey: [`/api/builders/${builderId}/pricing-intelligence`],
  });

  return (
    <div className="space-y-6" data-testid="builder-analytics-dashboard">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" data-testid="tab-analytics-overview">
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="profile" data-testid="tab-analytics-profile">
            <Award className="w-4 h-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="services" data-testid="tab-analytics-services">
            <LineChart className="w-4 h-4 mr-2" />
            Services
          </TabsTrigger>
          <TabsTrigger value="revenue" data-testid="tab-analytics-revenue">
            <DollarSign className="w-4 h-4 mr-2" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="market" data-testid="tab-analytics-market">
            <Users className="w-4 h-4 mr-2" />
            Market
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Profile Score Card */}
            <Card data-testid="card-profile-score">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Strength</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {scoreLoading ? (
                  <div className="h-16 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold" data-testid="text-profile-score">
                      {profileScore?.overallScore || 0}/100
                    </div>
                    <Progress 
                      value={profileScore?.overallScore || 0} 
                      className="mt-2" 
                      data-testid="progress-profile-score"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      {(profileScore?.overallScore || 0) >= 80 
                        ? "Excellent profile!" 
                        : (profileScore?.overallScore || 0) >= 60
                        ? "Good, room to improve"
                        : "Needs attention"}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Service Performance Card */}
            <Card data-testid="card-service-performance">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Conversion</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {analyticsLoading ? (
                  <div className="h-16 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold" data-testid="text-avg-conversion">
                      {serviceAnalytics && serviceAnalytics.length > 0
                        ? (serviceAnalytics.reduce((sum, s) => sum + s.conversionRate, 0) / serviceAnalytics.length).toFixed(1)
                        : "0"}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Across {serviceAnalytics?.length || 0} services
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Pipeline Value Card */}
            <Card data-testid="card-pipeline-value">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {forecastLoading ? (
                  <div className="h-16 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold" data-testid="text-pipeline-value">
                      ${parseFloat(revenueForecast?.pipelineValue || "0").toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {revenueForecast?.activeOrders || 0} active orders
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Market Ranking Card */}
            <Card data-testid="card-market-ranking">
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Category Rank</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {benchmarkingLoading ? (
                  <div className="h-16 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-2xl font-bold" data-testid="text-market-rank">
                      #{benchmarking?.yourRanking || "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Top {benchmarking?.percentile || 0}% in {benchmarking?.category || "category"}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Insights */}
          <Card data-testid="card-quick-insights">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Quick Insights & Recommendations
              </CardTitle>
              <CardDescription>
                AI-powered suggestions to boost your performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scoreLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : profileScore?.recommendations && profileScore.recommendations.length > 0 ? (
                  profileScore.recommendations.map((rec, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover-elevate"
                      data-testid={`recommendation-${idx}`}
                    >
                      <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm">{rec}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recommendations at this time. Great work!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Optimization Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card data-testid="card-profile-optimization">
            <CardHeader>
              <CardTitle>Profile Optimization</CardTitle>
              <CardDescription>
                Improve your profile to increase visibility and conversions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scoreLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center pb-6 border-b">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full border-4 border-primary bg-primary/10 mb-4">
                      <span className="text-3xl font-bold" data-testid="text-overall-score">
                        {profileScore?.overallScore || 0}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Overall Profile Score</h3>
                    <p className="text-sm text-muted-foreground">
                      Out of {profileScore?.maxScore || 100} possible points
                    </p>
                  </div>

                  {/* Score Breakdown */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2" data-testid="score-profile-completion">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Profile Completion</span>
                        <span className="text-sm text-muted-foreground">
                          {profileScore?.profileCompletion || 0}/{profileScore?.breakdown.profile.max || 30}
                        </span>
                      </div>
                      <Progress value={((profileScore?.profileCompletion || 0) / (profileScore?.breakdown.profile.max || 30)) * 100} />
                    </div>

                    <div className="space-y-2" data-testid="score-service-quality">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Service Quality</span>
                        <span className="text-sm text-muted-foreground">
                          {profileScore?.serviceQuality || 0}/{profileScore?.breakdown.services.max || 25}
                        </span>
                      </div>
                      <Progress value={((profileScore?.serviceQuality || 0) / (profileScore?.breakdown.services.max || 25)) * 100} />
                    </div>

                    <div className="space-y-2" data-testid="score-portfolio-strength">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Portfolio Strength</span>
                        <span className="text-sm text-muted-foreground">
                          {profileScore?.portfolioStrength || 0}/{profileScore?.breakdown.portfolio.max || 20}
                        </span>
                      </div>
                      <Progress value={((profileScore?.portfolioStrength || 0) / (profileScore?.breakdown.portfolio.max || 20)) * 100} />
                    </div>

                    <div className="space-y-2" data-testid="score-credibility">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Credibility</span>
                        <span className="text-sm text-muted-foreground">
                          {profileScore?.credibilityScore || 0}/{profileScore?.breakdown.credibility.max || 25}
                        </span>
                      </div>
                      <Progress value={((profileScore?.credibilityScore || 0) / (profileScore?.breakdown.credibility.max || 25)) * 100} />
                    </div>
                  </div>

                  {/* Action Items */}
                  {profileScore?.recommendations && profileScore.recommendations.length > 0 && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-3">Action Items</h4>
                      <div className="space-y-2">
                        {profileScore.recommendations.map((rec, idx) => (
                          <div 
                            key={idx}
                            className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                            data-testid={`action-item-${idx}`}
                          >
                            <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                            <span className="text-sm flex-1">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Service Analytics Tab */}
        <TabsContent value="services" className="space-y-4">
          <Card data-testid="card-service-analytics">
            <CardHeader>
              <CardTitle>Service Performance Analytics</CardTitle>
              <CardDescription>
                Track views, inquiries, and conversions for each service
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : serviceAnalytics && serviceAnalytics.length > 0 ? (
                <div className="space-y-4">
                  {serviceAnalytics.map((service) => (
                    <div 
                      key={service.serviceId} 
                      className="p-4 rounded-lg border border-border bg-card hover-elevate"
                      data-testid={`service-analytics-${service.serviceId}`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">{service.title}</h4>
                          <p className="text-sm text-muted-foreground">{service.category}</p>
                        </div>
                        <Badge variant={service.active ? "default" : "secondary"} data-testid={`badge-service-status-${service.serviceId}`}>
                          {service.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>

                      <div className="grid gap-4 md:grid-cols-4 mb-4">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Views</p>
                          <p className="text-xl font-bold" data-testid={`text-views-${service.serviceId}`}>{service.viewCount}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Inquiries</p>
                          <p className="text-xl font-bold" data-testid={`text-inquiries-${service.serviceId}`}>{service.inquiryCount}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Conversions</p>
                          <p className="text-xl font-bold" data-testid={`text-conversions-${service.serviceId}`}>{service.conversionCount}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Conversion Rate</p>
                          <p className="text-xl font-bold" data-testid={`text-conversion-rate-${service.serviceId}`}>
                            {service.conversionRate.toFixed(1)}%
                          </p>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Total Revenue</p>
                          <p className="text-lg font-semibold" data-testid={`text-revenue-${service.serviceId}`}>
                            ${parseFloat(service.totalRevenue).toLocaleString()}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Avg Order Value</p>
                          <p className="text-lg font-semibold" data-testid={`text-avg-order-${service.serviceId}`}>
                            ${parseFloat(service.averagePrice).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No services found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Create your first service to start tracking analytics
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Forecasting Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Current Month Card */}
            <Card data-testid="card-current-month">
              <CardHeader>
                <CardTitle>Current Month</CardTitle>
                <CardDescription>Actual vs Projected Revenue</CardDescription>
              </CardHeader>
              <CardContent>
                {forecastLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Actual Revenue</p>
                      <p className="text-3xl font-bold" data-testid="text-actual-revenue">
                        ${parseFloat(revenueForecast?.currentMonth.actual || "0").toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Projected Revenue</p>
                      <p className="text-2xl font-semibold text-primary" data-testid="text-projected-revenue">
                        ${parseFloat(revenueForecast?.currentMonth.projected || "0").toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Next Month Forecast Card */}
            <Card data-testid="card-next-month">
              <CardHeader>
                <CardTitle>Next Month Forecast</CardTitle>
                <CardDescription>Revenue projections based on trends</CardDescription>
              </CardHeader>
              <CardContent>
                {forecastLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Conservative</span>
                      <span className="font-semibold" data-testid="text-forecast-conservative">
                        ${parseFloat(revenueForecast?.nextMonth.conservative || "0").toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Moderate</span>
                      <span className="font-semibold text-primary" data-testid="text-forecast-moderate">
                        ${parseFloat(revenueForecast?.nextMonth.moderate || "0").toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Optimistic</span>
                      <span className="font-semibold" data-testid="text-forecast-optimistic">
                        ${parseFloat(revenueForecast?.nextMonth.optimistic || "0").toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Pipeline & Metrics Card */}
          <Card data-testid="card-pipeline-metrics">
            <CardHeader>
              <CardTitle>Pipeline & Key Metrics</CardTitle>
              <CardDescription>Current pipeline value and order statistics</CardDescription>
            </CardHeader>
            <CardContent>
              {forecastLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 rounded-lg border bg-card">
                    <p className="text-sm text-muted-foreground mb-2">Pipeline Value</p>
                    <p className="text-2xl font-bold" data-testid="text-pipeline">
                      ${parseFloat(revenueForecast?.pipelineValue || "0").toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <p className="text-sm text-muted-foreground mb-2">Active Orders</p>
                    <p className="text-2xl font-bold" data-testid="text-active-orders">
                      {revenueForecast?.activeOrders || 0}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <p className="text-sm text-muted-foreground mb-2">Avg Order Value</p>
                    <p className="text-2xl font-bold" data-testid="text-avg-order-value">
                      ${parseFloat(revenueForecast?.avgOrderValue || "0").toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Intelligence Tab */}
        <TabsContent value="market" className="space-y-4">
          {/* Competitor Benchmarking */}
          <Card data-testid="card-benchmarking">
            <CardHeader>
              <CardTitle>Competitor Benchmarking</CardTitle>
              <CardDescription>
                See how you compare to other builders in {benchmarking?.category || "your category"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {benchmarkingLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Your Ranking */}
                  <div className="text-center pb-6 border-b">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full border-4 border-primary bg-primary/10 mb-3">
                      <span className="text-2xl font-bold" data-testid="text-your-rank">
                        #{benchmarking?.yourRanking || "N/A"}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">Your Ranking</h3>
                    <p className="text-sm text-muted-foreground">
                      Top {benchmarking?.percentile || 0}% of {benchmarking?.totalBuilders || 0} builders
                    </p>
                  </div>

                  {/* Comparison Metrics */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 rounded-lg border bg-card" data-testid="comparison-rating">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Rating</span>
                        {benchmarking?.comparison.rating.status === "above" ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : benchmarking?.comparison.rating.status === "below" ? (
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                        ) : null}
                      </div>
                      <p className="text-2xl font-bold mb-1">{benchmarking?.comparison.rating.yours || "0"}</p>
                      <p className="text-xs text-muted-foreground">
                        Avg: {benchmarking?.comparison.rating.average || "0"} 
                        ({benchmarking?.comparison.rating.difference || "0"})
                      </p>
                    </div>

                    <div className="p-4 rounded-lg border bg-card" data-testid="comparison-projects">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Projects</span>
                        {benchmarking?.comparison.completedProjects.status === "above" ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : benchmarking?.comparison.completedProjects.status === "below" ? (
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                        ) : null}
                      </div>
                      <p className="text-2xl font-bold mb-1">{benchmarking?.comparison.completedProjects.yours || 0}</p>
                      <p className="text-xs text-muted-foreground">
                        Avg: {benchmarking?.comparison.completedProjects.average || 0}
                      </p>
                    </div>

                    <div className="p-4 rounded-lg border bg-card" data-testid="comparison-response">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Response Time</span>
                        {benchmarking?.comparison.responseTime.status === "above" ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        ) : benchmarking?.comparison.responseTime.status === "below" ? (
                          <ArrowDownRight className="h-4 w-4 text-red-500" />
                        ) : null}
                      </div>
                      <p className="text-2xl font-bold mb-1">{benchmarking?.comparison.responseTime.yours || 24}h</p>
                      <p className="text-xs text-muted-foreground">
                        Avg: {benchmarking?.comparison.responseTime.average || 24}h
                      </p>
                    </div>
                  </div>

                  {/* Top Performers */}
                  {benchmarking?.topPerformers && benchmarking.topPerformers.length > 0 && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-3">Top Performers in Category</h4>
                      <div className="space-y-2">
                        {benchmarking.topPerformers.map((performer) => (
                          <div 
                            key={performer.rank}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              performer.isYou ? 'border-primary bg-primary/5' : 'bg-card'
                            }`}
                            data-testid={`top-performer-${performer.rank}`}
                          >
                            <div className="flex items-center gap-3">
                              <Badge variant={performer.isYou ? "default" : "secondary"}>
                                #{performer.rank}
                              </Badge>
                              <div>
                                <p className="font-medium">
                                  {performer.isYou ? "You" : performer.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {performer.completedProjects} projects
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="font-semibold">{performer.rating}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing Intelligence */}
          <Card data-testid="card-pricing-intelligence">
            <CardHeader>
              <CardTitle>Pricing Intelligence</CardTitle>
              <CardDescription>
                Market pricing data for {pricingIntel?.category || "your category"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pricingLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Market Averages */}
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 rounded-lg border bg-card" data-testid="pricing-basic">
                      <p className="text-sm text-muted-foreground mb-2">Basic Tier</p>
                      <p className="text-2xl font-bold mb-1">
                        ${parseFloat(pricingIntel?.marketData.basicPrice.average || "0").toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Range: ${parseFloat(pricingIntel?.marketData.basicPrice.min || "0").toLocaleString()} - 
                        ${parseFloat(pricingIntel?.marketData.basicPrice.max || "0").toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {pricingIntel?.marketData.basicPrice.sampleSize || 0} services
                      </p>
                    </div>

                    <div className="p-4 rounded-lg border bg-card" data-testid="pricing-standard">
                      <p className="text-sm text-muted-foreground mb-2">Standard Tier</p>
                      <p className="text-2xl font-bold mb-1">
                        ${parseFloat(pricingIntel?.marketData.standardPrice.average || "0").toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Range: ${parseFloat(pricingIntel?.marketData.standardPrice.min || "0").toLocaleString()} - 
                        ${parseFloat(pricingIntel?.marketData.standardPrice.max || "0").toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {pricingIntel?.marketData.standardPrice.sampleSize || 0} services
                      </p>
                    </div>

                    <div className="p-4 rounded-lg border bg-card" data-testid="pricing-premium">
                      <p className="text-sm text-muted-foreground mb-2">Premium Tier</p>
                      <p className="text-2xl font-bold mb-1">
                        ${parseFloat(pricingIntel?.marketData.premiumPrice.average || "0").toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Range: ${parseFloat(pricingIntel?.marketData.premiumPrice.min || "0").toLocaleString()} - 
                        ${parseFloat(pricingIntel?.marketData.premiumPrice.max || "0").toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {pricingIntel?.marketData.premiumPrice.sampleSize || 0} services
                      </p>
                    </div>
                  </div>

                  {/* Your Services Comparison */}
                  {pricingIntel?.yourServices && pricingIntel.yourServices.length > 0 && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-3">Your Pricing vs Market</h4>
                      <div className="space-y-3">
                        {pricingIntel.yourServices.map((service, idx) => (
                          <div 
                            key={idx}
                            className="p-3 rounded-lg border bg-card"
                            data-testid={`service-pricing-${idx}`}
                          >
                            <p className="font-medium mb-2">{service.title}</p>
                            <div className="grid gap-2 md:grid-cols-3 text-sm">
                              <div>
                                <span className="text-muted-foreground">Basic: </span>
                                <span className="font-semibold">${parseFloat(service.basicPrice).toLocaleString()}</span>
                                <span className={`ml-2 text-xs ${
                                  parseFloat(service.comparison.basic) > 0 ? 'text-green-500' : 
                                  parseFloat(service.comparison.basic) < 0 ? 'text-red-500' : 
                                  'text-muted-foreground'
                                }`}>
                                  ({parseFloat(service.comparison.basic) > 0 ? '+' : ''}{service.comparison.basic}%)
                                </span>
                              </div>
                              {service.standardPrice && (
                                <div>
                                  <span className="text-muted-foreground">Standard: </span>
                                  <span className="font-semibold">${parseFloat(service.standardPrice).toLocaleString()}</span>
                                  <span className={`ml-2 text-xs ${
                                    parseFloat(service.comparison.standard) > 0 ? 'text-green-500' : 
                                    parseFloat(service.comparison.standard) < 0 ? 'text-red-500' : 
                                    'text-muted-foreground'
                                  }`}>
                                    ({parseFloat(service.comparison.standard) > 0 ? '+' : ''}{service.comparison.standard}%)
                                  </span>
                                </div>
                              )}
                              {service.premiumPrice && (
                                <div>
                                  <span className="text-muted-foreground">Premium: </span>
                                  <span className="font-semibold">${parseFloat(service.premiumPrice).toLocaleString()}</span>
                                  <span className={`ml-2 text-xs ${
                                    parseFloat(service.comparison.premium) > 0 ? 'text-green-500' : 
                                    parseFloat(service.comparison.premium) < 0 ? 'text-red-500' : 
                                    'text-muted-foreground'
                                  }`}>
                                    ({parseFloat(service.comparison.premium) > 0 ? '+' : ''}{service.comparison.premium}%)
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {pricingIntel?.recommendations && pricingIntel.recommendations.length > 0 && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold mb-3">Pricing Recommendations</h4>
                      <div className="space-y-2">
                        {pricingIntel.recommendations.map((rec, idx) => (
                          <div 
                            key={idx}
                            className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                            data-testid={`pricing-recommendation-${idx}`}
                          >
                            <Target className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
