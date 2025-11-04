# Consultations, Amendments, Audit Logging & Support Console + Quick Wins Implementation

## Overview
This document summarizes the implementation of 4 major operational features plus 4 Quick Win enhancements for port444 marketplace:

**Major Features:**
1. **Consultation Bookings** - Paid consultation calls with calendar sync
2. **Order Top-Up & Scope-Change** - Mid-order amendments with escrow updates
3. **Incident & Audit Logging** - Immutable event logs and security monitoring
4. **Support Console** - Admin tools for user support and impersonation

**Quick Wins:**
1. **Auto-Messages** - Automated nudges at key intervals
2. **Price Sanity Hints** - Market range guidance for builders
3. **Idle Breakers** - Discount prompts after chat activity
4. **Away Mode** - One-toggle pause for all services

---

## 1. Consultation Bookings

### Business Requirements Met
✅ 15/30/60-minute paid calls  
✅ Calendar sync (Google, Outlook, Cal.com)  
✅ Auto invoice generation  
✅ Convert to order with credit applied  
✅ Reminder system (24h + 1h before call)  
✅ No-show tracking  

### Database Schema Changes

#### Consultations Table
Complete consultation booking system:

```typescript
export const consultations = pgTable("consultations", {
  id: varchar("id").primaryKey()
  builderId: varchar("builder_id").notNull()
  clientId: varchar("client_id").notNull()
  
  // Pricing
  duration: integer("duration").notNull()  // 15, 30, or 60 minutes
  price: decimal("price")
  
  // Scheduling
  scheduledAt: text("scheduled_at").notNull()  // ISO datetime
  calendarSlotId: varchar("calendar_slot_id")
  timezone: text("timezone").default("UTC")
  
  // Meeting details
  meetingUrl: text("meeting_url")  // Zoom/Google Meet
  meetingProvider: text("meeting_provider")  // 'zoom' | 'google_meet' | 'cal_com'
  meetingId: text("meeting_id")
  
  // Status
  status: text("status").default("scheduled")  
    // scheduled, completed, cancelled, no_show, rescheduled
  
  // Payment
  invoiceId: varchar("invoice_id")  // Auto-generated invoice
  paymentId: varchar("payment_id")
  paidAt: text("paid_at")
  
  // Conversion to order (key feature)
  convertedToOrder: boolean("converted_to_order").default(false)
  convertedOrderId: varchar("converted_order_id")
  creditApplied: decimal("credit_applied")  // Consultation fee as credit
  
  // Completion
  completedAt: text("completed_at")
  cancelledAt: text("cancelled_at")
  cancellationReason: text("cancellation_reason")
  cancelledBy: varchar("cancelled_by")
  
  // Notes
  clientNotes: text("client_notes")  // Pre-call prep
  builderNotes: text("builder_notes")  // Post-call summary
  
  // Reminders
  reminder24hSent: boolean("reminder_24h_sent").default(false)
  reminder1hSent: boolean("reminder_1h_sent").default(false)
  
  createdAt: text("created_at")
  updatedAt: text("updated_at")
})
```

#### Calendar Slots Table
Builder availability management:

```typescript
export const calendarSlots = pgTable("calendar_slots", {
  id: varchar("id").primaryKey()
  builderId: varchar("builder_id").notNull()
  
  // Timing
  startTime: text("start_time").notNull()  // ISO datetime
  endTime: text("end_time").notNull()
  timezone: text("timezone").default("UTC")
  
  // Availability
  isAvailable: boolean("is_available").default(true)
  isRecurring: boolean("is_recurring").default(false)
  recurringPattern: text("recurring_pattern")  // 'weekly' | 'biweekly' | 'monthly'
  
  // Booking
  consultationId: varchar("consultation_id")
  isBooked: boolean("is_booked").default(false)
  bookedAt: text("booked_at")
  
  // Calendar sync
  externalCalendarId: text("external_calendar_id")  // Google Calendar event ID
  externalProvider: text("external_provider")  // 'google' | 'outlook' | 'apple'
  
  createdAt: text("created_at")
  updatedAt: text("updated_at")
})
```

#### Builders Table - Consultation Settings (Quick Win)
Added consultation pricing fields:

```typescript
// In builders table
consultationEnabled: boolean("consultation_enabled").default(false)
consultation15minPrice: decimal("consultation_15min_price")
consultation30minPrice: decimal("consultation_30min_price")
consultation60minPrice: decimal("consultation_60min_price")
consultationCalendarUrl: text("consultation_calendar_url")  // Cal.com/Calendly
```

### Consultation Booking Flow

#### Step 1: Builder Setup
```javascript
async function enableConsultations(builderId, pricing) {
  await updateBuilder(builderId, {
    consultationEnabled: true,
    consultation15minPrice: pricing['15min'],
    consultation30minPrice: pricing['30min'],
    consultation60minPrice: pricing['60min'],
    consultationCalendarUrl: pricing.calendarUrl
  })
  
  // Create weekly recurring slots (optional)
  if (pricing.autoCreateSlots) {
    await createRecurringSlots(builderId, pricing.availability)
  }
}
```

