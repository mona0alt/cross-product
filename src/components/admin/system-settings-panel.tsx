'use client';

import React, { useActionState, useState } from 'react';
import { RefreshCw } from 'lucide-react';

import type {
  DatabaseConnectionTestResult,
  SmtpConnectionTestResult,
  SystemSettingsViewModel
} from '@/features/admin/system-settings-types';

type SystemSettingsActionState = {
  ok?: boolean;
  error?: string;
};

const initialActionState: SystemSettingsActionState = {};

type SystemSettingsCopy = {
  configured: string;
  unconfigured: string;
  categoryKicker: string;
  categoryTitle: string;
  categoryDescription: string;
  navLabel: string;
  itemCount: string;
  detailKicker: string;
  detailTitle: string;
  detailDescription: string;
  activeSummary: string;
  currentStatus: string;
  saveSuccess: string;
  saveError: string;
  saving: string;
  saveConfig: string;
  testDatabaseConnection: string;
  testingDatabaseConnection: string;
  databaseConnectionIdle: string;
  databaseConnectionSuccess: string;
  databaseConnectionFailed: string;
  databaseConnectionNotConfigured: string;
  testSmtpConnection: string;
  testingSmtpConnection: string;
  smtpConnectionIdle: string;
  smtpConnectionSuccess: string;
  smtpConnectionFailed: string;
  smtpConnectionNotConfigured: string;
  smtpConnectionTlsCertificateFailed: string;
  smtpConnectionAuthFailed: string;
  smtpConnectionTimeout: string;
};

const defaultSystemSettingsCopy: SystemSettingsCopy = {
  configured: '已配置',
  unconfigured: '未配置',
  categoryKicker: 'Settings',
  categoryTitle: '配置类别',
  categoryDescription: '按运行模块编辑真实配置，敏感项只显示配置状态。',
  navLabel: '系统设置配置类别',
  itemCount: '{count} 个配置项',
  detailKicker: 'Configuration',
  detailTitle: '配置项',
  detailDescription: '保存后写入数据库，前台联系入口、邮件发送和上传服务会读取这些配置。',
  activeSummary: '{title} · {count} 项',
  currentStatus: '当前状态：{status}',
  saveSuccess: '配置已保存',
  saveError: '保存失败，请检查配置项。',
  saving: '保存中',
  saveConfig: '保存配置',
  testDatabaseConnection: '测试连接',
  testingDatabaseConnection: '测试中',
  databaseConnectionIdle: '尚未测试当前数据库连接。',
  databaseConnectionSuccess: '连接正常：{provider}，耗时 {latencyMs} ms。',
  databaseConnectionFailed: '连接失败，请检查部署环境中的 DATABASE_URL。',
  databaseConnectionNotConfigured: '未配置 DATABASE_URL，无法测试连接。',
  testSmtpConnection: '验证 SMTP',
  testingSmtpConnection: '验证中',
  smtpConnectionIdle: '尚未验证当前 SMTP 配置。',
  smtpConnectionSuccess: 'SMTP 连接和登录正常：{host}:{port}，耗时 {latencyMs} ms。',
  smtpConnectionFailed: 'SMTP 验证失败，请检查主机、端口、发件邮箱和密码。',
  smtpConnectionNotConfigured: 'SMTP 配置不完整，无法验证。',
  smtpConnectionTlsCertificateFailed: 'SMTP TLS 证书验证失败，请检查服务器证书链或运行环境 CA。',
  smtpConnectionAuthFailed: 'SMTP 登录失败，请确认发件邮箱和 SMTP 授权码。',
  smtpConnectionTimeout: 'SMTP 连接超时，请检查主机、端口和服务器网络。'
};

function formatCopy(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template
  );
}

function getFieldDisplayValue(
  field: SystemSettingsViewModel['groups'][number]['fields'][number],
  copy: SystemSettingsCopy
) {
  if (field.sensitive) {
    return field.configured ? copy.configured : copy.unconfigured;
  }

  return field.value || copy.unconfigured;
}

