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
  type BuilderTag,
  type InsertBuilderTag,
  type BuilderAdminNote,
  type InsertBuilderAdminNote,
  type UserOnlineStatus,
  type InsertUserOnlineStatus,
  type TypingIndicator,
  type InsertTypingIndicator,
  type SavedSearch,
  type InsertSavedSearch,
  type BuilderFavorite,
  type InsertBuilderFavorite,
  type SearchHistory,
  type InsertSearchHistory,
  type UserPreferences,
  type InsertUserPreferences,
  type FilterPreset,
  type InsertFilterPreset,
  type PlatformActivity,
  type InsertPlatformActivity,
  type ServiceView,
  type InsertServiceView,
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
  builderTags,
  builderAdminNotes,
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
  userOnlineStatus,
  typingIndicators,
  savedSearches,
  builderFavorites,
  searchHistory,
  userPreferences,
  filterPresets,
  platformActivity,
  serviceViews,
  builderAnalytics,
  serviceAnalytics,
  messageTemplates,
  referralCodes,
  disputeMessages,
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
  getLiveBuilders(category?: string): Promise<Builder[]>;
  updateBuilderLiveStatus(builderId: string, isLive: boolean): Promise<Builder>;
  incrementBuilderViews(builderId: string): Promise<void>;
  updateBuilderResponseRate(builderId: string, wasResponded: boolean): Promise<void>;
  calculateAndUpdateTrending(): Promise<void>;
  createBuilder(builder: InsertBuilder): Promise<Builder>;
  
  getBuilderProjects(builderId: string): Promise<BuilderProject[]>;
  getBuilderProject(id: string): Promise<BuilderProject | undefined>;
  createBuilderProject(project: InsertBuilderProject): Promise<BuilderProject>;
  getAllPortfolioItems(searchQuery?: string): Promise<Array<{
    id: string;
    builderId: string;
    builderName: string;
    builderCategory: string;
    builderVerified: boolean;
    builderRating: number;
    mediaUrl: string;
    title?: string;
    description?: string;
    category?: string;
    tags?: string[];
    type: 'project' | 'media';
  }>>;

  getService(id: string): Promise<Service | undefined>;
  getBuilderServices(builderId: string): Promise<Service[]>;
  getServices(): Promise<Service[]>;
  getServicesByBuilder(builderId: string): Promise<Service[]>;
  getFeaturedServices(): Promise<Service[]>;
  getFeaturedServicesWithBuilders(): Promise<Array<{ service: Service; builder: Builder | null }>>;
  getServicesByCategory(categorySlug: string): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;

  getCategory(slug: string): Promise<Category | undefined>;
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;

  getReviews(): Promise<Review[]>;
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
  
  getBuilderTags(builderId: string): Promise<BuilderTag[]>;
  addBuilderTag(tag: InsertBuilderTag): Promise<BuilderTag>;
  deleteBuilderTag(tagId: string): Promise<void>;
  
  getBuilderAdminNotes(builderId: string): Promise<BuilderAdminNote[]>;
  addBuilderAdminNote(note: InsertBuilderAdminNote): Promise<BuilderAdminNote>;
  deleteBuilderAdminNote(noteId: string): Promise<void>;
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
  getUnreadMessageCount(userId: string, userType: string): Promise<number>;

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
  getUsersForDigest(frequency: string): Promise<Array<{ userId: string; userType: string }>>;
  getNotificationsSince(userId: string, userType: string, sinceDate: string): Promise<Notification[]>;
  updateDigestSentTime(userId: string, userType: string): Promise<void>;
  
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
  
  // Real-Time Features
  getUserOnlineStatus(userId: string): Promise<UserOnlineStatus | undefined>;
  updateUserOnlineStatus(userId: string, userType: string, status: string, currentActivity?: string): Promise<UserOnlineStatus>;
  getOnlineUsers(userType?: string): Promise<UserOnlineStatus[]>;
  cleanupStaleOnlineStatuses(inactiveMinutes?: number): Promise<void>;
  
  getTypingIndicator(threadId: string, userId: string): Promise<TypingIndicator | undefined>;
  setTypingIndicator(threadId: string, userId: string, userType: string, isTyping: boolean): Promise<TypingIndicator>;
  getThreadTypingIndicators(threadId: string): Promise<TypingIndicator[]>;
  cleanupStaleTypingIndicators(inactiveSeconds?: number): Promise<void>;
  
  // Advanced Search & Filtering
  getSavedSearches(userId: string, userType: string): Promise<SavedSearch[]>;
  getSavedSearch(id: string): Promise<SavedSearch | undefined>;
  createSavedSearch(search: InsertSavedSearch): Promise<SavedSearch>;
  updateSavedSearch(id: string, data: Partial<SavedSearch>): Promise<SavedSearch>;
  deleteSavedSearch(id: string): Promise<void>;
  incrementSearchUsage(id: string): Promise<SavedSearch>;
  
  getBuilderFavorites(userId: string, collectionName?: string): Promise<BuilderFavorite[]>;
  addBuilderFavorite(favorite: InsertBuilderFavorite): Promise<BuilderFavorite>;
  removeBuilderFavorite(userId: string, builderId: string): Promise<void>;
  isBuilderFavorited(userId: string, builderId: string): Promise<boolean>;
  getFavoriteCollections(userId: string): Promise<string[]>;
  
  getSearchHistory(userId: string, userType: string, limit?: number): Promise<SearchHistory[]>;
  addSearchHistory(history: InsertSearchHistory): Promise<SearchHistory>;
  clearSearchHistory(userId: string): Promise<void>;
  deleteSearchHistoryItem(id: string): Promise<void>;
  getPopularSearches(userType: string, limit?: number): Promise<{ query: string; count: number }[]>;
  
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences>;
  updateUserPreferences(userId: string, data: Partial<UserPreferences>): Promise<UserPreferences>;
  
  getFilterPresets(userId?: string, includeGlobal?: boolean): Promise<FilterPreset[]>;
  getFilterPreset(id: string): Promise<FilterPreset | undefined>;
  createFilterPreset(preset: InsertFilterPreset): Promise<FilterPreset>;
  updateFilterPreset(id: string, data: Partial<FilterPreset>): Promise<FilterPreset>;
  deleteFilterPreset(id: string): Promise<void>;
  
  // Social Proof & Activity Tracking
  getPlatformActivity(limit?: number): Promise<PlatformActivity[]>;
  createPlatformActivity(activity: InsertPlatformActivity): Promise<PlatformActivity>;
  getPlatformStats(): Promise<{
    totalPaidOut: string;
    totalBuilders: number;
    totalProjects: number;
    avgRating: string;
    onTimeDelivery: string;
  }>;
  trackServiceView(view: InsertServiceView): Promise<ServiceView>;
  getServiceSocialProof(serviceId: string): Promise<{
    viewsLast24Hours: number;
    bookingsLastWeek: number;
    lastBookedAt: string | null;
    totalBookings: number;
  }>;
  getRecentHighlightReviews(limit?: number): Promise<Array<{
    review: Review;
    builder: Builder | null;
    service: Service | null;
  }>>;

  // Builder Analytics
  getBuilderAnalytics(builderId: string): Promise<any>;
  getServiceAnalytics(serviceId: string): Promise<any>;

  // Message Templates
  getBuilderMessageTemplates(builderId: string, category?: string): Promise<any[]>;
  getMessageTemplate(id: string): Promise<any | undefined>;
  createMessageTemplate(template: any): Promise<any>;
  updateMessageTemplate(id: string, data: Partial<any>): Promise<any | undefined>;
  deleteMessageTemplate(id: string): Promise<void>;
  incrementTemplateUseCount(id: string): Promise<void>;

  // Referral System
  getBuilderReferralCode(builderId: string): Promise<any | undefined>;
  createReferralCode(data: { builderId: string; code: string; isActive: boolean }): Promise<any>;
  incrementReferralClicks(code: string): Promise<void>;
  incrementReferralSignups(code: string): Promise<void>;
  incrementReferralConversions(code: string): Promise<void>;
  getBuilderReferrals(walletAddress: string): Promise<any[]>;
  getReferralByWallets(referrerWallet: string, referredWallet: string): Promise<any | undefined>;
  getReferral(id: string): Promise<any | undefined>;
  createReferral(data: any): Promise<any>;
  updateReferral(id: string, data: Partial<any>): Promise<any | undefined>;

  // Badge System
  getBuilderBadges(builderId: string): Promise<any[]>;
  createBuilderBadge(badge: any): Promise<any>;

  // Dispute Resolution
  getAllDisputes(): Promise<any[]>;
  getDispute(id: string): Promise<any | undefined>;
  getOrderDisputes(orderId: string): Promise<any[]>;
  createDispute(dispute: any): Promise<any>;
  addDisputeEvidence(disputeId: string, evidenceUrls: string[]): Promise<any>;
  getDisputeMessages(disputeId: string): Promise<any[]>;
  createDisputeMessage(message: any): Promise<any>;
  updateDispute(id: string, data: Partial<any>): Promise<any>;
  getBuilderDisputes(builderId: string): Promise<any[]>;
  getClientDisputes(clientId: string): Promise<any[]>;
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
        name: "3D & 2D Content Creation",
        slug: "3d-content",
        description: "Professional 3D & 2D artists creating stunning visuals, animations, and videos",
        icon: "box",
      },
      {
        name: "Video Editing",
        slug: "video-editor",
        description: "Expert video editors creating viral content, token promos, and high-impact edits for Web3",
        icon: "film",
      },
      {
        name: "Mods & Raiders",
        slug: "mods-raiders",
        description: "Discord/Telegram mods and raid coordinators running communities and driving engagement",
        icon: "shield",
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
        description: "Smart contract, website, bot development, and technical solutions",
        icon: "code",
      },
      {
        name: "Volume Services",
        slug: "volume",
        description: "Liquidity, volume generation, and trading services for any chain",
        icon: "bar-chart-3",
      },
      {
        name: "Graphic Design",
        slug: "graphic-design",
        description: "Creative graphic design for branding, marketing, and visual identity",
        icon: "palette",
      },
      {
        name: "Social Media Management",
        slug: "social-media",
        description: "Professional social media management, content creation, and community engagement",
        icon: "network",
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
        description: "I'm a seasoned Web3 developer with 5+ years of experience building decentralized applications, smart contracts, and DeFi protocols. I've launched 50+ successful projects and have deep expertise in Solidity, React, and blockchain architecture. I specialize in creating secure, scalable, and user-friendly Web3 solutions that drive real value for crypto projects.",
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
        // Enhanced Fiverr-like fields
        languages: ["English", "Spanish", "Mandarin"],
        timezone: "America/New_York",
        country: "United States",
        city: "New York",
        education: ["BS Computer Science - MIT", "Blockchain Developer Certification - ConsenSys"],
        workExperience: "Senior Blockchain Engineer at major DeFi protocol (3 years), Freelance Web3 Developer (2 years)",
        yearsOfExperience: 5,
        availability: "available",
        hoursPerWeek: 40,
        faqs: [
          "Q: Do you provide post-launch support? A: Yes, I offer 30 days of free support after project delivery.",
          "Q: What chains do you work with? A: I specialize in Ethereum, Base, Polygon, and Arbitrum.",
          "Q: How do you handle payments? A: I use milestone-based escrow payments through the platform for security."
        ],
        linkedinProfile: "https://linkedin.com/in/testbuilder",
        websiteUrl: "https://testbuilder.dev",
        specializations: ["DeFi Protocols", "NFT Marketplaces", "Token Launches", "Smart Contract Auditing"],
        badges: ["Top Rated", "Fast Delivery", "Verified Developer"],
      },
      {
        walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f9a3f1",
        name: "Alex Chen",
        headline: "Top Crypto KOL | 500K+ Followers",
        bio: "Experienced crypto influencer with a proven track record of launching successful memecoin campaigns.",
        description: "As one of the top crypto KOLs with 500K+ engaged followers, I've helped launch 100+ successful token projects with an average 10x ROI. My network includes partnerships with major exchanges, media outlets, and influencers across all major platforms. I specialize in viral marketing campaigns, community building, and strategic partnerships that drive real results for crypto projects.",
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
        instagramHandle: "alexcryptoking",
        instagramFollowers: 85000,
        youtubeChannel: "AlexCryptoTV",
        youtubeSubscribers: 120000,
        telegramHandle: "alexcrypto",
        telegramMembers: 25000,
        engagementRate: "8.5",
        contentNiches: ["Memecoins", "DeFi", "NFTs", "Crypto Trading"],
        brandPartnerships: ["Binance", "OKX", "Bybit", "Major memecoin projects"],
        // Enhanced Fiverr-like fields
        languages: ["English", "Mandarin", "Cantonese"],
        timezone: "Asia/Hong_Kong",
        country: "Hong Kong",
        city: "Hong Kong",
        education: ["MBA Marketing - Hong Kong University", "Crypto Marketing Masterclass"],
        workExperience: "Crypto Marketing Director at top exchange (2 years), Professional KOL (4 years)",
        yearsOfExperience: 6,
        availability: "available",
        hoursPerWeek: 50,
        faqs: [
          "Q: What's your average engagement rate? A: My engagement rate is 8.5%, significantly higher than industry average of 3-4%.",
          "Q: Do you work with new projects? A: Yes, I specialize in launching new tokens and memecoins with proven success.",
          "Q: What platforms do you cover? A: Twitter, Instagram, YouTube, Telegram, and TikTok with combined 700K+ followers."
        ],
        linkedinProfile: "https://linkedin.com/in/alexchen",
        websiteUrl: "https://alexcryptoking.com",
        specializations: ["Memecoin Launches", "Viral Campaigns", "KOL Partnerships", "Exchange Listings"],
        badges: ["Top Rated Plus", "Verified KOL", "Rising Talent"],
      },
    ];

    for (const builder of buildersData) {
      await db.insert(builders).values(builder as any);
    }

    // Get the created builder IDs to assign to services
    const createdBuilders = await db.select().from(builders);
    const builder1 = createdBuilders[0];
    const builder2 = createdBuilders[1];

    // Comprehensive Service Seed Data - All Categories
    const servicesData: Array<Partial<Service>> = [
      // VOLUME SERVICES - Any Chain
      {
        builderId: builder1?.id,
        title: "Custom Volume Generation (Any Chain)",
        description: "Professional volume generation service supporting any blockchain network. Create natural trading patterns, maintain healthy price action, and build liquidity for your token launch or ongoing project.",
        category: "volume",
        deliveryTime: "3-7 days",
        basicPrice: "2500.00",
        standardPrice: "5000.00",
        premiumPrice: "10000.00",
        basicDescription: "Basic volume package - $50K daily volume for 7 days",
        standardDescription: "Standard volume package - $150K daily volume for 14 days with custom patterns",
        premiumDescription: "Premium volume package - $300K+ daily volume for 30 days with advanced market making",
        basicDeliverables: ["$50K daily volume", "7 days duration", "Basic trading patterns", "Daily reports"],
        standardDeliverables: ["$150K daily volume", "14 days duration", "Custom trading patterns", "Real-time dashboard", "Liquidity management"],
        premiumDeliverables: ["$300K+ daily volume", "30 days duration", "Advanced market making", "24/7 monitoring", "Multi-DEX support", "Custom strategies"],
        tags: ["volume", "liquidity", "trading", "market-making", "multi-chain"],
        tokenTickers: [],
        portfolioMedia: [
          "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
          "https://images.unsplash.com/photo-1642790551116-18e150f248e3?w=800",
          "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
          "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800"
        ],
        psxRequired: "100.00",
        featured: true,
        active: true,
      },
      {
        builderId: builder1?.id,
        title: "Custom Makers & Transactions - Trend Bot (Any Chain)",
        description: "Advanced trend bot service creating organic wallet activity and transaction patterns. Perfect for building credibility, creating FOMO, and attracting organic traders across any blockchain.",
        category: "volume",
        deliveryTime: "2-5 days",
        basicPrice: "1500.00",
        standardPrice: "3500.00",
        premiumPrice: "7500.00",
        basicDescription: "Basic trend bot - 100 unique wallets, 500 transactions",
        standardDescription: "Standard trend bot - 300 unique wallets, 2000 transactions, custom patterns",
        premiumDescription: "Premium trend bot - 1000+ unique wallets, 10K+ transactions, AI-driven patterns",
        basicDeliverables: ["100 unique wallets", "500 organic transactions", "5 days activity", "Basic patterns"],
        standardDeliverables: ["300 unique wallets", "2000 transactions", "10 days activity", "Custom patterns", "Geographic distribution"],
        premiumDeliverables: ["1000+ unique wallets", "10K+ transactions", "30 days activity", "AI-driven patterns", "Multi-chain support", "Viral mechanics"],
        tags: ["trend-bot", "makers", "transactions", "wallet-activity", "multi-chain"],
        psxRequired: "75.00",
        featured: true,
        active: true,
      },
      
      // 3D & 2D CONTENT CREATION
      {
        builderId: builder2?.id,
        title: "3D & 2D Character Design",
        description: "Custom character design for your Web3 project, NFT collection, or memecoin mascot. Professional 3D modeling and 2D illustration with multiple revisions and full commercial rights.",
        category: "3d-content",
        deliveryTime: "5-10 days",
        basicPrice: "800.00",
        standardPrice: "1500.00",
        premiumPrice: "3000.00",
        basicDescription: "Basic character - 2D concept art, single pose, 2 revisions",
        standardDescription: "Standard character - 2D + 3D low-poly model, 3 poses, turnaround, 4 revisions",
        premiumDescription: "Premium character - Fully rigged 3D model, multiple poses, PBR textures, unlimited revisions",
        basicDeliverables: ["2D concept art", "Single pose", "2 revisions", "PNG/JPG delivery", "Commercial rights"],
        standardDeliverables: ["2D + 3D model", "3 poses", "360° turnaround", "4 revisions", "Source files", "Commercial rights"],
        premiumDeliverables: ["Rigged 3D model", "Multiple poses", "PBR textures", "Unlimited revisions", "Blender/Maya files", "Full IP rights"],
        tags: ["3d", "2d", "character-design", "nft", "mascot", "modeling"],
        portfolioMedia: [
          "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
          "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800",
          "https://images.unsplash.com/photo-1618172193622-ae2d025f4032?w=800",
          "https://images.unsplash.com/photo-1551447438-45c3a0af2050?w=800"
        ],
        psxRequired: "50.00",
        featured: true,
        active: true,
      },
      {
        builderId: builder2?.id,
        title: "3D & 2D Animations",
        description: "Professional animation services for token launches, explainer videos, NFT reveals, and social media content. Fluid motion, stunning visuals, and eye-catching effects.",
        category: "3d-content",
        deliveryTime: "7-14 days",
        basicPrice: "1200.00",
        standardPrice: "2500.00",
        premiumPrice: "5000.00",
        portfolioMedia: [
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          "https://images.unsplash.com/photo-1551847812-d8a7e1f5f95e?w=800",
          "https://images.unsplash.com/photo-1618192772237-dd5f33ba54ff?w=800",
          "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800"
        ],
        basicDescription: "Basic animation - 10 second 2D/3D loop, simple motion",
        standardDescription: "Standard animation - 30 second animated sequence, advanced effects, sound design",
        premiumDescription: "Premium animation - 60+ second cinematic animation, particle effects, full production",
        basicDeliverables: ["10 second animation", "Simple motion", "1080p export", "2 revisions", "MP4 delivery"],
        standardDeliverables: ["30 second animation", "Advanced effects", "4K export", "4 revisions", "Sound design", "Source files"],
        premiumDeliverables: ["60+ second animation", "Cinematic quality", "Particle effects", "Unlimited revisions", "Multi-format export", "Full production"],
        tags: ["animation", "3d", "2d", "motion-graphics", "video", "effects"],
        psxRequired: "60.00",
        featured: true,
        active: true,
      },
      {
        builderId: builder2?.id,
        title: "Token Launch Video (3D & 2D)",
        description: "High-impact launch video for your token or NFT collection. Professional cinematics, particle effects, logo reveals, and social-ready formats to maximize launch hype.",
        category: "3d-content",
        deliveryTime: "7-12 days",
        basicPrice: "1500.00",
        standardPrice: "3000.00",
        premiumPrice: "6000.00",
        portfolioMedia: [
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800",
          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800"
        ],
        basicDescription: "Basic launch video - 15 second teaser with logo reveal",
        standardDescription: "Standard launch video - 30 second full trailer with 3D elements and music",
        premiumDescription: "Premium launch video - 60 second cinematic trailer, full production, multiple cuts",
        basicDeliverables: ["15 second video", "Logo reveal", "2D/3D mix", "1080p export", "2 revisions"],
        standardDeliverables: ["30 second video", "Full 3D cinematics", "Particle effects", "Licensed music", "4K export", "4 revisions"],
        premiumDeliverables: ["60 second video", "Cinematic production", "Advanced VFX", "Custom soundtrack", "Multiple cuts", "Unlimited revisions", "Social media formats"],
        tags: ["launch-video", "3d", "token", "trailer", "cinematics", "marketing"],
        psxRequired: "75.00",
        featured: true,
        active: true,
      },
      
      // SOCIAL MEDIA MANAGEMENT
      {
        builderId: builder2?.id,
        title: "Twitter & Social Media Management",
        description: "Complete social media management for Web3 projects. Content creation, community engagement, growth strategies, and 24/7 monitoring across Twitter, Discord, Telegram, and more.",
        category: "social-media",
        deliveryTime: "Ongoing",
        basicPrice: "800.00",
        standardPrice: "1500.00",
        premiumPrice: "3000.00",
        basicDescription: "Basic package - Twitter only, 3 posts/day, basic engagement (per month)",
        standardDescription: "Standard package - Twitter + 1 platform, 5 posts/day, community management (per month)",
        premiumDescription: "Premium package - All platforms, 10+ posts/day, full growth strategy, 24/7 (per month)",
        basicDeliverables: ["Twitter management", "3 posts/day", "Basic engagement", "Weekly reports", "30 days"],
        standardDeliverables: ["Twitter + Discord/TG", "5 posts/day", "Community management", "Growth tactics", "Daily reports", "30 days"],
        premiumDeliverables: ["All platforms", "10+ posts/day", "24/7 monitoring", "Full growth strategy", "Influencer outreach", "Real-time analytics", "30 days"],
        tags: ["social-media", "twitter", "discord", "telegram", "community", "content"],
        psxRequired: "40.00",
        featured: false,
        active: true,
      },
      
      // KOL SERVICES
      {
        builderId: builder2?.id,
        title: "KOL Management (Any Chain)",
        description: "End-to-end KOL campaign management for your token launch or project. We source, negotiate, coordinate, and track influencer partnerships across all major chains and platforms.",
        category: "kols",
        deliveryTime: "5-10 days",
        basicPrice: "2000.00",
        standardPrice: "4000.00",
        premiumPrice: "8000.00",
        portfolioMedia: [
          "partner:Binance",
          "partner:Coinbase",
          "partner:OKX",
          "partner:Bybit",
          "partner:KuCoin",
          "partner:Crypto.com",
          "partner:Bitget",
          "partner:Gate.io"
        ],
        basicDescription: "Basic KOL package - 5 micro-influencers, basic coordination",
        standardDescription: "Standard KOL package - 10 mid-tier KOLs, full coordination, tracking",
        premiumDescription: "Premium KOL package - 20+ top-tier KOLs, campaign management, ROI tracking",
        basicDeliverables: ["5 micro-influencers", "100K+ total reach", "Basic coordination", "Campaign report"],
        standardDeliverables: ["10 mid-tier KOLs", "500K+ total reach", "Full coordination", "Performance tracking", "Negotiation included"],
        premiumDeliverables: ["20+ top-tier KOLs", "2M+ total reach", "Campaign management", "ROI tracking", "Ongoing optimization", "Multi-platform"],
        tags: ["kol", "influencer", "marketing", "campaign", "multi-chain"],
        psxRequired: "100.00",
        featured: true,
        active: true,
      },
      {
        builderId: builder2?.id,
        title: "KOL Sourcing & Connecting (Any Chain)",
        description: "Connect with the right influencers for your project. We provide verified KOL contacts, negotiate rates, and facilitate introductions across all blockchain networks.",
        category: "kols",
        deliveryTime: "3-7 days",
        basicPrice: "500.00",
        standardPrice: "1200.00",
        premiumPrice: "2500.00",
        basicDescription: "Basic sourcing - 10 verified KOL contacts with reach data",
        standardDescription: "Standard sourcing - 25 KOL contacts, warm introductions, rate negotiation",
        premiumDescription: "Premium sourcing - 50+ KOL contacts, direct introductions, partnership facilitation",
        basicDeliverables: ["10 verified KOLs", "Contact details", "Reach metrics", "Niche matching"],
        standardDeliverables: ["25 verified KOLs", "Warm introductions", "Rate negotiation", "Multi-platform coverage"],
        premiumDeliverables: ["50+ verified KOLs", "Direct introductions", "Partnership facilitation", "Ongoing support", "Multi-chain network"],
        tags: ["kol-sourcing", "influencer-network", "connections", "partnerships", "multi-chain"],
        psxRequired: "30.00",
        featured: false,
        active: true,
      },
      
      // WEBSITE DEVELOPMENT
      {
        builderId: builder1?.id,
        title: "Website Landing Page",
        description: "Professional landing page for your token, NFT project, or Web3 platform. Modern design, mobile-responsive, wallet connection, and optimized for conversions.",
        category: "development",
        deliveryTime: "3-7 days",
        basicPrice: "800.00",
        standardPrice: "1500.00",
        premiumPrice: "3000.00",
        basicDescription: "Basic landing page - Single page, responsive design, 3 sections",
        standardDescription: "Standard landing page - Multi-section, wallet connect, animations, SEO",
        premiumDescription: "Premium landing page - Custom design, advanced features, Web3 integration, CMS",
        basicDeliverables: ["Single page", "Responsive design", "3 sections", "Contact form", "2 revisions"],
        standardDeliverables: ["Multi-section page", "Wallet connection", "Smooth animations", "SEO optimized", "4 revisions", "Basic analytics"],
        premiumDeliverables: ["Custom design", "Full Web3 integration", "CMS backend", "Advanced animations", "Analytics dashboard", "Unlimited revisions"],
        tags: ["landing-page", "website", "web3", "responsive", "design"],
        psxRequired: "40.00",
        featured: false,
        active: true,
      },
      {
        builderId: builder1?.id,
        title: "Full-Blown Website",
        description: "Complete website development for Web3 projects. Multi-page architecture, blockchain integration, admin dashboard, database, and scalable infrastructure.",
        category: "development",
        deliveryTime: "14-30 days",
        basicPrice: "3000.00",
        standardPrice: "6000.00",
        premiumPrice: "12000.00",
        basicDescription: "Basic website - 5 pages, responsive, basic features",
        standardDescription: "Standard website - 10+ pages, Web3 integration, database, admin panel",
        premiumDescription: "Premium website - Custom platform, full Web3 stack, advanced features, scalability",
        basicDeliverables: ["5 pages", "Responsive design", "Contact forms", "Basic SEO", "1 month support"],
        standardDeliverables: ["10+ pages", "Web3 wallet integration", "Database setup", "Admin dashboard", "SEO optimization", "3 months support"],
        premiumDeliverables: ["Custom full-stack platform", "Smart contract integration", "Advanced database", "User authentication", "Real-time features", "6 months support", "Scalable infrastructure"],
        tags: ["full-website", "web3", "full-stack", "dapp", "platform"],
        psxRequired: "150.00",
        featured: true,
        active: true,
      },
      
      // BOT DEVELOPMENT
      {
        builderId: builder1?.id,
        title: "Farcaster Apps & Telegram Bots",
        description: "Custom Farcaster frames, Telegram bots, and social platform integrations for your Web3 project. Automate community management, create interactive experiences, and boost engagement.",
        category: "development",
        deliveryTime: "7-14 days",
        basicPrice: "1200.00",
        standardPrice: "2500.00",
        premiumPrice: "5000.00",
        basicDescription: "Basic bot - Simple Telegram bot or Farcaster frame with core features",
        standardDescription: "Standard bot - Advanced bot with custom commands, database, analytics",
        premiumDescription: "Premium bot - Full-featured platform with AI, Web3 integration, multi-platform",
        basicDeliverables: ["Simple bot/frame", "5 core features", "Basic commands", "Documentation", "1 month support"],
        standardDeliverables: ["Advanced bot", "15+ features", "Database integration", "Analytics dashboard", "Custom commands", "3 months support"],
        premiumDeliverables: ["Full platform", "Unlimited features", "AI integration", "Web3 capabilities", "Multi-platform", "Real-time sync", "6 months support"],
        tags: ["telegram-bot", "farcaster", "bot-development", "automation", "web3"],
        psxRequired: "60.00",
        featured: false,
        active: true,
      },
      
      // GRAPHIC DESIGN
      {
        builderId: builder2?.id,
        title: "Graphic Design - Branding & Marketing",
        description: "Professional graphic design services for Web3 projects. Logos, banners, social media graphics, NFT art, and complete brand identity packages.",
        category: "graphic-design",
        deliveryTime: "3-7 days",
        basicPrice: "400.00",
        standardPrice: "800.00",
        premiumPrice: "1500.00",
        basicDescription: "Basic package - 5 graphics (social media posts, banners)",
        standardDescription: "Standard package - 15 graphics + logo design, brand guidelines",
        premiumDescription: "Premium package - Complete brand identity, 30+ graphics, unlimited revisions",
        basicDeliverables: ["5 custom graphics", "Social media ready", "Source files", "2 revisions"],
        standardDeliverables: ["15 custom graphics", "Logo design", "Brand guidelines", "Social media templates", "4 revisions"],
        premiumDeliverables: ["Complete brand identity", "30+ graphics", "Logo variations", "Style guide", "Marketing materials", "Unlimited revisions"],
        tags: ["graphic-design", "branding", "logo", "social-graphics", "nft-art"],
        psxRequired: "25.00",
        featured: false,
        active: true,
      },
    ];

    for (const service of servicesData) {
      await db.insert(services).values(service as any);
    }

    // Create global filter presets
    const filterPresetsData: Array<Partial<FilterPreset>> = [
      {
        name: "Urgent - Available Now",
        description: "Builders accepting orders with fast delivery (< 5 days)",
        filters: JSON.stringify({
          acceptingOrders: true,
          deliveryTime: ["1-3 days", "3-7 days"],
          sortBy: "responseTime"
        }),
        isGlobal: true,
        icon: "zap",
      },
      {
        name: "Premium - Top Rated",
        description: "Verified builders with 4.5+ rating and 50+ completed projects",
        filters: JSON.stringify({
          verified: true,
          minRating: 4.5,
          minCompletedProjects: 50,
          sortBy: "rating"
        }),
        isGlobal: true,
        icon: "star",
      },
      {
        name: "Budget-Friendly",
        description: "Quality services under $1000",
        filters: JSON.stringify({
          maxPrice: 1000,
          sortBy: "price"
        }),
        isGlobal: true,
        icon: "dollar-sign",
      },
    ];

    for (const preset of filterPresetsData) {
      await db.insert(filterPresets).values(preset as any);
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

  async getLiveBuilders(category?: string): Promise<Builder[]> {
    const conditions = [eq(builders.isLive, true), eq(builders.isActive, true)];
    if (category) {
      conditions.push(eq(builders.category, category));
    }
    return await db.select().from(builders).where(and(...conditions)).orderBy(desc(builders.rating)).limit(20);
  }

  async updateBuilderLiveStatus(builderId: string, isLive: boolean): Promise<Builder> {
    const result = await db.update(builders)
      .set({ 
        isLive,
        lastActiveAt: new Date().toISOString()
      })
      .where(eq(builders.id, builderId))
      .returning();
    return result[0];
  }

  async incrementBuilderViews(builderId: string): Promise<void> {
    await db.update(builders)
      .set({ 
        profileViews: sqlFunc`${builders.profileViews} + 1`,
        recentViews: sqlFunc`${builders.recentViews} + 1`
      })
      .where(eq(builders.id, builderId));
  }

  async updateBuilderResponseRate(builderId: string, wasResponded: boolean): Promise<void> {
    const builder = await this.getBuilder(builderId);
    if (!builder) return;

    const newMessagesReceived = (builder.totalMessagesReceived || 0) + 1;
    const newMessagesResponded = (builder.totalMessagesResponded || 0) + (wasResponded ? 1 : 0);
    const newResponseRate = (newMessagesResponded / newMessagesReceived) * 100;

    await db.update(builders)
      .set({
        totalMessagesReceived: newMessagesReceived,
        totalMessagesResponded: newMessagesResponded,
        responseRate: newResponseRate.toFixed(2)
      })
      .where(eq(builders.id, builderId));
  }

  async calculateAndUpdateTrending(): Promise<void> {
    const allBuilders = await this.getBuilders();
    const now = Date.now();
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);

    for (const builder of allBuilders) {
      const recentOrders = await db.select()
        .from(orders)
        .where(
          and(
            eq(orders.builderId, builder.id),
            sqlFunc`${orders.createdAt} > ${new Date(oneWeekAgo).toISOString()}`
          )
        );

      const recentViews = builder.recentViews || 0;
      const trendingScore = (recentOrders.length * 10) + recentViews;
      const isTrending = trendingScore > 50;

      await db.update(builders)
        .set({ isTrending })
        .where(eq(builders.id, builder.id));
    }

    await db.update(builders)
      .set({ recentViews: 0 });
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

  async getAllPortfolioItems(searchQuery?: string): Promise<Array<{
    id: string;
    builderId: string;
    builderName: string;
    builderCategory: string;
    builderVerified: boolean;
    builderRating: number;
    mediaUrl: string;
    title?: string;
    description?: string;
    category?: string;
    tags?: string[];
    type: 'project' | 'media';
  }>> {
    const allBuilders = await this.getBuilders();
    const portfolioItems: Array<{
      id: string;
      builderId: string;
      builderName: string;
      builderCategory: string;
      builderVerified: boolean;
      builderRating: number;
      mediaUrl: string;
      title?: string;
      description?: string;
      category?: string;
      tags?: string[];
      type: 'project' | 'media';
    }> = [];

    for (const builder of allBuilders) {
      if (builder.portfolioMedia && builder.portfolioMedia.length > 0) {
        for (const mediaUrl of builder.portfolioMedia) {
          portfolioItems.push({
            id: `media-${builder.id}-${portfolioItems.length}`,
            builderId: builder.id,
            builderName: builder.name,
            builderCategory: builder.category,
            builderVerified: builder.verified,
            builderRating: typeof builder.rating === 'number' ? builder.rating : parseFloat(builder.rating || '0'),
            mediaUrl,
            type: 'media'
          });
        }
      }

      const projects = await this.getBuilderProjects(builder.id);
      for (const project of projects) {
        if (project.mediaUrls && project.mediaUrls.length > 0) {
          for (const mediaUrl of project.mediaUrls) {
            portfolioItems.push({
              id: project.id,
              builderId: builder.id,
              builderName: builder.name,
              builderCategory: builder.category,
              builderVerified: builder.verified,
              builderRating: typeof builder.rating === 'number' ? builder.rating : parseFloat(builder.rating || '0'),
              mediaUrl,
              title: project.title,
              description: project.description,
              category: project.category,
              type: 'project'
            });
          }
        }
      }
    }

    if (searchQuery && searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return portfolioItems.filter(item => {
        const titleMatch = item.title?.toLowerCase().includes(query);
        const descMatch = item.description?.toLowerCase().includes(query);
        const categoryMatch = item.category?.toLowerCase().includes(query);
        const builderMatch = item.builderName.toLowerCase().includes(query);
        const builderCategoryMatch = item.builderCategory.toLowerCase().includes(query);
        return titleMatch || descMatch || categoryMatch || builderMatch || builderCategoryMatch;
      });
    }

    return portfolioItems;
  }

  async getService(id: string): Promise<Service | undefined> {
    const result = await db.select().from(services).where(eq(services.id, id));
    return result[0];
  }

  async getBuilderServices(builderId: string): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.builderId, builderId));
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

  async getFeaturedServicesWithBuilders(): Promise<Array<{ service: Service; builder: Builder | null }>> {
    const result = await db
      .select()
      .from(services)
      .leftJoin(builders, eq(services.builderId, builders.id))
      .where(eq(services.featured, true))
      .limit(6);
    
    return result.map(row => ({
      service: row.services,
      builder: row.builders
    }));
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

  async getReviews(): Promise<Review[]> {
    return await db.select().from(reviews).orderBy(desc(reviews.createdAt));
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

  async getBuilderTags(builderId: string): Promise<BuilderTag[]> {
    return await db.select().from(builderTags).where(eq(builderTags.builderId, builderId));
  }

  async addBuilderTag(tag: InsertBuilderTag): Promise<BuilderTag> {
    const result = await db.insert(builderTags).values(tag).returning();
    return result[0];
  }

  async deleteBuilderTag(tagId: string): Promise<void> {
    await db.delete(builderTags).where(eq(builderTags.id, tagId));
  }

  async getBuilderAdminNotes(builderId: string): Promise<BuilderAdminNote[]> {
    return await db.select().from(builderAdminNotes)
      .where(eq(builderAdminNotes.builderId, builderId))
      .orderBy(desc(builderAdminNotes.createdAt));
  }

  async addBuilderAdminNote(note: InsertBuilderAdminNote): Promise<BuilderAdminNote> {
    const result = await db.insert(builderAdminNotes).values(note).returning();
    return result[0];
  }

  async deleteBuilderAdminNote(noteId: string): Promise<void> {
    await db.delete(builderAdminNotes).where(eq(builderAdminNotes.id, noteId));
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

    // Get builder name for thread title
    const builder = await this.getBuilder(builderId);
    const builderName = builder?.name || "Builder";

    const result = await db.insert(chatThreads).values({
      clientId,
      builderId,
      orderId,
      title: `Chat with ${builderName}`,
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

  async getUnreadMessageCount(userId: string, userType: string): Promise<number> {
    let threads;
    if (userType === "client") {
      threads = await this.getChatThreadsByClient(userId);
    } else {
      threads = await this.getChatThreadsByBuilder(userId);
    }

    const totalUnread = threads.reduce((sum, thread) => {
      const unreadCount = userType === "client" 
        ? thread.clientUnreadCount 
        : thread.builderUnreadCount;
      return sum + unreadCount;
    }, 0);

    return totalUnread;
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

  async getUsersForDigest(frequency: string): Promise<Array<{ userId: string; userType: string }>> {
    const now = new Date();
    const cutoffDate = new Date();
    
    if (frequency === "daily") {
      cutoffDate.setDate(cutoffDate.getDate() - 1);
    } else {
      cutoffDate.setDate(cutoffDate.getDate() - 7);
    }

    const results = await db.select({
      userId: notificationPreferences.userId,
      userType: notificationPreferences.userType,
    })
    .from(notificationPreferences)
    .where(
      and(
        eq(notificationPreferences.emailDigestFrequency, frequency),
        or(
          eq(notificationPreferences.lastDigestSentAt, null),
          sqlFunc`${notificationPreferences.lastDigestSentAt} < ${cutoffDate.toISOString()}`
        )
      )
    );

    return results;
  }

  async getNotificationsSince(userId: string, userType: string, sinceDate: string): Promise<Notification[]> {
    const results = await db.select()
      .from(notifications)
      .where(
        and(
          eq(notifications.recipientId, userId),
          eq(notifications.recipientType, userType),
          sqlFunc`${notifications.createdAt} >= ${sinceDate}`
        )
      )
      .orderBy(desc(notifications.createdAt))
      .limit(50);

    return results;
  }

  async updateDigestSentTime(userId: string, userType: string): Promise<void> {
    await db.update(notificationPreferences)
      .set({ lastDigestSentAt: new Date().toISOString() })
      .where(
        and(
          eq(notificationPreferences.userId, userId),
          eq(notificationPreferences.userType, userType)
        )
      );
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
      return await db.select().from(partners)
        .where(and(...conditions))
        .orderBy(desc(partners.featured), desc(partners.successfulConnections));
    }
    
    return await db.select().from(partners)
      .orderBy(desc(partners.featured), desc(partners.successfulConnections));
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
      return await db.select().from(partnerConnectionRequests)
        .where(and(...conditions))
        .orderBy(desc(partnerConnectionRequests.createdAt));
    }
    
    return await db.select().from(partnerConnectionRequests)
      .orderBy(desc(partnerConnectionRequests.createdAt));
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

  // Real-Time Features Implementation

  async getUserOnlineStatus(userId: string): Promise<UserOnlineStatus | undefined> {
    const result = await db.select().from(userOnlineStatus).where(eq(userOnlineStatus.userId, userId));
    return result[0];
  }

  async updateUserOnlineStatus(userId: string, userType: string, status: string, currentActivity?: string): Promise<UserOnlineStatus> {
    const existing = await this.getUserOnlineStatus(userId);
    const now = new Date().toISOString();
    
    if (existing) {
      const result = await db.update(userOnlineStatus)
        .set({
          status,
          currentActivity,
          lastSeen: now,
          updatedAt: now,
        })
        .where(eq(userOnlineStatus.userId, userId))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(userOnlineStatus).values({
        userId,
        userType,
        status,
        currentActivity,
        lastSeen: now,
      }).returning();
      return result[0];
    }
  }

  async getOnlineUsers(userType?: string): Promise<UserOnlineStatus[]> {
    if (userType) {
      return await db.select().from(userOnlineStatus)
        .where(and(
          eq(userOnlineStatus.userType, userType),
          or(
            eq(userOnlineStatus.status, 'online'),
            eq(userOnlineStatus.status, 'away'),
            eq(userOnlineStatus.status, 'busy')
          )
        ));
    }
    return await db.select().from(userOnlineStatus)
      .where(or(
        eq(userOnlineStatus.status, 'online'),
        eq(userOnlineStatus.status, 'away'),
        eq(userOnlineStatus.status, 'busy')
      ));
  }

  async cleanupStaleOnlineStatuses(inactiveMinutes: number = 15): Promise<void> {
    const cutoffTime = new Date(Date.now() - inactiveMinutes * 60 * 1000).toISOString();
    await db.update(userOnlineStatus)
      .set({ status: 'offline' })
      .where(sqlFunc`${userOnlineStatus.lastSeen} < ${cutoffTime}`);
  }

  async getTypingIndicator(threadId: string, userId: string): Promise<TypingIndicator | undefined> {
    const result = await db.select().from(typingIndicators)
      .where(and(
        eq(typingIndicators.threadId, threadId),
        eq(typingIndicators.userId, userId)
      ));
    return result[0];
  }

  async setTypingIndicator(threadId: string, userId: string, userType: string, isTyping: boolean): Promise<TypingIndicator> {
    const existing = await this.getTypingIndicator(threadId, userId);
    const now = new Date().toISOString();
    
    if (existing) {
      const result = await db.update(typingIndicators)
        .set({
          isTyping,
          updatedAt: now,
        })
        .where(and(
          eq(typingIndicators.threadId, threadId),
          eq(typingIndicators.userId, userId)
        ))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(typingIndicators).values({
        threadId,
        userId,
        userType,
        isTyping,
      }).returning();
      return result[0];
    }
  }

  async getThreadTypingIndicators(threadId: string): Promise<TypingIndicator[]> {
    return await db.select().from(typingIndicators)
      .where(and(
        eq(typingIndicators.threadId, threadId),
        eq(typingIndicators.isTyping, true)
      ));
  }

  async cleanupStaleTypingIndicators(inactiveSeconds: number = 10): Promise<void> {
    const cutoffTime = new Date(Date.now() - inactiveSeconds * 1000).toISOString();
    await db.delete(typingIndicators)
      .where(sqlFunc`${typingIndicators.updatedAt} < ${cutoffTime}`);
  }

  // Advanced Search & Filtering Implementation

  async getSavedSearches(userId: string, userType: string): Promise<SavedSearch[]> {
    return await db.select().from(savedSearches)
      .where(and(
        eq(savedSearches.userId, userId),
        eq(savedSearches.userType, userType)
      ))
      .orderBy(desc(savedSearches.lastUsedAt), desc(savedSearches.usageCount));
  }

  async getSavedSearch(id: string): Promise<SavedSearch | undefined> {
    const result = await db.select().from(savedSearches).where(eq(savedSearches.id, id));
    return result[0];
  }

  async createSavedSearch(search: InsertSavedSearch): Promise<SavedSearch> {
    const result = await db.insert(savedSearches).values(search).returning();
    return result[0];
  }

  async updateSavedSearch(id: string, data: Partial<SavedSearch>): Promise<SavedSearch> {
    const result = await db.update(savedSearches)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(savedSearches.id, id))
      .returning();
    return result[0];
  }

  async deleteSavedSearch(id: string): Promise<void> {
    await db.delete(savedSearches).where(eq(savedSearches.id, id));
  }

  async incrementSearchUsage(id: string): Promise<SavedSearch> {
    const result = await db.update(savedSearches)
      .set({
        usageCount: sqlFunc`${savedSearches.usageCount} + 1`,
        lastUsedAt: new Date().toISOString(),
      })
      .where(eq(savedSearches.id, id))
      .returning();
    return result[0];
  }

  async getBuilderFavorites(userId: string, collectionName?: string): Promise<BuilderFavorite[]> {
    if (collectionName) {
      return await db.select().from(builderFavorites)
        .where(and(
          eq(builderFavorites.userId, userId),
          eq(builderFavorites.collectionName, collectionName)
        ))
        .orderBy(desc(builderFavorites.createdAt));
    }
    return await db.select().from(builderFavorites)
      .where(eq(builderFavorites.userId, userId))
      .orderBy(desc(builderFavorites.createdAt));
  }

  async addBuilderFavorite(favorite: InsertBuilderFavorite): Promise<BuilderFavorite> {
    const result = await db.insert(builderFavorites).values(favorite).returning();
    return result[0];
  }

  async removeBuilderFavorite(userId: string, builderId: string): Promise<void> {
    await db.delete(builderFavorites)
      .where(and(
        eq(builderFavorites.userId, userId),
        eq(builderFavorites.builderId, builderId)
      ));
  }

  async isBuilderFavorited(userId: string, builderId: string): Promise<boolean> {
    const result = await db.select().from(builderFavorites)
      .where(and(
        eq(builderFavorites.userId, userId),
        eq(builderFavorites.builderId, builderId)
      ));
    return result.length > 0;
  }

  async getFavoriteCollections(userId: string): Promise<string[]> {
    const result = await db.selectDistinct({ collectionName: builderFavorites.collectionName })
      .from(builderFavorites)
      .where(and(
        eq(builderFavorites.userId, userId),
        sqlFunc`${builderFavorites.collectionName} IS NOT NULL`
      ));
    return result.map(r => r.collectionName!).filter(Boolean);
  }

  async getSearchHistory(userId: string, userType: string, limit: number = 50): Promise<SearchHistory[]> {
    return await db.select().from(searchHistory)
      .where(and(
        eq(searchHistory.userId, userId),
        eq(searchHistory.userType, userType)
      ))
      .orderBy(desc(searchHistory.searchedAt))
      .limit(limit);
  }

  async addSearchHistory(history: InsertSearchHistory): Promise<SearchHistory> {
    const result = await db.insert(searchHistory).values(history).returning();
    return result[0];
  }

  async clearSearchHistory(userId: string): Promise<void> {
    await db.delete(searchHistory).where(eq(searchHistory.userId, userId));
  }

  async deleteSearchHistoryItem(id: string): Promise<void> {
    await db.delete(searchHistory).where(eq(searchHistory.id, id));
  }

  async getPopularSearches(userType: string, limit: number = 10): Promise<{ query: string; count: number }[]> {
    const result = await db.select({
      query: searchHistory.searchQuery,
      count: sqlFunc<number>`COUNT(*)::int`,
    })
      .from(searchHistory)
      .where(eq(searchHistory.userType, userType))
      .groupBy(searchHistory.searchQuery)
      .orderBy(desc(sqlFunc`COUNT(*)`))
      .limit(limit);
    return result;
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const result = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
    return result[0];
  }

  async createUserPreferences(preferences: InsertUserPreferences): Promise<UserPreferences> {
    const result = await db.insert(userPreferences).values(preferences).returning();
    return result[0];
  }

  async updateUserPreferences(userId: string, data: Partial<UserPreferences>): Promise<UserPreferences> {
    const result = await db.update(userPreferences)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(userPreferences.userId, userId))
      .returning();
    return result[0];
  }

  async getFilterPresets(userId?: string, includeGlobal: boolean = true): Promise<FilterPreset[]> {
    if (userId) {
      if (includeGlobal) {
        return await db.select().from(filterPresets)
          .where(or(
            eq(filterPresets.userId, userId),
            eq(filterPresets.isGlobal, true)
          ))
          .orderBy(desc(filterPresets.isGlobal), desc(filterPresets.createdAt));
      }
      return await db.select().from(filterPresets)
        .where(eq(filterPresets.userId, userId))
        .orderBy(desc(filterPresets.createdAt));
    }
    return await db.select().from(filterPresets)
      .where(eq(filterPresets.isGlobal, true))
      .orderBy(desc(filterPresets.createdAt));
  }

  async getFilterPreset(id: string): Promise<FilterPreset | undefined> {
    const result = await db.select().from(filterPresets).where(eq(filterPresets.id, id));
    return result[0];
  }

  async createFilterPreset(preset: InsertFilterPreset): Promise<FilterPreset> {
    const result = await db.insert(filterPresets).values(preset).returning();
    return result[0];
  }

  async updateFilterPreset(id: string, data: Partial<FilterPreset>): Promise<FilterPreset> {
    const result = await db.update(filterPresets)
      .set(data)
      .where(eq(filterPresets.id, id))
      .returning();
    return result[0];
  }

  async deleteFilterPreset(id: string): Promise<void> {
    await db.delete(filterPresets).where(eq(filterPresets.id, id));
  }

  // Social Proof & Activity Tracking Implementations
  
  async getPlatformActivity(limit: number = 20): Promise<PlatformActivity[]> {
    return await db.select().from(platformActivity)
      .where(eq(platformActivity.visibility, 'public'))
      .orderBy(desc(platformActivity.createdAt))
      .limit(limit);
  }

  async createPlatformActivity(activity: InsertPlatformActivity): Promise<PlatformActivity> {
    const result = await db.insert(platformActivity).values(activity).returning();
    return result[0];
  }

  async getPlatformStats(): Promise<{
    totalPaidOut: string;
    totalBuilders: number;
    totalProjects: number;
    avgRating: string;
    onTimeDelivery: string;
  }> {
    // Get total paid out from builders
    const paidResult = await db.select({
      total: sqlFunc<string>`COALESCE(SUM(CAST(total_earnings AS DECIMAL)), 0)`
    }).from(builders);

    // Get total active builders
    const buildersResult = await db.select({
      count: sqlFunc<number>`COUNT(*)::int`
    }).from(builders).where(eq(builders.isActive, true));

    // Get total completed projects
    const projectsResult = await db.select({
      count: sqlFunc<number>`COUNT(*)::int`
    }).from(orders).where(eq(orders.status, 'completed'));

    // Get average rating
    const ratingResult = await db.select({
      avg: sqlFunc<string>`COALESCE(AVG(CAST(rating AS DECIMAL)), 0)`
    }).from(builders).where(eq(builders.isActive, true));

    // Get average on-time delivery rate
    const deliveryResult = await db.select({
      avg: sqlFunc<string>`COALESCE(AVG(CAST(on_time_delivery_rate AS DECIMAL)), 0)`
    }).from(builders).where(eq(builders.isActive, true));

    return {
      totalPaidOut: paidResult[0]?.total || '0',
      totalBuilders: buildersResult[0]?.count || 0,
      totalProjects: projectsResult[0]?.count || 0,
      avgRating: ratingResult[0]?.avg || '0',
      onTimeDelivery: deliveryResult[0]?.avg || '0',
    };
  }

  async trackServiceView(view: InsertServiceView): Promise<ServiceView> {
    const result = await db.insert(serviceViews).values(view).returning();
    return result[0];
  }

  async getServiceSocialProof(serviceId: string): Promise<{
    viewsLast24Hours: number;
    bookingsLastWeek: number;
    lastBookedAt: string | null;
    totalBookings: number;
  }> {
    // Get views in last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const viewsResult = await db.select({
      count: sqlFunc<number>`COUNT(*)::int`
    })
      .from(serviceViews)
      .where(and(
        eq(serviceViews.serviceId, serviceId),
        sqlFunc`created_at >= ${oneDayAgo}`
      ));

    // Get bookings in last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const bookingsWeekResult = await db.select({
      count: sqlFunc<number>`COUNT(*)::int`
    })
      .from(orders)
      .where(and(
        eq(orders.serviceId, serviceId),
        sqlFunc`created_at >= ${sevenDaysAgo}`
      ));

    // Get last booked timestamp
    const lastBooking = await db.select({
      createdAt: orders.createdAt
    })
      .from(orders)
      .where(eq(orders.serviceId, serviceId))
      .orderBy(desc(orders.createdAt))
      .limit(1);

    // Get total bookings
    const totalBookingsResult = await db.select({
      count: sqlFunc<number>`COUNT(*)::int`
    })
      .from(orders)
      .where(eq(orders.serviceId, serviceId));

    return {
      viewsLast24Hours: viewsResult[0]?.count || 0,
      bookingsLastWeek: bookingsWeekResult[0]?.count || 0,
      lastBookedAt: lastBooking[0]?.createdAt || null,
      totalBookings: totalBookingsResult[0]?.count || 0,
    };
  }

  async getRecentHighlightReviews(limit: number = 10): Promise<Array<{
    review: Review;
    builder: Builder | null;
    service: Service | null;
  }>> {
    const recentReviews = await db.select().from(reviews)
      .where(and(
        eq(reviews.rating, 5),
        eq(reviews.status, 'approved')
      ))
      .orderBy(desc(reviews.createdAt))
      .limit(limit);

    const results = await Promise.all(
      recentReviews.map(async (review) => {
        const builder = review.builderId 
          ? (await this.getBuilder(review.builderId)) ?? null
          : null;
        const service = review.serviceId
          ? (await this.getService(review.serviceId)) ?? null
          : null;
        return { review, builder, service };
      })
    );

    return results;
  }

  // Builder Analytics Implementation
  async getBuilderAnalytics(builderId: string): Promise<any> {
    const builder = await this.getBuilder(builderId);
    if (!builder) return null;
    
    return {
      totalEarnings: builder.totalEarnings,
      availableBalance: builder.availableBalance,
      pendingPayouts: builder.pendingPayouts,
      activeOrders: builder.activeOrders,
      completedOrders: builder.completedProjects,
      successRate: builder.successRate,
      avgResponseTime: builder.avgResponseTimeHours || 0,
      onTimeDeliveryRate: builder.onTimeDeliveryRate,
    };
  }

  async getServiceAnalytics(serviceId: string): Promise<any> {
    const service = await this.getService(serviceId);
    if (!service) return null;
    
    return {
      viewCount: 0,
      inquiryCount: 0,
      conversionCount: 0,
      totalRevenue: "0",
    };
  }

  // Message Templates Implementation
  async getBuilderMessageTemplates(builderId: string, category?: string): Promise<any[]> {
    let conditions = [eq(messageTemplates.builderId, builderId)];
    if (category) {
      conditions.push(eq(messageTemplates.category, category));
    }
    
    return await db.select().from(messageTemplates)
      .where(and(...conditions))
      .orderBy(desc(messageTemplates.createdAt));
  }

  async getMessageTemplate(id: string): Promise<any | undefined> {
    const result = await db.select().from(messageTemplates)
      .where(eq(messageTemplates.id, id))
      .limit(1);
    return result[0];
  }

  async createMessageTemplate(template: any): Promise<any> {
    const result = await db.insert(messageTemplates).values(template).returning();
    return result[0];
  }

  async updateMessageTemplate(id: string, data: Partial<any>): Promise<any | undefined> {
    const result = await db.update(messageTemplates)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(messageTemplates.id, id))
      .returning();
    return result[0];
  }

  async deleteMessageTemplate(id: string): Promise<void> {
    await db.delete(messageTemplates).where(eq(messageTemplates.id, id));
  }

  async incrementTemplateUseCount(id: string): Promise<void> {
    await db.update(messageTemplates)
      .set({ useCount: sqlFunc`use_count + 1` })
      .where(eq(messageTemplates.id, id));
  }

  // Referral System Implementation
  async getBuilderReferralCode(builderId: string): Promise<any | undefined> {
    const result = await db.select().from(referralCodes)
      .where(eq(referralCodes.builderId, builderId))
      .limit(1);
    return result[0];
  }

  async createReferralCode(data: { builderId: string; code: string; isActive: boolean }): Promise<any> {
    const result = await db.insert(referralCodes).values(data).returning();
    return result[0];
  }

  async incrementReferralClicks(code: string): Promise<void> {
    await db.update(referralCodes)
      .set({ totalClicks: sqlFunc`total_clicks + 1` })
      .where(eq(referralCodes.code, code));
  }

  async incrementReferralSignups(code: string): Promise<void> {
    await db.update(referralCodes)
      .set({ totalSignups: sqlFunc`total_signups + 1` })
      .where(eq(referralCodes.code, code));
  }

  async incrementReferralConversions(code: string): Promise<void> {
    await db.update(referralCodes)
      .set({ totalConversions: sqlFunc`total_conversions + 1` })
      .where(eq(referralCodes.code, code));
  }

  async getBuilderReferrals(walletAddress: string): Promise<any[]> {
    return await db.select().from(referrals)
      .where(eq(referrals.referrerWallet, walletAddress))
      .orderBy(desc(referrals.createdAt));
  }

  async getReferralByWallets(referrerWallet: string, referredWallet: string): Promise<any | undefined> {
    const result = await db.select().from(referrals)
      .where(and(
        eq(referrals.referrerWallet, referrerWallet),
        eq(referrals.referredWallet, referredWallet)
      ))
      .limit(1);
    return result[0];
  }

  async getReferral(id: string): Promise<any | undefined> {
    const result = await db.select().from(referrals)
      .where(eq(referrals.id, id))
      .limit(1);
    return result[0];
  }

  async createReferral(data: any): Promise<any> {
    const result = await db.insert(referrals).values(data).returning();
    return result[0];
  }

  async updateReferral(id: string, data: Partial<any>): Promise<any | undefined> {
    const result = await db.update(referrals)
      .set(data)
      .where(eq(referrals.id, id))
      .returning();
    return result[0];
  }

  // Badge System Implementation
  async getBuilderBadges(builderId: string): Promise<any[]> {
    return await db.select().from(builderBadges)
      .where(and(
        eq(builderBadges.builderId, builderId),
        eq(builderBadges.isActive, true)
      ))
      .orderBy(builderBadges.earnedAt);
  }

  async createBuilderBadge(badge: any): Promise<any> {
    const result = await db.insert(builderBadges).values(badge).returning();
    return result[0];
  }

  // Dispute Resolution Implementation
  async getAllDisputes(): Promise<any[]> {
    return await db.select().from(disputes)
      .orderBy(desc(disputes.createdAt));
  }

  async getDispute(id: string): Promise<any | undefined> {
    const result = await db.select().from(disputes)
      .where(eq(disputes.id, id))
      .limit(1);
    return result[0];
  }

  async getOrderDisputes(orderId: string): Promise<any[]> {
    return await db.select().from(disputes)
      .where(eq(disputes.orderId, orderId))
      .orderBy(desc(disputes.createdAt));
  }

  async createDispute(dispute: any): Promise<any> {
    const result = await db.insert(disputes).values(dispute).returning();
    return result[0];
  }

  async addDisputeEvidence(disputeId: string, evidenceUrls: string[]): Promise<any> {
    const dispute = await this.getDispute(disputeId);
    if (!dispute) throw new Error('Dispute not found');
    
    const existingEvidence = dispute.evidence || [];
    const updatedEvidence = [...existingEvidence, ...evidenceUrls];
    
    const result = await db.update(disputes)
      .set({ 
        evidence: updatedEvidence,
        updatedAt: new Date().toISOString()
      })
      .where(eq(disputes.id, disputeId))
      .returning();
    
    return result[0];
  }

  async getDisputeMessages(disputeId: string): Promise<any[]> {
    return await db.select().from(disputeMessages)
      .where(eq(disputeMessages.disputeId, disputeId))
      .orderBy(disputeMessages.createdAt);
  }

  async createDisputeMessage(message: any): Promise<any> {
    const result = await db.insert(disputeMessages).values(message).returning();
    return result[0];
  }

  async updateDispute(id: string, data: Partial<any>): Promise<any> {
    const result = await db.update(disputes)
      .set({ ...data, updatedAt: new Date().toISOString() })
      .where(eq(disputes.id, id))
      .returning();
    return result[0];
  }

  async getBuilderDisputes(builderId: string): Promise<any[]> {
    const builderOrders = await db.select().from(orders)
      .where(eq(orders.builderId, builderId));
    
    const orderIds = builderOrders.map(o => o.id);
    if (orderIds.length === 0) return [];
    
    return await db.select().from(disputes)
      .where(sqlFunc`order_id IN (${orderIds.join(',')})`)
      .orderBy(desc(disputes.createdAt));
  }

  async getClientDisputes(clientId: string): Promise<any[]> {
    const clientOrders = await db.select().from(orders)
      .where(eq(orders.clientId, clientId));
    
    const orderIds = clientOrders.map(o => o.id);
    if (orderIds.length === 0) return [];
    
    return await db.select().from(disputes)
      .where(sqlFunc`order_id IN (${orderIds.join(',')})`)
      .orderBy(desc(disputes.createdAt));
  }
}

export const storage = new PostgresStorage();
