import React from 'react';
import Link from 'next/link';

import type { Locale } from '@/lib/i18n/config';
import { LanguageSwitcher } from '@/components/storefront/language-switcher';

type HeaderCopy = {
  brand: string;
  nav: {
    home: string;
    products: string;
    contact: string;
    subscribe: string;
  };
  searchPlaceholder: string;
  portal: string;
  whatsApp: string;
  languageLabel: string;
};

export function StorefrontHeader({
  locale,
  copy,
  whatsAppNumber
}: {
  locale: Locale;
  copy: HeaderCopy;
  whatsAppNumber: string;
}) {
  const normalizedWhatsAppNumber = whatsAppNumber.replace(/[^\d]/g, '');

  return (
    <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={`/${locale}`}
            className="text-lg font-semibold tracking-[0.18em] text-slate-950"
          >
            {copy.brand}
          </Link>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
            <Link href={`/${locale}`}>{copy.nav.home}</Link>
            <Link href={`/${locale}/products`}>{copy.nav.products}</Link>
            <Link href={`/${locale}/contact`}>{copy.nav.contact}</Link>
            <Link href={`/${locale}/subscribe`}>{copy.nav.subscribe}</Link>
          </nav>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            className="min-w-[220px] rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 placeholder:text-slate-400"
            placeholder={copy.searchPlaceholder}
            type="search"
          />
          <LanguageSwitcher currentLocale={locale} label={copy.languageLabel} />
          <Link
            href={`/${locale}/portal`}
            className="rounded-full border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700"
          >
            {copy.portal}
          </Link>
          <Link
            href={`https://wa.me/${normalizedWhatsAppNumber}`}
            className="rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-medium text-white"
          >
            {copy.whatsApp}
          </Link>
        </div>
      </div>
    </header>
  );
}
