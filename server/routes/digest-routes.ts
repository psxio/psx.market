import type { Express } from "express";
import { sendDigests } from "../email/digest-service";

export function registerDigestRoutes(app: Express) {
  app.post("/api/admin/digests/send-daily", async (req, res, next) => {
    try {
      await sendDigests({ frequency: "daily" });
      res.json({ success: true, message: "Daily digests sent successfully" });
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/admin/digests/send-weekly", async (req, res, next) => {
    try {
      await sendDigests({ frequency: "weekly" });
      res.json({ success: true, message: "Weekly digests sent successfully" });
    } catch (error) {
      next(error);
    }
  });
}
