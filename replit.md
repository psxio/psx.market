## Overview
Create.psx is a dual token-gated Web3 marketplace connecting premium builders with clients in the memecoin and crypto space. Its primary purpose is to ensure quality by requiring $CREATE or $PSX token holdings for platform access. The platform features builder profiles, service listings, category-based browsing, administrative dashboards, legal compliance, robust builder onboarding, and AI-powered builder discovery and matching. The long-term vision is to become the leading platform for Web3 talent, integrating secure on-chain payments and advanced project management.

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
- **Key Features**: Dual token-gated access, comprehensive builder profiles with portfolios and services, advanced search and filtering, dedicated admin and client dashboards, a multi-step builder application system, and a visual builder onboarding checklist. The platform also includes a "Buy on Demand" section, PSX Agency promotion, and extensive legal/compliance pages.

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

## External Dependencies
- **Blockchain Network**: Base (mainnet and Sepolia testnet)
- **Wallet SDK**: Base Account SDK
- **Payment Token**: USDC (ERC-20)
- **Access Tokens**: $CREATE (ERC-20 on Base) and $PSX (ERC-20 on Base)
- **AI Service**: OpenAI GPT-4o-mini via Replit AI Integrations
- **Styling Frameworks**: Tailwind CSS, Shadcn UI
- **Object Storage**: Replit Object Storage (Google Cloud Storage backend)