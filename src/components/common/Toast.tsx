import type { HTMLAttributes } from 'react';

export default function Toast({ ...props }: HTMLAttributes<HTMLElement>) {
  return <div {...props}></div>;
}
