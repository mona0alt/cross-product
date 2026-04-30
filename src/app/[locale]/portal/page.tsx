import React from 'react';
import Link from 'next/link';

import { defaultLocale, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';

export default async function PortalPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const messages = await getDictionary(locale);
  const { Storefront } = messages;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="storefront-surface rounded-[var(--store-radius-xl)] p-6 sm:p-8">
        <div className="space-y-5">
          <p className="storefront-eyebrow">
            {Storefront.portalPage.eyebrow}
          </p>
          <h1 className="text-4xl font-black tracking-[-0.04em] text-[var(--store-text)]">
            {Storefront.portalPage.title}
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-[var(--store-text-muted)]">
            {Storefront.portalPage.description}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="storefront-surface-muted rounded-[1.25rem] px-4 py-4">
              <p className="text-sm font-semibold text-[var(--store-accent)]">
                {Storefront.utilityBar.support}
              </p>
              <p className="mt-2 text-sm text-[var(--store-text-muted)]">
                {Storefront.contact.description}
              </p>
            </div>
            <div className="storefront-surface-muted rounded-[1.25rem] px-4 py-4">
              <p className="text-sm font-semibold text-[var(--store-accent)]">
                {Storefront.utilityBar.service}
              </p>
              <p className="mt-2 text-sm text-[var(--store-text-muted)]">
                {Storefront.subscribe.description}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="storefront-surface rounded-[var(--store-radius-xl)] p-6 sm:p-8">
        <div className="space-y-4">
          <p className="storefront-eyebrow">{Storefront.utilityBar.support}</p>
          <h2 className="text-2xl font-bold text-[var(--store-text)]">
            {Storefront.portal}
          </h2>
          <p className="text-sm leading-7 text-[var(--store-text-muted)]">
            {Storefront.portalPage.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}`}
              className="inline-flex rounded-full bg-[var(--store-accent)] px-5 py-3 text-sm font-semibold text-white"
            >
              {Storefront.portalPage.back}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex rounded-full border border-[var(--store-border-strong)] px-5 py-3 text-sm font-semibold text-[var(--store-accent)]"
            >
              {Storefront.nav.contact}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
