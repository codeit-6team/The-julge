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
      <section className="w-full bg-white"></section>
      {shop && <section className="w-full bg-gray-5"></section>}
    </>
  );
}
