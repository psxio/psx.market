import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const builders = pgTable("builders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull().unique(),
  name: text("name").notNull(),
  headline: text("headline").notNull(),
  bio: text("bio").notNull(),
  profileImage: text("profile_image"),
  verified: boolean("verified").notNull().default(false),
  category: text("category").notNull(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0"),
  reviewCount: integer("review_count").notNull().default(0),
  completedProjects: integer("completed_projects").notNull().default(0),
  responseTime: text("response_time").default("24 hours"),
  twitterHandle: text("twitter_handle"),
  twitterFollowers: integer("twitter_followers"),
  portfolioLinks: text("portfolio_links").array(),
  skills: text("skills").array(),
  psxTier: text("psx_tier").notNull().default("bronze"),
  
  portfolioMedia: text("portfolio_media").array(),
  videoShowreel: text("video_showreel"),
  
  instagramHandle: text("instagram_handle"),
  instagramFollowers: integer("instagram_followers"),
  youtubeChannel: text("youtube_channel"),
  youtubeSubscribers: integer("youtube_subscribers"),
  telegramHandle: text("telegram_handle"),
  telegramMembers: integer("telegram_members"),
  engagementRate: decimal("engagement_rate", { precision: 5, scale: 2 }),
  audienceDemographics: text("audience_demographics"),
  contentNiches: text("content_niches").array(),
  brandPartnerships: text("brand_partnerships").array(),
  
  software3D: text("software_3d").array(),
  renderEngines: text("render_engines").array(),
  styleSpecialties: text("style_specialties").array(),
  animationExpertise: boolean("animation_expertise"),
  
  marketingPlatforms: text("marketing_platforms").array(),
  growthStrategies: text("growth_strategies").array(),
  caseStudies: text("case_studies").array(),
  avgROI: decimal("avg_roi", { precision: 5, scale: 2 }),
  clientIndustries: text("client_industries").array(),
  
  programmingLanguages: text("programming_languages").array(),
  blockchainFrameworks: text("blockchain_frameworks").array(),
  githubProfile: text("github_profile"),
  deployedContracts: text("deployed_contracts").array(),
  auditReports: text("audit_reports").array(),
  certifications: text("certifications").array(),
  
  tradingExperience: integer("trading_experience"),
  volumeCapabilities: text("volume_capabilities"),
  dexExpertise: text("dex_expertise").array(),
  cexExpertise: text("cex_expertise").array(),
  complianceKnowledge: boolean("compliance_knowledge"),
  volumeProof: text("volume_proof").array(),
});

