// もしも EasyLink から取り出した素材で組む、雪と猫の世界観に合う自前カード。
//
// 設計:
//   - 商品画像を主役として大きく見せる(正方形エリアに object-contain)。
//   - その下に一言 note(主役テキスト)、Amazon/楽天 の2ボタン。
//   - 正式商品名は最下部に小さく添える程度。
//   - 末尾にアフィリエイト開示表記(ステマ規制対応)。
//
// 配置は呼び出し側(動画ページ)が制御する:
//   PC では縦動画の右、スマホでは動画のすぐ下に来るよう 2カラム/縦積みを切替える。
//
// EasyLink を持たない/パースできない商品では何も描画しない(セクション側で除外済み)。

import type { Product } from "@/lib/products";
import { parseEasyLink } from "@/lib/easylink";
import { renderNote } from "@/lib/note";

export default function ProductHeroCard({ product }: { product: Product }) {
  const data = product.easyLinkHtml ? parseEasyLink(product.easyLinkHtml) : null;
  if (!data) return null;

  return (
    <article className="overflow-hidden rounded-2xl border border-line bg-bg">
      {/* 商品画像: 主役。正方形エリアいっぱいに大きく見せる。 */}
      {data.imageUrl ? (
        <div className="flex aspect-square items-center justify-center bg-[#fafafa] p-4">
          {/* Amazon配信の素材画像。既存方針に合わせ next/image を使わず素の img(遅延読み込み)。 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.imageUrl}
            alt={data.name || "商品画像"}
            loading="lazy"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      ) : null}

      <div className="p-4">
        {/* 一言note: 商品名より目立たせる主役テキスト。 */}
        {product.note ? (
          <p className="text-sm leading-relaxed text-ink/85">
            {renderNote(product.note)}
          </p>
        ) : null}

        {/* Amazon / 楽天 ボタン。該当URLがある分だけ。フル幅で押しやすく。 */}
        {(data.amazonUrl || data.rakutenUrl) && (
          <div className="mt-4 flex flex-col gap-2">
            {data.amazonUrl ? (
              <a
                href={data.amazonUrl}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="flex w-full items-center justify-center rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-snow"
              >
                Amazonで見る
              </a>
            ) : null}
            {data.rakutenUrl ? (
              <a
                href={data.rakutenUrl}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="flex w-full items-center justify-center rounded-full border border-line px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-snow"
              >
                楽天で見る
              </a>
            ) : null}
          </div>
        )}

        {/* 正式商品名: 小さく添える程度。 */}
        {data.name ? (
          <p className="mt-3 text-[11px] leading-snug text-sub">{data.name}</p>
        ) : null}

        {/* アフィリエイト開示表記(ステマ規制対応・必須)。 */}
        <p className="mt-2 text-[11px] leading-relaxed text-sub">
          ※ Amazon・楽天のアフィリエイトリンクです
        </p>
      </div>
    </article>
  );
}
