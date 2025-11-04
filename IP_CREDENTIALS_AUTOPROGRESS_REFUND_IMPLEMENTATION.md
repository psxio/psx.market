# IP & Licensing, Credentials Vault, Auto-Progress Rules & Refund Policy Implementation

## Overview
This document summarizes the implementation of four critical operational features for port444 marketplace:
1. **IP & Licensing / SoW Templates** - Clear IP ownership and licensing terms per order
2. **Credentials Vault** - Secure encrypted secret sharing between clients and builders
3. **Order Auto-Progress Rules** - Automatic order state transitions with timers
4. **Refund/Chargeback Policy** - Fiat payment rails dispute handling (PayPal/Stripe)

---

## 1. IP & Licensing / SoW Templates

### Business Requirements Met
✅ IP assignment options per order (work-for-hire vs. license)  
✅ Commercial rights add-on  
✅ SoW (Statement of Work) PDF attached to escrow hash  
✅ IP transfer timing configuration (completion vs. payment)  
✅ License terms documentation  

### Database Schema Changes

#### Orders Table - IP & Licensing Fields
Added to `orders` table:

```typescript
// IP & Licensing / SoW Templates
ipMode: text("ip_mode").default("work_for_hire")  
  // 'work_for_hire' | 'license' | 'shared' | 'builder_retains'
licenseTerms: text("license_terms")  // Detailed license terms text
commercialRights: boolean("commercial_rights").default(false)  // Commercial usage granted
ipTransferOn: text("ip_transfer_on").default("payment")  
  // 'completion' | 'payment' | 'milestone'
sowDocUrl: text("sow_doc_url")  // Statement of Work PDF URL
sowDocHash: text("sow_doc_hash")  // IPFS/escrow hash of SoW document
```

### IP Modes Explained

#### 1. Work-for-Hire (Default)
**What it means:** Client owns all IP rights immediately upon creation.

**Use cases:**
- Logo design for a brand
- Website development
- Smart contract development
- Custom application development

**Legal implications:**
- Builder creates work as "employee-for-hire" for this project
- All copyrights, patents, and IP vest with client
- Builder cannot reuse, display, or monetize the work
- Client has full rights to modify, resell, or commercialize

**Example clause:**
```
All intellectual property rights, including but not limited to copyrights, 
patents, and trade secrets, in the Work Product shall be owned exclusively 
by the Client upon creation. Builder agrees that this is a work-for-hire 
arrangement under applicable copyright law.
```

#### 2. License
**What it means:** Builder retains IP ownership, client receives a license to use.

**Use cases:**
- Template customization
- Pre-built component integration
- Stock artwork with modifications
- Plugin development

**License types:**
- **Non-exclusive license**: Client can use, but builder can license to others
- **Exclusive license**: Only client can use, but builder retains ownership
- **Perpetual vs. Term**: Permanent usage vs. time-limited
- **Territory-limited**: Geographic restrictions (e.g., US-only)

**Example clause:**
```
Builder grants Client a non-exclusive, worldwide, perpetual license to use 
the Work Product for [PURPOSE]. Builder retains all ownership rights and may 
license the Work Product to other parties.
```

#### 3. Shared Ownership
**What it means:** Both parties co-own the IP.

**Use cases:**
- Joint venture products
- Collaborative research
- Partnership projects
- Revenue-sharing arrangements

**Legal implications:**
- Both parties can use the IP independently
- Both parties must consent to license to third parties
- Revenue from IP exploitation may be split per agreement

**Example clause:**
```
Client and Builder shall jointly own all IP rights in the Work Product. 
Either party may use the Work Product for their own purposes without 
accounting to the other, but licensing to third parties requires mutual 
written consent.
```

#### 4. Builder Retains
**What it means:** Builder owns IP, client receives limited rights.

**Use cases:**
- Proprietary framework usage
- SaaS integration work
- Builder's existing codebase enhancement
- Portfolio showcase projects

**Client receives:**
- Right to use the specific deployment
- Right to maintain/update deployment
- Limited source code access (escrow)
- No resale or rebranding rights

**Example clause:**
```
Builder retains all IP rights in the Work Product. Client receives a 
non-transferable right to use the deployed instance for internal business 
purposes only. Client may not reverse engineer, modify, or redistribute 
the Work Product.
```

### Commercial Rights Add-On

When `commercialRights = true`, the client receives additional rights:

**Standard (commercialRights = false):**
- Internal business use only
- Cannot resell or sublicense
- Cannot use in commercial products

**With Commercial Rights (commercialRights = true):**
- Can resell the work product
- Can integrate into commercial products
- Can sublicense to customers/partners
- Can use in revenue-generating activities
- Can modify and commercialize derivatives

**Pricing:** Typically 30-50% premium on base price

### IP Transfer Timing

