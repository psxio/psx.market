# Cross-Platform Integration Guide
## port444 ↔ Based Creators Chapters

This guide explains how to set up seamless 2-way account creation between port444 marketplace and Based Creators chapters application.

## Current State

**Right now**: The chapters onboarding only creates accounts in the port444 database. When someone uses a chapters invite link, they only get a port444 builder profile.

**What we need**: True 2-way integration where creating an account on either platform automatically creates an account on the other platform.

---

## Architecture Overview

### 1. **Cross-Platform User Mapping**

We track which accounts are linked across platforms using the `cross_platform_users` table:

```typescript
{
  id: "uuid",
  port444BuilderId: "builder_123",
  basedCreatorsUserId: "user_456",  
  walletAddress: "0x1234...",
  email: "user@example.com",
  syncStatus: "synced" | "pending" | "failed",
  lastSyncedAt: "2025-01-15",
  syncError: null | "error message"
}
```

**Key principle**: Same wallet address = same user across both platforms

### 2. **API Integration Points**

Both platforms need these API endpoints:

#### **On Based Creators (basedcreators.xyz)**
```typescript
POST /api/external/create-account
Headers: {
  'X-API-Key': 'secret_key_from_port444',
  'X-Source-Platform': 'port444'
}
Body: {
  name,
  email,
  walletAddress,
  region,
  role,
  bio,
  profileImage,
  twitterHandle,
  discordHandle,
  skills
}
Response: { success: true, userId: "user_456" }
```

#### **On port444 (this platform)**
```typescript
POST /api/external/create-builder
Headers: {
  'X-API-Key': 'secret_key_from_basedcreators',
  'X-Source-Platform': 'basedcreators'
}
Body: {
  name,
  email,
  walletAddress,
  region,
  chapterRole,
  headline,
  bio,
  category,
  skills
}
Response: { success: true, builderId: "builder_123" }
```

---

## Setup Instructions

### Step 1: Get API Credentials

You need to exchange API keys with the Based Creators team:

1. Generate an API key for Based Creators to call port444
2. Get an API key from Based Creators for port444 to call them
3. Store these as environment variables

### Step 2: Add Environment Variables

Add to your `.env` file (or Replit Secrets):

```bash
# Based Creators API Configuration
BASED_CREATORS_API_URL=https://basedcreators.xyz/api
BASED_CREATORS_API_KEY=your_api_key_here

# port444 External API Key (for Based Creators to call us)
PORT444_EXTERNAL_API_KEY=your_secret_key_here
```

### Step 3: Enable the Integration

The integration code is already in place, but currently disabled. To enable it:

1. Make sure both platforms have their API endpoints deployed
2. Set the environment variables above
3. The integration will automatically activate

### Step 4: Deploy API Endpoint on Based Creators

Share this implementation spec with the Based Creators dev team:

```typescript
// Route: POST /api/external/create-account
// Auth: X-API-Key header validation

interface CreateAccountRequest {
  name: string;
  email: string;
  walletAddress: string;
  region?: string;
  role?: string;
  bio?: string;
  profileImage?: string;
  twitterHandle?: string;
  discordHandle?: string;
  skills?: string[];
}

// Validate API key
if (req.headers['x-api-key'] !== process.env.PORT444_API_KEY) {
  return res.status(401).json({ error: 'Unauthorized' });
}

// Check if user already exists by wallet
const existing = await findUserByWallet(body.walletAddress);
if (existing) {
  return res.json({ success: true, userId: existing.id });
}

// Create new user account
const newUser = await createChaptersMember({
  name: body.name,
  email: body.email,
  walletAddress: body.walletAddress,
  region: body.region || 'Global',
  role: body.role || 'Creator',
  bio: body.bio,
  profileImage: body.profileImage,
  // ... other fields
});

return res.json({ success: true, userId: newUser.id });
```

---

## How It Works: User Flow

### Scenario 1: User Signs Up on Based Creators

1. User completes registration on basedcreators.xyz
2. Based Creators calls `POST /api/external/create-builder` on port444
3. port444 creates a builder profile and returns `builderId`
4. port444 creates a cross-platform mapping record
5. User now has accounts on both platforms

### Scenario 2: User Signs Up on port444 via Chapters Invite

1. User clicks chapters invite link → `/chapters-onboarding/:token`
2. User completes the 3-step onboarding wizard
3. port444 creates a builder profile locally
4. port444 calls `POST /api/external/create-account` on Based Creators
5. Based Creators creates a chapters member account
6. port444 stores the cross-platform mapping
7. User now has accounts on both platforms

