import type { Express } from "express";
import { createServer, type Server } from "http";
import rateLimit from "express-rate-limit";
import { storage } from "./storage";
import { 
  insertBuilderApplicationSchema, 
  insertClientSchema, 
  insertMessageSchema, 
  insertMessageAttachmentSchema,
  insertProjectDeliverableSchema,
  insertProgressUpdateSchema,
  insertProjectDocumentSchema,
} from "@shared/schema";
import { requireAdminAuth, requireClientAuth } from "./middleware/auth";
import { WebSocketServer, WebSocket } from "ws";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { ObjectPermission } from "./objectAcl";

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

  app.get("/api/builders", async (req, res) => {
    try {
      let builders = await storage.getBuilders();
      
      const { search, categories, sortBy, minRating, psxTier, verified } = req.query;

      let filteredResults = builders;

      if (search && typeof search === "string") {
        const searchLower = search.toLowerCase();
        filteredResults = filteredResults.filter((builder) => 
          builder.name.toLowerCase().includes(searchLower) ||
          builder.category.toLowerCase().includes(searchLower) ||
          builder.skills?.some((skill) => skill.toLowerCase().includes(searchLower)) ||
          builder.bio?.toLowerCase().includes(searchLower) ||
          builder.headline?.toLowerCase().includes(searchLower)
        );
      }

      if (categories && typeof categories === "string") {
        const categoryList = categories.split(",");
        filteredResults = filteredResults.filter((builder) => 
          categoryList.includes(builder.category)
        );
      }

      if (minRating && typeof minRating === "string") {
        const minRatingNum = parseFloat(minRating);
        filteredResults = filteredResults.filter((builder) => 
          parseFloat(builder.rating || "0") >= minRatingNum
        );
      }

      if (psxTier && typeof psxTier === "string") {
        filteredResults = filteredResults.filter((builder) => 
          builder.psxTier === psxTier
        );
      }

      if (verified === "true") {
        filteredResults = filteredResults.filter((builder) => builder.verified);
      }

      if (sortBy) {
        switch (sortBy) {
          case "rating":
            filteredResults.sort((a, b) => {
              const ratingA = parseFloat(a.rating || "0");
              const ratingB = parseFloat(b.rating || "0");
              return ratingB - ratingA;
            });
            break;
          case "projects":
            filteredResults.sort((a, b) => b.completedProjects - a.completedProjects);
            break;
          case "recent":
            filteredResults.sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            break;
          default:
            break;
        }
      }

      res.json(filteredResults);
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

  app.get("/api/builders/:id/analytics", async (req, res) => {
    try {
      const analytics = await storage.getBuilderAnalytics(req.params.id);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching builder analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.patch("/api/builders/:id/availability", async (req, res) => {
    try {
      const { accepting } = req.body;
      if (typeof accepting !== "boolean") {
        return res.status(400).json({ error: "Accepting must be a boolean" });
      }

      const builder = await storage.toggleBuilderAvailability(req.params.id, accepting);
      res.json(builder);
    } catch (error) {
      console.error("Error updating builder availability:", error);
      res.status(500).json({ error: "Failed to update availability" });
    }
  });

  app.post("/api/builders/:id/activity", async (req, res) => {
    try {
      const builder = await storage.updateBuilderActivity(req.params.id);
      res.json(builder);
    } catch (error) {
      console.error("Error updating builder activity:", error);
      res.status(500).json({ error: "Failed to update activity" });
    }
  });

  app.patch("/api/builders/:id/profile", async (req, res) => {
    try {
      const builder = await storage.updateBuilder(req.params.id, req.body);
      res.json(builder);
    } catch (error) {
      console.error("Error updating builder profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  app.get("/api/builders/:id/orders", async (req, res) => {
    try {
      const orders = await storage.getOrdersByBuilder(req.params.id);
      res.json(orders);
    } catch (error) {
      console.error("Error fetching builder orders:", error);
      res.status(500).json({ error: "Failed to fetch orders" });
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

      const { reason, details, disputedBy, disputedByType, evidence } = req.body;
      if (!reason || !details || !disputedBy || !disputedByType) {
        return res.status(400).json({ error: "Reason, details, disputedBy, and disputedByType are required" });
      }

      const dispute = await storage.createReviewDispute({
        reviewId: req.params.id,
        disputedBy,
        disputedByType,
        reason,
        details,
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
      
      const { search, categories, sortBy, minPrice, maxPrice, minRating, deliveryTime } = req.query;

      const servicesWithBuilders = await Promise.all(
        services.map(async (service) => {
          const builder = await storage.getBuilder(service.builderId);
          return { service, builder };
        })
      );

      let filteredResults = servicesWithBuilders;

      if (search && typeof search === "string") {
        const searchLower = search.toLowerCase();
        filteredResults = filteredResults.filter(
          ({ service, builder }) => {
            const serviceMatch = 
              service.title.toLowerCase().includes(searchLower) ||
              service.description.toLowerCase().includes(searchLower) ||
              service.tags?.some((tag) => tag.toLowerCase().includes(searchLower));
            
            const builderMatch = builder ? (
              builder.name.toLowerCase().includes(searchLower) ||
              builder.category.toLowerCase().includes(searchLower) ||
              builder.skills?.some((skill) => skill.toLowerCase().includes(searchLower)) ||
              builder.bio?.toLowerCase().includes(searchLower) ||
              builder.headline?.toLowerCase().includes(searchLower)
            ) : false;

            return serviceMatch || builderMatch;
          }
        );
      }

      if (categories && typeof categories === "string") {
        const categoryList = categories.split(",");
        filteredResults = filteredResults.filter(({ service }) => 
          categoryList.includes(service.category)
        );
      }

      if (minPrice && typeof minPrice === "string") {
        const minPriceNum = parseFloat(minPrice);
        filteredResults = filteredResults.filter(({ service }) => 
          parseFloat(service.basicPrice) >= minPriceNum
        );
      }

      if (maxPrice && typeof maxPrice === "string") {
        const maxPriceNum = parseFloat(maxPrice);
        filteredResults = filteredResults.filter(({ service }) => 
          parseFloat(service.basicPrice) <= maxPriceNum
        );
      }

      if (minRating && typeof minRating === "string") {
        const minRatingNum = parseFloat(minRating);
        filteredResults = filteredResults.filter(({ builder }) => 
          builder && parseFloat(builder.rating || "0") >= minRatingNum
        );
      }

      if (deliveryTime && typeof deliveryTime === "string") {
        const timeMap: Record<string, number> = {
          "24 hours": 1,
          "3 days": 3,
          "7 days": 7,
          "14 days": 14,
        };
        const maxDays = timeMap[deliveryTime];
        if (maxDays) {
          filteredResults = filteredResults.filter(({ service }) => {
            const deliveryDays = parseInt(service.deliveryTime);
            return !isNaN(deliveryDays) && deliveryDays <= maxDays;
          });
        }
      }

      if (sortBy) {
        switch (sortBy) {
          case "price-low":
            filteredResults.sort(
              (a, b) => parseFloat(a.service.basicPrice) - parseFloat(b.service.basicPrice)
            );
            break;
          case "price-high":
            filteredResults.sort(
              (a, b) => parseFloat(b.service.basicPrice) - parseFloat(a.service.basicPrice)
            );
            break;
          case "rating":
            filteredResults.sort(
              (a, b) => {
                const ratingA = parseFloat(a.builder?.rating || "0");
                const ratingB = parseFloat(b.builder?.rating || "0");
                return ratingB - ratingA;
              }
            );
            break;
          case "recent":
            filteredResults.sort(
              (a, b) => new Date(b.service.createdAt || 0).getTime() - new Date(a.service.createdAt || 0).getTime()
            );
            break;
          default:
            break;
        }
      }

      res.json(filteredResults);
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

  app.put("/api/builders/:builderId/services/:id", async (req, res) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      
      if (service.builderId !== req.params.builderId) {
        return res.status(403).json({ error: "Unauthorized - You can only edit your own services" });
      }

      const updatedService = await storage.updateService(req.params.id, req.body);
      res.json(updatedService);
    } catch (error) {
      console.error("Error updating service:", error);
      res.status(500).json({ error: "Failed to update service" });
    }
  });

  app.delete("/api/builders/:builderId/services/:id", async (req, res) => {
    try {
      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      
      if (service.builderId !== req.params.builderId) {
        return res.status(403).json({ error: "Unauthorized - You can only delete your own services" });
      }

      await storage.deleteService(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting service:", error);
      res.status(500).json({ error: "Failed to delete service" });
    }
  });

  app.patch("/api/builders/:builderId/services/:id/archive", async (req, res) => {
    try {
      const { active } = req.body;
      if (typeof active !== "boolean") {
        return res.status(400).json({ error: "Active must be a boolean" });
      }

      const service = await storage.getService(req.params.id);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      
      if (service.builderId !== req.params.builderId) {
        return res.status(403).json({ error: "Unauthorized - You can only archive your own services" });
      }

      const updatedService = await storage.updateService(req.params.id, { active });
      res.json(updatedService);
    } catch (error) {
      console.error("Error archiving service:", error);
      res.status(500).json({ error: "Failed to archive service" });
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
      const { inviteToken, ...applicationData } = req.body;
      const validatedData = insertBuilderApplicationSchema.parse(applicationData);
      
      if (inviteToken) {
        const token = await storage.getBuilderInviteToken(inviteToken);
        
        if (!token) {
          return res.status(400).json({ error: "Invalid invite token" });
        }
        
        if (token.used) {
          return res.status(400).json({ error: "Invite token already used" });
        }
        
        if (token.expiresAt && new Date(token.expiresAt) < new Date()) {
          return res.status(400).json({ error: "Invite token expired" });
        }
        
        const builder = await storage.createBuilder({
          walletAddress: validatedData.walletAddress,
          name: validatedData.name,
          bio: validatedData.bio,
          category: validatedData.category,
          rating: "5.0",
          reviewCount: 0,
          skills: validatedData.skills || [],
          verified: true,
          featured: false,
          twitterHandle: validatedData.twitterHandle,
          portfolioItems: [],
        });
        
        await storage.markInviteTokenAsUsed(inviteToken, builder.id, builder.name);
        
        return res.status(201).json({
          id: builder.id,
          builderId: builder.id,
          status: "approved",
          message: "Welcome to Create.psx! Your builder profile has been created.",
        });
      }
      
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
      console.error("Application submission error:", error);
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

  app.get("/api/auth/wallet/:address", async (req, res) => {
    try {
      const { address } = req.params;
      
      if (!address) {
        return res.status(400).json({ error: "Wallet address required" });
      }

      const normalizedAddress = address.toLowerCase();
      
      const client = await storage.getClientByWallet(normalizedAddress);
      if (client) {
        return res.json({ 
          type: "client", 
          id: client.id,
          walletAddress: client.walletAddress,
          name: client.name,
          verified: client.verified,
          psxTier: client.psxTier
        });
      }

      const builder = await storage.getBuilderByWallet(normalizedAddress);
      if (builder) {
        return res.json({ 
          type: "builder", 
          id: builder.id,
          walletAddress: builder.walletAddress,
          name: builder.name,
          verified: builder.verified,
          category: builder.category
        });
      }

      res.json({ type: null });
    } catch (error) {
      console.error("Error checking wallet status:", error);
      res.status(500).json({ error: "Failed to check wallet status" });
    }
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
  
  app.post("/api/admin/builder-invites", requireAdminAuth, async (req, res) => {
    try {
      const adminId = (req.session as any).adminId;
      if (!adminId) {
        return res.status(401).json({ error: "Admin not authenticated" });
      }
      
      const admin = await storage.getAdminById(adminId);
      if (!admin) {
        return res.status(401).json({ error: "Admin not found" });
      }
      
      const { email, notes, expiresIn } = req.body;
      const token = await storage.createBuilderInviteToken(
        admin.id,
        admin.name || admin.username,
        email,
        notes,
        expiresIn
      );
      
      res.json(token);
    } catch (error) {
      console.error("Error creating invite token:", error);
      res.status(500).json({ error: "Failed to create invite token" });
    }
  });
  
  app.get("/api/admin/builder-invites", requireAdminAuth, async (_req, res) => {
    try {
      const tokens = await storage.getBuilderInviteTokens();
      res.json(tokens);
    } catch (error) {
      console.error("Error fetching invite tokens:", error);
      res.status(500).json({ error: "Failed to fetch invite tokens" });
    }
  });
  
  app.get("/api/builder-invites/verify/:token", async (req, res) => {
    try {
      const token = await storage.getBuilderInviteToken(req.params.token);
      
      if (!token) {
        return res.status(404).json({ error: "Invalid invite token" });
      }
      
      if (token.used) {
        return res.status(400).json({ error: "This invite has already been used" });
      }
      
      if (token.expiresAt && new Date(token.expiresAt) < new Date()) {
        return res.status(400).json({ error: "This invite has expired" });
      }
      
      res.json({ valid: true, email: token.email });
    } catch (error) {
      console.error("Error verifying invite token:", error);
      res.status(500).json({ error: "Failed to verify invite token" });
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

  app.get("/api/orders/:orderId/deliverables", async (req, res) => {
    try {
      const deliverables = await storage.getProjectDeliverablesByOrder(req.params.orderId);
      res.json(deliverables);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch deliverables" });
    }
  });

  app.get("/api/milestones/:milestoneId/deliverables", async (req, res) => {
    try {
      const deliverables = await storage.getProjectDeliverablesByMilestone(req.params.milestoneId);
      res.json(deliverables);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch deliverables" });
    }
  });

  app.get("/api/deliverables/:id", async (req, res) => {
    try {
      const deliverable = await storage.getProjectDeliverable(req.params.id);
      if (!deliverable) {
        return res.status(404).json({ error: "Deliverable not found" });
      }
      res.json(deliverable);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch deliverable" });
    }
  });

  app.post("/api/orders/:orderId/deliverables", async (req, res) => {
    try {
      const result = insertProjectDeliverableSchema.safeParse({
        ...req.body,
        orderId: req.params.orderId,
      });

      if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
      }

      const deliverable = await storage.createProjectDeliverable(result.data);
      res.json(deliverable);
    } catch (error) {
      console.error("Failed to create deliverable:", error);
      res.status(500).json({ error: "Failed to create deliverable" });
    }
  });

  app.patch("/api/deliverables/:id", async (req, res) => {
    try {
      const deliverable = await storage.updateProjectDeliverable(req.params.id, req.body);
      res.json(deliverable);
    } catch (error) {
      res.status(500).json({ error: "Failed to update deliverable" });
    }
  });

  app.post("/api/deliverables/:id/review", async (req, res) => {
    try {
      const { reviewedBy, reviewNotes, accepted, rejectionReason } = req.body;
      const deliverable = await storage.reviewProjectDeliverable(
        req.params.id,
        reviewedBy,
        reviewNotes,
        accepted,
        rejectionReason
      );
      res.json(deliverable);
    } catch (error) {
      res.status(500).json({ error: "Failed to review deliverable" });
    }
  });

  app.post("/api/deliverables/:id/request-revision", async (req, res) => {
    try {
      const { reviewNotes } = req.body;
      const deliverable = await storage.requestDeliverableRevision(req.params.id, reviewNotes);
      res.json(deliverable);
    } catch (error) {
      res.status(500).json({ error: "Failed to request revision" });
    }
  });

  app.get("/api/orders/:orderId/progress", async (req, res) => {
    try {
      const updates = await storage.getProgressUpdatesByOrder(req.params.orderId);
      res.json(updates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch progress updates" });
    }
  });

  app.get("/api/builders/:builderId/progress", async (req, res) => {
    try {
      const updates = await storage.getProgressUpdatesByBuilder(req.params.builderId);
      res.json(updates);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch progress updates" });
    }
  });

  app.get("/api/progress/:id", async (req, res) => {
    try {
      const update = await storage.getProgressUpdate(req.params.id);
      if (!update) {
        return res.status(404).json({ error: "Progress update not found" });
      }
      res.json(update);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch progress update" });
    }
  });

  app.post("/api/orders/:orderId/progress", async (req, res) => {
    try {
      const result = insertProgressUpdateSchema.safeParse({
        ...req.body,
        orderId: req.params.orderId,
      });

      if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
      }

      const update = await storage.createProgressUpdate(result.data);
      res.json(update);
    } catch (error) {
      console.error("Failed to create progress update:", error);
      res.status(500).json({ error: "Failed to create progress update" });
    }
  });

  app.patch("/api/progress/:id", async (req, res) => {
    try {
      const update = await storage.updateProgressUpdate(req.params.id, req.body);
      res.json(update);
    } catch (error) {
      res.status(500).json({ error: "Failed to update progress update" });
    }
  });

  app.delete("/api/progress/:id", async (req, res) => {
    try {
      await storage.deleteProgressUpdate(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete progress update" });
    }
  });

  app.get("/api/orders/:orderId/documents", async (req, res) => {
    try {
      const documents = await storage.getProjectDocumentsByOrder(req.params.orderId);
      res.json(documents);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  });

  app.get("/api/documents/:id", async (req, res) => {
    try {
      const document = await storage.getProjectDocument(req.params.id);
      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch document" });
    }
  });

  app.get("/api/orders/:orderId/documents/:documentName/versions", async (req, res) => {
    try {
      const versions = await storage.getProjectDocumentVersions(req.params.orderId, req.params.documentName);
      res.json(versions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch document versions" });
    }
  });

  app.post("/api/orders/:orderId/documents", async (req, res) => {
    try {
      const result = insertProjectDocumentSchema.safeParse({
        ...req.body,
        orderId: req.params.orderId,
      });

      if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
      }

      const document = await storage.createProjectDocument(result.data);
      res.json(document);
    } catch (error) {
      console.error("Failed to create document:", error);
      res.status(500).json({ error: "Failed to create document" });
    }
  });

  app.patch("/api/documents/:id", async (req, res) => {
    try {
      const document = await storage.updateProjectDocument(req.params.id, req.body);
      res.json(document);
    } catch (error) {
      res.status(500).json({ error: "Failed to update document" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    try {
      await storage.deleteProjectDocument(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete document" });
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

  app.post("/api/builders/:builderId/follow", async (req, res, next) => {
    try {
      const { builderId } = req.params;
      const { clientId } = req.body;
      
      if (!clientId) {
        return res.status(400).json({ error: "Client ID required" });
      }

      await storage.followBuilder(clientId, builderId);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/builders/:builderId/unfollow", async (req, res, next) => {
    try {
      const { builderId } = req.params;
      const { clientId } = req.body;
      
      if (!clientId) {
        return res.status(400).json({ error: "Client ID required" });
      }

      await storage.unfollowBuilder(clientId, builderId);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/builders/:builderId/followers", async (req, res, next) => {
    try {
      const { builderId } = req.params;
      const followers = await storage.getBuilderFollowers(builderId);
      const followerCount = followers.length;
      res.json({ followers, followerCount });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/builders/:builderId/is-following", async (req, res, next) => {
    try {
      const { builderId } = req.params;
      const { clientId } = req.query;
      
      if (!clientId) {
        return res.json({ isFollowing: false });
      }

      const isFollowing = await storage.isFollowingBuilder(clientId as string, builderId);
      res.json({ isFollowing });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/clients/:clientId/following", async (req, res, next) => {
    try {
      const { clientId } = req.params;
      const following = await storage.getFollowedBuilders(clientId);
      res.json(following);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/builders/:builderId/activity", async (req, res, next) => {
    try {
      const { builderId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const activities = await storage.getBuilderActivityFeed(builderId, limit);
      res.json(activities);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/clients/:clientId/activity-feed", async (req, res, next) => {
    try {
      const { clientId } = req.params;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const activities = await storage.getFollowedBuildersActivity(clientId, limit);
      res.json(activities);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/builders/:builderId/badges", async (req, res, next) => {
    try {
      const { builderId } = req.params;
      const { badgeType, badgeLabel, badgeIcon, badgeColor } = req.body;
      
      if (!badgeType || !badgeLabel) {
        return res.status(400).json({ error: "Badge type and label required" });
      }

      await storage.createBuilderBadge({ builderId, badgeType, badgeLabel, badgeIcon, badgeColor });
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/builders/:builderId/badges", async (req, res, next) => {
    try {
      const { builderId } = req.params;
      const badges = await storage.getBuilderBadges(builderId);
      res.json(badges);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/builders/:builderId/badges/:badgeType", async (req, res, next) => {
    try {
      const { builderId, badgeType } = req.params;
      await storage.removeBuilderBadge(builderId, badgeType);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/builders/:builderId/testimonials", async (req, res, next) => {
    try {
      const { builderId } = req.params;
      const { clientId, content, authorName, authorTitle, rating, orderId } = req.body;
      
      if (!clientId || !content || !authorName) {
        return res.status(400).json({ error: "Client ID, content, and author name required" });
      }

      await storage.createBuilderTestimonial({ builderId, clientId, content, authorName, authorTitle, rating, orderId });
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/builders/:builderId/testimonials", async (req, res, next) => {
    try {
      const { builderId } = req.params;
      const approvedOnly = req.query.approvedOnly !== "false";
      const testimonials = await storage.getBuilderTestimonials(builderId, approvedOnly);
      res.json(testimonials);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/testimonials/:testimonialId/approve", async (req, res, next) => {
    try {
      const { testimonialId } = req.params;
      await storage.approveBuilderTestimonial(testimonialId);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/testimonials/:testimonialId/feature", async (req, res, next) => {
    try {
      const { testimonialId } = req.params;
      const { featured } = req.body;
      await storage.featureBuilderTestimonial(testimonialId, featured === true);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/builders/:builderId/views", async (req, res, next) => {
    try {
      const { builderId } = req.params;
      const { viewerId, viewerType } = req.body;
      await storage.trackBuilderView(builderId, viewerId, viewerType);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/builders/:builderId/view-stats", async (req, res, next) => {
    try {
      const { builderId } = req.params;
      const stats = await storage.getBuilderViewStats(builderId);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/analytics/platform", async (req, res, next) => {
    try {
      const category = req.query.category as string | undefined;
      await storage.calculatePlatformStatistics();
      const stats = await storage.getPlatformStatistics(category);
      res.json(stats);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/analytics/clients/:clientId", async (req, res, next) => {
    try {
      const { clientId } = req.params;
      const analytics = await storage.getClientAnalytics(clientId);
      res.json(analytics);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/builder-applications/:applicationId/revisions", async (req, res, next) => {
    try {
      const { applicationId } = req.params;
      const { changesRequested, requestedBy } = req.body;
      
      if (!changesRequested || !requestedBy) {
        return res.status(400).json({ error: "Changes requested and requestor required" });
      }

      await storage.createApplicationRevision(applicationId, changesRequested, requestedBy);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/builder-applications/:applicationId/revisions", async (req, res, next) => {
    try {
      const { applicationId } = req.params;
      const revisions = await storage.getApplicationRevisions(applicationId);
      res.json(revisions);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/builder-applications/revisions/:revisionId/submit", async (req, res, next) => {
    try {
      const { revisionId } = req.params;
      const { submittedData } = req.body;
      
      if (!submittedData) {
        return res.status(400).json({ error: "Submitted data required" });
      }

      await storage.submitApplicationRevision(revisionId, submittedData);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/builder-applications/by-email/:email", async (req, res, next) => {
    try {
      const { email } = req.params;
      const application = await storage.getBuilderApplicationByEmail(email);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/builders/:builderId/onboarding", async (req, res, next) => {
    try {
      const { builderId } = req.params;
      const { applicationId } = req.body;
      
      if (!applicationId) {
        return res.status(400).json({ error: "Application ID required" });
      }

      await storage.createBuilderOnboarding(builderId, applicationId);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/builders/:builderId/onboarding", async (req, res, next) => {
    try {
      const { builderId } = req.params;
      const onboarding = await storage.getBuilderOnboarding(builderId);
      if (!onboarding) {
        return res.status(404).json({ error: "Onboarding not found" });
      }
      res.json(onboarding);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/builders/:builderId/onboarding/:step", async (req, res, next) => {
    try {
      const { builderId, step } = req.params;
      const { completed } = req.body;
      
      if (typeof completed !== "boolean") {
        return res.status(400).json({ error: "Completed status required" });
      }

      await storage.updateOnboardingStep(builderId, step, completed);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/notifications", async (req, res, next) => {
    try {
      const notification = await storage.createNotification(req.body);
      res.status(201).json(notification);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/notifications/:recipientType/:recipientId", async (req, res, next) => {
    try {
      const { recipientId, recipientType } = req.params;
      const { limit, unreadOnly } = req.query;
      
      const notifications = await storage.getNotifications(
        recipientId,
        recipientType,
        limit ? parseInt(limit as string) : undefined,
        unreadOnly === "true"
      );
      
      res.json(notifications);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/notifications/:recipientType/:recipientId/unread-count", async (req, res, next) => {
    try {
      const { recipientId, recipientType } = req.params;
      const count = await storage.getUnreadNotificationCount(recipientId, recipientType);
      res.json({ count });
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/notifications/:id/read", async (req, res, next) => {
    try {
      const { id } = req.params;
      const notification = await storage.markNotificationAsRead(id);
      res.json(notification);
    } catch (error) {
      next(error);
    }
  });

  app.patch("/api/notifications/:recipientType/:recipientId/mark-all-read", async (req, res, next) => {
    try {
      const { recipientId, recipientType } = req.params;
      await storage.markAllNotificationsAsRead(recipientId, recipientType);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/notifications/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      await storage.deleteNotification(id);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/notification-preferences/:userType/:userId", async (req, res, next) => {
    try {
      const { userId, userType } = req.params;
      const preferences = await storage.getNotificationPreferences(userId, userType);
      res.json(preferences);
    } catch (error) {
      next(error);
    }
  });

  app.put("/api/notification-preferences/:userType/:userId", async (req, res, next) => {
    try {
      const { userId, userType } = req.params;
      const preferences = await storage.updateNotificationPreferences(userId, userType, req.body);
      res.json(preferences);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/push-subscriptions", async (req, res, next) => {
    try {
      const subscription = await storage.createPushSubscription(req.body);
      res.status(201).json(subscription);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/push-subscriptions/:userType/:userId", async (req, res, next) => {
    try {
      const { userId, userType } = req.params;
      const subscriptions = await storage.getPushSubscriptions(userId, userType);
      res.json(subscriptions);
    } catch (error) {
      next(error);
    }
  });

  app.delete("/api/push-subscriptions/:endpoint", async (req, res, next) => {
    try {
      const { endpoint } = req.params;
      const decodedEndpoint = decodeURIComponent(endpoint);
      await storage.deletePushSubscription(decodedEndpoint);
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  });

  // Object Storage Routes - File uploads for portfolio images, attachments, deliverables
  // Referenced from javascript_object_storage blueprint

  // Serve private objects with ACL check (for authenticated users)
  app.get("/objects/:objectPath(*)", async (req, res) => {
    const objectStorageService = new ObjectStorageService();
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      
      // For create.psx, we'll check if user is authenticated (client or admin)
      // Get user ID from session - could be client wallet address or admin ID
      let userId: string | undefined;
      if (req.session.clientAddress) {
        userId = req.session.clientAddress;
      } else if (req.session.adminId) {
        userId = req.session.adminId;
      }

      const canAccess = await objectStorageService.canAccessObjectEntity({
        objectFile,
        userId,
        requestedPermission: ObjectPermission.READ,
      });

      if (!canAccess) {
        return res.sendStatus(401);
      }

      objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      console.error("Error accessing object:", error);
      if (error instanceof ObjectNotFoundError) {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Serve public objects (no authentication required)
  app.get("/public-objects/:filePath(*)", async (req, res) => {
    const filePath = req.params.filePath;
    const objectStorageService = new ObjectStorageService();
    try {
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get upload URL for file upload (requires authentication)
  app.post("/api/objects/upload", async (req, res) => {
    // Require authentication
    if (!req.session.clientAddress && !req.session.adminId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      return res.status(500).json({ error: "Failed to generate upload URL" });
    }
  });

  // Set ACL policy for uploaded portfolio image
  app.put("/api/upload/portfolio-image", async (req, res) => {
    if (!req.session.clientAddress && !req.session.adminId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const userId = req.session.clientAddress || req.session.adminId || "";
      
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.imageURL,
        {
          owner: userId,
          visibility: "public", // Portfolio images are public
        }
      );

      res.status(200).json({ objectPath });
    } catch (error) {
      console.error("Error setting portfolio image ACL:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Set ACL policy for uploaded message attachment
  app.put("/api/upload/message-attachment", async (req, res) => {
    if (!req.session.clientAddress && !req.session.adminId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.body.fileURL) {
      return res.status(400).json({ error: "fileURL is required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const userId = req.session.clientAddress || req.session.adminId || "";
      
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.fileURL,
        {
          owner: userId,
          visibility: "private", // Message attachments are private
        }
      );

      res.status(200).json({ objectPath });
    } catch (error) {
      console.error("Error setting message attachment ACL:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Set ACL policy for uploaded deliverable file
  app.put("/api/upload/deliverable", async (req, res) => {
    if (!req.session.clientAddress && !req.session.adminId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.body.fileURL) {
      return res.status(400).json({ error: "fileURL is required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const userId = req.session.clientAddress || req.session.adminId || "";
      
      const objectPath = await objectStorageService.trySetObjectEntityAclPolicy(
        req.body.fileURL,
        {
          owner: userId,
          visibility: "private", // Deliverables are private
        }
      );

      res.status(200).json({ objectPath });
    } catch (error) {
      console.error("Error setting deliverable ACL:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}
