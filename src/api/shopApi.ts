import api from './api';
import { AxiosError } from 'axios';
import type {
  ADDRESS_OPTIONS,
  CATEGORY_OPTIONS,
} from '@/constants/dropdownOptions';
import type { UserProfileItem } from './userApi';

interface ErrorMessage {
  message: string;
}

export interface LinkInfo {
  rel: string;
  description: string;
  method: string;
  href: string;
}

export interface ShopItem {
  id: string;
  name: string;
  category: (typeof CATEGORY_OPTIONS)[number];
  address1: (typeof ADDRESS_OPTIONS)[number];
  address2: string;
  description: string;
  imageUrl: string;
  originalHourlyPay: number;
}

export interface ShopInfo {
  item: ShopItem;
  href: string;
}

// POST /shops - 가게 등록 request
// PUT /shops/{shop_id} - 가게 정보 수정 request
export type ShopRequest = Omit<ShopItem, 'id'>;

// POST /shops - 가게 등록 response
// GET /shops/{shop_id} - 가게 정보 조회 response
// PUT /shops/{shop_id} - 가게 정보 수정 response
export interface ShopResponse {
  item: ShopItem & {
    user: {
      item: UserProfileItem;
      href: string;
    };
  };
  links: LinkInfo[];
}

export const postShop = async (body: ShopRequest): Promise<ShopResponse> => {
  try {
    const response = await api.post<ShopResponse>('/shops', body);
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
