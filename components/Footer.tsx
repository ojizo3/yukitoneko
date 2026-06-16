// フッター

import { SITE } from "@/lib/config";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-8 text-xs text-sub sm:px-6">
        <p>
          {SITE.name}(yukitoneko)— 青森・雪国で暮らす猫たちの動画
        </p>
        <p>© {year} {SITE.name}</p>
      </div>
    </footer>
  );
}
