import { useEffect, useState } from 'react';
import { getUser } from '@/api/userApi';
import type { ShopItem } from '@/api/shopApi';

export default function Store() {
  const [shop, setShop] = useState<ShopItem | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    (async () => {
      const userResponse = await getUser(userId);
      setShop(userResponse.item.shop?.item ?? null);
    })();
  }, []);

  return (
    <>
      <section className="w-full bg-white px-12 py-40 md:px-32 md:py-60">
        <div className="mx-auto max-w-964"></div>
      </section>
      {shop && (
        <section className="w-full bg-gray-5 px-12 pt-40 pb-80 md:px-32 md:pt-60 md:pb-120">
          <div className="mx-auto max-w-964"></div>
        </section>
      )}
    </>
  );
}
