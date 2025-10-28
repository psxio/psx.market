## Overview
port444 is a Web3 marketplace connecting premium builders with clients in the memecoin and broader crypto space. It offers dual token incentives ($CREATE and $PSX) for reduced fees and exclusive benefits. The platform provides comprehensive builder profiles, service listings, category-based browsing, administrative tools, legal compliance, robust builder onboarding, and AI-powered builder discovery and matching. The long-term vision is to become the leading hub for Web3 talent, integrating secure on-chain payments and advanced project management.

## Recent Changes (October 28, 2025)
- **Comprehensive Parallax System**: Implemented dramatic multi-layer parallax scrolling throughout homepage with 2-3x intensity for clear visual impact
  - Hero section: 8 layers moving at different speeds (background blobs, title, description, search, buttons, badges)
  - Categories: 150px slide-up entrance with 90-100% scale animation
  - Service cards: 25px wave motion with sine waves
  - Builder cards: 20px floating motion with staggered delays
  - All effects use GPU-accelerated translate3d() with requestAnimationFrame for 60fps
- **Smooth Section Transitions**: Removed all border lines, added gradient overlays between sections for seamless flow
- **Transparent Navbar**: Fixed positioning with backdrop-blur, floats over hero section
- **Full-Screen Hero**: Takes entire viewport on load (h-screen), scroll indicator at proper position
- **Database Seeding**: Created comprehensive seed script (`server/seed-builders.ts`) with 5 professional builder profiles and services
- **Builder Profile Images**: Generated 5 AI-powered professional headshots and 5 portfolio images for diverse Web3 talent (3D Artist, Developer, KOL, Designer, Video Editor)
- **Token Benefits UI**: Converted large banner to subtle green hover tooltip next to "Buy on Demand" heading for seamless page flow

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
- **Branding**: "port444" with a purple/cyan gradient theme, powered by $CREATE and $PSX tokens, with a Base blue primary color.
- **Design System**: Tailwind CSS and Shadcn UI for a modern, responsive, mobile-first design, inspired by Fiverr and NFT marketplaces.
- **Navigation**: Header with core links and a footer for platform, resources, and legal links.
- **Homepage ("Buy on Demand")**: Fiverr-style, category-driven marketplace with a clean hero section, real-time category filtering, token perks (subtle hover tooltip), CTAs, and PSX Agency promotion. Features a functional autocomplete search bar and follows design guidelines with clean Base blue aesthetic.
- **Browse Pages**: Consistent Fiverr-style layouts for services, builders, and portfolios with search and advanced sidebar filtering. Services feature an image-first card design with hover effects, prominent ratings, and token tickers. Builder cards include aspect-square profile images, ratings, key stats, and status badges.
- **Getting Started Page**: Dual-tab onboarding for clients and builders, covering wallet setup, builder search tips, AI matching, workflow, payments, reviews, value proposition, and application process.

### Technical Implementations
- **Frontend**: React and TypeScript with TanStack Query.
- **Backend**: Express and TypeScript, providing a RESTful API.
- **Authentication**: Session-based for admins; RainbowKit + wagmi for unified wallet authentication with token-based benefits.
- **Token Incentive System**: Benefits for $CREATE or $PSX holders (reduced fees, priority support, badges, early access) based on real-time token balance checks.
- **Data Storage**: PostgreSQL with Drizzle ORM, including schemas for Builders, Clients, Services, Orders, and Payments.
- **Smart Contract Escrow System**: On-chain USDC payments on Base using `USDCEscrow.sol` for milestone releases, dispute resolution, fees, and refunds, with integrated frontend UI.
- **Real-Time Messaging**: WebSocket-based chat with read receipts and file attachments.
- **File Upload & Storage**: Replit Object Storage (Google Cloud Storage) with ACL and presigned URLs.
- **AI-Powered Builder Discovery & Matching**: OpenAI GPT-4o-mini for a client-facing matching wizard, "Similar Builders Engine," and "Smart Service Recommendations."
- **Notification System**: Comprehensive system with browser push, email notifications, real-time counters, and read/unread tracking.
- **SEO & Discovery**: Dynamic meta tags, OpenGraph, Schema.org structured data, and dynamic sitemap generation.
- **Smart Recommendations Engine**: Collaborative filtering, AI-powered price optimization, and success prediction scores.
- **Builder Profile System**: Comprehensive fields including core info, enhanced fields, social links, category-specific fields, performance metrics, and specialized layouts.
- **URL Synchronization**: Complete URL parameter synchronization for shareable filter states across marketplace pages, maintaining filter persistence on reload and using `replaceState` for clean history management.

## External Dependencies
- **Blockchain Network**: Base (mainnet and Sepolia testnet)
- **Wallet SDK**: Base Account SDK
- **Payment Token**: USDC (ERC-20)
- **Incentive Tokens**: $CREATE (ERC-20 on Base), $PSX (ERC-20 on Base)
- **AI Service**: OpenAI GPT-4o-mini via Replit AI Integrations
- **Styling Frameworks**: Tailwind CSS, Shadcn UI
- **Object Storage**: Replit Object Storage (Google Cloud Storage backend)