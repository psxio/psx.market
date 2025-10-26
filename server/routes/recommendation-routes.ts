import type { Express } from "express";
import { getCollaborativeRecommendations, getSimilarBuilders } from "../recommendations/collaborative-filtering";
import { getPriceOptimizationSuggestions, getSuccessPredictionScore } from "../recommendations/ai-recommendations";

export function registerRecommendationRoutes(app: Express) {
  app.get("/api/recommendations/collaborative/:userId", async (req, res, next) => {
    try {
      const { userId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const userType = req.query.userType as "client" | "builder";

      const recommendations = await getCollaborativeRecommendations(userId, userType, limit);
      res.json(recommendations);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/recommendations/similar-builders/:builderId", async (req, res, next) => {
    try {
      const { builderId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;

      const similarBuilderIds = await getSimilarBuilders(builderId, limit);
      res.json({ builderIds: similarBuilderIds });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/recommendations/price-optimization/:builderId", async (req, res, next) => {
    try {
      const { builderId } = req.params;
      const serviceId = req.query.serviceId as string | undefined;

      const suggestions = await getPriceOptimizationSuggestions(builderId, serviceId);
      res.json(suggestions);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/recommendations/success-prediction", async (req, res, next) => {
    try {
      const { clientId, builderId } = req.body;

      if (!clientId || !builderId) {
        return res.status(400).json({ error: "clientId and builderId are required" });
      }

      const prediction = await getSuccessPredictionScore(clientId, builderId);
      res.json(prediction);
    } catch (error) {
      next(error);
    }
  });
}
