// Link (공통 링크 타입)
export interface LinkInfo {
  rel: string;
  description: string;
  method: string;
  href: string;
}

// Shop 관련
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

export interface ShopInfo {
  item: ShopItem;
  href: string;
}

// Application (신청 상태)
export interface ApplicationItem {
  id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'canceled';
  createdAt: string;
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

// 공통 Notice Info
export interface NoticeInfo {
  item: NoticeItem;
  href: string;
}

// 공고에 포함되는 상세 정보 (shop, application 포함)
export interface NoticeDetailItem extends NoticeItem {
  shop: ShopInfo;
  currentUserApplication?: {
    item: ApplicationItem;
  };
}

// GET /notices 공고 조회
// Request Query
export interface GetNoticesQuery {
  offset?: number;
  limit?: number;
  address?: string;
  keyword?: string;
  startsAtGte?: string; // RFC 3339
  hourlyPayGte?: number;
  sort?: 'time' | 'pay' | 'hour' | 'shop';
}

// Response
export interface GetNoticesResponse {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  address: string[];
  keyword?: string;
  items: {
    item: {
      id: string;
      hourlyPay: number;
      startsAt: string;
      workhour: number;
      description: string;
      closed: boolean;
      shop: ShopInfo;
    };
    links: LinkInfo[];
  }[];
  links: LinkInfo[];
}

// GET /shops/{shop_id}/notices 가게별 공고 조회
// path param
export interface GetShopNoticePathParam {
  shop_id: string;
}

// Request Query
export interface GetShopNoticesQuery {
  offset?: number;
  limit?: number;
}

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
// Request Body
export interface CreateNoticeRequest {
  hourlyPay: number;
  startsAt: string;
  workhour: number;
  description: string;
}

// Response
export interface CreateNoticeResponse {
  item: {
    id: string;
    hourlyPay: number;
    startsAt: string;
    workhour: number;
    description: string;
    closed: boolean;
    shop: ShopInfo;
  };
  links: LinkInfo[];
}

// GET /shops/{shop_id}/notices/{notice_id} 가게의 특정 공고 조회
// Response
export interface GetNoticeDetailResponse {
  item: {
    id: string;
    hourlyPay: number;
    startsAt: string;
    workhour: number;
    description: string;
    closed: boolean;
    shop: ShopInfo;
    currentUserApplication?: {
      item: ApplicationItem;
    };
  };
  links: LinkInfo[];
}

// PUT /shops/{shop_id}/notices/{notice_id} 특정 공고 수정
// Request Body
export interface UpdateNoticeRequest {
  hourlyPay: number;
  startsAt: string;
  workhour: number;
  description: string;
}

// Response
export interface UpdateNoticeResponse {
  item: {
    id: string;
    hourlyPay: number;
    startsAt: string;
    workhour: number;
    description: string;
    closed: boolean;
    shop: ShopInfo;
  };
  links: LinkInfo[];
}
