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
} from "@shared/schema";
import { randomUUID } from "crypto";
import * as bcrypt from "bcryptjs";

export interface IStorage {
  getBuilder(id: string): Promise<Builder | undefined>;
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
}

export class MemStorage implements IStorage {
  private builders: Map<string, Builder>;
  private builderProjects: Map<string, BuilderProject>;
  private services: Map<string, Service>;
  private categories: Map<string, Category>;
  private reviews: Map<string, Review>;
  private reviewVotes: Map<string, ReviewVote>;
  private reviewDisputes: Map<string, ReviewDispute>;
  private builderApplications: Map<string, BuilderApplication>;
  private clients: Map<string, Client>;
  private orders: Map<string, Order>;
  private orderRevisions: Map<string, OrderRevision>;
  private orderActivities: Map<string, OrderActivity>;
  private milestones: Map<string, Milestone>;
  private admins: Map<string, Admin>;
  private referrals: Map<string, Referral>;
  private payments: Map<string, Payment>;
  private milestonePayments: Map<string, MilestonePayment>;
  private payouts: Map<string, Payout>;
  private disputes: Map<string, Dispute>;
  private refunds: Map<string, Refund>;
  private invoices: Map<string, Invoice>;
  private chatThreads: Map<string, ChatThread>;
  private messages: Map<string, Message>;
  private messageAttachments: Map<string, MessageAttachment>;
  private messageReadReceipts: Map<string, MessageReadReceipt>;
  private projectDeliverables: Map<string, ProjectDeliverable>;
  private progressUpdates: Map<string, ProgressUpdate>;
  private projectDocuments: Map<string, ProjectDocument>;
  private builderFollows: Map<string, any>;
  private builderActivityFeed: Map<string, any>;
  private builderBadges: Map<string, any>;
  private builderTestimonials: Map<string, any>;
  private builderViews: Map<string, any>;
  private platformStatistics: Map<string, any>;
  private builderApplicationRevisions: Map<string, any>;
  private builderOnboarding: Map<string, any>;

  constructor() {
    this.builders = new Map();
    this.builderProjects = new Map();
    this.services = new Map();
    this.categories = new Map();
    this.reviews = new Map();
    this.reviewVotes = new Map();
    this.reviewDisputes = new Map();
    this.builderApplications = new Map();
    this.clients = new Map();
    this.orders = new Map();
    this.orderRevisions = new Map();
    this.orderActivities = new Map();
    this.milestones = new Map();
    this.admins = new Map();
    this.referrals = new Map();
    this.payments = new Map();
    this.milestonePayments = new Map();
    this.payouts = new Map();
    this.disputes = new Map();
    this.refunds = new Map();
    this.invoices = new Map();
    this.chatThreads = new Map();
    this.messages = new Map();
    this.messageAttachments = new Map();
    this.messageReadReceipts = new Map();
    this.projectDeliverables = new Map();
    this.progressUpdates = new Map();
    this.projectDocuments = new Map();
    this.builderFollows = new Map();
    this.builderActivityFeed = new Map();
    this.builderBadges = new Map();
    this.builderTestimonials = new Map();
    this.builderViews = new Map();
    this.platformStatistics = new Map();
    this.builderApplicationRevisions = new Map();
    this.builderOnboarding = new Map();
    this.seedData();
  }