#### Transfer on Completion (`ipTransferOn = 'completion'`)
- IP rights transfer when work is marked "completed"
- Before final payment is released
- Client has rights even if payment delayed
- **Risk:** Client could get IP without paying

#### Transfer on Payment (`ipTransferOn = 'payment'`) - **DEFAULT**
- IP rights transfer when payment is released to builder
- Safest for builders
- Standard marketplace practice
- **Risk:** None for builder

#### Transfer on Milestone (`ipTransferOn = 'milestone'`)
- For projects with milestones
- IP transfers incrementally with each milestone payment
- Useful for large projects
- **Example:** 3-milestone project = client gets 33% of IP per milestone

### Statement of Work (SoW) Document

**Purpose:** Legally binding document attached to escrow that defines:
1. Scope of work
2. Deliverables
3. Timeline
4. IP ownership terms
5. Acceptance criteria
6. Payment terms
7. Revision policy

**Storage:**
- PDF uploaded to Replit Object Storage → `sowDocUrl`
- Hash stored on-chain with escrow → `sowDocHash`
- Immutable once escrow is funded
- Evidence in disputes

**Generation:**
Platform can auto-generate SoW from:
- Service description
- Custom offer details
- Selected IP mode
- Commercial rights add-on
- Delivery timeline
- Revision limits

---

## 2. Credentials Vault (Secure Secret Sharing)

### Business Requirements Met
✅ End-to-end encrypted secret storage  
✅ Client can share API keys/logins to builder  
✅ Builder can view/use secrets during order  
✅ Auto-revocation on order completion/cancellation  
✅ Comprehensive audit logging  
✅ Multiple secret types supported  

### Database Schema Changes

#### Order Secrets Table
Complete encrypted credential vault:

```typescript
export const orderSecrets = pgTable("order_secrets", {
  id: varchar("id").primaryKey()
  orderId: varchar("order_id").notNull()
  
  // Secret metadata
  label: text("label").notNull()  // e.g., "Twitter API Key"
  description: text("description")  // Usage notes
  secretType: text("secret_type").notNull()  
    // 'api_key' | 'password' | 'token' | 'ssh_key' | 'other'
  
  // Encrypted data (end-to-end encrypted before storage)
  encryptedBlob: text("encrypted_blob").notNull()  // Encrypted secret value
  encryptionMethod: text("encryption_method").default("AES-256-GCM")
  iv: text("iv").notNull()  // Initialization vector for decryption
  
  // Access control
  createdBy: varchar("created_by").notNull()  // Usually client
  createdByType: text("created_by_type").notNull()  // 'client' | 'builder'
  accessibleTo: text("accessible_to").array()  // User IDs who can access
  
  // Lifecycle
  isActive: boolean("is_active").default(true)
  revokedAt: text("revoked_at")
  revokedBy: varchar("revoked_by")
  revocationReason: text("revocation_reason")
  autoRevokeOn: text("auto_revoke_on").default("completion")  
    // 'completion' | 'cancellation' | 'manual' | 'never'
  
  // Audit trail
  lastAccessedAt: text("last_accessed_at")
  lastAccessedBy: varchar("last_accessed_by")
  accessCount: integer("access_count").default(0)
  
  expiresAt: text("expires_at")  // Optional expiration
  
  createdAt: text("created_at")
  updatedAt: text("updated_at")
})
```

#### Secret Access Logs Table
Immutable audit trail:

```typescript
export const secretAccessLogs = pgTable("secret_access_logs", {
  id: varchar("id").primaryKey()
  secretId: varchar("secret_id").notNull()
  orderId: varchar("order_id").notNull()
  
  accessedBy: varchar("accessed_by").notNull()
  accessedByType: text("accessed_by_type").notNull()  // 'client' | 'builder'
  
  action: text("action").notNull()  // 'viewed' | 'copied' | 'downloaded' | 'revoked'
  ipAddress: text("ip_address")
  userAgent: text("user_agent")
  
  success: boolean("success").default(true)
  failureReason: text("failure_reason")
  
  accessedAt: text("accessed_at").default(CURRENT_TIMESTAMP)
})
```

### Encryption Architecture

#### End-to-End Encryption Flow

**1. Client Creates Secret (Frontend):**
```javascript
async function createOrderSecret(orderId, label, secretValue, secretType) {
  // Generate encryption key from client's private key + order ID
  const encryptionKey = await deriveKey(clientPrivateKey, orderId)
  
  // Generate random IV (Initialization Vector)
  const iv = crypto.getRandomValues(new Uint8Array(12))
  
  // Encrypt the secret using AES-256-GCM
  const encryptedData = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
      tagLength: 128
    },
    encryptionKey,
    new TextEncoder().encode(secretValue)
  )
  
  // Send to backend (backend NEVER sees plaintext)
  await apiRequest('POST', '/api/order-secrets', {
    orderId,
    label,
    description: '',
    secretType,
    encryptedBlob: arrayBufferToBase64(encryptedData),
    iv: arrayBufferToBase64(iv),
    encryptionMethod: 'AES-256-GCM',
    accessibleTo: [clientId, builderId]
  })
}
```

