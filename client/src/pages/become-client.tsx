import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useClientAuth } from "@/hooks/use-client-auth";
import { connectWallet, getCurrentAccount, formatAddress } from "@/lib/baseAccount";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/header";
import { Wallet, CheckCircle2, Shield, Zap, Users, Star, ArrowRight, Building2, Globe, MessageSquare, Clock } from "lucide-react";

export default function BecomeClient() {
  const [walletAddress, setWalletAddress] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [bio, setBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [projectType, setProjectType] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [interestedCategories, setInterestedCategories] = useState<string[]>([]);
  const [projectTimeline, setProjectTimeline] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [telegramHandle, setTelegramHandle] = useState("");
  
  const { register, isAuthenticated } = useClientAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, setLocation]);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    const account = await getCurrentAccount();
    if (account && typeof account === 'object' && 'address' in account && account.address) {
      setWalletAddress(account.address);
      setIsConnected(true);
    }
  };

  const handleConnectWallet = async () => {
    try {
      const address = await connectWallet();
      if (address) {
        setWalletAddress(address);
        setIsConnected(true);
        toast({
          title: "Wallet connected",
          description: formatAddress(address),
        });
      }
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handleCategoryToggle = (category: string) => {
    setInterestedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      toast({
        title: "Wallet required",
        description: "Please connect your wallet before registering",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await register({
        walletAddress,
        name,
        email,
        companyName: companyName || undefined,
        bio: bio || undefined,
        projectType: projectType || undefined,
        budgetRange: budgetRange || undefined,
        interestedCategories: interestedCategories.length > 0 ? interestedCategories : undefined,
        projectTimeline: projectTimeline || undefined,
        projectDescription: projectDescription || undefined,
        experienceLevel: experienceLevel || undefined,
        referralSource: referralSource || undefined,
        websiteUrl: websiteUrl || undefined,
        twitterHandle: twitterHandle || undefined,
        telegramHandle: telegramHandle || undefined,
      });

      toast({
        title: "Registration successful",
        description: "Welcome to create.psx!",
      });

      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to register. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { id: "kols", name: "KOLs & Influencers", icon: "👥" },
    { id: "3d", name: "3D Content Creation", icon: "🎨" },
    { id: "marketing", name: "Marketing & Growth", icon: "📈" },
    { id: "development", name: "Smart Contract Dev", icon: "⚡" },
    { id: "volume", name: "Volume Services", icon: "📊" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <Badge variant="outline" className="mb-4 gap-1.5 border-primary/40 bg-primary/10 text-primary">
            <Shield className="h-3 w-3" />
            Token-Gated Client Access
          </Badge>
          <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">
            Become a Client
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Join the premier Web3 talent marketplace and connect with vetted builders for your memecoin and crypto projects
          </p>
          
          <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-chart-3/30 bg-chart-3/5 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-chart-3 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-semibold text-chart-3">🎉 Launch Special: First 2 Clients Get FREE Access!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  The first 2 registered clients will be whitelisted with FREE platform access — no $CREATE or $PSX tokens required. Register now to secure your spot!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Verified Builders</h3>
              <p className="text-sm text-muted-foreground">
                All builders are vetted and hold $PSX tokens, ensuring quality and commitment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                <Zap className="h-6 w-6 text-chart-2" />
              </div>
              <h3 className="mb-2 font-semibold">Fast Matching</h3>
              <p className="text-sm text-muted-foreground">
                Get matched with specialized builders based on your project needs and budget
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
                <Star className="h-6 w-6 text-chart-3" />
              </div>
              <h3 className="mb-2 font-semibold">Quality Guarantee</h3>
              <p className="text-sm text-muted-foreground">
                Access reviewed portfolios, ratings, and milestone-based payment protection
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Client Registration</CardTitle>
                <CardDescription>
                  Tell us about your project needs so we can match you with the right builders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <Wallet className="h-4 w-4" />
                      Wallet Connection
                    </h3>
                    {!isConnected ? (
                      <div>
                        <p className="mb-3 text-sm text-muted-foreground">
                          Connect your Base wallet to verify your $PSX holdings and access the marketplace
                        </p>
                        <Button
                          type="button"
                          onClick={handleConnectWallet}
                          variant="outline"
                          className="gap-2"
                          data-testid="button-connect-wallet"
                        >
                          <Wallet className="h-4 w-4" />
                          Connect Wallet
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 rounded-md border bg-background p-3">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="font-mono text-sm">{formatAddress(walletAddress)}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <Users className="h-4 w-4" />
                      Contact Information
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your full name"
                          required
                          data-testid="input-name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                          data-testid="input-email"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company/Project Name</Label>
                      <Input
                        id="companyName"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Your company or project name"
                        data-testid="input-company"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <Building2 className="h-4 w-4" />
                      Project Details
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="projectType">What type of project are you working on? *</Label>
                      <Select value={projectType} onValueChange={setProjectType} required>
                        <SelectTrigger data-testid="select-project-type">
                          <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new-token-launch">New Token Launch</SelectItem>
                          <SelectItem value="existing-project">Existing Project Growth</SelectItem>
                          <SelectItem value="nft-collection">NFT Collection</SelectItem>
                          <SelectItem value="defi-protocol">DeFi Protocol</SelectItem>
                          <SelectItem value="dao">DAO / Community</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectDescription">Project Description *</Label>
                      <Textarea
                        id="projectDescription"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder="Briefly describe your project and what you're trying to achieve..."
                        rows={4}
                        required
                        data-testid="input-project-description"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>What services are you interested in? *</Label>
                      <div className="grid gap-3 md:grid-cols-2">
                        {categories.map((category) => (
                          <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={category.id}
                              checked={interestedCategories.includes(category.id)}
                              onCheckedChange={() => handleCategoryToggle(category.id)}
                              data-testid={`checkbox-category-${category.id}`}
                            />
                            <Label htmlFor={category.id} className="cursor-pointer font-normal">
                              {category.icon} {category.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="budgetRange">Budget Range *</Label>
                        <Select value={budgetRange} onValueChange={setBudgetRange} required>
                          <SelectTrigger data-testid="select-budget">
                            <SelectValue placeholder="Select budget range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="under-5k">Under $5,000</SelectItem>
                            <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                            <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                            <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                            <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                            <SelectItem value="over-100k">$100,000+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="projectTimeline">Project Timeline *</Label>
                        <Select value={projectTimeline} onValueChange={setProjectTimeline} required>
                          <SelectTrigger data-testid="select-timeline">
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urgent">Urgent (1-2 weeks)</SelectItem>
                            <SelectItem value="short">Short (2-4 weeks)</SelectItem>
                            <SelectItem value="medium">Medium (1-3 months)</SelectItem>
                            <SelectItem value="long">Long (3+ months)</SelectItem>
                            <SelectItem value="ongoing">Ongoing</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="experienceLevel">Your Web3 Experience Level *</Label>
                      <Select value={experienceLevel} onValueChange={setExperienceLevel} required>
                        <SelectTrigger data-testid="select-experience">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner - New to Web3/crypto</SelectItem>
                          <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                          <SelectItem value="advanced">Advanced - Multiple projects</SelectItem>
                          <SelectItem value="expert">Expert - Industry veteran</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <Globe className="h-4 w-4" />
                      Online Presence (Optional)
                    </h3>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="websiteUrl">Website / Project URL</Label>
                        <Input
                          id="websiteUrl"
                          type="url"
                          value={websiteUrl}
                          onChange={(e) => setWebsiteUrl(e.target.value)}
                          placeholder="https://your-project.com"
                          data-testid="input-website"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="twitterHandle">Twitter Handle</Label>
                        <Input
                          id="twitterHandle"
                          value={twitterHandle}
                          onChange={(e) => setTwitterHandle(e.target.value)}
                          placeholder="@yourhandle"
                          data-testid="input-twitter"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telegramHandle">Telegram Handle</Label>
                      <Input
                        id="telegramHandle"
                        value={telegramHandle}
                        onChange={(e) => setTelegramHandle(e.target.value)}
                        placeholder="@yourhandle"
                        data-testid="input-telegram"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-semibold">
                      <MessageSquare className="h-4 w-4" />
                      Additional Information
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="referralSource">How did you hear about us?</Label>
                      <Select value={referralSource} onValueChange={setReferralSource}>
                        <SelectTrigger data-testid="select-referral">
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="twitter">Twitter</SelectItem>
                          <SelectItem value="telegram">Telegram</SelectItem>
                          <SelectItem value="referral">Friend/Referral</SelectItem>
                          <SelectItem value="search">Search Engine</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Anything else we should know?</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us more about your needs, specific requirements, or any questions you have..."
                        rows={3}
                        data-testid="input-bio"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting || !isConnected}
                    className="w-full gap-2"
                    data-testid="button-register"
                  >
                    {isSubmitting ? "Registering..." : "Complete Registration"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    By registering, you agree to our Terms of Service and Privacy Policy
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  What Happens Next?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Registration Review</p>
                    <p className="text-sm text-muted-foreground">
                      Your application is reviewed (usually within 24 hours)
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Browse Builders</p>
                    <p className="text-sm text-muted-foreground">
                      Access verified builders and their portfolios
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Get Matched</p>
                    <p className="text-sm text-muted-foreground">
                      We'll recommend builders based on your needs
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Start Building</p>
                    <p className="text-sm text-muted-foreground">
                      Work with your builder using milestone-based payments
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tier Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shrink-0">
                    Gold
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Priority matching, dedicated support, lower platform fees
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="bg-gray-400/10 text-gray-400 border-gray-400/20 shrink-0">
                    Silver
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Faster response times, featured project listings
                  </p>
                </div>

                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20 shrink-0">
                    Bronze
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    Full marketplace access, standard support
                  </p>
                </div>

                <p className="pt-3 text-xs text-muted-foreground border-t">
                  Your tier is determined by your $PSX token holdings and can be upgraded at any time
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
