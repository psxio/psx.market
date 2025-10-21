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
- **Data Models**: Comprehensive schemas for Builders, Builder Projects, Clients, Services, Categories, Reviews, Review Votes, Review Disputes, Builder Applications, Admins, Referrals, Orders, Order Revisions, Order Activities, Payments, Milestones, Payouts, Disputes, Refunds, Invoices, Chat Threads, Messages, Message Read Receipts, Message Attachments, Project Deliverables, Progress Updates, and Project Documents.
- **Order Management System**: Full order booking and management with status workflows, revision tracking, activity logging, and client/builder dashboards.
- **Payment Integration**: Comprehensive USDC payment system on Base blockchain using Base Pay SDK. Features smart contract-based escrow with milestone releases, configurable platform fees, automated payouts, transaction history, invoice generation, dispute resolution, and refund processing.
- **Real-Time Messaging System**: WebSocket-based chat for client-builder communication with project/order-based threads, multiple message types, read receipts, file attachments, and real-time updates.
- **Enhanced Review System**: Comprehensive review platform with builder responses, admin moderation, community voting, dispute system with arbitration, and optional on-chain verification.
- **Project Management System**: Includes milestone and deliverable tracking, builder submission workflow, client review, progress reporting, and a centralized document repository with version control.
- **Builder Dashboard & Tools**: Comprehensive interface for builders including earnings overview, order management, service listings, performance analytics (response time, success rate, on-time delivery), and availability management.

## External Dependencies
- **Blockchain Network**: Base (mainnet and Sepolia testnet)
- **Wallet SDK**: Base Account SDK (`@base-org/account`)
- **Payment Token**: USDC (ERC-20)
- **Token Standard**: ERC-20 (for $PSX token and USDC)
- **Styling Frameworks**: Tailwind CSS, Shadcn UI