import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, Github, Twitter, Instagram, Youtube, MessageCircle, ExternalLink, Loader2 } from "lucide-react";

interface SocialAccount {
  platform: string;
  icon: any;
  label: string;
  placeholder: string;
  verified: boolean;
  username?: string;
  url?: string;
  data?: any;
}

interface SocialAccountVerificationProps {
  builderId: string;
  currentAccounts: {
    githubProfile?: string;
    twitterHandle?: string;
    instagramHandle?: string;
    youtubeChannel?: string;
    telegramHandle?: string;
  };
  onUpdate?: () => void;
}

export function SocialAccountVerification({ 
  builderId, 
  currentAccounts,
  onUpdate 
}: SocialAccountVerificationProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<Record<string, SocialAccount>>({
    github: {
      platform: "github",
      icon: Github,
      label: "GitHub",
      placeholder: "Enter your GitHub username",
      verified: !!currentAccounts.githubProfile,
      username: currentAccounts.githubProfile?.split("/").pop(),
      url: currentAccounts.githubProfile,
    },
    twitter: {
      platform: "twitter",
      icon: Twitter,
      label: "X (Twitter)",
      placeholder: "@username or profile URL",
      verified: !!currentAccounts.twitterHandle,
      username: currentAccounts.twitterHandle,
      url: currentAccounts.twitterHandle ? `https://x.com/${currentAccounts.twitterHandle.replace("@", "")}` : undefined,
    },
    instagram: {
      platform: "instagram",
      icon: Instagram,
      label: "Instagram",
      placeholder: "username or profile URL",
      verified: !!currentAccounts.instagramHandle,
      username: currentAccounts.instagramHandle,
      url: currentAccounts.instagramHandle ? `https://instagram.com/${currentAccounts.instagramHandle}` : undefined,
    },
    youtube: {
      platform: "youtube",
      icon: Youtube,
      label: "YouTube",
      placeholder: "Channel URL",
      verified: !!currentAccounts.youtubeChannel,
      url: currentAccounts.youtubeChannel,
    },
    telegram: {
      platform: "telegram",
      icon: MessageCircle,
      label: "Telegram",
      placeholder: "@username or t.me link",
      verified: !!currentAccounts.telegramHandle,
      username: currentAccounts.telegramHandle,
      url: currentAccounts.telegramHandle ? `https://t.me/${currentAccounts.telegramHandle.replace("@", "")}` : undefined,
    },
  });

  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const handleVerify = async (platform: string) => {
    const input = inputValues[platform];
    if (!input) {
      toast({
        title: "Input Required",
        description: `Please enter your ${accounts[platform].label} username or URL`,
        variant: "destructive",
      });
      return;
    }

    setLoading(platform);

    try {
      let response;
      
      switch (platform) {
        case "github":
          response = await apiRequest("POST", `/api/builders/${builderId}/verify-github`, { username: input });
          break;
        case "twitter":
          response = await apiRequest("POST", `/api/builders/${builderId}/verify-twitter`, { input });
          break;
        case "instagram":
          response = await apiRequest("POST", `/api/builders/${builderId}/verify-instagram`, { input });
          break;
        case "youtube":
          response = await apiRequest("POST", `/api/builders/${builderId}/verify-youtube`, { url: input });
          break;
        case "telegram":
          response = await apiRequest("POST", `/api/builders/${builderId}/verify-telegram`, { input });
          break;
        default:
          throw new Error("Unknown platform");
      }

      setAccounts(prev => ({
        ...prev,
        [platform]: {
          ...prev[platform],
          verified: response.verified,
          username: response.username || response.handle,
          url: response.profileUrl || response.channelUrl,
          data: response,
        },
      }));

      toast({
        title: "Account Verified!",
        description: response.message || `Your ${accounts[platform].label} account has been verified successfully.`,
      });

      setInputValues(prev => ({ ...prev, [platform]: "" }));
      onUpdate?.();
    } catch (error: any) {
      toast({
        title: "Verification Failed",
        description: error.message || `Failed to verify ${accounts[platform].label} account`,
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Accounts & Verification</CardTitle>
        <CardDescription>
          Connect and verify your social accounts to display real follower counts and metrics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(accounts).map(([key, account]) => {
          const Icon = account.icon;
          return (
            <div key={key} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {account.label}
                </Label>
                {account.verified && (
                  <Badge variant="default" className="gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>

              {account.verified && account.url ? (
                <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50">
                  <div className="flex-1">
                    <p className="text-sm font-medium">{account.username || "Connected"}</p>
                    <a 
                      href={account.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:underline flex items-center gap-1"
                    >
                      View Profile
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  {key === "github" && account.data && (
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Followers</p>
                      <p className="text-sm font-semibold">{account.data.followers?.toLocaleString()}</p>
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAccounts(prev => ({
                        ...prev,
                        [key]: { ...prev[key], verified: false, username: undefined, url: undefined, data: undefined },
                      }));
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    placeholder={account.placeholder}
                    value={inputValues[key] || ""}
                    onChange={(e) => setInputValues(prev => ({ ...prev, [key]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleVerify(key);
                      }
                    }}
                    data-testid={`input-${key}`}
                  />
                  <Button
                    onClick={() => handleVerify(key)}
                    disabled={loading === key}
                    data-testid={`button-verify-${key}`}
                  >
                    {loading === key ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </div>
              )}

              {key === "github" && !account.verified && (
                <p className="text-xs text-muted-foreground">
                  We'll fetch your real follower count, repos, and stats from GitHub
                </p>
              )}
              {key === "twitter" && !account.verified && (
                <p className="text-xs text-muted-foreground">
                  Enter your X username to verify. Real follower counts coming soon with OAuth.
                </p>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
