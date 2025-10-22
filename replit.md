## Overview
Create.psx is a dual token-gated Web3 marketplace designed to connect premium builders with clients in the memecoin and broader crypto space. Its primary goal is to ensure quality by requiring either $CREATE or $PSX token holdings for platform access. The platform features builder profiles, service listings, category-based browsing, administrative dashboards, comprehensive legal compliance pages, and a robust builder onboarding system. The long-term vision is to establish itself as the leading platform for Web3 talent, integrating secure on-chain payments and advanced project management tools.

## User Preferences
- Default theme: Dark mode with purple/cyan branding
- Design system follows design_guidelines.md
- Mobile-first responsive design
- Professional Web3 aesthetic
- **Typography**: Space Grotesk font (matching time.fun) loaded from Google Fonts, applied site-wide via CSS variable --font-sans
- **Animations**: Scroll-triggered reveal animations throughout (fadeInUp, fadeInLeft, fadeInRight, fadeInScale, slideInUp, zoomIn, bounceIn)

## System Architecture
Create.psx employs a decoupled frontend and backend architecture for enhanced scalability and maintainability.

### UI/UX Decisions
- **Branding**: Consistent purple/cyan gradient theme with equal prominence for both Create and PSX brands.
- **Design System**: Utilizes Tailwind CSS and Shadcn UI for a modern, responsive, and mobile-first design.
- **Key Features**:
    - **Dual Token-Gated Access**: Either $CREATE or $PSX token required for marketplace access and client tier assignment. Users only need to hold ONE of these tokens to gain access.
    - **Builder Profiles**: Comprehensive profiles with portfolios, services, reviews, dynamic skill arrays, and category-specific showcases.
    - **Previous Projects Showcase**: Detailed case studies with results, metrics, media, and testimonials.
    - **Service Listings**: Detailed service offerings with tiered pricing.
    - **Marketplace Browsing**: Comprehensive search and filtering system including full-text search, multi-select category filtering, price range, rating, delivery time filters, and mobile-responsive filter sheets.
    - **Admin & Client Dashboards**: Dedicated interfaces for administration and project management with secure authentication.
    - **Builder Application System**: Multi-step form wizard with category-specific questions. Features quiz-to-onboarding integration that pre-fills profile data based on quiz results.
    - **Builder Invite System**: Admin-managed private invite links that route through the "For Builders" landing page before onboarding. Invite links use format `/builders?invite={token}` to showcase platform benefits before application. Legacy `/builder-invite/{token}` links redirect to new flow for backward compatibility.
    - **Navigation Strategy**: 
      - **Navbar Links**: Browse Services, Browse Builders, Getting Started, Help (FAQ), Dashboard (when authenticated), Messages (when authenticated), Admin
      - **For Builders Landing**: Only accessible via builder onboarding flow (Become a Builder CTA, invite links) - NOT in navbar to reduce clutter
      - **How It Works**: Moved to footer Resources section for better UX - comprehensive help accessible but not cluttering main nav
      - **Footer Organization**: Platform (Browse Services, Find Builders, Become a Builder, Hire Builders), Resources (How It Works, Getting Started, FAQ, Builder Quiz), Legal (Terms, Privacy, Cookies)
    - **Buy on Demand Section**: Homepage section displaying builders who are currently live and available for instant booking. Features real-time status indicators, category filtering, and prominent "Live" badges with pulse animations. Builders control their live status via dashboard toggle.
    - **PSX Agency Promotion**: Dedicated homepage section for B2B services.
    - **Legal & Compliance Pages**: Comprehensive legal documentation including Terms of Service, Privacy Policy, Cookie Policy, and a searchable FAQ page.
    - **Builder Onboarding System**: A visual checklist guiding new builders through platform setup, profile completion, service listing, portfolio showcase, payment setup, and verification. Features expandable UI with icons, progress tracking, and motivational messaging.
    - **Onboarding & Help Resources**: 
      - **How It Works Page**: Platform overview explaining token gating, builder discovery, and project workflow
      - **Getting Started Guide**: Tabbed interface with client and builder-specific onboarding instructions
      - **Welcome Modal**: First-time user greeting with localStorage persistence
      - **Builder Quiz Integration**: 5-question assessment that pre-fills onboarding form with recommended category, experience-based headline, bio, and response time
      - **Dashboard Quick Actions**: 4 shortcut buttons (Create Service, View Profile, View Orders, Earnings) for rapid navigation
      - **Site-wide Footer**: Comprehensive navigation with Platform, Resources, Legal sections and social links

### Technical Implementations
- **Frontend**: React and TypeScript, TanStack Query for data fetching, custom Auth Contexts.
- **Backend**: Express and TypeScript, RESTful API structure.
- **Authentication**: 
  - **Admin**: Session-based authentication using `express-session` and `bcrypt` for password hashing
  - **Unified Wallet System**: RainbowKit integration (@rainbow-me/rainbowkit) with wagmi for all wallet connections
    - Single wallet connection point in header (WalletConnectButtonNew component)
    - Automatic user detection: when wallet connects, system checks if address is registered as builder or client
    - Auto-login: if wallet is registered, user is automatically logged in and routed to their dashboard
    - Used consistently across: header nav, become-client page, apply page, and all authenticated flows
    - Supports multiple wallets: Rabby, Phantom, OKX, MetaMask, Coinbase, Rainbow, and more via RainbowKit
