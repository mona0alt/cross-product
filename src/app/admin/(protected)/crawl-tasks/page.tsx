import React from 'react';

import { CrawlTaskBoard } from '@/components/admin/crawl-task-board';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

export default function AdminCrawlTasksPage() {
  return <CrawlTaskBoard data={mockBackoffice.crawlTasks} />;
}
