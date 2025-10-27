import type { Express } from "express";
import { storage } from "../storage";

// Badge tier thresholds
const BADGE_CRITERIA = {
  rising_star: {
    minCompletedProjects: 5,
    minRating: 4.5,
    minReviewCount: 3,
  },
  pro: {
    minCompletedProjects: 25,
    minRating: 4.7,
    minReviewCount: 15,
    minSuccessRate: 95,
  },
  elite: {
    minCompletedProjects: 100,
    minRating: 4.8,
    minReviewCount: 50,
    minSuccessRate: 97,
    minOnTimeDelivery: 95,
  },
  legend: {
    minCompletedProjects: 250,
    minRating: 4.9,
    minReviewCount: 100,
    minSuccessRate: 98,
    minOnTimeDelivery: 97,
    minTotalEarnings: 50000,
  },
};

function checkBadgeEligibility(builder: any): string[] {
  const eligibleBadges: string[] = [];
  
  const stats = {
    completedProjects: builder.completedProjects || 0,
    rating: parseFloat(builder.rating || "0"),
    reviewCount: builder.reviewCount || 0,
    successRate: parseFloat(builder.successRate || "100"),
    onTimeDelivery: parseFloat(builder.onTimeDeliveryRate || "100"),
    totalEarnings: parseFloat(builder.totalEarnings || "0"),
  };

  // Check Legend
  if (
    stats.completedProjects >= BADGE_CRITERIA.legend.minCompletedProjects &&
    stats.rating >= BADGE_CRITERIA.legend.minRating &&
    stats.reviewCount >= BADGE_CRITERIA.legend.minReviewCount &&
    stats.successRate >= BADGE_CRITERIA.legend.minSuccessRate &&
    stats.onTimeDelivery >= BADGE_CRITERIA.legend.minOnTimeDelivery &&
    stats.totalEarnings >= BADGE_CRITERIA.legend.minTotalEarnings
  ) {
    eligibleBadges.push('legend');
  }
  
  // Check Elite
  if (
    stats.completedProjects >= BADGE_CRITERIA.elite.minCompletedProjects &&
    stats.rating >= BADGE_CRITERIA.elite.minRating &&
    stats.reviewCount >= BADGE_CRITERIA.elite.minReviewCount &&
    stats.successRate >= BADGE_CRITERIA.elite.minSuccessRate &&
    stats.onTimeDelivery >= BADGE_CRITERIA.elite.minOnTimeDelivery
  ) {
    eligibleBadges.push('elite');
  }
  
  // Check Pro
  if (
    stats.completedProjects >= BADGE_CRITERIA.pro.minCompletedProjects &&
    stats.rating >= BADGE_CRITERIA.pro.minRating &&
    stats.reviewCount >= BADGE_CRITERIA.pro.minReviewCount &&
    stats.successRate >= BADGE_CRITERIA.pro.minSuccessRate
  ) {
    eligibleBadges.push('pro');
  }
  
  // Check Rising Star
  if (
    stats.completedProjects >= BADGE_CRITERIA.rising_star.minCompletedProjects &&
    stats.rating >= BADGE_CRITERIA.rising_star.minRating &&
    stats.reviewCount >= BADGE_CRITERIA.rising_star.minReviewCount
  ) {
    eligibleBadges.push('rising_star');
  }
  
  return eligibleBadges;
}

