# Based Creators → port444 Onboarding Requirements

## Overview
This document outlines all the information the Based Creators Chapters wizard needs to collect to ensure port444 can build a complete, high-quality builder profile during the unified onboarding process.

---

## Current Form Fields (From Screenshot)

### ✅ Already Collecting:
1. **First Name** (Required)
2. **Last Name** (Required)
3. **Email** (Optional)
4. **Industry** (Optional) - e.g., Web3 Development, Design, Marketing
5. **Social Profiles** (Optional):
   - Base Profile URL
   - X (Twitter) Handle
   - Farcaster Handle
   - Zora Profile URL

### 🔗 Automatically Available:
- **Wallet Address** (from wallet connection)
- **Network** (Base blockchain)

---

## ⚠️ CRITICAL MISSING FIELDS FOR PORT444

To create a functional builder profile on port444, we need the following **essential** fields:

### 1. Builder Category (REQUIRED)
**Why:** Port444 is organized by service categories - this is the #1 discovery mechanism

**Field Type:** Single-select dropdown

**Options:** (Must match port444 categories exactly)
- Smart Contract Development
- NFT Development
- Token Development
- DeFi Development
- Web3 Frontend Development
- Blockchain Integration
- Smart Contract Auditing
- Tokenomics Design
- Community Management
- Social Media Marketing
- Content Creation
- Graphic Design
- Video Production
- KOL/Influencer Services
- Project Management
- Legal/Compliance
- Market Making
- Memecoin Marketing
- Discord/Telegram Management
- Website Development

**Implementation:**
```jsx
<Select required name="category" placeholder="Select your primary service category">
  <SelectItem value="smart-contract-dev">Smart Contract Development</SelectItem>
  <SelectItem value="nft-dev">NFT Development</SelectItem>
  <SelectItem value="token-dev">Token Development</SelectItem>
  // ... all 20 categories
</Select>
```

---

### 2. Professional Bio (REQUIRED)
**Why:** Displayed on builder profile page, used for AI matching, critical for SEO

**Field Type:** Textarea (multi-line)

**Requirements:**
- Minimum: 100 characters
- Maximum: 1000 characters
- Placeholder: "Describe your expertise, experience, and what makes you unique. What services do you offer? What have you built?"

**Example Good Bios:**
- "Full-stack Solidity developer with 5+ years building DeFi protocols. Specialized in AMM design, yield farming strategies, and smart contract security. Built protocols managing $50M+ TVL. Available for audits, contract development, and technical consulting."
- "Memecoin marketing specialist. Launched 30+ tokens to 7-figure market caps. Expert in Twitter growth, KOL partnerships, and community building. I help projects go from 0 to viral."

**Implementation:**
```jsx
<Textarea 
  required
  name="bio"
  minLength={100}
  maxLength={1000}
  placeholder="Describe your expertise, experience, and what makes you unique..."
  rows={6}
/>
<p className="text-sm text-muted-foreground">{bio.length}/1000 characters (min 100)</p>
```

---

### 3. Years of Experience (REQUIRED)
**Why:** Trust signal, pricing indicator, filtering option

**Field Type:** Number input or select

**Options:**
- Less than 1 year
- 1-2 years
- 3-5 years
- 6-10 years
- 10+ years

**Implementation:**
```jsx
<Select required name="yearsOfExperience">
  <SelectItem value="0-1">Less than 1 year</SelectItem>
  <SelectItem value="1-2">1-2 years</SelectItem>
  <SelectItem value="3-5">3-5 years</SelectItem>
  <SelectItem value="6-10">6-10 years</SelectItem>
  <SelectItem value="10+">10+ years</SelectItem>
</Select>
```

---

### 4. Profile Image (REQUIRED)
**Why:** Visual trust, professional appearance, used everywhere on port444

**Field Type:** Image upload or URL input

**Requirements:**
- Minimum: 200x200px
- Recommended: 400x400px
- Formats: JPG, PNG, WebP
- Max size: 5MB
- Square aspect ratio preferred

