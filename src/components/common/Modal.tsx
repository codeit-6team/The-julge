import type { MouseEventHandler } from 'react';

interface Props {
  /** 기본 값은 alert */
  option?: 'alert' | 'confirm' | 'action';
  /** button click event handler */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** option이 action일 때만 사용. 아니오 button에 해당하는 click event handler. */
  onClickNo?: MouseEventHandler<HTMLButtonElement>;
  /** option이 alert일 때만 사용. */
  content?: string;
}

export default function Modal({
  option = 'alert',
  onClick,
  onClickNo,
  content,
}: Props) {
  return (
    <div className="fixed inset-0 z-40 content-center justify-items-center bg-[#000000b3]">
      <div
        className={`flex flex-col items-center justify-between bg-white ${option === 'alert' ? 'h-220 w-327 rounded-lg p-28 md:h-250 md:w-540' : 'h-184 w-298 rounded-xl p-24'}`}
      ></div>
    </div>
  );
}
