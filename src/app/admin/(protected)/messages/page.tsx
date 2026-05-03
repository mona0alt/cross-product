import React from 'react';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { MessageTable } from '@/components/admin/message-table';
import { db } from '@/lib/db';

export default async function AdminMessagesPage() {
  const messages = await db.message.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <section className="space-y-6">
      <AdminSectionHeader
        label="Support"
        title="支持中心"
        description="管理客户查询、回复模版及支持工作流。"
      />
      <MessageTable messages={messages} />
    </section>
  );
}
