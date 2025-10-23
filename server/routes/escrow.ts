import { Router } from 'express';
import { db } from '../db';
import { orders, milestones, escrowDisputes, escrowTransactions } from '@shared/schema';
import { eq, and, desc } from 'drizzle-orm';
import { escrowService } from '../escrowService';

const router = Router();

/**
 * Sync order escrow status from blockchain
 */
router.post('/api/escrow/:orderId/sync', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { isTestnet = true } = req.body;
    
    const status = await escrowService.syncOrderEscrowStatus(orderId, isTestnet);
    
    res.json({
      success: true,
      status,
    });
  } catch (error: any) {
    console.error("Sync order escrow error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to sync escrow status",
    });
  }
});

/**
 * Sync milestone escrow status from blockchain
 */
router.post('/api/escrow/:orderId/milestones/:milestoneIndex/sync', async (req, res) => {
  try {
    const { orderId, milestoneIndex } = req.params;
    const { isTestnet = true } = req.body;
    
    const status = await escrowService.syncMilestoneEscrowStatus(
      orderId,
      parseInt(milestoneIndex),
      isTestnet
    );
    
    res.json({
      success: true,
      status,
    });
  } catch (error: any) {
    console.error("Sync milestone escrow error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to sync milestone status",
    });
  }
});

/**
 * Log escrow transaction
 */
router.post('/api/escrow/transactions', async (req, res) => {
  try {
    const {
      orderId,
      transactionType,
      amount,
      txHash,
      fromAddress,
      toAddress,
      metadata,
    } = req.body;
    
    await escrowService.logEscrowTransaction(
      orderId,
      transactionType,
      amount,
      txHash,
      fromAddress,
      toAddress,
      metadata
    );
    
    res.json({ success: true });
  } catch (error: any) {
    console.error("Log transaction error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to log transaction",
    });
  }
});

/**
 * Update transaction status
 */
router.patch('/api/escrow/transactions/:txHash', async (req, res) => {
  try {
    const { txHash } = req.params;
    const { status, errorMessage } = req.body;
    
    await escrowService.updateTransactionStatus(txHash, status, errorMessage);
    
    res.json({ success: true });
  } catch (error: any) {
    console.error("Update transaction status error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update transaction status",
    });
  }
});

/**
 * Get order escrow transactions
 */
router.get('/api/escrow/:orderId/transactions', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const transactions = await db.select()
      .from(escrowTransactions)
      .where(eq(escrowTransactions.orderId, orderId))
      .orderBy(desc(escrowTransactions.createdAt));
    
    res.json({ transactions });
  } catch (error: any) {
    console.error("Get transactions error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get transactions",
    });
  }
});

/**
 * Create escrow dispute
 */
router.post('/api/escrow/:orderId/disputes', async (req, res) => {
  try {
    const { orderId } = req.params;
    const {
      initiatedBy,
      initiatorType,
      reason,
      description,
      evidence,
      evidenceUrls,
    } = req.body;
    
    const [dispute] = await db.insert(escrowDisputes).values({
      orderId,
      initiatedBy,
      initiatorType,
      reason,
      description,
      evidence,
      evidenceUrls,
      status: 'open',
    }).returning();
    
    await db.update(orders)
      .set({
        inDispute: true,
        disputeRaisedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(orders.id, orderId));
    
    res.json({ success: true, dispute });
  } catch (error: any) {
    console.error("Create dispute error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create dispute",
    });
  }
});

/**
 * Get order disputes
 */
router.get('/api/escrow/:orderId/disputes', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const disputes = await db.select()
      .from(escrowDisputes)
      .where(eq(escrowDisputes.orderId, orderId))
      .orderBy(desc(escrowDisputes.createdAt));
    
    res.json({ disputes });
  } catch (error: any) {
    console.error("Get disputes error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get disputes",
    });
  }
});

/**
 * Resolve dispute (admin only)
 */
router.patch('/api/escrow/disputes/:disputeId/resolve', async (req, res) => {
  try {
    const { disputeId } = req.params;
    const {
      outcome,
      clientPercentage,
      builderPercentage,
      resolvedBy,
      resolutionNotes,
      escrowTxHash,
    } = req.body;
    
    const [dispute] = await db.update(escrowDisputes)
      .set({
        status: 'resolved',
        outcome,
        clientPercentage,
        builderPercentage,
        resolvedBy,
        resolvedAt: new Date().toISOString(),
        resolutionNotes,
        escrowTxHash,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(escrowDisputes.id, disputeId))
      .returning();
    
    if (dispute) {
      await db.update(orders)
        .set({
          inDispute: false,
          disputeResolvedAt: new Date().toISOString(),
          disputeOutcome: outcome,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(orders.id, dispute.orderId));
    }
    
    res.json({ success: true, dispute });
  } catch (error: any) {
    console.error("Resolve dispute error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to resolve dispute",
    });
  }
});

/**
 * Get escrow events from blockchain
 */
router.get('/api/escrow/:orderId/events', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { isTestnet = true, fromBlock = 0 } = req.query;
    
    const events = await escrowService.monitorEscrowEvents(
      orderId,
      isTestnet === 'true' || isTestnet === true,
      parseInt(fromBlock as string) || 0
    );
    
    res.json({ events });
  } catch (error: any) {
    console.error("Get events error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get events",
    });
  }
});

/**
 * Get order milestones
 */
router.get('/api/escrow/:orderId/milestones', async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const orderMilestones = await db.select()
      .from(milestones)
      .where(eq(milestones.projectId, orderId))
      .orderBy(milestones.milestoneIndex);
    
    res.json({ milestones: orderMilestones });
  } catch (error: any) {
    console.error("Get milestones error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to get milestones",
    });
  }
});

/**
 * Update milestone status
 */
router.patch('/api/escrow/milestones/:milestoneId', async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const {
      escrowStatus,
      escrowTxHash,
      submittedAt,
      approvedAt,
      paidAt,
      autoApproved,
    } = req.body;
    
    const updateData: any = {};
    
    if (escrowStatus) updateData.escrowStatus = escrowStatus;
    if (escrowTxHash) updateData.escrowTxHash = escrowTxHash;
    if (submittedAt !== undefined) updateData.submittedAt = submittedAt;
    if (approvedAt !== undefined) updateData.approvedAt = approvedAt;
    if (paidAt !== undefined) updateData.paidAt = paidAt;
    if (autoApproved !== undefined) updateData.autoApproved = autoApproved;
    
    const [milestone] = await db.update(milestones)
      .set(updateData)
      .where(eq(milestones.id, milestoneId))
      .returning();
    
    res.json({ success: true, milestone });
  } catch (error: any) {
    console.error("Update milestone error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update milestone",
    });
  }
});

export default router;
