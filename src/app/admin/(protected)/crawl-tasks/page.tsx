import React from 'react';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { CrawlTaskBoard } from '@/components/admin/crawl-task-board';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

export default function AdminCrawlTasksPage() {
  return (
    <section className="space-y-6">
      <AdminSectionHeader
        label="Settings"
        title="系统设置"
        description="管理抓取系统配置、接口集成与源站任务策略。"
      />
      <CrawlTaskBoard data={mockBackoffice.crawlTasks} />
    </section>
  );
}
