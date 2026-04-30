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
        title="留言管理"
      />
      <MessageTable messages={messages} />
    </section>
  );
}
