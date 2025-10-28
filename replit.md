## Overview
port444 is a Web3 marketplace connecting premium builders with clients in the memecoin and broader crypto space. It offers dual token incentives ($CREATE and $PSX) for reduced fees and exclusive benefits. The platform provides comprehensive builder profiles, service listings, category-based browsing, administrative tools, legal compliance, robust builder onboarding, and AI-powered builder discovery and matching. The long-term vision is to become the leading hub for Web3 talent, integrating secure on-chain payments and advanced project management.

## Recent Changes (Oct 28, 2025 - Latest)

### 🚀 Complete Fiverr-Style UI Redesign
**Comprehensive homepage transformation based on Fiverr.com and NFT marketplace design principles**

**1. Hero Section - Minimal Interactive**:
- ✅ **Animated mesh gradient background**: Three floating gradient orbs with subtle animations (20-25s duration), enhanced opacity in dark mode
- ✅ **Gradient text headline**: "Premium Web3 builders will take it from here" with primary-to-cyan gradient
- ✅ **Functional autocomplete search**: h-16 card-style search bar with real-time suggestions, keyboard navigation (arrows, enter, escape), and direct navigation to marketplace with search query
- ✅ **Search suggestions**: Recent searches when empty, filtered suggestions for 11 categories (KOL, Volume, 3D, Grants, Strategy, Documentation, Development, Social Media, Graphic Design, Marketing, etc.)
- ✅ **Quick-search category pills**: Horizontal pills with hover state transformations to primary color
- ✅ **Trust badges section**: "Powered by: Base, $CREATE, $PSX" with card-style badges and hover elevation
- ✅ **Navbar simplification**: Removed search from navbar (consolidated into hero search for cleaner UX)

**2. Token Benefits Banner**:
- ✅ **Horizontal icon cards**: Three benefit cards (Token Holder Perks, Priority Support, Verified Badge)
- ✅ **Clean layout**: Icon circles with 2-line text descriptions
- ✅ **Muted background**: bg-muted/30 for subtle elevation

**3. Explore Services Section**:
- ✅ **Cleaner hierarchy**: Separated section with clear heading
- ✅ **Compact category cards**: p-4 md:p-5 padding, h-6 w-6 md:h-7 md:w-7 icons
- ✅ **Better spacing**: gap-3 md:gap-4 grid gaps
- ✅ **Focus on content**: Reduced chrome, more white space
- ✅ **Category cards as links**: Direct links to marketplace filtered by category

**4. Top Builders Section - Fiverr Style**:
- ✅ **Image-first builder cards**: Large aspect-square profile images with hover scale effect
- ✅ **Prominent rating display**: Star icon with rating number and review count
- ✅ **Key stats**: Completed projects count, starting price, location
- ✅ **Status badges**: Online status (green badge), verified badge (Shield icon)
- ✅ **Grid layout**: sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- ✅ **Sorted by rating**: Fetches top 12 builders sorted by rating via /api/builders
- ✅ **Clean card design**: border-2, hover-elevate, active-elevate-2
- ✅ **Builder info**: Name, location (MapPin icon), specialization, hourly rate
- ✅ **Fixed routing**: Links to /builder/{id} (singular)

**Design Philosophy Applied**:
- 📐 **NFT Marketplace Principles**: Neutral backgrounds let content shine, information hierarchy, keep it simple
- 🎨 **Fiverr Patterns**: Image-first approach, prominent search, category pills, trust badges, clean cards
- ✨ **More white space**: Generous padding and spacing throughout
- 🔍 **Content-first**: UI chrome minimized, focus on services and builders

**Impact**: Clean, professional, mass-adoption-ready marketplace design inspired by industry leaders

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
- **Navigation**: Header with core links and a footer for platform, resources, and legal links.
- **Homepage ("Buy on Demand")**: Fiverr-style, category-driven marketplace with a hero section, real-time category filtering, project token tickers, token perks, CTAs, token holder benefits, and PSX Agency promotion.
- **Getting Started Page**: Dual-tab onboarding for clients and builders, covering wallet setup, builder search tips, AI matching, workflow, payments, reviews, value proposition, and application process.
- **Key Features**: Dual token incentive system, detailed builder profiles, advanced search/filtering, admin/client dashboards, multi-step builder application, visual onboarding checklist, "Buy on Demand" homepage, PSX Agency promotion, and legal/compliance.
- **Browse Pages**: Consistent layouts for services, builders, and portfolios with search and filtering. Includes an advanced sidebar filter for builders and a Pinterest-style masonry layout for portfolios.

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
- **Builder Profile System**: Over 50 fields including core info, enhanced fields, social links, category-specific fields, performance metrics, and specialized layouts.

## External Dependencies
- **Blockchain Network**: Base (mainnet and Sepolia testnet)
- **Wallet SDK**: Base Account SDK
- **Payment Token**: USDC (ERC-20)
- **Incentive Tokens**: $CREATE (ERC-20 on Base), $PSX (ERC-20 on Base)
- **AI Service**: OpenAI GPT-4o-mini via Replit AI Integrations
- **Styling Frameworks**: Tailwind CSS, Shadcn UI
- **Object Storage**: Replit Object Storage (Google Cloud Storage backend)