### Scenario 3: Existing User on One Platform Joins the Other

1. User tries to sign up with their wallet (already used on other platform)
2. System detects existing wallet address
3. If cross-platform mapping exists: Link accounts
4. If no mapping exists: Create new account and establish mapping
5. User gets seamlessly connected across both platforms

---

## Error Handling

### What Happens if One Platform is Down?

1. **port444 down**: Based Creators creates account normally, retries port444 API call later
2. **Based Creators down**: port444 creates builder profile, marks sync as "pending" in cross-platform table
3. **Automatic retry**: Background job attempts to sync pending accounts every hour

### What if API Call Fails?

```typescript
// Example error handling in chapters onboarding
try {
  const basedCreatorsResponse = await basedCreatorsApi.createAccount(userData);
  
  if (basedCreatorsResponse.success) {
    await storage.updateCrossPlatformMapping(builderId, {
      basedCreatorsUserId: basedCreatorsResponse.userId,
      syncStatus: 'synced',
      lastSyncedAt: new Date().toISOString(),
    });
  } else {
    // Mark as failed for manual review
    await storage.updateCrossPlatformMapping(builderId, {
      syncStatus: 'failed',
      syncError: basedCreatorsResponse.error,
    });
    
    // User still gets port444 account - we'll sync later
    console.warn('Failed to sync with Based Creators:', basedCreatorsResponse.error);
  }
} catch (error) {
  // Network error - mark for retry
  await storage.updateCrossPlatformMapping(builderId, {
    syncStatus: 'pending',
    syncError: error.message,
  });
}
```

---

## Testing the Integration

### Local Testing (Before Going Live)

1. Set `BASED_CREATORS_API_URL=http://localhost:3001/api` (Based Creators local server)
2. Both platforms running locally
3. Test account creation from both sides
4. Verify cross-platform mappings are created

### Production Rollout

1. **Phase 1**: Deploy API endpoints on both platforms (but don't call them yet)
2. **Phase 2**: Enable integration for test accounts only
3. **Phase 3**: Monitor for 24 hours, check for errors
4. **Phase 4**: Enable for all new sign-ups
5. **Phase 5**: Backfill existing users (optional)

---

## Monitoring & Admin Tools

### View Cross-Platform Sync Status

```sql
-- Check sync status
SELECT 
  port444_builder_id,
  based_creators_user_id,
  wallet_address,
  sync_status,
  sync_error
FROM cross_platform_users
WHERE sync_status = 'failed'
ORDER BY created_at DESC;
```

### Manual Sync Retry (Admin)

```typescript
// GET /api/admin/cross-platform-sync/:builderId
// Force retry sync for a specific builder
```

---

## Security Considerations

1. **API Key Rotation**: Change API keys every 90 days
2. **Rate Limiting**: Implement rate limits on external endpoints (10 req/min per IP)
3. **Request Validation**: Always validate wallet addresses and email formats
4. **HTTPS Only**: Never send API keys over HTTP
5. **Audit Logs**: Log all cross-platform account creations for security review

---

## FAQ

**Q: What if a user has different emails on each platform?**  
A: We use wallet address as the primary identifier. Email can be updated on either platform independently.

**Q: Can users unlink their accounts?**  
A: Not currently. Once linked by wallet, accounts stay linked. This prevents confusion.

**Q: What happens if someone changes their wallet?**  
A: They can add multiple wallets on port444. Based Creators linkage remains with the primary wallet.

**Q: Do profile updates sync across platforms?**  
A: Currently no - only account creation syncs. Profile updates coming in v2.

---

## Implementation Status

✅ **Completed**:
- Cross-platform user mapping table
- BasedCreatorsApi service for outbound calls
- Storage methods for managing cross-platform users
- Error handling and retry logic

⏳ **Needs Setup**:
- Environment variables configured
- API endpoint on Based Creators deployed
- Public endpoint on port444 for incoming calls (`/api/external/create-builder`)
- Integration testing with Based Creators team

---

## Next Steps for You

1. **Contact Based Creators Dev Team**: Share the API spec (Step 4 above)
2. **Exchange API Keys**: Set up the authentication
3. **Configure Environment Variables**: Add the secrets to Replit
4. **Test Integration**: Try creating an account via chapters invite
5. **Monitor**: Watch the cross_platform_users table for successful syncs

---

Need help? Check the implementation files:
- `server/services/basedCreatorsApi.ts` - Outbound API calls
- `server/storage.ts` - Cross-platform user management methods
- `shared/schema.ts` - Database schema for cross_platform_users table
