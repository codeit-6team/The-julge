import api from './api';
import { AxiosError } from 'axios';

interface ErrorMessage {
  message: string;
}

interface LoginParams {
  email: string;
  password: string;
}

interface LoginResponse {
  item: {
    token: string;
    user: {
      item: {
        id: string;
        email: string;
        type: employer | employee;
        name: string;
        phone: string;
        address: string;
        bio: string;
      };
      href: string;
    };
  };
  links: object[]; // 정확한 타입이 나와있지 않아서 우선 object로만 처리함
}

export const postToken = async ({
  email,
  password,
}: LoginParams): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/token', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorMessage, LoginParams>; // 에러 타입 명시
    if (axiosError.response) {
      throw new Error(axiosError.response.data.message);
    } else {
      throw new Error('서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.');
    }
  }
};
