'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, put, del } from '@/lib/api';
import type { TrainingRecord, TrainingRecordDetail, Exercise, ExerciseCategory, Plan } from '@/types';
import { EXERCISE_CATEGORIES, CATEGORY_COLORS } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useGuestMode } from '@/hooks/useGuestMode';
import { formatDate, todayStr, daysAgo } from '@/lib/utils';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
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
  Calendar,
  Clock,
  Trash2,
  Copy,
  Edit3,
  CheckCircle2,
  X,
  ChevronDown,
  ChevronRight,
  Minus,
  Dumbbell,
  BarChart3,
} from 'lucide-react';

// Map category to icon component
function CategoryIcon({ category, size = 12 }: { category: string; size?: number }) {
  const color = CATEGORY_COLORS[category as ExerciseCategory] || '#6b7280';
  return (
    <span
      className="inline-flex items-center justify-center rounded-full text-[10px] font-bold"
      style={{
        backgroundColor: `${color}20`,
        color,
        width: size + 4,
        height: size + 4,
      }}
      title={category}
    >
      {category.slice(0, 1)}
    </span>
  );
}

export default function TrainingRecordPage() {
  const queryClient = useQueryClient();
  const { isLoggedIn } = useAuth();
  const { isGuest } = useGuestMode();

  const [startDate, setStartDate] = useState(daysAgo(30));
  const [endDate, setEndDate] = useState(todayStr());
  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [editingRecord, setEditingRecord] = useState<TrainingRecord | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  const [appliedPlan, setAppliedPlan] = useState<Plan | null>(null);

  // Check for applied plan from plan page
  useEffect(() => {
    try {
      const stored = localStorage.getItem('fitness_appliedPlan');
      if (stored) {
        const plan = JSON.parse(stored) as Plan;
        setAppliedPlan(plan);
        localStorage.removeItem('fitness_appliedPlan');
        // Auto-open the form with plan data
        setFormOpen(true);
      }
    } catch { /* ignore */ }
  }, []);

  const { data: records, isLoading } = useQuery({
    queryKey: ['training-records', startDate, endDate],
    queryFn: () => get<TrainingRecord[]>('/training/api/list', { startDate, endDate }),
  });

  const { data: exercises } = useQuery({
    queryKey: ['exercises'],
    queryFn: () => get<Exercise[]>('/exercise/api/list'),
    staleTime: 60000,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data: TrainingRecord) => post<TrainingRecord>('/training/api/create', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-records'] });
      setFormOpen(false);
      setAppliedPlan(null);
      toast.success('训练记录已创建');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TrainingRecord }) =>
      put<TrainingRecord>(`/training/api/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-records'] });
      setFormOpen(false);
      setEditingRecord(null);
      toast.success('训练记录已更新');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => del(`/training/api/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-records'] });
      setDeleteConfirm(null);
      toast.success('训练记录已删除');
    },
  });

  const copyMutation = useMutation({
    mutationFn: (id: number) => post<TrainingRecord>(`/training/api/${id}/copy`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-records'] });
      toast.success('记录已复制，可进行编辑');
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id: number) => put(`/training/api/${id}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-records'] });
      toast.success('已标记完成');
    },
  });

  // Fetch full record with details before editing
  const handleEdit = async (record: TrainingRecord) => {
    try {
      const full = await get<TrainingRecord>(`/training/api/${record.id}`);
      setEditingRecord(full);
      setFormOpen(true);
    } catch {
      // Fallback to list record if API fails
      setEditingRecord(record);
      setFormOpen(true);
    }
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingRecord(null);
    setAppliedPlan(null);
  };

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const canWrite = isLoggedIn && !isGuest;

  return (
    <AuthGuard>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl text-text mb-2">训练记录 v2</h1>
          <p className="text-text-muted">记录每日训练，见证每一次进步 — 点击卡片展开详情</p>
        </div>
        <Button onClick={() => { setEditingRecord(null); setFormOpen(true); }} className="gap-2" disabled={!canWrite && !isGuest}>
          <Plus size={18} />
          新增记录
        </Button>
      </div>

      {/* Date filter */}
      <div className="glass rounded-xl p-4 mb-8">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="space-y-1.5">
            <Label className="text-xs">开始日期</Label>
            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-10 w-40" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">结束日期</Label>
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-10 w-40" />
          </div>
          <Button variant="ghost" size="sm" onClick={() => { setStartDate(daysAgo(7)); setEndDate(todayStr()); }}>近7天</Button>
          <Button variant="ghost" size="sm" onClick={() => { setStartDate(daysAgo(30)); setEndDate(todayStr()); }}>近30天</Button>
        </div>
      </div>

      {/* Records list */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (<CardSkeleton key={i} />))}
        </div>
      ) : records && records.length > 0 ? (
        <div className="space-y-4">
          {records.map((record, i) => {
            const isExpanded = expandedIds.has(record.id!);
            const categories = record.details
              ? [...new Set(record.details.map((d) => d.exerciseCategory).filter(Boolean) as string[])]
              : [];

            return (
              <Card
                key={record.id}
                className="animate-slide-up group cursor-pointer"
                hover={true}
                style={{ animationDelay: `${i * 60}ms` }}
                onClick={() => toggleExpand(record.id!)}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <div className="flex items-center gap-1.5 text-sm text-text">
                        <Calendar size={14} className="text-primary" />
                        {formatDate(record.trainDate, 'yyyy年MM月dd日')}
                      </div>
                      {record.duration && (
                        <div className="flex items-center gap-1 text-sm text-text-muted">
                          <Clock size={14} />{record.duration} 分钟
                        </div>
                      )}
                      {record.isCompleted === 1 ? (
                        <Badge variant="success">已完成</Badge>
                      ) : (
                        <Badge variant="warning">进行中</Badge>
                      )}
                      {record.difficulty && (
                        <Badge variant={record.difficulty === 3 ? 'danger' : record.difficulty === 2 ? 'warning' : 'success'}>
                          {record.difficulty === 1 ? '轻松' : record.difficulty === 2 ? '适中' : '高强度'}
                        </Badge>
                      )}
                      {isExpanded && (
                        <span className="text-xs text-primary-light flex items-center gap-1 ml-auto">
                          <ChevronDown size={14} /> 收起
                        </span>
                      )}
                    </div>

                    {/* Category icons */}
                    {categories.length > 0 && (
                      <div className="flex items-center gap-1.5 mb-2">
                        {categories.map((cat) => (
                          <CategoryIcon key={cat} category={cat} size={14} />
                        ))}
                        <span className="text-xs text-text-dim ml-1">
                          {categories.join(' / ')}
                        </span>
                      </div>
                    )}

                    {/* Expanded: show all details */}
                    {isExpanded && record.details && record.details.length > 0 && (
                      <div className="mt-3 space-y-1.5 animate-slide-up">
                        {record.details.map((d) => (
                          <div key={d.id || d.exerciseId} className="flex items-center gap-3 text-sm py-1">
                            <CategoryIcon category={d.exerciseCategory || ''} />
                            <span className="text-text min-w-[80px] truncate">
                              {d.exerciseName || `动作 #${d.exerciseId}`}
                            </span>
                            <span className="text-text-muted">
                              {d.setNumber} 组 × {d.reps} 次
                              {d.weight > 0 && ` · ${d.weight}kg`}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {record.notes && (
                      <p className="text-sm text-text-dim mt-2">{record.notes}</p>
                    )}

                    {/* Stats */}
                    <div className="flex gap-4 mt-3 pt-3 border-t border-surface-border">
                      {record.totalSets != null && (
                        <span className="text-xs text-text-muted"><strong className="text-text">{record.totalSets}</strong> 组</span>
                      )}
                      {record.totalReps != null && (
                        <span className="text-xs text-text-muted"><strong className="text-text">{record.totalReps}</strong> 次</span>
                      )}
                      {!isExpanded && (
                        <span className="text-xs text-primary-light flex items-center gap-1">
                          <ChevronRight size={12} /> 点击展开详情
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 lg:flex-col lg:gap-1" onClick={(e) => e.stopPropagation()}>
                    {record.isCompleted !== 1 && (
                      <Button variant="ghost" size="sm" onClick={() => completeMutation.mutate(record.id!)} disabled={!canWrite} className="text-success hover:text-success" title="标记完成">
                        <CheckCircle2 size={16} />
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => copyMutation.mutate(record.id!)} disabled={!canWrite} title="复制记录">
                      <Copy size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(record)} disabled={!canWrite} title="编辑">
                      <Edit3 size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(record.id!)} disabled={!canWrite} className="text-danger hover:text-danger" title="删除">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={<BarChart3 size={48} />}
          title="暂无训练记录"
          description="开始记录你的第一次训练吧"
          action={
            <Button onClick={() => { setEditingRecord(null); setFormOpen(true); }} className="gap-2">
              <Plus size={16} /> 新增记录
            </Button>
          }
        />
      )}

      {/* Create/Edit Dialog */}
      {formOpen && (
        <TrainingFormDialog
          open={formOpen}
          record={editingRecord}
          appliedPlan={appliedPlan}
          exercises={exercises || []}
          onClose={handleCloseForm}
          onSave={(data) => {
            if (editingRecord?.id) {
              updateMutation.mutate({ id: editingRecord.id, data });
            } else {
              createMutation.mutate(data);
            }
          }}
          saving={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <ConfirmDialog
        open={deleteConfirm !== null}
        title="删除训练记录"
        message="确定要删除这条训练记录吗？此操作不可恢复。"
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

// ============ Training Form Dialog ============
function TrainingFormDialog({
  open,
  record,
  appliedPlan,
  exercises,
  onClose,
  onSave,
  saving,
}: {
  open: boolean;
  record: TrainingRecord | null;
  appliedPlan: Plan | null;
  exercises: Exercise[];
  onClose: () => void;
  onSave: (data: TrainingRecord) => void;
  saving: boolean;
}) {
  // Build initial details from record, or applied plan, or default
  const buildInitialDetails = (): TrainingRecordDetail[] => {
    if (record?.details?.length) {
      return record.details.map((d) => ({
        setNumber: d.setNumber,
        reps: d.reps,
        weight: d.weight ?? 0,
        exerciseId: d.exerciseId,
        exerciseName: d.exerciseName || '',
        exerciseCategory: d.exerciseCategory || '',
        sortOrder: d.sortOrder ?? 0,
      }));
    }
    if (appliedPlan?.details?.length) {
      return appliedPlan.details.map((d) => ({
        setNumber: d.sets,
        reps: d.reps,
        weight: d.weight ?? 0,
        exerciseId: d.exerciseId,
        exerciseName: d.exerciseName || '',
        exerciseCategory: d.exerciseCategory || '',
        sortOrder: d.sortOrder ?? 0,
      }));
    }
    return [{ setNumber: 3, reps: 12, weight: 0, exerciseId: undefined, exerciseName: '', exerciseCategory: '' }];
  };

  const [trainDate, setTrainDate] = useState(record?.trainDate || appliedPlan ? todayStr() : (record?.trainDate || todayStr()));
  const [duration, setDuration] = useState(record?.duration || 60);
  const [difficulty, setDifficulty] = useState(record?.difficulty || 2);
  const [notes, setNotes] = useState(record?.notes || '');
  const [details, setDetails] = useState<TrainingRecordDetail[]>(buildInitialDetails());
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState<number | null>(null);

  const handleAddRow = () => {
    setDetails([...details, { setNumber: 3, reps: 12, weight: 0, exerciseId: undefined, exerciseName: '', exerciseCategory: '' }]);
  };

  const handleRemoveRow = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
  };

  const handleDetailChange = (index: number, field: keyof TrainingRecordDetail, value: unknown) => {
    setDetails(details.map((d, i) => (i === index ? { ...d, [field]: value } : d)));
  };

  const handleSelectExercise = (index: number, ex: Exercise) => {
    setDetails(details.map((d, i) =>
      i === index ? { ...d, exerciseId: ex.id, exerciseName: ex.name, exerciseCategory: ex.category } : d
    ));
    setSearchOpen(null);
    setExerciseSearch('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: TrainingRecord = {
      trainDate,
      duration,
      difficulty,
      notes,
      details: details.map((d, i) => ({ ...d, sortOrder: i + 1 })),
    };
    onSave(data);
  };

  const filteredExercises = exercises.filter(
    (ex) => exerciseSearch && ex.name.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  const showAppliedBadge = !!appliedPlan && !record;

  return (
    <Dialog open={open} onClose={onClose} title={record ? '编辑训练记录' : '新增训练记录'} size="xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {showAppliedBadge && (
          <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 text-sm text-primary-light flex items-center gap-2">
            <Dumbbell size={16} />
            已从计划「{appliedPlan.title}」加载训练模板
          </div>
        )}

        {/* Basic info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>训练日期</Label>
            <Input type="date" value={trainDate} onChange={(e) => setTrainDate(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>时长（分钟）</Label>
            <Input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} min={1} />
          </div>
          <div className="space-y-1.5">
            <Label>强度</Label>
            <div className="flex gap-2">
              {[
                { value: 1, label: '轻松' },
                { value: 2, label: '适中' },
                { value: 3, label: '高强度' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setDifficulty(opt.value)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    difficulty === opt.value ? 'bg-primary text-white' : 'bg-surface-hover text-text-muted hover:text-text'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>动作明细</Label>
            <Button type="button" variant="ghost" size="sm" onClick={handleAddRow}>
              <Plus size={14} /> 添加动作
            </Button>
          </div>

          {details.map((detail, index) => (
            <div key={index} className="glass rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-text">动作 {index + 1}</span>
                {details.length > 1 && (
                  <button type="button" onClick={() => handleRemoveRow(index)} className="text-text-dim hover:text-danger transition-colors">
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Exercise search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索并选择动作..."
                  value={searchOpen === index ? exerciseSearch : (detail.exerciseName || '')}
                  onChange={(e) => {
                    setExerciseSearch(e.target.value);
                    setSearchOpen(index);
                    if (detail.exerciseId) {
                      handleDetailChange(index, 'exerciseName', e.target.value);
                    }
                  }}
                  onFocus={() => {
                    setSearchOpen(index);
                    if (detail.exerciseName) setExerciseSearch(detail.exerciseName);
                  }}
                  className="w-full h-10 rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                />
                {detail.exerciseId && searchOpen !== index && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CheckCircle2 size={16} className="text-success" />
                  </div>
                )}
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
                        <span className="text-text-dim ml-2">{ex.category}</span>
                      </button>
                    ))}
                  </div>
                )}
                {searchOpen === index && exerciseSearch && filteredExercises.length === 0 && (
                  <div className="absolute top-full mt-1 w-full bg-surface border border-surface-border rounded-xl shadow-xl z-10 p-3 text-sm text-text-dim text-center">
                    未找到匹配动作
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">组数</Label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDetailChange(index, 'setNumber', Math.max(1, (detail.setNumber || 1) - 1))}
                      className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center text-text-muted hover:text-text"
                    >
                      <Minus size={14} />
                    </button>
                    <Input
                      type="number"
                      value={detail.setNumber || ''}
                      onChange={(e) => handleDetailChange(index, 'setNumber', Number(e.target.value))}
                      min={1}
                      className="h-8 text-center w-16"
                    />
                    <button
                      type="button"
                      onClick={() => handleDetailChange(index, 'setNumber', (detail.setNumber || 0) + 1)}
                      className="w-8 h-8 rounded-lg bg-surface-hover flex items-center justify-center text-text-muted hover:text-text"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">次数</Label>
                  <Input
                    type="number"
                    value={detail.reps || ''}
                    onChange={(e) => handleDetailChange(index, 'reps', Number(e.target.value))}
                    min={1}
                    className="h-8"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">负重 (kg)</Label>
                  <Input
                    type="number"
                    value={detail.weight ?? ''}
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

        {/* Notes */}
        <div className="space-y-1.5">
          <Label>备注</Label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="训练感受、注意事项..."
            className="w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 resize-none"
          />
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="outline" onClick={onClose}>取消</Button>
          <Button type="submit" disabled={saving}>
            {saving ? '保存中...' : record ? '更新记录' : '创建记录'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
