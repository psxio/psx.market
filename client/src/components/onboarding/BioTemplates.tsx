import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface Template {
  headline: string;
  bio: string;
  tags: string[];
}

interface BioTemplatesProps {
  category: string;
  onSelectTemplate: (headline: string, bio: string) => void;
}

const TEMPLATES: Record<string, Template[]> = {
  "kols": [
    {
      headline: "Crypto Influencer | X Followers | Y% Engagement",
      bio: "Web3 thought leader with a proven track record of driving community engagement and brand awareness. Specialized in memecoin launches, NFT projects, and DeFi protocols. Featured in leading crypto publications and partnered with top-tier projects.",
      tags: ["Engagement Focused", "Brand Partnerships"]
    },
    {
      headline: "Web3 Content Creator | Building Communities That Convert",
      bio: "Professional content creator specializing in crypto education and community building. Expert in creating viral content, managing Discord/Telegram communities, and driving organic growth. Worked with 50+ successful Web3 projects.",
      tags: ["Community Builder", "Viral Content"]
    }
  ],
  "3d-artists": [
    {
      headline: "Award-Winning 3D Artist | Photorealistic Characters & Environments",
      bio: "Expert 3D artist with 10+ years of experience creating stunning visuals for NFT collections, metaverse projects, and gaming studios. Specialized in Blender, Cinema 4D, and Unreal Engine. Portfolio includes work for top-tier Web3 brands and Fortune 500 companies.",
      tags: ["Photorealistic", "NFT Specialist"]
    },
    {
      headline: "3D Character Artist | NFT Collections & Metaverse Assets",
      bio: "Specialized 3D character designer creating unique, high-quality assets for NFT projects and metaverse experiences. Proficient in ZBrush, Blender, and Substance Painter. Known for delivering on-time and exceeding client expectations.",
      tags: ["Character Design", "Fast Delivery"]
    }
  ],
  "marketers": [
    {
      headline: "Web3 Growth Hacker | 10x Your Community in 90 Days",
      bio: "Results-driven Web3 marketing strategist with expertise in Twitter growth, Discord management, and viral campaigns. Helped 100+ crypto projects achieve exponential community growth. Data-obsessed with proven strategies that convert.",
      tags: ["Growth Hacking", "ROI Focused"]
    },
    {
      headline: "Crypto Marketing Specialist | Launches, AMAs & Community Building",
      bio: "Full-stack crypto marketer specializing in project launches, influencer partnerships, and community engagement. Expert in creating buzz, managing successful AMAs, and building loyal communities. Track record of 50+ successful launches.",
      tags: ["Launch Expert", "Community Pro"]
    }
  ],
  "developers": [
    {
      headline: "Senior Solidity Developer | Audited Smart Contracts for $100M+ Projects",
      bio: "Experienced blockchain developer specializing in Solidity, Rust, and secure smart contract development. Built and audited contracts for DeFi protocols, NFT marketplaces, and DAOs. Committed to security, gas optimization, and clean code.",
      tags: ["Security First", "Gas Optimized"]
    },
    {
      headline: "Full-Stack Web3 Developer | React + Solidity + TheGraph",
      bio: "Full-stack developer bridging Web2 and Web3. Expert in building responsive dApps using React, ethers.js, and modern blockchain frameworks. Specialized in seamless user experiences and robust smart contract integrations.",
      tags: ["Full Stack", "UX Focused"]
    }
  ],
  "volume": [
    {
      headline: "Professional Volume Provider | $10M+ Daily Capacity",
      bio: "Experienced volume trader providing organic, compliant market-making services for token launches and exchanges. Specialized in DEX and CEX liquidity provision, with deep expertise in multiple chains. Trusted by 50+ projects.",
      tags: ["High Capacity", "Multi-Chain"]
    }
  ]
};

export function BioTemplates({ category, onSelectTemplate }: BioTemplatesProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();
  
  const templates = TEMPLATES[category] || [];

  if (templates.length === 0) {
    return null;
  }

  const handleUseTemplate = (template: Template, index: number) => {
    onSelectTemplate(template.headline, template.bio);
    setCopiedIndex(index);
    
    toast({
      title: "Template applied",
      description: "Edit the text to personalize it with your details",
    });

    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Professional Templates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {templates.map((template, index) => (
          <Card key={index} className="p-3 hover-elevate cursor-pointer" onClick={() => handleUseTemplate(template, index)}>
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-semibold leading-tight">{template.headline}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{template.bio}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 px-2 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseTemplate(template, index);
                  }}
                  data-testid={`button-use-template-${index}`}
                >
                  {copiedIndex === index ? (
                    <Check className="h-3.5 w-3.5 text-chart-3" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
              <div className="flex gap-1.5">
                {template.tags.map((tag, tagIndex) => (
                  <Badge key={tagIndex} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
