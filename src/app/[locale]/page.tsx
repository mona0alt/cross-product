import React from 'react';

import { BannerCarousel } from '@/components/storefront/banner-carousel';
import { CatalogCarousel } from '@/components/storefront/catalog-carousel';
import { HomepageCategoryGrid } from '@/components/storefront/homepage-category-grid';
import { ProductCarousel } from '@/components/storefront/product-carousel';
import { SocialShowcase } from '@/components/storefront/social-showcase';
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

  // Simulated discounts for visual effect matching mk.cl
  const discounts: Record<string, number> = {};
  payload.recommendedProducts.slice(0, 5).forEach((product, index) => {
    const percents = [52, 61, 69, 43, 37];
    discounts[product.id] = percents[index] ?? 30;
  });

  const secondBatch = payload.recommendedProducts.slice(5, 10);

  return (
    <div>
      {/* Full-width banner carousel */}
      <BannerCarousel
        banners={payload.banners}
        emptyLabel={Storefront.banner.empty}
        copy={Storefront.home}
        primaryHref={`/${locale}/products`}
        secondaryHref={`/${locale}/contact`}
      />

      <HomepageCategoryGrid
        locale={locale}
        title={Storefront.sections.productSeries}
        categories={payload.featuredCategories}
      />

      {/* Offers carousel */}
      <ProductCarousel
        locale={locale}
        products={payload.recommendedProducts.slice(0, 8)}
        title={Storefront.sections.offers}
        subtitle={Storefront.sections.offersSubtitle}
        ctaLabel={Storefront.sections.addToCart}
        emptyLabel={Storefront.emptyProducts}
        stockLabel={Storefront.product.stockAvailable}
        discountBadgeTemplate={Storefront.product.discountBadge}
        discounts={discounts}
      />

      {/* Featured products */}
      {secondBatch.length > 0 && (
        <ProductCarousel
          locale={locale}
          products={secondBatch}
          title={Storefront.sections.featured}
          ctaLabel={Storefront.sections.addToCart}
          emptyLabel={Storefront.emptyProducts}
          stockLabel={Storefront.product.stockAvailable}
        />
      )}

      {/* Wide banner */}
      {payload.banners.length > 1 && (
        <section className="py-4">
          <div className="mk-container">
            <div className="overflow-hidden rounded-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={payload.banners[1]?.imageUrl}
                alt=""
                className="h-[180px] w-full object-cover sm:h-[240px] lg:h-[300px]"
              />
            </div>
          </div>
        </section>
      )}

      {/* Social showcase */}
      <SocialShowcase copy={Storefront.socialShowcase} />

      {/* Catalog carousel */}
      <CatalogCarousel
        locale={locale}
        title={Storefront.sections.catalogs}
        copy={Storefront.catalogShowcase}
      />
    </div>
  );
}
