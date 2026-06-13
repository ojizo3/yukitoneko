// 動画専用ページ /video/[id]
// YouTube iframe で埋め込み再生し、タイトル・再生数・投稿日・説明文を表示する。
// 後で SEO 用(構造化データ・OGP個別画像など)に拡張予定。

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getVideo } from "@/lib/youtube";
import { formatViews, formatPublished } from "@/lib/format";
import { SITE } from "@/lib/config";

// 1時間ごとに再生成(一覧と同じキャッシュ方針)
export const revalidate = 3600;

type Params = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const video = await getVideo(id);
  if (!video) return { title: "動画が見つかりません" };
  const desc = video.description?.slice(0, 120) || SITE.description;
  return {
    title: video.title,
    description: desc,
    alternates: { canonical: `/video/${id}` },
    openGraph: {
      type: "video.other",
      title: video.title,
      description: desc,
      url: `${SITE.url}/video/${id}`,
      images: video.thumbnail ? [video.thumbnail] : undefined,
    },
  };
}

export default async function VideoPage({ params }: Params) {
  const { id } = await params;
  const video = await getVideo(id);
  if (!video) notFound();

  const meta = [formatViews(video.viewCount), formatPublished(video.publishedAt)]
    .filter(Boolean)
    .join(" ・ ");

  const src =
    `https://www.youtube.com/embed/${video.id}` +
    `?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 sm:px-6">
        {/* ← 一覧に戻る */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-sub transition-colors hover:text-ink"
        >
          <span aria-hidden>←</span> 一覧に戻る
        </Link>

        {/* 縦動画(9:16)プレーヤー。横長動画は YouTube 側で自動レターボックス。 */}
        <div className="mx-auto mt-4 aspect-[9/16] w-full max-w-[420px] overflow-hidden rounded-xl bg-black shadow-lg">
          <iframe
            className="h-full w-full"
            src={src}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* タイトル・メタ */}
        <h1 className="mt-5 text-lg font-bold leading-snug text-ink sm:text-xl">
          {video.title}
        </h1>
        {meta && <p className="mt-1 text-sm text-sub">{meta}</p>}

        {/* 説明文 */}
        {video.description ? (
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
            {video.description}
          </p>
        ) : null}

        {/* 構造化データ(VideoObject) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              name: video.title,
              description: video.description || SITE.description,
              thumbnailUrl: video.thumbnail || undefined,
              uploadDate: video.publishedAt || undefined,
              contentUrl: `https://www.youtube.com/watch?v=${video.id}`,
              embedUrl: `https://www.youtube.com/embed/${video.id}`,
            }),
          }}
        />
      </main>

      <Footer />
    </>
  );
}
