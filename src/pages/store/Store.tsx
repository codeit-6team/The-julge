import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '@/api/userApi';
import type { ShopItem } from '@/api/shopApi';
import Modal from '@/components/common/Modal';

export default function Store() {
  const navigate = useNavigate();
  const [shop, setShop] = useState<ShopItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClose = () => {
    navigate('/login');
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setIsModalOpen(true);
      return;
    }
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
      {isModalOpen && (
        <Modal onButtonClick={handleClose} onClose={handleClose}>
          로그인이 필요합니다.
        </Modal>
      )}
    </>
  );
}
