import type { HTMLAttributes } from 'react';

export default function Toast({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <div
      className={`z-10 inline-block rounded-[5px] bg-red-30 px-16 py-10 text-body1/26 font-regular text-white ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
