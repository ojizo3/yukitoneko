// ロゴヘッダー(暫定テキストロゴ。後日 Suu デザインの SVG に差し替え)
// レイアウト: ロゴ=左 / ナビ=中央 / SNS=右。
// スマホではナビをハンバーガーメニューに収納する。
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE, NAV } from "@/lib/config";
import SocialIcons from "@/components/SocialIcons";
import SnowAmbient from "@/components/SnowAmbient";

// 雪の結晶モチーフ(暫定ロゴマーク)
function LogoMark() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="text-sub"
    >
      <path
        d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur">
      {/* 【3】ヘッダー周辺の雪(背面・操作を妨げない) */}
      <SnowAmbient />

      <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        {/* 左: ロゴ(クリックでトップへ) */}
        <div className="flex flex-1 justify-start">
          <Link
            href="/"
            aria-label={`${SITE.name} ホームへ`}
            className="flex items-center gap-2"
            onClick={() => setOpen(false)}
          >
            <LogoMark />
            <span className="text-lg font-bold tracking-tight text-ink">
              {SITE.name}
            </span>
          </Link>
        </div>

        {/* 中央: ナビ(md以上で表示) */}
        <nav className="hidden flex-1 justify-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`text-sm transition-colors hover:text-ink ${
                isActive(item.href)
                  ? "font-medium text-ink"
                  : "text-sub"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* 右: SNS + ハンバーガー */}
        <div className="flex flex-1 items-center justify-end gap-1">
          <SocialIcons />
          <button
            type="button"
            aria-label="メニュー"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-ink transition-colors hover:bg-line/60 md:hidden"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* モバイル用ドロップダウンナビ */}
      {open && (
        <nav className="border-t border-line bg-bg md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`rounded-md px-2 py-3 text-sm transition-colors hover:bg-line/50 ${
                  isActive(item.href)
                    ? "font-medium text-ink"
                    : "text-sub"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
