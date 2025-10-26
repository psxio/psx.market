import { storage } from "../storage";
import type { Builder, Service } from "@shared/schema";

// Lazy-load OpenAI to make it optional
let openaiClient: any = null;
let openaiAvailable = false;

async function getOpenAI() {
  if (openaiClient) return openaiClient;
  
  try {
    const OpenAI = (await import("openai")).default;
    // This is using Replit's AI Integrations service, which provides OpenAI-compatible API access without requiring your own OpenAI API key.
    // the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
    openaiClient = new OpenAI({
      baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
      apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    });
    openaiAvailable = true;
    return openaiClient;
  } catch (error) {
    console.warn("OpenAI package not available. AI-powered recommendations will use fallback logic.");
    openaiAvailable = false;
    return null;
  }
}

export async function getPriceOptimizationSuggestions(
  builderId: string,
  serviceId?: string
): Promise<{
  suggestedBasicPrice: number;
  suggestedStandardPrice: number;
  suggestedPremiumPrice: number;
  reasoning: string;
}> {
  const builder = await storage.getBuilder(builderId);
  if (!builder) throw new Error("Builder not found");

  const services = await storage.getServicesByBuilder(builderId);
  const allBuilders = await storage.getBuilders();
  
  const competitorsInCategory = allBuilders.filter(
    b => b.category === builder.category && b.id !== builderId
  );

  const competitorServices = await Promise.all(
    competitorsInCategory.slice(0, 10).map(b => storage.getServicesByBuilder(b.id))
  );

  const avgPrices = {
    basic: 0,
    standard: 0,
    premium: 0,
    count: 0,
  };

  competitorServices.flat().forEach(service => {
    if (service.basicPrice) {
      avgPrices.basic += parseFloat(service.basicPrice);
      avgPrices.count++;
    }
    if (service.standardPrice) {
      avgPrices.standard += parseFloat(service.standardPrice);
    }
    if (service.premiumPrice) {
      avgPrices.premium += parseFloat(service.premiumPrice);
    }
  });

  if (avgPrices.count > 0) {
    avgPrices.basic /= avgPrices.count;
    avgPrices.standard /= avgPrices.count;
    avgPrices.premium /= avgPrices.count;
  }

  const builderRating = parseFloat(builder.rating || "0");
  const ratingMultiplier = builderRating > 4.5 ? 1.2 : builderRating > 4.0 ? 1.1 : 1.0;
  const verifiedMultiplier = builder.verified ? 1.15 : 1.0;
  const experienceMultiplier = builder.completedProjects > 100 ? 1.2 : builder.completedProjects > 50 ? 1.1 : 1.0;

  const multiplier = ratingMultiplier * verifiedMultiplier * experienceMultiplier;

  const suggestedBasicPrice = Math.round((avgPrices.basic || 500) * multiplier);
  const suggestedStandardPrice = Math.round((avgPrices.standard || 1000) * multiplier);
  const suggestedPremiumPrice = Math.round((avgPrices.premium || 2000) * multiplier);

  const reasoning = `Based on market analysis of ${competitorsInCategory.length} builders in ${builder.category}, your rating (${builderRating}/5), ${builder.verified ? "verified status," : ""} and ${builder.completedProjects} completed projects, we recommend pricing at ${Math.round((multiplier - 1) * 100)}% above market average.`;

  return {
    suggestedBasicPrice,
    suggestedStandardPrice,
    suggestedPremiumPrice,
    reasoning,
  };
}

export async function getSuccessPredictionScore(
  clientId: string,
  builderId: string
): Promise<{
  matchScore: number;
  confidence: "high" | "medium" | "low";
  factors: Array<{ factor: string; impact: "positive" | "negative" | "neutral"; weight: number }>;
  recommendation: string;
}> {
  const client = await storage.getClient(clientId);
  const builder = await storage.getBuilder(builderId);
  
  if (!client || !builder) {
    throw new Error("Client or builder not found");
  }

  const clientOrders = await storage.getOrdersByClient(clientId);
  const builderOrders = await storage.getOrdersByBuilder(builderId);

  const factors: Array<{ factor: string; impact: "positive" | "negative" | "neutral"; weight: number }> = [];
  let matchScore = 50;

  const hasWorkedInCategory = clientOrders.some(o => o.category === builder.category);
  if (hasWorkedInCategory) {
    matchScore += 15;
    factors.push({
      factor: "Client has worked with builders in this category before",
      impact: "positive",
      weight: 15,
    });
  }

  const builderRating = parseFloat(builder.rating || "0");
  if (builderRating > 4.5) {
    matchScore += 20;
    factors.push({
      factor: `Excellent builder rating (${builderRating}/5)`,
      impact: "positive",
      weight: 20,
    });
  } else if (builderRating < 3.5) {
    matchScore -= 15;
    factors.push({
      factor: `Lower builder rating (${builderRating}/5)`,
      impact: "negative",
      weight: -15,
    });
  }

  if (builder.verified) {
    matchScore += 10;
    factors.push({
      factor: "Verified builder status",
      impact: "positive",
      weight: 10,
    });
  }

  const builderResponseTime = builder.avgResponseTimeHours || 24;
  if (builderResponseTime < 6) {
    matchScore += 10;
    factors.push({
      factor: "Fast response time (under 6 hours)",
      impact: "positive",
      weight: 10,
    });
  }

  const onTimeRate = parseFloat(builder.onTimeDeliveryRate || "0");
  if (onTimeRate > 90) {
    matchScore += 15;
    factors.push({
      factor: `High on-time delivery rate (${onTimeRate}%)`,
      impact: "positive",
      weight: 15,
    });
  } else if (onTimeRate < 70) {
    matchScore -= 10;
    factors.push({
      factor: `Lower on-time delivery rate (${onTimeRate}%)`,
      impact: "negative",
      weight: -10,
    });
  }

  if (builder.completedProjects > 50) {
    matchScore += 10;
    factors.push({
      factor: `Experienced builder (${builder.completedProjects} projects)`,
      impact: "positive",
      weight: 10,
    });
  }

  matchScore = Math.max(0, Math.min(100, matchScore));

  const confidence = matchScore > 80 ? "high" : matchScore > 60 ? "medium" : "low";

  const recommendation = matchScore > 80 
    ? "Excellent match! This builder is highly recommended for your project."
    : matchScore > 60
    ? "Good match! This builder should deliver quality results."
    : "Moderate match. Consider discussing project details before proceeding.";

  return {
    matchScore,
    confidence,
    factors,
    recommendation,
  };
}
