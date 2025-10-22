import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Star, 
  X, 
  Filter,
  ChartBar,
  Award,
  AlertTriangle,
  Tag,
  FileText,
  CheckCircle2,
  XCircle,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Builder } from "@shared/schema";

interface BuilderFormData {
  walletAddress: string;
  name: string;
  headline: string;
  bio: string;
  profileImage?: string;
  category: string;
  skills: string[];
  verified: boolean;
  twitterHandle?: string;
  portfolioLinks?: string[];
  responseTime?: string;
}

interface BuilderTag {
  id: string;
  tagLabel: string;
  tagColor: string;
  tagType: string;
}

interface BuilderNote {
  id: string;
  note: string;
  noteType: string;
  priority: string;
  createdByName: string;
  createdAt: string;
}

interface BuilderAnalytics {
  totalRevenue: number;
  totalOrders: number;
  completedOrders: number;
  activeOrders: number;
  avgOrderValue: number;
  avgRating: number;
  totalReviews: number;
  successRate: string;
  onTimeDeliveryRate: string;
  avgResponseTimeHours: number;
  monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>;
}

interface PerformanceScore {
  totalScore: number;
  grade: string;
  breakdown: {
    rating: { score: number; max: number; value: number };
    successRate: { score: number; max: number; value: number };
    onTimeDelivery: { score: number; max: number; value: number };
    responseTime: { score: number; max: number; value: number };
    completion: { score: number; max: number; value: number };
  };
}

interface ComplianceReport {
  isCompliant: boolean;
  totalIssues: number;
  issues: Array<{
    field: string;
    message: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
  }>;
  lastChecked: string;
}

