import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isValid, differenceInDays, subDays } from 'date-fns';
import type { TrainingRecordDetail } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string | undefined | null, fmt = 'yyyy-MM-dd'): string {
  if (!dateStr) return '';
  try {
    const d = parseISO(dateStr);
    if (!isValid(d)) return dateStr;
    return format(d, fmt);
  } catch {
    return dateStr;
  }
}

export function formatDateCN(dateStr: string | undefined | null): string {
  return formatDate(dateStr, 'yyyy年MM月dd日');
}

export function todayStr(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export function daysAgo(days: number): string {
  return format(subDays(new Date(), days), 'yyyy-MM-dd');
}

export function getDifficultyLabel(level: number | undefined): string {
  switch (level) {
    case 1:
      return '初级';
    case 2:
      return '中级';
    case 3:
      return '高级';
    case 4:
      return 'Pro';
    default:
      return '未设置';
  }
}

export function getDifficultyColor(level: number | undefined): string {
  switch (level) {
    case 1:
      return 'bg-success/20 text-success';
    case 2:
      return 'bg-warning/20 text-warning';
    case 3:
      return 'bg-danger/20 text-danger';
    case 4:
      return 'bg-cat-shoulder/20 text-cat-shoulder';
    default:
      return 'bg-surface-hover text-text-muted';
  }
}

export function getRoleLabel(role: number): string {
  switch (role) {
    case 2:
      return '超级管理员';
    case 1:
      return '管理员';
    default:
      return '普通用户';
  }
}

export function getStatusLabel(status: number): string {
  return status === 1 ? '正常' : '已禁用';
}

/** 按动作明细汇总：总组数 = Σ组数，总次数 = Σ(组数×每組次数) */
export function computeTrainingStats(details?: TrainingRecordDetail[]) {
  if (!details?.length) {
    return { exerciseCount: 0, totalSets: 0, totalReps: 0 };
  }
  let totalSets = 0;
  let totalReps = 0;
  for (const d of details) {
    const sets = Number(d.setNumber) || 0;
    const reps = Number(d.reps) || 0;
    totalSets += sets;
    totalReps += sets * reps;
  }
  return { exerciseCount: details.length, totalSets, totalReps };
}
