import { baseEmailTemplate } from "./base";

export interface DigestNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  actionUrl: string | null;
  createdAt: string;
}

export interface DigestData {
  userName: string;
  userType: "client" | "builder";
  period: "daily" | "weekly";
  notifications: DigestNotification[];
  stats: {
    activeOrders?: number;
    unreadMessages?: number;
    totalEarnings?: string;
    newReviews?: number;
  };
}

export function digestEmail(data: DigestData): string {
  const { userName, userType, period, notifications, stats } = data;
  
  const periodLabel = period === "daily" ? "Daily" : "Weekly";
  const greeting = `Hi ${userName}`;
  
  const notificationsList = notifications.length > 0 
    ? notifications.map(notif => `
      <tr>
        <td style="padding: 16px; background: #f9fafb; border-radius: 8px; margin-bottom: 8px;">
          <div style="font-weight: 600; color: #111827; margin-bottom: 4px;">
            ${notif.title}
          </div>
          <div style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">
            ${notif.message}
          </div>
          ${notif.actionUrl ? `
          <div style="margin-top: 12px;">
            <a href="${notif.actionUrl}" 
               style="display: inline-block; padding: 8px 16px; background: #8b5cf6; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px;">
              View Details
            </a>
          </div>
          ` : ''}
        </td>
      </tr>
      <tr><td style="height: 8px;"></td></tr>
    `).join('')
    : `
      <tr>
        <td style="padding: 32px; text-align: center; color: #6b7280;">
          No new notifications this ${period}
        </td>
      </tr>
    `;

  const statsSection = userType === "builder" ? `
    <div style="background: #f9fafb; padding: 24px; border-radius: 8px; margin-top: 24px;">
      <h3 style="margin: 0 0 16px 0; color: #111827;">Your ${periodLabel} Stats</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        ${stats.activeOrders !== undefined ? `
          <div>
            <div style="font-size: 24px; font-weight: 700; color: #8b5cf6;">
              ${stats.activeOrders}
            </div>
            <div style="font-size: 14px; color: #6b7280;">Active Orders</div>
          </div>
        ` : ''}
        ${stats.totalEarnings ? `
          <div>
            <div style="font-size: 24px; font-weight: 700; color: #10b981;">
              $${stats.totalEarnings}
            </div>
            <div style="font-size: 14px; color: #6b7280;">Earnings</div>
          </div>
        ` : ''}
        ${stats.unreadMessages !== undefined ? `
          <div>
            <div style="font-size: 24px; font-weight: 700; color: #3b82f6;">
              ${stats.unreadMessages}
            </div>
            <div style="font-size: 14px; color: #6b7280;">Unread Messages</div>
          </div>
        ` : ''}
        ${stats.newReviews !== undefined ? `
          <div>
            <div style="font-size: 24px; font-weight: 700; color: #f59e0b;">
              ${stats.newReviews}
            </div>
            <div style="font-size: 14px; color: #6b7280;">New Reviews</div>
          </div>
        ` : ''}
      </div>
    </div>
  ` : `
    <div style="background: #f9fafb; padding: 24px; border-radius: 8px; margin-top: 24px;">
      <h3 style="margin: 0 0 16px 0; color: #111827;">Your ${periodLabel} Activity</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        ${stats.activeOrders !== undefined ? `
          <div>
            <div style="font-size: 24px; font-weight: 700; color: #8b5cf6;">
              ${stats.activeOrders}
            </div>
            <div style="font-size: 14px; color: #6b7280;">Active Projects</div>
          </div>
        ` : ''}
        ${stats.unreadMessages !== undefined ? `
          <div>
            <div style="font-size: 24px; font-weight: 700; color: #3b82f6;">
              ${stats.unreadMessages}
            </div>
            <div style="font-size: 14px; color: #6b7280;">Unread Messages</div>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  const content = `
    <h1 style="margin: 0 0 8px 0; font-size: 28px; font-weight: 700; color: #111827;">
      Your ${periodLabel} Summary
    </h1>
    <p style="margin: 0 0 32px 0; font-size: 16px; color: #6b7280;">
      ${greeting}, here's what happened on port444 this ${period}.
    </p>

    ${statsSection}

    <h2 style="margin: 32px 0 16px 0; font-size: 20px; font-weight: 600; color: #111827;">
      Recent Notifications
    </h2>
    <table style="width: 100%; border-collapse: separate; border-spacing: 0;">
      ${notificationsList}
    </table>

    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb; text-align: center;">
      <a href="https://port444.shop/dashboard" 
         style="display: inline-block; padding: 12px 24px; background: #8b5cf6; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600;">
        Go to Dashboard
      </a>
    </div>

    <p style="margin-top: 24px; font-size: 14px; color: #6b7280; text-align: center;">
      You're receiving this email because you opted into ${period} digests. 
      <a href="https://port444.shop/settings/notifications" style="color: #8b5cf6; text-decoration: none;">
        Update your preferences
      </a>
    </p>
  `;

  return baseEmailTemplate({
    title: `Your ${periodLabel} Summary - port444`,
    preheader: `See what happened on port444 this ${period}`,
    content,
  });
}
