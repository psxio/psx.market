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
- ✅ **Builder application system with multi-step form wizard**

## Recent Changes (2025-10-21)
### Initial Implementation
- Implemented complete data schema for builders, services, categories, and reviews
- Built all frontend components with PSX branding (purple/cyan gradient)
- Created comprehensive backend with seed data
- Added wallet verification endpoints for token gating
- Fixed category matching between frontend and backend
- Added error handling and loading states throughout
- Implemented search and filter functionality

### Builder Application System
- Added complete builder application schema with category-specific fields
- Created multi-step form wizard (/apply route) with 4 steps:
  - Step 1: Profile information (name, email, bio, experience)
  - Step 2: Category selection (KOLs, 3D, Marketing, Development, Volume)
  - Step 3: Category-specific questions (dynamic fields based on selection)
  - Step 4: Review and submit
- Implemented backend API endpoints (POST /api/builder-applications)
- Added storage layer for builder application management
- Category-specific fields include:
  - **KOLs**: Twitter/Instagram/YouTube metrics, engagement rate, content niches
  - **3D Content**: Software proficiency, render engines, style specialties
  - **Marketing**: Platforms, growth strategies, case studies
  - **Development**: Programming languages, blockchain frameworks, GitHub profile
  - **Volume**: Trading experience, volume capabilities, compliance knowledge
- Fixed all TypeScript LSP errors and React controlled input warnings

### Base Pay Integration (Latest)
- **Replaced mock wallet with real Base Account SDK** (`@base-org/account`)
- Implemented production-ready wallet connection flow:
  - Real Base network integration (mainnet + Sepolia testnet support)
  - Automatic chain verification and switching to Base network
  - EIP-1193 compliant error handling (code 4001 for user rejection, 4902 for chain addition)
  - Provider event listeners for account/chain changes
- **Enhanced $PSX token balance checking**:
  - Proper ERC-20 ABI encoding for `balanceOf` and `decimals` calls
  - BigInt-based arithmetic to prevent precision loss
  - Dynamic decimals detection via `decimals()` function call
  - Returns '0' on error (removed fake balance fallback for security)
- **Added security features**:
  - Environment variable for PSX token address (`VITE_PSX_TOKEN_ADDRESS`)
  - `hasMinPSXBalance()` helper for token-gating enforcement
  - Network verification before all operations
  - Graceful handling of missing token configuration
- **UI improvements**:
  - Provider event handling (account/chain changes trigger state updates)
  - Loading states and error toasts
  - Automatic reconnection on page load if previously connected
  - Real wallet address formatting (0x1234...5678)

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
  - Builder Applications: POST /api/builder-applications, GET /api/builder-applications/:id

### Data Model
- **Builders**: Wallet address, name, bio, verified status, category, rating, skills, portfolio
- **Services**: Tiered pricing (basic/standard/premium), delivery time, PSX requirements
- **Categories**: KOLs, 3D Content, Marketing, Development, Volume
- **Reviews**: Client reviews with ratings and project details
- **Builder Applications**: Submitted applications with status (pending/approved/rejected), category-specific fields, and reviewer notes

## Key Features

### Token Gating
- **Real Base Pay wallet connection** using Base Account SDK
- Automatic network verification and switching to Base (mainnet/testnet)
- **Production-ready $PSX token balance verification**:
  - Proper ERC-20 contract calls with correct ABI encoding
  - Dynamic decimals detection
  - BigInt-based calculations for precision
- Tier system (Bronze, Silver, Gold, Platinum) based on holdings
- Provider event handling for account/chain changes
- Environment-based token address configuration (`VITE_PSX_TOKEN_ADDRESS`)

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
- On-chain payment processing with Base Pay (`pay` function for USDC transfers)
- Escrow smart contracts for secure payments
- Real-time messaging between clients and builders
- On-chain review verification
- Client onboarding with "Become a Client" button and registration flow
- Project milestone tracking with payment integration
- Admin dashboard for reviewing and approving builder applications
- Builder approval workflow (converting approved applications to active builder profiles)

## Configuration Required
To enable full token-gating functionality, set the following environment variable:
- `VITE_PSX_TOKEN_ADDRESS`: The deployed PSX ERC-20 token contract address on Base network
