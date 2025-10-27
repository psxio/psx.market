## Overview
port444 is a Web3 marketplace designed to connect premium builders with clients in the memecoin and broader crypto space. It features dual token incentives ($CREATE and $PSX) for reduced fees and exclusive benefits. The platform offers comprehensive builder profiles, service listings, category-based browsing, administrative tools, legal compliance, robust builder onboarding, and AI-powered builder discovery and matching. The long-term vision is to become the leading hub for Web3 talent, integrating secure on-chain payments and advanced project management.

## User Preferences
- Default theme: Dark mode with purple/cyan branding
- Design system follows design_guidelines.md
- Mobile-first responsive design
- Professional Web3 aesthetic
- Typography: Space Grotesk font (matching time.fun) loaded from Google Fonts, applied site-wide via CSS variable --font-sans
- Animations: Scroll-triggered reveal animations throughout (fadeInUp, fadeInLeft, fadeInRight, fadeInScale, slideInUp, zoomIn, bounceIn)
- Navigation: Help and Admin links moved to footer (not in navbar)

## System Architecture
port444 utilizes a decoupled frontend and backend architecture, built with React/TypeScript for the frontend and Express/TypeScript for the backend.

### UI/UX Decisions
- **Branding**: "port444" with a purple/cyan gradient theme, powered by $CREATE and $PSX tokens.
- **Design System**: Tailwind CSS and Shadcn UI for a modern, responsive, mobile-first design.
- **Navigation**: Header with core links (Browse Services, Browse Builders, Getting Started, Dashboard, Messages) and a footer for platform, resources, and legal links.
- **Homepage ("Buy on Demand")**: Fiverr-style, category-driven marketplace with a hero section. Features real-time category filtering, project token tickers on service/builder cards, token perks, CTAs, token holder benefits, and PSX Agency promotion.
- **Getting Started Page**: Dual-tab onboarding for clients (wallet setup, builder search tips, AI matching wizard, workflow, payments, reviews) and builders (value proposition, benefits, 4-step application, payment/escrow flow, CTAs).
- **Key Features**: Dual token incentive system, detailed builder profiles, advanced search/filtering, admin/client dashboards, multi-step builder application, visual onboarding checklist, "Buy on Demand" homepage, PSX Agency promotion, and legal/compliance documentation.
- **Browse Pages**: Consistent layouts for services, builders, and portfolios with search and filtering.
  - **Browse Services**: Grid-based service listings with category filters
  - **Browse Builders**: Advanced sidebar filters (categories, delivery time, rating, languages, budget range $0-$20k+ with $500 increments, availability, verified status)
  - **Browse Portfolios**: NEW Pinterest-style masonry layout (/portfolios) for visual portfolio discovery. Search across all builder work by keywords (e.g., "schizo art", "token launch"), click-through to builder profiles. Aggregates builder portfolioMedia and builderProjects with project details.

### Technical Implementations
- **Frontend**: React and TypeScript with TanStack Query.
- **Backend**: Express and TypeScript, providing a RESTful API.
- **Authentication**: Session-based for admins; RainbowKit + wagmi for unified wallet authentication, enabling token-based benefits.
- **Token Incentive System**: Benefits for $CREATE or $PSX holders include reduced platform fees (1% vs 2.5%), priority support, badges, early access, and exclusive services, applied automatically based on real-time token balance checks.
- **Data Storage**: PostgreSQL with Drizzle ORM, including schemas for Builders, Clients, Services, Orders, and Payments.
- **Smart Contract Escrow System**: On-chain USDC payments on Base using `USDCEscrow.sol` for milestone releases, dispute resolution, fees, and refunds. Includes frontend UI for USDC approval, balance checks, and transaction tracking.
- **Real-Time Messaging**: WebSocket-based chat with read receipts and file attachments.
- **File Upload & Storage**: Replit Object Storage (Google Cloud Storage) with ACL and presigned URLs.
- **AI-Powered Builder Discovery & Matching**: OpenAI GPT-4o-mini for a client-facing matching wizard, "Similar Builders Engine," and "Smart Service Recommendations."
- **Notification System**: Comprehensive system with browser push, email notifications (for offline builders, daily/weekly digests), real-time counters, and read/unread tracking.
- **SEO & Discovery**: Dynamic meta tags, OpenGraph, Schema.org structured data, and dynamic sitemap generation.
- **Smart Recommendations Engine**: Collaborative filtering, AI-powered price optimization, and success prediction scores.
- **Builder Profile System**: Over 50 fields including core info, enhanced fields (languages, location, education), social links (X/Twitter, Discord server invites), category-specific fields (KOLs, 3D artists, video editors, mods & raiders, marketers, developers, volume traders), performance metrics, and specialized layouts for certain consulting roles. Social links are prominently displayed on builder profiles for instant client connection.

## External Dependencies
- **Blockchain Network**: Base (mainnet and Sepolia testnet)
- **Wallet SDK**: Base Account SDK
- **Payment Token**: USDC (ERC-20)
- **Incentive Tokens**: $CREATE (ERC-20 on Base), $PSX (ERC-20 on Base)
- **AI Service**: OpenAI GPT-4o-mini via Replit AI Integrations
- **Styling Frameworks**: Tailwind CSS, Shadcn UI
- **Object Storage**: Replit Object Storage (Google Cloud Storage backend)