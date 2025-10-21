import {
  type Builder,
  type InsertBuilder,
  type Service,
  type InsertService,
  type Category,
  type InsertCategory,
  type Review,
  type InsertReview,
  type BuilderApplication,
  type InsertBuilderApplication,
  type Client,
  type InsertClient,
  type Project,
  type InsertProject,
  type Milestone,
  type InsertMilestone,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getBuilder(id: string): Promise<Builder | undefined>;
  getBuilders(): Promise<Builder[]>;
  getFeaturedBuilders(): Promise<Builder[]>;
  createBuilder(builder: InsertBuilder): Promise<Builder>;

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
  createReview(review: InsertReview): Promise<Review>;

  getBuilderApplication(id: string): Promise<BuilderApplication | undefined>;
  getBuilderApplications(): Promise<BuilderApplication[]>;
  createBuilderApplication(application: InsertBuilderApplication): Promise<BuilderApplication>;
  approveBuilderApplication(id: string): Promise<Builder>;

  getClient(id: string): Promise<Client | undefined>;
  getClientByWallet(walletAddress: string): Promise<Client | undefined>;
  getClients(): Promise<Client[]>;
  createClient(client: InsertClient): Promise<Client>;

  getProject(id: string): Promise<Project | undefined>;
  getProjectsByClient(clientId: string): Promise<Project[]>;
  getProjectsByBuilder(builderId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProjectStatus(id: string, status: string): Promise<Project>;

  getMilestonesByProject(projectId: string): Promise<Milestone[]>;
  createMilestone(milestone: InsertMilestone): Promise<Milestone>;
  updateMilestoneStatus(id: string, status: string, transactionHash?: string): Promise<Milestone>;
}

export class MemStorage implements IStorage {
  private builders: Map<string, Builder>;
  private services: Map<string, Service>;
  private categories: Map<string, Category>;
  private reviews: Map<string, Review>;
  private builderApplications: Map<string, BuilderApplication>;
  private clients: Map<string, Client>;
  private projects: Map<string, Project>;
  private milestones: Map<string, Milestone>;

  constructor() {
    this.builders = new Map();
    this.services = new Map();
    this.categories = new Map();
    this.reviews = new Map();
    this.builderApplications = new Map();
    this.clients = new Map();
    this.projects = new Map();
    this.milestones = new Map();
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
    };
    this.builders.set(id, builder);
    return builder;
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

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = {
      ...insertReview,
      id,
      createdAt: new Date().toISOString(),
      serviceId: insertReview.serviceId ?? null,
      projectTitle: insertReview.projectTitle ?? null,
    };
    this.reviews.set(id, review);
    return review;
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

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByClient(clientId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (p) => p.clientId === clientId
    );
  }

  async getProjectsByBuilder(builderId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (p) => p.builderId === builderId
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      ...insertProject,
      id,
      status: "pending",
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
      contractTerms: insertProject.contractTerms ?? null,
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProjectStatus(id: string, status: string): Promise<Project> {
    const project = await this.getProject(id);
    if (!project) {
      throw new Error("Project not found");
    }

    project.status = status;
    if (status === "in_progress" && !project.startedAt) {
      project.startedAt = new Date().toISOString();
    }
    if (status === "completed" && !project.completedAt) {
      project.completedAt = new Date().toISOString();
    }

    this.projects.set(id, project);
    return project;
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
}

export const storage = new MemStorage();
