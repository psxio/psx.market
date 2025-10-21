import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, CheckCircle, XCircle, Sparkles, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface InviteVerification {
  valid: boolean;
  email?: string;
}

export default function BuilderInvite() {
  const [, params] = useRoute("/builder-invite/:token");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const token = params?.token;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    walletAddress: "",
    bio: "",
    category: "",
    twitterHandle: "",
    portfolioUrl: "",
    skills: "",
    experience: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: verification, isLoading, error } = useQuery<InviteVerification>({
    queryKey: ["/api/builder-invites/verify", token],
    enabled: !!token,
  });

  useEffect(() => {
    if (verification?.email) {
      setFormData(prev => ({ ...prev, email: verification.email! }));
    }
  }, [verification]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const application = {
        name: formData.name,
        email: formData.email,
        walletAddress: formData.walletAddress,
        bio: formData.bio,
        category: formData.category,
        twitterHandle: formData.twitterHandle,
        portfolioUrl: formData.portfolioUrl,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        experience: formData.experience,
        inviteToken: token,
      };

      await apiRequest("POST", "/api/applications", application);

      toast({
        title: "Welcome to Create.psx! 🎉",
        description: "Your builder profile is being created. You'll be redirected shortly.",
      });

      setTimeout(() => {
        setLocation("/marketplace");
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
            <CardTitle className="text-center">Invalid Invite</CardTitle>
            <CardDescription className="text-center">
              No invite token provided
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isLoading) {
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

  if (error || !verification?.valid) {
    const errorMessage = error ? "This invite link has expired or is invalid" : "This invite has already been used";
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <XCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
            <CardTitle className="text-center">Invalid Invite</CardTitle>
            <CardDescription className="text-center">
              {errorMessage}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => setLocation("/apply")}
              variant="outline"
            >
              Apply through regular application
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categories = [
    { value: "kols", label: "KOL / Influencer" },
    { value: "developers", label: "Developer" },
    { value: "designers", label: "Designer" },
    { value: "marketers", label: "Marketer" },
    { value: "community", label: "Community Manager" },
    { value: "content", label: "Content Creator" },
    { value: "strategists", label: "Strategist" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-cyan-500">
            <Mail className="mr-1 h-3 w-3" />
            Private Invite
          </Badge>
          <h1 className="text-4xl font-bold mb-2">
            Welcome to <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Create.psx</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            You've been invited to join our exclusive builder community
          </p>
        </div>

        <Alert className="mb-6 border-purple-500/50 bg-purple-500/10">
          <Sparkles className="h-4 w-4 text-purple-500" />
          <AlertDescription className="text-sm">
            As an invited builder, your application will be fast-tracked and you'll gain immediate access to the platform.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Complete Your Builder Profile</CardTitle>
            <CardDescription>
              Fill out the information below to set up your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
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
                    disabled={!!verification.email}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="walletAddress">Wallet Address *</Label>
                <Input
                  id="walletAddress"
                  required
                  value={formData.walletAddress}
                  onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                  placeholder="0x..."
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Your Base wallet address for receiving payments
                </p>
              </div>

              <div>
                <Label htmlFor="category">Primary Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="bio">Bio *</Label>
                <Textarea
                  id="bio"
                  required
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself and your expertise..."
                  rows={4}
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <Label htmlFor="twitterHandle">Twitter Handle</Label>
                  <Input
                    id="twitterHandle"
                    value={formData.twitterHandle}
                    onChange={(e) => setFormData({ ...formData, twitterHandle: e.target.value })}
                    placeholder="@yourhandle"
                  />
                </div>

                <div>
                  <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                  <Input
                    id="portfolioUrl"
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="skills">Skills *</Label>
                <Input
                  id="skills"
                  required
                  value={formData.skills}
                  onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  placeholder="Smart contracts, Web3, React, Solidity (comma separated)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter your skills separated by commas
                </p>
              </div>

              <div>
                <Label htmlFor="experience">Experience *</Label>
                <Textarea
                  id="experience"
                  required
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="Describe your relevant experience and previous projects..."
                  rows={4}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setLocation("/")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Creating Profile..."
                  ) : (
                    <>
                      Join Create.psx
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
