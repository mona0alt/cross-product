'use client';

import React, { useMemo, useState } from 'react';
import { FileText, Save, Send, Users } from 'lucide-react';
import { SubscriberAutomationRules } from './subscriber-notification-board';
import { SubscriberTable, type SubscriberRow } from './subscriber-table';

type SubscriberMailData = {
  total: string;
  openRate: string;
  failed: string;
  campaigns: ReadonlyArray<{
    title: string;
    status: string;
    detail: string;
  }>;
  templates?: ReadonlyArray<{
    id: string;
    name: string;
    subject: string;
    body: string;
  }>;
};

type TabKey = 'automation' | 'templates' | 'campaign' | 'subscribers';

const tabs: ReadonlyArray<{
  key: TabKey;
  label: string;
  detail: string;
  icon: typeof Send;
}> = [
  {
    key: 'automation',
    label: '自动化发送规则',
    detail: '触发与频控',
    icon: Send
  },
  {
    key: 'templates',
    label: '邮件模板管理',
    detail: '主题与正文',
    icon: FileText
  },
  {
    key: 'campaign',
    label: '群发邮件',
    detail: '模板群发',
    icon: Send
  },
  {
    key: 'subscribers',
    label: '订阅者列表',
    detail: '列表与分页',
    icon: Users
  }
];

function getMailTemplates(data: SubscriberMailData) {
  return data.templates && data.templates.length > 0
    ? data.templates
    : data.campaigns.map((campaign, index) => ({
        id: `campaign-${index + 1}`,
        name: campaign.title,
        subject: `${campaign.title} 通知`,
        body: campaign.detail
      }));
}

