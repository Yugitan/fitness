'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  ClipboardList,
  UserCheck,
  Wallet,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

const ADMIN_LINKS = [
  { href: '/admin', label: '仪表盘', icon: LayoutDashboard },
  { href: '/admin/user/', label: '用户管理', icon: Users },
  { href: '/admin/exercise/', label: '动作库管理', icon: Dumbbell },
  { href: '/admin/plan/', label: '计划管理', icon: ClipboardList },
  { href: '/admin/blogger/', label: '博主管理', icon: UserCheck },
  { href: '/admin/blogger/plan/', label: '博主计划', icon: Wallet },
  { href: '/admin/config/', label: '系统配置', icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn, isAdmin, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isLoggedIn || !isAdmin)) {
      router.push('/admin/login/');
    }
  }, [isLoading, isLoggedIn, isAdmin, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:sticky top-0 left-0 z-50 h-screen w-60 bg-surface border-r border-surface-border flex flex-col transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-surface-border">
          <Link href="/admin" className="flex items-center gap-2.5 font-display text-lg tracking-wider text-accent">
            <Dumbbell size={20} className="text-primary" />
            FITNESS
          </Link>
          <button
            className="lg:hidden p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {ADMIN_LINKS.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (link.href !== '/admin' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-primary/15 text-primary-light'
                    : 'text-text-muted hover:text-text hover:bg-surface-hover'
                )}
              >
                <Icon size={18} />
                <span className="flex-1">{link.label}</span>
                {isActive && <ChevronRight size={14} className="text-primary" />}
                {!isActive && (
                  <ChevronRight size={14} className="text-text-dim opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User area */}
        <div className="border-t border-surface-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-background text-xs font-bold">
              {(user?.nickname || user?.username || 'A')[0].toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-text truncate">{user?.nickname || user?.username}</p>
              <p className="text-xs text-text-muted">管理员</p>
            </div>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-text-muted hover:text-text hover:bg-surface-hover rounded-lg transition-colors mb-1"
          >
            返回前台
          </Link>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 w-full px-3 py-2 text-xs text-text-muted hover:text-danger hover:bg-surface-hover rounded-lg transition-colors"
          >
            <LogOut size={12} />
            退出登录
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl border-b border-surface-border flex items-center px-4 lg:px-6">
          <button
            className="lg:hidden p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-hover -ml-2 mr-3"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>
          {/* Breadcrumb would go here */}
          <span className="text-sm text-text-muted">
            {ADMIN_LINKS.find((l) => l.href === pathname || pathname?.startsWith(l.href + '/'))?.label || '管理后台'}
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
