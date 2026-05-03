import React from 'react';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { AnalyticsInsightsBoard } from '@/components/admin/analytics-insights-board';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

export default function AdminAnalyticsPage() {
  return (
    <section className="space-y-6">
      <AdminSectionHeader
        label="Analytics"
        title="数据分析"
        description="实时监控全球业务绩效与 AI 智能决策建议。"
      />
      <AnalyticsInsightsBoard data={mockBackoffice.analytics} />
    </section>
  );
}
