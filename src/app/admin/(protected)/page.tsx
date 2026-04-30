import React from 'react';

import { DashboardWorkbench } from '@/components/admin/dashboard-workbench';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

export default function AdminDashboardPage() {
  return <DashboardWorkbench data={mockBackoffice.dashboard} />;
}
