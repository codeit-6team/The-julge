import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bootcamp-api.codeit.kr/api/15-6/the-julge', // 공통 prefix
  headers: {
    'Content-Type': 'application/json',
  },
});

// 가독성을 위해 prettier-ignore 적용
//prettier-ignore
function isPublicRequest(method?: string, url?: string): boolean {
  if (!method || !url) return false;

  return (
    method === 'get' &&
      (
        url?.startsWith('/notices') ||
        url?.startsWith('/shops')
      )) ||
    (method === 'post' &&
      (
        url === '/token' ||
        url === '/users'
      )
    );
}

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    const { url, method } = config;

    const isPublic = isPublicRequest(method, url);
    if (!isPublic && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
