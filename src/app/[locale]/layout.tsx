import type { ReactNode } from 'react';
import React from 'react';

import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { StorefrontFooter } from '@/components/storefront/footer';
import { StorefrontHeader } from '@/components/storefront/header';
import { defaultLocale, isLocale, locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : defaultLocale;

  if (!isLocale(localeParam)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getDictionary(locale);
  const { Storefront } = messages;
  const whatsAppNumber = process.env.WHATSAPP_NUMBER ?? '15551234567';

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="storefront-shell flex min-h-screen flex-col text-slate-900">
        <StorefrontHeader
          locale={locale}
          copy={{
            brand: Storefront.brand,
            nav: Storefront.nav,
            searchPlaceholder: Storefront.searchPlaceholder,
            portal: Storefront.portal,
            whatsApp: Storefront.whatsApp,
            languageLabel: Storefront.language.label,
            utilityBar: Storefront.utilityBar
          }}
          whatsAppNumber={whatsAppNumber}
        />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          {children}
        </main>
        <StorefrontFooter
          locale={locale}
          copy={{
            brand: Storefront.brand,
            nav: Storefront.nav,
            portal: Storefront.portal,
            whatsApp: Storefront.whatsApp,
            footer: Storefront.footer
          }}
          whatsAppNumber={whatsAppNumber}
        />
      </div>
    </NextIntlClientProvider>
  );
}
