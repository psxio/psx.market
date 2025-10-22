import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import type { Service, Builder } from "@shared/schema";

const serviceFormSchema = z.object({
  builderId: z.string().optional(),
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  deliveryTime: z.string().min(1, "Delivery time is required"),
  basicPrice: z.string().min(1, "Basic price is required"),
  standardPrice: z.string().optional(),
  premiumPrice: z.string().optional(),
  basicDescription: z.string().min(10, "Basic tier description is required"),
  standardDescription: z.string().optional(),
  premiumDescription: z.string().optional(),
  psxRequired: z.string().min(1, "PSX requirement is required"),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

type ServiceFormValues = z.infer<typeof serviceFormSchema>;

export default function AdminServices() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: services, isLoading } = useQuery<Service[]>({ 
    queryKey: ["/api/admin/services"] 
  });

  const { data: builders } = useQuery<Builder[]>({ 
    queryKey: ["/api/admin/builders"] 
  });

  const form = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      builderId: "",
      title: "",
      description: "",
      category: "",
      deliveryTime: "3-5 days",
      basicPrice: "",
      standardPrice: "",
      premiumPrice: "",
      basicDescription: "",
      standardDescription: "",
      premiumDescription: "",
      psxRequired: "1000",
      featured: false,
      active: true,
    },
  });

  const createServiceMutation = useMutation({
    mutationFn: async (data: ServiceFormValues) => {
      const response = await apiRequest("POST", "/api/admin/services", {
        ...data,
        basicPrice: data.basicPrice,
        standardPrice: data.standardPrice || undefined,
        premiumPrice: data.premiumPrice || undefined,
        psxRequired: data.psxRequired,
        basicDeliverables: [],
        standardDeliverables: [],
        premiumDeliverables: [],
        tags: [],
        portfolioMedia: [],
        videoUrls: [],
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      setIsAddDialogOpen(false);
      form.reset();
      toast({
        title: "Service Created",
        description: "The service has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Create Service",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (serviceId: string) => {
      await apiRequest("DELETE", `/api/admin/services/${serviceId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/services"] });
      toast({
        title: "Service Deleted",
        description: "The service has been removed.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to Delete Service",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ServiceFormValues) => {
    createServiceMutation.mutate(data);
  };

  const categories = [
    "KOLs & Influencers",
    "3D Content Creation",
    "Marketing & Growth",
    "Script Development",
    "Volume Services",
  ];

  if (isLoading) {
    return <div>Loading services...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Services</h2>
          <p className="text-muted-foreground">
            Manage all services on the platform
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} data-testid="button-add-service">
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Services ({services?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Builder</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price Range</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services?.map((service) => {
                const builder = builders?.find(b => b.id === service.builderId);
                return (
                  <TableRow key={service.id} data-testid={`row-service-${service.id}`}>
                    <TableCell className="font-medium">{service.title}</TableCell>
                    <TableCell>{builder?.name || "Unknown"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{service.category}</Badge>
                    </TableCell>
                    <TableCell>
                      ${service.basicPrice}
                      {service.premiumPrice && ` - $${service.premiumPrice}`}
                    </TableCell>
                    <TableCell>{service.deliveryTime}</TableCell>
                    <TableCell>
                      <Badge variant={service.active ? "default" : "secondary"}>
                        {service.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteServiceMutation.mutate(service.id)}
                        data-testid={`button-delete-service-${service.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Service</DialogTitle>
            <DialogDescription>
              Create a new service for a builder on the platform
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="builderId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Builder (Optional - can be assigned later)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-builder">
                          <SelectValue placeholder="No builder assigned" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {builders?.map((builder) => (
                          <SelectItem key={builder.id} value={builder.id}>
                            {builder.name} ({builder.category})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Leave unassigned to create a service template, or select a builder now
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Twitter Campaign Package" {...field} data-testid="input-title" />
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
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe what this service offers..."
                        {...field}
                        data-testid="textarea-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deliveryTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Time *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 3-5 days" {...field} data-testid="input-delivery-time" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold">Pricing Tiers</h3>
                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    control={form.control}
                    name="basicPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Basic Price *</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="100" {...field} data-testid="input-basic-price" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="standardPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Standard Price</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="200" {...field} data-testid="input-standard-price" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="premiumPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Premium Price</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="500" {...field} data-testid="input-premium-price" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="basicDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Basic Tier Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What's included in the basic tier..."
                        {...field}
                        data-testid="textarea-basic-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="psxRequired"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PSX Required *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1000" {...field} data-testid="input-psx-required" />
                    </FormControl>
                    <FormDescription>
                      Minimum PSX tokens required to access this service
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-featured"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Featured Service</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-active"
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Active</FormLabel>
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createServiceMutation.isPending}
                  data-testid="button-submit"
                >
                  {createServiceMutation.isPending ? "Creating..." : "Create Service"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
