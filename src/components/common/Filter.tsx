import { useState } from 'react';
import close from '@/assets/icons/close.svg';
import closeRed from '@/assets/icons/close-red.svg';
import { ADDRESS_OPTIONS } from '@/constants/dropdownOptions';
import Button from './Button';
import Input from './Input';

type FilterProps = {
  open: boolean;
  onClose: () => void;
  onApply: (values: {
    address: string[] | null;
    startsAt: string | null;
    hourlyPay: number | null;
  }) => void;
  defaultValues?: {
    address?: string[] | null;
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
    const rawValue = e.target.value.replace(/\D/g, '');
    const formatted = Number(rawValue).toLocaleString();
    setHourlyPay(formatted);
  };

  const handleDeleteLocation = (addr: string) => {
    setAddress((prev) => prev.filter((item) => item !== addr));
  };

  const handleReset = () => {
    setAddress([]);
    setStartsAt('');
    setHourlyPay('');
    setInputType('text');
  };

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
    <div className="z-5 flex w-full max-w-390 flex-col gap-24 rounded-[10px] border border-gray-20 bg-white px-20 py-24 shadow-custom">
      <div className="flex flex-row items-center justify-between text-[2rem] leading-[2.4rem]">
        <h3 className="text-h3 font-bold">상세 필터</h3>
        <button
          className="relative size-24"
          onClick={onClose}
          aria-label="닫기"
        >
          <img src={close} alt="닫기" className="size-full" />
        </button>
      </div>
      <div className="flex flex-col">
        <p className="text-body1 font-regular">위치</p>
        <div className="custom-scrollbar my-[0.75rem] grid h-258 w-full max-w-348 grid-cols-2 gap-32 overflow-y-auto rounded-[0.6rem] border border-[#e5e4e7] px-28 py-20 text-[1.4rem]">
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

        <div className="my-2 flex flex-wrap gap-8">
          {address.map((option) => (
            <button
              key={option}
              type="button"
              className="flex flex-row items-center rounded-[2rem] bg-[#ffebe7] px-10 py-6 text-body2 leading-[1.68rem] font-semibold text-[#ea3c12]"
              onClick={() => handleDeleteLocation(option)}
            >
              {option}
              <img src={closeRed} alt="닫기" className="size-16" />
            </button>
          ))}
        </div>

        <HorizontalLine />

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

        <div className="mb-6 flex items-end gap-[0.75rem]">
          <div className="flex-1">
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
          <span className="flex-1 pb-16 text-body1/26">이상부터</span>
        </div>

        <div className="flex gap-4">
          <Button solid={false} className="w-80" onClick={handleReset}>
            초기화
          </Button>
          <Button className="flex-1 md:w-240" onClick={handleApply}>
            적용하기
          </Button>
        </div>
      </div>
    </div>
  );

  // 분리선 컴포넌트
  function HorizontalLine() {
    return <hr className="my-24 h-2 border-none bg-gray-10" />;
  }
}
