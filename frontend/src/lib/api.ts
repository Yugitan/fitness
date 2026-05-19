import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import type { ApiResult } from '@/types';

const BASE_URL = typeof window !== 'undefined' ? '/fitness' : 'http://localhost:8080/fitness';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor: unwrap ApiResult, handle errors globally
api.interceptors.response.use(
  (response) => {
    const result = response.data as ApiResult;
    // If it's not our ApiResult format (e.g. HTML page), return raw
    if (result === undefined || result === null || typeof result.code !== 'number') {
      return response;
    }
    if (result.code === 200) {
      // Return just the data portion for convenience
      return { ...response, data: result.data, message: result.message };
    }
    // Auth errors — skip toast for /user/api/current (expected for guests)
    if (result.code === 401) {
      if (!response.config.url?.includes('/user/api/current')) {
        toast.error(result.message || '请先登录');
      }
      return Promise.reject(new ApiError(result.code, result.message));
    }
    if (result.code === 403) {
      toast.error(result.message || '权限不足');
      return Promise.reject(new ApiError(result.code, result.message));
    }
    // Other business errors
    toast.error(result.message || '操作失败');
    return Promise.reject(new ApiError(result.code, result.message));
  },
  (error: AxiosError<ApiResult>) => {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) {
        toast.error('请先登录');
      } else if (status === 403) {
        toast.error('权限不足');
      } else if (data?.message) {
        toast.error(data.message);
      } else {
        toast.error('网络请求失败');
      }
    } else if (error.request) {
      toast.error('网络连接失败，请检查网络');
    }
    return Promise.reject(error);
  }
);

export class ApiError extends Error {
  code: number;
  constructor(code: number, message?: string) {
    super(message || '请求失败');
    this.code = code;
    this.name = 'ApiError';
  }
}

export default api;

// ============ Typed API helpers ============

export async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const res = await api.get<T>(url, { params });
  return res.data as T;
}

export async function post<T>(url: string, data?: unknown): Promise<T> {
  const res = await api.post<T>(url, data);
  return res.data as T;
}

export async function put<T>(url: string, data?: unknown): Promise<T> {
  const res = await api.put<T>(url, data);
  return res.data as T;
}

export async function del<T>(url: string): Promise<T> {
  const res = await api.delete<T>(url);
  return res.data as T;
}
