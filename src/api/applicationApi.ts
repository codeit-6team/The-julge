import type { NoticeInfo } from './alertApi';
import type { ShopInfo } from './shopApi';
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

export interface ApplicationItem {
  id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'canceled';
  createdAt: string;
}

export interface ApplicationUserItem extends ApplicationItem {
  shop: ShopInfo;
  notice: NoticeInfo;
}

export interface ApplicationNoticeItem extends ApplicationUserItem {
  user: {
    item: UserProfileItem;
    href: string;
  };
}

export interface ApplicationUserInfo {
  item: ApplicationUserItem;
  link: LinkInfo[];
}

// POST /shops/{shop_id}/notices/{notice_id}/applications - 가게의 특정 공고 지원 등록 response
// PUT /shops/{shop_id}/notices/{notice_id}/applications/{application_id} - 가게의 특정 공고 지원 승인, 거절 또는 취소 response
export interface ApplicationNoticeInfo {
  item: ApplicationNoticeItem;
  link: LinkInfo[];
}

// GET /users/{user_id}/applications - 유저의 지원 목록 조회 response
export interface ApplicationUserResponse {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  items: ApplicationUserInfo[];
  link: LinkInfo[];
}

// GET /shops/{shop_id}/notices/{notice_id}/applications - 가게의 특정 공고의 지원 목록 조회 response
export interface ApplicationNoticeResponse {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  items: ApplicationNoticeInfo[];
  link: LinkInfo[];
}

// PUT /shops/{shop_id}/notices/{notice_id}/applications/{application_id} - 가게의 특정 공고 지원 승인, 거절 또는 취소 request
export interface ApplicationRequest {
  status: 'accepted' | 'rejected' | 'canceled';
}
