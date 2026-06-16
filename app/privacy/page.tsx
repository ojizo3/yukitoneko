// プライバシーポリシー(/privacy)
// 個人運営サイト向けの最小限の雛形。アクセス解析・将来の広告/アフィリエイト利用を記載。
// 内容は Suu が運用実態に合わせて加筆・修正してください。

import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/config";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: `${SITE.name}のプライバシーポリシー。アクセス解析や広告・アフィリエイトの取り扱いについて。`,
  alternates: { canonical: "/privacy" },
  openGraph: {
    type: "article",
    title: `プライバシーポリシー | ${SITE.name}`,
    description: `${SITE.name}のプライバシーポリシー。`,
    url: `${SITE.url}/privacy`,
    locale: "ja_JP",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />

      <main className="flex-1">
        <article className="mx-auto max-w-2xl px-5 py-16 sm:px-6 sm:py-20">
          <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            プライバシーポリシー
          </h1>

          <div className="mt-8 space-y-8 text-[15px] leading-8 text-ink/90">
            <p>
              「{SITE.name}」(以下「当サイト」)は、個人が運営する動画紹介サイトです。
              当サイトをご利用いただく際の個人情報・データの取り扱いについて、
              以下のとおり定めます。
            </p>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink">1. 取得する情報</h2>
              <p>
                当サイトは、お名前・メールアドレス等の個人情報をフォーム等で
                直接取得することはありません。閲覧時に、アクセス解析や広告配信のために
                Cookie・端末情報・閲覧ログ等が自動的に収集される場合があります。
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink">2. アクセス解析</h2>
              <p>
                当サイトでは、サイトの利用状況を把握するためにアクセス解析ツールを
                利用する場合があります。これらのツールは Cookie を使用して匿名の
                トラフィックデータを収集します。データは統計的に処理され、個人を
                特定するものではありません。ブラウザの設定により Cookie の利用を
                無効にすることができます。
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink">
                3. 広告・アフィリエイトについて
              </h2>
              <p>
                当サイトでは、将来的に第三者配信の広告サービスやアフィリエイト
                プログラムを利用する場合があります。その際、広告事業者が
                Cookie 等を利用して、ユーザーの興味に応じた広告を表示することが
                あります。利用を開始した場合は、本ポリシーに事業者名や詳細を
                追記します。
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink">4. 外部サービス</h2>
              <p>
                当サイトの動画は YouTube の埋め込みプレーヤーを通じて配信されます。
                再生時には YouTube(Google LLC)に対して情報が送信される場合が
                あります。詳細は各サービスのプライバシーポリシーをご確認ください。
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink">5. 免責事項</h2>
              <p>
                当サイトに掲載する情報の正確性には努めますが、その内容を保証する
                ものではありません。当サイトの利用によって生じた損害について、
                運営者は一切の責任を負いかねます。
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-ink">6. 改定</h2>
              <p>
                本ポリシーは、必要に応じて予告なく変更されることがあります。
                変更後の内容は、当ページに掲載した時点で効力を生じるものとします。
              </p>
            </section>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}
