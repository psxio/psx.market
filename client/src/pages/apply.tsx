import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Megaphone,
  Box,
  TrendingUp,
  Code,
  BarChart3,
  Plus,
  X,
  Wallet,
} from "lucide-react";
import type { InsertBuilderApplication } from "@shared/schema";

const categories = [
  {
    name: "KOLs & Influencers",
    slug: "kols",
    icon: Megaphone,
    description: "Crypto influencers with proven reach across Twitter, YouTube, and Telegram",
  },
  {
    name: "3D Content Creators",
    slug: "3d-content",
    icon: Box,
    description: "Professional 3D artists creating stunning visuals and animations",
  },
  {
    name: "Marketing & Growth",
    slug: "marketing",
    icon: TrendingUp,
    description: "Expert marketers driving growth for crypto projects",
  },
  {
    name: "Script Development",
    slug: "development",
    icon: Code,
    description: "Smart contract and token development experts",
  },
  {
    name: "Volume Services",
    slug: "volume",
    icon: BarChart3,
    description: "Liquidity and volume generation specialists",
  },
];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  category: z.string().min(1, "Please select a category"),
  portfolioLinks: z.array(z.string().url()).optional(),
  yearsExperience: z.number().min(0).max(50),
  
  twitterHandle: z.string().optional(),
  twitterFollowers: z.number().optional(),
  instagramHandle: z.string().optional(),
  instagramFollowers: z.number().optional(),
  youtubeChannel: z.string().optional(),
  youtubeSubscribers: z.number().optional(),
  engagementRate: z.number().optional(),
  contentNiches: z.array(z.string()).optional(),
  
  software3D: z.array(z.string()).optional(),
  renderEngines: z.array(z.string()).optional(),
  styleSpecialties: z.array(z.string()).optional(),
  
  marketingPlatforms: z.array(z.string()).optional(),
  growthStrategies: z.array(z.string()).optional(),
  caseStudyLinks: z.array(z.string()).optional(),
  
  programmingLanguages: z.array(z.string()).optional(),
  blockchainFrameworks: z.array(z.string()).optional(),
  githubProfile: z.string().optional(),
  
  tradingExperience: z.number().optional(),
  volumeCapabilities: z.string().optional(),
  complianceKnowledge: z.boolean().optional(),
});

