import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser } from '@/api/userApi';
import type { ShopItem } from '@/api/shopApi';
import { getShopNotices, type NoticeInfo } from '@/api/noticeApi';
import Modal from '@/components/common/Modal';
import RegisterLayout from '@/components/layout/RegisterLayout';
import Button from '@/components/common/Button';
import ic_location from '@/assets/icons/location-red.svg';
import Post from '@/components/common/Post';
import Footer from '@/components/layout/Footer';

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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

  // 반응형
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-108px)] flex-col justify-between md:min-h-[calc(100vh_-_70px)]">
      <section className="w-full bg-white px-12 py-40 md:px-32 md:py-60">
        <div className="mx-auto max-w-964">
          <h1 className="mb-16 text-h1/34 font-bold md:mb-24">내 가게</h1>
          {shop ? (
            <div className="flex min-h-356 flex-col items-stretch justify-between rounded-xl bg-red-10 p-20 md:p-24 lg:flex-row">
              <div
                className="h-178 rounded-xl bg-cover bg-center md:h-360 lg:h-auto lg:w-539"
                style={{ backgroundImage: `url(${shop.imageUrl})` }}
              />
              <div className="mt-12 flex flex-col justify-between gap-24 md:mt-16 md:gap-40 lg:w-346">
                <div className="flex flex-col gap-8 text-body2/22 font-regular md:gap-12 md:text-body1/26">
                  <div className="font-bold">
                    <div className="mb-8 leading-17 text-primary md:leading-20">
                      식당
                    </div>
                    <div className="text-h2/29 md:text-h1/34">{shop.name}</div>
                  </div>
                  <div className="flex items-center gap-6">
                    <img className="size-16 md:size-20" src={ic_location} />
                    <span className="text-gray-50">{shop.address1}</span>
                  </div>
                  <div className="text-[#000]">{shop.description}</div>
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <Button
                    size={isMobile ? 'medium' : 'large'}
                    solid={false}
                    onClick={() => navigate('/owner/store/edit')}
                  >
                    편집하기
                  </Button>
                  <Button
                    size={isMobile ? 'medium' : 'large'}
                    solid={true}
                    onClick={() => navigate('/owner/post')}
                  >
                    공고 등록하기
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <RegisterLayout type="store" />
          )}
        </div>
      </section>
      {shop && (
        <section className="w-full flex-1 bg-gray-5 px-12 pt-40 pb-80 md:px-32 md:pt-60 md:pb-120">
          <div className="mx-auto max-w-964">
            <h1 className="mb-16 text-h1/34 font-bold md:mb-32">
              {notices[0] && '내가 '}등록한 공고
            </h1>
            {notices[0] ? (
              <div className="grid grid-cols-2 gap-x-9 gap-y-16 md:gap-x-14 md:gap-y-32 lg:grid-cols-3">
                {notices.map((notice) => (
                  <Link
                    key={notice.item.id}
                    to={`/owner/post/${notice.item.id}`}
                  >
                    <Post
                      data={{ ...notice.item, shop: { item: shop, href: '' } }}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <RegisterLayout type="notice" />
            )}
          </div>
          {/* 스크롤 감지 요소 */}
          <div
            className="text-center text-caption text-gray-30"
            ref={observerRef}
          >
            {isLoading && (
              <div className="mt-32">
                {isLoading === 'error'
                  ? '데이터를 불러오는데 실패했습니다.'
                  : '로딩 중...'}
              </div>
            )}
          </div>
        </section>
      )}
      <Footer />
      {isModalOpen && (
        <Modal onButtonClick={handleClose} onClose={handleClose}>
          {modalContent}
        </Modal>
      )}
    </div>
  );
}
