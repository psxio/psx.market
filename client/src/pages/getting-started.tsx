import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { FindBuilderWizard } from "@/components/ai/FindBuilderWizard";
import { 
  Wallet, Search, MessageCircle, DollarSign, Star, Shield,
  FileText, Target, TrendingUp, Users, Zap, CheckCircle,
  ArrowRight, AlertCircle, Book, HelpCircle, Sparkles,
  Trophy, Globe, Clock, Rocket, Code, Palette, BarChart,
  Briefcase, Award, ThumbsUp, TrendingDown, Settings
} from "lucide-react";

export default function GettingStarted() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section - Simple without parallax */}
      <section className="relative bg-gradient-to-b from-muted/30 via-background to-background pt-24 pb-16">
        <div className="container mx-auto max-w-4xl px-4 md:px-6 lg:px-8 text-center">
          <div className="space-y-6 animate-fadeInUp">
            <Badge variant="outline" className="gap-2 border-primary/40 bg-primary/10 text-primary text-sm px-4 py-1.5" data-testid="badge-start-journey">
              <Rocket className="h-4 w-4" />
              Start Your Journey
            </Badge>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Getting Started
              <span className="block mt-3 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 bg-clip-text text-transparent">
                with port444
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Your complete guide to hiring elite Web3 talent or building a thriving freelance career on the premier Base marketplace
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          <Tabs defaultValue="client" className="space-y-12">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12">
              <TabsTrigger value="client" className="text-base gap-2" data-testid="tab-client">
                <Users className="h-4 w-4" />
                For Clients
              </TabsTrigger>
              <TabsTrigger value="builder" className="text-base gap-2" data-testid="tab-builder">
                <Briefcase className="h-4 w-4" />
                For Builders
              </TabsTrigger>
            </TabsList>

            {/* Client Tab */}
            <TabsContent value="client" className="space-y-16 animate-fadeIn" data-testid="content-client">
              {/* Client Intro */}
              <div className="text-center space-y-4 max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold">Hire Top Web3 Talent in Minutes</h2>
                <p className="text-lg text-muted-foreground">
                  Connect with vetted builders, pay securely with USDC, and get your project done right—all on Base blockchain
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center" data-testid="stat-builders">
                  <CardContent className="pt-6 space-y-1">
                    <div className="text-3xl font-bold text-primary">500+</div>
                    <div className="text-sm text-muted-foreground">Vetted Builders</div>
                  </CardContent>
                </Card>
                <Card className="text-center" data-testid="stat-delivery">
                  <CardContent className="pt-6 space-y-1">
                    <div className="text-3xl font-bold text-primary">24h</div>
                    <div className="text-sm text-muted-foreground">Avg Response</div>
                  </CardContent>
                </Card>
                <Card className="text-center" data-testid="stat-escrow">
                  <CardContent className="pt-6 space-y-1">
                    <div className="text-3xl font-bold text-primary">100%</div>
                    <div className="text-sm text-muted-foreground">Escrow Protected</div>
                  </CardContent>
                </Card>
                <Card className="text-center" data-testid="stat-rating">
                  <CardContent className="pt-6 space-y-1">
                    <div className="text-3xl font-bold text-primary">4.9★</div>
                    <div className="text-sm text-muted-foreground">Avg Rating</div>
                  </CardContent>
                </Card>
              </div>

              {/* Step-by-Step Guide */}
              <div className="space-y-8">
                <h3 className="text-2xl md:text-3xl font-bold text-center">How to Hire on port444</h3>
                
                {/* Step 1 */}
                <Card className="overflow-hidden" data-testid="card-client-step-1">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-cyan-500" />
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-xl font-bold flex-shrink-0">
                        1
                      </div>
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <Wallet className="h-5 w-5 text-primary" />
                          Connect Your Wallet
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Get instant access with $CREATE or $PSX tokens</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="font-medium text-sm">Install Wallet</p>
                          <p className="text-xs text-muted-foreground">MetaMask, Coinbase, Rainbow, or any Base-compatible wallet</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="font-medium text-sm">Get Tokens</p>
                          <p className="text-xs text-muted-foreground">Hold $CREATE or $PSX on Base network for platform access</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="font-medium text-sm">Connect & Verify</p>
                          <p className="text-xs text-muted-foreground">Click "Connect Wallet" to verify holdings instantly</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                      <Zap className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">Token Holder Benefits</p>
                        <p className="text-xs text-muted-foreground">
                          Enjoy reduced fees (2% vs 5%), priority support, and exclusive access to top-rated builders
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Step 2 */}
                <Card className="overflow-hidden" data-testid="card-client-step-2">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-cyan-500" />
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-xl font-bold flex-shrink-0">
                        2
                      </div>
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <Search className="h-5 w-5 text-primary" />
                          Find Your Perfect Builder
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Browse 500+ vetted Web3 professionals across all categories</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <p className="font-semibold">Search & Filter:</p>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-3 text-sm">
                            <Code className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                            <span>Browse by category: Smart Contracts, Design, Marketing, Trading, Community</span>
                          </li>
                          <li className="flex items-start gap-3 text-sm">
                            <Settings className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                            <span>Filter by skills, delivery time, budget, and token tier</span>
                          </li>
                          <li className="flex items-start gap-3 text-sm">
                            <BarChart className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                            <span>Sort by rating, reviews, price, or response time</span>
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <p className="font-semibold">Look For:</p>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-3 text-sm">
                            <Shield className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                            <span><span className="font-medium">Verified Badge:</span> Platform-vetted builders</span>
                          </li>
                          <li className="flex items-start gap-3 text-sm">
                            <Star className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                            <span><span className="font-medium">High Ratings:</span> 4.5+ stars from real clients</span>
                          </li>
                          <li className="flex items-start gap-3 text-sm">
                            <FileText className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                            <span><span className="font-medium">Portfolio:</span> Proven work samples & case studies</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <Link href="/marketplace">
                      <Button size="lg" className="w-full md:w-auto gap-2" data-testid="button-browse-marketplace">
                        Browse Marketplace
                        <Search className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* AI Finder Feature */}
                <Card className="border-primary/30 border-2 overflow-hidden relative" data-testid="card-ai-finder">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white flex-shrink-0">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <Sparkles className="h-5 w-5 text-primary" />
                          AI-Powered Builder Matching
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Not sure who to hire? Let AI find the perfect match for your project
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-start gap-3">
                        <Target className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="font-medium text-sm">Precision Matching</p>
                          <p className="text-xs text-muted-foreground">Describe your project and get builders with exact skills you need</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="font-medium text-sm">Instant Results</p>
                          <p className="text-xs text-muted-foreground">Get personalized recommendations in seconds with ratings & portfolios</p>
                        </div>
                      </div>
                    </div>
                    <FindBuilderWizard />
                  </CardContent>
                </Card>

                {/* Steps 3-5 Condensed */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card data-testid="card-client-step-3">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-lg font-bold flex-shrink-0">
                          3
                        </div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MessageCircle className="h-5 w-5 text-primary" />
                          Discuss & Agree
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Message builders to discuss scope, timeline, and deliverables
                      </p>
                      <ul className="space-y-2 text-xs text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 mt-0.5 text-green-500" />
                          <span>Share detailed requirements</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 mt-0.5 text-green-500" />
                          <span>Review proposals & pricing</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 mt-0.5 text-green-500" />
                          <span>Set clear milestones</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card data-testid="card-client-step-4">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-lg font-bold flex-shrink-0">
                          4
                        </div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Shield className="h-5 w-5 text-primary" />
                          Pay Securely
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Fund projects with USDC protected by smart contract escrow
                      </p>
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 space-y-1">
                        <p className="text-xs font-semibold flex items-center gap-1.5">
                          <Shield className="h-3 w-3 text-green-500" />
                          Escrow Protected
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Funds released only when you approve milestones
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card data-testid="card-client-step-5">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-lg font-bold flex-shrink-0">
                          5
                        </div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Star className="h-5 w-5 text-primary" />
                          Review & Rate
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Leave feedback to help the community and builders
                      </p>
                      <ul className="space-y-2 text-xs text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <Star className="h-3 w-3 mt-0.5 text-yellow-500" />
                          <span>Rate quality & timeliness</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <MessageCircle className="h-3 w-3 mt-0.5 text-blue-500" />
                          <span>Share detailed feedback</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Client Resources */}
              <div className="pt-8 border-t">
                <h3 className="text-2xl font-bold mb-6 text-center">Helpful Resources</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <Link href="/marketplace" data-testid="link-resource-marketplace">
                    <Card className="hover-elevate cursor-pointer h-full transition-all duration-300">
                      <CardContent className="p-6 text-center space-y-3">
                        <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center mx-auto">
                          <Search className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold">Browse Marketplace</p>
                          <p className="text-sm text-muted-foreground">Explore all builders</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/how-it-works" data-testid="link-resource-how-it-works">
                    <Card className="hover-elevate cursor-pointer h-full transition-all duration-300">
                      <CardContent className="p-6 text-center space-y-3">
                        <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mx-auto">
                          <Book className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold">How It Works</p>
                          <p className="text-sm text-muted-foreground">Complete workflow guide</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/faq" data-testid="link-resource-faq">
                    <Card className="hover-elevate cursor-pointer h-full transition-all duration-300">
                      <CardContent className="p-6 text-center space-y-3">
                        <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center mx-auto">
                          <HelpCircle className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-semibold">FAQ</p>
                          <p className="text-sm text-muted-foreground">Get answers quickly</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>
            </TabsContent>

            {/* Builder Tab */}
            <TabsContent value="builder" className="space-y-16 animate-fadeIn" data-testid="content-builder">
              {/* Builder Hero */}
              <div className="text-center space-y-6 max-w-3xl mx-auto">
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="gap-1.5 border-primary/40 bg-primary/10 text-primary">
                    <Trophy className="h-3 w-3" />
                    Invite-Only Platform
                  </Badge>
                  <Badge className="gap-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 border-0">
                    <DollarSign className="h-3 w-3" />
                    Earn USDC
                  </Badge>
                </div>
                
                <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                  Build Your Web3 Career
                  <span className="block mt-2 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 bg-clip-text text-transparent">
                    Earn Premium Rates
                  </span>
                </h2>
                
                <p className="text-lg md:text-xl text-muted-foreground">
                  Join 500+ elite builders earning on port444. Get paid in USDC with smart contract escrow, set your own rates, and work with top memecoin & crypto projects.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                  <Link href="/builder-onboarding">
                    <Button size="lg" className="gap-2 text-base" data-testid="button-builder-apply">
                      Apply to Join
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/builder-quiz">
                    <Button size="lg" variant="outline" className="gap-2 text-base hover-elevate" data-testid="button-builder-quiz">
                      Take Readiness Quiz
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Builder Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="text-center" data-testid="stat-builder-count">
                  <CardContent className="pt-6 space-y-1">
                    <div className="text-3xl font-bold text-primary">500+</div>
                    <div className="text-sm text-muted-foreground">Active Builders</div>
                  </CardContent>
                </Card>
                <Card className="text-center" data-testid="stat-earnings">
                  <CardContent className="pt-6 space-y-1">
                    <div className="text-3xl font-bold text-primary">$2.5M+</div>
                    <div className="text-sm text-muted-foreground">Total Paid Out</div>
                  </CardContent>
                </Card>
                <Card className="text-center" data-testid="stat-success">
                  <CardContent className="pt-6 space-y-1">
                    <div className="text-3xl font-bold text-primary">95%</div>
                    <div className="text-sm text-muted-foreground">Success Rate</div>
                  </CardContent>
                </Card>
                <Card className="text-center" data-testid="stat-builder-rating">
                  <CardContent className="pt-6 space-y-1">
                    <div className="text-3xl font-bold text-primary">4.9★</div>
                    <div className="text-sm text-muted-foreground">Avg Rating</div>
                  </CardContent>
                </Card>
              </div>

              {/* Why Join */}
              <div className="space-y-6">
                <h3 className="text-2xl md:text-3xl font-bold text-center">Why Build on port444?</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="hover-elevate transition-all">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                          <DollarSign className="h-6 w-6 text-green-500" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-lg">Premium Earnings</h4>
                          <p className="text-sm text-muted-foreground">
                            Set your own rates and earn 20-50% more than traditional platforms. Top builders earn $5K-$20K+ monthly.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover-elevate transition-all">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                          <Shield className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-lg">Payment Protection</h4>
                          <p className="text-sm text-muted-foreground">
                            Smart contract escrow ensures you always get paid. Funds are locked before work starts and released per milestones.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover-elevate transition-all">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                          <Globe className="h-6 w-6 text-purple-500" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-lg">High-Quality Projects</h4>
                          <p className="text-sm text-muted-foreground">
                            Work with funded memecoin teams, Base ecosystem projects, and serious crypto clients—no tire-kickers.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover-elevate transition-all">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                          <Clock className="h-6 w-6 text-cyan-500" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-lg">Full Flexibility</h4>
                          <p className="text-sm text-muted-foreground">
                            Work from anywhere, set your own hours, choose projects you love. Perfect for full-time or side income.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover-elevate transition-all">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                          <Trophy className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-lg">Build Your Brand</h4>
                          <p className="text-sm text-muted-foreground">
                            Showcase portfolio, earn verified badges, gain 5-star reviews. Top builders become community leaders.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover-elevate transition-all">
                    <CardContent className="pt-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center flex-shrink-0">
                          <TrendingUp className="h-6 w-6 text-red-500" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-lg">Repeat Business</h4>
                          <p className="text-sm text-muted-foreground">
                            Build long-term client relationships. 70% of our builders have repeat clients and steady income streams.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* In-Demand Skills */}
              <Card className="border-primary/20 border-2">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Rocket className="h-6 w-6 text-primary" />
                    Most In-Demand Skills
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Categories earning the highest rates right now</p>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                      <Code className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="font-semibold text-sm">Smart Contract Development</p>
                        <p className="text-xs text-muted-foreground">$3K-$15K per project</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                      <Palette className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="font-semibold text-sm">Brand Design & Art</p>
                        <p className="text-xs text-muted-foreground">$500-$5K per project</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                      <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="font-semibold text-sm">Community Management</p>
                        <p className="text-xs text-muted-foreground">$1K-$4K monthly</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                      <TrendingUp className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="font-semibold text-sm">Marketing & Growth</p>
                        <p className="text-xs text-muted-foreground">$2K-$10K per campaign</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                      <BarChart className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="font-semibold text-sm">Market Making & Trading</p>
                        <p className="text-xs text-muted-foreground">$5K-$20K per project</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                      <FileText className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="font-semibold text-sm">Content Creation</p>
                        <p className="text-xs text-muted-foreground">$500-$3K per package</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* How to Join */}
              <div className="space-y-6">
                <h3 className="text-2xl md:text-3xl font-bold text-center">How to Join port444</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <Card data-testid="card-builder-step-1">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white flex items-center justify-center text-xl font-bold mb-2">
                        1
                      </div>
                      <CardTitle className="text-lg">Submit Application</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Complete your builder profile with skills, portfolio, experience, and work samples
                      </p>
                      <ul className="space-y-2 text-xs text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 mt-0.5 text-green-500" />
                          <span>15-minute application</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 mt-0.5 text-green-500" />
                          <span>No application fee</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card data-testid="card-builder-step-2">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white flex items-center justify-center text-xl font-bold mb-2">
                        2
                      </div>
                      <CardTitle className="text-lg">Get Reviewed</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Our team reviews applications for quality, expertise, and portfolio strength
                      </p>
                      <ul className="space-y-2 text-xs text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 mt-0.5 text-green-500" />
                          <span>48-hour review time</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 mt-0.5 text-green-500" />
                          <span>Email notification</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card data-testid="card-builder-step-3">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white flex items-center justify-center text-xl font-bold mb-2">
                        3
                      </div>
                      <CardTitle className="text-lg">Start Earning</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Get approved, create service listings, and start receiving project inquiries
                      </p>
                      <ul className="space-y-2 text-xs text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 mt-0.5 text-green-500" />
                          <span>Set your own rates</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 mt-0.5 text-green-500" />
                          <span>Receive instant inquiries</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Success Tips */}
              <Card className="bg-gradient-to-r from-muted/30 to-muted/10">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Award className="h-6 w-6 text-primary" />
                    Tips for Success
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <ThumbsUp className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="font-medium text-sm">Complete Your Profile</p>
                        <p className="text-xs text-muted-foreground">Profiles with portfolios get 5x more inquiries</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ThumbsUp className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="font-medium text-sm">Respond Quickly</p>
                        <p className="text-xs text-muted-foreground">Reply within 24 hours to maximize conversions</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ThumbsUp className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="font-medium text-sm">Showcase Results</p>
                        <p className="text-xs text-muted-foreground">Include case studies and metrics in portfolio</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <ThumbsUp className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="font-medium text-sm">Deliver Quality</p>
                        <p className="text-xs text-muted-foreground">5-star reviews lead to repeat clients and referrals</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="border-primary/30 border-2 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
                <CardContent className="py-12 px-6">
                  <div className="space-y-6 max-w-2xl mx-auto text-center">
                    <h3 className="text-2xl md:text-3xl font-bold">
                      Ready to Start Earning on port444?
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      Join our community of elite Web3 builders and get access to premium projects
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href="/builder-onboarding">
                        <Button size="lg" className="gap-2" data-testid="button-apply-cta">
                          Apply Now
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href="/builder-quiz">
                        <Button size="lg" variant="outline" className="gap-2 hover-elevate" data-testid="button-quiz-cta">
                          Take Readiness Quiz
                          <Sparkles className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  );
}
