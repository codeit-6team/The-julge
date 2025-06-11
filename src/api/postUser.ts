import type { ErrorResponse } from 'react-router-dom';
import api from './api';
import { AxiosError } from 'axios';

export const postUser = async ({
  email,
  password,
  type,
}: {
  email: string;
  password: string;
  type: string;
}) => {
  try {
    const response = await api.post('/users', {
      email,
      password,
      type,
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
