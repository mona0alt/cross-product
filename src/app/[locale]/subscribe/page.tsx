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

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="storefront-surface rounded-[var(--store-radius-xl)] p-6 sm:p-8">
        <div className="space-y-5">
          <p className="storefront-eyebrow">
            {Storefront.subscribe.eyebrow}
          </p>
          <h1 className="text-4xl font-black tracking-[-0.04em] text-[var(--store-text)]">
            {Storefront.subscribe.title}
          </h1>
          <p className="max-w-xl text-sm leading-7 text-[var(--store-text-muted)]">
            {Storefront.subscribe.description}
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
      <SubscribeForm
        copy={{
          ...Storefront.subscribeForm,
          success: Storefront.subscribe.success
        }}
      />
    </div>
  );
}
