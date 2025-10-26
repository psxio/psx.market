import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star, CheckCircle2, MapPin, Clock, Briefcase } from "lucide-react";

interface ProfilePreviewProps {
  name: string;
  headline: string;
  bio: string;
  category: string;
  skills: string[];
  profileImage?: string;
  responseTime?: string;
}

export function ProfilePreview({
  name,
  headline,
  bio,
  category,
  skills,
  profileImage,
  responseTime = "24 hours",
}: ProfilePreviewProps) {
  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "??";

  const getCategoryDisplay = (cat: string) => {
    const categories: Record<string, string> = {
      "kols": "KOL / Influencer",
      "3d-artists": "3D Artist",
      "marketers": "Marketing & Growth",
      "developers": "Smart Contract Developer",
      "volume": "Volume Services",
    };
    return categories[cat] || cat;
  };

  return (
    <Card className="sticky top-4 h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2 w-2 rounded-full bg-chart-3 animate-pulse" />
          <span>Live Preview</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={profileImage} alt={name || "Profile"} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-1">
            <h3 className="font-semibold text-lg leading-tight">
              {name || "Your Name"}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {headline || "Your professional headline will appear here"}
            </p>
            {category && (
              <Badge variant="secondary" className="text-xs">
                {getCategoryDisplay(category)}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-foreground">New</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            <span>0 projects</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{responseTime}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase">About</h4>
          <p className="text-sm leading-relaxed">
            {bio || "Your bio will appear here. Tell clients about your experience, expertise, and what makes you unique."}
          </p>
        </div>

        {skills && skills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Skills</h4>
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, 6).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {skills.length > 6 && (
                <Badge variant="outline" className="text-xs">
                  +{skills.length - 6} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {(!skills || skills.length === 0) && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Skills</h4>
            <p className="text-xs text-muted-foreground italic">
              Add skills to showcase your expertise
            </p>
          </div>
        )}

        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground text-center">
            This is how clients will see your profile
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
