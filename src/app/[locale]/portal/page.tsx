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
    <div className="flex-1 bg-[var(--mk-bg)] py-10 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <section className="rounded-[var(--mk-radius-md)] border border-[var(--mk-border)] bg-[var(--mk-surface)] p-5 sm:p-6">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="space-y-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--mk-accent)]">
                {Storefront.portalPage.eyebrow}
              </p>
              <h1 className="text-2xl font-bold leading-tight text-[var(--mk-text)] sm:text-3xl">
                {Storefront.portalPage.title}
              </h1>
              <p className="max-w-xl text-sm leading-6 text-[var(--mk-text-muted)]">
                {Storefront.portalPage.description}
              </p>
              <a
                href={`mailto:${supportEmail}`}
                className="inline-flex rounded-[var(--mk-radius-md)] border border-[var(--mk-border)] bg-[var(--mk-bg-muted)]/60 px-4 py-3 text-sm font-semibold text-[var(--mk-accent)] hover:underline"
              >
                {supportEmail}
              </a>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <Link
                href={`/${locale}/products`}
                className="rounded-[var(--mk-radius-md)] border border-[var(--mk-border)] bg-[var(--mk-bg-muted)]/60 p-4 transition hover:border-[var(--mk-accent)]"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--mk-text-muted)]">
                  {Storefront.nav.products}
                </span>
                <span className="mt-2 block text-sm leading-6 text-[var(--mk-text)]">
                  {Storefront.categories.description}
                </span>
              </Link>
              <Link
                href={`/${locale}/contact`}
                className="rounded-[var(--mk-radius-md)] border border-[var(--mk-border)] bg-[var(--mk-surface)] p-4 transition hover:border-[var(--mk-accent)]"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--mk-text-muted)]">
                  {Storefront.nav.contact}
                </span>
                <span className="mt-2 block text-sm leading-6 text-[var(--mk-text)]">
                  {Storefront.contact.description}
                </span>
              </Link>
              <Link
                href={`/${locale}/subscribe`}
                className="rounded-[var(--mk-radius-md)] border border-[var(--mk-border)] bg-[var(--mk-surface)] p-4 transition hover:border-[var(--mk-accent)]"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--mk-text-muted)]">
                  {Storefront.nav.subscribe}
                </span>
                <span className="mt-2 block text-sm leading-6 text-[var(--mk-text)]">
                  {Storefront.subscribe.description}
                </span>
              </Link>
              <div className="rounded-[var(--mk-radius-md)] border border-[var(--mk-border-strong)] bg-[var(--mk-accent)] p-4 text-white">
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
                  {Storefront.whatsApp}
                </span>
                <span className="mt-2 block text-sm leading-6 text-white">
                  {Storefront.footer.businessHours}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--mk-border)] pt-5">
            <Link
              href={`/${locale}`}
              className="inline-flex min-h-11 items-center rounded-[var(--mk-radius-md)] bg-[var(--mk-accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--mk-text)]"
            >
              {Storefront.portalPage.back}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex min-h-11 items-center rounded-[var(--mk-radius-md)] border border-[var(--mk-border-strong)] bg-[var(--mk-surface)] px-4 py-3 text-sm font-semibold text-[var(--mk-accent)] transition hover:border-[var(--mk-accent)]"
            >
              {Storefront.nav.contact}
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
