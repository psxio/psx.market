import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Sparkles, 
  User, 
  Briefcase, 
  Award,
  Wallet,
  Clock,
  AlertCircle,
  TrendingUp,
  Save
} from "lucide-react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { StepIndicator } from "@/components/onboarding/StepIndicator";
import { ProfilePreview } from "@/components/onboarding/ProfilePreview";
import { ProfileStrengthWidget } from "@/components/onboarding/ProfileStrengthWidget";
import { BioTemplates } from "@/components/onboarding/BioTemplates";
import { CharacterCounter } from "@/components/onboarding/CharacterCounter";
import { ImageUploader } from "@/components/ImageUploader";
import { useAutoSave, loadSavedData, clearSavedData } from "@/hooks/useAutoSave";
import { 
  validateStep1, 
  validateStep2, 
  validateStep3,
  getTotalTimeRemaining,
  calculateProfileStrength,
  getProfileStrengthSuggestions,
  type OnboardingFormData
} from "@/lib/onboardingValidation";

interface InviteVerification {
  valid: boolean;
  email?: string;
}

const CATEGORIES = [
  { value: "kols", label: "KOL / Influencer" },
  { value: "3d-artists", label: "3D Artist" },
  { value: "video-editor", label: "Video Editor" },
  { value: "mods-raiders", label: "Mod / Raider" },
  { value: "marketers", label: "Marketing & Growth" },
  { value: "developers", label: "Smart Contract Dev" },
  { value: "volume", label: "Volume Services" },
];

