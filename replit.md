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
    - **Builder Profiles**: Comprehensive profiles with portfolios, services, reviews, and dynamic skill arrays.
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
- **Data Models**: Comprehensive schemas for Builders, Clients, Services, Categories, Reviews, Builder Applications, Admins, and Referrals.

## External Dependencies
- **Blockchain Network**: Base (mainnet and Sepolia testnet)
- **Wallet SDK**: Base Account SDK (`@base-org/account`)
- **Token Standard**: ERC-20 (for $PSX token)
- **Styling Frameworks**: Tailwind CSS, Shadcn UI