import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Star, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Builder } from "@shared/schema";

interface BuilderFormData {
  walletAddress: string;
  name: string;
  bio: string;
  avatarUrl?: string;
  category: string;
  rating: string;
  reviewCount: number;
  skills: string[];
  verified: boolean;
  featured: boolean;
  twitterHandle?: string;
  portfolioItems: Array<{
    title: string;
    description: string;
    imageUrl: string;
  }>;
}

export default function AdminBuilders() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBuilder, setEditingBuilder] = useState<Builder | null>(null);
  const [formData, setFormData] = useState<BuilderFormData>({
    walletAddress: "",
    name: "",
    bio: "",
    avatarUrl: "",
    category: "kols",
    rating: "5.0",
    reviewCount: 0,
    skills: [],
    verified: true,
    featured: false,
    twitterHandle: "",
    portfolioItems: [],
  });
  const [skillInput, setSkillInput] = useState("");
  const [portfolioForm, setPortfolioForm] = useState({ title: "", description: "", imageUrl: "" });

  const { data: builders, isLoading } = useQuery<Builder[]>({ 
    queryKey: ["/api/admin/builders"] 
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

  const resetForm = () => {
    setEditingBuilder(null);
    setFormData({
      walletAddress: "",
      name: "",
      bio: "",
      avatarUrl: "",
      category: "kols",
      rating: "5.0",
      reviewCount: 0,
      skills: [],
      verified: true,
      featured: false,
      twitterHandle: "",
      portfolioItems: [],
    });
    setSkillInput("");
    setPortfolioForm({ title: "", description: "", imageUrl: "" });
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
      bio: builder.bio,
      avatarUrl: builder.avatarUrl || "",
      category: builder.category,
      rating: builder.rating || "5.0",
      reviewCount: builder.reviewCount || 0,
      skills: builder.skills || [],
      verified: builder.verified,
      featured: builder.featured || false,
      twitterHandle: builder.twitterHandle || "",
      portfolioItems: builder.portfolioItems || [],
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.walletAddress || !formData.bio) {
      toast({
        title: "Validation error",
        description: "Please fill in all required fields",
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

  const addPortfolioItem = () => {
    if (portfolioForm.title && portfolioForm.description) {
      setFormData({
        ...formData,
        portfolioItems: [...formData.portfolioItems, portfolioForm],
      });
      setPortfolioForm({ title: "", description: "", imageUrl: "" });
    }
  };

  const removePortfolioItem = (index: number) => {
    setFormData({
      ...formData,
      portfolioItems: formData.portfolioItems.filter((_, i) => i !== index),
    });
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

      <Card>
        <CardHeader>
          <CardTitle>All Builders ({builders?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {builders?.map((builder) => (
                <TableRow key={builder.id} data-testid={`row-builder-${builder.id}`}>
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
                    {builder.verified ? (
                      <Badge>Verified</Badge>
                    ) : (
                      <Badge variant="secondary">Unverified</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
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
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input
                  id="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  placeholder="https://..."
                  data-testid="input-avatar"
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

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kols">KOLs</SelectItem>
                    <SelectItem value="3d-content">3D Content</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="volume">Volume</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  data-testid="input-rating"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reviewCount">Review Count</Label>
                <Input
                  id="reviewCount"
                  type="number"
                  min="0"
                  value={formData.reviewCount}
                  onChange={(e) => setFormData({ ...formData, reviewCount: parseInt(e.target.value) || 0 })}
                  data-testid="input-review-count"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="verified"
                  checked={formData.verified}
                  onCheckedChange={(checked) => setFormData({ ...formData, verified: checked })}
                  data-testid="switch-verified"
                />
                <Label htmlFor="verified">Verified</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  data-testid="switch-featured"
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Skills</Label>
              <div className="flex gap-2">
                <Input
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  placeholder="Add a skill"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  data-testid="input-skill"
                />
                <Button type="button" onClick={addSkill} data-testid="button-add-skill">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {skill}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeSkill(skill)}
                    />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Portfolio Items</Label>
              <Card>
                <CardContent className="pt-4 space-y-3">
                  <Input
                    value={portfolioForm.title}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, title: e.target.value })}
                    placeholder="Project title"
                    data-testid="input-portfolio-title"
                  />
                  <Textarea
                    value={portfolioForm.description}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, description: e.target.value })}
                    placeholder="Project description"
                    rows={2}
                    data-testid="input-portfolio-description"
                  />
                  <Input
                    value={portfolioForm.imageUrl}
                    onChange={(e) => setPortfolioForm({ ...portfolioForm, imageUrl: e.target.value })}
                    placeholder="Image URL (optional)"
                    data-testid="input-portfolio-image"
                  />
                  <Button type="button" onClick={addPortfolioItem} className="w-full" data-testid="button-add-portfolio">
                    Add Portfolio Item
                  </Button>
                </CardContent>
              </Card>
              <div className="space-y-2 mt-2">
                {formData.portfolioItems.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.title}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          {item.imageUrl && (
                            <p className="text-xs text-muted-foreground mt-1">Image: {item.imageUrl}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removePortfolioItem(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
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
    </div>
  );
}
