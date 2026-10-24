import axios from "axios";
import { emitUnauthorized } from "./auth-events";
import { getToken, isTokenExpired, removeToken } from "./token";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (!token) return config;

  if (isTokenExpired(token)) {
    removeToken();
    emitUnauthorized();
    return config;
  }

  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const sentToken = Boolean(error.config?.headers?.Authorization);
      const isAuthRequest = error.config?.url?.startsWith("/auth/");

      if (sentToken && !isAuthRequest) {
        removeToken();
        emitUnauthorized();
      }
    }
    return Promise.reject(error);
  },
);

// Extract a human-readable message from an API error
export function getErrorMessage(
  error: unknown,
  fallback = "Something went wrong",
): string {
  if (axios.isAxiosError<{ message?: string }>(error)) {
    return error.response?.data?.message ?? error.message ?? fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export function isNotFound(error: unknown) {
  return axios.isAxiosError(error) && error.response?.status === 404;
}
