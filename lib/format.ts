// 表示用の整形ヘルパー(再生回数・投稿日)

/** 再生回数を日本語表記に(例: 12345 -> "1.2万回視聴") */
export function formatViews(count?: number): string {
  if (count === undefined) return "";
  if (count >= 100_000_000) {
    return `${trim(count / 100_000_000)}億回視聴`;
  }
  if (count >= 10_000) {
    return `${trim(count / 10_000)}万回視聴`;
  }
  return `${count.toLocaleString("ja-JP")}回視聴`;
}

/** 小数第1位まで、末尾の .0 は落とす */
function trim(n: number): string {
  return n.toFixed(1).replace(/\.0$/, "");
}

/** 投稿日を相対表記に(例: "3日前"、1年以上は "YYYY/M/D") */
export function formatPublished(iso: string, now: Date = new Date()): string {
  if (!iso) return "";
  const then = new Date(iso);
  const ms = now.getTime() - then.getTime();
  if (Number.isNaN(ms)) return "";

  const day = 86_400_000;
  const days = Math.floor(ms / day);

  if (days < 0) return "";
  if (days === 0) return "今日";
  if (days === 1) return "昨日";
  if (days < 7) return `${days}日前`;
  if (days < 31) return `${Math.floor(days / 7)}週間前`;
  if (days < 365) return `${Math.floor(days / 30)}か月前`;
  if (days < 730) return `${then.getFullYear()}/${then.getMonth() + 1}/${then.getDate()}`;
  return `${Math.floor(days / 365)}年前`;
}
