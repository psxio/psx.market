import { storage } from "./storage";
import type { InsertNotification } from "@shared/schema";

interface NotificationOptions {
  recipientId: string;
  recipientType: "client" | "builder";
  type: string;
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export async function sendNotification(options: NotificationOptions): Promise<void> {
  const { recipientId, recipientType, type, title, message, actionUrl, metadata } = options;

  const preferences = await storage.getNotificationPreferences(recipientId, recipientType);

  const notificationData: InsertNotification = {
    recipientId,
    recipientType,
    type,
    title,
    message,
    actionUrl: actionUrl || null,
    metadata: metadata || null,
  };

  if (!preferences || preferences.inAppOrderUpdates) {
    await storage.createNotification(notificationData);
  }

  if (preferences?.emailOrderUpdates && shouldSendEmailForType(type, preferences)) {
    await sendEmailNotification(recipientId, recipientType, title, message, actionUrl);
  }

  if (preferences?.pushOrderUpdates && shouldSendPushForType(type, preferences)) {
    await sendPushNotification(recipientId, recipientType, title, message, actionUrl);
  }
}

function shouldSendEmailForType(type: string, preferences: any): boolean {
  switch (type) {
    case "order_update":
      return preferences.emailOrderUpdates;
    case "message":
      return preferences.emailMessages;
    case "review":
      return preferences.emailReviews;
    case "payment":
      return preferences.emailPayments;
    default:
      return false;
  }
}

function shouldSendPushForType(type: string, preferences: any): boolean {
  switch (type) {
    case "order_update":
      return preferences.pushOrderUpdates;
    case "message":
      return preferences.pushMessages;
    case "review":
      return preferences.pushReviews;
    case "payment":
      return preferences.pushPayments;
    default:
      return false;
  }
}

async function sendEmailNotification(
  recipientId: string,
  recipientType: string,
  title: string,
  message: string,
  actionUrl?: string
): Promise<void> {
  console.log("[Email Notification]", {
    to: `${recipientType}:${recipientId}`,
    subject: title,
    body: message,
    link: actionUrl,
  });
}

async function sendPushNotification(
  recipientId: string,
  recipientType: string,
  title: string,
  message: string,
  actionUrl?: string
): Promise<void> {
  const subscriptions = await storage.getPushSubscriptions(recipientId, recipientType);

  if (subscriptions.length === 0) {
    console.log("[Push Notification] No subscriptions found for user");
    return;
  }

  console.log("[Push Notification]", {
    to: `${recipientType}:${recipientId}`,
    title,
    message,
    actionUrl,
    subscriptions: subscriptions.length,
  });
}

export async function notifyOrderUpdate(
  orderId: string,
  clientId: string,
  builderId: string,
  status: string
): Promise<void> {
  const statusMessages: Record<string, { client: string; builder: string }> = {
    confirmed: {
      client: "Your order has been confirmed by the builder",
      builder: "You confirmed the order",
    },
    in_progress: {
      client: "Your order is now in progress",
      builder: "Order is now in progress",
    },
    delivered: {
      client: "Your order has been delivered",
      builder: "You delivered the order",
    },
    completed: {
      client: "Your order has been completed",
      builder: "Order completed successfully",
    },
    cancelled: {
      client: "Your order has been cancelled",
      builder: "Order was cancelled",
    },
  };

  const messages = statusMessages[status];
  if (!messages) return;

  await Promise.all([
    sendNotification({
      recipientId: clientId,
      recipientType: "client",
      type: "order_update",
      title: "Order Update",
      message: messages.client,
      actionUrl: `/dashboard?order=${orderId}`,
      metadata: { orderId, status },
    }),
    sendNotification({
      recipientId: builderId,
      recipientType: "builder",
      type: "order_update",
      title: "Order Update",
      message: messages.builder,
      actionUrl: `/builder-dashboard?order=${orderId}`,
      metadata: { orderId, status },
    }),
  ]);
}

export async function notifyNewMessage(
  senderId: string,
  senderType: "client" | "builder",
  recipientId: string,
  recipientType: "client" | "builder",
  messagePreview: string
): Promise<void> {
  await sendNotification({
    recipientId,
    recipientType,
    type: "message",
    title: "New Message",
    message: messagePreview,
    actionUrl: "/messages",
    metadata: { senderId, senderType },
  });
}

export async function notifyPaymentReceived(
  recipientId: string,
  recipientType: "client" | "builder",
  amount: string,
  orderId: string
): Promise<void> {
  await sendNotification({
    recipientId,
    recipientType,
    type: "payment",
    title: "Payment Received",
    message: `You received a payment of $${amount}`,
    actionUrl: recipientType === "client" ? "/dashboard" : "/builder-dashboard",
    metadata: { amount, orderId },
  });
}

export async function notifyReviewResponse(
  clientId: string,
  builderId: string,
  builderName: string
): Promise<void> {
  await sendNotification({
    recipientId: clientId,
    recipientType: "client",
    type: "review",
    title: "Builder Responded to Your Review",
    message: `${builderName} has responded to your review`,
    actionUrl: `/builder/${builderId}`,
    metadata: { builderId, builderName },
  });
}

export async function notifyMilestoneComplete(
  clientId: string,
  builderId: string,
  orderId: string,
  milestoneName: string
): Promise<void> {
  await Promise.all([
    sendNotification({
      recipientId: clientId,
      recipientType: "client",
      type: "milestone",
      title: "Milestone Completed",
      message: `${milestoneName} has been completed`,
      actionUrl: `/dashboard?order=${orderId}`,
      metadata: { orderId, milestoneName },
    }),
    sendNotification({
      recipientId: builderId,
      recipientType: "builder",
      type: "milestone",
      title: "Milestone Completed",
      message: `You completed ${milestoneName}`,
      actionUrl: `/builder-dashboard?order=${orderId}`,
      metadata: { orderId, milestoneName },
    }),
  ]);
}
