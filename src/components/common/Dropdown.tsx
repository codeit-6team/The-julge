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
  setSelect: Dispatch<SetStateAction<string>>; // Dispatch<SetStateAction<string>>는 set함수 타입
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
        className={`flex items-center justify-between rounded-md ${variant === 'form' ? 'border-gray-30 text-body1 w-full border bg-white px-20 py-16' : 'bg-gray-10 text-body2 h-30 w-105 rounded-5 justify-center gap-6 px-12'}`}
      >
        <span className={selected ? 'text-black' : 'text-gray-40'}>
          {selected || placeholder}
        </span>
        <img
          src={Down}
          alt="arrow down"
          className={`${isOpen ? '' : 'rotate-180'} ${variant === 'form' ? 'h-16 w-16' : 'h-10 w-10'}`}
        />
      </button>

      {isOpen && (
        <div
          className={`border-gray-20 absolute left-0 right-0 mt-8 flex cursor-pointer flex-col rounded-md border bg-white text-black ${variant === 'form' ? 'h-230 w-full overflow-y-auto' : 'h-160 w-105 justify-center py-12'}`}
        >
          <ul
            className={`${variant === 'form' ? '' : 'h-136 flex flex-col gap-8'}`}
          >
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className={`border-gray-20 text-body2 font-regular leading-22 flex items-center justify-center border-b text-black last:border-b-0 ${variant === 'form' ? 'pb-11 pt-12' : 'pb-8'}`}
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
