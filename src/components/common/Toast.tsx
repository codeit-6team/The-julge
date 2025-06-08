import type { HTMLAttributes } from 'react';

export default function Toast({
  children,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return <div {...props}>{children}</div>;
}
