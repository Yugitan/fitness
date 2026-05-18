import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, parseISO, isValid, differenceInDays, subDays } from 'date-fns';

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
