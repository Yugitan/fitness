'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { get } from '@/lib/api';
import type { User, Exercise, Plan, TrainingRecord } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Users,
  Dumbbell,
  ClipboardList,
  Activity,
  TrendingUp,
  Settings,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AdminDashboard() {
  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => get<User[]>('/admin/api/user/list'),
  });

  const { data: exercises } = useQuery({
    queryKey: ['admin-exercises'],
    queryFn: () => get<Exercise[]>('/admin/api/exercise/list'),
  });

  const { data: plans } = useQuery({
    queryKey: ['admin-plans'],
    queryFn: () => get<Plan[]>('/admin/api/plan/list'),
  });

  const mockChart = [
    { month: '1月', 用户: 12, 记录: 45, 计划: 8 },
    { month: '2月', 用户: 18, 记录: 68, 计划: 12 },
    { month: '3月', 用户: 24, 记录: 92, 计划: 15 },
    { month: '4月', 用户: 31, 记录: 120, 计划: 18 },
    { month: '5月', 用户: 38, 记录: 145, 计划: 22 },
  ];

  const stats = [
    {
      label: '总用户数',
      value: users?.length ?? '--',
      icon: Users,
      color: 'text-primary-light',
      bg: 'bg-primary/10',
      href: '/admin/user/',
    },
    {
      label: '动作总数',
      value: exercises?.length ?? '--',
      icon: Dumbbell,
      color: 'text-accent-light',
      bg: 'bg-accent/10',
      href: '/admin/exercise/',
    },
    {
      label: '计划总数',
      value: plans?.length ?? '--',
      icon: ClipboardList,
      color: 'text-cat-chest',
      bg: 'bg-cat-chest/10',
      href: '/admin/plan/',
    },
    {
      label: '训练记录',
      value: '--',
      icon: Activity,
      color: 'text-success',
      bg: 'bg-success/10',
      href: '/admin/plan/',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-text mb-1">仪表盘</h1>
        <p className="text-text-muted text-sm">Fitness 管理后台总览</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card hover={true} className="flex items-center gap-4 h-full">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <stat.icon size={22} className={stat.color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-text">{stat.value}</p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Chart */}
      <Card hover={false}>
        <h3 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-primary" />
          数据趋势
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={mockChart}>
            <defs>
              <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7d9b76" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7d9b76" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="recordsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c9a96e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#c9a96e" stopOpacity={0} />
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
            <Area type="monotone" dataKey="记录" stroke="#7d9b76" fillOpacity={1} fill="url(#usersGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="用户" stroke="#c9a96e" fillOpacity={1} fill="url(#recordsGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link href="/admin/user/"><Button variant="outline" className="w-full gap-2"><Users size={16} />用户管理</Button></Link>
        <Link href="/admin/exercise/"><Button variant="outline" className="w-full gap-2"><Dumbbell size={16} />动作管理</Button></Link>
        <Link href="/admin/plan/"><Button variant="outline" className="w-full gap-2"><ClipboardList size={16} />计划管理</Button></Link>
        <Link href="/admin/config/"><Button variant="outline" className="w-full gap-2"><Settings size={16} />系统配置</Button></Link>
      </div>
    </div>
  );
}
