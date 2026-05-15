import React from 'react';

import { AnalyticsInsightsBoard } from '@/components/admin/analytics-insights-board';
import { getAdminDictionary } from '@/lib/admin-i18n';

export default async function AdminAnalyticsPage() {
  const { Admin } = await getAdminDictionary();

  return <AnalyticsInsightsBoard copy={Admin.analytics} />;
}
