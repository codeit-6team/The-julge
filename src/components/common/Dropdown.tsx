import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import Down from '@/assets/icons/dropdown.svg';

interface DropdownProps<T extends string> {
  options: readonly T[];
  selected: T;
  setSelect: Dispatch<SetStateAction<T>>; // Dispatch<SetStateAction<T>>는 set함수 타입
  placeholder?: string;
  variant: 'form' | 'filter';
  id?: string;
}

export default function Dropdown<T extends string>({
  options,
  selected,
  setSelect,
  placeholder = '선택',
  variant,
  id,
}: DropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const handleSelect = (options: T) => {
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
        id={id}
        type="button"
        onClick={toggleDropdown}
        className={`flex items-center justify-between rounded-md ${variant === 'form' ? 'h-58 w-full border border-gray-30 bg-white px-20 py-16 text-body1 font-regular' : 'h-30 w-105 justify-center gap-6 rounded-[5px] bg-gray-10 px-12 text-body2 font-bold'}`}
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
          className={`absolute right-0 left-0 z-20 mt-8 flex cursor-pointer flex-col rounded-md border border-gray-20 bg-white text-black shadow-custom2 ${variant === 'form' ? 'h-230 w-full overflow-y-auto' : 'h-160 w-105 justify-center py-12'}`}
        >
          <ul
            className={`${variant === 'form' ? '' : 'flex h-136 flex-col gap-8'}`}
          >
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className={`flex items-center justify-center border-b border-gray-20 text-body2 leading-22 font-regular text-black last:border-b-0 ${variant === 'form' ? 'pt-12 pb-11' : 'pb-8'}`}
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
