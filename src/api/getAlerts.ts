import api from './api';
import { AxiosError } from 'axios';

interface ErrorMessage {
  message: string;
}

interface AlertItem {
  item: {
    id: string;
    createdAt: string;
    result: 'accepted' | 'rejected';
    read: boolean;
    application: {
      item: {
        id: string;
        status: 'pending' | 'accepted' | 'rejected';
      };
      href: string;
    };
    shop: {
      item: {
        id: string;
        name: string;
        category: string;
        address1: string;
        address2: string;
        description: string;
        imageUrl: string;
        originalHourlyPay: number;
      };
      href: string;
    };
    notice: {
      item: {
        id: string;
        hourlyPay: number;
        description: string;
        startsAt: string;
        workhour: number;
        closed: boolean;
      };
      href: string;
    };
    links: object[]; // 정확한 타입이 나와있지 않아서 우선 object로만 처리함
  };
  links: object[]; // 정확한 타입이 나와있지 않아서 우선 object로만 처리함
}

interface AlertsResponse {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  items: AlertItem[];
}

export const getAlerts = async (userId: string): Promise<AlertsResponse> => {
  try {
    const response = await api.get<AlertsResponse>(`/users/${userId}/alerts`);
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
