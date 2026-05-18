import { AdminShell } from '@/components/layout/AdminShell';

export const metadata = {
  title: '管理后台',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
