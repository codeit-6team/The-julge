import type { NoticeInfo } from './alertApi';
import type { ShopInfo } from './shopApi';

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
