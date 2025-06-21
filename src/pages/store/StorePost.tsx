import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getShopNotice, type NoticeDetailItem } from '@/api/noticeApi';
import Footer from '@/components/layout/Footer';

export default function StorePost() {
  const { shopId, noticeId } = useParams();
  const [notice, setNotice] = useState<NoticeDetailItem>();

  useEffect(() => {
    if (!shopId || !noticeId) return;

    (async () => {
      const { item } = await getShopNotice(shopId, noticeId);
      setNotice(item);
    })();
  }, [shopId, noticeId]);

  return (
    <div className="flex min-h-[calc(100vh-108px)] flex-col justify-between bg-gray-5 md:min-h-[calc(100vh_-_70px)]">
      <section className="w-full px-12 py-40 md:px-32 md:py-60">
        <div>
          <div className="mb-8 text-body2/17 font-bold text-primary md:text-body1/20">
            식당
          </div>
          <h1 className="text-h3/24 font-bold text-black md:text-h1/34 md:text-[#000]">
            {notice?.shop.item.name}아
          </h1>
        </div>
      </section>
      <section className="w-full flex-1 px-12 pt-40 pb-80 md:px-32 md:py-60">
        <h1 className="text-h3/24 font-bold text-black md:text-h1/42 md:text-[#000]">
          신청자 목록
        </h1>
      </section>
      <Footer />
    </div>
  );
}
