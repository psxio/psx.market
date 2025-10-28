# port444 Web3 Marketplace - Design Guidelines

## Design Approach

**Reference-Based Approach** drawing from:
- **Fiverr**: Simple search-centric hero, white backgrounds, large category cards with images
- **Upwork**: Professional clean layouts, icon-based navigation, minimal color usage
- **Base.org**: Generous white space, minimal blue accent usage, clean typography
- **Nemesis.trade**: Beige/neutral aesthetic, breathing room, restrained design

**Core Principle**: Professional SaaS simplicity meets Web3 functionality. Prioritize clarity and usability over visual complexity.

## Color Palette

**Light Mode Primary** (default):
- Background: `#FFFFFF` (pure white)
- Secondary BG: `#FAFAF9` (warm off-white, like Nemesis)
- Surface Cards: `#FFFFFF` with 1px `#E5E5E5` borders
- Primary Accent: `#7C3AED` (purple - use sparingly for CTAs only)
- Secondary Accent: `#06B6D4` (cyan - verified badges, success states only)
- Text Primary: `#171717`
- Text Secondary: `#737373`
- Text Tertiary: `#A3A3A3`

**NO gradients, NO background treatments, NO color fills except accents**

## Typography

**Font Stack**: 'Inter' exclusively (system-ui fallback)

**Hierarchy**:
- Hero Headline: text-5xl lg:text-6xl, font-bold (700)
- Section Headers: text-3xl lg:text-4xl, font-semibold (600)
- Card Titles: text-lg, font-medium (500)
- Body Text: text-base, font-normal (400)
- Captions/Meta: text-sm, text-secondary
- Wallet Addresses: 'JetBrains Mono', text-sm

**Keep all copy minimal - maximum 12 words per headline, 20 words per description**

## Layout System

**Spacing Primitives**: Tailwind units of 4, 6, 8, 12, 16, 24, 32
- Section padding: py-16 md:py-24 lg:py-32
- Card padding: p-6 lg:p-8
- Gap between elements: gap-4, gap-6, gap-8

**Container Strategy**:
- Max-width: max-w-7xl
- Horizontal padding: px-6 md:px-8 lg:px-12
- Generous margins: mt-16, mb-24 between major sections

**Grid Systems**:
- Seller Cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Category Icons: grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4
- Featured Work: grid-cols-2 lg:grid-cols-4 gap-4

## Component Library

### Navigation
- Clean white background, 1px bottom border `#E5E5E5`
- Logo (left), centered search bar, "Post Job" + "Connect Wallet" buttons (right)
- Mobile: Hamburger → full-screen overlay menu
- Wallet button: Simple outline, shows "0.00 PSX" when connected (no Base logo visible)
- Height: h-16 lg:h-20

### Hero Section
- **Large hero image** (professional marketplace scene, diverse sellers collaborating)
- Dark overlay (opacity-40) for text readability
- Centered content: Headline (white text) + single search bar + trust metrics below
- Search bar: Large (h-14), white background, subtle shadow, purple "Search" button inside
- Trust metrics: "12,000+ sellers • 50k projects completed" (white text, text-sm)
- No secondary CTAs in hero - keep focused on search

### Category Navigation
- Below hero: Icon grid with 6-8 main categories
- Each category: 80x80 icon (simple line illustrations), label below, hover state lifts card
- White cards, rounded-xl, 1px border, centered content
- Icons use purple stroke on white background

### Seller Cards (Marketplace Grid)
- White card, rounded-lg, 1px `#E5E5E5` border
- Profile photo (48x48, circular, top-left)
- Verified badge (small cyan checkmark, top-right)
- Service title (font-medium, 1 line truncate)
- Brief description (text-sm, text-secondary, 2 lines max)
- Star rating + review count (text-sm)
- Price: "From $500" (font-semibold) + "100 PSX required" (text-xs, text-tertiary)
- Hover: Subtle shadow increase, no color change

### Search & Filters
- Left sidebar (desktop): Clean white background, section headers in font-medium
- Filter sections: Category checkboxes, Price range slider, Rating stars, Delivery time
- Active filters: Small pills with X to dismiss (1px border, no background fill)
- Sort dropdown: Minimal styling, 1px border

### Profile Pages
- Large cover image (aspect-ratio 21:9, subtle professional photo)
- Profile section: Photo (120x120), name (text-2xl), headline, stats row below
- Stats: "4.9★ (234) • 89% response • 156 projects"
- Tabbed navigation: About | Portfolio | Reviews (underline active tab with purple)
- Portfolio: Masonry grid of work samples (images only, no text overlays)
- Package cards: 3 tiers side-by-side, white cards, 1px border, pricing prominent

### Forms & Inputs
- All inputs: White background, 1px `#D4D4D4` border, rounded-md, h-12 minimum
- Focus state: 2px purple border, NO glow/shadow
- Labels: text-sm, font-medium, mb-2
- Submit buttons: bg-purple, text-white, rounded-md, h-12

### Wallet Connection Modal
- Centered modal, max-w-md, white background, rounded-xl
- Simple: "Connect Wallet" header, Base logo + "Continue with Base" button
- PSX requirement notice: Beige background box with text, NO border

### Footer
- Three-column layout on desktop, stacked on mobile
- White background, 1px top border
- Columns: Platform (About, How it Works), Categories (6 links), Resources
- Social icons: Simple outline style, 24x24
- Copyright: text-sm, text-tertiary, centered

## Images

### Hero Section
**Large hero image**: Professional marketplace scene showing diverse freelancers/sellers collaborating. Modern office/creative space setting. Bright, high-quality photo with natural lighting. Dark overlay (40% opacity) ensures white text readability.

### Category Icons
Simple line-art illustrations (80x80): Code brackets, megaphone, 3D cube, palette, camera, chart icons. Purple stroke on white background. Clean, minimalist style.

### Seller Profile Photos
Authentic professional headshots (circular crops). Encourage real photos, not avatars.

### Portfolio Work Samples
High-quality screenshots, designs, or project photos in masonry grid. No overlays or text on images themselves.

### Background Elements
NO background graphics. Pure white or warm off-white only.

## Animations

**Minimal & Purposeful Only**:
- Card hover: translateY(-2px) + shadow-md transition
- Button hover: Built-in states (no custom animations)
- Page loads: Simple fade-in (300ms)
- Modal appear: Scale from 0.95 to 1 (200ms)
- **NO scroll animations, NO parallax, NO constant motion**

## Accessibility

- Minimum contrast ratio: 4.5:1 for all text
- All interactive elements: Clear focus states (2px purple outline)
- Keyboard navigation: Tab through all actions logically
- Clear hierarchy: Proper heading structure (h1 → h6)
- Input labels: Always visible, never placeholder-only
- Token requirements: Clearly communicated in plain language

**Key Success Metrics**: User should find and contact a seller within 3 clicks. Every screen should have one clear primary action.