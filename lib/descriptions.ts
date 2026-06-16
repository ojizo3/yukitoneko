// サイト独自の動画解説文。
//
// 当面は YouTube 側の description をそのまま表示するが、ここに動画IDをキーにして
// 解説文を書いておくと、その動画ページではこちらが優先表示される(SEO・読みやすさ用)。
//
// 使い方:
//   1. 動画ページURL末尾の動画ID(例: /video/AbCdEf12345 の "AbCdEf12345")をキーに
//   2. 値に独自の紹介文・解説文を書く(改行可。テンプレートリテラル `...` 推奨)
//   3. 保存して push すれば、その動画ページの本文・メタ・構造化データに反映される
//
// 例:
//   export const VIDEO_DESCRIPTIONS: Record<string, string> = {
//     "AbCdEf12345": `雪の朝、トラジが窓辺で日向ぼっこ。…`,
//   };

export const VIDEO_DESCRIPTIONS: Record<string, string> = {
  // ここに videoId: "解説文" を追記してください。
};

/**
 * 独自解説文を取得する。
 * 登録があればそれを、なければ fallback(= YouTube の description 等)を返す。
 */
export function getDescription(id: string, fallback?: string): string {
  const own = VIDEO_DESCRIPTIONS[id]?.trim();
  return own || fallback?.trim() || "";
}
