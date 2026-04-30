import type { ReactNode } from 'react';
import React from 'react';

import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { StorefrontFooter } from '@/components/storefront/footer';
import { StorefrontHeader } from '@/components/storefront/header';
import { defaultLocale, isLocale, locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getStorefrontCategoryGroups } from '@/features/catalog/queries';

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
  const categoryGroups = await getStorefrontCategoryGroups(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex min-h-screen flex-col bg-white text-black">
        <StorefrontHeader
          locale={locale}
          copy={{
            brand: Storefront.brand,
            nav: Storefront.nav,
            searchPlaceholder: Storefront.searchPlaceholder,
            portal: Storefront.portal,
            whatsApp: Storefront.whatsApp,
            languageLabel: Storefront.language.label,
            phoneSales: Storefront.header.phoneSales,
            topLinks: Storefront.header.topLinks,
            utilityBar: Storefront.utilityBar,
            quickActions: Storefront.header.quickActions,
            featuredNav: Storefront.header.featuredNav,
            categoryPromo: Storefront.header.categoryPromo
          }}
          whatsAppNumber={whatsAppNumber}
          categoryGroups={categoryGroups}
        />
        <main className="flex-1">{children}</main>
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
