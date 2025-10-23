import { Header } from "@/components/header";
import { FindBuilderWizard } from "@/components/ai/FindBuilderWizard";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { Sparkles, Target, Zap, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function FindBuilder() {
  const headerSection = useScrollReveal();
  const wizardSection = useScrollReveal();
  const featuresSection = useScrollReveal();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section
        ref={headerSection.ref as any}
        className={`pt-32 pb-16 px-4 ${headerSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}
      >
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-500/20">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">AI-Powered Matching</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Find Your Perfect Builder
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Answer a few questions and let our AI match you with the best Web3 builders for your project
          </p>
        </div>
      </section>

      <section
        ref={featuresSection.ref as any}
        className={`pb-12 px-4 ${featuresSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="hover-elevate">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Precise Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI analyzes your requirements to find builders with the exact skills you need
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Instant Results</h3>
                <p className="text-sm text-muted-foreground">
                  Get personalized recommendations in seconds, not hours
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-purple-500/10 to-cyan-500/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Verified Experts</h3>
                <p className="text-sm text-muted-foreground">
                  All recommendations are token-gated builders with proven track records
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section
        ref={wizardSection.ref as any}
        className={`pb-24 px-4 ${wizardSection.isVisible ? 'scroll-reveal-fade-up' : 'scroll-reveal-hidden'}`}
      >
        <div className="max-w-6xl mx-auto">
          <FindBuilderWizard />
        </div>
      </section>
    </div>
  );
}