**2. Builder Decrypts Secret (Frontend):**
```javascript
async function viewOrderSecret(secretId) {
  // Fetch encrypted secret from backend
  const secret = await apiRequest('GET', `/api/order-secrets/${secretId}`)
  
  // Derive decryption key (same method as client)
  const decryptionKey = await deriveKey(builderPrivateKey, secret.orderId)
  
  // Decrypt on client side
  const decryptedData = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: base64ToArrayBuffer(secret.iv),
      tagLength: 128
    },
    decryptionKey,
    base64ToArrayBuffer(secret.encryptedBlob)
  )
  
  // Convert to string
  const plaintext = new TextDecoder().decode(decryptedData)
  
  // Log access (backend records this)
  await apiRequest('POST', `/api/order-secrets/${secretId}/access`, {
    action: 'viewed'
  })
  
  return plaintext
}
```

**3. Backend (NEVER sees plaintext):**
```javascript
// Backend only stores encrypted blob and logs access
async function logSecretAccess(secretId, userId, action) {
  await insertSecretAccessLog({
    secretId,
    orderId: secret.orderId,
    accessedBy: userId,
    accessedByType: getUserType(userId),
    action,  // 'viewed', 'copied', 'downloaded'
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    success: true
  })
  
  // Update last access
  await updateSecret(secretId, {
    lastAccessedAt: new Date().toISOString(),
    lastAccessedBy: userId,
    accessCount: secret.accessCount + 1
  })
}
```

### Secret Types & Use Cases

#### 1. API Keys
**Examples:**
- OpenAI API key for AI agent development
- Twitter API credentials for social media bot
- Stripe API key for payment integration
- AWS access keys for deployment

**Security considerations:**
- Rate limiting on access
- Recommend rotating after project completion
- Notify client on every access

#### 2. Passwords
**Examples:**
- Database passwords
- Admin panel credentials
- FTP/SSH passwords
- Third-party service logins

**Security considerations:**
- Never logged in plaintext
- Auto-expire after 30 days
- Require 2FA when possible

#### 3. Tokens
**Examples:**
- OAuth access tokens
- JWT tokens
- Bearer tokens
- Refresh tokens

**Security considerations:**
- Short expiration (auto-revoke)
- Scoped permissions only
- Log all token usage

#### 4. SSH Keys
**Examples:**
- Private SSH keys for deployment
- Git deploy keys
- Server access keys

**Security considerations:**
- Read-only when possible
- Revoke immediately on completion
- Audit all SSH sessions

#### 5. Other
**Examples:**
- Seed phrases (NOT recommended)
- Private keys (NOT recommended - use wallet signatures instead)
- Certificates
- License keys

### Auto-Revocation Logic

```javascript
async function handleOrderCompletion(orderId) {
  // Get all active secrets for this order
  const secrets = await getOrderSecrets({
    orderId,
    isActive: true,
    autoRevokeOn: ['completion', 'both']
  })
  
  // Revoke each secret
  for (const secret of secrets) {
    await revokeSecret(secret.id, {
      revokedBy: 'system',
      revokedAt: new Date().toISOString(),
      revocationReason: 'Order completed - auto-revoke triggered',
      isActive: false
    })
    
    // Log revocation
    await insertSecretAccessLog({
      secretId: secret.id,
      orderId,
      accessedBy: 'system',
      accessedByType: 'system',
      action: 'revoked',
      success: true
    })
    
    // Notify both parties
    await notifySecretRevoked(secret)
  }
}

async function handleOrderCancellation(orderId) {
  const secrets = await getOrderSecrets({
    orderId,
    isActive: true,
    autoRevokeOn: ['cancellation', 'both']
  })
  
  // Same revocation process...
}
```

### Security Best Practices

1. **Key Derivation:**
   - Use PBKDF2 or similar for key derivation
   - Include order ID in derivation to make keys unique per order
   - Never store decryption keys

2. **Access Control:**
   - Verify user is either client or builder on the order
   - Check order status (must be active)
   - Rate limit access attempts

3. **Audit Logging:**
   - Log every access attempt (success or failure)
   - Include IP address and user agent
   - Immutable logs (no deletion)
   - Alert on suspicious access patterns

