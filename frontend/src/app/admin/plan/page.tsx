'use client';

import { useState } from 'react';
import { useClientPagination } from '@/hooks/useClientPagination';
import { ListPagination } from '@/components/shared/ListPagination';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, del } from '@/lib/api';
import type { Plan } from '@/types';
import { getDifficultyLabel, getDifficultyColor, formatDate } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { toast } from 'sonner';
import { Trash2, ClipboardList, Search, X, Users } from 'lucide-react';

export default function AdminPlanPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const { data: plans } = useQuery({
    queryKey: ['admin-plans'],
    queryFn: () => get<Plan[]>('/admin/api/plan/list'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => del(`/admin/api/plan/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-plans'] });
      setDeleteConfirm(null);
      toast.success('计划已下架');
    },
  });

  const filtered = plans?.filter((p) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return p.title?.toLowerCase().includes(s) || (p.description || '').toLowerCase().includes(s);
  });

  const { currentPage, total, totalPages, pagedItems, handlePageChange } = useClientPagination(filtered, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-text mb-1">计划管理</h1>
          <p className="text-text-muted text-sm">管理所有训练计划</p>
        </div>
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
                <th className="text-left px-5 py-3 text-text-muted font-medium">分组</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">难度</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">动作数</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">用户ID</th>
                <th className="text-right px-5 py-3 text-text-muted font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {pagedItems.map((plan) => (
                <tr key={plan.id} className="border-b border-surface-border last:border-0 hover:bg-surface-hover/50 transition-colors">
                  <td className="px-5 py-3 text-text-dim">{plan.id}</td>
                  <td className="px-5 py-3 text-text font-medium">{plan.title}</td>
                  <td className="px-5 py-3">
                    {plan.groupName ? <Badge variant="muted">{plan.groupName}</Badge> : <span className="text-text-dim">-</span>}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getDifficultyColor(plan.difficultyLevel)}`}>
                      {getDifficultyLabel(plan.difficultyLevel)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-text-muted">{plan.details?.length || 0}</td>
                  <td className="px-5 py-3 text-text-dim">{plan.userId || '-'}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirm(plan.id!)}
                        className="text-danger hover:text-danger"
                        title="下架"
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
          <div className="py-16"><EmptyState icon={<ClipboardList size={40} />} title="暂无计划数据" /></div>
        )}
      </Card>

      <ListPagination
        currentPage={currentPage}
        totalPages={totalPages}
        total={total}
        onPageChange={handlePageChange}
        itemLabel="个计划"
      />

      <ConfirmDialog
        open={deleteConfirm !== null}
        title="下架计划"
        message="确定要下架该训练计划吗？"
        variant="danger"
        confirmLabel="下架"
        onConfirm={() => deleteMutation.mutate(deleteConfirm!)}
        onCancel={() => setDeleteConfirm(null)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
