import axios from 'axios';

const api = axios.create({
  baseURL: 'https://bootcamp-api.codeit.kr/api/0-1/the-julge', // 공통 prefix
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

export default api;
