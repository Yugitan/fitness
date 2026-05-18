'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { get, post, put, del } from '@/lib/api';
import type { Plan, PlanGroup, PlanDetail, Exercise } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useGuestMode } from '@/hooks/useGuestMode';
import { getDifficultyLabel, getDifficultyColor } from '@/lib/utils';
import { Card, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { CardSkeleton } from '@/components/shared/Skeleton';
import { AuthGuard } from '@/components/shared/AuthGuard';
import { toast } from 'sonner';
import {
  Plus,
  ClipboardList,
  Copy,
  Edit3,
  Trash2,
  Play,
  Search,
  Users,
  TrendingUp,
  Target,
  Calendar,
  CheckCircle2,
  X,
  Minus,
} from 'lucide-react';

export default function PlanListPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { isGuest } = useGuestMode();
  const [activeGroupId, setActiveGroupId] = useState<number | undefined>();
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans', activeGroupId],
    queryFn: () => {
      const params: Record<string, unknown> = {};
      if (activeGroupId) params.groupId = activeGroupId;
      return get<Plan[]>('/plan/api/list', params);
    },
  });

  const { data: groups } = useQuery({
    queryKey: ['plan-groups'],
    queryFn: () => get<PlanGroup[]>('/plan/api/groups'),
  });

  const { data: exercises } = useQuery({
    queryKey: ['exercises'],
    queryFn: () => get<Exercise[]>('/exercise/api/list'),
    staleTime: 60000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => del(`/plan/api/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      setDeleteConfirm(null);
      toast.success('计划已删除');
    },
  });

  const copyMutation = useMutation({
    mutationFn: (id: number) => post<Plan>(`/plan/api/${id}/copy`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plans'] });
      toast.success('计划已复制，可进行编辑');
    },
  });

  const applyMutation = useMutation({
    mutationFn: (id: number) => get<Plan>(`/plan/api/${id}/apply`),
    onSuccess: (plan) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('fitness_appliedPlan', JSON.stringify(plan));
      }
      toast.success('已套用计划模板，正在跳转到训练页...');
      setTimeout(() => router.push('/training/'), 500);
    },
  });

  const canWrite = isLoggedIn && !isGuest;

  return (
    <AuthGuard>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl text-text mb-2">训练计划</h1>
          <p className="text-text-muted">预置多套训练计划，一键套用生成训练清单</p>
        </div>
        <Button onClick={() => setFormOpen(true)} className="gap-2" disabled={!canWrite}>
          <Plus size={18} />
          创建计划
        </Button>
      </div>

      {/* Group tabs */}
      {groups && groups.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setActiveGroupId(undefined)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              !activeGroupId
                ? 'bg-primary text-white'
                : 'bg-surface-hover text-text-muted hover:text-text border border-surface-border'
            }`}
          >
            全部
          </button>
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveGroupId(g.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeGroupId === g.id
                  ? 'bg-primary text-white'
                  : 'bg-surface-hover text-text-muted hover:text-text border border-surface-border'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      )}

      {/* Plans grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : plans && plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans.map((plan, i) => (
            <Card key={plan.id} className="animate-slide-up group" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex gap-2">
                  {plan.groupName && <Badge variant="muted">{plan.groupName}</Badge>}
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getDifficultyColor(plan.difficultyLevel)}`}>
                    {getDifficultyLabel(plan.difficultyLevel)}
                  </span>
                </div>
              </div>
              <CardTitle className="group-hover:text-primary-light transition-colors">{plan.title}</CardTitle>
              <CardDescription className="line-clamp-2 mt-1">
                {plan.description || '暂无描述'}
              </CardDescription>

              {/* Plan details preview */}
              {plan.details && plan.details.length > 0 && (
                <div className="mt-3 space-y-1">
                  {plan.details.slice(0, 3).map((d, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs text-text-muted">
                      <span className="w-5 h-5 rounded bg-surface-hover flex items-center justify-center text-[10px] font-medium">
                        D{d.dayNumber}
                      </span>
                      <span>{d.exerciseName || `动作 #${d.exerciseId}`}</span>
                      <span className="text-text-dim">{d.sets}×{d.reps}</span>
                    </div>
                  ))}
                  {plan.details.length > 3 && (
                    <p className="text-xs text-text-dim pl-7">+{plan.details.length - 3} 个动作</p>
                  )}
                </div>
              )}

              <CardFooter>
                <div className="flex items-center gap-1 ml-auto">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingPlan(plan);
                      setFormOpen(true);
                    }}
                    disabled={!canWrite}
                    title="编辑"
                  >
                    <Edit3 size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyMutation.mutate(plan.id!)}
                    disabled={!canWrite}
                    title="复制"
                  >
                    <Copy size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteConfirm(plan.id!)}
                    disabled={!canWrite}
                    className="text-danger hover:text-danger"
                    title="删除"
                  >
                    <Trash2 size={16} />
                  </Button>
                  <Button
                    variant="accent"
                    size="sm"
                    onClick={() => applyMutation.mutate(plan.id!)}
                    className="gap-1 ml-1"
                  >
                    <Play size={14} />
                    套用
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<ClipboardList size={48} />}
          title="暂无训练计划"
          description="创建你的第一个训练计划模板"
          action={
            canWrite ? (
              <Button onClick={() => setFormOpen(true)} className="gap-2">
                <Plus size={16} />
                创建计划
              </Button>
            ) : undefined
          }
        />
      )}

      {/* Create/Edit Dialog */}
      {formOpen && (
        <PlanFormDialog
          open={formOpen}
          plan={editingPlan}
          exercises={exercises || []}
          groups={groups || []}
          onClose={() => { setFormOpen(false); setEditingPlan(null); }}
          onSave={async (data) => {
            if (editingPlan?.id) {
              await put<Plan>(`/plan/api/${editingPlan.id}`, data);
            } else {
              await post<Plan>('/plan/api/create', data);
            }
            queryClient.invalidateQueries({ queryKey: ['plans'] });
            setFormOpen(false);
            setEditingPlan(null);
            toast.success(editingPlan ? '计划已更新' : '计划已创建');
          }}
        />
      )}

      <ConfirmDialog
        open={deleteConfirm !== null}
        title="删除计划"
        message="确定要删除这个训练计划吗？"
        variant="danger"
        confirmLabel="删除"
        onConfirm={() => deleteMutation.mutate(deleteConfirm!)}
        onCancel={() => setDeleteConfirm(null)}
        loading={deleteMutation.isPending}
      />
    </div>
    </AuthGuard>
  );
}

