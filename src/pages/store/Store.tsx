import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '@/api/userApi';
import type { ShopItem } from '@/api/shopApi';
import { getShopNotices, type NoticeInfo } from '@/api/noticeApi';
import Modal from '@/components/common/Modal';

const NOTICES_LIMIT = 12;

export default function Store() {
  const navigate = useNavigate();
  const [shop, setShop] = useState<ShopItem | null>(null);
  const [notices, setNotices] = useState<NoticeInfo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const noticesOffset = useRef(0);

  const handleClose = () => {
    if (modalContent.startsWith('로그인')) {
      navigate('/login');
    } else {
      setIsModalOpen(false);
    }
  };

  const loadNotices = async () => {
    if (!shop || noticesOffset.current < 0) return;
    const noticesResponse = await getShopNotices(shop.id, {
      offset: noticesOffset.current,
      limit: NOTICES_LIMIT,
    });
    setNotices((prev) => [...prev, ...noticesResponse.items]);
    if (noticesResponse.hasNext) noticesOffset.current += NOTICES_LIMIT;
    else noticesOffset.current = -1;
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setIsModalOpen(true);
      setModalContent('로그인이 필요합니다.');
      return;
    }

    try {
      (async () => {
        const userResponse = await getUser(userId);
        setShop(userResponse.item.shop?.item ?? null);
      })();
    } catch (error) {
      setIsModalOpen(true);
      setModalContent((error as Error).message);
    }
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
          {modalContent}
        </Modal>
      )}
    </>
  );
}
