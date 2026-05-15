import React from 'react';

import { MessageTable } from '@/components/admin/message-table';
import { getAdminMessages } from '@/features/admin/message-actions';
import { getAdminDictionary } from '@/lib/admin-i18n';

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  const [messages, { Admin }] = await Promise.all([
    getAdminMessages(),
    getAdminDictionary()
  ]);

  return (
    <section className="min-h-[calc(100vh-104px)]">
      <MessageTable messages={messages} copy={Admin.messages} />
    </section>
  );
}
