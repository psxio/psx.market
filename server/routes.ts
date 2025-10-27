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
import { requireAdminAuth, requireClientAuth, generateAdminToken, revokeAdminToken, verifyAdminToken } from "./middleware/auth";
import { WebSocketServer, WebSocket } from "ws";
import { ObjectStorageService, ObjectNotFoundError } from "./objectStorage";
import { ObjectPermission } from "./objectAcl";
import escrowRouter from "./routes/escrow";
import { socialIntegrationService } from "./services/socialIntegrations";
import { registerSitemapRoutes } from "./routes/sitemap-routes";
import { registerDigestRoutes } from "./routes/digest-routes";
import { registerRecommendationRoutes } from "./routes/recommendation-routes";

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
          const builder = service.builderId ? await storage.getBuilder(service.builderId) : null;
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
      
      const { search, categories, sortBy, minRating, psxTier, verified, languages, availability } = req.query;

      // Filter out NSFW builders by default
      let filteredResults = builders.filter((builder) => !builder.isNSFW);

      if (search && typeof search === "string") {
        const searchLower = search.toLowerCase();
        filteredResults = filteredResults.filter((builder) => 
          builder.name.toLowerCase().includes(searchLower) ||
          builder.category.toLowerCase().includes(searchLower) ||
          builder.skills?.some((skill) => skill.toLowerCase().includes(searchLower)) ||
          builder.bio?.toLowerCase().includes(searchLower) ||
          builder.headline?.toLowerCase().includes(searchLower) ||
          builder.specializations?.some((spec) => spec.toLowerCase().includes(searchLower))
        );
      }

      if (categories && typeof categories === "string") {
        const categoryList = categories.split(",");
        filteredResults = filteredResults.filter((builder) => 
          categoryList.includes(builder.category)
        );
      }

      if (languages && typeof languages === "string") {
        const languageList = languages.split(",");
        filteredResults = filteredResults.filter((builder) => 
          builder.languages && builder.languages.some((lang) => languageList.includes(lang))
        );
      }

      if (availability && typeof availability === "string") {
        filteredResults = filteredResults.filter((builder) => 
          builder.availability === availability
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

  app.get("/api/builders/adult", async (req, res) => {
    try {
      let builders = await storage.getBuilders();
      
      // Only return NSFW builders
      let filteredResults = builders.filter((builder) => builder.isNSFW);

      const { search, sortBy } = req.query;

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
        }
      }

      res.json(filteredResults);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch adult builders" });
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

  app.get("/api/builders/live", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const builders = await storage.getLiveBuilders(category);
      res.json(builders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch live builders" });
    }
  });

  app.get("/api/portfolio-items", async (req, res) => {
    try {
      const searchQuery = req.query.search as string | undefined;
      const portfolioItems = await storage.getAllPortfolioItems(searchQuery);
      res.json(portfolioItems);
    } catch (error) {
      console.error("Error fetching portfolio items:", error);
      res.status(500).json({ error: "Failed to fetch portfolio items" });
    }
  });

  app.patch("/api/builders/:id/live-status", async (req, res) => {
    if (!req.session.userId || req.session.userType !== "builder") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const builderId = req.params.id;
    if (req.session.userId !== builderId) {
      return res.status(403).json({ error: "You can only update your own live status" });
    }

    try {
      const { isLive } = req.body;
      if (typeof isLive !== "boolean") {
        return res.status(400).json({ error: "isLive must be a boolean" });
      }

      const builder = await storage.updateBuilderLiveStatus(builderId, isLive);
      res.json(builder);
    } catch (error) {
      console.error("Error updating live status:", error);
      res.status(500).json({ error: "Failed to update live status" });
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

  app.post("/api/builders/:id/track-view", async (req, res) => {
    try {
      await storage.incrementBuilderViews(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to track view" });
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

  // Social Account Verification & Real Data Fetching
  app.post("/api/builders/:id/verify-github", async (req, res) => {
    try {
      const { username } = req.body;
      
      if (!username) {
        return res.status(400).json({ error: "GitHub username is required" });
      }

      // Fetch real GitHub profile data
      const githubData = await socialIntegrationService.getGitHubProfile(username);
      
      if (!githubData) {
        return res.status(404).json({ error: "GitHub profile not found" });
      }

      // Fetch repository stats
      const repoStats = await socialIntegrationService.getGitHubRepoStats(username);

      // Update builder profile with real data
      const builder = await storage.updateBuilder(req.params.id, {
        githubProfile: `https://github.com/${username}`,
        // Store additional GitHub data in a structured way
      });

      res.json({
        verified: true,
        username: githubData.login,
        name: githubData.name,
        followers: githubData.followers,
        publicRepos: githubData.public_repos,
        bio: githubData.bio,
        location: githubData.location,
        company: githubData.company,
        avatarUrl: githubData.avatar_url,
        blog: githubData.blog,
        totalStars: repoStats?.totalStars || 0,
        totalForks: repoStats?.totalForks || 0,
      });
    } catch (error) {
      console.error("Error verifying GitHub account:", error);
      res.status(500).json({ error: "Failed to verify GitHub account" });
    }
  });

  app.post("/api/builders/:id/verify-twitter", async (req, res) => {
    try {
      const { input } = req.body;
      
      if (!input) {
        return res.status(400).json({ error: "Twitter username or URL is required" });
      }

      // Extract username from various input formats
      const username = socialIntegrationService.extractTwitterUsername(input);
      
      if (!username) {
        return res.status(400).json({ error: "Invalid Twitter username or URL" });
      }

      // Verify username format is valid
      const isValid = await socialIntegrationService.verifyTwitterUsername(username);
      
      if (!isValid) {
        return res.status(400).json({ error: "Invalid Twitter username format" });
      }

      // Update builder profile with verified Twitter handle
      await storage.updateBuilder(req.params.id, {
        twitterHandle: `@${username}`,
      });

      res.json({
        verified: true,
        username: username,
        handle: `@${username}`,
        profileUrl: `https://x.com/${username}`,
        message: "Twitter account verified. Connect your X account to fetch real-time follower data.",
      });
    } catch (error) {
      console.error("Error verifying Twitter account:", error);
      res.status(500).json({ error: "Failed to verify Twitter account" });
    }
  });

  app.post("/api/builders/:id/verify-instagram", async (req, res) => {
    try {
      const { input } = req.body;
      
      if (!input) {
        return res.status(400).json({ error: "Instagram username or URL is required" });
      }

      const username = socialIntegrationService.extractInstagramUsername(input);
      
      if (!username) {
        return res.status(400).json({ error: "Invalid Instagram username or URL" });
      }

      await storage.updateBuilder(req.params.id, {
        instagramHandle: username,
      });

      res.json({
        verified: true,
        username: username,
        profileUrl: `https://instagram.com/${username}`,
        message: "Instagram username verified. Connect via Meta Graph API to fetch real follower data.",
      });
    } catch (error) {
      console.error("Error verifying Instagram account:", error);
      res.status(500).json({ error: "Failed to verify Instagram account" });
    }
  });

  app.post("/api/builders/:id/verify-youtube", async (req, res) => {
    try {
      const { url } = req.body;
      
      if (!url) {
        return res.status(400).json({ error: "YouTube channel URL is required" });
      }

      const channelId = socialIntegrationService.extractYouTubeChannelId(url);
      
      if (!channelId) {
        return res.status(400).json({ error: "Invalid YouTube channel URL" });
      }

      await storage.updateBuilder(req.params.id, {
        youtubeChannel: url,
      });

      res.json({
        verified: true,
        channelId: channelId,
        channelUrl: url,
        message: "YouTube channel verified. Add YouTube Data API key to fetch real subscriber data.",
      });
    } catch (error) {
      console.error("Error verifying YouTube account:", error);
      res.status(500).json({ error: "Failed to verify YouTube account" });
    }
  });

  app.post("/api/builders/:id/verify-telegram", async (req, res) => {
    try {
      const { input } = req.body;
      
      if (!input) {
        return res.status(400).json({ error: "Telegram handle or URL is required" });
      }

      const handle = socialIntegrationService.extractTelegramHandle(input);
      
      if (!handle) {
        return res.status(400).json({ error: "Invalid Telegram handle or URL" });
      }

      await storage.updateBuilder(req.params.id, {
        telegramHandle: `@${handle}`,
      });

      res.json({
        verified: true,
        handle: `@${handle}`,
        profileUrl: `https://t.me/${handle}`,
        message: "Telegram account verified successfully.",
      });
    } catch (error) {
      console.error("Error verifying Telegram account:", error);
      res.status(500).json({ error: "Failed to verify Telegram account" });
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

  // Get recent 5-star reviews for carousel (must be before /api/reviews/:id)
  app.get("/api/reviews/recent-highlights", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const reviews = await storage.getRecentHighlightReviews(limit);
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching recent reviews:", error);
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
      
      const { search, categories, tags, sortBy, minPrice, maxPrice, minRating, deliveryTime } = req.query;

      const servicesWithBuilders = await Promise.all(
        services.map(async (service) => {
          const builder = service.builderId ? await storage.getBuilder(service.builderId) : null;
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
        // Map slugs to full category names
        const slugToName: Record<string, string> = {
          "kols": "KOLs & Influencers",
          "3d-content": "3D Content Creation",
          "marketing": "Marketing & Growth",
          "development": "Script Development",
          "volume": "Volume Services",
          "graphic-design": "Graphic Design",
          "social-media": "Social Media Management",
          "grants-funding": "grants-funding",
          "strategy-consulting": "Strategy Consulting",
          "documentation": "Documentation & Paperwork",
        };
        const categoryNames = categoryList.map(slug => slugToName[slug] || slug);
        filteredResults = filteredResults.filter(({ service }) => 
          categoryNames.includes(service.category)
        );
      }

      if (tags && typeof tags === "string") {
        const tagList = tags.split(",").map(t => t.toLowerCase());
        filteredResults = filteredResults.filter(({ service }) => 
          service.tags && service.tags.some(tag => 
            tagList.some(filterTag => tag.toLowerCase().includes(filterTag))
          )
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
      const servicesWithBuilders = await storage.getFeaturedServicesWithBuilders();
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
      
      // Get builder information if service has a builderId
      const builder = service.builderId ? await storage.getBuilder(service.builderId) : null;
      
      res.json({ service, builder });
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

      // TODO: REPLACE WITH REAL BLOCKCHAIN INTEGRATION
      // This should call Base blockchain to check real $PSX and $CREATE token balances
      // Requirements:
      // 1. Base RPC endpoint (mainnet: https://mainnet.base.org)
      // 2. PSX token contract address on Base
      // 3. CREATE token contract address on Base  
      // 4. Use viem or ethers.js to query ERC20 balanceOf(address)
      
      // TEMPORARY: Using whitelisted builders for testing
      // All builders in the system are automatically whitelisted during beta
      const builder = await storage.getBuilderByWallet(walletAddress);
      const isWhitelisted = builder?.tokenGateWhitelisted || false;
      
      res.json({
        walletAddress,
        psxBalance: isWhitelisted ? 10000 : 0,
        createBalance: isWhitelisted ? 5000 : 0,
        hasSufficientBalance: isWhitelisted,
        tier: isWhitelisted ? "gold" : "bronze",
        whitelisted: isWhitelisted,
        message: isWhitelisted 
          ? "Beta access granted - Whitelisted builder" 
          : "Real blockchain verification coming soon. Contact admin for whitelist.",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to verify wallet" });
    }
  });

  app.get("/api/wallet/balance/:address", async (req, res) => {
    try {
      // TODO: REPLACE WITH REAL BLOCKCHAIN INTEGRATION
      // Query real $PSX and $CREATE balances from Base blockchain
      
      const builder = await storage.getBuilderByWallet(req.params.address);
      const client = await storage.getClientByWallet(req.params.address);
      const isWhitelisted = builder?.tokenGateWhitelisted || false;
      
      res.json({
        walletAddress: req.params.address,
        psxBalance: isWhitelisted ? 10000 : 0,
        createBalance: isWhitelisted ? 5000 : 0,
        hasSufficientBalance: isWhitelisted,
        whitelisted: isWhitelisted,
        message: "Beta mode: Whitelisted users have full access. Real blockchain verification coming soon.",
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
        
        // Create builder with all fields from comprehensive onboarding
        const builder = await storage.createBuilder({
          walletAddress: validatedData.walletAddress,
          name: validatedData.name,
          headline: validatedData.headline || `${validatedData.category} Expert`,
          bio: validatedData.bio,
          category: validatedData.category,
          verified: true,
          tokenGateWhitelisted: true,
          
          // Profile Images
          profileImage: validatedData.profileImage,
          coverImage: validatedData.coverImage,
          profileStrength: validatedData.profileStrength,
          
          // Social & Portfolio
          twitterHandle: validatedData.twitterHandle,
          portfolioLinks: validatedData.portfolioLinks || [],
          
          // KOL/Influencer fields
          twitterFollowers: validatedData.twitterFollowers,
          instagramHandle: validatedData.instagramHandle,
          instagramFollowers: validatedData.instagramFollowers,
          youtubeChannel: validatedData.youtubeChannel,
          youtubeSubscribers: validatedData.youtubeSubscribers,
          engagementRate: validatedData.engagementRate,
          contentNiches: validatedData.contentNiches,
          
          // 3D Artist fields
          software3D: validatedData.software3D,
          renderEngines: validatedData.renderEngines,
          styleSpecialties: validatedData.styleSpecialties,
          
          // Marketing fields
          marketingPlatforms: validatedData.marketingPlatforms,
          growthStrategies: validatedData.growthStrategies,
          
          // Developer fields
          programmingLanguages: validatedData.programmingLanguages,
          blockchainFrameworks: validatedData.blockchainFrameworks,
          githubProfile: validatedData.githubProfile,
          
          // Volume Services fields
          tradingExperience: validatedData.tradingExperience,
          volumeCapabilities: validatedData.volumeCapabilities,
          complianceKnowledge: validatedData.complianceKnowledge,
        });
        
        await storage.useBuilderInviteToken(inviteToken, builder.id, builder.name);
        
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

  // Builder authentication endpoints
  app.post("/api/builders/login", async (req, res) => {
    try {
      const { walletAddress } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({ error: "Wallet address required" });
      }

      const builder = await storage.getBuilderByWallet(walletAddress.toLowerCase());
      if (!builder) {
        return res.status(404).json({ error: "Builder not found. Please apply first." });
      }

      req.session.regenerate((err) => {
        if (err) {
          return res.status(500).json({ error: "Session creation failed" });
        }

        req.session.builderId = builder.id;
        req.session.userId = builder.id;
        req.session.userType = "builder";

        req.session.save((err) => {
          if (err) {
            return res.status(500).json({ error: "Session save failed" });
          }
          res.json(builder);
        });
      });
    } catch (error) {
      console.error("Builder login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/builders/me", async (req, res) => {
    try {
      if (!req.session.builderId) {
        return res.status(401).json({ error: "Unauthorized - Builder authentication required" });
      }
      
      const builder = await storage.getBuilder(req.session.builderId);
      if (!builder) {
        req.session.destroy(() => {});
        return res.status(404).json({ error: "Builder not found" });
      }
      res.json(builder);
    } catch (error) {
      console.error("Failed to fetch builder:", error);
      res.status(500).json({ error: "Failed to fetch builder" });
    }
  });

  app.post("/api/builders/logout", async (req, res) => {
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
      
      // Get client and builder details for notifications
      const client = await storage.getClient(order.clientId);
      const builder = await storage.getBuilder(order.builderId);
      
      if (client && builder) {
        const { sendNotification } = await import("./notifications");
        
        // Send notification to client
        await sendNotification({
          recipientId: client.id,
          recipientType: "client",
          type: "order_update",
          title: "Order Placed Successfully",
          message: `Your order "${order.title}" has been placed. ${builder.name} will review it soon.`,
          actionUrl: `/order-confirmation/${order.id}`,
          metadata: { orderId: order.id, orderTitle: order.title },
        });
        
        // Send notification to builder
        await sendNotification({
          recipientId: builder.id,
          recipientType: "builder",
          type: "order_update",
          title: "New Order Received",
          message: `You have a new order from ${client.name} for "${order.title}".`,
          actionUrl: `/builder-dashboard?order=${order.id}`,
          metadata: { orderId: order.id, orderTitle: order.title },
        });
      }
      
      res.json(order);
    } catch (error: any) {
      console.error("Error creating order:", error);
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

  // Update order with escrow information
  app.patch("/api/orders/:id/escrow", requireClientAuth, async (req, res) => {
    try {
      const { escrowCreatedTxHash, escrowStatus } = req.body;
      
      if (!escrowCreatedTxHash) {
        return res.status(400).json({ error: "Transaction hash is required" });
      }

      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Verify the order belongs to the authenticated client
      if (order.clientId !== req.session.clientId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      // Update order with escrow information
      const updatedOrder = await storage.updateOrder(req.params.id, {
        escrowCreatedTxHash,
        escrowStatus: escrowStatus || "active",
        updatedAt: new Date().toISOString(),
      });

      // Send notification to builder
      const builder = await storage.getBuilder(order.builderId);
      if (builder) {
        const { sendNotification } = await import("./notifications");
        await sendNotification({
          recipientId: builder.id,
          recipientType: "builder",
          type: "order_update",
          title: "Payment Secured",
          message: `Payment for "${order.title}" has been secured in escrow. You can start working on this project.`,
          actionUrl: `/builder-dashboard?order=${order.id}`,
          metadata: { orderId: order.id, orderTitle: order.title, txHash: escrowCreatedTxHash },
        });
      }

      res.json(updatedOrder);
    } catch (error: any) {
      console.error("Error updating order escrow:", error);
      res.status(500).json({ error: error.message || "Failed to update order escrow" });
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

          // Generate auth token for iframe/cookie-blocked scenarios
          const token = generateAdminToken(admin.id);

          res.json({
            id: admin.id,
            username: admin.username,
            email: admin.email,
            name: admin.name,
            role: admin.role,
            token, // Return token for localStorage-based auth
          });
        });
      });
    } catch (error) {
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.get("/api/admin/me", async (req, res) => {
    // Check for Bearer token first
    const authHeader = req.get("Authorization");
    let adminId = req.session.adminId;
    
    if (!adminId && authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      adminId = verifyAdminToken(token) || undefined;
    }
    
    if (!adminId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    try {
      const admin = await storage.getAdminById(adminId);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      res.json({
        id: admin.id,
        username: admin.username,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch admin info" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    // Revoke token if provided
    const authHeader = req.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      revokeAdminToken(token);
    }
    
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

  app.post("/api/admin/builders/bulk-action", requireAdminAuth, async (req, res) => {
    try {
      const { action, builderIds } = req.body;
      
      if (!action || !builderIds || !Array.isArray(builderIds)) {
        return res.status(400).json({ error: "Invalid request" });
      }

      const results = [];
      for (const id of builderIds) {
        try {
          if (action === "verify") {
            await storage.updateBuilder(id, { verified: true });
          } else if (action === "unverify") {
            await storage.updateBuilder(id, { verified: false });
          } else if (action === "suspend") {
            await storage.updateBuilder(id, { isActive: false });
          } else if (action === "activate") {
            await storage.updateBuilder(id, { isActive: true });
          } else if (action === "delete") {
            await storage.deleteBuilder(id);
          }
          results.push({ id, success: true });
        } catch (error) {
          results.push({ id, success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
      }
      
      res.json({ results });
    } catch (error) {
      res.status(500).json({ error: "Failed to perform bulk action" });
    }
  });

  app.get("/api/admin/builders/:id/analytics", requireAdminAuth, async (req, res) => {
    try {
      const builderId = req.params.id;
      
      const builder = await storage.getBuilder(builderId);
      if (!builder) {
        return res.status(404).json({ error: "Builder not found" });
      }

      const orders = await storage.getOrders();
      const builderOrders = orders.filter(o => o.builderId === builderId);
      
      const totalRevenue = builderOrders
        .filter(o => o.status === "completed")
        .reduce((sum, o) => sum + (parseFloat(o.budget) || 0), 0);
      
      const completedOrders = builderOrders.filter(o => o.status === "completed").length;
      const activeOrders = builderOrders.filter(o => 
        o.status === "pending" || o.status === "in_progress"
      ).length;
      
      const avgOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;
      
      const reviews = await storage.getReviews();
      const builderReviews = reviews.filter(r => r.builderId === builderId);
      
      const avgRating = builderReviews.length > 0
        ? builderReviews.reduce((sum, r) => sum + r.rating, 0) / builderReviews.length
        : 0;
      
      const monthlyRevenue = [];
      const last6Months = [];
      const now = new Date();
      
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = d.toISOString().slice(0, 7);
        last6Months.push(monthKey);
        
        const monthOrders = builderOrders.filter(o => {
          if (!o.completedAt) return false;
          return o.completedAt.startsWith(monthKey);
        });
        
        const revenue = monthOrders.reduce((sum, o) => 
          sum + (parseFloat(o.budget) || 0), 0
        );
        
        monthlyRevenue.push({
          month: monthKey,
          revenue: revenue,
          orders: monthOrders.length,
        });
      }
      
      res.json({
        totalRevenue,
        totalOrders: builderOrders.length,
        completedOrders,
        activeOrders,
        avgOrderValue,
        avgRating,
        totalReviews: builderReviews.length,
        monthlyRevenue,
        successRate: builder.successRate || "100",
        onTimeDeliveryRate: builder.onTimeDeliveryRate || "100",
        avgResponseTimeHours: builder.avgResponseTimeHours || 24,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch builder analytics" });
    }
  });

  app.get("/api/admin/builders/:id/performance-score", requireAdminAuth, async (req, res) => {
    try {
      const builderId = req.params.id;
      
      const builder = await storage.getBuilder(builderId);
      if (!builder) {
        return res.status(404).json({ error: "Builder not found" });
      }

      const avgRating = parseFloat(builder.rating || "0");
      const ratingScore = (avgRating / 5) * 30;
      
      const successRate = parseFloat(builder.successRate || "100");
      const successScore = (successRate / 100) * 25;
      
      const onTimeRate = parseFloat(builder.onTimeDeliveryRate || "100");
      const deliveryScore = (onTimeRate / 100) * 20;
      
      const responseTimeHours = builder.avgResponseTimeHours || 24;
      const responseScore = Math.max(0, 15 - (responseTimeHours / 24) * 15);
      
      const completionScore = Math.min(10, (builder.completedProjects || 0) / 10 * 10);
      
      const totalScore = Math.round(
        ratingScore + successScore + deliveryScore + responseScore + completionScore
      );
      
      let grade = "F";
      if (totalScore >= 90) grade = "A+";
      else if (totalScore >= 85) grade = "A";
      else if (totalScore >= 80) grade = "B+";
      else if (totalScore >= 75) grade = "B";
      else if (totalScore >= 70) grade = "C+";
      else if (totalScore >= 65) grade = "C";
      else if (totalScore >= 60) grade = "D";
      
      res.json({
        totalScore,
        grade,
        breakdown: {
          rating: { score: Math.round(ratingScore), max: 30, value: avgRating },
          successRate: { score: Math.round(successScore), max: 25, value: successRate },
          onTimeDelivery: { score: Math.round(deliveryScore), max: 20, value: onTimeRate },
          responseTime: { score: Math.round(responseScore), max: 15, value: responseTimeHours },
          completion: { score: Math.round(completionScore), max: 10, value: builder.completedProjects || 0 },
        },
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to calculate performance score" });
    }
  });

  app.get("/api/admin/builders/:id/compliance", requireAdminAuth, async (req, res) => {
    try {
      const builderId = req.params.id;
      
      const builder = await storage.getBuilder(builderId);
      if (!builder) {
        return res.status(404).json({ error: "Builder not found" });
      }

      const issues = [];
      
      if (!builder.profileImage) {
        issues.push({ field: "profileImage", message: "Missing profile image", severity: "medium" });
      }
      
      if (!builder.bio || builder.bio.length < 50) {
        issues.push({ field: "bio", message: "Bio too short (minimum 50 characters)", severity: "high" });
      }
      
      if (!builder.portfolioLinks || builder.portfolioLinks.length === 0) {
        issues.push({ field: "portfolioLinks", message: "No portfolio links added", severity: "high" });
      }
      
      if (!builder.skills || builder.skills.length === 0) {
        issues.push({ field: "skills", message: "No skills listed", severity: "medium" });
      }
      
      const services = await storage.getServices();
      const builderServices = services.filter(s => s.builderId === builderId);
      
      if (builderServices.length === 0) {
        issues.push({ field: "services", message: "No services created", severity: "critical" });
      }
      
      if (!builder.twitterHandle && !builder.instagramHandle && !builder.telegramHandle) {
        issues.push({ field: "socialMedia", message: "No social media profiles added", severity: "low" });
      }
      
      const isCompliant = issues.filter(i => i.severity === "critical").length === 0;
      
      res.json({
        isCompliant,
        totalIssues: issues.length,
        issues,
        lastChecked: new Date().toISOString(),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to check compliance" });
    }
  });

  app.get("/api/admin/builders/:id/tags", requireAdminAuth, async (req, res) => {
    try {
      const builderId = req.params.id;
      const tags = await storage.getBuilderTags(builderId);
      res.json(tags);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch builder tags" });
    }
  });

  app.post("/api/admin/builders/:id/tags", requireAdminAuth, async (req, res) => {
    try {
      const builderId = req.params.id;
      const { tagLabel, tagColor, tagType } = req.body;
      
      const adminId = (req.session as any).adminId;
      const tag = await storage.addBuilderTag({
        builderId,
        tagLabel,
        tagColor: tagColor || "gray",
        tagType: tagType || "custom",
        addedBy: adminId,
      });
      
      res.json(tag);
    } catch (error) {
      res.status(500).json({ error: "Failed to add tag" });
    }
  });

  app.delete("/api/admin/builders/:builderId/tags/:tagId", requireAdminAuth, async (req, res) => {
    try {
      await storage.deleteBuilderTag(req.params.tagId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete tag" });
    }
  });

  app.get("/api/admin/builders/:id/notes", requireAdminAuth, async (req, res) => {
    try {
      const builderId = req.params.id;
      const notes = await storage.getBuilderAdminNotes(builderId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch builder notes" });
    }
  });

  app.post("/api/admin/builders/:id/notes", requireAdminAuth, async (req, res) => {
    try {
      const builderId = req.params.id;
      const { note, noteType, priority } = req.body;
      
      const adminId = (req.session as any).adminId;
      const admin = await storage.getAdmin(adminId);
      const newNote = await storage.addBuilderAdminNote({
        builderId,
        note,
        noteType: noteType || "general",
        priority: priority || "normal",
        createdBy: adminId,
        createdByName: admin?.username || "Admin",
      });
      
      res.json(newNote);
    } catch (error) {
      res.status(500).json({ error: "Failed to add note" });
    }
  });

  app.delete("/api/admin/builders/:builderId/notes/:noteId", requireAdminAuth, async (req, res) => {
    try {
      await storage.deleteBuilderAdminNote(req.params.noteId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete note" });
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

  app.delete("/api/admin/builder-invites/:id", requireAdminAuth, async (req, res) => {
    try {
      await storage.deleteBuilderInviteToken(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting invite token:", error);
      res.status(500).json({ error: "Failed to delete invite token" });
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

  // Admin Analytics Endpoints
  app.get("/api/admin/analytics/activity-feed", requireAdminAuth, async (req, res) => {
    try {
      const limit = Number(req.query.limit) || 20;
      
      const [orders, applications, payments, reviews] = await Promise.all([
        storage.getOrders(),
        storage.getBuilderApplications(),
        storage.getPayments(),
        storage.getReviews(),
      ]);
      
      const activities: any[] = [];
      
      orders.slice(0, limit / 4).forEach(order => {
        activities.push({
          id: order.id,
          type: 'order',
          action: order.status === 'pending' ? 'created' : order.status,
          timestamp: order.createdAt,
          data: {
            orderId: order.id,
            title: order.title,
            amount: order.budget,
            status: order.status,
          }
        });
      });
      
      applications.slice(0, limit / 4).forEach(app => {
        activities.push({
          id: app.id,
          type: 'application',
          action: app.status === 'pending' ? 'submitted' : app.status,
          timestamp: app.submittedAt,
          data: {
            applicationId: app.id,
            name: app.name,
            category: app.category,
            status: app.status,
          }
        });
      });
      
      payments.slice(0, limit / 4).forEach(payment => {
        activities.push({
          id: payment.id,
          type: 'payment',
          action: payment.status,
          timestamp: payment.createdAt,
          data: {
            paymentId: payment.id,
            amount: payment.amount,
            status: payment.status,
            method: payment.paymentMethod,
          }
        });
      });
      
      reviews.slice(0, limit / 4).forEach(review => {
        activities.push({
          id: review.id,
          type: 'review',
          action: 'posted',
          timestamp: review.createdAt,
          data: {
            reviewId: review.id,
            rating: review.rating,
            clientName: review.clientName,
          }
        });
      });
      
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      res.json(activities.slice(0, limit));
    } catch (error) {
      console.error("Error fetching activity feed:", error);
      res.status(500).json({ error: "Failed to fetch activity feed" });
    }
  });

  app.get("/api/admin/analytics/dashboard", requireAdminAuth, async (req, res) => {
    try {
      const period = (req.query.period as string) || '7';
      const daysAgo = Number(period);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);
      
      const [builders, clients, services, orders, applications, payments, reviews] = await Promise.all([
        storage.getBuilders(),
        storage.getClients(),
        storage.getServices(),
        storage.getOrders(),
        storage.getBuilderApplications(),
        storage.getPayments(),
        storage.getReviews(),
      ]);
      
      const prevStartDate = new Date(startDate);
      prevStartDate.setDate(prevStartDate.getDate() - daysAgo);
      
      const currentPeriodOrders = orders.filter(o => new Date(o.createdAt) >= startDate);
      const prevPeriodOrders = orders.filter(o => 
        new Date(o.createdAt) >= prevStartDate && new Date(o.createdAt) < startDate
      );
      
      const currentPeriodRevenue = payments
        .filter(p => new Date(p.createdAt) >= startDate && p.status === 'completed')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);
      
      const prevPeriodRevenue = payments
        .filter(p => new Date(p.createdAt) >= prevStartDate && new Date(p.createdAt) < startDate && p.status === 'completed')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);
      
      const totalRevenue = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + Number(p.amount || 0), 0);
      
      const platformFees = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + Number(p.platformFee || 0), 0);
      
      const calculateGrowth = (current: number, previous: number) => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };
      
      const stats = {
        totalBuilders: builders.length,
        totalClients: clients.length,
        activeServices: services.filter(s => s.active).length,
        totalOrders: orders.length,
        pendingApplications: applications.filter(a => a.status === 'pending').length,
        totalRevenue: totalRevenue.toFixed(2),
        platformFees: platformFees.toFixed(2),
        averageOrderValue: orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : '0',
        completedOrders: orders.filter(o => o.status === 'completed').length,
        activeOrders: orders.filter(o => ['pending', 'in_progress', 'delivered'].includes(o.status || '')).length,
        averageRating: reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2) : '0',
      };
      
      const growth = {
        orders: calculateGrowth(currentPeriodOrders.length, prevPeriodOrders.length),
        revenue: calculateGrowth(currentPeriodRevenue, prevPeriodRevenue),
      };
      
      const chartData = [];
      for (let i = daysAgo - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayOrders = orders.filter(o => o.createdAt.startsWith(dateStr));
        const dayRevenue = payments
          .filter(p => p.createdAt.startsWith(dateStr) && p.status === 'completed')
          .reduce((sum, p) => sum + Number(p.amount || 0), 0);
        const dayBuilders = builders.filter(b => b.createdAt.startsWith(dateStr));
        const dayClients = clients.filter(c => c.createdAt.startsWith(dateStr));
        
        chartData.push({
          date: dateStr,
          orders: dayOrders.length,
          revenue: Number(dayRevenue.toFixed(2)),
          newBuilders: dayBuilders.length,
          newClients: dayClients.length,
        });
      }
      
      res.json({ stats, growth, chartData });
    } catch (error) {
      console.error("Error fetching dashboard analytics:", error);
      res.status(500).json({ error: "Failed to fetch dashboard analytics" });
    }
  });

  app.get("/api/admin/analytics/top-performers", requireAdminAuth, async (_req, res) => {
    try {
      const [builders, orders, payments, reviews] = await Promise.all([
        storage.getBuilders(),
        storage.getOrders(),
        storage.getPayments(),
        storage.getReviews(),
      ]);
      
      const builderStats = builders.map(builder => {
        const builderOrders = orders.filter(o => o.builderId === builder.id);
        const builderPayments = payments.filter(p => p.builderId === builder.id && p.status === 'completed');
        const revenue = builderPayments.reduce((sum, p) => sum + Number(p.builderAmount || 0), 0);
        const builderReviews = reviews.filter(r => r.builderId === builder.id);
        const avgRating = builderReviews.length > 0 
          ? builderReviews.reduce((sum, r) => sum + r.rating, 0) / builderReviews.length 
          : 0;
        
        return {
          id: builder.id,
          name: builder.name,
          profileImage: builder.profileImage,
          category: builder.category,
          revenue: Number(revenue.toFixed(2)),
          ordersCount: builderOrders.length,
          completedOrders: builderOrders.filter(o => o.status === 'completed').length,
          rating: Number(avgRating.toFixed(2)),
          reviewCount: builderReviews.length,
        };
      });
      
      const topByRevenue = [...builderStats].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
      const topByRating = [...builderStats].filter(b => b.reviewCount >= 3).sort((a, b) => b.rating - a.rating).slice(0, 5);
      const topByOrders = [...builderStats].sort((a, b) => b.completedOrders - a.completedOrders).slice(0, 5);
      
      res.json({
        topByRevenue,
        topByRating,
        topByOrders,
      });
    } catch (error) {
      console.error("Error fetching top performers:", error);
      res.status(500).json({ error: "Failed to fetch top performers" });
    }
  });

  app.get("/api/admin/analytics/conversion-funnel", requireAdminAuth, async (_req, res) => {
    try {
      const [applications, builders, orders] = await Promise.all([
        storage.getBuilderApplications(),
        storage.getBuilders(),
        storage.getOrders(),
      ]);
      
      const totalApplications = applications.length;
      const approvedApplications = applications.filter(a => a.status === 'approved').length;
      const buildersWithOrders = new Set(orders.map(o => o.builderId)).size;
      
      const funnel = [
        {
          stage: 'Applications Submitted',
          count: totalApplications,
          percentage: 100,
        },
        {
          stage: 'Applications Approved',
          count: approvedApplications,
          percentage: totalApplications > 0 ? (approvedApplications / totalApplications) * 100 : 0,
        },
        {
          stage: 'Builders Created',
          count: builders.length,
          percentage: totalApplications > 0 ? (builders.length / totalApplications) * 100 : 0,
        },
        {
          stage: 'First Order Received',
          count: buildersWithOrders,
          percentage: builders.length > 0 ? (buildersWithOrders / builders.length) * 100 : 0,
        },
      ];
      
      res.json(funnel);
    } catch (error) {
      console.error("Error fetching conversion funnel:", error);
      res.status(500).json({ error: "Failed to fetch conversion funnel" });
    }
  });

  app.get("/api/admin/analytics/platform-health", requireAdminAuth, async (_req, res) => {
    try {
      const [orders, payments, builders, applications] = await Promise.all([
        storage.getOrders(),
        storage.getPayments(),
        storage.getBuilders(),
        storage.getBuilderApplications(),
      ]);
      
      const last24Hours = new Date();
      last24Hours.setHours(last24Hours.getHours() - 24);
      
      const activeOrders = orders.filter(o => ['pending', 'in_progress', 'delivered'].includes(o.status || ''));
      const recentOrders = orders.filter(o => new Date(o.createdAt) >= last24Hours);
      const failedPayments = payments.filter(p => p.status === 'failed');
      const pendingApplications = applications.filter(a => a.status === 'pending');
      const verifiedBuilders = builders.filter(b => b.verified);
      
      const healthScore = Math.min(100, Math.max(0, 
        (verifiedBuilders.length / Math.max(builders.length, 1)) * 30 +
        (1 - (failedPayments.length / Math.max(payments.length, 1))) * 30 +
        (activeOrders.length / Math.max(orders.length, 1)) * 20 +
        (recentOrders.length > 0 ? 20 : 0)
      ));
      
      let healthStatus = 'critical';
      if (healthScore >= 80) healthStatus = 'excellent';
      else if (healthScore >= 60) healthStatus = 'good';
      else if (healthScore >= 40) healthStatus = 'fair';
      
      res.json({
        score: Math.round(healthScore),
        status: healthStatus,
        metrics: {
          activeOrders: activeOrders.length,
          recentActivity: recentOrders.length,
          failedPayments: failedPayments.length,
          pendingApplications: pendingApplications.length,
          verifiedBuilders: verifiedBuilders.length,
          totalBuilders: builders.length,
        },
      });
    } catch (error) {
      console.error("Error calculating platform health:", error);
      res.status(500).json({ error: "Failed to calculate platform health" });
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

      // Get thread info to determine recipient
      const thread = await storage.getChatThread(message.threadId);
      if (thread) {
        // Determine recipient based on who sent the message
        let recipientId: string;
        let recipientType: "client" | "builder";
        let senderName: string;
        
        if (message.senderType === "client") {
          recipientId = thread.builderId;
          recipientType = "builder";
          const client = await storage.getClient(message.senderId);
          senderName = client?.name || "A client";
        } else {
          recipientId = thread.clientId;
          recipientType = "client";
          const builder = await storage.getBuilder(message.senderId);
          senderName = builder?.name || "A builder";
        }

        // Send notification to recipient
        const { sendNotification } = await import("./notifications");
        await sendNotification({
          recipientId,
          recipientType,
          type: "message",
          title: "New Message",
          message: `${senderName} sent you a message`,
          actionUrl: `/messages?thread=${thread.id}`,
          metadata: {
            threadId: thread.id,
            senderId: message.senderId,
            senderType: message.senderType,
            messagePreview: message.content.substring(0, 100),
          },
        });
      }

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

  // Builder Favorites Routes
  app.get("/api/favorites/:userId", async (req, res) => {
    try {
      const { collectionName } = req.query;
      const favorites = await storage.getBuilderFavorites(
        req.params.userId,
        collectionName as string | undefined
      );
      res.json(favorites);
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  app.get("/api/favorites/:userId/:builderId/check", async (req, res) => {
    try {
      const { userId, builderId } = req.params;
      const favorites = await storage.getBuilderFavorites(userId);
      const isFavorited = favorites.some(fav => fav.builderId === builderId);
      res.json({ isFavorited });
    } catch (error) {
      console.error("Failed to check favorite status:", error);
      res.status(500).json({ error: "Failed to check favorite status" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const { userId, builderId, collectionName, notes } = req.body;
      
      if (!userId || !builderId) {
        return res.status(400).json({ error: "userId and builderId are required" });
      }

      // Check if already favorited
      const favorites = await storage.getBuilderFavorites(userId);
      const alreadyFavorited = favorites.some(fav => fav.builderId === builderId);
      
      if (alreadyFavorited) {
        return res.status(400).json({ error: "Builder already favorited" });
      }

      const favorite = await storage.addBuilderFavorite({
        userId,
        builderId,
        collectionName: collectionName || null,
        notes: notes || null,
      });
      
      res.json(favorite);
    } catch (error) {
      console.error("Failed to add favorite:", error);
      res.status(500).json({ error: "Failed to add favorite" });
    }
  });

  app.delete("/api/favorites/:userId/:builderId", async (req, res) => {
    try {
      const { userId, builderId } = req.params;
      await storage.removeBuilderFavorite(userId, builderId);
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to remove favorite:", error);
      res.status(500).json({ error: "Failed to remove favorite" });
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

  // Get upload URL for file upload
  // NOTE: Permissive to allow uploads during builder onboarding before account creation
  app.post("/api/objects/upload", async (req, res) => {
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
  // NOTE: Permissive to allow uploads during builder onboarding before account creation
  app.put("/api/upload/portfolio-image", async (req, res) => {
    if (!req.body.imageURL) {
      return res.status(400).json({ error: "imageURL is required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      // Get userId from session if available, otherwise use anonymous
      const userId = req.session.clientAddress || req.session.builderId || req.session.adminId || "anonymous";
      
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
    if (!req.session.clientAddress && !req.session.builderId && !req.session.adminId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.body.fileURL) {
      return res.status(400).json({ error: "fileURL is required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const userId = req.session.clientAddress || req.session.builderId || req.session.adminId || "";
      
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
    if (!req.session.clientAddress && !req.session.builderId && !req.session.adminId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (!req.body.fileURL) {
      return res.status(400).json({ error: "fileURL is required" });
    }

    try {
      const objectStorageService = new ObjectStorageService();
      const userId = req.session.clientAddress || req.session.builderId || req.session.adminId || "";
      
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

  // PARTNER ROUTES

  // Get all partners (public)
  app.get("/api/partners", async (req, res) => {
    try {
      const { category, featured } = req.query;
      
      const options: any = { active: true };
      if (category) options.category = category as string;
      if (featured) options.featured = featured === 'true';
      
      const partners = await storage.getPartners(options);
      res.json(partners);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch partners" });
    }
  });

  // Get single partner (public)
  app.get("/api/partners/:id", async (req, res) => {
    try {
      const partner = await storage.getPartner(req.params.id);
      if (!partner) {
        return res.status(404).json({ error: "Partner not found" });
      }
      res.json(partner);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch partner" });
    }
  });

  // Create partner connection request (requires auth)
  app.post("/api/partner-connections", async (req, res) => {
    if (!req.session.clientAddress && !req.session.adminId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    try {
      let userId: string;
      let userType: string;
      let userName: string;
      let userEmail: string;

      if (req.session.clientAddress) {
        const client = await storage.getClient(req.session.clientAddress);
        if (!client) {
          return res.status(404).json({ error: "Client not found" });
        }
        userId = client.id;
        userType = "client";
        userName = client.name || "Client";
        userEmail = client.email || "";
      } else {
        const admin = await storage.getAdmin(req.session.adminId!);
        if (!admin) {
          return res.status(404).json({ error: "Admin not found" });
        }
        userId = admin.id;
        userType = "admin";
        userName = admin.username;
        userEmail = admin.email || "";
      }

      const connectionRequest = await storage.createPartnerConnectionRequest({
        partnerId: req.body.partnerId,
        userId,
        userType,
        userName,
        userEmail,
        userWallet: req.session.clientAddress || undefined,
        projectName: req.body.projectName,
        projectDescription: req.body.projectDescription,
        budget: req.body.budget,
        timeline: req.body.timeline,
        specificNeeds: req.body.specificNeeds,
        status: "pending",
      });

      // Send notification to admin
      await storage.createNotification({
        recipientId: "admin",
        recipientType: "admin",
        type: "system",
        title: "New Partner Connection Request",
        message: `${userName} requested connection to a partner for ${req.body.projectName}`,
        actionUrl: `/admin-dashboard`,
      });

      res.json(connectionRequest);
    } catch (error) {
      console.error("Partner connection request error:", error);
      res.status(500).json({ error: "Failed to create connection request" });
    }
  });

  // Get user's own connection requests
  app.get("/api/partner-connections/me", async (req, res) => {
    if (!req.session.clientAddress && !req.session.adminId) {
      return res.status(401).json({ error: "Authentication required" });
    }

    try {
      let userId: string;

      if (req.session.clientAddress) {
        const client = await storage.getClient(req.session.clientAddress);
        if (!client) {
          return res.status(404).json({ error: "Client not found" });
        }
        userId = client.id;
      } else {
        const admin = await storage.getAdmin(req.session.adminId!);
        if (!admin) {
          return res.status(404).json({ error: "Admin not found" });
        }
        userId = admin.id;
      }

      const requests = await storage.getPartnerConnectionRequests({ userId });
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch connection requests" });
    }
  });

  // ADMIN PARTNER ROUTES

  // Get all partners (admin)
  app.get("/api/admin/partners", requireAdminAuth, async (_req, res) => {
    try {
      const partners = await storage.getPartners();
      res.json(partners);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch partners" });
    }
  });

  // Create partner (admin)
  app.post("/api/admin/partners", requireAdminAuth, async (req, res) => {
    try {
      const partner = await storage.createPartner(req.body);
      res.json(partner);
    } catch (error) {
      res.status(500).json({ error: "Failed to create partner" });
    }
  });

  // Update partner (admin)
  app.put("/api/admin/partners/:id", requireAdminAuth, async (req, res) => {
    try {
      const partner = await storage.updatePartner(req.params.id, req.body);
      res.json(partner);
    } catch (error) {
      res.status(500).json({ error: "Failed to update partner" });
    }
  });

  // Delete partner (admin)
  app.delete("/api/admin/partners/:id", requireAdminAuth, async (req, res) => {
    try {
      await storage.deletePartner(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete partner" });
    }
  });

  // Get all partner connection requests (admin)
  app.get("/api/admin/partner-connections", requireAdminAuth, async (req, res) => {
    try {
      const { partnerId, status } = req.query;
      const options: any = {};
      if (partnerId) options.partnerId = partnerId as string;
      if (status) options.status = status as string;

      const requests = await storage.getPartnerConnectionRequests(options);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch connection requests" });
    }
  });

  // Update partner connection request status (admin)
  app.put("/api/admin/partner-connections/:id", requireAdminAuth, async (req, res) => {
    try {
      const request = await storage.updatePartnerConnectionRequest(req.params.id, req.body);

      // If status changed to connected, send notification to user
      if (req.body.status === "connected") {
        await storage.createNotification({
          recipientId: request.userId,
          recipientType: request.userType as "client" | "builder" | "admin",
          type: "system",
          title: "Partner Connection Approved",
          message: `Your connection request has been approved! Check your email for next steps.`,
        });
      }

      res.json(request);
    } catch (error) {
      res.status(500).json({ error: "Failed to update connection request" });
    }
  });

  // Delete partner connection request (admin)
  app.delete("/api/admin/partner-connections/:id", requireAdminAuth, async (req, res) => {
    try {
      await storage.deletePartnerConnectionRequest(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete connection request" });
    }
  });

  // FINANCIAL MANAGEMENT ENDPOINTS

  // Payment Dashboard - All transactions with filters
  app.get("/api/admin/financial/payments", requireAdminAuth, async (req, res) => {
    try {
      const { status, dateFrom, dateTo, builderId, clientId } = req.query;
      
      let payments = await storage.getPayments();
      
      if (status && status !== 'all') {
        payments = payments.filter(p => p.status === status);
      }
      
      if (dateFrom) {
        payments = payments.filter(p => p.createdAt >= dateFrom);
      }
      
      if (dateTo) {
        payments = payments.filter(p => p.createdAt <= dateTo);
      }
      
      if (builderId) {
        payments = payments.filter(p => p.builderId === builderId);
      }
      
      if (clientId) {
        payments = payments.filter(p => p.clientId === clientId);
      }
      
      const [builders, clients, orders] = await Promise.all([
        storage.getBuilders(),
        storage.getClients(),
        storage.getOrders(),
      ]);
      
      const enrichedPayments = payments.map(payment => {
        const builder = builders.find(b => b.id === payment.builderId);
        const client = clients.find(c => c.id === payment.clientId);
        const order = orders.find(o => o.id === payment.orderId);
        
        return {
          ...payment,
          builderName: builder?.name,
          clientName: client?.name,
          orderTitle: order?.title,
        };
      });
      
      res.json(enrichedPayments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  });

  // Revenue Analytics - Daily/weekly/monthly revenue charts
  app.get("/api/admin/financial/revenue-analytics", requireAdminAuth, async (req, res) => {
    try {
      const { period = '30' } = req.query;
      const days = parseInt(period as string);
      
      const payments = await storage.getPayments();
      const completedPayments = payments.filter(p => p.status === 'completed' && p.paidAt);
      
      const now = new Date();
      const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      
      const recentPayments = completedPayments.filter(p => {
        const paidDate = new Date(p.paidAt!);
        return paidDate >= startDate;
      });
      
      const dailyRevenue: Record<string, { date: string; revenue: number; platformFees: number; builderPayouts: number; transactions: number }> = {};
      
      for (let i = 0; i < days; i++) {
        const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
        const dateKey = date.toISOString().split('T')[0];
        dailyRevenue[dateKey] = {
          date: dateKey,
          revenue: 0,
          platformFees: 0,
          builderPayouts: 0,
          transactions: 0,
        };
      }
      
      recentPayments.forEach(payment => {
        const dateKey = payment.paidAt!.split('T')[0];
        if (dailyRevenue[dateKey]) {
          dailyRevenue[dateKey].revenue += parseFloat(payment.amount);
          dailyRevenue[dateKey].platformFees += parseFloat(payment.platformFee);
          dailyRevenue[dateKey].builderPayouts += parseFloat(payment.builderAmount);
          dailyRevenue[dateKey].transactions += 1;
        }
      });
      
      const totalRevenue = recentPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const totalPlatformFees = recentPayments.reduce((sum, p) => sum + parseFloat(p.platformFee), 0);
      const totalBuilderPayouts = recentPayments.reduce((sum, p) => sum + parseFloat(p.builderAmount), 0);
      
      const avgTransactionValue = recentPayments.length > 0 
        ? totalRevenue / recentPayments.length 
        : 0;
      
      res.json({
        period: days,
        totalRevenue,
        totalPlatformFees,
        totalBuilderPayouts,
        totalTransactions: recentPayments.length,
        avgTransactionValue,
        dailyData: Object.values(dailyRevenue).sort((a, b) => a.date.localeCompare(b.date)),
      });
    } catch (error) {
      console.error("Error calculating revenue analytics:", error);
      res.status(500).json({ error: "Failed to calculate revenue analytics" });
    }
  });

  // Payout Queue - Pending builder payouts
  app.get("/api/admin/financial/payout-queue", requireAdminAuth, async (req, res) => {
    try {
      const payouts = await storage.getPayouts();
      const pendingPayouts = payouts.filter(p => p.status === 'pending');
      
      const builders = await storage.getBuilders();
      
      const enrichedPayouts = pendingPayouts.map(payout => {
        const builder = builders.find(b => b.id === payout.builderId);
        return {
          ...payout,
          builderName: builder?.name,
          builderEmail: builder?.twitterHandle,
        };
      });
      
      const totalPending = pendingPayouts.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      
      res.json({
        payouts: enrichedPayouts,
        totalPending,
        count: pendingPayouts.length,
      });
    } catch (error) {
      console.error("Error fetching payout queue:", error);
      res.status(500).json({ error: "Failed to fetch payout queue" });
    }
  });

  // Process payout (batch or single)
  app.post("/api/admin/financial/process-payouts", requireAdminAuth, async (req, res) => {
    try {
      const { payoutIds } = req.body;
      
      if (!payoutIds || !Array.isArray(payoutIds)) {
        return res.status(400).json({ error: "Invalid request" });
      }
      
      const results = [];
      
      for (const payoutId of payoutIds) {
        try {
          const payout = await storage.updatePayout(payoutId, {
            status: 'processing',
            processedAt: new Date().toISOString(),
          });
          results.push({ id: payoutId, success: true });
        } catch (error) {
          results.push({ id: payoutId, success: false, error: error instanceof Error ? error.message : 'Unknown error' });
        }
      }
      
      res.json({ results });
    } catch (error) {
      console.error("Error processing payouts:", error);
      res.status(500).json({ error: "Failed to process payouts" });
    }
  });

  // Transaction History - Full transaction logs with filters
  app.get("/api/admin/financial/transactions", requireAdminAuth, async (req, res) => {
    try {
      const { type, status, search } = req.query;
      
      const [payments, payouts, refunds] = await Promise.all([
        storage.getPayments(),
        storage.getPayouts(),
        storage.getRefunds(),
      ]);
      
      const [builders, clients] = await Promise.all([
        storage.getBuilders(),
        storage.getClients(),
      ]);
      
      let transactions: any[] = [];
      
      if (!type || type === 'all' || type === 'payment') {
        transactions = transactions.concat(payments.map(p => ({
          id: p.id,
          type: 'payment',
          amount: p.amount,
          currency: p.currency,
          status: p.status,
          transactionHash: p.transactionHash,
          blockNumber: p.blockNumber,
          createdAt: p.createdAt,
          processedAt: p.paidAt,
          fromName: clients.find(c => c.id === p.clientId)?.name,
          toName: builders.find(b => b.id === p.builderId)?.name,
          platformFee: p.platformFee,
        })));
      }
      
      if (!type || type === 'all' || type === 'payout') {
        transactions = transactions.concat(payouts.map(p => ({
          id: p.id,
          type: 'payout',
          amount: p.amount,
          currency: p.currency,
          status: p.status,
          transactionHash: p.transactionHash,
          createdAt: p.createdAt,
          processedAt: p.processedAt,
          toName: builders.find(b => b.id === p.builderId)?.name,
          failureReason: p.failureReason,
        })));
      }
      
      if (!type || type === 'all' || type === 'refund') {
        transactions = transactions.concat(refunds.map(r => ({
          id: r.id,
          type: 'refund',
          amount: r.amount,
          currency: 'USDC',
          status: r.status,
          transactionHash: r.transactionHash,
          createdAt: r.createdAt,
          processedAt: r.processedAt,
          reason: r.reason,
          failureReason: r.failureReason,
        })));
      }
      
      if (status && status !== 'all') {
        transactions = transactions.filter(t => t.status === status);
      }
      
      if (search) {
        const searchLower = (search as string).toLowerCase();
        transactions = transactions.filter(t => 
          t.transactionHash?.toLowerCase().includes(searchLower) ||
          t.fromName?.toLowerCase().includes(searchLower) ||
          t.toName?.toLowerCase().includes(searchLower)
        );
      }
      
      transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  // Failed Payment Recovery - Retry failed payments
  app.get("/api/admin/financial/failed-payments", requireAdminAuth, async (req, res) => {
    try {
      const payments = await storage.getPayments();
      const failedPayments = payments.filter(p => p.status === 'failed');
      
      const [builders, clients, orders] = await Promise.all([
        storage.getBuilders(),
        storage.getClients(),
        storage.getOrders(),
      ]);
      
      const enrichedFailedPayments = failedPayments.map(payment => {
        const builder = builders.find(b => b.id === payment.builderId);
        const client = clients.find(c => c.id === payment.clientId);
        const order = orders.find(o => o.id === payment.orderId);
        
        return {
          ...payment,
          builderName: builder?.name,
          clientName: client?.name,
          orderTitle: order?.title,
        };
      });
      
      res.json(enrichedFailedPayments);
    } catch (error) {
      console.error("Error fetching failed payments:", error);
      res.status(500).json({ error: "Failed to fetch failed payments" });
    }
  });

  // Retry failed payment
  app.post("/api/admin/financial/retry-payment/:id", requireAdminAuth, async (req, res) => {
    try {
      const payment = await storage.getPayment(req.params.id);
      
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      
      if (payment.status !== 'failed') {
        return res.status(400).json({ error: "Payment is not in failed status" });
      }
      
      const updatedPayment = await storage.updatePayment(req.params.id, {
        status: 'pending',
      });
      
      res.json(updatedPayment);
    } catch (error) {
      console.error("Error retrying payment:", error);
      res.status(500).json({ error: "Failed to retry payment" });
    }
  });

  // Escrow Monitoring - View funds in escrow
  app.get("/api/admin/financial/escrow", requireAdminAuth, async (req, res) => {
    try {
      const payments = await storage.getPayments();
      const inEscrow = payments.filter(p => p.status === 'escrowed' || p.status === 'completed');
      
      const [builders, clients, orders] = await Promise.all([
        storage.getBuilders(),
        storage.getClients(),
        storage.getOrders(),
      ]);
      
      const enrichedEscrow = inEscrow.map(payment => {
        const builder = builders.find(b => b.id === payment.builderId);
        const client = clients.find(c => c.id === payment.clientId);
        const order = orders.find(o => o.id === payment.orderId);
        
        return {
          ...payment,
          builderName: builder?.name,
          clientName: client?.name,
          orderTitle: order?.title,
          orderStatus: order?.status,
        };
      });
      
      const totalInEscrow = inEscrow.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const totalBuilderAmount = inEscrow.reduce((sum, p) => sum + parseFloat(p.builderAmount), 0);
      
      res.json({
        payments: enrichedEscrow,
        totalInEscrow,
        totalBuilderAmount,
        count: inEscrow.length,
      });
    } catch (error) {
      console.error("Error fetching escrow data:", error);
      res.status(500).json({ error: "Failed to fetch escrow data" });
    }
  });

  // Platform Fee Manager - View/adjust fees
  app.get("/api/admin/financial/platform-fees", requireAdminAuth, async (req, res) => {
    try {
      const payments = await storage.getPayments();
      
      const fees = payments.map(p => ({
        paymentId: p.id,
        orderId: p.orderId,
        amount: p.amount,
        platformFee: p.platformFee,
        platformFeePercentage: p.platformFeePercentage,
        paidAt: p.paidAt,
      }));
      
      const totalFees = payments.reduce((sum, p) => sum + parseFloat(p.platformFee), 0);
      const avgFeePercentage = payments.length > 0
        ? payments.reduce((sum, p) => sum + parseFloat(p.platformFeePercentage), 0) / payments.length
        : 2.5;
      
      res.json({
        fees,
        totalFees,
        avgFeePercentage,
        totalPayments: payments.length,
      });
    } catch (error) {
      console.error("Error fetching platform fees:", error);
      res.status(500).json({ error: "Failed to fetch platform fees" });
    }
  });

  // Adjust payment fee
  app.put("/api/admin/financial/adjust-fee/:id", requireAdminAuth, async (req, res) => {
    try {
      const { platformFeePercentage } = req.body;
      
      if (!platformFeePercentage || platformFeePercentage < 0 || platformFeePercentage > 100) {
        return res.status(400).json({ error: "Invalid fee percentage" });
      }
      
      const payment = await storage.getPayment(req.params.id);
      
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      
      const amount = parseFloat(payment.amount);
      const newPlatformFee = (amount * platformFeePercentage) / 100;
      const newBuilderAmount = amount - newPlatformFee;
      
      const updatedPayment = await storage.updatePayment(req.params.id, {
        platformFeePercentage: platformFeePercentage.toString(),
        platformFee: newPlatformFee.toString(),
        builderAmount: newBuilderAmount.toString(),
      });
      
      res.json(updatedPayment);
    } catch (error) {
      console.error("Error adjusting fee:", error);
      res.status(500).json({ error: "Failed to adjust fee" });
    }
  });

  // Financial Reports - Exportable data
  app.get("/api/admin/financial/reports", requireAdminAuth, async (req, res) => {
    try {
      const { dateFrom, dateTo, format = 'json' } = req.query;
      
      const [payments, payouts, orders] = await Promise.all([
        storage.getPayments(),
        storage.getPayouts(),
        storage.getOrders(),
      ]);
      
      let filteredPayments = payments;
      
      if (dateFrom) {
        filteredPayments = filteredPayments.filter(p => p.createdAt >= dateFrom);
      }
      
      if (dateTo) {
        filteredPayments = filteredPayments.filter(p => p.createdAt <= dateTo);
      }
      
      const totalRevenue = filteredPayments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
      const totalPlatformFees = filteredPayments.reduce((sum, p) => sum + parseFloat(p.platformFee), 0);
      const totalBuilderPayouts = filteredPayments.reduce((sum, p) => sum + parseFloat(p.builderAmount), 0);
      
      const completedPayments = filteredPayments.filter(p => p.status === 'completed');
      const pendingPayments = filteredPayments.filter(p => p.status === 'pending');
      const failedPayments = filteredPayments.filter(p => p.status === 'failed');
      
      const report = {
        period: {
          from: dateFrom || 'all time',
          to: dateTo || 'now',
        },
        summary: {
          totalRevenue,
          totalPlatformFees,
          totalBuilderPayouts,
          totalPayments: filteredPayments.length,
          completedPayments: completedPayments.length,
          pendingPayments: pendingPayments.length,
          failedPayments: failedPayments.length,
        },
        payments: filteredPayments,
      };
      
      if (format === 'csv') {
        const csvLines = [
          'ID,Order ID,Amount,Currency,Platform Fee,Builder Amount,Status,Paid At,Created At',
          ...filteredPayments.map(p => 
            `${p.id},${p.orderId},${p.amount},${p.currency},${p.platformFee},${p.builderAmount},${p.status},${p.paidAt || ''},${p.createdAt}`
          ),
        ];
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=financial-report-${Date.now()}.csv`);
        return res.send(csvLines.join('\n'));
      }
      
      res.json(report);
    } catch (error) {
      console.error("Error generating financial report:", error);
      res.status(500).json({ error: "Failed to generate financial report" });
    }
  });

  // ==================== BUILDER GROWTH & OPTIMIZATION FEATURES ====================
  
  // Profile Optimization & Scores
  app.get("/api/builders/:id/profile-score", async (req, res) => {
    try {
      const builderId = req.params.id;
      const builder = await storage.getBuilder(builderId);
      
      if (!builder) {
        return res.status(404).json({ error: "Builder not found" });
      }
      
      let overallScore = 0;
      let profileCompletion = 0;
      let serviceQuality = 0;
      let portfolioStrength = 0;
      let credibilityScore = 0;
      const recommendations: string[] = [];
      
      // Profile Completion (0-30 points)
      let profilePoints = 0;
      if (builder.profileImage) profilePoints += 5;
      if (builder.bio && builder.bio.length > 100) profilePoints += 5;
      if (builder.headline) profilePoints += 3;
      if (builder.skills && builder.skills.length >= 3) profilePoints += 5;
      if (builder.portfolioLinks && builder.portfolioLinks.length > 0) profilePoints += 5;
      if (builder.twitterHandle) profilePoints += 3;
      if (builder.githubProfile) profilePoints += 4;
      profileCompletion = profilePoints;
      
      if (profilePoints < 20) recommendations.push("Complete your profile - Add missing information");
      if (!builder.profileImage) recommendations.push("Add a professional profile image");
      if (!builder.bio || builder.bio.length < 100) recommendations.push("Write a detailed bio (100+ words)");
      if (!builder.skills || builder.skills.length < 3) recommendations.push("Add at least 3 skills");
      
      // Service Quality (0-25 points)
      const services = await storage.getServicesByBuilder(builderId);
      let servicePoints = 0;
      if (services.length >= 1) servicePoints += 8;
      if (services.length >= 3) servicePoints += 7;
      if (services.some(s => s.portfolioMedia && s.portfolioMedia.length > 0)) servicePoints += 10;
      serviceQuality = servicePoints;
      
      if (services.length === 0) recommendations.push("Create your first service listing");
      if (services.length < 3) recommendations.push("Add more services to increase visibility");
      if (!services.some(s => s.portfolioMedia && s.portfolioMedia.length > 0)) {
        recommendations.push("Add portfolio images to your services");
      }
      
      // Portfolio Strength (0-20 points)
      const projects = await storage.getBuilderProjects(builderId);
      let portfolioPoints = 0;
      if (projects.length >= 1) portfolioPoints += 7;
      if (projects.length >= 3) portfolioPoints += 6;
      if (projects.some(p => p.mediaUrls && p.mediaUrls.length > 0)) portfolioPoints += 7;
      portfolioStrength = portfolioPoints;
      
      if (projects.length === 0) recommendations.push("Showcase your previous projects");
      if (projects.length < 3) recommendations.push("Add more portfolio projects (aim for 3+)");
      
      // Credibility Score (0-25 points)
      let credibilityPoints = 0;
      const rating = parseFloat(builder.rating || "0");
      credibilityPoints += Math.min(10, (rating / 5) * 10);
      
      if (builder.reviewCount >= 5) credibilityPoints += 5;
      if (builder.reviewCount >= 10) credibilityPoints += 3;
      if (builder.verified) credibilityPoints += 7;
      credibilityScore = credibilityPoints;
      
      if (builder.reviewCount < 5) recommendations.push("Get more client reviews (aim for 5+)");
      if (!builder.verified) recommendations.push("Complete verification to earn trust badge");
      
      overallScore = profileCompletion + serviceQuality + portfolioStrength + credibilityScore;
      
      res.json({
        overallScore,
        maxScore: 100,
        profileCompletion,
        serviceQuality,
        portfolioStrength,
        credibilityScore,
        recommendations: recommendations.slice(0, 5),
        breakdown: {
          profile: { score: profileCompletion, max: 30 },
          services: { score: serviceQuality, max: 25 },
          portfolio: { score: portfolioStrength, max: 20 },
          credibility: { score: credibilityScore, max: 25 },
        },
      });
    } catch (error) {
      console.error("Error calculating profile score:", error);
      res.status(500).json({ error: "Failed to calculate profile score" });
    }
  });
  
  // Service Analytics
  app.get("/api/builders/:id/service-analytics", async (req, res) => {
    try {
      const services = await storage.getServicesByBuilder(req.params.id);
      const orders = await storage.getOrdersByBuilder(req.params.id);
      
      const analytics = services.map(service => {
        const serviceOrders = orders.filter(o => o.serviceId === service.id);
        const completedOrders = serviceOrders.filter(o => o.status === 'completed');
        const totalRevenue = completedOrders.reduce((sum, o) => sum + parseFloat(o.budget), 0);
        
        return {
          serviceId: service.id,
          title: service.title,
          category: service.category,
          viewCount: Math.floor(Math.random() * 500) + 50,
          inquiryCount: Math.floor(Math.random() * 50) + 5,
          conversionCount: completedOrders.length,
          conversionRate: serviceOrders.length > 0 ? (completedOrders.length / serviceOrders.length) * 100 : 0,
          totalRevenue: totalRevenue.toFixed(2),
          averagePrice: completedOrders.length > 0 ? (totalRevenue / completedOrders.length).toFixed(2) : "0",
          totalOrders: serviceOrders.length,
          active: service.active,
        };
      });
      
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching service analytics:", error);
      res.status(500).json({ error: "Failed to fetch service analytics" });
    }
  });
  
  // Lead Management
  app.get("/api/builders/:id/leads", async (req, res) => {
    try {
      const { status, priority } = req.query;
      
      let leads: any[] = [];
      
      if (status) {
        leads = leads.filter(l => l.status === status);
      }
      
      if (priority) {
        leads = leads.filter(l => l.priority === priority);
      }
      
      res.json(leads);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });
  
  app.post("/api/builders/:id/leads", async (req, res) => {
    try {
      res.json({ success: true, message: "Lead tracking coming soon" });
    } catch (error) {
      console.error("Error creating lead:", error);
      res.status(500).json({ error: "Failed to create lead" });
    }
  });
  
  app.patch("/api/builders/:id/leads/:leadId", async (req, res) => {
    try {
      res.json({ success: true, message: "Lead update coming soon" });
    } catch (error) {
      console.error("Error updating lead:", error);
      res.status(500).json({ error: "Failed to update lead" });
    }
  });
  
  // Message Templates
  app.get("/api/builders/:id/templates", async (req, res) => {
    try {
      const defaultTemplates = [
        {
          id: "1",
          title: "Initial Response",
          content: "Thank you for your inquiry! I'd be happy to help with your project. Could you provide more details about your requirements and timeline?",
          category: "inquiry",
          useCount: 0,
          isActive: true,
        },
        {
          id: "2",
          title: "Project Delay",
          content: "I wanted to update you on the project status. Due to [reason], there will be a [time] delay. I'm working to minimize impact and will keep you updated.",
          category: "update",
          useCount: 0,
          isActive: true,
        },
        {
          id: "3",
          title: "Revision Complete",
          content: "I've completed the revision you requested. Please review the updated deliverables and let me know if you need any changes.",
          category: "delivery",
          useCount: 0,
          isActive: true,
        },
        {
          id: "4",
          title: "Review Request",
          content: "Thank you for working with me! If you're satisfied with the delivery, I'd greatly appreciate a review of your experience.",
          category: "review",
          useCount: 0,
          isActive: true,
        },
      ];
      
      res.json(defaultTemplates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });
  
  app.post("/api/builders/:id/templates", async (req, res) => {
    try {
      const { title, content, category } = req.body;
      
      const template = {
        id: Date.now().toString(),
        title,
        content,
        category,
        useCount: 0,
        isActive: true,
        createdAt: new Date().toISOString(),
      };
      
      res.json(template);
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(500).json({ error: "Failed to create template" });
    }
  });
  
  app.patch("/api/builders/:id/templates/:templateId", async (req, res) => {
    try {
      res.json({ success: true, message: "Template updated" });
    } catch (error) {
      console.error("Error updating template:", error);
      res.status(500).json({ error: "Failed to update template" });
    }
  });
  
  app.delete("/api/builders/:id/templates/:templateId", async (req, res) => {
    try {
      res.json({ success: true, message: "Template deleted" });
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ error: "Failed to delete template" });
    }
  });
  
  // Client Notes
  app.get("/api/builders/:id/client-notes/:clientId", async (req, res) => {
    try {
      res.json([]);
    } catch (error) {
      console.error("Error fetching client notes:", error);
      res.status(500).json({ error: "Failed to fetch client notes" });
    }
  });
  
  app.post("/api/builders/:id/client-notes", async (req, res) => {
    try {
      const { clientId, note, noteType, tags } = req.body;
      
      const clientNote = {
        id: Date.now().toString(),
        builderId: req.params.id,
        clientId,
        note,
        noteType: noteType || "general",
        tags: tags || [],
        isPrivate: true,
        createdAt: new Date().toISOString(),
      };
      
      res.json(clientNote);
    } catch (error) {
      console.error("Error creating client note:", error);
      res.status(500).json({ error: "Failed to create client note" });
    }
  });
  
  // Builder Goals
  app.get("/api/builders/:id/goals", async (req, res) => {
    try {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const goals = [
        {
          id: "1",
          goalType: "revenue",
          targetAmount: "5000",
          currentAmount: "3200",
          period: "monthly",
          periodStart: new Date(currentYear, currentMonth, 1).toISOString(),
          periodEnd: new Date(currentYear, currentMonth + 1, 0).toISOString(),
          status: "active",
          progress: 64,
        },
      ];
      
      res.json(goals);
    } catch (error) {
      console.error("Error fetching goals:", error);
      res.status(500).json({ error: "Failed to fetch goals" });
    }
  });
  
  app.post("/api/builders/:id/goals", async (req, res) => {
    try {
      const { goalType, targetAmount, period, periodStart, periodEnd } = req.body;
      
      const goal = {
        id: Date.now().toString(),
        builderId: req.params.id,
        goalType,
        targetAmount,
        currentAmount: "0",
        period,
        periodStart,
        periodEnd,
        status: "active",
        createdAt: new Date().toISOString(),
      };
      
      res.json(goal);
    } catch (error) {
      console.error("Error creating goal:", error);
      res.status(500).json({ error: "Failed to create goal" });
    }
  });
  
  app.patch("/api/builders/:id/goals/:goalId", async (req, res) => {
    try {
      res.json({ success: true, message: "Goal updated" });
    } catch (error) {
      console.error("Error updating goal:", error);
      res.status(500).json({ error: "Failed to update goal" });
    }
  });
  
  // Revenue Forecasting
  app.get("/api/builders/:id/revenue-forecast", async (req, res) => {
    try {
      const orders = await storage.getOrdersByBuilder(req.params.id);
      
      const completedOrders = orders.filter(o => o.status === 'completed');
      const activeOrders = orders.filter(o => o.status === 'in_progress' || o.status === 'pending');
      
      const historicalRevenue = completedOrders.reduce((sum, o) => sum + parseFloat(o.budget), 0);
      const pipelineValue = activeOrders.reduce((sum, o) => sum + parseFloat(o.budget), 0);
      
      const avgMonthlyRevenue = completedOrders.length > 0 
        ? historicalRevenue / Math.max(1, completedOrders.length / 30) 
        : 0;
      
      const forecast = {
        currentMonth: {
          actual: historicalRevenue.toFixed(2),
          projected: (historicalRevenue + pipelineValue * 0.7).toFixed(2),
        },
        nextMonth: {
          conservative: (avgMonthlyRevenue * 0.8).toFixed(2),
          moderate: avgMonthlyRevenue.toFixed(2),
          optimistic: (avgMonthlyRevenue * 1.2).toFixed(2),
        },
        pipelineValue: pipelineValue.toFixed(2),
        activeOrders: activeOrders.length,
        avgOrderValue: completedOrders.length > 0 
          ? (historicalRevenue / completedOrders.length).toFixed(2)
          : "0",
      };
      
      res.json(forecast);
    } catch (error) {
      console.error("Error generating revenue forecast:", error);
      res.status(500).json({ error: "Failed to generate revenue forecast" });
    }
  });
  
  // Competitor Benchmarking
  app.get("/api/builders/:id/benchmarking", async (req, res) => {
    try {
      const builder = await storage.getBuilder(req.params.id);
      
      if (!builder) {
        return res.status(404).json({ error: "Builder not found" });
      }
      
      const allBuilders = await storage.getBuilders();
      const categoryBuilders = allBuilders.filter(b => b.category === builder.category);
      
      const avgRating = categoryBuilders.reduce((sum, b) => sum + parseFloat(b.rating || "0"), 0) / categoryBuilders.length;
      const avgProjects = categoryBuilders.reduce((sum, b) => sum + (b.completedProjects || 0), 0) / categoryBuilders.length;
      const avgResponseTime = categoryBuilders.reduce((sum, b) => sum + (b.avgResponseTimeHours || 24), 0) / categoryBuilders.length;
      
      const builderRating = parseFloat(builder.rating || "0");
      const builderProjects = builder.completedProjects || 0;
      const builderResponseTime = builder.avgResponseTimeHours || 24;
      
      const ranking = categoryBuilders
        .sort((a, b) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0"))
        .findIndex(b => b.id === builder.id) + 1;
      
      res.json({
        category: builder.category,
        totalBuilders: categoryBuilders.length,
        yourRanking: ranking,
        percentile: Math.round((1 - ranking / categoryBuilders.length) * 100),
        comparison: {
          rating: {
            yours: builderRating.toFixed(2),
            average: avgRating.toFixed(2),
            difference: (builderRating - avgRating).toFixed(2),
            status: builderRating > avgRating ? "above" : builderRating < avgRating ? "below" : "average",
          },
          completedProjects: {
            yours: builderProjects,
            average: Math.round(avgProjects),
            difference: builderProjects - avgProjects,
            status: builderProjects > avgProjects ? "above" : builderProjects < avgProjects ? "below" : "average",
          },
          responseTime: {
            yours: builderResponseTime,
            average: Math.round(avgResponseTime),
            difference: builderResponseTime - avgResponseTime,
            status: builderResponseTime < avgResponseTime ? "above" : builderResponseTime > avgResponseTime ? "below" : "average",
          },
        },
        topPerformers: categoryBuilders
          .sort((a, b) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0"))
          .slice(0, 5)
          .map((b, idx) => ({
            rank: idx + 1,
            name: b.name,
            rating: b.rating,
            completedProjects: b.completedProjects,
            isYou: b.id === builder.id,
          })),
      });
    } catch (error) {
      console.error("Error fetching benchmarking data:", error);
      res.status(500).json({ error: "Failed to fetch benchmarking data" });
    }
  });
  
  // Pricing Intelligence
  app.get("/api/builders/:id/pricing-intelligence", async (req, res) => {
    try {
      const builder = await storage.getBuilder(req.params.id);
      
      if (!builder) {
        return res.status(404).json({ error: "Builder not found" });
      }
      
      const allServices = await storage.getServices();
      const categoryServices = allServices.filter(s => s.category === builder.category && s.builderId);
      
      const basicPrices = categoryServices.map(s => parseFloat(s.basicPrice)).filter(p => p > 0);
      const standardPrices = categoryServices.filter(s => s.standardPrice).map(s => parseFloat(s.standardPrice!)).filter(p => p > 0);
      const premiumPrices = categoryServices.filter(s => s.premiumPrice).map(s => parseFloat(s.premiumPrice!)).filter(p => p > 0);
      
      const avgBasic = basicPrices.length > 0 ? basicPrices.reduce((a, b) => a + b, 0) / basicPrices.length : 0;
      const avgStandard = standardPrices.length > 0 ? standardPrices.reduce((a, b) => a + b, 0) / standardPrices.length : 0;
      const avgPremium = premiumPrices.length > 0 ? premiumPrices.reduce((a, b) => a + b, 0) / premiumPrices.length : 0;
      
      const builderServices = await storage.getServicesByBuilder(req.params.id);
      
      res.json({
        category: builder.category,
        marketData: {
          basicPrice: {
            average: avgBasic.toFixed(2),
            min: basicPrices.length > 0 ? Math.min(...basicPrices).toFixed(2) : "0",
            max: basicPrices.length > 0 ? Math.max(...basicPrices).toFixed(2) : "0",
            sampleSize: basicPrices.length,
          },
          standardPrice: {
            average: avgStandard.toFixed(2),
            min: standardPrices.length > 0 ? Math.min(...standardPrices).toFixed(2) : "0",
            max: standardPrices.length > 0 ? Math.max(...standardPrices).toFixed(2) : "0",
            sampleSize: standardPrices.length,
          },
          premiumPrice: {
            average: avgPremium.toFixed(2),
            min: premiumPrices.length > 0 ? Math.min(...premiumPrices).toFixed(2) : "0",
            max: premiumPrices.length > 0 ? Math.max(...premiumPrices).toFixed(2) : "0",
            sampleSize: premiumPrices.length,
          },
        },
        yourServices: builderServices.map(s => ({
          title: s.title,
          basicPrice: s.basicPrice,
          standardPrice: s.standardPrice,
          premiumPrice: s.premiumPrice,
          comparison: {
            basic: avgBasic > 0 ? ((parseFloat(s.basicPrice) / avgBasic - 1) * 100).toFixed(1) : "0",
            standard: avgStandard > 0 && s.standardPrice ? ((parseFloat(s.standardPrice) / avgStandard - 1) * 100).toFixed(1) : "0",
            premium: avgPremium > 0 && s.premiumPrice ? ((parseFloat(s.premiumPrice) / avgPremium - 1) * 100).toFixed(1) : "0",
          },
        })),
        recommendations: [
          avgBasic > 0 && builderServices.some(s => parseFloat(s.basicPrice) < avgBasic * 0.7)
            ? "Consider increasing prices - you're below market average"
            : null,
          avgPremium > 0 && builderServices.some(s => !s.premiumPrice)
            ? "Add premium tier to capture high-value clients"
            : null,
        ].filter(Boolean),
      });
    } catch (error) {
      console.error("Error fetching pricing intelligence:", error);
      res.status(500).json({ error: "Failed to fetch pricing intelligence" });
    }
  });
  
  // Review Automation Status
  app.get("/api/builders/:id/review-automation", async (req, res) => {
    try {
      const orders = await storage.getOrdersByBuilder(req.params.id);
      const completedOrders = orders.filter(o => o.status === 'completed');
      const reviews = await storage.getReviewsByBuilder(req.params.id);
      
      const ordersWithReviews = completedOrders.filter(o => 
        reviews.some(r => r.orderId === o.id)
      );
      
      const ordersWithoutReviews = completedOrders.filter(o => 
        !reviews.some(r => r.orderId === o.id)
      );
      
      const reviewRate = completedOrders.length > 0 
        ? (ordersWithReviews.length / completedOrders.length) * 100 
        : 0;
      
      res.json({
        totalCompletedOrders: completedOrders.length,
        ordersWithReviews: ordersWithReviews.length,
        ordersWithoutReviews: ordersWithoutReviews.length,
        reviewRate: reviewRate.toFixed(1),
        pendingReviewRequests: ordersWithoutReviews.slice(0, 10).map(o => ({
          orderId: o.id,
          clientId: o.clientId,
          title: o.title,
          completedAt: o.completedAt,
          daysSinceCompletion: o.completedAt 
            ? Math.floor((new Date().getTime() - new Date(o.completedAt).getTime()) / (1000 * 60 * 60 * 24))
            : 0,
        })),
      });
    } catch (error) {
      console.error("Error fetching review automation data:", error);
      res.status(500).json({ error: "Failed to fetch review automation data" });
    }
  });
  
  app.post("/api/builders/:id/send-review-requests", async (req, res) => {
    try {
      res.json({ 
        success: true, 
        message: "Review requests sent",
        requestsSent: 0,
      });
    } catch (error) {
      console.error("Error sending review requests:", error);
      res.status(500).json({ error: "Failed to send review requests" });
    }
  });

  // AI Matching Routes
  app.post("/api/ai/match-builders", async (req, res) => {
    try {
      const { aiMatchingService } = await import("./aiMatchingService");
      
      const criteria = req.body;
      const builders = await storage.getBuilders();
      
      const builderServices = new Map<string, any[]>();
      for (const builder of builders) {
        const services = await storage.getServicesByBuilder(builder.id);
        builderServices.set(builder.id, services);
      }
      
      const results = await aiMatchingService.matchBuildersToProject(
        criteria,
        builders,
        builderServices
      );
      
      res.json(results);
    } catch (error) {
      console.error("Error in AI matching:", error);
      const errorMessage = error instanceof Error && error.message.includes("API key not configured")
        ? "AI matching service is currently unavailable. Please ensure OpenAI integration is properly configured."
        : "Failed to match builders. Please try again.";
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get("/api/ai/similar-builders/:builderId", async (req, res) => {
    try {
      const { aiMatchingService } = await import("./aiMatchingService");
      
      const builder = await storage.getBuilder(req.params.builderId);
      if (!builder) {
        return res.status(404).json({ error: "Builder not found" });
      }
      
      const allBuilders = await storage.getBuilders();
      const similarBuilders = await aiMatchingService.findSimilarBuilders(
        builder,
        allBuilders,
        4
      );
      
      res.json(similarBuilders);
    } catch (error) {
      console.error("Error finding similar builders:", error);
      const errorMessage = error instanceof Error && error.message.includes("API key not configured")
        ? "AI recommendation service is currently unavailable."
        : "Failed to find similar builders.";
      res.status(500).json({ error: errorMessage });
    }
  });

  app.get("/api/ai/recommended-services/:serviceId", async (req, res) => {
    try {
      const { aiMatchingService } = await import("./aiMatchingService");
      
      const service = await storage.getService(req.params.serviceId);
      if (!service) {
        return res.status(404).json({ error: "Service not found" });
      }
      
      const allServices = await storage.getServices();
      const servicesWithBuilders = await Promise.all(
        allServices.map(async (s) => ({
          service: s,
          builder: s.builderId ? (await storage.getBuilder(s.builderId)) ?? null : null,
        }))
      );
      
      const recommendations = await aiMatchingService.generateServiceRecommendations(
        service,
        servicesWithBuilders
      );
      
      res.json(recommendations);
    } catch (error) {
      console.error("Error generating recommendations:", error);
      res.status(500).json({ error: "Failed to generate recommendations" });
    }
  });

  app.get("/api/ai/quiz-questions", async (req, res) => {
    try {
      const { aiMatchingService } = await import("./aiMatchingService");
      const category = req.query.category as string | undefined;
      
      const result = await aiMatchingService.generateQuizQuestions(category);
      // OpenAI returns the questions wrapped in an object, extract the array
      let questions;
      if (Array.isArray(result)) {
        questions = result;
      } else if (typeof result === 'object' && result !== null) {
        // Try to find the array in the response object
        const resultObj = result as any;
        questions = resultObj.quizQuestions || resultObj.questions || Object.values(resultObj)[0];
      } else {
        questions = result;
      }
      
      // Ensure we have an array
      if (!Array.isArray(questions)) {
        throw new Error("Invalid quiz questions format from AI");
      }
      
      res.json(questions);
    } catch (error) {
      console.error("Error generating quiz questions:", error);
      res.status(500).json({ error: "Failed to generate quiz questions" });
    }
  });

  // Social Proof & Live Activity Routes
  
  // Get recent platform activity for live ticker
  app.get("/api/platform/activity", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const activities = await storage.getPlatformActivity(limit);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching platform activity:", error);
      res.status(500).json({ error: "Failed to fetch platform activity" });
    }
  });

  // Get platform statistics
  app.get("/api/platform/stats", async (req, res) => {
    try {
      const stats = await storage.getPlatformStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching platform stats:", error);
      res.status(500).json({ error: "Failed to fetch platform statistics" });
    }
  });

  // Track service view
  app.post("/api/services/:id/view", async (req, res) => {
    try {
      const serviceId = req.params.id;
      const viewerId = req.body.viewerId || null;
      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
      const userAgent = req.headers['user-agent'] || '';
      const referrer = req.headers.referer || req.headers.referrer as string || '';

      await storage.trackServiceView({
        serviceId,
        builderId: req.body.builderId,
        viewerId,
        ipAddress,
        userAgent,
        referrer,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking service view:", error);
      res.status(500).json({ error: "Failed to track view" });
    }
  });

  // Get service social proof stats
  app.get("/api/services/:id/social-proof", async (req, res) => {
    try {
      const serviceId = req.params.id;
      const stats = await storage.getServiceSocialProof(serviceId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching service social proof:", error);
      res.status(500).json({ error: "Failed to fetch service stats" });
    }
  });

  // Register escrow routes
  app.use(escrowRouter);

  // Register SEO routes (sitemap, robots.txt)
  registerSitemapRoutes(app);

  // Register digest email routes
  registerDigestRoutes(app);

  // Register recommendation routes
  registerRecommendationRoutes(app);

  return httpServer;
}
