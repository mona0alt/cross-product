import React from 'react';

import { SubscriberNotificationBoard } from '@/components/admin/subscriber-notification-board';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

export default function AdminSubscribersPage() {
  return <SubscriberNotificationBoard data={mockBackoffice.subscribers} />;
}