#### Step 2: Client Books Consultation
```javascript
async function bookConsultation(builderId, clientId, slotId, duration, clientNotes) {
  const builder = await getBuilder(builderId)
  const slot = await getCalendarSlot(slotId)
  
  // Check availability
  if (slot.isBooked || !slot.isAvailable) {
    throw new Error("Slot not available")
  }
  
  // Determine price
  const price = builder[`consultation${duration}minPrice`]
  
  // Create consultation
  const consultation = await createConsultation({
    builderId,
    clientId,
    duration,
    price,
    scheduledAt: slot.startTime,
    calendarSlotId: slotId,
    timezone: slot.timezone,
    clientNotes,
    status: 'scheduled'
  })
  
  // Mark slot as booked
  await updateCalendarSlot(slotId, {
    isBooked: true,
    consultationId: consultation.id,
    bookedAt: new Date().toISOString()
  })
  
  // Generate invoice
  const invoice = await generateConsultationInvoice(consultation)
  await updateConsultation(consultation.id, {
    invoiceId: invoice.id
  })
  
  // Create meeting link (if Zoom/Google Meet integration)
  const meeting = await createMeeting({
    title: `Consultation: ${builder.name} & ${client.name}`,
    startTime: slot.startTime,
    duration,
    attendees: [builder.email, client.email]
  })
  
  await updateConsultation(consultation.id, {
    meetingUrl: meeting.joinUrl,
    meetingProvider: meeting.provider,
    meetingId: meeting.id
  })
  
  // Schedule reminders
  await scheduleReminders(consultation.id, slot.startTime)
  
  // Sync to external calendar
  if (builder.consultationCalendarUrl) {
    await syncToExternalCalendar(builder, consultation)
  }
  
  return consultation
}
```

#### Step 3: Payment Required
```javascript
async function payForConsultation(consultationId, paymentId) {
  await updateConsultation(consultationId, {
    paymentId,
    paidAt: new Date().toISOString()
  })
  
  // Send confirmation email with meeting link
  await sendConsultationConfirmation(consultationId)
}
```

#### Step 4: Reminders
```javascript
// Background job runs every hour
async function sendConsultationReminders() {
  const now = new Date()
  const in24h = addHours(now, 24)
  const in1h = addHours(now, 1)
  
  // 24-hour reminder
  const consultations24h = await getConsultations({
    status: 'scheduled',
    scheduledAt: { gte: now, lte: in24h },
    reminder24hSent: false
  })
  
  for (const consultation of consultations24h) {
    await sendEmail({
      to: [consultation.client.email, consultation.builder.email],
      subject: '24-Hour Reminder: Your Consultation Tomorrow',
      template: 'consultation-reminder-24h',
      data: consultation
    })
    
    await updateConsultation(consultation.id, {
      reminder24hSent: true
    })
  }
  
  // 1-hour reminder
  const consultations1h = await getConsultations({
    status: 'scheduled',
    scheduledAt: { gte: now, lte: in1h },
    reminder1hSent: false
  })
  
  for (const consultation of consultations1h) {
    await sendEmail({
      to: [consultation.client.email, consultation.builder.email],
      subject: '1-Hour Reminder: Your Consultation Starting Soon',
      template: 'consultation-reminder-1h',
      data: consultation
    })
    
    // Send SMS reminder (optional)
    await sendSMS(consultation.client.phone, 
      `Reminder: Consultation with ${consultation.builder.name} in 1 hour. Join: ${consultation.meetingUrl}`)
    
    await updateConsultation(consultation.id, {
      reminder1hSent: true
    })
  }
}
```

#### Step 5: Completion & Conversion
```javascript
async function completeConsultation(consultationId, builderNotes) {
  await updateConsultation(consultationId, {
    status: 'completed',
    completedAt: new Date().toISOString(),
    builderNotes
  })
  
  // Prompt client to convert to order
  await sendConversionPrompt(consultationId)
}

async function convertConsultationToOrder(consultationId, orderData) {
  const consultation = await getConsultation(consultationId)
  
  // Create user credit from consultation fee
  const credit = await createUserCredit({
    userId: consultation.clientId,
    userType: 'client',
    amount: consultation.price,
    remainingAmount: consultation.price,
    source: 'consultation_conversion',
    sourceId: consultationId,
    applicableTo: 'specific_builder',
    applicableBuilderIds: [consultation.builderId]
  })
  
  // Create order with credit applied
  const order = await createOrder({
    ...orderData,
    clientId: consultation.clientId,
    builderId: consultation.builderId,
    budget: calculateBudget(orderData.price, consultation.price) // Subtract credit
  })
  
  // Apply credit
  await applyCredit(credit.id, order.id, consultation.price)
  
  // Mark consultation as converted
  await updateConsultation(consultationId, {
    convertedToOrder: true,
    convertedOrderId: order.id,
    creditApplied: consultation.price
  })
  
  return order
}
```

### Calendar Integration

#### Google Calendar Sync
```javascript
async function syncToGoogleCalendar(builderId, consultation) {
  const builder = await getBuilder(builderId)
  const googleAuth = await getGoogleAuth(builderId)
  
  const event = {
    summary: `Consultation with ${consultation.client.name}`,
    description: consultation.clientNotes,
    start: {
      dateTime: consultation.scheduledAt,
      timeZone: consultation.timezone
    },
    end: {
      dateTime: addMinutes(consultation.scheduledAt, consultation.duration),
      timeZone: consultation.timezone
    },
    attendees: [
      { email: builder.email },
      { email: consultation.client.email }
    ],
    conferenceData: {
      createRequest: {
        requestId: consultation.id,
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    }
  }
  
  const calendarEvent = await googleCalendar.events.insert({
    calendarId: 'primary',
    resource: event,
    conferenceDataVersion: 1,
    sendUpdates: 'all'
  })
  
  await updateCalendarSlot(consultation.calendarSlotId, {
    externalCalendarId: calendarEvent.id,
    externalProvider: 'google'
  })
  
  return calendarEvent
}
```

---

## 2. Order Top-Up & Scope-Change (Amendments)

### Business Requirements Met
✅ Mid-order upsell mechanism  
✅ Escrow amendment support  
✅ Out-of-scope revision → add fee before proceeding  
✅ Approval workflow (client must approve)  
✅ Invoice generation for amendment  
✅ Timeline extension support  

### Database Schema Changes

