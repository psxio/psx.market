## Overview
Create.psx is a dual token-gated Web3 marketplace connecting premium builders with clients in the memecoin and crypto space. Its core purpose is to ensure quality by requiring $CREATE or $PSX token holdings for platform access. The platform features builder profiles, service listings, category-based browsing, administrative dashboards, legal compliance, and a robust builder onboarding system. The long-term vision is to become the leading platform for Web3 talent, integrating secure on-chain payments and advanced project management.

## User Preferences
- Default theme: Dark mode with purple/cyan branding
- Design system follows design_guidelines.md
- Mobile-first responsive design
- Professional Web3 aesthetic
- **Typography**: Space Grotesk font (matching time.fun) loaded from Google Fonts, applied site-wide via CSS variable --font-sans
- **Animations**: Scroll-triggered reveal animations throughout (fadeInUp, fadeInLeft, fadeInRight, fadeInScale, slideInUp, zoomIn, bounceIn)

## System Architecture
Create.psx employs a decoupled frontend and backend architecture.

### UI/UX Decisions
- **Branding**: Consistent purple/cyan gradient with equal prominence for Create and PSX brands.
- **Design System**: Tailwind CSS and Shadcn UI for a modern, responsive, mobile-first design.
- **Key Features**:
    - **Dual Token-Gated Access**: $CREATE or $PSX token required for marketplace access and client tier assignment.
    - **Builder Profiles**: Comprehensive profiles with portfolios, services, reviews, dynamic skill arrays, and category-specific showcases.
    - **Previous Projects Showcase**: Detailed case studies with results, metrics, media, and testimonials.
    - **Service Listings**: Detailed service offerings with tiered pricing.
    - **Marketplace Browsing**: Comprehensive search and filtering system.
    - **Admin & Client Dashboards**: Dedicated interfaces for administration and project management with secure authentication.
    - **Advanced Admin Analytics Dashboard**: Comprehensive analytics including platform health score, interactive charts (Recharts), real-time activity feed, growth metrics, top performers widget, conversion funnel visualization, quick actions panel, and comprehensive stats.
    - **Builder Application System**: Multi-step form wizard with category-specific questions and quiz-to-onboarding integration.
    - **Builder Invite System**: Admin-managed private invite links for onboarding.
    - **Navigation Strategy**: Clear separation of public, authenticated, and builder-specific content, with a well-organized footer.
    - **Buy on Demand Section**: Homepage section displaying live, available builders with real-time status and category filtering.
    - **PSX Agency Promotion**: Dedicated homepage section for B2B services.
    - **Legal & Compliance Pages**: Comprehensive legal documentation and searchable FAQ.
    - **Builder Onboarding System**: Visual checklist for new builders including profile setup, service listing, payment setup, and verification.
    - **Onboarding & Help Resources**: How It Works page, Getting Started Guide, Welcome Modal, Builder Quiz integration, and Dashboard Quick Actions.

### Technical Implementations
- **Frontend**: React and TypeScript, TanStack Query for data fetching, custom Auth Contexts.
- **Backend**: Express and TypeScript, RESTful API.
- **Authentication**:
  - **Admin**: Session-based using `express-session` and `bcrypt`.
  - **Unified Wallet System**: RainbowKit integration with wagmi for all wallet connections, automatic user detection, and auto-login for registered users. Supports multiple wallets.
- **Wallet Integration**: RainbowKit + wagmi for wallet connection, network verification (Base mainnet/Sepolia), and ERC-20 token balance checking for $CREATE and $PSX tokens. Token-gating requires holding either token, not both. `useWalletAuth` hook for wallet status.
- **Data Storage**: PostgreSQL database with Drizzle ORM.
- **Data Models**: Comprehensive schemas for Builders, Clients, Services, Orders, Payments, Reviews, Applications, and other entities.
- **Order Management System**: Full order booking, management, status workflows, revision tracking, and activity logging.
- **Payment Integration**: Comprehensive USDC payment system on Base blockchain using Base Pay SDK, featuring smart contract-based escrow, milestone releases, platform fees, automated payouts, and dispute resolution. Supports optional project allocation offers.
- **Real-Time Messaging System**: WebSocket-based chat for client-builder communication with project/order-based threads, read receipts, and file attachments.
- **Enhanced Review System**: Comprehensive review platform with builder responses, admin moderation, community voting, and dispute system.
- **Project Management System**: Milestone and deliverable tracking, builder submission workflow, client review, and centralized document repository.
- **Builder Dashboard & Tools**: Interface for builders including earnings, order management, service listings, performance analytics, and availability.
- **Social & Community Features**: Builder follow system, activity feed, community badges, and testimonials.
- **Analytics & Insights**: Platform-wide statistics dashboard with market insights, client analytics, and builder performance metrics.
- **Progressive Web App (PWA)**: Full PWA implementation for offline functionality and installability.
- **Mobile Optimization**: Enhanced responsive design with touch-friendly spacing and mobile-specific layouts.
- **Comprehensive Notification System**: In-app notification center, real-time toast notifications, and granular notification settings.
- **File Upload & Storage System**: Replit Object Storage (Google Cloud Storage backend) with ACL, presigned URLs, and various upload types.
- **Advanced Search & Filtering**: Comprehensive marketplace search functionality with full-text search, category, price, rating, delivery time, and tag-based filtering.
- **Profile & Service Management**: Complete management tools for builders and clients, including profile editing, service creation, editing, deletion, and archiving with ownership verification.
- **Comprehensive Taxonomy System**: Three-tier hierarchy (Categories > Services > Tags) for organizing offerings. Categories are main verticals, services are specific offerings, and tags are skills/tools. Services without builders are browsable; with builders, they appear on profiles.
- **Financial Management System**: Comprehensive admin financial dashboard with payment dashboard, revenue analytics (Recharts), payout queue, transaction history, failed payment recovery, escrow monitoring, platform fee manager, and exportable financial reports.
- **UI/UX Enhancement System**: Centralized system for improved user experience including: Toast Notification Center, Keyboard Shortcuts, Confirmation Modals, Undo/Redo System, Data Density Options, Loading Skeletons, and Empty States, managed by a `UIEnhancementsProvider`.

## External Dependencies
- **Blockchain Network**: Base (mainnet and Sepolia testnet)
- **Wallet SDK**: Base Account SDK (`@base-org/account`)
- **Payment Token**: USDC (ERC-20)
- **Access Tokens**: $CREATE (0x3849cC93e7B71b37885237cd91a215974135cD8D) and $PSX (ERC-20 tokens on Base)
- **Token Standard**: ERC-20 (for $CREATE, $PSX, and USDC)
- **Styling Frameworks**: Tailwind CSS, Shadcn UI
- **Object Storage**: Replit Object Storage (Google Cloud Storage backend)