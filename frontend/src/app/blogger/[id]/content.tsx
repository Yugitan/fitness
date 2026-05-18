'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { get } from '@/lib/api';
import type { Blogger, BloggerPlan } from '@/types';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/shared/Skeleton';
import { ArrowLeft, Users, Star, ExternalLink, Calendar, Video } from 'lucide-react';

export function BloggerDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: blogger, isLoading: blLoading } = useQuery({
    queryKey: ['blogger', id],
    queryFn: () => get<Blogger>(`/blogger/api/${id}`),
    enabled: !!id,
  });

  const { data: plans } = useQuery({
    queryKey: ['blogger-plans', id],
    queryFn: () => get<BloggerPlan[]>(`/blogger/api/${id}/plans`),
    enabled: !!id,
  });

  if (blLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-1/2" />
        <div className="flex gap-4">
          <Skeleton className="h-20 w-20 rounded-full" />
          <Skeleton className="h-20 flex-1" />
        </div>
      </div>
    );
  }

  if (!blogger) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl text-text mb-4">博主不存在</h2>
        <Link href="/blogger/"><Button variant="outline">返回博主列表</Button></Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/blogger/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text mb-6">
        <ArrowLeft size={14} /> 返回博主列表
      </Link>

      <div className="flex flex-col sm:flex-row items-start gap-6 mb-10">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-3xl font-bold text-background flex-shrink-0">
          {(blogger.nickname || 'B')[0]}
        </div>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display text-3xl text-text">{blogger.nickname}</h1>
            {blogger.isRecommended === 1 && (
              <Badge variant="accent" className="gap-1"><Star size={12} /> 推荐博主</Badge>
            )}
          </div>
          <p className="text-text-muted mb-3">{blogger.bio || '暂无简介'}</p>
          <div className="flex flex-wrap gap-4 text-sm text-text-muted">
            {blogger.followerCount != null && (
              <span className="flex items-center gap-1"><Users size={14} /> {blogger.followerCount.toLocaleString()} 关注</span>
            )}
            {blogger.sourcePlatform && <span>平台：{blogger.sourcePlatform}</span>}
            {blogger.platformUrl && (
              <a href={blogger.platformUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary-light hover:text-primary">
                查看主页 <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      </div>

      <h2 className="font-display text-2xl text-text mb-6">训练计划</h2>
      {plans && plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan, i) => (
            <Link key={plan.id} href={`/blogger/plan/${plan.id}/`}>
              <Card className="h-full" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="group-hover:text-primary-light transition-colors">{plan.title}</CardTitle>
                  {plan.videoUrl && <Video size={16} className="text-text-dim" />}
                </div>
                <CardDescription className="line-clamp-2">{plan.summary || '暂无简介'}</CardDescription>
                <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-surface-border">
                  {plan.targetAudience && <Badge variant="muted">{plan.targetAudience}</Badge>}
                  {plan.targetBodyPart && <Badge variant="muted">{plan.targetBodyPart}</Badge>}
                  {plan.trainDays && <Badge variant="muted"><Calendar size={10} className="mr-1" />{plan.trainDays}天</Badge>}
                  {plan.isOnline === 1 ? <Badge variant="success">已上线</Badge> : <Badge variant="warning">待上线</Badge>}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-text-muted text-center py-12">暂无训练计划</p>
      )}
    </div>
  );
}
