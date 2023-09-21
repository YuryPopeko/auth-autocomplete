import axios from 'axios';

import { STATUS_CODES } from '../consts';

const baseURL = 'https://icebrg.mehanik.me/api/';
const api = axios.create({ baseURL });

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === STATUS_CODES.UNAUTHORIZED &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(`${baseURL}login/refresh`, {
          refresh_token: localStorage.getItem('refreshToken'),
        });

        localStorage.setItem('accessToken', response.data.access_token);
        localStorage.setItem('refreshToken', response.data.refresh_token);
        originalRequest.headers.Authorization = `Bearer ${response.data.access_token}`;

        return axios(originalRequest);
      } catch (error) {
        localStorage.clear();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
