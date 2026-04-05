import axios from 'axios';

// Ini adalah placeholder untuk konfigurasi Axios
// Nanti akan disesuaikan dengan Base URL backend yang aktif di ENV
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor placeholder untuk attach internal JWT token nanti sesuai dengan FE architecture
api.interceptors.request.use((config) => {
  // const token = localStorage.getItem('internalToken');
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

export default api;
