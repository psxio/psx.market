import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { usePrivy } from '@privy-io/react-auth';
import { DualPlatformOnboarding } from '@/components/DualPlatformOnboarding';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export default function DualPlatformOnboardingPage() {
  const [, setLocation] = useLocation();
  const { ready: privyReady, authenticated: privyAuthenticated, user: privyUser, logout } = usePrivy();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (privyReady && !privyAuthenticated) {
      setLocation('/');
    }
  }, [privyReady, privyAuthenticated, setLocation]);

  const handleComplete = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      const walletAccount = privyUser?.linkedAccounts?.find((acc: any) => acc.type === 'wallet');
      const walletAddress = privyUser?.wallet?.address || (walletAccount as any)?.address;
      
      const payload = {
        walletAddress,
        privyId: privyUser?.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email || privyUser?.email?.address,
        industry: data.industry,
        chapterId: data.chapterId,
        socialProfiles: {
          github: data.githubUrl,
          twitter: data.xProfile || privyUser?.twitter?.username,
          farcaster: data.farcasterProfile,
          zora: data.zoraProfile,
          base: data.baseProfile,
        },
        enablePort444: data.categories.length > 0,
        categories: data.categories,
        bio: data.bio,
        yearsOfExperience: data.yearsOfExperience,
        skills: data.skills,
        languages: data.languages,
        timezone: data.timezone,
        minimumBudget: data.minimumBudget ? parseInt(data.minimumBudget) : undefined,
        hourlyRate: data.hourlyRate ? parseInt(data.hourlyRate) : undefined,
        portfolioLinks: [
          data.portfolioLink1,
          data.portfolioLink2,
          data.portfolioLink3
        ].filter(Boolean),
        telegramHandle: data.telegramHandle,
        certifications: data.certifications,
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
          description: `Your account${data.categories.length > 0 ? 's have' : ' has'} been created successfully.`,
        });

        await queryClient.invalidateQueries({ queryKey: ['/api/builders/me'] });
        await queryClient.invalidateQueries({ queryKey: ['/api/clients/me'] });

        if (data.categories.length > 0) {
          setLocation('/builder-dashboard');
        } else if (data.chapterId) {
          setLocation('/dashboard');
        } else {
          setLocation('/');
        }
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

  if (!privyReady || !privyAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const walletAccount = privyUser?.linkedAccounts?.find((acc: any) => acc.type === 'wallet');
  const walletAddress = privyUser?.wallet?.address || 
                        (walletAccount as any)?.address ||
                        '0x0000000000000000000000000000000000000000';

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12">
      <div className="container max-w-5xl">
        {isSubmitting && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Card>
              <CardContent className="p-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="font-medium mb-2">Creating your account...</p>
                <p className="text-sm text-muted-foreground">This will only take a moment</p>
              </CardContent>
            </Card>
          </div>
        )}
        
        <DualPlatformOnboarding
          walletAddress={walletAddress}
          onComplete={handleComplete}
        />
      </div>
    </div>
  );
}