export default function AdminBuilders() {
  const { toast } = useToast();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBuilder, setEditingBuilder] = useState<Builder | null>(null);
  const [formData, setFormData] = useState<BuilderFormData>({
    walletAddress: "",
    name: "",
    headline: "",
    bio: "",
    profileImage: "",
    category: "kols",
    skills: [],
    verified: true,
    twitterHandle: "",
    portfolioLinks: [],
    responseTime: "24 hours",
  });
  const [skillInput, setSkillInput] = useState("");
  const [portfolioInput, setPortfolioInput] = useState("");
  
  const [selectedBuilders, setSelectedBuilders] = useState<Set<string>>(new Set());
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterVerification, setFilterVerification] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [analyticsSheetOpen, setAnalyticsSheetOpen] = useState(false);
  const [selectedBuilderForAnalytics, setSelectedBuilderForAnalytics] = useState<Builder | null>(null);
  
  const [tagsDialogOpen, setTagsDialogOpen] = useState(false);
  const [selectedBuilderForTags, setSelectedBuilderForTags] = useState<Builder | null>(null);
  const [newTagLabel, setNewTagLabel] = useState("");
  const [newTagColor, setNewTagColor] = useState("gray");
  
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [selectedBuilderForNotes, setSelectedBuilderForNotes] = useState<Builder | null>(null);
  const [newNote, setNewNote] = useState("");
  const [newNotePriority, setNewNotePriority] = useState("normal");

  const { data: builders, isLoading } = useQuery<Builder[]>({ 
    queryKey: ["/api/admin/builders"] 
  });

  const { data: analyticsData } = useQuery<BuilderAnalytics>({
    queryKey: ["/api/admin/builders", selectedBuilderForAnalytics?.id, "analytics"],
    enabled: !!selectedBuilderForAnalytics,
  });

  const { data: performanceScore } = useQuery<PerformanceScore>({
    queryKey: ["/api/admin/builders", selectedBuilderForAnalytics?.id, "performance-score"],
    enabled: !!selectedBuilderForAnalytics,
  });

  const { data: complianceReport } = useQuery<ComplianceReport>({
    queryKey: ["/api/admin/builders", selectedBuilderForAnalytics?.id, "compliance"],
    enabled: !!selectedBuilderForAnalytics,
  });

  const { data: builderTags } = useQuery<BuilderTag[]>({
    queryKey: ["/api/admin/builders", selectedBuilderForTags?.id, "tags"],
    enabled: !!selectedBuilderForTags,
  });

  const { data: builderNotes } = useQuery<BuilderNote[]>({
    queryKey: ["/api/admin/builders", selectedBuilderForNotes?.id, "notes"],
    enabled: !!selectedBuilderForNotes,
  });

  const createMutation = useMutation({
    mutationFn: async (data: BuilderFormData) => {
      await apiRequest("POST", "/api/admin/builders", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/builders"] });
      toast({
        title: "Builder created",
        description: "The builder profile has been successfully created",
      });
      setDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Create failed",
        description: "Failed to create builder",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<BuilderFormData> }) => {
      await apiRequest("PUT", `/api/admin/builders/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/builders"] });
      toast({
        title: "Builder updated",
        description: "The builder profile has been successfully updated",
      });
      setDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update builder",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/builders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/builders"] });
      toast({
        title: "Builder deleted",
        description: "The builder has been successfully removed",
      });
    },
    onError: () => {
      toast({
        title: "Delete failed",
        description: "Failed to delete builder",
        variant: "destructive",
      });
    },
  });

  const bulkActionMutation = useMutation({
    mutationFn: async ({ action, builderIds }: { action: string; builderIds: string[] }) => {
      await apiRequest("POST", "/api/admin/builders/bulk-action", { action, builderIds });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/builders"] });
      setSelectedBuilders(new Set());
      toast({
        title: "Bulk action completed",
        description: "The bulk action has been successfully performed",
      });
    },
    onError: () => {
      toast({
        title: "Bulk action failed",
        description: "Failed to perform bulk action",
        variant: "destructive",
      });
    },
  });

  const addTagMutation = useMutation({
    mutationFn: async ({ builderId, tagLabel, tagColor }: { builderId: string; tagLabel: string; tagColor: string }) => {
      await apiRequest("POST", `/api/admin/builders/${builderId}/tags`, { tagLabel, tagColor });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/builders", selectedBuilderForTags?.id, "tags"] });
      setNewTagLabel("");
      setNewTagColor("gray");
      toast({ title: "Tag added", description: "Tag successfully added to builder" });
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: async ({ builderId, tagId }: { builderId: string; tagId: string }) => {
      await apiRequest("DELETE", `/api/admin/builders/${builderId}/tags/${tagId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/builders", selectedBuilderForTags?.id, "tags"] });
      toast({ title: "Tag removed", description: "Tag successfully removed" });
    },
  });

  const addNoteMutation = useMutation({
    mutationFn: async ({ builderId, note, priority }: { builderId: string; note: string; priority: string }) => {
      await apiRequest("POST", `/api/admin/builders/${builderId}/notes`, { note, noteType: "general", priority });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/builders", selectedBuilderForNotes?.id, "notes"] });
      setNewNote("");
      setNewNotePriority("normal");
      toast({ title: "Note added", description: "Admin note successfully added" });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async ({ builderId, noteId }: { builderId: string; noteId: string }) => {
      await apiRequest("DELETE", `/api/admin/builders/${builderId}/notes/${noteId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/builders", selectedBuilderForNotes?.id, "notes"] });
      toast({ title: "Note deleted", description: "Admin note successfully deleted" });
    },
  });

  const resetForm = () => {
    setEditingBuilder(null);
    setFormData({
      walletAddress: "",
      name: "",
      headline: "",
      bio: "",
      profileImage: "",
      category: "kols",
      skills: [],
      verified: true,
      twitterHandle: "",
      portfolioLinks: [],
      responseTime: "24 hours",
    });
    setSkillInput("");
    setPortfolioInput("");
  };

  const handleOpenCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleOpenEdit = (builder: Builder) => {
    setEditingBuilder(builder);
    setFormData({
      walletAddress: builder.walletAddress,
      name: builder.name,
      headline: builder.headline,
      bio: builder.bio,
      profileImage: builder.profileImage || "",
      category: builder.category,
      skills: builder.skills || [],
      verified: builder.verified,
      twitterHandle: builder.twitterHandle || "",
      portfolioLinks: builder.portfolioLinks || [],
      responseTime: builder.responseTime || "24 hours",
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.walletAddress || !formData.bio || !formData.headline) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields (name, wallet, headline, bio)",
        variant: "destructive",
      });
      return;
    }

    if (editingBuilder) {
      updateMutation.mutate({ id: editingBuilder.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this builder?")) {
      deleteMutation.mutate(id);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
  };

  const addPortfolioLink = () => {
    if (portfolioInput.trim() && !formData.portfolioLinks?.includes(portfolioInput.trim())) {
      setFormData({
        ...formData,
        portfolioLinks: [...(formData.portfolioLinks || []), portfolioInput.trim()],
      });
      setPortfolioInput("");
    }
  };

  const removePortfolioLink = (index: number) => {
    setFormData({
      ...formData,
      portfolioLinks: formData.portfolioLinks?.filter((_, i) => i !== index),
    });
  };

  const toggleSelectBuilder = (builderId: string) => {
    const newSelected = new Set(selectedBuilders);
    if (newSelected.has(builderId)) {
      newSelected.delete(builderId);
    } else {
      newSelected.add(builderId);
    }
    setSelectedBuilders(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedBuilders.size === filteredBuilders.length) {
      setSelectedBuilders(new Set());
    } else {
      setSelectedBuilders(new Set(filteredBuilders.map(b => b.id)));
    }
  };

  const handleBulkAction = (action: string) => {
    if (selectedBuilders.size === 0) {
      toast({
        title: "No builders selected",
        description: "Please select at least one builder",
        variant: "destructive",
      });
      return;
    }
    
    const actionLabels: Record<string, string> = {
      verify: "verify",
      unverify: "unverify",
      suspend: "suspend",
      activate: "activate",
      delete: "delete",
    };
    
    if (confirm(`Are you sure you want to ${actionLabels[action]} ${selectedBuilders.size} builder(s)?`)) {
      bulkActionMutation.mutate({ action, builderIds: Array.from(selectedBuilders) });
    }
  };

  const handleOpenAnalytics = (builder: Builder) => {
    setSelectedBuilderForAnalytics(builder);
    setAnalyticsSheetOpen(true);
  };

  const handleOpenTags = (builder: Builder) => {
    setSelectedBuilderForTags(builder);
    setTagsDialogOpen(true);
  };

  const handleOpenNotes = (builder: Builder) => {
    setSelectedBuilderForNotes(builder);
    setNotesDialogOpen(true);
  };

  const handleAddTag = () => {
    if (!newTagLabel.trim() || !selectedBuilderForTags) return;
    addTagMutation.mutate({ 
      builderId: selectedBuilderForTags.id, 
      tagLabel: newTagLabel.trim(), 
      tagColor: newTagColor 
    });
  };

  const handleAddNote = () => {
    if (!newNote.trim() || !selectedBuilderForNotes) return;
    addNoteMutation.mutate({ 
      builderId: selectedBuilderForNotes.id, 
      note: newNote.trim(), 
      priority: newNotePriority 
    });
  };

  const filteredBuilders = builders?.filter((builder) => {
    if (filterCategory !== "all" && builder.category !== filterCategory) return false;
    if (filterVerification === "verified" && !builder.verified) return false;
    if (filterVerification === "unverified" && builder.verified) return false;
    if (searchQuery && !builder.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }) || [];

  const getPerformanceGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-50 border-green-200';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (grade.startsWith('D')) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getSeverityColor = (severity: string) => {
    if (severity === 'critical') return 'destructive';
    if (severity === 'high') return 'destructive';
    if (severity === 'medium') return 'secondary';
    return 'outline';
  };

  const getTagColor = (color: string) => {
    const colors: Record<string, string> = {
      gray: 'bg-gray-100 text-gray-800 border-gray-300',
      red: 'bg-red-100 text-red-800 border-red-300',
      orange: 'bg-orange-100 text-orange-800 border-orange-300',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      green: 'bg-green-100 text-green-800 border-green-300',
      blue: 'bg-blue-100 text-blue-800 border-blue-300',
      purple: 'bg-purple-100 text-purple-800 border-purple-300',
      pink: 'bg-pink-100 text-pink-800 border-pink-300',
    };
    return colors[color] || colors.gray;
  };

  if (isLoading) {
    return <div>Loading builders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Builders</h2>
          <p className="text-muted-foreground">
            Manage all builders on the platform
          </p>
        </div>
        <Button onClick={handleOpenCreate} data-testid="button-add-builder">
          <Plus className="mr-2 h-4 w-4" />
          Add Builder
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Builders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{builders?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {builders?.filter(b => b.verified).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {builders?.filter(b => b.isActive).length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selected</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedBuilders.size}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters & Bulk Actions</CardTitle>
          <CardDescription>Filter builders and perform bulk actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-filter">Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger data-testid="select-category-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="kols">KOLs & Influencers</SelectItem>
                  <SelectItem value="3d">3D Content Creation</SelectItem>
                  <SelectItem value="marketing">Marketing & Growth</SelectItem>
                  <SelectItem value="development">Script Development</SelectItem>
                  <SelectItem value="volume">Volume Services</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification-filter">Verification</Label>
              <Select value={filterVerification} onValueChange={setFilterVerification}>
                <SelectTrigger data-testid="select-verification-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Results</Label>
              <div className="flex h-9 items-center text-sm font-medium">
                {filteredBuilders.length} builder(s)
              </div>
            </div>
          </div>

          {selectedBuilders.size > 0 && (
            <div className="flex flex-wrap gap-2 rounded-md border border-border bg-muted/20 p-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("verify")}
                data-testid="button-bulk-verify"
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Verify
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("unverify")}
                data-testid="button-bulk-unverify"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Unverify
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("suspend")}
                data-testid="button-bulk-suspend"
              >
                <AlertTriangle className="mr-2 h-4 w-4" />
                Suspend
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("activate")}
                data-testid="button-bulk-activate"
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Activate
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleBulkAction("delete")}
                data-testid="button-bulk-delete"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedBuilders.size === filteredBuilders.length && filteredBuilders.length > 0}
                    onCheckedChange={toggleSelectAll}
                    data-testid="checkbox-select-all"
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBuilders.map((builder) => (
                <TableRow key={builder.id} data-testid={`row-builder-${builder.id}`}>
                  <TableCell>
                    <Checkbox
                      checked={selectedBuilders.has(builder.id)}
                      onCheckedChange={() => toggleSelectBuilder(builder.id)}
                      data-testid={`checkbox-select-${builder.id}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{builder.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{builder.category}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {builder.walletAddress.slice(0, 6)}...{builder.walletAddress.slice(-4)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{builder.rating ? parseFloat(builder.rating).toFixed(1) : "0.0"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {builder.verified ? (
                        <Badge>Verified</Badge>
                      ) : (
                        <Badge variant="secondary">Unverified</Badge>
                      )}
                      {!builder.isActive && (
                        <Badge variant="destructive">Suspended</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenAnalytics(builder)}
                        data-testid={`button-analytics-${builder.id}`}
                      >
                        <ChartBar className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenTags(builder)}
                        data-testid={`button-tags-${builder.id}`}
                      >
                        <Tag className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenNotes(builder)}
                        data-testid={`button-notes-${builder.id}`}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEdit(builder)}
                        data-testid={`button-edit-${builder.id}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(builder.id)}
                        data-testid={`button-delete-${builder.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingBuilder ? "Edit Builder Profile" : "Create New Builder"}
            </DialogTitle>
            <DialogDescription>
              {editingBuilder
                ? "Update the builder's profile information"
                : "Create a custom builder profile with complete details"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Builder name"
                  data-testid="input-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="walletAddress">Wallet Address *</Label>
                <Input
                  id="walletAddress"
                  value={formData.walletAddress}
                  onChange={(e) => setFormData({ ...formData, walletAddress: e.target.value })}
                  placeholder="0x..."
                  data-testid="input-wallet"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="headline">Headline *</Label>
              <Input
                id="headline"
                value={formData.headline}
                onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                placeholder="e.g., Expert KOL & Community Builder"
                data-testid="input-headline"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio *</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Professional bio"
                rows={3}
                data-testid="input-bio"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="profileImage">Profile Image URL</Label>
                <Input
                  id="profileImage"
                  value={formData.profileImage}
                  onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
                  placeholder="https://..."
                  data-testid="input-profile-image"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitterHandle">Twitter Handle</Label>
                <Input
                  id="twitterHandle"
                  value={formData.twitterHandle}
                  onChange={(e) => setFormData({ ...formData, twitterHandle: e.target.value })}
                  placeholder="@username"
                  data-testid="input-twitter"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger data-testid="select-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kols">KOLs & Influencers</SelectItem>
                    <SelectItem value="3d">3D Content Creation</SelectItem>
                    <SelectItem value="marketing">Marketing & Growth</SelectItem>
                    <SelectItem value="development">Script Development</SelectItem>
                    <SelectItem value="volume">Volume Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="responseTime">Response Time</Label>
                <Input
                  id="responseTime"
                  value={formData.responseTime}
                  onChange={(e) => setFormData({ ...formData, responseTime: e.target.value })}
                  placeholder="e.g., 24 hours"
                  data-testid="input-response-time"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill"
                  data-testid="input-skill"
                />
                <Button type="button" onClick={addSkill} data-testid="button-add-skill">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-xs"
                      data-testid={`button-remove-skill-${skill}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Portfolio Links</Label>
              <div className="flex gap-2">
                <Input
                  value={portfolioInput}
                  onChange={(e) => setPortfolioInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPortfolioLink())}
                  placeholder="https://..."
                  data-testid="input-portfolio-link"
                />
                <Button type="button" onClick={addPortfolioLink} data-testid="button-add-portfolio">
                  Add
                </Button>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                {formData.portfolioLinks?.map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm truncate flex-1">{link}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removePortfolioLink(index)}
                      data-testid={`button-remove-portfolio-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="verified"
                checked={formData.verified}
                onCheckedChange={(checked) => setFormData({ ...formData, verified: checked })}
                data-testid="switch-verified"
              />
              <Label htmlFor="verified">Verified Builder</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              data-testid="button-submit"
            >
              {editingBuilder ? "Update Builder" : "Create Builder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={analyticsSheetOpen} onOpenChange={setAnalyticsSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedBuilderForAnalytics?.name} - Analytics</SheetTitle>
            <SheetDescription>
              Comprehensive analytics and performance metrics
            </SheetDescription>
          </SheetHeader>

          {selectedBuilderForAnalytics && (
            <Tabs defaultValue="overview" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="compliance">Compliance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-4 grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Total Revenue
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        ${analyticsData?.totalRevenue.toLocaleString() || "0"}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Total Orders
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {analyticsData?.totalOrders || 0}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Completed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {analyticsData?.completedOrders || 0}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Active
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {analyticsData?.activeOrders || 0}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Order Value</span>
                      <span className="font-medium">${analyticsData?.avgOrderValue.toFixed(2) || "0"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Rating</span>
                      <span className="font-medium">{analyticsData?.avgRating.toFixed(2) || "0"}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Reviews</span>
                      <span className="font-medium">{analyticsData?.totalReviews || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Success Rate</span>
                      <span className="font-medium">{analyticsData?.successRate || "100"}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">On-Time Delivery</span>
                      <span className="font-medium">{analyticsData?.onTimeDeliveryRate || "100"}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg Response Time</span>
                      <span className="font-medium">{analyticsData?.avgResponseTimeHours || 24}h</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                {performanceScore && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Performance Score</span>
                          <Badge className={getPerformanceGradeColor(performanceScore.grade)}>
                            {performanceScore.grade}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-center mb-4">
                          {performanceScore.totalScore}/100
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Score Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Rating ({performanceScore.breakdown.rating.value}/5)</span>
                            <span className="text-sm font-medium">
                              {performanceScore.breakdown.rating.score}/{performanceScore.breakdown.rating.max}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${(performanceScore.breakdown.rating.score / performanceScore.breakdown.rating.max) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Success Rate ({performanceScore.breakdown.successRate.value}%)</span>
                            <span className="text-sm font-medium">
                              {performanceScore.breakdown.successRate.score}/{performanceScore.breakdown.successRate.max}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${(performanceScore.breakdown.successRate.score / performanceScore.breakdown.successRate.max) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">On-Time Delivery ({performanceScore.breakdown.onTimeDelivery.value}%)</span>
                            <span className="text-sm font-medium">
                              {performanceScore.breakdown.onTimeDelivery.score}/{performanceScore.breakdown.onTimeDelivery.max}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${(performanceScore.breakdown.onTimeDelivery.score / performanceScore.breakdown.onTimeDelivery.max) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Response Time ({performanceScore.breakdown.responseTime.value}h)</span>
                            <span className="text-sm font-medium">
                              {performanceScore.breakdown.responseTime.score}/{performanceScore.breakdown.responseTime.max}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${(performanceScore.breakdown.responseTime.score / performanceScore.breakdown.responseTime.max) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Completed Projects ({performanceScore.breakdown.completion.value})</span>
                            <span className="text-sm font-medium">
                              {performanceScore.breakdown.completion.score}/{performanceScore.breakdown.completion.max}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary" 
                              style={{ width: `${(performanceScore.breakdown.completion.score / performanceScore.breakdown.completion.max) * 100}%` }}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>

              <TabsContent value="compliance" className="space-y-4">
                {complianceReport && (
                  <>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>Compliance Status</span>
                          {complianceReport.isCompliant ? (
                            <Badge className="bg-green-100 text-green-800 border-green-300">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              Compliant
                            </Badge>
                          ) : (
                            <Badge variant="destructive">
                              <AlertTriangle className="mr-1 h-3 w-3" />
                              Non-Compliant
                            </Badge>
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center">
                          <div className="text-3xl font-bold">
                            {complianceReport.totalIssues}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Issues</div>
                        </div>
                      </CardContent>
                    </Card>

                    {complianceReport.issues.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Issues Found</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {complianceReport.issues.map((issue, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 rounded-md bg-muted/30">
                              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium">{issue.field}</span>
                                  <Badge variant={getSeverityColor(issue.severity)}>
                                    {issue.severity}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{issue.message}</p>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          )}
        </SheetContent>
      </Sheet>

      <Dialog open={tagsDialogOpen} onOpenChange={setTagsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedBuilderForTags?.name} - Tags</DialogTitle>
            <DialogDescription>
              Manage custom tags for organizational purposes
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Tag label..."
                value={newTagLabel}
                onChange={(e) => setNewTagLabel(e.target.value)}
                data-testid="input-tag-label"
              />
              <Select value={newTagColor} onValueChange={setNewTagColor}>
                <SelectTrigger className="w-32" data-testid="select-tag-color">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gray">Gray</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="orange">Orange</SelectItem>
                  <SelectItem value="yellow">Yellow</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="purple">Purple</SelectItem>
                  <SelectItem value="pink">Pink</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddTag} data-testid="button-add-tag">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {builderTags?.map((tag) => (
                <Badge 
                  key={tag.id} 
                  className={`${getTagColor(tag.tagColor)} flex items-center gap-1`}
                >
                  {tag.tagLabel}
                  <button
                    onClick={() => selectedBuilderForTags && deleteTagMutation.mutate({ 
                      builderId: selectedBuilderForTags.id, 
                      tagId: tag.id 
                    })}
                    data-testid={`button-delete-tag-${tag.id}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedBuilderForNotes?.name} - Admin Notes</DialogTitle>
            <DialogDescription>
              Private notes visible only to administrators
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
                data-testid="input-note"
              />
            </div>
            <div className="flex gap-2">
              <Select value={newNotePriority} onValueChange={setNewNotePriority}>
                <SelectTrigger className="w-32" data-testid="select-note-priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddNote} data-testid="button-add-note">
                <Plus className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </div>

            <div className="space-y-3">
              {builderNotes?.map((note) => (
                <Card key={note.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{note.createdByName}</span>
                        <Badge variant={note.priority === 'high' ? 'destructive' : 'secondary'}>
                          {note.priority}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => selectedBuilderForNotes && deleteNoteMutation.mutate({ 
                          builderId: selectedBuilderForNotes.id, 
                          noteId: note.id 
                        })}
                        data-testid={`button-delete-note-${note.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{note.note}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
