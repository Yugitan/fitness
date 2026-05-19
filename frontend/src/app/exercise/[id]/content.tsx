'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { get } from '@/lib/api';
import type { Exercise } from '@/types';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/shared/Skeleton';
import { ArrowLeft, Lightbulb, AlertTriangle, Eye, ChevronRight } from 'lucide-react';

export function ExerciseDetailContent({ id }: { id: string }) {

  const { data: exercise, isLoading } = useQuery({
    queryKey: ['exercise', id],
    queryFn: () => get<Exercise>(`/exercise/api/${id}`),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-64 rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl text-text mb-4">动作不存在</h2>
        <Link href="/exercise/">
          <Button variant="outline">
            <ArrowLeft size={16} className="mr-2" />
            返回动作库
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link href="/exercise/" className="hover:text-text transition-colors">动作库</Link>
        <ChevronRight size={14} />
        <span className="text-text">{exercise.name}</span>
      </nav>

      <div className="mb-8 animate-slide-up">
        <div className="flex items-center gap-3 mb-3">
          <CategoryBadge category={exercise.category} />
          <span className="text-xs text-text-dim flex items-center gap-1">
            <Eye size={12} />
            {exercise.viewCount || 0} 次浏览
          </span>
        </div>
        <h1 className="font-display text-4xl lg:text-5xl text-text mb-3">{exercise.name}</h1>
        {exercise.description && (
          <p className="text-lg text-text-muted">{exercise.description}</p>
        )}
      </div>

      {exercise.videoPath && (
        <Card className="mb-8 p-0 overflow-hidden animate-slide-up delay-100">
          <div className="aspect-video bg-black flex items-center justify-center">
            <video controls className="w-full h-full" preload="metadata">
              <source src={exercise.videoPath} type="video/mp4" />
            </video>
          </div>
        </Card>
      )}

      <div className="space-y-6 animate-slide-up delay-200">
        {exercise.keyPoints && (
          <Card hover={false}>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-text mb-4">
              <Lightbulb size={20} className="text-accent" />
              训练要点
            </h3>
            <div className="space-y-2">
              {exercise.keyPoints.split('\n').filter(Boolean).map((point, i) => (
                <div key={i} className="flex items-start gap-3 text-text-muted">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-sm leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {exercise.precautions && (
          <Card hover={false}>
            <h3 className="flex items-center gap-2 text-lg font-semibold text-text mb-4">
              <AlertTriangle size={20} className="text-warning" />
              注意事项
            </h3>
            <div className="space-y-2">
              {exercise.precautions.split('\n').filter(Boolean).map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-text-muted">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-warning flex-shrink-0" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      <div className="mt-10">
        <Link href="/exercise/">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft size={16} />
            返回动作库
          </Button>
        </Link>
      </div>
    </div>
  );
}