- **Wallet Integration**: RainbowKit + wagmi for wallet connection, network verification (Base mainnet/Sepolia), and ERC-20 token balance checking for both $CREATE and $PSX tokens.
  - **$CREATE Token**: Contract address `0x3849cC93e7B71b37885237cd91a215974135cD8D` on Base network
  - **$PSX Token**: Contract address loaded from environment variable `VITE_PSX_TOKEN_ADDRESS`
  - **Token-Gating Logic**: Users need to hold the minimum required amount of EITHER $CREATE OR $PSX (not both). The system checks both balances in parallel and grants access if either token meets the requirement.
  - **Wallet Auth Hook**: `useWalletAuth` hook provides: wallet address, connection status, registration status (builder/client/none), auto-login functionality
  - **Backend Endpoints**: 
    - `GET /api/auth/wallet/:address` - Check if wallet is registered and return user type
    - `GET /api/wallet-status` - Check current connected wallet status (used for auto-login)
- **Data Storage**: PostgreSQL database with Drizzle ORM.
- **Data Models**: Comprehensive schemas for Builders, Clients, Services, Orders, Payments, Reviews, Applications, and various other platform entities.
- **Order Management System**: Full order booking and management with status workflows, revision tracking, and activity logging.
- **Payment Integration**: Comprehensive USDC payment system on Base blockchain using Base Pay SDK, featuring smart contract-based escrow, milestone releases, platform fees, automated payouts, and dispute resolution. Supports optional project allocation offers (equity/tokens/revenue share) in addition to USDC payments for flexible builder compensation.
- **Real-Time Messaging System**: WebSocket-based chat for client-builder communication with project/order-based threads, multiple message types, read receipts, and file attachments.
- **Enhanced Review System**: Comprehensive review platform with builder responses, admin moderation, community voting, and dispute system.
- **Project Management System**: Includes milestone and deliverable tracking, builder submission workflow, client review, and a centralized document repository.
- **Builder Dashboard & Tools**: Interface for builders including earnings overview, order management, service listings, performance analytics, and availability management.
- **Social & Community Features**: Builder follow system, activity feed, community badges, and testimonials.
- **Analytics & Insights**: Platform-wide statistics dashboard with market insights, client analytics, and builder performance metrics.
- **Progressive Web App (PWA)**: Full PWA implementation with service worker for offline functionality and installability.
- **Mobile Optimization**: Enhanced responsive design with touch-friendly spacing and mobile-specific layouts.
- **Comprehensive Notification System**: Full-featured notification infrastructure with:
  - **In-App Notification Center**: Bell icon with unread badge, popover panel with all/unread tabs, mark as read, delete notifications
  - **Real-Time Toast Notifications**: Auto-shows toasts for new events, polls every 15 seconds, supports all notification types with emoji icons
  - **Notification Settings Page**: Granular preferences for Email, Push, and In-App channels at `/settings/notifications`
  - **Universal Support**: Works for both clients and builders with correct userType routing
  - **Backend Integration**: Leverages existing `/api/notifications` endpoints and `server/notifications.ts` helper functions
- **File Upload & Storage System**: Complete file upload and storage infrastructure using Replit Object Storage (Google Cloud Storage backend) with granular ACL, presigned URLs, and various upload types.
- **Advanced Search & Filtering**: Comprehensive marketplace search functionality with header search bar (desktop & mobile) that redirects to marketplace with query parameter, full-text search, category, price, rating, delivery time filters, tag-based filtering, and builder-specific filters.
- **Profile & Service Management**: Complete management tools for builders and clients, including profile editing, service creation, editing, deletion, and archiving with ownership verification.
- **Comprehensive Taxonomy System**: Three-tier hierarchy (Categories > Services > Tags) for organizing and discovering platform offerings:
  - **Categories (8 main verticals)**: Creative & Design, 3D Content Creation, Marketing & Growth, KOLs & Influencers, Script Development, Audio & Production, Volume Services, Connectors & Network
  - **Services (35+ specific offerings)**: Standalone service templates like "Graphic Design", "Smart Contract Development", "Music Production" that can be browsed in marketplace
  - **Tags (50+ skills/tools)**: Metadata for discovery including software (Photoshop, Blender, Solidity), platforms (Twitter, Discord), and specialties (UI/UX, Viral Marketing)
  - **Service Structure**: Services WITHOUT builders (builder_id = null) appear in marketplace as browsable offerings; services WITH builders only show on builder profiles
  - **Marketplace Display**: Filters services to show only standalone templates, allowing users to browse by category and filter by tags
  - **Tag Filtering**: Backend supports tag-based search allowing users to find services by specific skills, tools, or technologies
  - Full taxonomy documented in TAXONOMY.md

## External Dependencies
- **Blockchain Network**: Base (mainnet and Sepolia testnet)
- **Wallet SDK**: Base Account SDK (`@base-org/account`)
- **Payment Token**: USDC (ERC-20)
- **Access Tokens**: $CREATE (0x3849cC93e7B71b37885237cd91a215974135cD8D) and $PSX (ERC-20 tokens on Base)
- **Token Standard**: ERC-20 (for $CREATE, $PSX, and USDC)
- **Styling Frameworks**: Tailwind CSS, Shadcn UI
- **Object Storage**: Replit Object Storage (Google Cloud Storage backend)