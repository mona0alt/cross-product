import React from 'react';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { AnalyticsInsightsBoard } from '@/components/admin/analytics-insights-board';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

export default function AdminAnalyticsPage() {
  return (
    <section className="space-y-6">
      <AdminSectionHeader
        label="AI Insights"
        title="AI 数据分析"
        description="先用静态分析页表达经营结论、路径洞察和推荐建议，再和客户确认后续真实分析能力。"
      />
      <AnalyticsInsightsBoard data={mockBackoffice.analytics} />
    </section>
  );
}
