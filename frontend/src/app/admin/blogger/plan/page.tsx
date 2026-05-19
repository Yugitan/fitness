'use client';

import { useState } from 'react';
import { useClientPagination } from '@/hooks/useClientPagination';
import { ListPagination } from '@/components/shared/ListPagination';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, put, del } from '@/lib/api';
import type { BloggerPlan, Blogger } from '@/types';
import { getDifficultyLabel, getDifficultyColor } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { toast } from 'sonner';
import { Plus, Edit3, Trash2, Power, PowerOff, Search, X } from 'lucide-react';

export default function AdminBloggerPlanPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<BloggerPlan | null>(null);

  const { data: plans } = useQuery({
    queryKey: ['admin-blogger-plans'],
    queryFn: () => get<BloggerPlan[]>('/admin/api/blogger/plan/list'),
  });

  const { data: bloggers } = useQuery({
    queryKey: ['admin-bloggers'],
    queryFn: () => get<Blogger[]>('/admin/api/blogger/list'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => del(`/admin/api/blogger/plan/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogger-plans'] });
      setDeleteConfirm(null);
      toast.success('计划已删除');
    },
  });

  const toggleOnlineMutation = useMutation({
    mutationFn: ({ id, isOnline }: { id: number; isOnline: number }) =>
      put(`/admin/api/blogger/plan/${id}/online?isOnline=${isOnline}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-blogger-plans'] });
      toast.success('状态已更新');
    },
  });

  const filtered = plans?.filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return p.title?.toLowerCase().includes(s);
  });

  const { currentPage, total, totalPages, pagedItems, handlePageChange } = useClientPagination(filtered, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-text mb-1">博主计划管理</h1>
          <p className="text-text-muted text-sm">管理博主发布的训练计划</p>
        </div>
        <Button onClick={() => { setEditing(null); setFormOpen(true); }} className="gap-2">
          <Plus size={16} /> 新增计划
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
        <Input placeholder="搜索计划名称..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-10" />
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
                <th className="text-left px-5 py-3 text-text-muted font-medium">名称</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">博主ID</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">难度</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">训练天数</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">状态</th>
                <th className="text-right px-5 py-3 text-text-muted font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {pagedItems.map((plan) => (
                <tr key={plan.id} className="border-b border-surface-border last:border-0 hover:bg-surface-hover/50 transition-colors">
                  <td className="px-5 py-3 text-text-dim">{plan.id}</td>
                  <td className="px-5 py-3 text-text font-medium">{plan.title}</td>
                  <td className="px-5 py-3 text-text-muted">{plan.bloggerId || '-'}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getDifficultyColor(plan.difficultyLevel)}`}>
                      {getDifficultyLabel(plan.difficultyLevel)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-text-muted">{plan.trainDays || '-'}天</td>
                  <td className="px-5 py-3">
                    {plan.isOnline === 1 ? (
                      <Badge variant="success">已上线</Badge>
                    ) : (
                      <Badge variant="warning">待上线</Badge>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleOnlineMutation.mutate({ id: plan.id!, isOnline: plan.isOnline === 1 ? 0 : 1 })}
                        className={plan.isOnline === 1 ? 'text-success' : 'text-warning'}
                        title={plan.isOnline === 1 ? '下线' : '上线'}
                      >
                        {plan.isOnline === 1 ? <PowerOff size={15} /> : <Power size={15} />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setEditing(plan); setFormOpen(true); }}
                        title="编辑"
                      >
                        <Edit3 size={15} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirm(plan.id!)}
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
          <div className="py-16"><EmptyState icon={<Edit3 size={40} />} title="暂无博主计划" /></div>
        )}
      </Card>

      <ListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        onPageChange={handlePageChange}
        itemLabel="个计划"
      />

      {formOpen && (
        <BloggerPlanFormDialog
          open={formOpen}
          plan={editing}
          bloggers={bloggers || []}
          onClose={() => { setFormOpen(false); setEditing(null); }}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ['admin-blogger-plans'] });
            setFormOpen(false);
            setEditing(null);
          }}
        />
      )}

      <ConfirmDialog
        open={deleteConfirm !== null}
        title="删除计划"
        message="确定要删除该计划吗？"
        variant="danger"
        confirmLabel="删除"
        onConfirm={() => deleteMutation.mutate(deleteConfirm!)}
        onCancel={() => setDeleteConfirm(null)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

function BloggerPlanFormDialog({
  open, plan, bloggers, onClose, onSaved,
}: {
  open: boolean; plan: BloggerPlan | null; bloggers: Blogger[]; onClose: () => void; onSaved: () => void;
}) {
  const [title, setTitle] = useState(plan?.title || '');
  const [bloggerId, setBloggerId] = useState(plan?.bloggerId || (bloggers[0]?.id ?? 0));
  const [difficultyLevel, setDifficultyLevel] = useState(plan?.difficultyLevel || 1);
  const [targetAudience, setTargetAudience] = useState(plan?.targetAudience || '');
  const [targetBodyPart, setTargetBodyPart] = useState(plan?.targetBodyPart || '');
  const [trainDays, setTrainDays] = useState(plan?.trainDays || 7);
  const [summary, setSummary] = useState(plan?.summary || '');
  const [detailArrangement, setDetailArrangement] = useState(plan?.detailArrangement || '');
  const [videoUrl, setVideoUrl] = useState(plan?.videoUrl || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data: BloggerPlan = {
        title, bloggerId, difficultyLevel, targetAudience, targetBodyPart,
        trainDays, summary, detailArrangement, videoUrl,
      };
      if (plan?.id) {
        await put(`/admin/api/blogger/plan/${plan.id}`, data);
        toast.success('计划已更新');
      } else {
        await post('/admin/api/blogger/plan/create', data);
        toast.success('计划已创建');
      }
      onSaved();
    } catch { /* handled */ } finally { setSaving(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} title={plan ? '编辑计划' : '新增计划'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>计划名称</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>所属博主</Label>
            <select
              value={bloggerId || ''}
              onChange={(e) => setBloggerId(Number(e.target.value))}
              className="w-full h-10 rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              {bloggers.map((b) => (
                <option key={b.id} value={b.id}>{b.nickname}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>目标人群</Label>
            <Input value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="如：新手/进阶" />
          </div>
          <div className="space-y-1.5">
            <Label>目标部位</Label>
            <Input value={targetBodyPart} onChange={(e) => setTargetBodyPart(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>难度</Label>
            <select
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(Number(e.target.value))}
              className="w-full h-10 rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <option value={1}>初级</option>
              <option value={2}>中级</option>
              <option value={3}>高级</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>训练天数</Label>
            <Input type="number" value={trainDays} onChange={(e) => setTrainDays(Number(e.target.value))} />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>概述</Label>
            <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2}
              className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>详细安排</Label>
            <textarea value={detailArrangement} onChange={(e) => setDetailArrangement(e.target.value)} rows={4}
              className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>视频链接</Label>
            <Input value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://..." />
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
