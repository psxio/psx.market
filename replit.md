## Overview
Create.psx is a dual token-gated Web3 marketplace connecting premium builders with clients in the memecoin and crypto space. Its primary purpose is to ensure quality by requiring $CREATE or $PSX token holdings for platform access. The platform features builder profiles, service listings, category-based browsing, administrative dashboards, legal compliance, robust builder onboarding, and AI-powered builder discovery and matching. The long-term vision is to become the leading platform for Web3 talent, integrating secure on-chain payments and advanced project management.

## User Preferences
- Default theme: Dark mode with purple/cyan branding
- Design system follows design_guidelines.md
- Mobile-first responsive design
- Professional Web3 aesthetic
- **Typography**: Space Grotesk font (matching time.fun) loaded from Google Fonts, applied site-wide via CSS variable --font-sans
- **Animations**: Scroll-triggered reveal animations throughout (fadeInUp, fadeInLeft, fadeInRight, fadeInScale, slideInUp, zoomIn, bounceIn)
- **Navigation**: Help and Admin links moved to footer (not in navbar)

## System Architecture
Create.psx employs a decoupled frontend and backend architecture.

### UI/UX Decisions
- **Branding**: Consistent purple/cyan gradient with equal prominence for Create and PSX brands.
- **Design System**: Tailwind CSS and Shadcn UI for a modern, responsive, mobile-first design.
- **Navigation Structure**: 
  - Header: Browse Services, Browse Builders, Find Your Builder, Getting Started, Dashboard, Messages
  - Footer: Platform links, Resources (including Help & FAQ and Admin Portal), Legal links
- **Key Features**: Dual token-gated access, comprehensive builder profiles with portfolios and services, advanced search and filtering, dedicated admin and client dashboards, a multi-step builder application system, and a visual builder onboarding checklist. The platform also includes a "Buy on Demand" section, PSX Agency promotion, and extensive legal/compliance pages.
- **Browse Pages**: Both Browse Services and Browse Builders use consistent filtering layouts with sidebar filters (categories, languages, rating, availability), search functionality, and grid-based card displays.

### Technical Implementations
- **Frontend**: React and TypeScript, TanStack Query for data fetching.
- **Backend**: Express and TypeScript, RESTful API.
- **Authentication**: Session-based for admin, RainbowKit + wagmi for unified wallet authentication, supporting $CREATE or $PSX token gating.
- **Data Storage**: PostgreSQL database with Drizzle ORM, managing schemas for Builders, Clients, Services, Orders, Payments, and more.
- **Order Management System**: Full lifecycle management including booking, status workflows, and revision tracking.
- **Smart Contract Escrow System**: On-chain USDC payment system on Base blockchain using `USDCEscrow.sol` for milestone-based releases, dispute resolution, platform fees, and automated refunds.
- **Real-Time Messaging System**: WebSocket-based chat with read receipts and file attachments.
- **Enhanced Review System**: Comprehensive platform for builder reviews, moderation, and dispute resolution.
- **Project Management System**: Tracking milestones, deliverables, and document repositories.
- **Builder Dashboard & Tools**: Interface for managing earnings, orders, services, and availability.
- **File Upload & Storage**: Replit Object Storage (Google Cloud Storage backend) with ACL and presigned URLs.
- **Financial Management System**: Admin dashboard with revenue analytics, payout queue, and escrow monitoring.
- **UI/UX Enhancement System**: Centralized system providing toast notifications, keyboard shortcuts, confirmation modals, loading skeletons, and empty states.
- **Builder Analytics & Growth Tools**: 8 specialized modules for builders covering profile optimization, service performance, lead management, review automation, pricing intelligence, revenue forecasting, message templates, and client relationship management.
- **Quick Win UX Enhancements**: Includes USDC balance display, empty state illustrations, breadcrumb navigation, price calculator widget, recently viewed tracker, theme toggle, enhanced keyboard shortcuts, action-enabled toast notifications, an FAQ chatbot, and specialized loading skeletons.
- **Real-Time Features**: Online/offline status tracking, live builder availability, typing indicators in chat, browser notifications, and unread message counters.
- **Advanced Search & Filtering System**: Features saved search preferences, builder favorites/collections, search history, filter presets, location/timezone filters, and language/communication preferences.
- **AI-Powered Builder Discovery & Matching System**: Utilizes OpenAI GPT-4o-mini for a "Find Your Builder Wizard" (quiz-based matching), "Similar Builders Engine" for recommendations, and "Smart Service Recommendations".

