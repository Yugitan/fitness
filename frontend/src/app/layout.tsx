import type { Metadata, Viewport } from 'next';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { GuestModal } from '@/components/shared/GuestModal';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Fitness 健身记录 — 记录每一次进步',
    template: '%s | Fitness 健身记录',
  },
  description: '个人健身训练记录管理 — 动作库、训练记录、训练计划、数据统计',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Fitness',
    statusBarStyle: 'black-translucent',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f0f0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  // This is a client boundary — all children can use hooks
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <GuestModal />
    </>
  );
}
