import { useLocation, useNavigate } from 'react-router-dom';
import Input from '@/components/common/Input';
import Dropdown from '@/components/common/Dropdown';
import { ADDRESS_OPTIONS, CATEGORY_OPTIONS } from '@/constants/dropdownOptions';
import Close from '@/assets/icons/close.svg';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  postShop,
  putShop,
  type ShopItem,
  type ShopRequest,
} from '@/api/shopApi';
import ImageInput from '@/components/common/ImageInput';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { getPresignedUrl, uploadImageToS3 } from '@/api/imageApi';
import { AuthContext } from '@/context/AuthContext';

type Category = (typeof CATEGORY_OPTIONS)[number];
type Address1 = (typeof ADDRESS_OPTIONS)[number];

interface StoreEditForm extends Omit<ShopRequest, 'category' | 'address1'> {
  category: Category | '';
  address1: Address1 | '';
}

type InitialData = ShopItem | undefined;

type ModalType = 'success' | 'warning' | 'auth';

export default function StoreEdit() {
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state as InitialData;
  const { isLoggedIn } = useContext(AuthContext);

  const isEditMode =
    initialData !== undefined && typeof initialData?.id === 'string';

  const [edit, setEdit] = useState<StoreEditForm>(
    initialData
      ? {
          name: initialData.name,
          category: initialData.category,
          address1: initialData.address1,
          address2: initialData.address2,
          description: initialData.description,
          originalHourlyPay: initialData.originalHourlyPay,
          imageUrl: initialData.imageUrl,
        }
      : {
          name: '',
          category: '',
          address1: '',
          address2: '',
          description: '',
          originalHourlyPay: 0,
          imageUrl: '',
        },
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalType, setModalType] = useState<ModalType>('success');

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

  const formatNumber = useMemo(
    () => (value: string) => {
      return Number(value).toLocaleString();
    },
    [],
  );

  // 로그아웃 시 모달 창 뜸
  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      setModalType('auth');
      setModalContent('로그인이 필요합니다.');
      setIsModalOpen(true);
      return;
    }
  }, [isLoggedIn]);

  // 등록 버튼 처리
  const handleSubmit = async () => {
    // 필수 입력 값
    const requiredFields = [
      { key: 'name', label: '가게 이름' },
      { key: 'category', label: '분류' },
      { key: 'address1', label: '주소' },
      { key: 'address2', label: '상세 주소' },
      { key: 'originalHourlyPay', label: '기본 시급' },
      { key: 'imageUrl', label: '가게 이미지' },
      { key: 'description', label: '가게 설명' },
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
      if (isEditMode && initialData?.id) {
        await putShop(initialData.id, requestBody);
      } else {
        await postShop(requestBody);
      }

      setModalType('success');
      setModalContent(
        isEditMode ? '수정이 완료되었습니다.' : '등록이 완료되었습니다.',
      );
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
      case 'warning':
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-5">
      <div className="flex flex-col px-12 pt-40 pb-80 md:px-32 md:pb-60 lg:mx-auto lg:max-w-964 lg:px-0">
        <div className="mb-24 flex items-center justify-between md:mb-32">
          <h2 className="text-h3/25 font-bold text-black md:text-h1">
            가게 정보
          </h2>
          <button onClick={handleClose}>
            <img src={Close} alt="닫기" className="md:size-32" />
          </button>
        </div>

        <div className="mb-20 flex flex-col gap-20 md:mb-24 md:flex-row md:gap-20">
          <div className="md:max-w-472 md:basis-1/2">
            <Input
              label="가게 이름*"
              value={edit.name}
              onChange={handleChange('name')}
            />
          </div>
          <div className="flex flex-col gap-8 md:max-w-472 md:basis-1/2">
            <label className="text-body1/26 font-regular text-black">
              분류*
            </label>
            <Dropdown<Category>
              options={CATEGORY_OPTIONS}
              selected={edit.category}
              setSelect={(value) =>
                setEdit((prev) => ({ ...prev, category: value as Category }))
              }
              variant="form"
            />
          </div>
        </div>

        <div className="mb-20 flex flex-col gap-20 md:mb-24 md:gap-24">
          <div className="flex flex-col gap-20 md:flex-row md:gap-20">
            <div className="flex flex-col gap-8 md:max-w-472 md:basis-1/2">
              <label className="text-body1/26 font-regular text-black">
                주소*
              </label>
              <Dropdown<Address1>
                options={ADDRESS_OPTIONS}
                selected={edit.address1}
                setSelect={(value) =>
                  setEdit((prev) => ({ ...prev, address1: value as Address1 }))
                }
                variant="form"
              />
            </div>
            <div className="md:max-w-472 md:basis-1/2">
              <Input
                label="상세 주소*"
                value={edit.address2}
                onChange={handleChange('address2')}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:gap-20">
            <div className="md:max-w-472 md:basis-1/2">
              <Input
                label="기본 시급*"
                value={
                  edit.originalHourlyPay === 0
                    ? ''
                    : formatNumber(String(edit.originalHourlyPay))
                }
                onChange={handleNumberChange('originalHourlyPay')}
                unit="원"
              />
            </div>
            <div className="hidden md:block md:max-w-472 md:basis-1/2"></div>
          </div>
        </div>

        <div className="md:w-483">
          <ImageInput
            label="가게 이미지"
            imageUrl={edit.imageUrl}
            onImageChange={handleImageChange}
            mode={isEditMode ? 'edit' : 'create'}
          />
        </div>

        <div className="mt-20 mb-24 flex flex-col gap-8 md:mt-24 md:mb-32">
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
            className="h-153 w-full rounded-[5px] border border-gray-30 bg-white px-20 py-16 text-body1/26 font-regular text-black"
          />
        </div>
        <Button
          type="submit"
          onClick={handleSubmit}
          className="md:mx-auto md:w-312"
        >
          {isEditMode ? '수정하기' : '등록하기'}
        </Button>

        {isModalOpen && (
          <Modal onClose={handleModalClose} onButtonClick={handleModalClose}>
            {modalContent}
          </Modal>
        )}
      </div>
    </div>
  );
}
