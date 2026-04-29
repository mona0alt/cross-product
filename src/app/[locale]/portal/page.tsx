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
    <section className="space-y-6 rounded-[2rem] border border-white/70 bg-white/90 p-8 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.55)]">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
        {Storefront.portalPage.eyebrow}
      </p>
      <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
        {Storefront.portalPage.title}
      </h1>
      <p className="max-w-2xl text-sm leading-7 text-slate-600">
        {Storefront.portalPage.description}
      </p>
      <Link
        href={`/${locale}`}
        className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white"
      >
        {Storefront.portalPage.back}
      </Link>
    </section>
  );
}
