import { useEffect, useState } from 'react';
import CameraGray from '@/assets/icons/camera-gray.svg';
import CameraWhite from '@/assets/icons/camera-white.svg';

interface ImageInputProps {
  label: string;
  imageUrl: string;
  onImageChange: (file: File, previewUrl: string) => void;
  mode?: 'create' | 'edit';
}

export default function ImageInput({
  label,
  imageUrl,
  onImageChange,
  mode = 'create',
}: ImageInputProps) {
  const [preview, setPreview] = useState(imageUrl);

  useEffect(() => {
    setPreview(imageUrl);
  }, [imageUrl]);

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    onImageChange(file, previewUrl);
  };

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="flex flex-col gap-8">
      <label className="text-body1/26 font-regular text-black">{label}</label>

      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleChangeFile}
        className="hidden"
      />

      <label
        htmlFor="fileInput"
        className="relative flex h-200 w-full cursor-pointer items-center justify-center rounded-xl border border-gray-30 bg-gray-10 md:h-276"
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="미리보기"
              className="size-full rounded-xl object-cover"
            />
            {mode === 'edit' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-11 rounded-xl bg-[#000000]/70 text-white">
                <img src={CameraWhite} alt="카메라" className="size-32" />
                <span className="text-body1/20 font-bold text-white">
                  이미지 변경하기
                </span>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-11">
            <img src={CameraGray} alt="카메라" className="size-32" />
            <span className="text-body1/20 font-bold text-gray-40">
              이미지 추가하기
            </span>
          </div>
        )}
      </label>
    </div>
  );
}
