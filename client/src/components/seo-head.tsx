import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  keywords?: string;
  canonicalUrl?: string;
}

export function SEOHead({
  title,
  description,
  ogImage = "/og-image.png",
  ogType = "website",
  keywords,
  canonicalUrl,
}: SEOHeadProps) {
  useEffect(() => {
    // Set page title
    document.title = title;

    // Remove existing meta tags we'll be replacing
    const existingMetas = document.querySelectorAll('meta[data-seo="true"]');
    existingMetas.forEach((meta) => meta.remove());

    // Create and append new meta tags
    const metas = [
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: ogType },
      { property: "og:image", content: `https://port444.shop${ogImage}` },
      { property: "og:site_name", content: "port444" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: `https://port444.shop${ogImage}` },
    ];

    if (keywords) {
      metas.push({ name: "keywords", content: keywords });
    }

    if (canonicalUrl) {
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = canonicalUrl;
      link.setAttribute("data-seo", "true");
      document.head.appendChild(link);
    }

    metas.forEach((meta) => {
      const metaEl = document.createElement("meta");
      if ("name" in meta && meta.name) {
        metaEl.setAttribute("name", meta.name);
      } else if ("property" in meta && meta.property) {
        metaEl.setAttribute("property", meta.property);
      }
      metaEl.setAttribute("content", meta.content);
      metaEl.setAttribute("data-seo", "true");
      document.head.appendChild(metaEl);
    });

    return () => {
      const seoMetas = document.querySelectorAll('[data-seo="true"]');
      seoMetas.forEach((meta) => meta.remove());
    };
  }, [title, description, ogImage, ogType, keywords, canonicalUrl]);

  return null;
}
