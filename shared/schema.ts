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

export type InsertBuilder = z.infer<typeof insertBuilderSchema>;
export type Builder = typeof builders.$inferSelect;

export type InsertService = z.infer<typeof insertServiceSchema>;
export type Service = typeof services.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
