import api from './api';
import { AxiosError } from 'axios';
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

export type ApplicationStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'canceled';

export interface ApplicationItem {
  id: string;
  status: ApplicationStatus;
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
  links: LinkInfo[];
}

// POST /shops/{shop_id}/notices/{notice_id}/applications - 가게의 특정 공고 지원 등록 response
// PUT /shops/{shop_id}/notices/{notice_id}/applications/{application_id} - 가게의 특정 공고 지원 승인, 거절 또는 취소 response
export interface ApplicationNoticeInfo {
  item: ApplicationNoticeItem;
  links: LinkInfo[];
}

// GET /users/{user_id}/applications - 유저의 지원 목록 조회 response
export interface ApplicationUserResponse {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  items: ApplicationUserInfo[];
  links: LinkInfo[];
}

// GET /shops/{shop_id}/notices/{notice_id}/applications - 가게의 특정 공고의 지원 목록 조회 response
export interface ApplicationNoticeResponse {
  offset: number;
  limit: number;
  count: number;
  hasNext: boolean;
  items: ApplicationNoticeInfo[];
  links: LinkInfo[];
}

// PUT /shops/{shop_id}/notices/{notice_id}/applications/{application_id} - 가게의 특정 공고 지원 승인, 거절 또는 취소 request
export interface ApplicationRequest {
  status: Exclude<ApplicationStatus, 'pending'>;
}

// GET /shops/{shop_id}/notices/{notice_id}/applications - 가게의 특정 공고의 지원 목록 조회
export const getNoticeApplications = async (
  shopId: string,
  noticeId: string,
  query?: { offset?: number; limit?: number },
): Promise<ApplicationNoticeResponse> => {
  try {
    const newQuery = new URLSearchParams({
      offset: String(query?.offset ?? ''),
      limit: String(query?.limit ?? ''),
    });
    const response = await api.get<ApplicationNoticeResponse>(
      `/shops/${shopId}/notices/${noticeId}/applications?${newQuery}`,
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

// POST /shops/{shop_id}/notices/{notice_id}/applications - 가게의 특정 공고 지원 등록
export const postNoticeApplications = async (
  shopId: string,
  noticeId: string,
): Promise<ApplicationNoticeInfo> => {
  try {
    const response = await api.post<ApplicationNoticeInfo>(
      `/shops/${shopId}/notices/${noticeId}/applications`,
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

// PUT /shops/{shop_id}/notices/{notice_id}/applications/{application_id} - 가게의 특정 공고 지원 승인, 거절 또는 취소
export const putNoticeApplications = async (
  shopId: string,
  noticeId: string,
  applicationId: string,
  body: ApplicationRequest,
): Promise<ApplicationNoticeInfo> => {
  try {
    const response = await api.put<ApplicationNoticeInfo>(
      `/shops/${shopId}/notices/${noticeId}/applications/${applicationId}`,
      body,
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

// GET /users/{user_id}/applications - 유저의 지원 목록 조회
export const getUserApplications = async (
  userId: string,
  query?: { offset?: number; limit?: number },
): Promise<ApplicationUserResponse> => {
  try {
    const newQuery = new URLSearchParams({
      offset: String(query?.offset ?? ''),
      limit: String(query?.limit ?? ''),
    });
    const response = await api.get<ApplicationUserResponse>(
      `/users/${userId}/applications?${newQuery}`,
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
