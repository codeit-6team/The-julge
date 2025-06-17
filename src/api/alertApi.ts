import api from './api';
import { AxiosError } from 'axios';
import type { ShopInfo } from './shopApi';

interface ErrorMessage {
  message: string;
}

export interface ApplicationItem {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface ApplicationInfo {
  item: ApplicationItem;
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
  links: LinkInfo[];
}

// PUT /users/{user_id}/alerts/{alert_id} - 알림 읽음 처리 response
export interface AlertReadResponse {
  offset: number;
  limit: number;
  items: AlertListItem[];
  links: LinkInfo[];
}

/* 아래에 alert 관련 api 함수들 작성 */
export const getAlerts = async (userId: string): Promise<AlertViewResponse> => {
  try {
    const response = await api.get<AlertViewResponse>(
      `/users/${userId}/alerts`,
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
