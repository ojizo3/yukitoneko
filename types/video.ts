// 「雪と猫」サイトで使う型定義

/** 1本の動画を表す、サイト表示に必要な最小限の情報 */
export interface Video {
  id: string;
  title: string;
  /** サムネイルURL(なるべく高解像度を採用) */
  thumbnail: string;
  /** 再生回数(数値)。取得できない場合は undefined */
  viewCount?: number;
  /** 公開日時(ISO 8601文字列) */
  publishedAt: string;
  /** 動画説明文(詳細ページでのみ使用。一覧では未取得) */
  description?: string;
}

/** トップページに並ぶ1階層(横スクロール1行) */
export interface VideoRowData {
  /** 階層の表示名(例: NEW、猫の日常) */
  title: string;
  /** 階層を識別するキー */
  key: string;
  videos: Video[];
}
