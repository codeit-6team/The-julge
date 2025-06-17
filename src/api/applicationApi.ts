import type { NoticeInfo } from './alertApi';
import type { ShopInfo } from './shopApi';
import type { UserProfileItem } from './userApi';

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