// ============ Plan Form Dialog ============
function PlanFormDialog({
  open,
  plan,
  exercises,
  groups,
  onClose,
  onSave,
}: {
  open: boolean;
  plan: Plan | null;
  exercises: Exercise[];
  groups: PlanGroup[];
  onClose: () => void;
  onSave: (data: Plan) => Promise<void>;
}) {
  const [title, setTitle] = useState(plan?.title || '');
  const [description, setDescription] = useState(plan?.description || '');
  const [groupId, setGroupId] = useState(plan?.groupId || (groups[0]?.id ?? 0));
  const [difficultyLevel, setDifficultyLevel] = useState(plan?.difficultyLevel || 1);
  const [targetBodyPart, setTargetBodyPart] = useState(plan?.targetBodyPart || '');
  const [details, setDetails] = useState<PlanDetail[]>(
    plan?.details?.length
      ? plan.details.map((d) => ({ ...d }))
      : [{ dayNumber: 1, sets: 3, reps: 12, exerciseId: undefined, exerciseName: '' }]
  );
  const [saving, setSaving] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState<number | null>(null);

  const handleAddRow = () => {
    setDetails([...details, { dayNumber: details.length + 1, sets: 3, reps: 12, exerciseId: undefined, exerciseName: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const handleDetailChange = (index: number, field: keyof PlanDetail, value: unknown) => {
    setDetails(details.map((d, i) => (i === index ? { ...d, [field]: value } : d)));
  };

  const handleSelectExercise = (index: number, ex: Exercise) => {
    setDetails(details.map((d, i) => (i === index ? { ...d, exerciseId: ex.id, exerciseName: ex.name } : d)));
    setSearchOpen(null);
    setExerciseSearch('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        title,
        description,
        groupId: groupId || undefined,
        difficultyLevel,
        targetBodyPart,
        details: details.map((d, i) => ({ ...d, sortOrder: i + 1 })),
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredExercises = exercises.filter(
    (ex) => exerciseSearch && ex.name.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  return (
    <Dialog open={open} onClose={onClose} title={plan ? '编辑计划' : '创建训练计划'} size="xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>计划名称</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="如：胸部增肌计划" required />
          </div>
          <div className="space-y-1.5">
            <Label>分组</Label>
            <select
              value={groupId || ''}
              onChange={(e) => setGroupId(Number(e.target.value) || 0)}
              className="w-full h-10 rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>难度</Label>
            <div className="flex gap-2">
              {[
                { value: 1, label: '初级' },
                { value: 2, label: '中级' },
                { value: 3, label: '高级' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDifficultyLevel(opt.value)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    difficultyLevel === opt.value
                      ? 'bg-primary text-white'
                      : 'bg-surface-hover text-text-muted hover:text-text'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>目标部位</Label>
            <Input value={targetBodyPart} onChange={(e) => setTargetBodyPart(e.target.value)} placeholder="如：胸部" />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>描述</Label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 resize-none"
            placeholder="计划描述、训练目标..."
          />
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>动作编排</Label>
            <Button type="button" variant="ghost" size="sm" onClick={handleAddRow}>
              <Plus size={14} /> 添加动作
            </Button>
          </div>

          {details.map((detail, index) => (
            <div key={index} className="glass rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text">训练日 {detail.dayNumber}</span>
                {details.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRow(index)}
                    className="text-text-dim hover:text-danger transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder={detail.exerciseName || '搜索并选择动作...'}
                  value={searchOpen === index ? exerciseSearch : (detail.exerciseName || '')}
                  onChange={(e) => { setExerciseSearch(e.target.value); setSearchOpen(index); }}
                  onFocus={() => setSearchOpen(index)}
                  className="w-full h-10 rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                />
                {searchOpen === index && filteredExercises.length > 0 && (
                  <div className="absolute top-full mt-1 w-full bg-surface border border-surface-border rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto">
                    {filteredExercises.slice(0, 8).map((ex) => (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => handleSelectExercise(index, ex)}
                        className="w-full text-left px-3 py-2 text-sm text-text-muted hover:text-text hover:bg-surface-hover transition-colors"
                      >
                        {ex.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">训练日</Label>
                  <Input
                    type="number"
                    value={detail.dayNumber}
                    onChange={(e) => handleDetailChange(index, 'dayNumber', Number(e.target.value))}
                    min={1}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">组数</Label>
                  <Input
                    type="number"
                    value={detail.sets}
                    onChange={(e) => handleDetailChange(index, 'sets', Number(e.target.value))}
                    min={1}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">次数</Label>
                  <Input
                    type="number"
                    value={detail.reps}
                    onChange={(e) => handleDetailChange(index, 'reps', Number(e.target.value))}
                    min={1}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">负重 (kg)</Label>
                  <Input
                    type="number"
                    value={detail.weight || 0}
                    onChange={(e) => handleDetailChange(index, 'weight', Number(e.target.value))}
                    min={0}
                    step={2.5}
                    className="h-8"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="outline" onClick={onClose}>取消</Button>
          <Button type="submit" disabled={saving}>
            {saving ? '保存中...' : plan ? '更新计划' : '创建计划'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
