import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import RegisterLayout from '@/components/layout/RegisterLayout';
import Footer from '@/components/layout/Footer';
import Table from '@/components/common/table/Table';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { getUser } from '@/api/userApi';
import { getUserApplications } from '@/api/applicationApi';
import formatPhone from '@/utils/formatPhone';
import phone from '@/assets/icons/phone.svg';
import location from '@/assets/icons/location-red.svg';

export default function Profile() {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const [profileInfo, setProfileInfo] = useState({
    name: '',
    phone: '',
    address: '',
    bio: '',
  });
  const [hasInfo, setHasInfo] = useState(false);
  const [hasApplications, setHasApplications] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    message: '',
  });
  const [buttonSize, setButtonSize] = useState<'large' | 'medium'>('medium');
  const [isLoading, setIsLoading] = useState(true);

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

    if (!userId) {
      setModal({
        isOpen: true,
        message: '로그인이 필요합니다.',
      });
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUser(userId);
        setProfileInfo({
          name: userInfo.item.name ?? '',
          phone: userInfo.item.phone ?? '',
          address: userInfo.item.address ?? '',
          bio: userInfo.item.bio ?? '',
        });
        setHasInfo(!!userInfo.item.name);
        const applications = await getUserApplications(userId);
        setHasApplications(applications.count > 0);
      } catch (error) {
        setModal({
          isOpen: true,
          message: (error as Error).message,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserInfo();
  }, [isLoggedIn]);

  const handleModalConfirm = useCallback(() => {
    if (modal.message.includes('로그인')) {
      setModal({ isOpen: false, message: '' });
      navigate('/login');
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
        <div className="flex min-h-[calc(100vh-102px)] flex-col justify-between md:min-h-[calc(100vh-70px)]">
          {!hasInfo ? (
            <div className="mx-12 flex flex-col gap-16 py-40 md:mx-32 md:gap-24 md:py-60 lg:mx-auto lg:w-964">
              <h1 className="text-h3 font-bold md:text-h1">내 프로필</h1>
              <RegisterLayout type="profile" />
            </div>
          ) : (
            <div className="mx-12 flex flex-col gap-16 py-40 md:mx-32 md:gap-24 md:py-60 lg:mx-auto lg:w-964 lg:flex-row lg:justify-between lg:gap-180">
              <h1 className="text-h3 font-bold md:text-h1">내 프로필</h1>
              <div className="flex justify-between rounded-[12px] bg-red-10 p-20 md:p-32 lg:flex-1">
                <div className="flex flex-col gap-8 md:gap-12">
                  <div className="flex flex-col gap-8">
                    <div className="text-body2/17 font-bold text-primary md:text-body1/20">
                      이름
                    </div>
                    <h2 className="text-h2/29 font-bold md:text-h1/34">
                      {profileInfo.name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-6 text-body2/22 text-gray-50 md:text-body1/26">
                    <img src={phone} className="size-16 md:size-20" />
                    {formatPhone(profileInfo.phone)}
                  </div>
                  <div className="flex items-center gap-6 text-body2/22 text-gray-50 md:text-body1/26">
                    <img src={location} className="size-16 md:size-20" />
                    선호 지역: {profileInfo.address}
                  </div>
                  {profileInfo.bio && (
                    <p className="mt-12 text-body2/22 md:mt-16 md:text-body1/26">
                      {profileInfo.bio}
                    </p>
                  )}
                </div>
                <Button
                  size={buttonSize}
                  solid={false}
                  onClick={() => navigate('/profile/edit')}
                  className="w-108 shrink-0 md:w-169"
                >
                  편집하기
                </Button>
              </div>
            </div>
          )}

          {hasInfo && (
            <div className="flex-1 bg-gray-5">
              <div className="mx-12 flex flex-col gap-16 pt-40 pb-80 md:mx-32 md:gap-24 md:pt-60 md:pb-120 lg:mx-auto lg:w-964">
                <h1 className="text-h3 font-bold md:text-h1">신청 내역</h1>
                {!hasApplications ? (
                  <RegisterLayout type="application" />
                ) : (
                  <Table
                    mode="user"
                    userId={localStorage.getItem('userId') ?? ''}
                  />
                )}
              </div>
            </div>
          )}
          <Footer />
          {modal.isOpen && (
            <Modal
              onClose={handleModalConfirm}
              onButtonClick={handleModalConfirm}
            >
              {modal.message}
            </Modal>
          )}
        </div>
      )}
    </>
  );
}
