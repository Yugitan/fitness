'use client';

import { useState, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
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
import { Search, X, Dumbbell, Eye } from 'lucide-react';

function ExerciseContent() {
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams?.get('keyword') || '');
  const [category, setCategory] = useState(searchParams?.get('category') || '');
  const debouncedKeyword = useDebounce(keyword, 300);

  const { data: exercises, isLoading } = useQuery({
    queryKey: ['exercises', debouncedKeyword, category],
    queryFn: () => {
      const params: Record<string, string> = {};
      if (category) params.category = category;
      if (debouncedKeyword) params.keyword = debouncedKeyword;
      return get<Exercise[]>('/exercise/api/list', params);
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-text mb-2">健身动作库</h1>
        <p className="text-text-muted">浏览 26 个常用健身动作，覆盖 6 大训练分类</p>
      </div>

      <div className="glass rounded-xl p-4 mb-8 space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
          <Input
            placeholder="搜索动作名称..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="pl-10 pr-10"
          />
          {keyword && (
            <button
              onClick={() => setKeyword('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory('')}
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
              onClick={() => setCategory(cat === category ? '' : cat)}
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
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : exercises && exercises.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {exercises.map((ex, i) => (
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
      ) : (
        <EmptyState
          icon={<Dumbbell size={48} />}
          title="未找到匹配的动作"
          description="尝试更换搜索关键词或筛选条件"
          action={
            <Button variant="outline" onClick={() => { setKeyword(''); setCategory(''); }}>
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
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-text mb-2">健身动作库</h1>
          <p className="text-text-muted">浏览 26 个常用健身动作，覆盖 6 大训练分类</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    }>
      <ExerciseContent />
    </Suspense>
  );
}
