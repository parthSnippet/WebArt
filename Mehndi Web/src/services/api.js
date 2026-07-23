import axios from 'axios';
import { store } from '../redux/store';

// Get API URL from environment variables with fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,  // send cookies with every request
  timeout: 30000 // 30 seconds timeout
});

// Request interceptor for debugging and auth
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token is sent automatically via httpOnly cookie
        const { data } = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = data.data.accessToken;

        // Update Redux store with new token
        store.dispatch({ type: 'auth/setCredentials', payload: { token: newToken } });

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        store.dispatch({ type: 'auth/logout/fulfilled' });
        if (!window.location.pathname.includes('/login')) window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    if (!error.response) {
      error.message = 'Network error. Please check your connection and try again.';
    }

    return Promise.reject(error);
  }
);

export default api;
