'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';

interface UserProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

function validateUsername(username: string): string | null {
  const v = username.trim();
  if (!v) return '请输入用户名';
  if (v.length < 4 || v.length > 20) return '用户名长度为 4-20 位';
  return null;
}

function validatePassword(password: string, label: string): string | null {
  if (!password) return `请输入${label}`;
  if (password.length < 6 || password.length > 20) return `${label}长度为 6-20 位`;
  return null;
}

export function UserProfileDialog({ open, onClose }: UserProfileDialogProps) {
  const router = useRouter();
  const { user, updateProfile, changePassword, logout } = useAuth();
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPwd, setShowOldPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  useEffect(() => {
    if (!open || !user) return;
    setUsername(user.username);
    setNickname(user.nickname || '');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setProfileError('');
    setPwdError('');
  }, [open, user]);

  const profileDirty = useMemo(() => {
    if (!user) return false;
    return (
      username.trim() !== user.username ||
      nickname.trim() !== (user.nickname || '')
    );
  }, [user, username, nickname]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileDirty) return;
    setProfileError('');
    const usernameErr = validateUsername(username);
    if (usernameErr) {
      setProfileError(usernameErr);
      return;
    }
    setProfileLoading(true);
    try {
      await updateProfile({
        username: username.trim(),
        nickname: nickname.trim() || username.trim(),
      });
    } catch (err: unknown) {
      setProfileError((err as { message?: string })?.message || '保存失败');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    const oldErr = validatePassword(oldPassword, '原密码');
    if (oldErr) {
      setPwdError(oldErr);
      return;
    }
    const newErr = validatePassword(newPassword, '新密码');
    if (newErr) {
      setPwdError(newErr);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('两次输入的新密码不一致');
      return;
    }
    if (oldPassword === newPassword) {
      setPwdError('新密码不能与原密码相同');
      return;
    }
    setPwdLoading(true);
    try {
      await changePassword({ oldPassword, newPassword });
      onClose();
      await logout({ silent: true });
      toast.success('密码已修改，请使用新密码重新登录');
      router.push('/login/');
    } catch (err: unknown) {
      setPwdError((err as { message?: string })?.message || '修改失败');
    } finally {
      setPwdLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="账号设置"
      description="修改登录用户名、昵称与密码"
      size="sm"
    >
      <form onSubmit={handleSaveProfile} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="profile-username">用户名</Label>
          <Input
            id="profile-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            placeholder="4-20 位字母、数字或下划线"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="profile-nickname">昵称</Label>
          <Input
            id="profile-nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            autoComplete="nickname"
            placeholder="显示名称，可选"
          />
        </div>
        {profileError && <p className="text-sm text-danger">{profileError}</p>}
        <Button type="submit" className="w-full" disabled={profileLoading || !profileDirty}>
          {profileLoading ? '保存中…' : '保存资料'}
        </Button>
      </form>

      <div className="my-6 border-t border-surface-border" />

      <form onSubmit={handleChangePassword} className="space-y-4">
        <p className="text-sm font-medium text-text">修改密码</p>
        <div className="space-y-2">
          <Label htmlFor="old-password">原密码</Label>
          <div className="relative">
            <Input
              id="old-password"
              type={showOldPwd ? 'text' : 'password'}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              autoComplete="current-password"
              className="pr-10"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowOldPwd(!showOldPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
            >
              {showOldPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-password">新密码</Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showNewPwd ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className="pr-10"
            />
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowNewPwd(!showNewPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
            >
              {showNewPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password">确认新密码</Label>
          <Input
            id="confirm-password"
            type={showNewPwd ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        {pwdError && <p className="text-sm text-danger">{pwdError}</p>}
        <Button type="submit" variant="outline" className="w-full" disabled={pwdLoading}>
          {pwdLoading ? '提交中…' : '修改密码'}
        </Button>
      </form>
    </Dialog>
  );
}
