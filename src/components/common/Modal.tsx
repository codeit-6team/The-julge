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
  return <div className="fixed inset-0 z-40 bg-[#000000b3]"></div>;
}