## Service Catalog
Create.psx features a comprehensive, Fiverr-level detailed service catalog with 12+ professional service offerings across 7 specialized categories:

### Categories
1. **Volume Services** - Custom volume generation and trend bots for any blockchain
2. **3D & 2D Content Creation** - Character design, animations, and token launch videos
3. **Social Media Management** - Professional social media and community management
4. **KOLs & Influencers** - KOL management, sourcing, and campaign coordination
5. **Script Development** - Smart contracts, websites, bots, and technical solutions
6. **Graphic Design** - Branding, marketing materials, and visual identity
7. **Social Media Management** - Dedicated category for Twitter, Discord, Telegram management

### Featured Services (All with 3-Tier Pricing: Basic/Standard/Premium)
- **Custom Volume Generation (Any Chain)** - $2.5K/$5K/$10K - Professional volume generation with custom patterns
- **Custom Makers & Transactions - Trend Bot** - $1.5K/$3.5K/$7.5K - Organic wallet activity and transaction patterns
- **3D & 2D Character Design** - $800/$1.5K/$3K - Custom characters for NFTs and memecoins
- **3D & 2D Animations** - $1.2K/$2.5K/$5K - Professional animations for launches and social media
- **Token Launch Video (3D & 2D)** - $1.5K/$3K/$6K - High-impact cinematic launch videos
- **Twitter & Social Media Management** - $800/$1.5K/$3K/month - Full social media management
- **KOL Management (Any Chain)** - $2K/$4K/$8K - End-to-end KOL campaign management
- **KOL Sourcing & Connecting** - $500/$1.2K/$2.5K - Verified KOL contacts and introductions
- **Website Landing Page** - $800/$1.5K/$3K - Professional Web3 landing pages
- **Full-Blown Website** - $3K/$6K/$12K - Complete Web3 platforms with advanced features
- **Farcaster Apps & Telegram Bots** - $1.2K/$2.5K/$5K - Custom bots and social integrations
- **Graphic Design - Branding & Marketing** - $400/$800/$1.5K - Complete brand identity packages

Each service includes detailed descriptions, specific deliverables per tier, delivery timeframes, tags, and PSX token requirements.

## Builder Profile System
Builder profiles are designed to match Fiverr's level of detail with 40+ profile fields:

### Core Profile Fields
- Name, headline, bio, detailed description
- Profile image, portfolio media, video showreel
- Verified status, category, PSX tier
- Rating, review count, completed projects
- Response time, success rate, on-time delivery rate

### Enhanced Fiverr-like Fields
- **Languages** - Multiple language support (e.g., English, Spanish, Mandarin)
- **Location & Timezone** - Country, city, timezone for coordination
- **Education** - Degrees, certifications, training
- **Work Experience** - Detailed work history and years of experience
- **Availability** - Current status (available/busy/away), hours per week
- **Specializations** - Specific areas of expertise (array)
- **Badges** - Achievement badges (Top Rated, Verified, Rising Talent)
- **FAQs** - Common questions and answers array
- **Social Profiles** - Twitter, Instagram, YouTube, Telegram, LinkedIn, GitHub, Website

### Category-Specific Fields
- **KOLs**: Follower counts, engagement rate, audience demographics, brand partnerships
- **3D Artists**: Software, render engines, style specialties, animation expertise
- **Marketers**: Platforms, growth strategies, case studies, average ROI
- **Developers**: Programming languages, blockchain frameworks, deployed contracts, certifications
- **Volume Traders**: Trading experience, volume capabilities, DEX/CEX expertise, compliance knowledge

### Performance Metrics
- Total earnings, available balance, pending payouts
- Profile views, response rate, trending status
- Active orders, total messages received/responded
- Last active timestamp, member since date

## External Dependencies
- **Blockchain Network**: Base (mainnet and Sepolia testnet)
- **Wallet SDK**: Base Account SDK
- **Payment Token**: USDC (ERC-20)
- **Access Tokens**: $CREATE (ERC-20 on Base) and $PSX (ERC-20 on Base)
- **AI Service**: OpenAI GPT-4o-mini via Replit AI Integrations
- **Styling Frameworks**: Tailwind CSS, Shadcn UI
- **Object Storage**: Replit Object Storage (Google Cloud Storage backend)