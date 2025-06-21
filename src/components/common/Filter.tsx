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
    <div className="fixed inset-0 z-5 flex w-full flex-col gap-24 overflow-y-auto border border-gray-20 bg-white px-12 py-24 shadow-custom md:static md:max-w-390 md:rounded-xl md:px-19">
      <div className="flex flex-row items-center justify-between">
        <h3 className="text-h3 font-bold text-black">상세 필터</h3>
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
        <div className="custom-scrollbar my-12 grid h-258 w-full grid-cols-2 gap-32 overflow-y-auto rounded-md border border-gray-20 px-28 py-20 md:max-w-348">
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
              className="flex flex-row items-center rounded-3xl bg-red-10 px-10 py-6 text-body2 font-bold text-primary"
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

        <div className="mb-80 flex items-end gap-12 md:mb-40">
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

        <div className="fixed right-0 bottom-0 left-0 flex w-full gap-8 border-t border-gray-20 bg-white px-12 py-16 md:static md:border-none md:p-0">
          <Button
            solid={false}
            className="w-full flex-[0.5] md:max-w-82"
            onClick={handleReset}
          >
            초기화
          </Button>
          <Button className="w-full flex-1 md:max-w-260" onClick={handleApply}>
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
