'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card } from '@/components/ui/Card';
import { Dumbbell, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoggedIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (isLoggedIn) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) { setError('请输入用户名'); return; }
    if (username.trim().length < 4 || username.trim().length > 20) {
      setError('用户名长度为 4-20 位'); return;
    }
    if (!password) { setError('请输入密码'); return; }
    if (password.length < 6 || password.length > 20) {
      setError('密码长度为 6-20 位'); return;
    }

    setLoading(true);
    try {
      await login({ username: username.trim(), password });
      router.push('/');
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4">
            <Dumbbell size={24} className="text-background" />
          </div>
          <h1 className="font-display text-2xl text-text">登录 Fitness</h1>
          <p className="text-text-muted text-sm mt-1">记录每一次进步</p>
        </div>

        <Card hover={false}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名</Label>
              <Input
                id="username"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="请输入密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text"
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-danger bg-danger/10 rounded-lg px-3 py-2">{error}</p>
            )}

            <Button type="submit" className="w-full h-11 gap-2" disabled={loading}>
              {loading ? '登录中...' : '登 录'}
              {!loading && <ArrowRight size={16} />}
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-text-muted mt-6">
          还没有账号？{' '}
          <Link href="/register/" className="text-primary-light hover:text-primary font-medium">
            立即注册
          </Link>
        </p>

        <div className="mt-6 p-4 rounded-xl bg-surface border border-surface-border">
          <p className="text-xs text-text-dim text-center">
            默认管理员账号：admin / 123456
          </p>
        </div>
      </div>
    </div>
  );
}
