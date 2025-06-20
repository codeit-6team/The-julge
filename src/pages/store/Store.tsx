import { useCallback, useEffect, useRef, useState } from 'react';
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
  const noticesOffset = useRef(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [isLoading, setIsLoading] = useState<boolean | 'error'>(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    if (modalContent.startsWith('로그인')) {
      navigate('/login');
    } else {
      setIsModalOpen(false);
    }
  }, [navigate, modalContent]);

  const loadNotices = useCallback(async () => {
    if (!shop || noticesOffset.current < 0) return;
    setIsLoading(true);
    try {
      const noticesResponse = await getShopNotices(shop.id, {
        offset: noticesOffset.current,
        limit: NOTICES_LIMIT,
      });
      setNotices((prev) => [...prev, ...noticesResponse.items]);
      if (noticesResponse.hasNext) noticesOffset.current += NOTICES_LIMIT;
      else noticesOffset.current = -1;
      setIsLoading(false);
    } catch {
      setIsLoading('error');
    }
  }, [shop]);

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

  // 무한 스크롤
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          loadNotices();
        }
      },
      {
        rootMargin: '300px',
      },
    );

    const { current } = observerRef;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [loadNotices, isLoading]);

  return (
    <>
      <section className="w-full bg-white px-12 py-40 md:px-32 md:py-60">
        <div className="mx-auto max-w-964">
          <h1 className="mb-16 text-h1/34 font-bold md:mb-24">내 가게</h1>
        </div>
      </section>
      {shop && (
        <section className="w-full bg-gray-5 px-12 pt-40 pb-80 md:px-32 md:pt-60 md:pb-120">
          <div className="mx-auto max-w-964">
            <h1 className="mb-16 text-h1/34 font-bold md:mb-32">
              {notices[0] && '내가 '}등록한 공고
            </h1>
          </div>
          {/* 스크롤 감지 요소 */}
          <div
            className="text-center text-caption text-gray-30"
            ref={observerRef}
          >
            {isLoading === 'error'
              ? '데이터를 불러오는데 실패했습니다.'
              : isLoading && '로딩 중...'}
          </div>
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
