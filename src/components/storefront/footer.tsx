import React from 'react';
import Link from 'next/link';

import type { Locale } from '@/lib/i18n/config';

type FooterCopy = {
  brand: string;
  nav: {
    home: string;
    products: string;
    contact: string;
    subscribe: string;
  };
  portal: string;
  whatsApp: string;
  footer: {
    navigationTitle: string;
    tagline: string;
    rights: string;
    supportTitle: string;
    supportDescription: string;
  };
};

export function StorefrontFooter({
  locale,
  copy,
  whatsAppNumber
}: {
  locale: Locale;
  copy: FooterCopy;
  whatsAppNumber: string;
}) {
  const normalizedWhatsAppNumber = whatsAppNumber.replace(/[^\d]/g, '');

  return (
    <footer className="mt-12 bg-[var(--store-accent)] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr_0.9fr] lg:px-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/65">
            {copy.brand}
          </p>
          <p className="max-w-md text-sm leading-7 text-white/78">
            {copy.footer.tagline}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
            {copy.footer.navigationTitle}
          </h3>
          <div className="grid gap-3 text-sm text-white">
            <Link href={`/${locale}`}>{copy.nav.home}</Link>
            <Link href={`/${locale}/products`}>{copy.nav.products}</Link>
            <Link href={`/${locale}/contact`}>{copy.nav.contact}</Link>
            <Link href={`/${locale}/subscribe`}>{copy.nav.subscribe}</Link>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
            {copy.footer.supportTitle}
          </h3>
          <p className="text-sm leading-7 text-white/78">
            {copy.footer.supportDescription}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/portal`}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white"
            >
              {copy.portal}
            </Link>
            <Link
              href={`https://wa.me/${normalizedWhatsAppNumber}`}
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--store-accent)]"
            >
              {copy.whatsApp}
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-white/55 sm:px-6 lg:px-8">
          {copy.footer.rights}
        </div>
      </div>
    </footer>
  );
}
