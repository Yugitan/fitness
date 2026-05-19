'use client';

import { useGuestMode } from '@/hooks/useGuestMode';
import { Button } from '@/components/ui/Button';
import { Dumbbell, Clock, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function GuestModal() {
  const router = useRouter();
  const { showDailyPopup, showLockPopup, daysUsed, daysRemaining, dismissDailyPopup, dismissLockPopup } = useGuestMode();

  const navigateAndDismiss = (path: string) => {
    dismissDailyPopup();
    dismissLockPopup();
    // Defer navigation so React flushes dismiss state before route change
    setTimeout(() => router.push(path), 0);
  };

  if (!showDailyPopup && !showLockPopup) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative bg-surface border border-surface-border rounded-2xl p-8 max-w-md w-full animate-scale-in shadow-2xl">
        {showLockPopup ? (
          <>
            {/* Locked state */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-danger/15 flex items-center justify-center mx-auto mb-5">
                <Lock size={28} className="text-danger" />
              </div>
              <h2 className="text-xl font-semibold text-text mb-2">游客体验已到期</h2>
              <p className="text-sm text-text-muted mb-2">
                您已体验 {daysUsed} 天，游客模式仅支持 7 天试用
              </p>
              <p className="text-sm text-text-dim mb-6">
                注册账号即可继续使用全部功能，数据永久保存
              </p>
              <div className="flex flex-col gap-3">
                <Button className="w-full gap-2" size="lg" onClick={() => navigateAndDismiss('/login/')}>
                  登录 <ArrowRight size={16} />
                </Button>
                <Button variant="accent" className="w-full gap-2" size="lg" onClick={() => navigateAndDismiss('/register/')}>
                  注册新账号
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Daily rules popup */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/15 flex items-center justify-center mx-auto mb-5">
                <Dumbbell size={28} className="text-primary-light" />
              </div>
              <h2 className="text-xl font-semibold text-text mb-2">欢迎来到 Fitness</h2>
              <p className="text-sm text-text-muted mb-4">您正在以游客模式体验</p>

              <div className="bg-surface-hover rounded-xl p-4 mb-6 text-left space-y-2">
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Clock size={14} className="text-accent flex-shrink-0" />
                  <span>已体验 <strong className="text-text">{daysUsed}</strong> / 7 天（剩余 <strong className="text-accent-light">{daysRemaining}</strong> 天）</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-text-muted">
                  <Lock size={14} className="text-text-dim flex-shrink-0 mt-0.5" />
                  <span>游客仅可浏览动作库页面，其他页面需登录后访问</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="default" className="flex-1" onClick={() => navigateAndDismiss('/login/')}>登录</Button>
                <Button variant="accent" className="flex-1" onClick={() => navigateAndDismiss('/register/')}>注册</Button>
              </div>
              <button
                onClick={dismissDailyPopup}
                className="mt-4 text-xs text-text-dim hover:text-text-muted transition-colors"
              >
                继续游客模式
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
