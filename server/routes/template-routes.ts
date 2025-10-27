import type { Express } from "express";
import { storage } from "../storage";
import { z } from "zod";
import { requireBuilderAuth } from "../middleware/auth";

const createTemplateSchema = z.object({
  builderId: z.string(),
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(5000),
  category: z.enum([
    'greeting',
    'pricing',
    'timeline',
    'requirements',
    'delivery',
    'revision',
    'thank_you',
    'follow_up',
    'custom'
  ]),
});

export function registerTemplateRoutes(app: Express) {
  
  // Get all templates for a builder
  app.get("/api/builders/:builderId/templates", requireBuilderAuth, async (req, res) => {
    try {
      const { builderId } = req.params;
      
      // Verify the builder owns these templates
      if (req.session.builderId !== builderId) {
        return res.status(403).json({ error: "Forbidden - Can only access your own templates" });
      }
      
      const { category } = req.query;
      const templates = await storage.getBuilderMessageTemplates(builderId, category as string);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  // Get single template
  app.get("/api/templates/:templateId", requireBuilderAuth, async (req, res) => {
    try {
      const template = await storage.getMessageTemplate(req.params.templateId);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      
      // Verify the builder owns this template
      if (req.session.builderId !== template.builderId) {
        return res.status(403).json({ error: "Forbidden - Can only access your own templates" });
      }
      
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ error: "Failed to fetch template" });
    }
  });

  // Create new template
  app.post("/api/templates", requireBuilderAuth, async (req, res) => {
    try {
      const data = createTemplateSchema.parse(req.body);
      
      // Verify the builder is creating their own template
      if (req.session.builderId !== data.builderId) {
        return res.status(403).json({ error: "Forbidden - Can only create your own templates" });
      }
      
      const template = await storage.createMessageTemplate({
        ...data,
        isActive: true,
        useCount: 0,
      });
      
      res.status(201).json(template);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid template data", details: error.errors });
      }
      console.error("Error creating template:", error);
      res.status(500).json({ error: "Failed to create template" });
    }
  });

  // Update template
  app.patch("/api/templates/:templateId", requireBuilderAuth, async (req, res) => {
    try {
      const { templateId } = req.params;
      
      // Verify ownership before update
      const existing = await storage.getMessageTemplate(templateId);
      if (!existing) {
        return res.status(404).json({ error: "Template not found" });
      }
      if (req.session.builderId !== existing.builderId) {
        return res.status(403).json({ error: "Forbidden - Can only update your own templates" });
      }
      
      const { title, content, category, isActive } = req.body;
      const template = await storage.updateMessageTemplate(templateId, {
        title,
        content,
        category,
        isActive,
      });
      
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      
      res.json(template);
    } catch (error) {
      console.error("Error updating template:", error);
      res.status(500).json({ error: "Failed to update template" });
    }
  });

  // Delete template
  app.delete("/api/templates/:templateId", requireBuilderAuth, async (req, res) => {
    try {
      const { templateId } = req.params;
      
      // Verify ownership before delete
      const existing = await storage.getMessageTemplate(templateId);
      if (!existing) {
        return res.status(404).json({ error: "Template not found" });
      }
      if (req.session.builderId !== existing.builderId) {
        return res.status(403).json({ error: "Forbidden - Can only delete your own templates" });
      }
      
      await storage.deleteMessageTemplate(templateId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ error: "Failed to delete template" });
    }
  });

  // Track template usage
  app.post("/api/templates/:templateId/use", async (req, res) => {
    try {
      await storage.incrementTemplateUseCount(req.params.templateId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error tracking template usage:", error);
      res.status(500).json({ error: "Failed to track usage" });
    }
  });

  // Get template categories with counts
  app.get("/api/builders/:builderId/templates/categories", requireBuilderAuth, async (req, res) => {
    try {
      const { builderId } = req.params;
      
      // Verify the builder owns these templates
      if (req.session.builderId !== builderId) {
        return res.status(403).json({ error: "Forbidden - Can only access your own template categories" });
      }
      
      const templates = await storage.getBuilderMessageTemplates(builderId);
      
      const categoryCounts = templates.reduce((acc, template) => {
        acc[template.category] = (acc[template.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      res.json(categoryCounts);
    } catch (error) {
      console.error("Error fetching template categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });
}