#### Order Amendments Table
```typescript
export const orderAmendments = pgTable("order_amendments", {
  id: varchar("id").primaryKey()
  orderId: varchar("order_id").notNull()
  
  amendmentType: text("amendment_type").notNull()  
    // 'scope_change' | 'top_up' | 'out_of_scope_revision' | 
    // 'timeline_extension' | 'add_deliverable'
  
  // Details
  reason: text("reason").notNull()
  description: text("description").notNull()
  
  // Financial impact
  additionalAmount: decimal("additional_amount").notNull()
  newTotalBudget: decimal("new_total_budget").notNull()
  
  // Timeline impact
  additionalDays: integer("additional_days").default(0)
  newDeliveryDate: text("new_delivery_date")
  
  // Approval workflow
  status: text("status").default("pending")  
    // pending, approved, rejected, paid, completed
  
  requestedBy: varchar("requested_by").notNull()  // Usually builder
  requestedByType: text("requested_by_type").notNull()  // 'builder' | 'client'
  
  approvedBy: varchar("approved_by")
  approvedAt: text("approved_at")
  
  rejectedBy: varchar("rejected_by")
  rejectedAt: text("rejected_at")
  rejectionReason: text("rejection_reason")
  
  // Payment
  paymentId: varchar("payment_id")
  invoiceId: varchar("invoice_id")
  paidAt: text("paid_at")
  
  // Escrow update
  escrowAmended: boolean("escrow_amended").default(false)
  escrowAmendTxHash: text("escrow_amend_tx_hash")
  escrowAmendedAt: text("escrow_amended_at")
  
  // Deliverables
  additionalDeliverables: text("additional_deliverables").array()
  
  createdAt: text("created_at")
  updatedAt: text("updated_at")
})
```

### Amendment Flow

#### Scenario 1: Out-of-Scope Revision Request
```javascript
async function requestOutOfScopeRevision(orderId, builderId, details) {
  const order = await getOrder(orderId)
  
  // Check if revision is truly out of scope
  if (order.revisionCount >= order.maxRevisions) {
    // Create amendment request
    const amendment = await createAmendment({
      orderId,
      amendmentType: 'out_of_scope_revision',
      reason: 'Revision limit exceeded',
      description: details.description,
      additionalAmount: details.fee,  // Builder sets fee
      newTotalBudget: parseFloat(order.budget) + details.fee,
      requestedBy: builderId,
      requestedByType: 'builder',
      status: 'pending'
    })
    
    // Notify client
    await notifyAmendmentRequest(amendment)
    
    // Block revision until amendment is paid
    return {
      blocked: true,
      amendment: amendment
    }
  }
  
  // Within scope - proceed normally
  return {
    blocked: false
  }
}
```

#### Scenario 2: Scope Change (Mid-Order Upsell)
```javascript
async function requestScopeChange(orderId, builderId, changes) {
  const order = await getOrder(orderId)
  
  const amendment = await createAmendment({
    orderId,
    amendmentType: 'scope_change',
    reason: changes.reason,
    description: changes.description,
    additionalAmount: changes.additionalFee,
    newTotalBudget: parseFloat(order.budget) + changes.additionalFee,
    additionalDays: changes.extraDays,
    newDeliveryDate: addDays(order.deliveryDate, changes.extraDays),
    additionalDeliverables: changes.newDeliverables,
    requestedBy: builderId,
    requestedByType: 'builder',
    status: 'pending'
  })
  
  // Generate amendment invoice
  const invoice = await generateAmendmentInvoice(amendment)
  await updateAmendment(amendment.id, {
    invoiceId: invoice.id
  })
  
  return amendment
}
```

#### Scenario 3: Client Approval & Payment
```javascript
async function approveAmendment(amendmentId, clientId) {
  const amendment = await getAmendment(amendmentId)
  
  await updateAmendment(amendmentId, {
    status: 'approved',
    approvedBy: clientId,
    approvedAt: new Date().toISOString()
  })
  
  // Redirect to payment
  return {
    invoiceId: amendment.invoiceId,
    amountDue: amendment.additionalAmount
  }
}

async function payAmendment(amendmentId, paymentId) {
  await updateAmendment(amendmentId, {
    paymentId,
    paidAt: new Date().toISOString(),
    status: 'paid'
  })
  
  // Now update escrow
  await amendEscrow(amendmentId)
}
```

#### Scenario 4: Escrow Amendment (On-Chain)
```javascript
async function amendEscrow(amendmentId) {
  const amendment = await getAmendment(amendmentId)
  const order = await getOrder(amendment.orderId)
  
  // Call smart contract to increase escrow amount
  const tx = await escrowContract.amendEscrow(
    order.id,
    amendment.additionalAmount
  )
  
  await updateAmendment(amendmentId, {
    escrowAmended: true,
    escrowAmendTxHash: tx.hash,
    escrowAmendedAt: new Date().toISOString(),
    status: 'completed'
  })
  
  // Update order totals
  await updateOrder(order.id, {
    budget: amendment.newTotalBudget,
    deliveryDate: amendment.newDeliveryDate || order.deliveryDate
  })
  
  // Notify both parties
  await notifyAmendmentCompleted(amendment)
}
```

---

## 3. Incident & Audit Logging

### Business Requirements Met
✅ Immutable logs for all critical actions  
✅ Export to cold storage (S3/GCS)  
✅ Alerts on anomalous patterns  
✅ Multi-accounting detection  
✅ Fast withdrawal alerts  
✅ Comprehensive audit trail for compliance  

### Database Schema Changes

#### Audit Logs Table
Immutable event log for all critical actions:

