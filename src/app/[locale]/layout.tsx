import type { ReactNode } from 'react';
import React from 'react';

import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

import { StorefrontFooter } from '@/components/storefront/footer';
import { StorefrontFloatingWhatsAppButton } from '@/components/storefront/floating-whatsapp-button';
import { StorefrontHeader } from '@/components/storefront/header';
import { getRuntimeSystemSettings } from '@/features/admin/system-settings-actions';
import { defaultLocale, isLocale, locales, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';
import { getStorefrontCategoryGroups } from '@/features/catalog/queries';

export const dynamic = 'force-dynamic';

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

  const [messages, runtimeSettings] = await Promise.all([
    getDictionary(locale),
    getRuntimeSystemSettings()
  ]);
  const { Storefront } = messages;
  const whatsAppNumber = runtimeSettings.contact.whatsappNumber;
  const contactEmail = Storefront.footer.supportDescription;
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
          contactEmail={contactEmail}
          categoryGroups={categoryGroups}
        />
        <main className="flex flex-1 flex-col bg-[var(--mk-bg)]">{children}</main>
        <StorefrontFloatingWhatsAppButton
          whatsAppLabel={Storefront.whatsApp}
          whatsAppNumber={whatsAppNumber}
        />
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
