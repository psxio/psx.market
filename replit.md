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

### Admin Dashboard System (Production-Ready ✅)
- **Complete admin authentication and authorization**:
  - Session-based authentication using express-session with HttpOnly cookies
  - Bcrypt password hashing for secure credential storage
  - Protected API routes with requireAdminAuth middleware
  - Default admin credentials: username: `admin`, password: `admin123` (should be changed in production)
  - Session management with automatic expiry (24 hours)
  - Secure logout with session destruction
- **Admin dashboard UI with Shadcn sidebar**:
  - Login page at /admin/login with authentication flow
  - Full admin dashboard at /admin with protected routes
  - Responsive sidebar navigation with sections for all entities
  - Gradient branding consistent with PSX theme
- **Complete CRUD interfaces**:
  - **Builders**: View all builders, delete builders, approve builder applications
  - **Clients**: View all clients, manage client accounts
  - **Services**: View all services, manage service listings
  - **Applications**: Review pending builder applications, approve/reject workflow
  - **Referrals**: Track referral program, manage rewards and statuses
- **Admin API routes** (all protected with session auth):
  - Auth: POST /api/admin/login, POST /api/admin/logout
  - Builders: GET/POST/PUT/DELETE /api/admin/builders
  - Clients: GET/POST/PUT/DELETE /api/admin/clients
  - Services: GET/POST/PUT/DELETE /api/admin/services
  - Applications: GET/PUT/DELETE /api/admin/applications, POST /api/admin/applications/:id/approve
  - Referrals: GET/POST/PUT/DELETE /api/admin/referrals
- **Data schemas**:
  - Admin schema: id, username, passwordHash, email, name, role, lastLogin, createdAt
  - Referral schema: id, referrerWallet, referredWallet, referrerType, referredType, status, reward, createdAt, completedAt
- **Statistics dashboard**: Real-time overview of platform metrics (total builders, clients, services, pending applications, active referrals)

### Base Pay Integration (Production-Ready ✅)
- **Replaced mock wallet with real Base Account SDK** (`@base-org/account`)
- **Production-ready wallet connection flow**:
  - Real Base network integration (mainnet + Sepolia testnet support)
  - Automatic chain verification and switching to Base network on all balance operations
  - EIP-1193 compliant error handling (code 4001 for user rejection, 4902 for chain addition)
  - Provider event listeners for account/chain changes with proper lifecycle management
  - Listeners properly removed on disconnect and reset on reconnect
- **Production-ready $PSX token balance checking**:
  - Proper ERC-20 ABI encoding for `balanceOf` and `decimals` calls
  - BigInt-based arithmetic throughout to prevent precision loss
  - Dynamic decimals detection via `decimals()` function call
  - Loop-based divisor construction (no Number intermediate values)
  - Handles edge cases (decimals === 0, zero-address guard)
  - Returns '0' on error (removed fake balance fallback for security)
  - Chain verification before every balance query
- **Token-gating utilities**:
  - `getPSXBalance()`: Formatted balance as string with proper decimals
  - `getRawPSXBalance()`: Returns {value: bigint, decimals: number} for precise comparisons
  - `hasMinPSXBalancePrecise()`: BigInt-safe comparison using actual token decimals
  - Environment variable for PSX token address (`VITE_PSX_TOKEN_ADDRESS`)
  - Network verification before all operations
  - Graceful handling of missing token configuration
- **UI/UX enhancements**:
  - Provider event handling (account/chain changes trigger state updates)
  - Loading states and error toasts with user-friendly messages
  - Automatic reconnection on page load if previously connected
  - Real wallet address formatting (0x1234...5678)
  - Network switching guidance in error messages

## Project Architecture

### Frontend (React + TypeScript)
- **Public Pages**: Home, Marketplace, Builder Profile, Category, Apply
- **Admin Pages**: Login, Dashboard, Builders, Clients, Services, Applications, Referrals
- **Components**: Header, Wallet Connect, Builder Card, Category Pill, Admin Sidebar
- **Styling**: Tailwind CSS + Shadcn UI with custom PSX color scheme
- **State Management**: TanStack Query for data fetching, Admin Auth Context for session management

### Backend (Express + TypeScript)
- **Storage**: In-memory storage with seed data (MemStorage)
- **Authentication**: Express-session with MemoryStore, bcrypt password hashing
- **Middleware**: requireAdminAuth for protecting admin routes
- **Public API Routes**: 
  - Categories: GET /api/categories, GET /api/categories/:slug
  - Builders: GET /api/builders, GET /api/builders/featured, GET /api/builders/:id
  - Services: GET /api/services (with search/filter), GET /api/services/featured
  - Reviews: GET /api/builders/:id/reviews
  - Wallet: POST /api/wallet/verify, GET /api/wallet/balance/:address
  - Builder Applications: POST /api/builder-applications, GET /api/builder-applications/:id
- **Protected Admin API Routes**: (require session authentication)
  - Auth: POST /api/admin/login, POST /api/admin/logout
  - Builders: GET/POST/PUT/DELETE /api/admin/builders/:id?
  - Clients: GET/POST/PUT/DELETE /api/admin/clients/:id?
  - Services: GET/POST/PUT/DELETE /api/admin/services/:id?
  - Applications: GET/PUT/DELETE /api/admin/applications/:id, POST /api/admin/applications/:id/approve
  - Referrals: GET/POST/PUT/DELETE /api/admin/referrals/:id?

### Data Model
- **Builders**: Wallet address, name, bio, verified status, category, rating, skills, portfolio
- **Clients**: Wallet address, name, email, bio, verified status, PSX tier, company name
- **Services**: Tiered pricing (basic/standard/premium), delivery time, PSX requirements
- **Categories**: KOLs, 3D Content, Marketing, Development, Volume
- **Reviews**: Client reviews with ratings and project details
- **Builder Applications**: Submitted applications with status (pending/approved/rejected), category-specific fields, and reviewer notes
- **Admins**: Username, password hash, email, name, role, last login timestamp
- **Referrals**: Referrer/referred wallets, types, status (pending/completed/cancelled), reward amounts

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
