import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/categories", async (_req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const category = await storage.getCategory(req.params.slug);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch category" });
    }
  });

  app.get("/api/categories/:slug/services", async (req, res) => {
    try {
      const services = await storage.getServicesByCategory(req.params.slug);
      const servicesWithBuilders = await Promise.all(
        services.map(async (service) => {
          const builder = await storage.getBuilder(service.builderId);
          return { service, builder };
        })
      );
      res.json(servicesWithBuilders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/builders", async (_req, res) => {
    try {
      const builders = await storage.getBuilders();
      res.json(builders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch builders" });
    }
  });

  app.get("/api/builders/featured", async (_req, res) => {
    try {
      const builders = await storage.getFeaturedBuilders();
      res.json(builders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured builders" });
    }
  });

  app.get("/api/builders/:id", async (req, res) => {
    try {
      const builder = await storage.getBuilder(req.params.id);
      if (!builder) {
        return res.status(404).json({ error: "Builder not found" });
      }
      res.json(builder);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch builder" });
    }
  });

  app.get("/api/builders/:id/services", async (req, res) => {
    try {
      const services = await storage.getServicesByBuilder(req.params.id);
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/builders/:id/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviewsByBuilder(req.params.id);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch reviews" });
    }
  });

  app.get("/api/services", async (req, res) => {
    try {
      let services = await storage.getServices();
      
      const { search, categories, sortBy } = req.query;

      if (search && typeof search === "string") {
        const searchLower = search.toLowerCase();
        services = services.filter(
          (s) =>
            s.title.toLowerCase().includes(searchLower) ||
            s.description.toLowerCase().includes(searchLower) ||
            s.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
        );
      }

      if (categories && typeof categories === "string") {
        const categoryList = categories.split(",");
        services = services.filter((s) => categoryList.includes(s.category));
      }

      if (sortBy) {
        switch (sortBy) {
          case "price-low":
            services.sort(
              (a, b) => parseFloat(a.basicPrice) - parseFloat(b.basicPrice)
            );
            break;
          case "price-high":
            services.sort(
              (a, b) => parseFloat(b.basicPrice) - parseFloat(a.basicPrice)
            );
            break;
          default:
            break;
        }
      }

      const servicesWithBuilders = await Promise.all(
        services.map(async (service) => {
          const builder = await storage.getBuilder(service.builderId);
          return { service, builder };
        })
      );

      res.json(servicesWithBuilders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/services/featured", async (_req, res) => {
    try {
      const services = await storage.getFeaturedServices();
      const servicesWithBuilders = await Promise.all(
        services.map(async (service) => {
          const builder = await storage.getBuilder(service.builderId);
          return { service, builder };
        })
      );
      res.json(servicesWithBuilders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch featured services" });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch service" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
