'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Dumbbell } from 'lucide-react';

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="border-t border-surface-border bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-text-muted text-sm">
            <Dumbbell size={16} className="text-primary" />
            <span>Fitness 健身记录</span>
            <span className="text-text-dim">v2.0</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-dim">
            <Link href="/exercise/" className="hover:text-text transition-colors">动作库</Link>
            <Link href="/training/" className="hover:text-text transition-colors">训练记录</Link>
            <Link href="/plan/" className="hover:text-text transition-colors">训练计划</Link>
          </div>
          <p className="text-xs text-text-dim">记录每一次进步</p>
        </div>
      </div>
    </footer>
  );
}
