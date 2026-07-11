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
  "TaBLhrXpS_k": [
    {
      name: "ニシキヘビのぬいぐるみ",
      note: "北海道旅行の際に水族館で購入したもの。すっかり買った本人は大きく成長してしまい、代わりに猫のトラジがお気に入りで使っています。",
      easyLinkHtml: `<!-- START MoshimoAffiliateEasyLink -->
<script type="text/javascript">
(function(b,c,f,g,a,d,e){b.MoshimoAffiliateObject=a;
b[a]=b[a]||function(){arguments.currentScript=c.currentScript
||c.scripts[c.scripts.length-2];(b[a].q=b[a].q||[]).push(arguments)};
c.getElementById(a)||(d=c.createElement(f),d.src=g,
d.id=a,e=c.getElementsByTagName("body")[0],e.appendChild(d))})
(window,document,"script","//dn.msmstatic.com/site/cardlink/bundle.js?20220329","msmaflink");
msmaflink({"n":"SJGEIDMニシキヘビ ぬいぐるみ リアル ヘビ 抱き枕 クッション 置物 約200cm/300cm 人形 可愛い 動物 縫い包み ふわふわ ドール 柔らかい シミュレーションおもちゃ ぬいぐるみ インテリア 店飾り おもちゃ マスコット 装飾品 子供 大人 ギフト プレゼント (3メートル,367 バイパーグリーン)","b":"SJGEIDM","t":"9-2404","d":"https://m.media-amazon.com","c_p":"/images/I","p":["/41dLPdy-+6L._SL500_.jpg","/51szsAkPSVL._SL500_.jpg","/51p6qb0AWqL._SL500_.jpg","/51lmhghZzcL._SL500_.jpg","/41Czm7VYuhL._SL500_.jpg","/51JMRyeXHmL._SL500_.jpg","/41aUrBgBLnL._SL500_.jpg","/51H-xvSq33L._SL500_.jpg","/41AOFWlJLOL._SL500_.jpg"],"u":{"u":"https://www.amazon.co.jp/dp/B0FSD8W3J2","t":"amazon","r_v":""},"v":"2.1","b_l":[{"id":1,"u_tx":"Amazonで見る","u_bc":"#f79256","u_url":"https://www.amazon.co.jp/dp/B0FSD8W3J2","a_id":3409706,"p_id":170,"pl_id":27060,"pc_id":185,"s_n":"amazon","u_so":1},{"id":2,"u_tx":"楽天市場で見る","u_bc":"#f76956","u_url":"https://search.rakuten.co.jp/search/mall/SJGEIDM%E3%83%8B%E3%82%B7%E3%82%AD%E3%83%98%E3%83%93%20%E3%81%AC%E3%81%84%E3%81%90%E3%82%8B%E3%81%BF%20%E3%83%AA%E3%82%A2%E3%83%AB%20%E3%83%98%E3%83%93%20%E6%8A%B1%E3%81%8D%E6%9E%95%20%E3%82%AF%E3%83%83%E3%82%B7%E3%83%A7%E3%83%B3%20%E7%BD%AE%E7%89%A9%20%E7%B4%84200cm%2F300cm%20%E4%BA%BA%E5%BD%A2%20%E5%8F%AF%E6%84%9B%E3%81%84%20%E5%8B%95%E7%89%A9%20%E7%B8%AB%E3%81%84%E5%8C%85%E3%81%BF%20%E3%81%B5%E3%82%8F%E3%81%B5%E3%82%8F%20%E3%83%89%E3%83%BC%E3%83%AB%20%E6%9F%94%E3%82%89%E3%81%8B%E3%81%84%20%E3%82%B7%E3%83%9F%E3%83%A5%E3%83%AC%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%8A%E3%82%82%E3%81%A1%E3%82%83%20%E3%81%AC%E3%81%84%E3%81%90%E3%82%8B%E3%81%BF%20%E3%82%A4%E3%83%B3%E3%83%86%E3%83%AA%E3%82%A2%20%E5%BA%97%E9%A3%BE%E3%82%8A%20%E3%81%8A%E3%82%82%E3%81%A1%E3%82%83%20%E3%83%9E%E3%82%B9%E3%82%B3%E3%83%83%E3%83%88%20%E8%A3%85%E9%A3%BE%E5%93%81%20%E5%AD%90%E4%BE%9B%20%E5%A4%A7%E4%BA%BA%20%E3%82%AE%E3%83%95%E3%83%88%20%E3%83%97%E3%83%AC%E3%82%BC%E3%83%B3%E3%83%88%20(3%E3%83%A1%E3%83%BC%E3%83%88%E3%83%AB%2C367%20%E3%83%90%E3%82%A4%E3%83%91%E3%83%BC%E3%82%B0%E3%83%AA%E3%83%BC%E3%83%B3)/","a_id":3409708,"p_id":54,"pl_id":27059,"pc_id":54,"s_n":"rakuten","u_so":2}],"eid":"deooH","s":"s"});
</script>
<div id="msmaflink-deooH">リンク</div>
<!-- MoshimoAffiliateEasyLink END -->`,
    },
  ],
  "-3sp1Gvn94w": [
    {
      name: "ストロング掛金(EasyLink試作・表示名はコードのnを使用)",
      note: "この金具がやっぱり、一番使いやすいです。昔のアパートとかトイレの鍵みたいなところで見かけたようなものですが、色も豊富で安くシンプル。回す方のパーツは使わないので、動画をよく見て使ってくださいね。",
      easyLinkHtml: `<!-- START MoshimoAffiliateEasyLink --><script type="text/javascript">(function(b,c,f,g,a,d,e){b.MoshimoAffiliateObject=a;b[a]=b[a]||function(){arguments.currentScript=c.currentScript||c.scripts[c.scripts.length-2];(b[a].q=b[a].q||[]).push(arguments)};c.getElementById(a)||(d=c.createElement(f),d.src=g,d.id=a,e=c.getElementsByTagName("body")[0],e.appendChild(d))})(window,document,"script","//dn.msmstatic.com/site/cardlink/bundle.js?20220329","msmaflink");msmaflink({"n":"ストロング金属(Strong Kinzoku) 清水 ストロング掛金 ステン ポリ袋入 60mm","b":"ストロング金属(Strong Kinzoku)","t":"tr-3801888","d":"https://m.media-amazon.com","c_p":"/images/I","p":["/41jsjnTgqCL._SL500_.jpg","/31JpfbyOnPL._SL500_.jpg","/51gw7Q7TwBL._SL500_.jpg","/41baSDIt60L._SL500_.jpg","/51DWGumr6QL._SL500_.jpg","/218DFIwjdnL._SL500_.jpg","/31-JQ1V8OFL._SL500_.jpg","/41VjetIcDPL._SL500_.jpg"],"u":{"u":"https://[www.amazon.co.jp/dp/B007R9FVBA](https://www.amazon.co.jp/dp/B007R9FVBA)","t":"amazon","r_v":""},"v":"2.1","b_l":[{"id":1,"u_tx":"Amazonで見る","u_bc":"#f79256","u_url":"https://[www.amazon.co.jp/dp/B007R9FVBA](https://www.amazon.co.jp/dp/B007R9FVBA)","a_id":3409706,"p_id":170,"pl_id":27060,"pc_id":185,"s_n":"amazon","u_so":1},{"id":2,"u_tx":"楽天市場で見る","u_bc":"#f76956","u_url":"https://search.rakuten.co.jp/search/mall/%E3%82%B9%E3%83%88%E3%83%AD%E3%83%B3%E3%82%B0%E6%8E%9B%E9%87%91/","a_id":3409708,"p_id":54,"pl_id":27059,"pc_id":54,"s_n":"rakuten","u_so":2}],"eid":"uQ7Rc","s":"s"});</script><div id="msmaflink-uQ7Rc">リンク</div><!-- MoshimoAffiliateEasyLink END -->`,
    },
    {
      name: "檜の丸棒",
      note: "鍵の役目をする棒。えんぴつでも代替できます。",
      easyLinkHtml: `<!-- START MoshimoAffiliateEasyLink -->
<script type="text/javascript">
(function(b,c,f,g,a,d,e){b.MoshimoAffiliateObject=a;
b[a]=b[a]||function(){arguments.currentScript=c.currentScript
||c.scripts[c.scripts.length-2];(b[a].q=b[a].q||[]).push(arguments)};
c.getElementById(a)||(d=c.createElement(f),d.src=g,
d.id=a,e=c.getElementsByTagName("body")[0],e.appendChild(d))})
(window,document,"script","//dn.msmstatic.com/site/cardlink/bundle.js?20220329","msmaflink");
msmaflink({"n":"10PCS ケヤキ 欅 丸棒 欅の丸棒 直径Φ8MM 長さ30CM","b":"AZEEKO","t":"BW8-3","d":"https:\/\/m.media-amazon.com","c_p":"\/images\/I","p":["\/41PmVPVPfZL._SL500_.jpg","\/51Gewja6DFL._SL500_.jpg","\/41h1UMxGfDL._SL500_.jpg","\/41AfVMuXxGL._SL500_.jpg","\/41oFKDycgiL._SL500_.jpg"],"u":{"u":"https:\/\/[www.amazon.co.jp\/dp\/B07PPLX81X](https://www.amazon.co.jp\/dp\/B07PPLX81X)","t":"amazon","r_v":""},"v":"2.1","b_l":[{"id":1,"u_tx":"Amazonで見る","u_bc":"#f79256","u_url":"https:\/\/[www.amazon.co.jp\/dp\/B07PPLX81X](https://www.amazon.co.jp\/dp\/B07PPLX81X)","a_id":3409706,"p_id":170,"pl_id":27060,"pc_id":185,"s_n":"amazon","u_so":1},{"id":2,"u_tx":"楽天市場で見る","u_bc":"#f76956","u_url":"https:\/\/search.rakuten.co.jp\/search\/mall\/10PCS%20%E3%82%B1%E3%83%A4%E3%82%AD%20%E6%AC%85%20%E4%B8%B8%E6%A3%92%20%E6%AC%85%E3%81%AE%E4%B8%B8%E6%A3%92%20%E7%9B%B4%E5%BE%84%CE%A68MM%20%E9%95%B7%E3%81%9530CM\/","a_id":3409708,"p_id":54,"pl_id":27059,"pc_id":54,"s_n":"rakuten","u_so":2}],"eid":"MoPDF","s":"s"});
</script>
<div id="msmaflink-MoPDF">リンク</div>
<!-- MoshimoAffiliateEasyLink END -->`,
    },
    {
      name: "ドリル刃 9.5mm",
      note: "ドアに穴をあけるための9.5mm。棒がすっと通る太さを選ぶのがコツです。",
      easyLinkHtml: `<!-- START MoshimoAffiliateEasyLink -->
<script type="text/javascript">
(function(b,c,f,g,a,d,e){b.MoshimoAffiliateObject=a;
b[a]=b[a]||function(){arguments.currentScript=c.currentScript
||c.scripts[c.scripts.length-2];(b[a].q=b[a].q||[]).push(arguments)};
c.getElementById(a)||(d=c.createElement(f),d.src=g,
d.id=a,e=c.getElementsByTagName("body")[0],e.appendChild(d))})
(window,document,"script","//dn.msmstatic.com/site/cardlink/bundle.js?20220329","msmaflink");
msmaflink({"n":"ビックツール 月光ドリル ブリスターパック 9.5mm GKP9.5 (金属・金工)","b":"BIC TOOL","t":"GKP9.5","d":"https:\/\/m.media-amazon.com","c_p":"\/images\/I","p":["\/31LECxXxOtL._SL500_.jpg","\/41vJ+PCnsPL._SL500_.jpg","\/31mLfq54FYL._SL500_.jpg","\/31q7tRqgqhL._SL500_.jpg"],"u":{"u":"https:\/\/[www.amazon.co.jp\/dp\/B00EOLRK2W](https://www.amazon.co.jp\/dp\/B00EOLRK2W)","t":"amazon","r_v":""},"v":"2.1","b_l":[{"id":1,"u_tx":"Amazonで見る","u_bc":"#f79256","u_url":"https:\/\/[www.amazon.co.jp\/dp\/B00EOLRK2W](https://www.amazon.co.jp\/dp\/B00EOLRK2W)","a_id":3409706,"p_id":170,"pl_id":27060,"pc_id":185,"s_n":"amazon","u_so":1},{"id":2,"u_tx":"楽天市場で見る","u_bc":"#f76956","u_url":"https:\/\/search.rakuten.co.jp\/search\/mall\/%E3%83%93%E3%83%83%E3%82%AF%E3%83%84%E3%83%BC%E3%83%AB%20%E6%9C%88%E5%85%89%E3%83%89%E3%83%AA%E3%83%AB%20%E3%83%96%E3%83%AA%E3%82%B9%E3%82%BF%E3%83%BC%E3%83%91%E3%83%83%E3%82%AF%209.5mm%20GKP9.5%20(%E9%87%91%E5%B1%9E%E3%83%BB%E9%87%91%E5%B7%A5)\/","a_id":3409708,"p_id":54,"pl_id":27059,"pc_id":54,"s_n":"rakuten","u_so":2}],"eid":"LNy9a","s":"s"});
</script>
<div id="msmaflink-LNy9a">リンク</div>
<!-- MoshimoAffiliateEasyLink END -->`,
    },
    {
      name: "BOSCH IXO5",
      note: "動画では年季の入った大きなドリルを使いましたが、これから買うなら、この手のひらサイズが軽くて扱いやすいです。",
      easyLinkHtml: `<!-- START MoshimoAffiliateEasyLink -->
<script type="text/javascript">
(function(b,c,f,g,a,d,e){b.MoshimoAffiliateObject=a;
b[a]=b[a]||function(){arguments.currentScript=c.currentScript
||c.scripts[c.scripts.length-2];(b[a].q=b[a].q||[]).push(arguments)};
c.getElementById(a)||(d=c.createElement(f),d.src=g,
d.id=a,e=c.getElementsByTagName("body")[0],e.appendChild(d))})
(window,document,"script","//dn.msmstatic.com/site/cardlink/bundle.js?20220329","msmaflink");
msmaflink({"n":"ボッシュ(BOSCH) コードレス電動 ドライバー IXO5 正逆転切替 LEDライト (ビット10本 充電器・ケース付) ドリルドライバー","b":"Bosch","t":"IXO5","d":"https:\/\/m.media-amazon.com","c_p":"\/images\/I","p":["\/31oBna69T+L._SL500_.jpg","\/41EmJ8O7nuL._SL500_.jpg","\/41JrF8srs0L._SL500_.jpg","\/41zFgY1tMBL._SL500_.jpg","\/41lGBrGteYL._SL500_.jpg","\/41IpoVEhJZL._SL500_.jpg","\/4182TQ0VSxL._SL500_.jpg","\/51QV5cSUQDL._SL500_.jpg","\/21OF3NXlDHL._SL500_.jpg"],"u":{"u":"https:\/\/[www.amazon.co.jp\/dp\/B0146D1XG6](https://www.amazon.co.jp\/dp\/B0146D1XG6)","t":"amazon","r_v":""},"v":"2.1","b_l":[{"id":1,"u_tx":"Amazonで見る","u_bc":"#f79256","u_url":"https:\/\/[www.amazon.co.jp\/dp\/B0146D1XG6](https://www.amazon.co.jp\/dp\/B0146D1XG6)","a_id":3409706,"p_id":170,"pl_id":27060,"pc_id":185,"s_n":"amazon","u_so":1},{"id":2,"u_tx":"楽天市場で見る","u_bc":"#f76956","u_url":"https:\/\/search.rakuten.co.jp\/search\/mall\/%E3%83%9C%E3%83%83%E3%82%B7%E3%83%A5(BOSCH)%20%E3%82%B3%E3%83%BC%E3%83%89%E3%83%AC%E3%82%B9%E9%9B%BB%E5%8B%95%20%E3%83%89%E3%83%A9%E3%82%A4%E3%83%90%E3%83%BC%20IXO5%20%E6%AD%A3%E9%80%86%E8%BB%A2%E5%88%87%E6%9B%BF%20LED%E3%83%A9%E3%82%A4%E3%83%88%20(%E3%83%93%E3%83%83%E3%83%8810%E6%9C%AC%20%E5%85%85%E9%9B%BB%E5%99%A8%E3%83%BB%E3%82%B1%E3%83%BC%E3%82%B9%E4%BB%98)%20%E3%83%89%E3%83%AA%E3%83%AB%E3%83%89%E3%83%A9%E3%82%A4%E3%83%90%E3%83%BC\/","a_id":3409708,"p_id":54,"pl_id":27059,"pc_id":54,"s_n":"rakuten","u_so":2}],"eid":"qzdtY","s":"s"});
</script>
<div id="msmaflink-qzdtY">リンク</div>
<!-- MoshimoAffiliateEasyLink END -->`,
    },
  ],
  "k9IrGLQp3fs": [
    {
      name: "インパクトドライバー",
      note: "動画で使っているのはこのインパクトドライバー。パワーとコスパでコレを選びましたが、女性が片手で持つには重たいかもしれないので、その場合は軽量版がおすすめです。",
      easyLinkHtml: `<!-- START MoshimoAffiliateEasyLink -->
<script type="text/javascript">
(function(b,c,f,g,a,d,e){b.MoshimoAffiliateObject=a;
b[a]=b[a]||function(){arguments.currentScript=c.currentScript
||c.scripts[c.scripts.length-2];(b[a].q=b[a].q||[]).push(arguments)};
c.getElementById(a)||(d=c.createElement(f),d.src=g,
d.id=a,e=c.getElementsByTagName("body")[0],e.appendChild(d))})
(window,document,"script","//dn.msmstatic.com/site/cardlink/bundle.js?20220329","msmaflink");
msmaflink({"n":"ブラックアンドデッカー(BLACK+DECKER) コードレス インパクトドライバー ソフトインパクト DIY 電動工具 穴あけ 締付工具 ワンタッチ ビット交換 18V 1.5Ah バッテリー 2個付き BPCI18JP","b":"BLACK+DECKER","t":"BPCI18JP","d":"https://m.media-amazon.com","c_p":"/images/I","p":["/514hPFDCFGL._SL500_.jpg","/41Z8gvjqPlL._SL500_.jpg","/416i4qV8aRL._SL500_.jpg","/41udHY8ks8L._SL500_.jpg","/510SbqIEdtL._SL500_.jpg","/51xC50AxrSL._SL500_.jpg","/310-wioMSVL._SL500_.jpg"],"u":{"u":"https://www.amazon.co.jp/dp/B00LVU0ONQ","t":"amazon","r_v":""},"v":"2.1","b_l":[{"id":1,"u_tx":"Amazonで見る","u_bc":"#f79256","u_url":"https://www.amazon.co.jp/dp/B00LVU0ONQ","a_id":3409706,"p_id":170,"pl_id":27060,"pc_id":185,"s_n":"amazon","u_so":1},{"id":2,"u_tx":"楽天市場で見る","u_bc":"#f76956","u_url":"https://search.rakuten.co.jp/search/mall/%E3%83%96%E3%83%A9%E3%83%83%E3%82%AF%E3%82%A2%E3%83%B3%E3%83%89%E3%83%87%E3%83%83%E3%82%AB%E3%83%BC(BLACK%2BDECKER)%20%E3%82%B3%E3%83%BC%E3%83%89%E3%83%AC%E3%82%B9%20%E3%82%A4%E3%83%B3%E3%83%91%E3%82%AF%E3%83%88%E3%83%89%E3%83%A9%E3%82%A4%E3%83%90%E3%83%BC%20%E3%82%BD%E3%83%95%E3%83%88%E3%82%A4%E3%83%B3%E3%83%91%E3%82%AF%E3%83%88%20DIY%20%E9%9B%BB%E5%8B%95%E5%B7%A5%E5%85%B7%20%E7%A9%B4%E3%81%82%E3%81%91%20%E7%B7%A0%E4%BB%98%E5%B7%A5%E5%85%B7%20%E3%83%AF%E3%83%B3%E3%82%BF%E3%83%83%E3%83%81%20%E3%83%93%E3%83%83%E3%83%88%E4%BA%A4%E6%8F%9B%2018V%201.5Ah%20%E3%83%90%E3%83%83%E3%83%86%E3%83%AA%E3%83%BC%202%E5%80%8B%E4%BB%98%E3%81%8D%20BPCI18JP/","a_id":3409708,"p_id":54,"pl_id":27059,"pc_id":54,"s_n":"rakuten","u_so":2}],"eid":"lxzA9","s":"s"});
</script>
<div id="msmaflink-lxzA9">リンク</div>
<!-- MoshimoAffiliateEasyLink END -->`,
    },
  ],
  "TvQXZ44YfJU": [
    {
      name: "L字金具",
      note: "ここで使うL字金具はコレがいい。DIYで棚を作るときなどに流用できるのでストックしています。鍵穴として使う時は穴を少し拡張する必要があり、私はアイスの棒が入る大きさに広げました。鉄ヤスリを使うと簡単です。",
      easyLinkHtml: `<!-- START MoshimoAffiliateEasyLink -->
<script type="text/javascript">
(function(b,c,f,g,a,d,e){b.MoshimoAffiliateObject=a;
b[a]=b[a]||function(){arguments.currentScript=c.currentScript
||c.scripts[c.scripts.length-2];(b[a].q=b[a].q||[]).push(arguments)};
c.getElementById(a)||(d=c.createElement(f),d.src=g,
d.id=a,e=c.getElementsByTagName("body")[0],e.appendChild(d))})
(window,document,"script","//dn.msmstatic.com/site/cardlink/bundle.js?20220329","msmaflink");
msmaflink({"n":"L字金具 角かっこ コーナーブレース 家具棚L字型直角鉄製ブラケット ステンレス製 家具ブロンズトーン用 家具固定用 棚受け金具 コーナーブレース 10pcs (25*25*32mm) M4*16ネジ40個付き","b":"サムコス","t":"w1","d":"https://m.media-amazon.com","c_p":"/images/I","p":["/412fQAwtcjL._SL500_.jpg","/41ut0tapOwL._SL500_.jpg","/41XLl3mhoAL._SL500_.jpg","/41UweooJKsL._SL500_.jpg","/51I+d9kxJfL._SL500_.jpg","/41HF5PKxO3L._SL500_.jpg","/41eBl5kxC6L._SL500_.jpg"],"u":{"u":"https://www.amazon.co.jp/dp/B0BRJF4JJS","t":"amazon","r_v":""},"v":"2.1","b_l":[{"id":1,"u_tx":"Amazonで見る","u_bc":"#f79256","u_url":"https://www.amazon.co.jp/dp/B0BRJF4JJS","a_id":3409706,"p_id":170,"pl_id":27060,"pc_id":185,"s_n":"amazon","u_so":1},{"id":2,"u_tx":"楽天市場で見る","u_bc":"#f76956","u_url":"https://search.rakuten.co.jp/search/mall/L%E5%AD%97%E9%87%91%E5%85%B7%20%E8%A7%92%E3%81%8B%E3%81%A3%E3%81%93%20%E3%82%B3%E3%83%BC%E3%83%8A%E3%83%BC%E3%83%96%E3%83%AC%E3%83%BC%E3%82%B9%20%E5%AE%B6%E5%85%B7%E6%A3%9AL%E5%AD%97%E5%9E%8B%E7%9B%B4%E8%A7%92%E9%89%84%E8%A3%BD%E3%83%96%E3%83%A9%E3%82%B1%E3%83%83%E3%83%88%20%E3%82%B9%E3%83%86%E3%83%B3%E3%83%AC%E3%82%B9%E8%A3%BD%20%E5%AE%B6%E5%85%B7%E3%83%96%E3%83%AD%E3%83%B3%E3%82%BA%E3%83%88%E3%83%BC%E3%83%B3%E7%94%A8%20%E5%AE%B6%E5%85%B7%E5%9B%BA%E5%AE%9A%E7%94%A8%20%E6%A3%9A%E5%8F%97%E3%81%91%E9%87%91%E5%85%B7%20%E3%82%B3%E3%83%BC%E3%83%8A%E3%83%BC%E3%83%96%E3%83%AC%E3%83%BC%E3%82%B9%2010pcs%20(25*25*32mm)%20M4*16%E3%83%8D%E3%82%B840%E5%80%8B%E4%BB%98%E3%81%8D/","a_id":3409708,"p_id":54,"pl_id":27059,"pc_id":54,"s_n":"rakuten","u_so":2}],"eid":"61ZJ9","s":"s"});
</script>
<div id="msmaflink-61ZJ9">リンク</div>
<!-- MoshimoAffiliateEasyLink END -->`,
    },
    {
      name: "棒ヤスリ",
      note: "上のL字金具の穴を広げるのに使う鉄ヤスリ。カタチの違う棒状のヤスリがセットになっていて便利です。",
      easyLinkHtml: `<!-- START MoshimoAffiliateEasyLink -->
<script type="text/javascript">
(function(b,c,f,g,a,d,e){b.MoshimoAffiliateObject=a;
b[a]=b[a]||function(){arguments.currentScript=c.currentScript
||c.scripts[c.scripts.length-2];(b[a].q=b[a].q||[]).push(arguments)};
c.getElementById(a)||(d=c.createElement(f),d.src=g,
d.id=a,e=c.getElementsByTagName("body")[0],e.appendChild(d))})
(window,document,"script","//dn.msmstatic.com/site/cardlink/bundle.js?20220329","msmaflink");
msmaflink({"n":"HorizonMega ダイヤモンドヤスリ セット 10本組 3×140mm 棒ヤスリ やすり 金属 木工 鉄工用 精密 バリ取り 工具 ダイヤモンド プラモデル ガラスヤスリ 研磨 プラモデル用 サンドペーパー代用 DIY 研磨ツール","b":"HorizonMega","t":"HorizonMega-HTHY102","d":"https://m.media-amazon.com","c_p":"/images/I","p":["/41WRKW525DL._SL500_.jpg","/31Gv4uirxTL._SL500_.jpg","/41+lIfucMIL._SL500_.jpg","/41xpQtfmoUL._SL500_.jpg","/51NT6Srq6kL._SL500_.jpg","/41St85w+9UL._SL500_.jpg","/51sELJs2a6L._SL500_.jpg"],"u":{"u":"https://[www.amazon.co.jp/dp/B0FWRS69NT](https://www.amazon.co.jp/dp/B0FWRS69NT)","t":"amazon","r_v":""},"v":"2.1","b_l":[{"id":1,"u_tx":"Amazonで見る","u_bc":"#f79256","u_url":"https://[www.amazon.co.jp/dp/B0FWRS69NT](https://www.amazon.co.jp/dp/B0FWRS69NT)","a_id":3409706,"p_id":170,"pl_id":27060,"pc_id":185,"s_n":"amazon","u_so":1},{"id":2,"u_tx":"楽天市場で見る","u_bc":"#f76956","u_url":"https://search.rakuten.co.jp/search/mall/HorizonMega%20%E3%83%80%E3%82%A4%E3%83%A4%E3%83%A2%E3%83%B3%E3%83%89%E3%83%A4%E3%82%B9%E3%83%AA%20%E3%82%BB%E3%83%83%E3%83%88%2010%E6%9C%AC%E7%B5%84%203%C3%97140mm%20%E6%A3%92%E3%83%A4%E3%82%B9%E3%83%AA%20%E3%82%84%E3%81%99%E3%82%8A%20%E9%87%91%E5%B1%9E%20%E6%9C%A8%E5%B7%A5%20%E9%89%84%E5%B7%A5%E7%94%A8%20%E7%B2%BE%E5%AF%86%20%E3%83%90%E3%83%AA%E5%8F%96%E3%82%8A%20%E5%B7%A5%E5%85%B7%20%E3%83%80%E3%82%A4%E3%83%A4%E3%83%A2%E3%83%B3%E3%83%89%20%E3%83%97%E3%83%A9%E3%83%A2%E3%83%87%E3%83%AB%20%E3%82%AC%E3%83%A9%E3%82%B9%E3%83%A4%E3%82%B9%E3%83%AA%20%E7%A0%94%E7%A3%A8%20%E3%83%97%E3%83%A9%E3%83%A2%E3%83%87%E3%83%AB%E7%94%A8%20%E3%82%B5%E3%83%B3%E3%83%89%E3%83%9A%E3%83%BC%E3%83%91%E3%83%BC%E4%BB%A3%E7%94%A8%20DIY%20%E7%A0%94%E7%A3%A8%E3%83%84%E3%83%BC%E3%83%AB/","a_id":3409708,"p_id":54,"pl_id":27059,"pc_id":54,"s_n":"rakuten","u_so":2}],"eid":"XEZqe","s":"s"});
</script>
<div id="msmaflink-XEZqe">リンク</div>
<!-- MoshimoAffiliateEasyLink END -->`,
    },
  ],
  "OadpRaASJfM": [
    {
      name: "猫用釣り竿",
      note: "動画でトラジが夢中で遊んでいる猫じゃらし（釣り竿タイプ）。羽と鈴つきで、替えの羽もついています。",
      easyLinkHtml: `<!-- START MoshimoAffiliateEasyLink -->
<script type="text/javascript">
(function(b,c,f,g,a,d,e){b.MoshimoAffiliateObject=a;
b[a]=b[a]||function(){arguments.currentScript=c.currentScript
||c.scripts[c.scripts.length-2];(b[a].q=b[a].q||[]).push(arguments)};
c.getElementById(a)||(d=c.createElement(f),d.src=g,
d.id=a,e=c.getElementsByTagName("body")[0],e.appendChild(d))})
(window,document,"script","//dn.msmstatic.com/site/cardlink/bundle.js?20220329","msmaflink");
msmaflink({"n":"FUKUMARU ねこじゃらし 猫じゃらし 羽 鈴 釣り竿 替えの羽付き 90cm","b":"FUKUMARU","t":"CT01","d":"https://m.media-amazon.com","c_p":"/images/I","p":["/41AU8X8mZJL._SL500_.jpg","/412cl+cZfeL._SL500_.jpg","/31C93B1dcCL._SL500_.jpg","/31S0iOvRB0L._SL500_.jpg","/41XP7s8pqnL._SL500_.jpg","/418GiTP7lcL._SL500_.jpg"],"u":{"u":"https://www.amazon.co.jp/dp/B09JBYSR2T","t":"amazon","r_v":""},"v":"2.1","b_l":[{"id":1,"u_tx":"Amazonで見る","u_bc":"#f79256","u_url":"https://www.amazon.co.jp/dp/B09JBYSR2T","a_id":3409706,"p_id":170,"pl_id":27060,"pc_id":185,"s_n":"amazon","u_so":1},{"id":2,"u_tx":"楽天市場で見る","u_bc":"#f76956","u_url":"https://search.rakuten.co.jp/search/mall/FUKUMARU%20%E3%81%AD%E3%81%93%E3%81%98%E3%82%83%E3%82%89%E3%81%97%20%E7%8C%AB%E3%81%98%E3%82%83%E3%82%89%E3%81%97%20%E7%BE%BD%20%E9%88%B4%20%E9%87%A3%E3%82%8A%E7%AB%BF%20%E6%9B%BF%E3%81%88%E3%81%AE%E7%BE%BD%E4%BB%98%E3%81%8D%2090cm/","a_id":3409708,"p_id":54,"pl_id":27059,"pc_id":54,"s_n":"rakuten","u_so":2}],"eid":"Cng23","s":"s"});
</script>
<div id="msmaflink-Cng23">リンク</div>
<!-- MoshimoAffiliateEasyLink END -->`,
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
