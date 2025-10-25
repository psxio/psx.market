import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Star,
  TrendingUp,
  Users,
  Briefcase,
  CheckCircle2,
  Shield,
  Zap,
  DollarSign,
  MessageSquare,
  BarChart3
} from "lucide-react";

// Mock data for demo
const mockServices = [
  {
    id: 1,
    title: "Custom Volume Generation",
    category: "Volume Services",
    price: "$2,500",
    rating: "4.9",
    reviews: 47,
    builder: "VolumeKing",
    tokens: ["$TFUND", "$PSX", "$DUHCAT"],
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop"
  },
  {
    id: 2,
    title: "3D Character Design",
    category: "3D & 2D Content",
    price: "$1,200",
    rating: "5.0",
    reviews: 89,
    builder: "ArtMaster3D",
    tokens: ["$CREATE", "$PSX", "$BONK"],
    image: "https://images.unsplash.com/photo-1618609378039-b572f64c5b42?w=400&h=300&fit=crop"
  },
  {
    id: 3,
    title: "Grant Application Support",
    category: "Grants & Funding",
    price: "$3,000",
    rating: "4.8",
    reviews: 56,
    builder: "GrantPro Agency",
    tokens: ["$BASE", "$OP", "$ARB"],
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop"
  }
];

const mockBuilders = [
  {
    id: 1,
    name: "VolumeKing",
    category: "Volume Services",
    rating: "4.9",
    reviews: 47,
    projects: 120,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=VolumeKing"
  },
  {
    id: 2,
    name: "ArtMaster3D",
    category: "3D & 2D Content",
    rating: "5.0",
    reviews: 89,
    projects: 215,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ArtMaster3D"
  },
  {
    id: 3,
    name: "GrantPro Agency",
    category: "Grants & Funding",
    rating: "4.8",
    reviews: 56,
    projects: 87,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=GrantPro"
  }
];

const categories = [
  "3D Artists",
  "KOL & Influencers",
  "Volume Services",
  "Grants & Funding",
  "Strategy",
  "Development"
];

