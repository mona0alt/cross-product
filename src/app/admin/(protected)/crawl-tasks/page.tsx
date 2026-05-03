import React from 'react';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { CrawlTaskBoard } from '@/components/admin/crawl-task-board';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

export default function AdminCrawlTasksPage() {
  return (
    <section className="space-y-6">
      <AdminSectionHeader
        label="Crawler"
        title="抓取任务"
        description="展示来源站点、解析质量与入审核池逻辑，让客户先确认抓取流程的后台表达方式。"
      />
      <CrawlTaskBoard data={mockBackoffice.crawlTasks} />
    </section>
  );
}
