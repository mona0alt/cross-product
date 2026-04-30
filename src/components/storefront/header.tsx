'use client';

import React from 'react';
import Link from 'next/link';
import { useState } from 'react';

import { QuickLinksRow } from '@/components/storefront/quick-links-row';
import { TopStrip } from '@/components/storefront/top-strip';
import type { Locale } from '@/lib/i18n/config';

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
  utilityBar: {
    support: string;
    service: string;
  };
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const normalizedWhatsAppNumber = whatsAppNumber.replace(/[^\d]/g, '');
  const navItems = [
    { href: `/${locale}`, label: copy.nav.home },
    { href: `/${locale}/products`, label: copy.nav.products },
    { href: `/${locale}/contact`, label: copy.nav.contact },
    { href: `/${locale}/subscribe`, label: copy.nav.subscribe }
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--store-border)] bg-white/92 backdrop-blur-md">
      <TopStrip
        locale={locale}
        support={copy.utilityBar.support}
        service={copy.utilityBar.service}
        portalLabel={copy.portal}
        whatsAppLabel={copy.whatsApp}
        whatsAppNumber={whatsAppNumber}
        languageLabel={copy.languageLabel}
      />
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-4">
            <Link
              href={`/${locale}`}
              className="text-xl font-black uppercase tracking-[0.24em] text-[var(--store-accent)]"
            >
              {copy.brand}
            </Link>
            <button
              type="button"
              aria-label="toggle-storefront-nav"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--store-border)] bg-[var(--store-surface-muted)] text-[var(--store-accent)] lg:hidden"
              onClick={() => setIsMenuOpen((value) => !value)}
            >
              {isMenuOpen ? '×' : '≡'}
            </button>
          </div>
          <div className="mt-4 hidden grid-cols-[minmax(0,1fr)_auto] gap-4 lg:grid">
            <label className="flex min-w-0 items-center rounded-full border border-[var(--store-border)] bg-[var(--store-surface)] px-4 py-3 shadow-sm">
              <input
                className="w-full border-none bg-transparent text-sm text-[var(--store-text)] outline-none placeholder:text-[var(--store-text-muted)]"
                placeholder={copy.searchPlaceholder}
                type="search"
              />
            </label>
            <div className="flex items-center gap-3">
              <Link
                href={`/${locale}/portal`}
                className="rounded-full border border-[var(--store-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--store-accent)]"
              >
                {copy.portal}
              </Link>
              <Link
                href={`https://wa.me/${normalizedWhatsAppNumber}`}
                className="rounded-full bg-[var(--store-accent)] px-4 py-3 text-sm font-semibold text-white"
              >
                {copy.whatsApp}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <nav className="hidden border-t border-[var(--store-border)] bg-white lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-8 px-4 py-4 text-sm font-semibold text-[var(--store-text)] sm:px-6 lg:px-8">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {isMenuOpen ? (
        <div className="border-t border-[var(--store-border)] bg-white lg:hidden">
          <div className="mx-auto max-w-7xl space-y-4 px-4 py-4 sm:px-6">
            <label className="flex min-w-0 items-center rounded-full border border-[var(--store-border)] bg-[var(--store-surface)] px-4 py-3 shadow-sm">
              <input
                className="w-full border-none bg-transparent text-sm text-[var(--store-text)] outline-none placeholder:text-[var(--store-text-muted)]"
                placeholder={copy.searchPlaceholder}
                type="search"
              />
            </label>
            <div className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-[var(--store-border)] bg-[var(--store-surface-muted)] px-4 py-3 text-sm font-semibold text-[var(--store-accent)]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <QuickLinksRow
        items={[
          { href: `/${locale}`, label: copy.nav.home },
          { href: `/${locale}/products`, label: copy.nav.products },
          { href: `/${locale}/contact`, label: copy.nav.contact },
          { href: `/${locale}/subscribe`, label: copy.nav.subscribe }
        ]}
      />
    </header>
  );
}
