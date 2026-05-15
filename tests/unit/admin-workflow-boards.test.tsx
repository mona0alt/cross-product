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
      status: index % 2 === 0 ? 'new' : 'processed',
      createdAt: `2026-05-${String(index + 1).padStart(2, '0')}T09:00:00`
    }));

    const html = renderToStaticMarkup(<MessageTable messages={messages} />);

    expect(html).toContain('留言清单');
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
    expect(html).toContain('aria-label="查看全部邮件"');
    expect(html).toContain('aria-label="筛选未读邮件"');
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain('aria-label="查看邮件详情：客户 1"');
    expect(html).toContain('aria-label="删除邮件：客户 1"');
    expect(html).not.toContain('待处理');
    expect(html).not.toContain('已处理');
    expect(html).not.toContain('清单卡片固定大小');
    expect(html).not.toContain('h-[132px]');
    expect(html).not.toContain('space-y-6');
    expect(html).not.toContain('grid-cols-3 gap-4');
    expect(html).not.toContain('<article');
  });

  it('renders the selected support message in a detail dialog', () => {
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

    expect(html).toContain('role="dialog"');
    expect(html).toContain('邮件详情');
    expect(html).not.toContain('Message');
    expect(html).toContain('客户 1');
    expect(html).toContain('customer1@example.com');
    expect(html).toContain('这是一封需要完整查看的邮件详情。');
    expect(html).toContain('aria-label="关闭邮件详情"');
    expect(html).toContain('aria-label="删除当前邮件"');
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

  it('renders the mail subscription workspace with separate sent history tab', () => {
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
    expect(html).toContain('邮件模板与群发');
    expect(html).toContain('已发送邮件');
    expect(html).toContain('订阅者列表');
    expect(html).toContain('role="tablist"');
    expect(html).toContain('邮件管理');
    expect(html).not.toContain('主题与正文');
    expect(html).not.toContain('模板群发');
    expect(html).not.toContain('工作区导航');
    expect(html).not.toContain('Email Workspace');
    expect(html).not.toContain('按任务切换订阅规则、模板和订阅者列表。');
    expect(html).toContain('data-testid="subscriber-mail-workspace-panel"');
    expect(html).toContain('xl:grid-cols-[220px_minmax(0,1fr)]');
    expect(html).toContain('h-full');
    expect(html).toContain('flex h-full min-h-0 flex-col');
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
    expect(html).toContain('邮件模板管理');
    expect(html).toContain('模板展示与编辑');
    expect(html).toContain('群发控制');
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
    expect(html).toContain('xl:grid-cols-[minmax(320px,0.72fr)_minmax(0,1.28fr)]');
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
    expect(html).toContain('发送记录');
    expect(panelHtml).toContain('data-testid="sent-mail-history"');
    expect(panelHtml).toContain('已发送邮件');
    expect(panelHtml).toContain('发送时间');
    expect(panelHtml).toContain('成功率');
    expect(panelHtml).toContain('成功 1 封 · 失败 1 封');
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
    expect(html).toContain('data-testid="subscriber-list-pagination" class="mt-auto flex flex-col gap-3 border-t border-admin-border px-4 py-3');
    expect(html).not.toContain('flex h-full min-h-0 flex-col rounded-[24px]');
    expect(html).toContain('flex h-full min-h-0 flex-col gap-4 p-4');
    expect(html).toContain('flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-admin-border bg-white');
    expect(getElementHtmlByTestId(html, 'subscriber-list-card')).toContain(
      'data-testid="subscriber-list-pagination"'
    );
    expect(html).not.toContain('overflow-y-auto');
    expect(html).not.toContain('[scrollbar-gutter:stable]');
    expect(html).toContain('subscriber1@example.com');
    expect(html).toContain('aria-label="删除订阅者 subscriber1@example.com"');
    expect(html).toContain('>删除<');
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
});