  private seedData() {
    const categories: Category[] = [
      {
        id: randomUUID(),
        name: "KOLs & Influencers",
        slug: "kols",
        description: "Crypto influencers and key opinion leaders with proven reach and engagement",
        icon: "megaphone",
        builderCount: 45,
      },
      {
        id: randomUUID(),
        name: "3D Content Creators",
        slug: "3d-content",
        description: "Professional 3D artists creating stunning visuals for your project",
        icon: "box",
        builderCount: 28,
      },
      {
        id: randomUUID(),
        name: "Marketing & Growth",
        slug: "marketing",
        description: "Expert marketers driving growth for crypto and memecoin projects",
        icon: "trending-up",
        builderCount: 67,
      },
      {
        id: randomUUID(),
        name: "Script Development",
        slug: "development",
        description: "Smart contract and token development experts",
        icon: "code",
        builderCount: 34,
      },
      {
        id: randomUUID(),
        name: "Volume Services",
        slug: "volume",
        description: "Liquidity and volume generation for your token",
        icon: "bar-chart-3",
        builderCount: 22,
      },
    ];

    categories.forEach((cat) => this.categories.set(cat.slug, cat));

    const builders: Builder[] = [
      {
        id: "1",
        walletAddress: "0x0000000000000000000000000000000000000001",
        name: "Test Builder",
        headline: "Full-Stack Web3 Developer & KOL",
        bio: "Experienced builder specializing in smart contracts, DeFi, and community growth. This is a test builder account for dashboard testing.",
        profileImage: null,
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
        portfolioMedia: null,
        videoShowreel: null,
        instagramHandle: null,
        instagramFollowers: null,
        youtubeChannel: null,
        youtubeSubscribers: null,
        telegramHandle: null,
        telegramMembers: null,
        engagementRate: null,
        audienceDemographics: null,
        contentNiches: null,
        brandPartnerships: null,
        software3D: null,
        renderEngines: null,
        styleSpecialties: null,
        animationExpertise: null,
        marketingPlatforms: null,
        growthStrategies: null,
        caseStudies: null,
        avgROI: null,
        clientIndustries: null,
        programmingLanguages: ["Solidity", "TypeScript", "JavaScript"],
        blockchainFrameworks: ["Hardhat", "Foundry", "Ethers.js"],
        githubProfile: "https://github.com/testbuilder",
        deployedContracts: ["0x1234...5678"],
        auditReports: null,
        certifications: null,
        tradingExperience: null,
        volumeCapabilities: null,
        dexExpertise: null,
        cexExpertise: null,
        complianceKnowledge: null,
        volumeProof: null,
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
        createdAt: "2024-01-01T00:00:00Z",
        updatedAt: new Date().toISOString(),
      },
      {
        id: randomUUID(),
        walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f9a3f1",
        name: "Alex Chen",
        headline: "Top Crypto KOL | 500K+ Followers",
        bio: "Experienced crypto influencer with a proven track record of launching successful memecoin campaigns. My network reaches over 500K engaged crypto enthusiasts across Twitter, YouTube, and Telegram. Specialized in viral marketing and community building.",
        profileImage: null,
        verified: true,
        category: "KOLs & Influencers",
        rating: "4.95",
        reviewCount: 124,
        completedProjects: 87,
        responseTime: "2 hours",
        twitterHandle: "alexcryptoKOL",
        twitterFollowers: 523000,
        portfolioLinks: ["https://twitter.com/alexcryptoKOL"],
        skills: ["Community Building", "Twitter Marketing", "Campaign Strategy", "Meme Creation"],
        psxTier: "platinum",
      },
      {
        id: randomUUID(),
        walletAddress: "0x8e1f2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
        name: "Maya Rodriguez",
        headline: "3D Artist & Motion Designer",
        bio: "Award-winning 3D artist specializing in crypto and NFT art. I create eye-catching 3D animations, token logos, and promotional content that stands out in the crowded crypto space. Featured in multiple top-tier NFT projects.",
        profileImage: null,
        verified: true,
        category: "3D Content Creators",
        rating: "5.00",
        reviewCount: 89,
        completedProjects: 156,
        responseTime: "4 hours",
        twitterHandle: "maya3Dart",
        twitterFollowers: 89000,
        portfolioLinks: ["https://artstation.com/maya", "https://twitter.com/maya3Dart"],
        skills: ["3D Modeling", "Animation", "Motion Graphics", "Blender", "Cinema 4D"],
        psxTier: "gold",
      },
      {
        id: randomUUID(),
        walletAddress: "0x9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a",
        name: "Marcus Johnson",
        headline: "Growth Hacker | Marketing Strategist",
        bio: "Results-driven marketing expert with 5+ years in crypto. I've helped launch 30+ successful token projects with comprehensive marketing strategies including social media, PR, partnerships, and community management.",
        profileImage: null,
        verified: true,
        category: "Marketing & Growth",
        rating: "4.88",
        reviewCount: 203,
        completedProjects: 247,
        responseTime: "3 hours",
        twitterHandle: "marcusgrowth",
        twitterFollowers: 145000,
        portfolioLinks: ["https://marcusgrowth.com"],
        skills: ["Growth Strategy", "Social Media", "PR & Outreach", "Analytics", "Community"],
        psxTier: "platinum",
      },
      {
        id: randomUUID(),
        walletAddress: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
        name: "Sarah Kim",
        headline: "Solidity Developer | Smart Contract Auditor",
        bio: "Senior blockchain developer with expertise in Solidity and smart contract development. Specialized in token contracts, staking mechanisms, and DeFi protocols. All my contracts are audited and battle-tested.",
        profileImage: null,
        verified: true,
        category: "Script Development",
        rating: "4.92",
        reviewCount: 67,
        completedProjects: 94,
        responseTime: "6 hours",
        twitterHandle: "sarahcodes",
        twitterFollowers: 34000,
        portfolioLinks: ["https://github.com/sarahkim", "https://twitter.com/sarahcodes"],
        skills: ["Solidity", "Smart Contracts", "Security Audits", "DeFi", "Token Development"],
        psxTier: "gold",
      },
      {
        id: randomUUID(),
        walletAddress: "0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1",
        name: "David Park",
        headline: "Volume & Liquidity Specialist",
        bio: "Professional market maker providing liquidity and volume services for new token launches. I ensure healthy trading activity and price stability during critical launch phases.",
        profileImage: null,
        verified: false,
        category: "Volume Services",
        rating: "4.75",
        reviewCount: 45,
        completedProjects: 78,
        responseTime: "12 hours",
        twitterHandle: null,
        twitterFollowers: null,
        portfolioLinks: [],
        skills: ["Market Making", "Liquidity Provision", "Trading Bots", "Price Stability"],
        psxTier: "silver",
      },
      {
        id: randomUUID(),
        walletAddress: "0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2",
        name: "Emma Watson",
        headline: "Crypto Influencer | Community Manager",
        bio: "Dedicated community manager and crypto influencer. I build and nurture engaged communities that drive long-term success. Experience with Telegram, Discord, and Twitter management.",
        profileImage: null,
        verified: true,
        category: "KOLs & Influencers",
        rating: "4.90",
        reviewCount: 156,
        completedProjects: 189,
        responseTime: "1 hour",
        twitterHandle: "emmacrypto",
        twitterFollowers: 287000,
        portfolioLinks: ["https://twitter.com/emmacrypto"],
        skills: ["Community Management", "Discord", "Telegram", "Engagement", "Moderation"],
        psxTier: "gold",
      },
      {
        id: randomUUID(),
        walletAddress: "0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3",
        name: "Arnold",
        headline: "Elite KOL | Memecoin Specialist",
        bio: "Veteran crypto influencer with deep roots in the memecoin community. Known for calling early gems and building massive hype around new launches. My audience is primed and ready to ape into quality projects.",
        profileImage: null,
        verified: true,
        category: "KOLs & Influencers",
        rating: "4.97",
        reviewCount: 215,
        completedProjects: 178,
        responseTime: "1 hour",
        twitterHandle: "arnoldcalls",
        twitterFollowers: 645000,
        portfolioLinks: ["https://twitter.com/arnoldcalls"],
        skills: ["Memecoin Marketing", "Twitter Influence", "Hype Generation", "Community Building"],
        psxTier: "platinum",
      },
      {
        id: randomUUID(),
        walletAddress: "0xe5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4",
        name: "Blitz",
        headline: "Speed Trader | Volume Expert",
        bio: "High-frequency trader and market maker specializing in rapid volume generation. I provide instant liquidity and trading activity to ensure your token launch has the momentum it needs from day one.",
        profileImage: null,
        verified: true,
        category: "Volume Services",
        rating: "4.85",
        reviewCount: 98,
        completedProjects: 134,
        responseTime: "30 minutes",
        twitterHandle: "blitztrader",
        twitterFollowers: 42000,
        portfolioLinks: [],
        skills: ["HFT", "Market Making", "Volume Generation", "Liquidity Provision", "Trading Algorithms"],
        psxTier: "gold",
      },
      {
        id: randomUUID(),
        walletAddress: "0xf6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5",
        name: "Ryan",
        headline: "Full-Stack Web3 Developer",
        bio: "Experienced full-stack developer building end-to-end Web3 solutions. From smart contracts to beautiful frontends, I deliver complete dApp experiences. Specialized in token launches and DeFi protocols.",
        profileImage: null,
        verified: true,
        category: "Script Development",
        rating: "4.93",
        reviewCount: 112,
        completedProjects: 145,
        responseTime: "5 hours",
        twitterHandle: "ryanbuilds",
        twitterFollowers: 28000,
        portfolioLinks: ["https://github.com/ryanweb3", "https://ryanbuilds.dev"],
        skills: ["React", "Solidity", "Smart Contracts", "Web3.js", "Full-Stack Development"],
        psxTier: "gold",
      },
      {
        id: randomUUID(),
        walletAddress: "0xa7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6",
        name: "Stuff",
        headline: "Creative 3D Artist | NFT Designer",
        bio: "Pushing the boundaries of 3D art in crypto. I create unique, memorable 3D characters and environments for NFT projects and token branding. My work has been featured in multiple blue-chip collections.",
        profileImage: null,
        verified: true,
        category: "3D Content Creators",
        rating: "4.98",
        reviewCount: 167,
        completedProjects: 203,
        responseTime: "3 hours",
        twitterHandle: "stuff3dart",
        twitterFollowers: 156000,
        portfolioLinks: ["https://artstation.com/stuff", "https://twitter.com/stuff3dart"],
        skills: ["3D Character Design", "NFT Art", "Blender", "ZBrush", "Concept Art"],
        psxTier: "platinum",
      },
      {
        id: randomUUID(),
        walletAddress: "0xb8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7",
        name: "Duhhh",
        headline: "Viral Marketing Genius | Meme Lord",
        bio: "If it's not going viral, you're doing it wrong. I craft marketing campaigns that spread like wildfire across crypto Twitter. Memes, narratives, and culture - that's my specialty. Your project will trend.",
        profileImage: null,
        verified: true,
        category: "Marketing & Growth",
        rating: "4.91",
        reviewCount: 189,
        completedProjects: 256,
        responseTime: "2 hours",
        twitterHandle: "duhhhmarketing",
        twitterFollowers: 312000,
        portfolioLinks: ["https://twitter.com/duhhhmarketing"],
        skills: ["Viral Marketing", "Meme Strategy", "Trend Jacking", "Content Creation", "Twitter Growth"],
        psxTier: "platinum",
      },
      {
        id: randomUUID(),
        walletAddress: "0xc9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8",
        name: "Jay",
        headline: "Smart Contract Auditor | Security Expert",
        bio: "Blockchain security specialist focused on smart contract auditing and penetration testing. I ensure your contracts are bulletproof before launch. Certified auditor with zero exploits on reviewed contracts.",
        profileImage: null,
        verified: true,
        category: "Script Development",
        rating: "5.00",
        reviewCount: 78,
        completedProjects: 91,
        responseTime: "8 hours",
        twitterHandle: "jaysecurity",
        twitterFollowers: 19000,
        portfolioLinks: ["https://github.com/jaysec", "https://jaycrypto.security"],
        skills: ["Smart Contract Auditing", "Security Testing", "Solidity", "Penetration Testing", "Code Review"],
        psxTier: "platinum",
      },
      {
        id: randomUUID(),
        walletAddress: "0xd0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9",
        name: "Peanut",
        headline: "Telegram Growth Specialist",
        bio: "Building massive, engaged Telegram communities is my superpower. I've grown channels from 0 to 50K+ real members. Community is everything in crypto, and I make sure yours is vibrant and active.",
        profileImage: null,
        verified: true,
        category: "Marketing & Growth",
        rating: "4.87",
        reviewCount: 143,
        completedProjects: 167,
        responseTime: "4 hours",
        twitterHandle: "peanutgrowth",
        twitterFollowers: 67000,
        portfolioLinks: ["https://t.me/peanutcrypto"],
        skills: ["Telegram Growth", "Community Building", "Bot Setup", "Engagement", "Member Retention"],
        psxTier: "gold",
      },
      {
        id: randomUUID(),
        walletAddress: "0xe1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
        name: "Spike",
        headline: "Motion Graphics Wizard | Video Editor",
        bio: "Creating stunning motion graphics and promotional videos for crypto projects. From explainer videos to hype trailers, I make content that captures attention and drives conversions.",
        profileImage: null,
        verified: true,
        category: "3D Content Creators",
        rating: "4.94",
        reviewCount: 121,
        completedProjects: 186,
        responseTime: "6 hours",
        twitterHandle: "spikemotiongfx",
        twitterFollowers: 94000,
        portfolioLinks: ["https://youtube.com/@spikegfx", "https://twitter.com/spikemotiongfx"],
        skills: ["After Effects", "Motion Design", "Video Editing", "Animation", "Sound Design"],
        psxTier: "gold",
      },
      {
        id: randomUUID(),
        walletAddress: "0xf2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1",
        name: "Mayank",
        headline: "Blockchain Architect | DeFi Builder",
        bio: "Architecting complex DeFi protocols and tokenomics. I design and implement innovative blockchain solutions that scale. From yield farming to liquidity pools, I build the infrastructure of tomorrow.",
        profileImage: null,
        verified: true,
        category: "Script Development",
        rating: "4.96",
        reviewCount: 85,
        completedProjects: 102,
        responseTime: "7 hours",
        twitterHandle: "mayankdefi",
        twitterFollowers: 51000,
        portfolioLinks: ["https://github.com/mayankdefi", "https://mayank.eth"],
        skills: ["DeFi Architecture", "Tokenomics", "Solidity", "System Design", "Protocol Development"],
        psxTier: "platinum",
      },
      {
        id: randomUUID(),
        walletAddress: "0xa3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
        name: "Nixor",
        headline: "Crypto KOL | Alpha Caller",
        bio: "Delivering alpha to my community daily. Known for accurate calls and deep market analysis. My network trusts my picks because I only promote projects I truly believe in. Your launch will reach the right audience.",
        profileImage: null,
        verified: true,
        category: "KOLs & Influencers",
        rating: "4.89",
        reviewCount: 201,
        completedProjects: 224,
        responseTime: "2 hours",
        twitterHandle: "nixoralpha",
        twitterFollowers: 428000,
        portfolioLinks: ["https://twitter.com/nixoralpha", "https://t.me/nixorcalls"],
        skills: ["Alpha Calls", "Market Analysis", "Twitter Marketing", "Research", "Community Leadership"],
        psxTier: "platinum",
      },
    ];

    builders.forEach((builder) => this.builders.set(builder.id, builder));

    const builderIds = Array.from(this.builders.keys());

    const services: Service[] = [
      {
        id: randomUUID(),
        builderId: builderIds[0],
        title: "Twitter Campaign & Promotion",
        description: "Launch your token with maximum impact. Comprehensive Twitter campaign including shoutouts, threads, and engagement farming.",
        category: "KOLs & Influencers",
        deliveryTime: "3 days",
        basicPrice: "500",
        standardPrice: "1500",
        premiumPrice: "3500",
        basicDescription: "1 tweet, basic engagement",
        standardDescription: "3 tweets, thread, retweets",
        premiumDescription: "Full week campaign, multiple threads, story",
        tags: ["Twitter", "Social Media", "Engagement", "Viral Marketing"],
        psxRequired: "5000",
        featured: true,
        portfolioMedia: ["https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80"],
        videoUrls: ["https://www.youtube.com/watch?v=dQw4w9WgXcQ"],
      },
      {
        id: randomUUID(),
        builderId: builderIds[1],
        title: "3D Token Logo & Animation",
        description: "Eye-catching 3D logo and animated intro for your token. Stand out with professional, modern 3D visuals.",
        category: "3D Content Creators",
        deliveryTime: "5 days",
        basicPrice: "800",
        standardPrice: "2000",
        premiumPrice: "4500",
        basicDescription: "Static 3D logo",
        standardDescription: "3D logo + basic animation",
        premiumDescription: "Full animated package with multiple variants",
        tags: ["3D Design", "Logo", "Animation", "Branding"],
        psxRequired: "3000",
        featured: true,
        portfolioMedia: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80", "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80"],
        videoUrls: ["https://www.youtube.com/watch?v=example1"],
      },
      {
        id: randomUUID(),
        builderId: builderIds[2],
        title: "Complete Marketing Strategy",
        description: "Full-service marketing plan from pre-launch to post-launch. Social media, PR, partnerships, and growth hacking.",
        category: "Marketing & Growth",
        deliveryTime: "7 days",
        basicPrice: "2000",
        standardPrice: "5000",
        premiumPrice: "12000",
        basicDescription: "Basic strategy document",
        standardDescription: "Strategy + implementation support",
        premiumDescription: "Full execution with ongoing support",
        tags: ["Marketing", "Strategy", "Growth", "Launch"],
        psxRequired: "10000",
        featured: true,
        portfolioMedia: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"],
        videoUrls: null,
      },
      {
        id: randomUUID(),
        builderId: builderIds[3],
        title: "ERC-20 Token Development",
        description: "Custom ERC-20 token with advanced features. Includes supply control, taxation, and anti-bot mechanisms.",
        category: "Script Development",
        deliveryTime: "7 days",
        basicPrice: "1500",
        standardPrice: "3000",
        premiumPrice: "6000",
        basicDescription: "Standard ERC-20 token",
        standardDescription: "Token with tax & anti-bot features",
        premiumDescription: "Fully customized with staking & rewards",
        tags: ["Solidity", "Smart Contracts", "Token", "Development"],
        psxRequired: "8000",
        featured: true,
        portfolioMedia: null,
        videoUrls: null,
      },
      {
        id: randomUUID(),
        builderId: builderIds[0],
        title: "Telegram Community Launch",
        description: "Build and grow your Telegram community from scratch. Includes setup, moderation, and engagement strategies.",
        category: "KOLs & Influencers",
        deliveryTime: "14 days",
        basicPrice: "1200",
        standardPrice: "2500",
        premiumPrice: "5000",
        basicDescription: "Basic setup and 1 week support",
        standardDescription: "Full setup with 2 weeks active management",
        premiumDescription: "Complete package with ongoing growth strategy",
        tags: ["Telegram", "Community", "Growth", "Engagement"],
        psxRequired: "6000",
        featured: false,
        portfolioMedia: null,
        videoUrls: null,
      },
      {
        id: randomUUID(),
        builderId: builderIds[1],
        title: "NFT Collection Art",
        description: "Unique 3D NFT collection with multiple traits and rarity tiers. Professional quality for serious projects.",
        category: "3D Content Creators",
        deliveryTime: "21 days",
        basicPrice: "5000",
        standardPrice: "15000",
        premiumPrice: "35000",
        basicDescription: "100 piece collection",
        standardDescription: "500 piece collection with traits",
        premiumDescription: "10,000 piece collection, full generative system",
        tags: ["NFT", "3D Art", "Collection", "Generative"],
        psxRequired: "20000",
        featured: false,
        portfolioMedia: null,
        videoUrls: null,
      },
      {
        id: randomUUID(),
        builderId: builderIds[4],
        title: "Initial Liquidity & Volume",
        description: "Professional market making services for token launch. Ensure healthy volume and price stability.",
        category: "Volume Services",
        deliveryTime: "30 days",
        basicPrice: "3000",
        standardPrice: "8000",
        premiumPrice: "20000",
        basicDescription: "1 week volume support",
        standardDescription: "2 weeks with price stability",
        premiumDescription: "Full month with market making",
        tags: ["Liquidity", "Volume", "Market Making", "Trading"],
        psxRequired: "15000",
        featured: true,
        portfolioMedia: ["https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80"],
        videoUrls: null,
      },
      {
        id: randomUUID(),
        builderId: builderIds[5],
        title: "Discord Server Setup & Management",
        description: "Professional Discord server design, setup, and management. Includes bots, roles, and community engagement.",
        category: "KOLs & Influencers",
        deliveryTime: "7 days",
        basicPrice: "800",
        standardPrice: "2000",
        premiumPrice: "5000",
        basicDescription: "Basic server setup",
        standardDescription: "Full setup with custom bots",
        premiumDescription: "Premium setup with ongoing management",
        tags: ["Discord", "Community", "Management", "Bots"],
        psxRequired: "4000",
        featured: false,
        portfolioMedia: null,
        videoUrls: null,
      },
    ];

    services.forEach((service) => this.services.set(service.id, service));

    const reviews: Review[] = [
      {
        id: randomUUID(),
        builderId: builderIds[0],
        serviceId: Array.from(this.services.values())[0].id,
        clientName: "CryptoWhale",
        clientWallet: "0x1234...5678",
        rating: 5,
        comment: "Amazing results! Alex delivered exactly what was promised and our token gained massive traction. Highly professional and responsive.",
        projectTitle: "MoonShot Token Launch",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: randomUUID(),
        builderId: builderIds[1],
        serviceId: Array.from(this.services.values())[1].id,
        clientName: "TokenMaster",
        clientWallet: "0x8765...4321",
        rating: 5,
        comment: "Maya's 3D work is absolutely stunning. The logo exceeded all expectations and really makes our project stand out. Worth every penny!",
        projectTitle: "GalaxyDoge Branding",
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: randomUUID(),
        builderId: builderIds[2],
        serviceId: Array.from(this.services.values())[2].id,
        clientName: "LaunchPad Pro",
        clientWallet: "0xabcd...efgh",
        rating: 5,
        comment: "Marcus developed a comprehensive strategy that took our project to the next level. His insights and execution were flawless.",
        projectTitle: "RocketFuel Marketing Campaign",
        createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    reviews.forEach((review) => this.reviews.set(review.id, review));

    const defaultAdmin: Admin = {
      id: randomUUID(),
      username: "admin",
      passwordHash: bcrypt.hashSync("admin123", 10),
      email: "admin@psxmarketplace.com",
      name: "Admin User",
      role: "admin",
      lastLogin: null,
      createdAt: new Date().toISOString(),
    };
    this.admins.set(defaultAdmin.id, defaultAdmin);
  }

  async getBuilder(id: string): Promise<Builder | undefined> {
    return this.builders.get(id);
  }

  async getBuilders(): Promise<Builder[]> {
    return Array.from(this.builders.values());
  }

  async getFeaturedBuilders(): Promise<Builder[]> {
    return Array.from(this.builders.values())
      .filter((b) => b.verified)
      .sort((a, b) => parseFloat(b.rating || "0") - parseFloat(a.rating || "0"))
      .slice(0, 8);
  }

  async createBuilder(insertBuilder: InsertBuilder): Promise<Builder> {
    const id = randomUUID();
    const builder: Builder = {
      ...insertBuilder,
      id,
      rating: "0",
      reviewCount: 0,
      completedProjects: 0,
      verified: insertBuilder.verified ?? false,
      profileImage: insertBuilder.profileImage ?? null,
      responseTime: insertBuilder.responseTime ?? "24 hours",
      twitterHandle: insertBuilder.twitterHandle ?? null,
      twitterFollowers: insertBuilder.twitterFollowers ?? null,
      portfolioLinks: insertBuilder.portfolioLinks ?? null,
      skills: insertBuilder.skills ?? null,
      psxTier: insertBuilder.psxTier ?? "bronze",
      portfolioMedia: insertBuilder.portfolioMedia ?? null,
      videoShowreel: insertBuilder.videoShowreel ?? null,
      instagramHandle: insertBuilder.instagramHandle ?? null,
      instagramFollowers: insertBuilder.instagramFollowers ?? null,
      youtubeChannel: insertBuilder.youtubeChannel ?? null,
      youtubeSubscribers: insertBuilder.youtubeSubscribers ?? null,
      telegramHandle: insertBuilder.telegramHandle ?? null,
      telegramMembers: insertBuilder.telegramMembers ?? null,
      engagementRate: insertBuilder.engagementRate ?? null,
      audienceDemographics: insertBuilder.audienceDemographics ?? null,
      contentNiches: insertBuilder.contentNiches ?? null,
      brandPartnerships: insertBuilder.brandPartnerships ?? null,
      software3D: insertBuilder.software3D ?? null,
      renderEngines: insertBuilder.renderEngines ?? null,
      styleSpecialties: insertBuilder.styleSpecialties ?? null,
      animationExpertise: insertBuilder.animationExpertise ?? null,
      marketingPlatforms: insertBuilder.marketingPlatforms ?? null,
      growthStrategies: insertBuilder.growthStrategies ?? null,
      caseStudies: insertBuilder.caseStudies ?? null,
      avgROI: insertBuilder.avgROI ?? null,
      clientIndustries: insertBuilder.clientIndustries ?? null,
      programmingLanguages: insertBuilder.programmingLanguages ?? null,
      blockchainFrameworks: insertBuilder.blockchainFrameworks ?? null,
      githubProfile: insertBuilder.githubProfile ?? null,
      deployedContracts: insertBuilder.deployedContracts ?? null,
      auditReports: insertBuilder.auditReports ?? null,
      certifications: insertBuilder.certifications ?? null,
      tradingExperience: insertBuilder.tradingExperience ?? null,
      volumeCapabilities: insertBuilder.volumeCapabilities ?? null,
      dexExpertise: insertBuilder.dexExpertise ?? null,
      cexExpertise: insertBuilder.cexExpertise ?? null,
      complianceKnowledge: insertBuilder.complianceKnowledge ?? null,
      volumeProof: insertBuilder.volumeProof ?? null,
    };
    this.builders.set(id, builder);
    return builder;
  }

  async getBuilderProjects(builderId: string): Promise<BuilderProject[]> {
    return Array.from(this.builderProjects.values())
      .filter((p) => p.builderId === builderId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getBuilderProject(id: string): Promise<BuilderProject | undefined> {
    return this.builderProjects.get(id);
  }

  async createBuilderProject(insertProject: InsertBuilderProject): Promise<BuilderProject> {
    const id = randomUUID();
    const project: BuilderProject = {
      ...insertProject,
      id,
      clientName: insertProject.clientName ?? null,
      mediaUrls: insertProject.mediaUrls ?? null,
      videoUrl: insertProject.videoUrl ?? null,
      liveUrl: insertProject.liveUrl ?? null,
      results: insertProject.results ?? null,
      metricsAchieved: insertProject.metricsAchieved ?? null,
      twitterReach: insertProject.twitterReach ?? null,
      engagementGenerated: insertProject.engagementGenerated ?? null,
      followersGained: insertProject.followersGained ?? null,
      impressions: insertProject.impressions ?? null,
      roiPercentage: insertProject.roiPercentage ?? null,
      revenueGenerated: insertProject.revenueGenerated ?? null,
      conversionRate: insertProject.conversionRate ?? null,
      contractAddress: insertProject.contractAddress ?? null,
      auditScore: insertProject.auditScore ?? null,
      volumeDelivered: insertProject.volumeDelivered ?? null,
      testimonial: insertProject.testimonial ?? null,
      testimonialAuthor: insertProject.testimonialAuthor ?? null,
      featured: insertProject.featured ?? false,
      createdAt: new Date().toISOString(),
    };
    this.builderProjects.set(id, project);
    return project;
  }

  async getService(id: string): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async getServicesByBuilder(builderId: string): Promise<Service[]> {
    return Array.from(this.services.values()).filter(
      (s) => s.builderId === builderId
    );
  }

  async getFeaturedServices(): Promise<Service[]> {
    return Array.from(this.services.values())
      .filter((s) => s.featured)
      .slice(0, 8);
  }

  async getServicesByCategory(categorySlug: string): Promise<Service[]> {
    const category = this.categories.get(categorySlug);
    if (!category) return [];
    return Array.from(this.services.values()).filter(
      (s) => s.category === category.name
    );
  }

  async createService(insertService: InsertService): Promise<Service> {
    const id = randomUUID();
    const service: Service = { 
      ...insertService, 
      id,
      standardPrice: insertService.standardPrice ?? null,
      premiumPrice: insertService.premiumPrice ?? null,
      standardDescription: insertService.standardDescription ?? null,
      premiumDescription: insertService.premiumDescription ?? null,
      tags: insertService.tags ?? null,
      featured: insertService.featured ?? false,
      portfolioMedia: insertService.portfolioMedia ?? null,
      videoUrls: insertService.videoUrls ?? null,
    };
    this.services.set(id, service);
    return service;
  }

  async getCategory(slug: string): Promise<Category | undefined> {
    return this.categories.get(slug);
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id, builderCount: 0 };
    this.categories.set(category.slug, category);
    return category;
  }

  async getReviewsByBuilder(builderId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (r) => r.builderId === builderId
    );
  }

  async getReview(id: string): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = {
      ...insertReview,
      id,
      createdAt: new Date().toISOString(),
      serviceId: insertReview.serviceId ?? null,
      projectTitle: insertReview.projectTitle ?? null,
      orderId: insertReview.orderId ?? null,
      builderResponse: null,
      builderResponseAt: null,
      status: "pending",
      moderatedBy: null,
      moderatedAt: null,
      moderatorNotes: null,
      onchainTxHash: null,
      onchainVerified: false,
      onchainVerifiedAt: null,
      isDisputed: false,
      disputeStatus: null,
      helpfulCount: 0,
      notHelpfulCount: 0,
    };
    this.reviews.set(id, review);
    return review;
  }

  async addBuilderResponse(reviewId: string, response: string): Promise<Review> {
    const review = this.reviews.get(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }
    review.builderResponse = response;
    review.builderResponseAt = new Date().toISOString();
    this.reviews.set(reviewId, review);
    return review;
  }

  async updateReviewStatus(reviewId: string, status: string, moderatorId: string, notes?: string): Promise<Review> {
    const review = this.reviews.get(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }
    review.status = status;
    review.moderatedBy = moderatorId;
    review.moderatedAt = new Date().toISOString();
    review.moderatorNotes = notes ?? null;
    this.reviews.set(reviewId, review);
    return review;
  }

  async getReviewVote(reviewId: string, voterId: string): Promise<ReviewVote | undefined> {
    return Array.from(this.reviewVotes.values()).find(
      (v) => v.reviewId === reviewId && v.voterId === voterId
    );
  }

  async createReviewVote(vote: InsertReviewVote): Promise<ReviewVote> {
    const id = randomUUID();
    const reviewVote: ReviewVote = {
      ...vote,
      id,
      createdAt: new Date().toISOString(),
    };
    this.reviewVotes.set(id, reviewVote);
    await this.updateReviewVoteCount(vote.reviewId);
    return reviewVote;
  }

  async deleteReviewVote(reviewId: string, voterId: string): Promise<void> {
    const vote = await this.getReviewVote(reviewId, voterId);
    if (vote) {
      this.reviewVotes.delete(vote.id);
      await this.updateReviewVoteCount(reviewId);
    }
  }

  async updateReviewVoteCount(reviewId: string): Promise<Review> {
    const review = this.reviews.get(reviewId);
    if (!review) {
      throw new Error("Review not found");
    }
    const votes = Array.from(this.reviewVotes.values()).filter((v) => v.reviewId === reviewId);
    review.helpfulCount = votes.filter((v) => v.voteType === "helpful").length;
    review.notHelpfulCount = votes.filter((v) => v.voteType === "not_helpful").length;
    this.reviews.set(reviewId, review);
    return review;
  }

  async getReviewDispute(reviewId: string): Promise<ReviewDispute | undefined> {
    return Array.from(this.reviewDisputes.values()).find(
      (d) => d.reviewId === reviewId
    );
  }

  async getReviewDisputes(): Promise<ReviewDispute[]> {
    return Array.from(this.reviewDisputes.values());
  }

  async createReviewDispute(dispute: InsertReviewDispute): Promise<ReviewDispute> {
    const id = randomUUID();
    const reviewDispute: ReviewDispute = {
      ...dispute,
      id,
      createdAt: new Date().toISOString(),
      status: "pending",
      resolution: null,
      resolvedBy: null,
      resolvedAt: null,
      evidence: dispute.evidence ?? null,
    };
    this.reviewDisputes.set(id, reviewDispute);
    
    const review = this.reviews.get(dispute.reviewId);
    if (review) {
      review.isDisputed = true;
      review.disputeStatus = "pending";
      this.reviews.set(dispute.reviewId, review);
    }
    
    return reviewDispute;
  }

  async resolveReviewDispute(disputeId: string, resolution: string, resolvedBy: string): Promise<ReviewDispute> {
    const dispute = this.reviewDisputes.get(disputeId);
    if (!dispute) {
      throw new Error("Dispute not found");
    }
    dispute.status = "resolved";
    dispute.resolution = resolution;
    dispute.resolvedBy = resolvedBy;
    dispute.resolvedAt = new Date().toISOString();
    this.reviewDisputes.set(disputeId, dispute);
    
    const review = this.reviews.get(dispute.reviewId);
    if (review) {
      review.disputeStatus = "resolved";
      this.reviews.set(dispute.reviewId, review);
    }
    
    return dispute;
  }

  async getBuilderApplication(id: string): Promise<BuilderApplication | undefined> {
    return this.builderApplications.get(id);
  }

  async getBuilderApplications(): Promise<BuilderApplication[]> {
    return Array.from(this.builderApplications.values());
  }

  async createBuilderApplication(insertApplication: InsertBuilderApplication): Promise<BuilderApplication> {
    const id = randomUUID();
    const application: BuilderApplication = {
      ...insertApplication,
      id,
      status: "pending",
      submittedAt: new Date().toISOString(),
      reviewerNotes: null,
      portfolioLinks: insertApplication.portfolioLinks ?? null,
      twitterHandle: insertApplication.twitterHandle ?? null,
      twitterFollowers: insertApplication.twitterFollowers ?? null,
      instagramHandle: insertApplication.instagramHandle ?? null,
      instagramFollowers: insertApplication.instagramFollowers ?? null,
      youtubeChannel: insertApplication.youtubeChannel ?? null,
      youtubeSubscribers: insertApplication.youtubeSubscribers ?? null,
      engagementRate: insertApplication.engagementRate ?? null,
      contentNiches: insertApplication.contentNiches ?? null,
      software3D: insertApplication.software3D ?? null,
      renderEngines: insertApplication.renderEngines ?? null,
      styleSpecialties: insertApplication.styleSpecialties ?? null,
      marketingPlatforms: insertApplication.marketingPlatforms ?? null,
      growthStrategies: insertApplication.growthStrategies ?? null,
      caseStudyLinks: insertApplication.caseStudyLinks ?? null,
      programmingLanguages: insertApplication.programmingLanguages ?? null,
      blockchainFrameworks: insertApplication.blockchainFrameworks ?? null,
      githubProfile: insertApplication.githubProfile ?? null,
      tradingExperience: insertApplication.tradingExperience ?? null,
      volumeCapabilities: insertApplication.volumeCapabilities ?? null,
      complianceKnowledge: insertApplication.complianceKnowledge ?? null,
    };
    this.builderApplications.set(id, application);
    return application;
  }

  async approveBuilderApplication(id: string): Promise<Builder> {
    const application = await this.getBuilderApplication(id);
    if (!application) {
      throw new Error("Application not found");
    }

    const builder: Builder = {
      id: randomUUID(),
      walletAddress: application.walletAddress,
      name: application.name,
      headline: `${application.category} Expert`,
      bio: application.bio,
      profileImage: null,
      verified: true,
      category: application.category,
      rating: "0",
      reviewCount: 0,
      completedProjects: 0,
      responseTime: "24 hours",
      twitterHandle: application.twitterHandle,
      twitterFollowers: application.twitterFollowers,
      portfolioLinks: application.portfolioLinks,
      skills: null,
      psxTier: "bronze",
    };

    this.builders.set(builder.id, builder);

    application.status = "approved";
    this.builderApplications.set(id, application);

    return builder;
  }

  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async getClientByWallet(walletAddress: string): Promise<Client | undefined> {
    return Array.from(this.clients.values()).find(
      (c) => c.walletAddress === walletAddress
    );
  }

  async getClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = randomUUID();
    const client: Client = {
      ...insertClient,
      id,
      verified: false,
      profileImage: insertClient.profileImage ?? null,
      companyName: insertClient.companyName ?? null,
      bio: insertClient.bio ?? null,
      psxTier: "bronze",
      createdAt: new Date().toISOString(),
    };
    this.clients.set(id, client);
    return client;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrdersByClient(clientId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (o) => o.clientId === clientId
    );
  }

