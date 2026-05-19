'use client';

import { useState } from 'react';
import { useClientPagination } from '@/hooks/useClientPagination';
import { ListPagination } from '@/components/shared/ListPagination';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, put, del } from '@/lib/api';
import type { User } from '@/types';
import { getRoleLabel, getStatusLabel, formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { toast } from 'sonner';
import { Plus, ShieldBan, ShieldCheck, Key, Trash2, Users, Search, X } from 'lucide-react';

export default function AdminUserPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [resetPwdId, setResetPwdId] = useState<number | null>(null);
  const [newPwd, setNewPwd] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => get<User[]>('/admin/api/user/list'),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: number }) =>
      put(`/admin/api/user/${id}/status?status=${status}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('状态已更新');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => del(`/admin/api/user/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setDeleteConfirm(null);
      toast.success('用户已删除');
    },
  });

  const resetPwdMutation = useMutation({
    mutationFn: ({ id, password }: { id: number; password: string }) =>
      put(`/admin/api/user/${id}/password`, { password }),
    onSuccess: () => {
      setResetPwdId(null);
      setNewPwd('');
      toast.success('密码已重置');
    },
  });

  const filtered = users?.filter((u) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      u.username?.toLowerCase().includes(s) ||
      (u.nickname || '').toLowerCase().includes(s)
    );
  });

  const { currentPage, total, totalPages, pagedItems, handlePageChange } = useClientPagination(filtered, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-text mb-1">用户管理</h1>
          <p className="text-text-muted text-sm">管理系统所有用户账号</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="gap-2">
          <Plus size={16} /> 新增用户
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
        <Input
          placeholder="搜索用户名或昵称..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-10"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Users table */}
      <Card hover={false} className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left px-5 py-3 text-text-muted font-medium">ID</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">用户名</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">昵称</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">角色</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">状态</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">创建时间</th>
                <th className="text-right px-5 py-3 text-text-muted font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {pagedItems.map((user) => (
                <tr key={user.id} className="border-b border-surface-border last:border-0 hover:bg-surface-hover/50 transition-colors">
                  <td className="px-5 py-3 text-text-dim">{user.id}</td>
                  <td className="px-5 py-3 text-text font-medium">{user.username}</td>
                  <td className="px-5 py-3 text-text-muted">{user.nickname || '-'}</td>
                  <td className="px-5 py-3">
                    <Badge variant={user.role >= 2 ? 'danger' : user.role === 1 ? 'accent' : 'muted'}>
                      {getRoleLabel(user.role)}
                    </Badge>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={user.status === 1 ? 'success' : 'danger'}>
                      {getStatusLabel(user.status)}
                    </Badge>
                  </td>
                  <td className="px-5 py-3 text-text-dim">{formatDate(user.createTime) || '-'}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {user.status === 1 ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleStatusMutation.mutate({ id: user.id!, status: 0 })}
                          className="text-warning hover:text-warning"
                          title="禁用"
                        >
                          <ShieldBan size={15} />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleStatusMutation.mutate({ id: user.id!, status: 1 })}
                          className="text-success hover:text-success"
                          title="启用"
                        >
                          <ShieldCheck size={15} />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setResetPwdId(user.id!)}
                        title="重置密码"
                      >
                        <Key size={15} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirm(user.id!)}
                        className="text-danger hover:text-danger"
                        title="删除"
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!filtered || filtered.length === 0) && (
          <div className="py-16">
            <EmptyState
              icon={<Users size={40} />}
              title="暂无用户数据"
            />
          </div>
        )}
      </Card>

      <ListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        onPageChange={handlePageChange}
        itemLabel="位用户"
      />

      {/* Reset password dialog */}
      <Dialog
        open={resetPwdId !== null}
        onClose={() => { setResetPwdId(null); setNewPwd(''); }}
        title="重置用户密码"
        size="sm"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>新密码</Label>
            <Input
              type="text"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              placeholder="输入新密码"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => { setResetPwdId(null); setNewPwd(''); }}>取消</Button>
            <Button
              onClick={() => resetPwdId && resetPwdMutation.mutate({ id: resetPwdId, password: newPwd })}
              disabled={!newPwd || resetPwdMutation.isPending}
            >
              {resetPwdMutation.isPending ? '重置中...' : '确认重置'}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Create user dialog */}
      {createOpen && (
        <CreateUserDialog
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onCreated={() => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            setCreateOpen(false);
          }}
        />
      )}

      {/* Delete confirm */}
      <ConfirmDialog
        open={deleteConfirm !== null}
        title="删除用户"
        message="确定要删除该用户吗？此操作不可恢复。"
        variant="danger"
        confirmLabel="删除"
        onConfirm={() => deleteMutation.mutate(deleteConfirm!)}
        onCancel={() => setDeleteConfirm(null)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

function CreateUserDialog({ open, onClose, onCreated }: { open: boolean; onClose: () => void; onCreated: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [role, setRole] = useState(0);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await post('/admin/api/user/create', { username, password, nickname, role, status: 1 });
      toast.success('用户已创建');
      onCreated();
    } catch {
      // error handled by interceptor
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="新增用户" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>用户名</Label>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="4-20位" />
          </div>
          <div className="space-y-1.5">
            <Label>密码</Label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="6-20位" />
          </div>
          <div className="space-y-1.5">
            <Label>昵称</Label>
            <Input value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="可选" />
          </div>
          <div className="space-y-1.5">
            <Label>角色</Label>
            <select
              value={role}
              onChange={(e) => setRole(Number(e.target.value))}
              className="w-full h-10 rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <option value={0}>普通用户</option>
              <option value={1}>管理员</option>
              <option value={2}>超级管理员</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="outline" onClick={onClose}>取消</Button>
          <Button type="submit" disabled={saving}>{saving ? '创建中...' : '创建'}</Button>
        </div>
      </form>
    </Dialog>
  );
}
