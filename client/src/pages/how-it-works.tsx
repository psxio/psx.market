import { Header } from "@/components/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Wallet, Search, MessageCircle, DollarSign, Star, Shield,
  CheckCircle, FileText, Target, TrendingUp, Users, Zap, Gift, Lock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            How Create.psx Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your complete guide to navigating the premier Web3 builder marketplace
          </p>
        </div>

        {/* For Clients Section */}
        <section className="mb-16" data-testid="section-for-clients">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">For Clients</h2>
            <p className="text-muted-foreground">
              Find and hire top-tier Web3 builders for your project
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="hover-elevate" data-testid="card-client-step-1">
              <CardHeader>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-2xl font-bold mb-4">
                  1
                </div>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Connect Wallet
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Connect your Web3 wallet with $CREATE or $PSX tokens to access the marketplace. Token holdings determine your client tier and access level.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-client-step-2">
              <CardHeader>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-2xl font-bold mb-4">
                  2
                </div>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Browse Builders
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Search our vetted builder directory. Filter by category, skills, ratings, pricing, and availability to find the perfect match for your project.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-client-step-3">
              <CardHeader>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-2xl font-bold mb-4">
                  3
                </div>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Discuss Project
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Message builders directly to discuss requirements, timelines, and pricing. Our platform facilitates secure communication throughout the project.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-client-step-4">
              <CardHeader>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-2xl font-bold mb-4">
                  4
                </div>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Secure Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Pay with USDC on Base blockchain. Funds are held in secure escrow and released based on milestone completion, protecting both parties.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-client-step-5">
              <CardHeader>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-2xl font-bold mb-4">
                  5
                </div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Track Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Monitor project milestones, review deliverables, request revisions, and approve work through your client dashboard with full transparency.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-client-step-6">
              <CardHeader>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 text-white text-2xl font-bold mb-4">
                  6
                </div>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Leave Review
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  After project completion, rate your builder's work quality, communication, and timeliness to help maintain platform quality standards.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center">
            <Link href="/marketplace">
              <Button size="lg" className="gap-2" data-testid="button-browse-builders">
                Browse Builders
                <Search className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* For Builders Section */}
        <section className="mb-16" data-testid="section-for-builders">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">For Builders</h2>
            <p className="text-muted-foreground">
              Join the platform and start earning with your Web3 skills
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="hover-elevate" data-testid="card-builder-step-1">
              <CardHeader>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 text-white text-2xl font-bold mb-4">
                  1
                </div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Apply to Join
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Submit your application with portfolio, skills, and experience. Our team reviews all applications to ensure platform quality and builder success.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-builder-step-2">
              <CardHeader>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 text-white text-2xl font-bold mb-4">
                  2
                </div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Create Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Build your professional profile showcasing skills, services, pricing, portfolio projects, and client testimonials to attract quality leads.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-builder-step-3">
              <CardHeader>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 text-white text-2xl font-bold mb-4">
                  3
                </div>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Receive Inquiries
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Qualified clients discover your profile and reach out with project opportunities. Respond promptly to convert leads into paid projects.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-builder-step-4">
              <CardHeader>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 text-white text-2xl font-bold mb-4">
                  4
                </div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Deliver Work
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Complete milestones, submit deliverables, and communicate progress. Use our project management tools to stay organized and exceed expectations.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-builder-step-5">
              <CardHeader>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 text-white text-2xl font-bold mb-4">
                  5
                </div>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Get Paid
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Receive USDC payments directly to your wallet as milestones are approved. Platform fee is only 2.5%, ensuring you keep more of your earnings.
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate" data-testid="card-builder-step-6">
              <CardHeader>
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 text-white text-2xl font-bold mb-4">
                  6
                </div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Build Reputation
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Earn positive reviews, climb the builder rankings, and unlock premium features. Top builders get featured placement and priority visibility.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-center gap-4">
            <Link href="/builder-quiz">
              <Button size="lg" variant="outline" className="gap-2" data-testid="button-take-quiz">
                <Target className="h-4 w-4" />
                Take Readiness Quiz
              </Button>
            </Link>
            <Link href="/builders">
              <Button size="lg" className="gap-2" data-testid="button-learn-more-builders">
                Learn More
                <Users className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-16" data-testid="section-key-features">
          <h2 className="text-3xl font-bold mb-8 text-center">Key Platform Features</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card data-testid="feature-token-gated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  Token-Gated Access
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Hold $CREATE or $PSX tokens to access the marketplace. This ensures a quality community of serious clients and skilled builders committed to the Web3 ecosystem.
                </p>
              </CardContent>
            </Card>

            <Card data-testid="feature-escrow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-cyan-500" />
                  Secure Escrow
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  All payments are held in smart contract escrow on Base blockchain. Funds are released to builders only when clients approve completed milestones, protecting both parties.
                </p>
              </CardContent>
            </Card>

            <Card data-testid="feature-messaging">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-purple-500" />
                  Real-Time Messaging
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Communicate directly with builders or clients through our secure WebSocket-powered chat. Share files, track conversations, and maintain project clarity.
                </p>
              </CardContent>
            </Card>

            <Card data-testid="feature-reviews">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-cyan-500" />
                  Verified Reviews
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Only completed, paid projects can be reviewed. This ensures authentic feedback and helps maintain platform quality through verified client experiences.
                </p>
              </CardContent>
            </Card>

            <Card data-testid="feature-milestones">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-purple-500" />
                  Milestone-Based Projects
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Break large projects into manageable milestones. Release payments incrementally as work progresses, reducing risk and maintaining momentum throughout the project.
                </p>
              </CardContent>
            </Card>

            <Card data-testid="feature-blockchain">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-cyan-500" />
                  Base Blockchain
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Built on Base for fast, low-cost transactions. All payments in USDC ensure stability, while blockchain transparency provides an immutable record of all transactions.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Payment Options Section */}
        <section className="mb-16 bg-gradient-to-br from-background via-primary/5 to-chart-2/5 rounded-lg p-8 border" data-testid="section-payment-options">
          <div className="mb-6 text-center">
            <Badge variant="outline" className="mb-2 gap-1 border-primary/40 bg-primary/10 text-primary text-xs">
              <DollarSign className="h-3 w-3" />
              Flexible Payments
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Pay Your Way
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl mx-auto">
              USDC payments on Base blockchain with optional project allocation
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-4 hover-elevate transition-all">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 mb-3">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-base font-semibold mb-1.5">USDC on Base</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Secure stablecoin payments with smart contract escrow on Base network.
              </p>
            </Card>

            <Card className="p-4 hover-elevate transition-all border-chart-2/40 bg-chart-2/5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-2/20 mb-3">
                <Gift className="h-4 w-4 text-chart-2" />
              </div>
              <h3 className="text-base font-semibold mb-1.5">Optional Allocation</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Offer builders equity, tokens, or revenue share in addition to USDC.
              </p>
            </Card>

            <Card className="p-4 hover-elevate transition-all">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-chart-3/10 mb-3">
                <Lock className="h-4 w-4 text-chart-3" />
              </div>
              <h3 className="text-base font-semibold mb-1.5">Milestone Releases</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">
                Funds released progressively as work is completed with protected escrow.
              </p>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join Create.psx today and experience the future of Web3 talent marketplaces
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/become-client">
              <Button size="lg" variant="outline" className="gap-2" data-testid="button-become-client">
                <Users className="h-4 w-4" />
                I'm a Client
              </Button>
            </Link>
            <Link href="/builders">
              <Button size="lg" className="gap-2" data-testid="button-become-builder">
                <TrendingUp className="h-4 w-4" />
                I'm a Builder
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
