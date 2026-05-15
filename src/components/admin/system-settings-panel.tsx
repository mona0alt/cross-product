'use client';

import React, { useActionState, useState } from 'react';

import type { SystemSettingsViewModel } from '@/features/admin/system-settings-types';

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
  saveConfig: '保存配置'
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
  const [state, formAction, isPending] = useActionState(
    saveAction ??
      (async () => ({
        ok: false,
        error: 'SAVE_ACTION_NOT_CONFIGURED'
      })),
    initialActionState
  );

  return (
    <div className="grid min-h-[calc(100vh-104px)] gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="flex min-h-0 flex-col rounded-[20px] border border-admin-border bg-admin-surface shadow-[0_12px_34px_rgba(15,23,42,0.04)]">
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
        className="flex min-h-0 flex-col rounded-[20px] border border-admin-border bg-admin-surface shadow-[0_12px_34px_rgba(15,23,42,0.04)]"
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
              </form>
            </section>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export type { SystemSettingsViewModel };
