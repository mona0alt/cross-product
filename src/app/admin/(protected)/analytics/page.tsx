import React from 'react';

import { AnalyticsInsightsBoard } from '@/components/admin/analytics-insights-board';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

export default function AdminAnalyticsPage() {
  return <AnalyticsInsightsBoard data={mockBackoffice.analytics} />;
}
