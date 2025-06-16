import api from './api';
import { AxiosError } from 'axios';

interface ErrorMessage {
  message: string;
}

interface SignupParams {
  email: string;
  password: string;
  type: 'employee' | 'employer';
}

interface SignupResponse {
  item: {
    id: string;
    email: string;
    type: 'employee' | 'employer';
  };
  links: object[]; // 정확한 타입이 나와있지 않아서 우선 object로만 처리함
}

export const postUser = async ({
  email,
  password,
  type,
}: SignupParams): Promise<SignupResponse> => {
  try {
    const response = await api.post<SignupResponse>('/users', {
      email,
      password,
      type,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorMessage, SignupParams>; // 에러 타입 명시
    if (axiosError.response) {
      throw new Error(axiosError.response.data.message);
    } else {
      throw new Error('서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.');
    }
  }
};
