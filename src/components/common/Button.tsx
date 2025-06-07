import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  solid?: boolean;
  size?: 'large' | 'medium' | 'small';
}

export default function Button({ children, ...props }: Props) {
  return <button {...props}>{children}</button>;
}
