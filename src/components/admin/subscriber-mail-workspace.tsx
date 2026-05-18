'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  History,
  Plus,
  Save,
  Search,
  Send,
  Trash2,
  Users
} from 'lucide-react';
import { SubscriberAutomationRules } from './subscriber-notification-board';
import { SubscriberTable, type SubscriberRow, type SubscriberTableCopy } from './subscriber-table';
import { AdminTableShell } from './admin-table-shell';
import { StatusBadge } from './status-badge';

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

export type MailTemplateRow = {
  id: string;
  name: string;
  subject: string;
  body: string;
};

export type SentMailRecord = {
  id: string;
  templateId: string;
  templateName: string;
  sentAt: string;
  recipients: number;
  success: number;
  failed: number;
  status: '成功' | '部分成功' | '失败' | '待发送';
  errorMessage?: string | null;
};

type MailAutomationSetting = {
  trigger: 'product_new' | 'restock' | 'manual';
  frequencyCap: 'daily' | 'weekly' | 'unlimited';
  enabled: boolean;
};

type TabKey = 'automation' | 'mail' | 'sent' | 'subscribers';
type InitialTabKey = TabKey | 'templates' | 'campaign';

type SubscriberWorkspaceCopy = SubscriberTableCopy & {
  managementTitle: string;
  managementAriaLabel: string;
  automationRules: string;
  automationBoardDescription: string;
  triggerLabel: string;
  triggerProductNew: string;
  triggerRestock: string;
  triggerManual: string;
  frequencyLabel: string;
  frequencyDaily: string;
  frequencyWeekly: string;
  frequencyUnlimited: string;
  enableAutomation: string;
  saveRule: string;
  rulesSaved: string;
  rulesSaveError: string;
  currentQueue: string;
  mailWorkspace: string;
  sendToAll: string;
  sending: string;
  templateLibrary: string;
  processing: string;
  addTemplate: string;
  templateSearchLabel: string;
  templateSearchPlaceholder: string;
  selectTemplateLabel: string;
  deleteTemplateLabel: string;
  noTemplates: string;
  editorTitle: string;
  estimatedRecipients: string;
  recipientCount: string;
  successRate: string;
  deliveryStatus: string;
  templateName: string;
  templateSubject: string;
  templateBody: string;
  variablesLabel: string;
  variablesValue: string;
  deleteTemplate: string;
  saveTemplate: string;
  send: string;
  newTemplateName: string;
  newTemplateSubject: string;
  newTemplateBody: string;
  templateCreated: string;
  templateCreateError: string;
  templateRequiredError: string;
  templateSaved: string;
  templateSaveError: string;
  templateDeleted: string;
  templateDeleteError: string;
  sendUnavailable: string;
  sendCompleted: string;
  sendError: string;
  sentMail: string;
  sentSummary: string;
  selectAllSentLabel: string;
  sentAt: string;
  success: string;
  failed: string;
  status: string;
  actions: string;
  sentSuccessRate: string;
  sentSuccessValue: string;
  sentFailedValue: string;
  selectSentRecordLabel: string;
  deleteSentRecordLabel: string;
  noSentMail: string;
  sentDeleted: string;
  sentDeleteError: string;
  bulkDelete: string;
  bulkDeleteWithCount: string;
  sentPagination: string;
  failureLog: string;
  statusSuccess: string;
  statusPartial: string;
  statusFailed: string;
  statusPending: string;
  subscriberList: string;
};

