export interface ApplicationItem {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ApplicationInfo {
  item: ApplicationItem;
  href: string;
}

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

export interface NoticeItem {
  id: string;
  hourlyPay: number;
  description: string;
  startsAt: string;
  workhour: number;
  closed: boolean;
}

export interface NoticeInfo {
  item: NoticeItem;
  href: string;
}

export interface LinkInfo {
  rel: string;
  description: string;
  method: string;
  href: string;
}

export interface AlertContentItem {
  id: string;
  createdAt: string;
  result: 'accepted' | 'rejected';
  read: boolean;
  application: ApplicationInfo;
  shop: ShopInfo;
  notice: NoticeInfo;
  links: LinkInfo[];
}

export interface AlertListItem {
  item: AlertContentItem;
  links: LinkInfo[];
}

// GET /users/{user_id}/alerts - 유저의 알림 목록 조회 response
export interface AlertViewResponse {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  items: AlertListItem[];
}

// PUT /users/{user_id}/alerts/{alert_id} - 알림 읽음 처리 response
export interface AlertReadResponse {
  offset: number;
  limit: number;
  items: AlertListItem[];
}

/* 아래에 alert 관련 api 함수들 작성 */
