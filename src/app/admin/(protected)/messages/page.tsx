import React from 'react';

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
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          Messages
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          留言管理
        </h2>
      </div>
      <MessageTable messages={messages} />
    </section>
  );
}
