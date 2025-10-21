# create.psx

## Overview
create.psx is a token-gated Web3 marketplace designed to connect premium builders with clients in the memecoin and broader crypto space. Its primary purpose is to ensure quality assurance on both sides by requiring users to hold $PSX tokens for access to services. The platform features builder profiles, service listings, category-based browsing, and an administrative dashboard for managing the marketplace. The long-term vision is to become the leading platform for Web3 talent, incorporating secure on-chain payments and robust project management tools.

## User Preferences
- Default theme: Dark mode with purple/cyan branding
- Design system follows design_guidelines.md
- Mobile-first responsive design
- Professional Web3 aesthetic

## System Architecture
create.psx is built with a clear separation between its frontend and backend, ensuring scalability and maintainability.

### UI/UX Decisions
- **Branding**: Consistent purple/cyan gradient theme across the application.
- **Design System**: Utilizes Tailwind CSS and Shadcn UI components for a modern, responsive, and mobile-first design.
- **Key Features**:
    - **Token-Gated Access**: Requires $PSX token holdings for marketplace access and client tier assignment.
    - **Builder Profiles**: Comprehensive profiles with portfolios, services, reviews, and dynamic skill arrays. Enhanced with category-specific showcase sections.
    - **Category-Specific Portfolios**: Dedicated portfolio sections showcasing builder expertise based on their category (KOL social metrics, 3D visual portfolios, marketing ROI, development GitHub profiles, volume trading proof).
    - **Previous Projects Showcase**: Detailed project case studies with results, metrics, media galleries, and client testimonials.
    - **Service Listings**: Detailed service offerings with tiered pricing.
    - **Marketplace Browsing**: Advanced search, filtering, and category-based navigation (KOLs, 3D Content, Marketing, Development, Volume).
    - **Admin & Client Dashboards**: Dedicated interfaces for marketplace administration and client project management, including secure authentication and profile editing.
    - **Builder Application System**: A multi-step form wizard for builders to apply, including category-specific questions.
    - **PSX Agency Promotion**: A dedicated homepage section to promote direct B2B services.

### Technical Implementations
- **Frontend**: Developed with React and TypeScript, leveraging TanStack Query for data fetching and custom Auth Contexts for session management.
- **Backend**: Built using Express and TypeScript, designed with a RESTful API structure.
- **Authentication**:
    - **Admin**: Session-based authentication with `express-session`, `bcrypt` for password hashing, and `requireAdminAuth` middleware for protected routes.
    - **Client**: Session-based authentication using `express-session` with wallet connection via Base Account SDK.
- **Wallet Integration**: Production-ready integration with Base Account SDK for wallet connection, network verification (Base mainnet/Sepolia), and ERC-20 $PSX token balance checking using `BigInt` for precision.
- **Data Storage**: Currently uses in-memory storage (`MemStorage`) with seed data for development and demonstration.
- **Data Models**: Comprehensive schemas for Builders, Builder Projects, Clients, Services, Categories, Reviews, Review Votes, Review Disputes, Builder Applications, Admins, Referrals, Orders, Order Revisions, and Order Activities.
- **Builder Profile Enhancements**: 
    - **Category-Specific Fields**: Extensive fields for each builder category to showcase expertise and credibility:
        - **KOLs**: Social media metrics (Twitter, Instagram, YouTube, Telegram followers), engagement rates, audience demographics, content niches, brand partnerships
        - **3D Content**: Portfolio media arrays, video showreels, software expertise, render engines, style specialties, animation capabilities
        - **Marketing**: Marketing platforms, growth strategies, case studies, average ROI, client industries served
        - **Development**: Programming languages, blockchain frameworks, GitHub profiles, deployed contracts, security audits, certifications
        - **Volume**: Trading experience years, volume capabilities, DEX/CEX expertise, compliance knowledge, volume proof documentation
    - **Builder Projects Table**: Dedicated schema for showcasing previous work with title, description, client information, project date, results arrays, category-specific metrics (reach, engagement, ROI, revenue, contracts, volume), media galleries, testimonials, and featured status.
- **Order Management System**: Complete order booking and management system featuring:
    - **Order Placement**: Clients can book services with package selection (basic/standard/premium), requirements input, and instant order creation
    - **Order Tracking**: Orders have status workflow (pending → accepted → in_progress → delivered → completed) with timestamps
    - **Order Revisions**: Support for revision requests with tracking and delivery management
    - **Order Activities**: Automatic activity timeline logging all order events
    - **Client Dashboard**: Orders list with status filtering, requirement display, and detail navigation
    - **Builder Integration**: Order notifications and management accessible from builder profiles
- **Payment Integration**: Comprehensive USDC payment system on Base blockchain featuring:
    - **Base Pay SDK**: Integration with `@base-org/account` for USDC payments on Base mainnet/Sepolia testnet
    - **Escrow Payments**: Smart contract-based escrow system with milestone-based fund releases
    - **Payment Schema**: 6 database tables (payments, milestonePayments, payouts, disputes, refunds, invoices)
    - **Platform Fees**: Configurable percentage-based fee collection (default 2.5%) deducted before builder payouts
    - **Milestone System**: Split payments into multiple milestones with locked funds released upon approval
    - **Builder Payouts**: Automated payout tracking with transaction history and earnings dashboard
    - **Payment History**: Complete transaction records with Base blockchain verification links
    - **Invoice Generation**: Automatic invoice creation for all payments with downloadable records
    - **Dispute Resolution**: Multi-party dispute system with evidence tracking and arbitration workflow
    - **Refund Processing**: Full and partial refund support with automatic transaction reversals
    - **Payment Components**: 5 UI components (PaymentDialog, PaymentHistory, MilestoneTracker, BuilderPayouts, DisputeResolution)
    - **Transaction Tracking**: Real-time payment status polling with Base Pay SDK getPaymentStatus()
    - **Payment Flow**: payments → milestonePayments → payouts with comprehensive status tracking (pending → processing → completed/failed)
