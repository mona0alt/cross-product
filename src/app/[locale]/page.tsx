import React from 'react';

import { CategoryIconGrid } from '@/components/storefront/category-icon-grid';
import { CategoryNav } from '@/components/storefront/category-nav';
import { HeroShowcase } from '@/components/storefront/hero-showcase';
import { PromoCta } from '@/components/storefront/promo-cta';
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
      <HeroShowcase
        locale={locale}
        banners={payload.banners}
        copy={{
          eyebrow: Storefront.home.eyebrow,
          title: Storefront.home.title,
          description: Storefront.home.description,
          primaryCta: Storefront.home.primaryCta,
          secondaryCta: Storefront.home.secondaryCta,
          highlights: [
            Storefront.utilityBar.support,
            Storefront.utilityBar.service,
            Storefront.portal
          ]
        }}
      />

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

      <PromoCta
        eyebrow={Storefront.contact.eyebrow}
        title={Storefront.contact.title}
        description={Storefront.subscribe.description}
        primary={{
          href: `/${locale}/contact`,
          label: Storefront.nav.contact
        }}
        secondary={{
          href: `/${locale}/subscribe`,
          label: Storefront.nav.subscribe
        }}
      />
    </div>
  );
}
