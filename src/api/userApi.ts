import { ADDRESS_OPTIONS } from '@/constants/dropdownOptions';
import api from './api';
import { AxiosError } from 'axios';
import type { ShopItem } from './shopApi';

interface ErrorMessage {
  message: string;
}

export interface LinkInfo {
  rel: string;
  description: string;
  method: string;
  href: string;
}

export type UserType = 'employee' | 'employer';

export interface UserProfileItem {
  id: string;
  email: string;
  type: UserType;
  name?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

export interface UserDetailItem extends UserProfileItem {
  shop: { item: ShopItem } | null;
}

export interface LoginItem {
  token: string;
  user: {
    item: UserProfileItem;
    href: string;
  };
}

export type SeoulDistrict = (typeof ADDRESS_OPTIONS)[number];

// Post /token - 로그인 request
export interface LoginRequest {
  email: string;
  password: string;
}

// Post /token - 로그인 response
export interface LoginResponse {
  item: LoginItem;
  links: LinkInfo[];
}

// Post /users - 회원가입 request
export interface SignupRequest {
  email: string;
  password: string;
  type: UserType;
}

// Post /users - 회원가입 response
export interface SignupResponse {
  item: UserProfileItem;
  links: LinkInfo[];
}

// Get /users/{user_id} - 유저 정보 조회 response
// Put /users/{user_id} - 내 정보 수정 response
export interface UserDetailResponse {
  item: UserDetailItem;
  links: LinkInfo[];
}

// Put /users/{user_id} - 내 정보 수정 request
export interface UpdateUserRequest {
  name: string;
  phone: string;
  address: SeoulDistrict;
  bio: string;
}

// Post /users - 회원가입
export const postUser = async ({
  email,
  password,
  type,
}: SignupRequest): Promise<SignupResponse> => {
  try {
    const response = await api.post<SignupResponse>('/users', {
      email,
      password,
      type,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorMessage, SignupRequest>; // 에러 타입 명시
    if (axiosError.response) {
      throw new Error(axiosError.response.data.message);
    } else {
      throw new Error('서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.');
    }
  }
};

// Post /token - 로그인
export const postToken = async ({
  email,
  password,
}: LoginRequest): Promise<LoginResponse> => {
  try {
    const response = await api.post<LoginResponse>('/token', {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorMessage, LoginRequest>; // 에러 타입 명시
    if (axiosError.response) {
      throw new Error(axiosError.response.data.message);
    } else {
      throw new Error('서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.');
    }
  }
};

// get /users/{user_id} - 회원 정보 조회
export const getUser = async (userId: string): Promise<UserDetailResponse> => {
  try {
    const response = await api.get<UserDetailResponse>(`/users/${userId}`);
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

// put /users/{user_id} - 회원 정보 수정
export const putUser = async (
  userId: string,
  body: UpdateUserRequest,
): Promise<UserDetailResponse> => {
  try {
    const response = await api.put<UserDetailResponse>(
      `/users/${userId}`,
      body,
    );
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
