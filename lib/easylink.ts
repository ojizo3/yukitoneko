// もしもアフィリエイト「かんたんリンク」(EasyLink)コード全文から、
// 自前カードに必要な素材だけを取り出すパーサ(サーバー側で実行する純関数)。
//
// 取り出すもの:
//   - name           : 商品名("n")
//   - imageUrl       : 商品画像URL("d" + "c_p" + "p"[0] を連結したフルURL)
//   - amazonUrl      : Amazon直リンク("b_l" の s_n:"amazon" の u_url、無ければ "u".u)※フォールバック用
//   - rakutenUrl     : 楽天直リンク("b_l" の s_n:"rakuten" の u_url)※フォールバック用
//   - amazonTrackUrl : Amazonの【もしも計測リンク】(af.moshimo.com/af/c/click?...)
//   - rakutenTrackUrl: 楽天の【もしも計測リンク】(af.moshimo.com/af/c/click?...)
//
// 【計測リンク(方式1)について】
// もしも公式 bundle.js の _generateAffiliateLink をソース確認して再現したもの。
// クリック計測を成立させるため、Amazon/楽天への直リンクではなく、必ずこの
// af.moshimo.com 経由リンクをボタンの href にする。正規ロジック:
//   https://af.moshimo.com/af/c/click?a_id={a_id}&p_id={p_id}&pc_id={pc_id}&pl_id={pl_id}&url={encodeURIComponent(遷移先URL)}
//   - パラメータ順序は a_id → p_id → pc_id → pl_id → url を厳守(pc_id が pl_id より先)
//   - 遷移先URL: bundle.js の v2.1 挙動に従い、各 b_l の u_url を使う。ただし
//     "u"(main_item)の t と s_n が一致する経路(=Amazon)は "u".u を使う。
//     u_url は encodeURIComponent で1回だけエンコードする(楽天の既エンコード分は
//     二重エンコードになるが、それが正規挙動)。
//   - s_v は今回のコードに無いので付けない。
//
// 【URLの自動修復】
// スプレッドシート由来で、URL が Markdown 記法へ化けることがある。例:
//   "https://[www.amazon.co.jp/dp/B007R9FVBA](https://www.amazon.co.jp/dp/B007R9FVBA)"
// この場合は「丸カッコ内のURL」を正規URLとして採用し、壊れを修復してから使う。
// 全商品で起こりうる前提で堅牢に処理する。

export type ParsedEasyLink = {
  /** 商品名("n") */
  name: string;
  /** 商品画像のフルURL("d"+"c_p"+"p"[0]) */
  imageUrl: string;
  /** Amazon直リンク(修復済み)。計測リンクが組めない場合のフォールバック用。 */
  amazonUrl: string;
  /** 楽天直リンク(修復済み)。計測リンクが組めない場合のフォールバック用。 */
  rakutenUrl: string;
  /** Amazonのもしも計測リンク(af.moshimo.com/af/c/click?...)。組めなければ空。 */
  amazonTrackUrl: string;
  /** 楽天のもしも計測リンク(af.moshimo.com/af/c/click?...)。組めなければ空。 */
  rakutenTrackUrl: string;
};

/** b_l(button_link_list)の1要素。計測リンク組み立てに必要なフィールド。 */
type ButtonLink = {
  s_n?: string;
  u_url?: string;
  a_id?: number | string;
  p_id?: number | string;
  pc_id?: number | string;
  pl_id?: number | string;
};

type EasyLinkConfig = {
  n?: string;
  d?: string;
  c_p?: string;
  p?: unknown;
  /** main_item。t(=媒体種別)が s_n と一致する経路では u を遷移先に使う。 */
  u?: { u?: string; t?: string };
  b_l?: ButtonLink[];
};

/**
 * URL を正規化する。Markdown 記法 [ラベル](URL) に化けていれば
 * 丸カッコ内のURLを採用する。それ以外はそのまま返す。
 */
