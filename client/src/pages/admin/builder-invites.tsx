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
import { Plus, Link2, Copy, Check, Mail, UserPlus, Sparkles, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { BuilderInviteToken } from "@shared/schema";

export default function AdminBuilderInvites() {
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
    email: "",
    notes: "",
    expiresIn: "30",
  });

  const { data: invites, isLoading } = useQuery<BuilderInviteToken[]>({
    queryKey: ["/api/admin/builder-invites"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/admin/builder-invites", {
        email: data.email || undefined,
        notes: data.notes || undefined,
        expiresIn: data.expiresIn ? parseInt(data.expiresIn) : undefined,
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/builder-invites"] });
      toast({
        title: "Invite created",
        description: "Builder invite link has been generated",
      });
      setFormData({ email: "", notes: "", expiresIn: "30" });
      setDialogOpen(false);
    },
    onError: (error: Error) => {
      console.error("Error creating invite:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create invite link",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/builder-invites/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/builder-invites"] });
      toast({
        title: "Invite revoked",
        description: "The invite link has been permanently deleted",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to revoke invite link",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: string, email?: string) => {
    const confirmMsg = email 
      ? `Revoke invite for ${email}? This cannot be undone.`
      : "Revoke this invite link? This cannot be undone.";
    
    if (confirm(confirmMsg)) {
      deleteMutation.mutate(id);
    }
  };

  const handleCreate = () => {
    createMutation.mutate(formData);
  };

  const getInviteLink = (token: string) => {
    return `${window.location.origin}/builder-onboarding/${token}`;
  };

  const copyToClipboard = (token: string) => {
    const link = getInviteLink(token);
    navigator.clipboard.writeText(link);
    setCopiedToken(token);
    toast({
      title: "Copied to clipboard",
      description: "Invite link has been copied",
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
          <h2 className="text-3xl font-bold tracking-tight">Builder Invites</h2>
          <p className="text-muted-foreground">
            Generate private invite links for pre-vetted builders
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-invite">
              <Plus className="mr-2 h-4 w-4" />
              Generate Invite Link
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Builder Invite</DialogTitle>
              <DialogDescription>
                Create a private invite link for a pre-vetted builder to join the platform directly
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="builder@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  If provided, this email will be pre-filled in the onboarding form
                </p>
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Notes about this builder or invite..."
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
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invites</CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{invites?.length || 0}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Used</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invites?.filter((i) => i.used).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Successfully claimed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {invites?.filter((i) => !i.used && (!i.expiresAt || new Date(i.expiresAt) > new Date())).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Ready to use</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Invites</CardTitle>
          <CardDescription>
            Manage your builder invite links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Used By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invites && invites.length > 0 ? (
                invites.map((invite) => {
                  const isExpired = invite.expiresAt && new Date(invite.expiresAt) < new Date();
                  const isActive = !invite.used && !isExpired;

                  return (
                    <TableRow key={invite.id}>
                      <TableCell>
                        {invite.used ? (
                          <Badge variant="secondary">Used</Badge>
                        ) : isExpired ? (
                          <Badge variant="destructive">Expired</Badge>
                        ) : (
                          <Badge className="bg-chart-3 hover:bg-chart-3/80">Active</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {invite.email ? (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{invite.email}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm">{invite.createdByName}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(invite.createdAt)}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {invite.expiresAt ? formatDate(invite.expiresAt) : "Never"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {invite.used && invite.usedByName ? (
                          invite.usedByName
                        ) : (
                          <span className="text-muted-foreground text-xs">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {isActive && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(invite.token)}
                              data-testid={`button-copy-${invite.id}`}
                            >
                              {copiedToken === invite.token ? (
                                <>
                                  <Check className="mr-1 h-3 w-3" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="mr-1 h-3 w-3" />
                                  Copy Link
                                </>
                              )}
                            </Button>
                          )}
                          {!invite.used && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(invite.id, invite.email || undefined)}
                              data-testid={`button-revoke-${invite.id}`}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No invites yet. Create your first invite link to onboard pre-vetted builders.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
