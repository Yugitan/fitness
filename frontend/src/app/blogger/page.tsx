'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { get } from '@/lib/api';
import type { Blogger } from '@/types';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/shared/Skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { AuthGuard } from '@/components/shared/AuthGuard';
import { Users, Star, ExternalLink } from 'lucide-react';

export default function BloggerListPage() {
  const { data: bloggers, isLoading } = useQuery({
    queryKey: ['bloggers'],
    queryFn: () => get<Blogger[]>('/blogger/api/list'),
  });

  return (
    <AuthGuard>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-text mb-2">博主专区</h1>
        <p className="text-text-muted">关注知名健身博主，获取专业训练计划</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : bloggers && bloggers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bloggers.map((b, i) => (
            <Link key={b.id} href={`/blogger/${b.id}/`}>
              <Card className="h-full animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-bold text-background flex-shrink-0">
                    {(b.nickname || 'B')[0]}
                  </div>
                  <div>
                    <CardTitle className="group-hover:text-primary-light transition-colors">{b.nickname}</CardTitle>
                    {b.sourcePlatform && (
                      <p className="text-xs text-text-dim mt-0.5">{b.sourcePlatform}</p>
                    )}
                  </div>
                </div>
                <CardDescription className="line-clamp-2">{b.bio || '暂无简介'}</CardDescription>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-surface-border">
                  {b.followerCount != null && (
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <Users size={12} /> {b.followerCount.toLocaleString()} 关注
                    </span>
                  )}
                  {b.isRecommended === 1 && (
                    <Badge variant="accent" className="gap-1">
                      <Star size={10} /> 推荐
                    </Badge>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Users size={48} />}
          title="暂无博主"
          description="博主专区即将上线，敬请期待"
        />
      )}
    </div>
    </AuthGuard>
  );
}
