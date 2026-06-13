# 雪と猫サイト 制作仕様書

> **作成日:** 2026-06-13  
> **プロジェクト名:** 雪と猫(yukitoneko)  
> **URL:** https://yukitoneko.jitozu.com  
> **目的:** YouTubeチャンネル「雪と猫」の公式サイト。Netflix風レイアウトで動画を一覧表示。

---

## 1. 概要

### コンセプト
- **ミニマル&シンプル**
- 白基調(雪らしい清潔感)
- YouTubeアプリと同等の視聴体験
- 「字と図(本業)」と「雪と猫(ライフ)」のブランド対構造

### ブランド設計
```
本業:字と図(jitozu.com)
ライフ:雪と猫(yukitoneko.jitozu.com)
```

---

## 2. 技術スタック(確定)

| 項目 | 採用技術 |
|---|---|
| フレームワーク | **Next.js 15(App Router)** |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| API | YouTube Data API v3 |
| ホスティング | Vercel(無料プラン) |
| ドメイン | yukitoneko.jitozu.com(サブドメイン、追加コスト0円) |
| データ管理 | YouTube側で再生リスト管理(サイト側は表示専用) |

### なぜこの構成か
- KANJI QUESTと同じスタック=Suu(漢字さんプロジェクト経由で)操作経験あり
- Vercel無料デプロイで追加コストゼロ
- YouTube側で動画管理すれば、サイトは自動更新

---

## 3. サイト構造

### 階層構成
```
yukitoneko.jitozu.com/
├── /(トップページ:全階層表示)
└── /api/youtube(YouTube APIプロキシ)
```

### 表示する4階層(横スクロール)

| # | 階層名 | データソース | 用途 |
|---|---|---|---|
| 1 | NEW | チャンネルの最新動画(自動取得) | 最新のUP |
| 2 | 猫 | 「猫」再生リスト | トラジ、でんぱ、野良猫など |
| 3 | 猫DIY | 「猫DIY」再生リスト | DIY系シリーズ |
| 4 | ずっと見てられる | 「ずっと見てられる」再生リスト | 長尺/未編集の癒し系 |

### 将来の拡張(再生リスト追加でサイトに自動反映)
- 風景(八甲田、田園、雪景色)
- 季節(春夏秋冬)

---

## 4. UI仕様

### PC版レイアウト
```
┌─────────────────────────────────────────┐
│  [雪と猫] ロゴ                            │
├─────────────────────────────────────────┤
│  NEW                                     │
│  ◁ [縦サムネ] [縦サムネ] [縦サムネ] ▷    │
├─────────────────────────────────────────┤
│  猫                                      │
│  ◁ [縦サムネ] [縦サムネ] [縦サムネ] ▷    │
├─────────────────────────────────────────┤
│  猫DIY                                   │
│  ◁ [縦サムネ] [縦サムネ] [縦サムネ] ▷    │
├─────────────────────────────────────────┤
│  ずっと見てられる                          │
│  ◁ [縦サムネ] [縦サムネ] [縦サムネ] ▷    │
└─────────────────────────────────────────┘
```

- 各階層、横一列に4〜5個の縦サムネ
- 左右の矢印(◁▷)でスクロール
- マウスドラッグでもスクロール可能

### スマホ版レイアウト
```
┌──────────────┐
│  [雪と猫]     │
├──────────────┤
│  NEW         │
│ [..][サムネ] │← 中央2列メイン
│   [サムネ][..]│  左右に半分見切れる
├──────────────┤
│  猫          │
│ [..][サムネ] │
│   [サムネ][..]│
└──────────────┘
```

- 中央に縦サムネ2列がメイン表示
- 左右に次/前の動画が半分見切れる
- スワイプで横スクロール

### サムネ仕様
- **縦比率**:9:16(ショート動画前提)
- **サムネ画像**:YouTube APIから取得(maxres推奨)
- **サムネ下表示**:
  - タイトル(1〜2行で省略、`line-clamp-2`)
  - 再生回数 + 投稿日(小さく、グレー)

