import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  solid?: boolean;
  size?: 'large' | 'medium' | 'small';
}

export default function Button({
  solid = true,
  className = '',
  children,
  ...props
}: Props) {
  return (
    <button
      className={`${solid ? 'bg-red-40 text-white' : 'bg-white text-red-40 border border-red-40'} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