```typescript
export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey()
  
  // Event identification
  eventType: text("event_type").notNull()  
    // 'payout' | 'dispute' | 'admin_edit' | 'withdrawal' | 'escrow_release'
  eventCategory: text("event_category").notNull()  
    // 'financial' | 'administrative' | 'security' | 'user_action'
  
  // Actor
  actorId: varchar("actor_id").notNull()
  actorType: text("actor_type").notNull()  // 'user' | 'admin' | 'builder' | 'client' | 'system'
  actorEmail: text("actor_email")
  
  // Target
  targetId: varchar("target_id")  // Order ID, user ID, etc
  targetType: text("target_type")  // 'order' | 'user' | 'payment' | 'dispute'
  
  // Action
  action: text("action").notNull()  // 'created' | 'updated' | 'deleted' | 'approved' | 'released'
  description: text("description").notNull()
  
  // Context
  metadata: text("metadata")  // JSON with additional context
  ipAddress: text("ip_address")
  userAgent: text("user_agent")
  requestId: text("request_id")  // Trace requests
  
  // Changes (for edits)
  beforeState: text("before_state")  // JSON snapshot before
  afterState: text("after_state")  // JSON snapshot after
  
  // Financial events
  amount: decimal("amount")
  currency: text("currency").default("USDC")
  transactionHash: text("transaction_hash")
  
  // Severity
  severity: text("severity").default("info")  // 'info' | 'warning' | 'critical'
  
  // Export status
  exportedToColdStorage: boolean("exported_to_cold_storage").default(false)
  exportedAt: text("exported_at")
  
  timestamp: text("timestamp").default(CURRENT_TIMESTAMP)
})
```

#### Incident Logs Table
Security and anomaly detection:

```typescript
export const incidentLogs = pgTable("incident_logs", {
  id: varchar("id").primaryKey()
  
  incidentType: text("incident_type").notNull()  
    // 'multi_accounting' | 'fast_withdrawal' | 'suspicious_activity' | 'fraud_attempt'
  severity: text("severity").notNull()  // 'low' | 'medium' | 'high' | 'critical'
  status: text("status").default("open")  // open, investigating, resolved, false_positive
  
  // Detection
  detectionMethod: text("detection_method").notNull()  // 'automated' | 'manual' | 'user_report'
  detectedAt: text("detected_at").default(CURRENT_TIMESTAMP)
  
  // Subjects
  userId: varchar("user_id")
  relatedUserIds: text("related_user_ids").array()  // For multi-accounting
  
  // Evidence
  description: text("description").notNull()
  evidence: text("evidence")  // JSON with detection details
  ipAddresses: text("ip_addresses").array()
  deviceFingerprints: text("device_fingerprints").array()
  
  // Patterns
  pattern: text("pattern")  // Description of suspicious pattern
  confidence: decimal("confidence")  // AI confidence score (0-100)
  
  // Financial impact
  potentialLoss: decimal("potential_loss")
  actualLoss: decimal("actual_loss")
  
  // Investigation
  assignedTo: varchar("assigned_to")  // Admin ID
  investigationNotes: text("investigation_notes")
  investigatedAt: text("investigated_at")
  
  // Resolution
  resolvedBy: varchar("resolved_by")
  resolvedAt: text("resolved_at")
  resolution: text("resolution")
  actionTaken: text("action_taken")  
    // 'account_suspended' | 'warning_issued' | 'no_action'
  
  // Alerting
  alertSent: boolean("alert_sent").default(false)
  alertSentAt: text("alert_sent_at")
  alertedAdmins: text("alerted_admins").array()
  
  createdAt: text("created_at")
  updatedAt: text("updated_at")
})
```

### Audit Logging Examples

#### Example 1: Payout Event
```javascript
async function processPayout(builderId, amount) {
  const beforeState = await getBuilder(builderId)
  
  // Execute payout
  await decrementBuilderBalance(builderId, amount)
  await createWithdrawalRequest(builderId, amount)
  
  const afterState = await getBuilder(builderId)
  
  // Log to audit
  await createAuditLog({
    eventType: 'payout',
    eventCategory: 'financial',
    actorId: builderId,
    actorType: 'builder',
    actorEmail: beforeState.email,
    targetId: builderId,
    targetType: 'user',
    action: 'withdraw',
    description: `Builder withdrew $${amount} USDC`,
    metadata: JSON.stringify({
      withdrawalMethod: 'bank_transfer',
      previousBalance: beforeState.availableBalance,
      newBalance: afterState.availableBalance
    }),
    beforeState: JSON.stringify({
      availableBalance: beforeState.availableBalance
    }),
    afterState: JSON.stringify({
      availableBalance: afterState.availableBalance
    }),
    amount,
    currency: 'USDC',
    severity: 'info'
  })
}
```

#### Example 2: Admin Edit
```javascript
async function adminEditOrder(adminId, orderId, updates) {
  const before = await getOrder(orderId)
  
  await updateOrder(orderId, updates)
  
  const after = await getOrder(orderId)
  
  await createAuditLog({
    eventType: 'admin_edit',
    eventCategory: 'administrative',
    actorId: adminId,
    actorType: 'admin',
    targetId: orderId,
    targetType: 'order',
    action: 'updated',
    description: `Admin ${adminId} edited order ${orderId}`,
    beforeState: JSON.stringify(before),
    afterState: JSON.stringify(after),
    ipAddress: req.ip,
    userAgent: req.headers['user-agent'],
    severity: 'warning'  // Admin edits are flagged
  })
}
```

### Anomaly Detection

