'use client';

import { useState, useEffect, useMemo } from 'react';

export const ADMIN_PAGE_SIZE = 10;

export function useClientPagination<T>(
  items: T[] | undefined,
  resetDeps: unknown[] = [],
  pageSize = ADMIN_PAGE_SIZE,
) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, resetDeps);

  const total = items?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pagedItems = useMemo(() => {
    if (!items?.length) return [];
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return {
    currentPage,
    total,
    totalPages,
    pagedItems,
    handlePageChange,
  };
}
