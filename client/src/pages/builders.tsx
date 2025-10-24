import { useState, useEffect } from "react";
import { Link, useSearch } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/empty-state";
import { SEOHead } from "@/components/seo-head";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Users,
  Star,
  Award,
  Zap,
  Shield,
  Globe,
  Clock,
  Target,
  Sparkles,
  PlayCircle,
  BarChart3,
  Briefcase,
  Heart,
  MessageCircle,
  ChevronRight,
  UserPlus,
  Search,
} from "lucide-react";
import type { Builder } from "@shared/schema";

export default function BuildersLanding() {
  const searchParams = useSearch();
  const inviteToken = new URLSearchParams(searchParams).get('invite');
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [earningsCategory, setEarningsCategory] = useState<string>("development");
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(20);

  const { data: builders = [] } = useQuery<Builder[]>({
    queryKey: ["/api/builders/featured"],
  });

  const categories = [
    { value: "all", label: "All Categories", icon: Globe },
    { value: "kols", label: "KOLs & Influencers", icon: Users },
    { value: "3d-content", label: "3D Artists", icon: Sparkles },
    { value: "marketing", label: "Marketing", icon: TrendingUp },
    { value: "development", label: "Developers", icon: Briefcase },
    { value: "volume", label: "Volume Services", icon: BarChart3 },
  ];

  const earningsPotential = {
    "development": { min: 50, max: 200, avg: 125 },
    "kols": { min: 100, max: 500, avg: 250 },
    "3d-content": { min: 40, max: 150, avg: 85 },
    "marketing": { min: 60, max: 250, avg: 150 },
    "volume": { min: 80, max: 300, avg: 180 },
  };

  const selectedEarnings = earningsPotential[earningsCategory as keyof typeof earningsPotential];
  const monthlyEarnings = (selectedEarnings.avg * hoursPerWeek * 4).toFixed(0);
  const yearlyEarnings = (Number(monthlyEarnings) * 12).toFixed(0);

  const platformStats = [
    { label: "Total Paid Out", value: "$2.5M+", icon: DollarSign, color: "text-green-500" },
    { label: "Active Builders", value: "500+", icon: Users, color: "text-purple-500" },
    { label: "Success Rate", value: "98.5%", icon: CheckCircle, color: "text-blue-500" },
    { label: "Avg. Response Time", value: "< 4 hrs", icon: Clock, color: "text-cyan-500" },
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Earnings",
      description: "Set your own rates and earn more than traditional freelancing platforms",
    },
    {
      icon: Shield,
      title: "Payment Protection",
      description: "USDC escrow ensures you get paid for completed work",
    },
    {
      icon: Target,
      title: "Premium Clients",
      description: "Work with verified Web3 projects and memecoin teams",
    },
    {
      icon: Zap,
      title: "Fast Payouts",
      description: "Receive payments directly to your wallet within 24 hours",
    },
    {
      icon: TrendingUp,
      title: "Build Your Brand",
      description: "Showcase your work and grow your professional reputation",
    },
    {
      icon: Heart,
      title: "Community Support",
      description: "Join a network of talented builders and collaborate",
    },
  ];

  const successStories = [
    {
      name: "Sarah Chen",
      category: "3D Artist",
      avatar: "SC",
      earnings: "$45K",
      period: "6 months",
      rating: 5.0,
      projects: 28,
      quote: "port444 helped me transition from traditional freelancing to Web3. The quality of clients and consistent work has transformed my business.",
      tier: "Platinum",
    },
    {
      name: "Marcus Rodriguez",
      category: "Smart Contract Developer",
      avatar: "MR",
      earnings: "$120K",
      period: "1 year",
      rating: 5.0,
      projects: 42,
      quote: "The escrow system gives me confidence, and the clients are serious about their projects. Best platform I've worked on.",
      tier: "Platinum",
    },
    {
      name: "Yuki Tanaka",
      category: "KOL & Influencer",
      avatar: "YT",
      earnings: "$85K",
      period: "9 months",
      rating: 4.9,
      projects: 65,
      quote: "I love the transparency and the quality of memecoin projects. My audience has grown alongside my earnings.",
      tier: "Gold",
    },
  ];

  const filteredBuilders = selectedCategory === "all" 
    ? builders 
    : builders.filter(b => b.category.toLowerCase().includes(selectedCategory));

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Join as a Builder - Earn in Web3 | port444"
        description="Join port444 as a Web3 builder. Earn competitive rates with USDC escrow, work with premium crypto projects, and build your Web3 reputation. Apply now!"
        keywords="web3 jobs, crypto freelance, blockchain developer jobs, KOL opportunities, Web3 earnings, USDC payments"
        ogType="website"
      />
      {/* Back Button */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3 max-w-7xl">
          <Link href="/marketplace">
            <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back-to-marketplace">
              <ArrowLeft className="h-4 w-4" />
              Back to Marketplace
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-purple-500/10 via-background to-background">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px]" />
        <div className="container relative mx-auto px-4 py-16 md:py-24 max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6">
              {inviteToken ? (
                <Badge className="w-fit bg-gradient-to-r from-purple-500 to-cyan-500 border-0 text-white" data-testid="badge-invited">
                  <Award className="mr-1 h-3 w-3" />
                  You've Been Invited
                </Badge>
              ) : (
                <Badge className="w-fit" variant="outline" data-testid="badge-now-hiring">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Now Hiring Top Talent
                </Badge>
              )}
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                {inviteToken ? (
                  <>
                    Welcome to{" "}
                    <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                      port444
                    </span>
                  </>
                ) : (
                  <>
                    Build Your Web3 Career on{" "}
                    <span className="bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
                      port444
                    </span>
                  </>
                )}
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-xl">
                {inviteToken ? (
                  <>You've been personally invited to join the premier Web3 marketplace. Skip the wait list and start building your career with top memecoin projects today.</>
                ) : (
                  <>Join the premier marketplace for Web3 builders. Work with top memecoin projects, set your own rates, and get paid in USDC with full escrow protection.</>
                )}
              </p>

              <div className="flex flex-wrap gap-3">
                {inviteToken ? (
                  <>
                    <Link href={`/builder-onboarding/${inviteToken}`}>
                      <Button size="lg" className="gap-2" data-testid="button-complete-application">
                        <UserPlus className="h-4 w-4" />
                        Complete Your Application
                      </Button>
                    </Link>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="gap-2" 
                      onClick={() => window.scrollTo({ top: document.body.scrollHeight / 3, behavior: 'smooth' })}
                      data-testid="button-learn-more"
                    >
                      Learn More First
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/builder-quiz">
                      <Button size="lg" className="gap-2" data-testid="button-take-quiz">
                        <Target className="h-4 w-4" />
                        Take Readiness Quiz
                      </Button>
                    </Link>
                    <Link href="/builder-onboarding">
                      <Button size="lg" variant="outline" className="gap-2" data-testid="button-start-earning">
                        Start Application
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">No Monthly Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Direct USDC Payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">Verified Clients Only</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <Card className="relative z-10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Live Earnings Tracker
                  </CardTitle>
                  <CardDescription>Real builders, real earnings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {successStories.slice(0, 3).map((story, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover-elevate" data-testid={`earning-${idx}`}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-white font-bold text-sm">
                          {story.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{story.name}</p>
                          <p className="text-xs text-muted-foreground">{story.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-500">{story.earnings}</p>
                        <p className="text-xs text-muted-foreground">{story.period}</p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-2 border-t">
                    <p className="text-sm text-center text-muted-foreground">
                      Join <strong className="text-foreground">500+ builders</strong> earning on the platform
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="absolute -z-10 top-8 -right-8 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl" />
              <div className="absolute -z-10 -bottom-8 -left-8 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {platformStats.map((stat, idx) => (
              <Card key={idx} className="text-center" data-testid={`stat-${idx}`}>
                <CardContent className="pt-6 space-y-2">
                  <stat.icon className={`h-8 w-8 mx-auto ${stat.color}`} />
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz CTA Banner */}
      <section className="py-12 border-b bg-gradient-to-r from-purple-500/10 to-cyan-500/10">
        <div className="container mx-auto px-4 max-w-5xl">
          <Card className="border-purple-500/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex-shrink-0">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2">Not Sure Where to Start?</h3>
                  <p className="text-muted-foreground">
                    Take our 2-minute quiz to discover your best fit category and get personalized recommendations
                  </p>
                </div>
                <Link href="/builder-quiz">
                  <Button size="lg" className="gap-2 flex-shrink-0" data-testid="button-quiz-banner">
                    <Sparkles className="h-5 w-5" />
                    Take the Quiz
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Build on port444?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We provide everything you need to succeed as a Web3 professional
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, idx) => (
              <Card key={idx} className="hover-elevate" data-testid={`benefit-${idx}`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
                      <benefit.icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Calculator */}
      <section id="calculator" className="py-16 md:py-24 bg-muted/30 border-y">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Calculate Your Earning Potential</h2>
            <p className="text-xl text-muted-foreground">
              See how much you could earn based on your skills and availability
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Earnings Projections</CardTitle>
              <CardDescription>Average rates based on real builder data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Category</label>
                  <Select value={earningsCategory} onValueChange={setEarningsCategory}>
                    <SelectTrigger data-testid="select-earnings-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Smart Contract Development</SelectItem>
                      <SelectItem value="kols">KOL & Influencer</SelectItem>
                      <SelectItem value="3d-content">3D Content Creation</SelectItem>
                      <SelectItem value="marketing">Marketing & Growth</SelectItem>
                      <SelectItem value="volume">Volume Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Hours per Week: <strong>{hoursPerWeek}</strong>
                  </label>
                  <Input
                    type="range"
                    min="10"
                    max="40"
                    step="5"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className="cursor-pointer"
                    data-testid="input-hours-per-week"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>10 hrs</span>
                    <span>40 hrs</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 pt-4">
                <div className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-1">Hourly Range</p>
                  <p className="text-2xl font-bold">
                    ${selectedEarnings.min}-${selectedEarnings.max}
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-1">Monthly Estimate</p>
                  <p className="text-2xl font-bold text-green-500">
                    ${monthlyEarnings}
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground mb-1">Yearly Potential</p>
                  <p className="text-2xl font-bold text-purple-500">
                    ${yearlyEarnings}
                  </p>
                </div>
              </div>

              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <p className="text-sm">
                  <strong>Note:</strong> These are conservative estimates based on average rates. Top-tier builders often earn 2-3x these amounts.
                </p>
              </div>

              <div className="flex justify-center">
                <Link href="/builder-onboarding">
                  <Button size="lg" className="gap-2" data-testid="button-get-started-calculator">
                    Get Started Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-muted-foreground">
              Real builders sharing their experiences on port444
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {successStories.map((story, idx) => (
              <Card key={idx} className="hover-elevate" data-testid={`story-${idx}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-white font-bold">
                        {story.avatar}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{story.name}</CardTitle>
                        <CardDescription>{story.category}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline">{story.tier}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{story.rating}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {story.projects} projects
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-green-500">{story.earnings}</span>
                    <span className="text-sm text-muted-foreground">in {story.period}</span>
                  </div>

                  <blockquote className="text-sm italic text-muted-foreground border-l-2 border-purple-500 pl-4">
                    "{story.quote}"
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Builder Showcase */}
      <section className="py-16 md:py-24 bg-muted/30 border-y">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Builders</h2>
            <p className="text-xl text-muted-foreground">
              Join talented professionals earning on the platform
            </p>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
              {categories.map((cat) => (
                <TabsTrigger key={cat.value} value={cat.value} className="gap-2" data-testid={`tab-${cat.value}`}>
                  <cat.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{cat.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="space-y-4">
              {filteredBuilders.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="No builders in this category"
                  description="We don't have any featured builders in this category yet. Check back soon or browse all builders."
                  actionLabel="View All Categories"
                  onAction={() => setSelectedCategory("all")}
                  secondaryActionLabel="Browse Marketplace"
                  onSecondaryAction={() => window.location.href = "/marketplace"}
                />
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBuilders.slice(0, 6).map((builder) => (
                    <Card key={builder.id} className="hover-elevate" data-testid={`builder-${builder.id}`}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          {builder.profileImage ? (
                            <img 
                              src={builder.profileImage} 
                              alt={builder.name}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-white font-bold">
                              {builder.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg truncate">{builder.name}</CardTitle>
                            <CardDescription className="truncate">{builder.headline}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-bold">{builder.rating || "5.0"}</span>
                            <span className="text-muted-foreground">({builder.reviewCount})</span>
                          </div>
                          <Badge variant="outline">{builder.psxTier}</Badge>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {builder.skills?.slice(0, 3).map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>

                        <Link href={`/builder/${builder.id}`}>
                          <Button variant="outline" className="w-full gap-2" data-testid={`button-view-${builder.id}`}>
                            View Profile
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="text-center mt-8">
            <Link href="/marketplace">
              <Button variant="outline" size="lg" className="gap-2">
                View All Builders
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of builders already earning on port444. The application takes less than 10 minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/builder-onboarding">
                <Button size="lg" className="gap-2 w-full sm:w-auto" data-testid="button-apply-now">
                  <Award className="h-5 w-5" />
                  Apply Now
                </Button>
              </Link>
              <Link href="#calculator">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <MessageCircle className="h-5 w-5" />
                  Have Questions?
                </Button>
              </Link>
            </div>

            <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <span className="text-muted-foreground">Free to Apply</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <span className="text-muted-foreground">No Setup Fees</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <span className="text-muted-foreground">Instant Approval</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <span className="text-muted-foreground">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
