// Aboutページ(/about)
// 白基調・シンプル。ヘッダーのロゴクリックでトップへ戻れる(Header側で対応済み)。

import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE, OG_IMAGE } from "@/lib/config";

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
    images: [OG_IMAGE],
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

          <div className="mt-8 space-y-6 text-[15px] leading-8 text-ink/90">
            <p>
              「{SITE.name}」は、青森・雪国で暮らす猫たちの日常を記録した
              動画日記です。一緒に暮らして役に立った猫DIY、実験集、
              ずっと見ていられる癒しの映像など、
              雪国ならではの静かな時間と猫(トラジ)を多めにお届けしています。
            </p>
            <p>
              少しでも小さな癒しになれば幸いです。
              みなさまからコメント・反応をお待ちしております。(YouTubeの方に)
            </p>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
