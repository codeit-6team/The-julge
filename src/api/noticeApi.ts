import api from './api';
import { AxiosError } from 'axios';
import type { ApplicationItem } from './applicationApi';
import type { ShopInfo } from './shopApi';

interface ErrorMessage {
  message: string;
}

// Link (공통 링크 타입)
export interface LinkInfo {
  rel: string;
  description: string;
  method: string;
  href: string;
}

// 공통 Notice Item
export interface NoticeItem {
  id: string;
  hourlyPay: number;
  startsAt: string;
  workhour: number;
  description: string;
  closed: boolean;
}

// shop 포함된 확장형 Notice (리스트, 등록, 수정에 사용)
export interface NoticeShopItem extends NoticeItem {
  shop: ShopInfo;
}

// application까지 포함된 상세형 Notice (상세 조회 시 사용)
export interface NoticeDetailItem extends NoticeShopItem {
  currentUserApplication?: {
    item: ApplicationItem;
  };
}

export interface NoticeInfo {
  item: NoticeItem;
  links: LinkInfo[];
}

// POST /shops/{shop_id}/notices 공고 등록 - Response
// PUT /shops/{shop_id}/notices/{notice_id} 특정 공고 수정 - Response
export interface NoticeShopInfo {
  item: NoticeShopItem;
  links: LinkInfo[];
}

// GET /shops/{shop_id}/notices/{notice_id} 가게의 특정 공고 조회 - Response
export interface GetNoticeDetailResponse {
  item: NoticeDetailItem;
  links: LinkInfo[];
}

// GET /notices 공고 조회 - Response
export interface GetNoticesResponse {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  address: string[];
  keyword?: string;
  items: NoticeShopInfo[];
  links: LinkInfo[];
}

// GET /shops/{shop_id}/notices 가게별 공고 조회 - Response
export interface GetShopNoticesResponse {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  items: NoticeInfo[];
  links: LinkInfo[];
}

// POST /shops/{shop_id}/notices 공고 등록 - Request Body
// PUT /shops/{shop_id}/notices/{notice_id} 특정 공고 수정 - Request Body
export interface NoticeUpsertRequest {
  hourlyPay: number;
  startsAt: string;
  workhour: number;
  description: string;
}

// GET /notices 공고 조회
export const getNotices = async (query?: {
  offset?: number;
  limit?: number;
  address?: string;
  keyword?: string;
  startsAtGte?: string;
  hourlyPayGte?: number;
  sort?: 'time' | 'pay' | 'hour' | 'shop';
}): Promise<GetNoticesResponse> => {
  try {
    const newQuery = new URLSearchParams({
      ...query,
      offset: String(query?.offset ?? ''),
      limit: String(query?.limit ?? ''),
      hourlyPayGte: String(query?.hourlyPayGte ?? ''),
    });
    const response = await api.get<GetNoticesResponse>(`/notices?${newQuery}`);
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

// GET /shops/{shop_id}/notices 가게별 공고 조회
export const getShopNotices = async (
  shopId: string,
  query?: { offset?: number; limit?: number },
): Promise<GetShopNoticesResponse> => {
  try {
    const newQuery = new URLSearchParams({
      offset: String(query?.offset ?? ''),
      limit: String(query?.limit ?? ''),
    });
    const response = await api.get<GetShopNoticesResponse>(
      `/shops/${shopId}/notices?${newQuery}`,
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

// POST /shops/{shop_id}/notices 공고 등록
export const postShopNotice = async (
  shopId: string,
  body: NoticeUpsertRequest,
): Promise<NoticeShopInfo> => {
  try {
    const response = await api.post<NoticeShopInfo>(
      `/shops/${shopId}/notices`,
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

// GET /shops/{shop_id}/notices/{notice_id} 가게의 특정 공고 조회
export const getShopNotice = async (
  shopId: string,
  noticeId: string,
): Promise<GetNoticeDetailResponse> => {
  try {
    const response = await api.get<GetNoticeDetailResponse>(
      `/shops/${shopId}/notices/${noticeId}`,
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

// PUT /shops/{shop_id}/notices/{notice_id} 특정 공고 수정
export const putShopNotice = async (
  shopId: string,
  noticeId: string,
  body: NoticeUpsertRequest,
): Promise<NoticeShopInfo> => {
  try {
    const response = await api.put<NoticeShopInfo>(
      `/shops/${shopId}/notices/${noticeId}`,
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