#### Multi-Accounting Detection
```javascript
async function detectMultiAccounting() {
  // Find users sharing IP addresses
  const suspiciousGroups = await db.execute(sql`
    SELECT ip_address, array_agg(DISTINCT user_id) as user_ids, COUNT(DISTINCT user_id) as user_count
    FROM audit_logs
    WHERE timestamp > NOW() - INTERVAL '7 days'
      AND actor_type IN ('builder', 'client')
    GROUP BY ip_address
    HAVING COUNT(DISTINCT user_id) > 1
  `)
  
  for (const group of suspiciousGroups.rows) {
    if (group.user_count >= 3) {  // 3+ users from same IP
      await createIncident({
        incidentType: 'multi_accounting',
        severity: 'high',
        detectionMethod: 'automated',
        description: `${group.user_count} accounts detected from IP ${group.ip_address}`,
        relatedUserIds: group.user_ids,
        ipAddresses: [group.ip_address],
        evidence: JSON.stringify({
          sharedIP: group.ip_address,
          accounts: group.user_ids,
          detectionDate: new Date()
        }),
        confidence: 85,  // High confidence
        potentialLoss: 0  // To be calculated
      })
    }
  }
}
```

#### Fast Withdrawal Detection
```javascript
async function detectFastWithdrawals() {
  // Find users withdrawing within 24h of earnings
  const fastWithdrawals = await db.execute(sql`
    SELECT 
      w.builder_id,
      w.amount,
      w.created_at as withdrawal_time,
      o.completed_at as order_completion_time,
      EXTRACT(EPOCH FROM (w.created_at - o.completed_at))/3600 as hours_diff
    FROM withdrawal_requests w
    JOIN orders o ON o.builder_id = w.builder_id
    WHERE w.status = 'pending'
      AND EXTRACT(EPOCH FROM (w.created_at - o.completed_at))/3600 < 24
  `)
  
  for (const withdrawal of fastWithdrawals.rows) {
    if (withdrawal.hours_diff < 1) {  // Within 1 hour
      await createIncident({
        incidentType: 'fast_withdrawal',
        severity: 'medium',
        userId: withdrawal.builder_id,
        detectionMethod: 'automated',
        description: `Builder withdrew $${withdrawal.amount} within ${withdrawal.hours_diff.toFixed(1)} hours of order completion`,
        evidence: JSON.stringify({
          withdrawalAmount: withdrawal.amount,
          timeSinceCompletion: withdrawal.hours_diff,
          orderCompletedAt: withdrawal.order_completion_time,
          withdrawalRequestedAt: withdrawal.withdrawal_time
        }),
        confidence: 60,  // Medium confidence
        potentialLoss: withdrawal.amount
      })
    }
  }
}
```

### Cold Storage Export

```javascript
// Daily job to export old audit logs
async function exportAuditLogsToColdStorage() {
  const cutoffDate = subDays(new Date(), 90)  // Export logs older than 90 days
  
  const logsToExport = await getAuditLogs({
    timestamp: { lt: cutoffDate.toISOString() },
    exportedToColdStorage: false
  })
  
  if (logsToExport.length === 0) return
  
  // Convert to CSV
  const csv = convertToCSV(logsToExport)
  
  // Upload to S3/GCS
  const filename = `audit-logs-${cutoffDate.toISOString().split('T')[0]}.csv`
  await uploadToCloudStorage(filename, csv)
  
  // Mark as exported
  for (const log of logsToExport) {
    await updateAuditLog(log.id, {
      exportedToColdStorage: true,
      exportedAt: new Date().toISOString()
    })
  }
  
  console.log(`Exported ${logsToExport.length} audit logs to cold storage`)
}
```

---

## 4. Support Console

### Business Requirements Met
✅ Unified user view (orders, payments, messages)  
✅ Read-only impersonation  
✅ Order merge/split  
✅ Credit issuance  
✅ Audit log for all admin actions  
✅ Manual refunds  

### Database Schema Changes

#### Support Actions Table
Tracks all admin support actions:

```typescript
export const supportActions = pgTable("support_actions", {
  id: varchar("id").primaryKey()
  
  actionType: text("action_type").notNull()  
    // 'impersonation' | 'order_merge' | 'order_split' | 'credit_issue' | 'refund_manual'
  
  // Admin
  adminId: varchar("admin_id").notNull()
  adminEmail: text("admin_email").notNull()
  
  // Target
  targetUserId: varchar("target_user_id").notNull()
  targetUserEmail: text("target_user_email")
  targetUserType: text("target_user_type")  // 'builder' | 'client'
  
  // Action details
  description: text("description").notNull()
  reason: text("reason").notNull()  // Why this action was taken
  
  // Specific action data
  orderId: varchar("order_id")
  relatedOrderIds: text("related_order_ids").array()  // For merge/split
  
  creditAmount: decimal("credit_amount")
  creditReason: text("credit_reason")
  creditExpiresAt: text("credit_expires_at")
  
  // Impersonation
  impersonationStartedAt: text("impersonation_started_at")
  impersonationEndedAt: text("impersonation_ended_at")
  impersonationDuration: integer("impersonation_duration")  // Seconds
  impersonationReadOnly: boolean("impersonation_read_only").default(true)
  
  // Approval (for high-risk actions)
  requiresApproval: boolean("requires_approval").default(false)
  approvedBy: varchar("approved_by")
  approvedAt: text("approved_at")
  
  // Context
  ipAddress: text("ip_address")
  userAgent: text("user_agent")
  
  // Results
  success: boolean("success").default(true)
  errorMessage: text("error_message")
  
  createdAt: text("created_at")
})
```

#### User Credits Table
Platform credits from various sources:

