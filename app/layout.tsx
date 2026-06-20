import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { SITE } from "@/lib/config";

// 英数: Inter
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// 日本語: Noto Sans JP(CJKは大きいので preload しない)
const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-jp",
  weight: ["400", "500", "700"],
  preload: false,
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | 雪国で暮らす猫たちの動画`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "青森 猫",
    "猫 DIY 動画",
    "雪国 猫 暮らし",
    "Aomori cat",
    "八甲田 猫",
    "雪 猫 癒し",
    "雪と猫",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} | 雪国で暮らす猫たちの動画`,
    description: SITE.description,
    url: SITE.url,
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | 雪国で暮らす猫たちの動画`,
    description: SITE.description,
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  // @modal パラレルスロット。動画モーダルの器(非表示時は @modal/default.tsx の null)。
  modal: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${inter.variable} ${notoSansJP.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        {children}
        {modal}
        {/* GA4。@next/third-parties が gtag を最適タイミングで読み込む。 */}
        <GoogleAnalytics gaId="G-KM79PJE7BM" />
      </body>
    </html>
  );
}
