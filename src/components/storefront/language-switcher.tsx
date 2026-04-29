'use client';

import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import { locales } from '@/lib/i18n/config';

function replaceLocale(pathname: string, nextLocale: string) {
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return `/${nextLocale}`;
  }

  if (locales.includes(segments[0] as (typeof locales)[number])) {
    segments[0] = nextLocale;
    return `/${segments.join('/')}`;
  }

  return `/${nextLocale}/${segments.join('/')}`;
}

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations('Storefront.language');

  return (
    <label className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-500">
      <span>{t('label')}</span>
      <select
        className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium tracking-normal text-slate-700"
        value={locale}
        onChange={(event) => {
          window.location.href = replaceLocale(pathname, event.target.value);
        }}
      >
        {locales.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </label>
  );
}