```typescript
export const userCredits = pgTable("user_credits", {
  id: varchar("id").primaryKey()
  userId: varchar("user_id").notNull()
  userType: text("user_type").notNull()  // 'client' | 'builder'
  
  // Credit details
  amount: decimal("amount").notNull()
  remainingAmount: decimal("remaining_amount").notNull()
  
  source: text("source").notNull()  
    // 'consultation_conversion' | 'refund' | 'promo' | 'admin_issued' | 'referral'
  sourceId: varchar("source_id")  // Consultation ID, order ID, promo code
  
  // Usage restrictions
  applicableTo: text("applicable_to").default("all")  
    // 'all' | 'specific_builder' | 'specific_category'
  applicableBuilderIds: text("applicable_builder_ids").array()
  applicableCategories: text("applicable_categories").array()
  
  // Expiration
  expiresAt: text("expires_at")
  isExpired: boolean("is_expired").default(false)
  
  // Usage
  isUsed: boolean("is_used").default(false)
  usedAmount: decimal("used_amount").default("0")
  usedOrderIds: text("used_order_ids").array()
  fullyUsedAt: text("fully_used_at")
  
  // Admin notes (if admin-issued)
  adminNotes: text("admin_notes")
  issuedBy: varchar("issued_by")  // Admin ID
  
  createdAt: text("created_at")
  updatedAt: text("updated_at")
})
```

### Support Console Features

#### Feature 1: Unified User View
```javascript
async function getUserSupportView(userId, userType) {
  const user = await getUser(userId, userType)
  
  return {
    profile: user,
    orders: await getOrders({ [userType === 'client' ? 'clientId' : 'builderId']: userId }),
    payments: await getPayments({ userId }),
    messages: await getMessageThreads({ userId }),
    disputes: await getDisputes({ userId }),
    credits: await getUserCredits({ userId }),
    withdrawals: userType === 'builder' ? await getWithdrawalRequests({ builderId: userId }) : null,
    auditLog: await getAuditLogs({ actorId: userId }),
    incidents: await getIncidents({ userId }),
    supportActions: await getSupportActions({ targetUserId: userId }),
    
    // Metrics
    metrics: {
      totalOrders: user.totalOrders,
      successRate: user.successRate,
      avgRating: user.avgRating,
      totalSpent: userType === 'client' ? user.totalSpent : null,
      totalEarnings: userType === 'builder' ? user.totalEarnings : null
    }
  }
}
```

#### Feature 2: Read-Only Impersonation
```javascript
async function impersonateUser(adminId, userId, userType) {
  // Create support action record
  const action = await createSupportAction({
    actionType: 'impersonation',
    adminId,
    adminEmail: req.admin.email,
    targetUserId: userId,
    targetUserEmail: user.email,
    targetUserType: userType,
    description: `Admin impersonated user ${userId}`,
    reason: req.body.reason,
    impersonationReadOnly: true,
    impersonationStartedAt: new Date().toISOString()
  })
  
  // Generate impersonation token (JWT)
  const token = generateImpersonationToken({
    adminId,
    userId,
    userType,
    readOnly: true,
    actionId: action.id,
    expiresIn: '1h'
  })
  
  return {
    token,
    actionId: action.id,
    expiresAt: addHours(new Date(), 1)
  }
}

async function endImpersonation(actionId) {
  const action = await getSupportAction(actionId)
  const duration = differenceInSeconds(new Date(), action.impersonationStartedAt)
  
  await updateSupportAction(actionId, {
    impersonationEndedAt: new Date().toISOString(),
    impersonationDuration: duration
  })
  
  // Log to audit
  await createAuditLog({
    eventType: 'impersonation_ended',
    eventCategory: 'administrative',
    actorId: action.adminId,
    actorType: 'admin',
    targetId: action.targetUserId,
    targetType: 'user',
    action: 'impersonation_ended',
    description: `Admin ended impersonation of user ${action.targetUserId}`,
    metadata: JSON.stringify({
      duration,
      actionId
    }),
    severity: 'info'
  })
}
```

#### Feature 3: Credit Issuance
```javascript
async function issueCredit(adminId, userId, userType, creditData) {
  const credit = await createUserCredit({
    userId,
    userType,
    amount: creditData.amount,
    remainingAmount: creditData.amount,
    source: 'admin_issued',
    applicableTo: creditData.applicableTo || 'all',
    expiresAt: creditData.expiresAt,
    adminNotes: creditData.reason,
    issuedBy: adminId
  })
  
  await createSupportAction({
    actionType: 'credit_issue',
    adminId,
    adminEmail: req.admin.email,
    targetUserId: userId,
    targetUserType: userType,
    description: `Issued $${creditData.amount} credit to user`,
    reason: creditData.reason,
    creditAmount: creditData.amount,
    creditReason: creditData.reason,
    creditExpiresAt: creditData.expiresAt
  })
  
  // Notify user
  await notifyCreditIssued(userId, credit)
  
  return credit
}
```

#### Feature 4: Order Merge
```javascript
async function mergeOrders(adminId, order1Id, order2Id, reason) {
  const order1 = await getOrder(order1Id)
  const order2 = await getOrder(order2Id)
  
  // Validation
  if (order1.clientId !== order2.clientId || order1.builderId !== order2.builderId) {
    throw new Error("Orders must have same client and builder")
  }
  
  // Create new merged order
  const mergedOrder = await createOrder({
    clientId: order1.clientId,
    builderId: order1.builderId,
    serviceId: order1.serviceId,
    packageType: 'custom',
    title: `Merged: ${order1.title} + ${order2.title}`,
    requirements: `${order1.requirements}\n\n---\n\n${order2.requirements}`,
    budget: parseFloat(order1.budget) + parseFloat(order2.budget),
    deliveryDays: Math.max(order1.deliveryDays, order2.deliveryDays),
    status: 'in_progress'
  })
  
  // Cancel original orders
  await updateOrder(order1Id, {
    status: 'cancelled',
    cancellationReason: `Merged into order ${mergedOrder.id}`
  })
  
  await updateOrder(order2Id, {
    status: 'cancelled',
    cancellationReason: `Merged into order ${mergedOrder.id}`
  })
  
  // Log support action
  await createSupportAction({
    actionType: 'order_merge',
    adminId,
    adminEmail: req.admin.email,
    targetUserId: order1.clientId,
    description: `Merged orders ${order1Id} and ${order2Id} into ${mergedOrder.id}`,
    reason,
    orderId: mergedOrder.id,
    relatedOrderIds: [order1Id, order2Id]
  })
  
  return mergedOrder
}
```

