// Aboutページ(/about)
// 白基調・シンプル。ヘッダーのロゴクリックでトップへ戻れる(Header側で対応済み)。
//
// ▼▼ 本文は仮置きです。確定テキストをもらったら <article> 内を差し替えてください ▼▼

import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "About",
  description: `${SITE.name}について。青森・雪国で暮らす猫たちの動画チャンネルの紹介ページです。`,
  alternates: { canonical: "/about" },
  openGraph: {
    type: "article",
    title: `About | ${SITE.name}`,
    description: `${SITE.name}について。`,
    url: `${SITE.url}/about`,
    locale: "ja_JP",
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        <article className="mx-auto max-w-2xl px-5 py-16 sm:px-6 sm:py-20">
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            About
          </h1>

          {/* ── ここから仮テキスト(確定次第差し替え) ── */}
          <div className="mt-8 space-y-6 text-[15px] leading-8 text-ink/90">
            <p>
              「{SITE.name}」は、青森・雪国で暮らす猫たちの日常を記録した
              YouTubeチャンネルです。
            </p>
            <p>
              猫DIY、実験ショート、ずっと見ていられる癒しの映像など、
              雪国ならではの静かな時間をお届けしています。
            </p>
            <p className="text-sm text-sub">
              ※ この文章は仮のものです。正式な紹介文を差し替えてください。
            </p>
          </div>
          {/* ── 仮テキストここまで ── */}
        </article>
      </main>

      <Footer />
    </>
  );
}
