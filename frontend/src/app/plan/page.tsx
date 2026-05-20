'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { get, post, put, del } from '@/lib/api';
import type { Plan, PlanGroup, PlanDetail, Exercise } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useGuestMode } from '@/hooks/useGuestMode';
import { getDifficultyLabel, getDifficultyColor } from '@/lib/utils';
import {
  parseDetailNumericField,
  sanitizeDetailNumericInput,
  validateDetailNumericField,
  validateDetailNumericRows,
  type DetailNumericField,
} from '@/lib/numeric-field';
import { NumericFieldInput } from '@/components/shared/NumericFieldInput';
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
import { ListPagination, PLAN_PAGE_SIZE } from '@/components/shared/ListPagination';
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

function groupPlanDetailsByDay(details: PlanDetail[]) {
  const map = new Map<number, PlanDetail[]>();
  for (const d of details) {
    const day = d.dayNumber || 1;
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(d);
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0]);
}

type PlanNumericField = Exclude<DetailNumericField, 'setNumber'>;
type PlanDetailInputRow = Record<PlanNumericField, string>;
type PlanDetailErrors = Partial<Record<PlanNumericField, string>>;

const PLAN_NUMERIC_FIELDS: PlanNumericField[] = ['dayNumber', 'sets', 'reps', 'weight'];

function planDetailToInputs(d: PlanDetail): PlanDetailInputRow {
  return {
    dayNumber: String(d.dayNumber ?? ''),
    sets: String(d.sets ?? ''),
    reps: String(d.reps ?? ''),
    weight: d.weight != null && d.weight > 0 ? String(d.weight) : '',
  };
}

function syncDetailsFromInputs(details: PlanDetail[], rows: PlanDetailInputRow[]): PlanDetail[] {
  return details.map((d, i) => ({
    ...d,
    dayNumber: parseDetailNumericField('dayNumber', rows[i]?.dayNumber ?? ''),
    sets: parseDetailNumericField('sets', rows[i]?.sets ?? ''),
    reps: parseDetailNumericField('reps', rows[i]?.reps ?? ''),
    weight: parseDetailNumericField('weight', rows[i]?.weight ?? ''),
  }));
}

