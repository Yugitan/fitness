'use client';

import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, put, del } from '@/lib/api';
import type { TrainingRecord, TrainingRecordDetail, Exercise, ExerciseCategory, Plan, PlanDetail } from '@/types';
import { EXERCISE_CATEGORIES, CATEGORY_COLORS } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { useGuestMode } from '@/hooks/useGuestMode';
import { formatDate, todayStr, daysAgo, computeTrainingStats } from '@/lib/utils';
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
import { ListPagination, TRAINING_PAGE_SIZE } from '@/components/shared/ListPagination';
import { NumericFieldInput } from '@/components/shared/NumericFieldInput';
import {
  parseDetailNumericField,
  sanitizeDetailNumericInput,
  validateDetailNumericField,
  validateDetailNumericRows,
  type DetailNumericField,
} from '@/lib/numeric-field';

import { toast } from 'sonner';
import {
  Plus,
  Calendar,
  Trash2,
  Copy,
  Edit3,
  CheckCircle2,
  X,
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
  const [viewingRecord, setViewingRecord] = useState<TrainingRecord | null>(null);
  const [viewingRecordLoading, setViewingRecordLoading] = useState(false);
  const [appliedPlan, setAppliedPlan] = useState<Plan | null>(null);
  const [page, setPage] = useState(1);

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

  useEffect(() => {
    setPage(1);
  }, [startDate, endDate]);

  const total = records?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / TRAINING_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedRecords = useMemo(() => {
    if (!records?.length) return [];
    const start = (currentPage - 1) * TRAINING_PAGE_SIZE;
    return records.slice(start, start + TRAINING_PAGE_SIZE);
  }, [records, currentPage]);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { data: exercises } = useQuery({
    queryKey: ['exercises'],
    queryFn: () => get<Exercise[]>('/exercise/api/list'),
    staleTime: 60000,
  });

  // Mutations
  const invalidateTrainingViews = () => {
    queryClient.invalidateQueries({ queryKey: ['training-records'] });
    queryClient.invalidateQueries({ queryKey: ['stats-personal'] });
    queryClient.invalidateQueries({ queryKey: ['stats-trend'] });
    queryClient.invalidateQueries({ queryKey: ['stats-frequency'] });
  };

  const createMutation = useMutation({
    mutationFn: (data: TrainingRecord) => post<TrainingRecord>('/training/api/create', data),
    onSuccess: () => {
      invalidateTrainingViews();
      setFormOpen(false);
      setAppliedPlan(null);
      toast.success('训练记录已创建');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TrainingRecord }) =>
      put<TrainingRecord>(`/training/api/${id}`, data),
    onSuccess: () => {
      invalidateTrainingViews();
      setFormOpen(false);
      setEditingRecord(null);
      toast.success('训练记录已更新');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => del(`/training/api/${id}`),
    onSuccess: () => {
      invalidateTrainingViews();
      setDeleteConfirm(null);
      toast.success('训练记录已删除');
    },
  });

  const copyMutation = useMutation({
    mutationFn: (id: number) => post<TrainingRecord>(`/training/api/${id}/copy`),
    onSuccess: () => {
      invalidateTrainingViews();
      toast.success('记录已复制，可进行编辑');
    },
  });

  const completeMutation = useMutation({
    mutationFn: (id: number) => put(`/training/api/${id}/complete`),
    onSuccess: () => {
      invalidateTrainingViews();
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

  const openRecordDetail = async (record: TrainingRecord) => {
    if (!record.id) return;
    setViewingRecord(record);
    setViewingRecordLoading(true);
    try {
      const full = await get<TrainingRecord>(`/training/api/${record.id}`);
      setViewingRecord(full);
    } catch {
      toast.error('加载训练详情失败');
      setViewingRecord(null);
    } finally {
      setViewingRecordLoading(false);
    }
  };

  const canWrite = isLoggedIn && !isGuest;

  return (
    <AuthGuard>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl text-text mb-2">训练记录</h1>
          <p className="text-text-muted">
            {isLoading
              ? '加载中...'
              : total > 0
                ? `共 ${total} 条记录，点击卡片查看详情`
                : '记录每日训练，见证每一次进步'}
          </p>
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

      {/* Records grid — 每行 3 个（紧凑） */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: TRAINING_PAGE_SIZE }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : records && records.length > 0 ? (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {pagedRecords.map((record, i) => {
            const categories = record.details
              ? [...new Set(record.details.map((d) => d.exerciseCategory).filter(Boolean) as string[])]
              : [];
            const stats = computeTrainingStats(record.details);
            const displaySets = record.details?.length ? stats.totalSets : (record.totalSets ?? 0);
            const displayReps = record.details?.length ? stats.totalReps : (record.totalReps ?? 0);

            return (
              <Card
                key={record.id}
                hover={false}
                className="animate-slide-up flex flex-col p-3"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <button
                  type="button"
                  onClick={() => openRecordDetail(record)}
                  className="w-full text-left flex-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded-lg"
                >
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="flex items-center gap-1.5 text-sm font-semibold mb-0">
                      <Calendar size={14} className="text-primary shrink-0" />
                      {formatDate(record.trainDate, 'yyyy年MM月dd日')}
                    </CardTitle>
                    <div className="flex flex-wrap gap-1 justify-end shrink-0">
                      {record.isCompleted === 1 ? (
                        <Badge variant="success" className="text-[10px] px-1.5 py-0">
                          已完成
                        </Badge>
                      ) : (
                        <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                          进行中
                        </Badge>
                      )}
                      {record.difficulty != null && (
                        <Badge
                          variant={
                            record.difficulty === 3
                              ? 'danger'
                              : record.difficulty === 2
                                ? 'warning'
                                : 'success'
                          }
                          className="text-[10px] px-1.5 py-0"
                        >
                          {record.difficulty === 1
                            ? '轻松'
                            : record.difficulty === 2
                              ? '适中'
                              : '高强度'}
                        </Badge>
                      )}
                      {record.duration != null && record.duration > 0 && (
                        <Badge variant="muted" className="text-[10px] px-1.5 py-0">
                          {record.duration}分
                        </Badge>
                      )}
                    </div>
                  </div>

                  {record.notes && (
                    <CardDescription className="line-clamp-1 text-xs mt-1">
                      {record.notes}
                    </CardDescription>
                  )}

                  {categories.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {categories.map((cat) => (
                        <CategoryIcon key={cat} category={cat} size={14} />
                      ))}
                    </div>
                  )}

                  {(stats.exerciseCount > 0 || displaySets > 0 || displayReps > 0) && (
                    <p className="text-[11px] text-text-dim mt-1.5">
                      {stats.exerciseCount > 0 && <span>{stats.exerciseCount} 动作 · </span>}
                      {displaySets > 0 && <span>{displaySets} 组 · </span>}
                      {displayReps > 0 && <span>{displayReps} 次</span>}
                    </p>
                  )}
                </button>

                <CardFooter className="mt-2 pt-2">
                  <div className="flex items-center gap-0.5 ml-auto" onClick={(e) => e.stopPropagation()}>
                    {record.isCompleted !== 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => completeMutation.mutate(record.id!)}
                        disabled={!canWrite}
                        className="text-success hover:text-success"
                        title="标记完成"
                      >
                        <CheckCircle2 size={16} />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyMutation.mutate(record.id!)}
                      disabled={!canWrite}
                      title="复制记录"
                    >
                      <Copy size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(record)}
                      disabled={!canWrite}
                      title="编辑"
                    >
                      <Edit3 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteConfirm(record.id!)}
                      disabled={!canWrite}
                      className="text-danger hover:text-danger"
                      title="删除"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        <ListPagination
          currentPage={currentPage}
          totalPages={totalPages}
          total={total}
          onPageChange={handlePageChange}
          itemLabel="条记录"
        />
        </>
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

      {viewingRecord && (
        <TrainingRecordDetailDialog
          record={viewingRecord}
          loading={viewingRecordLoading}
          onClose={() => setViewingRecord(null)}
          onEdit={() => {
            const r = viewingRecord;
            setViewingRecord(null);
            if (r) handleEdit(r);
          }}
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

type TrainingNumericField = Extract<DetailNumericField, 'setNumber' | 'reps' | 'weight'>;
type TrainingDetailInputRow = Record<TrainingNumericField, string>;
type TrainingDetailErrors = Partial<Record<TrainingNumericField, string>>;

const TRAINING_NUMERIC_FIELDS: TrainingNumericField[] = ['setNumber', 'reps', 'weight'];

function trainingDetailToInputs(d: TrainingRecordDetail): TrainingDetailInputRow {
  return {
    setNumber: String(d.setNumber ?? ''),
    reps: String(d.reps ?? ''),
    weight: d.weight != null && d.weight > 0 ? String(d.weight) : '',
  };
}

function syncTrainingDetailsFromInputs(
  details: TrainingRecordDetail[],
  rows: TrainingDetailInputRow[]
): TrainingRecordDetail[] {
  return details.map((d, i) => ({
    ...d,
    setNumber: parseDetailNumericField('setNumber', rows[i]?.setNumber ?? ''),
    reps: parseDetailNumericField('reps', rows[i]?.reps ?? ''),
    weight: parseDetailNumericField('weight', rows[i]?.weight ?? ''),
  }));
}

function groupPlanDetailsByDay(details: PlanDetail[]): Array<[number, PlanDetail[]]> {
  const groups = details.reduce<Record<number, PlanDetail[]>>((acc, detail) => {
    const day = Number(detail.dayNumber) || 1;
    if (!acc[day]) acc[day] = [];
    acc[day].push(detail);
    return acc;
  }, {});

  return Object.entries(groups)
    .map(([day, dayDetails]) => [Number(day), [...dayDetails].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))] as [number, PlanDetail[]])
    .sort(([a], [b]) => a - b);
}

function TrainingRecordDetailDialog({
  record,
  loading,
  onClose,
  onEdit,
}: {
  record: TrainingRecord;
  loading?: boolean;
  onClose: () => void;
  onEdit?: () => void;
}) {
  const stats = computeTrainingStats(record.details);
  const categories = record.details
    ? [...new Set(record.details.map((d) => d.exerciseCategory).filter(Boolean) as string[])]
    : [];
  const title = formatDate(record.trainDate, 'yyyy年MM月dd日');

  return (
    <Dialog open onClose={onClose} title={title} size="lg">
      <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
        <div className="flex flex-wrap gap-2">
          {record.isCompleted === 1 ? (
            <Badge variant="success">已完成</Badge>
          ) : (
            <Badge variant="warning">进行中</Badge>
          )}
          {record.difficulty != null && (
            <Badge
              variant={
                record.difficulty === 3 ? 'danger' : record.difficulty === 2 ? 'warning' : 'success'
              }
            >
              {record.difficulty === 1 ? '轻松' : record.difficulty === 2 ? '适中' : '高强度'}
            </Badge>
          )}
          {record.duration != null && record.duration > 0 && (
            <Badge variant="muted">{record.duration} 分钟</Badge>
          )}
          {categories.map((cat) => (
            <Badge key={cat} variant="outline">
              {cat}
            </Badge>
          ))}
        </div>

        {record.notes && (
          <p className="text-sm text-text-muted leading-relaxed">{record.notes}</p>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-text-muted">
          {stats.exerciseCount > 0 && (
            <span>
              <strong className="text-text">{stats.exerciseCount}</strong> 个动作
            </span>
          )}
          {stats.totalSets > 0 && (
            <span>
              <strong className="text-text">{stats.totalSets}</strong> 组
            </span>
          )}
          {stats.totalReps > 0 && (
            <span>
              <strong className="text-text">{stats.totalReps}</strong> 次
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-3 py-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : record.details && record.details.length > 0 ? (
          <ul className="rounded-xl border border-surface-border divide-y divide-surface-border overflow-hidden">
            {record.details.map((d, idx) => (
              <li
                key={d.id ?? `${d.exerciseId}-${idx}`}
                className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 bg-surface-hover/20"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <CategoryIcon category={d.exerciseCategory || ''} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-text truncate">
                      {d.exerciseName || `动作 #${d.exerciseId}`}
                    </p>
                    {d.exerciseCategory && (
                      <p className="text-xs text-text-dim">{d.exerciseCategory}</p>
                    )}
                    {d.notes && <p className="text-xs text-text-muted mt-1">{d.notes}</p>}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted shrink-0">
                  <span>
                    <strong className="text-text">{d.setNumber}</strong> 组 ×{' '}
                    <strong className="text-text">{d.reps}</strong> 次
                  </span>
                  {d.weight > 0 && <span>{d.weight} kg</span>}
                  <span className="text-text-dim">小计 {d.setNumber * d.reps} 次</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState icon={<Dumbbell size={40} />} title="暂无动作明细" description="该记录未添加训练动作" />
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
        </div>
      </div>
    </Dialog>
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
  const [trainDate, setTrainDate] = useState(record?.trainDate || appliedPlan ? todayStr() : (record?.trainDate || todayStr()));
  const [duration, setDuration] = useState(record?.duration || 60);
  const [difficulty, setDifficulty] = useState(record?.difficulty || 2);
  const [notes, setNotes] = useState(record?.notes || '');
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState<number | null>(null);
  const [selectedPlanDay, setSelectedPlanDay] = useState<number>(1);

  const planDayGroups = useMemo(
    () => (appliedPlan?.details?.length ? groupPlanDetailsByDay(appliedPlan.details) : []),
    [appliedPlan]
  );

  const activePlanDetails = useMemo(() => {
    if (!appliedPlan?.details?.length) return null;
    const selected = planDayGroups.find(([day]) => day === selectedPlanDay)?.[1] ?? [];
    return selected.length ? selected : planDayGroups[0]?.[1] ?? [];
  }, [appliedPlan, planDayGroups, selectedPlanDay]);

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
      const source = activePlanDetails?.length ? activePlanDetails : planDayGroups[0]?.[1] ?? [];
      return source.map((d) => ({
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

  const initialDetails = buildInitialDetails();
  const [details, setDetails] = useState<TrainingRecordDetail[]>(initialDetails);
  const [detailInputs, setDetailInputs] = useState<TrainingDetailInputRow[]>(() =>
    initialDetails.map(trainingDetailToInputs)
  );
  const [detailErrors, setDetailErrors] = useState<Record<number, TrainingDetailErrors>>({});

  useEffect(() => {
    if (!appliedPlan?.details?.length) return;
    const firstDay = planDayGroups[0]?.[0] ?? 1;
    setSelectedPlanDay(firstDay);
  }, [appliedPlan, planDayGroups]);

  useEffect(() => {
    if (!appliedPlan?.details?.length || record) return;
    const sourceDetails = activePlanDetails?.length ? activePlanDetails : planDayGroups[0]?.[1] ?? [];
    if (!sourceDetails.length) return;
    const mappedDetails = sourceDetails.map((d) => ({
      setNumber: d.sets,
      reps: d.reps,
      weight: d.weight ?? 0,
      exerciseId: d.exerciseId,
      exerciseName: d.exerciseName || '',
      exerciseCategory: d.exerciseCategory || '',
      sortOrder: d.sortOrder ?? 0,
    }));
    setDetails(mappedDetails);
    setDetailInputs(mappedDetails.map(trainingDetailToInputs));
    setDetailErrors({});
  }, [activePlanDetails, appliedPlan, planDayGroups, record]);

  const handleAddRow = () => {
    setDetails([...details, { setNumber: 3, reps: 12, weight: 0, exerciseId: undefined, exerciseName: '', exerciseCategory: '' }]);
    setDetailInputs([...detailInputs, { setNumber: '3', reps: '12', weight: '' }]);
    setDetailErrors({});
  };

  const handleRemoveRow = (index: number) => {
    setDetails(details.filter((_, i) => i !== index));
    setDetailInputs(detailInputs.filter((_, i) => i !== index));
    setDetailErrors((prev) => {
      const next: Record<number, TrainingDetailErrors> = {};
      Object.entries(prev).forEach(([key, val]) => {
        const i = Number(key);
        if (i < index) next[i] = val;
        else if (i > index) next[i - 1] = val;
      });
      return next;
    });
  };

  const handleDetailChange = (index: number, field: keyof TrainingRecordDetail, value: unknown) => {
    setDetails(details.map((d, i) => (i === index ? { ...d, [field]: value } : d)));
  };

  const handleNumericInputChange = (index: number, field: TrainingNumericField, raw: string) => {
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

  const handleNumericBlur = (index: number, field: TrainingNumericField) => {
    const value = detailInputs[index]?.[field] ?? '';
    const err = validateDetailNumericField(field, value, { allowPartial: false });
    setDetailErrors((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: err },
    }));
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
    const { valid, errors } = validateDetailNumericRows(detailInputs, TRAINING_NUMERIC_FIELDS);
    setDetailErrors(errors);
    if (!valid) {
      toast.error('请修正动作明细中的数字输入');
      return;
    }
    const syncedDetails = syncTrainingDetailsFromInputs(details, detailInputs);
    const data: TrainingRecord = {
      trainDate,
      duration,
      difficulty,
      notes,
      details: syncedDetails.map((d, i) => ({ ...d, sortOrder: i + 1 })),
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
          <div className="space-y-3 rounded-xl border border-primary/20 bg-primary/10 px-4 py-4 text-sm text-primary-light">
            <div className="flex items-center gap-2">
              <Dumbbell size={16} />
              已从计划「{appliedPlan.title}」加载训练模板
            </div>
            {planDayGroups.length > 0 && (
              <>
                <div className="flex flex-wrap gap-2">
                  {planDayGroups.map(([day]) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedPlanDay(day)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                        selectedPlanDay === day
                          ? 'bg-primary text-white'
                          : 'bg-background/70 text-text-muted hover:text-text border border-surface-border'
                      }`}
                    >
                      训练日 {day}
                    </button>
                  ))}
                </div>
                <div className="rounded-lg bg-background/60 border border-surface-border p-3 text-xs text-text-muted">
                  当前展示：训练日 {selectedPlanDay} 的动作模板
                </div>
              </>
            )}
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
                <NumericFieldInput
                  label="组数"
                  field="setNumber"
                  value={detailInputs[index]?.setNumber ?? ''}
                  error={detailErrors[index]?.setNumber}
                  onChange={(v) => handleNumericInputChange(index, 'setNumber', v)}
                  onBlur={() => handleNumericBlur(index, 'setNumber')}
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
