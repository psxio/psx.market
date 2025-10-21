import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Builder } from "@shared/schema";

export default function AdminBuilders() {
  const { toast } = useToast();
  const { data: builders, isLoading } = useQuery<Builder[]>({ 
    queryKey: ["/api/admin/builders"] 
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

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this builder?")) {
      deleteMutation.mutate(id);
    }
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
        <Button data-testid="button-add-builder">
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
    </div>
  );
}
