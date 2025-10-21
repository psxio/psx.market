import type { Express } from "express";
import { createServer, type Server } from "http";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { insertBuilderApplicationSchema, insertClientSchema, insertMessageSchema, insertMessageAttachmentSchema } from "@shared/schema";
import { requireAdminAuth, requireClientAuth } from "./middleware/auth";
import { WebSocketServer, WebSocket } from "ws";

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

  app.get("/api/reviews/:id", async (req, res) => {
    try {
      const review = await storage.getReview(req.params.id);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch review" });
    }
  });

  app.post("/api/reviews", requireClientAuth, async (req, res) => {
    try {
      const clientId = (req.session as any).clientId;
      if (!clientId) {
        return res.status(401).json({ error: "Client not authenticated" });
      }

      const client = await storage.getClient(clientId);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      const reviewData = {
        ...req.body,
        clientId,
        clientName: client.name,
        clientWallet: client.walletAddress,
      };

      const review = await storage.createReview(reviewData);
      res.json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  app.post("/api/reviews/:id/response", async (req, res) => {
    try {
      const { response } = req.body;
      if (!response || typeof response !== "string") {
        return res.status(400).json({ error: "Response text is required" });
      }

      const review = await storage.addBuilderResponse(req.params.id, response);
      res.json(review);
    } catch (error) {
      console.error("Error adding builder response:", error);
      res.status(500).json({ error: "Failed to add response" });
    }
  });

  app.patch("/api/reviews/:id/status", requireAdminAuth, async (req, res) => {
    try {
      const adminId = (req.session as any).adminId;
      if (!adminId) {
        return res.status(401).json({ error: "Admin not authenticated" });
      }

      const { status, notes } = req.body;
      if (!status || typeof status !== "string") {
        return res.status(400).json({ error: "Status is required" });
      }

      const review = await storage.updateReviewStatus(
        req.params.id,
        status,
        adminId,
        notes
      );
      res.json(review);
    } catch (error) {
      console.error("Error updating review status:", error);
      res.status(500).json({ error: "Failed to update review status" });
    }
  });

  app.post("/api/reviews/:id/vote", requireClientAuth, async (req, res) => {
    try {
      const clientId = (req.session as any).clientId;
      if (!clientId) {
        return res.status(401).json({ error: "Client not authenticated" });
      }

      const { voteType } = req.body;
      if (!voteType || (voteType !== "helpful" && voteType !== "not_helpful")) {
        return res.status(400).json({ error: "Invalid vote type" });
      }

      const existingVote = await storage.getReviewVote(req.params.id, clientId);
      if (existingVote) {
        if (existingVote.voteType === voteType) {
          return res.status(400).json({ error: "You have already voted this way" });
        }
        await storage.deleteReviewVote(req.params.id, clientId);
      }

      const vote = await storage.createReviewVote({
        reviewId: req.params.id,
        voterId: clientId,
        voterType: "client",
        voteType,
      });

      const updatedReview = await storage.getReview(req.params.id);
      res.json({ vote, review: updatedReview });
    } catch (error) {
      console.error("Error voting on review:", error);
      res.status(500).json({ error: "Failed to vote on review" });
    }
  });

  app.delete("/api/reviews/:id/vote", requireClientAuth, async (req, res) => {
    try {
      const clientId = (req.session as any).clientId;
      if (!clientId) {
        return res.status(401).json({ error: "Client not authenticated" });
      }

      await storage.deleteReviewVote(req.params.id, clientId);
      const updatedReview = await storage.getReview(req.params.id);
      res.json({ review: updatedReview });
    } catch (error) {
      console.error("Error removing vote:", error);
      res.status(500).json({ error: "Failed to remove vote" });
    }
  });

  app.post("/api/reviews/:id/dispute", requireClientAuth, async (req, res) => {
    try {
      const clientId = (req.session as any).clientId;
      if (!clientId) {
        return res.status(401).json({ error: "Client not authenticated" });
      }

      const review = await storage.getReview(req.params.id);
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }

      const existingDispute = await storage.getReviewDispute(req.params.id);
      if (existingDispute) {
        return res.status(400).json({ error: "This review already has a dispute" });
      }

      const { reason, disputedBy, evidence } = req.body;
      if (!reason || !disputedBy) {
        return res.status(400).json({ error: "Reason and disputedBy are required" });
      }

      const dispute = await storage.createReviewDispute({
        reviewId: req.params.id,
        disputedBy,
        reason,
        evidence: evidence || null,
      });

      res.json(dispute);
    } catch (error) {
      console.error("Error creating dispute:", error);
      res.status(500).json({ error: "Failed to create dispute" });
    }
  });

  app.get("/api/reviews/disputes", requireAdminAuth, async (_req, res) => {
    try {
      const disputes = await storage.getReviewDisputes();
      const disputesWithReviews = await Promise.all(
        disputes.map(async (dispute) => {
          const review = await storage.getReview(dispute.reviewId);
          return { ...dispute, review };
        })
      );
      res.json(disputesWithReviews);
    } catch (error) {
      console.error("Error fetching disputes:", error);
      res.status(500).json({ error: "Failed to fetch disputes" });
    }
  });

  app.patch("/api/reviews/disputes/:id/resolve", requireAdminAuth, async (req, res) => {
    try {
      const adminId = (req.session as any).adminId;
      if (!adminId) {
        return res.status(401).json({ error: "Admin not authenticated" });
      }

      const { resolution } = req.body;
      if (!resolution || typeof resolution !== "string") {
        return res.status(400).json({ error: "Resolution is required" });
      }

      const dispute = await storage.resolveReviewDispute(
        req.params.id,
        resolution,
        adminId
      );
      res.json(dispute);
    } catch (error) {
      console.error("Error resolving dispute:", error);
      res.status(500).json({ error: "Failed to resolve dispute" });
    }
  });

  app.get("/api/builders/:id/projects", async (req, res) => {
    try {
      const projects = await storage.getBuilderProjects(req.params.id);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
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

  app.post("/api/payments", async (req, res) => {
    try {
      const platformFeePercentage = Number(req.body.platformFeePercentage) || 2.5;
      const amount = Number(req.body.amount);
      const platformFee = (amount * platformFeePercentage) / 100;
      const builderAmount = amount - platformFee;

      const payment = await storage.createPayment({
        ...req.body,
        platformFee: platformFee.toString(),
        platformFeePercentage: platformFeePercentage.toString(),
        builderAmount: builderAmount.toString(),
      });

      const invoiceNumber = `INV-${Date.now()}-${payment.id.slice(0, 8).toUpperCase()}`;
      const invoice = await storage.createInvoice({
        invoiceNumber,
        paymentId: payment.id,
        orderId: payment.orderId,
        clientId: payment.clientId,
        builderId: payment.builderId,
        amount: payment.amount,
        platformFee: payment.platformFee,
        builderAmount: payment.builderAmount,
        billingEmail: req.body.payerEmail,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });

      res.json({ payment, invoice });
    } catch (error) {
      res.status(500).json({ error: "Failed to create payment" });
    }
  });

  app.get("/api/payments", async (_req, res) => {
    try {
      const payments = await storage.getPayments();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  app.get("/api/payments/:id", async (req, res) => {
    try {
      const payment = await storage.getPayment(req.params.id);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payment" });
    }
  });

  app.get("/api/orders/:orderId/payments", async (req, res) => {
    try {
      const payments = await storage.getPaymentsByOrder(req.params.orderId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  app.get("/api/clients/:clientId/payments", async (req, res) => {
    try {
      const payments = await storage.getPaymentsByClient(req.params.clientId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  app.get("/api/builders/:builderId/payments", async (req, res) => {
    try {
      const payments = await storage.getPaymentsByBuilder(req.params.builderId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  app.patch("/api/payments/:id", async (req, res) => {
    try {
      const payment = await storage.updatePayment(req.params.id, req.body);
      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: "Failed to update payment" });
    }
  });

  app.post("/api/payments/:id/confirm", async (req, res) => {
    try {
      const { transactionHash, blockNumber } = req.body;
      const payment = await storage.updatePayment(req.params.id, {
        status: "completed",
        transactionHash,
        blockNumber,
        paidAt: new Date().toISOString(),
      });

      const invoice = await storage.getInvoiceByPayment(payment.id);
      if (invoice) {
        await storage.updateInvoice(invoice.id, {
          status: "paid",
          paidAt: new Date().toISOString(),
        });
      }

      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: "Failed to confirm payment" });
    }
  });

  app.post("/api/milestone-payments", async (req, res) => {
    try {
      const milestonePayment = await storage.createMilestonePayment(req.body);
      res.json(milestonePayment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create milestone payment" });
    }
  });

  app.get("/api/payments/:paymentId/milestones", async (req, res) => {
    try {
      const milestonePayments = await storage.getMilestonePaymentsByPayment(req.params.paymentId);
      res.json(milestonePayments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch milestone payments" });
    }
  });

  app.get("/api/orders/:orderId/milestone-payments", async (req, res) => {
    try {
      const milestonePayments = await storage.getMilestonePaymentsByOrder(req.params.orderId);
      res.json(milestonePayments);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch milestone payments" });
    }
  });

  app.post("/api/milestone-payments/:id/release", async (req, res) => {
    try {
      const { transactionHash } = req.body;
      const milestonePayment = await storage.releaseMilestonePayment(req.params.id, transactionHash);
      res.json(milestonePayment);
    } catch (error) {
      res.status(500).json({ error: "Failed to release milestone payment" });
    }
  });

  app.post("/api/payouts", async (req, res) => {
    try {
      const payout = await storage.createPayout(req.body);
      res.json(payout);
    } catch (error) {
      res.status(500).json({ error: "Failed to create payout" });
    }
  });

  app.get("/api/payouts", async (_req, res) => {
    try {
      const payouts = await storage.getPayouts();
      res.json(payouts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payouts" });
    }
  });

  app.get("/api/builders/:builderId/payouts", async (req, res) => {
    try {
      const payouts = await storage.getPayoutsByBuilder(req.params.builderId);
      res.json(payouts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch payouts" });
    }
  });

  app.post("/api/payouts/:id/process", async (req, res) => {
    try {
      const { transactionHash } = req.body;
      const payout = await storage.processPayout(req.params.id, transactionHash);
      res.json(payout);
    } catch (error) {
      res.status(500).json({ error: "Failed to process payout" });
    }
  });

  app.post("/api/disputes", async (req, res) => {
    try {
      const dispute = await storage.createDispute(req.body);
      res.json(dispute);
    } catch (error) {
      res.status(500).json({ error: "Failed to create dispute" });
    }
  });

  app.get("/api/disputes", async (_req, res) => {
    try {
      const disputes = await storage.getDisputes();
      res.json(disputes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch disputes" });
    }
  });

  app.get("/api/orders/:orderId/disputes", async (req, res) => {
    try {
      const disputes = await storage.getDisputesByOrder(req.params.orderId);
      res.json(disputes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch disputes" });
    }
  });

  app.post("/api/disputes/:id/resolve", async (req, res) => {
    try {
      const { resolution, resolvedBy, refundAmount } = req.body;
      const dispute = await storage.resolveDispute(req.params.id, resolution, resolvedBy, refundAmount);
      res.json(dispute);
    } catch (error) {
      res.status(500).json({ error: "Failed to resolve dispute" });
    }
  });

  app.post("/api/refunds", async (req, res) => {
    try {
      const refund = await storage.createRefund(req.body);
      res.json(refund);
    } catch (error) {
      res.status(500).json({ error: "Failed to create refund" });
    }
  });

  app.get("/api/refunds", async (_req, res) => {
    try {
      const refunds = await storage.getRefunds();
      res.json(refunds);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch refunds" });
    }
  });

  app.get("/api/orders/:orderId/refunds", async (req, res) => {
    try {
      const refunds = await storage.getRefundsByOrder(req.params.orderId);
      res.json(refunds);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch refunds" });
    }
  });

  app.post("/api/refunds/:id/process", async (req, res) => {
    try {
      const { transactionHash } = req.body;
      const refund = await storage.processRefund(req.params.id, transactionHash);
      res.json(refund);
    } catch (error) {
      res.status(500).json({ error: "Failed to process refund" });
    }
  });

  app.get("/api/invoices", async (_req, res) => {
    try {
      const invoices = await storage.getInvoices();
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoices" });
    }
  });

  app.get("/api/invoices/:id", async (req, res) => {
    try {
      const invoice = await storage.getInvoice(req.params.id);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoice" });
    }
  });

  app.get("/api/clients/:clientId/invoices", async (req, res) => {
    try {
      const invoices = await storage.getInvoicesByClient(req.params.clientId);
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoices" });
    }
  });

  app.get("/api/builders/:builderId/invoices", async (req, res) => {
    try {
      const invoices = await storage.getInvoicesByBuilder(req.params.builderId);
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch invoices" });
    }
  });

  app.patch("/api/invoices/:id", async (req, res) => {
    try {
      const invoice = await storage.updateInvoice(req.params.id, req.body);
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: "Failed to update invoice" });
    }
  });

  app.get("/api/chat/threads", async (req, res) => {
    try {
      const { userId, userType } = req.query;
      
      if (!userId || !userType) {
        return res.status(400).json({ error: "userId and userType are required" });
      }

      const threads = userType === "client" 
        ? await storage.getChatThreadsByClient(userId as string)
        : await storage.getChatThreadsByBuilder(userId as string);

      const threadsWithDetails = await Promise.all(
        threads.map(async (thread) => {
          const builder = await storage.getBuilder(thread.builderId);
          const client = await storage.getClient(thread.clientId);
          const order = thread.orderId ? await storage.getOrder(thread.orderId) : null;
          
          return {
            ...thread,
            builder,
            client,
            order,
          };
        })
      );

      res.json(threadsWithDetails);
    } catch (error) {
      console.error("Failed to fetch chat threads:", error);
      res.status(500).json({ error: "Failed to fetch chat threads" });
    }
  });

  app.get("/api/chat/threads/:threadId", async (req, res) => {
    try {
      const thread = await storage.getChatThread(req.params.threadId);
      if (!thread) {
        return res.status(404).json({ error: "Thread not found" });
      }

      const builder = await storage.getBuilder(thread.builderId);
      const client = await storage.getClient(thread.clientId);
      const order = thread.orderId ? await storage.getOrder(thread.orderId) : null;

      res.json({ ...thread, builder, client, order });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch thread" });
    }
  });

  app.post("/api/chat/threads", async (req, res) => {
    try {
      const { clientId, builderId, orderId } = req.body;
      
      if (!clientId || !builderId) {
        return res.status(400).json({ error: "clientId and builderId are required" });
      }

      const thread = await storage.findOrCreateChatThread(clientId, builderId, orderId);
      const builder = await storage.getBuilder(thread.builderId);
      const client = await storage.getClient(thread.clientId);
      const order = thread.orderId ? await storage.getOrder(thread.orderId) : null;

      res.json({ ...thread, builder, client, order });
    } catch (error) {
      console.error("Failed to create thread:", error);
      res.status(500).json({ error: "Failed to create thread" });
    }
  });

  app.patch("/api/chat/threads/:threadId/archive", async (req, res) => {
    try {
      const { userType } = req.body;
      const thread = await storage.archiveChatThread(req.params.threadId, userType);
      res.json(thread);
    } catch (error) {
      res.status(500).json({ error: "Failed to archive thread" });
    }
  });

  app.post("/api/chat/threads/:threadId/mark-read", async (req, res) => {
    try {
      const { readerId, readerType } = req.body;
      await storage.markThreadAsRead(req.params.threadId, readerId, readerType);
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to mark thread as read:", error);
      res.status(500).json({ error: "Failed to mark thread as read" });
    }
  });

  app.get("/api/chat/threads/:threadId/messages", async (req, res) => {
    try {
      const messages = await storage.getMessagesByThread(req.params.threadId);
      
      const messagesWithAttachments = await Promise.all(
        messages.map(async (message) => {
          const attachments = await storage.getMessageAttachmentsByMessage(message.id);
          return { ...message, attachments };
        })
      );

      res.json(messagesWithAttachments);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/chat/messages", async (req, res) => {
    try {
      const result = insertMessageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
      }

      const message = await storage.createMessage(result.data);
      const attachments: any[] = [];

      res.json({ ...message, attachments });
    } catch (error) {
      console.error("Failed to create message:", error);
      res.status(500).json({ error: "Failed to create message" });
    }
  });

  app.patch("/api/chat/messages/:messageId", async (req, res) => {
    try {
      const { content } = req.body;
      const message = await storage.updateMessage(req.params.messageId, { content });
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to update message" });
    }
  });

  app.delete("/api/chat/messages/:messageId", async (req, res) => {
    try {
      const message = await storage.deleteMessage(req.params.messageId);
      res.json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to delete message" });
    }
  });

  app.post("/api/chat/messages/:messageId/attachments", async (req, res) => {
    try {
      const result = insertMessageAttachmentSchema.safeParse({
        ...req.body,
        messageId: req.params.messageId,
      });
      
      if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
      }

      const attachment = await storage.createMessageAttachment(result.data);
      res.json(attachment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create attachment" });
    }
  });

  const httpServer = createServer(app);

  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  interface WSClient extends WebSocket {
    userId?: string;
    userType?: string;
    threadId?: string;
  }

  wss.on("connection", (ws: WSClient, req) => {
    console.log("WebSocket client connected");

    ws.on("message", async (data) => {
      try {
        const message = JSON.parse(data.toString());

        switch (message.type) {
          case "auth":
            ws.userId = message.userId;
            ws.userType = message.userType;
            ws.threadId = message.threadId;
            ws.send(JSON.stringify({ type: "auth_success" }));
            break;

          case "message":
            const newMessage = await storage.createMessage({
              threadId: message.threadId,
              senderId: message.senderId,
              senderType: message.senderType,
              content: message.content,
              messageType: message.messageType || "text",
              replyToId: message.replyToId || null,
            });

            const attachments = await storage.getMessageAttachmentsByMessage(newMessage.id);
            const messageWithAttachments = { ...newMessage, attachments };

            wss.clients.forEach((client: WebSocket) => {
              const wsClient = client as WSClient;
              if (
                wsClient.readyState === WebSocket.OPEN &&
                wsClient.threadId === message.threadId
              ) {
                wsClient.send(
                  JSON.stringify({
                    type: "message",
                    data: messageWithAttachments,
                  })
                );
              }
            });
            break;

          case "typing":
            wss.clients.forEach((client: WebSocket) => {
              const wsClient = client as WSClient;
              if (
                wsClient.readyState === WebSocket.OPEN &&
                wsClient.threadId === message.threadId &&
                wsClient.userId !== message.userId
              ) {
                wsClient.send(
                  JSON.stringify({
                    type: "typing",
                    userId: message.userId,
                    userType: message.userType,
                  })
                );
              }
            });
            break;

          case "read_receipt":
            await storage.createMessageReadReceipt({
              messageId: message.messageId,
              threadId: message.threadId,
              readerId: message.readerId,
              readerType: message.readerType,
            });

            wss.clients.forEach((client: WebSocket) => {
              const wsClient = client as WSClient;
              if (
                wsClient.readyState === WebSocket.OPEN &&
                wsClient.threadId === message.threadId
              ) {
                wsClient.send(
                  JSON.stringify({
                    type: "read_receipt",
                    messageId: message.messageId,
                    readerId: message.readerId,
                  })
                );
              }
            });
            break;
        }
      } catch (error) {
        console.error("WebSocket message error:", error);
        ws.send(JSON.stringify({ type: "error", error: "Failed to process message" }));
      }
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
    });
  });

  return httpServer;
}
