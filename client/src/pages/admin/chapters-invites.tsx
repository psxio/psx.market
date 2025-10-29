import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAdminAuth } from "@/hooks/use-admin-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Link2, Copy, Check, Mail, UserPlus, Globe, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { ChaptersInvite } from "@shared/schema";

export default function AdminChaptersInvites() {
  const { isAuthenticated } = useAdminAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) {
    return null;
  }

  const [dialogOpen, setDialogOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    region: "",
    email: "",
    notes: "",
    expiresIn: "30",
  });

  const { data: invites, isLoading } = useQuery<ChaptersInvite[]>({
    queryKey: ["/api/admin/chapters-invites"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/admin/chapters-invites", {
        region: data.region || undefined,
        email: data.email || undefined,
        notes: data.notes || undefined,
        expiresIn: data.expiresIn ? parseInt(data.expiresIn) : undefined,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/chapters-invites"] });
      toast({
        title: "Chapters Invite Created",
        description: "Based Creators chapters invite has been generated for 2-in-1 onboarding",
      });
      setFormData({ region: "", email: "", notes: "", expiresIn: "30" });
      setDialogOpen(false);
    },
    onError: (error: Error) => {
      console.error("Error creating chapters invite:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create chapters invite",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/chapters-invites/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/chapters-invites"] });
      toast({
        title: "Invite Revoked",
        description: "The chapters invite link has been permanently deleted",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to revoke chapters invite",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string, region?: string) => {
    const confirmMsg = region 
      ? `Revoke chapters invite for ${region}? This cannot be undone.`
      : "Revoke this chapters invite link? This cannot be undone.";
    
    if (confirm(confirmMsg)) {
      deleteMutation.mutate(id);
    }
  };

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const getInviteLink = (token: string) => {
    return `${window.location.origin}/chapters-onboarding/${token}`;
  };

  const copyToClipboard = (token: string) => {
    const link = getInviteLink(token);
    navigator.clipboard.writeText(link);
    setCopiedToken(token);
    toast({
      title: "Copied to clipboard",
      description: "Chapters invite link copied - includes 2-in-1 onboarding flow",
    });
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Based Creators Chapters Invites</h2>
          <p className="text-muted-foreground">
            Generate 2-in-1 invite links for chapter members (basedcreators.xyz + marketplace)
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-chapters-invite">
              <Plus className="mr-2 h-4 w-4" />
              Generate Chapters Invite
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Based Creators Chapters Invite</DialogTitle>
              <DialogDescription>
                Create a 2-in-1 invite for Based Creators chapters (basedcreators.xyz + port444 marketplace)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="region">Chapter Region</Label>
                <Select
                  value={formData.region}
                  onValueChange={(value) => setFormData({ ...formData, region: value })}
                >
                  <SelectTrigger id="region">
                    <SelectValue placeholder="Select region..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="West Africa">West Africa</SelectItem>
                    <SelectItem value="Southern Africa">Southern Africa</SelectItem>
                    <SelectItem value="North America">North America</SelectItem>
                    <SelectItem value="Europe">Europe</SelectItem>
                    <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
                    <SelectItem value="Latin America">Latin America</SelectItem>
                    <SelectItem value="Middle East">Middle East</SelectItem>
                    <SelectItem value="Global">Global Chapter</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Based Creators regional chapter location
                </p>
              </div>
              <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="creator@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Pre-fill email for chapter member onboarding
                </p>
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Chapter details, leader name, or special notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="expires">Expiration</Label>
                <Select
                  value={formData.expiresIn}
                  onValueChange={(value) => setFormData({ ...formData, expiresIn: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60 days</SelectItem>
                    <SelectItem value="0">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                {createMutation.isPending ? "Generating..." : "Generate Invite"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invites</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invites?.length || 0}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Used</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invites?.filter((i) => i.used).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Successfully onboarded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invites?.filter((i) => !i.used && (!i.expiresAt || new Date(i.expiresAt) > new Date())).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Available to use</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chapters Invite Links</CardTitle>
          <CardDescription>
            All Based Creators chapters invites with 2-in-1 onboarding (basedcreators.xyz + marketplace)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Used By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invites?.map((invite) => {
                const isExpired = invite.expiresAt && new Date(invite.expiresAt) < new Date();
                const isActive = !invite.used && !isExpired;

                return (
                  <TableRow key={invite.id}>
                    <TableCell>
                      <Badge variant={invite.used ? "secondary" : isExpired ? "destructive" : "default"}>
                        {invite.used ? "Used" : isExpired ? "Expired" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {invite.region ? (
                        <div className="flex items-center gap-2">
                          <Globe className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{invite.region}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {invite.email ? (
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">{invite.email}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      <span className="text-sm text-muted-foreground">
                        {invite.notes || "-"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{formatDate(invite.createdAt)}</span>
                    </TableCell>
                    <TableCell>
                      {invite.expiresAt ? (
                        <span className="text-sm">{formatDate(invite.expiresAt)}</span>
                      ) : (
                        <span className="text-muted-foreground">Never</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {invite.usedByName ? (
                        <div>
                          <div className="font-medium text-sm">{invite.usedByName}</div>
                          <div className="text-xs text-muted-foreground">
                            {invite.usedAt && formatDate(invite.usedAt)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {isActive && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(invite.token)}
                            data-testid={`button-copy-${invite.id}`}
                          >
                            {copiedToken === invite.token ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                        {!invite.used && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(invite.id, invite.region || undefined)}
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-${invite.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
