import React from 'react';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { SubscriberNotificationBoard } from '@/components/admin/subscriber-notification-board';
import { SubscriberTable } from '@/components/admin/subscriber-table';
import { mockBackoffice } from '@/features/admin/mock-backoffice';
import { db } from '@/lib/db';

export default async function AdminSubscribersPage() {
  const subscribers = await db.subscriber.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <section className="space-y-6">
      <AdminSectionHeader
        label="Email"
        title="邮件"
        description="管理所有订阅者、自动化发送规则及整体统计指标。"
      />
      <SubscriberNotificationBoard data={mockBackoffice.subscribers} />
      <SubscriberTable subscribers={subscribers} />
    </section>
  );
}
