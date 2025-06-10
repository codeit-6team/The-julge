import { type MouseEventHandler, type ReactNode } from 'react';
import ic_check from '@/assets/icons/modal_check.svg';
import ic_exclamation from '@/assets/icons/modal_exclamation.svg';

interface Props {
  /** 기본 값은 alert */
  option?: 'alert' | 'confirm' | 'action';
  /** button click event handler */
  onButtonClick?: MouseEventHandler<HTMLButtonElement>;
  /** option이 action일 때만 사용. 예 button에 해당하는 click event handler. */
  onYesButtonClick?: MouseEventHandler<HTMLButtonElement>;
  /** option이 action일 때만 사용. 예 button 내용. */
  yesButtonContent?: string;
  /** modal 문구 */
  children?: ReactNode;
}

export default function Modal({
  option = 'alert',
  onButtonClick,
  onYesButtonClick,
  yesButtonContent,
  children,
}: Props) {
  return (
    <div className="fixed inset-0 z-40 content-center justify-items-center bg-[#000000b3]">
      {option === 'alert' ? (
        <div className="flex h-220 w-327 flex-col items-center justify-between rounded-lg bg-white p-28 md:h-250 md:w-540">
          <div className="mt-53 text-body1 font-regular text-[#333236] md:mt-80 md:text-[18px]">
            {children}
          </div>
        </div>
      ) : (
        <div className="flex h-184 w-298 flex-col items-center justify-between rounded-xl bg-white p-24">
          <div className="flex flex-col items-center gap-16">
            {option === 'confirm' ? (
              <img src={ic_exclamation} />
            ) : (
              <img src={ic_check} />
            )}
            <div className="text-body1 leading-26 font-regular text-black">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