export default function AppDemo() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const totalSlides = 8;
  const slideInterval = 6000; // 6 seconds per slide

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, slideInterval);

    return () => clearInterval(timer);
  }, [isPlaying, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Controls - Fixed at top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="outline"
                onClick={() => setIsPlaying(!isPlaying)}
                data-testid="button-demo-play-pause"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={prevSlide}
                data-testid="button-demo-prev"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={nextSlide}
                data-testid="button-demo-next"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">
                  Slide {currentSlide + 1} / {totalSlides}
                </span>
                <Progress value={((currentSlide + 1) / totalSlides) * 100} className="flex-1" />
              </div>
              <div className="flex gap-1">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToSlide(i)}
                    className={`flex-1 h-1 rounded-full transition-colors ${
                      i === currentSlide ? "bg-primary" : "bg-muted"
                    }`}
                    data-testid={`button-slide-${i}`}
                  />
                ))}
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              Auto-play: {isPlaying ? "ON" : "OFF"}
            </div>
          </div>
        </div>
      </div>

      {/* Slides */}
      <div className="pt-24 pb-8">
        {/* Slide 0: Homepage Hero */}
        {currentSlide === 0 && (
          <div className="container mx-auto px-4 space-y-12 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="text-center space-y-4 py-8">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                port444
              </h1>
              <p className="text-2xl text-muted-foreground max-w-2xl mx-auto">
                Premier Web3 Marketplace for $CREATE & $PSX Ecosystem
              </p>
              <p className="text-lg text-muted-foreground">
                Connect with elite builders across 10 specialized categories
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button size="lg" data-testid="button-browse-services">
                  Browse Services
                </Button>
                <Button size="lg" variant="outline" data-testid="button-find-builders">
                  Find Builders
                </Button>
              </div>
            </div>

            {/* Category Browser */}
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold mb-4 text-center">Browse by Category</h2>
              <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((cat) => (
                  <Badge
                    key={cat}
                    variant="outline"
                    className="text-sm px-4 py-2 cursor-pointer hover-elevate active-elevate-2"
                  >
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Search Demo */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search for grants, KOLs, volume, 3D design..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border bg-card text-card-foreground"
                  defaultValue="grants"
                  data-testid="input-demo-search"
                />
              </div>
            </div>

            {/* Token Holder Benefits */}
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <Badge variant="secondary" className="mb-2">
                  <Zap className="h-3 w-3 mr-1" />
                  Exclusive Rewards
                </Badge>
                <h2 className="text-3xl font-bold">Token Holder Benefits</h2>
                <p className="text-muted-foreground">
                  Hold $CREATE or $PSX tokens to unlock exclusive platform perks, discounts, and priority access
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold">60% Lower Fees</h3>
                  <p className="text-sm text-muted-foreground">
                    Pay only 1% platform fee instead of 2.5% standard rate on all orders
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">Save on every order</p>
                </Card>

                <Card className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="font-semibold">Priority Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Get faster response times and dedicated assistance from our team
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">VIP treatment</p>
                </Card>

                <Card className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-cyan-500" />
                  </div>
                  <h3 className="font-semibold">Verified Badge</h3>
                  <p className="text-sm text-muted-foreground">
                    Display token holder badge on your profile to build trust with builders
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">Stand out</p>
                </Card>

                <Card className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-yellow-500" />
                  </div>
                  <h3 className="font-semibold">Early Access</h3>
                  <p className="text-sm text-muted-foreground">
                    Be first to access new features, exclusive services, and premium builders
                  </p>
                  <p className="text-xs text-muted-foreground font-medium">Beta features</p>
                </Card>
              </div>

              <Card className="p-6 bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have tokens yet? Platform is fully accessible to everyone - benefits are optional rewards!
                </p>
                <div className="flex gap-3 justify-center mt-4">
                  <Button variant="outline" size="sm">
                    Get $PSX Tokens
                  </Button>
                  <Button size="sm" data-testid="button-browse-without-tokens">
                    Browse Without Tokens
                  </Button>
                </div>
              </Card>
            </div>

            {/* PSX Agency Promotion */}
            <Card className="max-w-6xl mx-auto p-8 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20">
              <div className="space-y-4">
                <Badge variant="secondary" className="mb-2">
                  <Shield className="h-3 w-3 mr-1" />
                  Direct B2B Services
                </Badge>
                <h2 className="text-2xl font-bold">Need Direct Talent Support?</h2>
                <p className="text-muted-foreground max-w-2xl">
                  Visit <span className="font-bold text-foreground">psx.agency</span> for our dedicated talent line offering direct B2B and coin-to-coin business partnerships. Powered by <span className="text-purple-400">Create</span> and <span className="text-cyan-400">PSX</span> tokens. Proudly partnered with <span className="text-purple-400">The Creators</span> at thecreators.com.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" data-testid="button-visit-psx">
                    Visit PSX Agency
                  </Button>
                  <Button variant="ghost" data-testid="button-the-creators">
                    The Creators
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Slide 1: Marketplace Grid */}
        {currentSlide === 1 && (
          <div className="container mx-auto px-4 animate-in fade-in duration-500">
            <div className="flex gap-6">
              {/* Sidebar Filters */}
              <div className="w-64 space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.slice(0, 4).map((cat) => (
                      <div key={cat} className="flex items-center gap-2">
                        <input type="checkbox" checked={cat === "Grants & Funding"} readOnly />
                        <span className="text-sm">{cat}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Price Range</h3>
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">$500 - $5,000</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Rating</h3>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">4.5+ Stars</span>
                  </div>
                </div>
              </div>

              {/* Service Grid */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold">Browse Services</h2>
                  <div className="text-sm text-muted-foreground">
                    {mockServices.length} services found
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockServices.map((service) => (
                    <Card key={service.id} className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer" data-testid={`card-service-${service.id}`}>
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold line-clamp-2">{service.title}</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{service.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({service.reviews})
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {service.tokens.slice(0, 3).map((token) => (
                            <Badge key={token} variant="secondary" className="text-xs font-mono">
                              {token}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                          <span className="text-sm text-muted-foreground">{service.builder}</span>
                          <span className="font-bold text-lg">{service.price}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide 2: Service Detail */}
        {currentSlide === 2 && (
          <div className="container mx-auto px-4 animate-in fade-in duration-500">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <img
                    src={mockServices[2].image}
                    alt="Grant Application Support"
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  <div>
                    <Badge variant="secondary" className="mb-2">Grants & Funding</Badge>
                    <h1 className="text-3xl font-bold mb-2">Grant Application Support</h1>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-foreground">4.8</span>
                        <span>(56 reviews)</span>
                      </div>
                      <span>•</span>
                      <span>87 projects completed</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">About This Service</h2>
                    <p className="text-muted-foreground">
                      Professional grant application support for Web3 projects. We help you secure funding
                      from Base Ecosystem, Optimism, Arbitrum, and other major grant programs. Our team
                      has successfully secured over $18M in grants for 350+ clients.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="font-mono">$BASE</Badge>
                    <Badge variant="secondary" className="font-mono">$OP</Badge>
                    <Badge variant="secondary" className="font-mono">$ARB</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <Card className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b">
                        <span className="font-semibold">Basic</span>
                        <span className="text-2xl font-bold">$3,000</span>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Grant Research</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Application Draft</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>14 Day Delivery</span>
                        </li>
                      </ul>
                    </div>
                    <Button className="w-full" size="lg" data-testid="button-order-basic">
                      Order Now
                    </Button>
                  </Card>

                  <Card className="p-6 space-y-4 border-primary">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b">
                        <span className="font-semibold">Standard</span>
                        <span className="text-2xl font-bold">$5,500</span>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Everything in Basic</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>2 Grant Applications</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Follow-up Support</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>10 Day Delivery</span>
                        </li>
                      </ul>
                    </div>
                    <Button className="w-full" size="lg" data-testid="button-order-standard">
                      Order Now - Most Popular
                    </Button>
                  </Card>

                  <Card className="p-6 space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between pb-3 border-b">
                        <span className="font-semibold">Premium</span>
                        <span className="text-2xl font-bold">$9,000</span>
                      </div>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Everything in Standard</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>4 Grant Applications</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Strategy Session</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>7 Day Delivery</span>
                        </li>
                      </ul>
                    </div>
                    <Button className="w-full" size="lg" variant="outline" data-testid="button-order-premium">
                      Order Now
                    </Button>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide 3: Browse Builders */}
        {currentSlide === 3 && (
          <div className="container mx-auto px-4 animate-in fade-in duration-500">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-center">Browse Builders</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockBuilders.map((builder) => (
                  <Card key={builder.id} className="p-6 space-y-4 hover-elevate active-elevate-2 cursor-pointer" data-testid={`card-builder-${builder.id}`}>
                    <div className="flex items-start gap-4">
                      <img
                        src={builder.avatar}
                        alt={builder.name}
                        className="w-16 h-16 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">{builder.name}</h3>
                        <p className="text-sm text-muted-foreground">{builder.category}</p>
                      </div>
                      <Badge variant="secondary">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{builder.rating}</span>
                        <span className="text-muted-foreground">({builder.reviews})</span>
                      </div>
                      <span>•</span>
                      <span className="text-muted-foreground">{builder.projects} projects</span>
                    </div>

                    <div className="flex gap-2 pt-2 border-t">
                      <Button className="flex-1" size="sm" data-testid={`button-view-profile-${builder.id}`}>
                        View Profile
                      </Button>
                      <Button variant="outline" size="sm" data-testid={`button-message-${builder.id}`}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Slide 4: Builder Profile */}
        {currentSlide === 4 && (
          <div className="container mx-auto px-4 animate-in fade-in duration-500">
            <div className="max-w-5xl mx-auto space-y-8">
              {/* Header */}
              <div className="flex items-start gap-6">
                <img
                  src={mockBuilders[2].avatar}
                  alt="GrantPro Agency"
                  className="w-24 h-24 rounded-full"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold">GrantPro Agency</h1>
                    <Badge variant="secondary">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <p className="text-lg text-muted-foreground">
                    Expert Grant Consulting & Funding Acceleration
                  </p>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">4.8</span>
                      <span className="text-muted-foreground">(56 reviews)</span>
                    </div>
                    <span className="text-muted-foreground">87 projects</span>
                    <span className="text-muted-foreground">Response time: 2 hours</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="lg" data-testid="button-contact-builder">
                    Contact Builder
                  </Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 text-center">
                  <div className="text-3xl font-bold text-green-500">91%</div>
                  <div className="text-sm text-muted-foreground mt-1">Success Rate</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-3xl font-bold text-purple-500">$18M+</div>
                  <div className="text-sm text-muted-foreground mt-1">Funds Raised</div>
                </Card>
                <Card className="p-4 text-center">
                  <div className="text-3xl font-bold text-cyan-500">350+</div>
                  <div className="text-sm text-muted-foreground mt-1">Happy Clients</div>
                </Card>
              </div>

              {/* About */}
              <Card className="p-6 space-y-4">
                <h2 className="text-xl font-semibold">About</h2>
                <p className="text-muted-foreground">
                  GrantPro Agency specializes in securing grants and funding for Web3 projects. We have a
                  proven track record with Base Ecosystem, Optimism, Arbitrum, and other major grant programs.
                  Our comprehensive approach includes grant research, application writing, strategy consulting,
                  and follow-up support.
                </p>
              </Card>

              {/* Services */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4 space-y-2 hover-elevate active-elevate-2 cursor-pointer">
                    <h3 className="font-semibold">Grant Application Support</h3>
                    <p className="text-sm text-muted-foreground">
                      Starting at <span className="font-bold text-foreground">$3,000</span>
                    </p>
                  </Card>
                  <Card className="p-4 space-y-2 hover-elevate active-elevate-2 cursor-pointer">
                    <h3 className="font-semibold">Grant Acceleration Package</h3>
                    <p className="text-sm text-muted-foreground">
                      Starting at <span className="font-bold text-foreground">$7,500</span>
                    </p>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Slide 5: Getting Started */}
        {currentSlide === 5 && (
          <div className="container mx-auto px-4 animate-in fade-in duration-500">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold">Getting Started</h1>
                <p className="text-lg text-muted-foreground">
                  Everything you need to know about using port444
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* For Clients */}
                <Card className="p-6 space-y-6">
                  <div className="text-center space-y-2">
                    <Users className="h-12 w-12 mx-auto text-purple-500" />
                    <h2 className="text-2xl font-semibold">For Clients</h2>
                    <p className="text-sm text-muted-foreground">
                      Find and hire top Web3 builders
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-purple-500">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Browse or Search</h3>
                        <p className="text-sm text-muted-foreground">
                          Explore 10 categories or use AI matching
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-purple-500">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Review Profiles</h3>
                        <p className="text-sm text-muted-foreground">
                          Check portfolios, ratings, and past work
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-purple-500">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Hire & Pay</h3>
                        <p className="text-sm text-muted-foreground">
                          Secure USDC payments via smart contract escrow
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" data-testid="button-browse-services-cta">
                    Browse Services
                  </Button>
                </Card>

                {/* For Builders */}
                <Card className="p-6 space-y-6">
                  <div className="text-center space-y-2">
                    <Briefcase className="h-12 w-12 mx-auto text-cyan-500" />
                    <h2 className="text-2xl font-semibold">For Builders</h2>
                    <p className="text-sm text-muted-foreground">
                      Join 42+ verified builders earning on port444
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-cyan-500">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Apply & Get Approved</h3>
                        <p className="text-sm text-muted-foreground">
                          Complete our builder readiness quiz
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-cyan-500">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Create Profile</h3>
                        <p className="text-sm text-muted-foreground">
                          Showcase your portfolio and services
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-cyan-500">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">Start Earning</h3>
                        <p className="text-sm text-muted-foreground">
                          Get paid in USDC with low fees (1% for token holders)
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" variant="outline" data-testid="button-apply-builder">
                    Apply as Builder
                  </Button>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Slide 6: Token Benefits */}
        {currentSlide === 6 && (
          <div className="container mx-auto px-4 animate-in fade-in duration-500">
            <div className="max-w-5xl mx-auto space-y-8">
              <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold">Token Holder Benefits</h1>
                <p className="text-lg text-muted-foreground">
                  Exclusive perks for $CREATE and $PSX holders
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 space-y-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                    <DollarSign className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="font-semibold">Reduced Fees</h3>
                  <p className="text-3xl font-bold text-green-500">1%</p>
                  <p className="text-sm text-muted-foreground">vs 2.5% standard</p>
                </Card>

                <Card className="p-6 space-y-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto">
                    <Shield className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="font-semibold">Priority Support</h3>
                  <p className="text-sm text-muted-foreground mt-4">
                    Get help faster with dedicated support
                  </p>
                </Card>

                <Card className="p-6 space-y-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto">
                    <Zap className="h-6 w-6 text-cyan-500" />
                  </div>
                  <h3 className="font-semibold">Early Access</h3>
                  <p className="text-sm text-muted-foreground mt-4">
                    First access to new features and builders
                  </p>
                </Card>

                <Card className="p-6 space-y-3 text-center">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto">
                    <TrendingUp className="h-6 w-6 text-yellow-500" />
                  </div>
                  <h3 className="font-semibold">Exclusive Services</h3>
                  <p className="text-sm text-muted-foreground mt-4">
                    Access to token-holder-only services
                  </p>
                </Card>
              </div>

              <Card className="p-8 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold">Platform Open to All</h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Anyone can use port444, but token holders get exclusive benefits and reduced fees.
                    Hold $CREATE or $PSX to unlock premium features.
                  </p>
                  <Button size="lg" data-testid="button-connect-wallet">
                    Connect Wallet to Check Benefits
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Slide 7: Platform Features Summary */}
        {currentSlide === 7 && (
          <div className="container mx-auto px-4 animate-in fade-in duration-500">
            <div className="max-w-6xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  port444
                </h1>
                <p className="text-2xl text-muted-foreground">
                  The Premier Web3 Marketplace
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Briefcase className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-semibold">10 Categories</h3>
                  <p className="text-sm text-muted-foreground">
                    KOL, Volume, 3D/2D, Grants, Strategy, Documentation, Development, Social Media, Design, Marketing
                  </p>
                </Card>

                <Card className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-cyan-500" />
                  </div>
                  <h3 className="text-xl font-semibold">42+ Builders</h3>
                  <p className="text-sm text-muted-foreground">
                    Verified professionals with proven track records and portfolios
                  </p>
                </Card>

                <Card className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold">Smart Contract Escrow</h3>
                  <p className="text-sm text-muted-foreground">
                    Secure USDC payments on Base blockchain with milestone releases
                  </p>
                </Card>

                <Card className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-yellow-500" />
                  </div>
                  <h3 className="text-xl font-semibold">AI Matching</h3>
                  <p className="text-sm text-muted-foreground">
                    OpenAI-powered builder discovery and personalized recommendations
                  </p>
                </Card>

                <Card className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-pink-500" />
                  </div>
                  <h3 className="text-xl font-semibold">Real-Time Chat</h3>
                  <p className="text-sm text-muted-foreground">
                    WebSocket messaging with file attachments and notifications
                  </p>
                </Card>

                <Card className="p-6 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-semibold">Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Builder performance tracking and client insights
                  </p>
                </Card>
              </div>

              <Card className="p-12 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border-purple-500/20">
                <div className="text-center space-y-6">
                  <h2 className="text-3xl font-bold">Ready to Get Started?</h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Join the premier marketplace for Web3 talent. Connect with elite builders or showcase your skills.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button size="lg" data-testid="button-final-browse">
                      Browse Services
                    </Button>
                    <Button size="lg" variant="outline" data-testid="button-final-apply">
                      Apply as Builder
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
