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
