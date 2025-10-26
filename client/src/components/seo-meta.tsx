import { useEffect } from "react";

export interface SEOMetaProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "profile" | "article";
  twitterCard?: "summary" | "summary_large_image";
  author?: string;
  keywords?: string[];
  schema?: Record<string, any>;
}

export function SEOMeta({
  title,
  description,
  image = "https://port444.shop/og-image.png",
  url,
  type = "website",
  twitterCard = "summary_large_image",
  author,
  keywords = [],
  schema,
}: SEOMetaProps) {
  useEffect(() => {
    const fullTitle = `${title} | port444 - Web3 Marketplace`;
    const fullUrl = url || window.location.href;
    
    document.title = fullTitle;

    const metaTags = [
      { name: "description", content: description },
      { name: "keywords", content: keywords.join(", ") },
      
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:image", content: image },
      { property: "og:url", content: fullUrl },
      { property: "og:type", content: type },
      { property: "og:site_name", content: "port444" },
      
      { name: "twitter:card", content: twitterCard },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ];

    if (author) {
      metaTags.push({ name: "author", content: author });
    }

    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement("meta");
        if (name) element.name = name;
        if (property) element.setAttribute("property", property);
        document.head.appendChild(element);
      }
      
      element.content = content;
    });

    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = fullUrl;

    if (schema) {
      let schemaScript = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (!schemaScript) {
        schemaScript = document.createElement("script");
        schemaScript.type = "application/ld+json";
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    }

    return () => {
      const defaultTitle = "port444 - Web3 Marketplace for Premium Builders";
      document.title = defaultTitle;
    };
  }, [title, description, image, url, type, twitterCard, author, keywords, schema]);

  return null;
}