export default function BuilderOnboarding() {
  const [, params] = useRoute("/builder-onboarding/:token?");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  
  const inviteToken = params?.token;
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string>("");

  const [formData, setFormData] = useState(() => {
    // Try to load saved data first
    const saved = loadSavedData<any>("builder-onboarding-draft", {
      // Basic Info (Step 1)
      name: "",
      email: "",
      walletAddress: "",
      headline: "",
      bio: "",
      category: "",
      
      // Professional Details (Step 2)
      skills: [] as string[],
      portfolioLinks: [] as string[],
      twitterHandle: "",
      discordHandle: "",
      isNSFW: false,
      responseTime: "24 hours",
      
      // Category-Specific (Step 3)
      // KOL fields
      twitterFollowers: "",
      instagramHandle: "",
      instagramFollowers: "",
      youtubeChannel: "",
      youtubeSubscribers: "",
      telegramHandle: "",
      telegramMembers: "",
      engagementRate: "",
      contentNiches: [] as string[],
      brandPartnerships: [] as string[],
      
      // 3D Artist fields
      software3D: [] as string[],
      renderEngines: [] as string[],
      styleSpecialties: [] as string[],
      animationExpertise: false,
      
      // Video Editor fields
      editingSoftware: [] as string[],
      editingSpecialties: [] as string[],
      videoTypes: [] as string[],
      portfolioReel: "",
      
      // Mods & Raiders fields
      platformsManaged: [] as string[],
      maxCommunitySize: "",
      moderationTools: [] as string[],
      raidCoordination: false,
      timezoneAvailability: "",
      
      // Marketing fields
      marketingPlatforms: [] as string[],
      growthStrategies: [] as string[],
      avgROI: "",
      clientIndustries: [] as string[],
      
      // Developer fields
      programmingLanguages: [] as string[],
      blockchainFrameworks: [] as string[],
      githubProfile: "",
      certifications: [] as string[],
      
      // Volume fields
      tradingExperience: "",
      volumeCapabilities: "",
      dexExpertise: [] as string[],
      cexExpertise: [] as string[],
      complianceKnowledge: false,
    });
    
    return saved;
  });

  // Auto-save form data
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  useAutoSave({
    data: formData,
    key: "builder-onboarding-draft",
    delay: 2000,
    enabled: !isSubmitting,
    onSave: () => {
      setLastSaved(new Date());
    },
  });

  // Manual save function
  const handleManualSave = () => {
    localStorage.setItem("builder-onboarding-draft", JSON.stringify(formData));
    setLastSaved(new Date());
    toast({
      title: "Progress saved",
      description: "Your application has been saved. You can continue later.",
    });
  };

  // Calculate profile strength
  const profileStrength = calculateProfileStrength({ ...formData, profileImage: profilePhoto } as OnboardingFormData);
  const profileSuggestions = getProfileStrengthSuggestions({ ...formData, profileImage: profilePhoto } as OnboardingFormData);
  
  // Time estimation
  const timeRemaining = getTotalTimeRemaining(currentStep);
  
  // Step indicator data
  const steps = [
    { number: 1, title: "Basic Info", completed: currentStep > 1, current: currentStep === 1 },
    { number: 2, title: "Your Stack", completed: currentStep > 2, current: currentStep === 2 },
    { number: 3, title: "Proof of Work", completed: currentStep > 3, current: currentStep === 3 },
    { number: 4, title: "Review", completed: false, current: currentStep === 4 },
  ];

  // Verify invite token if provided
  const { data: verification, isLoading: verifyingToken } = useQuery<InviteVerification>({
    queryKey: ["/api/builder-invites/verify", inviteToken],
    enabled: !!inviteToken,
  });

  useEffect(() => {
    if (verification?.email) {
      setFormData(prev => ({ ...prev, email: verification.email! }));
    }
  }, [verification]);

  useEffect(() => {
    if (isConnected && address) {
      setFormData(prev => ({ ...prev, walletAddress: address }));
    }
  }, [isConnected, address]);

  // Load quiz results if available
  useEffect(() => {
    const quizDataStr = localStorage.getItem("builderQuizResults");
    if (quizDataStr) {
      try {
        const quizData = JSON.parse(quizDataStr);
        
        // Pre-fill form with quiz data
        setFormData(prev => ({
          ...prev,
          category: quizData.category || prev.category,
          headline: quizData.headline || prev.headline,
          bio: quizData.bio || prev.bio,
          responseTime: quizData.responseTime || prev.responseTime,
        }));

        // Show a toast to inform user
        toast({
          title: "Quiz Results Loaded!",
          description: "We've pre-filled your profile with information from the quiz. Feel free to customize it.",
        });

        // Clear quiz data after loading (optional - user can only use it once)
        // localStorage.removeItem("builderQuizResults");
      } catch (error) {
        console.error("Error loading quiz data:", error);
      }
    }
  }, [toast]);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    // Validate current step before advancing
    let validation;
    if (currentStep === 1) {
      validation = validateStep1(formData as OnboardingFormData);
    } else if (currentStep === 2) {
      validation = validateStep2(formData as OnboardingFormData);
    } else if (currentStep === 3) {
      validation = validateStep3(formData as OnboardingFormData);
    }

    if (validation && !validation.isValid) {
      setValidationErrors(validation.errors);
      toast({
        title: "Please complete required fields",
        description: validation.errors[0],
        variant: "destructive",
      });
      return;
    }

    setValidationErrors([]);
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setValidationErrors([]);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Build builder data based on category
      const builderData: any = {
        walletAddress: formData.walletAddress,
        email: formData.email,
        name: formData.name,
        headline: formData.headline,
        bio: formData.bio,
        category: formData.category,
        skills: formData.skills,
        portfolioLinks: formData.portfolioLinks,
        twitterHandle: formData.twitterHandle,
        discordHandle: formData.discordHandle,
        isNSFW: formData.isNSFW,
        responseTime: formData.responseTime,
        verified: !!inviteToken, // Auto-verify invited builders
        featured: false,
        tokenGateWhitelisted: true,
        profileImage: profilePhoto || undefined,
        coverImage: coverImage || undefined,
        profileStrength: profileStrength,
      };

      // Add category-specific fields
      if (formData.category === "kols") {
        builderData.twitterFollowers = formData.twitterFollowers ? parseInt(formData.twitterFollowers) : undefined;
        builderData.instagramHandle = formData.instagramHandle || undefined;
        builderData.instagramFollowers = formData.instagramFollowers ? parseInt(formData.instagramFollowers) : undefined;
        builderData.youtubeChannel = formData.youtubeChannel || undefined;
        builderData.youtubeSubscribers = formData.youtubeSubscribers ? parseInt(formData.youtubeSubscribers) : undefined;
        builderData.telegramHandle = formData.telegramHandle || undefined;
        builderData.telegramMembers = formData.telegramMembers ? parseInt(formData.telegramMembers) : undefined;
        builderData.engagementRate = formData.engagementRate || undefined;
        builderData.contentNiches = formData.contentNiches.length > 0 ? formData.contentNiches : undefined;
        builderData.brandPartnerships = formData.brandPartnerships.length > 0 ? formData.brandPartnerships : undefined;
      } else if (formData.category === "3d-artists") {
        builderData.software3D = formData.software3D.length > 0 ? formData.software3D : undefined;
        builderData.renderEngines = formData.renderEngines.length > 0 ? formData.renderEngines : undefined;
        builderData.styleSpecialties = formData.styleSpecialties.length > 0 ? formData.styleSpecialties : undefined;
        builderData.animationExpertise = formData.animationExpertise;
      } else if (formData.category === "video-editor") {
        builderData.editingSoftware = formData.editingSoftware.length > 0 ? formData.editingSoftware : undefined;
        builderData.editingSpecialties = formData.editingSpecialties.length > 0 ? formData.editingSpecialties : undefined;
        builderData.videoTypes = formData.videoTypes.length > 0 ? formData.videoTypes : undefined;
        builderData.portfolioReel = formData.portfolioReel || undefined;
      } else if (formData.category === "mods-raiders") {
        builderData.platformsManaged = formData.platformsManaged.length > 0 ? formData.platformsManaged : undefined;
        builderData.maxCommunitySize = formData.maxCommunitySize ? parseInt(formData.maxCommunitySize) : undefined;
        builderData.moderationTools = formData.moderationTools.length > 0 ? formData.moderationTools : undefined;
        builderData.raidCoordination = formData.raidCoordination;
        builderData.timezoneAvailability = formData.timezoneAvailability || undefined;
      } else if (formData.category === "marketers") {
        builderData.marketingPlatforms = formData.marketingPlatforms.length > 0 ? formData.marketingPlatforms : undefined;
        builderData.growthStrategies = formData.growthStrategies.length > 0 ? formData.growthStrategies : undefined;
        builderData.avgROI = formData.avgROI || undefined;
        builderData.clientIndustries = formData.clientIndustries.length > 0 ? formData.clientIndustries : undefined;
      } else if (formData.category === "developers") {
        builderData.programmingLanguages = formData.programmingLanguages.length > 0 ? formData.programmingLanguages : undefined;
        builderData.blockchainFrameworks = formData.blockchainFrameworks.length > 0 ? formData.blockchainFrameworks : undefined;
        builderData.githubProfile = formData.githubProfile || undefined;
        builderData.certifications = formData.certifications.length > 0 ? formData.certifications : undefined;
      } else if (formData.category === "volume") {
        builderData.tradingExperience = formData.tradingExperience ? parseInt(formData.tradingExperience) : undefined;
        builderData.volumeCapabilities = formData.volumeCapabilities || undefined;
        builderData.dexExpertise = formData.dexExpertise.length > 0 ? formData.dexExpertise : undefined;
        builderData.cexExpertise = formData.cexExpertise.length > 0 ? formData.cexExpertise : undefined;
        builderData.complianceKnowledge = formData.complianceKnowledge;
      }

      // Submit based on invite or regular application
      if (inviteToken) {
        await apiRequest("POST", "/api/builder-applications", {
          ...builderData,
          inviteToken,
        });
        
        // Clear saved data after successful submission
        clearSavedData("builder-onboarding-draft");
        localStorage.removeItem("builderQuizResults");
        
        toast({
          title: "Welcome to Create.psx! 🎉",
          description: "Your builder profile has been created successfully.",
        });
        
        setTimeout(() => {
          setLocation("/marketplace");
        }, 1500);
      } else {
        await apiRequest("POST", "/api/builder-applications", builderData);
        
        // Clear saved data after successful submission
        clearSavedData("builder-onboarding-draft");
        localStorage.removeItem("builderQuizResults");
        
        toast({
          title: "Application Submitted!",
          description: "We'll review your application within 2-3 business days.",
        });
        
        setTimeout(() => {
          setLocation("/");
        }, 1500);
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addToArray = (field: keyof typeof formData, value: string) => {
    const currentArray = formData[field] as string[];
    if (value && !currentArray.includes(value)) {
      setFormData({
        ...formData,
        [field]: [...currentArray, value],
      });
    }
  };

  const removeFromArray = (field: keyof typeof formData, value: string) => {
    const currentArray = formData[field] as string[];
    setFormData({
      ...formData,
      [field]: currentArray.filter(item => item !== value),
    });
  };

  if (verifyingToken) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-4 animate-pulse" />
              <p className="text-muted-foreground">Verifying your invite...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (inviteToken && !verification?.valid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Invalid Invite</CardTitle>
            <CardDescription className="text-center">
              This invite link has expired or is invalid
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => setLocation("/builder-onboarding")}
              variant="outline"
            >
              Apply through regular application
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            variant="ghost"
            onClick={() => setLocation("/marketplace")}
            data-testid="button-back-marketplace"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          {inviteToken && (
            <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-cyan-500">
              <Sparkles className="mr-1 h-3 w-3" />
              Private Invite - Fast Track
            </Badge>
          )}
          <h1 className="text-4xl font-bold mb-2">
            Join <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Create.psx</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            {inviteToken ? "Complete your builder profile to get started" : "Apply to become a verified builder"}
          </p>
          
          <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-chart-3/30 bg-chart-3/5 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-chart-3 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-semibold text-chart-3">Builder Benefits Available!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Builders don't need tokens to join. {inviteToken ? "You're invited to join our verified builder community!" : "Apply now to become a verified builder and start earning!"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="mb-12 pt-4 max-w-4xl mx-auto">
          <StepIndicator steps={steps} />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Time Estimation */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    Time Remaining
                  </span>
                  <span className="text-sm font-semibold">~{timeRemaining} min</span>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {currentStep === 1 && "Let's get the basics set up"}
                  {currentStep === 2 && "Show us what you're working with"}
                  {currentStep === 3 && "Time to flex your track record"}
                  {currentStep === 4 && "Almost there! Review and submit"}
                </div>
              </CardContent>
            </Card>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {validationErrors.map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Steps */}
            <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              {currentStep === 1 && <User className="h-5 w-5 text-purple-500" />}
              {currentStep === 2 && <Briefcase className="h-5 w-5 text-purple-500" />}
              {currentStep === 3 && <Award className="h-5 w-5 text-purple-500" />}
              {currentStep === 4 && <Wallet className="h-5 w-5 text-purple-500" />}
              <CardTitle>
                {currentStep === 1 && "Basic Information"}
                {currentStep === 2 && "Your Tech Stack"}
                {currentStep === 3 && "Proof of Work"}
                {currentStep === 4 && "Review & Submit"}
              </CardTitle>
            </div>
            <CardDescription>
              {currentStep === 1 && "Tell us who you are"}
              {currentStep === 2 && "Show us what you're working with"}
              {currentStep === 3 && "Show us what you've shipped"}
              {currentStep === 4 && "Lock it in and ship your profile"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <>
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    data-testid="input-name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    disabled={!!verification?.email}
                    data-testid="input-email"
                  />
                </div>

                <div>
                  <Label htmlFor="walletAddress">Wallet Address *</Label>
                  {!isConnected ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={openConnectModal}
                      data-testid="button-connect-wallet"
                    >
                      Connect Wallet
                    </Button>
                  ) : (
                    <Input
                      id="walletAddress"
                      value={formData.walletAddress}
                      disabled
                      data-testid="input-wallet-address"
                    />
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Your Base wallet address for receiving payments
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Profile Photo</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload a clear photo so clients know you're real (+10% profile strength)
                  </p>
                  <ImageUploader
                    currentImage={profilePhoto}
                    onUploadComplete={(url) => setProfilePhoto(url)}
                    label="Upload Profile Photo"
                    maxSizeMB={5}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Cover Banner (Optional)</Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Add a cover image to make your profile stand out
                  </p>
                  <ImageUploader
                    currentImage={coverImage}
                    onUploadComplete={(url) => setCoverImage(url)}
                    label="Upload Cover Banner"
                    maxSizeMB={10}
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select your specialty" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Bio Templates */}
                {formData.category && (
                  <BioTemplates
                    category={formData.category}
                    onSelectTemplate={(headline, bio) => {
                      setFormData({
                        ...formData,
                        headline,
                        bio,
                      });
                    }}
                  />
                )}

                <div className="space-y-2">
                  <Label htmlFor="headline">One-Liner *</Label>
                  <Input
                    id="headline"
                    required
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    placeholder="e.g., Web3 KOL with 50K+ Engaged Followers"
                    maxLength={120}
                    data-testid="input-headline"
                  />
                  <CharacterCounter
                    current={formData.headline.length}
                    max={120}
                    recommended={60}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About You *</Label>
                  <Textarea
                    id="bio"
                    required
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="What do you do? What have you built? Keep it real..."
                    rows={6}
                    maxLength={1000}
                    data-testid="textarea-bio"
                  />
                  <CharacterCounter
                    current={formData.bio.length}
                    min={100}
                    max={1000}
                    recommended={200}
                  />
                </div>
              </>
            )}

            {/* Step 2: Your Stack */}
            {currentStep === 2 && (
              <>
                <div>
                  <Label>Skills (comma-separated) *</Label>
                  <Input
                    placeholder="e.g., Community Building, Content Creation, Token Launches"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim().replace(/,$/g, '');
                        if (value) {
                          addToArray('skills', value);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    data-testid="input-skills"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.skills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary">
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeFromArray('skills', skill)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Portfolio Links (Press Enter to add)</Label>
                  <Input
                    placeholder="https://..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value) {
                          addToArray('portfolioLinks', value);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    data-testid="input-portfolio-links"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.portfolioLinks.map((link, idx) => (
                      <Badge key={idx} variant="outline">
                        {link.substring(0, 30)}...
                        <button
                          type="button"
                          onClick={() => removeFromArray('portfolioLinks', link)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="twitterHandle">X/Twitter Handle (Optional)</Label>
                  <Input
                    id="twitterHandle"
                    value={formData.twitterHandle}
                    onChange={(e) => setFormData({ ...formData, twitterHandle: e.target.value })}
                    placeholder="@yourhandle"
                    data-testid="input-twitter"
                  />
                </div>

                <div>
                  <Label htmlFor="discordHandle">Discord Server Invite (Optional)</Label>
                  <Input
                    id="discordHandle"
                    value={formData.discordHandle}
                    onChange={(e) => setFormData({ ...formData, discordHandle: e.target.value })}
                    placeholder="yourinvitecode or https://discord.gg/yourinvitecode"
                    data-testid="input-discord"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Add your Discord server invite link so clients can contact you (e.g., "abcd1234" or "discord.gg/abcd1234")
                  </p>
                </div>

                <div className="flex items-start gap-3 p-4 border rounded-md">
                  <Checkbox
                    id="isNSFW"
                    checked={formData.isNSFW}
                    onCheckedChange={(checked) => setFormData({ ...formData, isNSFW: checked as boolean })}
                    data-testid="checkbox-nsfw"
                  />
                  <div className="flex-1">
                    <Label htmlFor="isNSFW" className="cursor-pointer font-medium">
                      Adult Content (NSFW)
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Check this if you offer adult-themed services (NSFW art, content creation for adult projects, etc.). Your profile will be filtered from main browse pages but accessible via adult section.
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="responseTime">Average Response Time</Label>
                  <Select
                    value={formData.responseTime}
                    onValueChange={(value) => setFormData({ ...formData, responseTime: value })}
                  >
                    <SelectTrigger data-testid="select-response-time">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 hour">Within 1 hour</SelectItem>
                      <SelectItem value="6 hours">Within 6 hours</SelectItem>
                      <SelectItem value="24 hours">Within 24 hours</SelectItem>
                      <SelectItem value="48 hours">Within 48 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Step 3: Category-Specific Fields */}
            {currentStep === 3 && formData.category === "kols" && (
              <>
                <h3 className="text-lg font-semibold">Connect Your Social Media</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Connect your accounts to automatically verify your follower counts. No manual entry needed!
                </p>
                
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    We automatically fetch your real follower counts when you connect each platform. This prevents fake stats and builds trust with clients.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  {/* Twitter / X Connection */}
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-black dark:bg-white rounded-full flex items-center justify-center">
                          <span className="text-white dark:text-black font-bold">𝕏</span>
                        </div>
                        <div>
                          <Label className="text-base font-semibold">Twitter / X</Label>
                          <p className="text-sm text-muted-foreground">
                            {formData.twitterFollowers ? 
                              `✅ Connected - ${parseInt(formData.twitterFollowers).toLocaleString()} followers` : 
                              "Connect to verify your follower count"
                            }
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant={formData.twitterFollowers ? "outline" : "default"}
                        onClick={() => {
                          // TODO: Implement Twitter OAuth
                          toast({
                            title: "Coming Soon",
                            description: "Twitter/X OAuth integration is in progress. For now, please provide your handle.",
                          });
                        }}
                        data-testid="button-connect-twitter"
                      >
                        {formData.twitterFollowers ? "Reconnect" : "Connect"}
                      </Button>
                    </div>
                    {!formData.twitterFollowers && (
                      <div className="mt-3">
                        <Label className="text-sm">Twitter Handle (temporary)</Label>
                        <Input
                          value={formData.twitterHandle}
                          onChange={(e) => setFormData({ ...formData, twitterHandle: e.target.value })}
                          placeholder="@yourhandle"
                          className="mt-1"
                          data-testid="input-twitter-handle"
                        />
                      </div>
                    )}
                  </Card>

                  {/* Instagram Connection */}
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">IG</span>
                        </div>
                        <div>
                          <Label className="text-base font-semibold">Instagram</Label>
                          <p className="text-sm text-muted-foreground">
                            {formData.instagramFollowers ? 
                              `✅ ${parseInt(formData.instagramFollowers).toLocaleString()} followers` : 
                              "Requires Business account for verification"
                            }
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        disabled
                        data-testid="button-connect-instagram"
                      >
                        Business Only
                      </Button>
                    </div>
                    <div className="mt-3">
                      <Label className="text-sm">Instagram Handle</Label>
                      <Input
                        value={formData.instagramHandle}
                        onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                        placeholder="@username"
                        className="mt-1"
                        data-testid="input-instagram-handle"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Note: Auto-verification only works with Instagram Business accounts. We're working on alternative verification methods.
                      </p>
                    </div>
                  </Card>

                  {/* YouTube Connection */}
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold">YT</span>
                        </div>
                        <div>
                          <Label className="text-base font-semibold">YouTube</Label>
                          <p className="text-sm text-muted-foreground">
                            {formData.youtubeSubscribers ? 
                              `✅ Connected - ${parseInt(formData.youtubeSubscribers).toLocaleString()} subscribers` : 
                              "Connect to verify your subscriber count"
                            }
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant={formData.youtubeSubscribers ? "outline" : "default"}
                        onClick={() => {
                          // TODO: Implement YouTube OAuth
                          toast({
                            title: "Coming Soon",
                            description: "YouTube OAuth integration is in progress. For now, please provide your channel.",
                          });
                        }}
                        data-testid="button-connect-youtube"
                      >
                        {formData.youtubeSubscribers ? "Reconnect" : "Connect"}
                      </Button>
                    </div>
                    {!formData.youtubeSubscribers && (
                      <div className="mt-3">
                        <Label className="text-sm">YouTube Channel (temporary)</Label>
                        <Input
                          value={formData.youtubeChannel}
                          onChange={(e) => setFormData({ ...formData, youtubeChannel: e.target.value })}
                          placeholder="@channel or channel URL"
                          className="mt-1"
                          data-testid="input-youtube-channel"
                        />
                      </div>
                    )}
                  </Card>

                  {/* Telegram (Optional) */}
                  <Card className="p-4 bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">TG</span>
                      </div>
                      <div className="flex-1">
                        <Label className="text-base font-semibold">Telegram (Optional)</Label>
                        <Input
                          value={formData.telegramHandle}
                          onChange={(e) => setFormData({ ...formData, telegramHandle: e.target.value })}
                          placeholder="@telegram"
                          className="mt-2"
                          data-testid="input-telegram-handle"
                        />
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="mt-6">
                  <Label>Content Niches (Press Enter to add)</Label>
                  <Input
                    placeholder="e.g., DeFi, NFTs, GameFi"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value) {
                          addToArray('contentNiches', value);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    data-testid="input-content-niches"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.contentNiches.map((niche, idx) => (
                      <Badge key={idx} variant="secondary">
                        {niche}
                        <button
                          type="button"
                          onClick={() => removeFromArray('contentNiches', niche)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {currentStep === 3 && formData.category === "3d-artists" && (
              <>
                <h3 className="text-lg font-semibold">What You Work With</h3>
                
                <div>
                  <Label>3D Software (Press Enter to add)</Label>
                  <Input
                    placeholder="e.g., Blender, Cinema 4D, Maya"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value) {
                          addToArray('software3D', value);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    data-testid="input-3d-software"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.software3D.map((software, idx) => (
                      <Badge key={idx} variant="secondary">
                        {software}
                        <button
                          type="button"
                          onClick={() => removeFromArray('software3D', software)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Render Engines (Press Enter to add)</Label>
                  <Input
                    placeholder="e.g., V-Ray, Redshift, Octane"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value) {
                          addToArray('renderEngines', value);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    data-testid="input-render-engines"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.renderEngines.map((engine, idx) => (
                      <Badge key={idx} variant="secondary">
                        {engine}
                        <button
                          type="button"
                          onClick={() => removeFromArray('renderEngines', engine)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="animation"
                    checked={formData.animationExpertise}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, animationExpertise: checked as boolean })
                    }
                    data-testid="checkbox-animation"
                  />
                  <Label htmlFor="animation">I can animate</Label>
                </div>
              </>
            )}

            {currentStep === 3 && formData.category === "marketers" && (
              <>
                <h3 className="text-lg font-semibold">Your Marketing Arsenal</h3>
                
                <div>
                  <Label>Marketing Platforms (Press Enter to add)</Label>
                  <Input
                    placeholder="e.g., Twitter, Discord, Telegram"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value) {
                          addToArray('marketingPlatforms', value);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    data-testid="input-marketing-platforms"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.marketingPlatforms.map((platform, idx) => (
                      <Badge key={idx} variant="secondary">
                        {platform}
                        <button
                          type="button"
                          onClick={() => removeFromArray('marketingPlatforms', platform)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Growth Strategies (Press Enter to add)</Label>
                  <Input
                    placeholder="e.g., SEO, Paid Ads, Influencer Marketing"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value) {
                          addToArray('growthStrategies', value);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    data-testid="input-growth-strategies"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.growthStrategies.map((strategy, idx) => (
                      <Badge key={idx} variant="secondary">
                        {strategy}
                        <button
                          type="button"
                          onClick={() => removeFromArray('growthStrategies', strategy)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Avg Client ROI % (Optional)</Label>
                  <Input
                    type="number"
                    value={formData.avgROI}
                    onChange={(e) => setFormData({ ...formData, avgROI: e.target.value })}
                    placeholder="150"
                    data-testid="input-avg-roi"
                  />
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-md p-3 space-y-2">
                    <p className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                      ⚠️ Honesty Check
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Self-reported ROI numbers without proof get flagged by clients. Upload case studies with screenshots, analytics, or wallet txns to get a "Verified Metrics ✓" badge. Builders with verified data get 3x more bookings.
                    </p>
                  </div>
                </div>
              </>
            )}

            {currentStep === 3 && formData.category === "video-editor" && (
              <>
                <h3 className="text-lg font-semibold">Your Video Editing Stack</h3>
                
                <div>
                  <Label>Editing Software (Press Enter to add)</Label>
                  <Input
                    placeholder="e.g., Premiere Pro, Final Cut, DaVinci Resolve"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value && !formData.editingSoftware.includes(value)) {
                          setFormData({ ...formData, editingSoftware: [...formData.editingSoftware, value] });
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    data-testid="input-editing-software"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.editingSoftware.map((software: string, idx: number) => (
                      <Badge key={idx} variant="secondary">
                        {software}
                        <button
                          type="button"
                          onClick={() => setFormData({ 
                            ...formData, 
                            editingSoftware: formData.editingSoftware.filter((_: string, i: number) => i !== idx) 
                          })}
                          className="ml-2"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Specialties (Press Enter to add)</Label>
                  <Input
                    placeholder="e.g., Motion Graphics, Color Grading, VFX"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value && !formData.editingSpecialties.includes(value)) {
                          setFormData({ ...formData, editingSpecialties: [...formData.editingSpecialties, value] });
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    data-testid="input-editing-specialties"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.editingSpecialties.map((specialty: string, idx: number) => (
                      <Badge key={idx} variant="secondary">
                        {specialty}
                        <button
                          type="button"
                          onClick={() => setFormData({ 
                            ...formData, 
                            editingSpecialties: formData.editingSpecialties.filter((_: string, i: number) => i !== idx) 
                          })}
                          className="ml-2"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Video Types (Press Enter to add)</Label>
                  <Input
                    placeholder="e.g., Token Promos, Explainers, Social Content"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value && !formData.videoTypes.includes(value)) {
                          setFormData({ ...formData, videoTypes: [...formData.videoTypes, value] });
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    data-testid="input-video-types"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.videoTypes.map((type: string, idx: number) => (
                      <Badge key={idx} variant="secondary">
                        {type}
                        <button
                          type="button"
                          onClick={() => setFormData({ 
                            ...formData, 
                            videoTypes: formData.videoTypes.filter((_: string, i: number) => i !== idx) 
                          })}
                          className="ml-2"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Portfolio Reel Link (YouTube/Vimeo)</Label>
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    value={formData.portfolioReel}
                    onChange={(e) => setFormData({ ...formData, portfolioReel: e.target.value })}
                    data-testid="input-portfolio-reel"
                  />
                </div>
              </>
            )}

            {currentStep === 3 && formData.category === "mods-raiders" && (
              <>
                <h3 className="text-lg font-semibold">Community Experience</h3>
                
                <div>
                  <Label>Platforms You Manage (Press Enter to add)</Label>
                  <Input
                    placeholder="e.g., Discord, Telegram, Twitter Spaces"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value && !formData.platformsManaged.includes(value)) {
                          setFormData({ ...formData, platformsManaged: [...formData.platformsManaged, value] });
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    data-testid="input-platforms-managed"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.platformsManaged.map((platform: string, idx: number) => (
                      <Badge key={idx} variant="secondary">
                        {platform}
                        <button
                          type="button"
                          onClick={() => setFormData({ 
                            ...formData, 
                            platformsManaged: formData.platformsManaged.filter((_: string, i: number) => i !== idx) 
                          })}
                          className="ml-2"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Largest Community You've Managed</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 5000"
                    value={formData.maxCommunitySize}
                    onChange={(e) => setFormData({ ...formData, maxCommunitySize: e.target.value })}
                    data-testid="input-max-community-size"
                  />
                </div>

                <div>
                  <Label>Moderation Tools (Press Enter to add)</Label>
                  <Input
                    placeholder="e.g., MEE6, Carl-bot, Collab.Land"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value && !formData.moderationTools.includes(value)) {
                          setFormData({ ...formData, moderationTools: [...formData.moderationTools, value] });
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    data-testid="input-moderation-tools"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.moderationTools.map((tool: string, idx: number) => (
                      <Badge key={idx} variant="secondary">
                        {tool}
                        <button
                          type="button"
                          onClick={() => setFormData({ 
                            ...formData, 
                            moderationTools: formData.moderationTools.filter((_: string, i: number) => i !== idx) 
                          })}
                          className="ml-2"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Timezone Availability</Label>
                  <Input
                    placeholder="e.g., EST, PST, UTC+8"
                    value={formData.timezoneAvailability}
                    onChange={(e) => setFormData({ ...formData, timezoneAvailability: e.target.value })}
                    data-testid="input-timezone-availability"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="raid-coordination"
                    checked={formData.raidCoordination}
                    onCheckedChange={(checked) => setFormData({ ...formData, raidCoordination: checked as boolean })}
                    data-testid="checkbox-raid-coordination"
                  />
                  <Label htmlFor="raid-coordination" className="cursor-pointer">
                    I have experience coordinating raids
                  </Label>
                </div>
              </>
            )}

            {currentStep === 3 && formData.category === "developers" && (
              <>
                <h3 className="text-lg font-semibold">Development Skills</h3>
                
                <div>
                  <Label>Programming Languages (Press Enter to add)</Label>
                  <Input
                    placeholder="e.g., Solidity, Rust, TypeScript"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value) {
                          addToArray('programmingLanguages', value);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    data-testid="input-programming-languages"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.programmingLanguages.map((lang, idx) => (
                      <Badge key={idx} variant="secondary">
                        {lang}
                        <button
                          type="button"
                          onClick={() => removeFromArray('programmingLanguages', lang)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Blockchain Frameworks (Press Enter to add)</Label>
                  <Input
                    placeholder="e.g., Hardhat, Foundry, Anchor"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value) {
                          addToArray('blockchainFrameworks', value);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    data-testid="input-blockchain-frameworks"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.blockchainFrameworks.map((framework, idx) => (
                      <Badge key={idx} variant="secondary">
                        {framework}
                        <button
                          type="button"
                          onClick={() => removeFromArray('blockchainFrameworks', framework)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>GitHub Profile</Label>
                  <Input
                    value={formData.githubProfile}
                    onChange={(e) => setFormData({ ...formData, githubProfile: e.target.value })}
                    placeholder="https://github.com/username"
                    data-testid="input-github"
                  />
                </div>
              </>
            )}

            {currentStep === 3 && formData.category === "volume" && (
              <>
                <h3 className="text-lg font-semibold">Your Trading Background</h3>
                
                <div>
                  <Label>Years of Trading Experience</Label>
                  <Input
                    type="number"
                    value={formData.tradingExperience}
                    onChange={(e) => setFormData({ ...formData, tradingExperience: e.target.value })}
                    placeholder="3"
                    data-testid="input-trading-experience"
                  />
                </div>

                <div>
                  <Label>Volume Capabilities</Label>
                  <Textarea
                    value={formData.volumeCapabilities}
                    onChange={(e) => setFormData({ ...formData, volumeCapabilities: e.target.value })}
                    placeholder="Describe your volume trading capabilities..."
                    rows={3}
                    data-testid="textarea-volume-capabilities"
                  />
                </div>

                <div>
                  <Label>DEXs You Know (Press Enter to add)</Label>
                  <Input
                    placeholder="e.g., Uniswap, PancakeSwap, Raydium"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = e.currentTarget.value.trim();
                        if (value) {
                          addToArray('dexExpertise', value);
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    data-testid="input-dex-expertise"
                  />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.dexExpertise.map((dex, idx) => (
                      <Badge key={idx} variant="secondary">
                        {dex}
                        <button
                          type="button"
                          onClick={() => removeFromArray('dexExpertise', dex)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="compliance"
                    checked={formData.complianceKnowledge}
                    onCheckedChange={(checked) => 
                      setFormData({ ...formData, complianceKnowledge: checked as boolean })
                    }
                    data-testid="checkbox-compliance"
                  />
                  <Label htmlFor="compliance">I have compliance knowledge</Label>
                </div>
              </>
            )}

            {currentStep === 3 && !formData.category && (
              <div className="text-center py-8 text-muted-foreground">
                Please select a category in Step 1 to see relevant fields
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold">Review Your Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Name:</div>
                    <div className="font-medium">{formData.name}</div>
                    
                    <div className="text-muted-foreground">Email:</div>
                    <div className="font-medium">{formData.email}</div>
                    
                    <div className="text-muted-foreground">Category:</div>
                    <div className="font-medium">
                      {CATEGORIES.find(c => c.value === formData.category)?.label}
                    </div>
                    
                    <div className="text-muted-foreground">Skills:</div>
                    <div className="font-medium">{formData.skills.length} skills</div>
                    
                    <div className="text-muted-foreground">Wallet:</div>
                    <div className="font-medium text-xs">{formData.walletAddress.substring(0, 10)}...</div>
                  </div>
                </div>

                {inviteToken && (
                  <div className="bg-purple-500/10 border border-purple-500/20 p-4 rounded-lg">
                    <p className="text-sm">
                      ✨ As an invited builder, your profile will be created immediately and you'll have instant access to the platform!
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Auto-save indicator */}
            {lastSaved && (
              <div className="flex items-center justify-between text-xs text-muted-foreground py-2 px-1">
                <span>
                  Last saved {new Date().getTime() - lastSaved.getTime() < 5000 ? "just now" : "a moment ago"}
                </span>
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 pt-4">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  data-testid="button-back"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              
              <Button
                type="button"
                variant="outline"
                onClick={handleManualSave}
                disabled={isSubmitting}
                data-testid="button-save"
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                Save Progress
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  className="flex-1"
                  disabled={
                    (currentStep === 1 && (!formData.name || !formData.email || !formData.walletAddress || !formData.category || !formData.headline || !formData.bio)) ||
                    (currentStep === 2 && formData.skills.length === 0)
                  }
                  data-testid="button-next"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                  disabled={isSubmitting}
                  data-testid="button-submit"
                >
                  {isSubmitting ? "Submitting..." : inviteToken ? "Complete Setup" : "Submit Application"}
                  {!isSubmitting && <CheckCircle className="ml-2 h-4 w-4" />}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
          </div>

          {/* Sidebar Column - Profile Preview & Strength */}
          <div className="lg:col-span-1 space-y-4">
            <ProfileStrengthWidget
              score={profileStrength}
              suggestions={profileSuggestions}
            />

            <ProfilePreview
              name={formData.name}
              headline={formData.headline}
              bio={formData.bio}
              category={formData.category}
              skills={formData.skills}
              profileImage={profilePhoto}
              responseTime={formData.responseTime}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
