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
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull(),
  builderId: varchar("builder_id").notNull(),
  serviceId: varchar("service_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  budget: decimal("budget", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  startedAt: text("started_at"),
  completedAt: text("completed_at"),
  contractTerms: text("contract_terms"),
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

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  status: true,
  createdAt: true,
  startedAt: true,
  completedAt: true,
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

export type InsertBuilder = z.infer<typeof insertBuilderSchema>;
export type Builder = typeof builders.$inferSelect;

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

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export type InsertMilestone = z.infer<typeof insertMilestoneSchema>;
export type Milestone = typeof milestones.$inferSelect;

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referrals.$inferSelect;
