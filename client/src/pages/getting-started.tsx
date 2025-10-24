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
  ArrowRight, AlertCircle, Book, Play, HelpCircle, Sparkles,
  Trophy, Globe, Clock, Palette, Code, BarChart
} from "lucide-react";

export default function GettingStarted() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Getting Started
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know to start using port444
          </p>
        </div>

        <Tabs defaultValue="client" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="client" data-testid="tab-client">
              <Users className="h-4 w-4 mr-2" />
              I'm a Client
            </TabsTrigger>
            <TabsTrigger value="builder" data-testid="tab-builder">
              <TrendingUp className="h-4 w-4 mr-2" />
              I'm a Builder
            </TabsTrigger>
          </TabsList>

          {/* Client Tab */}
          <TabsContent value="client" className="space-y-8" data-testid="content-client">
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Client Quick Start</h2>
                <p className="text-muted-foreground">
                  Start hiring top Web3 builders in minutes
                </p>
              </div>

              {/* Step 1: Setup Wallet */}
              <Card data-testid="card-client-step-1">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-xl font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Wallet className="h-5 w-5" />
                        Set Up Your Wallet
                      </CardTitle>
                      <Badge variant="outline" className="mt-2">Required</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Connect a Web3 wallet that holds $CREATE or $PSX tokens to access the marketplace.
                  </p>
                  <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Install a Web3 Wallet</p>
                        <p className="text-sm text-muted-foreground">We support MetaMask, Coinbase Wallet, Rainbow, Rabby, Phantom, OKX, and more</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Acquire Tokens</p>
                        <p className="text-sm text-muted-foreground">Buy $CREATE or $PSX tokens on Base network via Uniswap or other DEXs</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Connect to Platform</p>
                        <p className="text-sm text-muted-foreground">Click "Connect Wallet" in the header to link your wallet and verify token holdings</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Token Requirement:</span> You need to hold the minimum amount of EITHER $CREATE OR $PSX (not both) to access client features.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Browse Builders */}
              <Card data-testid="card-client-step-2">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-xl font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Search className="h-5 w-5" />
                        Find the Right Builder
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Search our vetted builder directory using powerful filters to find the perfect match.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="font-medium">Search Options:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Browse by category (Design, Development, Marketing, etc.)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Filter by skills, tools, and technologies</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Sort by rating, price, or delivery time</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>View portfolios and previous work</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium">What to Look For:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                        <li className="flex items-start gap-2">
                          <Star className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                          <span>High ratings from verified clients</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Shield className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                          <span>Verified badge and complete profile</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <FileText className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                          <span>Detailed portfolio with case studies</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <MessageCircle className="h-4 w-4 mt-0.5 text-purple-500 flex-shrink-0" />
                          <span>Fast response time</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Link href="/marketplace">
                      <Button className="gap-2" data-testid="button-browse-builders">
                        Browse Marketplace
                        <Search className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* AI Builder Finder */}
              <Card data-testid="card-ai-finder" className="border-primary/20 border-2">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-white flex-shrink-0">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        AI-Powered Builder Matching
                      </CardTitle>
                      <Badge variant="secondary" className="mt-2 gap-1.5">
                        <Zap className="h-3 w-3" />
                        Smart Recommendations
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Not sure which builder is right for you? Use our AI-powered matching tool to get personalized recommendations based on your project needs.
                  </p>
                  
                  <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-lg p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Precise Matching</p>
                        <p className="text-sm text-muted-foreground">Answer a few questions about your project and our AI will find builders with the exact skills you need</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Zap className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Instant Results</p>
                        <p className="text-sm text-muted-foreground">Get personalized builder recommendations in seconds, complete with ratings and portfolios</p>
                      </div>
                    </div>
                  </div>

                  <FindBuilderWizard />
                </CardContent>
              </Card>

              {/* Step 3: Contact & Hire */}
              <Card data-testid="card-client-step-3">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-xl font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Contact & Negotiate
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Message builders directly to discuss your project requirements and finalize details.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Play className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Describe Your Project</p>
                        <p className="text-sm text-muted-foreground">Share clear requirements, timeline expectations, and budget range</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Play className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Review Proposals</p>
                        <p className="text-sm text-muted-foreground">Compare builder proposals, pricing, and delivery timelines</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Play className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">Agree on Milestones</p>
                        <p className="text-sm text-muted-foreground">Break the project into clear milestones with defined deliverables</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Step 4: Payment & Escrow */}
              <Card data-testid="card-client-step-4">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-xl font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Secure Payment
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Fund your project securely with USDC on Base blockchain using smart contract escrow.
                  </p>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-500" />
                      <p className="font-medium">Protected by Escrow</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your payment is held in a smart contract and only released to the builder when you approve completed milestones. This ensures you only pay for work that meets your requirements.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Payment Process:</p>
                    <ol className="text-sm text-muted-foreground space-y-2 pl-4">
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-foreground">1.</span>
                        <span>Add USDC to your Base wallet</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-foreground">2.</span>
                        <span>Fund the project escrow (one-time or per milestone)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-foreground">3.</span>
                        <span>Review and approve completed work</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-foreground">4.</span>
                        <span>Funds automatically release to builder upon approval</span>
                      </li>
                    </ol>
                  </div>
                </CardContent>
              </Card>

              {/* Step 5: Review Work */}
              <Card data-testid="card-client-step-5">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-xl font-bold flex-shrink-0">
                      5
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5" />
                        Review & Rate
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    After project completion, leave a review to help maintain platform quality.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Rate Overall Experience</p>
                        <p className="text-sm text-muted-foreground">1-5 stars based on quality, communication, and timeliness</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MessageCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Share Detailed Feedback</p>
                        <p className="text-sm text-muted-foreground">Help other clients by describing your experience</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Build Builder Reputation</p>
                        <p className="text-sm text-muted-foreground">Your reviews help quality builders gain visibility</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Client Resources */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-2xl font-bold mb-6">Helpful Resources</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/how-it-works" data-testid="link-resource-how-it-works">
                  <Card className="hover-elevate cursor-pointer h-full">
                    <CardContent className="p-6 text-center space-y-3">
                      <Book className="h-8 w-8 text-primary mx-auto" />
                      <p className="font-medium">How It Works</p>
                      <p className="text-sm text-muted-foreground">Learn the complete platform workflow</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/faq" data-testid="link-resource-faq">
                  <Card className="hover-elevate cursor-pointer h-full">
                    <CardContent className="p-6 text-center space-y-3">
                      <HelpCircle className="h-8 w-8 text-primary mx-auto" />
                      <p className="font-medium">FAQ</p>
                      <p className="text-sm text-muted-foreground">Find answers to common questions</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/marketplace" data-testid="link-resource-marketplace">
                  <Card className="hover-elevate cursor-pointer h-full">
                    <CardContent className="p-6 text-center space-y-3">
                      <Search className="h-8 w-8 text-primary mx-auto" />
                      <p className="font-medium">Browse Marketplace</p>
                      <p className="text-sm text-muted-foreground">Start exploring builders now</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </TabsContent>

          {/* Builder Tab */}
          <TabsContent value="builder" className="space-y-8" data-testid="content-builder">
            <div className="space-y-6">
              {/* Builder Hero */}
              <div className="text-center mb-8 space-y-6">
                <div className="flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline" className="gap-1.5 border-primary/40 bg-primary/10 text-primary">
                    <Trophy className="h-3 w-3" />
                    Join Elite Builders
                  </Badge>
                  <Badge variant="default" className="gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    Earn with Web3 Projects
                  </Badge>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold">
                  Turn Your Web3 Skills
                  <span className="block mt-2 bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                    Into Consistent Income
                  </span>
                </h2>
                
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Join port444 and connect with memecoin and crypto projects looking for your expertise. 
                  Get paid in USDC with secure escrow protection.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/builder-quiz">
                    <Button size="lg" className="gap-2 text-base" data-testid="button-builder-quiz">
                      Start Readiness Quiz
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/builder-onboarding">
                    <Button size="lg" variant="outline" className="gap-2 text-base hover-elevate" data-testid="button-builder-apply">
                      Apply Now
                      <FileText className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Card className="text-center">
                  <CardContent className="pt-4 space-y-1">
                    <div className="text-2xl font-bold text-primary">$2.5M+</div>
                    <div className="text-xs text-muted-foreground">Total Earnings Paid</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-4 space-y-1">
                    <div className="text-2xl font-bold text-primary">500+</div>
                    <div className="text-xs text-muted-foreground">Active Builders</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-4 space-y-1">
                    <div className="text-2xl font-bold text-primary">2,000+</div>
                    <div className="text-xs text-muted-foreground">Projects Completed</div>
                  </CardContent>
                </Card>
                <Card className="text-center">
                  <CardContent className="pt-4 space-y-1">
                    <div className="text-2xl font-bold text-primary">4.9★</div>
                    <div className="text-xs text-muted-foreground">Average Rating</div>
                  </CardContent>
                </Card>
              </div>

              {/* Why Join */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-6 text-center">Why Join port444?</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border-2">
                    <CardHeader>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-3/10 mb-2">
                        <Shield className="h-5 w-5 text-chart-3" />
                      </div>
                      <CardTitle className="text-base">Secure Escrow Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Get paid in USDC with smart contract escrow. Funds guaranteed when you complete milestones.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardHeader>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-2/10 mb-2">
                        <Users className="h-5 w-5 text-chart-2" />
                      </div>
                      <CardTitle className="text-base">Quality Clients</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Work with verified crypto projects and memecoins. All clients are vetted.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardHeader>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10 mb-2">
                        <DollarSign className="h-5 w-5 text-chart-4" />
                      </div>
                      <CardTitle className="text-base">Set Your Own Rates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        You control your pricing. Create packages or custom quotes.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardHeader>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-2">
                        <Trophy className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-base">Build Your Reputation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Earn reviews and ratings. Top builders get featured placement.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardHeader>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-1/10 mb-2">
                        <Globe className="h-5 w-5 text-chart-1" />
                      </div>
                      <CardTitle className="text-base">Work Remotely</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Connect with global clients from anywhere. Full flexibility.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2">
                    <CardHeader>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-5/10 mb-2">
                        <Sparkles className="h-5 w-5 text-chart-5" />
                      </div>
                      <CardTitle className="text-base">Low Platform Fees</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Only 10% platform fee, with special rates for token holders.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">How It Works</h3>
                <p className="text-muted-foreground">
                  Get started as a builder in 4 simple steps
                </p>
              </div>

              {/* Builder Step 1 */}
              <Card data-testid="card-builder-step-1">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 text-white text-xl font-bold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Submit Application
                      </CardTitle>
                      <Badge variant="outline" className="mt-2">Required</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Apply to become a verified builder on the platform. We review all applications to ensure quality.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Take the Readiness Quiz</p>
                        <p className="text-sm text-muted-foreground">Quick 5-minute assessment to see if you're ready</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Complete Application Form</p>
                        <p className="text-sm text-muted-foreground">Share your experience, skills, and portfolio</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Wait for Approval</p>
                        <p className="text-sm text-muted-foreground">Typically reviewed within 2-3 business days</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Link href="/builder-quiz">
                      <Button className="gap-2" data-testid="button-start-quiz">
                        Start Readiness Quiz
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Builder Step 2 */}
              <Card data-testid="card-builder-step-2">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 text-white text-xl font-bold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Create Your Profile
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Build a compelling profile that showcases your expertise and attracts quality clients.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="font-medium">Profile Essentials:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Professional photo and bio</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Skills, tools, and technologies</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Portfolio with case studies</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Service offerings and pricing</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium">Stand Out:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                        <li className="flex items-start gap-2">
                          <Zap className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                          <span>Detailed project descriptions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Zap className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                          <span>Client testimonials</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Zap className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                          <span>Response time commitments</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Zap className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                          <span>Competitive pricing tiers</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Builder Step 3 */}
              <Card data-testid="card-builder-step-3">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 text-white text-xl font-bold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Respond to Inquiries
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    When clients reach out, respond promptly with professional proposals to win projects.
                  </p>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-blue-500" />
                      <p className="font-medium">Speed Matters</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Builders who respond within 24 hours are 3x more likely to win projects. Enable notifications to never miss an opportunity.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Best Practices:</p>
                    <ul className="text-sm text-muted-foreground space-y-2 pl-4">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>Ask clarifying questions about requirements</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>Provide detailed timeline and milestone breakdown</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>Share relevant portfolio examples</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                        <span>Be transparent about pricing and fees</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Builder Step 4 */}
              <Card data-testid="card-builder-step-4">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 text-white text-xl font-bold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Deliver Quality Work
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Use platform tools to manage projects, submit deliverables, and communicate progress.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="font-medium">Project Management:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Track milestones and deadlines</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Upload deliverables for review</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Handle revision requests</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span>Maintain clear communication</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium">Quality Standards:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                        <li className="flex items-start gap-2">
                          <Star className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                          <span>Meet all requirements</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Star className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                          <span>Hit agreed deadlines</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Star className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                          <span>Provide regular updates</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Star className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                          <span>Exceed client expectations</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Builder Step 5 */}
              <Card data-testid="card-builder-step-5">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 text-white text-xl font-bold flex-shrink-0">
                      5
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Get Paid Securely
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Receive USDC payments directly to your wallet when clients approve milestones.
                  </p>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-green-500" />
                      <p className="font-medium">Payment Protection</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Escrow ensures you get paid for all approved work. Only a 2.5% platform fee is deducted - you keep 97.5% of your earnings.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">Payment Flow:</p>
                    <ol className="text-sm text-muted-foreground space-y-2 pl-4">
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-foreground">1.</span>
                        <span>Client funds project escrow</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-foreground">2.</span>
                        <span>You complete and submit milestone</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-foreground">3.</span>
                        <span>Client reviews and approves work</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-bold text-foreground">4.</span>
                        <span>Payment automatically released to your wallet</span>
                      </li>
                    </ol>
                  </div>
                </CardContent>
              </Card>

              {/* Builder Step 6 */}
              <Card data-testid="card-builder-step-6">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 text-white text-xl font-bold flex-shrink-0">
                      6
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Build Your Reputation
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    Grow your builder profile through positive reviews and successful projects.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="font-medium">Reputation Benefits:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                        <li className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                          <span>Higher search rankings</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                          <span>Featured placements</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                          <span>Premium badge</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                          <span>Increased rates</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium">Maintain Quality:</p>
                      <ul className="text-sm text-muted-foreground space-y-1 pl-4">
                        <li className="flex items-start gap-2">
                          <Star className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                          <span>4.5+ average rating</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Star className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                          <span>90%+ on-time delivery</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Star className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                          <span>Fast response times</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Star className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                          <span>Professional communication</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Builder Resources */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-2xl font-bold mb-6">Helpful Resources</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/builder-quiz" data-testid="link-resource-quiz">
                  <Card className="hover-elevate cursor-pointer h-full">
                    <CardContent className="p-6 text-center space-y-3">
                      <Target className="h-8 w-8 text-primary mx-auto" />
                      <p className="font-medium">Readiness Quiz</p>
                      <p className="text-sm text-muted-foreground">See if you're ready to apply</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/builders" data-testid="link-resource-builders">
                  <Card className="hover-elevate cursor-pointer h-full">
                    <CardContent className="p-6 text-center space-y-3">
                      <Users className="h-8 w-8 text-primary mx-auto" />
                      <p className="font-medium">Builder Landing</p>
                      <p className="text-sm text-muted-foreground">Learn more about building on the platform</p>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/faq" data-testid="link-resource-faq-builder">
                  <Card className="hover-elevate cursor-pointer h-full">
                    <CardContent className="p-6 text-center space-y-3">
                      <HelpCircle className="h-8 w-8 text-primary mx-auto" />
                      <p className="font-medium">FAQ</p>
                      <p className="text-sm text-muted-foreground">Find answers to common questions</p>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
