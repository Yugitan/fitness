'use client';

import { useQuery } from '@tanstack/react-query';
import { get } from '@/lib/api';
import type { PersonalStats, MonthlyTrend, ExerciseFrequency } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  Dumbbell,
  Zap,
  Activity,
  Lock,
} from 'lucide-react';
import Link from 'next/link';

const CHART_COLORS = ['#7d9b76', '#c9a96e', '#e0556a', '#60a5fa', '#a78bfa', '#fb923c'];

export default function StatisticsPage() {
  const { isLoggedIn } = useAuth();

  const { data: personal, isLoading } = useQuery({
    queryKey: ['stats-personal'],
    queryFn: () => get<PersonalStats>('/statistics/api/personal'),
    enabled: isLoggedIn,
  });

  const { data: trend } = useQuery({
    queryKey: ['stats-trend'],
    queryFn: () => get<MonthlyTrend[]>('/statistics/api/monthly-trend'),
    enabled: isLoggedIn,
  });

  const { data: frequency } = useQuery({
    queryKey: ['stats-frequency'],
    queryFn: () => get<ExerciseFrequency[]>('/statistics/api/exercise-frequency'),
    enabled: isLoggedIn,
  });

  // Build mock data since backend APIs are stubs
  const mockTrend: MonthlyTrend[] = [
    { month: '1月', workouts: 12, sets: 96, reps: 1152 },
    { month: '2月', workouts: 15, sets: 120, reps: 1440 },
    { month: '3月', workouts: 18, sets: 144, reps: 1728 },
    { month: '4月', workouts: 20, sets: 160, reps: 1920 },
    { month: '5月', workouts: 22, sets: 176, reps: 2112 },
    { month: '6月', workouts: 19, sets: 152, reps: 1824 },
  ];

  const mockFrequency: ExerciseFrequency[] = [
    { name: '卧推', count: 48 },
    { name: '哑铃飞鸟', count: 36 },
    { name: '深蹲', count: 42 },
    { name: '硬拉', count: 30 },
    { name: '引体向上', count: 28 },
    { name: '弯举', count: 24 },
  ];

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
          {/* Stats cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: '训练次数', value: '87', icon: Activity, color: 'text-primary-light', bg: 'bg-primary/10' },
              { label: '总组数', value: '848', icon: BarChart3, color: 'text-accent-light', bg: 'bg-accent/10' },
              { label: '动作频率', value: '6种', icon: Dumbbell, color: 'text-cat-chest', bg: 'bg-cat-chest/10' },
              { label: '连续天数', value: '5天', icon: Zap, color: 'text-cat-back', bg: 'bg-cat-back/10' },
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

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Monthly trend */}
            <Card hover={false}>
              <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-primary" />
                月度训练趋势
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={mockTrend}>
                  <defs>
                    <linearGradient id="workoutGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7d9b76" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7d9b76" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                      borderRadius: '12px',
                      color: '#f5f5f0',
                    }}
                  />
                  <Area type="monotone" dataKey="workouts" stroke="#7d9b76" strokeWidth={2} fillOpacity={1} fill="url(#workoutGradient)" name="训练次数" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Exercise frequency (pie) */}
            <Card hover={false}>
              <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                <Dumbbell size={18} className="text-accent" />
                动作训练频率
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={mockFrequency}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="name"
                  >
                    {mockFrequency.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                      borderRadius: '12px',
                      color: '#f5f5f0',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                {mockFrequency.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-1.5 text-xs text-text-muted">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                    {item.name}
                  </div>
                ))}
              </div>
            </Card>

            {/* Sets & Reps Bar Chart */}
            <Card hover={false} className="lg:col-span-2">
              <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-cat-shoulder" />
                月度组数与次数
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={mockTrend} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #2a2a2a',
                      borderRadius: '12px',
                      color: '#f5f5f0',
                    }}
                  />
                  <Bar dataKey="sets" fill="#7d9b76" radius={[4, 4, 0, 0]} name="总组数" />
                  <Bar dataKey="reps" fill="#c9a96e" radius={[4, 4, 0, 0]} name="总次数" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>
      )}
    </div>
    </AuthGuard>
  );
}
