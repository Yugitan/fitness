'use client';

import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { get, post, put } from '@/lib/api';
import type { User, LoginRequest, RegisterRequest, UpdateProfileRequest, ChangePasswordRequest } from '@/types';
import { toast } from 'sonner';

export function useAuth() {
  const { user, isLoading, isLoggedIn, isAdmin, setUser, setLoading, logout: clearAuth } = useAuthStore();

  // Check auth status on mount
  const checkAuth = useCallback(async () => {
    try {
      const user = await get<User>('/user/api/current');
      setUser(user);
    } catch {
      setUser(null);
    }
  }, [setUser]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = useCallback(
    async (data: LoginRequest) => {
      const user = await post<User>('/user/api/login', data);
      setUser(user);
      toast.success(`欢迎回来，${user.nickname || user.username}`);
      return user;
    },
    [setUser]
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      await post<User>('/user/api/register', data);
      toast.success('注册成功，请登录');
    },
    []
  );

  const logout = useCallback(async (options?: { silent?: boolean }) => {
    try {
      await post('/user/api/logout');
    } catch {
      // ignore logout API errors
    }
    clearAuth();
    await checkAuth();
    if (!options?.silent) {
      toast.success('已退出登录');
    }
  }, [checkAuth, clearAuth]);

  const updateProfile = useCallback(async (data: UpdateProfileRequest) => {
    const updated = await put<User>('/user/api/profile', data);
    setUser(updated);
    toast.success('个人信息已更新');
    return updated;
  }, [setUser]);

  const changePassword = useCallback(async (data: ChangePasswordRequest) => {
    await put('/user/api/password', data);
  }, []);

  return {
    user,
    isLoading,
    isLoggedIn,
    isAdmin,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refresh: checkAuth,
  };
}
