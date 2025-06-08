import { useEffect, useRef, useState } from 'react';
import Down from '@/assets/icons/dropdown.svg';

interface DropdownProps {
  items: string[];
  selected: string;
  onSelect: (value: string) => void;
  placeholder?: string;
  variant: 'form' | 'filter';
}

export default function Dropdown({
  items,
  selected,
  onSelect,
  placeholder = '선택',
  variant,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleSelect = (item: string) => {
    onSelect(item);
    closeDropdown();
  };

  // 외부 클릭 시 닫힘
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        closeDropdown();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className={`flex cursor-pointer items-center justify-between rounded-md border border-gray-30 bg-white ${variant === 'form' ? 'w-full px-5 py-4 text-base' : 'bg-gray-10px-3 rounded-[5px]px-3 h-[30px] w-[105px] gap-[6px] px-2.5 text-sm'}`}
      >
        <span className={selected ? 'text-black' : 'text-gray-40'}>
          {selected || placeholder}
        </span>
        <img
          src={Down}
          alt="arrow down"
          className={`${isOpen ? '' : 'rotate-180'} ${variant === 'form' ? 'h-4 w-4' : 'h-[10px] w-[10px]'}`}
        />
      </button>

      {isOpen && (
        <ul
          className={`absolute right-0 left-0 mt-2 flex cursor-pointer flex-col justify-center rounded-md border border-gray-20 bg-white text-black ${variant === 'form' ? 'h-[230px] w-full overflow-y-scroll' : 'h-[160px] w-[105px]'}`}
        >
          {items.map((item) => (
            <li
              key={item}
              onClick={() => handleSelect(item)}
              className={`flex w-full cursor-pointer items-center justify-center border-b border-gray-20 text-sm leading-[22px] font-regular text-black last:border-b-0 ${variant === 'form' ? 'py-3' : 'py-2'}`}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
