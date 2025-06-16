import type { UserProfileItem } from './userApi';

export interface LinkInfo {
  rel: string;
  description: string;
  method: string;
  href: string;
}

// POST /shops - 가게 등록 request
// PUT /shops/{shop_id} - 가게 정보 수정 request
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
