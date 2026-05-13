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
    <div className="flex flex-1 justify-center bg-[var(--mk-bg)] px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="w-full max-w-[480px]">
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