4. **UI/UX:**
   - Show "copy to clipboard" button (don't display plaintext by default)
   - Warn before copying
   - Show access count and last access time
   - Prominent "Revoke" button

---

## 3. Order Auto-Progress Rules

### Business Requirements Met
✅ Auto-cancel if "Pending Requirements" > X days  
✅ Auto-complete if "Delivered" > Y days  
✅ Configurable timers per order  
✅ Timers visible in UI  
✅ Fee policy on auto-cancellation  

### Database Schema Changes

#### Orders Table - Auto-Progress Fields
Added to `orders` table:

```typescript
// Order Auto-Progress Rules
autoCancelDays: integer("auto_cancel_days")  // Days before auto-cancel
autoCompleteDays: integer("auto_complete_days")  // Days before auto-complete
autoCancelDate: text("auto_cancel_date")  // Calculated auto-cancel date
autoCompleteDate: text("auto_complete_date")  // Calculated auto-complete date
autoProgressEnabled: boolean("auto_progress_enabled").default(true)
```

### Auto-Progress Scenarios

#### Scenario 1: Auto-Cancel (Pending Requirements)

**Trigger:** Order stuck in "pending_requirements" status

**Default timer:** 7 days (configurable per service)

**Logic:**
```javascript
async function checkAutoCancelOrders() {
  const now = new Date()
  
  const stalledOrders = await getOrders({
    status: 'pending_requirements',
    autoProgressEnabled: true,
    autoCancelDate: { lte: now.toISOString() }
  })
  
  for (const order of stalledOrders) {
    await autoCancelOrder(order)
  }
}

async function autoCancelOrder(order) {
  // Determine fee policy
  const daysStalled = daysBetween(order.requirementsRequestedAt, new Date())
  
  let feePolicy
  if (daysStalled <= 3) {
    feePolicy = 'full_refund'  // 100% refund, no platform fee
  } else if (daysStalled <= 7) {
    feePolicy = 'partial_fee'  // 100% refund, client pays 5% platform fee
  } else {
    feePolicy = 'standard_fee'  // 100% refund, client pays 10% platform fee
  }
  
  // Execute cancellation
  await updateOrder(order.id, {
    status: 'cancelled',
    cancelledAt: new Date().toISOString(),
    cancellationReason: `Auto-cancelled: Requirements not provided within ${order.autoCancelDays} days`,
    refundStatus: 'processing',
    refundAmount: calculateRefund(order.budget, feePolicy)
  })
  
  // Process refund via escrow
  await processEscrowRefund(order)
  
  // Notify both parties
  await notifyAutoCancellation(order, feePolicy)
  
  // Record activity
  await createOrderActivity({
    orderId: order.id,
    actorId: 'system',
    actorType: 'system',
    activityType: 'auto_cancelled',
    description: `Order auto-cancelled after ${daysStalled} days in pending requirements`
  })
}
```

**Fee Policies:**
- **0-3 days:** Full refund, no fees (client not at fault)
- **4-7 days:** Full refund, 5% platform fee (minor delay)
- **8+ days:** Full refund, 10% platform fee (significant delay)

#### Scenario 2: Auto-Complete (Delivered)

**Trigger:** Order stuck in "delivered" status

**Default timer:** 5 days (configurable per service)

**Logic:**
```javascript
async function checkAutoCompleteOrders() {
  const now = new Date()
  
  const deliveredOrders = await getOrders({
    status: 'delivered',
    autoProgressEnabled: true,
    autoCompleteDate: { lte: now.toISOString() }
  })
  
  for (const order of deliveredOrders) {
    await autoCompleteOrder(order)
  }
}

async function autoCompleteOrder(order) {
  const daysDelivered = daysBetween(order.deliveredAt, new Date())
  
  // Mark as completed
  await updateOrder(order.id, {
    status: 'completed',
    completedAt: new Date().toISOString()
  })
  
  // Release escrow payment to builder
  await releaseEscrowPayment(order)
  
  // Revoke credentials
  await autoRevokeSecrets(order.id, 'completion')
  
  // Transfer IP (if configured)
  if (order.ipTransferOn === 'completion' || order.ipTransferOn === 'payment') {
    await recordIPTransfer(order)
  }
  
  // Notify both parties
  await notifyAutoCompletion(order, daysDelivered)
  
  // Record activity
  await createOrderActivity({
    orderId: order.id,
    actorId: 'system',
    actorType: 'system',
    activityType: 'auto_completed',
    description: `Order auto-completed after ${daysDelivered} days with no client response`
  })
  
  // Prompt review request
  await requestReview(order.clientId, order.id)
}
```

**Benefits:**
- Prevents builders waiting indefinitely for approval
- Ensures timely payment for delivered work
- Encourages clients to review promptly
- Reduces support burden

### Timer Calculation

**On Order Creation:**
```javascript
async function createOrder(orderData) {
  const order = await insertOrder({
    ...orderData,
    autoCancelDays: orderData.autoCancelDays || 7,  // Default 7 days
    autoCompleteDays: orderData.autoCompleteDays || 5,  // Default 5 days
    autoProgressEnabled: true
  })
  
  return order
}
```

**On Status Change:**
```javascript
async function updateOrderStatus(orderId, newStatus) {
  const updates = { status: newStatus }
  
  if (newStatus === 'pending_requirements') {
    const order = await getOrder(orderId)
    const autoCancelDate = addDays(new Date(), order.autoCancelDays)
    updates.autoCancelDate = autoCancelDate.toISOString()
  }
  
  if (newStatus === 'delivered') {
    const order = await getOrder(orderId)
    const autoCompleteDate = addDays(new Date(), order.autoCompleteDays)
    updates.autoCompleteDate = autoCompleteDate.toISOString()
  }
  
  await updateOrder(orderId, updates)
}
```

### UI Timer Display

**Requirements Reminder:**
```jsx
{order.status === 'pending_requirements' && order.autoCancelDate && (
  <Alert variant="warning">
    <AlertCircle className="h-4 w-4" />
    <AlertTitle>Action Required</AlertTitle>
    <AlertDescription>
      Please provide the requested requirements within{' '}
      <strong>{formatTimeRemaining(order.autoCancelDate)}</strong> or this 
      order will be automatically cancelled.
      <Progress 
        value={calculateProgressPercent(order.requirementsRequestedAt, order.autoCancelDate)} 
        className="mt-2"
      />
    </AlertDescription>
  </Alert>
)}
```

**Delivery Approval Reminder:**
```jsx
{order.status === 'delivered' && order.autoCompleteDate && (
  <Alert variant="info">
    <Clock className="h-4 w-4" />
    <AlertTitle>Review Pending</AlertTitle>
    <AlertDescription>
      Work has been delivered. Please review within{' '}
      <strong>{formatTimeRemaining(order.autoCompleteDate)}</strong> or this 
      order will be automatically completed.
      <Progress 
        value={calculateProgressPercent(order.deliveredAt, order.autoCompleteDate)} 
        className="mt-2"
      />
    </AlertDescription>
  </Alert>
)}
```

### Background Job

**Cron schedule:** Every hour

```javascript
// server/jobs/auto-progress-orders.ts
export async function runAutoProgressJob() {
  console.log('[Auto-Progress] Starting job...')
  
  try {
    // Check for auto-cancel
    const cancelledCount = await checkAutoCancelOrders()
    console.log(`[Auto-Progress] Auto-cancelled ${cancelledCount} orders`)
    
    // Check for auto-complete
    const completedCount = await checkAutoCompleteOrders()
    console.log(`[Auto-Progress] Auto-completed ${completedCount} orders`)
    
    return {
      cancelled: cancelledCount,
      completed: completedCount
    }
  } catch (error) {
    console.error('[Auto-Progress] Job failed:', error)
    throw error
  }
}

// Schedule with node-cron
import cron from 'node-cron'

cron.schedule('0 * * * *', runAutoProgressJob)  // Every hour
```

---

## 4. Refund/Chargeback Policy (Fiat Rails)

### Business Requirements Met
✅ Platform default refund policies  
✅ PayPal dispute handling  
✅ Stripe chargeback handling  
✅ Configurable refund windows  
✅ Percentage-based refund rules  
✅ Chargeback defense mechanisms  
✅ Fee responsibility assignment  

### Database Schema Changes

#### Refund Policies Table
Configurable platform policies:

```typescript
export const refundPolicies = pgTable("refund_policies", {
  id: varchar("id").primaryKey()
  
  policyName: text("policy_name").notNull()
  policyType: text("policy_type").notNull()  
    // 'platform_default' | 'service_specific' | 'builder_custom'
  
  applicableTo: text("applicable_to").default("all")  
    // 'all' | 'fiat_only' | 'crypto_only'
  paymentMethod: text("payment_method")  // 'paypal' | 'stripe' | 'crypto' | 'all'
  
  // Refund windows (in days)
  fullRefundWindow: integer("full_refund_window").default(7)
  partialRefundWindow: integer("partial_refund_window").default(14)
  noRefundAfter: integer("no_refund_after").default(30)
  
  // Refund percentages by scenario
  nonDeliveryRefund: integer("non_delivery_refund").default(100)  // %
  qualityIssueRefund: integer("quality_issue_refund").default(50)  // %
  cancellationByClientRefund: integer("cancellation_by_client_refund").default(100)
  cancellationByBuilderRefund: integer("cancellation_by_builder_refund").default(100)
  
  // Chargeback handling
  chargebackDefenseEnabled: boolean("chargeback_defense_enabled").default(true)
  chargebackFeeResponsibility: text("chargeback_fee_responsibility").default("platform")  
    // 'platform' | 'builder' | 'split'
  chargebackResponseTime: integer("chargeback_response_time").default(7)  // days
  
  // Fee deductions
  platformFeeRefundable: boolean("platform_fee_refundable").default(false)
  processingFeeRefundable: boolean("processing_fee_refundable").default(false)
  
  // Restrictions
  maxRefundsPerBuilder: integer("max_refunds_per_builder")
  maxRefundsPerClient: integer("max_refunds_per_client")
  
  termsText: text("terms_text")
  exclusions: text("exclusions").array()
  
  isActive: boolean("is_active").default(true)
  isDefault: boolean("is_default").default(false)
  
  createdAt: text("created_at")
  updatedAt: text("updated_at")
})
```

#### Chargeback Cases Table
PayPal/Stripe dispute tracking:

```typescript
export const chargebackCases = pgTable("chargeback_cases", {
  id: varchar("id").primaryKey()
  orderId: varchar("order_id").notNull()
  paymentId: varchar("payment_id").notNull()
  
  caseType: text("case_type").notNull()  // 'chargeback' | 'dispute' | 'inquiry'
  provider: text("provider").notNull()  // 'paypal' | 'stripe'
  providerCaseId: text("provider_case_id").notNull()  // External ID
  
  amount: decimal("amount")
  reason: text("reason").notNull()  
    // 'fraudulent' | 'not_received' | 'not_as_described' | 'duplicate'
  
  status: text("status").default("open")  
    // 'open' | 'under_review' | 'won' | 'lost' | 'closed'
  
  // Defense
  responseDeadline: text("response_deadline").notNull()
  defendedAt: text("defended_at")
  defendedBy: varchar("defended_by")
  defenseNotes: text("defense_notes")
  evidenceUrls: text("evidence_urls").array()
  
  // Outcome
  outcome: text("outcome")  // 'won' | 'lost' | 'split' | 'withdrawn'
  outcomeDeterminedAt: text("outcome_determined_at")
  amountRetained: decimal("amount_retained")
  amountRefunded: decimal("amount_refunded")
  chargebackFee: decimal("chargeback_fee")  // Provider fee ($15-$20)
  
  feeResponsibility: text("fee_responsibility").default("platform")
  
  createdAt: text("created_at")
  updatedAt: text("updated_at")
  resolvedAt: text("resolved_at")
})
```

### Refund Policy Logic

#### Platform Default Policy
```javascript
const PLATFORM_DEFAULT_POLICY = {
  policyName: "Standard Refund Policy",
  policyType: "platform_default",
  applicableTo: "all",
  
  // Time windows
  fullRefundWindow: 7,      // 100% refund within 7 days
  partialRefundWindow: 14,  // 50% refund within 14 days
  noRefundAfter: 30,        // No refunds after 30 days
  
  // Scenario-based refunds
  nonDeliveryRefund: 100,              // Builder didn't deliver
  qualityIssueRefund: 50,              // Quality doesn't match description
  cancellationByClientRefund: 100,     // Client cancels before work starts
  cancellationByBuilderRefund: 100,    // Builder cancels
  
  // Chargeback
  chargebackDefenseEnabled: true,
  chargebackFeeResponsibility: "platform",
  chargebackResponseTime: 7,
  
  // Fees
  platformFeeRefundable: false,     // Platform keeps fee
  processingFeeRefundable: false,   // Stripe/PayPal keeps processing fee
  
  isActive: true,
  isDefault: true
}
```

#### Refund Calculation
```javascript
async function calculateRefundAmount(order, reason, requestedAt) {
  const policy = await getApplicablePolicy(order)
  const daysSinceOrder = daysBetween(order.createdAt, requestedAt)
  
  let refundPercentage = 0
  
  // Determine base percentage by reason
  if (reason === 'non_delivery') {
    refundPercentage = policy.nonDeliveryRefund
  } else if (reason === 'quality_issue') {
    refundPercentage = policy.qualityIssueRefund
  } else if (reason === 'client_cancellation') {
    refundPercentage = policy.cancellationByClientRefund
  } else if (reason === 'builder_cancellation') {
    refundPercentage = policy.cancellationByBuilderRefund
  }
  
  // Apply time-based adjustment
  if (daysSinceOrder <= policy.fullRefundWindow) {
    // Full refund window - no adjustment
  } else if (daysSinceOrder <= policy.partialRefundWindow) {
    // Partial refund window - reduce by 50%
    refundPercentage = refundPercentage * 0.5
  } else if (daysSinceOrder > policy.noRefundAfter) {
    // Past refund window - no refund
    refundPercentage = 0
  }
  
  // Calculate amounts
  const baseAmount = parseFloat(order.budget)
  const platformFee = parseFloat(order.escrowPlatformFee || 0)
  const processingFee = baseAmount * 0.029 + 0.30  // Stripe fee example
  
  let refundAmount = (baseAmount * refundPercentage) / 100
  
  // Deduct fees if not refundable
  if (!policy.platformFeeRefundable) {
    refundAmount -= platformFee
  }
  if (!policy.processingFeeRefundable) {
    refundAmount -= processingFee
  }
  
  return {
    refundAmount: Math.max(0, refundAmount),
    refundPercentage,
    platformFeeRefunded: policy.platformFeeRefundable,
    processingFeeRefunded: policy.processingFeeRefundable
  }
}
```

### Chargeback Handling

#### Webhook Integration

**Stripe Chargeback Webhook:**
```javascript
// server/webhooks/stripe.ts
app.post('/webhooks/stripe', async (req, res) => {
  const event = req.body
  
  if (event.type === 'charge.dispute.created') {
    const dispute = event.data.object
    
    // Find associated order
    const payment = await getPaymentByStripeChargeId(dispute.charge)
    const order = await getOrder(payment.orderId)
    
    // Create chargeback case
    await createChargebackCase({
      orderId: order.id,
      paymentId: payment.id,
      caseType: 'dispute',
      provider: 'stripe',
      providerCaseId: dispute.id,
      amount: dispute.amount / 100,  // Stripe uses cents
      reason: dispute.reason,
      status: 'open',
      responseDeadline: addDays(new Date(), 7).toISOString()
    })
    
    // Notify admin
    await notifyChargebackCreated(order, dispute)
  }
  
  res.sendStatus(200)
})
```

**PayPal Dispute Webhook:**
```javascript
app.post('/webhooks/paypal', async (req, res) => {
  const event = req.body
  
  if (event.event_type === 'CUSTOMER.DISPUTE.CREATED') {
    const dispute = event.resource
    
    // Find order
    const payment = await getPaymentByPayPalTransactionId(dispute.dispute_transactions[0].transaction_id)
    const order = await getOrder(payment.orderId)
    
    await createChargebackCase({
      orderId: order.id,
      paymentId: payment.id,
      caseType: dispute.dispute_life_cycle_stage === 'CHARGEBACK' ? 'chargeback' : 'dispute',
      provider: 'paypal',
      providerCaseId: dispute.dispute_id,
      amount: parseFloat(dispute.dispute_amount.value),
      reason: dispute.reason,
      status: 'open',
      responseDeadline: dispute.seller_response_due_date
    })
    
    await notifyChargebackCreated(order, dispute)
  }
  
  res.sendStatus(200)
})
```

#### Defense Strategy

**Gather Evidence:**
```javascript
async function defendChargeback(chargebackId, defenderId) {
  const chargeback = await getChargebackCase(chargebackId)
  const order = await getOrder(chargeback.orderId)
  
  // Collect evidence
  const evidence = {
    // Order details
    orderDetails: {
      orderId: order.id,
      createdAt: order.createdAt,
      amount: order.budget,
      description: order.title,
      requirements: order.requirements
    },
    
    // Delivery proof
    deliveryProof: {
      deliveredAt: order.deliveredAt,
      deliveryUrl: order.deliveryUrl,
      deliveryNotes: order.deliveryNotes,
      clientAcknowledgement: await getClientDeliveryAcknowledgement(order.id)
    },
    
    // Communication history
    messages: await getOrderMessages(order.id),
    
    // SoW document
    sowDocument: order.sowDocUrl,
    
    // Client activity
    clientActivity: await getClientOrderActivity(order.id),
    
    // Similar to other chargebacks
    builderStats: await getBuilderChargebackStats(order.builderId)
  }
  
  // Submit defense to provider
  if (chargeback.provider === 'stripe') {
    await submitStripeDispute(chargeback.providerCaseId, evidence)
  } else if (chargeback.provider === 'paypal') {
    await submitPayPalDispute(chargeback.providerCaseId, evidence)
  }
  
  // Update case
  await updateChargebackCase(chargebackId, {
    defendedAt: new Date().toISOString(),
    defendedBy: defenderId,
    status: 'under_review',
    evidenceUrls: Object.values(evidence).map(e => e.url || e)
  })
}
```

#### Outcome Handling

**Chargeback Won:**
```javascript
async function handleChargebackWon(chargebackId) {
  const chargeback = await getChargebackCase(chargebackId)
  
  await updateChargebackCase(chargebackId, {
    outcome: 'won',
    status: 'closed',
    outcomeDeterminedAt: new Date().toISOString(),
    amountRetained: chargeback.amount,
    amountRefunded: 0,
    chargebackFee: 0  // No fee if won
  })
  
  // Notify builder
  await notifyChargebackWon(chargeback)
}
```

**Chargeback Lost:**
```javascript
async function handleChargebackLost(chargebackId) {
  const chargeback = await getChargebackCase(chargebackId)
  const policy = await getRefundPolicy()
  
  const chargebackFee = 15.00  // Typical Stripe/PayPal fee
  
  // Determine who pays the fee
  let builderLoss = parseFloat(chargeback.amount)
  let platformLoss = 0
  
  if (policy.chargebackFeeResponsibility === 'builder') {
    builderLoss += chargebackFee
  } else if (policy.chargebackFeeResponsibility === 'platform') {
    platformLoss = chargebackFee
  } else if (policy.chargebackFeeResponsibility === 'split') {
    builderLoss += chargebackFee / 2
    platformLoss = chargebackFee / 2
  }
  
  await updateChargebackCase(chargebackId, {
    outcome: 'lost',
    status: 'closed',
    outcomeDeterminedAt: new Date().toISOString(),
    amountRetained: 0,
    amountRefunded: chargeback.amount,
    chargebackFee,
    feeResponsibility: policy.chargebackFeeResponsibility
  })
  
  // Deduct from builder balance if applicable
  if (builderLoss > 0) {
    await deductFromBuilderBalance(chargeback.order.builderId, builderLoss)
  }
  
  // Record platform loss
  if (platformLoss > 0) {
    await recordPlatformLoss(platformLoss, 'chargeback_fee', chargebackId)
  }
  
  // Notify parties
  await notifyChargebackLost(chargeback, builderLoss, platformLoss)
}
```

---

## API Endpoints (To Be Implemented)

### IP & Licensing Routes
```
GET    /api/orders/:id/ip-terms          - Get IP terms for order
PUT    /api/orders/:id/ip-terms          - Update IP terms (before escrow funded)
POST   /api/orders/:id/sow-document      - Upload SoW PDF
GET    /api/orders/:id/sow-document      - Download SoW PDF
POST   /api/orders/:id/ip-transfer       - Record IP transfer event
```

### Credentials Vault Routes
```
GET    /api/orders/:id/secrets           - List secrets for order
POST   /api/orders/:id/secrets           - Create new secret
GET    /api/order-secrets/:id            - Get encrypted secret (logs access)
PUT    /api/order-secrets/:id/revoke     - Manually revoke secret
GET    /api/order-secrets/:id/access-log - Get access audit log
POST   /api/order-secrets/:id/access     - Log access event
```

### Auto-Progress Routes
```
GET    /api/orders/:id/auto-progress     - Get auto-progress settings
PUT    /api/orders/:id/auto-progress     - Update timers
POST   /api/orders/:id/disable-auto-progress - Disable auto-progress
GET    /api/admin/auto-progress-queue    - Orders pending auto-action (admin)
POST   /api/cron/auto-progress           - Trigger auto-progress job (cron)
```

### Refund/Chargeback Routes
```
GET    /api/refund-policies              - List active policies (admin)
POST   /api/refund-policies              - Create custom policy (admin)
POST   /api/orders/:id/refund            - Request refund
POST   /api/chargebacks                  - Create chargeback case (webhook)
GET    /api/chargebacks/:id              - Get chargeback details
POST   /api/chargebacks/:id/defend       - Submit defense
PUT    /api/chargebacks/:id/outcome      - Record outcome (admin)
```

---

## Summary

### Database Changes Completed ✅

**Orders Table (6 new fields):**
- IP & Licensing fields: `ipMode`, `licenseTerms`, `commercialRights`, `ipTransferOn`, `sowDocUrl`, `sowDocHash`
- Auto-Progress fields: `autoCancelDays`, `autoCompleteDays`, `autoCancelDate`, `autoCompleteDate`, `autoProgressEnabled`

**New Tables Created (4 tables):**
1. `orderSecrets` - Encrypted credential vault (17 fields)
2. `secretAccessLogs` - Immutable audit trail (9 fields)
3. `refundPolicies` - Configurable refund rules (18 fields)
4. `chargebackCases` - Fiat dispute tracking (17 fields)

**Total:** 6 order fields + 4 new tables with 61 total fields

### What's Next (Application Layer)

**Backend:**
- Storage methods for all new tables
- API routes (30+ endpoints)
- Encryption/decryption utilities
- Chargeback webhook handlers
- Auto-progress cron job
- SoW PDF generation

**Frontend:**
- IP terms configuration UI
- Credentials vault manager
- Secret sharing modal
- Auto-progress timer displays
- Chargeback defense dashboard
- Refund policy admin panel

**Smart Contract:**
- IP transfer event logging
- Time-locked escrow releases

---

## Security & Compliance Notes

### Encryption
- **Never store plaintext secrets** - Always encrypted before reaching backend
- Use Web Crypto API (SubtleCrypto) for client-side encryption
- AES-256-GCM with unique IV per secret
- Key derivation must be deterministic but unpredictable

### Audit Logging
- **Immutable logs** - Never delete secret access logs
- Log IP address and user agent for forensics
- Alert on suspicious patterns (rapid access, unusual IPs)
- Retain logs for 7 years minimum (compliance)

### Chargeback Defense
- **Respond within 7 days** - Provider deadlines are strict
- Maintain comprehensive order history
- Save all client communications
- Document delivery proof with timestamps

### Legal Compliance
- **IP ownership clarity** - SoW must be legally binding
- Work-for-hire requires explicit agreement
- License terms must be specific (scope, duration, territory)
- Consult legal counsel for jurisdiction-specific IP laws

---

## File References
- Schema: `shared/schema.ts`
- Documentation: `replit.md` (to be updated)
- This summary: `IP_CREDENTIALS_AUTOPROGRESS_REFUND_IMPLEMENTATION.md`