const defaultSubscriberWorkspaceCopy: SubscriberWorkspaceCopy = {
  managementTitle: '邮件管理',
  managementAriaLabel: '邮件订阅管理',
  automationRules: '自动化发送规则',
  automationBoardDescription: '配置邮件触发条件与发送频率，确保推送策略精准高效。',
  triggerLabel: '触发条件',
  triggerProductNew: '产品上新时触发',
  triggerRestock: '库存补货时触发',
  triggerManual: '手动触发',
  frequencyLabel: '发送频率上限',
  frequencyDaily: '最多每天 1 封',
  frequencyWeekly: '最多每周 1 封',
  frequencyUnlimited: '无限制',
  enableAutomation: '启用自动化发送',
  saveRule: '保存规则',
  rulesSaved: '规则已保存。',
  rulesSaveError: '规则保存失败，请检查服务端日志。',
  currentQueue: '当前队列',
  mailWorkspace: '邮件模板与群发',
  sendToAll: '发送给全部订阅者',
  sending: '发送中...',
  templateLibrary: '模板库',
  processing: '处理中...',
  addTemplate: '新增模板',
  templateSearchLabel: '搜索邮件模板',
  templateSearchPlaceholder: '搜索模板',
  selectTemplateLabel: '选择并编辑模板 {name}',
  deleteTemplateLabel: '删除模板 {name}',
  noTemplates: '无匹配模板',
  editorTitle: '模板展示与编辑',
  estimatedRecipients: '预计收件人',
  recipientCount: '{count} 位订阅者',
  successRate: '成功率',
  deliveryStatus: '发送状态',
  templateName: '模板名称',
  templateSubject: '模板主题',
  templateBody: '模板正文',
  variablesLabel: '变量：{variables}',
  variablesValue: '{{subscriberName}}、{{productName}}、{{categoryName}}、{{month}}',
  deleteTemplate: '删除模板',
  saveTemplate: '保存模板',
  send: '发送',
  newTemplateName: '新邮件模板',
  newTemplateSubject: '未命名主题',
  newTemplateBody: '请输入邮件正文。',
  templateCreated: '模板已创建。',
  templateCreateError: '模板创建失败，请稍后重试。',
  templateRequiredError: '模板名称、主题和正文不能为空。',
  templateSaved: '模板已保存。',
  templateSaveError: '模板保存失败，请稍后重试。',
  templateDeleted: '模板已删除。',
  templateDeleteError: '模板删除失败，请稍后重试。',
  sendUnavailable: '没有可发送的模板或订阅者。',
  sendCompleted: '发送任务已完成，成功 {success} 封，失败 {failed} 封。',
  sendError: '发送任务创建失败，请检查 SMTP 配置和服务端日志。',
  sentMail: '已发送邮件',
  sentSummary: '成功 {success} 封 · 失败 {failed} 封',
  selectAllSentLabel: '全选当前页邮件记录',
  sentAt: '发送时间',
  success: '成功',
  failed: '失败',
  status: '状态',
  actions: '操作',
  sentSuccessRate: '成功率 {rate}',
  sentSuccessValue: '成功 {count}',
  sentFailedValue: '失败 {count}',
  selectSentRecordLabel: '选择邮件记录 {name}',
  deleteSentRecordLabel: '删除邮件记录 {name}',
  noSentMail: '暂无已发送邮件。',
  sentDeleted: '已删除 {count} 条发送记录。',
  sentDeleteError: '删除失败，请稍后重试。',
  bulkDelete: '批量删除',
  bulkDeleteWithCount: '批量删除 ({count})',
  sentPagination: '每页 {pageSize} 封 · 共 {total} 封 · 第 {page} / {totalPages} 页',
  failureLog: '失败日志',
  statusSuccess: '成功',
  statusPartial: '部分成功',
  statusFailed: '失败',
  statusPending: '待发送',
  subscriberList: '订阅者列表',
  searchPlaceholder: '搜索邮箱...',
  searchLabel: '搜索订阅邮箱',
  addSubscriber: '新增订阅者',
  openAddDialog: '打开新增订阅者弹窗',
  addDescription: '输入邮箱后会以活跃状态加入当前订阅者列表。',
  closeAddDialog: '关闭新增订阅者弹窗',
  emailLabel: '订阅邮箱',
  emailPlaceholder: '输入订阅者邮箱',
  cancel: '取消',
  saving: '保存中...',
  saveSubscriber: '保存订阅者',
  columns: {
    email: '邮箱',
    status: '状态',
    createdAt: '订阅时间',
    preference: '触达偏好',
    actions: '操作'
  },
  active: '活跃',
  inactive: '已停用',
  preferenceValue: '新品 / 简报',
  deleteLabel: '删除订阅者 {email}',
  deleting: '删除中',
  delete: '删除',
  empty: '没有匹配的订阅者。',
  pagination: '每页 {pageSize} 位 · 当前显示 {visible} 位 · 第 {page} / {totalPages} 页',
  previousPage: '上一页',
  nextPage: '下一页',
  invalidEmail: '请输入有效的邮箱地址。',
  duplicateEmail: '该邮箱已在订阅者列表中。',
  saveError: '订阅者保存失败，请稍后重试。'
};

function getTabs(copy: SubscriberWorkspaceCopy): ReadonlyArray<{
  key: TabKey;
  label: string;
  icon: typeof Send;
}> {
  return [
  {
    key: 'automation',
    label: copy.automationRules,
    icon: Send
  },
  {
    key: 'mail',
    label: copy.mailWorkspace,
    icon: FileText
  },
  {
    key: 'sent',
    label: copy.sentMail,
    icon: History
  },
  {
    key: 'subscribers',
    label: copy.subscriberList,
    icon: Users
  }
  ];
}

