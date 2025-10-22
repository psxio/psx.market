import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Sparkles, TrendingUp, Code, BarChart3, Palette, Music, Network, ArrowRight } from "lucide-react";
import type { Category } from "@shared/schema";

interface CategoryCardProps {
  category: Category;
  serviceCount?: number;
  builderCount?: number;
}

const categoryVisuals = {
  "KOLs & Influencers": {
    icon: Users,
    gradient: "from-purple-600 via-pink-600 to-red-600",
    glowColor: "shadow-purple-500/50",
    iconColor: "text-purple-100"
  },
  "3D Content Creation": {
    icon: Sparkles,
    gradient: "from-cyan-600 via-blue-600 to-indigo-600",
    glowColor: "shadow-cyan-500/50",
    iconColor: "text-cyan-100"
  },
  "Marketing & Growth": {
    icon: TrendingUp,
    gradient: "from-green-600 via-emerald-600 to-teal-600",
    glowColor: "shadow-green-500/50",
    iconColor: "text-green-100"
  },
  "Script Development": {
    icon: Code,
    gradient: "from-blue-600 via-indigo-600 to-violet-600",
    glowColor: "shadow-blue-500/50",
    iconColor: "text-blue-100"
  },
  "Volume Services": {
    icon: BarChart3,
    gradient: "from-orange-600 via-amber-600 to-yellow-600",
    glowColor: "shadow-orange-500/50",
    iconColor: "text-orange-100"
  },
  "Creative & Design": {
    icon: Palette,
    gradient: "from-pink-600 via-rose-600 to-red-600",
    glowColor: "shadow-pink-500/50",
    iconColor: "text-pink-100"
  },
  "Audio & Production": {
    icon: Music,
    gradient: "from-violet-600 via-purple-600 to-fuchsia-600",
    glowColor: "shadow-violet-500/50",
    iconColor: "text-violet-100"
  },
  "Connectors & Network": {
    icon: Network,
    gradient: "from-teal-600 via-cyan-600 to-blue-600",
    glowColor: "shadow-teal-500/50",
    iconColor: "text-teal-100"
  }
};

export function CategoryCard({ category, serviceCount = 0, builderCount = 0 }: CategoryCardProps) {
  const categoryKey = category.name as keyof typeof categoryVisuals;
  const visual = categoryVisuals[categoryKey] || categoryVisuals["Script Development"];
  const CategoryIcon = visual.icon;

  return (
    <Link href={`/marketplace?categories=${encodeURIComponent(category.name)}`}>
      <Card 
        className="group relative overflow-hidden border-0 hover-elevate active-elevate-2 cursor-pointer h-full min-h-[280px] transition-all duration-300 hover:shadow-2xl"
        data-testid={`card-category-${category.id}`}
      >
        {/* Vibrant gradient background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${visual.gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />
        
        {/* Animated pattern overlay */}
        <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-500">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
        </div>

        {/* Glow effect on hover */}
        <div className={`absolute -inset-1 ${visual.glowColor} opacity-0 group-hover:opacity-75 blur-2xl transition-opacity duration-300 -z-10`} />

        <CardContent className="relative z-10 flex flex-col items-center justify-center text-center p-8 h-full">
          {/* Large centered icon */}
          <div className="mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-2xl blur-xl" />
              <div className="relative bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <CategoryIcon className={`h-16 w-16 ${visual.iconColor}`} strokeWidth={1.5} />
              </div>
            </div>
          </div>

          {/* Category name */}
          <h3 className="text-2xl font-bold text-white mb-3 group-hover:scale-105 transition-transform duration-300">
            {category.name}
          </h3>

          {/* Description */}
          <p className="text-white/90 text-sm mb-6 line-clamp-2 max-w-[280px]">
            {category.description}
          </p>

          {/* Stats badges */}
          <div className="flex gap-3 mb-6">
            {serviceCount > 0 && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {serviceCount} {serviceCount === 1 ? 'Service' : 'Services'}
              </Badge>
            )}
            {builderCount > 0 && (
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                {builderCount} {builderCount === 1 ? 'Builder' : 'Builders'}
              </Badge>
            )}
          </div>

          {/* CTA button */}
          <Button 
            variant="secondary" 
            className="bg-white text-gray-900 hover:bg-white/90 font-semibold group-hover:scale-105 transition-all duration-300 shadow-xl"
            data-testid="button-explore-category"
          >
            Explore Category
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
