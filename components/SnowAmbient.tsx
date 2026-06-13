// 【3】雪のアンビエント演出。
// ヘッダー周辺に淡い雪粒が数粒、非常にゆっくり上→下へ流れる。
// 純CSS animation(transform/opacity のみ)で軽量。スマホでも軽快。
// 値はハードコード(Math.random不使用)でSSR/CSRのハイドレーション不一致を回避。

import type { CSSProperties } from "react";

interface Flake {
  left: string;
  size: string;
  dur: string;
  delay: string;
  drift: string;
  opacity: string;
}

// 各粒を非同期に。crossing は約19〜29秒(画面上部を横切るのに15〜30秒相当)。
const FLAKES: Flake[] = [
  { left: "12%", size: "3px", dur: "24s", delay: "-3s", drift: "12px", opacity: "0.30" },
  { left: "28%", size: "2px", dur: "29s", delay: "-14s", drift: "-9px", opacity: "0.24" },
  { left: "49%", size: "4px", dur: "19s", delay: "-7s", drift: "15px", opacity: "0.34" },
  { left: "68%", size: "3px", dur: "26s", delay: "-20s", drift: "-13px", opacity: "0.28" },
  { left: "85%", size: "2px", dur: "22s", delay: "-10s", drift: "8px", opacity: "0.22" },
];

export default function SnowAmbient() {
  return (
    <div className="snow-ambient" aria-hidden>
      {FLAKES.map((f, i) => (
        <span
          key={i}
          className="snow-particle"
          style={
            {
              "--snow-left": f.left,
              "--snow-size": f.size,
              "--snow-dur": f.dur,
              "--snow-delay": f.delay,
              "--snow-drift": f.drift,
              "--snow-opacity": f.opacity,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
