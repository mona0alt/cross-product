import React from 'react';

import { SubscriberMailWorkspace } from '@/components/admin/subscriber-mail-workspace';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

const mockSubscribers = [
  { id: '1', email: 'alice.chen@example.com', status: 'active', createdAt: '2025-04-28' },
  { id: '2', email: 'bob.wang@designstudio.cn', status: 'active', createdAt: '2025-04-25' },
  { id: '3', email: 'carol.li@techcorp.com', status: 'inactive', createdAt: '2025-04-20' },
  { id: '4', email: 'david.zhang@startup.io', status: 'active', createdAt: '2025-04-18' },
  { id: '5', email: 'eva.liu@freelance.net', status: 'active', createdAt: '2025-04-15' },
  { id: '6', email: 'frank.zhao@enterprise.com', status: 'inactive', createdAt: '2025-04-10' },
  { id: '7', email: 'grace.wu@creative.agency', status: 'active', createdAt: '2025-04-05' },
  { id: '8', email: 'henry.sun@global.org', status: 'active', createdAt: '2025-03-28' },
  { id: '9', email: 'iris.yang@digital.cn', status: 'inactive', createdAt: '2025-03-20' },
  { id: '10', email: 'jack.ma@innovation.com', status: 'active', createdAt: '2025-03-15' },
];

export default function AdminSubscribersPage() {
  return (
    <section className="flex min-h-[calc(100vh-104px)] flex-col">
      <div className="min-h-0 flex-1 animate-fade-in-up">
        <SubscriberMailWorkspace
          data={mockBackoffice.subscribers}
          subscribers={mockSubscribers}
        />
      </div>
    </section>
  );
}
