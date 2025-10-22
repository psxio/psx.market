/**
 * Notification email templates for create.psx
 * 
 * Templates for different notification types matching the notification system
 */

import { baseEmailTemplate, plainTextTemplate, type EmailTemplateData } from "./base";

export interface NotificationEmailData {
  recipientName: string;
  baseUrl?: string;
}

export interface OrderNotificationData extends NotificationEmailData {
  orderId: string;
  orderTitle: string;
  status: string;
  builderName?: string;
  clientName?: string;
}

export interface MessageNotificationData extends NotificationEmailData {
  senderName: string;
  messagePreview: string;
  threadId: string;
}

export interface PaymentNotificationData extends NotificationEmailData {
  amount: string;
  orderId: string;
  orderTitle: string;
  transactionId?: string;
}

export interface ReviewNotificationData extends NotificationEmailData {
  reviewerName: string;
  rating: number;
  reviewPreview: string;
  builderId: string;
}

export interface MilestoneNotificationData extends NotificationEmailData {
  milestoneName: string;
  orderId: string;
  orderTitle: string;
  status: string;
}

export function orderUpdateEmail(data: OrderNotificationData): { html: string; text: string } {
  const baseUrl = data.baseUrl || process.env.BASE_URL || 'https://create.psx';
  
  const statusMessages: Record<string, string> = {
    'pending': 'has been submitted and is awaiting review',
    'in_progress': 'is now in progress',
    'delivered': 'has been delivered for your review',
    'completed': 'has been completed successfully',
    'cancelled': 'has been cancelled',
    'disputed': 'is under dispute review',
  };
  
  const message = statusMessages[data.status] || 'has been updated';
  
  const templateData: EmailTemplateData = {
    title: 'Order Update',
    preheader: `Your order "${data.orderTitle}" ${message}`,
    content: `
      <p>Hi ${data.recipientName},</p>
      <p>Your order <strong>"${data.orderTitle}"</strong> ${message}.</p>
      <p><strong>Order ID:</strong> ${data.orderId}</p>
      <p><strong>Status:</strong> ${data.status}</p>
      ${data.builderName ? `<p><strong>Builder:</strong> ${data.builderName}</p>` : ''}
      <p>View your order details to see the latest updates and take any necessary actions.</p>
    `,
    ctaText: 'View Order',
    ctaUrl: `${baseUrl}/dashboard?order=${data.orderId}`,
  };
  
  return {
    html: baseEmailTemplate(templateData),
    text: plainTextTemplate({
      ...templateData,
      content: `Hi ${data.recipientName},\n\nYour order "${data.orderTitle}" ${message}.\n\nOrder ID: ${data.orderId}\nStatus: ${data.status}\n${data.builderName ? `Builder: ${data.builderName}\n` : ''}\nView your order details to see the latest updates and take any necessary actions.`
    }),
  };
}

export function newMessageEmail(data: MessageNotificationData): { html: string; text: string } {
  const baseUrl = data.baseUrl || process.env.BASE_URL || 'https://create.psx';
  
  const templateData: EmailTemplateData = {
    title: 'New Message',
    preheader: `${data.senderName} sent you a message`,
    content: `
      <p>Hi ${data.recipientName},</p>
      <p><strong>${data.senderName}</strong> sent you a message:</p>
      <div style="background-color: #27272a; padding: 16px; border-radius: 8px; border-left: 3px solid #8b5cf6; margin: 20px 0;">
        <p style="margin: 0; color: #d4d4d8;">${data.messagePreview}</p>
      </div>
      <p>Click below to read and reply to the message.</p>
    `,
    ctaText: 'View Message',
    ctaUrl: `${baseUrl}/messages?thread=${data.threadId}`,
  };
  
  return {
    html: baseEmailTemplate(templateData),
    text: plainTextTemplate({
      ...templateData,
      content: `Hi ${data.recipientName},\n\n${data.senderName} sent you a message:\n\n"${data.messagePreview}"\n\nClick below to read and reply to the message.`
    }),
  };
}

export function paymentReceivedEmail(data: PaymentNotificationData): { html: string; text: string } {
  const baseUrl = data.baseUrl || process.env.BASE_URL || 'https://create.psx';
  
  const templateData: EmailTemplateData = {
    title: 'Payment Received',
    preheader: `Payment of ${data.amount} received`,
    content: `
      <p>Hi ${data.recipientName},</p>
      <p>Great news! You've received a payment of <strong>${data.amount}</strong>.</p>
      <p><strong>Order:</strong> ${data.orderTitle}</p>
      <p><strong>Order ID:</strong> ${data.orderId}</p>
      ${data.transactionId ? `<p><strong>Transaction ID:</strong> ${data.transactionId}</p>` : ''}
      <p>The payment has been processed successfully and will be available in your dashboard.</p>
    `,
    ctaText: 'View Dashboard',
    ctaUrl: `${baseUrl}/builder-dashboard`,
  };
  
  return {
    html: baseEmailTemplate(templateData),
    text: plainTextTemplate({
      ...templateData,
      content: `Hi ${data.recipientName},\n\nGreat news! You've received a payment of ${data.amount}.\n\nOrder: ${data.orderTitle}\nOrder ID: ${data.orderId}\n${data.transactionId ? `Transaction ID: ${data.transactionId}\n` : ''}\nThe payment has been processed successfully and will be available in your dashboard.`
    }),
  };
}