- **Real-Time Messaging System**: Complete WebSocket-based chat platform for client-builder communication:
    - **WebSocket Infrastructure**: Real-time bi-directional communication with automatic reconnection and connection status tracking
    - **Messaging Schema**: 4 database tables (chatThreads, messages, messageReadReceipts, messageAttachments)
    - **Chat Threading**: Project/order-based conversation threads with title, status, and participant tracking
    - **Message Types**: Support for text, image, file, and system messages with extensible message type system
    - **Read Receipts**: Track message read status with timestamp tracking for delivered, read receipts
    - **File Attachments**: Multi-file attachment support with filename, URL, size, and MIME type tracking
    - **Message History**: Complete conversation history with pagination support and last message preview
    - **Real-Time Updates**: WebSocket events for new messages, thread updates, and read receipt synchronization
    - **UI Components**: ChatList (conversation overview), ChatThread (message view), MessageComposer (input with attachments)
    - **Custom Hook**: useWebSocket hook for managing WebSocket connections with automatic reconnection
    - **Navigation**: Messages link in header (visible only to authenticated clients) with mobile responsive design
    - **Storage Layer**: 15+ storage methods for CRUD operations on threads, messages, receipts, and attachments
    - **API Routes**: REST endpoints for thread management, message CRUD, read tracking, and attachment handling
- **Enhanced Review System**: Comprehensive review platform with quality assurance and community moderation:
    - **Extended Review Schema**: 13 new fields including builder responses, moderation status, on-chain verification, dispute tracking, and helpfulness voting
    - **Review Tables**: 3 database tables (reviews with 23 fields, reviewVotes, reviewDisputes) for complete review lifecycle management
    - **Builder Responses**: Builders can publicly respond to client reviews with timestamped responses
    - **Admin Moderation**: Three-state moderation workflow (pending → approved/rejected) with moderator notes and audit trail
    - **Community Voting**: Clients can vote reviews as helpful/not helpful with vote count tracking
    - **Dispute System**: Multi-party dispute creation with evidence submission, status tracking (pending → resolved), and admin arbitration
    - **On-Chain Verification**: Optional blockchain verification with transaction hash tracking and verification timestamps
    - **Review Components**: 4 UI components (ReviewSubmissionForm, ReviewCard, BuilderResponseDialog, ReviewModerationPanel)
    - **Storage Methods**: 15+ storage methods for review CRUD, responses, moderation, voting, and dispute resolution
    - **API Routes**: 11 endpoints covering review submission, responses, status updates, voting, and dispute management
    - **Review Workflow**: Client submits → Admin moderates → Builder responds → Community votes → Dispute resolution (if needed)

## External Dependencies
- **Blockchain Network**: Base (mainnet and Sepolia testnet)
- **Wallet SDK**: Base Account SDK (`@base-org/account`) for wallet connection and payment processing
- **Payment Token**: USDC (ERC-20) for all marketplace transactions
- **Token Standard**: ERC-20 (for $PSX token and USDC payments)
- **Styling Frameworks**: Tailwind CSS, Shadcn UI

## Recent Changes (October 21, 2025)
- **Payment System Implementation**: Complete USDC payment integration with Base Pay SDK
- **Payment API Routes**: 20+ endpoints for payment processing, milestone management, payouts, disputes, and refunds
- **Payment Storage**: Added 30+ storage methods for payment CRUD operations
- **Payment UI Components**: Created PaymentDialog, PaymentHistory, MilestoneTracker, BuilderPayouts, and DisputeResolution components
- **Client Dashboard**: Added Payments tab displaying payment history and transaction records
- **Escrow System**: Implemented milestone-based payment releases with platform fee collection
- **Real-Time Messaging**: WebSocket-based chat system with ChatList, ChatThread components and useWebSocket hook
- **Messaging Infrastructure**: 4 database tables, 15+ storage methods, REST API + WebSocket server
- **Messages Page**: Dedicated /messages page with conversation list and thread view in responsive layout
- **Header Navigation**: Added Messages link to header (visible only to authenticated clients)
- **Review System Enhancements**: Comprehensive review platform with moderation, voting, disputes, and builder responses
- **Review Schema Extensions**: Added 13 new fields to reviews table including builder responses, moderation tracking, on-chain verification, and helpfulness metrics
- **Review Tables**: Created reviewVotes and reviewDisputes tables for community voting and dispute management
- **Review API Routes**: 11 new endpoints for submission, moderation, responses, voting, and dispute resolution
- **Review Components**: 4 new UI components (ReviewSubmissionForm, ReviewCard, BuilderResponseDialog, ReviewModerationPanel)
- **Review Storage**: 15+ new storage methods for complete review lifecycle management from submission to resolution