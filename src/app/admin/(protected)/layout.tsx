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
      href: '/admin',
      label: '工作台',
      description: '查看今日待办、上新节奏和关键提醒。'
    },
    {
      href: '/admin/products',
      label: '商品中心',
      description: '统一管理自动抓取和手动导入的商品池。',
      badge: {
        label: '待审核 26',
        tone: 'amber' as const
      }
    },
    {
      href: '/admin/crawl-tasks',
      label: '抓取任务',
      description: '追踪来源站点、抓取批次和异常修复。'
    },
    {
      href: '/admin/subscribers',
      label: '订阅与通知',
      description: '查看订阅客户、通知活动和失败重发。'
    },
    {
      href: '/admin/analytics',
      label: 'AI 数据分析',
      description: '查看热门排行、转化路径和推荐建议。',
      badge: {
        label: '4 条建议',
        tone: 'green' as const
      }
    }
  ];

  return (
    <div className="min-h-screen bg-stone-100 text-slate-950">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 xl:grid-cols-[320px_1fr]">
        <AdminNav items={navItems} />
        <div className="min-w-0">
          <AdminShellHeader admin={admin} />
          <main className="px-6 py-8 xl:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
