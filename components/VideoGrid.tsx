// カテゴリー全動画ページ用のグリッド。
//
// トップの横スクロール行(VideoRow)とは別物だが、カードは既存 VideoCard を
// そのまま流用してデザイン・挙動(呼吸アニメ・/video/[id] 遷移・モーダル連携)を
// 完全に統一する。スマホ2列→広がるほど列を増やす素直なレスポンシブ。

import type { Video } from "@/types/video";
import VideoCard from "@/components/VideoCard";

export default function VideoGrid({ videos }: { videos: Video[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 lg:grid-cols-4 xl:grid-cols-5">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}
