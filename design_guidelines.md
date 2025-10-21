# PSX Web3 Marketplace - Design Guidelines

## Design Approach

**Reference-Based Approach** drawing from:
- **Fiverr/Upwork**: Marketplace structure, search/filtering, profile layouts
- **Dribbble/Behance**: Portfolio showcase patterns, visual hierarchy
- **Uniswap/OpenSea**: Web3 aesthetic, wallet integration UI
- **Linear/Stripe**: Clean typography, modern spacing, refined interactions

**Core Principle**: Create a premium, trust-building marketplace that bridges Web3 innovation with professional service delivery.

## Color Palette

**Dark Mode Primary** (default):
- Background: 222 15% 8% (deep charcoal)
- Surface: 220 12% 12% (elevated panels)
- Primary: 275 85% 65% (vibrant purple - PSX brand)
- Accent: 160 75% 55% (cyan-green for success/verified)
- Text Primary: 0 0% 98%
- Text Secondary: 0 0% 70%

**Light Mode**:
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Primary: 275 75% 55%
- Accent: 160 70% 45%

**Semantic Colors**:
- Success: 142 76% 45% (verified sellers, completed)
- Warning: 38 92% 55% (pending reviews)
- Token Highlight: 45 93% 60% (PSX token displays)

## Typography

**Font Stack**:
- Headers: 'Inter', system-ui (weights: 700, 800)
- Body: 'Inter', system-ui (weights: 400, 500, 600)
- Monospace: 'JetBrains Mono' (for wallet addresses, token amounts)

**Scale**:
- Hero: text-6xl to text-7xl (bold)
- Section Headers: text-3xl to text-4xl
- Card Titles: text-xl (semibold)
- Body: text-base
- Captions: text-sm

## Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 24 for consistency (e.g., p-4, gap-8, mb-12)

**Grid System**:
- Container: max-w-7xl with px-4 md:px-6 lg:px-8
- Seller Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Featured Sellers: grid-cols-1 lg:grid-cols-2 (larger cards)
- Category Pills: Horizontal scroll on mobile, wrapped grid on desktop

## Component Library

**Navigation**:
- Sticky header with logo, category navigation, search bar, wallet connect button
- Wallet button shows PSX balance + Base logo when connected
- Mobile: Hamburger menu with slide-out drawer

**Hero Section**:
- Split layout: Left side with headline + CTAs, Right side with 3D illustration or animated graphic
- Headline emphasizes "Token-Gated Premium Web3 Services"
- Dual CTAs: "Browse Services" (primary) + "Become a Seller" (outline with blur backdrop)
- Trust indicators below: "X Active Sellers • Y Projects Completed • PSX Token Gated"

**Seller Cards**:
- Card design: rounded-xl, subtle border, hover lift effect
- Profile image (circular, top-left)
- Verified badge (checkmark icon, accent color) for vetted sellers
- Service title, brief description
- Star rating + review count
- Starting price in stablecoins + PSX token requirement
- Category tags (pill style)
- "View Profile" button on hover

**Search & Filters**:
- Prominent search bar in header
- Left sidebar filters: Categories, Price Range, Rating, Delivery Time, PSX Tier
- Sort options: Relevance, Price, Rating, Delivery Speed
- Active filters displayed as dismissible pills

**Profile Pages**:
- Hero banner with seller photo, name, headline, stats (reviews, projects, response time)
- Tabbed sections: About, Portfolio, Reviews, Packages
- Portfolio grid showcasing previous work (masonry layout)
- Package cards with tiered pricing (Basic/Standard/Premium)
- Review cards with client testimonials, ratings, project details

**Token Gating UI**:
- Banner showing PSX requirement for actions
- "Connect Wallet" modal with Base branding
- Token balance display in header
- Insufficient balance warnings with "Get PSX" CTA

**Messaging/Hiring Flow**:
- In-app chat interface (right sidebar or full modal)
- Project brief form with deliverables, timeline, budget
- Token allocation interface showing stablecoin + PSX payment split
- Milestone tracking UI with escrow status

**Category Pages**:
- Category hero with description + key stats
- Featured sellers in this category (2-col grid)
- All sellers (3-4 col grid)
- Category-specific filters

**Footer**:
- Multi-column: About PSX, Service Categories, Resources, Base Integration info
- Social links, newsletter signup
- Legal links, copyright

## Images

**Hero Section**: Large 3D illustration or animated graphic on the right side showing Web3 concepts (tokens, connections, marketplace) - vibrant, futuristic style

**Seller Profiles**: Authentic profile photos, portfolio work samples, project screenshots

**Category Icons**: Custom illustrations for each service type (KOL, 3D content, marketing, etc.)

**Trust Badges**: Verified seller badges, Base blockchain logo, security indicators

**Background Elements**: Subtle gradient meshes, floating geometric shapes (very subtle, not distracting)

## Animations

**Minimal & Purposeful**:
- Card hover: Subtle lift (translateY -2px) + shadow increase
- Button hovers: Built-in button states
- Page transitions: Fade in content
- Wallet connect: Success checkmark animation
- NO parallax, NO scroll-triggered animations, NO constant motion

## Accessibility

- Full dark mode implementation including all inputs, modals, dropdowns
- Proper color contrast ratios (WCAG AA minimum)
- Focus indicators on all interactive elements
- Keyboard navigation support
- Clear token requirement communication for screen readers