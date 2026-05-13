import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { AnalyticsInsightsBoard } from '@/components/admin/analytics-insights-board';
import { CrawlTaskBoard } from '@/components/admin/crawl-task-board';
import { MessageTable } from '@/components/admin/message-table';
import { SubscriberNotificationBoard } from '@/components/admin/subscriber-notification-board';
import { SubscriberMailWorkspace } from '@/components/admin/subscriber-mail-workspace';
import { SubscriberTable } from '@/components/admin/subscriber-table';
import { SystemSettingsPanel } from '@/components/admin/system-settings-panel';
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

  it('renders system setting details as a simple configuration list', () => {
    const html = renderToStaticMarkup(
      <SystemSettingsPanel
        settings={{
          email: {
            fromAddress: 'support@fbgm.com',
            smtpHost: 'smtp.example.com',
            smtpPort: '465',
            smtpUser: 'mailer',
            enabled: true
          },
          database: {
            provider: 'SQLite',
            url: '已配置',
            status: '已配置'
          },
          storage: {
            uploadRoot: '/public/uploads',
            productImages: '/public/uploads/products',
            categoryImages: '/public/uploads/categories',
            bannerImages: '/public/uploads/banners'
          },
          llm: {
            provider: 'OpenAI compatible',
            model: 'gpt-4o-mini',
            apiBaseUrl: 'https://api.openai.com/v1',
            apiKeyConfigured: false
          }
        }}
      />
    );

    expect(html).toContain('data-testid="system-setting-detail-panel"');
    expect(html).toContain('rounded-[20px] border border-admin-border bg-admin-surface shadow-[0_12px_34px_rgba(15,23,42,0.04)]');
    expect(html).toContain('data-testid="system-setting-config-list"');
    expect(html).toContain('divide-y divide-admin-border');
    expect(html).toContain('hover:bg-admin-elevated/70');
    expect(html).toContain('support@fbgm.com');
    expect(html).not.toContain('grid flex-1 auto-rows-fr gap-4');
    expect(html).not.toContain('min-w-0 rounded-xl border border-admin-border bg-white px-4 py-4');
  });

  it('renders support messages as paginated list rows instead of cards', () => {
    const messages = Array.from({ length: 8 }, (_, index) => ({
      id: `message-${index + 1}`,
      name: `客户 ${index + 1}`,
      email: `customer${index + 1}@example.com`,
      content: `第 ${index + 1} 条留言内容，需要客服跟进处理。`,
      status: index % 2 === 0 ? '待处理' : '已处理',
      createdAt: `2026-05-${String(index + 1).padStart(2, '0')}T09:00:00`
    }));

    const html = renderToStaticMarkup(<MessageTable messages={messages} />);

    expect(html).toContain('留言清单');
    expect(html).toContain('列表分页');
    expect(html).toContain('每页 5 条');
    expect(html).toContain('第 1 / 2 页');
    expect(html).not.toContain('共 8 条 · 第 1 / 2 页');
    expect(html).toContain('aria-label="上一页"');
    expect(html).toContain('aria-label="下一页"');
    expect(html).toContain('客户');
    expect(html).toContain('状态');
    expect(html).toContain('时间');
    expect(html).toContain('data-testid="message-list-scroll"');
    expect(html).toContain('overflow-y-auto');
    expect(html).toContain('data-testid="support-center-layout"');
    expect(html).toContain('data-testid="support-center-panel"');
    expect(html).toContain('flex min-h-[calc(100vh-104px)] flex-col');
    expect(html).toContain('min-h-[calc(100vh-104px)] flex-1');
    expect(html).not.toContain('xl:grid-cols-[280px_minmax(0,1fr)]');
    expect(html).toContain('sm:grid-cols-3');
    expect(html).not.toContain('min-h-[420px]');
    expect(html).toContain('flex-1');
    expect(html).toContain('customer1@example.com');
    expect(html).not.toContain('清单卡片固定大小');
    expect(html).not.toContain('h-[132px]');
    expect(html).not.toContain('space-y-6');
    expect(html).not.toContain('grid-cols-3 gap-4');
    expect(html).not.toContain('<article');
  });

  it('renders the mail automation board', () => {
    const html = renderToStaticMarkup(
      <SubscriberNotificationBoard data={mockBackoffice.subscribers} />
    );

    expect(html).toContain('自动化发送规则');
    expect(html).toContain('触发条件');
    expect(html).toContain('发送频率上限');
    expect(html).toContain('保存规则');
    expect(html).not.toContain('模板正文');
  });

  it('renders the mail subscription workspace with three tabs', () => {
    const html = renderToStaticMarkup(
      <SubscriberMailWorkspace
        data={mockBackoffice.subscribers}
        subscribers={[
          {
            id: 'subscriber-1',
            email: 'subscriber1@example.com',
            status: 'active',
            createdAt: '2025-04-01'
          }
        ]}
      />
    );

    expect(html).toContain('邮件订阅工作区');
    expect(html).toContain('自动化发送规则');
    expect(html).toContain('邮件模板管理');
    expect(html).toContain('订阅者列表');
    expect(html).toContain('role="tablist"');
    expect(html).toContain('邮件管理');
    expect(html).not.toContain('工作区导航');
    expect(html).not.toContain('Email Workspace');
    expect(html).not.toContain('按任务切换订阅规则、模板和订阅者列表。');
    expect(html).toContain('data-testid="subscriber-mail-workspace-panel"');
    expect(html).toContain('xl:grid-cols-[240px_minmax(0,1fr)]');
    expect(html).toContain('min-h-full');
    expect(html).not.toContain('rounded-t-xl');
  });

  it('renders a bulk mail sender for all subscribers using a selected template', () => {
    const html = renderToStaticMarkup(
      <SubscriberMailWorkspace
        data={mockBackoffice.subscribers}
        subscribers={[
          {
            id: 'subscriber-1',
            email: 'subscriber1@example.com',
            status: 'active',
            createdAt: '2025-04-01'
          },
          {
            id: 'subscriber-2',
            email: 'subscriber2@example.com',
            status: 'inactive',
            createdAt: '2025-04-02'
          }
        ]}
        initialTab="campaign"
      />
    );

    expect(html).toContain('群发邮件');
    expect(html).toContain('选择邮件模板');
    expect(html).toContain('发送给全部订阅者');
    expect(html).toContain('预计收件人');
    expect(html).toContain('2 位订阅者');
    expect(html).toContain('data-testid="bulk-mail-sender"');
  });

  it('renders the subscriber tab without the workspace card wrapper', () => {
    const html = renderToStaticMarkup(
      <SubscriberMailWorkspace
        data={mockBackoffice.subscribers}
        subscribers={[
          {
            id: 'subscriber-1',
            email: 'subscriber1@example.com',
            status: 'active',
            createdAt: '2025-04-01'
          }
        ]}
        initialTab="subscribers"
      />
    );

    expect(html).toContain('data-testid="subscriber-mail-workspace-panel"');
    expect(html).toContain('Data View');
    expect(html).toContain('data-testid="subscriber-list-card"');
    expect(html).not.toContain('Workspace Panel');
    expect(html).not.toContain('邮件订阅工作区');
  });

  it('renders subscribers as a paginated list instead of cards', () => {
    const subscribers = Array.from({ length: 9 }, (_, index) => ({
      id: `subscriber-${index + 1}`,
      email: `subscriber${index + 1}@example.com`,
      status: index % 3 === 0 ? 'inactive' : 'active',
      createdAt: new Date(`2025-04-${String(index + 1).padStart(2, '0')}`)
    }));

    const html = renderToStaticMarkup(<SubscriberTable subscribers={subscribers} />);

    expect(html).toContain('列表展示');
    expect(html).toContain('手动添加订阅者');
    expect(html).toContain('新增订阅者');
    expect(html).toContain('placeholder="输入订阅者邮箱"');
    expect(html).toContain('每页 8 位');
    expect(html).toContain('第 1 / 2 页');
    expect(html).toContain('aria-label="上一页"');
    expect(html).toContain('aria-label="下一页"');
    expect(html).toContain('data-testid="subscriber-list-card"');
    expect(html).toContain('overflow-y-auto');
    expect(html).toContain('[scrollbar-gutter:stable]');
    expect(html).toContain('subscriber1@example.com');
    expect(html).not.toContain('min-h-[560px]');
    expect(html).not.toContain('h-[168px]');
    expect(html).not.toContain('<article');
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
