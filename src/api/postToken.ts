import api from './api';
import { AxiosError } from 'axios';

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
        type: string;
        name: string;
        phone: string;
        address: string;
        bio: string;
      };
      href: string;
    };
  };
  links: any[];
}

interface ErrorResponse {
  message: string;
}

export const postToken = async ({
  email,
  password,
}: LoginParams): Promise<LoginResponse> => {
  try {
    const response = await api.post('/token', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;

    if (axiosError.response) {
      throw new Error(axiosError.response.data.message);
    } else {
      throw new Error('서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.');
    }
  }
};
