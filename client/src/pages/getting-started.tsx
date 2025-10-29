import { useEffect, useRef } from "react";
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
  Trophy, Globe, Clock, Palette, Code, BarChart, Rocket
} from "lucide-react";

export default function GettingStarted() {
  // Parallax effect for hero section
  useEffect(() => {
    let ticking = false;
    
    const applyParallax = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      const heroSection = document.getElementById('gs-hero-section');
      const heroBlob1 = document.getElementById('gs-hero-blob-1');
      const heroBlob2 = document.getElementById('gs-hero-blob-2');
      const heroTitle = document.getElementById('gs-hero-title');
      const heroDescription = document.getElementById('gs-hero-description');
      
      if (heroSection) {
        const heroProgress = Math.min(1, scrollY / (windowHeight * 0.6));
        heroSection.style.opacity = `${1 - (heroProgress * 0.5)}`;
      }
      
      if (heroBlob1) {
        heroBlob1.style.transform = `translate3d(0, ${scrollY * 0.5}px, 0)`;
      }
      if (heroBlob2) {
        heroBlob2.style.transform = `translate3d(0, ${scrollY * 0.3}px, 0)`;
      }
      if (heroTitle) {
        heroTitle.style.transform = `translate3d(0, ${-scrollY * 0.3}px, 0)`;
      }
      if (heroDescription) {
        heroDescription.style.transform = `translate3d(0, ${-scrollY * 0.2}px, 0)`;
      }
      
      ticking = false;
    };
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(applyParallax);
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    applyParallax();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section with Parallax */}
      <section 
        id="gs-hero-section"
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-16"
        style={{ willChange: 'opacity' }}
      >
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            id="gs-hero-blob-1"
            className="absolute top-20 -left-40 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl"
            style={{ willChange: 'transform' }}
          />
          <div 
            id="gs-hero-blob-2"
            className="absolute bottom-20 -right-40 w-96 h-96 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl"
            style={{ willChange: 'transform' }}
          />
        </div>

        <div className="container relative z-10 mx-auto max-w-4xl px-4 py-16 md:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <Badge variant="outline" className="gap-2 border-primary/40 bg-primary/10 text-primary text-sm px-4 py-1.5">
              <Rocket className="h-4 w-4" />
              Start Your Journey
            </Badge>
            
            <h1 
              id="gs-hero-title"
              className="text-5xl md:text-7xl font-bold tracking-tight"
              style={{ willChange: 'transform' }}
            >
              Getting Started
              <span className="block mt-3 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 bg-clip-text text-transparent">
                with PSX
              </span>
            </h1>
            
            <p 
              id="gs-hero-description"
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              style={{ willChange: 'transform' }}
            >
              Everything you need to know to start building or hiring on the premier Web3 talent marketplace
            </p>
          </div>
        </div>

        {/* Gradient Transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-background pointer-events-none" />
      </section>

      {/* Main Content */}
      <section className="relative bg-gradient-to-b from-background via-background to-muted/10 py-24">
        <div className="container mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
          <Tabs defaultValue="client" className="space-y-12">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-12">
              <TabsTrigger value="client" className="text-base gap-2" data-testid="tab-client">
                <Users className="h-4 w-4" />
                I'm a Client
              </TabsTrigger>
              <TabsTrigger value="builder" className="text-base gap-2" data-testid="tab-builder">
                <TrendingUp className="h-4 w-4" />
                I'm a Builder
              </TabsTrigger>
            </TabsList>

            {/* Client Tab */}
            <TabsContent value="client" className="space-y-12" data-testid="content-client">
              <div className="space-y-10">
                <div className="text-center space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold">Client Quick Start</h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Start hiring top Web3 builders in minutes
                  </p>
                </div>

                {/* Step 1: Setup Wallet */}
                <Card data-testid="card-client-step-1" className="border-border/50 overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-cyan-500" />
                  <CardHeader className="pb-6">
                    <div className="flex items-start gap-6">
                      <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-2xl font-bold flex-shrink-0 shadow-lg">
                        1
                      </div>
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-3 text-2xl mb-2">
                          <Wallet className="h-6 w-6 text-primary" />
                          Set Up Your Wallet
                        </CardTitle>
                        <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400">
                          Required
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-0">
                    <p className="text-lg text-muted-foreground">
                      Connect a Web3 wallet that holds $CREATE or $PSX tokens to access the marketplace.
                    </p>
                    <div className="bg-muted/50 rounded-xl p-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="font-semibold text-base">Install a Web3 Wallet</p>
                          <p className="text-sm text-muted-foreground">We support MetaMask, Coinbase Wallet, Rainbow, Rabby, Phantom, OKX, and more</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="font-semibold text-base">Acquire Tokens</p>
                          <p className="text-sm text-muted-foreground">Buy $CREATE or $PSX tokens on Base network via Uniswap or other DEXs</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="font-semibold text-base">Connect to Platform</p>
                          <p className="text-sm text-muted-foreground">Click "Connect Wallet" in the header to link your wallet and verify token holdings</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                      <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Token Requirement:</span> You need to hold the minimum amount of EITHER $CREATE OR $PSX (not both) to access client features.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Step 2: Browse Builders */}
                <Card data-testid="card-client-step-2" className="border-border/50 overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-cyan-500" />
                  <CardHeader className="pb-6">
                    <div className="flex items-start gap-6">
                      <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-2xl font-bold flex-shrink-0 shadow-lg">
                        2
                      </div>
                      <div>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                          <Search className="h-6 w-6 text-primary" />
                          Find the Right Builder
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-0">
                    <p className="text-lg text-muted-foreground">
                      Search our vetted builder directory using powerful filters to find the perfect match.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <p className="font-semibold text-base">Search Options:</p>
                        <ul className="space-y-2.5">
                          <li className="flex items-start gap-3 text-sm text-muted-foreground">
                            <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                            <span>Browse by category (Design, Development, Marketing, etc.)</span>
                          </li>
                          <li className="flex items-start gap-3 text-sm text-muted-foreground">
                            <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                            <span>Filter by skills, tools, and technologies</span>
                          </li>
                          <li className="flex items-start gap-3 text-sm text-muted-foreground">
                            <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                            <span>Sort by rating, price, or delivery time</span>
                          </li>
                          <li className="flex items-start gap-3 text-sm text-muted-foreground">
                            <ArrowRight className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                            <span>View portfolios and previous work</span>
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-3">
                        <p className="font-semibold text-base">What to Look For:</p>
                        <ul className="space-y-2.5">
                          <li className="flex items-start gap-3 text-sm text-muted-foreground">
                            <Star className="h-4 w-4 mt-0.5 text-yellow-500 flex-shrink-0" />
                            <span>High ratings from verified clients</span>
                          </li>
                          <li className="flex items-start gap-3 text-sm text-muted-foreground">
                            <Shield className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                            <span>Verified badge and complete profile</span>
                          </li>
                          <li className="flex items-start gap-3 text-sm text-muted-foreground">
                            <FileText className="h-4 w-4 mt-0.5 text-blue-500 flex-shrink-0" />
                            <span>Detailed portfolio with case studies</span>
                          </li>
                          <li className="flex items-start gap-3 text-sm text-muted-foreground">
                            <MessageCircle className="h-4 w-4 mt-0.5 text-purple-500 flex-shrink-0" />
                            <span>Fast response time</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Link href="/marketplace">
                        <Button size="lg" className="gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600" data-testid="button-browse-builders">
                          Browse Marketplace
                          <Search className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Builder Finder */}
                <Card data-testid="card-ai-finder" className="border-primary/30 border-2 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
                  <CardHeader className="pb-6">
                    <div className="flex items-start gap-6">
                      <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white flex-shrink-0 shadow-lg">
                        <Sparkles className="h-7 w-7" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-3 text-2xl mb-2">
                          <Sparkles className="h-6 w-6 text-primary" />
                          AI-Powered Builder Matching
                        </CardTitle>
                        <Badge className="gap-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 border-0">
                          <Zap className="h-3 w-3" />
                          Smart Recommendations
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-0">
                    <p className="text-lg text-muted-foreground">
                      Not sure which builder is right for you? Use our AI-powered matching tool to get personalized recommendations based on your project needs.
                    </p>
                    
                    <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-xl p-6 space-y-4">
                      <div className="flex items-start gap-4">
                        <Target className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="font-semibold text-base">Precise Matching</p>
                          <p className="text-sm text-muted-foreground">Answer a few questions about your project and our AI will find builders with the exact skills you need</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Zap className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div className="space-y-1">
                          <p className="font-semibold text-base">Instant Results</p>
                          <p className="text-sm text-muted-foreground">Get personalized builder recommendations in seconds, complete with ratings and portfolios</p>
                        </div>
                      </div>
                    </div>

                    <FindBuilderWizard />
                  </CardContent>
                </Card>

                {/* Remaining Steps - Condensed */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Step 3: Contact & Hire */}
                  <Card data-testid="card-client-step-3" className="border-border/50">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-xl font-bold flex-shrink-0">
                          3
                        </div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <MessageCircle className="h-5 w-5 text-primary" />
                          Contact & Negotiate
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Message builders directly to discuss your project requirements and finalize details.
                      </p>
                      <ul className="space-y-2.5 text-sm text-muted-foreground">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                          <span>Describe your project clearly</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                          <span>Review proposals and pricing</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                          <span>Agree on milestones</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Step 4: Payment & Escrow */}
                  <Card data-testid="card-client-step-4" className="border-border/50">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-xl font-bold flex-shrink-0">
                          4
                        </div>
                        <CardTitle className="flex items-center gap-2 text-xl">
                          <DollarSign className="h-5 w-5 text-primary" />
                          Secure Payment
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">
                        Fund your project securely with USDC on Base blockchain using smart contract escrow.
                      </p>
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-green-500" />
                          <p className="font-semibold text-sm">Protected by Escrow</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Your payment is held in a smart contract and only released when you approve completed milestones.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Step 5: Review Work */}
                  <Card data-testid="card-client-step-5" className="border-border/50 md:col-span-2">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-xl font-bold flex-shrink-0">
                          5
                        </div>
                        <div>
                          <CardTitle className="flex items-center gap-2 text-xl">
                            <Star className="h-5 w-5 text-primary" />
                            Review & Rate
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            After project completion, leave a review to help maintain platform quality
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3">
                          <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <div className="space-y-1">
                            <p className="font-medium text-sm">Rate Experience</p>
                            <p className="text-xs text-muted-foreground">1-5 stars for quality and timeliness</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MessageCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div className="space-y-1">
                            <p className="font-medium text-sm">Share Feedback</p>
                            <p className="text-xs text-muted-foreground">Help other clients with details</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Shield className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div className="space-y-1">
                            <p className="font-medium text-sm">Build Reputation</p>
                            <p className="text-xs text-muted-foreground">Quality builders gain visibility</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Client Resources */}
              <div className="mt-16 pt-12 border-t border-border/50">
                <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">Helpful Resources</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <Link href="/marketplace" data-testid="link-resource-marketplace">
                    <Card className="hover-elevate cursor-pointer h-full border-border/50 transition-all duration-300">
                      <CardContent className="p-8 text-center space-y-4">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mx-auto">
                          <Search className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-semibold text-lg">Browse Marketplace</p>
                          <p className="text-sm text-muted-foreground">Start exploring builders now</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/how-it-works" data-testid="link-resource-how-it-works">
                    <Card className="hover-elevate cursor-pointer h-full border-border/50 transition-all duration-300">
                      <CardContent className="p-8 text-center space-y-4">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mx-auto">
                          <Book className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-semibold text-lg">How It Works</p>
                          <p className="text-sm text-muted-foreground">Learn the complete workflow</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                  <Link href="/faq" data-testid="link-resource-faq">
                    <Card className="hover-elevate cursor-pointer h-full border-border/50 transition-all duration-300">
                      <CardContent className="p-8 text-center space-y-4">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center mx-auto">
                          <HelpCircle className="h-8 w-8 text-primary" />
                        </div>
                        <div className="space-y-2">
                          <p className="font-semibold text-lg">FAQ</p>
                          <p className="text-sm text-muted-foreground">Find answers to questions</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              </div>
            </TabsContent>

            {/* Builder Tab */}
            <TabsContent value="builder" className="space-y-12" data-testid="content-builder">
              <div className="space-y-10">
                {/* Builder Hero */}
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <Badge variant="outline" className="gap-1.5 border-primary/40 bg-primary/10 text-primary">
                      <Trophy className="h-3 w-3" />
                      Join Elite Builders
                    </Badge>
                    <Badge className="gap-1.5 bg-gradient-to-r from-purple-500 to-cyan-500 border-0">
                      <Sparkles className="h-3 w-3" />
                      Earn with Web3 Projects
                    </Badge>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                    Turn Your Web3 Skills Into
                    <span className="block mt-2 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 bg-clip-text text-transparent">
                      Consistent Income
                    </span>
                  </h2>
                  
                  <p className="text-lg md:text-xl text-muted-foreground">
                    Join PSX and connect with memecoin and crypto projects looking for your expertise. 
                    Get paid in USDC with secure escrow protection.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link href="/builder-quiz">
                      <Button size="lg" className="gap-2 text-base bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600" data-testid="button-builder-quiz">
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="text-center border-border/50">
                    <CardContent className="pt-6 space-y-2">
                      <div className="text-3xl font-bold text-primary">500+</div>
                      <div className="text-sm text-muted-foreground">Active Builders</div>
                    </CardContent>
                  </Card>
                  <Card className="text-center border-border/50">
                    <CardContent className="pt-6 space-y-2">
                      <div className="text-3xl font-bold text-primary">$2.5M+</div>
                      <div className="text-sm text-muted-foreground">Paid Out</div>
                    </CardContent>
                  </Card>
                  <Card className="text-center border-border/50">
                    <CardContent className="pt-6 space-y-2">
                      <div className="text-3xl font-bold text-primary">95%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </CardContent>
                  </Card>
                  <Card className="text-center border-border/50">
                    <CardContent className="pt-6 space-y-2">
                      <div className="text-3xl font-bold text-primary">4.9★</div>
                      <div className="text-sm text-muted-foreground">Avg Rating</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Why Join PSX */}
                <Card className="border-primary/20 border-2 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
                  <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Trophy className="h-6 w-6 text-primary" />
                      Why Join PSX?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center flex-shrink-0">
                            <DollarSign className="h-5 w-5 text-green-500" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold">Competitive Earnings</p>
                            <p className="text-sm text-muted-foreground">Set your own rates and earn USDC directly</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                            <Globe className="h-5 w-5 text-purple-500" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold">Global Client Base</p>
                            <p className="text-sm text-muted-foreground">Access projects from around the world</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                            <Shield className="h-5 w-5 text-blue-500" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold">Payment Protection</p>
                            <p className="text-sm text-muted-foreground">Smart contract escrow ensures you get paid</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                            <Clock className="h-5 w-5 text-cyan-500" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold">Flexible Schedule</p>
                            <p className="text-sm text-muted-foreground">Work on your own terms and timeline</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                            <Trophy className="h-5 w-5 text-yellow-500" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold">Build Your Brand</p>
                            <p className="text-sm text-muted-foreground">Showcase your portfolio and gain recognition</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="h-5 w-5 text-red-500" />
                          </div>
                          <div className="space-y-1">
                            <p className="font-semibold">Growth Opportunities</p>
                            <p className="text-sm text-muted-foreground">Access to high-value Web3 projects</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Application Process */}
                <div className="space-y-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-center">Simple Application Process</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card className="border-border/50">
                      <CardHeader>
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white flex items-center justify-center text-xl font-bold mb-2">
                          1
                        </div>
                        <CardTitle className="text-lg">Complete Application</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Fill out your profile with skills, experience, and portfolio samples
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-border/50">
                      <CardHeader>
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white flex items-center justify-center text-xl font-bold mb-2">
                          2
                        </div>
                        <CardTitle className="text-lg">Review Process</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Our team reviews your application within 48 hours
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-border/50">
                      <CardHeader>
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 text-white flex items-center justify-center text-xl font-bold mb-2">
                          3
                        </div>
                        <CardTitle className="text-lg">Start Earning</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Get approved and start receiving project opportunities
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* CTA */}
                <div className="text-center pt-8">
                  <Card className="border-primary/30 border-2 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
                    <CardContent className="py-12 px-6">
                      <div className="space-y-6 max-w-2xl mx-auto">
                        <h3 className="text-2xl md:text-3xl font-bold">
                          Ready to Start Your Builder Journey?
                        </h3>
                        <p className="text-lg text-muted-foreground">
                          Join hundreds of talented builders earning on PSX
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Link href="/builder-onboarding">
                            <Button size="lg" className="gap-2 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600">
                              Apply Now
                              <ArrowRight className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href="/builder-quiz">
                            <Button size="lg" variant="outline" className="gap-2 hover-elevate">
                              Take Readiness Quiz
                              <Sparkles className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>
    </div>
  );
}
