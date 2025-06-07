import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  solid?: boolean;
  size?: 'large' | 'medium' | 'small';
}

export default function Button({ className = '', children, ...props }: Props) {
  return (
    <button className={`${className}`} {...props}>
      {children}
    </button>
  );
}
