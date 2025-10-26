import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Target, Lightbulb, TrendingUp } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FirstClientChecklistProps {
  builder: any;
}

export function FirstClientChecklist({ builder }: FirstClientChecklistProps) {
  const hasCompletedFirstOrder = builder?.completedProjects > 0;
  
  const tips = [
    {
      id: "competitive-pricing",
      category: "Pricing",
      title: "Set Competitive Pricing",
      description: "Research similar services in your category and price competitively for your first few projects.",
      tips: [
        "Offer an introductory discount (10-20% off) for your first 3 clients",
        "Price slightly below market average initially to build reviews",
        "Use the Pricing Calculator to find the sweet spot",
        "Consider offering a basic tier at a very attractive price point",
      ],
      isComplete: builder?.hasServices,
    },
    {
      id: "fast-response",
      title: "Respond Lightning Fast",
      category: "Communication",
      description: "Quick response times significantly increase booking rates. Aim for under 2 hours.",
      tips: [
        "Enable browser notifications for new messages",
        "Check the platform at least 3-4 times daily",
        "Set up a template for common questions to respond faster",
        "Respond within 1 hour for your first few inquiries",
      ],
      isComplete: builder?.avgResponseTimeHours && builder.avgResponseTimeHours <= 2,
    },
    {
      id: "portfolio-showcase",
      title: "Showcase Your Best Work",
      category: "Portfolio",
      description: "Quality portfolio items are your best sales tool. Show, don't just tell.",
      tips: [
        "Upload at least 5-7 high-quality portfolio pieces",
        "Include before/after comparisons when possible",
        "Add video content if you have it (video increases bookings 3x)",
        "Show diverse work that demonstrates your range",
        "Write detailed captions explaining your process and results",
      ],
      isComplete: builder?.portfolioMedia && builder.portfolioMedia.length >= 5,
    },
    {
      id: "detailed-services",
      title: "Create Detailed Service Packages",
      category: "Services",
      description: "Clear, detailed service descriptions reduce questions and increase trust.",
      tips: [
        "List exactly what's included in each tier (Basic/Standard/Premium)",
        "Specify delivery timeframes clearly",
        "Mention any revision rounds included",
        "Add examples of deliverables",
        "Use bullet points for easy scanning",
      ],
      isComplete: builder?.hasServices,
    },
    {
      id: "social-proof",
      title: "Build Initial Social Proof",
      category: "Trust",
      description: "Even without reviews, you can build trust through credentials and external proof.",
      tips: [
        "Link your social media accounts to show your following",
        "Add any certifications or courses you've completed",
        "Show your experience level and years in the industry",
        "Share client testimonials from outside the platform (with permission)",
        "Display any brand partnerships or notable projects",
      ],
      isComplete: !!(builder?.twitterHandle || builder?.linkedinProfile || builder?.instagramHandle),
    },
    {
      id: "availability",
      title: "Show You're Available",
      category: "Availability",
      description: "Being \"Available Now\" makes you 5x more likely to get hired for urgent projects.",
      tips: [
        "Set your status to \"Available Now\" if you can start immediately",
        "Mention your availability in your headline",
        "Keep your calendar updated",
        "Be honest about your capacity - don't overpromise",
      ],
      isComplete: builder?.availability === "available" || builder?.acceptingOrders,
    },
    {
      id: "overdeliver",
      title: "Plan to Overdeliver",
      category: "Execution",
      description: "Your first clients will determine your reputation. Make them count!",
      tips: [
        "Deliver 1-2 days before the deadline",
        "Include a small bonus (extra revision, bonus file, etc.)",
        "Communicate proactively throughout the project",
        "Ask for feedback midway to ensure you're on track",
        "Request a review immediately after successful delivery",
      ],
      isComplete: hasCompletedFirstOrder,
    },
    {
      id: "follow-up",
      title: "Master the Follow-Up",
      category: "Client Relations",
      description: "Professional follow-up turns first-time clients into repeat customers.",
      tips: [
        "Send a thank you message after project completion",
        "Check in 1-2 weeks later to see how everything is working",
        "Offer a loyalty discount for their next project",
        "Stay connected - 60% of business comes from repeat clients",
      ],
      isComplete: builder?.repeatClientsCount > 0,
    },
  ];

  const completedTips = tips.filter(tip => tip.isComplete).length;
  const totalTips = tips.length;
  const completionPercentage = Math.round((completedTips / totalTips) * 100);

  return (
    <Card className="border-2" data-testid="card-first-client-checklist">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Get Your First Client</CardTitle>
              <CardDescription>
                {hasCompletedFirstOrder 
                  ? "Great job landing your first client! Keep these tips in mind for growth."
                  : "Follow these proven strategies to land your first clients faster"}
              </CardDescription>
            </div>
          </div>
          <Badge variant={completionPercentage === 100 ? "default" : "secondary"} className="gap-1">
            {completedTips}/{totalTips}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 rounded-lg border-2 border-chart-2/30 bg-gradient-to-r from-chart-2/10 to-transparent p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-chart-2" />
            <h4 className="font-semibold">Quick Win</h4>
          </div>
          <p className="text-sm text-muted-foreground">
            Builders who complete at least 5 of these tips get their first client{" "}
            <span className="font-bold text-chart-2">3x faster</span> on average.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {tips.map((tip) => (
            <AccordionItem 
              key={tip.id} 
              value={tip.id}
              className="border rounded-lg px-4"
              data-testid={`checklist-item-${tip.id}`}
            >
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3 flex-1 text-left">
                  {tip.isComplete ? (
                    <CheckCircle2 className="h-5 w-5 text-chart-4 shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-semibold ${tip.isComplete ? 'text-muted-foreground' : ''}`}>
                        {tip.title}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {tip.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {tip.description}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-8 pt-2 space-y-2">
                  <div className="flex items-start gap-2 mb-3">
                    <Lightbulb className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm font-semibold">Action Steps:</span>
                  </div>
                  <ul className="space-y-2">
                    {tip.tips.map((actionTip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary shrink-0 mt-0.5">•</span>
                        <span>{actionTip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {hasCompletedFirstOrder && (
          <div className="mt-6 rounded-lg border-2 border-chart-4/30 bg-gradient-to-r from-chart-4/10 to-transparent p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-5 w-5 text-chart-4" />
              <h4 className="font-semibold text-chart-4">Congratulations!</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              You've completed your first project! Now focus on getting reviews and building momentum.
              Aim for 5 completed projects in your first month.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