export function SystemSettingsPanel({
  settings,
  saveAction,
  copy = defaultSystemSettingsCopy
}: {
  settings: SystemSettingsViewModel;
  saveAction?: (
    state: SystemSettingsActionState,
    formData: FormData
  ) => Promise<SystemSettingsActionState>;
  copy?: SystemSettingsCopy;
}) {
  const groups = settings.groups;
  const [activeKey, setActiveKey] = useState(groups[0]?.key ?? 'contact');
  const activeGroup = groups.find((group) => group.key === activeKey) ?? groups[0];
  const [databaseTest, setDatabaseTest] = useState<{
    status: 'idle' | 'testing' | 'success' | 'failed';
    message: string;
  }>({
    status: 'idle',
    message: copy.databaseConnectionIdle
  });
  const [smtpTest, setSmtpTest] = useState<{
    status: 'idle' | 'testing' | 'success' | 'failed';
    message: string;
  }>({
    status: 'idle',
    message: copy.smtpConnectionIdle
  });
  const [state, formAction, isPending] = useActionState(
    saveAction ??
      (async () => ({
        ok: false,
        error: 'SAVE_ACTION_NOT_CONFIGURED'
      })),
    initialActionState
  );

  async function handleDatabaseConnectionTest() {
    setDatabaseTest({
      status: 'testing',
      message: copy.testingDatabaseConnection
    });

    try {
      const response = await fetch('/api/admin/system-settings/database-connection', {
        method: 'POST'
      });
      const result = (await response.json()) as DatabaseConnectionTestResult;

      if (response.ok && result.ok) {
        setDatabaseTest({
          status: 'success',
          message: formatCopy(copy.databaseConnectionSuccess, {
            provider: result.provider,
            latencyMs: result.latencyMs
          })
        });
        return;
      }

      setDatabaseTest({
        status: 'failed',
        message:
          result.error === 'DATABASE_URL_NOT_CONFIGURED'
            ? copy.databaseConnectionNotConfigured
            : copy.databaseConnectionFailed
      });
    } catch {
      setDatabaseTest({
        status: 'failed',
        message: copy.databaseConnectionFailed
      });
    }
  }

  async function handleSmtpConnectionTest() {
    setSmtpTest({
      status: 'testing',
      message: copy.testingSmtpConnection
    });

    try {
      const response = await fetch('/api/admin/system-settings/smtp-connection', {
        method: 'POST'
      });
      const result = (await response.json()) as SmtpConnectionTestResult;

      if (response.ok && result.ok) {
        setSmtpTest({
          status: 'success',
          message: formatCopy(copy.smtpConnectionSuccess, {
            host: result.host,
            port: result.port,
            latencyMs: result.latencyMs
          })
        });
        return;
      }

      setSmtpTest({
        status: 'failed',
        message: (() => {
          if (result.error === 'SMTP_NOT_CONFIGURED') {
            return copy.smtpConnectionNotConfigured;
          }

          if (result.error === 'SMTP_TLS_CERTIFICATE_FAILED') {
            return copy.smtpConnectionTlsCertificateFailed;
          }

          if (result.error === 'SMTP_AUTH_FAILED') {
            return copy.smtpConnectionAuthFailed;
          }

          if (result.error === 'SMTP_CONNECT_TIMEOUT') {
            return copy.smtpConnectionTimeout;
          }

          return copy.smtpConnectionFailed;
        })()
      });
    } catch {
      setSmtpTest({
        status: 'failed',
        message: copy.smtpConnectionFailed
      });
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-104px)] gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="flex min-h-0 flex-col rounded-[20px] border border-admin-border bg-admin-bg shadow-[0_12px_34px_rgba(15,23,42,0.04)]">
        <div className="border-b border-admin-border px-4 py-4">
          <p className="admin-kicker">{copy.categoryKicker}</p>
          <h3 className="mt-1 text-lg font-semibold text-admin-text-primary font-display">
            {copy.categoryTitle}
          </h3>
          <p className="mt-1.5 text-xs leading-5 text-admin-text-secondary">
            {copy.categoryDescription}
          </p>
        </div>
        <nav className="grid flex-1 content-start gap-1.5 p-2.5" aria-label={copy.navLabel}>
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
                {formatCopy(copy.itemCount, { count: group.fields.length })}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      <section
        data-testid="system-setting-detail-panel"
        className="flex min-h-0 flex-col rounded-[20px] border border-admin-border bg-admin-bg shadow-[0_12px_34px_rgba(15,23,42,0.04)]"
      >
        <div className="flex flex-col gap-2 border-b border-admin-border px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="admin-kicker">{copy.detailKicker}</p>
            <h3 className="mt-1 text-lg font-semibold text-admin-text-primary font-display">
              {copy.detailTitle}
            </h3>
            <p className="mt-1.5 text-xs leading-5 text-admin-text-secondary">
              {copy.detailDescription}
            </p>
          </div>
          {activeGroup ? (
            <span className="inline-flex w-fit rounded-full bg-admin-elevated px-3 py-1 text-xs font-semibold text-admin-text-muted">
              {formatCopy(copy.activeSummary, {
                title: activeGroup.title,
                count: activeGroup.fields.length
              })}
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
                <h4 className="text-base font-bold text-admin-text-primary">
                  {activeGroup.title}
                </h4>
                <p className="mt-1 text-sm leading-6 text-admin-text-secondary">
                  {activeGroup.description}
                </p>
              </div>

              <form action={formAction} className="mt-4 flex flex-1 flex-col">
                <div
                  data-testid="system-setting-config-list"
                  className="divide-y divide-admin-border overflow-hidden rounded-xl border border-admin-border bg-white"
                >
                  {activeGroup.fields.map((field) => (
                    <label
                      key={`${activeGroup.title}-${field.key}`}
                      className="grid min-w-0 gap-2 px-4 py-4 transition-colors hover:bg-admin-elevated/70 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start"
                    >
                      <span className="text-xs font-semibold text-admin-text-muted">
                        {field.label}
                      </span>
                      <span className="min-w-0">
                        {field.editable ? (
                          <input
                            name={field.key}
                            type={field.inputType}
                            defaultValue={field.value}
                            placeholder={field.placeholder}
                            className="block min-h-10 w-full rounded-lg border border-admin-border bg-admin-bg px-3 text-sm font-semibold text-admin-text-primary outline-none transition focus:border-admin-accent focus:bg-white"
                          />
                        ) : (
                          <span className="block break-all text-sm font-semibold text-admin-text-primary">
                            {getFieldDisplayValue(field, copy)}
                          </span>
                        )}
                        {field.sensitive ? (
                          <span className="mt-1 block text-xs leading-5 text-admin-text-muted">
                            {formatCopy(copy.currentStatus, {
                              status: field.configured ? copy.configured : copy.unconfigured
                            })}
                          </span>
                        ) : null}
                        {field.help ? (
                          <span className="mt-1 block text-xs leading-5 text-admin-text-muted">
                            {field.help}
                          </span>
                        ) : null}
                      </span>
                    </label>
                  ))}
                </div>

                {activeGroup.fields.some((field) => field.editable) ? (
                  <div className="mt-4 flex flex-col gap-2 border-t border-admin-border pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-admin-text-muted" role="status">
                      {state.ok ? copy.saveSuccess : state.error ? copy.saveError : ' '}
                    </p>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="inline-flex min-h-10 items-center justify-center rounded-lg bg-admin-accent px-4 text-sm font-semibold text-white transition hover:bg-admin-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isPending ? copy.saving : copy.saveConfig}
                    </button>
                  </div>
                ) : null}

                {activeGroup.key === 'database' ? (
                  <div
                    data-testid="database-connection-test"
                    className="mt-4 flex flex-col gap-3 border-t border-admin-border pt-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p
                      data-testid="database-connection-test-status"
                      className={`text-xs font-semibold ${
                        databaseTest.status === 'success'
                          ? 'text-emerald-700'
                          : databaseTest.status === 'failed'
                            ? 'text-red-700'
                            : 'text-admin-text-muted'
                      }`}
                      role="status"
                      aria-live="polite"
                    >
                      {databaseTest.message}
                    </p>
                    <button
                      type="button"
                      onClick={handleDatabaseConnectionTest}
                      disabled={databaseTest.status === 'testing'}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-admin-border bg-white px-4 text-sm font-semibold text-admin-text-primary transition hover:border-admin-accent hover:text-admin-accent disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${
                          databaseTest.status === 'testing' ? 'animate-spin' : ''
                        }`}
                        aria-hidden="true"
                      />
                      {databaseTest.status === 'testing'
                        ? copy.testingDatabaseConnection
                        : copy.testDatabaseConnection}
                    </button>
                  </div>
                ) : null}

                {activeGroup.key === 'email' ? (
                  <div
                    data-testid="smtp-connection-test"
                    className="mt-4 flex flex-col gap-3 border-t border-admin-border pt-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p
                      data-testid="smtp-connection-test-status"
                      className={`text-xs font-semibold ${
                        smtpTest.status === 'success'
                          ? 'text-emerald-700'
                          : smtpTest.status === 'failed'
                            ? 'text-red-700'
                            : 'text-admin-text-muted'
                      }`}
                      role="status"
                      aria-live="polite"
                    >
                      {smtpTest.message}
                    </p>
                    <button
                      type="button"
                      onClick={handleSmtpConnectionTest}
                      disabled={smtpTest.status === 'testing'}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-admin-border bg-white px-4 text-sm font-semibold text-admin-text-primary transition hover:border-admin-accent hover:text-admin-accent disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${
                          smtpTest.status === 'testing' ? 'animate-spin' : ''
                        }`}
                        aria-hidden="true"
                      />
                      {smtpTest.status === 'testing'
                        ? copy.testingSmtpConnection
                        : copy.testSmtpConnection}
                    </button>
                  </div>
                ) : null}
              </form>
            </section>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export type { SystemSettingsViewModel };
