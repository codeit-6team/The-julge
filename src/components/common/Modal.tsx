import {
  type MouseEventHandler,
  type ReactNode,
  useEffect,
  useRef,
} from 'react';
import Button from './Button';
import ic_check from '@/assets/icons/modal_check.svg';
import ic_exclamation from '@/assets/icons/modal_exclamation.svg';

interface Props {
  /** 기본 값은 alert */
  option?: 'alert' | 'confirm' | 'action';
  /** button click event handler */
  onButtonClick?: MouseEventHandler<HTMLButtonElement>;
  /** option이 action일 때만 사용. solid button에 해당하는 click event handler. */
  onYesButtonClick?: MouseEventHandler<HTMLButtonElement>;
  /** option이 action일 때만 사용. solid button 내용. */
  yesButtonContent?: string;
  /** modal 문구 */
  children?: ReactNode;
  /** 모달이 닫힐 때 (버튼 클릭 제외) 실행할 함수 */
  onClose: () => void;
}

export default function Modal({
  option = 'alert',
  onButtonClick,
  onYesButtonClick,
  yesButtonContent,
  children,
  onClose,
}: Props) {
  const modalRef = useRef<HTMLDivElement>(null);

  // 바깥 클릭 시 모달 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      const target = event.target as Node;
      if (modalRef.current && !modalRef.current.contains(target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // esc로 닫기
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        onClose();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 content-center justify-items-center bg-[#000000b3]">
      {option === 'alert' ? (
        <div
          ref={modalRef}
          className="flex h-220 w-327 flex-col items-center justify-between rounded-lg bg-white p-28 md:h-250 md:w-540"
        >
          <div className="mt-53 text-center text-body1/19 font-regular text-[#333236] md:mt-80 md:text-[18px]/21">
            {children}
          </div>
          <button
            className="h-42 w-138 rounded-lg bg-primary text-body2 font-regular text-white md:h-48 md:w-120 md:self-end md:text-body1"
            onClick={onButtonClick}
          >
            확인
          </button>
        </div>
      ) : (
        <div
          ref={modalRef}
          className="flex h-184 w-298 flex-col items-center justify-between rounded-xl bg-white p-24"
        >
          <div className="flex flex-col items-center gap-16">
            {option === 'action' ? (
              <img src={ic_check} />
            ) : (
              <img src={ic_exclamation} />
            )}
            <div className="text-center text-body1 leading-26 font-regular text-black">
              {children}
            </div>
          </div>
          <div className="flex gap-8">
            <Button
              className="w-80"
              size="medium"
              solid={false}
              onClick={onButtonClick}
            >
              {option === 'action' ? '아니오' : '확인'}
            </Button>
            {option === 'action' && (
              <Button className="w-80" size="medium" onClick={onYesButtonClick}>
                {yesButtonContent}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