function getSentMailTone(status: SentMailRecord['status']) {
  if (status === '成功') {
    return 'green';
  }

  if (status === '部分成功') {
    return 'amber';
  }

  if (status === '待发送') {
    return 'slate';
  }

  return 'danger';
}

function getSuccessRate(record: SentMailRecord) {
  if (record.recipients === 0) {
    return '0%';
  }

  return `${Math.round((record.success / record.recipients) * 100)}%`;
}

const SENT_MAIL_PAGE_SIZE = 8;

function formatCopy(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template
  );
}

function getStatusLabel(status: SentMailRecord['status'] | '待发送', copy: SubscriberWorkspaceCopy) {
  if (status === '成功') {
    return copy.statusSuccess;
  }

  if (status === '部分成功') {
    return copy.statusPartial;
  }

  if (status === '失败') {
    return copy.statusFailed;
  }

  return copy.statusPending;
}

function StatusWithFailureLog({
  status,
  errorMessage,
  copy
}: {
  status: SentMailRecord['status'] | '待发送';
  errorMessage?: string | null;
  copy: SubscriberWorkspaceCopy;
}) {
  const hasFailureLog = Boolean(errorMessage && status !== '成功' && status !== '待发送');
  const label = getStatusLabel(status, copy);

  if (!hasFailureLog) {
    return <StatusBadge label={label} tone={getSentMailTone(status)} />;
  }

  return (
    <span
      className="group relative inline-flex"
      title={errorMessage ?? undefined}
      tabIndex={0}
    >
      <StatusBadge label={label} tone={getSentMailTone(status)} />
      <span className="pointer-events-none absolute right-0 top-full z-30 mt-2 w-72 rounded-xl border border-admin-danger/20 bg-white px-3 py-2 text-left text-[11px] leading-5 text-admin-text-secondary opacity-0 shadow-[0_16px_40px_rgba(15,23,42,0.18)] transition-opacity group-hover:opacity-100 group-focus:opacity-100">
        <span className="block font-semibold text-admin-danger">{copy.failureLog}</span>
        <span className="mt-1 block break-words">{errorMessage}</span>
      </span>
    </span>
  );
}

