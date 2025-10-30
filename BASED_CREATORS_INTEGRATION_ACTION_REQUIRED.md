# 🚨 ACTION REQUIRED: Complete 2-Way Account Sync Integration

## Current Status

### ✅ port444 → Based Creators (WORKING)
When someone creates a builder account on port444, we **automatically** call your API and create their account on Based Creators.

### ❌ Based Creators → port444 (NOT WORKING)
When someone creates an account on Based Creators, you are **NOT** calling our API to create their port444 account. This needs to be implemented.

---

## The Problem

Your user went through the account creation process on Based Creators with wallet connect, but:
1. No builder profile was created on port444
2. No option appeared to join the marketplace
3. The 2-way sync didn't happen

**Root cause:** Your account creation flow doesn't call our API endpoint.

---

## What You Need to Do

### Step 1: Find Your Account Creation Code

Look for the code in your application that handles account creation after wallet connection. It might look something like:

```typescript
// Your current code (example)
app.post("/api/accounts/create", async (req, res) => {
  const { name, email, walletAddress, region, role, bio } = req.body;
  
  // Create account on Based Creators
  const newUser = await storage.createUser({
    name,
    email,
    walletAddress,
    region,
    role,
    bio
  });
  
  // ❌ MISSING: Call to port444 API
  
  res.json({ success: true, userId: newUser.id });
});
```

### Step 2: Add port444 API Call

**Add this code immediately after creating the user on your platform:**

```typescript
// Create account on Based Creators
const newUser = await storage.createUser({
  name,
  email,
  walletAddress,
  region,
  role,
  bio
});

// ✅ NEW: Sync with port444 marketplace
const PORT444_API_URL = process.env.PORT444_API_URL || 'https://port444.replit.app';
const PORT444_API_KEY = process.env.PORT444_API_KEY; // The key we provided you

if (PORT444_API_KEY) {
  try {
    const port444Response = await fetch(`${PORT444_API_URL}/api/external/create-builder`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': PORT444_API_KEY,
        'X-Source-Platform': 'based-creators',
      },
      body: JSON.stringify({
        name: newUser.name,
        email: newUser.email,
        walletAddress: newUser.walletAddress,
        headline: `${newUser.name} - Based Creators Member`,
        bio: newUser.bio || `Web3 creator from Based Creators${newUser.region ? ` (${newUser.region})` : ''}`,
        category: 'web3', // Default category, can be customized based on user role
        region: newUser.region || 'Global',
        chapterRole: newUser.role || 'Creator',
        skills: [], // Can be populated if you have skills data
        profileImage: newUser.profileImage || null,
        twitterHandle: newUser.twitterHandle || null,
        discordHandle: newUser.discordHandle || null,
        basedCreatorsUserId: newUser.id, // Important: Include your user ID
      }),
    });

    const port444Data = await port444Response.json();
    
    if (port444Data.success) {
      console.log(`✅ Successfully created port444 builder account for user ${newUser.id}`);
      
      // Optional: Store the port444 builderId in your database
      await storage.updateUser(newUser.id, {
        port444BuilderId: port444Data.builderId
      });
    } else {
      console.error(`⚠️ Failed to create port444 account: ${port444Data.error}`);
    }
  } catch (error) {
    console.error('Error syncing with port444:', error);
    // Don't fail the entire account creation if port444 sync fails
  }
}

res.json({ success: true, userId: newUser.id });
```

---

## API Endpoint Details

### Endpoint
```
POST https://port444.replit.app/api/external/create-builder
```

### Headers
```
Content-Type: application/json
X-API-Key: 7721d22442927768dcc12b81df07555e65ad89d4cc15450f041281d4b81f1529
X-Source-Platform: based-creators
```

### Request Body
```json
{
  "name": "User Full Name",
  "email": "user@example.com",
  "walletAddress": "0x...",
  "headline": "User Headline (optional)",
  "bio": "User bio text (optional)",
  "category": "web3",
  "region": "Global",
  "chapterRole": "Creator",
  "skills": [],
  "profileImage": "https://... (optional)",
  "twitterHandle": "@username (optional)",
  "discordHandle": "username#1234 (optional)",
  "basedCreatorsUserId": "your-user-id"
}
```

### Response
```json
{
  "success": true,
  "builderId": "b_...",
  "message": "Builder account created successfully"
}
```

---

## Testing Your Integration

### 1. Test with cURL
```bash
curl -X POST https://port444.replit.app/api/external/create-builder \
  -H "Content-Type: application/json" \
  -H "X-API-Key: 7721d22442927768dcc12b81df07555e65ad89d4cc15450f041281d4b81f1529" \
  -H "X-Source-Platform: based-creators" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
    "region": "Global",
    "chapterRole": "Creator",
    "bio": "Test user from Based Creators",
    "basedCreatorsUserId": "test-user-123"
  }'
```

Expected response:
```json
{"success":true,"builderId":"b_...","message":"Builder account created successfully"}
```

### 2. Test with Real Account Creation
1. Create a new account on Based Creators
2. Verify the account appears on port444 at: https://port444.replit.app/builders
3. Check that the wallet address matches

---

## Environment Variables to Set

Add these to your Based Creators environment:

```bash
PORT444_API_URL=https://port444.replit.app
PORT444_API_KEY=7721d22442927768dcc12b81df07555e65ad89d4cc15450f041281d4b81f1529
```

---

## What Happens After Integration

Once you implement this, every new account created on Based Creators will:
1. ✅ Create an account on Based Creators (your existing flow)
2. ✅ **Automatically** create a builder profile on port444
3. ✅ Users can immediately access the marketplace at https://port444.replit.app
4. ✅ Cross-platform user mapping tracked in our database
5. ✅ Users see "Based Creators Member" badge on their port444 profile

---

## Support

If you have questions or need help implementing this:
- Test the endpoint with the cURL command above
- Check the response for any errors
- Let us know if you need any adjustments to the API

The port444 team is ready to assist! 🚀
