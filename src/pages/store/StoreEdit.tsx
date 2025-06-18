import { useNavigate } from 'react-router-dom';
import Input from '@/components/common/Input';
import Dropdown from '@/components/common/Dropdown';
import { ADDRESS_OPTIONS, CATEGORY_OPTIONS } from '@/constants/dropdownOptions';
import Close from '@/assets/icons/close.svg';
import { useEffect, useState } from 'react';
import type { ShopRequest } from '@/api/shopApi';
import ImageInput from '@/components/common/ImageInput';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';

type Category = (typeof CATEGORY_OPTIONS)[number];
type Address1 = (typeof ADDRESS_OPTIONS)[number];

interface StoreEditForm extends Omit<ShopRequest, 'category' | 'address1'> {
  category: Category | '';
  address1: Address1 | '';
}

export default function StoreEdit() {
  const [edit, setEdit] = useState<StoreEditForm>({
    name: '',
    category: '',
    address1: '',
    address2: '',
    description: '',
    originalHourlyPay: 0,
    imageUrl: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    navigate('/store');
  };

  // 공통 문자열 핸들러
  const handleChange =
    (key: keyof StoreEditForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEdit((prev) => ({ ...prev, [key]: e.target.value }));
    };

  // 숫자 전용 핸들러
  const handleNumberChange =
    (key: keyof StoreEditForm) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, '');
      setEdit((prev) => ({ ...prev, [key]: Number(raw) }));
    };

  // 이미지 핸들러
  const handleImageChange = (previewUrl: string) => {
    setEdit((prev) => ({ ...prev, imageUrl: previewUrl }));
  };

  const formatNumber = (value: string) => {
    return Number(value).toLocaleString();
  };

  const handleSubmit = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate('/store');
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
                value={formatNumber(String(edit.originalHourlyPay))}
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
            onImageChange={(_, previewUrl) => handleImageChange(previewUrl)}
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
          {mode === 'edit' ? '수정하기' : '등록하기'}
        </Button>

        {isModalOpen && (
          <Modal onClose={handleModalClose} onButtonClick={handleModalClose}>
            {mode === 'edit'
              ? '수정이 완료되었습니다.'
              : '등록이 완료되었습니다.'}
          </Modal>
        )}
      </div>
    </div>
  );
}