function MailTemplateManager({
  data
}: {
  data: SubscriberMailData;
}) {
  const initialTemplates = useMemo(() => getMailTemplates(data), [data]);
  const [templates, setTemplates] = useState(() => initialTemplates);
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id ?? '');
  const selectedTemplate =
    templates.find((template) => template.id === selectedTemplateId) ?? templates[0];
  const [subject, setSubject] = useState(selectedTemplate?.subject ?? '');
  const [body, setBody] = useState(selectedTemplate?.body ?? '');

  function handleTemplateChange(templateId: string) {
    const nextTemplate = templates.find((template) => template.id === templateId);
    setSelectedTemplateId(templateId);
    setSubject(nextTemplate?.subject ?? '');
    setBody(nextTemplate?.body ?? '');
  }

  function handleSaveTemplate() {
    setTemplates((currentTemplates) =>
      currentTemplates.map((template) =>
        template.id === selectedTemplateId
          ? {
              ...template,
              subject,
              body
            }
          : template
      )
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5 p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h4 className="text-base font-semibold text-admin-text-primary">
            邮件模板管理
          </h4>
          <p className="mt-1 text-xs leading-5 text-admin-text-secondary">
            维护订阅通知的主题、正文和变量占位符，保存后可用于后续发送流程。
          </p>
        </div>
        <select
          value={selectedTemplateId}
          onChange={(event) => handleTemplateChange(event.target.value)}
          aria-label="选择邮件模板"
          className="w-full rounded-xl border border-admin-border bg-white px-4 py-2.5 text-[13px] text-admin-text-primary transition-shadow focus:border-admin-accent focus:outline-none focus:ring-2 focus:ring-admin-accent/20 md:w-56"
        >
          {templates.map((template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="space-y-2 lg:overflow-y-auto">
          {templates.map((template) => (
            <button
              key={template.id}
              type="button"
              onClick={() => handleTemplateChange(template.id)}
              className={`flex min-h-12 w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-[13px] font-medium transition-colors ${
                template.id === selectedTemplateId
                  ? 'border-admin-accent bg-admin-accent/10 text-admin-accent'
                  : 'border-admin-border bg-white text-admin-text-secondary hover:bg-admin-elevated'
              }`}
            >
              <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{template.name}</span>
            </button>
          ))}
        </div>

        <div className="flex min-h-0 flex-col gap-4">
          <div className="space-y-2">
            <label
              htmlFor="mail-template-subject"
              className="block text-[11px] font-semibold uppercase tracking-wider text-admin-text-muted"
            >
              模板主题
            </label>
            <input
              id="mail-template-subject"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              className="w-full rounded-xl border border-admin-border bg-white px-4 py-2.5 text-[13px] text-admin-text-primary transition-shadow focus:border-admin-accent focus:outline-none focus:ring-2 focus:ring-admin-accent/20"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="mail-template-body"
              className="block text-[11px] font-semibold uppercase tracking-wider text-admin-text-muted"
            >
              模板正文
            </label>
            <textarea
              id="mail-template-body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              className="min-h-[280px] w-full resize-y rounded-xl border border-admin-border bg-white px-4 py-3 text-[13px] leading-6 text-admin-text-primary transition-shadow focus:border-admin-accent focus:outline-none focus:ring-2 focus:ring-admin-accent/20"
            />
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-admin-border bg-admin-elevated px-4 py-3 md:flex-row md:items-center md:justify-between">
            <p className="text-xs leading-5 text-admin-text-secondary">
              可用变量：{'{{subscriberName}}'}、{'{{productName}}'}、{'{{categoryName}}'}、{'{{month}}'}
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => handleTemplateChange(selectedTemplate?.id ?? '')}
                className="min-h-11 rounded-xl border border-admin-border px-5 py-2.5 text-[13px] font-medium text-admin-text-secondary transition-colors hover:bg-white"
              >
                取消编辑
              </button>
              <button
                type="button"
                onClick={handleSaveTemplate}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-admin-text-primary px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-black"
              >
                <Save className="h-4 w-4" aria-hidden="true" />
                保存模板
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BulkMailSender({
  data,
  subscribers
}: {
  data: SubscriberMailData;
  subscribers: SubscriberRow[];
}) {
  const templates = useMemo(() => getMailTemplates(data), [data]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id ?? '');
  const [sendStatus, setSendStatus] = useState('');
  const selectedTemplate =
    templates.find((template) => template.id === selectedTemplateId) ?? templates[0];

  function handleSendAll() {
    if (!selectedTemplate || subscribers.length === 0) {
      setSendStatus('没有可发送的模板或订阅者。');
      return;
    }

    setSendStatus(`已创建发送任务，将向 ${subscribers.length} 位订阅者发送。`);
  }

  return (
    <div
      data-testid="bulk-mail-sender"
      className="flex min-h-0 flex-1 flex-col gap-5 p-5"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h4 className="text-base font-semibold text-admin-text-primary">
            群发邮件
          </h4>
          <p className="mt-1 text-xs leading-5 text-admin-text-secondary">
            选择一个邮件模板，一次性发送给当前全部订阅者。
          </p>
        </div>
        <div className="rounded-xl border border-admin-border bg-white px-4 py-3 text-right">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-admin-text-muted">
            预计收件人
          </p>
          <p className="mt-1 text-sm font-semibold text-admin-text-primary">
            {subscribers.length} 位订阅者
          </p>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-3">
          <label
            htmlFor="bulk-mail-template"
            className="block text-[11px] font-semibold uppercase tracking-wider text-admin-text-muted"
          >
            选择邮件模板
          </label>
          <select
            id="bulk-mail-template"
            value={selectedTemplateId}
            onChange={(event) => {
              setSelectedTemplateId(event.target.value);
              setSendStatus('');
            }}
            className="w-full rounded-xl border border-admin-border bg-white px-4 py-2.5 text-[13px] text-admin-text-primary transition-shadow focus:border-admin-accent focus:outline-none focus:ring-2 focus:ring-admin-accent/20"
          >
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleSendAll}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-admin-text-primary px-5 py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-black"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            发送给全部订阅者
          </button>

          {sendStatus ? (
            <p className="rounded-xl border border-admin-border bg-admin-elevated px-4 py-3 text-xs leading-5 text-admin-text-secondary">
              {sendStatus}
            </p>
          ) : null}
        </div>

        <div className="min-h-0 rounded-2xl border border-admin-border bg-white p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-admin-text-muted">
            发送预览
          </p>
          <h5 className="mt-3 text-base font-semibold text-admin-text-primary">
            {selectedTemplate?.subject ?? '未选择模板'}
          </h5>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-admin-text-secondary">
            {selectedTemplate?.body ?? '请选择一个邮件模板后预览正文。'}
          </p>
        </div>
      </div>
    </div>
  );
}

export function SubscriberMailWorkspace({
  data,
  subscribers,
  initialTab = 'automation'
}: {
  data: SubscriberMailData;
  subscribers: SubscriberRow[];
  initialTab?: TabKey;
}) {
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const activeTabMeta = tabs.find((tab) => tab.key === activeTab) ?? tabs[0];

  return (
    <div className="grid min-h-full gap-4 xl:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="flex min-h-0 flex-col rounded-[20px] border border-admin-border bg-admin-surface shadow-[0_16px_48px_rgba(15,23,42,0.05)]">
        <div className="border-b border-admin-border px-4 py-3.5">
          <h3 className="text-lg font-semibold text-admin-text-primary font-display">
            邮件管理
          </h3>
        </div>
        <div
          role="tablist"
          aria-label="邮件订阅管理"
          className="grid flex-1 content-start gap-2 p-2.5"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = tab.key === activeTab;

            return (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.key)}
                className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-accent ${
                  isActive
                    ? 'border-admin-accent/20 bg-admin-accent/10 text-admin-accent'
                    : 'border-transparent bg-white text-admin-text-secondary hover:border-admin-border hover:bg-admin-elevated'
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                    isActive ? 'bg-white text-admin-accent' : 'bg-admin-elevated text-admin-text-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-semibold">
                    {tab.label}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-admin-text-muted">
                    {tab.detail}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {activeTab === 'subscribers' ? (
        <section data-testid="subscriber-mail-workspace-panel" className="min-h-0">
          <SubscriberTable subscribers={subscribers} />
        </section>
      ) : (
        <section
          data-testid="subscriber-mail-workspace-panel"
          className="flex min-h-0 flex-col rounded-[20px] border border-admin-border bg-admin-surface shadow-[0_16px_48px_rgba(15,23,42,0.05)]"
        >
          <div className="flex flex-col gap-3 border-b border-admin-border px-6 py-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="admin-kicker">Workspace Panel</p>
              <h3 className="mt-1 text-xl font-semibold text-admin-text-primary font-display">
                {activeTabMeta.label}
              </h3>
              <p className="mt-2 text-sm leading-6 text-admin-text-secondary">
                {activeTabMeta.detail}
              </p>
            </div>
            <span className="inline-flex w-fit rounded-full bg-admin-elevated px-3 py-1 text-xs font-semibold text-admin-text-muted">
              邮件订阅工作区
            </span>
          </div>

          {activeTab === 'automation' ? <SubscriberAutomationRules data={data} /> : null}
          {activeTab === 'templates' ? <MailTemplateManager data={data} /> : null}
          {activeTab === 'campaign' ? (
            <BulkMailSender data={data} subscribers={subscribers} />
          ) : null}
        </section>
      )}
    </div>
  );
}
