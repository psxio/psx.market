# create.psx

## Overview
create.psx is a token-gated Web3 marketplace connecting premium builders with clients in the memecoin and broader crypto space. Its core purpose is quality assurance, achieved by requiring $PSX token holdings for access. The platform features builder profiles, service listings, category-based browsing, administrative dashboard, comprehensive legal compliance pages, and builder onboarding system. The long-term vision is to become the leading platform for Web3 talent, incorporating secure on-chain payments and robust project management.

## User Preferences
- Default theme: Dark mode with purple/cyan branding
- Design system follows design_guidelines.md
- Mobile-first responsive design
- Professional Web3 aesthetic
- **Typography**: Orbitron font loaded from Google Fonts, applied site-wide via CSS variable --font-sans
- **Animations**: Scroll-triggered reveal animations throughout (fadeInUp, fadeInLeft, fadeInRight, fadeInScale, slideInUp, zoomIn, bounceIn)

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
    - **Marketplace Browsing**: Comprehensive search and filtering system with full-text search across services and builders, multi-select category filtering, price range slider, rating filters (3+, 4+, 5 stars), delivery time filters (24h, 3d, 7d, 14d), multiple sort options (price, rating, recent), builder-specific search endpoint with PSX tier and verification filters, active filter management with removable pills, and mobile-responsive filter sheet.
    - **Admin & Client Dashboards**: Dedicated interfaces for administration and project management with secure authentication.
    - **Builder Application System**: Multi-step form wizard with category-specific questions.
    - **PSX Agency Promotion**: Dedicated homepage section for B2B services.

### Technical Implementations
- **Frontend**: React and TypeScript, TanStack Query for data fetching, custom Auth Contexts.
- **Backend**: Express and TypeScript, RESTful API structure.
- **Authentication**: Session-based authentication using `express-session`; `bcrypt` for admin password hashing; Base Account SDK for client wallet connection.
- **Wallet Integration**: Base Account SDK for wallet connection, network verification (Base mainnet/Sepolia), and ERC-20 $PSX token balance checking.
- **Data Storage**: PostgreSQL database with Drizzle ORM for production-grade persistent storage.
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
- **Notification System**: Comprehensive multi-channel notification system supporting in-app, email, and push notifications. Features include:
  - **In-App Notifications**: Real-time notification center with dropdown UI, unread badges, filtering (all/unread), mark as read, and delete functionality
  - **Push Notifications**: Browser push notification support via service worker with permission management and customizable notification payloads
  - **Email Notifications**: Production-ready email service supporting multiple providers (SendGrid, Mailgun, AWS SES) with auto-detection, branded HTML templates, and console fallback for development. Features professional email templates for all notification types with mobile-responsive design and plain text alternatives.
  - **Notification Types**: Support for order updates, messages, payments, reviews, milestones, and disputes
  - **Preferences Management**: Granular user preferences for controlling notification channels (email, push, in-app) for each notification type
  - **Notification Center UI**: Integrated into header and builder dashboard with real-time unread count badges
  - **Settings Page**: Dedicated notification settings page (/settings/notifications) for managing preferences and push permissions
  - **Backend Utilities**: Helper functions for sending notifications from various parts of the application (notifyOrderUpdate, notifyNewMessage, notifyPaymentReceived, etc.)
  - **Storage Layer**: Complete CRUD operations for notifications, preferences, and push subscriptions in PostgreSQL
- **File Upload & Storage System**: Complete file upload and storage infrastructure using Replit Object Storage (Google Cloud Storage backend). Features include:
  - **Object Storage Service**: Core service (`server/objectStorage.ts`) for managing file uploads, downloads, and ACL policies
  - **Access Control**: Granular ACL system (`server/objectAcl.ts`) with public/private visibility controls and owner-based access
  - **File Upload UI**: Reusable `ObjectUploader` component with drag-and-drop interface, progress tracking, and file preview
  - **Presigned URLs**: Secure direct-to-storage uploads using presigned URLs (no server-side file handling)
  - **Multiple Upload Types**: Support for portfolio images (public), message attachments (private), deliverables (private), and project documents
  - **API Endpoints**: Dedicated routes for upload URL generation (`/api/objects/upload`), file serving (`/objects/*`, `/public-objects/*`), and ACL management
  - **Authentication Integration**: File uploads require authentication (client wallet or admin session)
  - **File Metadata**: Automatic content-type detection, cache control headers, and proper file streaming
  - **Size Limits**: Configurable file size limits (default 10MB) with client-side validation
