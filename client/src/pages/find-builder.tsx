import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { 
  FileText, Target, TrendingUp, DollarSign, Users,
  ArrowRight, CheckCircle, Shield, Star, Zap,
  Gift, Wallet, MessageCircle, BarChart, Sparkles,
  Trophy, Clock, Globe, Code
} from "lucide-react";

export default function FindBuilder() {
  const heroSection = useScrollReveal();
  const benefitsSection = useScrollReveal();
  const howItWorksSection = useScrollReveal();
  const statsSection = useScrollReveal();
  const ctaSection = useScrollReveal();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section
        ref={heroSection.ref as any}
        className={`relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-primary/5 pt-32 pb-16 px-4 ${heroSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />
        
        <div className="container relative mx-auto max-w-6xl">
          <div className="text-center space-y-6">
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
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              Turn Your Web3 Skills
              <span className="block mt-2 bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
                Into Consistent Income
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join Create.psx and connect with memecoin and crypto projects looking for your expertise. 
              Get paid in USDC with secure escrow protection.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/builder-quiz">
                <Button size="lg" className="gap-2 text-base" data-testid="button-start-quiz">
                  Start Readiness Quiz
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/builder-onboarding">
                <Button size="lg" variant="outline" className="gap-2 text-base hover-elevate" data-testid="button-apply-now">
                  Apply Now
                  <FileText className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        ref={statsSection.ref as any}
        className={`border-b py-12 ${statsSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}
      >
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6 space-y-2">
                <div className="text-3xl font-bold text-primary">$2.5M+</div>
                <div className="text-sm text-muted-foreground">Total Earnings Paid</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6 space-y-2">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Active Builders</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6 space-y-2">
                <div className="text-3xl font-bold text-primary">2,000+</div>
                <div className="text-sm text-muted-foreground">Projects Completed</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6 space-y-2">
                <div className="text-3xl font-bold text-primary">4.9★</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        ref={benefitsSection.ref as any}
        className={`border-b py-16 ${benefitsSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}
      >
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Why Join Create.psx?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We provide everything you need to succeed as a Web3 builder
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-2">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10 mb-3">
                  <Shield className="h-6 w-6 text-chart-3" />
                </div>
                <CardTitle>Secure Escrow Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Get paid in USDC with smart contract escrow protection. Funds are guaranteed when you complete milestones.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10 mb-3">
                  <Users className="h-6 w-6 text-chart-2" />
                </div>
                <CardTitle>Quality Clients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Work with verified crypto projects and memecoins. All clients are vetted and committed to quality work.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10 mb-3">
                  <DollarSign className="h-6 w-6 text-chart-4" />
                </div>
                <CardTitle>Set Your Own Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  You control your pricing. Create service packages or custom quotes based on project complexity.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Build Your Reputation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Earn reviews and ratings from clients. Top-rated builders get featured placement and more opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-1/10 mb-3">
                  <Globe className="h-6 w-6 text-chart-1" />
                </div>
                <CardTitle>Work Remotely</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Connect with global clients from anywhere. Full flexibility to work on your own schedule.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-5/10 mb-3">
                  <Sparkles className="h-6 w-6 text-chart-5" />
                </div>
                <CardTitle>Low Platform Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Keep more of what you earn. Only 10% platform fee, with special rates for $CREATE and $PSX holders.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        ref={howItWorksSection.ref as any}
        className={`border-b py-16 bg-gradient-to-br from-primary/5 via-chart-2/5 to-background ${howItWorksSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}
      >
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started as a builder in 4 simple steps
            </p>
          </div>

          <div className="grid gap-6">
            <Card data-testid="card-how-step-1">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-primary to-chart-2 text-white text-xl font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Take the Quiz & Apply
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Start with our 5-minute readiness quiz to assess your fit. Then complete the full application with your portfolio, skills, and experience.
                </p>
                <div className="flex gap-3">
                  <Link href="/builder-quiz">
                    <Button variant="outline" className="gap-2 hover-elevate" data-testid="button-quiz">
                      Start Quiz
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card data-testid="card-how-step-2">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-primary to-chart-2 text-white text-xl font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Get Approved
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our team reviews all applications within 2-3 business days. We look for quality builders with proven experience and professional portfolios.
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-how-step-3">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-primary to-chart-2 text-white text-xl font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Create Your Profile
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Once approved, complete your builder profile with services, pricing, portfolio, and availability. Add photos, videos, and case studies to stand out.
                </p>
              </CardContent>
            </Card>

            <Card data-testid="card-how-step-4">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-primary to-chart-2 text-white text-xl font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Start Earning
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Clients will discover your profile and reach out for projects. Negotiate terms, agree on milestones, and get paid securely in USDC when you deliver.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="border-b py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Builder Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're looking for talented builders across all Web3 specialties
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: Code, name: "Developers" },
              { icon: Palette, name: "3D Artists" },
              { icon: Users, name: "KOLs & Influencers" },
              { icon: TrendingUp, name: "Marketers" },
              { icon: BarChart, name: "Volume Traders" },
              { icon: Sparkles, name: "Designers" },
              { icon: MessageCircle, name: "Social Media" },
              { icon: FileText, name: "Documentation" },
            ].map((category, i) => (
              <Card key={i} className="hover-elevate">
                <CardContent className="p-4 text-center space-y-2">
                  <category.icon className="h-8 w-8 text-primary mx-auto" />
                  <p className="font-medium text-sm">{category.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        ref={ctaSection.ref as any}
        className={`py-16 bg-gradient-to-r from-primary/10 via-chart-2/10 to-chart-3/10 ${ctaSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}
      >
        <div className="container mx-auto max-w-4xl px-4">
          <Card className="border-2">
            <CardContent className="p-8 md:p-12 text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
                <Zap className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Join Today</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Start Earning?
              </h2>
              
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join hundreds of builders earning consistent income on Create.psx. 
                Take the quiz to see if you're ready, or apply directly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/builder-quiz">
                  <Button size="lg" className="gap-2 text-base" data-testid="button-cta-quiz">
                    <Star className="h-4 w-4" />
                    Take Readiness Quiz
                  </Button>
                </Link>
                <Link href="/builder-onboarding">
                  <Button size="lg" variant="outline" className="gap-2 text-base hover-elevate" data-testid="button-cta-apply">
                    <FileText className="h-4 w-4" />
                    Apply Now
                  </Button>
                </Link>
              </div>

              <div className="flex items-center justify-center gap-4 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>2-3 day review</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Secure payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <span>USDC earnings</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

// Import the Palette icon that was missing
import { Palette } from "lucide-react";
