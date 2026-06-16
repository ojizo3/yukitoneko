// 動画専用ページ /video/[id]
// YouTube iframe で埋め込み再生し、タイトル・再生数・投稿日・説明文・関連動画を表示する。
// SEO: ページ単位の generateMetadata(canonical/OGP/Twitter) と VideoObject(JSON-LD)。

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoCard from "@/components/VideoCard";
import { getVideo, getRelatedVideos } from "@/lib/youtube";
import { getDescription } from "@/lib/descriptions";
import { formatViews, formatPublished } from "@/lib/format";
import { SITE } from "@/lib/config";

// 1時間ごとに再生成(一覧と同じキャッシュ方針)
export const revalidate = 3600;

type Params = { params: Promise<{ id: string }> };

// タイトルは「{動画タイトル}｜雪と猫」。全体で60字以内に収める。
const TITLE_SUFFIX = `｜${SITE.name}`;
function buildTitle(raw: string): string {
  const max = 60 - TITLE_SUFFIX.length;
  const base = raw.length > max ? `${raw.slice(0, max - 1)}…` : raw;
  return `${base}${TITLE_SUFFIX}`;
}

// メタ用の説明文(独自解説 > YouTube description > サイト説明)を120字に整える。
function metaDescription(id: string, ytDescription?: string): string {
  const text = getDescription(id, ytDescription) || SITE.description;
  const oneLine = text.replace(/\s+/g, " ").trim();
  return oneLine.length > 120 ? `${oneLine.slice(0, 119)}…` : oneLine;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const video = await getVideo(id);
  if (!video) return { title: "動画が見つかりません" };

  const title = buildTitle(video.title);
  const desc = metaDescription(id, video.description);
  const url = `${SITE.url}/video/${id}`;
  const images = video.thumbnail ? [video.thumbnail] : undefined;

  return {
    title: { absolute: title },
    description: desc,
    alternates: { canonical: `/video/${id}` },
    openGraph: {
      type: "video.other",
      title,
      description: desc,
      url,
      images,
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images,
    },
  };
}

export default async function VideoPage({ params }: Params) {
  const { id } = await params;
  const [video, related] = await Promise.all([
    getVideo(id),
    getRelatedVideos(id),
  ]);
  if (!video) notFound();

  // 表示する説明文: 独自解説があれば優先、なければ YouTube の description。
  const description = getDescription(video.id, video.description);

  const meta = [formatViews(video.viewCount), formatPublished(video.publishedAt)]
    .filter(Boolean)
    .join(" ・ ");

  const src =
    `https://www.youtube.com/embed/${video.id}` +
    `?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  // 構造化データ用の説明文(本文と同じ。空ならサイト説明で補完)
  const jsonLdDescription = description || SITE.description;

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

        {/* 説明文(独自解説 or YouTube description) */}
        {description ? (
          <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
            {description}
          </p>
        ) : null}

        {/* 関連動画(同じ再生リストから数本) */}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="text-base font-bold text-ink">関連動画</h2>
            <div className="mt-3 grid grid-cols-3 gap-3 sm:gap-4">
              {related.map((v) => (
                <VideoCard key={v.id} video={v} />
              ))}
            </div>
          </section>
        )}

        {/* 構造化データ(VideoObject) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "VideoObject",
              name: video.title,
              description: jsonLdDescription,
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
