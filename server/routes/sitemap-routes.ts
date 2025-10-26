import type { Express } from "express";
import { storage } from "../storage";

export function registerSitemapRoutes(app: Express) {
  app.get("/sitemap.xml", async (req, res, next) => {
    try {
      const baseUrl = "https://port444.shop";
      
      const staticPages = [
        { url: "", priority: "1.0", changefreq: "daily" },
        { url: "/marketplace", priority: "0.9", changefreq: "daily" },
        { url: "/builders", priority: "0.9", changefreq: "daily" },
        { url: "/getting-started", priority: "0.8", changefreq: "weekly" },
        { url: "/about", priority: "0.7", changefreq: "monthly" },
        { url: "/legal/terms", priority: "0.5", changefreq: "monthly" },
        { url: "/legal/privacy", priority: "0.5", changefreq: "monthly" },
      ];

      const builders = await storage.getBuilders();
      const services = await storage.getServices();

      const builderUrls = builders.map(builder => ({
        url: `/builders/${builder.id}`,
        priority: "0.8",
        changefreq: "weekly",
        lastmod: builder.updatedAt,
      }));

      const serviceUrls = services.map(service => ({
        url: `/services/${service.id}`,
        priority: "0.8",
        changefreq: "weekly",
        lastmod: service.createdAt,
      }));

      const allUrls = [...staticPages, ...builderUrls, ...serviceUrls];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map(({ url, priority, changefreq, lastmod }) => `  <url>
    <loc>${baseUrl}${url}</loc>
    <priority>${priority}</priority>
    <changefreq>${changefreq}</changefreq>${lastmod ? `
    <lastmod>${new Date(lastmod).toISOString().split('T')[0]}</lastmod>` : ''}
  </url>`).join('\n')}
</urlset>`;

      res.header("Content-Type", "application/xml");
      res.send(sitemap);
    } catch (error) {
      next(error);
    }
  });

  app.get("/robots.txt", (req, res) => {
    const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://port444.shop/sitemap.xml`;

    res.header("Content-Type", "text/plain");
    res.send(robotsTxt);
  });
}
