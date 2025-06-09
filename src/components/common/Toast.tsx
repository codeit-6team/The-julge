import type { HTMLAttributes } from 'react';

export default function Toast({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <div className={`${className}`} {...props}>
      {children}
    </div>
  );
}
