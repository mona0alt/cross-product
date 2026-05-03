import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { AnalyticsInsightsBoard } from '@/components/admin/analytics-insights-board';
import { CrawlTaskBoard } from '@/components/admin/crawl-task-board';
import { SubscriberNotificationBoard } from '@/components/admin/subscriber-notification-board';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

describe('admin workflow boards', () => {
  it('renders the upgraded crawl hero summary', () => {
    const html = renderToStaticMarkup(
      <CrawlTaskBoard data={mockBackoffice.crawlTasks} />
    );

    expect(html).toContain('候选商品入口页');
    expect(html).toContain('今日抓取摘要');
    expect(html).toContain('来源站点健康状态');
  });

  it('renders the upgraded subscriber summary', () => {
    const html = renderToStaticMarkup(
      <SubscriberNotificationBoard data={mockBackoffice.subscribers} />
    );

    expect(html).toContain('订阅规模');
    expect(html).toContain('待发送活动');
    expect(html).toContain('通知活动与失败队列');
  });

  it('renders the upgraded analytics hero and insight sections', () => {
    const html = renderToStaticMarkup(
      <AnalyticsInsightsBoard data={mockBackoffice.analytics} />
    );

    expect(html).toContain('企业级 AI 数据分析概览');
    expect(html).toContain('总营收');
    expect(html).toContain('用户转化漏斗');
    expect(html).toContain('AI 智能洞察');
  });
});
