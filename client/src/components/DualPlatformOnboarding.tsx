import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { queryClient } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { 
  Sparkles, Repeat2, CheckCircle2, ExternalLink, X, Plus,
  User, Mail, Briefcase, Github, MapPin, DollarSign, Clock, Globe, Loader2
} from 'lucide-react';
import { SiX, SiFarcaster } from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PORT444_CATEGORIES, 
  SKILL_SUGGESTIONS, 
  YEARS_OF_EXPERIENCE,
  LANGUAGES,
  TIMEZONES,
  INDUSTRIES
} from '@/lib/onboardingConstants';

interface DualPlatformOnboardingProps {
  onComplete: (data: any) => void;
}

interface OnboardingFormData {
  firstName: string;
  lastName: string;
  email: string;
  industries: string[];
  chapterId: string;
  githubUrl: string;
  xProfile: string;
  farcasterProfile: string;
  zoraProfile: string;
  baseProfile: string;
  categories: string[];
  bio: string;
  yearsOfExperience: string;
  skills: string[];
  languages: string[];
  timezone: string;
  minimumBudget: string;
  hourlyRate: string;
  portfolioLink1: string;
  portfolioLink2: string;
  portfolioLink3: string;
  telegramHandle: string;
  certifications: string;
}

export function DualPlatformOnboarding({ onComplete }: DualPlatformOnboardingProps) {
  const { toast } = useToast();
  const { user: privyUser } = usePrivy();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [enablePort444, setEnablePort444] = useState(false);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<OnboardingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    industries: [],
    chapterId: '',
    githubUrl: '',
    xProfile: '',
    farcasterProfile: '',
    zoraProfile: '',
    baseProfile: '',
    categories: [],
    bio: '',
    yearsOfExperience: '',
    skills: [],
    languages: [],
    timezone: '',
    minimumBudget: '',
    hourlyRate: '',
    portfolioLink1: '',
    portfolioLink2: '',
    portfolioLink3: '',
    telegramHandle: '',
    certifications: ''
  });
  
  const [oauthConnections, setOauthConnections] = useState({
    github: false,
    twitter: false,
    farcaster: false,
    zora: false,
    base: false
  });
  
  // Get suggested skills based on selected categories
  const getSuggestedSkills = () => {
    const allSuggestions = new Set<string>();
    formData.categories.forEach(cat => {
      const suggestions = SKILL_SUGGESTIONS[cat] || [];
      suggestions.forEach(skill => allSuggestions.add(skill));
    });
    return Array.from(allSuggestions).filter(s => !formData.skills.includes(s));
  };
  
  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };
  
  const addSkill = (skill: string) => {
    if (formData.skills.length >= 15) {
      toast({ title: 'Maximum 15 skills', variant: 'destructive' });
      return;
    }
    if (!formData.skills.includes(skill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };
  
  const removeSkill = (skill: string) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };
  
  const addCustomSkill = () => {
    if (!customSkillInput.trim()) return;
    addSkill(customSkillInput.trim());
    setCustomSkillInput('');
  };
  
  const toggleLanguage = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };
  
  const validateStep = () => {
    if (step === 1) return true;
    
    if (step === 2) {
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        toast({ title: 'First and last name required', variant: 'destructive' });
        return false;
      }
      return true;
    }
    
    if (step === 3) return true;
    
    if (step === 4 && enablePort444) {
      if (formData.categories.length === 0) {
        toast({ title: 'Select at least one category', variant: 'destructive' });
        return false;
      }
      if (formData.bio.length < 100) {
        toast({ title: 'Bio must be at least 100 characters', variant: 'destructive' });
        return false;
      }
      if (!formData.yearsOfExperience) {
        toast({ title: 'Years of experience required', variant: 'destructive' });
        return false;
      }
      if (formData.skills.length < 3) {
        toast({ title: 'Add at least 3 skills', variant: 'destructive' });
        return false;
      }
      if (!formData.timezone) {
        toast({ title: 'Timezone required', variant: 'destructive' });
        return false;
      }
      if (!formData.minimumBudget || parseInt(formData.minimumBudget) < 50) {
        toast({ title: 'Minimum budget must be at least $50', variant: 'destructive' });
        return false;
      }
      return true;
    }
    
    return true;
  };
  
  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 5) setStep((step + 1) as any);
  };
  
  const handleBack = () => {
    if (step > 1) setStep((step - 1) as any);
  };
  
  const handleComplete = async () => {
    if (!validateStep()) return;
    setIsSubmitting(true);
    
    try {
      const walletAccount = privyUser?.linkedAccounts?.find((acc: any) => acc.type === 'wallet');
      const walletAddress = privyUser?.wallet?.address || (walletAccount as any)?.address;
      
      const payload = {
        walletAddress,
        privyId: privyUser?.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || privyUser?.email?.address,
        industries: formData.industries,
        chapterId: formData.chapterId,
        socialProfiles: {
          github: formData.githubUrl,
          twitter: formData.xProfile || privyUser?.twitter?.username,
          farcaster: formData.farcasterProfile,
          zora: formData.zoraProfile,
          base: formData.baseProfile,
        },
        enablePort444: formData.categories.length > 0,
        categories: formData.categories,
        bio: formData.bio,
        yearsOfExperience: formData.yearsOfExperience,
        skills: formData.skills,
        languages: formData.languages,
        timezone: formData.timezone,
        minimumBudget: formData.minimumBudget ? parseInt(formData.minimumBudget) : undefined,
        hourlyRate: formData.hourlyRate ? parseInt(formData.hourlyRate) : undefined,
        portfolioLinks: [
          formData.portfolioLink1,
          formData.portfolioLink2,
          formData.portfolioLink3
        ].filter(Boolean),
        telegramHandle: formData.telegramHandle,
        certifications: formData.certifications,
      };

      const response = await fetch('/api/dual-platform/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (response.ok) {
        const result = await response.json();
        
        toast({
          title: 'Welcome to the community! 🎉',
          description: `Your account${formData.categories.length > 0 ? 's have' : ' has'} been created successfully.`,
        });

        await queryClient.invalidateQueries({ queryKey: ['/api/builders/me'] });
        await queryClient.invalidateQueries({ queryKey: ['/api/clients/me'] });

        onComplete(result);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create account');
      }
    } catch (error: any) {
      console.error('Onboarding error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to complete onboarding. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Floating particles animation
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 3,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 8 + 12
  }));
  
  // Get wallet address for display
  const walletAccount = privyUser?.linkedAccounts?.find((acc: any) => acc.type === 'wallet');
  const walletAddress = privyUser?.wallet?.address || 
                        (walletAccount as any)?.address ||
                        '0x0000000000000000000000000000000000000000';
  
  return (
    <div className="max-w-4xl mx-auto p-6" data-testid="dual-platform-onboarding">
      <AnimatePresence mode="wait">
        {/* Step 1: Welcome & Platform Choice */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <Card className="relative overflow-hidden border-2">
              {/* Floating Particles Background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {particles.map(p => (
                  <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-primary/20"
                    style={{
                      width: p.size,
                      height: p.size,
                      left: `${p.x}%`,
                      top: `${p.y}%`
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.15, 0.4, 0.15],
                      scale: [0.8, 1.2, 0.8]
                    }}
                    transition={{
                      duration: p.duration,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
              
              {/* Shimmer Gradient */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(to right, transparent, hsl(221 83% 53% / 0.2), transparent)'
                }}
                animate={{
                  x: ['-100%', '200%']
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              <CardHeader className="relative z-10 text-center pb-8">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block"
                >
                  <Sparkles className="h-8 w-8 mx-auto mb-3 text-primary" />
                </motion.div>
                <CardTitle className="text-3xl font-bold">Welcome to Based Creators!</CardTitle>
                <CardDescription className="text-base mt-2">
                  Connected: <span className="font-mono font-medium">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                </CardDescription>
                <p className="text-muted-foreground mt-1">
                  One wallet, two powerful platforms for creators
                </p>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-6">
                {/* Dual Platform Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="relative">
                    <CardHeader>
                      <CardTitle className="text-lg">Based Creators</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>Chapters</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>Referrals</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span>Meetings</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="relative">
                    <CardHeader>
                      <CardTitle className="text-lg">port444</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-600" />
                        <span>Services</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-600" />
                        <span>Portfolio</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-600" />
                        <span>Marketplace</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Connection Icon */}
                <div className="flex justify-center">
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-primary"
                      animate={{
                        scale: [1, 1.8, 1],
                        opacity: [0.6, 0, 0.6]
                      }}
                      transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: "easeOut"
                      }}
                    />
                    <motion.div
                      className="relative p-3 bg-primary/10 rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Repeat2 className="h-6 w-6 text-primary" />
                    </motion.div>
                  </div>
                </div>
                
                {/* Toggle Section */}
                <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium mb-1">💡 Complete the optional port444 section</p>
                        <p className="text-sm text-muted-foreground">
                          to get both accounts and unlock marketplace features
                        </p>
                      </div>
                      <Switch
                        checked={enablePort444}
                        onCheckedChange={setEnablePort444}
                        className="ml-4"
                        data-testid="switch-enable-port444"
                      />
                    </div>
                    {enablePort444 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-purple-200"
                      >
                        <Badge variant="default" className="bg-purple-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          port444 Profile Enabled
                        </Badge>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
                
                <Button
                  onClick={handleNext}
                  className="w-full h-12"
                  size="lg"
                  data-testid="button-start-onboarding"
                >
                  Start Onboarding
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* Step 2: Basic Information */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Tell us about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      First Name <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        placeholder="Satoshi"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="pl-10"
                        data-testid="input-first-name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      Last Name <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        placeholder="Nakamoto"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="pl-10"
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="satoshi@base.org"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      data-testid="input-email"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="industry">
                    Industries <span className="text-muted-foreground text-xs">(Select all that apply)</span>
                  </Label>
                  
                  {/* Selected Industries Display */}
                  {formData.industries.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.industries.map(ind => (
                        <Badge key={ind} variant="secondary" className="gap-1">
                          {ind}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-destructive"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              industries: prev.industries.filter(i => i !== ind)
                            }))}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Select 
                      value="" 
                      onValueChange={(val) => {
                        if (val && !formData.industries.includes(val)) {
                          setFormData(prev => ({
                            ...prev,
                            industries: [...prev.industries, val]
                          }));
                        }
                      }}
                    >
                      <SelectTrigger className="pl-10" data-testid="select-industry">
                        <SelectValue placeholder={formData.industries.length > 0 ? "Add another industry" : "Select industries"} />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.filter(ind => !formData.industries.includes(ind)).map(ind => (
                          <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleNext} className="flex-1" data-testid="button-next-step-2">
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* Step 3: Social Profiles */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Connect Social Profiles</CardTitle>
                <CardDescription>
                  Connect your accounts to verify ownership (Optional)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-3">
                  <Button
                    variant={oauthConnections.github ? "default" : "outline"}
                    className="h-16 justify-start gap-3"
                    onClick={() => {
                      // OAuth flow would go here
                      setOauthConnections({ ...oauthConnections, github: !oauthConnections.github });
                    }}
                    data-testid="button-connect-github"
                  >
                    {oauthConnections.github ? <CheckCircle2 className="h-5 w-5" /> : <Github className="h-5 w-5" />}
                    <span>Connect GitHub</span>
                  </Button>
                  
                  <Button
                    variant={oauthConnections.twitter ? "default" : "outline"}
                    className="h-16 justify-start gap-3"
                    onClick={() => {
                      setOauthConnections({ ...oauthConnections, twitter: !oauthConnections.twitter });
                    }}
                    data-testid="button-connect-twitter"
                  >
                    {oauthConnections.twitter ? <CheckCircle2 className="h-5 w-5" /> : <SiX className="h-5 w-5" />}
                    <span>Connect Twitter</span>
                  </Button>
                  
                  <Button
                    variant={oauthConnections.farcaster ? "default" : "outline"}
                    className="h-16 justify-start gap-3"
                    onClick={() => {
                      setOauthConnections({ ...oauthConnections, farcaster: !oauthConnections.farcaster });
                    }}
                    data-testid="button-connect-farcaster"
                  >
                    {oauthConnections.farcaster ? <CheckCircle2 className="h-5 w-5" /> : <SiFarcaster className="h-5 w-5" />}
                    <span>Connect Farcaster</span>
                  </Button>
                  
                  <Button
                    variant={oauthConnections.zora ? "default" : "outline"}
                    className="h-16 justify-start gap-3"
                    onClick={() => {
                      setOauthConnections({ ...oauthConnections, zora: !oauthConnections.zora });
                    }}
                    data-testid="button-connect-zora"
                  >
                    {oauthConnections.zora ? <CheckCircle2 className="h-5 w-5" /> : <ExternalLink className="h-5 w-5" />}
                    <span>Connect Zora</span>
                  </Button>
                </div>
                
                <Button
                  variant={oauthConnections.base ? "default" : "outline"}
                  className="w-full h-16 justify-start gap-3"
                  onClick={() => {
                    setOauthConnections({ ...oauthConnections, base: !oauthConnections.base });
                  }}
                  data-testid="button-connect-base"
                >
                  {oauthConnections.base ? <CheckCircle2 className="h-5 w-5" /> : <ExternalLink className="h-5 w-5" />}
                  <span>Connect Base Profile</span>
                </Button>
                
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleNext} className="flex-1" data-testid="button-next-step-3">
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* Step 4: port444 Profile (if enabled) */}
        {step === 4 && !enablePort444 && (
          <motion.div
            key="step4-skip"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  port444 profile not enabled. Skipping to chapter selection...
                </p>
                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={handleBack}>
                    Back
                  </Button>
                  <Button onClick={handleNext}>
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {step === 4 && enablePort444 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>port444 Professional Profile</CardTitle>
                <CardDescription>
                  Build your marketplace presence
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Categories Multi-Select */}
                <div className="space-y-3">
                  <Label>
                    Service Categories <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Select all that apply (minimum 1)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PORT444_CATEGORIES.map(cat => (
                      <motion.button
                        key={cat.value}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleCategory(cat.value)}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                          formData.categories.includes(cat.value)
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover-elevate'
                        }`}
                        data-testid={`button-category-${cat.value}`}
                      >
                        {formData.categories.includes(cat.value) && (
                          <CheckCircle2 className="h-3 w-3 inline mr-1" />
                        )}
                        {cat.label}
                      </motion.button>
                    ))}
                  </div>
                  {formData.categories.length > 0 && (
                    <Badge variant="outline">
                      ✓ {formData.categories.length} categories selected
                    </Badge>
                  )}
                </div>
                
                {/* Professional Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">
                    Professional Bio <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Experienced Web3 developer specializing in smart contracts and DeFi protocols. Built 20+ production contracts with zero security incidents..."
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="min-h-[120px] resize-none"
                    data-testid="input-bio"
                  />
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Minimum 100 characters</span>
                    <span className={formData.bio.length < 100 ? 'text-destructive' : 'text-green-600'}>
                      {formData.bio.length}/1000
                    </span>
                  </div>
                </div>
                
                {/* Years of Experience & Timezone */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>
                      Years of Experience <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Select 
                        value={formData.yearsOfExperience} 
                        onValueChange={(val) => setFormData({ ...formData, yearsOfExperience: val })}
                      >
                        <SelectTrigger className="pl-10" data-testid="select-experience">
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          {YEARS_OF_EXPERIENCE.map(exp => (
                            <SelectItem key={exp.value} value={exp.value}>{exp.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>
                      Timezone <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Select 
                        value={formData.timezone} 
                        onValueChange={(val) => setFormData({ ...formData, timezone: val })}
                      >
                        <SelectTrigger className="pl-10" data-testid="select-timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIMEZONES.map(tz => (
                            <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                {/* Skills */}
                <div className="space-y-3">
                  <Label>
                    Skills <span className="text-destructive">*</span>
                    <span className="text-sm text-muted-foreground ml-2">(minimum 3, up to 15)</span>
                  </Label>
                  
                  {/* Custom Skill Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type to add custom skill..."
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomSkill())}
                      data-testid="input-custom-skill"
                    />
                    <Button
                      onClick={addCustomSkill}
                      variant="outline"
                      disabled={!customSkillInput.trim()}
                      data-testid="button-add-custom-skill"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Suggested Skills */}
                  {formData.categories.length > 0 && getSuggestedSkills().length > 0 && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Suggested for your categories:</p>
                      <div className="flex flex-wrap gap-2">
                        {getSuggestedSkills().slice(0, 12).map(skill => (
                          <Badge
                            key={skill}
                            variant="outline"
                            className="cursor-pointer hover-elevate"
                            onClick={() => addSkill(skill)}
                            data-testid={`badge-suggested-skill-${skill}`}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Selected Skills */}
                  {formData.skills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Your skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map(skill => (
                          <Badge
                            key={skill}
                            variant="default"
                            className="cursor-pointer"
                            data-testid={`badge-selected-skill-${skill}`}
                          >
                            {skill}
                            <X 
                              className="h-3 w-3 ml-1" 
                              onClick={() => removeSkill(skill)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {formData.skills.length}/15 skills
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Pricing */}
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-base">Pricing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="minimumBudget">
                          Minimum Project Budget <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="minimumBudget"
                            type="number"
                            min="50"
                            placeholder="500"
                            value={formData.minimumBudget}
                            onChange={(e) => setFormData({ ...formData, minimumBudget: e.target.value })}
                            className="pl-10"
                            data-testid="input-minimum-budget"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="hourlyRate">
                          Hourly Rate <Badge variant="outline" className="ml-2">Optional</Badge>
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="hourlyRate"
                            type="number"
                            placeholder="100"
                            value={formData.hourlyRate}
                            onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                            className="pl-10"
                            data-testid="input-hourly-rate"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Additional Information (Accordion) */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="additional">
                    <AccordionTrigger>
                      <span className="font-medium">Additional Information</span>
                      <Badge variant="outline" className="ml-2">Recommended</Badge>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      {/* Portfolio Links */}
                      <div className="space-y-2">
                        <Label>Portfolio Links (up to 3)</Label>
                        <Input
                          placeholder="https://github.com/yourname/project"
                          value={formData.portfolioLink1}
                          onChange={(e) => setFormData({ ...formData, portfolioLink1: e.target.value })}
                          data-testid="input-portfolio-1"
                        />
                        <Input
                          placeholder="https://basescan.org/address/0x..."
                          value={formData.portfolioLink2}
                          onChange={(e) => setFormData({ ...formData, portfolioLink2: e.target.value })}
                          data-testid="input-portfolio-2"
                        />
                        <Input
                          placeholder="https://yourportfolio.com"
                          value={formData.portfolioLink3}
                          onChange={(e) => setFormData({ ...formData, portfolioLink3: e.target.value })}
                          data-testid="input-portfolio-3"
                        />
                      </div>
                      
                      {/* Languages */}
                      <div className="space-y-2">
                        <Label>Languages Spoken</Label>
                        <div className="flex flex-wrap gap-2">
                          {LANGUAGES.map(lang => (
                            <Badge
                              key={lang}
                              variant={formData.languages.includes(lang) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => toggleLanguage(lang)}
                              data-testid={`badge-language-${lang}`}
                            >
                              {formData.languages.includes(lang) && <CheckCircle2 className="h-3 w-3 mr-1" />}
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Telegram */}
                      <div className="space-y-2">
                        <Label htmlFor="telegram">Telegram Handle</Label>
                        <Input
                          id="telegram"
                          placeholder="@yourhandle"
                          value={formData.telegramHandle}
                          onChange={(e) => setFormData({ ...formData, telegramHandle: e.target.value })}
                          data-testid="input-telegram"
                        />
                      </div>
                      
                      {/* Certifications */}
                      <div className="space-y-2">
                        <Label htmlFor="certifications">Certifications</Label>
                        <Textarea
                          id="certifications"
                          placeholder="Certified Solidity Developer, AWS Certified..."
                          value={formData.certifications}
                          onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                          className="resize-none"
                          data-testid="input-certifications"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleNext} className="flex-1" data-testid="button-next-step-4">
                    Continue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {/* Step 5: Chapter Selection */}
        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Join a Chapter</CardTitle>
                <CardDescription>
                  Connect with local creators in your area
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="chapter">Select Chapter</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Select 
                      value={formData.chapterId} 
                      onValueChange={(val) => setFormData({ ...formData, chapterId: val })}
                    >
                      <SelectTrigger className="pl-10" data-testid="select-chapter">
                        <SelectValue placeholder="Choose your chapter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="austin">Based Creators Austin - Austin, TX</SelectItem>
                        <SelectItem value="nyc">Based Creators NYC - New York, NY</SelectItem>
                        <SelectItem value="sf">Based Creators SF - San Francisco, CA</SelectItem>
                        <SelectItem value="la">Based Creators LA - Los Angeles, CA</SelectItem>
                        <SelectItem value="miami">Based Creators Miami - Miami, FL</SelectItem>
                        <SelectItem value="denver">Based Creators Denver - Denver, CO</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You can change your chapter later or join additional chapters
                  </p>
                </div>
                
                {/* Summary */}
                <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="text-base">🎉 Almost Done!</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span>Based Creators account ready</span>
                    </div>
                    {enablePort444 && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-purple-600" />
                        <span>port444 marketplace profile ready</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600" />
                      <span>{formData.skills.length} skills • {formData.categories.length} categories</span>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={handleBack} className="flex-1" disabled={isSubmitting}>
                    Back
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleComplete}
                    className="flex-1"
                    data-testid="button-skip-chapter"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Skip for Now
                  </Button>
                  <Button
                    onClick={handleComplete}
                    className="flex-1 h-12"
                    size="lg"
                    data-testid="button-complete-onboarding"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    )}
                    {isSubmitting ? 'Creating Account...' : 'Complete Setup'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Progress Indicator */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {[1, 2, 3, 4, 5].map(s => (
          <div
            key={s}
            className={`h-2 w-2 rounded-full transition-all ${
              s === step ? 'bg-primary w-8' : s < step ? 'bg-primary/60' : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
