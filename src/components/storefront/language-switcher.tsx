'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import { locales, type Locale } from '@/lib/i18n/config';

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

export function LanguageSwitcher({
  currentLocale,
  label
}: {
  currentLocale: Locale;
  label: string;
}) {
  const pathname = usePathname();

  return (
    <label className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-slate-500">
      <span className="hidden lg:inline">{label}</span>
      <select
        aria-label={label}
        className="rounded-full border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium tracking-normal text-slate-700 lg:px-3 lg:py-2"
        value={currentLocale}
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
