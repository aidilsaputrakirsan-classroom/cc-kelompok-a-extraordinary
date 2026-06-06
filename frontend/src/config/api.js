import axios from 'axios';
import { toast } from 'sonner';

const SERVICE_ERROR_EVENT = 'temuin:service-error';

const notifyServiceError = (detail) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(SERVICE_ERROR_EVENT, { detail }));
};

/**
 * Centralized axios instance untuk Temuin frontend.
 *
 * Base URL strategy:
 * - Dev (npm run dev): VITE_API_BASE_URL kosong, Vite proxy /api/* -> http://127.0.0.1:8000
 * - Prod (npm run build): VITE_API_BASE_URL kosong, container internal nginx
 *   route /api/auth/* -> auth-service:8001, /api/items/* dan /api/master-data/*
 *   -> item-service:8002, /api/claims/* dan /api/notifications/* -> engagement-service:8003
 *
 * Header: Authorization Bearer otomatis dari localStorage 'internalToken'.
 *
 * Response interceptor:
 * - 503/504: toast Sonner "Layanan sementara terganggu, coba lagi" (gateway/service down)
 * - Network error (no response): toast yang sama (offline / DNS / timeout)
 * - Other errors: pass through ke caller (per-page handle)
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

export { SERVICE_ERROR_EVENT };

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
      const { status, headers } = error.response;
      const correlationId = headers?.['x-correlation-id'] || headers?.['X-Correlation-ID'];

      if (status >= 500 && correlationId) {
        console.error(`X-Correlation-ID: ${correlationId}`);
      }

      if (status === 429) {
        toast.error('Terlalu banyak permintaan, coba lagi sebentar lagi');
      }

      if (status === 503 || status === 504) {
        toast.error('Layanan sementara terganggu, coba lagi');
        notifyServiceError({
          status,
          correlationId,
          message: 'Layanan sementara terganggu. Coba muat ulang halaman ini.',
        });
      }
    } else if (error.request) {
      toast.error('Layanan sementara terganggu, coba lagi');
      notifyServiceError({
        status: 'network',
        message: 'Layanan sementara terganggu. Coba muat ulang halaman ini.',
      });
    }
    return Promise.reject(error);
  }
);

export default api;
