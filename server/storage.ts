import {
  type Builder,
  type InsertBuilder,
  type BuilderProject,
  type InsertBuilderProject,
  type Service,
  type InsertService,
  type Category,
  type InsertCategory,
  type Review,
  type InsertReview,
  type ReviewVote,
  type InsertReviewVote,
  type ReviewDispute,
  type InsertReviewDispute,
  type BuilderApplication,
  type InsertBuilderApplication,
  type Client,
  type InsertClient,
  type Order,
  type InsertOrder,
  type OrderRevision,
  type InsertOrderRevision,
  type OrderActivity,
  type InsertOrderActivity,
  type Milestone,
  type InsertMilestone,
  type Admin,
  type InsertAdmin,
  type Referral,
  type InsertReferral,
  type Payment,
  type InsertPayment,
  type MilestonePayment,
  type InsertMilestonePayment,
  type Payout,
  type InsertPayout,
  type Dispute,
  type InsertDispute,
  type Refund,
  type InsertRefund,
  type Invoice,
  type InsertInvoice,
  type ChatThread,
  type InsertChatThread,
  type Message,
  type InsertMessage,
  type MessageAttachment,
  type InsertMessageAttachment,
  type MessageReadReceipt,
  type InsertMessageReadReceipt,
  type ProjectDeliverable,
  type InsertProjectDeliverable,
  type ProgressUpdate,
  type InsertProgressUpdate,
  type ProjectDocument,
  type InsertProjectDocument,
  type Notification,
  type InsertNotification,
  type NotificationPreferences,
  type InsertNotificationPreferences,
  type PushSubscription,
  type InsertPushSubscription,
  type BuilderInviteToken,
  type InsertBuilderInviteToken,
  type Partner,
  type InsertPartner,
  type PartnerConnectionRequest,
  type InsertPartnerConnectionRequest,
  builders,
  builderProjects,
  services,
  categories,
  reviews,
  reviewVotes,
  reviewDisputes,
  builderApplications,
  clients,
  orders,
  orderRevisions,
  orderActivities,
  milestones,
  projectDeliverables,
  progressUpdates,
  projectDocuments,
  builderFollows,
  builderActivityFeed,
  builderBadges,
  builderTestimonials,
  builderViews,
  platformStatistics,
  builderApplicationRevisions,
  builderOnboarding,
  admins,
  referrals,
  payments,
  milestonePayments,
  payouts,
  disputes,
  refunds,
  invoices,
  chatThreads,
  messages,
  messageAttachments,
  messageReadReceipts,
  notifications,
  notificationPreferences,
  pushSubscriptions,
  builderInviteTokens,
  partners,
  partnerConnectionRequests,
} from "@shared/schema";
import { randomUUID } from "crypto";
import * as bcrypt from "bcryptjs";
import { db } from "./db";
import { eq, and, or, desc, count, sql as sqlFunc } from "drizzle-orm";

export interface IStorage {
  getBuilder(id: string): Promise<Builder | undefined>;
  getBuilderByWallet(walletAddress: string): Promise<Builder | undefined>;
  getBuilders(): Promise<Builder[]>;
  getFeaturedBuilders(): Promise<Builder[]>;
  createBuilder(builder: InsertBuilder): Promise<Builder>;
  
  getBuilderProjects(builderId: string): Promise<BuilderProject[]>;
  getBuilderProject(id: string): Promise<BuilderProject | undefined>;
  createBuilderProject(project: InsertBuilderProject): Promise<BuilderProject>;

  getService(id: string): Promise<Service | undefined>;
  getServices(): Promise<Service[]>;
  getServicesByBuilder(builderId: string): Promise<Service[]>;
  getFeaturedServices(): Promise<Service[]>;
  getServicesByCategory(categorySlug: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;

  getCategory(slug: string): Promise<Category | undefined>;
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  getReviewsByBuilder(builderId: string): Promise<Review[]>;
  getReview(id: string): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  addBuilderResponse(reviewId: string, response: string): Promise<Review>;
  updateReviewStatus(reviewId: string, status: string, moderatorId: string, notes?: string): Promise<Review>;
  
  getReviewVote(reviewId: string, voterId: string): Promise<ReviewVote | undefined>;
  createReviewVote(vote: InsertReviewVote): Promise<ReviewVote>;
  deleteReviewVote(reviewId: string, voterId: string): Promise<void>;
  updateReviewVoteCount(reviewId: string): Promise<Review>;
  
  getReviewDispute(reviewId: string): Promise<ReviewDispute | undefined>;
  getReviewDisputes(): Promise<ReviewDispute[]>;
  createReviewDispute(dispute: InsertReviewDispute): Promise<ReviewDispute>;
  resolveReviewDispute(disputeId: string, resolution: string, resolvedBy: string): Promise<ReviewDispute>;

  getBuilderApplication(id: string): Promise<BuilderApplication | undefined>;
  getBuilderApplications(): Promise<BuilderApplication[]>;
  createBuilderApplication(application: InsertBuilderApplication): Promise<BuilderApplication>;
  approveBuilderApplication(id: string): Promise<Builder>;

  getClient(id: string): Promise<Client | undefined>;
  getClientByWallet(walletAddress: string): Promise<Client | undefined>;
  getClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;

  getOrder(id: string): Promise<Order | undefined>;
  getOrders(): Promise<Order[]>;
  getOrdersByClient(clientId: string): Promise<Order[]>;
  getOrdersByBuilder(builderId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, data: Partial<Order>): Promise<Order>;
  cancelOrder(id: string, reason: string, refundAmount?: number): Promise<Order>;
  
  getOrderRevisions(orderId: string): Promise<OrderRevision[]>;
  createOrderRevision(revision: InsertOrderRevision): Promise<OrderRevision>;
  updateOrderRevision(id: string, data: Partial<OrderRevision>): Promise<OrderRevision>;
  
  getOrderActivities(orderId: string): Promise<OrderActivity[]>;
  createOrderActivity(activity: InsertOrderActivity): Promise<OrderActivity>;

  getMilestonesByProject(projectId: string): Promise<Milestone[]>;
  createMilestone(milestone: InsertMilestone): Promise<Milestone>;
  updateMilestoneStatus(id: string, status: string, transactionHash?: string): Promise<Milestone>;

  getAdmin(username: string): Promise<Admin | undefined>;
  getAdminById(id: string): Promise<Admin | undefined>;
  getAdmins(): Promise<Admin[]>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  updateAdmin(id: string, data: Partial<Admin>): Promise<Admin>;
  deleteAdmin(id: string): Promise<void>;
  verifyAdminPassword(username: string, password: string): Promise<Admin | null>;
  updateLastLogin(username: string): Promise<void>;

  getReferral(id: string): Promise<Referral | undefined>;
  getReferrals(): Promise<Referral[]>;
  getReferralsByWallet(wallet: string): Promise<Referral[]>;
  createReferral(referral: InsertReferral): Promise<Referral>;
  updateReferralStatus(id: string, status: string): Promise<Referral>;
  deleteReferral(id: string): Promise<void>;

  updateBuilder(id: string, data: Partial<Builder>): Promise<Builder>;
  deleteBuilder(id: string): Promise<void>;
  toggleBuilderAvailability(builderId: string, accepting: boolean): Promise<Builder>;
  updateBuilderActivity(builderId: string): Promise<Builder>;
  getBuilderAnalytics(builderId: string): Promise<{
    totalEarnings: string;
    availableBalance: string;
    pendingPayouts: string;
    activeOrders: number;
    completedOrders: number;
    successRate: string;
    avgResponseTime: number;
    onTimeDeliveryRate: string;
  }>;
  updateService(id: string, data: Partial<Service>): Promise<Service>;
  deleteService(id: string): Promise<void>;
  updateClient(id: string, data: Partial<Client>): Promise<Client>;
  deleteClient(id: string): Promise<void>;
  updateBuilderApplication(id: string, data: Partial<BuilderApplication>): Promise<BuilderApplication>;
  deleteBuilderApplication(id: string): Promise<void>;

  getPayment(id: string): Promise<Payment | undefined>;
  getPayments(): Promise<Payment[]>;
  getPaymentsByOrder(orderId: string): Promise<Payment[]>;
  getPaymentsByClient(clientId: string): Promise<Payment[]>;
  getPaymentsByBuilder(builderId: string): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, data: Partial<Payment>): Promise<Payment>;

  getMilestonePayment(id: string): Promise<MilestonePayment | undefined>;
  getMilestonePaymentsByPayment(paymentId: string): Promise<MilestonePayment[]>;
  getMilestonePaymentsByOrder(orderId: string): Promise<MilestonePayment[]>;
  createMilestonePayment(milestonePayment: InsertMilestonePayment): Promise<MilestonePayment>;
  updateMilestonePayment(id: string, data: Partial<MilestonePayment>): Promise<MilestonePayment>;
  releaseMilestonePayment(id: string, transactionHash: string): Promise<MilestonePayment>;

