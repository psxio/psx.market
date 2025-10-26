import { storage } from "../storage";
import { getEmailService } from "./service";
import { digestEmail, type DigestData, type DigestNotification } from "./templates/digest";

interface DigestOptions {
  frequency: "daily" | "weekly";
}

export async function sendDigests(options: DigestOptions): Promise<void> {
  const { frequency } = options;
  
  const users = await storage.getUsersForDigest(frequency);
  
  console.log(`Sending ${frequency} digests to ${users.length} users`);

  for (const user of users) {
    try {
      await sendUserDigest(user.userId, user.userType as "client" | "builder", frequency);
    } catch (error) {
      console.error(`Failed to send digest to user ${user.userId}:`, error);
    }
  }

  console.log(`Completed sending ${frequency} digests`);
}

async function sendUserDigest(
  userId: string,
  userType: "client" | "builder",
  period: "daily" | "weekly"
): Promise<void> {
  const sinceDate = new Date();
  if (period === "daily") {
    sinceDate.setDate(sinceDate.getDate() - 1);
  } else {
    sinceDate.setDate(sinceDate.getDate() - 7);
  }

  const notifications = await storage.getNotificationsSince(
    userId,
    userType,
    sinceDate.toISOString()
  );

  let userName: string;
  let userEmail: string | undefined;

  if (userType === "builder") {
    const builder = await storage.getBuilder(userId);
    userName = builder?.name || "Builder";
    userEmail = builder?.walletAddress;
  } else {
    const client = await storage.getClient(userId);
    userName = client?.name || "Client";
    userEmail = client?.walletAddress;
  }

  if (!userEmail) {
    console.warn(`No email found for user ${userId}`);
    return;
  }

  const stats: DigestData["stats"] = {};

  if (userType === "builder") {
    const builder = await storage.getBuilder(userId);
    stats.activeOrders = builder?.activeOrders || 0;
    stats.totalEarnings = builder?.totalEarnings?.toString() || "0";
    stats.newReviews = notifications.filter((n) => n.type === "review").length;
  } else {
    stats.activeOrders = notifications.filter((n) => n.type === "order_update").length;
  }

  const unreadMessages = await storage.getUnreadMessageCount(userId, userType);
  stats.unreadMessages = unreadMessages;

  const digestData: DigestData = {
    userName,
    userType,
    period,
    notifications: notifications.slice(0, 10).map((n) => ({
      id: n.id,
      type: n.type,
      title: n.title,
      message: n.message,
      actionUrl: n.actionUrl,
      createdAt: n.createdAt,
    })),
    stats,
  };

  const emailHtml = digestEmail(digestData);
  const emailService = getEmailService();

  await emailService.send({
    to: userEmail,
    subject: `Your ${period === "daily" ? "Daily" : "Weekly"} Summary - port444`,
    html: emailHtml,
  });

  await storage.updateDigestSentTime(userId, userType);
  
  console.log(`Sent ${period} digest to ${userName} (${userId})`);
}