export function repairUrl(raw: unknown): string {
  if (typeof raw !== "string") return "";
  const value = raw.trim();
  if (!value) return "";
  // [label](url) を検出したら丸カッコ内を正規URLとして採用
  const md = value.match(/\[[^\]]*\]\(([^)]+)\)/);
  if (md) return md[1].trim();
  return value;
}

/**
 * 1つの b_l 要素から もしも計測リンク(af.moshimo.com/af/c/click?...)を組み立てる。
 * bundle.js の _generateAffiliateLink を忠実に再現する。
 * a_id / p_id / pc_id / pl_id のいずれか、または遷移先URLが欠ければ "" を返す。
 *
 * @param link    b_l の要素(Amazon または 楽天)
 * @param mainItem cfg.u。link.s_n と mainItem.t が一致する経路では mainItem.u を遷移先に使う。
 */
export function buildTrackUrl(
  link: ButtonLink | undefined,
  mainItem: { u?: string; t?: string } | undefined,
): string {
  if (!link) return "";
  const { a_id, p_id, pc_id, pl_id } = link;
  // ID が1つでも欠けたら計測リンクは作れない(bundle.js も a_id 無しは直リンク扱い)。
  if (
    a_id == null ||
    p_id == null ||
    pc_id == null ||
    pl_id == null
  ) {
    return "";
  }

  // 遷移先URL: bundle.js v2.1 挙動。main_item.t === s_n の経路(=Amazon)は main_item.u、
  // それ以外(=楽天)は b_l の u_url。いずれも Markdown 化けを repairUrl で先に修復。
  const rawTarget =
    mainItem && mainItem.t === link.s_n ? mainItem.u : link.u_url;
  const target = repairUrl(rawTarget);
  if (!target) return "";

  // 順序厳守: a_id → p_id → pc_id → pl_id → url。url は1回だけ encodeURIComponent。
  return (
    "https://af.moshimo.com/af/c/click" +
    `?a_id=${a_id}` +
    `&p_id=${p_id}` +
    `&pc_id=${pc_id}` +
    `&pl_id=${pl_id}` +
    `&url=${encodeURIComponent(target)}`
  );
}

/**
 * EasyLink コード全文から素材を取り出す。取り出せなければ null。
 */
export function parseEasyLink(html: string): ParsedEasyLink | null {
  if (!html) return null;

  // msmaflink({ ... }); の引数(設定JSON)を取り出す。
  // 設定は入れ子(u / b_l)を含むので貪欲マッチで全体を捕捉する。
  const m = html.match(/msmaflink\((\{[\s\S]*\})\);/);
  if (!m) return null;

  let cfg: EasyLinkConfig;
  try {
    cfg = JSON.parse(m[1]) as EasyLinkConfig;
  } catch {
    return null;
  }

  const name = typeof cfg.n === "string" ? cfg.n : "";

  // 画像: "p" 配列の1枚目を "d" + "c_p" に連結してフルURL化
  const images = Array.isArray(cfg.p) ? (cfg.p as unknown[]) : [];
  const first = typeof images[0] === "string" ? (images[0] as string) : "";
  const imageUrl = first ? `${cfg.d ?? ""}${cfg.c_p ?? ""}${first}` : "";

  // ボタンリンク: b_l から s_n で判別。Amazonは無ければ u.u にフォールバック。
  const list = Array.isArray(cfg.b_l) ? cfg.b_l : [];
  const amazon = list.find((x) => x?.s_n === "amazon");
  const rakuten = list.find((x) => x?.s_n === "rakuten");

  const amazonUrl = repairUrl(amazon?.u_url ?? cfg.u?.u);
  const rakutenUrl = repairUrl(rakuten?.u_url);

  // もしも計測リンク(これをボタンの href にする)。
  const amazonTrackUrl = buildTrackUrl(amazon, cfg.u);
  const rakutenTrackUrl = buildTrackUrl(rakuten, cfg.u);

  if (!name && !imageUrl && !amazonUrl && !rakutenUrl) return null;
  return { name, imageUrl, amazonUrl, rakutenUrl, amazonTrackUrl, rakutenTrackUrl };
}