**Options:**
- Upload from device
- Use wallet avatar (if available)
- Enter image URL
- AI-generated avatar (optional)

**Implementation:**
```jsx
<div className="space-y-3">
  <Label>Profile Photo *</Label>
  <div className="flex gap-3">
    <Input 
      type="file" 
      accept="image/jpeg,image/png,image/webp"
      onChange={handleImageUpload}
    />
    <Button type="button" variant="outline" onClick={useWalletAvatar}>
      Use Wallet Avatar
    </Button>
  </div>
  {preview && <img src={preview} className="w-24 h-24 rounded-full" />}
</div>
```

---

### 5. Pricing Information (REQUIRED)
**Why:** Clients need to know affordability, filtering/sorting, AI price optimization

**Fields Needed:**

#### a) Hourly Rate (Optional but recommended)
**Field Type:** Number input with currency
```jsx
<div className="flex gap-2">
  <span className="text-2xl">$</span>
  <Input 
    type="number" 
    name="hourlyRate"
    placeholder="50"
    min="10"
    max="1000"
  />
  <span className="text-muted-foreground">/ hour</span>
</div>
```

#### b) Minimum Project Budget (REQUIRED)
**Field Type:** Number input
```jsx
<div className="flex gap-2">
  <span className="text-2xl">$</span>
  <Input 
    required
    type="number" 
    name="minimumBudget"
    placeholder="500"
    min="50"
  />
  <span className="text-muted-foreground">minimum project size</span>
</div>
```

---

### 6. Skills & Expertise (REQUIRED)
**Why:** Searchable tags, AI matching, category-specific filtering

**Field Type:** Multi-select tags or comma-separated input

**Requirements:**
- Minimum: 3 skills
- Maximum: 15 skills
- Category-specific suggestions

**Example by Category:**
- **Smart Contract Dev**: Solidity, Rust, Move, Hardhat, Foundry, OpenZeppelin, ERC20, ERC721, Upgradeable Contracts
- **Marketing**: Twitter Growth, KOL Outreach, Viral Campaigns, Meme Creation, Community Building
- **Design**: Figma, Adobe Suite, Web3 UI/UX, NFT Art, 3D Modeling

**Implementation:**
```jsx
<div>
  <Label>Skills & Expertise * (Select at least 3)</Label>
  <MultiSelect
    required
    minSelections={3}
    maxSelections={15}
    options={skillsForCategory[selectedCategory]}
    placeholder="Select your skills..."
  />
</div>
```

---

## 🎯 HIGHLY RECOMMENDED FIELDS

### 7. Portfolio / Previous Work (Highly Recommended)
**Why:** Social proof, quality indicator, builds trust

**Field Type:** URL input (up to 3 links) or file upload

**What to collect:**
- GitHub repositories
- Deployed contracts (Basescan links)
- Previous project websites
- Case study links
- Portfolio PDF

**Implementation:**
```jsx
<div className="space-y-3">
  <Label>Portfolio / Previous Work (Recommended)</Label>
  <Input 
    type="url" 
    name="portfolioLink1"
    placeholder="https://github.com/yourname/project"
  />
  <Input 
    type="url" 
    name="portfolioLink2"
    placeholder="https://basescan.org/address/0x..."
  />
  <Input 
    type="url" 
    name="portfolioLink3"
    placeholder="https://yourportfolio.com"
  />
</div>
```

---

### 8. Twitter Handle (Highly Recommended)
**Why:** Verification, social proof, follower count display, auto-fill data

**Current Status:** Already collecting ✅

**Enhancement:** Auto-verify and fetch data via Twitter API
- Fetch follower count
- Verify account exists
- Pull profile image as backup
- Display verified badge if applicable

---

### 9. Location / Timezone (Recommended)
**Why:** Response time expectations, client scheduling, geographic filtering

**Field Type:** Select or autocomplete

**Implementation:**
```jsx
<Select name="timezone">
  <SelectItem value="America/New_York">EST (UTC-5)</SelectItem>
  <SelectItem value="America/Los_Angeles">PST (UTC-8)</SelectItem>
  <SelectItem value="Europe/London">GMT (UTC+0)</SelectItem>
  <SelectItem value="Asia/Singapore">SGT (UTC+8)</SelectItem>
  // ... all timezones
</Select>
```

