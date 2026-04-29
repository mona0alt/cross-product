import React from 'react';

import { SubscriberTable } from '@/components/admin/subscriber-table';
import { db } from '@/lib/db';

export default async function AdminSubscribersPage() {
  const subscribers = await db.subscriber.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          Subscribers
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          订阅管理
        </h2>
      </div>
      <SubscriberTable subscribers={subscribers} />
    </section>
  );
}
