// カテゴリー別の全動画一覧ページ(/category/[slug])。
//
// トップの「すべて見る →」の遷移先。そのカテゴリーの全動画を 1グリッドで表示する
// (ページング無し=サイト規模が小さく、全リンクをHTML出力できてSEO/クロール性が良い)。
// カードは VideoCard を流用しトップと完全に同じ見た目・挙動。
//
// slug:
//   - "popular" : 全動画を再生数降順
//   - "new"     : 全アップロードを新しい順
//   - ROWS のキー(cat-daily 等): その playlist の全動画
//
// 既存の /video/[id] フルページ・モーダル・JSON-LD・meta には一切影響しない(追加のみ)。

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VideoGrid from "@/components/VideoGrid";
import { getCategoryVideos } from "@/lib/youtube";
import { ROWS, SITE } from "@/lib/config";

// 動画一覧の取得と同じ1時間ISR。
export const revalidate = 3600;

type Params = { params: Promise<{ slug: string }> };

/** slug → 表示名。未知の slug は null(=404)。 */
function categoryTitle(slug: string): string | null {
  if (slug === "popular") return "人気の動画";
  return ROWS.find((r) => r.key === slug)?.title ?? null;
}

/** ビルド時に全カテゴリーを静的化(人気 + 既存の全行)。 */
export function generateStaticParams() {
  return [{ slug: "popular" }, ...ROWS.map((r) => ({ slug: r.key }))];
}

export async function generateMetadata({
  params,
}: Params): Promise<Metadata> {
  const { slug } = await params;
  const title = categoryTitle(slug);
  if (!title) return {};
  const description = `「${title}」の動画一覧。${SITE.name} —— ${SITE.description}`;
  const url = `${SITE.url}/category/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: `/category/${slug}` },
    openGraph: {
      type: "website",
      title: `${title} | ${SITE.name}`,
      description,
      url,
      locale: "ja_JP",
    },
  };
}

export default async function CategoryPage({ params }: Params) {
  const { slug } = await params;
  const title = categoryTitle(slug);
  if (!title) notFound();

  const videos = await getCategoryVideos(slug);

  return (
    <>
      <Header />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <h1 className="text-xl font-bold tracking-tight text-ink sm:text-2xl">
            {title}
          </h1>
          {videos.length > 0 ? (
            <p className="mt-1 text-sm text-sub">{videos.length}本の動画</p>
          ) : null}

          {videos.length > 0 ? (
            <div className="mt-6">
              <VideoGrid videos={videos} />
            </div>
          ) : (
            <p className="mt-10 text-sm text-sub">
              動画を読み込めませんでした。時間をおいて再度お試しください。
            </p>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
