'use client';

import React, { useState } from 'react';

type SystemSettingItem = {
  label: string;
  value: string;
  note?: string;
  masked?: boolean;
};

type SystemSettingGroup = {
  key: string;
  title: string;
  description: string;
  items: SystemSettingItem[];
};

export type SystemSettingsViewModel = {
  email: {
    fromAddress: string;
    smtpHost: string;
    smtpPort: string;
    smtpUser: string;
    enabled: boolean;
  };
  database: {
    provider: string;
    url: string;
    status: string;
  };
  storage: {
    uploadRoot: string;
    productImages: string;
    categoryImages: string;
    bannerImages: string;
  };
  llm: {
    provider: string;
    model: string;
    apiBaseUrl: string;
    apiKeyConfigured: boolean;
  };
};

function getSecretStatus(isConfigured: boolean) {
  return isConfigured ? '已配置' : '未配置';
}

function getGroups(settings: SystemSettingsViewModel): SystemSettingGroup[] {
  return [
    {
      key: 'email',
      title: '邮箱配置',
      description: '展示前台联系邮箱与 SMTP 发送服务状态。',
      items: [
        { label: '发件邮箱', value: settings.email.fromAddress },
        { label: 'SMTP 主机', value: settings.email.smtpHost },
        { label: 'SMTP 端口', value: settings.email.smtpPort },
        { label: 'SMTP 用户名', value: settings.email.smtpUser },
        {
          label: '发送服务',
          value: settings.email.enabled ? '已启用' : '未启用'
        }
      ]
    },
    {
      key: 'database',
      title: '数据库配置',
      description: '展示后台当前连接的数据源类型与连接状态。',
      items: [
        { label: '数据库类型', value: settings.database.provider },
        {
          label: '连接地址',
          value: settings.database.url,
          masked: true,
          note: '敏感连接串仅展示配置状态。'
        },
        { label: '连接状态', value: settings.database.status }
      ]
    },
    {
      key: 'storage',
      title: '本地存储路径',
      description: '展示上传文件在服务器本地的归档路径。',
      items: [
        { label: '上传根路径', value: settings.storage.uploadRoot },
        { label: '商品图片路径', value: settings.storage.productImages },
        { label: '分类图片路径', value: settings.storage.categoryImages },
        { label: '轮播图路径', value: settings.storage.bannerImages }
      ]
    },
    {
      key: 'llm',
      title: '大模型相关配置',
      description: '展示 AI 服务商、模型和密钥配置状态。',
      items: [
        { label: '服务商', value: settings.llm.provider },
        { label: '模型名', value: settings.llm.model },
        { label: 'API 地址', value: settings.llm.apiBaseUrl },
        {
          label: 'OPENAI_API_KEY',
          value: getSecretStatus(settings.llm.apiKeyConfigured),
          note: '密钥不在页面明文展示。'
        }
      ]
    }
  ];
}

export function SystemSettingsPanel({
  settings
}: {
  settings: SystemSettingsViewModel;
}) {
  const groups = getGroups(settings);
  const [activeKey, setActiveKey] = useState(groups[0]?.key ?? 'email');
  const activeGroup = groups.find((group) => group.key === activeKey) ?? groups[0];

  return (
    <div className="grid min-h-[calc(100vh-104px)] gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="flex min-h-0 flex-col rounded-[20px] border border-admin-border bg-admin-surface shadow-[0_12px_34px_rgba(15,23,42,0.04)]">
        <div className="border-b border-admin-border px-4 py-4">
          <p className="admin-kicker">Categories</p>
          <h3 className="mt-1 text-lg font-semibold text-admin-text-primary font-display">
            配置类别
          </h3>
          <p className="mt-1.5 text-xs leading-5 text-admin-text-secondary">
            按运行模块查看关键配置状态。
          </p>
        </div>
        <nav className="grid flex-1 content-start gap-1.5 p-2.5" aria-label="系统设置配置类别">
          {groups.map((group) => (
            <button
              type="button"
              key={group.key}
              aria-pressed={activeGroup?.key === group.key}
              onClick={() => setActiveKey(group.key)}
              className={`flex min-h-12 w-full flex-col justify-center rounded-xl px-3.5 py-2.5 text-left transition hover:bg-admin-elevated focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-admin-accent ${
                activeGroup?.key === group.key
                  ? 'bg-emerald-50 text-admin-accent'
                  : 'text-admin-text-primary'
              }`}
            >
              <span className="text-sm font-semibold">{group.title}</span>
              <span className="mt-0.5 text-[11px] leading-4 text-admin-text-muted">
                {group.items.length} 个配置项
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <section
        data-testid="system-setting-detail-panel"
        className="flex min-h-0 flex-col rounded-[20px] border border-admin-border bg-admin-surface shadow-[0_12px_34px_rgba(15,23,42,0.04)]"
      >
        <div className="flex flex-col gap-2 border-b border-admin-border px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="admin-kicker">Configuration</p>
            <h3 className="mt-1 text-lg font-semibold text-admin-text-primary font-display">
              配置项
            </h3>
            <p className="mt-1.5 text-xs leading-5 text-admin-text-secondary">
              当前为只读展示，敏感信息仅呈现配置状态。
            </p>
          </div>
          {activeGroup ? (
            <span className="inline-flex w-fit rounded-full bg-admin-elevated px-3 py-1 text-xs font-semibold text-admin-text-muted">
              {activeGroup.title} · {activeGroup.items.length} 项
            </span>
          ) : null}
        </div>
        <div className="min-h-0 flex-1 px-4 py-4">
          {activeGroup ? (
            <section
              key={activeGroup.key}
              data-testid="system-setting-active-panel"
              className="flex min-h-full flex-col"
            >
              <div>
                <div>
                  <h4 className="text-base font-bold text-admin-text-primary">
                    {activeGroup.title}
                  </h4>
                  <p className="mt-1 text-sm leading-6 text-admin-text-secondary">
                    {activeGroup.description}
                  </p>
                </div>
              </div>
              <dl
                data-testid="system-setting-config-list"
                className="mt-4 divide-y divide-admin-border overflow-hidden rounded-xl border border-admin-border bg-white"
              >
                {activeGroup.items.map((item) => (
                  <div
                    key={`${activeGroup.title}-${item.label}`}
                    className="grid min-w-0 gap-2 px-4 py-4 transition-colors hover:bg-admin-elevated/70 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start"
                  >
                    <dt className="text-xs font-semibold text-admin-text-muted">
                      {item.label}
                    </dt>
                    <dd className="min-w-0">
                      <span className="block break-all text-sm font-semibold text-admin-text-primary">
                        {item.masked ? '已配置' : item.value}
                      </span>
                      {item.note ? (
                        <span className="mt-1 block text-xs leading-5 text-admin-text-muted">
                          {item.note}
                        </span>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}
        </div>
      </section>
    </div>
  );
}
