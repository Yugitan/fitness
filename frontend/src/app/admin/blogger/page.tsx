'use client';

import { useState } from 'react';
import { useClientPagination } from '@/hooks/useClientPagination';
import { ListPagination } from '@/components/shared/ListPagination';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, put, del } from '@/lib/api';
import type { Blogger } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { toast } from 'sonner';
import { Plus, Edit3, Trash2, Star, Users, Search, X } from 'lucide-react';

export default function AdminBloggerPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Blogger | null>(null);

  const { data: bloggers } = useQuery({
    queryKey: ['admin-bloggers'],
    queryFn: () => get<Blogger[]>('/admin/api/blogger/list'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => del(`/admin/api/blogger/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bloggers'] });
      setDeleteConfirm(null);
      toast.success('博主已删除');
    },
  });

  const recommendMutation = useMutation({
    mutationFn: ({ id, isRecommended }: { id: number; isRecommended: number }) =>
      put(`/admin/api/blogger/${id}/recommend?isRecommended=${isRecommended}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bloggers'] });
      toast.success('推荐状态已更新');
    },
  });

  const filtered = bloggers?.filter((b) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (b.nickname || '').toLowerCase().includes(s);
  });

  const { currentPage, total, totalPages, pagedItems, handlePageChange } = useClientPagination(filtered, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-text mb-1">博主管理</h1>
          <p className="text-text-muted text-sm">管理健身博主信息</p>
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }} className="gap-2">
          <Plus size={16} /> 新增博主
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
        <Input placeholder="搜索博主昵称..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-10" />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text">
            <X size={16} />
          </button>
        )}
      </div>

      <Card hover={false} className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left px-5 py-3 text-text-muted font-medium">ID</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">昵称</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">平台</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">分类</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">粉丝</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">推荐</th>
                <th className="text-right px-5 py-3 text-text-muted font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {pagedItems.map((b) => (
                <tr key={b.id} className="border-b border-surface-border last:border-0 hover:bg-surface-hover/50 transition-colors">
                  <td className="px-5 py-3 text-text-dim">{b.id}</td>
                  <td className="px-5 py-3 text-text font-medium">{b.nickname}</td>
                  <td className="px-5 py-3 text-text-muted">{b.sourcePlatform || '-'}</td>
                  <td className="px-5 py-3 text-text-muted">{b.category || '-'}</td>
                  <td className="px-5 py-3 text-text-muted">{b.followerCount?.toLocaleString() || 0}</td>
                  <td className="px-5 py-3">
                    {b.isRecommended === 1 ? (
                      <Badge variant="accent" className="gap-1"><Star size={10} />推荐</Badge>
                    ) : (
                      <Badge variant="muted">普通</Badge>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => recommendMutation.mutate({ id: b.id!, isRecommended: b.isRecommended === 1 ? 0 : 1 })}
                        className={b.isRecommended === 1 ? 'text-accent' : 'text-text-dim'}
                        title={b.isRecommended === 1 ? '取消推荐' : '设为推荐'}
                      >
                        <Star size={15} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setEditing(b); setFormOpen(true); }}
                        title="编辑"
                      >
                        <Edit3 size={15} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirm(b.id!)}
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
          <div className="py-16"><EmptyState icon={<Users size={40} />} title="暂无博主数据" /></div>
        )}
      </Card>

      <ListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        onPageChange={handlePageChange}
        itemLabel="位博主"
      />

      {formOpen && (
        <BloggerFormDialog
          open={formOpen}
          blogger={editing}
          onClose={() => { setFormOpen(false); setEditing(null); }}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ['admin-bloggers'] });
            setFormOpen(false);
            setEditing(null);
          }}
        />
      )}

      <ConfirmDialog
        open={deleteConfirm !== null}
        title="删除博主"
        message="确定要删除该博主吗？"
        variant="danger"
        confirmLabel="删除"
        onConfirm={() => deleteMutation.mutate(deleteConfirm!)}
        onCancel={() => setDeleteConfirm(null)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

function BloggerFormDialog({
  open, blogger, onClose, onSaved,
}: {
  open: boolean; blogger: Blogger | null; onClose: () => void; onSaved: () => void;
}) {
  const [nickname, setNickname] = useState(blogger?.nickname || '');
  const [bio, setBio] = useState(blogger?.bio || '');
  const [sourcePlatform, setSourcePlatform] = useState(blogger?.sourcePlatform || '');
  const [platformUrl, setPlatformUrl] = useState(blogger?.platformUrl || '');
  const [category, setCategory] = useState(blogger?.category || '');
  const [followerCount, setFollowerCount] = useState(blogger?.followerCount || 0);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data: Blogger = { nickname, bio, sourcePlatform, platformUrl, category, followerCount };
      if (blogger?.id) {
        await put(`/admin/api/blogger/${blogger.id}`, data);
        toast.success('博主已更新');
      } else {
        await post('/admin/api/blogger/create', data);
        toast.success('博主已创建');
      }
      onSaved();
    } catch { /* handled */ } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} title={blogger ? '编辑博主' : '新增博主'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>昵称</Label>
            <Input value={nickname} onChange={(e) => setNickname(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>来源平台</Label>
            <Input value={sourcePlatform} onChange={(e) => setSourcePlatform(e.target.value)} placeholder="如 B站/抖音" />
          </div>
          <div className="space-y-1.5">
            <Label>分类</Label>
            <Input value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>粉丝数</Label>
            <Input type="number" value={followerCount} onChange={(e) => setFollowerCount(Number(e.target.value))} />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>平台链接</Label>
            <Input value={platformUrl} onChange={(e) => setPlatformUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>简介</Label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
              className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="outline" onClick={onClose}>取消</Button>
          <Button type="submit" disabled={saving}>{saving ? '保存中...' : '保存'}</Button>
        </div>
      </form>
    </Dialog>
  );
}
