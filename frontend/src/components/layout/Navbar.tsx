'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Dumbbell, Menu, X, User, LogOut, Settings, ChevronDown, Trophy, BarChart3, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { UserProfileDialog } from '@/components/shared/UserProfileDialog';

const NAV_LINKS = [
  { href: '/exercise/', label: '动作库', icon: Dumbbell },
  { href: '/training/', label: '训练记录', icon: BarChart3 },
  { href: '/plan/', label: '训练计划', icon: Trophy },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isLoggedIn, isAdmin, logout, isLoading, refresh } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  // Don't show navbar on admin pages
  if (pathname?.startsWith('/admin')) return null;

  return (
    <nav className="sticky top-0 z-40 border-b border-surface-border bg-background/80 backdrop-blur-xl overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible">
        <div className="flex items-center justify-between h-16 overflow-visible">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 font-display text-xl tracking-wider text-accent hover:text-accent-light transition-colors"
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Dumbbell size={16} className="text-background" />
            </span>
            FITNESS
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-2 overflow-visible">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary/15 text-primary-light'
                      : 'text-text-muted hover:text-text hover:bg-surface-hover'
                  )}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              );
            })}

            {/* Auth buttons */}
            {isLoading ? (
              <div className="w-20 h-8 rounded-lg bg-surface animate-pulse-soft" />
            ) : isLoggedIn ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-text hover:bg-surface-hover transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-background text-xs font-bold">
                    {(user?.nickname || user?.username || 'U')[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:inline">{user?.nickname || user?.username}</span>
                  <ChevronDown size={14} className={cn('transition-transform', userMenuOpen && 'rotate-180')} />
                </button>
                {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 min-w-[11rem] overflow-hidden rounded-xl border border-surface-border bg-surface shadow-xl z-50 origin-top-right animate-scale-in">
                      <div className="px-3 py-2.5 border-b border-surface-border bg-surface">
                        <p className="text-sm font-medium text-text truncate">{user?.nickname || user?.username}</p>
                        <p className="text-xs text-text-muted truncate">{user?.username}</p>
                      </div>
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            setProfileOpen(true);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-text-muted transition-colors hover:bg-surface-hover hover:text-text"
                        >
                          <UserCog size={14} className="shrink-0" />
                          账号设置
                        </button>
                        {isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-text-muted transition-colors hover:bg-surface-hover hover:text-text"
                          >
                            <Settings size={14} className="shrink-0" />
                            管理后台
                          </Link>
                        )}
                        <Link
                          href="/statistics/"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-text-muted transition-colors hover:bg-surface-hover hover:text-text"
                        >
                          <BarChart3 size={14} className="shrink-0" />
                          数据统计
                        </Link>
                      </div>
                      <div className="border-t border-surface-border">
                        <button
                          type="button"
                          onClick={async () => {
                            setUserMenuOpen(false);
                            await logout();
                            await refresh();
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                        >
                          <LogOut size={14} className="shrink-0" />
                          退出登录
                        </button>
                      </div>
                    </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login/">
                  <Button variant="ghost" size="sm">登录</Button>
                </Link>
                <Link href="/register/">
                  <Button variant="accent" size="sm">注册</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-surface-border bg-background animate-slide-up">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/15 text-primary-light'
                      : 'text-text-muted hover:text-text hover:bg-surface-hover'
                  )}
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-surface-border space-y-1">
              {!isLoading && isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-background text-xs font-bold">
                      {(user?.nickname || user?.username || 'U')[0].toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-text">{user?.nickname || user?.username}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileOpen(false);
                      setProfileOpen(true);
                    }}
                    className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm text-text-muted hover:text-text hover:bg-surface-hover"
                  >
                    <UserCog size={18} /> 账号设置
                  </button>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-text-muted hover:text-text hover:bg-surface-hover"
                    >
                      <Settings size={18} /> 管理后台
                    </Link>
                  )}
                  <button
                    onClick={async () => {
                      setMobileOpen(false);
                      await logout();
                      await refresh();
                    }}
                    className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm text-danger hover:bg-surface-hover"
                  >
                    <LogOut size={18} /> 退出登录
                  </button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link href="/login/" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button variant="outline" className="w-full">登录</Button>
                  </Link>
                  <Link href="/register/" onClick={() => setMobileOpen(false)} className="flex-1">
                    <Button variant="accent" className="w-full">注册</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {isLoggedIn && (
        <UserProfileDialog open={profileOpen} onClose={() => setProfileOpen(false)} />
      )}
    </nav>
  );
}
