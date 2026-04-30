import React from 'react';
import Link from 'next/link';

import { LanguageSwitcher } from '@/components/storefront/language-switcher';
import type { Locale } from '@/lib/i18n/config';

type TopStripProps = {
  locale: Locale;
  support: string;
  service: string;
  portalLabel: string;
  whatsAppLabel: string;
  whatsAppNumber: string;
  languageLabel: string;
};

export function TopStrip({
  locale,
  support,
  service,
  portalLabel,
  whatsAppLabel,
  whatsAppNumber,
  languageLabel
}: TopStripProps) {
  const normalizedWhatsAppNumber = whatsAppNumber.replace(/[^\d]/g, '');

  return (
    <div className="border-b border-[var(--store-border)] bg-[var(--store-accent)] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-2 text-xs sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex flex-wrap items-center gap-3 text-white/75">
          <span className="font-semibold uppercase tracking-[0.24em] text-white">
            {support}
          </span>
          <span className="hidden h-3 w-px bg-white/20 lg:block" />
          <span>{service}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-white/80">
          <LanguageSwitcher currentLocale={locale} label={languageLabel} />
          <Link href={`/${locale}/portal`} className="font-medium text-white">
            {portalLabel}
          </Link>
          <Link
            href={`https://wa.me/${normalizedWhatsAppNumber}`}
            className="rounded-full border border-white/20 px-3 py-1 font-medium text-white"
          >
            {whatsAppLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
