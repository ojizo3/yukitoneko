// サイトの設定・再生リスト定義
//
// 各行の実データは YouTube から取得する。NEW はチャンネルの最新アップロード、
// それ以外は再生リストから取得する。再生リストを追加したくなったら
// この配列に1要素足すだけでトップページに新しい行が増える。

/** 1階層ぶんの定義 */
export interface RowConfig {
  /** 階層を識別するキー */
  key: string;
  /** 画面に出す見出し */
  title: string;
  /**
   * データソース。
   * - 'channel': チャンネルの最新アップロードを使う(NEW行)
   * - 'playlist': 再生リストIDから取得する
   */
  source: "channel" | "playlist";
  /** source === 'playlist' のとき参照する環境変数名 */
  playlistEnv?: string;
}

/** トップページに表示する行(上から順に並ぶ) */
export const ROWS: RowConfig[] = [
  { key: "new", title: "NEW", source: "channel" },
  {
    key: "cat-daily",
    title: "猫の日常",
    source: "playlist",
    playlistEnv: "PLAYLIST_CAT_DAILY",
  },
  {
    key: "cat-diy",
    title: "猫DIY",
    source: "playlist",
    playlistEnv: "PLAYLIST_CAT_DIY",
  },
  {
    key: "experiment",
    title: "実験ショート(食・モノ)",
    source: "playlist",
    playlistEnv: "PLAYLIST_EXPERIMENT",
  },
  {
    key: "relax",
    title: "ずっとみてられる",
    source: "playlist",
    playlistEnv: "PLAYLIST_RELAX",
  },
];

/** 各行で取得する動画の最大本数 */
export const MAX_VIDEOS_PER_ROW = 15;

/** ヘッダーのナビゲーション項目(左→右の順) */
export interface NavItem {
  href: string;
  label: string;
}

export const NAV: NavItem[] = [
  { href: "/", label: "ホーム" },
  { href: "/about", label: "About" },
];

/** SNSリンク1件ぶんの定義 */
export interface SocialLink {
  key: string;
  /** スクリーンリーダー・aria用ラベル */
  label: string;
  /** リンク先(未確定のものは "#" を暫定で入れておく) */
  href: string;
  /** ホバー時に付く色(各SNSのブランドカラー) */
  hoverColor: string;
}

/**
 * 右上に並べるSNS。href が "#" のものはリンク未確定(後で差し替え)。
 * ここに1要素足すだけでヘッダーにアイコンが増える。
 */
export const SOCIALS: SocialLink[] = [
  {
    key: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@yuki-toneko",
    hoverColor: "#ff0000",
  },
  {
    key: "instagram",
    label: "Instagram",
    href: "#", // TODO: 確定したらURLに差し替え
    hoverColor: "#e1306c",
  },
  {
    key: "x",
    label: "X",
    href: "#", // TODO: 確定したらURLに差し替え
    hoverColor: "#000000",
  },
];

/**
 * サイト共通のデフォルトOGP画像(1200×630, public/opengraph-image.jpg)。
 * 各ページが openGraph を再定義すると親(layout)の画像は引き継がれない
 * (Next の metadata はネストをディープマージしない)ため、og:image を出したい
 * ページの openGraph.images にこれを明示的に渡す。相対URLは metadataBase で
 * 絶対URLに解決される。
 * 動画ページ /video/[id] は各動画のサムネを使うので、ここは適用しない。
 */
export const OG_IMAGE = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "雪と猫 YUKItoNEKO",
} as const;

/** サイトの基本情報(メタデータ・SEOで使用) */
export const SITE = {
  name: "雪と猫",
  nameEn: "yukitoneko",
  url: "https://yukitoneko.jitozu.com",
  description:
    "青森・雪国で暮らす猫たちの日常。猫DIY、実験ショート、ずっと見ていられる癒しの動画を集めたYouTubeチャンネル「雪と猫」の公式サイト。",
} as const;
