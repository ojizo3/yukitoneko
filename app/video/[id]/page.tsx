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
import { getProducts } from "@/lib/products";
import ProductRecommend from "@/components/ProductRecommend";
import ProductHeroCard from "@/components/ProductHeroCard";
import { renderNote } from "@/lib/note";
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

  // 商品: EasyLink を持つものは「主役カード」として動画の右/下に出す。
  // それ以外(従来の自前カード)は解説文の下のセクションに出す。
  const products = getProducts(id);
  const heroProducts = products.filter((p) => p.easyLinkHtml);
  const restProducts = products.filter((p) => !p.easyLinkHtml);

  // 縦動画(9:16)プレーヤー本体。配置(中央寄せ or 2カラム左)は下で出し分ける。
  const player = (
    <iframe
      className="h-full w-full"
      src={src}
      title={video.title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    />
  );

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

        {/* 動画 + 商品の主役カード。
            PC(lg〜): 縦動画=左 / 商品カード=右 の2カラムで、スクロールせず同時に見える。
            スマホ: 縦積みで動画のすぐ下にカード。
            商品が無い動画では従来どおり中央寄せの動画のみ(見た目は不変)。 */}
        {heroProducts.length > 0 ? (
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-6">
            <div className="relative mx-auto aspect-[9/16] w-full max-w-[420px] shrink-0 overflow-hidden rounded-xl bg-black shadow-lg lg:mx-0 lg:w-[380px]">
              {player}

              {/* スマホ専用: 動画隅にフワフワ浮くボタン。タップで下の商品カードへスムーズスクロール。
                  PCは右にカードが見えているので非表示(lg:hidden)。モーダルの float-soft 思想を流用。 */}
              <a
                href="#video-items"
                className="animate-float-soft absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-[#E8D98A] bg-[#FFF9C6] py-2 pl-3 pr-3.5 text-xs font-medium text-[#1a1a1a] shadow-md transition-colors hover:bg-[#FFF4A8] lg:hidden"
              >
                {/* 買い物袋アイコン */}
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                  className="shrink-0"
                >
                  <path
                    d="M6 8h12l-.8 11.2a2 2 0 0 1-2 1.8H8.8a2 2 0 0 1-2-1.8L6 8Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 8V6.5a3 3 0 0 1 6 0V8"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
                この動画のアイテム
              </a>
            </div>
            <div
              id="video-items"
              className="flex scroll-mt-20 flex-col gap-4 lg:min-w-0 lg:flex-1"
            >
              {heroProducts.map((product, i) => (
                <ProductHeroCard key={`hero-${i}`} product={product} />
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto mt-4 aspect-[9/16] w-full max-w-[420px] overflow-hidden rounded-xl bg-black shadow-lg">
            {player}
          </div>
        )}

        {/* タイトル・メタ */}
        <h1 className="mt-6 text-lg font-bold leading-snug text-ink sm:text-xl">
          {video.title}
        </h1>
        {meta && <p className="mt-1 text-sm text-sub">{meta}</p>}

        {/* 詳細解説(独自解説 or YouTube description)。初期は閉じたアコーディオン。
            展開後も解説文中の [ラベル](動画ID) は内部リンクとして機能する(renderNote)。 */}
        {description ? (
          <details className="group mt-5 rounded-xl border border-line px-4 py-3">
            <summary className="flex cursor-pointer select-none list-none items-center justify-between text-sm font-medium text-ink [&::-webkit-details-marker]:hidden">
              <span>詳細解説</span>
              <span
                aria-hidden
                className="text-sub transition-transform duration-200 group-open:rotate-180"
              >
                ▾
              </span>
            </summary>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
              {renderNote(description)}
            </p>
          </details>
        ) : null}

        {/* この動画で使ったもの(従来の自前カード)。該当が無ければ何も出ない。
            EasyLink の主役カードは上の2カラムで表示済み。 */}
        <ProductRecommend products={restProducts} />

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
