"use client";

// モーダル内の「この動画のアイテム」表示(浮くボタン → 日記型カードのスライドイン)。
//
// 既存の Modal.tsx には一切触れない方針:
//   開閉は本コンポーネント内の useState(open) だけで完結する。
//   router も document.body のスタイルも触らないため、Modal が担う
//   スクロール位置保持・背景ロック・4経路の閉じ方には一切干渉しない。
//
// 表示条件: 商品が1件以上あるときだけ親(VideoModalBody)から差し込まれる。
//   商品ゼロの動画ではそもそも DOM に出ない(ここでも空配列なら null を返す二重防御)。
//
// 構造:
//   ・浮くボタン … プレイヤー右下(absolute)。pill形・白基調・ごく控えめにフワフワ。
//   ・日記型カード … 画面下からスライドインするボトムシート(fixed)。
//        モーダルカードと同じ max-w-lg 中央で、視覚的にモーダル内へ納まる。
//
// 物語として見せる: 写真(16:9)を主役に、note を serif 寄りの本文として読ませ、
// リンクは「Amazonで見てみる →」のテキストリンク調。価格は出さない(Amazon規約)。
// 外部リンクは sponsored 必須(Google指定)+ noopener noreferrer。末尾に開示表記。

import { useState } from "react";
import type { Product } from "@/lib/products";

export default function VideoModalProducts({
  products,
}: {
  products: Product[];
}) {
  const [open, setOpen] = useState(false);

  // 二重防御: 万一空で呼ばれても何も出さない(フックの後で early return)。
  if (!products || products.length === 0) return null;

  return (
    <>
      {/* 浮くボタン: プレイヤー右下の端。親が relative なのでここに固定される。 */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="animate-float-soft absolute bottom-3 right-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-line bg-bg/90 py-2 pl-3 pr-3.5 text-xs font-medium text-ink shadow-md backdrop-blur transition-colors hover:bg-snow"
      >
        {/* bag(買い物袋)系アイコン */}
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
      </button>

      {/* 日記型カード(ボトムシート)。open に応じて下からスライドイン/アウト。
          DOM には常駐させ、translate と opacity でアニメーション(マウント揺れ防止)。 */}
      <div
        className={`fixed inset-x-0 bottom-0 z-[60] flex justify-center transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div
          role="dialog"
          aria-label="この動画のアイテム"
          className={`mx-auto max-h-[80vh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-t-2xl border border-line bg-bg p-5 shadow-2xl transition-transform duration-300 ease-out ${
            open ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* ヘッダ: 小見出し + 閉じる(∨) */}
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium tracking-wide text-sub">
              この動画のアイテム
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="閉じる"
              className="flex h-8 w-8 items-center justify-center rounded-full text-sub transition-colors hover:bg-snow hover:text-ink"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* 商品ごとに日記ブロックを縦に重ねる。 */}
          <div className="space-y-7">
            {products.map((product, i) => (
              <article key={`${product.name}-${i}`}>
                {/* 写真(あれば主役・16:9)。無ければブロックごと省略して崩れない。 */}
                {product.image ? (
                  <div className="aspect-video w-full overflow-hidden rounded-xl bg-snow">
                    {/* 自前写真。VideoCard と同じく素の img(遅延読み込み)。 */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : null}

                <h3 className="mt-3 text-sm font-medium leading-snug text-ink">
                  {product.name}
                </h3>

                {/* note を本文として大きめ・serif 寄りで読ませる。 */}
                {product.note ? (
                  <p className="font-serif-jp mt-2 text-[15px] leading-loose text-ink/85">
                    {product.note}
                  </p>
                ) : null}

                {/* リンク: テキストリンク調。該当URLがある分だけ。 */}
                {(product.amazonUrl || product.rakutenUrl) && (
                  <div className="mt-3 flex flex-col gap-1.5">
                    {product.amazonUrl ? (
                      <a
                        href={product.amazonUrl}
                        target="_blank"
                        rel="sponsored noopener noreferrer"
                        className="inline-flex w-fit items-center text-sm text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
                      >
                        Amazonで見てみる&nbsp;→
                      </a>
                    ) : null}
                    {product.rakutenUrl ? (
                      <a
                        href={product.rakutenUrl}
                        target="_blank"
                        rel="sponsored noopener noreferrer"
                        className="inline-flex w-fit items-center text-sm text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink"
                      >
                        楽天で見てみる&nbsp;→
                      </a>
                    ) : null}
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* アフィリエイト開示表記(ステマ規制対応・必須)。 */}
          <p className="mt-6 text-xs leading-relaxed text-sub">
            ※ Amazonアソシエイト等のリンクを含みます
          </p>
        </div>
      </div>
    </>
  );
}
