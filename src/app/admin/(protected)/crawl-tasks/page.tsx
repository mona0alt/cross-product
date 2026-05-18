import React from 'react';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { CrawlTaskBoard } from '@/components/admin/crawl-task-board';
import { mockBackoffice } from '@/features/admin/mock-backoffice';
import { getAdminDictionary } from '@/lib/admin-i18n';

export default async function AdminCrawlTasksPage() {
  const { Admin } = await getAdminDictionary();
  const data = {
    ...mockBackoffice.crawlTasks,
    headline: Admin.crawlTasks.headline,
    summary: Admin.crawlTasks.summary,
    sourceSites: mockBackoffice.crawlTasks.sourceSites.map((site, index) => ({
      ...site,
      status: Admin.crawlTasks.sourceSites[index]?.status ?? site.status,
      detail: Admin.crawlTasks.sourceSites[index]?.detail ?? site.detail
    }))
  };

  return (
    <section className="space-y-6">
      <AdminSectionHeader
        label="Settings"
        title={Admin.crawlTasks.title}
        description={Admin.crawlTasks.description}
      />
      <CrawlTaskBoard data={data} copy={Admin.crawlTasks} />
    </section>
  );
}
