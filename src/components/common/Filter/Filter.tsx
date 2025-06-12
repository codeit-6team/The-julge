import { useState } from 'react';
import close from '@/assets/icons/close.svg';
import closeRed from '@/assets/icons/close-red.svg';
import { ADDRESS_OPTIONS } from '@/constants/dropdownOptions';
import Button from '../Button';
import Input from '../Input';
import HorizontalLine from './HorizontalLine';

type FilterProps = {
  open: boolean;
  onClose: () => void;
  onApply: (values: {
    address: string[];
    startsAt: string | null;
    hourlyPay: number | null;
  }) => void;
  defaultValues?: {
    address?: string[];
    startsAt?: string | null;
    hourlyPay?: number | null;
  };
};

export default function Filter({
  open,
  onClose,
  onApply,
  defaultValues,
}: FilterProps) {
  // 상태 정의
  const [address, setAddress] = useState<string[]>(
    defaultValues?.address ?? [],
  );
  const [startsAt, setStartsAt] = useState<string>(
    defaultValues?.startsAt ?? '',
  );
  const [hourlyPay, setHourlyPay] = useState<string>(
    defaultValues?.hourlyPay?.toString() ?? '',
  );
  const [inputType, setInputType] = useState<'text' | 'date'>('text');

  // 주소 버튼 클릭 핸들러
  const handleAddressClick = (addr: string) => {
    setAddress((prev) =>
      prev.includes(addr) ? prev.filter((a) => a !== addr) : [...prev, addr],
    );
  };

  // 금액 입력 핸들러 (숫자만 허용, 3자리 콤마 적용)
  const handlePayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '').replace(/\D/g, '');
    const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setHourlyPay(formatted);
  };

  // 선택된 위치 삭제 핸들러
  const handleDeleteLocation = (addr: string) => {
    setAddress((prev) => prev.filter((item) => item !== addr));
  };

  // 초기화 버튼 핸들러
  const handleReset = () => {
    setAddress([]);
    setStartsAt('');
    setHourlyPay('');
    setInputType('text');
  };

  // 적용하기 버튼 핸들러
  const handleApply = () => {
    const cleanPay = hourlyPay.replace(/,/g, '');
    onApply({
      address,
      startsAt: startsAt || null,
      hourlyPay: cleanPay ? Number(cleanPay) : null,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="z-[5] mx-auto flex w-full max-w-[390px] flex-col gap-[1.5rem] rounded-[1rem] border border-[#e5e4e7] bg-white p-[1.5rem] px-[1.25rem] shadow-[0_2px_8px_0_rgba(0,_0,_0,_0.25)]">
      {/* 헤더 */}
      <div className="flex flex-row items-center justify-between text-[2rem] leading-[2.4rem]">
        <h3 className="text-h3 font-bold">상세 필터</h3>
        <button
          className="relative h-[2.4rem] w-[2.4rem]"
          onClick={onClose}
          aria-label="닫기"
        >
          <img src={close} alt="닫기" className="h-full w-full" />
        </button>
      </div>

      <div className="flex flex-col">
        {/* 위치 영역 */}
        <p className="text-[16px] font-semibold">위치</p>
        <div className="custom-scrollbar my-[0.75rem] grid h-[258px] w-full max-w-[348px] grid-cols-[1fr_1fr] gap-x-[2rem] gap-y-[2rem] overflow-y-auto rounded-[0.6rem] border border-[#e5e4e7] px-[28px] py-[20px] text-[1.4rem]">
          {ADDRESS_OPTIONS.map((item) => (
            <button
              key={item}
              type="button"
              className="text-left text-body2"
              onClick={() => handleAddressClick(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {/* 선택된 위치 태그 */}
        <div className="my-2 flex flex-wrap gap-8">
          {address.map((option) => (
            <button
              key={option}
              type="button"
              className="flex flex-row items-center rounded-[2rem] bg-[#ffebe7] px-[0.625rem] py-[0.375rem] text-body2 leading-[1.68rem] font-semibold text-[#ea3c12]"
              onClick={() => handleDeleteLocation(option)}
            >
              {option}
              <div className="relative h-[1rem] w-[1rem]">
                <img src={closeRed} alt="닫기" className="h-full w-full" />
              </div>
            </button>
          ))}
        </div>

        <HorizontalLine />

        {/* 시작일 입력 */}
        <div className="flex flex-col gap-8 text-body1/26 font-regular text-black">
          <Input
            label="시작일"
            type={inputType}
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            onFocus={() => setInputType('date')}
            onBlur={() => setInputType('text')}
            placeholder="입력"
          />
        </div>

        <HorizontalLine />

        {/* 금액 입력 */}
        <div className="mb-6 flex items-end gap-[0.75rem]">
          <div className="flex-[1]">
            <Input
              label="금액"
              placeholder="입력"
              unit="원"
              type="text"
              inputMode="numeric"
              value={hourlyPay}
              onChange={handlePayChange}
            />
          </div>

          <span className="flex-[1] self-end pb-[1rem] text-body1/26">
            이상부터
          </span>
        </div>

        {/* 버튼 영역 */}
        <div className="mt-[2.5rem] flex items-center justify-between gap-x-4">
          <Button solid={false} className="flex-[1]" onClick={handleReset}>
            초기화
          </Button>
          <Button className="flex-[4]" onClick={handleApply}>
            적용하기
          </Button>
        </div>
      </div>
    </div>
  );
}