---

### 10. Languages Spoken (Recommended)
**Why:** International client matching, filtering

**Field Type:** Multi-select

**Options:**
- English (default)
- Spanish
- Mandarin
- Japanese
- Korean
- French
- German
- Russian
- Portuguese
- Arabic

---

## 📝 OPTIONAL BUT VALUABLE FIELDS

### 11. GitHub Profile
**Already collecting:** No
**Value:** Critical for technical builders (smart contract devs, frontend devs)

```jsx
<Input 
  type="url"
  name="githubUrl"
  placeholder="https://github.com/username"
/>
```

---

### 12. Telegram Handle
**Already collecting:** No
**Value:** Preferred communication method for many Web3 clients

```jsx
<Input 
  type="text"
  name="telegramHandle"
  placeholder="@username"
/>
```

---

### 13. Certifications / Credentials (Optional)
**Why:** Trust signals, specialization proof

**Examples:**
- "Certified Solidity Developer"
- "OpenZeppelin Security Auditor"
- "Google Analytics Certified"

```jsx
<Input 
  type="text"
  name="certifications"
  placeholder="e.g., Certified Solidity Developer, AWS Certified"
/>
```

---

## 🚀 FIRST SERVICE CREATION (REQUIRED)

### Critical Requirement
**port444 builders MUST have at least one active service listing**

The onboarding wizard should include a **Service Creation Step** at the end:

### Service Fields Required:

#### 1. Service Title (REQUIRED)
```jsx
<Input 
  required
  name="serviceTitle"
  placeholder="e.g., Custom ERC20 Token Development"
  maxLength={100}
/>
```

#### 2. Service Description (REQUIRED)
```jsx
<Textarea
  required
  name="serviceDescription"
  placeholder="Describe what you'll deliver, your process, and what makes your service unique..."
  minLength={200}
  maxLength={2000}
/>
```

#### 3. Service Category (Auto-filled from builder category)
Pre-populate with builder's primary category

#### 4. Pricing Packages (REQUIRED)
**At minimum, collect Basic package:**

```jsx
<div className="border rounded-lg p-4">
  <h3>Basic Package *</h3>
  
  <Input 
    required
    type="number"
    name="basicPrice"
    placeholder="Price in USD"
    min="10"
  />
  
  <Input 
    required
    type="number"
    name="basicDeliveryDays"
    placeholder="Delivery time in days"
    min="1"
  />
  
  <Input 
    required
    type="number"
    name="basicRevisions"
    placeholder="Number of revisions included"
    min="0"
  />
  
  <Textarea
    required
    name="basicDescription"
    placeholder="What's included in this package?"
  />
</div>
```

**Optional:** Offer Standard and Premium packages too

#### 5. Service Tags (REQUIRED)
```jsx
<Input
  required
  name="serviceTags"
  placeholder="e.g., ERC20, Token Launch, Solidity"
/>
```

#### 6. Delivery Format (REQUIRED)
What will the client receive?
```jsx
<Textarea
  required
  name="deliveryFormat"
  placeholder="e.g., Verified smart contract code, deployment script, documentation, 1-hour training call"
/>
```

---

## 📊 COMPLETE RECOMMENDED FORM FLOW

### Step 1: Basic Information (Current + Enhancements)
```
✓ First Name *
✓ Last Name *
✓ Email *
✓ Profile Photo * (NEW - REQUIRED)
✓ Location/Timezone (NEW - recommended)
```

### Step 2: Professional Details (NEW STEP - REQUIRED)
```
✓ Primary Category * (NEW - REQUIRED)
✓ Bio * (NEW - REQUIRED)
✓ Years of Experience * (NEW - REQUIRED)
✓ Skills & Expertise * (min 3) (NEW - REQUIRED)
✓ Languages Spoken (NEW - recommended)
```

