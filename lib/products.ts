// 動画ごとの「この動画で使ったもの」= アフィリエイト商品の定義。
//
// 思想は lib/descriptions.ts と同じ。動画ID(/video/[id] の id)をキーにして
// 商品配列を書いておくと、その動画ページの解説文の下に商品カードが並ぶ。
// 登録の無い動画では何も表示されない(既存の見た目に一切影響しない)。
//
// 商品の指定方法は2通り(同じ Product 型):
//   (A) 自前カード … name/image/amazonUrl/rakutenUrl/note を直接書く(従来方式)
//   (B) EasyLink カード … easyLinkHtml に もしも EasyLink コード全文を貼る。
//       画像・商品名・Amazon/楽天リンクはコードから自動抽出して
//       「主役カード」(ProductHeroCard)として動画の右/下に大きく表示する。
//       note を書くと主役テキストとして併せて表示される。
//
// 使い方:
//   1. 動画ページURL末尾の動画ID(例: /video/AbCdEf12345 の "AbCdEf12345")をキーに
//   2. 値に商品オブジェクトの配列を書く(1件でも複数でも可)
//   3. 保存して push すれば、その動画ページに反映される
//
// 記入サンプル(A: 自前カード):
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
  /**
   * もしもアフィリエイト「かんたんリンク」(EasyLink)のコード全文。任意。
   * これが指定されている商品は、コードから画像・商品名・Amazon/楽天リンクを抽出し、
   * 上記 image/amazonUrl/rakutenUrl の代わりに「主役カード」(ProductHeroCard)で描画する。
   * もしも管理画面でコピーした HTML を丸ごと貼る。note は主役テキストとして併用可。
   */
  easyLinkHtml?: string;
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
  // 【B案 EasyLink 試作・引き戸DIY 1位】もしも EasyLink から素材を抽出して主役カード化。
  // ※ EasyLink コード内の Amazon URL が [..](..) に化けているため、parseEasyLink が自動修復する。
  "-3sp1Gvn94w": [
    {
      name: "ストロング掛金(EasyLink試作・表示名はコードのnを使用)",
      note: "この金具がやっぱり、一番使いやすいです。昔のアパートとかトイレの鍵みたいなところで見かけたようなものですが、色も豊富で安くシンプル。回す方のパーツは使わないので、動画をよく見て使ってくださいね。",
      easyLinkHtml: `<!-- START MoshimoAffiliateEasyLink --><script type="text/javascript">(function(b,c,f,g,a,d,e){b.MoshimoAffiliateObject=a;b[a]=b[a]||function(){arguments.currentScript=c.currentScript||c.scripts[c.scripts.length-2];(b[a].q=b[a].q||[]).push(arguments)};c.getElementById(a)||(d=c.createElement(f),d.src=g,d.id=a,e=c.getElementsByTagName("body")[0],e.appendChild(d))})(window,document,"script","//dn.msmstatic.com/site/cardlink/bundle.js?20220329","msmaflink");msmaflink({"n":"ストロング金属(Strong Kinzoku) 清水 ストロング掛金 ステン ポリ袋入 60mm","b":"ストロング金属(Strong Kinzoku)","t":"tr-3801888","d":"https://m.media-amazon.com","c_p":"/images/I","p":["/41jsjnTgqCL._SL500_.jpg","/31JpfbyOnPL._SL500_.jpg","/51gw7Q7TwBL._SL500_.jpg","/41baSDIt60L._SL500_.jpg","/51DWGumr6QL._SL500_.jpg","/218DFIwjdnL._SL500_.jpg","/31-JQ1V8OFL._SL500_.jpg","/41VjetIcDPL._SL500_.jpg"],"u":{"u":"https://[www.amazon.co.jp/dp/B007R9FVBA](https://www.amazon.co.jp/dp/B007R9FVBA)","t":"amazon","r_v":""},"v":"2.1","b_l":[{"id":1,"u_tx":"Amazonで見る","u_bc":"#f79256","u_url":"https://[www.amazon.co.jp/dp/B007R9FVBA](https://www.amazon.co.jp/dp/B007R9FVBA)","a_id":3409706,"p_id":170,"pl_id":27060,"pc_id":185,"s_n":"amazon","u_so":1},{"id":2,"u_tx":"楽天市場で見る","u_bc":"#f76956","u_url":"https://search.rakuten.co.jp/search/mall/%E3%82%B9%E3%83%88%E3%83%AD%E3%83%B3%E3%82%B0%E6%8E%9B%E9%87%91/","a_id":3409708,"p_id":54,"pl_id":27059,"pc_id":54,"s_n":"rakuten","u_so":2}],"eid":"uQ7Rc","s":"s"});</script><div id="msmaflink-uQ7Rc">リンク</div><!-- MoshimoAffiliateEasyLink END -->`,
    },
  ],
  "k9IrGLQp3fs": [
    {
      name: "インパクトドライバー",
      amazonUrl: "https://amzn.to/3SC631E",
      note: "動画で使っているのはこのインパクトドライバーです。パワーの面とコスパの面でコレを選びましたが、女性が片手で持つには重たいかもしれないので、その場合は[コレ](https://amzn.to/4ekh4xb)がおすすめです。",
    },
  ],
  "TvQXZ44YfJU": [
    {
      name: "L字金具",
      amazonUrl: "https://amzn.to/4vmw57A",
      note: "ここで使うL字金具はコレがいい。たくさん買っても、DIYで棚を作るときなどに流用できるから、私はストックしています。鍵穴として使う時には、少しコツが必要で、穴を少し大きく拡張する必要があるんです。私は、アイスの棒を鍵として使いたかったので、アイスの棒が入る大きさに穴を広げました。やり方は、鉄ヤスリを使うと簡単ですよ。何本かカタチの違う棒状のヤスリがセットになったりして、ホームセンターなどに売っています。",
    },
    {
      name: "棒ヤスリ セット",
      amazonUrl: "https://amzn.to/4vVA4YI",
      note: "上のL字金具の穴を広げるのに使う鉄ヤスリ。カタチの違う棒状のヤスリがセットになっていて便利です。",
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
