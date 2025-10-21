# PSX Marketplace

## Overview
PSX Marketplace is a token-gated Web3 marketplace connecting premium builders with clients in the memecoin and crypto space. Users must hold $PSX tokens to access services, ensuring quality assurance on both sides of the marketplace.

## Current State (MVP Complete)
The application is fully functional with all core features implemented:
- ✅ Token-gated marketplace with Base network wallet connection
- ✅ Builder profiles with portfolios, services, and reviews
- ✅ Service listings with tiered pricing packages
- ✅ Category-based browsing (KOLs, 3D Content, Marketing, Development, Volume)
- ✅ Search and filtering functionality
- ✅ Featured builders and services sections
- ✅ Mock wallet verification and PSX balance checking
- ✅ Responsive design with dark mode (purple/cyan branding)

## Recent Changes (2025-10-21)
- Implemented complete data schema for builders, services, categories, and reviews
- Built all frontend components with PSX branding (purple/cyan gradient)
- Created comprehensive backend with seed data
- Added wallet verification endpoints for token gating
- Fixed category matching between frontend and backend
- Added error handling and loading states throughout
- Implemented search and filter functionality

## Project Architecture

### Frontend (React + TypeScript)
- **Pages**: Home, Marketplace, Builder Profile, Category
- **Components**: Header, Wallet Connect, Builder Card, Category Pill
- **Styling**: Tailwind CSS + Shadcn UI with custom PSX color scheme
- **State Management**: TanStack Query for data fetching

### Backend (Express + TypeScript)
- **Storage**: In-memory storage with seed data (MemStorage)
- **API Routes**: 
  - Categories: GET /api/categories, GET /api/categories/:slug
  - Builders: GET /api/builders, GET /api/builders/featured, GET /api/builders/:id
  - Services: GET /api/services (with search/filter), GET /api/services/featured
  - Reviews: GET /api/builders/:id/reviews
  - Wallet: POST /api/wallet/verify, GET /api/wallet/balance/:address

### Data Model
- **Builders**: Wallet address, name, bio, verified status, category, rating, skills, portfolio
- **Services**: Tiered pricing (basic/standard/premium), delivery time, PSX requirements
- **Categories**: KOLs, 3D Content, Marketing, Development, Volume
- **Reviews**: Client reviews with ratings and project details

## Key Features

### Token Gating
- Wallet connection with Base network integration
- PSX balance verification
- Tier system (Bronze, Silver, Gold, Platinum) based on holdings
- Mock verification for MVP (ready for real smart contract integration)

### Builder Profiles
- Comprehensive profiles with portfolios and past work
- Service offerings with multiple pricing tiers
- Review and rating system
- Twitter integration for KOL verification

### Marketplace
- Advanced search and filtering
- Category browsing
- Price range filtering
- Sort by price, rating, relevance
- Featured builders and services

## User Preferences
- Default theme: Dark mode with purple/cyan branding
- Design system follows design_guidelines.md
- Mobile-first responsive design
- Professional Web3 aesthetic

## Next Phase Features (Not Yet Implemented)
- Real Base network integration with actual PSX token contract
- On-chain payment processing with Base Pay
- Escrow smart contracts for secure payments
- Real-time messaging between clients and builders
- On-chain review verification
- Project milestone tracking
- "Become a Builder" onboarding flow
- Admin dashboard for platform management
