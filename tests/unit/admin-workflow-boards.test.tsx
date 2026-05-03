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

    expect(html).toContain('总订阅数');
    expect(html).toContain('自动化发送规则配置');
    expect(html).toContain('合规提示');
  });

  it('renders the upgraded analytics hero and insight sections', () => {
    const html = renderToStaticMarkup(<AnalyticsInsightsBoard />);

    expect(html).toContain('企业级 AI 数据分析概览');
    expect(html).toContain('2023年10月01日 - 2023年10月31日');
    expect(html).toContain('总营收 (Total Revenue)');
    expect(html).toContain('转化率 (Conversion Rate)');
    expect(html).toContain('跳出率 (Bounce Rate)');
    expect(html).toContain('活跃用户 (Active Users)');
    expect(html).toContain('用户转化漏斗 (Sankey 分析)');
    expect(html).toContain('热门产品类别排名');
    expect(html).toContain('电子数码');
    expect(html).toContain('导出表格');
    expect(html).toContain('详细报表');
    expect(html).toContain('AI 数据分析助手');
    expect(html).toContain('你好，我是数据分析助手，可以帮你解读报表数据、分析趋势并提供优化建议。');
    expect(html).toContain('输入问题，按回车发送...');
    expect(html).toContain('© 2023 Enterprise Global Manager. 版权所有。');
    expect(html).toContain('系统连接正常');
    expect(html).not.toContain('本周热门类目更偏便携型设备');
  });
});
