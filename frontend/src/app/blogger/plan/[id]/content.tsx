'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { get } from '@/lib/api';
import type { BloggerPlan } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/shared/Skeleton';
import { getDifficultyLabel, getDifficultyColor } from '@/lib/utils';
import { ArrowLeft, Calendar, Target, Video, Users, Dumbbell, Clock, ExternalLink } from 'lucide-react';

export function BloggerPlanDetailContent({ id }: { id: string }) {

  const { data: plan, isLoading } = useQuery({
    queryKey: ['blogger-plan', id],
    queryFn: () => get<BloggerPlan>(`/blogger/api/plan/${id}`),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl text-text mb-4">计划不存在</h2>
        <Link href="/blogger/"><Button variant="outline">返回博主列表</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/blogger/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text mb-6">
        <ArrowLeft size={14} /> 返回博主列表
      </Link>

      <div className="mb-8">
        <h1 className="font-display text-4xl text-text mb-3">{plan.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          {plan.difficultyLevel && (
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getDifficultyColor(plan.difficultyLevel)}`}>
              {getDifficultyLabel(plan.difficultyLevel)}
            </span>
          )}
          {plan.targetAudience && <Badge variant="muted">{plan.targetAudience}</Badge>}
          {plan.targetBodyPart && <Badge variant="muted"><Target size={12} className="mr-1" />{plan.targetBodyPart}</Badge>}
          {plan.trainDays && <Badge variant="muted"><Calendar size={12} className="mr-1" />{plan.trainDays} 天训练</Badge>}
          {plan.isOnline === 1 ? <Badge variant="success">已上线</Badge> : <Badge variant="warning">待上线</Badge>}
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-text-muted mb-6">
          {plan.viewCount != null && <span className="flex items-center gap-1"><Users size={14} /> {plan.viewCount} 浏览</span>}
          {plan.collectCount != null && <span>{plan.collectCount} 收藏</span>}
          {plan.likeCount != null && <span>{plan.likeCount} 点赞</span>}
        </div>
      </div>

      {plan.summary && (
        <Card hover={false} className="mb-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-text mb-3">
            <Dumbbell size={18} className="text-primary" /> 计划概述
          </h3>
          <p className="text-text-muted text-sm leading-relaxed">{plan.summary}</p>
        </Card>
      )}

      {plan.detailArrangement && (
        <Card hover={false} className="mb-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-text mb-3">
            <Clock size={18} className="text-accent" /> 详细安排
          </h3>
          <div className="text-text-muted text-sm leading-relaxed whitespace-pre-wrap">{plan.detailArrangement}</div>
        </Card>
      )}

      {plan.videoUrl && (
        <Card hover={false} className="mb-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-text mb-3">
            <Video size={18} className="text-cat-chest" /> 教学视频
          </h3>
          <a href={plan.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary-light hover:text-primary">
            观看视频 <ExternalLink size={12} />
          </a>
        </Card>
      )}
    </div>
  );
}
