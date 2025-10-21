import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { insertProgressUpdateSchema } from "@shared/schema";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { TrendingUp, Plus, X } from "lucide-react";

const formSchema = insertProgressUpdateSchema.extend({
  attachmentUrls: z.array(z.string()).optional(),
  attachmentNames: z.array(z.string()).optional(),
});

interface ProgressUpdateFormProps {
  orderId: string;
  builderId: string;
  trigger?: React.ReactNode;
}

export function ProgressUpdateForm({
  orderId,
  builderId,
  trigger,
}: ProgressUpdateFormProps) {
  const [open, setOpen] = useState(false);
  const [attachmentInputs, setAttachmentInputs] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderId,
      builderId,
      title: "",
      description: "",
      progressPercentage: 0,
      milestone: "",
      nextSteps: "",
      blockers: "",
      isVisible: true,
      attachmentUrls: [],
      attachmentNames: [],
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return await apiRequest("POST", `/api/orders/${orderId}/progress`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders", orderId, "progress"] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders", orderId] });
      toast({
        title: "Success",
        description: "Progress update posted successfully",
      });
      form.reset();
      setAttachmentInputs([]);
      setOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post progress update",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const attachmentUrls = attachmentInputs.filter((url) => url.trim() !== "");
    createMutation.mutate({
      ...data,
      attachmentUrls: attachmentUrls.length > 0 ? attachmentUrls : [],
    });
  };

  const addAttachmentInput = () => {
    setAttachmentInputs([...attachmentInputs, ""]);
  };

  const removeAttachmentInput = (index: number) => {
    const newInputs = attachmentInputs.filter((_, i) => i !== index);
    setAttachmentInputs(newInputs);
  };

  const updateAttachmentInput = (index: number, value: string) => {
    const newInputs = [...attachmentInputs];
    newInputs[index] = value;
    setAttachmentInputs(newInputs);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button data-testid="button-open-progress-form">
            <TrendingUp className="w-4 h-4 mr-2" />
            Post Progress Update
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post Progress Update</DialogTitle>
          <DialogDescription>
            Keep your client informed about your progress on the project.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Update Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Completed Design Phase"
                      {...field}
                      data-testid="input-progress-title"
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
                      placeholder="Describe what you've accomplished, what you're working on, and what's coming next..."
                      rows={4}
                      {...field}
                      data-testid="input-progress-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="progressPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Progress Percentage</FormLabel>
                  <FormControl>
                    <div className="space-y-3">
                      <Slider
                        min={0}
                        max={100}
                        step={5}
                        value={[field.value || 0]}
                        onValueChange={(value) => field.onChange(value[0])}
                        data-testid="slider-progress-percentage"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">0%</span>
                        <span className="text-lg font-bold text-primary" data-testid="text-progress-value">
                          {field.value}%
                        </span>
                        <span className="text-sm text-muted-foreground">100%</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Overall project completion percentage
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="milestone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Milestone (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Phase 2: Development"
                      {...field}
                      value={field.value || ""}
                      data-testid="input-milestone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nextSteps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Next Steps (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What are you planning to work on next?"
                      rows={2}
                      {...field}
                      value={field.value || ""}
                      data-testid="input-next-steps"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="blockers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blockers/Issues (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any issues or blockers that need attention?"
                      rows={2}
                      {...field}
                      value={field.value || ""}
                      data-testid="input-blockers"
                    />
                  </FormControl>
                  <FormDescription>
                    Let the client know if you need anything to continue
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {attachmentInputs.length > 0 && (
              <div className="space-y-3">
                <FormLabel>Attachments</FormLabel>
                
                {attachmentInputs.map((attachmentUrl, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="https://example.com/screenshot.png"
                      value={attachmentUrl}
                      onChange={(e) => updateAttachmentInput(index, e.target.value)}
                      data-testid={`input-attachment-url-${index}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAttachmentInput(index)}
                      data-testid={`button-remove-attachment-${index}`}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addAttachmentInput}
              data-testid="button-add-attachment"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Attachment
            </Button>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-testid="button-cancel-progress"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                data-testid="button-submit-progress"
              >
                {createMutation.isPending ? "Posting..." : "Post Update"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
