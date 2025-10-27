import type { Express } from "express";
import { storage } from "../storage";
import { z } from "zod";
import { requireAdminAuth } from "../middleware/auth";
import type { Request, Response, NextFunction } from "express";

// Middleware to check if user is authorized to access dispute
async function requireDisputeAccess(req: Request, res: Response, next: NextFunction) {
  try {
    const disputeId = req.params.disputeId;
    const dispute = await storage.getDispute(disputeId);
    
    if (!dispute) {
      return res.status(404).json({ error: "Dispute not found" });
    }
    
    const order = await storage.getOrder(dispute.orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    // Allow admin, builder, or client involved in the order
    const isAdmin = !!req.session.adminId;
    const isBuilder = req.session.builderId === order.builderId;
    const isClient = req.session.clientId === order.clientId;
    
    if (!isAdmin && !isBuilder && !isClient) {
      return res.status(403).json({ error: "Forbidden - Not authorized to access this dispute" });
    }
    
    next();
  } catch (error) {
    console.error("Error checking dispute access:", error);
    res.status(500).json({ error: "Failed to verify access" });
  }
}

const createDisputeSchema = z.object({
  paymentId: z.string(),
  orderId: z.string(),
  raisedBy: z.string(),
  raisedByType: z.enum(['client', 'builder']),
  reason: z.enum([
    'non_delivery',
    'quality_issues',
    'scope_disagreement',
    'late_delivery',
    'communication_issues',
    'payment_dispute',
    'other'
  ]),
  description: z.string().min(50).max(2000),
  evidence: z.array(z.string()).optional(),
});

export function registerDisputeRoutes(app: Express) {
  
  // Get all disputes (admin only)
  app.get("/api/disputes", requireAdminAuth, async (_req, res) => {
    try {
      const disputes = await storage.getAllDisputes();
      res.json(disputes);
    } catch (error) {
      console.error("Error fetching disputes:", error);
      res.status(500).json({ error: "Failed to fetch disputes" });
    }
  });

  // Get dispute by ID
  app.get("/api/disputes/:disputeId", requireDisputeAccess, async (req, res) => {
    try {
      const dispute = await storage.getDispute(req.params.disputeId);
      if (!dispute) {
        return res.status(404).json({ error: "Dispute not found" });
      }
      res.json(dispute);
    } catch (error) {
      console.error("Error fetching dispute:", error);
      res.status(500).json({ error: "Failed to fetch dispute" });
    }
  });

  // Get disputes for an order
  app.get("/api/orders/:orderId/disputes", async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      // Only allow builder, client, or admin to access order disputes
      const isAdmin = !!req.session.adminId;
      const isBuilder = req.session.builderId === order.builderId;
      const isClient = req.session.clientId === order.clientId;
      
      if (!isAdmin && !isBuilder && !isClient) {
        return res.status(403).json({ error: "Forbidden - Not authorized to access these disputes" });
      }
      
      const disputes = await storage.getOrderDisputes(orderId);
      res.json(disputes);
    } catch (error) {
      console.error("Error fetching order disputes:", error);
      res.status(500).json({ error: "Failed to fetch disputes" });
    }
  });

  // Create new dispute
  app.post("/api/disputes", async (req, res) => {
    try {
      const data = createDisputeSchema.parse(req.body);
      
      // Verify the user is either the builder or client involved in the order
      const order = await storage.getOrder(data.orderId);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      
      // Verify the user creating the dispute is actually part of the order
      const isBuilder = req.session.builderId === order.builderId && data.raisedByType === 'builder';
      const isClient = req.session.clientId === order.clientId && data.raisedByType === 'client';
      
      if (!isBuilder && !isClient) {
        return res.status(403).json({ error: "Forbidden - Can only create disputes for your own orders" });
      }
      
      // Verify raisedBy matches the session
      if (isBuilder && req.session.builderId !== data.raisedBy) {
        return res.status(400).json({ error: "Invalid raisedBy - must match your builder ID" });
      }
      if (isClient && req.session.clientId !== data.raisedBy) {
        return res.status(400).json({ error: "Invalid raisedBy - must match your client ID" });
      }

      // Check if there's already an open dispute for this order
      const existingDisputes = await storage.getOrderDisputes(data.orderId);
      const openDispute = existingDisputes.find(d => d.status === 'open' || d.status === 'under_review');
      if (openDispute) {
        return res.status(409).json({ error: "An open dispute already exists for this order" });
      }

      const dispute = await storage.createDispute({
        ...data,
        status: 'open',
        evidence: data.evidence || [],
      });

      // Mark order as in dispute
      await storage.updateOrder(data.orderId, {
        inDispute: true,
        disputeRaisedAt: new Date().toISOString(),
      });
      
      res.status(201).json(dispute);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid dispute data", details: error.errors });
      }
      console.error("Error creating dispute:", error);
      res.status(500).json({ error: "Failed to create dispute" });
    }
  });

  // Add evidence to dispute
  app.post("/api/disputes/:disputeId/evidence", requireDisputeAccess, async (req, res) => {
    try {
      const { disputeId } = req.params;
      const { evidenceUrls } = req.body;
      
      if (!Array.isArray(evidenceUrls) || evidenceUrls.length === 0) {
        return res.status(400).json({ error: "Evidence URLs must be a non-empty array" });
      }

      const dispute = await storage.addDisputeEvidence(disputeId, evidenceUrls);
      res.json(dispute);
    } catch (error) {
      console.error("Error adding evidence:", error);
      res.status(500).json({ error: "Failed to add evidence" });
    }
  });

  // Get dispute messages
  app.get("/api/disputes/:disputeId/messages", requireDisputeAccess, async (req, res) => {
    try {
      const messages = await storage.getDisputeMessages(req.params.disputeId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching dispute messages:", error);
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  // Add message to dispute
  app.post("/api/disputes/:disputeId/messages", requireDisputeAccess, async (req, res) => {
    try {
      const { disputeId } = req.params;
      const { message, attachments, isInternal } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }
      
      // Derive sender identity from authenticated session (don't trust user input)
      let senderId: string;
      let senderType: 'admin' | 'builder' | 'client';
      
      if (req.session.adminId) {
        senderId = req.session.adminId;
        senderType = 'admin';
      } else if (req.session.builderId) {
        senderId = req.session.builderId;
        senderType = 'builder';
      } else if (req.session.clientId) {
        senderId = req.session.clientId;
        senderType = 'client';
      } else {
        return res.status(401).json({ error: "Unauthorized - No valid session" });
      }

      const disputeMessage = await storage.createDisputeMessage({
        disputeId,
        senderId,
        senderType,
        message,
        attachments: attachments || [],
        isInternal: isInternal && senderType === 'admin' ? true : false, // Only admins can create internal messages
      });
      
      res.status(201).json(disputeMessage);
    } catch (error) {
      console.error("Error adding message:", error);
      res.status(500).json({ error: "Failed to add message" });
    }
  });

  // Update dispute status (admin only)
  app.patch("/api/disputes/:disputeId/status", requireAdminAuth, async (req, res) => {
    try {
      const { disputeId } = req.params;
      const { status, resolution, refundAmount, resolvedBy } = req.body;
      
      if (!['open', 'under_review', 'resolved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      const updateData: any = { status };
      
      if (status === 'resolved' || status === 'rejected') {
        updateData.resolvedBy = resolvedBy;
        updateData.resolvedAt = new Date().toISOString();
        updateData.resolution = resolution;
        
        if (refundAmount !== undefined) {
          updateData.refundAmount = refundAmount;
        }
      }

      const dispute = await storage.updateDispute(disputeId, updateData);
      
      if (status === 'resolved' || status === 'rejected') {
        await storage.updateOrder(dispute.orderId, {
          inDispute: false,
          disputeResolvedAt: new Date().toISOString(),
          disputeOutcome: status,
        });
      }
      
      res.json(dispute);
    } catch (error) {
      console.error("Error updating dispute:", error);
      res.status(500).json({ error: "Failed to update dispute" });
    }
  });

  // Escalate dispute to admin review
  app.post("/api/disputes/:disputeId/escalate", async (req, res) => {
    try {
      const { disputeId } = req.params;
      
      const dispute = await storage.updateDispute(disputeId, {
        status: 'under_review',
        updatedAt: new Date().toISOString(),
      });
      
      res.json(dispute);
    } catch (error) {
      console.error("Error escalating dispute:", error);
      res.status(500).json({ error: "Failed to escalate dispute" });
    }
  });

  // Get builder's disputes
  app.get("/api/builders/:builderId/disputes", async (req, res) => {
    try {
      const { builderId } = req.params;
      const disputes = await storage.getBuilderDisputes(builderId);
      res.json(disputes);
    } catch (error) {
      console.error("Error fetching builder disputes:", error);
      res.status(500).json({ error: "Failed to fetch disputes" });
    }
  });

  // Get client's disputes
  app.get("/api/clients/:clientId/disputes", async (req, res) => {
    try {
      const { clientId } = req.params;
      const disputes = await storage.getClientDisputes(clientId);
      res.json(disputes);
    } catch (error) {
      console.error("Error fetching client disputes:", error);
      res.status(500).json({ error: "Failed to fetch disputes" });
    }
  });
}
