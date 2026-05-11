import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { AnalyticsInsightsBoard } from '@/components/admin/analytics-insights-board';
import { CrawlTaskBoard } from '@/components/admin/crawl-task-board';
import { SubscriberNotificationBoard } from '@/components/admin/subscriber-notification-board';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

describe('admin workflow boards', () => {
  it('renders the settings-style crawl configuration board', () => {
    const html = renderToStaticMarkup(
      <CrawlTaskBoard data={mockBackoffice.crawlTasks} />
    );

    expect(html).toContain('抓取系统配置');
    expect(html).toContain('源站任务配置');
    expect(html).toContain('robotmart.example');
  });

  it('renders the mail automation board', () => {
    const html = renderToStaticMarkup(
      <SubscriberNotificationBoard data={mockBackoffice.subscribers} />
    );

    expect(html).toContain('自动化发送规则');
    expect(html).toContain('触发条件');
    expect(html).toContain('邮件模板预览');
  });

  it('renders the upgraded analytics hero and insight sections', () => {
    const html = renderToStaticMarkup(<AnalyticsInsightsBoard />);

    expect(html).toContain('总 PV');
    expect(html).toContain('总商品数量');
    expect(html).toContain('页面访问成功率');
    expect(html).toContain('热门产品排名');
    expect(html).toContain('星河 Pro 手机');
    expect(html).toContain('导出表格');
    expect(html).toContain('AI 数据分析助手');
    expect(html).toContain('你好，我是数据分析助手，可以帮你解读报表数据、分析趋势并提供优化建议。');
    expect(html).toContain('输入问题，按回车发送...');
    expect(html).not.toContain('本周热门类目更偏便携型设备');
  });
});
