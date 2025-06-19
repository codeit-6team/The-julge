import type { ApplicationItem } from './applicationApi';
import type { ShopInfo } from './shopApi';

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

// GET /notices 공고 조회 - Response
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

// GET /shops/{shop_id}/notices 가게별 공고 조회 - Response
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

// POST /shops/{shop_id}/notices 공고 등록 - Response
// PUT /shops/{shop_id}/notices/{notice_id} 특정 공고 수정 - Response
export interface NoticeUpsertResponse {
  item: NoticeWithShopItem;
  links: LinkInfo[];
}

// GET /shops/{shop_id}/notices/{notice_id} 가게의 특정 공고 조회 - Response
export interface GetNoticeDetailResponse {
  item: NoticeDetailItem;
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
