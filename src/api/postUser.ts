import api from './api';
import { AxiosError } from 'axios';

interface ErrorMessage {
  message: string;
}

interface SignupParams {
  email: string;
  password: string;
  type: string;
}

export const postUser = async ({ email, password, type }: SignupParams) => {
  try {
    const response = await api.post('/users', {
      email,
      password,
      type,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorMessage>; // 에러 타입 명시
    if (axiosError.response) {
      throw new Error(axiosError.response.data.message);
    } else {
      throw new Error('서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.');
    }
  }
};
