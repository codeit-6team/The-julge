import api from './api';
import { AxiosError } from 'axios';
import type { LinkInfo } from './shopApi';

interface ErrorMessage {
  message: string;
}

interface ImageResponse {
  item: {
    url: string; // ✅ 쿼리 스트링 포함된 presigned S3 PUT URL
  };
  links: LinkInfo[];
}

// Presigned URL 발급 요청
export const getPresignedUrl = async (filename: string): Promise<string> => {
  try {
    const response = await api.post<ImageResponse>('/images', {
      name: filename,
    });
    return response.data.item.url;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorMessage>; // 에러 타입 명시
    if (axiosError.response) {
      throw new Error(axiosError.response.data.message);
    } else {
      throw new Error('서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.');
    }
  }
};

// S3 업로드
export const uploadImageToS3 = async (
  uploadUrl: string,
  file: File,
): Promise<void> => {
  try {
    await api.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  } catch (error) {
    const axiosError = error as AxiosError<ErrorMessage>; // 에러 타입 명시
    if (axiosError.response) {
      throw new Error(axiosError.response.data.message);
    } else {
      throw new Error('서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.');
    }
  }
};
