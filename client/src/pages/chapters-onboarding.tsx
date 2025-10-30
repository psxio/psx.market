import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Globe, 
  User, 
  Briefcase, 
  Wallet,
  AlertCircle,
  Sparkles,
  Users,
  Moon,
  Sun,
  MapPin,
  Network,
  Handshake
} from "lucide-react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { ImageUploader } from "@/components/ImageUploader";

interface ChaptersInviteVerification {
  valid: boolean;
  email?: string;
  region?: string;
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

export default function ChaptersOnboarding() {
  const [, params] = useRoute("/chapters-onboarding/:token");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { openConnectModal } = useConnectModal();
  const { address, isConnected } = useAccount();
  
  const inviteToken = params?.token;
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const [darkMode, setDarkMode] = useState(false);

  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    email: "",
    walletAddress: "",
    headline: "",
    bio: "",
    category: "",
    
    // Professional Details
    skills: [] as string[],
    portfolioLinks: [] as string[],
    twitterHandle: "",
    discordHandle: "",
    responseTime: "24 hours",
    
    // Chapters-specific
    region: "",
    chapterRole: "",
    
    // Service/Offering
    serviceTitle: "",
    serviceDescription: "",
    serviceDeliveryTime: "7 days",
    serviceBasicPrice: "",
    serviceBasicDeliverables: [] as string[],
  });

  // Verify chapters invite
  const { data: inviteData, isLoading: isVerifying } = useQuery<ChaptersInviteVerification>({
    queryKey: [`/api/chapters-invites/verify/${inviteToken}`],
    enabled: !!inviteToken,
  });

  // Pre-fill email and region if provided by invite
  useEffect(() => {
    if (inviteData?.valid && inviteData.email) {
      setFormData(prev => ({ ...prev, email: inviteData.email || "" }));
    }
    if (inviteData?.valid && inviteData.region) {
      setFormData(prev => ({ ...prev, region: inviteData.region || "" }));
    }
  }, [inviteData]);

  // Sync wallet address when connected
  useEffect(() => {
    if (isConnected && address) {
      setFormData(prev => ({ ...prev, walletAddress: address }));
    }
  }, [isConnected, address]);

  // Toggle dark mode class on document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, [darkMode]);

  const validateStep = (step: number): boolean => {
    const errors: string[] = [];
    
    if (step === 1) {
      if (!formData.name.trim()) errors.push("Name is required");
      if (!formData.email.trim() || !formData.email.includes("@")) errors.push("Valid email is required");
      if (!formData.walletAddress) errors.push("Please connect your wallet");
      if (!formData.headline.trim()) errors.push("Headline is required");
      if (!formData.bio.trim()) errors.push("Bio is required");
      if (formData.bio.length < 50) errors.push("Bio must be at least 50 characters");
      if (!formData.category) errors.push("Please select a category");
    }
    
    if (step === 2) {
      if (formData.skills.length === 0) errors.push("Add at least one skill");
      if (!formData.twitterHandle && !formData.discordHandle) {
        errors.push("Provide at least one social handle");
      }
    }
    
    if (step === 4) {
      if (!formData.serviceTitle.trim()) errors.push("Service title is required");
      if (!formData.serviceDescription.trim()) errors.push("Service description is required");
      if (formData.serviceDescription.length < 100) errors.push("Description must be at least 100 characters");
      if (!formData.serviceBasicPrice || parseFloat(formData.serviceBasicPrice) <= 0) errors.push("Enter a valid price");
      if (formData.serviceBasicDeliverables.length === 0) errors.push("Add at least one deliverable");
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      setValidationErrors([]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setValidationErrors([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const applicationData = {
        ...formData,
        profileImage: profilePhoto,
        inviteToken,
        isChaptersMember: true,
        // Include service data
        service: {
          title: formData.serviceTitle,
          description: formData.serviceDescription,
          category: formData.category,
          deliveryTime: formData.serviceDeliveryTime,
          basicPrice: parseFloat(formData.serviceBasicPrice),
          basicDeliverables: formData.serviceBasicDeliverables,
        },
      };

      const response = await apiRequest("POST", "/api/builders/onboard", applicationData);
      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Welcome to the Network!",
          description: "You're now part of Based Creators chapters and port444 marketplace with your first service live!",
        });
        setLocation("/builder-dashboard");
      } else {
        throw new Error(data.error || "Onboarding failed");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <Globe className="h-12 w-12 animate-pulse mx-auto mb-4 text-blue-600 dark:text-blue-400" />
          <p className="text-gray-600 dark:text-gray-400">Verifying invite...</p>
        </div>
      </div>
    );
  }

  if (!inviteData?.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-white dark:bg-gray-950">
        <Card className="max-w-md border-red-200 dark:border-red-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              Invalid or Expired Invite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              This chapters invite link is invalid or has already been used.
            </p>
            <Button onClick={() => setLocation("/")} className="w-full">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Based Creators</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Connect. Refer. Grow Together.</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            data-testid="button-toggle-theme"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950 rounded-full mb-4">
            <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {formData.region || "Global Chapter"} Onboarding
            </span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Join Your Chapter
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Create your profile to access both the <strong>Based Creators chapters network</strong> and 
            the <strong>port444 marketplace</strong> — one onboarding, dual benefits.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`
                    h-10 w-10 rounded-full flex items-center justify-center font-semibold transition-all
                    ${currentStep >= step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}
                  `}>
                    {currentStep > step ? <CheckCircle className="h-5 w-5" /> : step}
                  </div>
                  {step < 3 && (
                    <div className={`
                      h-1 w-16 mx-2 transition-all
                      ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-800'}
                    `} />
                  )}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Step {currentStep} of 4
            </span>
          </div>
          <Progress value={(currentStep / 4) * 100} className="h-2" />
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside">
                {validationErrors.map((error, i) => (
                  <li key={i}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-gray-900 dark:text-white">Tell Us About You</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Basic information for your creator profile
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-gray-900 dark:text-white">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="mt-1.5"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-gray-900 dark:text-white">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@example.com"
                    className="mt-1.5"
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div>
                <Label className="text-gray-900 dark:text-white">Base Wallet Address *</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Connect your Base wallet to join the network
                </p>
                {!isConnected ? (
                  <Button
                    onClick={openConnectModal}
                    variant="outline"
                    className="w-full h-12"
                    data-testid="button-connect-wallet"
                  >
                    <Wallet className="mr-2 h-5 w-5" />
                    Connect Base Wallet
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <Input
                      value={formData.walletAddress}
                      disabled
                      className="flex-1 bg-transparent border-0 text-sm"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="category" className="text-gray-900 dark:text-white">What Do You Do? *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category" className="mt-1.5">
                    <SelectValue placeholder="Select your primary expertise..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(cat => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="headline" className="text-gray-900 dark:text-white">Professional Headline *</Label>
                <Input
                  id="headline"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="e.g., Expert 3D Artist specializing in character design"
                  maxLength={100}
                  className="mt-1.5"
                  data-testid="input-headline"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.headline.length}/100 characters
                </p>
              </div>

              <div>
                <Label htmlFor="bio" className="text-gray-900 dark:text-white">About You *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Share your experience, skills, and what makes you unique as a creator..."
                  rows={6}
                  maxLength={1000}
                  className="mt-1.5"
                  data-testid="input-bio"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.bio.length}/1000 characters (minimum 50)
                </p>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleNext} size="lg" data-testid="button-next">
                  Continue to Skills
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Professional Details */}
        {currentStep === 2 && (
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-gray-900 dark:text-white">Your Expertise</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Skills and experience to showcase in the network
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div>
                <Label htmlFor="skills" className="text-gray-900 dark:text-white">Skills (comma-separated) *</Label>
                <Input
                  id="skills"
                  value={formData.skills.join(", ")}
                  onChange={(e) => setFormData({
                    ...formData,
                    skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="3D Modeling, Blender, Character Design, Animation"
                  className="mt-1.5"
                  data-testid="input-skills"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="portfolioLinks" className="text-gray-900 dark:text-white">Portfolio Links (comma-separated)</Label>
                <Input
                  id="portfolioLinks"
                  value={formData.portfolioLinks.join(", ")}
                  onChange={(e) => setFormData({
                    ...formData,
                    portfolioLinks: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="https://yourportfolio.com, https://behance.net/yourname"
                  className="mt-1.5"
                  data-testid="input-portfolio"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="twitter" className="text-gray-900 dark:text-white">Twitter/X Handle</Label>
                  <Input
                    id="twitter"
                    value={formData.twitterHandle}
                    onChange={(e) => setFormData({ ...formData, twitterHandle: e.target.value })}
                    placeholder="@yourusername"
                    className="mt-1.5"
                    data-testid="input-twitter"
                  />
                </div>
                <div>
                  <Label htmlFor="discord" className="text-gray-900 dark:text-white">Discord Handle</Label>
                  <Input
                    id="discord"
                    value={formData.discordHandle}
                    onChange={(e) => setFormData({ ...formData, discordHandle: e.target.value })}
                    placeholder="username#1234"
                    className="mt-1.5"
                    data-testid="input-discord"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="responseTime" className="text-gray-900 dark:text-white">Typical Response Time</Label>
                <Select
                  value={formData.responseTime}
                  onValueChange={(value) => setFormData({ ...formData, responseTime: value })}
                >
                  <SelectTrigger id="responseTime" className="mt-1.5">
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

              <div className="flex justify-between pt-4">
                <Button onClick={handleBack} variant="outline" size="lg">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
                <Button onClick={handleNext} size="lg" data-testid="button-next-step2">
                  Continue to Profile Photo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Profile Photo */}
        {currentStep === 3 && (
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-gray-900 dark:text-white">Your Profile Photo</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Add a professional photo to build trust
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div>
                <Label className="text-gray-900 dark:text-white">Profile Photo</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  A professional photo helps build trust in the network
                </p>
                <ImageUploader
                  onUploadComplete={setProfilePhoto}
                  currentImage={profilePhoto}
                  label="Upload Profile Photo"
                />
              </div>

              <div className="flex justify-between pt-4">
                <Button onClick={handleBack} variant="outline" size="lg">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
                <Button onClick={handleNext} size="lg" data-testid="button-next-step3">
                  Continue to Service Creation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Create Your First Service */}
        {currentStep === 4 && (
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-gray-900 dark:text-white">Create Your First Service</CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    What service will you offer to clients on port444?
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <Alert className="border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-950">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <AlertDescription className="text-sm text-purple-800 dark:text-purple-200">
                  This service will be live on port444 marketplace immediately after you join. Clients can discover and book you right away!
                </AlertDescription>
              </Alert>

              <div>
                <Label htmlFor="serviceTitle" className="text-gray-900 dark:text-white">Service Title *</Label>
                <Input
                  id="serviceTitle"
                  value={formData.serviceTitle}
                  onChange={(e) => setFormData({ ...formData, serviceTitle: e.target.value })}
                  placeholder="e.g., I will create professional 3D character models"
                  maxLength={80}
                  className="mt-1.5"
                  data-testid="input-service-title"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.serviceTitle.length}/80 characters
                </p>
              </div>

              <div>
                <Label htmlFor="serviceDescription" className="text-gray-900 dark:text-white">Service Description *</Label>
                <Textarea
                  id="serviceDescription"
                  value={formData.serviceDescription}
                  onChange={(e) => setFormData({ ...formData, serviceDescription: e.target.value })}
                  placeholder="Describe what you'll deliver, your process, and what makes your service unique..."
                  rows={8}
                  maxLength={2000}
                  className="mt-1.5"
                  data-testid="input-service-description"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.serviceDescription.length}/2000 characters (minimum 100)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="serviceBasicPrice" className="text-gray-900 dark:text-white">Price (USDC) *</Label>
                  <Input
                    id="serviceBasicPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.serviceBasicPrice}
                    onChange={(e) => setFormData({ ...formData, serviceBasicPrice: e.target.value })}
                    placeholder="500"
                    className="mt-1.5"
                    data-testid="input-service-price"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Set your base price in USDC
                  </p>
                </div>

                <div>
                  <Label htmlFor="serviceDeliveryTime" className="text-gray-900 dark:text-white">Delivery Time</Label>
                  <Select
                    value={formData.serviceDeliveryTime}
                    onValueChange={(value) => setFormData({ ...formData, serviceDeliveryTime: value })}
                  >
                    <SelectTrigger id="serviceDeliveryTime" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24 hours">24 hours</SelectItem>
                      <SelectItem value="3 days">3 days</SelectItem>
                      <SelectItem value="7 days">7 days</SelectItem>
                      <SelectItem value="14 days">14 days</SelectItem>
                      <SelectItem value="30 days">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="serviceDeliverables" className="text-gray-900 dark:text-white">What's Included (comma-separated) *</Label>
                <Input
                  id="serviceDeliverables"
                  value={formData.serviceBasicDeliverables.join(", ")}
                  onChange={(e) => setFormData({
                    ...formData,
                    serviceBasicDeliverables: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="3D model, texture files, source files, commercial use rights"
                  className="mt-1.5"
                  data-testid="input-service-deliverables"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.serviceBasicDeliverables.map((item, i) => (
                    <Badge key={i} variant="secondary" className="bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-xl p-6 border border-blue-200 dark:border-blue-900">
                <h3 className="font-semibold flex items-center gap-2 text-gray-900 dark:text-white mb-4">
                  <Network className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Your Complete Profile
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Chapter</p>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      <p className="font-medium text-gray-900 dark:text-white">{formData.region || "Global"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Category</p>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {CATEGORIES.find(c => c.value === formData.category)?.label || formData.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">Service Price</p>
                    <p className="font-medium text-gray-900 dark:text-white">${formData.serviceBasicPrice} USDC</p>
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <p className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.skills.slice(0, 5).map((skill, i) => (
                        <Badge key={i} variant="secondary" className="bg-white dark:bg-gray-900 text-blue-700 dark:text-blue-300 text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {formData.skills.length > 5 && (
                        <Badge variant="secondary" className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 text-xs">
                          +{formData.skills.length - 5} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Alert className="border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950">
                <div className="flex gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">Dual Platform Access</h4>
                    <AlertDescription className="text-sm text-green-800 dark:text-green-200">
                      Upon completion, you'll have profiles on:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li><strong>Based Creators</strong> — Chapter network for local connections</li>
                        <li><strong>port444</strong> — Global marketplace with your service live</li>
                      </ul>
                    </AlertDescription>
                  </div>
                </div>
              </Alert>

              <div className="flex justify-between pt-4">
                <Button onClick={handleBack} variant="outline" size="lg">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                  data-testid="button-submit"
                >
                  {isSubmitting ? "Creating Your Accounts..." : (
                    <>
                      <Handshake className="mr-2 h-5 w-5" />
                      Launch My Profile
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Based Creators × port444 • Local Network, Global Reach
          </p>
        </div>
      </footer>
    </div>
  );
}
