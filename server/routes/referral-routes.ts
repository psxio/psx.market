import type { Express } from "express";
import { storage } from "../storage";
import { requireBuilderAuth } from "../middleware/auth";

function generateReferralCode(name: string): string {
  const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${cleanName}${random}`;
}

export function registerReferralRoutes(app: Express) {
  
  // Get or create builder referral code
  app.get("/api/builders/:builderId/referral-code", requireBuilderAuth, async (req, res) => {
    try {
      const { builderId } = req.params;
      
      // Verify the builder owns this referral code
      if (req.session.builderId !== builderId) {
        return res.status(403).json({ error: "Forbidden - Can only access your own referral code" });
      }
      
      const builder = await storage.getBuilder(builderId);
      if (!builder) {
        return res.status(404).json({ error: "Builder not found" });
      }

      let referralCode = await storage.getBuilderReferralCode(builderId);
      
      if (!referralCode) {
        // Create new referral code
        const code = generateReferralCode(builder.name);
        referralCode = await storage.createReferralCode({
          builderId,
          code,
          isActive: true,
        });
      }
      
      res.json(referralCode);
    } catch (error) {
      console.error("Error fetching referral code:", error);
      res.status(500).json({ error: "Failed to fetch referral code" });
    }
  });

  // Track referral click
  app.post("/api/referrals/:code/click", async (req, res) => {
    try {
      const { code } = req.params;
      await storage.incrementReferralClicks(code);
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking referral click:", error);
      res.status(500).json({ error: "Failed to track click" });
    }
  });

  // Get builder's referrals
  app.get("/api/builders/:builderId/referrals", requireBuilderAuth, async (req, res) => {
    try {
      const { builderId } = req.params;
      
      // Verify the builder owns these referrals
      if (req.session.builderId !== builderId) {
        return res.status(403).json({ error: "Forbidden - Can only access your own referrals" });
      }
      
      const builder = await storage.getBuilder(builderId);
      if (!builder) {
        return res.status(404).json({ error: "Builder not found" });
      }

      const referrals = await storage.getBuilderReferrals(builder.walletAddress);
      
      // Calculate stats
      const stats = {
        totalReferrals: referrals.length,
        pendingReferrals: referrals.filter(r => r.status === 'pending').length,
        completedReferrals: referrals.filter(r => r.status === 'completed').length,
        totalEarnings: referrals.reduce((sum, r) => sum + parseFloat(r.reward || "0"), 0),
        totalRevenue: referrals.reduce((sum, r) => sum + parseFloat(r.totalRevenueGenerated || "0"), 0),
      };
      
      res.json({
        stats,
        referrals: referrals.map(r => ({
          id: r.id,
          referredWallet: r.referredWallet,
          referredType: r.referredType,
          status: r.status,
          reward: r.reward,
          rewardPaid: r.rewardPaid,
          totalOrdersGenerated: r.totalOrdersGenerated,
          totalRevenueGenerated: r.totalRevenueGenerated,
          createdAt: r.createdAt,
          completedAt: r.completedAt,
        }))
      });
    } catch (error) {
      console.error("Error fetching referrals:", error);
      res.status(500).json({ error: "Failed to fetch referrals" });
    }
  });

  // Create new referral
  app.post("/api/referrals", async (req, res) => {
    try {
      const { referrerWallet, referredWallet, referrerType, referredType, referralCode } = req.body;
      
      if (!referrerWallet || !referredWallet || !referralCode) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Check if referral already exists
      const existing = await storage.getReferralByWallets(referrerWallet, referredWallet);
      if (existing) {
        return res.status(409).json({ error: "Referral already exists" });
      }

      const referral = await storage.createReferral({
        referrerWallet,
        referredWallet,
        referrerType: referrerType || 'builder',
        referredType: referredType || 'client',
        referralCode,
        status: 'pending',
        totalOrdersGenerated: 0,
        totalRevenueGenerated: "0",
      });
      
      await storage.incrementReferralSignups(referralCode);
      
      res.status(201).json(referral);
    } catch (error) {
      console.error("Error creating referral:", error);
      res.status(500).json({ error: "Failed to create referral" });
    }
  });

  // Complete referral (triggered when first order completes)
  // This should be called internally by the order completion system, not by users
  app.post("/api/referrals/:referralId/complete", requireBuilderAuth, async (req, res) => {
    try {
      const { referralId } = req.params;
      const { orderId } = req.body;
      
      // First, load the referral to verify ownership
      const existingReferral = await storage.getReferral(referralId);
      if (!existingReferral) {
        return res.status(404).json({ error: "Referral not found" });
      }
      
      // Verify the order exists and get the actual amount from the order
      const order = await storage.getOrder(orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      // Verify the builder completing the referral is the one who made the referral
      const builder = await storage.getBuilder(req.session.builderId);
      if (!builder) {
        return res.status(404).json({ error: "Builder not found" });
      }
      
      // Check if this referral belongs to the authenticated builder
      if (existingReferral.referrerWallet !== builder.walletAddress) {
        return res.status(403).json({ error: "Forbidden - This referral does not belong to you" });
      }
      
      // Verify the order belongs to the referred user
      if (order.clientAddress !== existingReferral.referredWallet && order.builderId !== existingReferral.referredWallet) {
        return res.status(400).json({ error: "Order does not belong to the referred user" });
      }
      
      // Calculate reward based on actual order amount (from database, not user input)
      const orderAmount = parseFloat(order.totalAmount);
      const reward = (orderAmount * 0.1).toFixed(2); // 10% commission
      
      const referral = await storage.updateReferral(referralId, {
        status: 'completed',
        completedAt: new Date().toISOString(),
        firstOrderId: orderId,
        firstOrderCompletedAt: new Date().toISOString(),
        reward,
      });
      
      if (referral) {
        await storage.incrementReferralConversions(referral.referralCode);
      }
      
      res.json(referral);
    } catch (error) {
      console.error("Error completing referral:", error);
      res.status(500).json({ error: "Failed to complete referral" });
    }
  });

  // Get referral stats
  app.get("/api/builders/:builderId/referral-stats", requireBuilderAuth, async (req, res) => {
    try {
      const { builderId } = req.params;
      
      // Verify the builder owns these stats
      if (req.session.builderId !== builderId) {
        return res.status(403).json({ error: "Forbidden - Can only access your own referral stats" });
      }
      
      const builder = await storage.getBuilder(builderId);
      if (!builder) {
        return res.status(404).json({ error: "Builder not found" });
      }

      const referralCode = await storage.getBuilderReferralCode(builderId);
      const referrals = await storage.getBuilderReferrals(builder.walletAddress);
      
      const stats = {
        totalClicks: referralCode?.totalClicks || 0,
        totalSignups: referralCode?.totalSignups || 0,
        totalConversions: referralCode?.totalConversions || 0,
        totalEarnings: referralCode?.totalEarnings || "0",
        conversionRate: 0,
        referralLink: referralCode ? `https://port444.shop?ref=${referralCode.code}` : null,
      };
      
      if (stats.totalSignups > 0) {
        stats.conversionRate = (stats.totalConversions / stats.totalSignups) * 100;
      }
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching referral stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });
}
