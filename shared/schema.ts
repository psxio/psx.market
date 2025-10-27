import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const builders = pgTable("builders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  walletAddress: text("wallet_address").notNull().unique(),
  email: text("email"),
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
  tokenTickers: text("token_tickers").array(),
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
  
  acceptingOrders: boolean("accepting_orders").notNull().default(true),
  isActive: boolean("is_active").notNull().default(true),
  isLive: boolean("is_live").notNull().default(false),
  avgResponseTimeHours: integer("avg_response_time_hours").default(24),
  totalEarnings: decimal("total_earnings", { precision: 10, scale: 2 }).default("0"),
  availableBalance: decimal("available_balance", { precision: 10, scale: 2 }).default("0"),
  pendingPayouts: decimal("pending_payouts", { precision: 10, scale: 2 }).default("0"),
  successRate: decimal("success_rate", { precision: 5, scale: 2 }).default("100"),
  onTimeDeliveryRate: decimal("on_time_delivery_rate", { precision: 5, scale: 2 }).default("100"),
  activeOrders: integer("active_orders").notNull().default(0),
  lastActiveAt: text("last_active_at"),
  tokenGateWhitelisted: boolean("token_gate_whitelisted").notNull().default(false),
  
  responseRate: decimal("response_rate", { precision: 5, scale: 2 }).default("100"),
  totalMessagesReceived: integer("total_messages_received").notNull().default(0),
  totalMessagesResponded: integer("total_messages_responded").notNull().default(0),
  profileViews: integer("profile_views").notNull().default(0),
  recentViews: integer("recent_views").notNull().default(0),
  isTrending: boolean("is_trending").notNull().default(false),
  
  // Fiverr-like Enhanced Profile Fields
  languages: text("languages").array(),
  timezone: text("timezone"),
  country: text("country"),
  city: text("city"),
  education: text("education").array(),
  workExperience: text("work_experience"),
  yearsOfExperience: integer("years_of_experience"),
  availability: text("availability").default("available"),
  hoursPerWeek: integer("hours_per_week"),
  description: text("description"),
  faqs: text("faqs").array(),
  linkedinProfile: text("linkedin_profile"),
  websiteUrl: text("website_url"),
  specializations: text("specializations").array(),
  badges: text("badges").array(),
  memberSince: text("member_since").default(sql`CURRENT_TIMESTAMP`),
  
  // Profile Enhancement Fields
  coverImage: text("cover_image"),
  profileStrength: integer("profile_strength").default(0),
  repeatClientsCount: integer("repeat_clients_count").notNull().default(0),
  videoIntroUrl: text("video_intro_url"),
  rateCard: text("rate_card"),
  pricingExpectations: text("pricing_expectations"),
  verificationBadges: text("verification_badges").array(),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
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
  builderId: varchar("builder_id"),
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
  basicDeliverables: text("basic_deliverables").array(),
  standardDeliverables: text("standard_deliverables").array(),
  premiumDeliverables: text("premium_deliverables").array(),
  tags: text("tags").array(),
  tokenTickers: text("token_tickers").array(),
  psxRequired: decimal("psx_required", { precision: 10, scale: 2 }).notNull(),
  featured: boolean("featured").notNull().default(false),
  portfolioMedia: text("portfolio_media").array(),
  videoUrls: text("video_urls").array(),
  active: boolean("active").notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Service Add-ons (Rush delivery, Extra files, etc.)
export const serviceAddons = pgTable("service_addons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceId: varchar("service_id").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  deliveryImpact: text("delivery_impact"),
  icon: text("icon"),
  active: boolean("active").notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Service Requirements Templates (Questions for clients)
export const serviceRequirements = pgTable("service_requirements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceId: varchar("service_id").notNull(),
  question: text("question").notNull(),
  type: text("type").notNull(),
  required: boolean("required").notNull().default(true),
  options: text("options").array(),
  placeholder: text("placeholder"),
  order: integer("order").notNull().default(0),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Order Requirements Responses
export const orderRequirements = pgTable("order_requirements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  requirementId: varchar("requirement_id").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Buyer Requests Board
export const buyerRequests = pgTable("buyer_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull(),
  clientName: text("client_name").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  budget: decimal("budget", { precision: 10, scale: 2 }).notNull(),
  budgetType: text("budget_type").notNull().default("fixed"),
  deadline: text("deadline"),
  requiredSkills: text("required_skills").array(),
  attachments: text("attachments").array(),
  status: text("status").notNull().default("open"),
  proposalsCount: integer("proposals_count").notNull().default(0),
  viewsCount: integer("views_count").notNull().default(0),
  expiresAt: text("expires_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Builder Proposals for Buyer Requests
export const builderProposals = pgTable("builder_proposals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  requestId: varchar("request_id").notNull(),
  builderId: varchar("builder_id").notNull(),
  builderName: text("builder_name").notNull(),
  coverLetter: text("cover_letter").notNull(),
  proposedPrice: decimal("proposed_price", { precision: 10, scale: 2 }).notNull(),
  proposedDelivery: text("proposed_delivery").notNull(),
  attachments: text("attachments").array(),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  builderId: varchar("builder_id").notNull(),
  serviceId: varchar("service_id"),
  orderId: varchar("order_id"),
  clientId: varchar("client_id").notNull(),
  clientName: text("client_name").notNull(),
  clientWallet: text("client_wallet").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  projectTitle: text("project_title"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  
  builderResponse: text("builder_response"),
  builderResponseAt: text("builder_response_at"),
  
  status: text("status").notNull().default("pending"),
  moderatedBy: varchar("moderated_by"),
  moderatedAt: text("moderated_at"),
  moderatorNotes: text("moderator_notes"),
  
  onchainTxHash: text("onchain_tx_hash"),
  onchainVerified: boolean("onchain_verified").notNull().default(false),
  onchainVerifiedAt: text("onchain_verified_at"),
  
  isDisputed: boolean("is_disputed").notNull().default(false),
  disputeStatus: text("dispute_status"),
  
  helpfulCount: integer("helpful_count").notNull().default(0),
  notHelpfulCount: integer("not_helpful_count").notNull().default(0),
});

export const reviewVotes = pgTable("review_votes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reviewId: varchar("review_id").notNull(),
  voterId: varchar("voter_id").notNull(),
  voterType: text("voter_type").notNull(),
  voteType: text("vote_type").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const reviewDisputes = pgTable("review_disputes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reviewId: varchar("review_id").notNull(),
  disputedBy: varchar("disputed_by").notNull(),
  disputedByType: text("disputed_by_type").notNull(),
  reason: text("reason").notNull(),
  details: text("details").notNull(),
  evidence: text("evidence").array(),
  status: text("status").notNull().default("pending"),
  resolution: text("resolution"),
  resolvedBy: varchar("resolved_by"),
  resolvedAt: text("resolved_at"),
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
  headline: text("headline"),
  bio: text("bio").notNull(),
  category: text("category").notNull(),
  profileImage: text("profile_image"),
  coverImage: text("cover_image"),
  profileStrength: integer("profile_strength"),
  skills: text("skills").array(),
  portfolioLinks: text("portfolio_links").array(),
  responseTime: text("response_time"),
  yearsExperience: integer("years_experience"),
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
  totalEarnings: true,
  availableBalance: true,
  pendingPayouts: true,
  successRate: true,
  onTimeDeliveryRate: true,
  activeOrders: true,
  lastActiveAt: true,
  createdAt: true,
  updatedAt: true,
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
  builderResponse: true,
  builderResponseAt: true,
  status: true,
  moderatedBy: true,
  moderatedAt: true,
  moderatorNotes: true,
  onchainTxHash: true,
  onchainVerified: true,
  onchainVerifiedAt: true,
  isDisputed: true,
  disputeStatus: true,
  helpfulCount: true,
  notHelpfulCount: true,
});

export const insertReviewVoteSchema = createInsertSchema(reviewVotes).omit({
  id: true,
  createdAt: true,
});

export const insertReviewDisputeSchema = createInsertSchema(reviewDisputes).omit({
  id: true,
  createdAt: true,
  status: true,
  resolvedBy: true,
  resolvedAt: true,
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
  
  tokenGateWhitelisted: boolean("token_gate_whitelisted").notNull().default(false),
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
  
  projectAllocationOffered: boolean("project_allocation_offered").notNull().default(false),
  projectAllocationPercentage: decimal("project_allocation_percentage", { precision: 5, scale: 2 }),
  projectAllocationDetails: text("project_allocation_details"),
  projectAllocationAccepted: boolean("project_allocation_accepted").notNull().default(false),
  
  escrowContractAddress: text("escrow_contract_address"),
  escrowCreatedTxHash: text("escrow_created_tx_hash"),
  escrowStatus: text("escrow_status").notNull().default("none"),
  escrowPlatformFee: decimal("escrow_platform_fee", { precision: 10, scale: 2 }),
  escrowReleasedAmount: decimal("escrow_released_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  inDispute: boolean("in_dispute").notNull().default(false),
  disputeRaisedAt: text("dispute_raised_at"),
  disputeResolvedAt: text("dispute_resolved_at"),
  disputeOutcome: text("dispute_outcome"),
  
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
  
  milestoneIndex: integer("milestone_index").notNull(),
  approvalDeadline: integer("approval_deadline").notNull(),
  submittedAt: text("submitted_at"),
  approvedAt: text("approved_at"),
  paidAt: text("paid_at"),
  autoApproved: boolean("auto_approved").notNull().default(false),
  
  escrowStatus: text("escrow_status").notNull().default("pending"),
  escrowTxHash: text("escrow_tx_hash"),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const projectDeliverables = pgTable("project_deliverables", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  milestoneId: varchar("milestone_id"),
  
  title: text("title").notNull(),
  description: text("description").notNull(),
  deliveryType: text("delivery_type").notNull(),
  
  fileUrls: text("file_urls").array(),
  previewUrls: text("preview_urls").array(),
  fileNames: text("file_names").array(),
  fileSizes: text("file_sizes").array(),
  
  status: text("status").notNull().default("pending"),
  submittedBy: varchar("submitted_by").notNull(),
  submittedAt: text("submitted_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  
  reviewedBy: varchar("reviewed_by"),
  reviewedAt: text("reviewed_at"),
  reviewNotes: text("review_notes"),
  revisionRequested: boolean("revision_requested").notNull().default(false),
  
  acceptedAt: text("accepted_at"),
  rejectedAt: text("rejected_at"),
  rejectionReason: text("rejection_reason"),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const progressUpdates = pgTable("progress_updates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  builderId: varchar("builder_id").notNull(),
  
  title: text("title").notNull(),
  description: text("description").notNull(),
  progressPercentage: integer("progress_percentage").notNull().default(0),
  
  milestone: text("milestone"),
  nextSteps: text("next_steps"),
  blockers: text("blockers"),
  
  attachmentUrls: text("attachment_urls").array(),
  attachmentNames: text("attachment_names").array(),
  
  isVisible: boolean("is_visible").notNull().default(true),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const projectDocuments = pgTable("project_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  
  documentName: text("document_name").notNull(),
  documentType: text("document_type").notNull(),
  documentUrl: text("document_url").notNull(),
  fileSize: text("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  
  uploadedBy: varchar("uploaded_by").notNull(),
  uploaderType: text("uploader_type").notNull(),
  
  description: text("description"),
  category: text("category"),
  tags: text("tags").array(),
  
  isShared: boolean("is_shared").notNull().default(true),
  accessLevel: text("access_level").notNull().default("both"),
  
  version: integer("version").notNull().default(1),
  previousVersionId: varchar("previous_version_id"),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const builderFollows = pgTable("builder_follows", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull(),
  builderId: varchar("builder_id").notNull(),
  followedAt: text("followed_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const builderActivityFeed = pgTable("builder_activity_feed", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  builderId: varchar("builder_id").notNull(),
  activityType: text("activity_type").notNull(),
  activityData: text("activity_data"),
  metadata: text("metadata"),
  isPublic: boolean("is_public").notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const builderBadges = pgTable("builder_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  builderId: varchar("builder_id").notNull(),
  badgeType: text("badge_type").notNull(),
  badgeLabel: text("badge_label").notNull(),
  badgeIcon: text("badge_icon"),
  badgeColor: text("badge_color"),
  earnedAt: text("earned_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  expiresAt: text("expires_at"),
  isActive: boolean("is_active").notNull().default(true),
});

export const builderTestimonials = pgTable("builder_testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  builderId: varchar("builder_id").notNull(),
  clientId: varchar("client_id").notNull(),
  orderId: varchar("order_id"),
  content: text("content").notNull(),
  authorName: text("author_name").notNull(),
  authorTitle: text("author_title"),
  authorImage: text("author_image"),
  rating: decimal("rating", { precision: 3, scale: 2 }),
  isFeatured: boolean("is_featured").notNull().default(false),
  isApproved: boolean("is_approved").notNull().default(false),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const builderViews = pgTable("builder_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  builderId: varchar("builder_id").notNull(),
  viewerId: varchar("viewer_id"),
  viewerType: text("viewer_type"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  viewedAt: text("viewed_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const platformStatistics = pgTable("platform_statistics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metricName: text("metric_name").notNull(),
  metricValue: text("metric_value").notNull(),
  metricType: text("metric_type").notNull(),
  category: text("category"),
  period: text("period"),
  periodStart: text("period_start"),
  periodEnd: text("period_end"),
  calculatedAt: text("calculated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const builderApplicationRevisions = pgTable("builder_application_revisions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  applicationId: varchar("application_id").notNull(),
  revisionNumber: integer("revision_number").notNull(),
  changesRequested: text("changes_requested").notNull(),
  revisionNotes: text("revision_notes"),
  submittedData: text("submitted_data"),
  status: text("status").notNull().default("pending"),
  requestedBy: varchar("requested_by").notNull(),
  requestedAt: text("requested_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  resubmittedAt: text("resubmitted_at"),
  reviewedAt: text("reviewed_at"),
});

export const builderOnboarding = pgTable("builder_onboarding", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  builderId: varchar("builder_id").notNull(),
  applicationId: varchar("application_id").notNull(),
  
  stepProfileComplete: boolean("step_profile_complete").notNull().default(false),
  stepServicesAdded: boolean("step_services_added").notNull().default(false),
  stepPortfolioAdded: boolean("step_portfolio_added").notNull().default(false),
  stepPaymentSetup: boolean("step_payment_setup").notNull().default(false),
  stepVerificationComplete: boolean("step_verification_complete").notNull().default(false),
  
  completionPercentage: integer("completion_percentage").notNull().default(0),
  isComplete: boolean("is_complete").notNull().default(false),
  completedAt: text("completed_at"),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const builderTags = pgTable("builder_tags", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  builderId: varchar("builder_id").notNull(),
  tagLabel: text("tag_label").notNull(),
  tagColor: text("tag_color").notNull().default("gray"),
  tagType: text("tag_type").notNull().default("custom"),
  addedBy: varchar("added_by").notNull(),
  addedAt: text("added_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const builderAdminNotes = pgTable("builder_admin_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  builderId: varchar("builder_id").notNull(),
  note: text("note").notNull(),
  noteType: text("note_type").notNull().default("general"),
  priority: text("priority").notNull().default("normal"),
  createdBy: varchar("created_by").notNull(),
  createdByName: text("created_by_name").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
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

export const insertProjectDeliverableSchema = createInsertSchema(projectDeliverables).omit({
  id: true,
  status: true,
  createdAt: true,
  submittedAt: true,
  reviewedBy: true,
  reviewedAt: true,
  reviewNotes: true,
  revisionRequested: true,
  acceptedAt: true,
  rejectedAt: true,
  rejectionReason: true,
});

export const insertProgressUpdateSchema = createInsertSchema(progressUpdates).omit({
  id: true,
  createdAt: true,
});

export const insertProjectDocumentSchema = createInsertSchema(projectDocuments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
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

export type InsertReviewVote = z.infer<typeof insertReviewVoteSchema>;
export type ReviewVote = typeof reviewVotes.$inferSelect;

export type InsertReviewDispute = z.infer<typeof insertReviewDisputeSchema>;
export type ReviewDispute = typeof reviewDisputes.$inferSelect;

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

export type InsertProjectDeliverable = z.infer<typeof insertProjectDeliverableSchema>;
export type ProjectDeliverable = typeof projectDeliverables.$inferSelect;

export type InsertProgressUpdate = z.infer<typeof insertProgressUpdateSchema>;
export type ProgressUpdate = typeof progressUpdates.$inferSelect;

export type InsertProjectDocument = z.infer<typeof insertProjectDocumentSchema>;
export type ProjectDocument = typeof projectDocuments.$inferSelect;

export const insertBuilderFollowSchema = createInsertSchema(builderFollows).omit({
  id: true,
  followedAt: true,
});

export const insertBuilderActivitySchema = createInsertSchema(builderActivityFeed).omit({
  id: true,
  createdAt: true,
});

export const insertBuilderBadgeSchema = createInsertSchema(builderBadges).omit({
  id: true,
  earnedAt: true,
});

export const insertBuilderTestimonialSchema = createInsertSchema(builderTestimonials).omit({
  id: true,
  createdAt: true,
});

export const insertBuilderViewSchema = createInsertSchema(builderViews).omit({
  id: true,
  viewedAt: true,
});

export const insertPlatformStatisticSchema = createInsertSchema(platformStatistics).omit({
  id: true,
  calculatedAt: true,
});

export const insertBuilderApplicationRevisionSchema = createInsertSchema(builderApplicationRevisions).omit({
  id: true,
  requestedAt: true,
});

export const insertBuilderOnboardingSchema = createInsertSchema(builderOnboarding).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBuilderTagSchema = createInsertSchema(builderTags).omit({
  id: true,
  addedAt: true,
});

export const insertBuilderAdminNoteSchema = createInsertSchema(builderAdminNotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBuilderFollow = z.infer<typeof insertBuilderFollowSchema>;
export type BuilderFollow = typeof builderFollows.$inferSelect;

export type InsertBuilderActivity = z.infer<typeof insertBuilderActivitySchema>;
export type BuilderActivity = typeof builderActivityFeed.$inferSelect;

export type InsertBuilderBadge = z.infer<typeof insertBuilderBadgeSchema>;
export type BuilderBadge = typeof builderBadges.$inferSelect;

export type InsertBuilderTestimonial = z.infer<typeof insertBuilderTestimonialSchema>;
export type BuilderTestimonial = typeof builderTestimonials.$inferSelect;

export type InsertBuilderView = z.infer<typeof insertBuilderViewSchema>;
export type BuilderView = typeof builderViews.$inferSelect;

export type InsertPlatformStatistic = z.infer<typeof insertPlatformStatisticSchema>;
export type PlatformStatistic = typeof platformStatistics.$inferSelect;

export type InsertBuilderApplicationRevision = z.infer<typeof insertBuilderApplicationRevisionSchema>;
export type BuilderApplicationRevision = typeof builderApplicationRevisions.$inferSelect;

export type InsertBuilderOnboarding = z.infer<typeof insertBuilderOnboardingSchema>;
export type BuilderOnboarding = typeof builderOnboarding.$inferSelect;

export type InsertBuilderTag = z.infer<typeof insertBuilderTagSchema>;
export type BuilderTag = typeof builderTags.$inferSelect;

export type InsertBuilderAdminNote = z.infer<typeof insertBuilderAdminNoteSchema>;
export type BuilderAdminNote = typeof builderAdminNotes.$inferSelect;

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  recipientId: varchar("recipient_id").notNull(),
  recipientType: text("recipient_type").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  actionUrl: text("action_url"),
  relatedEntityId: varchar("related_entity_id"),
  relatedEntityType: text("related_entity_type"),
  isRead: boolean("is_read").notNull().default(false),
  readAt: text("read_at"),
  emailSent: boolean("email_sent").notNull().default(false),
  pushSent: boolean("push_sent").notNull().default(false),
  metadata: text("metadata"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const notificationPreferences = pgTable("notification_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  userType: text("user_type").notNull(),
  emailOrderUpdates: boolean("email_order_updates").notNull().default(true),
  emailMessages: boolean("email_messages").notNull().default(true),
  emailReviews: boolean("email_reviews").notNull().default(true),
  emailPayments: boolean("email_payments").notNull().default(true),
  emailMarketing: boolean("email_marketing").notNull().default(false),
  emailDigestFrequency: text("email_digest_frequency").notNull().default("weekly"),
  lastDigestSentAt: text("last_digest_sent_at"),
  pushOrderUpdates: boolean("push_order_updates").notNull().default(true),
  pushMessages: boolean("push_messages").notNull().default(true),
  pushReviews: boolean("push_reviews").notNull().default(true),
  pushPayments: boolean("push_payments").notNull().default(true),
  browserNotifications: boolean("browser_notifications").notNull().default(true),
  inAppOrderUpdates: boolean("in_app_order_updates").notNull().default(true),
  inAppMessages: boolean("in_app_messages").notNull().default(true),
  inAppReviews: boolean("in_app_reviews").notNull().default(true),
  inAppPayments: boolean("in_app_payments").notNull().default(true),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const pushSubscriptions = pgTable("push_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  userType: text("user_type").notNull(),
  endpoint: text("endpoint").notNull().unique(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  userAgent: text("user_agent"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationPreferencesSchema = createInsertSchema(notificationPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPushSubscriptionSchema = createInsertSchema(pushSubscriptions).omit({
  id: true,
  createdAt: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export type InsertNotificationPreferences = z.infer<typeof insertNotificationPreferencesSchema>;
export type NotificationPreferences = typeof notificationPreferences.$inferSelect;

export type InsertPushSubscription = z.infer<typeof insertPushSubscriptionSchema>;
export type PushSubscription = typeof pushSubscriptions.$inferSelect;

export const builderInviteTokens = pgTable("builder_invite_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  token: varchar("token", { length: 64 }).notNull().unique(),
  createdBy: varchar("created_by").notNull(),
  createdByName: text("created_by_name").notNull(),
  email: text("email"),
  notes: text("notes"),
  used: boolean("used").notNull().default(false),
  usedBy: varchar("used_by"),
  usedByName: text("used_by_name"),
  usedAt: text("used_at"),
  expiresAt: text("expires_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertBuilderInviteTokenSchema = createInsertSchema(builderInviteTokens).omit({
  id: true,
  createdAt: true,
});

export type InsertBuilderInviteToken = z.infer<typeof insertBuilderInviteTokenSchema>;
export type BuilderInviteToken = typeof builderInviteTokens.$inferSelect;

export const partners = pgTable("partners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  logo: text("logo"),
  description: text("description").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  website: text("website"),
  services: text("services").array(),
  pricing: text("pricing"),
  connectionFee: decimal("connection_fee", { precision: 10, scale: 2 }),
  estimatedValue: text("estimated_value"),
  tierLevel: text("tier_level"),
  featured: boolean("featured").notNull().default(false),
  active: boolean("active").notNull().default(true),
  contactEmail: text("contact_email"),
  contactPerson: text("contact_person"),
  responseTime: text("response_time"),
  successfulConnections: integer("successful_connections").notNull().default(0),
  avgRating: decimal("avg_rating", { precision: 3, scale: 2 }).default("0"),
  tags: text("tags").array(),
  requirements: text("requirements").array(),
  benefits: text("benefits").array(),
  caseStudies: text("case_studies").array(),
  locations: text("locations").array(),
  languages: text("languages").array(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const partnerConnectionRequests = pgTable("partner_connection_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  partnerId: varchar("partner_id").notNull().references(() => partners.id),
  userId: varchar("user_id").notNull(),
  userType: text("user_type").notNull(),
  userName: text("user_name").notNull(),
  userEmail: text("user_email").notNull(),
  userWallet: text("user_wallet"),
  projectName: text("project_name"),
  projectDescription: text("project_description").notNull(),
  budget: text("budget"),
  timeline: text("timeline"),
  specificNeeds: text("specific_needs"),
  status: text("status").notNull().default("pending"),
  adminNotes: text("admin_notes"),
  connectionMadeAt: text("connection_made_at"),
  rating: integer("rating"),
  feedback: text("feedback"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertPartnerSchema = createInsertSchema(partners).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPartnerConnectionRequestSchema = createInsertSchema(partnerConnectionRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPartner = z.infer<typeof insertPartnerSchema>;
export type Partner = typeof partners.$inferSelect;

export type InsertPartnerConnectionRequest = z.infer<typeof insertPartnerConnectionRequestSchema>;
export type PartnerConnectionRequest = typeof partnerConnectionRequests.$inferSelect;

export const serviceAnalytics = pgTable("service_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceId: varchar("service_id").notNull(),
  builderId: varchar("builder_id").notNull(),
  
  viewCount: integer("view_count").notNull().default(0),
  inquiryCount: integer("inquiry_count").notNull().default(0),
  conversionCount: integer("conversion_count").notNull().default(0),
  
  averagePrice: decimal("average_price", { precision: 10, scale: 2 }),
  totalRevenue: decimal("total_revenue", { precision: 10, scale: 2 }).default("0"),
  
  date: text("date").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const builderLeads = pgTable("builder_leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  builderId: varchar("builder_id").notNull(),
  clientId: varchar("client_id"),
  
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email"),
  clientWallet: text("client_wallet"),
  
  serviceId: varchar("service_id"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  budget: text("budget"),
  
  status: text("status").notNull().default("new"),
  priority: text("priority").notNull().default("normal"),
  
  leadSource: text("lead_source"),
  
  firstResponseAt: text("first_response_at"),
  convertedAt: text("converted_at"),
  convertedToOrderId: varchar("converted_to_order_id"),
  
  lostReason: text("lost_reason"),
  lostNotes: text("lost_notes"),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const messageTemplates = pgTable("message_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  builderId: varchar("builder_id").notNull(),
  
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  
  useCount: integer("use_count").notNull().default(0),
  
  isActive: boolean("is_active").notNull().default(true),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const clientNotes = pgTable("client_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  builderId: varchar("builder_id").notNull(),
  clientId: varchar("client_id").notNull(),
  
  note: text("note").notNull(),
  noteType: text("note_type").notNull().default("general"),
  
  tags: text("tags").array(),
  
  isPrivate: boolean("is_private").notNull().default(true),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const builderGoals = pgTable("builder_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  builderId: varchar("builder_id").notNull(),
  
  goalType: text("goal_type").notNull(),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  
  period: text("period").notNull(),
  periodStart: text("period_start").notNull(),
  periodEnd: text("period_end").notNull(),
  
  status: text("status").notNull().default("active"),
  
  achievedAt: text("achieved_at"),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const reviewAutomation = pgTable("review_automation", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  builderId: varchar("builder_id").notNull(),
  clientId: varchar("client_id").notNull(),
  
  requestSentAt: text("request_sent_at"),
  reminderSentAt: text("reminder_sent_at"),
  
  reviewSubmittedAt: text("review_submitted_at"),
  reviewId: varchar("review_id"),
  
  status: text("status").notNull().default("pending"),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const pricingIntelligence = pgTable("pricing_intelligence", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  serviceType: text("service_type").notNull(),
  
  averageBasicPrice: decimal("average_basic_price", { precision: 10, scale: 2 }),
  averageStandardPrice: decimal("average_standard_price", { precision: 10, scale: 2 }),
  averagePremiumPrice: decimal("average_premium_price", { precision: 10, scale: 2 }),
  
  minPrice: decimal("min_price", { precision: 10, scale: 2 }),
  maxPrice: decimal("max_price", { precision: 10, scale: 2 }),
  
  sampleSize: integer("sample_size").notNull(),
  
  date: text("date").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const builderProfileScores = pgTable("builder_profile_scores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  builderId: varchar("builder_id").notNull().unique(),
  
  overallScore: integer("overall_score").notNull().default(0),
  
  profileCompletion: integer("profile_completion").notNull().default(0),
  serviceQuality: integer("service_quality").notNull().default(0),
  portfolioStrength: integer("portfolio_strength").notNull().default(0),
  credibilityScore: integer("credibility_score").notNull().default(0),
  
  recommendations: text("recommendations").array(),
  
  lastCalculatedAt: text("last_calculated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const insertServiceAnalyticsSchema = createInsertSchema(serviceAnalytics).omit({
  id: true,
  createdAt: true,
});

export const insertBuilderLeadSchema = createInsertSchema(builderLeads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageTemplateSchema = createInsertSchema(messageTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertClientNoteSchema = createInsertSchema(clientNotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBuilderGoalSchema = createInsertSchema(builderGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertReviewAutomationSchema = createInsertSchema(reviewAutomation).omit({
  id: true,
  createdAt: true,
});

export const insertPricingIntelligenceSchema = createInsertSchema(pricingIntelligence).omit({
  id: true,
  createdAt: true,
});

export const insertBuilderProfileScoreSchema = createInsertSchema(builderProfileScores).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertServiceAnalytics = z.infer<typeof insertServiceAnalyticsSchema>;
export type ServiceAnalytics = typeof serviceAnalytics.$inferSelect;

export type InsertBuilderLead = z.infer<typeof insertBuilderLeadSchema>;
export type BuilderLead = typeof builderLeads.$inferSelect;

export type InsertMessageTemplate = z.infer<typeof insertMessageTemplateSchema>;
export type MessageTemplate = typeof messageTemplates.$inferSelect;

export type InsertClientNote = z.infer<typeof insertClientNoteSchema>;
export type ClientNote = typeof clientNotes.$inferSelect;

export type InsertBuilderGoal = z.infer<typeof insertBuilderGoalSchema>;
export type BuilderGoal = typeof builderGoals.$inferSelect;

export type InsertReviewAutomation = z.infer<typeof insertReviewAutomationSchema>;
export type ReviewAutomation = typeof reviewAutomation.$inferSelect;

export type InsertPricingIntelligence = z.infer<typeof insertPricingIntelligenceSchema>;
export type PricingIntelligence = typeof pricingIntelligence.$inferSelect;

export type InsertBuilderProfileScore = z.infer<typeof insertBuilderProfileScoreSchema>;
export type BuilderProfileScore = typeof builderProfileScores.$inferSelect;

export const escrowDisputes = pgTable("escrow_disputes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  
  initiatedBy: varchar("initiated_by").notNull(),
  initiatorType: text("initiator_type").notNull(),
  
  reason: text("reason").notNull(),
  description: text("description").notNull(),
  evidence: text("evidence").array(),
  evidenceUrls: text("evidence_urls").array(),
  
  status: text("status").notNull().default("open"),
  outcome: text("outcome"),
  
  clientPercentage: integer("client_percentage"),
  builderPercentage: integer("builder_percentage"),
  
  resolvedBy: varchar("resolved_by"),
  resolvedAt: text("resolved_at"),
  resolutionNotes: text("resolution_notes"),
  
  escrowTxHash: text("escrow_tx_hash"),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const escrowTransactions = pgTable("escrow_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  orderId: varchar("order_id").notNull(),
  
  transactionType: text("transaction_type").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  
  fromAddress: text("from_address"),
  toAddress: text("to_address"),
  
  txHash: text("tx_hash").notNull(),
  blockNumber: integer("block_number"),
  gasUsed: text("gas_used"),
  
  status: text("status").notNull().default("pending"),
  errorMessage: text("error_message"),
  
  metadata: text("metadata"),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  confirmedAt: text("confirmed_at"),
});

export const insertEscrowDisputeSchema = createInsertSchema(escrowDisputes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  resolvedBy: true,
  resolvedAt: true,
});

export const insertEscrowTransactionSchema = createInsertSchema(escrowTransactions).omit({
  id: true,
  createdAt: true,
  confirmedAt: true,
  status: true,
});

export type InsertEscrowDispute = z.infer<typeof insertEscrowDisputeSchema>;
export type EscrowDispute = typeof escrowDisputes.$inferSelect;

export type InsertEscrowTransaction = z.infer<typeof insertEscrowTransactionSchema>;
export type EscrowTransaction = typeof escrowTransactions.$inferSelect;

// Real-Time Features

export const userOnlineStatus = pgTable("user_online_status", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  userType: text("user_type").notNull(), // 'builder' | 'client' | 'admin'
  status: text("status").notNull().default("offline"), // 'online' | 'offline' | 'away' | 'busy'
  lastSeen: text("last_seen").notNull().default(sql`CURRENT_TIMESTAMP`),
  currentActivity: text("current_activity"), // 'browsing' | 'messaging' | 'idle'
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const typingIndicators = pgTable("typing_indicators", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  threadId: varchar("thread_id").notNull(),
  userId: varchar("user_id").notNull(),
  userType: text("user_type").notNull(), // 'builder' | 'client'
  isTyping: boolean("is_typing").notNull().default(false),
  startedAt: text("started_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Advanced Search & Filtering Features

export const savedSearches = pgTable("saved_searches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  userType: text("user_type").notNull(),
  name: text("name").notNull(),
  searchType: text("search_type").notNull(), // 'builder' | 'service'
  filters: text("filters").notNull(), // JSON string of filter parameters
  sortBy: text("sort_by"),
  isDefault: boolean("is_default").notNull().default(false),
  usageCount: integer("usage_count").notNull().default(0),
  lastUsedAt: text("last_used_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const builderFavorites = pgTable("builder_favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  builderId: varchar("builder_id").notNull(),
  collectionName: text("collection_name"), // Optional custom collection
  notes: text("notes"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const searchHistory = pgTable("search_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  userType: text("user_type").notNull(),
  searchQuery: text("search_query").notNull(),
  searchType: text("search_type").notNull(), // 'builder' | 'service'
  filters: text("filters"), // JSON string of applied filters
  resultsCount: integer("results_count"),
  clickedResultId: varchar("clicked_result_id"),
  searchedAt: text("searched_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  userType: text("user_type").notNull(),
  
  // Locale & Timezone
  timezone: text("timezone").default("UTC"),
  language: text("language").default("en"),
  dateFormat: text("date_format").default("MM/DD/YYYY"),
  timeFormat: text("time_format").default("12h"), // '12h' | '24h'
  
  // Communication Preferences
  preferredLanguages: text("preferred_languages").array(),
  availableForCalls: boolean("available_for_calls").notNull().default(true),
  
  // Notification Settings (browser notifications)
  browserNotificationsEnabled: boolean("browser_notifications_enabled").notNull().default(false),
  soundEnabled: boolean("sound_enabled").notNull().default(true),
  desktopNotifications: boolean("desktop_notifications").notNull().default(false),
  
  // Search Preferences
  defaultSearchSort: text("default_search_sort").default("relevance"),
  showAvailableOnly: boolean("show_available_only").notNull().default(false),
  
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const filterPresets = pgTable("filter_presets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id"),
  name: text("name").notNull(),
  description: text("description"),
  filters: text("filters").notNull(), // JSON string
  isGlobal: boolean("is_global").notNull().default(false), // System presets
  icon: text("icon"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Social Proof & Activity Tracking Tables
export const platformActivity = pgTable("platform_activity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // "booking", "review", "signup", "milestone", "completion"
  builderName: text("builder_name"),
  builderImage: text("builder_image"),
  clientName: text("client_name"),
  serviceName: text("service_name"),
  category: text("category"),
  amount: text("amount"),
  rating: integer("rating"),
  visibility: text("visibility").notNull().default("public"), // "public" or "private"
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const serviceViews = pgTable("service_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceId: varchar("service_id").notNull(),
  builderId: varchar("builder_id"), // Nullable - may not always have builder context
  viewerId: varchar("viewer_id"), // null if anonymous
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

// Insert Schemas

export const insertUserOnlineStatusSchema = createInsertSchema(userOnlineStatus).omit({
  id: true,
  updatedAt: true,
});

export const insertTypingIndicatorSchema = createInsertSchema(typingIndicators).omit({
  id: true,
  startedAt: true,
  updatedAt: true,
});

export const insertSavedSearchSchema = createInsertSchema(savedSearches).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBuilderFavoriteSchema = createInsertSchema(builderFavorites).omit({
  id: true,
  createdAt: true,
});

export const insertSearchHistorySchema = createInsertSchema(searchHistory).omit({
  id: true,
  searchedAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFilterPresetSchema = createInsertSchema(filterPresets).omit({
  id: true,
  createdAt: true,
});

export const insertServiceAddonSchema = createInsertSchema(serviceAddons).omit({
  id: true,
  createdAt: true,
});

export const insertServiceRequirementSchema = createInsertSchema(serviceRequirements).omit({
  id: true,
  createdAt: true,
});

export const insertOrderRequirementSchema = createInsertSchema(orderRequirements).omit({
  id: true,
  createdAt: true,
});

export const insertBuyerRequestSchema = createInsertSchema(buyerRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBuilderProposalSchema = createInsertSchema(builderProposals).omit({
  id: true,
  createdAt: true,
});

export const insertPlatformActivitySchema = createInsertSchema(platformActivity).omit({
  id: true,
  createdAt: true,
});

export const insertServiceViewSchema = createInsertSchema(serviceViews).omit({
  id: true,
  createdAt: true,
});

// Types

export type InsertServiceAddon = z.infer<typeof insertServiceAddonSchema>;
export type ServiceAddon = typeof serviceAddons.$inferSelect;

export type InsertServiceRequirement = z.infer<typeof insertServiceRequirementSchema>;
export type ServiceRequirement = typeof serviceRequirements.$inferSelect;

export type InsertOrderRequirement = z.infer<typeof insertOrderRequirementSchema>;
export type OrderRequirement = typeof orderRequirements.$inferSelect;

export type InsertBuyerRequest = z.infer<typeof insertBuyerRequestSchema>;
export type BuyerRequest = typeof buyerRequests.$inferSelect;

export type InsertBuilderProposal = z.infer<typeof insertBuilderProposalSchema>;
export type BuilderProposal = typeof builderProposals.$inferSelect;

export type InsertUserOnlineStatus = z.infer<typeof insertUserOnlineStatusSchema>;
export type UserOnlineStatus = typeof userOnlineStatus.$inferSelect;

export type InsertTypingIndicator = z.infer<typeof insertTypingIndicatorSchema>;
export type TypingIndicator = typeof typingIndicators.$inferSelect;

export type InsertSavedSearch = z.infer<typeof insertSavedSearchSchema>;
export type SavedSearch = typeof savedSearches.$inferSelect;

export type InsertBuilderFavorite = z.infer<typeof insertBuilderFavoriteSchema>;
export type BuilderFavorite = typeof builderFavorites.$inferSelect;

export type InsertSearchHistory = z.infer<typeof insertSearchHistorySchema>;
export type SearchHistory = typeof searchHistory.$inferSelect;

export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;

export type InsertFilterPreset = z.infer<typeof insertFilterPresetSchema>;
export type FilterPreset = typeof filterPresets.$inferSelect;

export type InsertPlatformActivity = z.infer<typeof insertPlatformActivitySchema>;
export type PlatformActivity = typeof platformActivity.$inferSelect;

export type InsertServiceView = z.infer<typeof insertServiceViewSchema>;
export type ServiceView = typeof serviceViews.$inferSelect;
