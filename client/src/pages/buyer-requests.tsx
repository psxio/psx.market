import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { BuyerRequestsBoard } from "@/components/BuyerRequestsBoard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, Plus, TrendingUp } from "lucide-react";
import type { BuyerRequest } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function BuyerRequests() {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [budgetFilter, setBudgetFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Buyer Requests - Create.psx";
  }, []);

  const { data: requests = [], isLoading } = useQuery<BuyerRequest[]>({
    queryKey: ["/api/buyer-requests", category, budgetFilter, sortBy, searchQuery],
  });

  const handleSubmitProposal = (requestId: string) => {
    toast({
      title: "Submit Proposal",
      description: `Redirecting to submit proposal for request ${requestId}...`,
    });
    setLocation(`/buyer-request/${requestId}/submit-proposal`);
  };

  const categories = [
    "All Categories",
    "Volume Services",
    "3D & 2D Content",
    "Social Media",
    "KOLs & Influencers",
    "Development",
    "Design",
  ];

  const budgetRanges = [
    { label: "All Budgets", value: "all" },
    { label: "Under $1,000", value: "under_1k" },
    { label: "$1,000 - $5,000", value: "1k_5k" },
    { label: "$5,000 - $10,000", value: "5k_10k" },
    { label: "Over $10,000", value: "over_10k" },
  ];

  const sortOptions = [
    { label: "Most Recent", value: "recent" },
    { label: "Highest Budget", value: "budget_high" },
    { label: "Lowest Budget", value: "budget_low" },
    { label: "Most Proposals", value: "proposals" },
    { label: "Ending Soon", value: "ending_soon" },
  ];

  const filteredRequests = requests.filter((request) => {
    if (searchQuery && !request.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !request.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (category !== "all" && request.category !== category) {
      return false;
    }
    return true;
  });

  const openRequests = filteredRequests.filter((r) => r.status === "open");
  const myProposals = filteredRequests.filter((r) => r.status === "in_progress");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 fadeInUp">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                Buyer Requests
              </h1>
              <p className="text-muted-foreground">
                Browse project requests from clients and submit your proposals
              </p>
            </div>
            <Button
              className="gap-2"
              onClick={() => setLocation("/post-request")}
              data-testid="button-post-request"
            >
              <Plus className="h-4 w-4" />
              Post Request
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search requests..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      data-testid="input-search-requests"
                    />
                  </div>
                </div>

                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.slice(1).map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger data-testid="select-sort">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {budgetRanges.map((range) => (
                  <Badge
                    key={range.value}
                    variant={budgetFilter === range.value ? "default" : "outline"}
                    className="cursor-pointer hover-elevate"
                    onClick={() => setBudgetFilter(range.value)}
                    data-testid={`badge-budget-${range.value}`}
                  >
                    {range.label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="open" className="fadeInUp" style={{ animationDelay: "0.1s" }}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="open" data-testid="tab-open-requests">
              Open Requests
              {openRequests.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {openRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="my-proposals" data-testid="tab-my-proposals">
              My Proposals
              {myProposals.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {myProposals.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="open" className="mt-6">
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            ) : (
              <BuyerRequestsBoard
                requests={openRequests}
                onSubmitProposal={handleSubmitProposal}
                showProposalButton={true}
              />
            )}
          </TabsContent>

          <TabsContent value="my-proposals" className="mt-6">
            {isLoading ? (
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full" />
                ))}
              </div>
            ) : (
              <BuyerRequestsBoard
                requests={myProposals}
                showProposalButton={false}
                emptyState={
                  <Card>
                    <CardContent className="py-16 text-center">
                      <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No proposals yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Browse open requests and submit your first proposal
                      </p>
                      <Button
                        variant="default"
                        onClick={() => {
                          const element = document.querySelector('[value="open"]');
                          if (element instanceof HTMLElement) element.click();
                        }}
                        data-testid="button-browse-requests"
                      >
                        Browse Requests
                      </Button>
                    </CardContent>
                  </Card>
                }
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
