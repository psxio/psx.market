# Based Creators × port444 API Integration Guide

## Overview

This document provides complete instructions for setting up the 2-way API integration between **Based Creators** (chapters platform) and **port444** (marketplace). This integration enables seamless account creation across both platforms when a creator joins through the chapters onboarding flow.

## Integration Architecture

```
┌─────────────────────┐           ┌──────────────────────┐
│                     │           │                      │
│  Based Creators     │◄─────────►│      port444        │
│  (Chapters)         │   APIs    │   (Marketplace)      │
│                     │           │                      │
└─────────────────────┘           └──────────────────────┘
        │                                  │
        │                                  │
        ▼                                  ▼
  Account Created                   Account Created
  + Regional Chapter              + Builder Profile
                                 + Service Listings
```

## API Endpoints Required

### On Based Creators Platform

You need to implement the following API endpoint on your Based Creators platform:

#### `POST /external/create-account`

Creates a Based Creators account when a user joins through port444 chapters onboarding.

**Authentication:**
- Header: `X-API-Key: <PORT444_EXTERNAL_API_KEY>`
- Header: `X-Source-Platform: port444`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "region": "West Africa",
  "role": "Creator",
  "bio": "3D artist specializing in character design",
  "profileImage": "https://storage.googleapis.com/.../profile.jpg",
  "twitterHandle": "@johndoe",
  "discordHandle": "johndoe#1234",
  "skills": ["3D Modeling", "Blender", "Character Design"],
  "builderId": "b_1234567890"
}
```

**Response (Success):**
```json
{
  "success": true,
  "userId": "bc_user_1234567890",
  "message": "Account created successfully"
}
```

**Response (User Already Exists):**
```json
{
  "success": true,
  "userId": "bc_user_existing",
  "message": "Account already exists, returning existing user"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid API key or missing required fields"
}
```

### On port444 Platform (Already Implemented ✅)

port444 has already implemented the following endpoint that Based Creators can call:

#### `POST /api/external/create-builder`

Creates a port444 builder account when a user joins through Based Creators.

**Authentication:**
- Header: `X-API-Key: <BASED_CREATORS_EXTERNAL_API_KEY>`
- Header: `X-Source-Platform: based-creators`

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "headline": "Expert Video Editor",
  "bio": "Professional video editor with 5 years experience",
  "category": "video-editor",
  "skills": ["Video Editing", "After Effects", "Premiere Pro"],
  "profileImage": "https://storage.googleapis.com/.../profile.jpg",
  "twitterHandle": "@janesmith",
  "discordHandle": "janesmith#5678",
  "region": "Europe",
  "basedCreatorsUserId": "bc_user_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "builderId": "b_9876543210",
  "message": "Builder account created successfully"
}
```

## Environment Variables

### Based Creators Platform (.env)

```env
# port444 Integration
PORT444_API_URL=https://port444.replit.app
PORT444_EXTERNAL_API_KEY=<your-secure-api-key-here>

# Your own external API key (for port444 to call you)
BASED_CREATORS_EXTERNAL_API_KEY=<your-secure-api-key-here>
```

### port444 Platform (.env) — Already Configured ✅

```env
# Based Creators Integration
BASED_CREATORS_API_URL=https://basedcreators.xyz
BASED_CREATORS_API_KEY=<your-api-key-provided-to-port444>
BASED_CREATORS_EXTERNAL_API_KEY=<api-key-for-incoming-requests>
```

## Complete Integration Flow

### Scenario: User Joins Through Chapters Onboarding

