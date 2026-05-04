import React from 'react';

import { SubscriberNotificationBoard } from '@/components/admin/subscriber-notification-board';
import { SubscriberTable } from '@/components/admin/subscriber-table';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

const mockSubscribers = [
  { id: '1', email: 'alice.chen@example.com', status: 'active', createdAt: new Date('2025-04-28') },
  { id: '2', email: 'bob.wang@designstudio.cn', status: 'active', createdAt: new Date('2025-04-25') },
  { id: '3', email: 'carol.li@techcorp.com', status: 'inactive', createdAt: new Date('2025-04-20') },
  { id: '4', email: 'david.zhang@startup.io', status: 'active', createdAt: new Date('2025-04-18') },
  { id: '5', email: 'eva.liu@freelance.net', status: 'active', createdAt: new Date('2025-04-15') },
  { id: '6', email: 'frank.zhao@enterprise.com', status: 'inactive', createdAt: new Date('2025-04-10') },
  { id: '7', email: 'grace.wu@creative.agency', status: 'active', createdAt: new Date('2025-04-05') },
  { id: '8', email: 'henry.sun@global.org', status: 'active', createdAt: new Date('2025-03-28') },
  { id: '9', email: 'iris.yang@digital.cn', status: 'inactive', createdAt: new Date('2025-03-20') },
  { id: '10', email: 'jack.ma@innovation.com', status: 'active', createdAt: new Date('2025-03-15') },
];

export default function AdminSubscribersPage() {
  return (
    <section className="space-y-8">
      {/* Hero — merged header + subscriber count */}
      <div className="flex flex-col gap-6 rounded-[24px] border border-admin-border bg-admin-surface px-6 py-6 opacity-0 shadow-[0_14px_40px_rgba(15,23,42,0.04)] animate-fade-in-up xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl">
          <p className="admin-kicker">Email</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-admin-text-primary font-display">
            邮件
          </h2>
          <p className="mt-3 text-sm leading-7 text-admin-text-secondary font-body">
            管理所有订阅者、自动化发送规则及整体统计指标。
          </p>
        </div>

        <div className="flex items-center gap-5 rounded-2xl bg-admin-elevated px-6 py-5 border border-admin-border">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-admin-text-muted">
              总订阅数
            </p>
            <p className="mt-1 text-[36px] font-semibold leading-none tracking-tight text-admin-text-primary font-display">
              1,284
            </p>
          </div>
          <div className="h-10 w-px bg-admin-border" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-admin-text-muted">
              本周新增
            </p>
            <p className="mt-1 text-[20px] font-semibold leading-none text-admin-accent font-display">
              +12
            </p>
          </div>
        </div>
      </div>

      <div className="animate-fade-in-up admin-stagger-1">
        <SubscriberNotificationBoard data={mockBackoffice.subscribers} />
      </div>

      <div className="animate-fade-in-up admin-stagger-2">
        <SubscriberTable subscribers={mockSubscribers} />
      </div>
    </section>
  );
}