export function registerBadgeRoutes(app: Express) {
  
  // Get badge criteria
  app.get("/api/badges/criteria", (_req, res) => {
    res.json(BADGE_CRITERIA);
  });

  // Get builder badges
  app.get("/api/builders/:builderId/badges", async (req, res) => {
    try {
      const { builderId } = req.params;
      const badges = await storage.getBuilderBadges(builderId);
      res.json(badges);
    } catch (error) {
      console.error("Error fetching badges:", error);
      res.status(500).json({ error: "Failed to fetch badges" });
    }
  });

  // Check and award eligible badges
  app.post("/api/builders/:builderId/badges/check", async (req, res) => {
    try {
      const { builderId } = req.params;
      
      const builder = await storage.getBuilder(builderId);
      if (!builder) {
        return res.status(404).json({ error: "Builder not found" });
      }

      const eligibleBadges = checkBadgeEligibility(builder);
      const existingBadges = await storage.getBuilderBadges(builderId);
      const existingBadgeTypes = existingBadges.map(b => b.badgeType);
      
      const newBadges = [];
      
      for (const badgeType of eligibleBadges) {
        if (!existingBadgeTypes.includes(badgeType)) {
          const badge = await storage.createBuilderBadge({
            builderId,
            badgeType,
            badgeLabel: badgeType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
            badgeColor: getBadgeColor(badgeType),
            badgeIcon: getBadgeIcon(badgeType),
            isActive: true,
          });
          newBadges.push(badge);
        }
      }
      
      res.json({
        eligibleBadges,
        newBadgesAwarded: newBadges.length,
        newBadges,
      });
    } catch (error) {
      console.error("Error checking badges:", error);
      res.status(500).json({ error: "Failed to check badges" });
    }
  });

  // Get builder's progress towards next badge
  app.get("/api/builders/:builderId/badges/progress", async (req, res) => {
    try {
      const { builderId } = req.params;
      
      const builder = await storage.getBuilder(builderId);
      if (!builder) {
        return res.status(404).json({ error: "Builder not found" });
      }

      const existingBadges = await storage.getBuilderBadges(builderId);
      const hasBadges = existingBadges.map(b => b.badgeType);
      
      let nextBadge = null;
      let progress: any = {};
      
      // Determine next badge tier
      if (!hasBadges.includes('rising_star')) {
        nextBadge = 'rising_star';
        progress = {
          completedProjects: {
            current: builder.completedProjects || 0,
            required: BADGE_CRITERIA.rising_star.minCompletedProjects,
            percentage: Math.min(100, ((builder.completedProjects || 0) / BADGE_CRITERIA.rising_star.minCompletedProjects) * 100),
          },
          rating: {
            current: parseFloat(builder.rating || "0"),
            required: BADGE_CRITERIA.rising_star.minRating,
            percentage: Math.min(100, (parseFloat(builder.rating || "0") / BADGE_CRITERIA.rising_star.minRating) * 100),
          },
          reviewCount: {
            current: builder.reviewCount || 0,
            required: BADGE_CRITERIA.rising_star.minReviewCount,
            percentage: Math.min(100, ((builder.reviewCount || 0) / BADGE_CRITERIA.rising_star.minReviewCount) * 100),
          },
        };
      } else if (!hasBadges.includes('pro')) {
        nextBadge = 'pro';
        const criteria = BADGE_CRITERIA.pro;
        progress = {
          completedProjects: {
            current: builder.completedProjects || 0,
            required: criteria.minCompletedProjects,
            percentage: Math.min(100, ((builder.completedProjects || 0) / criteria.minCompletedProjects) * 100),
          },
          rating: {
            current: parseFloat(builder.rating || "0"),
            required: criteria.minRating,
            percentage: Math.min(100, (parseFloat(builder.rating || "0") / criteria.minRating) * 100),
          },
          reviewCount: {
            current: builder.reviewCount || 0,
            required: criteria.minReviewCount,
            percentage: Math.min(100, ((builder.reviewCount || 0) / criteria.minReviewCount) * 100),
          },
          successRate: {
            current: parseFloat(builder.successRate || "100"),
            required: criteria.minSuccessRate,
            percentage: Math.min(100, (parseFloat(builder.successRate || "100") / criteria.minSuccessRate) * 100),
          },
        };
      } else if (!hasBadges.includes('elite')) {
        nextBadge = 'elite';
        const criteria = BADGE_CRITERIA.elite;
        progress = {
          completedProjects: {
            current: builder.completedProjects || 0,
            required: criteria.minCompletedProjects,
            percentage: Math.min(100, ((builder.completedProjects || 0) / criteria.minCompletedProjects) * 100),
          },
          rating: {
            current: parseFloat(builder.rating || "0"),
            required: criteria.minRating,
            percentage: Math.min(100, (parseFloat(builder.rating || "0") / criteria.minRating) * 100),
          },
          reviewCount: {
            current: builder.reviewCount || 0,
            required: criteria.minReviewCount,
            percentage: Math.min(100, ((builder.reviewCount || 0) / criteria.minReviewCount) * 100),
          },
          successRate: {
            current: parseFloat(builder.successRate || "100"),
            required: criteria.minSuccessRate,
            percentage: Math.min(100, (parseFloat(builder.successRate || "100") / criteria.minSuccessRate) * 100),
          },
          onTimeDelivery: {
            current: parseFloat(builder.onTimeDeliveryRate || "100"),
            required: criteria.minOnTimeDelivery,
            percentage: Math.min(100, (parseFloat(builder.onTimeDeliveryRate || "100") / criteria.minOnTimeDelivery) * 100),
          },
        };
      } else if (!hasBadges.includes('legend')) {
        nextBadge = 'legend';
        const criteria = BADGE_CRITERIA.legend;
        progress = {
          completedProjects: {
            current: builder.completedProjects || 0,
            required: criteria.minCompletedProjects,
            percentage: Math.min(100, ((builder.completedProjects || 0) / criteria.minCompletedProjects) * 100),
          },
          rating: {
            current: parseFloat(builder.rating || "0"),
            required: criteria.minRating,
            percentage: Math.min(100, (parseFloat(builder.rating || "0") / criteria.minRating) * 100),
          },
          reviewCount: {
            current: builder.reviewCount || 0,
            required: criteria.minReviewCount,
            percentage: Math.min(100, ((builder.reviewCount || 0) / criteria.minReviewCount) * 100),
          },
          successRate: {
            current: parseFloat(builder.successRate || "100"),
            required: criteria.minSuccessRate,
            percentage: Math.min(100, (parseFloat(builder.successRate || "100") / criteria.minSuccessRate) * 100),
          },
          onTimeDelivery: {
            current: parseFloat(builder.onTimeDeliveryRate || "100"),
            required: criteria.minOnTimeDelivery,
            percentage: Math.min(100, (parseFloat(builder.onTimeDeliveryRate || "100") / criteria.minOnTimeDelivery) * 100),
          },
          totalEarnings: {
            current: parseFloat(builder.totalEarnings || "0"),
            required: criteria.minTotalEarnings,
            percentage: Math.min(100, (parseFloat(builder.totalEarnings || "0") / criteria.minTotalEarnings) * 100),
          },
        };
      }
      
      res.json({
        nextBadge,
        progress,
        currentBadges: hasBadges,
      });
    } catch (error) {
      console.error("Error fetching badge progress:", error);
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });
}

function getBadgeColor(badgeType: string): string {
  const colors: Record<string, string> = {
    rising_star: 'blue',
    pro: 'purple',
    elite: 'gold',
    legend: 'gradient-primary',
  };
  return colors[badgeType] || 'gray';
}

function getBadgeIcon(badgeType: string): string {
  const icons: Record<string, string> = {
    rising_star: 'star',
    pro: 'shield',
    elite: 'crown',
    legend: 'trophy',
  };
  return icons[badgeType] || 'badge';
}
