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
import { CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { BuilderApplication } from "@shared/schema";

export default function AdminApplications() {
  const { toast } = useToast();
  const { data: applications, isLoading } = useQuery<BuilderApplication[]>({ 
    queryKey: ["/api/admin/applications"] 
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("POST", `/api/admin/applications/${id}/approve`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/builders"] });
      toast({
        title: "Application approved",
        description: "Builder has been added to the platform",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/applications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/applications"] });
      toast({
        title: "Application denied",
        description: "The application has been removed",
      });
    },
    onError: () => {
      toast({
        title: "Failed to deny application",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (id: string) => {
    if (confirm("Approve this builder application?")) {
      approveMutation.mutate(id);
    }
  };

  const handleReject = (id: string) => {
    if (confirm("Deny this builder application? This will permanently delete it.")) {
      rejectMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Builder Applications</h2>
        <p className="text-muted-foreground">
          Review and approve new builder applications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Applications ({applications?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications && applications.length > 0 ? (
                applications.map((app) => (
                  <TableRow key={app.id} data-testid={`row-application-${app.id}`}>
                    <TableCell className="font-medium">{app.name}</TableCell>
                    <TableCell>{app.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{app.category}</Badge>
                    </TableCell>
                    <TableCell>
                      {app.status === "pending" && (
                        <Badge variant="secondary">Pending</Badge>
                      )}
                      {app.status === "approved" && (
                        <Badge>Approved</Badge>
                      )}
                      {app.status === "rejected" && (
                        <Badge variant="destructive">Rejected</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(app.submittedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {app.status === "pending" && (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleApprove(app.id)}
                            data-testid={`button-approve-${app.id}`}
                          >
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleReject(app.id)}
                            data-testid={`button-reject-${app.id}`}
                          >
                            <XCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No applications yet
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
