"use client";

// 1階層ぶんの横スクロール行。
// - 左右の矢印(◁▷)でスクロール(PC)
// - マウスドラッグ / スワイプでもスクロール
// - スマホは中央2列がメイン、左右が半分見切れる(scroll-snap)

import { useRef, useState, useCallback, useEffect } from "react";
import type { Video } from "@/types/video";
import VideoCard from "@/components/VideoCard";

const DRAG_THRESHOLD = 6; // これを超えて動いたらドラッグ扱い(クリック抑止)

export default function VideoRow({
  title,
  videos,
  highlight = false,
}: {
  title: string;
  videos: Video[];
  /** タイトルに控えめなアンビエント発光を付ける(NEW行など) */
  highlight?: boolean;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  // ドラッグ状態(再レンダリング不要なので ref で保持)
  const drag = useRef({ active: false, startX: 0, startLeft: 0, moved: 0 });
  const suppressClick = useRef(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 1);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollByPage = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  // --- ドラッグでスクロール(マウスのみ) ---
  // タッチ(スマホ)はブラウザ標準の横スクロールに任せる。
  // JSで scrollLeft を奪うと iOS Safari でタップ・スワイプが効かなくなるため。
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startLeft: el.scrollLeft,
      moved: 0,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    const el = scrollerRef.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    drag.current.moved = Math.max(drag.current.moved, Math.abs(dx));
    el.scrollLeft = drag.current.startLeft - dx;
  };

  const endDrag = () => {
    if (drag.current.moved > DRAG_THRESHOLD) suppressClick.current = true;
    drag.current.active = false;
  };

  // ドラッグ直後のクリックは握りつぶす(カードが開かないように)
  const onClickCapture = (e: React.MouseEvent) => {
    if (suppressClick.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressClick.current = false;
    }
  };

  if (videos.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl py-4">
      <div className="flex items-center justify-between px-4 sm:px-6">
        <h2
          className={`text-lg font-bold tracking-tight text-ink sm:text-xl ${
            highlight ? "animate-glow" : ""
          }`}
        >
          {title}
        </h2>
        {/* PC用の矢印 */}
        <div className="hidden gap-1 sm:flex">
          <Arrow dir="left" disabled={!canLeft} onClick={() => scrollByPage(-1)} />
          <Arrow dir="right" disabled={!canRight} onClick={() => scrollByPage(1)} />
        </div>
      </div>

      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        className="no-scrollbar mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 sm:gap-4 sm:px-6 sm:snap-none"
        // touch-action は既定(auto)に。横スワイプ=行スクロール / 縦スワイプ=ページスクロール
        // をブラウザに判別させる。iOS の慣性スクロールも有効化。
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {videos.map((video) => (
          <div
            key={video.id}
            className="w-[44%] shrink-0 snap-center select-none sm:w-44 sm:snap-start lg:w-48"
          >
            <VideoCard video={video} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Arrow({
  dir,
  disabled,
  onClick,
}: {
  dir: "left" | "right";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "前へ" : "次へ"}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink transition-all duration-200 hover:bg-snow disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
