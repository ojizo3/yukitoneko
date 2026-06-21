// YouTube Data API v3 の呼び出しをまとめた層。
//
// API消費を抑えるため search.list(100ユニット)は使わず、以下の流れで取得する:
//   1. 動画ID一覧を集める
//      - NEW    : チャンネルのアップロード再生リスト(UC... を UU... に置換)
//      - 各階層 : playlistItems.list(1ユニット)
//   2. videos.list(1ユニット)で title / サムネ / 公開日 / 再生回数 をまとめて取得
//
// すべて1時間ISRキャッシュ(next.revalidate)。APIキー未設定や失敗時は
// その行を空配列として返し、サイト全体は落とさない。

import type { Video } from "@/types/video";
import { ROWS, MAX_VIDEOS_PER_ROW, type RowConfig } from "@/lib/config";

const API_BASE = "https://www.googleapis.com/youtube/v3";
const REVALIDATE_SECONDS = 3600; // 1時間

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

interface YouTubeThumbnail {
  url: string;
  width?: number;
  height?: number;
}

interface YouTubeThumbnails {
  default?: YouTubeThumbnail;
  medium?: YouTubeThumbnail;
  high?: YouTubeThumbnail;
  standard?: YouTubeThumbnail;
  maxres?: YouTubeThumbnail;
}

/** 利用可能なうち最も高解像度のサムネを選ぶ */
function pickThumbnail(thumbnails?: YouTubeThumbnails): string {
  if (!thumbnails) return "";
  return (
    thumbnails.maxres?.url ??
    thumbnails.standard?.url ??
    thumbnails.high?.url ??
    thumbnails.medium?.url ??
    thumbnails.default?.url ??
    ""
  );
}

/** チャンネルIDからアップロード再生リストIDを導出(UCxxx -> UUxxx) */
function uploadsPlaylistId(channelId: string): string {
  return channelId.startsWith("UC") ? "UU" + channelId.slice(2) : channelId;
}

/** revalidate付き fetch。失敗時は null を返す(呼び出し側でフォールバック) */
async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) {
      console.error(
        `[youtube] ${res.status} ${res.statusText} for ${url.split("?")[0]}`,
      );
      return null;
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error("[youtube] fetch failed:", err);
    return null;
  }
}

interface PlaylistItemsResponse {
  items?: { contentDetails?: { videoId?: string } }[];
  nextPageToken?: string;
}

/** 再生リストから動画ID一覧を取得(公開順を保持) */
async function fetchPlaylistVideoIds(
  playlistId: string,
  max: number,
): Promise<string[]> {
  const url =
    `${API_BASE}/playlistItems?part=contentDetails` +
    `&maxResults=${Math.min(max, 50)}` +
    `&playlistId=${encodeURIComponent(playlistId)}` +
    `&key=${API_KEY}`;
  const data = await fetchJson<PlaylistItemsResponse>(url);
  if (!data?.items) return [];
  return data.items
    .map((item) => item.contentDetails?.videoId)
    .filter((id): id is string => Boolean(id));
}

interface VideosResponse {
  items?: {
    id: string;
    snippet?: {
      title?: string;
      description?: string;
      publishedAt?: string;
      thumbnails?: YouTubeThumbnails;
    };
    statistics?: { viewCount?: string };
  }[];
}

/** 動画ID配列の詳細(タイトル・サムネ・再生回数)をまとめて取得 */
async function fetchVideoDetails(ids: string[]): Promise<Video[]> {
  if (ids.length === 0) return [];
  const url =
    `${API_BASE}/videos?part=snippet,statistics` +
    `&id=${ids.map(encodeURIComponent).join(",")}` +
    `&key=${API_KEY}`;
  const data = await fetchJson<VideosResponse>(url);
  if (!data?.items) return [];

  // videos.list は順序を保証しないので、元のID順に並べ直す
  const byId = new Map(data.items.map((item) => [item.id, item]));
  const videos: Video[] = [];
  for (const id of ids) {
    const item = byId.get(id);
    if (!item?.snippet) continue; // 非公開・削除済みはスキップ
    const viewCount = item.statistics?.viewCount
      ? Number(item.statistics.viewCount)
      : undefined;
    videos.push({
      id: item.id,
      title: item.snippet.title ?? "",
      thumbnail: pickThumbnail(item.snippet.thumbnails),
      viewCount: Number.isFinite(viewCount) ? viewCount : undefined,
      publishedAt: item.snippet.publishedAt ?? "",
    });
  }
  return videos;
}

/** 1行ぶんの動画を取得 */
async function fetchRowVideos(row: RowConfig): Promise<Video[]> {
  if (!API_KEY) return []; // キー未設定: 空表示でフォールバック

  let playlistId: string | undefined;
  if (row.source === "channel") {
    if (!CHANNEL_ID) return [];
    playlistId = uploadsPlaylistId(CHANNEL_ID);
  } else {
    playlistId = row.playlistEnv ? process.env[row.playlistEnv] : undefined;
  }
  if (!playlistId) return [];

  const ids = await fetchPlaylistVideoIds(playlistId, MAX_VIDEOS_PER_ROW);
  return fetchVideoDetails(ids);
}

