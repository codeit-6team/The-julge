import axios from 'axios';

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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
