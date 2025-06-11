import { useState } from 'react';
import close from '@/assets/icons/close.svg';
import closeRed from '@/assets/icons/close-red.svg';
import { ADDRESS_OPTIONS } from '@/constants/dropdownOptions';
import Button from '../Button';

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

  const handleAddressClick = (addr: string) => {
    setAddress((prev) =>
      prev.includes(addr) ? prev.filter((a) => a !== addr) : [...prev, addr],
    );
  };

  const handlePayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setHourlyPay(val);
  };

  const handleReset = () => {
    setAddress([]);
    setStartsAt('');
    setHourlyPay('');
    setInputType('text');
  };

  const handleApply = () => {
    onApply({
      address,
      startsAt: startsAt || null,
      hourlyPay: hourlyPay ? Number(hourlyPay) : null,
    });
    onClose();
  };

  const handleDeleteLocation = (addr: string) => {
    setAddress((prev) => prev.filter((item) => item !== addr));
  };

  if (!open) return null;

  return (
    <div className="z-[5] flex w-[38rem] flex-col gap-[2.4rem] rounded-[1rem] border border-[#e5e4e7] bg-white p-[2.4rem] px-[2rem] shadow-[0_2px_8px_0_rgba(0,_0,_0,_0.25)]">
      {/* 헤더 */}
      <div className="flex flex-row items-center justify-between text-[2rem] leading-[2.4rem]">
        <h3>상세 필터</h3>
        <button
          className="relative h-[2.4rem] w-[2.4rem]"
          onClick={onClose}
          aria-label="닫기"
        >
          <img src={close} alt="닫기" className="h-full w-full" />
        </button>
      </div>

      <div className="flex flex-col gap-[1.2rem]">
        {/* 위치 */}
        <p className="text-[16px] font-semibold">위치</p>
        <div className="flex h-[25.8rem] flex-wrap gap-y-[2.4rem] overflow-x-hidden overflow-y-auto rounded-[0.6rem] border border-[#e5e4e7] px-[2.8rem] py-[2rem] text-[1.4rem]">
          {ADDRESS_OPTIONS.map((item) => (
            <button
              key={item}
              type="button"
              className="w-[13.5rem] px-[1.6rem] py-[1rem] text-left text-[1.4rem]"
              onClick={() => handleAddressClick(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {/* 선택된 주소 */}
        <div className="my-2 flex flex-wrap gap-2">
          {address.map((option) => (
            <button
              key={option}
              type="button"
              className="flex flex-row items-center rounded-[2rem] bg-[#ffebe7] px-[1rem] py-[0.6rem] text-[1.4rem] leading-[1.68rem] font-bold text-[#ea3c12]"
              onClick={() => handleDeleteLocation(option)}
            >
              {option}
              <div className="relative h-[1.6rem] w-[1.6rem]">
                <img src={closeRed} alt="닫기" className="h-full w-full" />
              </div>
            </button>
          ))}
        </div>
        <hr className="my-[1.2rem] h-[0.2rem] w-full border-0 bg-[var(--color-gray-10)]" />

        {/* 시작일 */}
        <div className="mb-6">
          <label
            htmlFor="fromDate"
            className="mb-2 block text-base font-semibold"
          >
            시작일
          </label>
          <input
            id="fromDate"
            name="fromDate"
            type={inputType}
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            onFocus={() => setInputType('date')}
            onBlur={() => setInputType('text')}
            placeholder="입력"
            autoComplete="off"
            min={new Date().toISOString().split('T')[0]}
            className="h-[5.6rem] w-full rounded-xl border border-[var(--color-gray-20)] px-[2rem] py-[1.6rem] text-[1.6rem] leading-[2.4rem] placeholder-gray-400"
          />
        </div>
        <hr className="my-[1.2rem] h-[0.2rem] w-full border-0 bg-[var(--color-gray-10)]" />

        {/* 금액 */}
        <div className="mb-6">
          <label className="mb-2 block text-base font-semibold">금액</label>
          <div className="relative mr-[1.2rem] inline-block w-full">
            <input
              type="text"
              inputMode="numeric"
              className="h-[5.6rem] w-[16.9rem] rounded-xl border border-[var(--color-gray-20)] px-[2rem] py-[1.6rem] text-[1.6rem] leading-[2.4rem] placeholder-gray-400"
              placeholder="입력"
              value={hourlyPay}
              onChange={handlePayChange}
            />
            <span className="text-sm">원</span>
          </div>
          <span className="mt-1 block text-xs text-gray-500">이상부터</span>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <Button
            solid={false}
            size="medium"
            className="h-[4rem] flex-1 text-[1.6rem]"
            onClick={handleReset}
          >
            초기화
          </Button>
          <Button
            solid
            size="large"
            className="h-[4rem] flex-[3] text-[1.6rem]"
            onClick={handleApply}
          >
            적용하기
          </Button>
        </div>
      </div>
    </div>
  );
}
