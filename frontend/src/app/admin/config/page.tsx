'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, put } from '@/lib/api';
import type { SystemConfig } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { EmptyState } from '@/components/shared/EmptyState';
import { toast } from 'sonner';
import { Settings, Save, Search, X } from 'lucide-react';

export default function AdminConfigPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const { data: configs } = useQuery({
    queryKey: ['admin-configs'],
    queryFn: () => get<SystemConfig[]>('/admin/api/config/list'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) =>
      put(`/admin/api/config/update?key=${encodeURIComponent(key)}&value=${encodeURIComponent(value)}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-configs'] });
      setEditingKey(null);
      toast.success('配置已保存');
    },
  });

  const filtered = configs?.filter((c) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return c.configKey?.toLowerCase().includes(s) || (c.configDesc || '').toLowerCase().includes(s);
  });

  const startEdit = (config: SystemConfig) => {
    setEditingKey(config.configKey);
    setEditingValue(config.configValue);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-text mb-1">系统配置</h1>
        <p className="text-text-muted text-sm">管理系统运行参数</p>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
        <Input placeholder="搜索配置项..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 pr-10" />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-dim hover:text-text">
            <X size={16} />
          </button>
        )}
      </div>

      <Card hover={false} className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-border">
                <th className="text-left px-5 py-3 text-text-muted font-medium w-[200px]">配置键</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">值</th>
                <th className="text-left px-5 py-3 text-text-muted font-medium">说明</th>
                <th className="text-right px-5 py-3 text-text-muted font-medium w-[100px]">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((config) => {
                const isEditing = editingKey === config.configKey;
                return (
                  <tr key={config.id} className="border-b border-surface-border last:border-0 hover:bg-surface-hover/50 transition-colors">
                    <td className="px-5 py-3">
                      <code className="text-xs bg-surface-hover px-2 py-0.5 rounded text-primary-light">{config.configKey}</code>
                    </td>
                    <td className="px-5 py-3">
                      {isEditing ? (
                        <Input
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="h-8"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              updateMutation.mutate({ key: config.configKey, value: editingValue });
                            } else if (e.key === 'Escape') {
                              setEditingKey(null);
                            }
                          }}
                        />
                      ) : (
                        <span className="text-text">{config.configValue}</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-text-muted">{config.configDesc || '-'}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-end">
                        {isEditing ? (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => updateMutation.mutate({ key: config.configKey, value: editingValue })}
                              className="text-success hover:text-success"
                              disabled={updateMutation.isPending}
                            >
                              <Save size={14} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setEditingKey(null)}>
                              <X size={14} />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm" onClick={() => startEdit(config)}>
                            编辑
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {(!filtered || filtered.length === 0) && (
          <div className="py-16"><EmptyState icon={<Settings size={40} />} title="暂无配置数据" /></div>
        )}
      </Card>
    </div>
  );
}
