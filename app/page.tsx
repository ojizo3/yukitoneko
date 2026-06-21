// トップページ(Server Component)
// YouTube からデータをサーバー側で直接取得し、5つの行を並べる。
// fetch 側で1時間ISRキャッシュ。

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoRow from "@/components/VideoRow";
import { getAllRows, getPopularVideos } from "@/lib/youtube";
import { SITE } from "@/lib/config";

// ページ全体も1時間ごとに再生成
export const revalidate = 3600;

// トップの「人気の動画」行で出す本数(既存行と同じ横スクロールの見え方に合わせる)
const POPULAR_ROW_COUNT = 15;

export default async function Home() {
  // 既存の行取得は不変。人気行は別データ源(全動画スキャン→再生数降順)で並列取得。
  const [rows, popular] = await Promise.all([
    getAllRows(),
    getPopularVideos(POPULAR_ROW_COUNT),
  ]);
  const hasAnyVideo =
    popular.length > 0 || rows.some((row) => row.videos.length > 0);

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
          <>
            {/* 最上段: 人気の動画(再生数降順)。glow は付けず NEW の個性を温存。 */}
            <VideoRow
              title="人気の動画"
              videos={popular}
              href="/category/popular"
            />
            {rows.map((row) => (
              <VideoRow
                key={row.key}
                title={row.title}
                videos={row.videos}
                highlight={row.key === "new"}
                href={`/category/${row.key}`}
              />
            ))}
          </>
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
