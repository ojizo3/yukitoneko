import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE.url,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE.url}/about`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
