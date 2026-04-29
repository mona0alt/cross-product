import React from 'react';
import Link from 'next/link';

import { BannerCarousel } from '@/components/storefront/banner-carousel';
import { CategoryIconGrid } from '@/components/storefront/category-icon-grid';
import { CategoryNav } from '@/components/storefront/category-nav';
import { RecommendedProducts } from '@/components/storefront/recommended-products';
import { getHomepagePayload } from '@/features/catalog/queries';
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';

export const dynamic = 'force-dynamic';

export default async function LocalizedHomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const messages = await getDictionary(locale);
  const payload = await getHomepagePayload(locale);
  const { Storefront } = messages;

  return (
    <div className="space-y-10">
      <section className="grid gap-6 rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.45)] backdrop-blur md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            {Storefront.home.eyebrow}
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            {Storefront.home.title}
          </h1>
          <p className="max-w-2xl text-base leading-8 text-slate-600">
            {Storefront.home.description}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/products`}
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-medium text-white"
            >
              {Storefront.nav.products}
            </Link>
            <Link
              href={`/${locale}/subscribe`}
              className="rounded-full border border-slate-200 px-5 py-3 text-sm font-medium text-slate-700"
            >
              {Storefront.subscribeForm.submit}
            </Link>
          </div>
        </div>
        <BannerCarousel banners={payload.banners} />
      </section>

      <CategoryNav
        locale={locale}
        categories={payload.featuredCategories}
        title={Storefront.sections.topCategories}
      />

      <CategoryIconGrid
        locale={locale}
        categories={payload.featuredCategories}
        title={Storefront.sections.categoryGrid}
      />

      <RecommendedProducts
        locale={locale}
        products={payload.recommendedProducts}
        title={Storefront.sections.recommended}
        emptyLabel={Storefront.emptyProducts}
        ctaLabel={Storefront.productCta}
      />
    </div>
  );
}