function MailTemplateCampaignWorkspace({
  initialTemplates,
  subscribers,
  sentRecords,
  setSentRecords,
  copy
}: {
  initialTemplates: ReadonlyArray<MailTemplateRow>;
  subscribers: SubscriberRow[];
  sentRecords: SentMailRecord[];
  setSentRecords: React.Dispatch<React.SetStateAction<SentMailRecord[]>>;
  copy: SubscriberWorkspaceCopy;
}) {
  const [templates, setTemplates] = useState(() => [...initialTemplates]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id ?? '');
  const selectedTemplate =
    templates.find((template) => template.id === selectedTemplateId) ?? templates[0];
  const [templateQuery, setTemplateQuery] = useState('');
  const [templateName, setTemplateName] = useState(selectedTemplate?.name ?? '');
  const [subject, setSubject] = useState(selectedTemplate?.subject ?? '');
  const [body, setBody] = useState(selectedTemplate?.body ?? '');
  const [sendStatus, setSendStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const selectedTemplateRecords = sentRecords.filter(
    (record) => record.templateId === selectedTemplateId
  );
  const latestSelectedRecord = selectedTemplateRecords[0];
  const deliveryStatus = latestSelectedRecord?.status ?? '待发送';
  const totalSent = sentRecords.reduce((total, record) => total + record.recipients, 0);
  const totalSuccess = sentRecords.reduce((total, record) => total + record.success, 0);
  const overallSuccessRate =
    totalSent > 0 ? `${Math.round((totalSuccess / totalSent) * 100)}%` : '0%';
  const previewTemplate = selectedTemplate
    ? {
        ...selectedTemplate,
        subject,
        body
      }
    : null;
  const filteredTemplates = useMemo(() => {
    const normalizedQuery = templateQuery.trim().toLowerCase();

    return normalizedQuery
      ? templates.filter((template) =>
          `${template.name} ${template.subject} ${template.body}`
            .toLowerCase()
            .includes(normalizedQuery)
        )
      : templates;
  }, [templateQuery, templates]);

  function loadTemplate(templateId: string) {
    const nextTemplate = templates.find((template) => template.id === templateId);
    setSelectedTemplateId(templateId);
    setTemplateName(nextTemplate?.name ?? '');
    setSubject(nextTemplate?.subject ?? '');
    setBody(nextTemplate?.body ?? '');
    setSendStatus('');
  }

  async function handleCreateTemplate() {
    setIsSaving(true);
    setSendStatus('');

    try {
      const response = await fetch('/api/admin/mail-templates', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          name: copy.newTemplateName,
          subject: copy.newTemplateSubject,
          body: copy.newTemplateBody
        })
      });

      if (!response.ok) {
        throw new Error('CREATE_TEMPLATE_FAILED');
      }

      const payload = (await response.json()) as {
        template: MailTemplateRow;
      };
      const newTemplate = payload.template;

      setTemplates((currentTemplates) => [newTemplate, ...currentTemplates]);
      setTemplateQuery('');
      setSelectedTemplateId(newTemplate.id);
      setTemplateName(newTemplate.name);
      setSubject(newTemplate.subject);
      setBody(newTemplate.body);
      setSendStatus(copy.templateCreated);
    } catch {
      setSendStatus(copy.templateCreateError);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveTemplate() {
    if (!selectedTemplate || !templateName.trim() || !subject.trim() || !body.trim()) {
      setSendStatus(copy.templateRequiredError);
      return;
    }

    const nextTemplate = {
      ...selectedTemplate,
      name: templateName.trim(),
      subject,
      body
    };

    setIsSaving(true);
    setSendStatus('');

    try {
      const response = await fetch(`/api/admin/mail-templates/${selectedTemplateId}`, {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          name: nextTemplate.name,
          subject: nextTemplate.subject,
          body: nextTemplate.body
        })
      });

      if (!response.ok) {
        throw new Error('SAVE_TEMPLATE_FAILED');
      }

      const payload = (await response.json()) as {
        template: MailTemplateRow;
      };

      setTemplates((currentTemplates) =>
        currentTemplates.map((template) =>
          template.id === selectedTemplateId ? payload.template : template
        )
      );
      setSentRecords((currentRecords) =>
        currentRecords.map((record) =>
          record.templateId === selectedTemplateId
            ? {
                ...record,
                templateName: payload.template.name
              }
            : record
        )
      );
      setSendStatus(copy.templateSaved);
    } catch {
      setSendStatus(copy.templateSaveError);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteTemplate(templateId = selectedTemplateId) {
    const templateToDelete = templates.find((template) => template.id === templateId);

    if (!templateToDelete) {
      return;
    }

    setIsSaving(true);
    setSendStatus('');

    try {
      const response = await fetch(`/api/admin/mail-templates/${templateId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('DELETE_TEMPLATE_FAILED');
      }

    const remainingTemplates = templates.filter((template) => template.id !== templateId);
    const nextTemplate = remainingTemplates[0];

    setTemplates(remainingTemplates);
    setSentRecords((currentRecords) =>
      currentRecords.filter((record) => record.templateId !== templateId)
    );
    setSelectedTemplateId(nextTemplate?.id ?? '');
    setTemplateName(nextTemplate?.name ?? '');
    setSubject(nextTemplate?.subject ?? '');
    setBody(nextTemplate?.body ?? '');
      setSendStatus(copy.templateDeleted);
    } catch {
      setSendStatus(copy.templateDeleteError);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSendAll() {
    if (!previewTemplate || subscribers.length === 0) {
      setSendStatus(copy.sendUnavailable);
      return;
    }

    setIsSending(true);
    setSendStatus('');

    try {
      const response = await fetch('/api/admin/mail-campaigns', {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          templateId: previewTemplate.id,
          subject,
          body
        })
      });

      if (!response.ok) {
        throw new Error('SEND_CAMPAIGN_FAILED');
      }

      const payload = (await response.json()) as {
        campaign: SentMailRecord;
      };

      setSentRecords((currentRecords) => [payload.campaign, ...currentRecords]);
      setSendStatus(
        formatCopy(copy.sendCompleted, {
          success: payload.campaign.success,
          failed: payload.campaign.failed
        })
      );
    } catch {
      setSendStatus(copy.sendError);
    } finally {
      setIsSending(false);
    }
  }

  const toolbar = (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={handleSendAll}
        disabled={!previewTemplate || subscribers.length === 0 || isSending}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-admin-text-primary px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-black"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        {isSending ? copy.sending : copy.sendToAll}
      </button>
    </div>
  );

  return (
    <div
      data-testid="bulk-mail-sender"
      data-layout="full-page"
      className="flex h-full min-h-0 flex-1 flex-col"
    >
      <AdminTableShell
        title={copy.mailWorkspace}
        kicker={null}
        compact
        toolbar={toolbar}
        fullHeight
      >
        <div className="grid h-full min-h-0 gap-4 p-4 xl:grid-cols-[minmax(300px,0.66fr)_minmax(0,1.34fr)]">
          <section
            data-testid="mail-template-list"
            className="flex min-h-0 flex-col rounded-2xl border border-admin-border bg-white"
          >
            <div className="flex items-center justify-between gap-3 border-b border-admin-border px-4 py-4">
              <div>
                <h4 className="text-base font-semibold text-admin-text-primary">
                  {copy.templateLibrary}
                </h4>
              </div>
              <button
                type="button"
                onClick={handleCreateTemplate}
                disabled={isSaving}
                className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-admin-text-primary px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                {isSaving ? copy.processing : copy.addTemplate}
              </button>
            </div>
            <div className="border-b border-admin-border p-3">
              <label htmlFor="mail-template-search" className="sr-only">
                {copy.templateSearchLabel}
              </label>
              <div className="flex min-h-10 items-center gap-2 rounded-xl border border-admin-border bg-white px-3 focus-within:border-admin-accent focus-within:ring-2 focus-within:ring-admin-accent/20">
                <Search className="h-4 w-4 shrink-0 text-admin-text-muted" aria-hidden="true" />
                <input
                  id="mail-template-search"
                  value={templateQuery}
                  onChange={(event) => setTemplateQuery(event.target.value)}
                  placeholder={copy.templateSearchPlaceholder}
                  className="h-9 min-w-0 flex-1 bg-transparent text-[13px] text-admin-text-primary outline-none placeholder:text-admin-text-muted"
                />
              </div>
            </div>
            <div className="grid min-h-0 flex-1 content-start gap-2 overflow-y-auto p-3">
              {filteredTemplates.map((template) => {
                const isSelected = template.id === selectedTemplateId;

                return (
                  <div
                    key={template.id}
                    className={`grid min-h-[64px] grid-cols-[minmax(0,1fr)_36px] items-center gap-2 rounded-lg border px-3 py-2.5 transition-colors ${
                      isSelected
                        ? 'border-admin-success bg-admin-success/10 text-admin-success'
                        : 'border-admin-border bg-white text-admin-text-secondary hover:bg-admin-elevated'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => loadTemplate(template.id)}
                      aria-label={formatCopy(copy.selectTemplateLabel, { name: template.name })}
                      className="flex min-w-0 items-start gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-accent"
                    >
                      <FileText className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      <span className="min-w-0">
                        <span className="block truncate text-[13px] font-semibold">
                          {template.name}
                        </span>
                        <span className="mt-1 line-clamp-2 block text-[11px] leading-4 text-admin-text-muted">
                          {template.subject}
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTemplate(template.id)}
                      disabled={isSaving}
                      aria-label={formatCopy(copy.deleteTemplateLabel, { name: template.name })}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-admin-text-muted transition-colors hover:bg-white hover:text-admin-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-accent"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                );
              })}
              {filteredTemplates.length === 0 ? (
                <p className="rounded-xl border border-dashed border-admin-border px-3 py-6 text-center text-xs text-admin-text-muted">
                  {copy.noTemplates}
                </p>
              ) : null}
            </div>
          </section>

          <div className="flex min-h-0 flex-col">
            <section
              data-testid="bulk-mail-campaign-list"
              className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-admin-border bg-white"
            >
              <div className="border-b border-admin-border bg-admin-elevated px-4 py-3">
                <h4 className="text-base font-semibold text-admin-text-primary">
                  {copy.editorTitle}
                </h4>
              </div>

              <div className="grid grid-cols-3 border-b border-admin-border px-4 py-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-admin-text-muted">
                    {copy.estimatedRecipients}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-admin-text-primary">
                    {formatCopy(copy.recipientCount, { count: subscribers.length })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-admin-text-muted">
                    {copy.successRate}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-admin-text-primary">
                    {overallSuccessRate}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-admin-text-muted">
                    {copy.deliveryStatus}
                  </p>
                  <div className="mt-1">
                    <StatusWithFailureLog
                      status={deliveryStatus}
                      errorMessage={latestSelectedRecord?.errorMessage}
                      copy={copy}
                    />
                  </div>
                </div>
              </div>

              <div
                data-testid="mail-template-editor-panel"
                className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4"
              >
                <div className="grid gap-4 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                  <div className="space-y-2">
                    <label
                      htmlFor="mail-template-name"
                      className="block text-[11px] font-semibold uppercase tracking-wider text-admin-text-muted"
                    >
                      {copy.templateName}
                    </label>
                    <input
                      id="mail-template-name"
                      value={templateName}
                      onChange={(event) => {
                        setTemplateName(event.target.value);
                        setSendStatus('');
                      }}
                      className="w-full rounded-xl border border-admin-border bg-white px-4 py-2.5 text-[13px] text-admin-text-primary transition-shadow focus:border-admin-accent focus:outline-none focus:ring-2 focus:ring-admin-accent/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="mail-template-subject"
                      className="block text-[11px] font-semibold uppercase tracking-wider text-admin-text-muted"
                    >
                      {copy.templateSubject}
                    </label>
                    <input
                      id="mail-template-subject"
                      value={subject}
                      onChange={(event) => {
                        setSubject(event.target.value);
                        setSendStatus('');
                      }}
                      className="w-full rounded-xl border border-admin-border bg-white px-4 py-2.5 text-[13px] text-admin-text-primary transition-shadow focus:border-admin-accent focus:outline-none focus:ring-2 focus:ring-admin-accent/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="mail-template-body"
                    className="block text-[11px] font-semibold uppercase tracking-wider text-admin-text-muted"
                  >
                    {copy.templateBody}
                  </label>
                  <textarea
                    id="mail-template-body"
                    value={body}
                    onChange={(event) => {
                      setBody(event.target.value);
                      setSendStatus('');
                    }}
                    className="min-h-[220px] w-full resize-y rounded-xl border border-admin-border bg-white px-4 py-3 text-[13px] leading-6 text-admin-text-primary transition-shadow focus:border-admin-accent focus:outline-none focus:ring-2 focus:ring-admin-accent/20"
                  />
                </div>

                <p className="rounded-xl border border-admin-border bg-admin-elevated px-4 py-3 text-xs leading-5 text-admin-text-secondary">
                  {formatCopy(copy.variablesLabel, {
                    variables: copy.variablesValue
                  })}
                </p>
              </div>

              {sendStatus ? (
                <p className="border-t border-admin-border px-4 py-3 text-xs leading-5 text-admin-text-secondary">
                  {sendStatus}
                </p>
              ) : null}

              <div className="flex flex-col-reverse gap-2 border-t border-admin-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => handleDeleteTemplate()}
                  disabled={!selectedTemplate || isSaving}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  {copy.deleteTemplate}
                </button>
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleSaveTemplate}
                    disabled={!selectedTemplate || !templateName.trim() || isSaving}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-admin-text-primary px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" aria-hidden="true" />
                    {isSaving ? copy.saving : copy.saveTemplate}
                  </button>
                  <button
                    type="button"
                    onClick={handleSendAll}
                    disabled={!previewTemplate || subscribers.length === 0 || isSending}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-admin-border px-4 py-2 text-[13px] font-medium text-admin-text-secondary transition-colors hover:bg-admin-elevated disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                    {isSending ? copy.sending : copy.send}
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </AdminTableShell>
    </div>
  );
}

