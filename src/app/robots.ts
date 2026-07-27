import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl();
  const allowAll = {
    allow: "/",
    disallow: ["/api/", "/school", "/t/"],
  };

  return {
    rules: [
      { userAgent: "*", ...allowAll },
      { userAgent: "Googlebot", ...allowAll },
      { userAgent: "Google-Extended", ...allowAll },
      { userAgent: "Bingbot", ...allowAll },
      { userAgent: "GPTBot", ...allowAll },
      { userAgent: "ChatGPT-User", ...allowAll },
      { userAgent: "OAI-SearchBot", ...allowAll },
      { userAgent: "ClaudeBot", ...allowAll },
      { userAgent: "Claude-Web", ...allowAll },
      { userAgent: "anthropic-ai", ...allowAll },
      { userAgent: "PerplexityBot", ...allowAll },
      { userAgent: "Perplexity-User", ...allowAll },
      { userAgent: "CCBot", ...allowAll },
      { userAgent: "Applebot", ...allowAll },
      { userAgent: "Applebot-Extended", ...allowAll },
    ],
    sitemap: `${site}/sitemap.xml`,
    host: site,
  };
}
