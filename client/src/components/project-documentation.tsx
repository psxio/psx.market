import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertProjectDocumentSchema } from "@shared/schema";
import type { ProjectDocument } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  ExternalLink,
  History,
  File,
  Image,
  Code
} from "lucide-react";
import { format } from "date-fns";

const formSchema = insertProjectDocumentSchema;

interface ProjectDocumentationProps {
  orderId: string;
  uploadedBy: string;
  uploaderType: string;
}

export function ProjectDocumentation({
  orderId,
  uploadedBy,
  uploaderType,
}: ProjectDocumentationProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery<ProjectDocument[]>({
    queryKey: ["/api/orders", orderId, "documents"],
    enabled: !!orderId,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderId,
      documentName: "",
      documentType: "general",
      documentUrl: "",
      fileSize: "0 KB",
      mimeType: "application/octet-stream",
      uploadedBy,
      uploaderType,
      description: "",
      category: "general",
      tags: [],
      isShared: true,
      accessLevel: "both",
      version: 1,
      previousVersionId: null,
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return await apiRequest("POST", `/api/orders/${orderId}/documents`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders", orderId, "documents"] });
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
      form.reset();
      setOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      return await apiRequest("DELETE", `/api/documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders", orderId, "documents"] });
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete document",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    uploadMutation.mutate(data);
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return Image;
    if (mimeType.includes("code") || mimeType.includes("text")) return Code;
    return File;
  };

  const getDocumentTypeColor = (type: string) => {
    switch (type) {
      case "contract":
        return "default";
      case "design":
        return "secondary";
      case "code":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Project Documents</h2>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-open-document-form">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload Project Document</DialogTitle>
              <DialogDescription>
                Upload important project files, contracts, or reference materials.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="documentName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Project Brief.pdf"
                          {...field}
                          data-testid="input-document-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="documentUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/document.pdf"
                          {...field}
                          data-testid="input-document-url"
                        />
                      </FormControl>
                      <FormDescription>
                        Link to your document (Google Drive, Dropbox, etc.)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="documentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-document-type">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="contract">Contract</SelectItem>
                            <SelectItem value="brief">Brief</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="code">Code</SelectItem>
                            <SelectItem value="reference">Reference</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || "general"}>
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="planning">Planning</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="development">Development</SelectItem>
                            <SelectItem value="legal">Legal</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of the document..."
                          rows={3}
                          {...field}
                          value={field.value || ""}
                          data-testid="input-document-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    data-testid="button-cancel-document"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={uploadMutation.isPending}
                    data-testid="button-submit-document"
                  >
                    {uploadMutation.isPending ? "Uploading..." : "Upload Document"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 p-4 border rounded-md animate-pulse">
              <div className="w-10 h-10 rounded bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="h-3 bg-muted rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No documents uploaded yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => {
            const FileIcon = getFileIcon(doc.mimeType);
            return (
              <div
                key={doc.id}
                className="flex items-center gap-4 p-4 border rounded-md hover-elevate"
                data-testid={`document-${doc.id}`}
              >
                <div className="flex-shrink-0 w-10 h-10 rounded bg-muted flex items-center justify-center">
                  <FileIcon className="w-5 h-5 text-muted-foreground" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium truncate" data-testid={`text-document-name-${doc.id}`}>
                      {doc.documentName}
                    </h3>
                    <Badge variant={getDocumentTypeColor(doc.documentType)}>
                      {doc.documentType}
                    </Badge>
                    {doc.version > 1 && (
                      <Badge variant="outline">
                        <History className="w-3 h-3 mr-1" />
                        v{doc.version}
                      </Badge>
                    )}
                  </div>
                  {doc.description && (
                    <p className="text-sm text-muted-foreground truncate">{doc.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span data-testid={`text-file-size-${doc.id}`}>{doc.fileSize}</span>
                    <span>•</span>
                    <time dateTime={doc.createdAt}>
                      {format(new Date(doc.createdAt), "MMM d, yyyy")}
                    </time>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    data-testid={`button-view-document-${doc.id}`}
                  >
                    <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(doc.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-document-${doc.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
