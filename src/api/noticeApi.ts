import type { ApplicationItem } from './applicationApi';
import type { ShopInfo } from './shopApi';
import api from './api';

export const getNotices = async (params: {
  offset?: number;
  limit?: number;
  address?: string;
  keyword?: string;
  startsAtGte?: string;
  hourlyPayGte?: number;
  sort?: 'time' | 'pay' | 'hour' | 'shop';
}) => {
  const query = new URLSearchParams(
    Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== '')
      .map(([k, v]) => [k, String(v)]),
  );
  const response = await api.get<GetNoticesResponse>(`/notices?${query}`);
  return response.data;
};

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
export interface NoticeWithShopItem extends NoticeItem {
  shop: ShopInfo;
}

// application까지 포함된 상세형 Notice (상세 조회 시 사용)
export interface NoticeDetailItem extends NoticeWithShopItem {
  currentUserApplication?: {
    item: ApplicationItem;
  };
}

// GET /notices 공고 조회
// Response
export interface GetNoticesResponse {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  address: string[];
  keyword?: string;
  items: {
    item: NoticeWithShopItem;
    links: LinkInfo[];
  }[];
  links: LinkInfo[];
}

// GET /shops/{shop_id}/notices 가게별 공고 조회
// Response
export interface GetShopNoticesResponse {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  items: {
    item: NoticeItem;
    links: LinkInfo[];
  }[];
  links: LinkInfo[];
}

// POST /shops/{shop_id}/notices 공고 등록
// PUT /shops/{shop_id}/notices/{notice_id} 특정 공고 수정
// Request Body
export interface NoticeUpsertRequest {
  hourlyPay: number;
  startsAt: string;
  workhour: number;
  description: string;
}

// Response
export interface NoticeUpsertResponse {
  item: NoticeWithShopItem;
  links: LinkInfo[];
}

// GET /shops/{shop_id}/notices/{notice_id} 가게의 특정 공고 조회
// Response
export interface GetNoticeDetailResponse {
  item: NoticeDetailItem;
  links: LinkInfo[];
}