### クリック時の挙動
- **サイト内モーダルでYouTube埋め込み再生**
- iframeで実体はYouTubeプレーヤー
- 再生数・視聴維持率はYouTubeアナリティクスにカウント
- モーダル外クリックまたは×ボタンで閉じる

### カラー&トーン
- **背景**:白(`#FFFFFF`)
- **メインテキスト**:濃いグレー(`#1A1A1A`)
- **サブテキスト**:中グレー(`#666666`)
- **アクセント**:雪をイメージした淡いブルー(`#E8F1F8`、控えめに)
- **フォント**:Noto Sans JP(日本語)+ Inter(英数)

### アニメーション
- ホバー時、サムネが軽く拡大(`scale-105`)
- モーダルはフェードイン
- 全体的に控えめなトランジション(`transition-all duration-200`)

---

## 5. YouTube Data API v3 連携

### 必要なAPI
1. **search.list** または **playlistItems.list**(再生リストの動画取得)
2. **channels.list**(チャンネル最新動画)
3. **videos.list**(再生回数・投稿日など詳細情報)

### APIキー取得
- Google Cloud Consoleで取得
- 1日あたり10,000ユニットの無料枠あり(個人サイトには十分)
- `.env.local`に保存:`YOUTUBE_API_KEY=xxxx`

### キャッシュ戦略
- API呼び出しは1時間キャッシュ(ISR:Incremental Static Regeneration)
- Vercelの無料枠で十分動く
- 動画アップ後、最大1時間以内にサイト反映

### 再生リストID取得方法
1. YouTubeで再生リストを開く
2. URLの `list=` 以降の文字列がID
3. 例:`https://www.youtube.com/playlist?list=PLxxxxxxxxxxxxxxxx`

---

## 6. ファイル構造

```
yukitoneko/
├── app/
│   ├── layout.tsx          # 全体レイアウト
│   ├── page.tsx            # トップページ
│   ├── globals.css         # グローバルCSS
│   └── api/
│       └── youtube/
│           └── route.ts    # YouTube API プロキシ
├── components/
│   ├── Header.tsx          # ロゴヘッダー
│   ├── VideoRow.tsx        # 横スクロール1階層
│   ├── VideoCard.tsx       # サムネカード
│   ├── VideoModal.tsx      # モーダル再生
│   └── Footer.tsx          # フッター
├── lib/
│   ├── youtube.ts          # YouTube API呼び出し関数
│   └── config.ts           # 再生リストIDなどの設定
├── types/
│   └── video.ts            # 型定義
├── public/
│   └── logo.svg            # 雪と猫ロゴ(後で差し替え)
├── .env.local              # 環境変数(API KEY)
├── next.config.js
├── tailwind.config.ts
├── package.json
└── README.md
```

---

## 7. セットアップ手順(MacBook で実行)

### 前提条件
- Node.js v18以上インストール済み
- Git使用可能
- GitHubアカウントあり
- Vercelアカウントあり
- YouTube Data API v3 のAPIキー取得済み

### Step 1:プロジェクト作成
```bash
cd ~/Desktop/Lab(または任意の場所)
npx create-next-app@latest yukitoneko --typescript --tailwind --app --no-src-dir
cd yukitoneko
```

### Step 2:依存パッケージのインストール
```bash
npm install
# 追加で必要なものは Claude Code が判断
```

### Step 3:環境変数の設定
`.env.local`を作成:
```
YOUTUBE_API_KEY=取得したAPIキー
YOUTUBE_CHANNEL_ID=雪と猫チャンネルのID
PLAYLIST_CAT=猫再生リストのID
PLAYLIST_CAT_DIY=猫DIY再生リストのID
PLAYLIST_RELAX=ずっと見てられる再生リストのID
```

### Step 4:Claude Code で実装開始
```bash
# プロジェクト直下で
claude
```

