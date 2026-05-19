'use client';

import { useState } from 'react';
import { useClientPagination } from '@/hooks/useClientPagination';
import { ListPagination, DEFAULT_PAGE_SIZE } from '@/components/shared/ListPagination';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, put, del } from '@/lib/api';
import type { Exercise, ExerciseCategory } from '@/types';
import { EXERCISE_CATEGORIES } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { toast } from 'sonner';
import { Plus, Edit3, Trash2, Dumbbell, Search, X } from 'lucide-react';

export default function AdminExercisePage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingEx, setEditingEx] = useState<Exercise | null>(null);

  const { data: exercises } = useQuery({
    queryKey: ['admin-exercises'],
    queryFn: () => get<Exercise[]>('/admin/api/exercise/list'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => del(`/admin/api/exercise/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-exercises'] });
      setDeleteConfirm(null);
      toast.success('动作已删除');
    },
  });

  const filtered = exercises?.filter((ex) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return ex.name?.toLowerCase().includes(s) || ex.category?.includes(s);
  });

  const { currentPage, total, totalPages, pagedItems, handlePageChange } = useClientPagination(
    filtered,
    [search],
    DEFAULT_PAGE_SIZE,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-text mb-1">动作库管理</h1>
          <p className="text-text-muted text-sm">维护健身动作数据</p>
        </div>
        <Button
          onClick={() => { setEditingEx(null); setFormOpen(true); }}
          className="gap-2"
        >
          <Plus size={16} /> 新增动作
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
        <Input placeholder="搜索动作名称或分类..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-10" />
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
                <th className="text-left px-5 py-3 text-text-muted font-medium">分类</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">描述</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">浏览</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">排序</th>
                <th className="text-right px-5 py-3 text-text-muted font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {pagedItems.map((ex) => (
                <tr key={ex.id} className="border-b border-surface-border last:border-0 hover:bg-surface-hover/50 transition-colors">
                  <td className="px-5 py-3 text-text-dim">{ex.id}</td>
                  <td className="px-5 py-3 text-text font-medium">{ex.name}</td>
                  <td className="px-5 py-3"><CategoryBadge category={ex.category} /></td>
                  <td className="px-5 py-3 text-text-muted max-w-[200px] truncate">{ex.description || '-'}</td>
                  <td className="px-5 py-3 text-text-dim">{ex.viewCount || 0}</td>
                  <td className="px-5 py-3 text-text-dim">{ex.sortWeight || 0}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setEditingEx(ex); setFormOpen(true); }}
                        title="编辑"
                      >
                        <Edit3 size={15} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirm(ex.id!)}
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
          <div className="py-16"><EmptyState icon={<Dumbbell size={40} />} title="暂无动作数据" /></div>
        )}
      </Card>

      <ListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        onPageChange={handlePageChange}
        itemLabel="个动作"
      />

      {formOpen && (
        <ExerciseFormDialog
          open={formOpen}
          exercise={editingEx}
          onClose={() => { setFormOpen(false); setEditingEx(null); }}
          onSaved={() => {
            queryClient.invalidateQueries({ queryKey: ['admin-exercises'] });
            setFormOpen(false);
            setEditingEx(null);
          }}
        />
      )}

      <ConfirmDialog
        open={deleteConfirm !== null}
        title="删除动作"
        message="确定要删除该健身动作吗？"
        variant="danger"
        confirmLabel="删除"
        onConfirm={() => deleteMutation.mutate(deleteConfirm!)}
        onCancel={() => setDeleteConfirm(null)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

function ExerciseFormDialog({
  open,
  exercise,
  onClose,
  onSaved,
}: {
  open: boolean;
  exercise: Exercise | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(exercise?.name || '');
  const [category, setCategory] = useState(exercise?.category || '胸部');
  const [description, setDescription] = useState(exercise?.description || '');
  const [keyPoints, setKeyPoints] = useState(exercise?.keyPoints || '');
  const [precautions, setPrecautions] = useState(exercise?.precautions || '');
  const [videoPath, setVideoPath] = useState(exercise?.videoPath || '');
  const [sortWeight, setSortWeight] = useState(exercise?.sortWeight || 0);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data: Exercise = { name, category, description, keyPoints, precautions, videoPath, sortWeight };
      if (exercise?.id) {
        await put(`/admin/api/exercise/${exercise.id}`, data);
        toast.success('动作已更新');
      } else {
        await post('/admin/api/exercise/create', data);
        toast.success('动作已创建');
      }
      onSaved();
    } catch {
      // handled by interceptor
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title={exercise ? '编辑动作' : '新增动作'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>名称</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>分类</Label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              {EXERCISE_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>描述</Label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
              className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 resize-none"
            />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>训练要点</Label>
            <textarea value={keyPoints} onChange={(e) => setKeyPoints(e.target.value)} rows={3}
              className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 resize-none"
            />
          </div>
          <div className="col-span-2 space-y-1.5">
            <Label>注意事项</Label>
            <textarea value={precautions} onChange={(e) => setPrecautions(e.target.value)} rows={3}
              className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <Label>视频路径</Label>
            <Input value={videoPath} onChange={(e) => setVideoPath(e.target.value)} placeholder="/video/xxx.mp4" />
          </div>
          <div className="space-y-1.5">
            <Label>排序权重</Label>
            <Input type="number" value={sortWeight} onChange={(e) => setSortWeight(Number(e.target.value))} />
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
