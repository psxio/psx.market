import type { Express } from "express";
import { createServer, type Server } from "http";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { insertBuilderApplicationSchema, insertClientSchema } from "@shared/schema";
import { requireAdminAuth, requireClientAuth } from "./middleware/auth";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

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

  app.post("/api/wallet/verify", async (req, res) => {
    try {
      const { walletAddress } = req.body;
      
      if (!walletAddress || typeof walletAddress !== "string") {
        return res.status(400).json({ error: "Invalid wallet address" });
      }

      const mockPsxBalance = Math.random() > 0.3 ? 10000 : 500;
      const hasSufficientBalance = mockPsxBalance >= 1000;

      res.json({
        walletAddress,
        psxBalance: mockPsxBalance,
        hasSufficientBalance,
        tier: mockPsxBalance >= 20000 ? "platinum" : mockPsxBalance >= 10000 ? "gold" : mockPsxBalance >= 5000 ? "silver" : "bronze",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to verify wallet" });
    }
  });

  app.get("/api/wallet/balance/:address", async (req, res) => {
    try {
      const mockPsxBalance = Math.random() > 0.3 ? 10000 : 500;
      
      res.json({
        walletAddress: req.params.address,
        psxBalance: mockPsxBalance,
        hasSufficientBalance: mockPsxBalance >= 1000,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch balance" });
    }
  });

  app.post("/api/builder-applications", async (req, res) => {
    try {
      const validatedData = insertBuilderApplicationSchema.parse(req.body);
      
      const application = await storage.createBuilderApplication(validatedData);
      
      res.status(202).json({
        id: application.id,
        status: application.status,
        message: "Application submitted successfully. We'll review it within 2-3 business days.",
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid application data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to submit application" });
    }
  });

  app.get("/api/builder-applications/:id", async (req, res) => {
    try {
      const application = await storage.getBuilderApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch application" });
    }
  });

  app.post("/api/clients/register", async (req, res) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      
      const existingClient = await storage.getClientByWallet(validatedData.walletAddress);
      if (existingClient) {
        return res.status(400).json({ error: "Client with this wallet address already exists" });
      }

      const client = await storage.createClient(validatedData);
      
      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ error: "Session creation failed" });
        }

        req.session.clientId = client.id;

        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ error: "Session save failed" });
          }

          res.status(201).json({
            id: client.id,
            walletAddress: client.walletAddress,
            name: client.name,
            email: client.email,
            companyName: client.companyName,
            bio: client.bio,
            profileImage: client.profileImage,
            projectType: client.projectType,
            budgetRange: client.budgetRange,
            interestedCategories: client.interestedCategories,
            projectTimeline: client.projectTimeline,
            projectDescription: client.projectDescription,
            experienceLevel: client.experienceLevel,
            referralSource: client.referralSource,
            websiteUrl: client.websiteUrl,
            twitterHandle: client.twitterHandle,
            telegramHandle: client.telegramHandle,
            verified: client.verified,
            psxTier: client.psxTier,
          });
        });
      });
    } catch (error: any) {
      if (error.name === "ZodError") {
        return res.status(400).json({ error: "Invalid client data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to register client" });
    }
  });

  app.post("/api/clients/login", async (req, res) => {
    try {
      const { walletAddress } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }

      const client = await storage.getClientByWallet(walletAddress);
      if (!client) {
        return res.status(404).json({ error: "Client not found. Please register first." });
      }

      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ error: "Session creation failed" });
        }

        req.session.clientId = client.id;

        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ error: "Session save failed" });
          }

          res.json({
            id: client.id,
            walletAddress: client.walletAddress,
            name: client.name,
            email: client.email,
            companyName: client.companyName,
            bio: client.bio,
            profileImage: client.profileImage,
            verified: client.verified,
            psxTier: client.psxTier,
          });
        });
      });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/clients/me", requireClientAuth, async (req, res) => {
    try {
      const client = await storage.getClient(req.session.clientId!);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  app.put("/api/clients/me", requireClientAuth, async (req, res) => {
    try {
      const { walletAddress, ...updateData } = req.body;
      const client = await storage.updateClient(req.session.clientId!, updateData);
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  app.post("/api/clients/logout", requireClientAuth, async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.post("/api/orders", requireClientAuth, async (req, res) => {
    try {
      const orderData = {
        ...req.body,
        clientId: req.session.clientId!,
      };
      const order = await storage.createOrder(orderData);
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.get("/api/orders", async (_req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.get("/api/clients/me/orders", requireClientAuth, async (req, res) => {
    try {
      const orders = await storage.getOrdersByClient(req.session.clientId!);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/builders/:id/orders", async (req, res) => {
    try {
      const orders = await storage.getOrdersByBuilder(req.params.id);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.updateOrder(req.params.id, req.body);
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to update order" });
    }
  });

  app.post("/api/orders/:id/cancel", requireClientAuth, async (req, res) => {
    try {
      const { reason, refundAmount } = req.body;
      if (!reason) {
        return res.status(400).json({ error: "Cancellation reason required" });
      }
      const order = await storage.cancelOrder(req.params.id, reason, refundAmount);
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to cancel order" });
    }
  });

  app.get("/api/orders/:id/revisions", async (req, res) => {
    try {
      const revisions = await storage.getOrderRevisions(req.params.id);
      res.json(revisions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch revisions" });
    }
  });

  app.post("/api/orders/:id/revisions", requireClientAuth, async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      const revisions = await storage.getOrderRevisions(req.params.id);
      const revisionNumber = revisions.length + 1;

      const revisionData = {
        orderId: req.params.id,
        revisionNumber,
        requestedBy: req.session.clientId!,
        requestDetails: req.body.requestDetails,
      };

      const revision = await storage.createOrderRevision(revisionData);
      res.json(revision);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to create revision" });
    }
  });

  app.patch("/api/orders/:orderId/revisions/:id", async (req, res) => {
    try {
      const revision = await storage.updateOrderRevision(req.params.id, req.body);
      res.json(revision);
    } catch (error: any) {
      res.status(500).json({ error: error.message || "Failed to update revision" });
    }
  });

  app.get("/api/orders/:id/activities", async (req, res) => {
    try {
      const activities = await storage.getOrderActivities(req.params.id);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  app.post("/api/orders/:id/activities", async (req, res) => {
    try {
      const activityData = {
        orderId: req.params.id,
        ...req.body,
      };
      const activity = await storage.createOrderActivity(activityData);
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: "Failed to create activity" });
    }
  });

  app.post("/api/admin/login", loginLimiter, async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password required" });
      }

      const admin = await storage.verifyAdminPassword(username, password);
      if (!admin) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      await storage.updateLastLogin(username);

      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ error: "Session creation failed" });
        }

        req.session.adminId = admin.id;

        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ error: "Session save failed" });
          }

          res.json({
            id: admin.id,
            username: admin.username,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          });
        });
      });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/admin/builders", requireAdminAuth, async (_req, res) => {
    try {
      const builders = await storage.getBuilders();
      res.json(builders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch builders" });
    }
  });

  app.post("/api/admin/builders", requireAdminAuth, async (req, res) => {
    try {
      const builder = await storage.createBuilder(req.body);
      res.json(builder);
    } catch (error) {
      res.status(500).json({ error: "Failed to create builder" });
    }
  });

  app.put("/api/admin/builders/:id", requireAdminAuth, async (req, res) => {
    try {
      const builder = await storage.updateBuilder(req.params.id, req.body);
      res.json(builder);
    } catch (error) {
      res.status(500).json({ error: "Failed to update builder" });
    }
  });

  app.delete("/api/admin/builders/:id", requireAdminAuth, async (req, res) => {
    try {
      await storage.deleteBuilder(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete builder" });
    }
  });

  app.get("/api/admin/clients", requireAdminAuth, async (_req, res) => {
    try {
      const clients = await storage.getClients();
      res.json(clients);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.post("/api/admin/clients", requireAdminAuth, async (req, res) => {
    try {
      const client = await storage.createClient(req.body);
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: "Failed to create client" });
    }
  });

  app.put("/api/admin/clients/:id", requireAdminAuth, async (req, res) => {
    try {
      const client = await storage.updateClient(req.params.id, req.body);
      res.json(client);
    } catch (error) {
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  app.delete("/api/admin/clients/:id", requireAdminAuth, async (req, res) => {
    try {
      await storage.deleteClient(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete client" });
    }
  });

  app.get("/api/admin/services", requireAdminAuth, async (_req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.post("/api/admin/services", requireAdminAuth, async (req, res) => {
    try {
      const service = await storage.createService(req.body);
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to create service" });
    }
  });

  app.put("/api/admin/services/:id", requireAdminAuth, async (req, res) => {
    try {
      const service = await storage.updateService(req.params.id, req.body);
      res.json(service);
    } catch (error) {
      res.status(500).json({ error: "Failed to update service" });
    }
  });

  app.delete("/api/admin/services/:id", requireAdminAuth, async (req, res) => {
    try {
      await storage.deleteService(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  app.get("/api/admin/applications", requireAdminAuth, async (_req, res) => {
    try {
      const applications = await storage.getBuilderApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  app.put("/api/admin/applications/:id", requireAdminAuth, async (req, res) => {
    try {
      const application = await storage.updateBuilderApplication(req.params.id, req.body);
      res.json(application);
    } catch (error) {
      res.status(500).json({ error: "Failed to update application" });
    }
  });

  app.post("/api/admin/applications/:id/approve", requireAdminAuth, async (req, res) => {
    try {
      const builder = await storage.approveBuilderApplication(req.params.id);
      res.json(builder);
    } catch (error) {
      res.status(500).json({ error: "Failed to approve application" });
    }
  });

  app.delete("/api/admin/applications/:id", requireAdminAuth, async (req, res) => {
    try {
      await storage.deleteBuilderApplication(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete application" });
    }
  });

  app.get("/api/admin/referrals", requireAdminAuth, async (_req, res) => {
    try {
      const referrals = await storage.getReferrals();
      res.json(referrals);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch referrals" });
    }
  });

  app.post("/api/admin/referrals", requireAdminAuth, async (req, res) => {
    try {
      const referral = await storage.createReferral(req.body);
      res.json(referral);
    } catch (error) {
      res.status(500).json({ error: "Failed to create referral" });
    }
  });

  app.put("/api/admin/referrals/:id", requireAdminAuth, async (req, res) => {
    try {
      const referral = await storage.updateReferralStatus(req.params.id, req.body.status);
      res.json(referral);
    } catch (error) {
      res.status(500).json({ error: "Failed to update referral" });
    }
  });

  app.delete("/api/admin/referrals/:id", requireAdminAuth, async (req, res) => {
    try {
      await storage.deleteReferral(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete referral" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
