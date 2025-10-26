## Overview
port444 is a Web3 marketplace with dual token incentives designed to connect premium builders with clients in the memecoin and broader crypto space. The platform is open to all users, but offers exclusive benefits and reduced fees to $CREATE and $PSX token holders. The platform features comprehensive builder profiles, service listings, category-based browsing, administrative tools, legal compliance, robust builder onboarding, and AI-powered builder discovery and matching. The long-term ambition is to establish port444 as the leading hub for Web3 talent, integrating secure on-chain payments and advanced project management functionalities.

## User Preferences
- Default theme: Dark mode with purple/cyan branding
- Design system follows design_guidelines.md
- Mobile-first responsive design
- Professional Web3 aesthetic
- Typography: Space Grotesk font (matching time.fun) loaded from Google Fonts, applied site-wide via CSS variable --font-sans
- Animations: Scroll-triggered reveal animations throughout (fadeInUp, fadeInLeft, fadeInRight, fadeInScale, slideInUp, zoomIn, bounceIn)
- Navigation: Help and Admin links moved to footer (not in navbar)

## System Architecture
port444 utilizes a decoupled frontend and backend architecture to deliver a scalable and responsive platform.

### UI/UX Decisions
- **Branding**: Marketplace branded as "port444" (matching domain port444.shop) with purple/cyan gradient theme. Still powered by $CREATE and $PSX tokens.
- **Design System**: Built with Tailwind CSS and Shadcn UI, emphasizing a modern, responsive, and mobile-first approach.
- **Navigation Structure**: Features a header with core navigation (Browse Services, Browse Builders, Getting Started, Dashboard, Messages) and a footer for platform links, resources (including Help & FAQ and Admin Portal), and legal links.
- **Homepage ("Buy on Demand")**: Fiverr-style category-driven marketplace with unified hero section merging branding and category browser. Defaults to 3D Artists category. Category pills (no "All Categories" option) filter services in real-time. Each service and builder card displays project token tickers (e.g., $TFUND, $PSX, $DUHCAT, $CREATE) showcasing projects they've worked on. Includes all branding elements: token perks, 3 CTAs, token holder benefits section, and PSX Agency promotion.
- **Getting Started Page**: Comprehensive dual-tab onboarding center. **Client tab** features wallet setup, builder search tips, AI-Powered Builder Matching wizard (quiz-based personalized recommendations), project workflow, payment process, and review system. **Builder tab** features complete builder recruitment content including value proposition, platform benefits ($2.5M+ paid, 500+ builders, 2K+ projects, 4.9★ rating), 6 benefits cards, 4-step application process (Quiz → Apply → Approval → Profile → Earn), payment/escrow flow, and dual CTAs (Readiness Quiz, Apply Now).
- **Key Features**: Dual token incentive system ($CREATE & $PSX holders receive platform fee discounts and exclusive benefits), detailed builder profiles with portfolios and services, advanced search and filtering capabilities, dedicated admin and client dashboards, a multi-step builder application process, and a visual builder onboarding checklist. Additional features include "Buy on Demand" homepage, PSX Agency promotion, and extensive legal/compliance documentation.
- **Browse Pages**: Both service and builder browsing pages feature consistent layouts with sidebar filters (categories, languages, rating, availability), search functionality, and grid-based card displays.

