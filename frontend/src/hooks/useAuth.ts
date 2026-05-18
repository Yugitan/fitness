'use client';

import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { get, post } from '@/lib/api';
import type { User, LoginRequest, RegisterRequest } from '@/types';
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

  const logout = useCallback(async () => {
    try {
      await post('/user/api/logout');
    } catch {
      // ignore logout API errors
    }
    clearAuth();
    toast.success('已退出登录');
  }, [clearAuth]);

  const updateProfile = useCallback(async (data: Partial<User>) => {
    const updated = await get<User>('/user/api/profile', data as Record<string, unknown>);
    setUser(updated);
    toast.success('个人信息已更新');
    return updated;
  }, [setUser]);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    await get<User>('/user/api/password', {
      password: oldPassword,
      nickname: newPassword,
    });
    toast.success('密码已修改');
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