function SentMailHistoryWorkspace({
  sentRecords,
  setSentRecords,
  copy
}: {
  sentRecords: SentMailRecord[];
  setSentRecords: React.Dispatch<React.SetStateAction<SentMailRecord[]>>;
  copy: SubscriberWorkspaceCopy;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionStatus, setActionStatus] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const totalSuccess = sentRecords.reduce((total, record) => total + record.success, 0);
  const totalFailed = sentRecords.reduce((total, record) => total + record.failed, 0);
  const totalPages = Math.max(1, Math.ceil(sentRecords.length / SENT_MAIL_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * SENT_MAIL_PAGE_SIZE;
  const visibleRecords = sentRecords.slice(pageStart, pageStart + SENT_MAIL_PAGE_SIZE);
  const visibleRecordIds = visibleRecords.map((record) => record.id);
  const allVisibleSelected =
    visibleRecordIds.length > 0 && visibleRecordIds.every((id) => selectedIds.includes(id));
  const hasSelected = selectedIds.length > 0;

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  useEffect(() => {
    const availableIds = new Set(sentRecords.map((record) => record.id));
    setSelectedIds((ids) => ids.filter((id) => availableIds.has(id)));
  }, [sentRecords]);

  function toggleRecord(recordId: string) {
    setActionStatus('');
    setSelectedIds((ids) =>
      ids.includes(recordId)
        ? ids.filter((id) => id !== recordId)
        : [...ids, recordId]
    );
  }

  function toggleVisibleRecords() {
    setActionStatus('');
    setSelectedIds((ids) => {
      if (allVisibleSelected) {
        return ids.filter((id) => !visibleRecordIds.includes(id));
      }

      return Array.from(new Set([...ids, ...visibleRecordIds]));
    });
  }

  async function deleteRecords(ids: string[]) {
    const uniqueIds = Array.from(new Set(ids));

    if (uniqueIds.length === 0) {
      return;
    }

    setIsDeleting(true);
    setActionStatus('');

    try {
      const response = await fetch('/api/admin/mail-campaigns', {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({ ids: uniqueIds })
      });

      if (!response.ok) {
        throw new Error('DELETE_MAIL_CAMPAIGNS_FAILED');
      }

      setSentRecords((records) => records.filter((record) => !uniqueIds.includes(record.id)));
      setSelectedIds((ids) => ids.filter((id) => !uniqueIds.includes(id)));
      setActionStatus(formatCopy(copy.sentDeleted, { count: uniqueIds.length }));
    } catch {
      setActionStatus(copy.sentDeleteError);
    } finally {
      setIsDeleting(false);
    }
  }

  const toolbar = (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => deleteRecords(selectedIds)}
        disabled={!hasSelected || isDeleting}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-[13px] font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        {isDeleting
          ? `${copy.deleting}...`
          : hasSelected
            ? formatCopy(copy.bulkDeleteWithCount, { count: selectedIds.length })
            : copy.bulkDelete}
      </button>
    </div>
  );

  return (
    <div
      data-testid="sent-mail-history"
      data-layout="full-page"
      className="flex h-full min-h-0 flex-1 flex-col"
    >
      <AdminTableShell
        title={copy.sentMail}
        description={formatCopy(copy.sentSummary, {
          success: totalSuccess,
          failed: totalFailed
        })}
        kicker={null}
        compact
        toolbar={toolbar}
        fullHeight
      >
        <div className="flex h-full min-h-0 flex-col p-4">
          <div className="hidden grid-cols-[40px_minmax(0,1fr)_96px_96px_96px_44px] items-center border border-admin-border bg-admin-elevated px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-admin-text-muted lg:grid">
            <label className="inline-flex h-8 w-8 items-center justify-center">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={toggleVisibleRecords}
                disabled={visibleRecords.length === 0}
                aria-label={copy.selectAllSentLabel}
                className="h-4 w-4 rounded border-admin-border text-admin-accent focus:ring-admin-accent"
              />
            </label>
            <span>{copy.sentAt}</span>
            <span>{copy.success}</span>
            <span>{copy.failed}</span>
            <span className="text-right">{copy.status}</span>
            <span className="text-right">{copy.actions}</span>
          </div>
          <div className="min-h-0 flex-1 divide-y divide-admin-border overflow-y-auto border-x border-admin-border bg-white">
            {visibleRecords.map((record) => (
              <div
                key={record.id}
                className="grid gap-3 px-4 py-3 text-xs transition-colors hover:bg-admin-elevated lg:grid-cols-[40px_minmax(0,1fr)_96px_96px_96px_44px] lg:items-center"
              >
                <label className="inline-flex h-8 w-8 items-center justify-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(record.id)}
                    onChange={() => toggleRecord(record.id)}
                    aria-label={formatCopy(copy.selectSentRecordLabel, {
                      name: record.templateName
                    })}
                    className="h-4 w-4 rounded border-admin-border text-admin-accent focus:ring-admin-accent"
                  />
                </label>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-admin-text-primary">
                    {record.templateName}
                  </p>
                  <p className="mt-1 text-[11px] text-admin-text-muted">
                    {record.sentAt} · {formatCopy(copy.sentSuccessRate, {
                      rate: getSuccessRate(record)
                    })}
                  </p>
                </div>
                <p className="text-admin-text-secondary">
                  {formatCopy(copy.sentSuccessValue, { count: record.success })}
                </p>
                <p className="text-admin-text-secondary">
                  {formatCopy(copy.sentFailedValue, { count: record.failed })}
                </p>
                <div className="flex justify-start lg:justify-end">
                  <StatusWithFailureLog
                    status={record.status}
                    errorMessage={record.errorMessage}
                    copy={copy}
                  />
                </div>
                <div className="flex justify-start lg:justify-end">
                  <button
                    type="button"
                    onClick={() => deleteRecords([record.id])}
                    disabled={isDeleting}
                    aria-label={formatCopy(copy.deleteSentRecordLabel, {
                      name: record.templateName
                    })}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-admin-text-muted transition-colors hover:bg-red-50 hover:text-admin-danger disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-accent"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
            {sentRecords.length === 0 ? (
              <p className="m-4 rounded-xl border border-dashed border-admin-border bg-admin-elevated px-4 py-8 text-center text-xs text-admin-text-muted">
                {copy.noSentMail}
              </p>
            ) : null}
          </div>
          {actionStatus ? (
            <p className="border-x border-admin-border bg-white px-4 py-2 text-xs text-admin-text-secondary">
              {actionStatus}
            </p>
          ) : null}
          <div
            data-testid="sent-mail-history-pagination"
            className="flex flex-col gap-3 rounded-b-2xl border border-admin-border bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safePage === 1}
                aria-label={copy.previousPage}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-admin-border px-3 text-xs font-medium text-admin-text-secondary transition-colors hover:bg-admin-elevated"
              >
                <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                {copy.previousPage}
              </button>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-admin-text-primary text-xs font-semibold text-white">
                {safePage}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={safePage === totalPages}
                aria-label={copy.nextPage}
                className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-admin-border px-3 text-xs font-medium text-admin-text-secondary transition-colors hover:bg-admin-elevated"
              >
                {copy.nextPage}
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
            <p className="text-xs text-admin-text-secondary">
              {formatCopy(copy.sentPagination, {
                pageSize: SENT_MAIL_PAGE_SIZE,
                total: sentRecords.length,
                page: safePage,
                totalPages
              })}
            </p>
          </div>
        </div>
      </AdminTableShell>
    </div>
  );
}

export function SubscriberMailWorkspace({
  data,
  subscribers,
  templates = data.templates ?? [],
  sentRecords: initialSentRecords = [],
  automation,
  initialTab = 'automation',
  copy = defaultSubscriberWorkspaceCopy
}: {
  data: SubscriberMailData;
  subscribers: SubscriberRow[];
  templates?: ReadonlyArray<MailTemplateRow>;
  sentRecords?: SentMailRecord[];
  automation?: MailAutomationSetting;
  initialTab?: InitialTabKey;
  copy?: SubscriberWorkspaceCopy;
}) {
  const normalizedInitialTab = initialTab === 'templates' || initialTab === 'campaign'
    ? 'mail'
    : initialTab;
  const tabs = getTabs(copy);
  const [activeTab, setActiveTab] = useState<TabKey>(normalizedInitialTab);
  const activeTabMeta = tabs.find((tab) => tab.key === activeTab) ?? tabs[0];
  const [sentRecords, setSentRecords] = useState<SentMailRecord[]>(() => initialSentRecords);

  return (
    <div className="grid h-full min-h-0 gap-3 xl:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="flex h-full min-h-0 flex-col rounded-[18px] border border-admin-border bg-admin-surface shadow-[0_16px_48px_rgba(15,23,42,0.05)]">
        <div className="border-b border-admin-border px-5 py-4">
          <h3 className="mt-1 text-xl font-semibold text-admin-text-primary font-display">
            {copy.managementTitle}
          </h3>
        </div>
        <div
          role="tablist"
          aria-label={copy.managementAriaLabel}
          className="grid min-h-0 flex-1 content-start gap-2 overflow-y-auto p-2"
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
                className={`flex min-h-12 w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-accent ${
                  isActive
                    ? 'border-admin-accent/20 bg-admin-accent/10 text-admin-accent'
                    : 'border-transparent bg-white text-admin-text-secondary hover:border-admin-border hover:bg-admin-elevated'
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    isActive ? 'bg-white text-admin-accent' : 'bg-admin-elevated text-admin-text-muted'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13px] font-semibold">
                    {tab.label}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {activeTab === 'subscribers' ? (
        <section
          data-testid="subscriber-mail-workspace-panel"
          className="flex h-full min-h-0 flex-col"
        >
          <SubscriberTable subscribers={subscribers} framed copy={copy} />
        </section>
      ) : activeTab === 'sent' ? (
        <section
          data-testid="subscriber-mail-workspace-panel"
          className="flex h-full min-h-0 flex-col"
        >
          <SentMailHistoryWorkspace
            sentRecords={sentRecords}
            setSentRecords={setSentRecords}
            copy={copy}
          />
        </section>
      ) : activeTab === 'mail' ? (
        <section
          data-testid="subscriber-mail-workspace-panel"
          className="flex h-full min-h-0 flex-col"
        >
          <MailTemplateCampaignWorkspace
            initialTemplates={templates}
            subscribers={subscribers}
            sentRecords={sentRecords}
            setSentRecords={setSentRecords}
            copy={copy}
          />
        </section>
      ) : (
        <section
          data-testid="subscriber-mail-workspace-panel"
          className="flex h-full min-h-0 flex-col rounded-[18px] border border-admin-border bg-admin-surface shadow-[0_16px_48px_rgba(15,23,42,0.05)]"
        >
          <div className="flex flex-col gap-3 border-b border-admin-border px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-admin-text-primary font-display">
                {activeTabMeta.label}
              </h3>
            </div>
          </div>

          {activeTab === 'automation' ? (
            <SubscriberAutomationRules data={data} automation={automation} copy={copy} />
          ) : null}
        </section>
      )}
    </div>
  );
}