  getPayout(id: string): Promise<Payout | undefined>;
  getPayouts(): Promise<Payout[]>;
  getPayoutsByBuilder(builderId: string): Promise<Payout[]>;
  createPayout(payout: InsertPayout): Promise<Payout>;
  updatePayout(id: string, data: Partial<Payout>): Promise<Payout>;
  processPayout(id: string, transactionHash: string): Promise<Payout>;

  getDispute(id: string): Promise<Dispute | undefined>;
  getDisputes(): Promise<Dispute[]>;
  getDisputesByOrder(orderId: string): Promise<Dispute[]>;
  getDisputesByPayment(paymentId: string): Promise<Dispute[]>;
  createDispute(dispute: InsertDispute): Promise<Dispute>;
  updateDispute(id: string, data: Partial<Dispute>): Promise<Dispute>;
  resolveDispute(id: string, resolution: string, resolvedBy: string, refundAmount?: number): Promise<Dispute>;

  getRefund(id: string): Promise<Refund | undefined>;
  getRefunds(): Promise<Refund[]>;
  getRefundsByOrder(orderId: string): Promise<Refund[]>;
  getRefundsByPayment(paymentId: string): Promise<Refund[]>;
  createRefund(refund: InsertRefund): Promise<Refund>;
  updateRefund(id: string, data: Partial<Refund>): Promise<Refund>;
  processRefund(id: string, transactionHash: string): Promise<Refund>;

  getInvoice(id: string): Promise<Invoice | undefined>;
  getInvoices(): Promise<Invoice[]>;
  getInvoicesByClient(clientId: string): Promise<Invoice[]>;
  getInvoicesByBuilder(builderId: string): Promise<Invoice[]>;
  getInvoiceByPayment(paymentId: string): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: string, data: Partial<Invoice>): Promise<Invoice>;

  getChatThread(id: string): Promise<ChatThread | undefined>;
  getChatThreadsByClient(clientId: string): Promise<ChatThread[]>;
  getChatThreadsByBuilder(builderId: string): Promise<ChatThread[]>;
  getChatThreadByOrder(orderId: string): Promise<ChatThread | undefined>;
  findOrCreateChatThread(clientId: string, builderId: string, orderId?: string): Promise<ChatThread>;
  createChatThread(thread: InsertChatThread): Promise<ChatThread>;
  updateChatThread(id: string, data: Partial<ChatThread>): Promise<ChatThread>;
  archiveChatThread(id: string, userType: string): Promise<ChatThread>;
  updateThreadUnreadCount(threadId: string, userType: string, increment: boolean): Promise<ChatThread>;

  getMessage(id: string): Promise<Message | undefined>;
  getMessagesByThread(threadId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  updateMessage(id: string, data: Partial<Message>): Promise<Message>;
  deleteMessage(id: string): Promise<Message>;

  getMessageAttachment(id: string): Promise<MessageAttachment | undefined>;
  getMessageAttachmentsByMessage(messageId: string): Promise<MessageAttachment[]>;
  createMessageAttachment(attachment: InsertMessageAttachment): Promise<MessageAttachment>;

  getMessageReadReceipt(messageId: string, readerId: string): Promise<MessageReadReceipt | undefined>;
  getMessageReadReceiptsByThread(threadId: string, readerId: string): Promise<MessageReadReceipt[]>;
  createMessageReadReceipt(receipt: InsertMessageReadReceipt): Promise<MessageReadReceipt>;
  markThreadAsRead(threadId: string, readerId: string, readerType: string): Promise<void>;

  getProjectDeliverable(id: string): Promise<ProjectDeliverable | undefined>;
  getProjectDeliverablesByOrder(orderId: string): Promise<ProjectDeliverable[]>;
  getProjectDeliverablesByMilestone(milestoneId: string): Promise<ProjectDeliverable[]>;
  createProjectDeliverable(deliverable: InsertProjectDeliverable): Promise<ProjectDeliverable>;
  updateProjectDeliverable(id: string, data: Partial<ProjectDeliverable>): Promise<ProjectDeliverable>;
  reviewProjectDeliverable(id: string, reviewedBy: string, reviewNotes: string, accepted: boolean, rejectionReason?: string): Promise<ProjectDeliverable>;
  requestDeliverableRevision(id: string, reviewNotes: string): Promise<ProjectDeliverable>;

  getProgressUpdate(id: string): Promise<ProgressUpdate | undefined>;
  getProgressUpdatesByOrder(orderId: string): Promise<ProgressUpdate[]>;
  getProgressUpdatesByBuilder(builderId: string): Promise<ProgressUpdate[]>;
  createProgressUpdate(update: InsertProgressUpdate): Promise<ProgressUpdate>;
  updateProgressUpdate(id: string, data: Partial<ProgressUpdate>): Promise<ProgressUpdate>;
  deleteProgressUpdate(id: string): Promise<void>;

  getProjectDocument(id: string): Promise<ProjectDocument | undefined>;
  getProjectDocumentsByOrder(orderId: string): Promise<ProjectDocument[]>;
  createProjectDocument(document: InsertProjectDocument): Promise<ProjectDocument>;
  updateProjectDocument(id: string, data: Partial<ProjectDocument>): Promise<ProjectDocument>;
  deleteProjectDocument(id: string): Promise<void>;
  getProjectDocumentVersions(orderId: string, documentName: string): Promise<ProjectDocument[]>;

  followBuilder(clientId: string, builderId: string): Promise<void>;
  unfollowBuilder(clientId: string, builderId: string): Promise<void>;
  isFollowingBuilder(clientId: string, builderId: string): Promise<boolean>;
  getBuilderFollowers(builderId: string): Promise<string[]>;
  getFollowedBuilders(clientId: string): Promise<string[]>;
  getBuilderFollowerCount(builderId: string): Promise<number>;

  createBuilderActivity(activity: { builderId: string; activityType: string; activityData?: string; metadata?: string }): Promise<void>;
  getBuilderActivityFeed(builderId: string, limit?: number): Promise<any[]>;
  getFollowedBuildersActivity(clientId: string, limit?: number): Promise<any[]>;

  createBuilderBadge(badge: { builderId: string; badgeType: string; badgeLabel: string; badgeIcon?: string; badgeColor?: string }): Promise<void>;
  getBuilderBadges(builderId: string): Promise<any[]>;
  removeBuilderBadge(builderId: string, badgeType: string): Promise<void>;

  createBuilderTestimonial(testimonial: { builderId: string; clientId: string; content: string; authorName: string; authorTitle?: string; rating?: string; orderId?: string }): Promise<void>;
  getBuilderTestimonials(builderId: string, approvedOnly?: boolean): Promise<any[]>;
  approveBuilderTestimonial(testimonialId: string): Promise<void>;
  featureBuilderTestimonial(testimonialId: string, featured: boolean): Promise<void>;

  trackBuilderView(builderId: string, viewerId?: string, viewerType?: string): Promise<void>;
  getBuilderViewCount(builderId: string, period?: string): Promise<number>;
  getBuilderViewStats(builderId: string): Promise<{ totalViews: number; uniqueViewers: number; last30Days: number }>;

  calculatePlatformStatistics(): Promise<void>;
  getPlatformStatistics(category?: string): Promise<any[]>;
  getClientAnalytics(clientId: string): Promise<{
    totalSpent: number;
    projectsCompleted: number;
    activeProjects: number;
    averageRating: number;
    favoriteCategories: string[];
  }>;

  createApplicationRevision(applicationId: string, changesRequested: string, requestedBy: string): Promise<void>;
  getApplicationRevisions(applicationId: string): Promise<any[]>;
  submitApplicationRevision(revisionId: string, submittedData: string): Promise<void>;
  getBuilderApplicationByEmail(email: string): Promise<BuilderApplication | undefined>;

  createBuilderOnboarding(builderId: string, applicationId: string): Promise<void>;
  getBuilderOnboarding(builderId: string): Promise<any | undefined>;
  updateOnboardingStep(builderId: string, step: string, completed: boolean): Promise<void>;

  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotifications(recipientId: string, recipientType: string, limit?: number, unreadOnly?: boolean): Promise<Notification[]>;
  getNotification(id: string): Promise<Notification | undefined>;
  markNotificationAsRead(id: string): Promise<Notification>;
  markAllNotificationsAsRead(recipientId: string, recipientType: string): Promise<void>;
  deleteNotification(id: string): Promise<void>;
  getUnreadNotificationCount(recipientId: string, recipientType: string): Promise<number>;
  
  getNotificationPreferences(userId: string, userType: string): Promise<NotificationPreferences | undefined>;
  createNotificationPreferences(preferences: InsertNotificationPreferences): Promise<NotificationPreferences>;
  updateNotificationPreferences(userId: string, userType: string, data: Partial<NotificationPreferences>): Promise<NotificationPreferences>;
  
  createPushSubscription(subscription: InsertPushSubscription): Promise<PushSubscription>;
  getPushSubscriptions(userId: string, userType: string): Promise<PushSubscription[]>;
  deletePushSubscription(endpoint: string): Promise<void>;
  
  createBuilderInviteToken(adminId: string, adminName: string, email?: string, notes?: string, expiresIn?: number): Promise<BuilderInviteToken>;
  getBuilderInviteTokens(): Promise<BuilderInviteToken[]>;
  getBuilderInviteToken(token: string): Promise<BuilderInviteToken | undefined>;
  useBuilderInviteToken(token: string, builderId: string, builderName: string): Promise<BuilderInviteToken>;
  deleteBuilderInviteToken(id: string): Promise<void>;

  getPartners(options?: { category?: string; featured?: boolean; active?: boolean }): Promise<Partner[]>;
  getPartner(id: string): Promise<Partner | undefined>;
  createPartner(partner: InsertPartner): Promise<Partner>;
  updatePartner(id: string, data: Partial<Partner>): Promise<Partner>;
  deletePartner(id: string): Promise<void>;
  
  getPartnerConnectionRequests(options?: { partnerId?: string; userId?: string; status?: string }): Promise<PartnerConnectionRequest[]>;
  getPartnerConnectionRequest(id: string): Promise<PartnerConnectionRequest | undefined>;
  createPartnerConnectionRequest(request: InsertPartnerConnectionRequest): Promise<PartnerConnectionRequest>;
  updatePartnerConnectionRequest(id: string, data: Partial<PartnerConnectionRequest>): Promise<PartnerConnectionRequest>;
  deletePartnerConnectionRequest(id: string): Promise<void>;
}

