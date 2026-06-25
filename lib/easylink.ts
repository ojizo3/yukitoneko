// もしもアフィリエイト「かんたんリンク」(EasyLink)コード全文から、
// 自前カードに必要な素材だけを取り出すパーサ(サーバー側で実行する純関数)。
//
// 取り出すもの:
//   - name       : 商品名("n")
//   - imageUrl   : 商品画像URL("d" + "c_p" + "p"[0] を連結したフルURL)
//   - amazonUrl  : Amazonリンク("b_l" の s_n:"amazon" の u_url、無ければ "u".u)
//   - rakutenUrl : 楽天リンク("b_l" の s_n:"rakuten" の u_url)
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
  /** Amazonリンク(修復済み) */
  amazonUrl: string;
  /** 楽天リンク(修復済み) */
  rakutenUrl: string;
};

type EasyLinkConfig = {
  n?: string;
  d?: string;
  c_p?: string;
  p?: unknown;
  u?: { u?: string };
  b_l?: { s_n?: string; u_url?: string }[];
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

  if (!name && !imageUrl && !amazonUrl && !rakutenUrl) return null;
  return { name, imageUrl, amazonUrl, rakutenUrl };
}