```
1. Admin creates chapters invite on port444
   → Invite token: abc123xyz
   → Link: port444.replit.app/chapters-onboarding/abc123xyz

2. User clicks invite link and fills out onboarding form:
   ✓ Basic Info (name, email, wallet, headline, bio, category)
   ✓ Professional Details (skills, portfolio links, social handles)
   ✓ Profile Photo
   ✓ Service Creation (title, pricing, deliverables)

3. User clicks "Join the Network"

4. port444 creates builder account:
   POST /api/builders/onboard
   ✓ Creates builder profile on port444
   ✓ Creates service listings
   ✓ Links to builder profile
   
5. port444 calls Based Creators API:
   POST https://basedcreators.xyz/external/create-account
   Headers:
     X-API-Key: <BASED_CREATORS_API_KEY>
     X-Source-Platform: port444
   Body: {name, email, walletAddress, region, ...}
   
6. Based Creators creates account:
   ✓ Creates user profile
   ✓ Assigns to regional chapter
   ✓ Returns userId: bc_user_1234567890

7. port444 creates cross-platform mapping:
   ✓ port444_builder_id: b_9876543210
   ✓ based_creators_user_id: bc_user_1234567890
   ✓ wallet_address: 0x742d35...
   ✓ sync_status: "synced"

8. User is redirected to builder dashboard
   ✓ Has access to both platforms
   ✓ Single wallet, dual identity
```

## Testing the Integration

### Test Checklist

- [ ] **API Keys Configured**: Both platforms have correct API keys in environment variables
- [ ] **Endpoint Accessible**: `POST /external/create-account` returns 200 OK on Based Creators
- [ ] **Authentication Works**: Request with valid `X-API-Key` header succeeds
- [ ] **Account Creation**: New user account is created with all fields
- [ ] **Regional Assignment**: User is assigned to correct chapter based on `region` field
- [ ] **Duplicate Handling**: Existing users return success without creating duplicate accounts
- [ ] **Error Handling**: Invalid requests return appropriate error messages
- [ ] **Cross-Platform Mapping**: Both platforms track the connection

### Manual Test

```bash
# Test Based Creators endpoint
curl -X POST https://basedcreators.xyz/external/create-account \
  -H "Content-Type: application/json" \
  -H "X-API-Key: <PORT444_EXTERNAL_API_KEY>" \
  -H "X-Source-Platform: port444" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "walletAddress": "0x1234567890abcdef",
    "region": "Global Chapter",
    "role": "Creator",
    "bio": "Test account for API integration",
    "builderId": "b_test123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "userId": "bc_user_test123",
  "message": "Account created successfully"
}
```

### Automated Test (Node.js)

```javascript
async function testBasedCreatorsAPI() {
  const response = await fetch('https://basedcreators.xyz/external/create-account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': process.env.PORT444_EXTERNAL_API_KEY,
      'X-Source-Platform': 'port444',
    },
    body: JSON.stringify({
      name: 'API Test User',
      email: `test+${Date.now()}@example.com`,
      walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      region: 'Global Chapter',
      role: 'Creator',
      bio: 'Automated test account',
      builderId: `b_test_${Date.now()}`,
    }),
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Response:', data);
  
  if (data.success) {
    console.log('✅ Integration working! User ID:', data.userId);
  } else {
    console.log('❌ Integration failed:', data.error);
  }
}

testBasedCreatorsAPI();
```

## Implementation Guide for Based Creators Team

### Step 1: Create API Endpoint

Add this endpoint to your Express/Node.js server (or equivalent in your framework):

