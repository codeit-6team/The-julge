import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  solid?: boolean;
  size?: 'large' | 'medium' | 'small';
}

export default function Button({
  solid = true,
  size = 'large',
  className = '',
  children,
  ...props
}: Props) {
  return (
    <button
      className={`rounded-md disabled:border-none disabled:bg-gray-40 disabled:text-white ${solid ? 'bg-primary text-white' : 'border border-primary bg-white text-primary'} ${size === 'large' ? 'h-48 text-body1 font-bold' : size === 'medium' ? 'h-37 text-body2 font-bold' : 'h-32 text-caption font-regular'} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