export class PostgresStorage implements IStorage {
  constructor() {
    this.seedData();
  }

  private async seedData() {
    const existingCategories = await db.select().from(categories);
    if (existingCategories.length > 0) {
      return;
    }

    const categoriesData: Array<Partial<Category>> = [
      {
        name: "KOLs & Influencers",
        slug: "kols",
        description: "Crypto influencers and key opinion leaders with proven reach and engagement",
        icon: "megaphone",
      },
      {
        name: "3D Content Creators",
        slug: "3d-content",
        description: "Professional 3D artists creating stunning visuals for your project",
        icon: "box",
      },
      {
        name: "Marketing & Growth",
        slug: "marketing",
        description: "Expert marketers driving growth for crypto and memecoin projects",
        icon: "trending-up",
      },
      {
        name: "Script Development",
        slug: "development",
        description: "Smart contract and token development experts",
        icon: "code",
      },
      {
        name: "Volume Services",
        slug: "volume",
        description: "Liquidity and volume generation for your token",
        icon: "bar-chart-3",
      },
    ];

    for (const cat of categoriesData) {
      await db.insert(categories).values(cat as any);
    }

    const buildersData: Array<Partial<Builder>> = [
      {
        walletAddress: "0x0000000000000000000000000000000000000001",
        name: "Test Builder",
        headline: "Full-Stack Web3 Developer & KOL",
        bio: "Experienced builder specializing in smart contracts, DeFi, and community growth. This is a test builder account for dashboard testing.",
        verified: true,
        category: "Script Development",
        rating: "4.95",
        reviewCount: 50,
        completedProjects: 75,
        responseTime: "4 hours",
        twitterHandle: "testbuilder",
        twitterFollowers: 125000,
        portfolioLinks: ["https://github.com/testbuilder"],
        skills: ["Solidity", "React", "Smart Contracts", "DeFi", "Marketing"],
        psxTier: "platinum",
        programmingLanguages: ["Solidity", "TypeScript", "JavaScript"],
        blockchainFrameworks: ["Hardhat", "Foundry", "Ethers.js"],
        githubProfile: "https://github.com/testbuilder",
        deployedContracts: ["0x1234...5678"],
        acceptingOrders: true,
        isActive: true,
        avgResponseTimeHours: 4,
        totalEarnings: "25000.00",
        availableBalance: "5000.00",
        pendingPayouts: "2500.00",
        successRate: "98.5",
        onTimeDeliveryRate: "97.0",
        activeOrders: 3,
        lastActiveAt: new Date().toISOString(),
      },
      {
        walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f9a3f1",
        name: "Alex Chen",
        headline: "Top Crypto KOL | 500K+ Followers",
        bio: "Experienced crypto influencer with a proven track record of launching successful memecoin campaigns.",
        verified: true,
        category: "KOLs & Influencers",
        rating: "4.9",
        reviewCount: 89,
        completedProjects: 156,
        responseTime: "2 hours",
        twitterHandle: "alexcryptoking",
        twitterFollowers: 523000,
        skills: ["Community Building", "Viral Marketing", "Launch Campaigns", "Influencer Network"],
        psxTier: "platinum",
      },
    ];

    for (const builder of buildersData) {
      await db.insert(builders).values(builder as any);
    }

    const adminPassword = await bcrypt.hash("admin123", 10);
    await db.insert(admins).values({
      username: "admin",
      passwordHash: adminPassword,
      email: "admin@psx.app",
      name: "PSX Admin",
      role: "admin",
    });
  }

  async getBuilder(id: string): Promise<Builder | undefined> {
    const result = await db.select().from(builders).where(eq(builders.id, id));
    return result[0];
  }

  async getBuilderByWallet(walletAddress: string): Promise<Builder | undefined> {
    const result = await db.select().from(builders).where(eq(builders.walletAddress, walletAddress));
    return result[0];
  }

  async getBuilders(): Promise<Builder[]> {
    return await db.select().from(builders);
  }

  async getFeaturedBuilders(): Promise<Builder[]> {
    return await db.select().from(builders).where(eq(builders.verified, true)).limit(6);
  }

  async createBuilder(builder: InsertBuilder): Promise<Builder> {
    const result = await db.insert(builders).values(builder).returning();
    return result[0];
  }

  async getBuilderProjects(builderId: string): Promise<BuilderProject[]> {
    return await db.select().from(builderProjects).where(eq(builderProjects.builderId, builderId));
  }

  async getBuilderProject(id: string): Promise<BuilderProject | undefined> {
    const result = await db.select().from(builderProjects).where(eq(builderProjects.id, id));
    return result[0];
  }

  async createBuilderProject(project: InsertBuilderProject): Promise<BuilderProject> {
    const result = await db.insert(builderProjects).values(project).returning();
    return result[0];
  }

  async getService(id: string): Promise<Service | undefined> {
    const result = await db.select().from(services).where(eq(services.id, id));
    return result[0];
  }

