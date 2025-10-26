import type { Builder, Service } from "@shared/schema";

export function generateBuilderSchema(builder: Builder) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": builder.name,
    "description": builder.bio,
    "image": builder.profileImage || undefined,
    "url": `https://port444.shop/builders/${builder.id}`,
    "jobTitle": builder.headline,
    "sameAs": [
      builder.twitterHandle ? `https://twitter.com/${builder.twitterHandle}` : null,
      builder.githubProfile || null,
      builder.linkedinProfile || null,
      builder.websiteUrl || null,
    ].filter(Boolean),
    "aggregateRating": builder.reviewCount > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": builder.rating,
      "reviewCount": builder.reviewCount,
      "bestRating": "5",
      "worstRating": "1",
    } : undefined,
    "knowsAbout": builder.skills || [],
    "workLocation": builder.city && builder.country ? {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": builder.city,
        "addressCountry": builder.country,
      },
    } : undefined,
  };
}

export function generateServiceSchema(service: Service, builder?: Builder | null) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.description,
    "image": service.media?.[0] || undefined,
    "url": `https://port444.shop/services/${service.id}`,
    "category": service.category,
    "provider": builder ? {
      "@type": "Person",
      "name": builder.name,
      "url": `https://port444.shop/builders/${builder.id}`,
    } : undefined,
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": service.basicPrice || service.standardPrice || service.premiumPrice || 0,
      "highPrice": service.premiumPrice || service.standardPrice || service.basicPrice || 0,
      "offerCount": [
        service.basicPrice ? 1 : 0,
        service.standardPrice ? 1 : 0,
        service.premiumPrice ? 1 : 0,
      ].reduce((a, b) => a + b, 0),
    },
    "aggregateRating": builder && builder.reviewCount > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": builder.rating,
      "reviewCount": builder.reviewCount,
    } : undefined,
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "port444",
    "description": "Web3 marketplace connecting premium builders with clients in the memecoin and broader crypto space",
    "url": "https://port444.shop",
    "logo": "https://port444.shop/logo.png",
    "sameAs": [
      "https://twitter.com/port444shop",
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Support",
      "email": "support@port444.shop",
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}
