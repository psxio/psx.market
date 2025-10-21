# create.psx

## Overview
create.psx is a token-gated Web3 marketplace connecting premium builders with clients in the memecoin and broader crypto space. Its core purpose is quality assurance, achieved by requiring $PSX token holdings for access. The platform features builder profiles, service listings, category-based browsing, and an administrative dashboard. The long-term vision is to become the leading platform for Web3 talent, incorporating secure on-chain payments and robust project management.

## User Preferences
- Default theme: Dark mode with purple/cyan branding
- Design system follows design_guidelines.md
- Mobile-first responsive design
- Professional Web3 aesthetic

## System Architecture
create.psx is built with a clear separation between its frontend and backend for scalability and maintainability.

### UI/UX Decisions
- **Branding**: Consistent purple/cyan gradient theme.
- **Design System**: Utilizes Tailwind CSS and Shadcn UI for a modern, responsive, and mobile-first design.
- **Key Features**:
    - **Token-Gated Access**: $PSX token required for marketplace access and client tier assignment.
    - **Builder Profiles**: Comprehensive profiles with portfolios, services, reviews, dynamic skill arrays, and category-specific showcases (KOL social metrics, 3D visuals, marketing ROI, development GitHub, volume trading proof).
    - **Previous Projects Showcase**: Detailed case studies with results, metrics, media, and testimonials.
    - **Service Listings**: Detailed service offerings with tiered pricing.
    - **Marketplace Browsing**: Advanced search, filtering, and category-based navigation (KOLs, 3D Content, Marketing, Development, Volume).
    - **Admin & Client Dashboards**: Dedicated interfaces for administration and project management with secure authentication.
    - **Builder Application System**: Multi-step form wizard with category-specific questions.
    - **PSX Agency Promotion**: Dedicated homepage section for B2B services.

### Technical Implementations
- **Frontend**: React and TypeScript, TanStack Query for data fetching, custom Auth Contexts.
- **Backend**: Express and TypeScript, RESTful API structure.
- **Authentication**: Session-based authentication using `express-session`; `bcrypt` for admin password hashing; Base Account SDK for client wallet connection.
- **Wallet Integration**: Base Account SDK for wallet connection, network verification (Base mainnet/Sepolia), and ERC-20 $PSX token balance checking.
- **Data Storage**: Currently uses in-memory storage (`MemStorage`) for development.
- **Data Models**: Comprehensive schemas for Builders, Builder Projects, Clients, Services, Categories, Reviews, Review Votes, Review Disputes, Builder Applications, Admins, Referrals, Orders, Order Revisions, Order Activities, Payments, Milestones, Payouts, Disputes, Refunds, Invoices, Chat Threads, Messages, Message Read Receipts, Message Attachments, Project Deliverables, Progress Updates, Project Documents, Builder Follows, Builder Activity Feed, Builder Badges, Builder Testimonials, Builder View Tracking, Platform Statistics, Builder Application Revisions, and Builder Onboarding.
- **Order Management System**: Full order booking and management with status workflows, revision tracking, activity logging, and client/builder dashboards.
- **Payment Integration**: Comprehensive USDC payment system on Base blockchain using Base Pay SDK. Features smart contract-based escrow with milestone releases, configurable platform fees, automated payouts, transaction history, invoice generation, dispute resolution, and refund processing.
- **Real-Time Messaging System**: WebSocket-based chat for client-builder communication with project/order-based threads, multiple message types, read receipts, file attachments, and real-time updates.
- **Enhanced Review System**: Comprehensive review platform with builder responses, admin moderation, community voting, dispute system with arbitration, and optional on-chain verification.
- **Project Management System**: Includes milestone and deliverable tracking, builder submission workflow, client review, progress reporting, and a centralized document repository with version control.
- **Builder Dashboard & Tools**: Comprehensive interface for builders including earnings overview, order management, service listings, performance analytics (response time, success rate, on-time delivery), and availability management.
- **Social & Community Features**: Builder follow system allowing clients to follow their favorite builders, activity feed tracking for builder updates, community badges (verified, top-rated, fast-response), testimonials with admin approval, and profile view tracking with analytics.
- **Analytics & Insights**: Platform-wide statistics dashboard with market insights, client analytics showing spending patterns and project history, builder performance metrics, category performance tracking, and comprehensive view statistics.
- **Enhanced Builder Application System**: Application status tracking, revision request workflow with admin feedback, applicant resubmission portal, automated onboarding checklist after approval (profile setup, service listing, portfolio addition, payment configuration, verification), and progress tracking.
- **Progressive Web App (PWA)**: Full PWA implementation with service worker for offline functionality, app manifest for installability, app icons (192x192, 512x512), mobile-optimized meta tags, install prompt component with iOS/Android support, and cache-first strategy for static assets. Users can install create.psx as a standalone app on mobile and desktop devices.
- **Mobile Optimization**: Enhanced responsive design with touch-friendly spacing, mobile-specific layouts for complex components (order booking dialog with single-column grid on mobile), adaptive font sizes, and viewport optimization for various screen sizes.

## External Dependencies
- **Blockchain Network**: Base (mainnet and Sepolia testnet)
- **Wallet SDK**: Base Account SDK (`@base-org/account`)
- **Payment Token**: USDC (ERC-20)
- **Token Standard**: ERC-20 (for $PSX token and USDC)
- **Styling Frameworks**: Tailwind CSS, Shadcn UI