- **Advanced Search & Filtering**: Comprehensive marketplace search functionality with:
  - **Full-Text Search**: Searches across service titles, descriptions, tags, builder names, categories, skills, bios, and headlines
  - **Category Filters**: Multi-select category filtering with active filter pills
  - **Price Range**: Slider-based price filtering ($0-$10,000)
  - **Rating Filters**: Minimum rating filters (3+ Stars, 4+ Stars, 5 Stars)
  - **Delivery Time Filters**: Maximum delivery time options (24 hours, 3 days, 7 days, 14 days)
  - **Sort Options**: Multiple sorting methods including price (low/high), rating (top-rated), and recent (newest first)
  - **Builder Search**: Dedicated builder search endpoint with additional filters for PSX tier (bronze/silver/gold/platinum) and verified status
  - **Combined Filtering**: All filters work together and can be combined for precise results
  - **Query-Based State**: Filter state persisted in URL query parameters for sharing and bookmarking
  - **Responsive UI**: Mobile-friendly filter sheet with all desktop functionality
- **Profile & Service Management**: Complete management tools for builders and clients with:
  - **Builder Profile Editing**: Full profile editing capability with support for name, bio, headline, skills, category, portfolio URLs, GitHub, Twitter, profile/cover images via `PATCH /api/builders/:id/profile`
  - **Client Profile Editing**: Comprehensive client profile management including name, email, company name, bio, and profile image via `PUT /api/clients/me` with form validation and real-time updates
  - **Service Creation**: Create new services with multi-tier pricing, category selection, tags, delivery times, and portfolio media
  - **Service Editing**: Edit all service details via `PUT /api/builders/:builderId/services/:id` with ownership verification
  - **Service Deletion**: Permanent service deletion via `DELETE /api/builders/:builderId/services/:id` with confirmation dialog
  - **Service Archiving**: Non-destructive service hiding/showing via `PATCH /api/builders/:builderId/services/:id/archive` - archived services hidden from marketplace but can be reactivated anytime
  - **Ownership Verification**: All service management operations verify builder ownership (403 error if attempting to manage another builder's services)
  - **UI Components**: Builder Dashboard Services tab with Edit, Archive/Activate, and Delete buttons for each service
  - **Confirmation Dialogs**: AlertDialog for destructive operations (deletion) to prevent accidental data loss
  - **Toast Notifications**: Success/error notifications for all profile and service management operations
  - **Database Schema**: Services table includes `active` boolean field for archive functionality and `createdAt` timestamp
- **Legal & Compliance Pages**: Comprehensive legal documentation for regulatory compliance and transparency:
  - **Terms of Service** (`/terms-of-service`): Platform terms covering account requirements, $PSX token holdings, payment terms, escrow system, intellectual property, dispute resolution, limitation of liability, governing law, and termination policies
  - **Privacy Policy** (`/privacy-policy`): GDPR and CCPA compliant privacy policy detailing data collection practices, wallet address handling, blockchain data permanence, user rights (access, correction, deletion), security measures, data retention, international transfers, and cookie usage
  - **Cookie Policy** (`/cookie-policy`): Detailed explanation of cookie usage including types (Essential, Functional, Analytics, Marketing), local storage, third-party cookies, lifespan, user controls, Do Not Track (DNT) support, and browser settings guidance
  - **FAQ Page** (`/faq`): Comprehensive FAQ with 40+ questions across 8 categories (Getting Started, Wallet & Tokens, Payments & Escrow, Services & Orders, Communication & Support, Builder-Specific, Technical & Security, Disputes & Resolution). Features real-time search filtering using shadcn Accordion components
  - **Footer Integration**: Legal pages linked in homepage footer with hover effects and proper routing
- **Builder Onboarding System**: Visual onboarding checklist guiding new builders through platform setup:
  - **OnboardingChecklist Component**: Card-based UI component displaying 5 tracked steps with progress bar, completion indicators (CheckCircle2/Circle icons), and action buttons for incomplete steps
  - **Tracked Steps**: 
    1. Complete Your Profile (bio, headline, skills, profile image)
    2. Add Your First Service (service listing with pricing)
    3. Showcase Your Portfolio (portfolio links or project examples)
    4. Set Up Payment (wallet connection for USDC payments)
    5. Complete Verification (social accounts or GitHub verification)
  - **Progress Tracking**: Displays completion percentage (0-100%) calculated from completed steps, automatically hidden when onboarding is complete
  - **Database Integration**: Uses `builderOnboarding` table with boolean fields for each step, completion percentage, and completion timestamp
  - **API Endpoints**: 
    - `GET /api/builders/:builderId/onboarding` - Fetch onboarding status
    - `POST /api/builders/:builderId/onboarding` - Create onboarding record
    - `PATCH /api/builders/:builderId/onboarding/:step` - Update step completion
  - **Dashboard Integration**: Checklist prominently displayed in Builder Dashboard between stats cards and tabs section, visible only when onboarding incomplete
  - **Visual Design**: Primary-bordered card with step-by-step breakdown, action buttons linking to relevant setup pages, encouraging message when 60%+ complete

## External Dependencies
- **Blockchain Network**: Base (mainnet and Sepolia testnet)
- **Wallet SDK**: Base Account SDK (`@base-org/account`)
- **Payment Token**: USDC (ERC-20)
- **Token Standard**: ERC-20 (for $PSX token and USDC)
- **Styling Frameworks**: Tailwind CSS, Shadcn UI