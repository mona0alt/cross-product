import React, { type ReactNode } from 'react';

import { AdminNav } from '@/components/admin/admin-nav';
import { AdminShellHeader } from '@/components/admin/admin-shell-header';
import { requireAdminSession } from '@/lib/auth';

export default async function AdminProtectedLayout({
  children
}: {
  children: ReactNode;
}) {
  const admin = await requireAdminSession();
  const navItems = [
    {
      href: '/admin/analytics',
      label: '数据分析',
      icon: 'BarChart3'
    },
    {
      href: '/admin/products',
      label: '商品审核',
      icon: 'Package'
    },
    {
      href: '/admin/subscribers',
      label: '邮件',
      icon: 'Mail'
    },
    {
      href: '/admin/messages',
      label: '支持中心',
      icon: 'MessageSquare'
    },
    {
      href: '/admin/categories',
      label: '系统设置',
      icon: 'FolderTree'
    }
  ];

  return (
    <div className="admin-body min-h-screen bg-admin-bg text-admin-text-primary font-body">
      <div className="fixed left-0 top-0 z-40 h-screen w-60 border-r border-admin-border bg-white">
        <AdminNav items={navItems} />
      </div>
      <div className="ml-60 min-h-screen bg-admin-bg">
        <AdminShellHeader admin={admin} />
        <main className="min-h-[calc(100vh-56px)] px-6 py-6">
          <div className="flex w-full flex-col gap-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
