'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Card } from '@/components/ui/Card';
import { Dumbbell, Eye, EyeOff, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoggedIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    if (password !== confirmPwd) {
      setError('两次输入的密码不一致'); return;
    }

    setLoading(true);
    try {
      await register({
        username: username.trim(),
        password,
        nickname: nickname.trim() || username.trim(),
      });
      router.push('/login/');
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent mb-4">
            <Dumbbell size={24} className="text-background" />
          </div>
          <h1 className="font-display text-2xl text-text">创建账号</h1>
          <p className="text-text-muted text-sm mt-1">开始你的健身记录之旅</p>
        </div>

        <Card hover={false}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">用户名 *</Label>
              <Input
                id="username"
                placeholder="4-20 位字母或数字"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname">昵称</Label>
              <Input
                id="nickname"
                placeholder="给自己取个名字（可选）"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码 *</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPwd ? 'text' : 'password'}
                  placeholder="6-20 位"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
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
            <div className="space-y-2">
              <Label htmlFor="confirmPwd">确认密码 *</Label>
              <Input
                id="confirmPwd"
                type="password"
                placeholder="再次输入密码"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                className="h-11"
              />
            </div>

            {error && (
              <p className="text-sm text-danger bg-danger/10 rounded-lg px-3 py-2">{error}</p>
            )}

            <Button type="submit" className="w-full h-11 gap-2" disabled={loading}>
              {loading ? '注册中...' : '注册'}
              {!loading && <UserPlus size={16} />}
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-text-muted mt-6">
          已有账号？{' '}
          <Link href="/login/" className="text-primary-light hover:text-primary font-medium">
            立即登录
          </Link>
        </p>
      </div>
    </div>
  );
}
