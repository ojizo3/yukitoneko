// 商品 note の共通レンダラ。
//
// note 文字列の中の Markdown 風記法 [ラベル](値) だけをリンク化して返す。
// それ以外の文字はそのまま素通しするので、記法を含まない既存 note は
// 見た目が一切変わらない。
//
// 「値」の判定:
//   - http(s):// で始まる … 外部リンク(主にアフィリエイト)。
//       target="_blank" rel="sponsored noopener noreferrer" を付ける。
//   - それ以外(動画IDなど) … サイト内 /video/{値} への内部リンク。
//       next/link・同タブ・scroll={false}・rel 無し。
//
// スタイルは日記カードのトーンに合わせ、本文 serif の流れの中で控えめな
// 下線 + text-ink、hover で下線を濃く。

import { Fragment, type ReactNode } from "react";
import Link from "next/link";

// [ラベル](値) を捕まえる。ラベルは ] を含まない任意文字、値は ) を含まない任意文字。
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

// 本文の流れに馴染む控えめなリンク見た目(内部・外部で共通)。
const LINK_CLASS =
  "text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-ink";

/**
 * note 文字列を ReactNode 配列に変換する。
 * 記法 [ラベル](値) はリンクに、その他はテキストのまま返す。
 */
export function renderNote(note: string): ReactNode {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  LINK_RE.lastIndex = 0;
  while ((match = LINK_RE.exec(note)) !== null) {
    const [raw, label, value] = match;

    // 記法の手前にあるプレーンテキスト。
    if (match.index > lastIndex) {
      parts.push(
        <Fragment key={key++}>{note.slice(lastIndex, match.index)}</Fragment>,
      );
    }

    if (/^https?:\/\//i.test(value)) {
      // 外部リンク(アフィリエイト)。
      parts.push(
        <a
          key={key++}
          href={value}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className={LINK_CLASS}
        >
          {label}
        </a>,
      );
    } else {
      // 内部リンク(別の動画ページ)。
      parts.push(
        <Link
          key={key++}
          href={`/video/${value}`}
          scroll={false}
          className={LINK_CLASS}
        >
          {label}
        </Link>,
      );
    }

    lastIndex = match.index + raw.length;
  }

  // 末尾の残りテキスト。記法が1つも無ければここで note 全体がそのまま入る。
  if (lastIndex < note.length) {
    parts.push(<Fragment key={key++}>{note.slice(lastIndex)}</Fragment>);
  }

  return parts;
}
