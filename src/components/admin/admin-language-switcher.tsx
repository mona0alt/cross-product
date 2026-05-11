'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

import { locales, type Locale } from '@/lib/i18n/config';

const ADMIN_LOCALE_COOKIE = 'ADMIN_LOCALE';

const labels: Record<Locale, string> = {
  'zh-CN': '中文',
  en: 'English',
  es: 'Español',
  pt: 'Português'
};

export function AdminLanguageSwitcher({
  locale,
  label
}: {
  locale: Locale;
  label: string;
}) {
  const router = useRouter();

  return (
    <label className="flex items-center gap-2 rounded-full border border-admin-border bg-white px-2.5 py-1.5 text-[11px] font-semibold text-admin-text-secondary">
      <span className="sr-only">{label}</span>
      <select
        aria-label={label}
        value={locale}
        onChange={(event) => {
          document.cookie = `${ADMIN_LOCALE_COOKIE}=${event.target.value}; path=/admin; max-age=31536000; samesite=lax`;
          router.refresh();
        }}
        className="bg-transparent text-[11px] font-semibold outline-none"
      >
        {locales.map((item) => (
          <option key={item} value={item}>
            {labels[item]}
          </option>
        ))}
      </select>
    </label>
  );
}
