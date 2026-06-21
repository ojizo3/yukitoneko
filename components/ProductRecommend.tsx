// 「この動画で使ったもの」= アフィリエイト商品カード一覧。
//
// 動画ページ(app/video/[id]/page.tsx)の解説文の下に置く。商品が無ければ
// 何も描画しないので、未登録の動画では既存表示に一切影響しない。
//
// デザインは既存のミニマル白基調(細いボーダー border-line・余白広め・モノトーン)に合わせる。
// スマホでは縦1列、画面が広がると2列。価格は表示しない(Amazon規約)。
// 外部リンクは sponsored 必須(Google指定)+ rel に noopener noreferrer。
// セクション末尾にアフィリエイト開示表記(日本のステマ規制対応)を必ず出す。

import type { Product } from "@/lib/products";
import { renderNote } from "@/lib/note";

export default function ProductRecommend({
  products,
}: {
  products: Product[];
}) {
  // 商品が無ければ何も描画しない
  if (!products || products.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-base font-bold text-ink">この動画で使ったもの</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {products.map((product, i) => (
          <article
            key={`${product.name}-${i}`}
            className="flex gap-4 rounded-xl border border-line p-4"
          >
            {/* 画像: あれば表示、なければ列ごと省略してテキストを広く使う */}
            {product.image ? (
              <div className="aspect-square w-24 shrink-0 overflow-hidden rounded-lg bg-snow">
                {/* 自前写真。VideoCard と同じく next/image を使わず素の img(遅延読み込み) */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}

            {/* 商品名・一言・ボタン */}
            <div className="flex min-w-0 flex-1 flex-col">
              <h3 className="text-sm font-medium leading-snug text-ink">
                {product.name}
              </h3>
              {product.note ? (
                <p className="mt-1 text-xs leading-relaxed text-sub">
                  {renderNote(product.note)}
                </p>
              ) : null}

              {/* 該当URLがあるボタンだけ出す */}
              {(product.amazonUrl || product.rakutenUrl) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.amazonUrl ? (
                    <a
                      href={product.amazonUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="inline-flex items-center rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-snow"
                    >
                      Amazonで見る
                    </a>
                  ) : null}
                  {product.rakutenUrl ? (
                    <a
                      href={product.rakutenUrl}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      className="inline-flex items-center rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-snow"
                    >
                      楽天で見る
                    </a>
                  ) : null}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {/* アフィリエイト開示表記(ステマ規制対応・必須) */}
      <p className="mt-4 text-xs leading-relaxed text-sub">
        ※ 本ページはアフィリエイト広告(Amazon・楽天等)を利用しています
      </p>
    </section>
  );
}
