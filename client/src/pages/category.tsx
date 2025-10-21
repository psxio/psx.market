import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Header } from "@/components/header";
import { BuilderCard } from "@/components/builder-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import type { Builder, Service, Category } from "@shared/schema";

export default function CategoryPage() {
  const [, params] = useRoute("/category/:slug");
  const categorySlug = params?.slug;

  const { data: category, isLoading: categoryLoading } = useQuery<Category>({
    queryKey: ["/api/categories", categorySlug],
    enabled: !!categorySlug,
  });

  const { data: servicesData, isLoading: servicesLoading } = useQuery<
    Array<{ builder: Builder; service: Service }>
  >({
    queryKey: ["/api/categories", categorySlug, "services"],
    enabled: !!categorySlug,
  });

  if (categoryLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold">Category not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="border-b bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
          <div className="space-y-4">
            <Badge variant="secondary" className="w-fit">
              {category.builderCount} Builders
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl" data-testid="text-category-name">
              {category.name}
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        {servicesLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-[280px] w-full" />
            ))}
          </div>
        ) : servicesData && servicesData.length > 0 ? (
          <>
            <div className="mb-6 text-sm text-muted-foreground">
              {servicesData.length} services available
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {servicesData.map(({ builder, service }) => (
                <BuilderCard
                  key={service.id}
                  builder={builder}
                  service={service}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
            <h3 className="mb-2 text-lg font-semibold">No services yet</h3>
            <p className="text-sm text-muted-foreground">
              Check back soon for builders in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
