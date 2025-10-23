# Social Media Integration Guide
**Create.psx Real Data Integration System**

## Overview
This document describes the real data integration system for Create.psx, replacing all mock/placeholder data with actual API integrations.

## ✅ Implemented (Real Data)

### 1. GitHub Integration
**Status: FULLY FUNCTIONAL**

Builders can connect their GitHub accounts and fetch **real data**:
- Real follower count
- Public repository count
- Total stars across all repos
- Total forks across all repos
- Bio, location, company, website
- Avatar URL

**How it works:**
1. Builder enters GitHub username
2. System calls GitHub REST API (no authentication needed for public data)
3. Real-time data is fetched and displayed
4. No mock data - everything is real

**API Endpoint:** `POST /api/builders/:id/verify-github`

**Example Response:**
```json
{
  "verified": true,
  "username": "octocat",
  "name": "The Octocat",
  "followers": 5234,
  "publicRepos": 42,
  "bio": "GitHub mascot",
  "location": "San Francisco",
  "company": "@github",
  "totalStars": 1234,
  "totalForks": 567
}
```

### 2. Twitter/X Verification
**Status: USERNAME VERIFICATION WORKING**

- Validates Twitter username format
- Extracts username from various input formats (@username, URLs)
- Stores verified handle in builder profile

**Next step for real data:**
- Need Twitter API v2 OAuth 2.0 setup
- Requires Twitter Developer Account + API keys
- Once configured, will fetch real follower counts

**API Endpoint:** `POST /api/builders/:id/verify-twitter`

### 3. Instagram Verification
**Status: USERNAME VERIFICATION WORKING**

- Validates Instagram username format
- Extracts username from URLs
- Stores verified handle in builder profile

**Next step for real data:**
- Requires Meta Graph API access
- Needs Facebook Developer App + Instagram Business Account
- Once configured, will fetch real follower counts

**API Endpoint:** `POST /api/builders/:id/verify-instagram`

### 4. YouTube Verification
**Status: URL VALIDATION WORKING**

- Validates and parses YouTube channel URLs
- Supports multiple URL formats (/@handle, /channel/, /c/, /user/)
- Stores channel URL in builder profile

**Next step for real data:**
- Requires YouTube Data API v3 key
- Free tier: 10,000 units/day (100+ queries)
- Once configured, will fetch real subscriber counts

**API Endpoint:** `POST /api/builders/:id/verify-youtube`

### 5. Telegram Verification
**Status: HANDLE VERIFICATION WORKING**

- Validates Telegram handle format
- Extracts handle from t.me URLs
- Stores verified handle in builder profile

**API Endpoint:** `POST /api/builders/:id/verify-telegram`

## 🔄 Wallet Balance Integration
**Status: BETA MODE (Whitelist System)**

Current Implementation:
- Uses `tokenGateWhitelisted` field on builders
- Whitelisted builders get access during beta
- No mock random data - predictable whitelist-based access

**Next Step for Real Data:**
Need to implement Base blockchain integration:
1. Connect to Base RPC: `https://mainnet.base.org`
2. Query $PSX token contract: `balanceOf(address)`
3. Query $CREATE token contract: `balanceOf(address)`
4. Use `viem` library (already installed)
5. Store real-time token balances

**Required:**
- PSX token contract address on Base
- CREATE token contract address on Base
- Base RPC endpoint configuration

**API Endpoints:**
- `POST /api/wallet/verify`
- `GET /api/wallet/balance/:address`

## 📦 Components

### SocialAccountVerification Component
**Location:** `client/src/components/SocialAccountVerification.tsx`

**Features:**
- One-click verification for all social platforms
- Real-time data fetching
- Visual verified badges
- Direct profile links
- Live follower count display (for GitHub)
- Change/reconnect functionality

**Usage:**
```tsx
<SocialAccountVerification
  builderId={builder.id}
  currentAccounts={{
    githubProfile: builder.githubProfile,
    twitterHandle: builder.twitterHandle,
    instagramHandle: builder.instagramHandle,
    youtubeChannel: builder.youtubeChannel,
    telegramHandle: builder.telegramHandle,
  }}
  onUpdate={() => refetch()}
/>
```

