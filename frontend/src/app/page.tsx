'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { get } from '@/lib/api';
import type { Exercise, Blogger } from '@/types';
import { EXERCISE_CATEGORIES, CATEGORY_COLORS } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card, CardTitle, CardDescription } from '@/components/ui/Card';
import { CategoryBadge } from '@/components/shared/CategoryBadge';
import { CardSkeleton } from '@/components/shared/Skeleton';
import { Dumbbell, TrendingUp, Trophy, Zap, ChevronRight, Play } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { isLoggedIn } = useAuth();

  const { data: exercises, isLoading: exLoading } = useQuery({
    queryKey: ['exercises'],
    queryFn: () => get<Exercise[]>('/exercise/api/list'),
    staleTime: 60000,
  });

  const { data: bloggers } = useQuery({
    queryKey: ['bloggers'],
    queryFn: () => get<Blogger[]>('/blogger/api/recommended'),
    staleTime: 60000,
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm mb-6 animate-fade-in">
              <Zap size={14} />
              全新运动主题 UI 升级
            </div>
            <h1 className="font-display text-5xl lg:text-7xl leading-[1.05] text-text mb-6 animate-slide-up">
              记录每一次
              <br />
              <span className="text-gradient">进步与突破</span>
            </h1>
            <p className="text-lg text-text-muted mb-8 max-w-lg animate-slide-up delay-100">
              科学的训练记录，可视化的数据追踪，让健身变得更专业、更高效。
            </p>
            <div className="flex flex-wrap gap-3 animate-slide-up delay-200">
              <Link href="/exercise/">
                <Button size="lg" className="gap-2">
                  <Dumbbell size={18} />
                  浏览动作库
                </Button>
              </Link>
              <Link href="/training/">
                <Button variant="outline" size="lg" className="gap-2">
                  <TrendingUp size={18} />
                  开始训练
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 animate-slide-up delay-300">
            {[
              { label: '健身动作', value: '26+', icon: Dumbbell, color: 'text-cat-chest' },
              { label: '训练分类', value: '6', icon: TrendingUp, color: 'text-cat-shoulder' },
              { label: '训练计划', value: '4+', icon: Trophy, color: 'text-accent-light' },
              { label: '专注记录', value: '100%', icon: Zap, color: 'text-cat-back' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-xl p-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-hover flex items-center justify-center">
                  <stat.icon size={20} className={stat.color} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text">{stat.value}</p>
                  <p className="text-xs text-text-muted">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl text-text mb-2">训练分类</h2>
            <p className="text-text-muted">六大肌肉群，科学系统训练</p>
          </div>
          <Link href="/exercise/" className="text-sm text-primary-light hover:text-primary flex items-center gap-1">
            查看全部 <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {EXERCISE_CATEGORIES.map((cat, i) => {
            const color = CATEGORY_COLORS[cat];
            return (
              <Link
                key={cat}
                href={`/exercise/?category=${encodeURIComponent(cat)}`}
                className="group glass rounded-xl p-5 text-center card-lift"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div
                  className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Dumbbell size={22} style={{ color }} />
                </div>
                <p className="text-sm font-medium text-text group-hover:text-primary-light transition-colors">
                  {cat}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Exercises */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-surface-border">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display text-3xl text-text mb-2">精选动作</h2>
            <p className="text-text-muted">最受欢迎的健身动作</p>
          </div>
        </div>

        {exLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {exercises?.slice(0, 8).map((ex, i) => (
              <Link key={ex.id} href={`/exercise/${ex.id}/`}>
                <Card className="h-full card-lift group" style={{ animationDelay: `${i * 80}ms` }}>
                  <CategoryBadge category={ex.category} className="mb-3" />
                  <CardTitle className="group-hover:text-primary-light transition-colors">{ex.name}</CardTitle>
                  <CardDescription className="line-clamp-2 mt-1">{ex.description}</CardDescription>
                  <div className="flex items-center gap-1 mt-3 text-xs text-text-dim">
                    <Play size={12} />
                    {ex.viewCount || 0} 次浏览
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-surface to-accent/20 border border-surface-border p-10 lg:p-16 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="relative">
            <Trophy size={48} className="text-accent mx-auto mb-6" />
            <h2 className="font-display text-3xl lg:text-4xl text-text mb-4">准备好开始你的健身之旅了吗？</h2>
            <p className="text-text-muted mb-8 max-w-md mx-auto">
              加入我们，记录每一次训练，见证每一点进步。
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {isLoggedIn ? (
                <>
                  <Link href="/training/">
                    <Button size="lg" variant="accent" className="w-full sm:w-auto gap-2">
                      继续训练
                    </Button>
                  </Link>
                  <Link href="/statistics/">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                      查看统计
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/register/">
                    <Button size="lg" variant="accent" className="w-full sm:w-auto gap-2">
                      立即注册
                    </Button>
                  </Link>
                  <Link href="/exercise/">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                      先看看
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
