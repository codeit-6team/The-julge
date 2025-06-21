import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Post from '@/components/common/Post';
import Footer from '@/components/layout/Footer';
import PostLarge from '@/components/common/PostLarge';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { getUser } from '@/api/userApi';
import { getShopNotice, type NoticeDetailItem } from '@/api/noticeApi';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';
import {
  getUserApplications,
  postNoticeApplications,
  putNoticeApplications,
} from '@/api/applicationApi';

interface ApplicationInfoState {
  isApplied: boolean;
  applicationId: string | null;
}

type ModalType = 'alert' | 'confirm' | 'action';

interface ModalState {
  isOpen: boolean;
  message: string;
  type?: ModalType;
}

export default function Notice() {
  const navigate = useNavigate();
  const { shopId, noticeId } = useParams();
  const { recentlyViewed, refreshRecentlyViewed } = useRecentlyViewed();
  const [noticeData, setNoticeData] = useState<NoticeDetailItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [applicationInfo, setApplicationInfo] = useState<ApplicationInfoState>({
    isApplied: false,
    applicationId: null,
  });
  const [modal, setModal] = useState<ModalState>({
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
    const userId = localStorage.getItem('userId');
    const fetchNotice = async () => {
      setIsLoading(true);
      // notice 컴포넌트 재사용 문제 해결을 위한 데이터 초기화
      refreshRecentlyViewed();
      setNoticeData(null);
      setApplicationInfo({ isApplied: false, applicationId: null });

      try {
        const data = await getShopNotice(shopId!, noticeId!);
        setNoticeData(data.item);
        if (userId) {
          const applicationsResult = await getUserApplications(userId);
          const userApplications = applicationsResult.items;

          const appliedApplication = userApplications.find(
            (app) =>
              app.item.notice.item.id === noticeId &&
              app.item.status !== 'canceled',
          );

          if (appliedApplication) {
            setApplicationInfo({
              isApplied: true,
              applicationId: appliedApplication.item.id,
            });
          } else {
            // 컴포넌트 재사용 문제 해결을 위한 데이터 초기화
            setApplicationInfo({
              isApplied: false,
              applicationId: null,
            });
          }
        }
      } catch (error) {
        setModal({
          isOpen: true,
          message: (error as Error).message,
          type: 'alert',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotice();
  }, [shopId, noticeId]);

  // 신청하기 버튼 클릭
  const handleApply = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setModal({
          isOpen: true,
          message: '로그인이 필요합니다.',
          type: 'alert',
        });
        return;
      }
      const userInfo = await getUser(userId);
      if (userInfo.item.name) {
        const result = await postNoticeApplications(shopId!, noticeId!);
        const newApplicationId = result.item.id;
        setApplicationInfo({
          isApplied: true,
          applicationId: newApplicationId,
        });
      } else {
        setModal({
          isOpen: true,
          message: '내 프로필을 먼저 등록해 주세요.',
          type: 'confirm',
        });
      }
    } catch (error) {
      setModal({
        isOpen: true,
        message: (error as Error).message,
        type: 'alert',
      });
    }
  };

  // 신청 취소
  const handleConfirmCancel = async () => {
    if (!applicationInfo.applicationId) return;
    try {
      await putNoticeApplications(
        shopId!,
        noticeId!,
        applicationInfo.applicationId,
        { status: 'canceled' },
      );
      setApplicationInfo({ isApplied: false, applicationId: null });
      setModal({
        isOpen: false,
        message: '',
      });
    } catch (error) {
      setModal({
        isOpen: true,
        message: (error as Error).message,
        type: 'alert',
      });
    }
  };

  // 취소하기 버튼 클릭
  const handleCancelClick = () => {
    setModal({
      isOpen: true,
      message: '신청을 취소하시겠어요?',
      type: 'action',
    });
  };

  // 버튼 렌더링 로직
  const renderApplyButton = () => {
    if (!noticeData) {
      return null;
    }
    if (noticeData.closed) {
      return (
        <Button size={buttonSize} disabled>
          신청 불가
        </Button>
      );
    }

    if (applicationInfo.isApplied) {
      return (
        <Button size={buttonSize} solid={false} onClick={handleCancelClick}>
          취소하기
        </Button>
      );
    }

    return (
      <Button size={buttonSize} onClick={handleApply}>
        신청하기
      </Button>
    );
  };

  const handleModalClick = useCallback(() => {
    if (modal.message.includes('로그인')) {
      setModal({ isOpen: false, message: '' });
      navigate('/login');
    } else if (modal.message.includes('프로필')) {
      setModal({ isOpen: false, message: '' });
      navigate('/profile');
    } else {
      setModal({ isOpen: false, message: '' });
    }
  }, [modal.message, navigate]);

  return (
    <>
      {isLoading ? (
        <div className="flex min-h-[calc(100vh-102px)] items-center justify-center md:min-h-[calc(100vh-70px)]">
          <div className="size-100 animate-spin rounded-full border-8 border-gray-200 border-t-primary" />
        </div>
      ) : (
        noticeData && (
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
              <PostLarge data={noticeData}>{renderApplyButton()}</PostLarge>
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
            {modal.isOpen && (
              <Modal
                option={modal.type}
                onButtonClick={handleModalClick}
                onClose={handleModalClick}
                yesButtonContent="예"
                onYesButtonClick={handleConfirmCancel}
              >
                {modal.message}
              </Modal>
            )}
          </div>
        )
      )}
    </>
  );
}
