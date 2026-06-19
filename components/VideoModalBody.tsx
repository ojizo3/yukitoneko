// モーダル内に出す動画コンテンツ(プレイヤー・タイトル・再生数/公開日・商品)。
//
// 純粋な表示用 Server Component。フルページ(app/video/[id]/page.tsx)と同じ
// 埋め込み方式・同じデータ整形を使うが、SEO要素(JSON-LD・meta・OGP・関連動画)は
// 含めない —— それらはフルページ専用のまま据え置く。
//
// 商品ありの動画では、プレイヤー右下に浮くボタン(VideoModalProducts)を重ねる。
// 商品ゼロなら何も差し込まない(既存表示に一切影響しない)。

import type { Video } from "@/types/video";
import type { Product } from "@/lib/products";
import VideoModalProducts from "@/components/VideoModalProducts";
import { getDescription } from "@/lib/descriptions";
import { formatViews, formatPublished } from "@/lib/format";

export default function VideoModalBody({
  video,
  products,
}: {
  video: Video;
  products: Product[];
}) {
  const description = getDescription(video.id, video.description);

  const meta = [formatViews(video.viewCount), formatPublished(video.publishedAt)]
    .filter(Boolean)
    .join(" ・ ");

  const src =
    `https://www.youtube.com/embed/${video.id}` +
    `?autoplay=1&rel=0&modestbranding=1&playsinline=1`;

  return (
    <div className="p-4 sm:p-5">
      {/* 縦動画(9:16)プレーヤー。横長動画は YouTube 側で自動レターボックス。
          relative ラップは、商品ありのとき右下に浮くボタンを重ねるため。 */}
      <div className="relative mx-auto aspect-[9/16] w-full max-w-[360px]">
        <div className="h-full w-full overflow-hidden rounded-xl bg-black">
          <iframe
            className="h-full w-full"
            src={src}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* この動画のアイテム(アフィリエイト)。商品が無ければ何も出さない。
            浮くボタン+日記型カードの開閉は VideoModalProducts 内で完結し、
            Modal のスクロール保持・閉じ方には一切干渉しない。 */}
        {products.length > 0 && <VideoModalProducts products={products} />}
      </div>

      {/* タイトル・メタ */}
      <h2 className="mt-4 text-base font-bold leading-snug text-ink">
        {video.title}
      </h2>
      {meta && <p className="mt-1 text-sm text-sub">{meta}</p>}

      {/* 説明文(独自解説 or YouTube description) */}
      {description ? (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink/80">
          {description}
        </p>
      ) : null}
    </div>
  );
}