### Technical Implementations
- **Frontend**: Developed using React and TypeScript, with TanStack Query for efficient data fetching.
- **Backend**: Implemented with Express and TypeScript, providing a RESTful API.
- **Authentication**: Utilizes session-based authentication for administrators and RainbowKit + wagmi for unified wallet authentication, enabling token incentive benefits based on $CREATE or $PSX holdings.
- **Token Incentive System**: Platform is open to all users, but token holders ($CREATE or $PSX) receive exclusive benefits including: reduced platform fees (1% vs 2.5% standard), priority support, token holder badges, early access to new features, and exclusive service offerings. The system checks token balances in real-time and automatically applies benefits without blocking access to non-holders.
- **Data Storage**: PostgreSQL database managed with Drizzle ORM, supporting various schemas including Builders, Clients, Services, Orders, and Payments.
- **Order Management System**: Comprehensive system for managing the entire order lifecycle, including booking, status workflows, and revision tracking.
- **Smart Contract Escrow System**: An on-chain USDC payment system on the Base blockchain using `USDCEscrow.sol` for milestone-based releases, dispute resolution, platform fees, and automated refunds.
- **Real-Time Messaging System**: WebSocket-based chat functionality with read receipts and file attachments.
- **Enhanced Review System**: A platform for comprehensive builder reviews, moderation, and dispute resolution.
- **Project Management System**: Features for tracking milestones, deliverables, and managing document repositories.
- **Builder Dashboard & Tools**: Provides builders with interfaces to manage earnings, orders, services, and availability.
- **File Upload & Storage**: Leverages Replit Object Storage (Google Cloud Storage backend) with ACL and presigned URLs for secure file handling.
- **Financial Management System**: An admin dashboard offering revenue analytics, payout queue management, and escrow monitoring.
- **UI/UX Enhancement System**: A centralized system for toast notifications, keyboard shortcuts, confirmation modals, loading skeletons, and empty states.
- **Builder Analytics & Growth Tools**: Includes 8 specialized modules for profile optimization, service performance, lead management, review automation, pricing intelligence, revenue forecasting, message templates, and client relationship management.
- **Quick Win UX Enhancements**: Features such as USDC balance display, empty state illustrations, breadcrumb navigation, a price calculator widget, recently viewed tracker, theme toggle, enhanced keyboard shortcuts, action-enabled toast notifications, an FAQ chatbot, and specialized loading skeletons.
- **Real-Time Features**: Includes online/offline status tracking, live builder availability, typing indicators in chat, browser notifications, and unread message counters.
- **Advanced Search & Filtering System**: Supports saved search preferences, builder favorites/collections, search history, filter presets, location/timezone filters, and language/communication preferences.
- **AI-Powered Builder Discovery & Matching System**: Integrates OpenAI GPT-4o-mini for client-facing builder matching. The AI Builder Matching Wizard is located in the Getting Started page (client tab) and provides quiz-based personalized builder recommendations. Also includes a "Similar Builders Engine" for recommendations and "Smart Service Recommendations."
- **Notification System**: Comprehensive notification system with browser push notifications for messages, orders, and milestones. Email digest system with daily/weekly summaries based on user preferences. Real-time notification counters and read/unread tracking.
- **SEO & Discovery**: Dynamic meta tags and OpenGraph support for all pages, Schema.org structured data for builder profiles and services, dynamic sitemap generation for search engine indexing, and public builder profile pages optimized for discovery.
- **Smart Recommendations Engine**: Collaborative filtering algorithm for personalized builder recommendations ("Clients like you also hired..."), AI-powered price optimization suggestions for builders based on market analysis and performance metrics, success prediction scores for client-builder matches with confidence ratings and impact factors.

### Service Catalog
port444 offers a comprehensive service catalog across 10 specialized categories:
- **Categories**: Volume Services, 3D & 2D Content Creation, Social Media Management, KOLs & Influencers, Script Development, Graphic Design, Marketing & Growth, Grants & Funding, Strategy Consulting, Documentation & Paperwork.
- **Featured Services**: A wide array of services (e.g., Custom Volume Generation, 3D & 2D Character Design, Token Launch Video, KOL Management, Website Development, Grant Acceleration, Web3 Strategy Consulting, Tokenomics Design, Pitch Deck & Whitepaper Creation, Market Making & KOL Network Access, DAO Advisory), each with 3-tier pricing (Basic/Standard/Premium), detailed descriptions, deliverables, delivery timeframes, tags, and PSX token requirements.

### Builder Profile System
Builder profiles are highly detailed, featuring over 40 fields to comprehensively showcase a builder's capabilities:
- **Core Profile Fields**: Name, headline, bio, detailed description, profile image, portfolio media, video showreel, verified status, category, PSX tier, rating, review count, completed projects, response time, success rate, on-time delivery rate.
- **Enhanced Fields**: Languages, location & timezone, education, work experience, availability, specializations, achievement badges, FAQs, and social profiles.
- **Category-Specific Fields**: Tailored fields for KOLs (follower counts, engagement rate), 3D Artists (software, render engines), Marketers (platforms, case studies), Developers (programming languages, blockchain frameworks), and Volume Traders (trading experience, volume capabilities).
- **Performance Metrics**: Total earnings, available balance, pending payouts, profile views, response rate, trending status, active orders, total messages received/responded, last active timestamp, and member since date.
- **Specialized Profile Layouts**: Grant consulting, strategy consulting, and documentation builders receive a distinct agency-focused layout (GrantConsultingProfile component) featuring success metrics (91% success rate, $18M+ raised, 350+ clients), 5-step process visualization, supported verticals, "Why Choose Us" section, and service-focused presentation instead of individual freelancer portfolio display.

## External Dependencies
- **Blockchain Network**: Base (mainnet and Sepolia testnet)
- **Wallet SDK**: Base Account SDK
- **Payment Token**: USDC (ERC-20)
- **Incentive Tokens**: $CREATE (ERC-20 on Base) and $PSX (ERC-20 on Base) - holding either token provides platform benefits including reduced fees and exclusive perks
- **AI Service**: OpenAI GPT-4o-mini via Replit AI Integrations
- **Styling Frameworks**: Tailwind CSS, Shadcn UI
- **Object Storage**: Replit Object Storage (Google Cloud Storage backend)