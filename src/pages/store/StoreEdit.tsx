import { useNavigate } from 'react-router-dom';
import Input from '@/components/common/Input';
import Dropdown from '@/components/common/Dropdown';
import { ADDRESS_OPTIONS, CATEGORY_OPTIONS } from '@/constants/dropdownOptions';
import Close from '@/assets/icons/close.svg';
import { useState } from 'react';
import type { ShopRequest } from '@/api/shopApi';
import ImageInput from '@/components/common/ImageInput';

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

  return (
    <div className="mx-12 mt-40 mb-80 flex flex-col">
      <div className="mb-24 flex items-center justify-between">
        <h2 className="text-h3/25 font-bold text-black">가게 정보</h2>
        <button onClick={handleClose}>
          <img src={Close} alt="닫기" />
        </button>
      </div>
      <div className="mb-20 flex flex-col gap-20">
        <Input
          label="가게 이름*"
          value={edit.name}
          onChange={handleChange('name')}
        />
        <div className="flex flex-col gap-8">
          <label className="text-body1/26 font-regular text-black">분류*</label>
          <Dropdown
            options={CATEGORY_OPTIONS}
            selected={edit.category}
            setSelect={(value: Category) =>
              setEdit((prev) => ({ ...prev, category: value }))
            }
            variant="form"
          />
        </div>
      </div>
      <div className="mb-20 flex flex-col gap-20">
        <div className="flex flex-col gap-8">
          <label className="text-body1/26 font-regular text-black">주소*</label>
          <Dropdown
            options={ADDRESS_OPTIONS}
            selected={edit.address1}
            setSelect={(value: Address1) =>
              setEdit((prev) => ({ ...prev, address1: value }))
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
          value={formatNumber(String(edit.originalHourlyPay))}
          onChange={handleNumberChange('originalHourlyPay')}
          unit="원"
        />
      </div>

      <ImageInput
        label="가게 이미지"
        imageUrl={edit.imageUrl}
        onImageChange={(_, previewUrl) => handleImageChange(previewUrl)}
      />

      <div className="mt-20 flex flex-col gap-8">
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
          className="h-153 rounded-[5] border border-gray-30 bg-white px-20 py-16"
        />
      </div>
    </div>
  );
}
