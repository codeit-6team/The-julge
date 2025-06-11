import { useId, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  unit?: string;
  ref?: React.Ref<HTMLInputElement>;
}

export default function Input({
  error,
  label,
  placeholder = '입력',
  unit,
  ref,
  ...props
}: InputProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-8 text-body1/26 font-regular text-black">
      <label htmlFor={id}>{label}</label>
      <div className="relative">
        <input
          id={id}
          ref={ref}
          placeholder={placeholder}
          {...props}
          className={`h-58 w-full rounded-md border bg-white py-16 pl-20 placeholder-gray-40 ${unit ? 'pr-60' : 'pr-20'} ${error ? 'border-red-40' : 'border-gray-30'}`}
        />
        <span className="absolute top-16 right-20">{unit}</span>
      </div>
      {error && <p className="pl-8 text-caption/16 text-red-40">{error}</p>}
    </div>
  );
}
