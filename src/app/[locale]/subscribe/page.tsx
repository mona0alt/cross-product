import React from 'react';
import { SubscribeForm } from '@/components/storefront/subscribe-form';
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';

export default async function SubscribePage({
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
      <div className="mx-auto grid max-w-6xl gap-5 px-4 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8">
        <section className="rounded-[var(--mk-radius-lg)] border border-[var(--mk-border)] bg-white p-6 shadow-[0_18px_44px_rgba(112,89,81,0.08)] sm:p-8">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--mk-accent)]">
              {Storefront.subscribe.eyebrow}
            </p>
            <div className="space-y-3">
              <h1 className="text-3xl font-black leading-tight tracking-[-0.03em] text-[var(--mk-text)] sm:text-4xl">
                {Storefront.subscribe.title}
              </h1>
              <p className="max-w-xl text-sm leading-7 text-[var(--mk-text-muted)]">
                {Storefront.subscribe.description}
              </p>
            </div>
            <div className="rounded-[var(--mk-radius-md)] border border-[var(--mk-border)] bg-[var(--mk-bg-muted)] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--mk-text-muted)]">
                {Storefront.footer.supportTitle}
              </p>
              <a
                href={`mailto:${supportEmail}`}
                className="mt-1 inline-flex text-sm font-semibold text-[var(--mk-accent)] hover:underline"
              >
                {supportEmail}
              </a>
            </div>
          </div>
        </section>
        <SubscribeForm
          copy={{
            ...Storefront.subscribeForm,
            success: Storefront.subscribe.success
          }}
        />
      </div>
    </div>
  );
}