### Step 3: Pricing & Portfolio (NEW STEP - REQUIRED)
```
✓ Minimum Project Budget * (NEW - REQUIRED)
✓ Hourly Rate (NEW - recommended)
✓ Portfolio Links (up to 3) (NEW - recommended)
✓ Certifications (NEW - optional)
```

### Step 4: Social Connections (Current + Enhancements)
```
✓ Twitter/X Handle * (MAKE REQUIRED)
✓ GitHub URL (NEW - for technical roles)
✓ Telegram Handle (NEW - recommended)
✓ Base Profile URL ✓
✓ Farcaster Handle ✓
✓ Zora Profile URL ✓
```

### Step 5: Create Your First Service (NEW STEP - REQUIRED)
```
✓ Service Title *
✓ Service Description *
✓ Basic Package Price *
✓ Delivery Time *
✓ Revisions Included *
✓ What's Included *
✓ Service Tags *
```

### Step 6: Review & Submit
```
- Preview of builder profile
- Preview of first service
- Checkbox: "I agree to port444 Terms of Service"
- Checkbox: "I agree to Based Creators Terms"
- Submit button: "Create Both Accounts"
```

---

## 🔄 DATA MAPPING TO PORT444

### How Fields Map to port444 Database:

| Based Creators Field | port444 Database Field | Table | Required |
|---------------------|----------------------|--------|----------|
| First Name | `name` | `builders` | ✓ |
| Last Name | Append to `name` | `builders` | ✓ |
| Email | `email` | `builders` | ✓ |
| Wallet Address | `walletAddress` | `builders` | ✓ |
| Category | `category` | `builders` | ✓ |
| Bio | `bio` | `builders` | ✓ |
| Profile Photo | `profileImage` | `builders` | ✓ |
| Years Experience | `yearsOfExperience` | `builders` | ✓ |
| Hourly Rate | `hourlyRate` | `builders` | - |
| Min Budget | `minimumBudget` | `builders` | ✓ |
| Skills | `skills` (array) | `builders` | ✓ |
| Twitter Handle | `twitterHandle` | `builders` | ✓ |
| GitHub URL | `githubUrl` | `builders` | - |
| Telegram | `telegramHandle` | `builders` | - |
| Portfolio Link 1-3 | `portfolioUrl` | `builders` | - |
| Location/Timezone | `location`, `timezone` | `builders` | - |
| Languages | `languages` (array) | `builders` | - |
| Industry | Tags/additional metadata | `builders` | - |
| Base Profile | `baseProfileUrl` | `builders` | - |
| Farcaster | `farcasterHandle` | `builders` | - |
| Zora | `zoraProfileUrl` | `builders` | - |

### Service Data:

| Form Field | Database Field | Table | Required |
|-----------|---------------|--------|----------|
| Service Title | `title` | `services` | ✓ |
| Service Description | `description` | `services` | ✓ |
| Category | `category` | `services` | ✓ |
| Basic Price | `basicPrice` | `services` | ✓ |
| Basic Delivery | `basicDeliveryDays` | `services` | ✓ |
| Basic Revisions | `basicRevisions` | `services` | ✓ |
| Basic Description | `basicDescription` | `services` | ✓ |
| Service Tags | `tags` (array) | `services` | ✓ |

---

## 🎨 UI/UX RECOMMENDATIONS

### Progress Indicator
Show clear progress through the wizard:
```
○ Basic Info → ○ Professional → ○ Pricing → ○ Social → ○ Service → ○ Review
```

### Validation
- Real-time validation on all required fields
- Character counters for bio/descriptions
- URL validation for links
- Image preview for profile photo
- Twitter handle verification (API check)

### Smart Defaults
- Pre-populate email if available from Base profile
- Suggest skills based on selected category
- Default profile image from wallet/Twitter if available

### Help Text
Each field should have helpful placeholder/description:
- "Your bio is your pitch to potential clients. Make it compelling!"
- "Minimum budget helps filter clients who can afford your services"
- "Select skills that match what clients search for"

---

## 🔧 TECHNICAL IMPLEMENTATION

