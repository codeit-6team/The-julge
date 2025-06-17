import { useEffect, useRef, useState } from 'react';
import Camera from '@/assets/icons/camera.svg';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (file: File, previewUrl: string) => void;
}

export default function ImageUpload({
  label,
  value,
  onChange,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = useState<string>(value);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const previewUrl = reader.result as string;
      setPreview(previewUrl);
      onChange(file, previewUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-8">
      <label className="text-body1/26 font-regular text-black">{label}</label>

      <div
        onClick={handleButtonClick}
        className="flex h-200 w-full cursor-pointer items-center justify-center rounded-xl border border-gray-30 bg-gray-10 md:h-276 md:w-483"
      >
        {preview ? (
          <img
            src={preview}
            alt="미리보기"
            className="size-full rounded-xl object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-11">
            <img src={Camera} alt="카메라" className="size-32" />
            <span className="text-body1/20 font-bold text-gray-40">
              이미지 추가하기
            </span>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleChangeFile}
        className="hidden"
      />
    </div>
  );
}