```typescript
// External API endpoint for port444 integration
app.post('/external/create-account', async (req, res) => {
  try {
    // 1. Verify API key
    const apiKey = req.headers['x-api-key'];
    const sourcePlatform = req.headers['x-source-platform'];
    
    if (apiKey !== process.env.PORT444_EXTERNAL_API_KEY) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid API key' 
      });
    }
    
    if (sourcePlatform !== 'port444') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid source platform' 
      });
    }

    // 2. Extract data from request
    const {
      name,
      email,
      walletAddress,
      region,
      role,
      bio,
      profileImage,
      twitterHandle,
      discordHandle,
      skills,
      builderId,
    } = req.body;

    // 3. Validate required fields
    if (!name || !email || !walletAddress) {
      return res.status(400).json({ 
        success: false, 
        error: 'Missing required fields: name, email, walletAddress' 
      });
    }

    // 4. Check if user already exists (by wallet or email)
    const existingUser = await db.users.findOne({
      $or: [
        { walletAddress },
        { email }
      ]
    });

    if (existingUser) {
      // User exists, return their ID
      return res.json({
        success: true,
        userId: existingUser.id,
        message: 'Account already exists, returning existing user'
      });
    }

    // 5. Create new user account
    const newUser = await db.users.create({
      name,
      email,
      walletAddress,
      region: region || 'Global Chapter',
      role: role || 'Creator',
      bio,
      profileImage,
      twitterHandle,
      discordHandle,
      skills,
      source: 'port444',
      port444BuilderId: builderId,
      createdAt: new Date(),
    });

    // 6. Assign to regional chapter
    if (region) {
      await db.chapterMembers.create({
        userId: newUser.id,
        chapterRegion: region,
        joinedAt: new Date(),
      });
    }

    // 7. Send welcome notification (optional)
    await sendWelcomeEmail(email, name);

    // 8. Return success response
    res.json({
      success: true,
      userId: newUser.id,
      message: 'Account created successfully'
    });

  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  }
});
```

### Step 2: Set Environment Variables

Add to your `.env` file:

```env
PORT444_EXTERNAL_API_KEY=generate-a-secure-random-key-here
BASED_CREATORS_EXTERNAL_API_KEY=another-secure-key-for-port444
```

Generate secure keys using:
```bash
# Generate API keys
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Share API Key with port444

Send the `BASED_CREATORS_EXTERNAL_API_KEY` to the port444 team securely. They will add it to their environment variables.

### Step 4: Test the Integration

Use the curl command or Node.js test script above to verify the endpoint works correctly.

## Security Best Practices

1. **API Key Security**
   - Use strong, randomly generated API keys (32+ characters)
   - Never commit API keys to version control
   - Rotate keys periodically
   - Use different keys for development and production

2. **Request Validation**
   - Always verify the `X-API-Key` header
   - Validate the `X-Source-Platform` header
   - Check all required fields are present
   - Sanitize input data to prevent injection attacks

3. **Rate Limiting**
   - Implement rate limiting on the endpoint (e.g., 100 requests/hour per IP)
   - Log all API calls for monitoring
   - Set up alerts for suspicious activity

4. **Error Handling**
   - Never expose internal error details to API callers
   - Log detailed errors server-side for debugging
   - Return generic error messages to clients

## Monitoring & Debugging

### Logs to Track

```javascript
// Log all incoming API calls
console.log('[API] External account creation:', {
  source: req.headers['x-source-platform'],
  email: req.body.email,
  timestamp: new Date().toISOString(),
});

// Log successful account creations
console.log('[Success] Account created:', {
  userId: newUser.id,
  email: newUser.email,
  region: newUser.region,
});

// Log errors
console.error('[Error] Account creation failed:', {
  error: error.message,
  email: req.body.email,
  stack: error.stack,
});
```

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid API key | Verify `PORT444_EXTERNAL_API_KEY` matches on both sides |
| 400 Bad Request | Missing required fields | Check request body includes name, email, walletAddress |
| 500 Internal Error | Database connection failed | Check database connection and logs |
| Duplicate accounts | Wallet already exists | Implement duplicate check before creating user |

## Support

For integration support:
- **port444 team**: Create issue on GitHub or contact via Discord
- **Technical questions**: Reference this documentation
- **API testing**: Use the test scripts provided above

## Changelog

- **2025-10-30**: Initial integration guide created
- **2025-10-30**: Added service creation to chapters onboarding flow
- **2025-10-30**: Enhanced with builder profile links in service listings

---

**Last Updated**: October 30, 2025  
**Integration Version**: 1.0.0  
**Status**: ✅ Ready for Implementation
