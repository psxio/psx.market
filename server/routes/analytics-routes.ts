import type { Express } from "express";
import { storage } from "../storage";
import { requireBuilderAuth } from "../middleware/auth";

export function registerAnalyticsRoutes(app: Express) {
  
  // Get builder analytics dashboard data
  app.get("/api/builders/:builderId/analytics/dashboard", requireBuilderAuth, async (req, res) => {
    try {
      const { builderId } = req.params;
      
      // Verify the builder owns this data
      if (req.session.builderId !== builderId) {
        return res.status(403).json({ error: "Forbidden - Can only access your own analytics" });
      }
      const { period = "30d" } = req.query;
      
      const builder = await storage.getBuilder(builderId);
      if (!builder) {
        return res.status(404).json({ error: "Builder not found" });
      }

      // Get date range based on period
      const now = new Date();
      const startDate = new Date();
      if (period === "7d") startDate.setDate(now.getDate() - 7);
      else if (period === "30d") startDate.setDate(now.getDate() - 30);
      else if (period === "90d") startDate.setDate(now.getDate() - 90);
      else startDate.setDate(now.getDate() - 365); // 1y

      const analytics = await storage.getBuilderAnalytics(builderId, startDate.toISOString().split('T')[0]);
      
      // Calculate summary metrics
      const summary = {
        totalProfileViews: analytics.reduce((sum, a) => sum + (a.profileViews || 0), 0),
        totalUniqueVisitors: analytics.reduce((sum, a) => sum + (a.uniqueVisitors || 0), 0),
        totalServiceImpressions: analytics.reduce((sum, a) => sum + (a.serviceImpressions || 0), 0),
        totalServiceClicks: analytics.reduce((sum, a) => sum + (a.serviceClicks || 0), 0),
        totalInquiries: analytics.reduce((sum, a) => sum + (a.inquiriesReceived || 0), 0),
        totalOrders: analytics.reduce((sum, a) => sum + (a.ordersReceived || 0), 0),
        totalRevenue: analytics.reduce((sum, a) => sum + parseFloat(a.revenue || "0"), 0),
        conversionRate: 0,
        avgResponseTime: 0,
      };

      if (summary.totalInquiries > 0) {
        summary.conversionRate = (summary.totalOrders / summary.totalInquiries) * 100;
      }

      const responseTimeEntries = analytics.filter(a => a.avgResponseTimeMinutes);
      if (responseTimeEntries.length > 0) {
        summary.avgResponseTime = Math.round(
          responseTimeEntries.reduce((sum, a) => sum + (a.avgResponseTimeMinutes || 0), 0) / responseTimeEntries.length
        );
      }

      res.json({
        summary,
        dailyData: analytics,
        builder: {
          name: builder.name,
          profileImage: builder.profileImage,
          rating: builder.rating,
          reviewCount: builder.reviewCount,
          completedProjects: builder.completedProjects,
        }
      });
    } catch (error) {
      console.error("Error fetching builder analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Get service-level analytics
  app.get("/api/builders/:builderId/analytics/services", requireBuilderAuth, async (req, res) => {
    try {
      const { builderId } = req.params;
      
      // Verify the builder owns this data
      if (req.session.builderId !== builderId) {
        return res.status(403).json({ error: "Forbidden - Can only access your own analytics" });
      }
      
      const services = await storage.getBuilderServices(builderId);
      const serviceAnalytics = await Promise.all(
        services.map(async (service) => {
          const analytics = await storage.getServiceAnalytics(service.id);
          return {
            serviceId: service.id,
            title: service.title,
            category: service.category,
            ...analytics
          };
        })
      );

      res.json(serviceAnalytics);
    } catch (error) {
      console.error("Error fetching service analytics:", error);
      res.status(500).json({ error: "Failed to fetch service analytics" });
    }
  });

  // Get earnings overview
  app.get("/api/builders/:builderId/analytics/earnings", requireBuilderAuth, async (req, res) => {
    try {
      const { builderId } = req.params;
      
      // Verify the builder owns this data
      if (req.session.builderId !== builderId) {
        return res.status(403).json({ error: "Forbidden - Can only access your own analytics" });
      }
      const { period = "30d" } = req.query;
      
      const builder = await storage.getBuilder(builderId);
      if (!builder) {
        return res.status(404).json({ error: "Builder not found" });
      }

      const now = new Date();
      const startDate = new Date();
      if (period === "7d") startDate.setDate(now.getDate() - 7);
      else if (period === "30d") startDate.setDate(now.getDate() - 30);
      else if (period === "90d") startDate.setDate(now.getDate() - 90);
      else startDate.setDate(now.getDate() - 365);

      const analytics = await storage.getBuilderAnalytics(builderId, startDate.toISOString().split('T')[0]);
      
      res.json({
        totalEarnings: builder.totalEarnings,
        availableBalance: builder.availableBalance,
        pendingPayouts: builder.pendingPayouts,
        dailyEarnings: analytics.map(a => ({
          date: a.date,
          revenue: parseFloat(a.revenue || "0"),
        })),
      });
    } catch (error) {
      console.error("Error fetching earnings:", error);
      res.status(500).json({ error: "Failed to fetch earnings" });
    }
  });

  // Track profile view
  app.post("/api/builders/:builderId/analytics/view", async (req, res) => {
    try {
      const { builderId } = req.params;
      const { viewerId, viewerType, referrer } = req.body;
      
      const ipAddress = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';
      const userAgent = req.headers['user-agent'] || 'unknown';

      await storage.trackBuilderView({
        builderId,
        viewerId: viewerId || null,
        viewerType: viewerType || null,
        ipAddress,
        userAgent,
        referrer: referrer || null,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking view:", error);
      res.status(500).json({ error: "Failed to track view" });
    }
  });
}
