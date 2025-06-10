import { useId } from 'react';

interface InputProps {
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  unit?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({
  value,
  error,
  onChange,
  label,
  type = 'text',
  required,
  unit,
}: InputProps) {
  const id = useId();
  return (
    <div className="flex flex-col gap-8 text-body1/26 font-regular text-black">
      <label htmlFor={id}>{label}</label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder="입력"
          required={required}
          className={`h-58 w-full rounded-md border bg-white px-20 py-16 ${error ? 'border-red-40' : 'border-gray-30'}`}
        />
        <span className="absolute top-16 right-20">{unit}</span>
      </div>
      {error && <p className="pl-8 text-caption/16 text-red-40">{error}</p>}
    </div>
  );
}
