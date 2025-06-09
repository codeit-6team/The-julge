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
      className={`rounded-md disabled:border-none disabled:bg-gray-40 disabled:text-white ${solid ? 'bg-red-40 text-white' : 'border border-red-40 bg-white text-red-40'} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
