// 1本ぶんの縦サムネカード。クリック/タップで動画ページ(/video/[id])へ遷移する。
//
// Next.js の <Link> でラップするだけ。iOS Safari のタップ周りの問題
// (pointercancel・合成click抑制・即閉じ)はモーダルをやめたことで完全に解消。
// 呼吸アニメーション・長押しメニュー抑制・touch-action は維持。

import Link from "next/link";
import type { CSSProperties } from "react";
import type { Video } from "@/types/video";
import { formatViews, formatPublished } from "@/lib/format";

// id から決定的に呼吸のディレイ/周期を導く(全サムネを非同期に「個別に呼吸」させる)
function breatheVars(id: string): CSSProperties {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const delay = -(h % 9000) / 1000; // 0〜-9s(負ディレイで初期位相をバラす)
  const dur = 9 + (h % 4); // 9〜12s 周期
  return {
    "--breathe-delay": `${delay}s`,
    "--breathe-dur": `${dur}s`,
  } as CSSProperties;
}

export default function VideoCard({ video }: { video: Video }) {
  const meta = [formatViews(video.viewCount), formatPublished(video.publishedAt)]
    .filter(Boolean)
    .join(" ・ ");

  return (
    <Link
      href={`/video/${video.id}`}
      // モーダルを開くとき背景の一覧が先頭へスクロールしないよう抑止
      // (Next は fixed 配置のモーダルをスクロール対象探索でスキップするため明示が必要)。
      // フルページ遷移時は常に先頭表示なので、どの利用箇所でも副作用なし。
      scroll={false}
      className="group block w-full select-none text-left [touch-action:manipulation] [-webkit-tap-highlight-color:transparent] [-webkit-touch-callout:none]"
    >
      {/* 9:16 縦サムネ枠。常時ゆっくり呼吸(scale)。ホバー拡大は内側の img に当てて競合回避 */}
      <div
        style={breatheVars(video.id)}
        className="animate-breathe relative aspect-[9/16] w-full overflow-hidden rounded-xl bg-snow"
      >
        {video.thumbnail ? (
          // 外部サムネは最適化不要のため素の img(遅延読み込み)
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.thumbnail}
            alt={video.title}
            loading="lazy"
            draggable={false}
            className="h-full w-full select-none object-cover transition-transform duration-200 group-hover:scale-105 [-webkit-touch-callout:none]"
          />
        ) : null}
      </div>

      <h3 className="mt-2 line-clamp-2 text-sm font-medium leading-snug text-ink">
        {video.title}
      </h3>
      {meta && <p className="mt-1 text-xs text-sub">{meta}</p>}
    </Link>
  );
}
