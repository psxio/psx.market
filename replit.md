# PSX Marketplace

## Overview
PSX Marketplace is a token-gated Web3 marketplace designed to connect premium builders with clients in the memecoin and broader crypto space. Its primary purpose is to ensure quality assurance on both sides by requiring users to hold $PSX tokens for access to services. The platform features builder profiles, service listings, category-based browsing, and an administrative dashboard for managing the marketplace. The long-term vision is to become the leading platform for Web3 talent, incorporating secure on-chain payments and robust project management tools.

## User Preferences
- Default theme: Dark mode with purple/cyan branding
- Design system follows design_guidelines.md
- Mobile-first responsive design
- Professional Web3 aesthetic

## System Architecture
The PSX Marketplace is built with a clear separation between its frontend and backend, ensuring scalability and maintainability.

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
- **Data Models**: Comprehensive schemas for Builders, Builder Projects, Clients, Services, Categories, Reviews, Builder Applications, Admins, Referrals, Orders, Order Revisions, and Order Activities.
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

## External Dependencies
- **Blockchain Network**: Base (mainnet and Sepolia testnet)
- **Wallet SDK**: Base Account SDK (`@base-org/account`)
- **Token Standard**: ERC-20 (for $PSX token)
- **Styling Frameworks**: Tailwind CSS, Shadcn UI