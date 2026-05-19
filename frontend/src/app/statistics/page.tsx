'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api';
import type { PersonalStats, MonthlyTrend, ExerciseFrequency } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/shared/Skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { AuthGuard } from '@/components/shared/AuthGuard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Dumbbell,
  Zap,
  Activity,
} from 'lucide-react';

const CHART_COLORS = ['#7d9b76', '#c9a96e', '#e0556a', '#60a5fa', '#a78bfa', '#fb923c'];

type FrequencyChartItem = ExerciseFrequency & { fill: string };

function formatMonthLabel(month: string): string {
  const match = month.match(/^(\d{4})-(\d{1,2})$/);
  if (match) return `${parseInt(match[2], 10)}月`;
  return month;
}

function normalizeTrend(rows: MonthlyTrend[] | undefined): MonthlyTrend[] {
  if (!rows?.length) return [];
  return rows.map((row) => ({
    month: formatMonthLabel(String(row.month)),
    workouts: Number(row.workouts) || 0,
    sets: Number(row.sets) || 0,
    reps: Number(row.reps) || 0,
  }));
}

function normalizeFrequency(rows: ExerciseFrequency[] | undefined): FrequencyChartItem[] {
  if (!rows?.length) return [];
  return rows.map((row, i) => ({
    name: String(row.name),
    count: Number(row.count) || 0,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));
}

function PieFrequencyTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const item = payload[0].payload as FrequencyChartItem;
  return (
    <div
      className="px-3 py-2 rounded-xl text-sm font-medium shadow-lg"
      style={{ backgroundColor: '#ffffff', color: '#1a1a1a', border: '1px solid #e5e5e5' }}
    >
      <p>{item.name}</p>
      <p className="opacity-70">{item.count} 组</p>
    </div>
  );
}

const tooltipDarkStyle = {
  backgroundColor: '#1a1a1a',
  border: '1px solid #2a2a2a',
  borderRadius: '12px',
  color: '#f5f5f0',
};

export default function StatisticsPage() {
  const { isLoggedIn } = useAuth();
  const [pieHoverIndex, setPieHoverIndex] = useState<number | undefined>(undefined);

  const { data: personal, isLoading: personalLoading } = useQuery({
    queryKey: ['stats-personal'],
    queryFn: () => get<PersonalStats>('/statistics/api/personal'),
    enabled: isLoggedIn,
  });

  const { data: trend, isLoading: trendLoading } = useQuery({
    queryKey: ['stats-trend'],
    queryFn: () => get<MonthlyTrend[]>('/statistics/api/monthly-trend'),
    enabled: isLoggedIn,
  });

  const { data: frequency, isLoading: frequencyLoading } = useQuery({
    queryKey: ['stats-frequency'],
    queryFn: () => get<ExerciseFrequency[]>('/statistics/api/exercise-frequency'),
    enabled: isLoggedIn,
  });

  const isLoading = personalLoading || trendLoading || frequencyLoading;

  const trendData = useMemo(() => normalizeTrend(trend), [trend]);
  const frequencyData = useMemo(() => normalizeFrequency(frequency), [frequency]);

  const totalWorkouts = Number(personal?.totalWorkouts) || 0;
  const totalSets = Number(personal?.totalSets) || 0;
  const avgDuration = Number(personal?.avgDuration) || 0;

  return (
    <AuthGuard>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="font-display text-4xl text-text mb-2">数据统计</h1>
        <p className="text-text-muted">训练数据可视化，追踪你的每一次进步</p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-80 rounded-xl" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: '训练次数', value: totalWorkouts.toString(), icon: Activity, color: 'text-primary-light', bg: 'bg-primary/10' },
              { label: '总组数', value: totalSets.toString(), icon: BarChart3, color: 'text-accent-light', bg: 'bg-accent/10' },
              { label: '动作种类', value: `${frequencyData.length}种`, icon: Dumbbell, color: 'text-cat-chest', bg: 'bg-cat-chest/10' },
              { label: '平均时长', value: avgDuration > 0 ? `${Math.round(avgDuration)}分` : '--', icon: Zap, color: 'text-cat-back', bg: 'bg-cat-back/10' },
            ].map((stat) => (
              <Card key={stat.label} hover={false} className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon size={22} className={stat.color} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text">{stat.value}</p>
                  <p className="text-xs text-text-muted">{stat.label}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card hover={false}>
              <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-primary" />
                月度训练趋势
              </h3>
              {trendData.length === 0 ? (
                <EmptyState title="暂无趋势数据" description="完成训练后，这里会展示近 6 个月的训练次数" />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="workoutGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7d9b76" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#7d9b76" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipDarkStyle} />
                    <Area type="monotone" dataKey="workouts" stroke="#7d9b76" strokeWidth={2} fillOpacity={1} fill="url(#workoutGradient)" name="训练次数" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </Card>

            <Card hover={false}>
              <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                <Dumbbell size={18} className="text-accent" />
                动作训练频率
              </h3>
              {frequencyData.length === 0 ? (
                <EmptyState title="暂无动作统计" description="在训练记录中添加动作组数后，将按组数统计各动作频率" />
              ) : (
                <>
                  <div className="stat-pie-chart">
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={frequencyData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="count"
                          nameKey="name"
                          activeIndex={pieHoverIndex}
                          onMouseEnter={(_, index) => setPieHoverIndex(index)}
                          onMouseLeave={() => setPieHoverIndex(undefined)}
                          onClick={(_, __, event) => {
                            event?.stopPropagation();
                            event?.preventDefault();
                          }}
                          style={{ cursor: 'default', outline: 'none' }}
                          isAnimationActive={false}
                        >
                          {frequencyData.map((entry) => (
                            <Cell key={entry.name} fill={entry.fill} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip
                          content={<PieFrequencyTooltip />}
                          wrapperStyle={{ pointerEvents: 'none', background: 'transparent', border: 'none' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <style>{`
                    .stat-pie-chart .recharts-pie-sector { cursor: default !important; }
                    .stat-pie-chart .recharts-active-shape { cursor: default !important; }
                    .stat-pie-chart .recharts-pie-sector:focus { outline: none !important; }
                    .stat-pie-chart .recharts-pie-labels text { cursor: default !important; }
                  `}</style>
                  <div className="flex flex-wrap gap-3 justify-center mt-2">
                    {frequencyData.map((item) => (
                      <div key={item.name} className="flex items-center gap-1.5 text-xs text-text-muted">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                        {item.name}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>

            <Card hover={false} className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-cat-shoulder" />
                月度组数与次数
              </h3>
              {trendData.length === 0 ? (
                <EmptyState title="暂无月度数据" description="有训练记录后，将展示每月总组数与总次数" />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={trendData} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                    <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} allowDecimals={false} />
                    <Tooltip contentStyle={tooltipDarkStyle} />
                    <Bar dataKey="sets" fill="#7d9b76" radius={[4, 4, 0, 0]} name="总组数" />
                    <Bar dataKey="reps" fill="#c9a96e" radius={[4, 4, 0, 0]} name="总次数" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
    </AuthGuard>
  );
}
