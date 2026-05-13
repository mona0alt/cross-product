import React from 'react';

import {
  SystemSettingsPanel,
  type SystemSettingsViewModel
} from '@/components/admin/system-settings-panel';

function getConfiguredStatus(value: string | undefined) {
  return value && value.trim().length > 0 ? '已配置' : '未配置';
}

function getDatabaseProvider(databaseUrl: string | undefined) {
  if (!databaseUrl) {
    return 'SQLite';
  }

  if (databaseUrl.startsWith('postgres')) {
    return 'PostgreSQL';
  }

  if (databaseUrl.startsWith('mysql')) {
    return 'MySQL';
  }

  if (databaseUrl.startsWith('file:')) {
    return 'SQLite';
  }

  return '自定义数据库';
}

function getSystemSettings(): SystemSettingsViewModel {
  const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
  const smtpHost = process.env.SMTP_HOST ?? '未配置';
  const smtpUser = process.env.SMTP_USER ?? '未配置';
  const smtpPort = process.env.SMTP_PORT ?? '465';

  return {
    email: {
      fromAddress: process.env.MAIL_FROM ?? 'support@fbgm.com',
      smtpHost,
      smtpPort,
      smtpUser,
      enabled: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER)
    },
    database: {
      provider: getDatabaseProvider(databaseUrl),
      url: getConfiguredStatus(databaseUrl),
      status: getConfiguredStatus(databaseUrl)
    },
    storage: {
      uploadRoot: '/public/uploads',
      productImages: '/public/uploads/products',
      categoryImages: '/public/uploads/categories',
      bannerImages: '/public/uploads/banners'
    },
    llm: {
      provider: process.env.LLM_PROVIDER ?? 'OpenAI compatible',
      model: process.env.LLM_MODEL ?? 'gpt-4o-mini',
      apiBaseUrl: process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1',
      apiKeyConfigured: Boolean(process.env.OPENAI_API_KEY)
    }
  };
}

export default function AdminCategoriesPage() {
  return (
    <section className="min-h-[calc(100vh-104px)]">
      <SystemSettingsPanel settings={getSystemSettings()} />
    </section>
  );
}
