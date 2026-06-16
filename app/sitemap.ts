import type { MetadataRoute } from "next";
import { SITE } from "@/lib/config";
import { getAllRows } from "@/lib/youtube";

// 1時間ごとに再生成(動画一覧の取得と同じキャッシュ方針)
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 固定ページ
  const staticEntries: MetadataRoute.Sitemap = [
    { url: SITE.url, changeFrequency: "daily", priority: 1 },
    { url: `${SITE.url}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE.url}/privacy`, changeFrequency: "yearly", priority: 0.3 },
  ];

  // 全行から動画IDを集約(重複除去)。API未設定・失敗時は空になり固定ページのみ。
  const rows = await getAllRows();
  const seen = new Set<string>();
  const videoEntries: MetadataRoute.Sitemap = [];
  for (const row of rows) {
    for (const video of row.videos) {
      if (!video.id || seen.has(video.id)) continue;
      seen.add(video.id);
      videoEntries.push({
        url: `${SITE.url}/video/${video.id}`,
        lastModified: video.publishedAt || undefined,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return [...staticEntries, ...videoEntries];
}
