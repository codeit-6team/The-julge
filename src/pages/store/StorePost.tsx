import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getShopNotice, type NoticeDetailItem } from '@/api/noticeApi';
import Footer from '@/components/layout/Footer';
import PostLarge from '@/components/common/PostLarge';
import Button from '@/components/common/Button';
import Table from '@/components/common/table/Table';
import Modal from '@/components/common/Modal';

const MODAL_MESSAGE = {
  notice: '존재하지 않는 공고입니다.',
  login: '로그인이 필요합니다.',
};

export default function StorePost() {
  const navigate = useNavigate();
  const { shopId, noticeId } = useParams();
  const [notice, setNotice] = useState<NoticeDetailItem>();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [modalType, setModalType] = useState<'notice' | 'login' | null>(null);

  const handleClose = () => {
    if (modalType === 'notice') navigate('/owner/store');
    else if (modalType === 'login') navigate('/login');
  };

  useEffect(() => {
    if (!localStorage.getItem('userId')) {
      setModalType('login');
      return;
    }

    if (!shopId || !noticeId) return;

    (async () => {
      try {
        const { item } = await getShopNotice(shopId, noticeId);
        setNotice(item);
      } catch {
        setModalType('notice');
      }
    })();
  }, [shopId, noticeId]);

  // 반응형
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-108px)] flex-col justify-between bg-gray-5 md:min-h-[calc(100vh_-_70px)]">
      <section className="w-full px-12 py-40 md:px-32 md:py-60">
        <div className="mx-auto flex max-w-964 flex-col gap-16 md:gap-24">
          <div>
            <div className="mb-8 text-body2/17 font-bold text-primary md:text-body1/20">
              식당
            </div>
            <h1 className="text-h3/24 font-bold text-black md:text-h1/34 md:text-[#000]">
              {notice?.shop.item.name}
            </h1>
          </div>
          {notice && (
            <PostLarge data={notice}>
              <Button size={isMobile ? 'medium' : 'large'} solid={false}>
                공고 편집하기
              </Button>
            </PostLarge>
          )}
        </div>
      </section>
      <section className="w-full flex-1 px-12 pt-40 pb-80 md:px-32 md:py-60">
        <div className="mx-auto flex max-w-964 flex-col gap-16 md:gap-32">
          <h1 className="text-h3/24 font-bold text-black md:text-h1/42 md:text-[#000]">
            신청자 목록
          </h1>
          {shopId && noticeId && (
            <Table mode="notice" shopId={shopId} noticeId={noticeId} />
          )}
        </div>
      </section>
      {modalType && (
        <Modal onClose={handleClose} onButtonClick={handleClose}>
          {MODAL_MESSAGE[modalType]}
        </Modal>
      )}
      <Footer />
    </div>
  );
}
