import React from 'react';

import { SystemSettingsPanel } from '@/components/admin/system-settings-panel';
import {
  getAdminSystemSettingsViewModel,
  updateAdminSystemSettings
} from '@/features/admin/system-settings-actions';
import type { SystemSettingsViewModel } from '@/features/admin/system-settings-types';
import { getAdminDictionary } from '@/lib/admin-i18n';

export const dynamic = 'force-dynamic';

function localizeSystemSettings(
  settings: SystemSettingsViewModel,
  copy: {
    configured: string;
    unconfigured: string;
    groups: Record<string, Record<string, string>>;
  }
): SystemSettingsViewModel {
  const groupCopy = copy.groups;
  const fieldLabelKeyByFieldKey: Record<string, string> = {
    'contact.whatsappNumber': 'whatsappNumber',
    'email.mailFrom': 'fromAddress',
    'email.smtpHost': 'smtpHost',
    'email.smtpPort': 'smtpPort',
    'email.smtpPassword': 'smtpPassword',
    'upload.productSegment': 'productSegment',
    'upload.categorySegment': 'categorySegment',
    'upload.bannerSegment': 'bannerSegment',
    'llm.provider': 'provider',
    'llm.model': 'model',
    'llm.apiBaseUrl': 'apiBaseUrl',
    'runtime.databaseProvider': 'databaseProvider',
    'runtime.databaseUrl': 'databaseUrl'
  };
  const fieldHelpKeyByFieldKey: Record<string, string> = {
    'contact.whatsappNumber': 'whatsappHelp',
    'email.mailFrom': 'mailFromHelp',
    'email.smtpPassword': 'smtpPasswordHelp',
    'upload.productSegment': 'productHelp',
    'llm.apiKey': 'apiKeyNote',
    'runtime.databaseUrl': 'databaseUrlHelp'
  };

  return {
    groups: settings.groups.map((group) => {
      const currentGroupCopy = groupCopy[group.key] ?? {};

      return {
        ...group,
        title: currentGroupCopy.title ?? group.title,
        description: currentGroupCopy.description ?? group.description,
        fields: group.fields.map((field) => {
          const labelKey = fieldLabelKeyByFieldKey[field.key];
          const helpKey = fieldHelpKeyByFieldKey[field.key];
          const placeholder = field.sensitive && field.configured
            ? `${copy.configured}`
            : field.placeholder;

          return {
            ...field,
            label: labelKey ? currentGroupCopy[labelKey] ?? field.label : field.label,
            value: field.value === '已配置'
              ? copy.configured
              : field.value === '未配置'
                ? copy.unconfigured
                : field.value,
            placeholder,
            help: helpKey ? currentGroupCopy[helpKey] ?? field.help : field.help
          };
        })
      };
    })
  };
}

export default async function AdminCategoriesPage() {
  const [settings, { Admin }] = await Promise.all([
    getAdminSystemSettingsViewModel(),
    getAdminDictionary()
  ]);

  return (
    <section className="flex h-[calc(100vh-104px)] min-h-0 flex-col overflow-hidden">
      <SystemSettingsPanel
        settings={localizeSystemSettings(settings, Admin.settings)}
        saveAction={updateAdminSystemSettings}
        copy={Admin.settings}
      />
    </section>
  );
}
