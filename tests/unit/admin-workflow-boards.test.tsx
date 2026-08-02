import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { AnalyticsInsightsBoard } from '@/components/admin/analytics-insights-board';
import { CrawlTaskBoard } from '@/components/admin/crawl-task-board';
import { MessageTable } from '@/components/admin/message-table';
import { ProductForm } from '@/components/admin/product-form';
import { SubscriberNotificationBoard } from '@/components/admin/subscriber-notification-board';
import { SubscriberMailWorkspace } from '@/components/admin/subscriber-mail-workspace';
import { SubscriberTable } from '@/components/admin/subscriber-table';
import { SystemSettingsPanel } from '@/components/admin/system-settings-panel';
import { mockBackoffice } from '@/features/admin/mock-backoffice';
import enMessages from '../../messages/en.json';

function getElementHtmlByTestId(html: string, testId: string) {
  const start = html.indexOf(`data-testid="${testId}"`);
  if (start === -1) {
    return '';
  }

  const openTagStart = html.lastIndexOf('<', start);
  const openTagEnd = html.indexOf('>', start);
  const tagNameMatch = html.slice(openTagStart + 1, openTagEnd).match(/^([a-z0-9-]+)/i);
  const tagName = tagNameMatch?.[1];

  if (!tagName) {
    return '';
  }

  const tagPattern = new RegExp(`<\\/?${tagName}(?:\\s[^>]*)?>`, 'gi');
  tagPattern.lastIndex = openTagStart;

  let depth = 0;
  let match: RegExpExecArray | null;

  while ((match = tagPattern.exec(html))) {
    if (match[0].startsWith(`</${tagName}`)) {
      depth -= 1;
    } else {
      depth += 1;
    }

    if (depth === 0) {
      return html.slice(openTagStart, tagPattern.lastIndex);
    }
  }

  return '';
}

