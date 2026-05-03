import React from 'react';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { SubscriberNotificationBoard } from '@/components/admin/subscriber-notification-board';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

export default function AdminSubscribersPage() {
  return (
    <section className="space-y-6">
      <AdminSectionHeader
        label="Subscribers"
        title="订阅与通知"
        description="用静态运营面板表达订阅规模、活动发送和失败重发，让新品通知闭环更容易被客户理解。"
      />
      <SubscriberNotificationBoard data={mockBackoffice.subscribers} />
    </section>
  );
}