## 🔧 Backend Services

### SocialIntegrationService
**Location:** `server/services/socialIntegrations.ts`

**Methods:**
- `getGitHubProfile(username)` - Fetches real GitHub data
- `getGitHubRepoStats(username)` - Calculates total stars/forks
- `extractTwitterUsername(input)` - Parses @username or URLs
- `verifyTwitterUsername(username)` - Validates format
- `extractInstagramUsername(input)` - Parses Instagram handles
- `validateInstagramUsername(username)` - Validates format
- `extractYouTubeChannelId(url)` - Parses YouTube URLs
- `extractTelegramHandle(input)` - Parses Telegram handles

## 🚀 Setup Instructions

### GitHub (Already Working)
No setup needed - uses public GitHub API

### Twitter/X (Coming Soon)
1. Create Twitter Developer Account
2. Create Project + App
3. Enable OAuth 2.0
4. Get API Bearer Token
5. Add to environment: `TWITTER_BEARER_TOKEN`

### YouTube (Coming Soon)
1. Create Google Cloud Project
2. Enable YouTube Data API v3
3. Create API Key
4. Add to environment: `YOUTUBE_API_KEY`

### Instagram (Coming Soon)
1. Create Facebook Developer Account
2. Create App with Instagram API access
3. Requires Instagram Business Account
4. Get Access Token
5. Add to environment: `INSTAGRAM_ACCESS_TOKEN`

### Base Blockchain (Coming Soon)
1. Get PSX token contract address
2. Get CREATE token contract address
3. Configure Base RPC endpoint
4. Implement with `viem` library

## 📊 Data Flow

### Real-Time Flow (GitHub Example)
```
1. Builder enters GitHub username
   ↓
2. Frontend calls: POST /api/builders/:id/verify-github
   ↓
3. Backend calls: GitHub API (https://api.github.com/users/:username)
   ↓
4. Real data returned: followers, repos, stars, etc.
   ↓
5. Data stored in database
   ↓
6. Displayed on builder profile with verified badge
```

### Cached Flow (Future)
```
1. Initial verification fetches real data
   ↓
2. Data cached for 24 hours
   ↓
3. Background job refreshes data daily
   ↓
4. Manual refresh available for builders
```

## 🎯 Benefits of Real Data

1. **Trust & Credibility**: Real follower counts build client confidence
2. **No Mock Data**: Everything shown is authentic
3. **Automatic Updates**: Social metrics stay current
4. **Verification Badges**: Visual proof of connected accounts
5. **Direct Links**: Click through to verify authenticity

## 📝 TODO: Full Real Data Integration

- [ ] Set up Twitter API OAuth 2.0 for real follower data
- [ ] Configure YouTube Data API for subscriber counts
- [ ] Implement Instagram Graph API for follower metrics
- [ ] Add Base blockchain integration for token balances
- [ ] Implement periodic refresh job (daily/weekly)
- [ ] Add manual "Refresh Data" button for builders
- [ ] Cache social data with TTL
- [ ] Rate limit protection for API calls

## 🔒 Security Considerations

1. **API Keys**: All API keys stored as environment variables
2. **Rate Limits**: Implement caching to avoid API throttling
3. **OAuth Tokens**: Securely store and refresh OAuth tokens
4. **No Exposed Secrets**: Never log or return API keys to frontend
5. **Blockchain**: Use read-only RPC calls for token balances

## 📖 Usage for Builders

1. Navigate to Profile Settings or Onboarding
2. Find "Social Accounts & Verification" section
3. Enter username/URL for each platform
4. Click "Verify" button
5. Real data is fetched and displayed
6. Verified badge appears
7. Profile shows real follower counts

## 🎨 UI/UX Design

- Clean, modern interface
- Platform-specific icons (GitHub, X, Instagram, etc.)
- Verified badges for connected accounts
- Real-time loading states
- Error handling with helpful messages
- Direct links to verify authenticity
- One-click reconnect functionality
