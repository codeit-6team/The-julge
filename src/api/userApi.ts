import { ADDRESS_OPTIONS } from '@/constants/dropdownOptions';

export interface LinkInfo {
  rel: string;
  description: string;
  method: string;
  href: string;
}

export type UserType = 'employee' | 'employer';

export interface ShopItem {
  id: string;
  name: string;
  category: string;
  address1: string;
  address2: string;
  description: string;
  imageUrl: string;
  originalHourlyPay: number;
}

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

/* 아래에 user 관련 api 함수들 작성 */