export function newReviewEmail(data: ReviewNotificationData): { html: string; text: string } {
  const baseUrl = data.baseUrl || process.env.BASE_URL || 'https://create.psx';
  const stars = '⭐'.repeat(data.rating);
  
  const templateData: EmailTemplateData = {
    title: 'New Review',
    preheader: `${data.reviewerName} left you a ${data.rating}-star review`,
    content: `
      <p>Hi ${data.recipientName},</p>
      <p><strong>${data.reviewerName}</strong> left you a review!</p>
      <div style="margin: 20px 0;">
        <p style="font-size: 24px; margin: 0;">${stars}</p>
      </div>
      <div style="background-color: #27272a; padding: 16px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; color: #d4d4d8;">${data.reviewPreview}</p>
      </div>
      <p>Reviews help build trust and attract more clients. Check out the full review and consider responding!</p>
    `,
    ctaText: 'View Review',
    ctaUrl: `${baseUrl}/builder/${data.builderId}#reviews`,
  };
  
  return {
    html: baseEmailTemplate(templateData),
    text: plainTextTemplate({
      ...templateData,
      content: `Hi ${data.recipientName},\n\n${data.reviewerName} left you a ${data.rating}-star review!\n\n"${data.reviewPreview}"\n\nReviews help build trust and attract more clients. Check out the full review and consider responding!`
    }),
  };
}

export function newOrderEmail(data: OrderNotificationData & { recipientType: 'client' | 'builder' }): { html: string; text: string} {
  const baseUrl = data.baseUrl || process.env.BASE_URL || 'https://create.psx';
  
  const isClient = data.recipientType === 'client';
  
  const templateData: EmailTemplateData = {
    title: isClient ? 'Order Placed Successfully' : 'New Order Received',
    preheader: isClient 
      ? `Your order "${data.orderTitle}" has been placed successfully`
      : `You have a new order from ${data.clientName || 'a client'}`,
    content: isClient ? `
      <p>Hi ${data.recipientName},</p>
      <p>Your order has been placed successfully! 🎉</p>
      <p><strong>Order Details:</strong></p>
      <p><strong>Service:</strong> ${data.orderTitle}</p>
      <p><strong>Order ID:</strong> ${data.orderId}</p>
      <p><strong>Builder:</strong> ${data.builderName || 'TBD'}</p>
      <p>The builder will review your requirements and confirm the order. You'll receive a notification once they respond.</p>
      <p>You can track your order status and communicate with the builder through your dashboard.</p>
    ` : `
      <p>Hi ${data.recipientName},</p>
      <p>Great news! You have a new order. 💼</p>
      <p><strong>Order Details:</strong></p>
      <p><strong>Service:</strong> ${data.orderTitle}</p>
      <p><strong>Order ID:</strong> ${data.orderId}</p>
      <p><strong>Client:</strong> ${data.clientName || 'Client'}</p>
      <p>Please review the order requirements and confirm or discuss with the client as soon as possible.</p>
      <p>The client is waiting to hear from you!</p>
    `,
    ctaText: isClient ? 'View Order' : 'Review Order',
    ctaUrl: isClient 
      ? `${baseUrl}/dashboard?order=${data.orderId}`
      : `${baseUrl}/builder-dashboard?order=${data.orderId}`,
  };
  
  return {
    html: baseEmailTemplate(templateData),
    text: plainTextTemplate({
      ...templateData,
      content: isClient
        ? `Hi ${data.recipientName},\n\nYour order has been placed successfully!\n\nOrder Details:\nService: ${data.orderTitle}\nOrder ID: ${data.orderId}\nBuilder: ${data.builderName || 'TBD'}\n\nThe builder will review your requirements and confirm the order. You'll receive a notification once they respond.`
        : `Hi ${data.recipientName},\n\nGreat news! You have a new order.\n\nOrder Details:\nService: ${data.orderTitle}\nOrder ID: ${data.orderId}\nClient: ${data.clientName || 'Client'}\n\nPlease review the order requirements and confirm or discuss with the client as soon as possible.`
    }),
  };
}

export function milestoneUpdateEmail(data: MilestoneNotificationData): { html: string; text: string } {
  const baseUrl = data.baseUrl || process.env.BASE_URL || 'https://create.psx';
  
  const statusMessages: Record<string, string> = {
    'pending': 'is pending approval',
    'approved': 'has been approved',
    'rejected': 'requires revision',
    'paid': 'payment has been released',
  };
  
  const message = statusMessages[data.status] || 'has been updated';
  
  const templateData: EmailTemplateData = {
    title: 'Milestone Update',
    preheader: `Milestone "${data.milestoneName}" ${message}`,
    content: `
      <p>Hi ${data.recipientName},</p>
      <p>The milestone <strong>"${data.milestoneName}"</strong> ${message}.</p>
      <p><strong>Order:</strong> ${data.orderTitle}</p>
      <p><strong>Order ID:</strong> ${data.orderId}</p>
      <p><strong>Status:</strong> ${data.status}</p>
      <p>View the order details for more information about this milestone.</p>
    `,
    ctaText: 'View Order',
    ctaUrl: `${baseUrl}/dashboard?order=${data.orderId}`,
  };
  
  return {
    html: baseEmailTemplate(templateData),
    text: plainTextTemplate({
      ...templateData,
      content: `Hi ${data.recipientName},\n\nThe milestone "${data.milestoneName}" ${message}.\n\nOrder: ${data.orderTitle}\nOrder ID: ${data.orderId}\nStatus: ${data.status}\n\nView the order details for more information about this milestone.`
    }),
  };
}
