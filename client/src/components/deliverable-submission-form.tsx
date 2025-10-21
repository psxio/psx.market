import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { insertProjectDeliverableSchema } from "@shared/schema";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Upload, Plus, X } from "lucide-react";

const formSchema = insertProjectDeliverableSchema.extend({
  fileUrls: z.array(z.string()).optional(),
  previewUrls: z.array(z.string()).optional(),
  fileNames: z.array(z.string()).optional(),
  fileSizes: z.array(z.string()).optional(),
});

interface DeliverableSubmissionFormProps {
  orderId: string;
  milestoneId?: string;
  submittedBy: string;
  trigger?: React.ReactNode;
}

export function DeliverableSubmissionForm({
  orderId,
  milestoneId,
  submittedBy,
  trigger,
}: DeliverableSubmissionFormProps) {
  const [open, setOpen] = useState(false);
  const [fileInputs, setFileInputs] = useState<string[]>([""]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderId,
      milestoneId: milestoneId || null,
      title: "",
      description: "",
      deliveryType: "file",
      submittedBy,
      fileUrls: [],
      previewUrls: [],
      fileNames: [],
      fileSizes: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return await apiRequest("POST", `/api/orders/${orderId}/deliverables`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders", orderId, "deliverables"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders", orderId] });
      toast({
        title: "Success",
        description: "Deliverable submitted successfully",
      });
      form.reset();
      setFileInputs([""]);
      setOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit deliverable",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const fileUrls = fileInputs.filter((url) => url.trim() !== "");
    createMutation.mutate({
      ...data,
      fileUrls: fileUrls.length > 0 ? fileUrls : [],
    });
  };

  const addFileInput = () => {
    setFileInputs([...fileInputs, ""]);
  };

  const removeFileInput = (index: number) => {
    const newInputs = fileInputs.filter((_, i) => i !== index);
    setFileInputs(newInputs);
  };

  const updateFileInput = (index: number, value: string) => {
    const newInputs = [...fileInputs];
    newInputs[index] = value;
    setFileInputs(newInputs);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button data-testid="button-open-deliverable-form">
            <Upload className="w-4 h-4 mr-2" />
            Submit Deliverable
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Deliverable</DialogTitle>
          <DialogDescription>
            Submit your completed work or milestone deliverable for client review.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Initial Design Mockups"
                      {...field}
                      data-testid="input-deliverable-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what you're delivering and any important notes..."
                      rows={4}
                      {...field}
                      data-testid="input-deliverable-description"
                    />
                  </FormControl>
                  <FormDescription>
                    Provide details about the deliverable and what the client should review
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-delivery-type">
                        <SelectValue placeholder="Select delivery type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="file">File/Document</SelectItem>
                      <SelectItem value="link">External Link</SelectItem>
                      <SelectItem value="code">Code Repository</SelectItem>
                      <SelectItem value="demo">Demo/Preview</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormLabel>Files & Links</FormLabel>
              <FormDescription>
                Add URLs to your deliverables (e.g., Dropbox, Google Drive, GitHub, Figma, etc.)
              </FormDescription>
              
              {fileInputs.map((fileUrl, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="https://example.com/deliverable.zip"
                    value={fileUrl}
                    onChange={(e) => updateFileInput(index, e.target.value)}
                    data-testid={`input-file-url-${index}`}
                  />
                  {fileInputs.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFileInput(index)}
                      data-testid={`button-remove-file-${index}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFileInput}
                data-testid="button-add-file"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Another File
              </Button>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-testid="button-cancel-deliverable"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                data-testid="button-submit-deliverable"
              >
                {createMutation.isPending ? "Submitting..." : "Submit Deliverable"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