### API Endpoint
Based Creators should POST to:
```
POST https://port444.repl.co/api/chapters-onboarding
```

### Request Body Structure:
```json
{
  // Basic Info
  "firstName": "Satoshi",
  "lastName": "Nakamoto",
  "email": "satoshi@base.org",
  "walletAddress": "0xae0e...7943",
  "profileImage": "https://...",
  
  // Professional
  "category": "smart-contract-dev",
  "bio": "Solidity developer with 5+ years...",
  "yearsOfExperience": "3-5",
  "skills": ["Solidity", "Hardhat", "OpenZeppelin", "ERC20"],
  "languages": ["English", "Japanese"],
  "location": "Tokyo, Japan",
  "timezone": "Asia/Tokyo",
  
  // Pricing
  "hourlyRate": 100,
  "minimumBudget": 500,
  
  // Social
  "twitterHandle": "@satoshi",
  "githubUrl": "https://github.com/satoshi",
  "telegramHandle": "@satoshi_tg",
  "baseProfileUrl": "https://base.org/satoshi",
  "farcasterHandle": "satoshi.eth",
  "zoraProfileUrl": "https://zora.co/satoshi",
  
  // Portfolio
  "portfolioLinks": [
    "https://github.com/bitcoin/bitcoin",
    "https://basescan.org/address/0x..."
  ],
  "certifications": "Certified Blockchain Developer",
  
  // First Service
  "service": {
    "title": "Custom ERC20 Token Development",
    "description": "I'll develop a custom ERC20 token...",
    "category": "token-dev",
    "basicPrice": 500,
    "basicDeliveryDays": 3,
    "basicRevisions": 2,
    "basicDescription": "Complete token with mint/burn, deployment",
    "basicDeliverables": ["Verified contract", "Deployment docs"],
    "tags": ["ERC20", "Token", "Solidity"]
  },
  
  // Based Creators specific
  "basedCreatorsRegion": "APAC",
  "referralSource": "chapters-invite"
}
```

### Response:
```json
{
  "success": true,
  "port444UserId": "uuid-here",
  "basedCreatorsUserId": "uuid-here",
  "builderProfileUrl": "https://port444.repl.co/builders/satoshi",
  "serviceUrl": "https://port444.repl.co/services/custom-erc20-token",
  "message": "Accounts created successfully on both platforms"
}
```

---

## ✅ VALIDATION CHECKLIST

Before launching, ensure:

- [ ] All REQUIRED fields are marked and validated
- [ ] Character minimums enforced (bio: 100, service desc: 200)
- [ ] Profile image upload/preview working
- [ ] Category dropdown matches port444 exactly
- [ ] Skills multi-select has min 3 items
- [ ] Twitter handle auto-verification working
- [ ] Service creation is mandatory
- [ ] Price validation (min $10, max $10,000)
- [ ] URL validation for all link fields
- [ ] Error messages are clear and helpful
- [ ] Progress is saved between steps
- [ ] "Back" button works without data loss
- [ ] Preview shows complete profile before submit
- [ ] Both platforms receive data correctly
- [ ] Email confirmation sent to user
- [ ] Builder can log in to port444 immediately

---

## 📞 INTEGRATION SUPPORT

For questions or integration help:
- Technical issues: Review API endpoint documentation
- Field mapping questions: Reference the data mapping table above
- Design/UX feedback: Match port444 branding guidelines
- Testing: Use test wallet addresses and verify on port444 staging

---

## Summary: Minimum Viable Onboarding

**At bare minimum, collect these fields to create a functional port444 profile:**

1. ✓ First Name + Last Name
2. ✓ Email
3. ✓ Wallet Address (auto)
4. ✓ Profile Photo
5. ✓ Category
6. ✓ Bio (100+ chars)
7. ✓ Years of Experience
8. ✓ Skills (min 3)
9. ✓ Minimum Budget
10. ✓ Twitter Handle
11. ✓ First Service (title, description, price, delivery time, revisions, deliverables)

Everything else is optional but highly recommended for profile quality and discoverability.