  async getOrdersByBuilder(builderId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (o) => o.builderId === builderId
    );
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const now = new Date().toISOString();
    const order: Order = {
      ...insertOrder,
      id,
      status: "pending",
      revisionCount: 0,
      acceptedAt: null,
      startedAt: null,
      deliveredAt: null,
      completedAt: null,
      cancelledAt: null,
      cancellationReason: null,
      refundAmount: null,
      refundStatus: null,
      deliveryUrl: null,
      deliveryNotes: null,
      createdAt: now,
      updatedAt: now,
    };
    this.orders.set(id, order);
    
    await this.createOrderActivity({
      orderId: id,
      actorId: insertOrder.clientId,
      actorType: "client",
      activityType: "order_created",
      description: "Order was created",
      metadata: null,
    });
    
    return order;
  }

  async updateOrder(id: string, data: Partial<Order>): Promise<Order> {
    const order = await this.getOrder(id);
    if (!order) {
      throw new Error("Order not found");
    }

    const updatedOrder = {
      ...order,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async cancelOrder(id: string, reason: string, refundAmount?: number): Promise<Order> {
    const order = await this.getOrder(id);
    if (!order) {
      throw new Error("Order not found");
    }

    const updatedOrder = {
      ...order,
      status: "cancelled",
      cancelledAt: new Date().toISOString(),
      cancellationReason: reason,
      refundAmount: refundAmount ? String(refundAmount) : null,
      refundStatus: refundAmount ? "pending" : null,
      updatedAt: new Date().toISOString(),
    };
    
    this.orders.set(id, updatedOrder);
    
    await this.createOrderActivity({
      orderId: id,
      actorId: order.clientId,
      actorType: "client",
      activityType: "order_cancelled",
      description: `Order was cancelled: ${reason}`,
      metadata: refundAmount ? JSON.stringify({ refundAmount }) : null,
    });
    
    return updatedOrder;
  }

  async getOrderRevisions(orderId: string): Promise<OrderRevision[]> {
    return Array.from(this.orderRevisions.values()).filter(
      (r) => r.orderId === orderId
    );
  }

  async createOrderRevision(insertRevision: InsertOrderRevision): Promise<OrderRevision> {
    const id = randomUUID();
    const revision: OrderRevision = {
      ...insertRevision,
      id,
      status: "pending",
      deliveryUrl: null,
      deliveryNotes: null,
      deliveredAt: null,
      createdAt: new Date().toISOString(),
    };
    this.orderRevisions.set(id, revision);
    
    const order = await this.getOrder(insertRevision.orderId);
    if (order) {
      order.revisionCount = (order.revisionCount || 0) + 1;
      order.updatedAt = new Date().toISOString();
      this.orders.set(order.id, order);
    }
    
    await this.createOrderActivity({
      orderId: insertRevision.orderId,
      actorId: insertRevision.requestedBy,
      actorType: "client",
      activityType: "revision_requested",
      description: `Revision #${insertRevision.revisionNumber} requested`,
      metadata: JSON.stringify({ revisionId: id }),
    });
    
    return revision;
  }

  async updateOrderRevision(id: string, data: Partial<OrderRevision>): Promise<OrderRevision> {
    const revision = this.orderRevisions.get(id);
    if (!revision) {
      throw new Error("Order revision not found");
    }

    const updatedRevision = {
      ...revision,
      ...data,
    };
    
    this.orderRevisions.set(id, updatedRevision);
    
    if (data.status === "delivered" && data.deliveredAt) {
      await this.createOrderActivity({
        orderId: revision.orderId,
        actorId: "builder",
        actorType: "builder",
        activityType: "revision_delivered",
        description: `Revision #${revision.revisionNumber} delivered`,
        metadata: JSON.stringify({ revisionId: id }),
      });
    }
    
    return updatedRevision;
  }

  async getOrderActivities(orderId: string): Promise<OrderActivity[]> {
    return Array.from(this.orderActivities.values())
      .filter((a) => a.orderId === orderId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createOrderActivity(insertActivity: InsertOrderActivity): Promise<OrderActivity> {
    const id = randomUUID();
    const activity: OrderActivity = {
      ...insertActivity,
      id,
      metadata: insertActivity.metadata ?? null,
      createdAt: new Date().toISOString(),
    };
    this.orderActivities.set(id, activity);
    return activity;
  }

  async getMilestonesByProject(projectId: string): Promise<Milestone[]> {
    return Array.from(this.milestones.values()).filter(
      (m) => m.projectId === projectId
    );
  }

  async createMilestone(insertMilestone: InsertMilestone): Promise<Milestone> {
    const id = randomUUID();
    const milestone: Milestone = {
      ...insertMilestone,
      id,
      status: "pending",
      completedAt: null,
      transactionHash: null,
      createdAt: new Date().toISOString(),
      dueDate: insertMilestone.dueDate ?? null,
    };
    this.milestones.set(id, milestone);
    return milestone;
  }

  async updateMilestoneStatus(
    id: string,
    status: string,
    transactionHash?: string
  ): Promise<Milestone> {
    const milestone = await this.milestones.get(id);
    if (!milestone) {
      throw new Error("Milestone not found");
    }

    milestone.status = status;
    if (status === "completed" && !milestone.completedAt) {
      milestone.completedAt = new Date().toISOString();
    }
    if (transactionHash) {
      milestone.transactionHash = transactionHash;
    }

    this.milestones.set(id, milestone);
    return milestone;
  }

  async getAdmin(username: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(
      (admin) => admin.username === username
    );
  }

  async getAdmins(): Promise<Admin[]> {
    return Array.from(this.admins.values());
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const passwordHash = await bcrypt.hash(admin.passwordHash, 10);
    const newAdmin: Admin = {
      id: randomUUID(),
      ...admin,
      passwordHash,
      role: admin.role || "admin",
      lastLogin: null,
      createdAt: new Date().toISOString(),
    };
    this.admins.set(newAdmin.id, newAdmin);
    return newAdmin;
  }

  async updateAdmin(id: string, data: Partial<Admin>): Promise<Admin> {
    const admin = this.admins.get(id);
    if (!admin) {
      throw new Error("Admin not found");
    }

    if (data.passwordHash) {
      data.passwordHash = await bcrypt.hash(data.passwordHash, 10);
    }

    const updatedAdmin = { ...admin, ...data };
    this.admins.set(id, updatedAdmin);
    return updatedAdmin;
  }

  async deleteAdmin(id: string): Promise<void> {
    this.admins.delete(id);
  }

  async verifyAdminPassword(username: string, password: string): Promise<Admin | null> {
    const admin = await this.getAdmin(username);
    if (!admin) {
      return null;
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      return null;
    }

    return admin;
  }

  async updateLastLogin(username: string): Promise<void> {
    const admin = await this.getAdmin(username);
    if (admin) {
      admin.lastLogin = new Date().toISOString();
      this.admins.set(admin.id, admin);
    }
  }

  async getReferral(id: string): Promise<Referral | undefined> {
    return this.referrals.get(id);
  }

  async getReferrals(): Promise<Referral[]> {
    return Array.from(this.referrals.values());
  }

  async getReferralsByWallet(wallet: string): Promise<Referral[]> {
    return Array.from(this.referrals.values()).filter(
      (ref) => ref.referrerWallet === wallet || ref.referredWallet === wallet
    );
  }

  async createReferral(referral: InsertReferral): Promise<Referral> {
    const newReferral: Referral = {
      id: randomUUID(),
      ...referral,
      reward: referral.reward || null,
      status: "pending",
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    this.referrals.set(newReferral.id, newReferral);
    return newReferral;
  }

  async updateReferralStatus(id: string, status: string): Promise<Referral> {
    const referral = this.referrals.get(id);
    if (!referral) {
      throw new Error("Referral not found");
    }

    referral.status = status;
    if (status === "completed" && !referral.completedAt) {
      referral.completedAt = new Date().toISOString();
    }

    this.referrals.set(id, referral);
    return referral;
  }

  async deleteReferral(id: string): Promise<void> {
    this.referrals.delete(id);
  }

  async updateBuilder(id: string, data: Partial<Builder>): Promise<Builder> {
    const builder = this.builders.get(id);
    if (!builder) {
      throw new Error("Builder not found");
    }

    const updatedBuilder = { ...builder, ...data };
    this.builders.set(id, updatedBuilder);
    return updatedBuilder;
  }

  async deleteBuilder(id: string): Promise<void> {
    this.builders.delete(id);
    Array.from(this.services.values())
      .filter((service) => service.builderId === id)
      .forEach((service) => this.services.delete(service.id));
  }

  async toggleBuilderAvailability(builderId: string, accepting: boolean): Promise<Builder> {
    const builder = this.builders.get(builderId);
    if (!builder) {
      throw new Error("Builder not found");
    }

    const updatedBuilder = { 
      ...builder, 
      acceptingOrders: accepting,
      updatedAt: new Date().toISOString()
    };
    this.builders.set(builderId, updatedBuilder);
    return updatedBuilder;
  }

  async updateBuilderActivity(builderId: string): Promise<Builder> {
    const builder = this.builders.get(builderId);
    if (!builder) {
      throw new Error("Builder not found");
    }

    const updatedBuilder = { 
      ...builder, 
      lastActiveAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.builders.set(builderId, updatedBuilder);
    return updatedBuilder;
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
    const builder = this.builders.get(builderId);
    if (!builder) {
      throw new Error("Builder not found");
    }

    const orders = Array.from(this.orders.values()).filter(o => o.builderId === builderId);
    const activeOrders = orders.filter(o => 
      o.status === "accepted" || o.status === "in_progress"
    ).length;
    const completedOrders = orders.filter(o => o.status === "completed").length;

    const payouts = Array.from(this.payouts.values())
      .filter(p => p.builderId === builderId);
    const totalEarnings = payouts
      .filter(p => p.status === "completed")
      .reduce((sum, p) => sum + parseFloat(p.amount), 0)
      .toFixed(2);
    
    const pendingPayouts = payouts
      .filter(p => p.status === "pending" || p.status === "processing")
      .reduce((sum, p) => sum + parseFloat(p.amount), 0)
      .toFixed(2);

    return {
      totalEarnings: builder.totalEarnings || "0",
      availableBalance: builder.availableBalance || "0",
      pendingPayouts: builder.pendingPayouts || "0",
      activeOrders,
      completedOrders,
      successRate: builder.successRate || "100",
      avgResponseTime: builder.avgResponseTimeHours || 24,
      onTimeDeliveryRate: builder.onTimeDeliveryRate || "100",
    };
  }

  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    const service = this.services.get(id);
    if (!service) {
      throw new Error("Service not found");
    }

    const updatedService = { ...service, ...data };
    this.services.set(id, updatedService);
    return updatedService;
  }

  async deleteService(id: string): Promise<void> {
    this.services.delete(id);
  }

  async updateClient(id: string, data: Partial<Client>): Promise<Client> {
    const client = this.clients.get(id);
    if (!client) {
      throw new Error("Client not found");
    }

    const updatedClient = { ...client, ...data };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async deleteClient(id: string): Promise<void> {
    this.clients.delete(id);
  }

  async updateBuilderApplication(id: string, data: Partial<BuilderApplication>): Promise<BuilderApplication> {
    const application = this.builderApplications.get(id);
    if (!application) {
      throw new Error("Builder application not found");
    }

    const updatedApplication = { ...application, ...data };
    this.builderApplications.set(id, updatedApplication);
    return updatedApplication;
  }

  async deleteBuilderApplication(id: string): Promise<void> {
    this.builderApplications.delete(id);
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async getPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }

  async getPaymentsByOrder(orderId: string): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(p => p.orderId === orderId);
  }

  async getPaymentsByClient(clientId: string): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(p => p.clientId === clientId);
  }

  async getPaymentsByBuilder(builderId: string): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(p => p.builderId === builderId);
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const newPayment: Payment = {
      ...payment,
      id: randomUUID(),
      status: "pending",
      paidAt: null,
      releasedAt: null,
      refundedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.payments.set(newPayment.id, newPayment);
    return newPayment;
  }

  async updatePayment(id: string, data: Partial<Payment>): Promise<Payment> {
    const payment = this.payments.get(id);
    if (!payment) {
      throw new Error("Payment not found");
    }

    const updatedPayment = { ...payment, ...data, updatedAt: new Date().toISOString() };
    this.payments.set(id, updatedPayment);
    return updatedPayment;
  }

  async getMilestonePayment(id: string): Promise<MilestonePayment | undefined> {
    return this.milestonePayments.get(id);
  }

  async getMilestonePaymentsByPayment(paymentId: string): Promise<MilestonePayment[]> {
    return Array.from(this.milestonePayments.values()).filter(mp => mp.paymentId === paymentId);
  }

  async getMilestonePaymentsByOrder(orderId: string): Promise<MilestonePayment[]> {
    return Array.from(this.milestonePayments.values()).filter(mp => mp.orderId === orderId);
  }

  async createMilestonePayment(milestonePayment: InsertMilestonePayment): Promise<MilestonePayment> {
    const newMilestonePayment: MilestonePayment = {
      ...milestonePayment,
      id: randomUUID(),
      status: "locked",
      transactionHash: null,
      releasedAt: null,
      createdAt: new Date().toISOString(),
    };
    this.milestonePayments.set(newMilestonePayment.id, newMilestonePayment);
    return newMilestonePayment;
  }

  async updateMilestonePayment(id: string, data: Partial<MilestonePayment>): Promise<MilestonePayment> {
    const milestonePayment = this.milestonePayments.get(id);
    if (!milestonePayment) {
      throw new Error("Milestone payment not found");
    }

    const updatedMilestonePayment = { ...milestonePayment, ...data };
    this.milestonePayments.set(id, updatedMilestonePayment);
    return updatedMilestonePayment;
  }

  async releaseMilestonePayment(id: string, transactionHash: string): Promise<MilestonePayment> {
    const milestonePayment = this.milestonePayments.get(id);
    if (!milestonePayment) {
      throw new Error("Milestone payment not found");
    }

    const updatedMilestonePayment = { 
      ...milestonePayment, 
      status: "released",
      transactionHash,
      releasedAt: new Date().toISOString()
    };
    this.milestonePayments.set(id, updatedMilestonePayment);
    return updatedMilestonePayment;
  }

  async getPayout(id: string): Promise<Payout | undefined> {
    return this.payouts.get(id);
  }

  async getPayouts(): Promise<Payout[]> {
    return Array.from(this.payouts.values());
  }

  async getPayoutsByBuilder(builderId: string): Promise<Payout[]> {
    return Array.from(this.payouts.values()).filter(p => p.builderId === builderId);
  }

  async createPayout(payout: InsertPayout): Promise<Payout> {
    const newPayout: Payout = {
      ...payout,
      id: randomUUID(),
      status: "pending",
      transactionHash: null,
      processedAt: null,
      failureReason: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.payouts.set(newPayout.id, newPayout);
    return newPayout;
  }

  async updatePayout(id: string, data: Partial<Payout>): Promise<Payout> {
    const payout = this.payouts.get(id);
    if (!payout) {
      throw new Error("Payout not found");
    }

    const updatedPayout = { ...payout, ...data, updatedAt: new Date().toISOString() };
    this.payouts.set(id, updatedPayout);
    return updatedPayout;
  }

  async processPayout(id: string, transactionHash: string): Promise<Payout> {
    const payout = this.payouts.get(id);
    if (!payout) {
      throw new Error("Payout not found");
    }

    const updatedPayout = { 
      ...payout, 
      status: "completed",
      transactionHash,
      processedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.payouts.set(id, updatedPayout);
    return updatedPayout;
  }

  async getDispute(id: string): Promise<Dispute | undefined> {
    return this.disputes.get(id);
  }

  async getDisputes(): Promise<Dispute[]> {
    return Array.from(this.disputes.values());
  }

  async getDisputesByOrder(orderId: string): Promise<Dispute[]> {
    return Array.from(this.disputes.values()).filter(d => d.orderId === orderId);
  }

  async getDisputesByPayment(paymentId: string): Promise<Dispute[]> {
    return Array.from(this.disputes.values()).filter(d => d.paymentId === paymentId);
  }

  async createDispute(dispute: InsertDispute): Promise<Dispute> {
    const newDispute: Dispute = {
      ...dispute,
      id: randomUUID(),
      status: "open",
      resolution: null,
      resolvedBy: null,
      resolvedAt: null,
      refundAmount: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.disputes.set(newDispute.id, newDispute);
    return newDispute;
  }

  async updateDispute(id: string, data: Partial<Dispute>): Promise<Dispute> {
    const dispute = this.disputes.get(id);
    if (!dispute) {
      throw new Error("Dispute not found");
    }

    const updatedDispute = { ...dispute, ...data, updatedAt: new Date().toISOString() };
    this.disputes.set(id, updatedDispute);
    return updatedDispute;
  }

  async resolveDispute(id: string, resolution: string, resolvedBy: string, refundAmount?: number): Promise<Dispute> {
    const dispute = this.disputes.get(id);
    if (!dispute) {
      throw new Error("Dispute not found");
    }

    const updatedDispute = { 
      ...dispute, 
      status: "resolved",
      resolution,
      resolvedBy,
      refundAmount: refundAmount !== undefined ? refundAmount.toString() : null,
      resolvedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.disputes.set(id, updatedDispute);
    return updatedDispute;
  }

  async getRefund(id: string): Promise<Refund | undefined> {
    return this.refunds.get(id);
  }

  async getRefunds(): Promise<Refund[]> {
    return Array.from(this.refunds.values());
  }

  async getRefundsByOrder(orderId: string): Promise<Refund[]> {
    return Array.from(this.refunds.values()).filter(r => r.orderId === orderId);
  }

  async getRefundsByPayment(paymentId: string): Promise<Refund[]> {
    return Array.from(this.refunds.values()).filter(r => r.paymentId === paymentId);
  }

  async createRefund(refund: InsertRefund): Promise<Refund> {
    const newRefund: Refund = {
      ...refund,
      id: randomUUID(),
      status: "pending",
      transactionHash: null,
      processedAt: null,
      failureReason: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.refunds.set(newRefund.id, newRefund);
    return newRefund;
  }

  async updateRefund(id: string, data: Partial<Refund>): Promise<Refund> {
    const refund = this.refunds.get(id);
    if (!refund) {
      throw new Error("Refund not found");
    }

    const updatedRefund = { ...refund, ...data, updatedAt: new Date().toISOString() };
    this.refunds.set(id, updatedRefund);
    return updatedRefund;
  }

  async processRefund(id: string, transactionHash: string): Promise<Refund> {
    const refund = this.refunds.get(id);
    if (!refund) {
      throw new Error("Refund not found");
    }

    const updatedRefund = { 
      ...refund, 
      status: "completed",
      transactionHash,
      processedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.refunds.set(id, updatedRefund);
    return updatedRefund;
  }

  async getInvoice(id: string): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async getInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values());
  }

  async getInvoicesByClient(clientId: string): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).filter(i => i.clientId === clientId);
  }

  async getInvoicesByBuilder(builderId: string): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).filter(i => i.builderId === builderId);
  }

  async getInvoiceByPayment(paymentId: string): Promise<Invoice | undefined> {
    return Array.from(this.invoices.values()).find(i => i.paymentId === paymentId);
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const newInvoice: Invoice = {
      ...invoice,
      id: randomUUID(),
      status: "draft",
      paidAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.invoices.set(newInvoice.id, newInvoice);
    return newInvoice;
  }

  async updateInvoice(id: string, data: Partial<Invoice>): Promise<Invoice> {
    const invoice = this.invoices.get(id);
    if (!invoice) {
      throw new Error("Invoice not found");
    }

    const updatedInvoice = { ...invoice, ...data, updatedAt: new Date().toISOString() };
    this.invoices.set(id, updatedInvoice);
    return updatedInvoice;
  }

  async getChatThread(id: string): Promise<ChatThread | undefined> {
    return this.chatThreads.get(id);
  }

  async getChatThreadsByClient(clientId: string): Promise<ChatThread[]> {
    return Array.from(this.chatThreads.values())
      .filter(t => t.clientId === clientId && !t.archivedByClient)
      .sort((a, b) => {
        const aTime = a.lastMessageAt || a.createdAt;
        const bTime = b.lastMessageAt || b.createdAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });
  }

  async getChatThreadsByBuilder(builderId: string): Promise<ChatThread[]> {
    return Array.from(this.chatThreads.values())
      .filter(t => t.builderId === builderId && !t.archivedByBuilder)
      .sort((a, b) => {
        const aTime = a.lastMessageAt || a.createdAt;
        const bTime = b.lastMessageAt || b.createdAt;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });
  }

  async getChatThreadByOrder(orderId: string): Promise<ChatThread | undefined> {
    return Array.from(this.chatThreads.values()).find(t => t.orderId === orderId);
  }

  async findOrCreateChatThread(clientId: string, builderId: string, orderId?: string): Promise<ChatThread> {
    if (orderId) {
      const existingThread = await this.getChatThreadByOrder(orderId);
      if (existingThread) {
        return existingThread;
      }
    }

    const existingThread = Array.from(this.chatThreads.values()).find(
      t => t.clientId === clientId && t.builderId === builderId && !t.orderId
    );

    if (existingThread) {
      return existingThread;
    }

    const builder = await this.getBuilder(builderId);
    const order = orderId ? await this.getOrder(orderId) : null;
    
    const title = order 
      ? `Order #${order.id.substring(0, 8)} - ${order.serviceTitle}`
      : `Chat with ${builder?.name || 'Builder'}`;

    return this.createChatThread({
      clientId,
      builderId,
      orderId: orderId || null,
      title,
    });
  }

  async createChatThread(thread: InsertChatThread): Promise<ChatThread> {
    const newThread: ChatThread = {
      ...thread,
      id: randomUUID(),
      status: "active",
      lastMessageAt: null,
      lastMessagePreview: null,
      clientUnreadCount: 0,
      builderUnreadCount: 0,
      archivedByClient: false,
      archivedByBuilder: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.chatThreads.set(newThread.id, newThread);
    return newThread;
  }

  async updateChatThread(id: string, data: Partial<ChatThread>): Promise<ChatThread> {
    const thread = this.chatThreads.get(id);
    if (!thread) {
      throw new Error("Chat thread not found");
    }

    const updatedThread = { ...thread, ...data, updatedAt: new Date().toISOString() };
    this.chatThreads.set(id, updatedThread);
    return updatedThread;
  }

  async archiveChatThread(id: string, userType: string): Promise<ChatThread> {
    const thread = this.chatThreads.get(id);
    if (!thread) {
      throw new Error("Chat thread not found");
    }

    const updates: Partial<ChatThread> = userType === "client"
      ? { archivedByClient: true }
      : { archivedByBuilder: true };

    return this.updateChatThread(id, updates);
  }

  async updateThreadUnreadCount(threadId: string, userType: string, increment: boolean): Promise<ChatThread> {
    const thread = this.chatThreads.get(threadId);
    if (!thread) {
      throw new Error("Chat thread not found");
    }

    const field = userType === "client" ? "clientUnreadCount" : "builderUnreadCount";
    const currentCount = thread[field];
    const newCount = increment ? currentCount + 1 : 0;

    return this.updateChatThread(threadId, { [field]: newCount });
  }

  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesByThread(threadId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter(m => m.threadId === threadId && !m.deleted)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const newMessage: Message = {
      ...message,
      id: randomUUID(),
      edited: false,
      editedAt: null,
      deleted: false,
      deletedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.messages.set(newMessage.id, newMessage);

    const preview = newMessage.content.length > 50 
      ? newMessage.content.substring(0, 50) + "..."
      : newMessage.content;

    const recipientType = newMessage.senderType === "client" ? "builder" : "client";
    await this.updateChatThread(newMessage.threadId, {
      lastMessageAt: newMessage.createdAt,
      lastMessagePreview: preview,
    });
    await this.updateThreadUnreadCount(newMessage.threadId, recipientType, true);

    return newMessage;
  }

  async updateMessage(id: string, data: Partial<Message>): Promise<Message> {
    const message = this.messages.get(id);
    if (!message) {
      throw new Error("Message not found");
    }

    const updatedMessage = { 
      ...message, 
      ...data, 
      edited: true,
      editedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString() 
    };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  async deleteMessage(id: string): Promise<Message> {
    const message = this.messages.get(id);
    if (!message) {
      throw new Error("Message not found");
    }

    const updatedMessage = { 
      ...message, 
      deleted: true,
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.messages.set(id, updatedMessage);
    return updatedMessage;
  }

  async getMessageAttachment(id: string): Promise<MessageAttachment | undefined> {
    return this.messageAttachments.get(id);
  }

  async getMessageAttachmentsByMessage(messageId: string): Promise<MessageAttachment[]> {
    return Array.from(this.messageAttachments.values())
      .filter(a => a.messageId === messageId);
  }

  async createMessageAttachment(attachment: InsertMessageAttachment): Promise<MessageAttachment> {
    const newAttachment: MessageAttachment = {
      ...attachment,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.messageAttachments.set(newAttachment.id, newAttachment);
    return newAttachment;
  }

  async getMessageReadReceipt(messageId: string, readerId: string): Promise<MessageReadReceipt | undefined> {
    return Array.from(this.messageReadReceipts.values())
      .find(r => r.messageId === messageId && r.readerId === readerId);
  }

  async getMessageReadReceiptsByThread(threadId: string, readerId: string): Promise<MessageReadReceipt[]> {
    return Array.from(this.messageReadReceipts.values())
      .filter(r => r.threadId === threadId && r.readerId === readerId);
  }

  async createMessageReadReceipt(receipt: InsertMessageReadReceipt): Promise<MessageReadReceipt> {
    const existing = await this.getMessageReadReceipt(receipt.messageId, receipt.readerId);
    if (existing) {
      return existing;
    }

    const newReceipt: MessageReadReceipt = {
      ...receipt,
      id: randomUUID(),
      readAt: new Date().toISOString(),
    };
    this.messageReadReceipts.set(newReceipt.id, newReceipt);
    return newReceipt;
  }

  async markThreadAsRead(threadId: string, readerId: string, readerType: string): Promise<void> {
    const messages = await this.getMessagesByThread(threadId);
    
    for (const message of messages) {
      if (message.senderId !== readerId) {
        await this.createMessageReadReceipt({
          messageId: message.id,
          threadId,
          readerId,
          readerType,
        });
      }
    }

    await this.updateThreadUnreadCount(threadId, readerType, false);
  }

  async getProjectDeliverable(id: string): Promise<ProjectDeliverable | undefined> {
    return this.projectDeliverables.get(id);
  }

  async getProjectDeliverablesByOrder(orderId: string): Promise<ProjectDeliverable[]> {
    return Array.from(this.projectDeliverables.values())
      .filter(d => d.orderId === orderId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getProjectDeliverablesByMilestone(milestoneId: string): Promise<ProjectDeliverable[]> {
    return Array.from(this.projectDeliverables.values())
      .filter(d => d.milestoneId === milestoneId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createProjectDeliverable(deliverable: InsertProjectDeliverable): Promise<ProjectDeliverable> {
    const newDeliverable: ProjectDeliverable = {
      ...deliverable,
      id: randomUUID(),
      status: "pending",
      revisionRequested: false,
      reviewedBy: null,
      reviewedAt: null,
      reviewNotes: null,
      acceptedAt: null,
      rejectedAt: null,
      rejectionReason: null,
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    this.projectDeliverables.set(newDeliverable.id, newDeliverable);
    return newDeliverable;
  }

  async updateProjectDeliverable(id: string, data: Partial<ProjectDeliverable>): Promise<ProjectDeliverable> {
    const deliverable = this.projectDeliverables.get(id);
    if (!deliverable) {
      throw new Error("Project deliverable not found");
    }

    const updatedDeliverable = { ...deliverable, ...data };
    this.projectDeliverables.set(id, updatedDeliverable);
    return updatedDeliverable;
  }

  async reviewProjectDeliverable(id: string, reviewedBy: string, reviewNotes: string, accepted: boolean, rejectionReason?: string): Promise<ProjectDeliverable> {
    const deliverable = this.projectDeliverables.get(id);
    if (!deliverable) {
      throw new Error("Project deliverable not found");
    }

    const now = new Date().toISOString();
    const updatedDeliverable: ProjectDeliverable = {
      ...deliverable,
      reviewedBy,
      reviewedAt: now,
      reviewNotes,
      status: accepted ? "accepted" : "rejected",
      acceptedAt: accepted ? now : null,
      rejectedAt: accepted ? null : now,
      rejectionReason: accepted ? null : rejectionReason,
      revisionRequested: false,
    };
    this.projectDeliverables.set(id, updatedDeliverable);
    return updatedDeliverable;
  }

  async requestDeliverableRevision(id: string, reviewNotes: string): Promise<ProjectDeliverable> {
    const deliverable = this.projectDeliverables.get(id);
    if (!deliverable) {
      throw new Error("Project deliverable not found");
    }

    const updatedDeliverable: ProjectDeliverable = {
      ...deliverable,
      status: "revision_requested",
      revisionRequested: true,
      reviewNotes,
      reviewedAt: new Date().toISOString(),
    };
    this.projectDeliverables.set(id, updatedDeliverable);
    return updatedDeliverable;
  }

  async getProgressUpdate(id: string): Promise<ProgressUpdate | undefined> {
    return this.progressUpdates.get(id);
  }

  async getProgressUpdatesByOrder(orderId: string): Promise<ProgressUpdate[]> {
    return Array.from(this.progressUpdates.values())
      .filter(u => u.orderId === orderId && u.isVisible)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getProgressUpdatesByBuilder(builderId: string): Promise<ProgressUpdate[]> {
    return Array.from(this.progressUpdates.values())
      .filter(u => u.builderId === builderId && u.isVisible)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createProgressUpdate(update: InsertProgressUpdate): Promise<ProgressUpdate> {
    const newUpdate: ProgressUpdate = {
      ...update,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.progressUpdates.set(newUpdate.id, newUpdate);
    return newUpdate;
  }

  async updateProgressUpdate(id: string, data: Partial<ProgressUpdate>): Promise<ProgressUpdate> {
    const update = this.progressUpdates.get(id);
    if (!update) {
      throw new Error("Progress update not found");
    }

    const updatedUpdate = { ...update, ...data };
    this.progressUpdates.set(id, updatedUpdate);
    return updatedUpdate;
  }

  async deleteProgressUpdate(id: string): Promise<void> {
    const update = this.progressUpdates.get(id);
    if (!update) {
      throw new Error("Progress update not found");
    }

    const updatedUpdate = { ...update, isVisible: false };
    this.progressUpdates.set(id, updatedUpdate);
  }

  async getProjectDocument(id: string): Promise<ProjectDocument | undefined> {
    return this.projectDocuments.get(id);
  }

  async getProjectDocumentsByOrder(orderId: string): Promise<ProjectDocument[]> {
    return Array.from(this.projectDocuments.values())
      .filter(d => d.orderId === orderId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createProjectDocument(document: InsertProjectDocument): Promise<ProjectDocument> {
    const newDocument: ProjectDocument = {
      ...document,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.projectDocuments.set(newDocument.id, newDocument);
    return newDocument;
  }

  async updateProjectDocument(id: string, data: Partial<ProjectDocument>): Promise<ProjectDocument> {
    const document = this.projectDocuments.get(id);
    if (!document) {
      throw new Error("Project document not found");
    }

    const updatedDocument = { 
      ...document, 
      ...data,
      updatedAt: new Date().toISOString() 
    };
    this.projectDocuments.set(id, updatedDocument);
    return updatedDocument;
  }

  async deleteProjectDocument(id: string): Promise<void> {
    this.projectDocuments.delete(id);
  }

  async getProjectDocumentVersions(orderId: string, documentName: string): Promise<ProjectDocument[]> {
    return Array.from(this.projectDocuments.values())
      .filter(d => d.orderId === orderId && d.documentName === documentName)
      .sort((a, b) => b.version - a.version);
  }

  async followBuilder(clientId: string, builderId: string): Promise<void> {
    const id = randomUUID();
    const follow = {
      id,
      clientId,
      builderId,
      followedAt: new Date().toISOString(),
    };
    this.builderFollows.set(`${clientId}-${builderId}`, follow);
    await this.createBuilderActivity({
      builderId,
      activityType: "new_follower",
      activityData: JSON.stringify({ clientId }),
    });
  }

  async unfollowBuilder(clientId: string, builderId: string): Promise<void> {
    this.builderFollows.delete(`${clientId}-${builderId}`);
  }

  async isFollowingBuilder(clientId: string, builderId: string): Promise<boolean> {
    return this.builderFollows.has(`${clientId}-${builderId}`);
  }

  async getBuilderFollowers(builderId: string): Promise<string[]> {
    return Array.from(this.builderFollows.values())
      .filter((f: any) => f.builderId === builderId)
      .map((f: any) => f.clientId);
  }

  async getFollowedBuilders(clientId: string): Promise<string[]> {
    return Array.from(this.builderFollows.values())
      .filter((f: any) => f.clientId === clientId)
      .map((f: any) => f.builderId);
  }

  async getBuilderFollowerCount(builderId: string): Promise<number> {
    return Array.from(this.builderFollows.values())
      .filter((f: any) => f.builderId === builderId).length;
  }

  async createBuilderActivity(activity: { builderId: string; activityType: string; activityData?: string; metadata?: string }): Promise<void> {
    const id = randomUUID();
    const activityRecord = {
      id,
      ...activity,
      isPublic: true,
      createdAt: new Date().toISOString(),
    };
    this.builderActivityFeed.set(id, activityRecord);
  }

  async getBuilderActivityFeed(builderId: string, limit = 20): Promise<any[]> {
    return Array.from(this.builderActivityFeed.values())
      .filter((a: any) => a.builderId === builderId && a.isPublic)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getFollowedBuildersActivity(clientId: string, limit = 50): Promise<any[]> {
    const followedBuilders = await this.getFollowedBuilders(clientId);
    return Array.from(this.builderActivityFeed.values())
      .filter((a: any) => followedBuilders.includes(a.builderId) && a.isPublic)
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async createBuilderBadge(badge: { builderId: string; badgeType: string; badgeLabel: string; badgeIcon?: string; badgeColor?: string }): Promise<void> {
    const id = randomUUID();
    const badgeRecord = {
      id,
      ...badge,
      earnedAt: new Date().toISOString(),
      expiresAt: null,
      isActive: true,
    };
    this.builderBadges.set(id, badgeRecord);
  }

  async getBuilderBadges(builderId: string): Promise<any[]> {
    return Array.from(this.builderBadges.values())
      .filter((b: any) => b.builderId === builderId && b.isActive);
  }

  async removeBuilderBadge(builderId: string, badgeType: string): Promise<void> {
    const badges = Array.from(this.builderBadges.entries());
    badges.forEach(([id, badge]) => {
      if (badge.builderId === builderId && badge.badgeType === badgeType) {
        this.builderBadges.delete(id);
      }
    });
  }

  async createBuilderTestimonial(testimonial: { builderId: string; clientId: string; content: string; authorName: string; authorTitle?: string; rating?: string; orderId?: string }): Promise<void> {
    const id = randomUUID();
    const testimonialRecord = {
      id,
      ...testimonial,
      authorImage: null,
      isFeatured: false,
      isApproved: false,
      createdAt: new Date().toISOString(),
    };
    this.builderTestimonials.set(id, testimonialRecord);
  }

  async getBuilderTestimonials(builderId: string, approvedOnly = true): Promise<any[]> {
    return Array.from(this.builderTestimonials.values())
      .filter((t: any) => t.builderId === builderId && (!approvedOnly || t.isApproved))
      .sort((a: any, b: any) => {
        if (a.isFeatured !== b.isFeatured) return b.isFeatured ? 1 : -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }

  async approveBuilderTestimonial(testimonialId: string): Promise<void> {
    const testimonial = this.builderTestimonials.get(testimonialId);
    if (testimonial) {
      testimonial.isApproved = true;
      this.builderTestimonials.set(testimonialId, testimonial);
    }
  }

  async featureBuilderTestimonial(testimonialId: string, featured: boolean): Promise<void> {
    const testimonial = this.builderTestimonials.get(testimonialId);
    if (testimonial) {
      testimonial.isFeatured = featured;
      this.builderTestimonials.set(testimonialId, testimonial);
    }
  }

  async trackBuilderView(builderId: string, viewerId?: string, viewerType?: string): Promise<void> {
    const id = randomUUID();
    const view = {
      id,
      builderId,
      viewerId,
      viewerType,
      ipAddress: null,
      userAgent: null,
      referrer: null,
      viewedAt: new Date().toISOString(),
    };
    this.builderViews.set(id, view);
  }

  async getBuilderViewCount(builderId: string, period?: string): Promise<number> {
    const views = Array.from(this.builderViews.values())
      .filter((v: any) => v.builderId === builderId);
    
    if (period === "30days") {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return views.filter((v: any) => new Date(v.viewedAt) > thirtyDaysAgo).length;
    }
    
    return views.length;
  }

  async getBuilderViewStats(builderId: string): Promise<{ totalViews: number; uniqueViewers: number; last30Days: number }> {
    const views = Array.from(this.builderViews.values())
      .filter((v: any) => v.builderId === builderId);
    
    const uniqueViewers = new Set(views.filter((v: any) => v.viewerId).map((v: any) => v.viewerId)).size;
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const last30Days = views.filter((v: any) => new Date(v.viewedAt) > thirtyDaysAgo).length;
    
    return {
      totalViews: views.length,
      uniqueViewers,
      last30Days,
    };
  }

  async calculatePlatformStatistics(): Promise<void> {
    const stats = [
      { name: "total_builders", value: this.builders.size.toString(), type: "count", category: "builders" },
      { name: "total_services", value: this.services.size.toString(), type: "count", category: "services" },
      { name: "total_orders", value: this.orders.size.toString(), type: "count", category: "orders" },
      { name: "total_clients", value: this.clients.size.toString(), type: "count", category: "clients" },
      { name: "total_revenue", value: Array.from(this.payments.values()).reduce((sum: number, p: any) => sum + parseFloat(p.amount || 0), 0).toFixed(2), type: "currency", category: "revenue" },
    ];

    stats.forEach(stat => {
      const id = randomUUID();
      this.platformStatistics.set(id, {
        id,
        metricName: stat.name,
        metricValue: stat.value,
        metricType: stat.type,
        category: stat.category,
        period: "all_time",
        periodStart: null,
        periodEnd: null,
        calculatedAt: new Date().toISOString(),
      });
    });
  }

  async getPlatformStatistics(category?: string): Promise<any[]> {
    const stats = Array.from(this.platformStatistics.values());
    if (category) {
      return stats.filter((s: any) => s.category === category);
    }
    return stats;
  }

  async getClientAnalytics(clientId: string): Promise<{
    totalSpent: number;
    projectsCompleted: number;
    activeProjects: number;
    averageRating: number;
    favoriteCategories: string[];
  }> {
    const orders = Array.from(this.orders.values()).filter((o: any) => o.clientId === clientId);
    const payments = Array.from(this.payments.values()).filter((p: any) => p.clientId === clientId);
    const reviews = Array.from(this.reviews.values()).filter((r: any) => r.clientId === clientId);

    const totalSpent = payments
      .filter((p: any) => p.status === "completed")
      .reduce((sum, p: any) => sum + parseFloat(p.amount || 0), 0);

    const projectsCompleted = orders.filter((o: any) => o.status === "completed").length;
    const activeProjects = orders.filter((o: any) => ["accepted", "in_progress"].includes(o.status)).length;

    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, r: any) => sum + parseFloat(r.rating || 0), 0) / reviews.length
      : 0;

    const services = await Promise.all(
      orders.map(async (o: any) => {
        const service = await this.getService(o.serviceId);
        return service?.category;
      })
    );
    const categoryCounts = services.reduce((acc: any, cat) => {
      if (cat) acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});
    const favoriteCategories = Object.entries(categoryCounts)
      .sort((a: any, b: any) => b[1] - a[1])
      .slice(0, 3)
      .map((e: any) => e[0]);

    return {
      totalSpent,
      projectsCompleted,
      activeProjects,
      averageRating,
      favoriteCategories,
    };
  }

  async createApplicationRevision(applicationId: string, changesRequested: string, requestedBy: string): Promise<void> {
    const revisions = Array.from(this.builderApplicationRevisions.values())
      .filter((r: any) => r.applicationId === applicationId);
    const revisionNumber = revisions.length + 1;

    const id = randomUUID();
    const revision = {
      id,
      applicationId,
      revisionNumber,
      changesRequested,
      revisionNotes: null,
      submittedData: null,
      status: "pending",
      requestedBy,
      requestedAt: new Date().toISOString(),
      resubmittedAt: null,
      reviewedAt: null,
    };
    this.builderApplicationRevisions.set(id, revision);
  }

  async getApplicationRevisions(applicationId: string): Promise<any[]> {
    return Array.from(this.builderApplicationRevisions.values())
      .filter((r: any) => r.applicationId === applicationId)
      .sort((a: any, b: any) => a.revisionNumber - b.revisionNumber);
  }

  async submitApplicationRevision(revisionId: string, submittedData: string): Promise<void> {
    const revision = this.builderApplicationRevisions.get(revisionId);
    if (revision) {
      revision.submittedData = submittedData;
      revision.resubmittedAt = new Date().toISOString();
      revision.status = "resubmitted";
      this.builderApplicationRevisions.set(revisionId, revision);
    }
  }

  async getBuilderApplicationByEmail(email: string): Promise<BuilderApplication | undefined> {
    return Array.from(this.builderApplications.values())
      .find((app: any) => app.email === email);
  }

  async createBuilderOnboarding(builderId: string, applicationId: string): Promise<void> {
    const id = randomUUID();
    const onboarding = {
      id,
      builderId,
      applicationId,
      stepProfileComplete: false,
      stepServicesAdded: false,
      stepPortfolioAdded: false,
      stepPaymentSetup: false,
      stepVerificationComplete: false,
      completionPercentage: 0,
      isComplete: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.builderOnboarding.set(builderId, onboarding);
  }

  async getBuilderOnboarding(builderId: string): Promise<any | undefined> {
    return this.builderOnboarding.get(builderId);
  }

  async updateOnboardingStep(builderId: string, step: string, completed: boolean): Promise<void> {
    const onboarding = this.builderOnboarding.get(builderId);
    if (onboarding) {
      const stepField = `step${step.charAt(0).toUpperCase() + step.slice(1)}`;
      onboarding[stepField] = completed;
      
      const steps = ["stepProfileComplete", "stepServicesAdded", "stepPortfolioAdded", "stepPaymentSetup", "stepVerificationComplete"];
      const completedSteps = steps.filter(s => onboarding[s]).length;
      onboarding.completionPercentage = Math.round((completedSteps / steps.length) * 100);
      
      if (completedSteps === steps.length && !onboarding.isComplete) {
        onboarding.isComplete = true;
        onboarding.completedAt = new Date().toISOString();
      }
      
      onboarding.updatedAt = new Date().toISOString();
      this.builderOnboarding.set(builderId, onboarding);
    }
  }
}

export const storage = new MemStorage();
