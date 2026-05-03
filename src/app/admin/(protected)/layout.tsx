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
    // {
    //   href: '/admin',
    //   label: '工作台',
    //   icon: 'LayoutDashboard'
    // },
    {
      href: '/admin/products',
      label: '商品中心',
      icon: 'Package',
      badge: '26'
    },
    {
      href: '/admin/crawl-tasks',
      label: '抓取任务',
      icon: 'Globe'
    },
    {
      href: '/admin/subscribers',
      label: '订阅与通知',
      icon: 'Mail'
    },
    {
      href: '/admin/analytics',
      label: 'AI 数据分析',
      icon: 'BarChart3',
      badge: '4'
    },
    {
      href: '/admin/categories',
      label: '分类管理',
      icon: 'FolderTree'
    },
    {
      href: '/admin/banners',
      label: '横幅管理',
      icon: 'Image'
    },
    {
      href: '/admin/messages',
      label: '客户留言',
      icon: 'MessageSquare'
    }
  ];

  return (
    <div className="admin-body min-h-screen bg-admin-bg text-admin-text-primary font-body">
      <div className="fixed left-0 top-0 z-40 h-screen w-[272px] border-r border-admin-border bg-[linear-gradient(180deg,#fbfaf7_0%,#f4f1ec_100%)]">
        <AdminNav items={navItems} />
      </div>
      <div className="ml-[272px] min-h-screen">
        <AdminShellHeader admin={admin} />
        <main className="px-8 py-8">
          <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