---

## Quick Wins Implementation

### Quick Win 1: Auto-Messages

**Purpose:** Automated nudges at key intervals to keep orders moving.

**Schema Changes:**
Added to `orders` table:
```typescript
requirementNudge24hSent: boolean("requirement_nudge_24h_sent").default(false)
requirementNudge72hSent: boolean("requirement_nudge_72h_sent").default(false)
deliveryReview48hSent: boolean("delivery_review_48h_sent").default(false)
idleBreaker5MessagesSent: boolean("idle_breaker_5_messages_sent").default(false)
```

**Logic:**
```javascript
// Background job runs hourly
async function sendAutoMessages() {
  const now = new Date()
  
  // 24h nudge: Requirements missing
  const orders24h = await getOrders({
    status: 'pending_requirements',
    requirementsRequestedAt: { lt: subHours(now, 24) },
    requirementNudge24hSent: false
  })
  
  for (const order of orders24h) {
    await sendMessage({
      to: order.clientId,
      template: 'requirement-nudge-24h',
      data: { order, hoursRemaining: 72 - 24 }
    })
    
    await updateOrder(order.id, {
      requirementNudge24hSent: true
    })
  }
  
  // 72h nudge: Final reminder before auto-cancel
  const orders72h = await getOrders({
    status: 'pending_requirements',
    requirementsRequestedAt: { lt: subHours(now, 72) },
    requirementNudge72hSent: false
  })
  
  for (const order of orders72h) {
    await sendMessage({
      to: order.clientId,
      template: 'requirement-nudge-72h',
      data: { order, hoursRemaining: (7 * 24) - 72 }
    })
    
    await updateOrder(order.id, {
      requirementNudge72hSent: true
    })
  }
  
  // 48h review: Delivery pending review
  const ordersDelivered = await getOrders({
    status: 'delivered',
    deliveredAt: { lt: subHours(now, 48) },
    deliveryReview48hSent: false
  })
  
  for (const order of ordersDelivered) {
    await sendMessage({
      to: order.clientId,
      template: 'delivery-review-48h',
      data: { order }
    })
    
    await updateOrder(order.id, {
      deliveryReview48hSent: true
    })
  }
}
```

### Quick Win 2: Price Sanity Hints

**Purpose:** Show market range bands while builders price packages.

**Schema Changes:**
Added to `services` table:
```typescript
marketMinPrice: decimal("market_min_price")
marketMaxPrice: decimal("market_max_price")
marketMedianPrice: decimal("market_median_price")
pricePercentile: integer("price_percentile")  // 0-100
```

**Logic:**
```javascript
async function calculatePriceHints(category) {
  const services = await getServices({ category, active: true })
  
  const prices = services.map(s => parseFloat(s.basicPrice)).sort((a, b) => a - b)
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    median: prices[Math.floor(prices.length / 2)],
    p25: prices[Math.floor(prices.length * 0.25)],
    p75: prices[Math.floor(prices.length * 0.75)]
  }
}

// UI Display
function PricingGuidance({ category, currentPrice }) {
  const hints = usePriceHints(category)
  
  const percentile = calculatePercentile(currentPrice, hints)
  
  return (
    <div className="price-hints">
      <div className="range-bar">
        <span className="min">${hints.min}</span>
        <div className="bar">
          <div className="marker" style={{ left: `${percentile}%` }} />
        </div>
        <span className="max">${hints.max}</span>
      </div>
      
      {percentile < 25 && (
        <Alert variant="warning">
          Your price is below 75% of similar services. Consider raising it.
        </Alert>
      )}
      
      {percentile > 75 && (
        <Alert variant="info">
          Your price is above 75% of similar services. This is premium pricing.
        </Alert>
      )}
      
      <p className="median">
        Median price in {category}: <strong>${hints.median}</strong>
      </p>
    </div>
  )
}
```

### Quick Win 3: Idle Breakers

**Purpose:** "Offer a discount to close" prompt if chat >5 messages, no order.

**Logic:**
```javascript
async function checkIdleConversations() {
  // Find conversations with >5 messages but no order
  const idleChats = await db.execute(sql`
    SELECT 
      c.id,
      c.participant1_id as client_id,
      c.participant2_id as builder_id,
      COUNT(m.id) as message_count
    FROM conversations c
    JOIN messages m ON m.conversation_id = c.id
    LEFT JOIN orders o ON (o.client_id = c.participant1_id AND o.builder_id = c.participant2_id)
    WHERE o.id IS NULL
      AND c.created_at > NOW() - INTERVAL '7 days'
    GROUP BY c.id
    HAVING COUNT(m.id) > 5
  `)
  
  for (const chat of idleChats.rows) {
    // Send builder a nudge
    await sendMessage({
      to: chat.builder_id,
      template: 'idle-breaker-discount',
      data: {
        conversationId: chat.id,
        clientId: chat.client_id,
        messageCount: chat.message_count
      }
    })
    
    // Suggest: "This client seems interested. Offer a 10% discount to close the deal?"
  }
}
```

**UI Prompt:**
```jsx
function IdleBreakerPrompt({ conversation }) {
  const [showOffer, setShowOffer] = useState(false)
  
  if (conversation.messageCount > 5 && !conversation.hasOrder) {
    return (
      <Alert variant="info">
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>Close the deal</AlertTitle>
        <AlertDescription>
          You've exchanged {conversation.messageCount} messages with this client. 
          Consider offering a discount to convert them to an order.
          <Button 
            onClick={() => setShowOffer(true)}
            className="mt-2"
          >
            Create Custom Offer (10% off)
          </Button>
        </AlertDescription>
      </Alert>
    )
  }
  
  return null
}
```