export default function PlanListPage() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { isGuest } = useGuestMode();
  const [activeGroupId, setActiveGroupId] = useState<number | undefined>();
  const [formOpen, setFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [viewingPlan, setViewingPlan] = useState<Plan | null>(null);
  const [viewingPlanLoading, setViewingPlanLoading] = useState(false);
  const [page, setPage] = useState(1);

  const openPlanDetail = async (plan: Plan) => {
    if (!plan.id) return;
    setViewingPlan(plan);
    setViewingPlanLoading(true);
    try {
      const full = await get<Plan>(`/plan/api/${plan.id}`);
      setViewingPlan(full);
    } catch {
      toast.error('加载计划详情失败');
      setViewingPlan(null);
    } finally {
      setViewingPlanLoading(false);
    }
  };

  const { data: plans, isLoading } = useQuery({
    queryKey: ['plans', activeGroupId],
    queryFn: () => {
      const query: Record<string, unknown> = {};
      if (activeGroupId) query.groupId = activeGroupId;
      return get<Plan[]>('/plan/api/list', query);
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

  useEffect(() => {
    setPage(1);
  }, [activeGroupId]);

  const total = plans?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PLAN_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedPlans = useMemo(() => {
    if (!plans?.length) return [];
    const start = (currentPage - 1) * PLAN_PAGE_SIZE;
    return plans.slice(start, start + PLAN_PAGE_SIZE);
  }, [plans, currentPage]);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
          <p className="text-text-muted">
            {isLoading
              ? '加载中...'
              : total > 0
                ? `共 ${total} 个计划，一键套用生成训练清单`
                : '预置多套训练计划，一键套用生成训练清单'}
          </p>
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
          {Array.from({ length: PLAN_PAGE_SIZE }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : plans && plans.length > 0 ? (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pagedPlans.map((plan, i) => (
            <Card key={plan.id} hover={false} className="animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex gap-2">
                  {plan.groupName && <Badge variant="muted">{plan.groupName}</Badge>}
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getDifficultyColor(plan.difficultyLevel)}`}>
                    {getDifficultyLabel(plan.difficultyLevel)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => openPlanDetail(plan)}
                className="w-full text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg"
              >
                <CardTitle>{plan.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                  {plan.description || '暂无描述'}
                </CardDescription>

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
                      <p className="text-xs text-text-dim pl-7 mt-1">
                        +{plan.details.length - 3} 个动作
                      </p>
                    )}
                  </div>
                )}
              </button>

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

        <ListPagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          onPageChange={handlePageChange}
          itemLabel="个计划"
        />
        </>
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

      {viewingPlan && (
        <PlanDetailViewDialog
          plan={viewingPlan}
          loading={viewingPlanLoading}
          onClose={() => setViewingPlan(null)}
          onApply={() => {
            applyMutation.mutate(viewingPlan.id!);
            setViewingPlan(null);
          }}
          onEdit={
            canWrite
              ? () => {
                  setEditingPlan(viewingPlan);
                  setFormOpen(true);
                  setViewingPlan(null);
                }
              : undefined
          }
          applying={applyMutation.isPending}
        />
      )}
    </div>
    </AuthGuard>
  );
}

// ============ Plan Detail View Dialog ============
function PlanDetailViewDialog({
  plan,
  loading,
  onClose,
  onApply,
  onEdit,
  applying,
}: {
  plan: Plan;
  loading?: boolean;
  onClose: () => void;
  onApply: () => void;
  onEdit?: () => void;
  applying?: boolean;
}) {
  const dayGroups = groupPlanDetailsByDay(plan.details || []);
  const exerciseCount = plan.details?.length ?? 0;

  return (
    <Dialog open onClose={onClose} title={plan.title} size="lg">
      <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
        <div className="flex flex-wrap gap-2">
          {plan.groupName && <Badge variant="muted">{plan.groupName}</Badge>}
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getDifficultyColor(plan.difficultyLevel)}`}>
            {getDifficultyLabel(plan.difficultyLevel)}
          </span>
          {plan.targetBodyPart && (
            <Badge variant="outline" className="gap-1">
              <Target size={12} />
              {plan.targetBodyPart}
            </Badge>
          )}
          {exerciseCount > 0 && (
            <Badge variant="outline">{exerciseCount} 个动作</Badge>
          )}
        </div>

        {plan.description && (
          <p className="text-sm text-text-muted leading-relaxed">{plan.description}</p>
        )}

        {loading ? (
          <div className="space-y-3 py-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : dayGroups.length > 0 ? (
          <div className="space-y-4">
            {dayGroups.map(([day, items]) => (
              <div key={day} className="rounded-xl border border-surface-border bg-surface-hover/30 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-surface-border bg-surface-hover/50 flex items-center gap-2">
                  <Calendar size={14} className="text-primary" />
                  <span className="text-sm font-medium text-text">训练日 {day}</span>
                  <span className="text-xs text-text-dim ml-auto">{items.length} 个动作</span>
                </div>
                <ul className="divide-y divide-surface-border">
                  {items.map((d, idx) => (
                    <li key={d.id ?? `${day}-${idx}`} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text">
                          {d.exerciseName || `动作 #${d.exerciseId}`}
                        </p>
                        {d.exerciseCategory && (
                          <p className="text-xs text-text-dim mt-0.5">{d.exerciseCategory}</p>
                        )}
                        {d.notes && (
                          <p className="text-xs text-text-muted mt-1">{d.notes}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted shrink-0">
                        <span>
                          <strong className="text-text">{d.sets}</strong> 组 ×{' '}
                          <strong className="text-text">{d.reps}</strong> 次
                        </span>
                        {d.weight != null && d.weight > 0 && (
                          <span>{d.weight} kg</span>
                        )}
                        {d.restSeconds != null && d.restSeconds > 0 && (
                          <span className="text-text-dim">休息 {d.restSeconds}s</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<ClipboardList size={40} />}
            title="暂无动作编排"
            description="该计划尚未添加训练动作"
          />
        )}

        <div className="flex flex-wrap gap-3 justify-end pt-2 border-t border-surface-border sticky bottom-0 bg-surface">
          <Button type="button" variant="outline" onClick={onClose}>
            关闭
          </Button>
          {onEdit && (
            <Button type="button" variant="ghost" onClick={onEdit} className="gap-1">
              <Edit3 size={16} />
              编辑
            </Button>
          )}
          <Button type="button" variant="accent" onClick={onApply} disabled={applying} className="gap-1">
            <Play size={16} />
            {applying ? '套用中...' : '套用此计划'}
          </Button>
        </div>
      </div>
    </Dialog>
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
  const initialDetails: PlanDetail[] = plan?.details?.length
    ? plan.details.map((d) => ({ ...d }))
    : [{ dayNumber: 1, sets: 3, reps: 12, weight: 0, exerciseId: undefined, exerciseName: '' }];

  const [details, setDetails] = useState<PlanDetail[]>(initialDetails);
  const [detailInputs, setDetailInputs] = useState<PlanDetailInputRow[]>(() =>
    initialDetails.map(planDetailToInputs)
  );
  const [detailErrors, setDetailErrors] = useState<Record<number, PlanDetailErrors>>({});
  const [saving, setSaving] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState<number | null>(null);

  const handleAddRow = () => {
    setDetails([...details, { dayNumber: details.length + 1, sets: 3, reps: 12, weight: 0, exerciseId: undefined, exerciseName: '' }]);
    setDetailInputs([...detailInputs, { dayNumber: String(details.length + 1), sets: '3', reps: '12', weight: '' }]);
    setDetailErrors({});
  };

  const handleRemoveRow = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
    setDetailInputs(detailInputs.filter((_, i) => i !== index));
    setDetailErrors((prev) => {
      const next: Record<number, PlanDetailErrors> = {};
      Object.entries(prev).forEach(([key, val]) => {
        const i = Number(key);
        if (i < index) next[i] = val;
        else if (i > index) next[i - 1] = val;
      });
      return next;
    });
  };

  const handleNumericInputChange = (index: number, field: PlanNumericField, raw: string) => {
    const sanitized = sanitizeDetailNumericInput(field, raw);
    setDetailInputs((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: sanitized } : row))
    );
    const err = validateDetailNumericField(field, sanitized, {
      allowPartial: field === 'weight',
    });
    setDetailErrors((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: err },
    }));
    if (!err) {
      handleDetailChange(index, field, parseDetailNumericField(field, sanitized));
    }
  };

  const handleNumericBlur = (index: number, field: PlanNumericField) => {
    const value = detailInputs[index]?.[field] ?? '';
    const err = validateDetailNumericField(field, value, { allowPartial: false });
    setDetailErrors((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: err },
    }));
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
    const { valid, errors } = validateDetailNumericRows(detailInputs, PLAN_NUMERIC_FIELDS);
    setDetailErrors(errors);
    if (!valid) {
      toast.error('请修正动作编排中的数字输入');
      return;
    }
    const syncedDetails = syncDetailsFromInputs(details, detailInputs);
    setSaving(true);
    try {
      await onSave({
        title,
        description,
        groupId: groupId || undefined,
        difficultyLevel,
        targetBodyPart,
        details: syncedDetails.map((d, i) => ({ ...d, sortOrder: i + 1 })),
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
                { value: 4, label: 'Pro' },
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
                <NumericFieldInput
                  label="训练日"
                  field="dayNumber"
                  value={detailInputs[index]?.dayNumber ?? ''}
                  error={detailErrors[index]?.dayNumber}
                  onChange={(v) => handleNumericInputChange(index, 'dayNumber', v)}
                  onBlur={() => handleNumericBlur(index, 'dayNumber')}
                />
                <NumericFieldInput
                  label="组数"
                  field="sets"
                  value={detailInputs[index]?.sets ?? ''}
                  error={detailErrors[index]?.sets}
                  onChange={(v) => handleNumericInputChange(index, 'sets', v)}
                  onBlur={() => handleNumericBlur(index, 'sets')}
                />
                <NumericFieldInput
                  label="次数"
                  field="reps"
                  value={detailInputs[index]?.reps ?? ''}
                  error={detailErrors[index]?.reps}
                  onChange={(v) => handleNumericInputChange(index, 'reps', v)}
                  onBlur={() => handleNumericBlur(index, 'reps')}
                />
                <NumericFieldInput
                  label="负重 (kg)"
                  field="weight"
                  value={detailInputs[index]?.weight ?? ''}
                  error={detailErrors[index]?.weight}
                  onChange={(v) => handleNumericInputChange(index, 'weight', v)}
                  onBlur={() => handleNumericBlur(index, 'weight')}
                />
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
