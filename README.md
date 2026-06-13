# 雪と猫(yukitoneko)

YouTubeチャンネル「雪と猫」の公式サイト。青森・雪国で暮らす猫たちの動画を、
白基調・ミニマルな Netflix 風レイアウトで一覧表示します。

- **公開URL:** https://yukitoneko.jitozu.com
- **技術:** Next.js 16(App Router)/ TypeScript / Tailwind CSS v4 / YouTube Data API v3
- **ホスティング:** Vercel(無料プラン)
- **本業サイト:** [字と図(jitozu.com)](https://jitozu.com)

## できること

- チャンネルの動画を5階層(NEW / 猫の日常 / 猫DIY / 実験ショート / ずっとみてられる)で横スクロール表示
- サムネをタップ/クリックすると動画専用ページ `/video/[id]` に遷移して再生
- PC・スマホ対応(スマホは中央2列メイン+左右見切れ、スワイプでスクロール)
- YouTube側で再生リストを管理 → サイトは自動更新(最大1時間で反映)

## ローカル開発

```bash
# 1. 依存をインストール
npm install

# 2. 環境変数を用意(.env.local を作成)
cp .env.local.example .env.local
#    → .env.local の YOUTUBE_API_KEY に
#      Google Cloud Console で取得した YouTube Data API v3 のキーを貼る

# 3. 開発サーバー起動
npm run dev
```

ブラウザで http://localhost:3000 を開く。
同一Wi-Fiのスマホ実機からは `http://<MacのLAN IP>:3000`(例: http://192.168.1.239:3000)。

### スクリプト

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバー(ホットリロード) |
| `npm run build` | 本番ビルド |
| `npm run start` | 本番ビルドをローカルで起動(`build` 後) |
| `npm run lint` | ESLint |

## 環境変数

| 変数 | 用途 | 秘密 |
|---|---|---|
| `YOUTUBE_API_KEY` | YouTube Data API v3 のキー | **🔑 必須・秘密** |
| `YOUTUBE_CHANNEL_ID` | チャンネルID。NEW行(最新アップロード)の取得に使用 | 公開 |
| `PLAYLIST_CAT_DAILY` | 「猫の日常」再生リストID | 公開 |
| `PLAYLIST_CAT_DIY` | 「猫DIY」再生リストID | 公開 |
| `PLAYLIST_EXPERIMENT` | 「実験ショート(食・モノ)」再生リストID | 公開 |
| `PLAYLIST_RELAX` | 「ずっとみてられる」再生リストID | 公開 |

チャンネルID・再生リストIDは公開情報のため `.env.local.example` に初期値を入れてあります。
秘密にする必要があるのは `YOUTUBE_API_KEY` だけで、`.env.local` は `.gitignore` 済み(コミットされません)。

## 仕組み

- データはサーバー側(Server Component)で YouTube API から直接取得し、**1時間ISRキャッシュ**。
  動画アップ後、最大1時間以内にサイトへ反映されます(運用中は何もしなくてOK)。
- API消費を抑えるため `search.list`(100ユニット)は使わず、
  `playlistItems.list` →(動画ID)→ `videos.list` の流れで取得しています(1ロード約10ユニット / 1日10,000枠)。
- サムネは `<Link>` でラップし、`/video/[id]` ページへ遷移して YouTube iframe で再生
  (再生数・視聴維持率は YouTube 側にカウント)。モーダルではなくページ遷移にすることで
  iOS Safari のタッチ問題を構造的に回避しています。

## 構成

```
app/
  layout.tsx        # 全体レイアウト・フォント・メタデータ
  page.tsx          # トップ(5階層を表示)
  video/[id]/page.tsx  # 動画専用ページ(iframe再生・説明・構造化データ)
  about/page.tsx    # About
  sitemap.ts  robots.ts  globals.css
components/
  Header.tsx  Footer.tsx  VideoRow.tsx  VideoCard.tsx
  SnowAmbient.tsx  SocialIcons.tsx
lib/
  config.ts         # 階層(ROWS)・サイト情報の定義
  youtube.ts        # YouTube API 呼び出し
  format.ts         # 再生回数・投稿日の整形
types/video.ts
```

## 行(階層)の追加方法

1. YouTube で新しい再生リストを作る
2. `.env.local` と `.env.local.example`(と Vercel の環境変数)に `PLAYLIST_XXX=...` を追加
3. `lib/config.ts` の `ROWS` 配列に1要素足す

→ トップページに新しい横スクロール行が自動で増えます。

## デプロイ(Vercel)

1. GitHub にプッシュ
2. Vercel で「Import Project」→ このリポジトリを選択
3. 環境変数(上表の6つ)を **Production / Preview / Development** に設定
4. Deploy
5. Domains で `yukitoneko.jitozu.com` を追加し、jitozu.com 側のDNSに CNAME を設定:
   ```
   yukitoneko  CNAME  cname.vercel-dns.com.
   ```

> Next.js は Vercel が自動検出するため `vercel.json` は不要です。

## 開発メモ

- ロゴは暫定(テキスト+雪結晶アイコン)。後日 SVG ロゴに差し替え予定。
- 配色・フォントなどのトークンは `app/globals.css` の `@theme` に集約。
