// 右上のSNSアイコン群。
// 通常はモノクロ(濃いグレー)、ホバー時だけ各SNSのブランドカラーが付く。
// 色は config の SOCIALS.hoverColor を CSS変数 --hov に渡し、
// hover:text-[var(--hov)] で反映している(Tailwindの静的クラスのまま動的色に対応)。

import type { CSSProperties } from "react";
import { SOCIALS, type SocialLink } from "@/lib/config";

// --- 各SNSのグリフ(currentColor で塗り/線が変わる) ---

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-5 w-5">
      <path
        d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="m10 15 5-3-5-3z" fill="currentColor" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-[18px] w-[18px]">
      <path
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
        fill="currentColor"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="h-5 w-5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" strokeDasharray="3 3" />
      <path d="M12 8.5v7M8.5 12h7" />
    </svg>
  );
}

const ICONS: Record<string, () => React.ReactElement> = {
  youtube: YouTubeIcon,
  instagram: InstagramIcon,
  x: XIcon,
};

function SocialAnchor({ social }: { social: SocialLink }) {
  const Icon = ICONS[social.key];
  // 暫定リンク(#)は新規タブを開かず、その場リンク扱い
  const isPlaceholder = social.href === "#";

  return (
    <a
      href={social.href}
      aria-label={social.label}
      title={social.label}
      target={isPlaceholder ? undefined : "_blank"}
      rel={isPlaceholder ? undefined : "noopener noreferrer"}
      style={{ ["--hov" as string]: social.hoverColor } as CSSProperties}
      className="flex h-9 w-9 items-center justify-center rounded-full text-[#4a4a4a] transition-colors duration-200 hover:bg-line/60 hover:text-[var(--hov)]"
    >
      {Icon ? <Icon /> : null}
    </a>
  );
}

export default function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-0.5 sm:gap-1 ${className}`}>
      {SOCIALS.map((social) => (
        <SocialAnchor key={social.key} social={social} />
      ))}

      {/* 将来のSNS追加用プレースホルダ枠 */}
      <span
        aria-hidden
        title="今後追加予定"
        className="flex h-9 w-9 items-center justify-center rounded-full text-line transition-colors duration-200 hover:text-sub"
      >
        <PlusIcon />
      </span>
    </div>
  );
}
