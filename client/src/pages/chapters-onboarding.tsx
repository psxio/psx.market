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
  Globe, 
  User, 
  Briefcase, 
  Wallet,
  AlertCircle,
  Sparkles,
  Users
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
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
      setValidationErrors([]);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setValidationErrors([]);
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
      };

      const response = await apiRequest("POST", "/api/builders/onboard", applicationData);
      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Welcome to Based Creators & port444!",
          description: "Your profile is being reviewed. You'll receive an email when approved.",
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Globe className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p>Verifying invite...</p>
        </div>
      </div>
    );
  }

  if (!inviteData?.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Invalid or Expired Invite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
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
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Based Creators Chapters
            </h1>
          </div>
          <p className="text-lg text-muted-foreground mb-2">
            2-in-1 Onboarding: Join your chapter & access the marketplace
          </p>
          {formData.region && (
            <Badge variant="secondary" className="text-lg px-4 py-1">
              <Globe className="h-4 w-4 mr-2" />
              {formData.region} Chapter
            </Badge>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={(currentStep / 3) * 100} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Step {currentStep} of 3</span>
            <span>{Math.round((currentStep / 3) * 100)}% Complete</span>
          </div>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Tell us about yourself for both the chapters app and marketplace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@example.com"
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div>
                <Label>Wallet Address *</Label>
                {!isConnected ? (
                  <Button
                    onClick={openConnectModal}
                    variant="outline"
                    className="w-full"
                    data-testid="button-connect-wallet"
                  >
                    <Wallet className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Input
                      value={formData.walletAddress}
                      disabled
                      className="flex-1"
                    />
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="category">Primary Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select your expertise..." />
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
                <Label htmlFor="headline">Professional Headline *</Label>
                <Input
                  id="headline"
                  value={formData.headline}
                  onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                  placeholder="e.g., Expert 3D Artist specializing in character design"
                  maxLength={100}
                  data-testid="input-headline"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.headline.length}/100 characters
                </p>
              </div>

              <div>
                <Label htmlFor="bio">Bio *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about your experience, skills, and what makes you unique..."
                  rows={6}
                  maxLength={1000}
                  data-testid="input-bio"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.bio.length}/1000 characters (minimum 50)
                </p>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleNext} data-testid="button-next">
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Professional Details */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Professional Details
              </CardTitle>
              <CardDescription>
                Showcase your skills and social presence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="skills">Skills (comma-separated) *</Label>
                <Input
                  id="skills"
                  value={formData.skills.join(", ")}
                  onChange={(e) => setFormData({
                    ...formData,
                    skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="3D Modeling, Blender, Character Design"
                  data-testid="input-skills"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.skills.length} skill(s) added
                </p>
              </div>

              <div>
                <Label htmlFor="portfolioLinks">Portfolio Links (comma-separated)</Label>
                <Input
                  id="portfolioLinks"
                  value={formData.portfolioLinks.join(", ")}
                  onChange={(e) => setFormData({
                    ...formData,
                    portfolioLinks: e.target.value.split(",").map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="https://yourportfolio.com, https://behance.net/yourname"
                  data-testid="input-portfolio"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="twitter">Twitter/X Handle</Label>
                  <Input
                    id="twitter"
                    value={formData.twitterHandle}
                    onChange={(e) => setFormData({ ...formData, twitterHandle: e.target.value })}
                    placeholder="@yourusername"
                    data-testid="input-twitter"
                  />
                </div>
                <div>
                  <Label htmlFor="discord">Discord Handle</Label>
                  <Input
                    id="discord"
                    value={formData.discordHandle}
                    onChange={(e) => setFormData({ ...formData, discordHandle: e.target.value })}
                    placeholder="username#1234"
                    data-testid="input-discord"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="responseTime">Typical Response Time</Label>
                <Select
                  value={formData.responseTime}
                  onValueChange={(value) => setFormData({ ...formData, responseTime: value })}
                >
                  <SelectTrigger id="responseTime">
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

              <div className="flex justify-between">
                <Button onClick={handleBack} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleNext} data-testid="button-next-step2">
                  Next Step
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Profile Photo & Review */}
        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Finalize Your Profile
              </CardTitle>
              <CardDescription>
                Add a profile photo and review your information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Profile Photo</Label>
                <ImageUploader
                  onUploadComplete={setProfilePhoto}
                  currentImage={profilePhoto}
                  label="Upload Profile Photo"
                />
              </div>

              <div className="bg-muted/50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Your Profile Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{formData.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p className="font-medium">{formData.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="font-medium">
                      {CATEGORIES.find(c => c.value === formData.category)?.label || formData.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Chapter Region</p>
                    <p className="font-medium">{formData.region || "Not specified"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Headline</p>
                    <p className="font-medium">{formData.headline}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Skills</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Alert>
                <Globe className="h-4 w-4" />
                <AlertDescription>
                  By submitting, you're creating profiles on both <strong>basedcreators.xyz</strong> (chapters app) 
                  and <strong>port444</strong> (marketplace). You'll get access to both platforms!
                </AlertDescription>
              </Alert>

              <div className="flex justify-between">
                <Button onClick={handleBack} variant="outline">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  data-testid="button-submit"
                >
                  {isSubmitting ? "Submitting..." : "Complete Onboarding"}
                  <CheckCircle className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