export const builderProjects = pgTable("builder_projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  builderId: varchar("builder_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  clientName: text("client_name"),
  projectDate: text("project_date").notNull(),
  
  mediaUrls: text("media_urls").array(),
  videoUrl: text("video_url"),
  liveUrl: text("live_url"),
  
  results: text("results").array(),
  metricsAchieved: text("metrics_achieved"),
  
  twitterReach: integer("twitter_reach"),
  engagementGenerated: integer("engagement_generated"),
  followersGained: integer("followers_gained"),
  impressions: integer("impressions"),
  
  roiPercentage: decimal("roi_percentage", { precision: 5, scale: 2 }),
  revenueGenerated: decimal("revenue_generated", { precision: 12, scale: 2 }),
  conversionRate: decimal("conversion_rate", { precision: 5, scale: 2 }),
  
  contractAddress: text("contract_address"),
  auditScore: integer("audit_score"),
  
  volumeDelivered: decimal("volume_delivered", { precision: 15, scale: 2 }),
  
  testimonial: text("testimonial"),
  testimonialAuthor: text("testimonial_author"),
  
  featured: boolean("featured").notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  builderId: varchar("builder_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  deliveryTime: text("delivery_time").notNull(),
  basicPrice: decimal("basic_price", { precision: 10, scale: 2 }).notNull(),
  standardPrice: decimal("standard_price", { precision: 10, scale: 2 }),
  premiumPrice: decimal("premium_price", { precision: 10, scale: 2 }),
  basicDescription: text("basic_description").notNull(),
  standardDescription: text("standard_description"),
  premiumDescription: text("premium_description"),
  tags: text("tags").array(),
  psxRequired: decimal("psx_required", { precision: 10, scale: 2 }).notNull(),
  featured: boolean("featured").notNull().default(false),
  portfolioMedia: text("portfolio_media").array(),
  videoUrls: text("video_urls").array(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  builderId: varchar("builder_id").notNull(),
  serviceId: varchar("service_id"),
  clientName: text("client_name").notNull(),
  clientWallet: text("client_wallet").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  projectTitle: text("project_title"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  builderCount: integer("builder_count").notNull().default(0),
});

export const builderApplications = pgTable("builder_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  bio: text("bio").notNull(),
  category: text("category").notNull(),
  portfolioLinks: text("portfolio_links").array(),
  yearsExperience: integer("years_experience").notNull(),
  status: text("status").notNull().default("pending"),
  submittedAt: text("submitted_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  reviewerNotes: text("reviewer_notes"),
  
  twitterHandle: text("twitter_handle"),
  twitterFollowers: integer("twitter_followers"),
  instagramHandle: text("instagram_handle"),
  instagramFollowers: integer("instagram_followers"),
  youtubeChannel: text("youtube_channel"),
  youtubeSubscribers: integer("youtube_subscribers"),
  engagementRate: decimal("engagement_rate", { precision: 5, scale: 2 }),
  contentNiches: text("content_niches").array(),
  
  software3D: text("software_3d").array(),
  renderEngines: text("render_engines").array(),
  styleSpecialties: text("style_specialties").array(),
  
  marketingPlatforms: text("marketing_platforms").array(),
  growthStrategies: text("growth_strategies").array(),
  caseStudyLinks: text("case_study_links").array(),
  
  programmingLanguages: text("programming_languages").array(),
  blockchainFrameworks: text("blockchain_frameworks").array(),
  githubProfile: text("github_profile"),
  
  tradingExperience: integer("trading_experience"),
  volumeCapabilities: text("volume_capabilities"),
  complianceKnowledge: boolean("compliance_knowledge"),
});

export const insertBuilderSchema = createInsertSchema(builders).omit({
  id: true,
  rating: true,
  reviewCount: true,
  completedProjects: true,
});

export const insertBuilderProjectSchema = createInsertSchema(builderProjects).omit({
  id: true,
  createdAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  builderCount: true,
});

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  companyName: text("company_name"),
  bio: text("bio"),
  profileImage: text("profile_image"),
  verified: boolean("verified").notNull().default(false),
  psxTier: text("psx_tier").notNull().default("bronze"),
  
  projectType: text("project_type"),
  budgetRange: text("budget_range"),
  interestedCategories: text("interested_categories").array(),
  projectTimeline: text("project_timeline"),
  projectDescription: text("project_description"),
  experienceLevel: text("experience_level"),
  referralSource: text("referral_source"),
  websiteUrl: text("website_url"),
  twitterHandle: text("twitter_handle"),
  telegramHandle: text("telegram_handle"),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull(),
  builderId: varchar("builder_id").notNull(),
  serviceId: varchar("service_id").notNull(),
  
  packageType: text("package_type").notNull(),
  title: text("title").notNull(),
  requirements: text("requirements").notNull(),
  budget: decimal("budget", { precision: 10, scale: 2 }).notNull(),
  deliveryDays: integer("delivery_days").notNull(),
  
  status: text("status").notNull().default("pending"),
  
  acceptedAt: text("accepted_at"),
  startedAt: text("started_at"),
  deliveredAt: text("delivered_at"),
  completedAt: text("completed_at"),
  cancelledAt: text("cancelled_at"),
  
  cancellationReason: text("cancellation_reason"),
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }),
  refundStatus: text("refund_status"),
  
  revisionCount: integer("revision_count").notNull().default(0),
  maxRevisions: integer("max_revisions").notNull().default(2),
  
  deliveryUrl: text("delivery_url"),
  deliveryNotes: text("delivery_notes"),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const orderRevisions = pgTable("order_revisions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  requestedBy: varchar("requested_by").notNull(),
  
  revisionNumber: integer("revision_number").notNull(),
  requestDetails: text("request_details").notNull(),
  status: text("status").notNull().default("pending"),
  
  deliveryUrl: text("delivery_url"),
  deliveryNotes: text("delivery_notes"),
  deliveredAt: text("delivered_at"),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const orderActivities = pgTable("order_activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  actorId: varchar("actor_id").notNull(),
  actorType: text("actor_type").notNull(),
  
  activityType: text("activity_type").notNull(),
  description: text("description").notNull(),
  metadata: text("metadata"),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const milestones = pgTable("milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  dueDate: text("due_date"),
  status: text("status").notNull().default("pending"),
  completedAt: text("completed_at"),
  transactionHash: text("transaction_hash"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertBuilderApplicationSchema = createInsertSchema(builderApplications).omit({
  id: true,
  status: true,
  submittedAt: true,
  reviewerNotes: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  verified: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  acceptedAt: true,
  startedAt: true,
  deliveredAt: true,
  completedAt: true,
  cancelledAt: true,
  cancellationReason: true,
  refundAmount: true,
  refundStatus: true,
  revisionCount: true,
  deliveryUrl: true,
  deliveryNotes: true,
});

export const insertOrderRevisionSchema = createInsertSchema(orderRevisions).omit({
  id: true,
  status: true,
  createdAt: true,
  deliveredAt: true,
});

export const insertOrderActivitySchema = createInsertSchema(orderActivities).omit({
  id: true,
  createdAt: true,
});

export const insertMilestoneSchema = createInsertSchema(milestones).omit({
  id: true,
  status: true,
  completedAt: true,
  createdAt: true,
  transactionHash: true,
});

export const admins = pgTable("admins", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default("admin"),
  lastLogin: text("last_login"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const referrals = pgTable("referrals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  referrerWallet: text("referrer_wallet").notNull(),
  referredWallet: text("referred_wallet").notNull(),
  referrerType: text("referrer_type").notNull(),
  referredType: text("referred_type").notNull(),
  status: text("status").notNull().default("pending"),
  reward: decimal("reward", { precision: 10, scale: 2 }),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  completedAt: text("completed_at"),
});

export const chatThreads = pgTable("chat_threads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull(),
  builderId: varchar("builder_id").notNull(),
  orderId: varchar("order_id"),
  
  title: text("title").notNull(),
  status: text("status").notNull().default("active"),
  
  lastMessageAt: text("last_message_at"),
  lastMessagePreview: text("last_message_preview"),
  
  clientUnreadCount: integer("client_unread_count").notNull().default(0),
  builderUnreadCount: integer("builder_unread_count").notNull().default(0),
  
  archivedByClient: boolean("archived_by_client").notNull().default(false),
  archivedByBuilder: boolean("archived_by_builder").notNull().default(false),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  threadId: varchar("thread_id").notNull(),
  
  senderId: varchar("sender_id").notNull(),
  senderType: text("sender_type").notNull(),
  
  content: text("content").notNull(),
  messageType: text("message_type").notNull().default("text"),
  
  edited: boolean("edited").notNull().default(false),
  editedAt: text("edited_at"),
  
  deleted: boolean("deleted").notNull().default(false),
  deletedAt: text("deleted_at"),
  
  replyToId: varchar("reply_to_id"),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const messageAttachments = pgTable("message_attachments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  messageId: varchar("message_id").notNull(),
  
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(),
  
  thumbnailUrl: text("thumbnail_url"),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const messageReadReceipts = pgTable("message_read_receipts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  messageId: varchar("message_id").notNull(),
  threadId: varchar("thread_id").notNull(),
  
  readerId: varchar("reader_id").notNull(),
  readerType: text("reader_type").notNull(),
  
  readAt: text("read_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  clientId: varchar("client_id").notNull(),
  builderId: varchar("builder_id").notNull(),
  
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USDC"),
  
  paymentMethod: text("payment_method").notNull().default("base_pay"),
  transactionHash: text("transaction_hash"),
  blockNumber: integer("block_number"),
  
  escrowContractAddress: text("escrow_contract_address"),
  
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(),
  platformFeePercentage: decimal("platform_fee_percentage", { precision: 5, scale: 2 }).notNull().default("2.5"),
  builderAmount: decimal("builder_amount", { precision: 10, scale: 2 }).notNull(),
  
  status: text("status").notNull().default("pending"),
  
  paidAt: text("paid_at"),
  releasedAt: text("released_at"),
  refundedAt: text("refunded_at"),
  
  payerWallet: text("payer_wallet"),
  payerEmail: text("payer_email"),
  
  invoiceId: varchar("invoice_id"),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const milestonePayments = pgTable("milestone_payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  paymentId: varchar("payment_id").notNull(),
  milestoneId: varchar("milestone_id").notNull(),
  orderId: varchar("order_id").notNull(),
  
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  percentage: decimal("percentage", { precision: 5, scale: 2 }).notNull(),
  
  status: text("status").notNull().default("locked"),
  
  transactionHash: text("transaction_hash"),
  releasedAt: text("released_at"),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const payouts = pgTable("payouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  builderId: varchar("builder_id").notNull(),
  builderWallet: text("builder_wallet").notNull(),
  
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USDC"),
  
  status: text("status").notNull().default("pending"),
  
  transactionHash: text("transaction_hash"),
  processedAt: text("processed_at"),
  
  paymentIds: text("payment_ids").array(),
  
  failureReason: text("failure_reason"),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const disputes = pgTable("disputes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  paymentId: varchar("payment_id").notNull(),
  orderId: varchar("order_id").notNull(),
  
  raisedBy: varchar("raised_by").notNull(),
  raisedByType: text("raised_by_type").notNull(),
  
  reason: text("reason").notNull(),
  description: text("description").notNull(),
  evidence: text("evidence").array(),
  
  status: text("status").notNull().default("open"),
  
  resolution: text("resolution"),
  resolvedBy: varchar("resolved_by"),
  resolvedAt: text("resolved_at"),
  
  refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const refunds = pgTable("refunds", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  paymentId: varchar("payment_id").notNull(),
  orderId: varchar("order_id").notNull(),
  disputeId: varchar("dispute_id"),
  
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  reason: text("reason").notNull(),
  
  status: text("status").notNull().default("pending"),
  
  transactionHash: text("transaction_hash"),
  processedAt: text("processed_at"),
  
  failureReason: text("failure_reason"),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceNumber: text("invoice_number").notNull().unique(),
  paymentId: varchar("payment_id").notNull(),
  orderId: varchar("order_id").notNull(),
  
  clientId: varchar("client_id").notNull(),
  builderId: varchar("builder_id").notNull(),
  
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  platformFee: decimal("platform_fee", { precision: 10, scale: 2 }).notNull(),
  builderAmount: decimal("builder_amount", { precision: 10, scale: 2 }).notNull(),
  
  status: text("status").notNull().default("draft"),
  
  dueDate: text("due_date"),
  paidAt: text("paid_at"),
  
  billingEmail: text("billing_email"),
  billingAddress: text("billing_address"),
  
  notes: text("notes"),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  lastLogin: true,
  createdAt: true,
});

export const insertReferralSchema = createInsertSchema(referrals).omit({
  id: true,
  status: true,
  createdAt: true,
  completedAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  status: true,
  paidAt: true,
  releasedAt: true,
  refundedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMilestonePaymentSchema = createInsertSchema(milestonePayments).omit({
  id: true,
  status: true,
  transactionHash: true,
  releasedAt: true,
  createdAt: true,
});

export const insertPayoutSchema = createInsertSchema(payouts).omit({
  id: true,
  status: true,
  transactionHash: true,
  processedAt: true,
  failureReason: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDisputeSchema = createInsertSchema(disputes).omit({
  id: true,
  status: true,
  resolution: true,
  resolvedBy: true,
  resolvedAt: true,
  refundAmount: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRefundSchema = createInsertSchema(refunds).omit({
  id: true,
  status: true,
  transactionHash: true,
  processedAt: true,
  failureReason: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  status: true,
  paidAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatThreadSchema = createInsertSchema(chatThreads).omit({
  id: true,
  status: true,
  lastMessageAt: true,
  lastMessagePreview: true,
  clientUnreadCount: true,
  builderUnreadCount: true,
  archivedByClient: true,
  archivedByBuilder: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  edited: true,
  editedAt: true,
  deleted: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageAttachmentSchema = createInsertSchema(messageAttachments).omit({
  id: true,
  createdAt: true,
});

export const insertMessageReadReceiptSchema = createInsertSchema(messageReadReceipts).omit({
  id: true,
  readAt: true,
});

export type InsertBuilder = z.infer<typeof insertBuilderSchema>;
export type Builder = typeof builders.$inferSelect;

export type InsertBuilderProject = z.infer<typeof insertBuilderProjectSchema>;
export type BuilderProject = typeof builderProjects.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export type InsertBuilderApplication = z.infer<typeof insertBuilderApplicationSchema>;
export type BuilderApplication = typeof builderApplications.$inferSelect;

export type InsertClient = z.infer<typeof insertClientSchema>;
export type Client = typeof clients.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export type InsertOrderRevision = z.infer<typeof insertOrderRevisionSchema>;
export type OrderRevision = typeof orderRevisions.$inferSelect;

export type InsertOrderActivity = z.infer<typeof insertOrderActivitySchema>;
export type OrderActivity = typeof orderActivities.$inferSelect;

export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;
export type Milestone = typeof milestones.$inferSelect;

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referrals.$inferSelect;

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

export type InsertMilestonePayment = z.infer<typeof insertMilestonePaymentSchema>;
export type MilestonePayment = typeof milestonePayments.$inferSelect;

export type InsertPayout = z.infer<typeof insertPayoutSchema>;
export type Payout = typeof payouts.$inferSelect;

export type InsertDispute = z.infer<typeof insertDisputeSchema>;
export type Dispute = typeof disputes.$inferSelect;

export type InsertRefund = z.infer<typeof insertRefundSchema>;
export type Refund = typeof refunds.$inferSelect;

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

export type InsertChatThread = z.infer<typeof insertChatThreadSchema>;
export type ChatThread = typeof chatThreads.$inferSelect;

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

export type InsertMessageAttachment = z.infer<typeof insertMessageAttachmentSchema>;
export type MessageAttachment = typeof messageAttachments.$inferSelect;

export type InsertMessageReadReceipt = z.infer<typeof insertMessageReadReceiptSchema>;
export type MessageReadReceipt = typeof messageReadReceipts.$inferSelect;
