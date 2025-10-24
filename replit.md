## Overview
Create.psx is a dual token-gated Web3 marketplace designed to connect premium builders with clients in the memecoin and broader crypto space. Its core mission is to ensure quality and exclusivity by requiring users to hold $CREATE or $PSX tokens for platform access. The platform offers comprehensive features including builder profiles, service listings, category-based browsing, administrative tools, legal compliance, robust builder onboarding, and AI-powered builder discovery and matching. The long-term ambition is to establish Create.psx as the leading hub for Web3 talent, integrating secure on-chain payments and advanced project management functionalities.

## User Preferences
- Default theme: Dark mode with purple/cyan branding
- Design system follows design_guidelines.md
- Mobile-first responsive design
- Professional Web3 aesthetic
- Typography: Space Grotesk font (matching time.fun) loaded from Google Fonts, applied site-wide via CSS variable --font-sans
- Animations: Scroll-triggered reveal animations throughout (fadeInUp, fadeInLeft, fadeInRight, fadeInScale, slideInUp, zoomIn, bounceIn)
- Navigation: Help and Admin links moved to footer (not in navbar)

## System Architecture
Create.psx utilizes a decoupled frontend and backend architecture to deliver a scalable and responsive platform.

### UI/UX Decisions
- **Branding**: Consistent purple/cyan gradient with equal prominence for Create and PSX brands.
- **Design System**: Built with Tailwind CSS and Shadcn UI, emphasizing a modern, responsive, and mobile-first approach.
- **Navigation Structure**: Features a header with core navigation (Browse Services, Browse Builders, Find Your Builder, Getting Started, Dashboard, Messages) and a footer for platform links, resources (including Help & FAQ and Admin Portal), and legal links.
- **Key Features**: Dual token-gated access, detailed builder profiles with portfolios and services, advanced search and filtering capabilities, dedicated admin and client dashboards, a multi-step builder application process, and a visual builder onboarding checklist. Additional features include a "Buy on Demand" section, PSX Agency promotion, and extensive legal/compliance documentation.
- **Browse Pages**: Both service and builder browsing pages feature consistent layouts with sidebar filters (categories, languages, rating, availability), search functionality, and grid-based card displays.

### Technical Implementations
- **Frontend**: Developed using React and TypeScript, with TanStack Query for efficient data fetching.
- **Backend**: Implemented with Express and TypeScript, providing a RESTful API.
- **Authentication**: Utilizes session-based authentication for administrators and RainbowKit + wagmi for unified wallet authentication, enabling token gating based on $CREATE or $PSX holdings.
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
- **AI-Powered Builder Discovery & Matching System**: Integrates OpenAI GPT-4o-mini for features like a "Find Your Builder Wizard" (quiz-based matching), a "Similar Builders Engine" for recommendations, and "Smart Service Recommendations."

### Service Catalog
Create.psx offers a comprehensive service catalog across 10 specialized categories:
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
- **Access Tokens**: $CREATE (ERC-20 on Base) and $PSX (ERC-20 on Base)
- **AI Service**: OpenAI GPT-4o-mini via Replit AI Integrations
- **Styling Frameworks**: Tailwind CSS, Shadcn UI
- **Object Storage**: Replit Object Storage (Google Cloud Storage backend)