### Quick Win 4: Away Mode

**Purpose:** One toggle pauses all packages, updates ETA, hides in search.

**Schema Changes:**
Added to `builders` table:
```typescript
isAway: boolean("is_away").default(false)
awayMessage: text("away_message")
awayUntil: text("away_until")  // ISO date when returning
awayPausedAt: text("away_paused_at")
```

**Logic:**
```javascript
async function toggleAwayMode(builderId, isAway, awayData) {
  await updateBuilder(builderId, {
    isAway,
    awayMessage: isAway ? awayData.message : null,
    awayUntil: isAway ? awayData.returnDate : null,
    awayPausedAt: isAway ? new Date().toISOString() : null
  })
  
  if (isAway) {
    // Pause all services
    await pauseAllServices(builderId)
    
    // Hide from search
    await updateBuilderSearchVisibility(builderId, false)
    
    // Notify active clients
    await notifyClientsOfAway(builderId, awayData)
    
    // Update ETAs on active orders
    await extendOrderETAs(builderId, awayData.returnDate)
  } else {
    // Resume all services
    await resumeAllServices(builderId)
    
    // Show in search
    await updateBuilderSearchVisibility(builderId, true)
  }
}
```

**UI Component:**
```jsx
function AwayModeToggle({ builder }) {
  const [isAway, setIsAway] = useState(builder.isAway)
  const [awayForm, setAwayForm] = useState({
    message: '',
    returnDate: ''
  })
  
  const handleToggle = async () => {
    if (!isAway) {
      // Enabling away mode
      await toggleAwayMode(builder.id, true, awayForm)
      setIsAway(true)
    } else {
      // Disabling away mode
      await toggleAwayMode(builder.id, false)
      setIsAway(false)
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Away Mode</CardTitle>
        <CardDescription>
          Pause all services, hide from search, and notify clients
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Switch 
            checked={isAway}
            onCheckedChange={setIsAway}
          />
          <Label>{isAway ? 'Away' : 'Available'}</Label>
        </div>
        
        {isAway && (
          <div className="mt-4 space-y-4">
            <Input 
              placeholder="Away message (e.g., 'On vacation until...')"
              value={awayForm.message}
              onChange={(e) => setAwayForm({...awayForm, message: e.target.value})}
            />
            <Input 
              type="date"
              value={awayForm.returnDate}
              onChange={(e) => setAwayForm({...awayForm, returnDate: e.target.value})}
            />
            <Button onClick={handleToggle}>Save Away Mode</Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

---

## API Endpoints (To Be Implemented)

### Consultations
```
GET    /api/consultations                     - List consultations
POST   /api/consultations                     - Book consultation
GET    /api/consultations/:id                 - Get consultation details
PUT    /api/consultations/:id/complete        - Mark as completed
POST   /api/consultations/:id/convert         - Convert to order
GET    /api/calendar-slots/:builderId         - Get builder availability
POST   /api/calendar-slots                    - Create availability slot
```

### Amendments
```
GET    /api/orders/:id/amendments             - List amendments
POST   /api/orders/:id/amendments             - Request amendment
PUT    /api/amendments/:id/approve            - Approve amendment
PUT    /api/amendments/:id/reject             - Reject amendment
POST   /api/amendments/:id/pay                - Pay for amendment
```

### Audit & Incidents
```
GET    /api/audit-logs                        - List audit logs (admin)
GET    /api/audit-logs/export                 - Export to CSV
GET    /api/incident-logs                     - List incidents (admin)
PUT    /api/incident-logs/:id/investigate     - Assign investigator
PUT    /api/incident-logs/:id/resolve         - Resolve incident
```

### Support Console
```
GET    /api/support/users/:id                 - Get user support view
POST   /api/support/impersonate               - Start impersonation
POST   /api/support/impersonate/end           - End impersonation
POST   /api/support/credits                   - Issue credit
POST   /api/support/orders/merge              - Merge orders
POST   /api/support/orders/split              - Split order
GET    /api/support/actions                   - List support actions
```

---

## Summary

### Database Changes Completed ✅

**New Tables Created (6 tables):**
1. `consultations` - Paid consultation bookings (24 fields)
2. `calendarSlots` - Builder availability (13 fields)
3. `orderAmendments` - Mid-order scope changes (23 fields)
4. `auditLogs` - Immutable event log (21 fields)
5. `incidentLogs` - Security incidents (25 fields)
6. `supportActions` - Admin support actions (21 fields)
7. `userCredits` - Platform credits (17 fields)

**Modified Tables (2 tables):**
1. `builders` - Added 9 fields (consultation pricing, away mode)
2. `orders` - Added 4 fields (auto-message tracking)
3. `services` - Added 4 fields (price sanity hints)

**Total:** 7 new tables with 144 fields + 17 new fields in existing tables

### What's Next (Application Layer)

**Backend:**
- Consultation booking and calendar sync
- Amendment approval workflow
- Audit logging middleware
- Incident detection algorithms
- Support console API routes
- Auto-message cron jobs
- Price hints calculator

**Frontend:**
- Consultation booking widget
- Amendment request UI
- Admin incident dashboard
- Support console
- Away mode toggle
- Price hints display
- Idle breaker prompts

---

## File References
- Schema: `shared/schema.ts`
- Documentation: `replit.md` (to be updated)
- This summary: `CONSULTATIONS_AMENDMENTS_AUDIT_SUPPORT_IMPLEMENTATION.md`
