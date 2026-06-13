// トップページ(Server Component)
// YouTube からデータをサーバー側で直接取得し、5つの行を並べる。
// fetch 側で1時間ISRキャッシュ。

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoRow from "@/components/VideoRow";
import { getAllRows } from "@/lib/youtube";
import { SITE } from "@/lib/config";

// ページ全体も1時間ごとに再生成
export const revalidate = 3600;

export default async function Home() {
  const rows = await getAllRows();
  const hasAnyVideo = rows.some((row) => row.videos.length > 0);

  // 動画の構造化データ(SEO: 動画リッチカード)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: SITE.name,
    itemListElement: rows
      .flatMap((row) => row.videos)
      .slice(0, 30)
      .map((video, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `https://www.youtube.com/watch?v=${video.id}`,
        name: video.title,
      })),
  };

  return (
    <>
      <Header />

      <main className="flex-1 py-6">
        {hasAnyVideo ? (
          rows.map((row) => (
            <VideoRow
              key={row.key}
              title={row.title}
              videos={row.videos}
              highlight={row.key === "new"}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

// APIキー未設定・取得失敗時の案内(白基調のまま静かに表示)
function EmptyState() {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <p className="text-sm text-sub">
        動画を読み込めませんでした。
        <br />
        環境変数(YOUTUBE_API_KEY)を設定すると、
        <br />
        ここに「雪と猫」の動画が並びます。
      </p>
    </div>
  );
}
