'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { get } from '@/lib/api';
import type { Exercise } from '@/types';
import { EXERCISE_CATEGORIES, CATEGORY_COLORS } from '@/types';
import { useDebounce } from '@/hooks/useDebounce';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { CardSkeleton } from '@/components/shared/Skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { ListPagination, DEFAULT_PAGE_SIZE } from '@/components/shared/ListPagination';
import { Search, X, Dumbbell, Eye } from 'lucide-react';

function buildExerciseQuery(category: string, keyword: string, page: number) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (keyword) params.set('keyword', keyword);
  if (page > 1) params.set('page', String(page));
  const q = params.toString();
  return q ? `/exercise/?${q}` : '/exercise/';
}

function ExerciseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams?.get('keyword') || '');
  const [category, setCategory] = useState(searchParams?.get('category') || '');
  const [page, setPage] = useState(() => {
    const p = Number(searchParams?.get('page') || '1');
    return Number.isFinite(p) && p > 0 ? p : 1;
  });
  const debouncedKeyword = useDebounce(keyword, 300);

  // 从首页分类入口等 URL 变化时同步筛选条件
  useEffect(() => {
    const urlCategory = searchParams?.get('category') || '';
    const urlKeyword = searchParams?.get('keyword') || '';
    const urlPage = Number(searchParams?.get('page') || '1');
    setCategory(urlCategory);
    setKeyword(urlKeyword);
    setPage(Number.isFinite(urlPage) && urlPage > 0 ? urlPage : 1);
  }, [searchParams.toString()]);

  const updateUrl = (next: { category?: string; keyword?: string; page?: number }) => {
    const c = next.category !== undefined ? next.category : category;
    const k = next.keyword !== undefined ? next.keyword : debouncedKeyword;
    const p = next.page !== undefined ? next.page : page;
    router.replace(buildExerciseQuery(c, k, p), { scroll: false });
  };

  const handleCategoryChange = (cat: string) => {
    const next = cat === category ? '' : cat;
    setCategory(next);
    setPage(1);
    updateUrl({ category: next, page: 1 });
  };

  const handleKeywordChange = (value: string) => {
    setKeyword(value);
  };

  useEffect(() => {
    setPage(1);
    updateUrl({ keyword: debouncedKeyword, page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword]);

  const { data: exercises, isLoading } = useQuery({
    queryKey: ['exercises', debouncedKeyword, category],
    queryFn: () => {
      const query: Record<string, string> = {};
      if (category) query.category = category;
      if (debouncedKeyword) query.keyword = debouncedKeyword;
      return get<Exercise[]>('/exercise/api/list', query);
    },
  });

  const total = exercises?.length ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
      updateUrl({ page: totalPages });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages, page]);

  const pagedExercises = useMemo(() => {
    if (!exercises?.length) return [];
    const start = (currentPage - 1) * DEFAULT_PAGE_SIZE;
    return exercises.slice(start, start + DEFAULT_PAGE_SIZE);
  }, [exercises, currentPage]);

  const subtitle = useMemo(() => {
    if (isLoading) return '加载中...';
    if (total <= 0) {
      return category
        ? `「${category}」分类下暂无动作`
        : '浏览常用健身动作，覆盖 6 大训练分类';
    }
    return category
      ? `「${category}」分类共 ${total} 个动作`
      : `共 ${total} 个动作，覆盖 6 大训练分类`;
  }, [isLoading, total, category]);

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
    updateUrl({ page: nextPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-text mb-2">
          {category ? `${category} · 动作库` : '健身动作库'}
        </h1>
        <p className="text-text-muted">{subtitle}</p>
      </div>

      <div className="glass rounded-xl p-4 mb-8 space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
          <Input
            placeholder="搜索动作名称..."
            value={keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            className="pl-10 pr-10"
          />
          {keyword && (
            <button
              onClick={() => handleKeywordChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              !category
                ? 'bg-primary text-white'
                : 'bg-surface-hover text-text-muted hover:text-text border border-surface-border'
            }`}
          >
            全部
          </button>
          {EXERCISE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border"
              style={{
                backgroundColor: category === cat ? `${CATEGORY_COLORS[cat]}22` : 'transparent',
                borderColor: category === cat ? CATEGORY_COLORS[cat] : 'hsl(var(--surface-border))',
                color: category === cat ? CATEGORY_COLORS[cat] : undefined,
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: DEFAULT_PAGE_SIZE }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : exercises && exercises.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pagedExercises.map((ex, i) => (
              <Link key={ex.id} href={`/exercise/${ex.id}/`}>
                <Card className="h-full group animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                  <div className="flex items-start justify-between mb-3">
                    <CategoryBadge category={ex.category} />
                    <div className="flex items-center gap-1 text-xs text-text-dim">
                      <Eye size={12} />
                      {ex.viewCount || 0}
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-primary-light transition-colors">{ex.name}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">{ex.description || '暂无描述'}</CardDescription>
                  <div className="mt-4 pt-3 border-t border-surface-border">
                    <div className="flex items-center gap-1 text-xs text-primary-light">
                      <Dumbbell size={12} />
                      查看详情
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <ListPagination
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
            onPageChange={handlePageChange}
            itemLabel="个动作"
          />
        </>
      ) : (
        <EmptyState
          icon={<Dumbbell size={48} />}
          title={category ? `「${category}」下未找到动作` : '未找到匹配的动作'}
          description="尝试更换搜索关键词或筛选条件"
          action={
            <Button
              variant="outline"
              onClick={() => {
                setKeyword('');
                setCategory('');
                setPage(1);
                router.replace('/exercise/', { scroll: false });
              }}
            >
              清除筛选
            </Button>
          }
        />
      )}
    </div>
  );
}

export default function ExerciseListPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-display text-4xl text-text mb-2">健身动作库</h1>
            <p className="text-text-muted">浏览常用健身动作，覆盖 6 大训练分类</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ExerciseContent />
    </Suspense>
  );
}
