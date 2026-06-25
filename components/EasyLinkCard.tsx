// もしもアフィリエイト「かんたんリンク」(EasyLink)1枚を描画するクライアント専用コンポーネント。
//
// EasyLink は もしも配布の <script> による動的 DOM 挿入で動く仕組み。
// React の dangerouslySetInnerHTML では <script> が実行されないため、
// コード全文を一旦 <template> に流し込み、<script> 要素だけ作り直して実行させる
// (「innerHTML 内の <script> を動かす」定石の手法)。
//
//   - bundle.js は もしも公式スニペット内の id="msmaflink" 重複ガードにより
//     1回しか挿入されない(複数カード共存・ページ遷移でも二重読み込みされない)。
//   - Strict Mode による useEffect の二重実行は ranRef で1回に抑える。
//   - 描画先 <div id="msmaflink-xxx"> はスクリプト実行前に DOM へ入るので、
//     bundle.js は確実に対象 div を見つけられる。

"use client";

import { useEffect, useRef } from "react";

export default function EasyLinkCard({ html }: { html: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const ranRef = useRef(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || ranRef.current || !html) return;
    ranRef.current = true;

    // EasyLink コード全文を template にパースして中身を取り出す。
    const template = document.createElement("template");
    template.innerHTML = html;

    // まず <script> 以外(描画先 <div id="msmaflink-xxx"> など)も含めて差し込む。
    host.appendChild(template.content);

    // innerHTML/template 経由の <script> は実行されないので、
    // 同じ位置に新しい <script> を作り直して実行させる。
    host.querySelectorAll("script").forEach((old) => {
      const script = document.createElement("script");
      if (old.src) {
        script.src = old.src;
      } else {
        script.textContent = old.textContent;
      }
      if (old.type) script.type = old.type;
      old.replaceWith(script);
    });
  }, [html]);

  return <div ref={hostRef} />;
}
