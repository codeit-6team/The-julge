import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Post from '@/components/common/Post';
import Footer from '@/components/layout/Footer';
import PostLarge from '@/components/common/PostLarge';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { getShopNotice } from '@/api/noticeApi';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

export default function Notice() {
  const { shopId, userId } = useParams();
  const { recentlyViewed } = useRecentlyViewed();
  const [noticeData, setNoticeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState({
    isOpen: false,
    message: '',
  });
  const [buttonSize, setButtonSize] = useState<'large' | 'medium'>('medium');
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setButtonSize('large');
      } else {
        setButtonSize('medium');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const data = await getShopNotice(shopId, userId);
        setNoticeData(data.item);
      } catch (error) {
        setModal({
          isOpen: true,
          message: (error as Error).message,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotice();
  }, [shopId, userId]);
  return (
    <>
      {isLoading ? (
        <div className="flex min-h-[calc(100vh-102px)] items-center justify-center md:min-h-[calc(100vh-70px)]">
          <div className="size-100 animate-spin rounded-full border-8 border-gray-200 border-t-primary" />
        </div>
      ) : (
        <div className="flex min-h-[calc(100vh-102px)] flex-col justify-between md:min-h-[calc(100vh-70px)]">
          <div className="mx-12 flex flex-col gap-16 py-40 md:mx-32 md:gap-24 md:py-60 lg:mx-auto lg:w-964">
            <div className="flex flex-col gap-8">
              <p className="text-body2 font-bold text-primary md:text-body1">
                식당
              </p>
              <h1 className="text-h3 font-bold md:text-h1">
                {noticeData.shop.item.name}
              </h1>
            </div>
            <PostLarge data={noticeData}>
              <Button size={buttonSize}>신청하기</Button>
            </PostLarge>
          </div>
          <div className="flex-1">
            <div className="mx-12 flex flex-col gap-16 py-40 md:mx-32 md:gap-24 md:py-60 lg:mx-auto lg:w-964">
              <h1 className="text-h3 font-bold md:text-h1 md:font-bold">
                최근에 본 공고
              </h1>
              {recentlyViewed.length === 0 ? (
                <div className="flex h-120 items-center justify-center rounded-lg bg-gray-10 text-gray-40">
                  최근에 본 공고가 없습니다.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-8 gap-y-16 md:gap-x-14 md:gap-y-32 lg:grid-cols-3">
                  {recentlyViewed.map((postData) => (
                    <Post key={postData.id} data={postData} />
                  ))}
                </div>
              )}
            </div>
          </div>
          <Footer />
          {modal.isOpen && <Modal>{modal.message}</Modal>}
        </div>
      )}
    </>
  );
}
