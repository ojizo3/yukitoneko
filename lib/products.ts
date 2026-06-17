// 動画ごとの「この動画で使ったもの」= アフィリエイト商品の定義。
//
// 思想は lib/descriptions.ts と同じ。動画ID(/video/[id] の id)をキーにして
// 商品配列を書いておくと、その動画ページの解説文の下に商品カードが並ぶ。
// 登録の無い動画では何も表示されない(既存の見た目に一切影響しない)。
//
// 使い方:
//   1. 動画ページURL末尾の動画ID(例: /video/AbCdEf12345 の "AbCdEf12345")をキーに
//   2. 値に商品オブジェクトの配列を書く(1件でも複数でも可)
//   3. 保存して push すれば、その動画ページに反映される
//
// 記入サンプル(1件):
//   export const PRODUCTS: Record<string, Product[]> = {
//     "AbCdEf12345": [
//       {
//         name: "ねこ用 こたつ S",
//         image: "/products/neko-kotatsu.jpg", // public/products/ に置いた自前写真
//         amazonUrl: "https://www.amazon.co.jp/dp/XXXX?tag=yourtag-22",
//         rakutenUrl: "https://item.rakuten.co.jp/shop/xxxx/",
//         note: "トラジのお気に入り。雪の日はここから出てきません。",
//       },
//     ],
//   };

/** 紹介する商品1件ぶんの定義 */
export interface Product {
  /** 商品名(必須) */
  name: string;
  /**
   * サイト内に置く自前写真のパス(例: "/products/xxx.jpg")。
   * public/products/ に画像を置いてそのパスを書く。未指定でも画像なしカードで崩れない。
   */
  image?: string;
  /** Amazon アフィリエイトリンクの完全URL(タグ込み)。任意。 */
  amazonUrl?: string;
  /** 楽天アフィリエイトリンクの完全URL(タグ込み)。任意。 */
  rakutenUrl?: string;
  /** 商品への一言(任意)。 */
  note?: string;
}

/** 動画ID → 商品配列。最初は空。ここに追記していく。 */
export const PRODUCTS: Record<string, Product[]> = {
  // ここに videoId: [ { name: "...", ... } ] を追記してください。
  "TaBLhrXpS_k": [
    {
      name: "ニシキヘビのぬいぐるみ",
      amazonUrl: "https://amzn.to/4fPAxHh",
      note: "北海道旅行の際に水族館で購入したものです。すっかり買った本人は大きく成長してしまい、代わりに猫のトラジがお気に入りで使っています。",
    },
  ],
};

/**
 * 動画IDに対応する商品配列を取得する。
 * 登録が無ければ空配列を返す(呼び出し側は何も描画しない)。
 */
export function getProducts(videoId: string): Product[] {
  return PRODUCTS[videoId] ?? [];
}