  async getServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  async getServicesByBuilder(builderId: string): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.builderId, builderId));
  }

  async getFeaturedServices(): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.featured, true)).limit(6);
  }

  async getServicesByCategory(categorySlug: string): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.category, categorySlug));
  }

  async createService(service: InsertService): Promise<Service> {
    const result = await db.insert(services).values(service).returning();
    return result[0];
  }

  async getCategory(slug: string): Promise<Category | undefined> {
    const result = await db.select().from(categories).where(eq(categories.slug, slug));
    return result[0];
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const result = await db.insert(categories).values(category).returning();
    return result[0];
  }

  async getReviewsByBuilder(builderId: string): Promise<Review[]> {
    return await db.select().from(reviews).where(eq(reviews.builderId, builderId));
  }

  async getReview(id: string): Promise<Review | undefined> {
    const result = await db.select().from(reviews).where(eq(reviews.id, id));
    return result[0];
  }

  async createReview(review: InsertReview): Promise<Review> {
    const result = await db.insert(reviews).values(review).returning();
    return result[0];
  }

  async addBuilderResponse(reviewId: string, response: string): Promise<Review> {
    const result = await db.update(reviews)
      .set({ 
        builderResponse: response,
        builderResponseAt: new Date().toISOString()
      })
      .where(eq(reviews.id, reviewId))
      .returning();
    return result[0];
  }

  async updateReviewStatus(reviewId: string, status: string, moderatorId: string, notes?: string): Promise<Review> {
    const result = await db.update(reviews)
      .set({ 
        status,
        moderatedBy: moderatorId,
        moderatedAt: new Date().toISOString(),
        moderatorNotes: notes
      })
      .where(eq(reviews.id, reviewId))
      .returning();
    return result[0];
  }

  async getReviewVote(reviewId: string, voterId: string): Promise<ReviewVote | undefined> {
    const result = await db.select().from(reviewVotes).where(
      and(eq(reviewVotes.reviewId, reviewId), eq(reviewVotes.voterId, voterId))
    );
    return result[0];
  }

  async createReviewVote(vote: InsertReviewVote): Promise<ReviewVote> {
    const result = await db.insert(reviewVotes).values(vote).returning();
    return result[0];
  }

  async deleteReviewVote(reviewId: string, voterId: string): Promise<void> {
    await db.delete(reviewVotes).where(
      and(eq(reviewVotes.reviewId, reviewId), eq(reviewVotes.voterId, voterId))
    );
  }

  async updateReviewVoteCount(reviewId: string): Promise<Review> {
    const votes = await db.select().from(reviewVotes).where(eq(reviewVotes.reviewId, reviewId));
    const helpfulCount = votes.filter(v => v.voteType === 'helpful').length;
    const notHelpfulCount = votes.filter(v => v.voteType === 'not_helpful').length;
    
    const result = await db.update(reviews)
      .set({ helpfulCount, notHelpfulCount })
      .where(eq(reviews.id, reviewId))
      .returning();
    return result[0];
  }

  async getReviewDispute(reviewId: string): Promise<ReviewDispute | undefined> {
    const result = await db.select().from(reviewDisputes).where(eq(reviewDisputes.reviewId, reviewId));
    return result[0];
  }

  async getReviewDisputes(): Promise<ReviewDispute[]> {
    return await db.select().from(reviewDisputes);
  }

  async createReviewDispute(dispute: InsertReviewDispute): Promise<ReviewDispute> {
    const result = await db.insert(reviewDisputes).values(dispute).returning();
    return result[0];
  }

  async resolveReviewDispute(disputeId: string, resolution: string, resolvedBy: string): Promise<ReviewDispute> {
    const result = await db.update(reviewDisputes)
      .set({
        status: 'resolved',
        resolution,
        resolvedBy,
        resolvedAt: new Date().toISOString()
      })
      .where(eq(reviewDisputes.id, disputeId))
      .returning();
    return result[0];
  }

  async getBuilderApplication(id: string): Promise<BuilderApplication | undefined> {
    const result = await db.select().from(builderApplications).where(eq(builderApplications.id, id));
    return result[0];
  }

  async getBuilderApplications(): Promise<BuilderApplication[]> {
    return await db.select().from(builderApplications);
  }

  async createBuilderApplication(application: InsertBuilderApplication): Promise<BuilderApplication> {
    const result = await db.insert(builderApplications).values(application).returning();
    return result[0];
  }

  async approveBuilderApplication(id: string): Promise<Builder> {
    const application = await this.getBuilderApplication(id);
    if (!application) {
      throw new Error('Application not found');
    }

    // Check if this is one of the first 50 approved builders for whitelist
    const currentBuilderCount = await db.select({ count: sqlFunc<number>`count(*)` }).from(builders);
    const builderNum = Number(currentBuilderCount[0]?.count || 0) + 1;
    const shouldWhitelist = builderNum <= 50;

    const builder = await this.createBuilder({
      walletAddress: application.walletAddress,
      name: application.name,
      headline: `${application.category} Expert`,
      bio: application.bio,
      category: application.category,
      portfolioLinks: application.portfolioLinks || [],
      skills: [],
      twitterHandle: application.twitterHandle,
      twitterFollowers: application.twitterFollowers,
      instagramHandle: application.instagramHandle,
      instagramFollowers: application.instagramFollowers,
      youtubeChannel: application.youtubeChannel,
      youtubeSubscribers: application.youtubeSubscribers,
      engagementRate: application.engagementRate,
      contentNiches: application.contentNiches,
      software3D: application.software3D,
      renderEngines: application.renderEngines,
      styleSpecialties: application.styleSpecialties,
      marketingPlatforms: application.marketingPlatforms,
      growthStrategies: application.growthStrategies,
      programmingLanguages: application.programmingLanguages,
      blockchainFrameworks: application.blockchainFrameworks,
      githubProfile: application.githubProfile,
      tradingExperience: application.tradingExperience,
      volumeCapabilities: application.volumeCapabilities,
      complianceKnowledge: application.complianceKnowledge,
      tokenGateWhitelisted: shouldWhitelist,
    });

    await db.update(builderApplications)
      .set({ status: 'approved' })
      .where(eq(builderApplications.id, id));

    return builder;
  }

  async getClient(id: string): Promise<Client | undefined> {
    const result = await db.select().from(clients).where(eq(clients.id, id));
    return result[0];
  }

  async getClientByWallet(walletAddress: string): Promise<Client | undefined> {
    const result = await db.select().from(clients).where(eq(clients.walletAddress, walletAddress));
    return result[0];
  }

  async getClients(): Promise<Client[]> {
    return await db.select().from(clients);
  }

  async createClient(client: InsertClient): Promise<Client> {
    // Check if this is one of the first 2 clients for whitelist
    const currentClientCount = await db.select({ count: sqlFunc<number>`count(*)` }).from(clients);
    const clientNum = Number(currentClientCount[0]?.count || 0) + 1;
    const shouldWhitelist = clientNum <= 2;

    const result = await db.insert(clients).values({
      ...client,
      tokenGateWhitelisted: shouldWhitelist
    }).returning();
    return result[0];
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const result = await db.select().from(orders).where(eq(orders.id, id));
    return result[0];
  }

  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders);
  }

  async getOrdersByClient(clientId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.clientId, clientId));
  }

  async getOrdersByBuilder(builderId: string): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.builderId, builderId));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const result = await db.insert(orders).values(order).returning();
    return result[0];
  }

  async updateOrder(id: string, data: Partial<Order>): Promise<Order> {
    const result = await db.update(orders)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(orders.id, id))
      .returning();
    return result[0];
  }

  async cancelOrder(id: string, reason: string, refundAmount?: number): Promise<Order> {
    const result = await db.update(orders)
      .set({
        status: 'cancelled',
        cancellationReason: reason,
        refundAmount: refundAmount?.toString(),
        cancelledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .where(eq(orders.id, id))
      .returning();
    return result[0];
  }

  async getOrderRevisions(orderId: string): Promise<OrderRevision[]> {
    return await db.select().from(orderRevisions).where(eq(orderRevisions.orderId, orderId));
  }

  async createOrderRevision(revision: InsertOrderRevision): Promise<OrderRevision> {
    const result = await db.insert(orderRevisions).values(revision).returning();
    return result[0];
  }

  async updateOrderRevision(id: string, data: Partial<OrderRevision>): Promise<OrderRevision> {
    const result = await db.update(orderRevisions)
      .set(data)
      .where(eq(orderRevisions.id, id))
      .returning();
    return result[0];
  }

  async getOrderActivities(orderId: string): Promise<OrderActivity[]> {
    return await db.select().from(orderActivities).where(eq(orderActivities.orderId, orderId));
  }

  async createOrderActivity(activity: InsertOrderActivity): Promise<OrderActivity> {
    const result = await db.insert(orderActivities).values(activity).returning();
    return result[0];
  }

  async getMilestonesByProject(projectId: string): Promise<Milestone[]> {
    return await db.select().from(milestones).where(eq(milestones.projectId, projectId));
  }

  async createMilestone(milestone: InsertMilestone): Promise<Milestone> {
    const result = await db.insert(milestones).values(milestone).returning();
    return result[0];
  }

  async updateMilestoneStatus(id: string, status: string, transactionHash?: string): Promise<Milestone> {
    const result = await db.update(milestones)
      .set({
        status,
        transactionHash,
        completedAt: status === 'completed' ? new Date().toISOString() : undefined
      })
      .where(eq(milestones.id, id))
      .returning();
    return result[0];
  }

  async getAdmin(username: string): Promise<Admin | undefined> {
    const result = await db.select().from(admins).where(eq(admins.username, username));
    return result[0];
  }
  
  async getAdminById(id: string): Promise<Admin | undefined> {
    const result = await db.select().from(admins).where(eq(admins.id, id));
    return result[0];
  }

  async getAdmins(): Promise<Admin[]> {
    return await db.select().from(admins);
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const result = await db.insert(admins).values(admin).returning();
    return result[0];
  }

  async updateAdmin(id: string, data: Partial<Admin>): Promise<Admin> {
    const result = await db.update(admins)
      .set(data)
      .where(eq(admins.id, id))
      .returning();
    return result[0];
  }

  async deleteAdmin(id: string): Promise<void> {
    await db.delete(admins).where(eq(admins.id, id));
  }

  async verifyAdminPassword(username: string, password: string): Promise<Admin | null> {
    const admin = await this.getAdmin(username);
    if (!admin) return null;

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    return isValid ? admin : null;
  }

  async updateLastLogin(username: string): Promise<void> {
    await db.update(admins)
      .set({ lastLogin: new Date().toISOString() })
      .where(eq(admins.username, username));
  }

  async getReferral(id: string): Promise<Referral | undefined> {
    const result = await db.select().from(referrals).where(eq(referrals.id, id));
    return result[0];
  }

  async getReferrals(): Promise<Referral[]> {
    return await db.select().from(referrals);
  }

  async getReferralsByWallet(wallet: string): Promise<Referral[]> {
    return await db.select().from(referrals).where(
      or(eq(referrals.referrerWallet, wallet), eq(referrals.referredWallet, wallet))
    );
  }

  async createReferral(referral: InsertReferral): Promise<Referral> {
    const result = await db.insert(referrals).values(referral).returning();
    return result[0];
  }

  async updateReferralStatus(id: string, status: string): Promise<Referral> {
    const result = await db.update(referrals)
      .set({
        status,
        completedAt: status === 'completed' ? new Date().toISOString() : undefined
      })
      .where(eq(referrals.id, id))
      .returning();
    return result[0];
  }

  async deleteReferral(id: string): Promise<void> {
    await db.delete(referrals).where(eq(referrals.id, id));
  }

  async updateBuilder(id: string, data: Partial<Builder>): Promise<Builder> {
    const result = await db.update(builders)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(builders.id, id))
      .returning();
    return result[0];
  }

  async deleteBuilder(id: string): Promise<void> {
    await db.delete(builders).where(eq(builders.id, id));
  }

  async toggleBuilderAvailability(builderId: string, accepting: boolean): Promise<Builder> {
    const result = await db.update(builders)
      .set({ acceptingOrders: accepting })
      .where(eq(builders.id, builderId))
      .returning();
    return result[0];
  }

  async updateBuilderActivity(builderId: string): Promise<Builder> {
    const result = await db.update(builders)
      .set({ lastActiveAt: new Date().toISOString() })
      .where(eq(builders.id, builderId))
      .returning();
    return result[0];
  }

  async getBuilderAnalytics(builderId: string): Promise<{
    totalEarnings: string;
    availableBalance: string;
    pendingPayouts: string;
    activeOrders: number;
    completedOrders: number;
    successRate: string;
    avgResponseTime: number;
    onTimeDeliveryRate: string;
  }> {
    const builder = await this.getBuilder(builderId);
    if (!builder) {
      throw new Error('Builder not found');
    }

    const builderOrders = await this.getOrdersByBuilder(builderId);
    const completedOrders = builderOrders.filter(o => o.status === 'completed').length;

    return {
      totalEarnings: builder.totalEarnings || "0",
      availableBalance: builder.availableBalance || "0",
      pendingPayouts: builder.pendingPayouts || "0",
      activeOrders: builder.activeOrders || 0,
      completedOrders,
      successRate: builder.successRate || "100",
      avgResponseTime: builder.avgResponseTimeHours || 24,
      onTimeDeliveryRate: builder.onTimeDeliveryRate || "100",
    };
  }

  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    const result = await db.update(services)
      .set(data)
      .where(eq(services.id, id))
      .returning();
    return result[0];
  }

  async deleteService(id: string): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  async updateClient(id: string, data: Partial<Client>): Promise<Client> {
    const result = await db.update(clients)
      .set(data)
      .where(eq(clients.id, id))
      .returning();
    return result[0];
  }

  async deleteClient(id: string): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  async updateBuilderApplication(id: string, data: Partial<BuilderApplication>): Promise<BuilderApplication> {
    const result = await db.update(builderApplications)
      .set(data)
      .where(eq(builderApplications.id, id))
      .returning();
    return result[0];
  }

  async deleteBuilderApplication(id: string): Promise<void> {
    await db.delete(builderApplications).where(eq(builderApplications.id, id));
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const result = await db.select().from(payments).where(eq(payments.id, id));
    return result[0];
  }

  async getPayments(): Promise<Payment[]> {
    return await db.select().from(payments);
  }

  async getPaymentsByOrder(orderId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.orderId, orderId));
  }

  async getPaymentsByClient(clientId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.clientId, clientId));
  }

  async getPaymentsByBuilder(builderId: string): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.builderId, builderId));
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const result = await db.insert(payments).values(payment).returning();
    return result[0];
  }

  async updatePayment(id: string, data: Partial<Payment>): Promise<Payment> {
    const result = await db.update(payments)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(payments.id, id))
      .returning();
    return result[0];
  }

  async getMilestonePayment(id: string): Promise<MilestonePayment | undefined> {
    const result = await db.select().from(milestonePayments).where(eq(milestonePayments.id, id));
    return result[0];
  }

  async getMilestonePaymentsByPayment(paymentId: string): Promise<MilestonePayment[]> {
    return await db.select().from(milestonePayments).where(eq(milestonePayments.paymentId, paymentId));
  }

  async getMilestonePaymentsByOrder(orderId: string): Promise<MilestonePayment[]> {
    return await db.select().from(milestonePayments).where(eq(milestonePayments.orderId, orderId));
  }

  async createMilestonePayment(milestonePayment: InsertMilestonePayment): Promise<MilestonePayment> {
    const result = await db.insert(milestonePayments).values(milestonePayment).returning();
    return result[0];
  }

  async updateMilestonePayment(id: string, data: Partial<MilestonePayment>): Promise<MilestonePayment> {
    const result = await db.update(milestonePayments)
      .set(data)
      .where(eq(milestonePayments.id, id))
      .returning();
    return result[0];
  }

  async releaseMilestonePayment(id: string, transactionHash: string): Promise<MilestonePayment> {
    const result = await db.update(milestonePayments)
      .set({
        status: 'released',
        transactionHash,
        releasedAt: new Date().toISOString()
      })
      .where(eq(milestonePayments.id, id))
      .returning();
    return result[0];
  }

  async getPayout(id: string): Promise<Payout | undefined> {
    const result = await db.select().from(payouts).where(eq(payouts.id, id));
    return result[0];
  }

  async getPayouts(): Promise<Payout[]> {
    return await db.select().from(payouts);
  }

  async getPayoutsByBuilder(builderId: string): Promise<Payout[]> {
    return await db.select().from(payouts).where(eq(payouts.builderId, builderId));
  }

  async createPayout(payout: InsertPayout): Promise<Payout> {
    const result = await db.insert(payouts).values(payout).returning();
    return result[0];
  }

  async updatePayout(id: string, data: Partial<Payout>): Promise<Payout> {
    const result = await db.update(payouts)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(payouts.id, id))
      .returning();
    return result[0];
  }

  async processPayout(id: string, transactionHash: string): Promise<Payout> {
    const result = await db.update(payouts)
      .set({
        status: 'completed',
        transactionHash,
        processedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .where(eq(payouts.id, id))
      .returning();
    return result[0];
  }

  async getDispute(id: string): Promise<Dispute | undefined> {
    const result = await db.select().from(disputes).where(eq(disputes.id, id));
    return result[0];
  }

  async getDisputes(): Promise<Dispute[]> {
    return await db.select().from(disputes);
  }

  async getDisputesByOrder(orderId: string): Promise<Dispute[]> {
    return await db.select().from(disputes).where(eq(disputes.orderId, orderId));
  }

  async getDisputesByPayment(paymentId: string): Promise<Dispute[]> {
    return await db.select().from(disputes).where(eq(disputes.paymentId, paymentId));
  }

  async createDispute(dispute: InsertDispute): Promise<Dispute> {
    const result = await db.insert(disputes).values(dispute).returning();
    return result[0];
  }

  async updateDispute(id: string, data: Partial<Dispute>): Promise<Dispute> {
    const result = await db.update(disputes)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(disputes.id, id))
      .returning();
    return result[0];
  }

  async resolveDispute(id: string, resolution: string, resolvedBy: string, refundAmount?: number): Promise<Dispute> {
    const result = await db.update(disputes)
      .set({
        status: 'resolved',
        resolution,
        resolvedBy,
        resolvedAt: new Date().toISOString(),
        refundAmount: refundAmount?.toString(),
        updatedAt: new Date().toISOString()
      })
      .where(eq(disputes.id, id))
      .returning();
    return result[0];
  }

  async getRefund(id: string): Promise<Refund | undefined> {
    const result = await db.select().from(refunds).where(eq(refunds.id, id));
    return result[0];
  }

  async getRefunds(): Promise<Refund[]> {
    return await db.select().from(refunds);
  }

  async getRefundsByOrder(orderId: string): Promise<Refund[]> {
    return await db.select().from(refunds).where(eq(refunds.orderId, orderId));
  }

  async getRefundsByPayment(paymentId: string): Promise<Refund[]> {
    return await db.select().from(refunds).where(eq(refunds.paymentId, paymentId));
  }

  async createRefund(refund: InsertRefund): Promise<Refund> {
    const result = await db.insert(refunds).values(refund).returning();
    return result[0];
  }

  async updateRefund(id: string, data: Partial<Refund>): Promise<Refund> {
    const result = await db.update(refunds)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(refunds.id, id))
      .returning();
    return result[0];
  }

  async processRefund(id: string, transactionHash: string): Promise<Refund> {
    const result = await db.update(refunds)
      .set({
        status: 'completed',
        transactionHash,
        processedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .where(eq(refunds.id, id))
      .returning();
    return result[0];
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    const result = await db.select().from(invoices).where(eq(invoices.id, id));
    return result[0];
  }

  async getInvoices(): Promise<Invoice[]> {
    return await db.select().from(invoices);
  }

  async getInvoicesByClient(clientId: string): Promise<Invoice[]> {
    return await db.select().from(invoices).where(eq(invoices.clientId, clientId));
  }

  async getInvoicesByBuilder(builderId: string): Promise<Invoice[]> {
    return await db.select().from(invoices).where(eq(invoices.builderId, builderId));
  }

  async getInvoiceByPayment(paymentId: string): Promise<Invoice | undefined> {
    const result = await db.select().from(invoices).where(eq(invoices.paymentId, paymentId));
    return result[0];
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const result = await db.insert(invoices).values(invoice).returning();
    return result[0];
  }

  async updateInvoice(id: string, data: Partial<Invoice>): Promise<Invoice> {
    const result = await db.update(invoices)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(invoices.id, id))
      .returning();
    return result[0];
  }

  async getChatThread(id: string): Promise<ChatThread | undefined> {
    const result = await db.select().from(chatThreads).where(eq(chatThreads.id, id));
    return result[0];
  }

  async getChatThreadsByClient(clientId: string): Promise<ChatThread[]> {
    return await db.select().from(chatThreads).where(eq(chatThreads.clientId, clientId));
  }

  async getChatThreadsByBuilder(builderId: string): Promise<ChatThread[]> {
    return await db.select().from(chatThreads).where(eq(chatThreads.builderId, builderId));
  }

  async getChatThreadByOrder(orderId: string): Promise<ChatThread | undefined> {
    const result = await db.select().from(chatThreads).where(eq(chatThreads.orderId, orderId));
    return result[0];
  }

  async findOrCreateChatThread(clientId: string, builderId: string, orderId?: string): Promise<ChatThread> {
    const existing = await db.select().from(chatThreads).where(
      and(
        eq(chatThreads.clientId, clientId),
        eq(chatThreads.builderId, builderId),
        orderId ? eq(chatThreads.orderId, orderId) : sqlFunc`${chatThreads.orderId} IS NULL`
      )
    );

    if (existing[0]) {
      return existing[0];
    }

    const result = await db.insert(chatThreads).values({
      clientId,
      builderId,
      orderId,
      title: `Chat with ${builderId}`,
    }).returning();

    return result[0];
  }

  async createChatThread(thread: InsertChatThread): Promise<ChatThread> {
    const result = await db.insert(chatThreads).values(thread).returning();
    return result[0];
  }

  async updateChatThread(id: string, data: Partial<ChatThread>): Promise<ChatThread> {
    const result = await db.update(chatThreads)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(chatThreads.id, id))
      .returning();
    return result[0];
  }

  async archiveChatThread(id: string, userType: string): Promise<ChatThread> {
    const updateData = userType === 'client' 
      ? { archivedByClient: true }
      : { archivedByBuilder: true };

    const result = await db.update(chatThreads)
      .set({ ...updateData, updatedAt: new Date().toISOString() })
      .where(eq(chatThreads.id, id))
      .returning();
    return result[0];
  }

  async updateThreadUnreadCount(threadId: string, userType: string, increment: boolean): Promise<ChatThread> {
    const thread = await this.getChatThread(threadId);
    if (!thread) throw new Error('Thread not found');

    const fieldName = userType === 'client' ? 'clientUnreadCount' : 'builderUnreadCount';
    const currentCount = userType === 'client' ? thread.clientUnreadCount : thread.builderUnreadCount;
    const newCount = increment ? currentCount + 1 : 0;

    const updateData = userType === 'client'
      ? { clientUnreadCount: newCount }
      : { builderUnreadCount: newCount };

    const result = await db.update(chatThreads)
      .set({ ...updateData, updatedAt: new Date().toISOString() })
      .where(eq(chatThreads.id, threadId))
      .returning();
    return result[0];
  }

  async getMessage(id: string): Promise<Message | undefined> {
    const result = await db.select().from(messages).where(eq(messages.id, id));
    return result[0];
  }

  async getMessagesByThread(threadId: string): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.threadId, threadId)).orderBy(desc(messages.createdAt));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const result = await db.insert(messages).values(message).returning();
    return result[0];
  }

  async updateMessage(id: string, data: Partial<Message>): Promise<Message> {
    const result = await db.update(messages)
      .set({ 
        ...data,
        edited: true,
        editedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .where(eq(messages.id, id))
      .returning();
    return result[0];
  }

  async deleteMessage(id: string): Promise<Message> {
    const result = await db.update(messages)
      .set({
        deleted: true,
        deletedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .where(eq(messages.id, id))
      .returning();
    return result[0];
  }

  async getMessageAttachment(id: string): Promise<MessageAttachment | undefined> {
    const result = await db.select().from(messageAttachments).where(eq(messageAttachments.id, id));
    return result[0];
  }

  async getMessageAttachmentsByMessage(messageId: string): Promise<MessageAttachment[]> {
    return await db.select().from(messageAttachments).where(eq(messageAttachments.messageId, messageId));
  }

  async createMessageAttachment(attachment: InsertMessageAttachment): Promise<MessageAttachment> {
    const result = await db.insert(messageAttachments).values(attachment).returning();
    return result[0];
  }

  async getMessageReadReceipt(messageId: string, readerId: string): Promise<MessageReadReceipt | undefined> {
    const result = await db.select().from(messageReadReceipts).where(
      and(eq(messageReadReceipts.messageId, messageId), eq(messageReadReceipts.readerId, readerId))
    );
    return result[0];
  }

  async getMessageReadReceiptsByThread(threadId: string, readerId: string): Promise<MessageReadReceipt[]> {
    return await db.select().from(messageReadReceipts).where(
      and(eq(messageReadReceipts.threadId, threadId), eq(messageReadReceipts.readerId, readerId))
    );
  }

  async createMessageReadReceipt(receipt: InsertMessageReadReceipt): Promise<MessageReadReceipt> {
    const result = await db.insert(messageReadReceipts).values(receipt).returning();
    return result[0];
  }

  async markThreadAsRead(threadId: string, readerId: string, readerType: string): Promise<void> {
    const msgs = await db.select().from(messages).where(eq(messages.threadId, threadId));
    
    for (const msg of msgs) {
      const existing = await this.getMessageReadReceipt(msg.id, readerId);
      if (!existing) {
        await this.createMessageReadReceipt({
          messageId: msg.id,
          threadId: threadId,
          readerId: readerId,
          readerType: readerType,
        });
      }
    }

    await this.updateThreadUnreadCount(threadId, readerType, false);
  }

  async getProjectDeliverable(id: string): Promise<ProjectDeliverable | undefined> {
    const result = await db.select().from(projectDeliverables).where(eq(projectDeliverables.id, id));
    return result[0];
  }

  async getProjectDeliverablesByOrder(orderId: string): Promise<ProjectDeliverable[]> {
    return await db.select().from(projectDeliverables).where(eq(projectDeliverables.orderId, orderId));
  }

  async getProjectDeliverablesByMilestone(milestoneId: string): Promise<ProjectDeliverable[]> {
    return await db.select().from(projectDeliverables).where(eq(projectDeliverables.milestoneId, milestoneId));
  }

  async createProjectDeliverable(deliverable: InsertProjectDeliverable): Promise<ProjectDeliverable> {
    const result = await db.insert(projectDeliverables).values(deliverable).returning();
    return result[0];
  }

  async updateProjectDeliverable(id: string, data: Partial<ProjectDeliverable>): Promise<ProjectDeliverable> {
    const result = await db.update(projectDeliverables)
      .set(data)
      .where(eq(projectDeliverables.id, id))
      .returning();
    return result[0];
  }

  async reviewProjectDeliverable(id: string, reviewedBy: string, reviewNotes: string, accepted: boolean, rejectionReason?: string): Promise<ProjectDeliverable> {
    const result = await db.update(projectDeliverables)
      .set({
        reviewedBy,
        reviewedAt: new Date().toISOString(),
        reviewNotes,
        status: accepted ? 'accepted' : 'rejected',
        acceptedAt: accepted ? new Date().toISOString() : undefined,
        rejectedAt: !accepted ? new Date().toISOString() : undefined,
        rejectionReason: rejectionReason || undefined,
      })
      .where(eq(projectDeliverables.id, id))
      .returning();
    return result[0];
  }

  async requestDeliverableRevision(id: string, reviewNotes: string): Promise<ProjectDeliverable> {
    const result = await db.update(projectDeliverables)
      .set({
        status: 'revision_requested',
        revisionRequested: true,
        reviewNotes,
        reviewedAt: new Date().toISOString(),
      })
      .where(eq(projectDeliverables.id, id))
      .returning();
    return result[0];
  }

  async getProgressUpdate(id: string): Promise<ProgressUpdate | undefined> {
    const result = await db.select().from(progressUpdates).where(eq(progressUpdates.id, id));
    return result[0];
  }

  async getProgressUpdatesByOrder(orderId: string): Promise<ProgressUpdate[]> {
    return await db.select().from(progressUpdates).where(eq(progressUpdates.orderId, orderId));
  }

  async getProgressUpdatesByBuilder(builderId: string): Promise<ProgressUpdate[]> {
    return await db.select().from(progressUpdates).where(eq(progressUpdates.builderId, builderId));
  }

  async createProgressUpdate(update: InsertProgressUpdate): Promise<ProgressUpdate> {
    const result = await db.insert(progressUpdates).values(update).returning();
    return result[0];
  }

  async updateProgressUpdate(id: string, data: Partial<ProgressUpdate>): Promise<ProgressUpdate> {
    const result = await db.update(progressUpdates)
      .set(data)
      .where(eq(progressUpdates.id, id))
      .returning();
    return result[0];
  }

  async deleteProgressUpdate(id: string): Promise<void> {
    await db.delete(progressUpdates).where(eq(progressUpdates.id, id));
  }

  async getProjectDocument(id: string): Promise<ProjectDocument | undefined> {
    const result = await db.select().from(projectDocuments).where(eq(projectDocuments.id, id));
    return result[0];
  }

  async getProjectDocumentsByOrder(orderId: string): Promise<ProjectDocument[]> {
    return await db.select().from(projectDocuments).where(eq(projectDocuments.orderId, orderId));
  }

  async createProjectDocument(document: InsertProjectDocument): Promise<ProjectDocument> {
    const result = await db.insert(projectDocuments).values(document).returning();
    return result[0];
  }

  async updateProjectDocument(id: string, data: Partial<ProjectDocument>): Promise<ProjectDocument> {
    const result = await db.update(projectDocuments)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(projectDocuments.id, id))
      .returning();
    return result[0];
  }

  async deleteProjectDocument(id: string): Promise<void> {
    await db.delete(projectDocuments).where(eq(projectDocuments.id, id));
  }

  async getProjectDocumentVersions(orderId: string, documentName: string): Promise<ProjectDocument[]> {
    return await db.select().from(projectDocuments).where(
      and(eq(projectDocuments.orderId, orderId), eq(projectDocuments.documentName, documentName))
    ).orderBy(desc(projectDocuments.version));
  }

  async followBuilder(clientId: string, builderId: string): Promise<void> {
    await db.insert(builderFollows).values({ clientId, builderId });
  }

  async unfollowBuilder(clientId: string, builderId: string): Promise<void> {
    await db.delete(builderFollows).where(
      and(eq(builderFollows.clientId, clientId), eq(builderFollows.builderId, builderId))
    );
  }

  async isFollowingBuilder(clientId: string, builderId: string): Promise<boolean> {
    const result = await db.select().from(builderFollows).where(
      and(eq(builderFollows.clientId, clientId), eq(builderFollows.builderId, builderId))
    );
    return result.length > 0;
  }

  async getBuilderFollowers(builderId: string): Promise<string[]> {
    const result = await db.select().from(builderFollows).where(eq(builderFollows.builderId, builderId));
    return result.map(f => f.clientId);
  }

  async getFollowedBuilders(clientId: string): Promise<string[]> {
    const result = await db.select().from(builderFollows).where(eq(builderFollows.clientId, clientId));
    return result.map(f => f.builderId);
  }

  async getBuilderFollowerCount(builderId: string): Promise<number> {
    const result = await db.select({ count: count() }).from(builderFollows).where(eq(builderFollows.builderId, builderId));
    return result[0]?.count || 0;
  }

  async createBuilderActivity(activity: { builderId: string; activityType: string; activityData?: string; metadata?: string }): Promise<void> {
    await db.insert(builderActivityFeed).values(activity);
  }

  async getBuilderActivityFeed(builderId: string, limit: number = 50): Promise<any[]> {
    return await db.select().from(builderActivityFeed).where(eq(builderActivityFeed.builderId, builderId)).limit(limit);
  }

  async getFollowedBuildersActivity(clientId: string, limit: number = 50): Promise<any[]> {
    const followedBuilders = await this.getFollowedBuilders(clientId);
    if (followedBuilders.length === 0) return [];

    const result = await db.select().from(builderActivityFeed)
      .where(sqlFunc`${builderActivityFeed.builderId} = ANY(${followedBuilders})`)
      .limit(limit);
    return result;
  }

  async createBuilderBadge(badge: { builderId: string; badgeType: string; badgeLabel: string; badgeIcon?: string; badgeColor?: string }): Promise<void> {
    await db.insert(builderBadges).values(badge);
  }

  async getBuilderBadges(builderId: string): Promise<any[]> {
    return await db.select().from(builderBadges).where(eq(builderBadges.builderId, builderId));
  }

  async removeBuilderBadge(builderId: string, badgeType: string): Promise<void> {
    await db.delete(builderBadges).where(
      and(eq(builderBadges.builderId, builderId), eq(builderBadges.badgeType, badgeType))
    );
  }

  async createBuilderTestimonial(testimonial: { builderId: string; clientId: string; content: string; authorName: string; authorTitle?: string; rating?: string; orderId?: string }): Promise<void> {
    await db.insert(builderTestimonials).values(testimonial);
  }

  async getBuilderTestimonials(builderId: string, approvedOnly: boolean = false): Promise<any[]> {
    if (approvedOnly) {
      return await db.select().from(builderTestimonials).where(
        and(eq(builderTestimonials.builderId, builderId), eq(builderTestimonials.isApproved, true))
      );
    }
    return await db.select().from(builderTestimonials).where(eq(builderTestimonials.builderId, builderId));
  }

  async approveBuilderTestimonial(testimonialId: string): Promise<void> {
    await db.update(builderTestimonials)
      .set({ isApproved: true })
      .where(eq(builderTestimonials.id, testimonialId));
  }

  async featureBuilderTestimonial(testimonialId: string, featured: boolean): Promise<void> {
    await db.update(builderTestimonials)
      .set({ isFeatured: featured })
      .where(eq(builderTestimonials.id, testimonialId));
  }

  async trackBuilderView(builderId: string, viewerId?: string, viewerType?: string): Promise<void> {
    await db.insert(builderViews).values({ builderId, viewerId, viewerType });
  }

  async getBuilderViewCount(builderId: string, period?: string): Promise<number> {
    const result = await db.select({ count: count() }).from(builderViews).where(eq(builderViews.builderId, builderId));
    return result[0]?.count || 0;
  }

  async getBuilderViewStats(builderId: string): Promise<{ totalViews: number; uniqueViewers: number; last30Days: number }> {
    const allViews = await db.select().from(builderViews).where(eq(builderViews.builderId, builderId));
    const uniqueViewers = new Set(allViews.filter(v => v.viewerId).map(v => v.viewerId)).size;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentViews = allViews.filter(v => new Date(v.viewedAt) > thirtyDaysAgo);

    return {
      totalViews: allViews.length,
      uniqueViewers,
      last30Days: recentViews.length,
    };
  }

  async calculatePlatformStatistics(): Promise<void> {
    const allBuilders = await this.getBuilders();
    const allOrders = await this.getOrders();
    
    await db.insert(platformStatistics).values({
      metricName: 'total_builders',
      metricValue: allBuilders.length.toString(),
      metricType: 'count',
    });

    await db.insert(platformStatistics).values({
      metricName: 'total_orders',
      metricValue: allOrders.length.toString(),
      metricType: 'count',
    });
  }

  async getPlatformStatistics(category?: string): Promise<any[]> {
    if (category) {
      return await db.select().from(platformStatistics).where(eq(platformStatistics.category, category));
    }
    return await db.select().from(platformStatistics);
  }

  async getClientAnalytics(clientId: string): Promise<{
    totalSpent: number;
    projectsCompleted: number;
    activeProjects: number;
    averageRating: number;
    favoriteCategories: string[];
  }> {
    const clientOrders = await this.getOrdersByClient(clientId);
    const completedOrders = clientOrders.filter(o => o.status === 'completed');
    const activeOrders = clientOrders.filter(o => ['pending', 'in_progress'].includes(o.status));
    
    const totalSpent = completedOrders.reduce((sum, o) => sum + parseFloat(o.budget || '0'), 0);

    return {
      totalSpent,
      projectsCompleted: completedOrders.length,
      activeProjects: activeOrders.length,
      averageRating: 0,
      favoriteCategories: [],
    };
  }

  async createApplicationRevision(applicationId: string, changesRequested: string, requestedBy: string): Promise<void> {
    const existingRevisions = await db.select().from(builderApplicationRevisions)
      .where(eq(builderApplicationRevisions.applicationId, applicationId));
    
    await db.insert(builderApplicationRevisions).values({
      applicationId,
      revisionNumber: existingRevisions.length + 1,
      changesRequested,
      requestedBy,
    });
  }

  async getApplicationRevisions(applicationId: string): Promise<any[]> {
    return await db.select().from(builderApplicationRevisions)
      .where(eq(builderApplicationRevisions.applicationId, applicationId));
  }

  async submitApplicationRevision(revisionId: string, submittedData: string): Promise<void> {
    await db.update(builderApplicationRevisions)
      .set({
        submittedData,
        status: 'submitted',
        resubmittedAt: new Date().toISOString(),
      })
      .where(eq(builderApplicationRevisions.id, revisionId));
  }

  async getBuilderApplicationByEmail(email: string): Promise<BuilderApplication | undefined> {
    const result = await db.select().from(builderApplications).where(eq(builderApplications.email, email));
    return result[0];
  }

  async createBuilderOnboarding(builderId: string, applicationId: string): Promise<void> {
    await db.insert(builderOnboarding).values({ builderId, applicationId });
  }

  async getBuilderOnboarding(builderId: string): Promise<any | undefined> {
    const result = await db.select().from(builderOnboarding).where(eq(builderOnboarding.builderId, builderId));
    return result[0];
  }

  async updateOnboardingStep(builderId: string, step: string, completed: boolean): Promise<void> {
    const onboarding = await this.getBuilderOnboarding(builderId);
    if (!onboarding) return;

    const updateData: any = { updatedAt: new Date().toISOString() };
    
    if (step === 'profile') updateData.stepProfileComplete = completed;
    else if (step === 'services') updateData.stepServicesAdded = completed;
    else if (step === 'portfolio') updateData.stepPortfolioAdded = completed;
    else if (step === 'payment') updateData.stepPaymentSetup = completed;
    else if (step === 'verification') updateData.stepVerificationComplete = completed;

    await db.update(builderOnboarding)
      .set(updateData)
      .where(eq(builderOnboarding.builderId, builderId));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const result = await db.insert(notifications).values(notification).returning();
    return result[0];
  }

  async getNotifications(recipientId: string, recipientType: string, limit: number = 50, unreadOnly: boolean = false): Promise<Notification[]> {
    const conditions = [
      eq(notifications.recipientId, recipientId),
      eq(notifications.recipientType, recipientType)
    ];

    if (unreadOnly) {
      conditions.push(eq(notifications.isRead, false));
    }

    return await db.select().from(notifications)
      .where(and(...conditions))
      .orderBy(desc(notifications.createdAt))
      .limit(limit);
  }

  async getNotification(id: string): Promise<Notification | undefined> {
    const result = await db.select().from(notifications).where(eq(notifications.id, id));
    return result[0];
  }

  async markNotificationAsRead(id: string): Promise<Notification> {
    const result = await db.update(notifications)
      .set({
        isRead: true,
        readAt: new Date().toISOString()
      })
      .where(eq(notifications.id, id))
      .returning();
    return result[0];
  }

  async markAllNotificationsAsRead(recipientId: string, recipientType: string): Promise<void> {
    await db.update(notifications)
      .set({
        isRead: true,
        readAt: new Date().toISOString()
      })
      .where(
        and(
          eq(notifications.recipientId, recipientId),
          eq(notifications.recipientType, recipientType),
          eq(notifications.isRead, false)
        )
      );
  }

  async deleteNotification(id: string): Promise<void> {
    await db.delete(notifications).where(eq(notifications.id, id));
  }

  async getUnreadNotificationCount(recipientId: string, recipientType: string): Promise<number> {
    const result = await db.select({ count: count() }).from(notifications).where(
      and(
        eq(notifications.recipientId, recipientId),
        eq(notifications.recipientType, recipientType),
        eq(notifications.isRead, false)
      )
    );
    return result[0]?.count || 0;
  }

  async getNotificationPreferences(userId: string, userType: string): Promise<NotificationPreferences | undefined> {
    const result = await db.select().from(notificationPreferences).where(
      and(eq(notificationPreferences.userId, userId), eq(notificationPreferences.userType, userType))
    );
    return result[0];
  }

  async createNotificationPreferences(preferences: InsertNotificationPreferences): Promise<NotificationPreferences> {
    const result = await db.insert(notificationPreferences).values(preferences).returning();
    return result[0];
  }

  async updateNotificationPreferences(userId: string, userType: string, data: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    let existing = await this.getNotificationPreferences(userId, userType);
    
    if (!existing) {
      existing = await this.createNotificationPreferences({
        userId,
        userType,
        emailOrderUpdates: true,
        emailMessages: true,
        emailReviews: true,
        emailPayments: true,
        emailMarketing: false,
        pushOrderUpdates: true,
        pushMessages: true,
        pushReviews: true,
        pushPayments: true,
        inAppOrderUpdates: true,
        inAppMessages: true,
        inAppReviews: true,
        inAppPayments: true,
      });
    }

    const result = await db.update(notificationPreferences)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(notificationPreferences.id, existing.id))
      .returning();
    return result[0];
  }

  async createPushSubscription(subscription: InsertPushSubscription): Promise<PushSubscription> {
    const result = await db.insert(pushSubscriptions).values(subscription).returning();
    return result[0];
  }

  async getPushSubscriptions(userId: string, userType: string): Promise<PushSubscription[]> {
    return await db.select().from(pushSubscriptions).where(
      and(eq(pushSubscriptions.userId, userId), eq(pushSubscriptions.userType, userType))
    );
  }

  async deletePushSubscription(endpoint: string): Promise<void> {
    await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));
  }
  
  async createBuilderInviteToken(adminId: string, adminName: string, email?: string, notes?: string, expiresIn?: number): Promise<BuilderInviteToken> {
    const token = randomUUID().replace(/-/g, '');
    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000).toISOString() : undefined;
    
    const result = await db.insert(builderInviteTokens).values({
      token,
      createdBy: adminId,
      createdByName: adminName,
      email,
      notes,
      expiresAt,
      used: false,
    }).returning();
    
    return result[0];
  }
  
  async getBuilderInviteTokens(): Promise<BuilderInviteToken[]> {
    return await db.select().from(builderInviteTokens).orderBy(desc(builderInviteTokens.createdAt));
  }
  
  async getBuilderInviteToken(token: string): Promise<BuilderInviteToken | undefined> {
    const result = await db.select().from(builderInviteTokens).where(eq(builderInviteTokens.token, token));
    return result[0];
  }
  
  async useBuilderInviteToken(token: string, builderId: string, builderName: string): Promise<BuilderInviteToken> {
    const result = await db.update(builderInviteTokens)
      .set({
        used: true,
        usedBy: builderId,
        usedByName: builderName,
        usedAt: new Date().toISOString(),
      })
      .where(eq(builderInviteTokens.token, token))
      .returning();
    
    return result[0];
  }

  async deleteBuilderInviteToken(id: string): Promise<void> {
    await db.delete(builderInviteTokens).where(eq(builderInviteTokens.id, id));
  }

  async getPartners(options?: { category?: string; featured?: boolean; active?: boolean }): Promise<Partner[]> {
    let query = db.select().from(partners);
    
    const conditions = [];
    if (options?.category) {
      conditions.push(eq(partners.category, options.category));
    }
    if (options?.featured !== undefined) {
      conditions.push(eq(partners.featured, options.featured));
    }
    if (options?.active !== undefined) {
      conditions.push(eq(partners.active, options.active));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(partners.featured), desc(partners.successfulConnections));
  }

  async getPartner(id: string): Promise<Partner | undefined> {
    const result = await db.select().from(partners).where(eq(partners.id, id));
    return result[0];
  }

  async createPartner(partner: InsertPartner): Promise<Partner> {
    const result = await db.insert(partners).values(partner).returning();
    return result[0];
  }

  async updatePartner(id: string, data: Partial<Partner>): Promise<Partner> {
    const result = await db.update(partners)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(partners.id, id))
      .returning();
    return result[0];
  }

  async deletePartner(id: string): Promise<void> {
    await db.delete(partners).where(eq(partners.id, id));
  }

  async getPartnerConnectionRequests(options?: { partnerId?: string; userId?: string; status?: string }): Promise<PartnerConnectionRequest[]> {
    let query = db.select().from(partnerConnectionRequests);
    
    const conditions = [];
    if (options?.partnerId) {
      conditions.push(eq(partnerConnectionRequests.partnerId, options.partnerId));
    }
    if (options?.userId) {
      conditions.push(eq(partnerConnectionRequests.userId, options.userId));
    }
    if (options?.status) {
      conditions.push(eq(partnerConnectionRequests.status, options.status));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(partnerConnectionRequests.createdAt));
  }

  async getPartnerConnectionRequest(id: string): Promise<PartnerConnectionRequest | undefined> {
    const result = await db.select().from(partnerConnectionRequests).where(eq(partnerConnectionRequests.id, id));
    return result[0];
  }

  async createPartnerConnectionRequest(request: InsertPartnerConnectionRequest): Promise<PartnerConnectionRequest> {
    const result = await db.insert(partnerConnectionRequests).values(request).returning();
    return result[0];
  }

  async updatePartnerConnectionRequest(id: string, data: Partial<PartnerConnectionRequest>): Promise<PartnerConnectionRequest> {
    const result = await db.update(partnerConnectionRequests)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(partnerConnectionRequests.id, id))
      .returning();
    return result[0];
  }

  async deletePartnerConnectionRequest(id: string): Promise<void> {
    await db.delete(partnerConnectionRequests).where(eq(partnerConnectionRequests.id, id));
  }
}

export const storage = new PostgresStorage();
