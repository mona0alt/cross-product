import React from 'react';

import { BannerCarousel } from '@/components/storefront/banner-carousel';
import { HomepageCategoryGrid } from '@/components/storefront/homepage-category-grid';
import { HomepageProductMatrix } from '@/components/storefront/homepage-product-matrix';
import { SocialShowcase } from '@/components/storefront/social-showcase';
import { getHomepagePayload } from '@/features/catalog/queries';
import type { HomepagePayload } from '@/features/catalog/types';
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';

export const dynamic = 'force-dynamic';

function getHomepageHeroBanners(
  payload: HomepagePayload,
  locale: Locale
) {
  const categoryBanners = payload.featuredCategories
    .filter((category) => Boolean(category.iconImageUrl))
    .map((category, index) => ({
      id: `category-${category.id}`,
      imageUrl: category.iconImageUrl ?? '',
      targetType: 'category',
      targetId: category.id,
      targetUrl: `/${locale}/categories/${category.slug}`,
      targetCategorySlug: category.slug,
      targetCategoryIsLeaf: true,
      sortOrder: index + 1,
      title: category.name,
      description: category.description
    }));

  return categoryBanners.length > 0 ? categoryBanners : payload.banners;
}

export default async function LocalizedHomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const messages = await getDictionary(locale);
  const payload = await getHomepagePayload(locale);
  const heroBanners = getHomepageHeroBanners(payload, locale);
  const { Storefront } = messages;

  return (
    <div>
      <BannerCarousel
        banners={heroBanners}
        emptyLabel={Storefront.banner.empty}
        copy={Storefront.home}
        primaryHref={`/${locale}/products`}
        secondaryHref={`/${locale}/contact`}
      />

      <HomepageCategoryGrid
        locale={locale}
        eyebrow={Storefront.sections.categoryGrid}
        title={Storefront.sections.productSeries}
        categories={payload.featuredCategories}
      />

      <HomepageProductMatrix
        locale={locale}
        eyebrow={Storefront.sections.productGalleryEyebrow}
        title={Storefront.sections.productGallery}
        viewAllLabel={Storefront.sections.viewAll}
        products={payload.recommendedProducts}
      />

      <SocialShowcase copy={Storefront.socialShowcase} />
    </div>
  );
}
