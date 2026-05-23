import axios from 'axios';
import { toast } from "sonner"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('internalToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 503 || status === 504) {
        toast.error("Layanan sementara terganggu, coba lagi");
      }
    } else if (error.request) {
      toast.error("Layanan sementara terganggu, coba lagi");
    }
    return Promise.reject(error);
  }
);

export default api;
