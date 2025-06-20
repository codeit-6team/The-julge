import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import RegisterLayout from '@/components/layout/RegisterLayout';
import Button from '@/components/common/Button';
import { getUser } from '@/api/userApi';
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
  const [isExist, setIsExist] = useState(false);
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
          name: userInfo.item.name,
          phone: userInfo.item.phone,
          address: userInfo.item.address,
          bio: userInfo.item.bio,
        });

        setIsExist(!!userInfo.item.name);
      } catch (error) {
        setModal({
          isOpen: true,
          message: (error as Error).message,
        });
      }
    };
    fetchUserInfo();
  }, [isLoggedIn]);

  return (
    <div className="mx-12 flex flex-col gap-16 pt-40 pb-80 md:mx-32 md:gap-24 md:pt-60 md:pb-120 lg:mx-auto lg:w-964 lg:flex-row lg:justify-between lg:gap-180">
      <h1 className="text-h3 font-bold md:text-h1">내 프로필</h1>
      {!isExist ? (
        <div>
          <RegisterLayout type="profile" />
        </div>
      ) : (
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
      )}
    </div>
  );
}
