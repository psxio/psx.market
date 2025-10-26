import { storage } from "../storage";

interface UserBehavior {
  userId: string;
  hiredBuilderIds: string[];
  viewedServiceIds: string[];
  completedOrderCategories: string[];
}

export async function getCollaborativeRecommendations(
  userId: string,
  userType: "client" | "builder",
  limit: number = 10
): Promise<{ builderId: string; score: number; reason: string }[]> {
  if (userType !== "client") {
    return [];
  }

  const userOrders = await storage.getOrdersByClient(userId);
  const userHiredBuilders = new Set(userOrders.map(o => o.builderId));
  const userCategories = new Set(userOrders.map(o => o.category).filter(Boolean));

  const allClients = await storage.getClients();
  const similarClients: Array<{ clientId: string; similarity: number }> = [];

  for (const client of allClients) {
    if (client.id === userId) continue;

    const clientOrders = await storage.getOrdersByClient(client.id);
    const clientHiredBuilders = new Set(clientOrders.map(o => o.builderId));
    const clientCategories = new Set(clientOrders.map(o => o.category).filter(Boolean));

    const sharedBuilders = Array.from(userHiredBuilders).filter(b => clientHiredBuilders.has(b));
    const sharedCategories = Array.from(userCategories).filter(c => clientCategories.has(c));

    const builderSimilarity = sharedBuilders.length / Math.max(userHiredBuilders.size, 1);
    const categorySimilarity = sharedCategories.length / Math.max(userCategories.size, 1);
    
    const similarity = (builderSimilarity * 0.7) + (categorySimilarity * 0.3);

    if (similarity > 0.1) {
      similarClients.push({ clientId: client.id, similarity });
    }
  }

  similarClients.sort((a, b) => b.similarity - a.similarity);

  const recommendedBuilders = new Map<string, { score: number; count: number }>();

  for (const { clientId, similarity } of similarClients.slice(0, 20)) {
    const orders = await storage.getOrdersByClient(clientId);
    
    for (const order of orders) {
      if (!userHiredBuilders.has(order.builderId)) {
        const current = recommendedBuilders.get(order.builderId) || { score: 0, count: 0 };
        recommendedBuilders.set(order.builderId, {
          score: current.score + similarity,
          count: current.count + 1,
        });
      }
    }
  }

  const recommendations = Array.from(recommendedBuilders.entries())
    .map(([builderId, { score, count }]) => ({
      builderId,
      score: score * count,
      reason: `Hired by ${count} similar client${count > 1 ? 's' : ''}`,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return recommendations;
}

export async function getSimilarBuilders(builderId: string, limit: number = 10): Promise<string[]> {
  const builder = await storage.getBuilder(builderId);
  if (!builder) return [];

  const allBuilders = await storage.getBuilders();
  
  const scored = allBuilders
    .filter(b => b.id !== builderId && b.isActive)
    .map(b => {
      let score = 0;

      if (b.category === builder.category) score += 50;

      const sharedSkills = (b.skills || []).filter(s => 
        (builder.skills || []).includes(s)
      );
      score += sharedSkills.length * 10;

      const priceDiff = Math.abs(
        parseFloat(builder.rating || "0") - parseFloat(b.rating || "0")
      );
      if (priceDiff < 0.5) score += 20;

      if (b.verified && builder.verified) score += 15;

      return { id: b.id, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return scored.map(s => s.id);
}