最初のプロンプトでこの仕様書を読ませる:
```
この yukitoneko プロジェクトを、添付の仕様書通りに実装してください。
仕様書:〜〜〜(このmdファイルの内容を貼る)〜〜〜
```

### Step 5:ローカルで動作確認
```bash
npm run dev
# http://localhost:3000 で確認
```

### Step 6:GitHubにプッシュ
```bash
git init
git add .
git commit -m "雪と猫サイト 初回コミット"
git remote add origin https://github.com/ユーザー名/yukitoneko.git
git push -u origin main
```

### Step 7:Vercelデプロイ
1. Vercel管理画面で「Import Project」
2. GitHub の yukitoneko リポジトリを選択
3. 環境変数(YOUTUBE_API_KEY等)を設定
4. デプロイ

### Step 8:サブドメイン設定
1. Vercel管理画面で「Domains」
2. `yukitoneko.jitozu.com` を追加
3. jitozu.com 側のDNS設定にCNAMEレコード追加(スパイダさんに相談)
   ```
   yukitoneko CNAME cname.vercel-dns.com.
   ```

---

## 8. 編集・運用フロー

### 普段の運用
1. YouTubeに動画をアップロード
2. 該当する再生リストに追加
3. **サイトは自動更新(何もしない)**

### サイトの見た目を変えたい時
1. MacBookで `yukitoneko` プロジェクトを開く
2. Claude Code を起動
3. 「ここのデザインを〇〇に変えて」と指示
4. ローカルで確認
5. `git push` で Vercel が自動デプロイ

### 再生リストを追加したい時
1. YouTubeで新しい再生リストを作る
2. `.env.local` と `lib/config.ts` に追加
3. `components/VideoRow.tsx` を増設(Claude Codeに依頼)
4. `git push`

---

## 9. SEO対策

### 基本設定
- メタタグ自動生成(タイトル、説明、OGP画像)
- 構造化データ(JSON-LD)で動画リッチカード表示
- サイトマップ自動生成(`sitemap.xml`)
- robots.txt
- Canonical URL設定

### キーワード戦略
ターゲットキーワード:
- 青森 猫
- 猫 DIY 動画
- 雪国 猫 暮らし
- Aomori cat(英語圏)
- 八甲田 猫
- 雪 猫 癒し

### 追加で検討
- Google Search Console登録
- Google Analytics 4 設置
- スパイダさんにSEO診断を依頼

---

## 10. 将来の拡張アイデア

### Phase 1(初版)
- 動画一覧表示
- モーダル再生
- レスポンシブ対応

### Phase 2(運用しながら)
- 風景・季節の再生リスト追加
- 英語/日本語切り替え
- グッズ紹介ページ(将来マネタイズ)
- でんぱ・トラジのキャラ紹介ページ

### Phase 3(コミュニティ化)
- コメント機能(Disqusなど埋め込み)
- ファンアート紹介
- ニュースレター登録

---

## 11. 注意点・既知の制約

### YouTube API の制約
- 1日あたり10,000ユニットまで(個人サイトなら十分)
- リクエスト頻度に注意(キャッシュ必須)

### 動画の埋め込み制限
- YouTubeで「埋め込み許可」をONにしておくこと(デフォルトON)
- 一部の音楽が含まれる動画は埋め込みエラーになることあり

### Vercelの無料プラン制限
- 月100GBの帯域(個人サイトなら十分)
- サーバーレス関数の実行時間制限あり
- 商用利用も無料枠内ならOK

---

## 12. 「雪と猫」ロゴについて

### 現状
- 暫定ロゴ(テキストのみ)で開始
- 後日、Suuがデザインしたロゴに差し替え

### ロゴ仕様(将来差し替え時)
- SVG形式推奨
- 白背景でも黒背景でも映えるデザイン
- 雪+猫のモチーフ
- 字と図ロゴとペア感を出す

---

## 改訂履歴

- **2026-06-13** 初版作成。Next.js + YouTube API + Vercel構成で確定。