/** 動画1本の詳細を取得(詳細ページ用。説明文も含む) */
export async function getVideo(id: string): Promise<Video | null> {
  if (!API_KEY || !id) return null;
  const url =
    `${API_BASE}/videos?part=snippet,statistics` +
    `&id=${encodeURIComponent(id)}` +
    `&key=${API_KEY}`;
  const data = await fetchJson<VideosResponse>(url);
  const item = data?.items?.[0];
  if (!item?.snippet) return null;
  const viewCount = item.statistics?.viewCount
    ? Number(item.statistics.viewCount)
    : undefined;
  return {
    id: item.id,
    title: item.snippet.title ?? "",
    thumbnail: pickThumbnail(item.snippet.thumbnails),
    viewCount: Number.isFinite(viewCount) ? viewCount : undefined,
    publishedAt: item.snippet.publishedAt ?? "",
    description: item.snippet.description ?? "",
  };
}

/** トップページの全行ぶんのデータを並列取得 */
export async function getAllRows() {
  return Promise.all(
    ROWS.map(async (row) => ({
      key: row.key,
      title: row.title,
      videos: await fetchRowVideos(row),
    })),
  );
}

/**
 * 関連動画を取得する(同じ再生リスト=同じ行から数本)。
 *
 * getAllRows() を再利用するため、playlistItems / videos.list の fetch は
 * トップページと同じ URL になり Next の fetch キャッシュで共有される。
 * → API クォータの追加消費はほぼ無い。
 *
 * 当該動画を含む行が見つからない場合(トップ未掲載の旧動画など)は、
 * 最初に動画を持つ行(通常 NEW)から代替で返す。
 */
export async function getRelatedVideos(id: string, max = 6): Promise<Video[]> {
  if (!API_KEY) return [];
  const rows = await getAllRows();
  const owner = rows.find((r) => r.videos.some((v) => v.id === id));
  const pool = owner?.videos ?? rows.find((r) => r.videos.length > 0)?.videos ?? [];
  return pool.filter((v) => v.id !== id).slice(0, max);
}

// =====================================================================
// 回遊性向上(人気の動画行・カテゴリー全動画ページ)で使う取得層。
// すべて「追加」のみ。既存の getAllRows / getVideo などには手を入れない。
// 既存と同じ fetch(revalidate付き)を使うので、同一URLは Next の
// fetchキャッシュで共有され、API消費は最小に保たれる。
// =====================================================================

/** 再生リストの全動画IDをページングで取得(公開順=新しい順を保持) */
async function fetchAllPlaylistVideoIds(playlistId: string): Promise<string[]> {
  const ids: string[] = [];
  let pageToken = "";
  // 無限ループ防止のため最大ページ数を控えめに上限化(50件×40=2000本)。
  for (let page = 0; page < 40; page++) {
    const url =
      `${API_BASE}/playlistItems?part=contentDetails&maxResults=50` +
      `&playlistId=${encodeURIComponent(playlistId)}` +
      (pageToken ? `&pageToken=${pageToken}` : "") +
      `&key=${API_KEY}`;
    const data = await fetchJson<PlaylistItemsResponse>(url);
    if (!data?.items) break;
    for (const item of data.items) {
      const vid = item.contentDetails?.videoId;
      if (vid) ids.push(vid);
    }
    if (!data.nextPageToken) break;
    pageToken = data.nextPageToken;
  }
  return ids;
}

/** 動画ID配列の詳細を 50件ずつバッチ取得(videos.list の上限対応・順序維持) */
async function fetchVideoDetailsAll(ids: string[]): Promise<Video[]> {
  const videos: Video[] = [];
  for (let i = 0; i < ids.length; i += 50) {
    const batch = await fetchVideoDetails(ids.slice(i, i + 50));
    videos.push(...batch);
  }
  return videos;
}

/**
 * チャンネルの全アップロード動画を取得(新しい順)。
 * 人気行・「人気」「NEW」カテゴリーページの共通データ源。
 * 内部の fetch URL は呼び出し間で同一になり Next のキャッシュで共有される。
 */
export async function getAllChannelVideos(): Promise<Video[]> {
  if (!API_KEY || !CHANNEL_ID) return [];
  const ids = await fetchAllPlaylistVideoIds(uploadsPlaylistId(CHANNEL_ID));
  return fetchVideoDetailsAll(ids);
}

/**
 * 再生数の多い順(降順)に並べた動画を取得する。
 * 既定で上位 limit 本(トップの「人気の動画」行は 15 本)を返す。
 * limit を省くと全件(カテゴリーページの /category/popular 用)。
 */
export async function getPopularVideos(limit?: number): Promise<Video[]> {
  const all = await getAllChannelVideos();
  const sorted = [...all].sort(
    (a, b) => (b.viewCount ?? 0) - (a.viewCount ?? 0),
  );
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

/**
 * カテゴリー(行)の全動画を取得する。「すべて見る」一覧ページ用。
 *   - "popular" : 全動画を再生数降順
 *   - "new"     : 全アップロードを新しい順
 *   - それ以外  : ROWS の該当 playlist を全件(新しい順)
 * 未知のslug・未設定envは空配列(ページ側で notFound / 空表示)。
 */
export async function getCategoryVideos(slug: string): Promise<Video[]> {
  if (!API_KEY) return [];
  if (slug === "popular") return getPopularVideos();
  if (slug === "new") return getAllChannelVideos();

  const row = ROWS.find((r) => r.key === slug);
  if (!row || row.source !== "playlist" || !row.playlistEnv) return [];
  const playlistId = process.env[row.playlistEnv];
  if (!playlistId) return [];
  const ids = await fetchAllPlaylistVideoIds(playlistId);
  return fetchVideoDetailsAll(ids);
}
