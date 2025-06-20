import { useNavigate } from 'react-router-dom';
import { useCallback, useContext, useEffect, useState } from 'react';
import Close from '@/assets/icons/close.svg';
import { ADDRESS_OPTIONS, CATEGORY_OPTIONS } from '@/constants/dropdownOptions';
import { getShop, postShop, putShop, type ShopRequest } from '@/api/shopApi';
import { getPresignedUrl, uploadImageToS3 } from '@/api/imageApi';
import Input from '@/components/common/Input';
import Dropdown from '@/components/common/Dropdown';
import ImageInput from '@/components/common/ImageInput';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { AuthContext } from '@/context/AuthContext';

type Category = (typeof CATEGORY_OPTIONS)[number];
type Address1 = (typeof ADDRESS_OPTIONS)[number];

interface StoreEditForm extends Omit<ShopRequest, 'category' | 'address1'> {
  category: Category | null;
  address1: Address1 | null;
}

type ModalType = 'success' | 'warning' | 'auth';

export default function StoreEdit() {
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);

  const shopId = localStorage.getItem('shopId');
  const isEditMode = !!shopId;

  const [edit, setEdit] = useState<StoreEditForm>({
    name: '',
    category: null,
    address1: null,
    address2: '',
    description: '',
    originalHourlyPay: 0,
    imageUrl: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalType, setModalType] = useState<ModalType>('success');

  // 로그아웃 처리 및 등록 수정 모드
  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      setModalType('auth');
      setModalContent('로그인이 필요합니다.');
      setIsModalOpen(true);
      return;
    }

    if (isEditMode && !shopId) {
      setModalType('warning');
      setModalContent('가게 정보를 찾을 수 없습니다.');
      setIsModalOpen(true);
      return;
    }

    if (!isEditMode) return;

    const fetchShopInfo = async () => {
      try {
        const shopInfo = await getShop(shopId);
        setEdit({
          name: shopInfo.item.name ?? '',
          category: shopInfo.item.category ?? null,
          address1: shopInfo.item.address1 ?? null,
          address2: shopInfo.item.address2 ?? '',
          description: shopInfo.item.description ?? '',
          originalHourlyPay: shopInfo.item.originalHourlyPay ?? 0,
          imageUrl: shopInfo.item.imageUrl ?? '',
        });
      } catch (error) {
        setModalType('warning');
        setModalContent('가게 정보를 불러오는 데 실패했습니다.');
        setIsModalOpen(true);
      }
    };
    fetchShopInfo();
  }, [isLoggedIn, shopId, isEditMode]);

  // x 버튼 눌렀을 때
  const handleClose = () => {
    navigate('/owner/store');
  };

  // 공통 문자열 핸들러
  const handleChange = useCallback(
    (key: keyof StoreEditForm) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setEdit((prev) => ({ ...prev, [key]: e.target.value }));
      },
    [],
  );

  // 숫자 전용 핸들러
  const handleNumberChange = useCallback(
    (key: keyof StoreEditForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      setEdit((prev) => ({ ...prev, [key]: Number(raw) }));
    },
    [],
  );

  // 이미지 핸들러
  const handleImageChange = async (file: File) => {
    try {
      const presignedUrl = await getPresignedUrl(file.name);
      const fileUrl = presignedUrl.split('?')[0]; // S3 저장용 URL(쿼리 제거)

      await uploadImageToS3(presignedUrl, file);

      setEdit((prev) => ({ ...prev, imageUrl: fileUrl }));
    } catch (error) {
      alert((error as Error).message);
    }
  };

  // 등록 버튼 처리
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 필수 입력 값
    const requiredFields = [
      { key: 'name', label: '가게 이름' },
      { key: 'category', label: '분류' },
      { key: 'address1', label: '주소' },
      { key: 'address2', label: '상세 주소' },
      { key: 'originalHourlyPay', label: '기본 시급' },
      { key: 'imageUrl', label: '가게 이미지' },
    ];

    // 입력 안할 시 모달로 알려줌
    for (const { key, label } of requiredFields) {
      const value = edit[key as keyof StoreEditForm];

      const isEmpty = typeof value === 'string' ? value.trim() === '' : !value;

      if (isEmpty) {
        setModalType('warning');
        setModalContent(`${label} 내용을 추가해 주세요.`);
        setIsModalOpen(true);
        return;
      }
    }

    try {
      const requestBody: ShopRequest = {
        ...edit,
        category: edit.category as ShopRequest['category'],
        address1: edit.address1 as ShopRequest['address1'],
      };

      // 등록, 수정을 구분
      if (isEditMode && shopId) {
        await putShop(shopId, requestBody);
        setModalType('success');
        setModalContent('수정이 완료되었습니다.');
      } else {
        await postShop(requestBody);
        setModalType('success');
        setModalContent('등록이 완료되었습니다.');
      }

      setIsModalOpen(true);
    } catch (error) {
      setModalType('warning');
      setModalContent((error as Error).message);
      setIsModalOpen(true);
    }
  };

  // 모달 버튼 기능
  const handleModalClose = () => {
    setIsModalOpen(false);

    switch (modalType) {
      case 'success':
        navigate('/owner/store');
        break;
      case 'auth':
        navigate('/login');
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-5">
      <div className="flex flex-col gap-24 px-12 pt-40 pb-80 md:gap-32 md:px-32 md:pb-60 lg:mx-auto lg:max-w-964 lg:px-0">
        <div className="flex items-center justify-between">
          <h2 className="text-h3/25 font-bold text-black md:text-h1">
            가게 정보
          </h2>
          <button onClick={handleClose}>
            <img src={Close} alt="닫기" className="md:size-32" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-24 md:gap-32"
        >
          <div className="flex flex-col gap-20 md:gap-24">
            <div className="grid grid-cols-1 gap-20 md:grid-cols-2 md:gap-y-24">
              <Input
                label="가게 이름*"
                value={edit.name}
                onChange={handleChange('name')}
              />
              <div className="flex flex-col gap-8">
                <label className="text-body1/26 font-regular text-black">
                  분류*
                </label>
                <Dropdown<Category>
                  options={CATEGORY_OPTIONS}
                  selected={edit.category}
                  setSelect={(value) =>
                    setEdit((prev) => ({
                      ...prev,
                      category: value as Category,
                    }))
                  }
                  variant="form"
                />
              </div>
              <div className="flex flex-col gap-8">
                <label className="text-body1/26 font-regular text-black">
                  주소*
                </label>
                <Dropdown<Address1>
                  options={ADDRESS_OPTIONS}
                  selected={edit.address1}
                  setSelect={(value) =>
                    setEdit((prev) => ({
                      ...prev,
                      address1: value as Address1,
                    }))
                  }
                  variant="form"
                />
              </div>
              <Input
                label="상세 주소*"
                value={edit.address2}
                onChange={handleChange('address2')}
              />
              <Input
                label="기본 시급*"
                value={
                  edit.originalHourlyPay === 0
                    ? ''
                    : Number(edit.originalHourlyPay).toLocaleString()
                }
                onChange={handleNumberChange('originalHourlyPay')}
                unit="원"
              />
            </div>

            <div className="md:w-483">
              <ImageInput
                label="가게 이미지"
                imageUrl={edit.imageUrl}
                onImageChange={handleImageChange}
                mode={isEditMode ? 'edit' : 'create'}
              />
            </div>

            <div className="flex flex-col gap-8">
              <label
                htmlFor="description"
                className="text-body1/26 font-regular text-black"
              >
                가게 설명
              </label>
              <textarea
                id="description"
                value={edit.description}
                onChange={handleChange('description')}
                placeholder="입력"
                className="h-153 w-full resize-none rounded-[5px] border border-gray-30 bg-white px-20 py-16 text-body1/26 font-regular text-black"
              />
            </div>
          </div>
          <Button type="submit" className="md:mx-auto md:w-312">
            {isEditMode ? '수정하기' : '등록하기'}
          </Button>
        </form>
        {isModalOpen && (
          <Modal onClose={handleModalClose} onButtonClick={handleModalClose}>
            {modalContent}
          </Modal>
        )}
      </div>
    </div>
  );
}
