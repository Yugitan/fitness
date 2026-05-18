'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Lock, ArrowRight, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Lock size={28} className="text-primary-light" />
          </div>
          <h2 className="text-xl font-semibold text-text mb-2">请先登录</h2>
          <p className="text-sm text-text-muted mb-8">
            登录后即可使用训练记录、训练计划和数据统计等全部功能
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/login/">
              <Button className="gap-2 w-full sm:w-auto">
                登录 <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/register/">
              <Button variant="accent" className="gap-2 w-full sm:w-auto">
                注册新账号 <UserPlus size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
