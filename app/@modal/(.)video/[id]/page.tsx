// インターセプター: 一覧などから /video/[id] へ soft navigation したとき、
// フルページに遷移せず、この場でモーダルを開く。
//
// (.) は「同レベルのセグメントを横取り」の意味。@modal はスロット(セグメントではない)
// ため、ここは app 直下を基準に root レベルの video を捕まえる = 同レベル → (.) が正しい。
//
// 直アクセス・リロード・Google経由は @modal/default.tsx(null)が効き、ここは通らない。
// したがってフルページ(app/video/[id]/page.tsx)とそのSEO資産は一切影響を受けない。

import Modal from "@/components/Modal";
import VideoModalBody from "@/components/VideoModalBody";
import { getVideo } from "@/lib/youtube";
import { getProducts } from "@/lib/products";

// フルページと同じ1時間ISR方針。
export const revalidate = 3600;

type Params = { params: Promise<{ id: string }> };

export default async function VideoModalPage({ params }: Params) {
  const { id } = await params;
  const video = await getVideo(id);

  // 取得できなければモーダルを出さない(背後の一覧はそのまま)。
  if (!video) return null;

  return (
    <Modal>
      <VideoModalBody video={video} products={getProducts(id)} />
    </Modal>
  );
}
