import axios from 'axios';

const publicPaths = ['/login', '/signup'];

const api = axios.create({
  baseURL: 'https://bootcamp-api.codeit.kr/api/0-1/the-julge', // 공통 prefix
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    const isPublic = publicPaths.some((path) => config.url?.includes(path));
    if (!isPublic && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