describe('admin workflow boards', () => {
  it('renders the settings-style crawl configuration board', () => {
    const html = renderToStaticMarkup(
      <CrawlTaskBoard data={mockBackoffice.crawlTasks} />
    );

    expect(html).toContain('抓取系统配置');
    expect(html).toContain('源站任务配置');
    expect(html).toContain('robotmart.example');
  });

  it('localizes the crawl task board with admin crawl copy', () => {
    const html = renderToStaticMarkup(
      <CrawlTaskBoard
        data={{
          headline: enMessages.Admin.crawlTasks.headline,
          summary: enMessages.Admin.crawlTasks.summary,
          sourceSites: mockBackoffice.crawlTasks.sourceSites.map((site, index) => ({
            ...site,
            status: enMessages.Admin.crawlTasks.sourceSites[index]?.status ?? site.status,
            detail: enMessages.Admin.crawlTasks.sourceSites[index]?.detail ?? site.detail
          }))
        }}
        copy={enMessages.Admin.crawlTasks}
      />
    );

    expect(html).toContain('Crawler system configuration');
    expect(html).toContain('11 candidate products crawled today');
    expect(html).toContain('Healthy');
    expect(html).not.toContain('抓取系统配置');
    expect(html).not.toContain('今天已抓取 11 个候选商品');
    expect(html).not.toContain('正常');
  });

  it('renders system setting details as a simple configuration list', () => {
    const html = renderToStaticMarkup(
      <SystemSettingsPanel
        settings={{
          groups: [
            {
              key: 'email',
              title: '邮箱配置',
              description: '邮件订阅、群发和自动化通知使用的 SMTP 配置。',
              fields: [
                {
                  key: 'email.mailFrom',
                  label: '发件邮箱',
                  value: 'support@fbgm.com',
                  inputType: 'text',
                  configured: true,
                  editable: true
                },
                {
                  key: 'email.smtpHost',
                  label: 'SMTP 主机',
                  value: 'smtp.example.com',
                  inputType: 'text',
                  configured: true,
                  editable: true
                }
              ]
            },
            {
              key: 'llm',
              title: '大模型相关配置',
              description: 'AI 服务商、模型和接口密钥配置。',
              fields: [
                {
                  key: 'llm.apiKey',
                  label: 'OPENAI_API_KEY',
                  value: '',
                  inputType: 'password',
                  configured: false,
                  editable: true,
                  sensitive: true
                }
              ]
            }
          ]
        }}
      />
    );

    expect(html).toContain('data-testid="system-setting-detail-panel"');
    expect(html).toContain('data-testid="smtp-connection-test"');
    expect(html).toContain('验证 SMTP');
    expect(html).not.toContain('尚未验证当前 SMTP 配置。');
    expect(html).toContain('grid h-full min-h-0 gap-3 xl:grid-cols-[220px_minmax(0,1fr)]');
    expect(html).toContain('rounded-[18px] border border-admin-border bg-admin-surface shadow-[0_16px_48px_rgba(15,23,42,0.05)]');
    expect(html).toContain('border-b border-admin-border px-5 py-4');
    expect(html).toContain('mt-1 text-xl font-semibold text-admin-text-primary font-display');
    expect(html).toContain('data-testid="system-setting-config-list"');
    expect(html).toContain('divide-y divide-admin-border');
    expect(html).toContain('hover:bg-admin-elevated/70');
    expect(html).toContain('support@fbgm.com');
    expect(html).not.toContain('lg:grid-cols-[280px_minmax(0,1fr)]');
    expect(html).not.toContain('rounded-[20px] border border-admin-border bg-admin-bg');
    expect(html).not.toContain('grid flex-1 auto-rows-fr gap-4');
    expect(html).not.toContain('min-w-0 rounded-xl border border-admin-border bg-white px-4 py-4');
  });

  it('omits redundant system settings guidance copy', () => {
    const html = renderToStaticMarkup(
      <SystemSettingsPanel
        settings={{
          groups: [
            {
              key: 'email',
              title: '邮箱配置',
              description: '展示前台联系邮箱与 SMTP 发送服务状态。',
              fields: [
                {
                  key: 'email.mailFrom',
                  label: '发件邮箱',
                  value: 'support@fbgm.com',
                  inputType: 'text',
                  configured: true,
                  editable: true
                }
              ]
            }
          ]
        }}
      />
    );

    expect(html).not.toContain('>Configuration<');
    expect(html).not.toContain('>Categories<');
    expect(html).not.toContain('按运行模块编辑真实配置，敏感项只显示配置状态。');
    expect(html).not.toContain('保存后写入数据库，前台联系入口、邮件发送和上传服务会读取这些配置。');
    expect(html).not.toContain('展示前台联系邮箱与 SMTP 发送服务状态。');
  });

  it('localizes SMTP verification controls without showing idle status on refresh', () => {
    const html = renderToStaticMarkup(
      <SystemSettingsPanel
        settings={{
          groups: [
            {
              key: 'email',
              title: 'Email configuration',
              description: 'Email delivery settings.',
              fields: [
                {
                  key: 'email.smtpHost',
                  label: 'SMTP host',
                  value: 'smtp.example.com',
                  inputType: 'text',
                  configured: true,
                  editable: true
                }
              ]
            }
          ]
        }}
        copy={enMessages.Admin.settings}
      />
    );

    expect(html).toContain('Verify SMTP');
    expect(html).not.toContain('验证 SMTP');
    expect(html).not.toContain('Current SMTP configuration has not been verified.');
    expect(html).not.toContain('尚未验证当前 SMTP 配置。');
  });

  it('renders a real database connection test action for database settings', () => {
    const html = renderToStaticMarkup(
      <SystemSettingsPanel
        settings={{
          groups: [
            {
              key: 'database',
              title: '数据库配置',
              description: '展示后台当前连接的数据源类型与连接状态。',
              fields: [
                {
                  key: 'runtime.databaseProvider',
                  label: '数据库类型',
                  value: 'SQLite',
                  inputType: 'text',
                  configured: true,
                  editable: false
                },
                {
                  key: 'runtime.databaseUrl',
                  label: '连接地址',
                  value: '已配置',
                  inputType: 'text',
                  configured: true,
                  editable: false,
                  sensitive: true
                }
              ]
            }
          ]
        }}
      />
    );

    expect(html).toContain('data-testid="database-connection-test"');
    expect(html).toContain('测试连接');
    expect(html).toContain('data-testid="database-connection-test-status"');
  });

  it('renders support messages as paginated list rows instead of cards', () => {
    const messages = Array.from({ length: 8 }, (_, index) => ({
      id: `message-${index + 1}`,
      name: `客户 ${index + 1}`,
      email: `customer${index + 1}@example.com`,
      content: `第 ${index + 1} 条留言内容，需要客服跟进处理。`,
      status: index % 2 === 0 ? 'new' : 'processed',
      createdAt: `2026-05-${String(index + 1).padStart(2, '0')}T09:00:00`
    }));

    const html = renderToStaticMarkup(<MessageTable messages={messages} />);

    expect(html).toContain('客户留言');
    expect(html).not.toContain('Inbox');
    expect(html).not.toContain('列表分页展示客户留言，每页 5 条');
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
    expect(html).toContain('未读');
    expect(html).toContain('已读');
    expect(html).toContain('data-testid="message-filter-toolbar"');
    expect(html).toContain('aria-label="查看全部留言"');
    expect(html).toContain('aria-label="筛选未读留言"');
    expect(html).toContain('aria-label="查看留言详情：客户 1"');
    expect(html).toContain('aria-label="删除留言：客户 1"');
    expect(html).not.toContain('aria-haspopup="dialog"');
    expect(html).not.toContain('待处理');
    expect(html).not.toContain('已处理');
    expect(html).not.toContain('清单卡片固定大小');
    expect(html).not.toContain('h-[132px]');
    expect(html).not.toContain('space-y-6');
    expect(html).not.toContain('grid-cols-3 gap-4');
    expect(html).not.toContain('<article');
  });

  it('renders the selected support message in a product-style right drawer', () => {
    const html = renderToStaticMarkup(
      <MessageTable
        messages={[
          {
            id: 'message-1',
            name: '客户 1',
            email: 'customer1@example.com',
            content: '这是一封需要完整查看的邮件详情。',
            status: 'new',
            createdAt: '2026-05-01T09:00:00'
          }
        ]}
        initialSelectedMessageId="message-1"
      />
    );

    expect(html).toContain('data-testid="message-detail-sidebar"');
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('fixed inset-y-0 right-0 z-50');
    expect(html).toContain('max-w-[520px]');
    expect(html).toContain('border-l border-admin-border bg-white shadow-[-24px_0_48px_rgba(15,23,42,0.12)]');
    expect(html).not.toContain('xl:grid-cols-[minmax(0,1fr)_360px]');
    expect(html).toContain('aria-current="true"');
    expect(html).not.toContain('fixed inset-0');
    expect(html).not.toContain('bg-slate-950/45');
    expect(html).toContain('留言详情');
    expect(html).not.toContain('Message');
    expect(html).toContain('客户 1');
    expect(html).toContain('customer1@example.com');
    expect(html).toContain('这是一封需要完整查看的邮件详情。');
    expect(html).toContain('aria-label="关闭留言详情"');
    expect(html).toContain('aria-label="删除当前留言"');
  });

  it('can render only unread support messages when the unread filter is active', () => {
    const html = renderToStaticMarkup(
      <MessageTable
        messages={[
          {
            id: 'message-1',
            name: '未读客户',
            email: 'unread@example.com',
            content: '未读邮件内容。',
            status: 'new',
            createdAt: '2026-05-01T09:00:00'
          },
          {
            id: 'message-2',
            name: '已读客户',
            email: 'opened@example.com',
            content: '已读邮件内容。',
            status: 'processed',
            createdAt: '2026-05-01T10:00:00'
          }
        ]}
        initialFilter="unread"
      />
    );

    expect(html).toContain('unread@example.com');
    expect(html).not.toContain('opened@example.com');
    expect(html).toContain('当前显示 1 条');
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

  it('renders the mail subscription workspace with visible non-automation tabs', () => {
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

    expect(html).not.toContain('自动化发送规则');
    expect(html).not.toContain('触发条件');
    expect(html).not.toContain('保存规则');
    expect(html).toContain('邮件模板与群发');
    expect(html).toContain('已发送邮件');
    expect(html).toContain('订阅者列表');
    expect(html).toContain('role="tablist"');
    expect(html).toContain('邮件管理');
    expect(html).toContain('border-b border-admin-border px-5 py-4');
    expect(html).toContain('mt-1 text-xl font-semibold text-admin-text-primary font-display');
    expect(html).not.toContain('主题与正文');
    expect(html).not.toContain('模板群发');
    expect(html).not.toContain('工作区导航');
    expect(html).not.toContain('Email Workspace');
    expect(html).not.toContain('按任务切换订阅规则、模板和订阅者列表。');
    expect(html).toContain('data-testid="subscriber-mail-workspace-panel"');
    expect(html).toContain('xl:grid-cols-[220px_minmax(0,1fr)]');
    expect(html).toContain('h-full');
    expect(html).toContain('flex h-full min-h-0 flex-col');
    expect(html).not.toContain('Workspace Panel');
    expect(html).not.toContain('邮件订阅工作区');
    expect(html).not.toContain('触发与频控');
    expect(html).not.toContain('编辑与发送');
    expect(html).not.toContain('>发送记录<');
    expect(html).not.toContain('列表与分页');
    expect(html).not.toContain('rounded-t-xl');
  });

  it('renders the image-aligned mail template and bulk sending workspace without sent history', () => {
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
        sentRecords={[
          {
            id: 'sent-failed-1',
            templateId: 'new-arrival',
            templateName: '新品上架通知',
            sentAt: '2026/05/15 09:30',
            recipients: 2,
            success: 0,
            failed: 2,
            status: '失败',
            errorMessage: 'SMTP_NOT_CONFIGURED'
          }
        ]}
      />
    );

    expect(html).toContain('邮件模板与群发');
    expect(html).toContain('模板库');
    expect(html).toContain('模板展示与编辑');
    expect(html).toContain('已发送邮件');
    expect(html).toContain('成功率');
    expect(html).toContain('成功');
    expect(html).toContain('失败');
    expect(html).toContain('新增模板');
    expect(html).toContain('placeholder="搜索模板"');
    expect(html).toContain('aria-label="选择并编辑模板 新品上架通知"');
    expect(html).toContain('aria-label="删除模板 新品上架通知"');
    expect(html).toContain('发送给全部订阅者');
    expect(html).toContain('预计收件人');
    expect(html).toContain('2 位订阅者');
    expect(html).toContain('data-testid="bulk-mail-sender"');
    expect(html).toContain('data-testid="mail-template-list"');
    expect(html).toContain('data-testid="bulk-mail-campaign-list"');
    expect(html).toContain('data-testid="mail-template-editor-panel"');
    expect(html).toContain('data-layout="full-page"');
    expect(html).not.toContain('维护模板内容与变量占位符，并向当前订阅者创建群发任务。');
    expect(html).toContain('xl:grid-cols-[minmax(240px,0.42fr)_minmax(0,1.58fr)]');
    expect(html).not.toContain('xl:grid-cols-[minmax(300px,0.66fr)_minmax(0,1.34fr)]');
    expect(html).toContain('data-testid="mail-template-list" class="flex min-h-0 flex-col border border-admin-border bg-white"');
    expect(html).toContain('data-testid="bulk-mail-campaign-list" class="flex min-h-0 flex-1 flex-col overflow-hidden border border-admin-border bg-white"');
    expect(html).not.toContain('data-testid="mail-template-list" class="flex min-h-0 flex-col rounded-2xl');
    expect(html).not.toContain('data-testid="bulk-mail-campaign-list" class="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl');
    expect(html).toContain('min-h-0 flex-1 divide-y divide-admin-border overflow-y-auto bg-white');
    expect(html).toContain('grid min-h-[56px] grid-cols-[minmax(0,1fr)_32px] items-center gap-2 border-l-4 px-3 py-2 text-xs');
    expect(html).not.toContain('grid min-h-[56px] grid-cols-[minmax(0,1fr)_32px] items-center gap-2 rounded-lg border px-3 py-2 text-xs');
    expect(html).toContain('min-h-[180px] w-full resize-y rounded-xl border border-admin-border bg-white px-3 py-2.5 text-xs leading-5');
    expect(html).toContain('grid grid-cols-3 gap-3 border-b border-admin-border px-4 py-2.5');
    expect(html).not.toContain('min-h-[220px] w-full resize-y');
    expect(html).toContain('邮件模板');
    expect(html).toContain('模板名称');
    expect(html).toContain('模板主题');
    expect(html).toContain('模板正文');
    expect(html).toContain('保存模板');
    expect(html).toContain('删除模板');
    expect(html).toContain('发送状态');
    expect(html).toContain('title="SMTP_NOT_CONFIGURED"');
    expect(html).toContain('group-hover:opacity-100');
    expect(html).toContain('失败日志');
    expect(html).not.toContain('data-testid="sent-mail-history"');
    expect(html).not.toContain('Previous');
    expect(html).not.toContain('Page 1 of 3');
    expect(html).not.toContain('data-testid="mail-template-editor"');
    expect(html).not.toContain('role="dialog"');
    expect(html).not.toContain('打开模板编辑弹窗');
    expect(html).not.toContain('关闭模板编辑弹窗');
    expect(html).not.toContain('查询、修改并保存模板内容，右侧群发会使用当前选中的模板。');
    expect(html).not.toContain('Data View');
    expect(html).not.toContain('Workspace Panel');
    expect(html).not.toContain('邮件订阅工作区');
    expect(html).not.toContain('邮件模板管理');
    expect(html).not.toContain('选择左侧模板后在此维护内容，并用于群发控制。');
    expect(html).not.toContain('群发控制');
    expect(html).not.toContain('Mail template management');
    expect(html).not.toContain('Select a template on the left, edit the content here, and use it for bulk sending.');
    expect(html).not.toContain('在同一个工作区维护模板内容、预览正文，并向当前订阅者列表创建群发任务。');
    expect(html).not.toContain('维护订阅通知的主题、正文和变量占位符，右侧同步用于群发预览。');
    expect(html).not.toContain('使用当前模板内容创建发送任务，默认发送给全部订阅者。');
    expect(html).not.toContain('当前显示 1 个群发任务');
    expect(html).not.toContain('选择一个邮件模板，一次性发送给当前全部订阅者。');
  });

  it('renders sent mail history as its own workspace tab', () => {
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
        initialTab="sent"
        sentRecords={[
          {
            id: 'sent-1',
            templateId: 'new-arrival',
            templateName: '新品上架通知',
            sentAt: '2026/05/15 09:30',
            recipients: 2,
            success: 1,
            failed: 1,
            status: '部分成功',
            errorMessage: 'SMTP connection rejected'
          }
        ]}
      />
    );
    const panelHtml = getElementHtmlByTestId(html, 'subscriber-mail-workspace-panel');

    expect(html).toContain('邮件模板与群发');
    expect(html).toContain('已发送邮件');
    expect(html).not.toContain('>发送记录<');
    expect(panelHtml).toContain('data-testid="sent-mail-history"');
    expect(panelHtml).toContain('已发送邮件');
    expect(panelHtml).toContain('发送时间');
    expect(panelHtml).toContain('成功率');
    expect(panelHtml).not.toContain('成功 1 封 · 失败 1 封');
    expect(panelHtml).toContain('SMTP connection rejected');
    expect(panelHtml).toContain('title="SMTP connection rejected"');
    expect(panelHtml).toContain('group-hover:opacity-100');
    expect(panelHtml).toContain('失败日志');
    expect(panelHtml).toContain('aria-label="选择邮件记录 新品上架通知"');
    expect(panelHtml).toContain('aria-label="全选当前页邮件记录"');
    expect(panelHtml).toContain('aria-label="删除邮件记录 新品上架通知"');
    expect(panelHtml).toContain('批量删除');
    expect(panelHtml).toContain('第 1 / 1 页');
    expect(panelHtml).not.toContain('Page 1 of 3');
    expect(panelHtml).not.toContain('data-testid="bulk-mail-sender"');
    expect(panelHtml).not.toContain('模板展示与编辑');
  });

  it('renders sent mail history with real paginated rows and multi-select deletion controls', () => {
    const sentRecords = Array.from({ length: 9 }, (_, index) => ({
      id: `sent-${index + 1}`,
      templateId: `template-${index + 1}`,
      templateName: `发送记录 ${index + 1}`,
      sentAt: `2026/05/${String(index + 1).padStart(2, '0')} 09:30`,
      recipients: 12,
      success: 10,
      failed: 2,
      status: '部分成功' as const,
      errorMessage: 'SMTP connection rejected'
    }));

    const html = renderToStaticMarkup(
      <SubscriberMailWorkspace
        data={mockBackoffice.subscribers}
        subscribers={[]}
        initialTab="sent"
        sentRecords={sentRecords}
      />
    );
    const panelHtml = getElementHtmlByTestId(html, 'subscriber-mail-workspace-panel');

    expect(panelHtml).toContain('data-testid="sent-mail-history"');
    expect(panelHtml).toContain('发送记录 1');
    expect(panelHtml).toContain('发送记录 8');
    expect(panelHtml).not.toContain('发送记录 9');
    expect(panelHtml).toContain('每页 8 封');
    expect(panelHtml).toContain('第 1 / 2 页');
    expect(panelHtml).toContain('data-testid="sent-mail-history-pagination"');
    expect(panelHtml).toContain('aria-label="全选当前页邮件记录"');
    expect(panelHtml).toContain('aria-label="选择邮件记录 发送记录 1"');
    expect(panelHtml).toContain('aria-label="删除邮件记录 发送记录 1"');
    expect(panelHtml).toContain('批量删除');
    expect(panelHtml).toContain(
      'grid-cols-[36px_minmax(160px,0.76fr)_minmax(88px,0.28fr)_minmax(88px,0.28fr)_minmax(140px,0.44fr)_64px]'
    );
    expect(panelHtml).toContain('gap-3 px-3 py-3');
    expect(panelHtml).toContain('text-center">状态</span>');
    expect(panelHtml).toContain('lg:justify-center');
    expect(panelHtml).not.toContain(
      'grid-cols-[36px_minmax(148px,0.7fr)_minmax(96px,0.34fr)_minmax(96px,0.34fr)_minmax(152px,0.5fr)_72px]'
    );
  });

  it('localizes the mail management workspaces with subscriber copy', () => {
    const englishCopy = enMessages.Admin.subscribers;
    const sentRecords = [
      {
        id: 'sent-1',
        templateId: 'new-arrival',
        templateName: 'New arrival notice',
        sentAt: '05/15/2026, 09:30',
        recipients: 2,
        success: 1,
        failed: 1,
        status: '部分成功' as const,
        errorMessage: 'SMTP connection rejected'
      }
    ];

    const mailHtml = renderToStaticMarkup(
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
        initialTab="mail"
        sentRecords={sentRecords}
        copy={englishCopy}
      />
    );
    const sentHtml = renderToStaticMarkup(
      <SubscriberMailWorkspace
        data={mockBackoffice.subscribers}
        subscribers={[]}
        initialTab="sent"
        sentRecords={sentRecords}
        copy={englishCopy}
      />
    );
    const hiddenAutomationHtml = renderToStaticMarkup(
      <SubscriberMailWorkspace
        data={mockBackoffice.subscribers}
        subscribers={[]}
        initialTab="automation"
        copy={englishCopy}
      />
    );

    expect(mailHtml).toContain('Mail management');
    expect(mailHtml).toContain('Template library');
    expect(mailHtml).toContain('Send to all subscribers');
    expect(mailHtml).toContain('1 subscriber');
    expect(mailHtml).toContain('Partial success');
    expect(mailHtml).not.toContain('模板库');
    expect(mailHtml).not.toContain('发送给全部订阅者');
    expect(mailHtml).not.toContain('失败日志');

    expect(sentHtml).toContain('Sent at');
    expect(sentHtml).not.toContain('Success 1 · Failed 1');
    expect(sentHtml).toContain('Select mail record New arrival notice');
    expect(sentHtml).toContain('8 per page');
    expect(sentHtml).not.toContain('发送时间');
    expect(sentHtml).not.toContain('第 1 / 1 页');

    expect(hiddenAutomationHtml).toContain('Mail management');
    expect(hiddenAutomationHtml).toContain('Template library');
    expect(hiddenAutomationHtml).not.toContain('Automation rules');
    expect(hiddenAutomationHtml).not.toContain('Trigger');
    expect(hiddenAutomationHtml).not.toContain('Save rule');
    expect(hiddenAutomationHtml).not.toContain('Workspace panel');
    expect(hiddenAutomationHtml).not.toContain('Mail subscription workspace');
    expect(hiddenAutomationHtml).not.toContain('Triggers and caps');
    expect(hiddenAutomationHtml).not.toContain('Edit and send');
    expect(hiddenAutomationHtml).not.toContain('Send history');
    expect(hiddenAutomationHtml).not.toContain('List and pagination');
    expect(hiddenAutomationHtml).not.toContain('触发条件');
    expect(hiddenAutomationHtml).not.toContain('邮件订阅工作区');
  });

  it('renders the subscriber tab with the shared workspace layout', () => {
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
    expect(html).not.toContain('Data View');
    expect(html).toContain('data-testid="subscriber-list-card"');
    expect(html).toContain('flex min-h-[73px] flex-col gap-4 border-b border-admin-border px-5 py-4');
    expect(html).not.toContain('维护订阅邮箱、状态与触达偏好，支撑模板群发和自动化触达。');
    expect(html).toContain('grid h-full min-h-0 gap-3 xl:grid-cols-[220px_minmax(0,1fr)]');
    expect(html).toContain(
      'flex h-full min-h-0 flex-col rounded-[18px] border border-admin-border bg-admin-surface'
    );
    expect(getElementHtmlByTestId(html, 'subscriber-mail-workspace-panel')).toContain(
      'flex h-full min-h-0 flex-col'
    );
    expect(getElementHtmlByTestId(html, 'subscriber-mail-workspace-panel')).not.toContain(
      '[&amp;&gt;section]:h-full'
    );
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

    expect(html).toContain('新增订阅者');
    expect(html).toContain('aria-label="打开新增订阅者弹窗"');
    expect(html).toContain('placeholder="搜索邮箱..."');
    expect(html).not.toContain('Data View');
    expect(html).not.toContain('列表展示订阅者资料');
    expect(html).not.toContain('手动添加订阅者');
    expect(html).not.toContain('placeholder="输入订阅者邮箱"');
    expect(html).toContain('每页 8 位');
    expect(html).toContain('第 1 / 2 页');
    expect(html).toContain('aria-label="上一页"');
    expect(html).toContain('aria-label="下一页"');
    expect(html).toContain('data-testid="subscriber-list-card"');
    expect(html).toContain('data-testid="subscriber-list-pagination"');
    expect(html).toContain('data-testid="subscriber-list-pagination" class="flex flex-col gap-3 rounded-b-2xl border border-admin-border bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between');
    expect(html).toContain('inline-flex h-8 w-8 items-center justify-center rounded-lg bg-admin-text-primary text-xs font-semibold text-white">1</span>');
    expect(html).not.toContain('flex h-full min-h-0 flex-col rounded-[24px]');
    expect(html).toContain('flex h-full min-h-0 flex-col gap-4 p-4');
    expect(html).toContain('flex min-h-0 flex-1 flex-col overflow-hidden');
    expect(html).toContain(
      'grid-cols-[minmax(176px,0.82fr)_minmax(96px,0.32fr)_minmax(136px,0.44fr)_minmax(124px,0.4fr)_64px]'
    );
    expect(html).toContain('gap-3 px-3 py-3');
    expect(html).toContain('border-x border-admin-border bg-white');
    expect(html).toContain('text-center">状态</span>');
    expect(html).toContain('lg:flex lg:justify-center');
    expect(html).not.toContain(
      'grid-cols-[minmax(200px,1fr)_88px_minmax(128px,0.68fr)_minmax(116px,0.58fr)_56px]'
    );
    expect(getElementHtmlByTestId(html, 'subscriber-list-card')).toContain(
      'data-testid="subscriber-list-pagination"'
    );
    expect(html).toContain('min-h-0 flex-1 divide-y divide-admin-border overflow-y-auto');
    expect(html).not.toContain('[scrollbar-gutter:stable]');
    expect(html).toContain('subscriber1@example.com');
    expect(html).toContain('aria-label="删除订阅者 subscriber1@example.com"');
    expect(html).toContain('title="删除"');
    expect(html).not.toContain('>查看<');
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

  it('localizes the product form pages with admin product copy', () => {
    const html = renderToStaticMarkup(
      <ProductForm
        mode="create"
        categories={[
          { id: 'cat-root', parentId: null, nameZh: 'Robots' },
          { id: 'cat-1', parentId: 'cat-root', nameZh: 'Bipedal Robots' }
        ]}
        copy={enMessages.Admin.products}
        uploadLabel={enMessages.Admin.common.upload}
      />
    );

    expect(html).toContain('Manual products follow the same review rules.');
    expect(html).toContain('Source: manual import');
    expect(html).toContain('<option value="" selected="">Select category</option>');
    expect(html).toContain('<option value="draft" selected="">Draft</option>');
    expect(html).toContain('<option value="pending">Pending review</option>');
    expect(html).toContain('<option value="published">Published</option>');
    expect(html).toContain('<option value="archived">Archived</option>');
    expect(html).toContain('Chinese name');
    expect(html).toContain('System checks image count, English summary, and duplicate risk.');
    expect(html).not.toContain('手动录入商品也遵循统一审核规则。');
    expect(html).not.toContain('来源：手动导入');
    expect(html).not.toContain('选择分类');
    expect(html).not.toContain('中文优先录入');
  });

  it('localizes support message detail sidebar headings with admin message copy', () => {
    const html = renderToStaticMarkup(
      <MessageTable
        messages={[
          {
            id: 'message-1',
            name: 'Customer 1',
            email: 'customer1@example.com',
            content: 'Message body.',
            status: 'new',
            createdAt: '2026-05-01T09:00:00'
          }
        ]}
        initialSelectedMessageId="message-1"
        copy={enMessages.Admin.messages}
      />
    );

    expect(html).toContain('Contact info');
    expect(html).not.toContain('联系信息');
  });

  it('localizes analytics board dynamic labels and demo product rows', () => {
    const html = renderToStaticMarkup(
      <AnalyticsInsightsBoard copy={enMessages.Admin.analytics} />
    );

    expect(html).toContain('Live scanning');
    expect(html).toContain('Galaxy Pro phone');
    expect(html).not.toContain('实时扫描中');
    expect(html).not.toContain('星河 Pro 手机');
  });
});
