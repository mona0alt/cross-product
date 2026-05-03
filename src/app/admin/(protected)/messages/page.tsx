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
        label="Messages"
        title="客户留言"
        description="统一查看客户留言、邮箱和处理状态，让后台辅助页面也保持完整的页头结构。"
      />
      <MessageTable messages={messages} />
    </section>
  );
}