export default function Apply() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const { toast } = useToast();
  const { address, isConnected, isRegistered, userType } = useWalletAuth();

  const [portfolioInputs, setPortfolioInputs] = useState<string[]>([""]);
  const [caseStudyInputs, setCaseStudyInputs] = useState<string[]>([""]);

  useEffect(() => {
    if (isRegistered && userType === "builder") {
      setLocation("/builder-dashboard");
    } else if (isRegistered && userType === "client") {
      setLocation("/dashboard");
    }
  }, [isRegistered, userType, setLocation]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      category: "",
      portfolioLinks: [],
      yearsExperience: 0,
      twitterHandle: "",
      twitterFollowers: undefined,
      instagramHandle: "",
      instagramFollowers: undefined,
      youtubeChannel: "",
      youtubeSubscribers: undefined,
      engagementRate: undefined,
      contentNiches: [],
      software3D: [],
      renderEngines: [],
      styleSpecialties: [],
      marketingPlatforms: [],
      growthStrategies: [],
      caseStudyLinks: [],
      programmingLanguages: [],
      blockchainFrameworks: [],
      githubProfile: "",
      tradingExperience: undefined,
      volumeCapabilities: "",
      complianceKnowledge: false,
    },
  });

  const selectedCategory = form.watch("category");

  const submitMutation = useMutation({
    mutationFn: async (data: Partial<InsertBuilderApplication>) => {
      if (!address) {
        throw new Error("Please connect your wallet first");
      }
      const response = await apiRequest("POST", "/api/builder-applications", {
        ...data,
        walletAddress: address.toLowerCase(),
      });
      return response.json();
    },
    onSuccess: (data) => {
      setApplicationId(data.id);
      setSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "We'll review your application within 2-3 business days.",
      });
    },
    onError: () => {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const portfolioLinks = portfolioInputs.filter(link => link.trim() !== "");
    const caseStudyLinks = caseStudyInputs.filter(link => link.trim() !== "");
    
    submitMutation.mutate({
      ...data,
      engagementRate: data.engagementRate ? data.engagementRate.toString() : undefined,
      portfolioLinks: portfolioLinks.length > 0 ? portfolioLinks : undefined,
      caseStudyLinks: caseStudyLinks.length > 0 ? caseStudyLinks : undefined,
    } as any);
  };

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    
    if (step === 1) {
      fieldsToValidate = ["name", "email", "bio", "yearsExperience"];
    } else if (step === 2) {
      fieldsToValidate = ["category"];
    }

    const isValid = await form.trigger(fieldsToValidate as any);
    if (isValid) {
      setStep(step + 1);
    }
  };

  const prevStep = () => setStep(step - 1);

  const progress = (step / 4) * 100;

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-2xl px-4 py-16">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Application Submitted!</CardTitle>
              <CardDescription>
                Thank you for your application. We'll review it within 2-3 business days.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Application ID: <span className="font-mono">{applicationId}</span>
              </p>
              <p className="text-sm">
                We'll notify you via email once your application has been reviewed. If approved,
                you'll be able to create your builder profile and start offering services on create.psx.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center gap-3">
              <Button variant="outline" onClick={() => setLocation("/")}>
                Return Home
              </Button>
              <Button onClick={() => setLocation("/marketplace")}>
                Browse Marketplace
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto max-w-3xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Become a Builder</h1>
          <p className="text-muted-foreground">
            Join create.psx and connect with premium crypto projects
          </p>
          
          <div className="mt-4 rounded-lg border border-chart-3/30 bg-chart-3/5 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-chart-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-chart-3">🎉 Launch Special: First 50 Builders Get FREE Access!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  The first 50 approved builders will be whitelisted with FREE platform access — no $CREATE or $PSX tokens required. Apply now to secure your spot!
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex justify-between text-sm">
            <span>Step {step} of 4</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {step === 1 && "Profile Information"}
                  {step === 2 && "Select Your Category"}
                  {step === 3 && "Category-Specific Details"}
                  {step === 4 && "Review & Submit"}
                </CardTitle>
                <CardDescription>
                  {step === 1 && "Tell us about yourself and your experience"}
                  {step === 2 && "Choose the category that best describes your expertise"}
                  {step === 3 && "Provide details specific to your category"}
                  {step === 4 && "Review your application before submitting"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {step === 1 && (
                  <>
                    <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                      <h3 className="flex items-center gap-2 font-semibold">
                        <Wallet className="h-4 w-4" />
                        Wallet Connection
                      </h3>
                      {!isConnected ? (
                        <div>
                          <p className="mb-3 text-sm text-muted-foreground">
                            Please connect your wallet to verify your $CREATE or $PSX holdings and submit your application
                          </p>
                          <div className="flex justify-center py-2">
                            <ConnectButton />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 rounded-md border bg-background p-3">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="font-mono text-sm">{address}</span>
                          <Badge variant="secondary" className="ml-auto">Connected</Badge>
                        </div>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} data-testid="input-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} data-testid="input-email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your experience, expertise, and what makes you a great builder..."
                              className="min-h-[120px]"
                              {...field}
                              data-testid="textarea-bio"
                            />
                          </FormControl>
                          <FormDescription>
                            Minimum 50 characters. This will be displayed on your profile.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="yearsExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Experience</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              max="50"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="input-years-experience"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-3">
                      <Label>Portfolio Links (Optional)</Label>
                      {portfolioInputs.map((link, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="https://..."
                            value={link}
                            onChange={(e) => {
                              const newInputs = [...portfolioInputs];
                              newInputs[index] = e.target.value;
                              setPortfolioInputs(newInputs);
                            }}
                            data-testid={`input-portfolio-${index}`}
                          />
                          {portfolioInputs.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newInputs = portfolioInputs.filter((_, i) => i !== index);
                                setPortfolioInputs(newInputs);
                              }}
                              data-testid={`button-remove-portfolio-${index}`}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPortfolioInputs([...portfolioInputs, ""])}
                        data-testid="button-add-portfolio"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Portfolio Link
                      </Button>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <div className="grid gap-4">
                          {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isSelected = field.value === cat.name;
                            return (
                              <Card
                                key={cat.slug}
                                className={`cursor-pointer transition-all ${
                                  isSelected ? "border-primary ring-2 ring-primary/20" : ""
                                }`}
                                onClick={() => field.onChange(cat.name)}
                                data-testid={`card-category-${cat.slug}`}
                              >
                                <CardHeader>
                                  <div className="flex items-start gap-4">
                                    <div className={`rounded-lg p-2 ${isSelected ? "bg-primary/10" : "bg-muted"}`}>
                                      <Icon className={`h-6 w-6 ${isSelected ? "text-primary" : ""}`} />
                                    </div>
                                    <div className="flex-1">
                                      <CardTitle className="text-lg">{cat.name}</CardTitle>
                                      <CardDescription>{cat.description}</CardDescription>
                                    </div>
                                    {isSelected && (
                                      <CheckCircle2 className="h-5 w-5 text-primary" />
                                    )}
                                  </div>
                                </CardHeader>
                              </Card>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {step === 3 && selectedCategory === "KOLs & Influencers" && (
                  <>
                    <FormField
                      control={form.control}
                      name="twitterHandle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter Handle</FormLabel>
                          <FormControl>
                            <Input placeholder="@yourhandle" {...field} data-testid="input-twitter-handle" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="twitterFollowers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter Followers</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                              data-testid="input-twitter-followers"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="instagramHandle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram Handle (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="@yourhandle" {...field} data-testid="input-instagram-handle" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="instagramFollowers"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram Followers</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                              data-testid="input-instagram-followers"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="youtubeChannel"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>YouTube Channel (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Channel URL" {...field} data-testid="input-youtube-channel" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="engagementRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Average Engagement Rate (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || undefined)}
                              data-testid="input-engagement-rate"
                            />
                          </FormControl>
                          <FormDescription>
                            Your average engagement rate across platforms (e.g., 3.5 for 3.5%)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {step === 3 && selectedCategory === "3D Content Creators" && (
                  <>
                    <div className="space-y-3">
                      <Label>3D Software (Select all that apply)</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Blender", "Cinema 4D", "Maya", "3ds Max", "Houdini", "ZBrush"].map((software) => (
                          <div key={software} className="flex items-center space-x-2">
                            <Checkbox
                              id={software}
                              checked={form.watch("software3D")?.includes(software)}
                              onCheckedChange={(checked) => {
                                const current = form.getValues("software3D") || [];
                                if (checked) {
                                  form.setValue("software3D", [...current, software]);
                                } else {
                                  form.setValue(
                                    "software3D",
                                    current.filter((s) => s !== software)
                                  );
                                }
                              }}
                              data-testid={`checkbox-software-${software.toLowerCase().replace(/\s+/g, "-")}`}
                            />
                            <Label htmlFor={software} className="text-sm font-normal">
                              {software}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Render Engines</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Cycles", "Eevee", "Arnold", "V-Ray", "Redshift", "Octane"].map((engine) => (
                          <div key={engine} className="flex items-center space-x-2">
                            <Checkbox
                              id={engine}
                              checked={form.watch("renderEngines")?.includes(engine)}
                              onCheckedChange={(checked) => {
                                const current = form.getValues("renderEngines") || [];
                                if (checked) {
                                  form.setValue("renderEngines", [...current, engine]);
                                } else {
                                  form.setValue(
                                    "renderEngines",
                                    current.filter((e) => e !== engine)
                                  );
                                }
                              }}
                              data-testid={`checkbox-engine-${engine.toLowerCase()}`}
                            />
                            <Label htmlFor={engine} className="text-sm font-normal">
                              {engine}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Style Specialties</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Photorealistic", "Stylized", "Low Poly", "Abstract", "Character Design", "Environment"].map(
                          (style) => (
                            <div key={style} className="flex items-center space-x-2">
                              <Checkbox
                                id={style}
                                checked={form.watch("styleSpecialties")?.includes(style)}
                                onCheckedChange={(checked) => {
                                  const current = form.getValues("styleSpecialties") || [];
                                  if (checked) {
                                    form.setValue("styleSpecialties", [...current, style]);
                                  } else {
                                    form.setValue(
                                      "styleSpecialties",
                                      current.filter((s) => s !== style)
                                    );
                                  }
                                }}
                                data-testid={`checkbox-style-${style.toLowerCase().replace(/\s+/g, "-")}`}
                              />
                              <Label htmlFor={style} className="text-sm font-normal">
                                {style}
                              </Label>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </>
                )}

                {step === 3 && selectedCategory === "Marketing & Growth" && (
                  <>
                    <div className="space-y-3">
                      <Label>Marketing Platforms (Select all that apply)</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Twitter", "Discord", "Telegram", "Reddit", "TikTok", "YouTube"].map((platform) => (
                          <div key={platform} className="flex items-center space-x-2">
                            <Checkbox
                              id={platform}
                              checked={form.watch("marketingPlatforms")?.includes(platform)}
                              onCheckedChange={(checked) => {
                                const current = form.getValues("marketingPlatforms") || [];
                                if (checked) {
                                  form.setValue("marketingPlatforms", [...current, platform]);
                                } else {
                                  form.setValue(
                                    "marketingPlatforms",
                                    current.filter((p) => p !== platform)
                                  );
                                }
                              }}
                              data-testid={`checkbox-platform-${platform.toLowerCase()}`}
                            />
                            <Label htmlFor={platform} className="text-sm font-normal">
                              {platform}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Growth Strategies</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          "Community Building",
                          "Influencer Partnerships",
                          "Content Marketing",
                          "Paid Advertising",
                          "SEO/SEM",
                          "PR & Media",
                        ].map((strategy) => (
                          <div key={strategy} className="flex items-center space-x-2">
                            <Checkbox
                              id={strategy}
                              checked={form.watch("growthStrategies")?.includes(strategy)}
                              onCheckedChange={(checked) => {
                                const current = form.getValues("growthStrategies") || [];
                                if (checked) {
                                  form.setValue("growthStrategies", [...current, strategy]);
                                } else {
                                  form.setValue(
                                    "growthStrategies",
                                    current.filter((s) => s !== strategy)
                                  );
                                }
                              }}
                              data-testid={`checkbox-strategy-${strategy.toLowerCase().replace(/[\s/&]+/g, "-")}`}
                            />
                            <Label htmlFor={strategy} className="text-sm font-normal">
                              {strategy}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Case Study Links (Optional)</Label>
                      {caseStudyInputs.map((link, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="https://..."
                            value={link}
                            onChange={(e) => {
                              const newInputs = [...caseStudyInputs];
                              newInputs[index] = e.target.value;
                              setCaseStudyInputs(newInputs);
                            }}
                            data-testid={`input-case-study-${index}`}
                          />
                          {caseStudyInputs.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newInputs = caseStudyInputs.filter((_, i) => i !== index);
                                setCaseStudyInputs(newInputs);
                              }}
                              data-testid={`button-remove-case-study-${index}`}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCaseStudyInputs([...caseStudyInputs, ""])}
                        data-testid="button-add-case-study"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Case Study Link
                      </Button>
                    </div>
                  </>
                )}

                {step === 3 && selectedCategory === "Script Development" && (
                  <>
                    <div className="space-y-3">
                      <Label>Programming Languages</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Solidity", "Rust", "JavaScript", "TypeScript", "Python", "Go"].map((lang) => (
                          <div key={lang} className="flex items-center space-x-2">
                            <Checkbox
                              id={lang}
                              checked={form.watch("programmingLanguages")?.includes(lang)}
                              onCheckedChange={(checked) => {
                                const current = form.getValues("programmingLanguages") || [];
                                if (checked) {
                                  form.setValue("programmingLanguages", [...current, lang]);
                                } else {
                                  form.setValue(
                                    "programmingLanguages",
                                    current.filter((l) => l !== lang)
                                  );
                                }
                              }}
                              data-testid={`checkbox-lang-${lang.toLowerCase()}`}
                            />
                            <Label htmlFor={lang} className="text-sm font-normal">
                              {lang}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Blockchain Frameworks</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["Ethereum", "Solana", "Polygon", "Base", "Arbitrum", "BSC"].map((framework) => (
                          <div key={framework} className="flex items-center space-x-2">
                            <Checkbox
                              id={framework}
                              checked={form.watch("blockchainFrameworks")?.includes(framework)}
                              onCheckedChange={(checked) => {
                                const current = form.getValues("blockchainFrameworks") || [];
                                if (checked) {
                                  form.setValue("blockchainFrameworks", [...current, framework]);
                                } else {
                                  form.setValue(
                                    "blockchainFrameworks",
                                    current.filter((f) => f !== framework)
                                  );
                                }
                              }}
                              data-testid={`checkbox-framework-${framework.toLowerCase()}`}
                            />
                            <Label htmlFor={framework} className="text-sm font-normal">
                              {framework}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="githubProfile"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>GitHub Profile (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://github.com/yourusername" {...field} data-testid="input-github-profile" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {step === 3 && selectedCategory === "Volume Services" && (
                  <>
                    <FormField
                      control={form.control}
                      name="tradingExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Years of Trading Experience</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                              data-testid="input-trading-experience"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="volumeCapabilities"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Volume Capabilities</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your volume generation capabilities, typical daily volume, and tools you use..."
                              className="min-h-[100px]"
                              {...field}
                              data-testid="textarea-volume-capabilities"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="complianceKnowledge"
                      render={({ field}) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-compliance"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I understand compliance and regulatory requirements
                            </FormLabel>
                            <FormDescription>
                              I am familiar with market making regulations and compliance standards
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="mb-2 font-semibold">Profile Information</h3>
                      <dl className="space-y-2 text-sm">
                        <div>
                          <dt className="text-muted-foreground">Name:</dt>
                          <dd>{form.getValues("name")}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Email:</dt>
                          <dd>{form.getValues("email")}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Years of Experience:</dt>
                          <dd>{form.getValues("yearsExperience")}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Category:</dt>
                          <dd>
                            <Badge>{form.getValues("category")}</Badge>
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h3 className="mb-2 font-semibold">Bio</h3>
                      <p className="text-sm text-muted-foreground">{form.getValues("bio")}</p>
                    </div>

                    {portfolioInputs.filter(link => link.trim() !== "").length > 0 && (
                      <div>
                        <h3 className="mb-2 font-semibold">Portfolio Links</h3>
                        <ul className="list-inside list-disc text-sm text-muted-foreground">
                          {portfolioInputs.filter(link => link.trim() !== "").map((link, index) => (
                            <li key={index}>{link}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between gap-3">
                {step > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep} data-testid="button-prev-step">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                )}
                <div className="flex-1" />
                {step < 4 ? (
                  <Button type="button" onClick={nextStep} data-testid="button-next-step">
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={submitMutation.isPending}
                    data-testid="button-submit-application"
                  >
                    {submitMutation.isPending ? "Submitting..." : "Submit Application"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
