import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, putUser, type SeoulDistrict } from '@/api/userApi';
import Dropdown from '@/components/common/Dropdown';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import close from '@/assets/icons/close.svg';
import { ADDRESS_OPTIONS } from '@/constants/dropdownOptions';

export default function StoreForm() {
  const navigate = useNavigate();
  // 사용자 입력값 상태 (이름, 전화번호, 소개글)
  const [profileInfo, setProfileInfo] = useState({
    name: '',
    phone: '',
    bio: '',
  });

  // dropdown 컴포넌트에 set함수를 전달하기 위해 address는 따로 분리
  const [selectedAddress, setSelectedAddress] = useState<SeoulDistrict | null>(
    null,
  );

  const [modal, setModal] = useState({
    isOpen: false,
    message: '',
  });

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
          bio: userInfo.item.bio ?? '',
        });
        setSelectedAddress((userInfo.item.address as SeoulDistrict) ?? '');
      } catch (error) {
        setModal({
          isOpen: true,
          message: (error as Error).message,
        });
      }
    };
    fetchUserInfo();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    const sanitized = name === 'phone' ? value.replace(/[^0-9]/g, '') : value; // phone은 숫자만 입력 가능하도록 설정

    setProfileInfo((prev) => ({
      ...prev,
      [name]: sanitized,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const { name, phone, bio } = profileInfo;
    const userId = localStorage.getItem('userId');
    // 로그인이 안된 상태에 대한 처리
    if (!userId) {
      setModal({
        isOpen: true,
        message: '로그인이 필요합니다.',
      });
      return;
    }

    // 이름이 입력되지 않은 경우
    if (!name.trim()) {
      setModal({
        isOpen: true,
        message: '이름을 입력해주세요.',
      });
      return;
    }

    // 지역이 선택되지 않은 경우
    if (!selectedAddress) {
      setModal({
        isOpen: true,
        message: '선호 지역을 선택해주세요',
      });
      return;
    }

    try {
      await putUser(userId, {
        name,
        phone,
        address: selectedAddress,
        bio,
      });
      setModal({
        isOpen: true,
        message: '등록이 완료되었습니다.',
      });
    } catch (error) {
      setModal({
        isOpen: true,
        message: (error as Error).message,
      });
    }
  }

  const handleModalConfirm = useCallback(() => {
    if (modal.message === '등록이 완료되었습니다.') {
      setModal({ isOpen: false, message: '' });
      navigate('/profile');
    } else if (modal.message.includes('로그인')) {
      setModal({ isOpen: false, message: '' });
      navigate('/login');
    } else {
      setModal({ isOpen: false, message: '' });
    }
  }, [modal.message, navigate]);

  return (
    <div className="min-h-[calc(100vh-102px)] bg-gray-5 md:min-h-[calc(100vh-70px)]">
      <div className="mx-12 flex flex-col gap-24 pt-40 pb-80 md:mx-32 md:gap-32 md:py-60 lg:mx-auto lg:w-964">
        <div className="flex items-center justify-between">
          <h1 className="text-h3/24 font-bold md:text-h1/34">내 프로필</h1>
          <Link to="/profile">
            <img src={close} alt="닫기" className="md:size-32" />
          </Link>
        </div>
        <form
          className="flex flex-col gap-24 md:gap-32"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-20 md:gap-24">
            <div className="grid grid-cols-1 gap-20 md:grid-cols-2 md:gap-y-24 lg:grid-cols-3">
              <Input
                label="이름*"
                name="name"
                value={profileInfo.name}
                onChange={handleChange}
              />
              <Input
                label="연락처*"
                type="tel"
                name="phone"
                maxLength={11}
                value={profileInfo.phone}
                onChange={handleChange}
              />
              <div className="flex flex-col gap-8 text-body1/26 font-regular">
                <label htmlFor="region">선호 지역*</label>
                <Dropdown
                  id="region"
                  variant="form"
                  options={ADDRESS_OPTIONS}
                  selected={selectedAddress}
                  setSelect={setSelectedAddress}
                />
              </div>
            </div>
            <div className="flex flex-col gap-8 text-body1/26 font-regular">
              <label htmlFor="bio">소개</label>
              <textarea
                name="bio"
                id="bio"
                className="h-153 resize-none rounded-[5px] border border-gray-30 bg-white px-20 py-16 placeholder-gray-40"
                placeholder="입력"
                value={profileInfo.bio}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          <Button type="submit" className="md:mx-auto md:w-312">
            등록하기
          </Button>
        </form>
      </div>
      {modal.isOpen && (
        <Modal onClose={handleModalConfirm} onButtonClick={handleModalConfirm}>
          {modal.message}
        </Modal>
      )}
    </div>
  );
}
