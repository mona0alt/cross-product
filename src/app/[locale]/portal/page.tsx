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
  const supportEmail = Storefront.footer.supportDescription;

  return (
    <div className="bg-[var(--mk-bg)] py-8 sm:py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <section className="rounded-[var(--mk-radius-lg)] border border-[var(--mk-border)] bg-white p-6 shadow-[0_18px_44px_rgba(112,89,81,0.08)] sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--mk-accent)]">
                {Storefront.portalPage.eyebrow}
              </p>
              <h1 className="text-3xl font-black leading-tight tracking-[-0.03em] text-[var(--mk-text)] sm:text-4xl">
                {Storefront.portalPage.title}
              </h1>
              <p className="max-w-xl text-sm leading-7 text-[var(--mk-text-muted)]">
                {Storefront.portalPage.description}
              </p>
              <a
                href={`mailto:${supportEmail}`}
                className="inline-flex rounded-[var(--mk-radius-md)] bg-[var(--mk-bg-muted)] px-4 py-3 text-sm font-semibold text-[var(--mk-accent)] hover:underline"
              >
                {supportEmail}
              </a>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href={`/${locale}/products`}
                className="rounded-[var(--mk-radius-md)] border border-[var(--mk-border)] bg-[var(--mk-bg-muted)] p-4 transition hover:border-[var(--mk-accent)]"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--mk-text-muted)]">
                  {Storefront.nav.products}
                </span>
                <span className="mt-2 block text-sm leading-6 text-[var(--mk-text)]">
                  {Storefront.categories.description}
                </span>
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="rounded-[var(--mk-radius-md)] border border-[var(--mk-border)] bg-white p-4 transition hover:border-[var(--mk-accent)]"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--mk-text-muted)]">
                  {Storefront.nav.contact}
                </span>
                <span className="mt-2 block text-sm leading-6 text-[var(--mk-text)]">
                  {Storefront.contact.description}
                </span>
              </Link>
              <Link
                href={`/${locale}/subscribe`}
                className="rounded-[var(--mk-radius-md)] border border-[var(--mk-border)] bg-white p-4 transition hover:border-[var(--mk-accent)]"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--mk-text-muted)]">
                  {Storefront.nav.subscribe}
                </span>
                <span className="mt-2 block text-sm leading-6 text-[var(--mk-text)]">
                  {Storefront.subscribe.description}
                </span>
              </Link>
              <div className="rounded-[var(--mk-radius-md)] border border-[var(--mk-border)] bg-[var(--mk-accent)] p-4 text-white">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                  {Storefront.whatsApp}
                </span>
                <span className="mt-2 block text-sm leading-6 text-white">
                  {Storefront.footer.businessHours}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-[var(--mk-border)] pt-5">
            <Link
              href={`/${locale}`}
              className="inline-flex min-h-11 items-center rounded-[var(--mk-radius-md)] bg-[var(--mk-accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--mk-text)]"
            >
              {Storefront.portalPage.back}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex min-h-11 items-center rounded-[var(--mk-radius-md)] border border-[var(--mk-border-strong)] bg-white px-5 py-3 text-sm font-semibold text-[var(--mk-accent)] transition hover:border-[var(--mk-accent)]"
            >
              {Storefront.nav.contact}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
