## Overview
port444 is a Web3 marketplace connecting premium builders with clients in the memecoin and broader crypto space, offering dual token incentives ($CREATE and $PSX) for reduced fees and exclusive benefits. The platform aims to be the leading hub for Web3 talent by providing comprehensive builder profiles, service listings, category-based browsing, administrative tools, legal compliance, robust builder onboarding, and AI-powered discovery and matching. The long-term vision includes secure on-chain payments and advanced project management.

## User Preferences
- Default theme: Light mode with purple/cyan branding (dark mode available via toggle)
- Design system follows design_guidelines.md
- Mobile-first responsive design
- Professional Web3 aesthetic
- Typography: Space Grotesk font (matching time.fun) loaded from Google Fonts, applied site-wide via CSS variable --font-sans
- Animations: Scroll-triggered reveal animations throughout (fadeInUp, fadeInLeft, fadeInRight, fadeInScale, slideInUp, zoomIn, bounceIn)
- Navigation: Help and Admin links moved to footer (not in navbar)

## System Architecture
port444 uses a decoupled frontend and backend architecture, built with React/TypeScript for the frontend and Express/TypeScript for the backend.

### UI/UX Decisions
- **Branding**: Purple/cyan gradient theme, powered by $CREATE and $PSX tokens, with a Base blue primary color.
- **Design System**: Tailwind CSS and Shadcn UI for a modern, responsive, mobile-first design, inspired by Fiverr and NFT marketplaces.
- **Navigation**: Header with core links and a footer for platform, resources, and legal links.
- **Homepage ("Buy on Demand")**: Fiverr-style, category-driven marketplace with a clean hero section, real-time category filtering, token perks, CTAs, and PSX Agency promotion. Features an autocomplete search bar and follows design guidelines with clean Base blue aesthetic.
- **Browse Pages**: Consistent Fiverr-style layouts for services, builders, and portfolios with search and advanced sidebar filtering.
- **Getting Started Page**: Dual-tab onboarding for clients and builders, covering wallet setup, builder search tips, AI matching, workflow, payments, reviews, value proposition, and application process.
- **Chapters Onboarding**: Complete 4-step onboarding flow for Based Creators chapters members: (1) Basic Info, (2) Professional Details, (3) Profile Photo, (4) Service Creation. Creates accounts on both port444 and Based Creators with services live immediately.

### Technical Implementations
- **Frontend**: React and TypeScript with TanStack Query.
- **Backend**: Express and TypeScript, providing a RESTful API.
- **Authentication**: Session-based for admins; RainbowKit + wagmi for wallet connections; Privy for social authentication (Google, Twitter, Discord, Email) with embedded wallet support for users without wallets.
- **Token Incentive System**: Benefits for $CREATE or $PSX holders based on real-time token balance checks.
- **Data Storage**: PostgreSQL with Drizzle ORM.
- **Smart Contract Escrow System**: On-chain USDC payments on Base using `USDCEscrow.sol` for milestone releases, dispute resolution, fees, and refunds, with integrated frontend UI.
- **Real-Time Messaging**: WebSocket-based chat with read receipts and file attachments.
- **File Upload & Storage**: Replit Object Storage with ACL and presigned URLs.
- **Twitter/X API Integration**: Full Twitter API v2 integration for profile verification, auto-fill during onboarding, real-time follower counts, verified status checking, and social profile data fetching. Uses OAuth 2.0 Bearer token for authenticated requests.
- **AI-Powered Builder Discovery & Matching**: OpenAI GPT-4o-mini for a client-facing matching wizard, "Similar Builders Engine," and "Smart Service Recommendations."
- **Notification System**: Comprehensive system with browser push, email notifications, real-time counters, and read/unread tracking.
- **SEO & Discovery**: Dynamic meta tags, OpenGraph, Schema.org structured data, and dynamic sitemap generation.
- **Smart Recommendations Engine**: Collaborative filtering, AI-powered price optimization, and success prediction scores.
- **Builder Profile System**: Comprehensive fields including core info, enhanced fields, social links, category-specific fields, performance metrics, and specialized layouts.
- **URL Synchronization**: Complete URL parameter synchronization for shareable filter states across marketplace pages, maintaining filter persistence on reload.
- **Cross-Platform Integration**: Seamless 2-way account synchronization between port444 and Based Creators using a `cross_platform_users` table and API endpoints for account creation and linking.
- **Invite Systems**: Builder invite system (peer-to-peer) and Based Creators Chapters invite system with dedicated 4-step onboarding including mandatory service creation during registration.

## External Dependencies
- **Blockchain Network**: Base (mainnet and Sepolia testnet)
- **Wallet SDK**: Base Account SDK
- **Payment Token**: USDC (ERC-20)
- **Incentive Tokens**: $CREATE (ERC-20 on Base), $PSX (ERC-20 on Base)
- **AI Service**: OpenAI GPT-4o-mini via Replit AI Integrations
- **Twitter/X API**: Twitter API v2 with OAuth 2.0 for profile verification and social data
- **Authentication Provider**: Privy for social logins (Google, Twitter, Discord, Email) and embedded wallets
- **Styling Frameworks**: Tailwind CSS, Shadcn UI
- **Object Storage**: Replit Object Storage (Google Cloud Storage backend)