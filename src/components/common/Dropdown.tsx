import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import Down from '@/assets/icons/dropdown.svg';

interface DropdownProps {
  options: string[];
  selected: string;
  setSelect: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  variant: 'form' | 'filter';
}

export default function Dropdown({
  options,
  selected,
  setSelect,
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

  const handleSelect = (options: string) => {
    setSelect(options);
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
        className={`flex cursor-pointer items-center justify-between rounded-md ${variant === 'form' ? 'w-full border border-gray-30 bg-white px-5 py-4 text-body1' : 'h-[30px] w-[105px] justify-center gap-[6px] rounded-[5px] bg-gray-10 px-3 text-body2'}`}
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
        <div
          className={`absolute right-0 left-0 mt-2 flex cursor-pointer flex-col rounded-md border border-gray-20 bg-white text-black ${variant === 'form' ? 'h-[230px] w-full overflow-y-auto' : 'h-[160px] w-[105px] justify-center py-3'}`}
        >
          <ul
            className={`${variant === 'form' ? '' : 'flex h-[136px] flex-col gap-2'}`}
          >
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className={`flex items-center justify-center border-b border-gray-20 text-body2 leading-[22px] font-regular text-black last:border-b-0 ${variant === 'form' ? 'pt-3 pb-[11px]' : 'pb-2'}`}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
