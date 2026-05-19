'use client';

import { useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const MAX_PAGE_BUTTONS = 5;

/** 前台 / 后台动作库 */
export const DEFAULT_PAGE_SIZE = 12;
/** 前台训练计划 */
export const PLAN_PAGE_SIZE = 9;
/** 前台训练记录 */
export const TRAINING_PAGE_SIZE = 12;

interface ListPaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export function ListPagination({
  currentPage,
  totalPages,
  total,
  onPageChange,
  itemLabel = '条',
}: ListPaginationProps) {
  const pageNumbers = useMemo(() => {
    if (totalPages <= MAX_PAGE_BUTTONS) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    let start = currentPage - Math.floor(MAX_PAGE_BUTTONS / 2);
    let end = start + MAX_PAGE_BUTTONS - 1;
    if (start < 1) {
      start = 1;
      end = MAX_PAGE_BUTTONS;
    }
    if (end > totalPages) {
      end = totalPages;
      start = totalPages - MAX_PAGE_BUTTONS + 1;
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  if (total <= 0) return null;

  return (
    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-surface-border pt-6">
      <p className="text-sm text-text-muted">
        第 {currentPage} / {totalPages} 页，共 {total} {itemLabel}
      </p>
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(1)}
            aria-label="首页"
          >
            <ChevronsLeft size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="上一页"
          >
            <ChevronLeft size={16} />
          </Button>
          {pageNumbers.map((n) => (
            <Button
              key={n}
              variant={n === currentPage ? 'default' : 'outline'}
              size="sm"
              className="min-w-9"
              onClick={() => onPageChange(n)}
              aria-label={`第 ${n} 页`}
              aria-current={n === currentPage ? 'page' : undefined}
            >
              {n}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="下一页"
          >
            <ChevronRight size={16} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(totalPages)}
            aria-label="末页"
          >
            <ChevronsRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
