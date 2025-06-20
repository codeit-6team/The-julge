import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import RegisterLayout from '@/components/layout/RegisterLayout';
import { getUser } from '@/api/userApi';

export default function Profile() {
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
  useEffect(() => {
    if (isLoggedIn) {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        setModal({
          isOpen: true,
          message: '사용자 정보를 가져올 수 없습니다. 다시 로그인해주세요.',
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

          setIsExist(!!userInfo.item.name);
        } catch (error) {
          setModal({
            isOpen: true,
            message: (error as Error).message,
          });
        }
      };
      fetchUserInfo();
    } else {
      setModal({
        isOpen: true,
        message: '로그인이 필요합니다.',
      });
    }
  }, [isLoggedIn]);

  return (
    <>
      {isExist ? (
        <div>{profileInfo.name}</div>
      ) : (
        <div>
          <RegisterLayout type="profile" />
        </div>
      )}
    </>
  );
}
