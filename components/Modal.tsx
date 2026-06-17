"use client";

// 動画モーダルのガワ(オーバーレイ + 閉じる挙動 + スクロール保持)。
//
// 中身(プレイヤー・タイトル・商品など)は children として受け取り、
// このコンポーネントは「表示の器」と「閉じ方」「スクロール位置の死守」だけを担う。
//
// 閉じ方は4経路すべて対応:
//   ×ボタン / 背景タップ / Escキー → router.back()
//   ブラウザ戻る・Android ハードバック・iOS 戻るスワイプ → 履歴 pop でアンマウント
// いずれも最終的に「アンマウント → スクロール復元」に収束する。
//
// スクロール保持(最重要):
//   mount 時に window.scrollY を保存し、body を position:fixed; top:-y で固定する。
//   top:-y なので見た目は一切ズレず、背景スクロールだけロックされる
//   (iOS Safari は overflow:hidden が効かないため、この方式が必須)。
//   unmount 時に body を解除し window.scrollTo(0, y) でピクセル単位に復元する。

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);

  // 背景スクロールのロックと、閉じたときの厳密な位置復元。
  // 依存配列なし = mount で1回ロック、unmount で1回復元。
  useEffect(() => {
    const body = document.body;
    const scrollY = window.scrollY;

    // 復元用に元の style を退避してから固定する。
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      // style を元に戻し、ロック中に消えていたスクロールを厳密に復元。
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Esc で閉じる。
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") router.back();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [router]);

  // 背景(オーバーレイ自身)のタップ/クリックでのみ閉じる。
  // 中身カードのクリックは伝播で閉じないよう、ターゲット一致を確認。
  const onOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) router.back();
  };

  return (
    <div
      ref={overlayRef}
      onClick={onOverlayClick}
      role="dialog"
      aria-modal="true"
      className="animate-fade-in fixed inset-0 z-50 flex items-start justify-center overflow-y-auto overscroll-contain bg-black/60 p-4 sm:items-center sm:p-6"
    >
      {/* 中身カード。白基調・角丸・余白広め。縦に伸びてもカード内でスクロール。 */}
      <div className="relative my-auto w-full max-w-lg rounded-xl bg-bg shadow-xl">
        {/* ×ボタン(右上)。控えめなモノトーン。 */}
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="閉じる"
          className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-bg/80 text-sub backdrop-blur transition-colors hover:text-ink"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* 中身はカード内スクロール(画面高を超えても破綻しない)。 */}
        <div className="max-h-[90vh] overflow-y-auto overscroll-contain rounded-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
