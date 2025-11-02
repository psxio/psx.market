import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { useClientAuth } from "@/hooks/use-client-auth";
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Header } from "@/components/header";
import { 
  Wallet, 
  CheckCircle2, 
  Shield, 
  Zap, 
  Users, 
  Star, 
  ArrowRight, 
  ArrowLeft, 
  Building2, 
  Globe, 
  MessageSquare, 
  User,
  Sparkles 
} from "lucide-react";

export default function BecomeClient() {
  const [currentStep, setCurrentStep] = useState(1);
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
  
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { isRegistered, userType } = useWalletAuth();
  const { register } = useClientAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (isRegistered && userType === "client") {
      setLocation("/dashboard");
    } else if (isRegistered && userType === "builder") {
      setLocation("/builder-dashboard");
    }
  }, [isRegistered, userType, setLocation]);

  const handleCategoryToggle = (category: string) => {
    setInterestedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1) {
      if (!name || !email) {
        toast({
          title: "Required fields missing",
          description: "Please fill in your name and email",
          variant: "destructive",
        });
        return;
      }
      if (!isConnected) {
        toast({
          title: "Wallet required",
          description: "Please connect your wallet to continue",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (currentStep === 2) {
      if (!projectType || !projectDescription || !budgetRange || !projectTimeline || !experienceLevel) {
        toast({
          title: "Required fields missing",
          description: "Please fill in all required project details",
          variant: "destructive",
        });
        return;
      }
      if (interestedCategories.length === 0) {
        toast({
          title: "Select at least one service",
          description: "Choose which services you're interested in",
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!isConnected || !address) {
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
        walletAddress: address.toLowerCase(),
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
        description: "Welcome to port444!",
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

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, title: "Basic Info", completed: currentStep > 1, current: currentStep === 1 },
    { number: 2, title: "Project Details", completed: currentStep > 2, current: currentStep === 2 },
    { number: 3, title: "Finish Up", completed: false, current: currentStep === 3 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto max-w-5xl px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <Badge variant="outline" className="mb-4 gap-1.5 border-primary/40 bg-primary/10 text-primary">
            <Shield className="h-3 w-3" />
            Client Registration
          </Badge>
          <h1 className="mb-3 text-4xl font-bold tracking-tight md:text-5xl">
            Find Your Perfect Builder
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Connect with vetted Web3 talent for your memecoin and crypto projects
          </p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <Card className="h-full">
            <CardContent className="pt-6 h-full">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Verified Builders</h3>
              <p className="text-sm text-muted-foreground">
                All builders are vetted and verified professionals
              </p>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardContent className="pt-6 h-full">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                <Zap className="h-6 w-6 text-chart-2" />
              </div>
              <h3 className="mb-2 font-semibold">Fast Matching</h3>
              <p className="text-sm text-muted-foreground">
                Get matched with specialized builders instantly
              </p>
            </CardContent>
          </Card>

          <Card className="h-full">
            <CardContent className="pt-6 h-full">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
                <Star className="h-6 w-6 text-chart-3" />
              </div>
              <h3 className="mb-2 font-semibold">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">
                On-chain escrow and milestone-based releases
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="mb-4">
              <Progress value={progress} className="h-2" />
            </div>
            <div className="flex justify-between">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className={`flex items-center gap-2 ${
                    step.current ? "text-primary font-semibold" : step.completed ? "text-chart-3" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm ${
                      step.current
                        ? "border-primary bg-primary text-primary-foreground"
                        : step.completed
                        ? "border-chart-3 bg-chart-3 text-white"
                        : "border-muted-foreground/30"
                    }`}
                  >
                    {step.completed ? <CheckCircle2 className="h-4 w-4" /> : step.number}
                  </div>
                  <span className="hidden md:inline text-sm">{step.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              {currentStep === 1 && <User className="h-5 w-5 text-primary" />}
              {currentStep === 2 && <Building2 className="h-5 w-5 text-primary" />}
              {currentStep === 3 && <Sparkles className="h-5 w-5 text-primary" />}
              <CardTitle>
                {currentStep === 1 && "Basic Information"}
                {currentStep === 2 && "Project Details"}
                {currentStep === 3 && "Almost Done!"}
              </CardTitle>
            </div>
            <CardDescription>
              {currentStep === 1 && "Let's start with the essentials"}
              {currentStep === 2 && "Tell us about your project needs"}
              {currentStep === 3 && "Add optional details to enhance your profile"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <>
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 font-semibold text-sm text-muted-foreground uppercase">
                    <Wallet className="h-4 w-4" />
                    Wallet Connection
                  </h3>
                  {!isConnected ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Connect your wallet to receive matched builder recommendations and manage payments
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={openConnectModal}
                        data-testid="button-connect-wallet"
                      >
                        <Wallet className="mr-2 h-4 w-4" />
                        Connect Wallet
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-3">
                      <CheckCircle2 className="h-4 w-4 text-chart-3" />
                      <span className="font-mono text-sm truncate flex-1">{address}</span>
                      <Badge variant="secondary">Connected</Badge>
                    </div>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      maxLength={50}
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
                  <Label htmlFor="companyName">Company/Project Name (Optional)</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your company or project name"
                    maxLength={100}
                    data-testid="input-company"
                  />
                </div>
              </>
            )}

            {/* Step 2: Project Details */}
            {currentStep === 2 && (
              <>
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
                    maxLength={500}
                    required
                    data-testid="input-project-description"
                  />
                  <p className="text-xs text-muted-foreground">
                    {projectDescription.length}/500 characters
                  </p>
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
              </>
            )}

            {/* Step 3: Optional Info */}
            {currentStep === 3 && (
              <>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    These details are optional but help builders understand your project better
                  </p>

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

                  <div className="space-y-2">
                    <Label htmlFor="bio">About You (Optional)</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell builders a bit about yourself and your background..."
                      rows={4}
                      maxLength={500}
                      data-testid="input-bio"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="referralSource">How did you hear about us?</Label>
                    <Select value={referralSource} onValueChange={setReferralSource}>
                      <SelectTrigger data-testid="select-referral">
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="telegram">Telegram</SelectItem>
                        <SelectItem value="discord">Discord</SelectItem>
                        <SelectItem value="friend">Friend/Referral</SelectItem>
                        <SelectItem value="search">Search Engine</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                data-testid="button-back"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  data-testid="button-next"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  data-testid="button-submit"
                >
                  {isSubmitting ? "Creating Account..." : "Complete Registration"}
                  <CheckCircle2 className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
