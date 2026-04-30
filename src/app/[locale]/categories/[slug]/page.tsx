import React from 'react';
import type { Locale } from '@/lib/i18n/config';

import { FilterSidebar } from '@/components/storefront/filter-sidebar';
import { ProductCard } from '@/components/storefront/product-card';
import { ResultsToolbar } from '@/components/storefront/results-toolbar';
import { getProductListPayload } from '@/features/catalog/queries';
import { defaultLocale, isLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const messages = await getDictionary(locale);
  const { Storefront } = messages;
  const payload = await getProductListPayload(
    {
      categorySlug: slug
    },
    locale
  );

  const matchedCategory =
    payload.categoryGroups.find((group) => group.slug === slug) ??
    payload.categoryGroups
      .flatMap((group) => group.children)
      .find((child) => child.slug === slug);
  const selectedPrimary =
    payload.categoryGroups.find((group) => group.slug === slug)?.slug ??
    payload.categoryGroups.find((group) =>
      group.children.some((child) => child.slug === slug)
    )?.slug;
  const selectedSecondary =
    payload.categoryGroups
      .flatMap((group) => group.children)
      .find((child) => child.slug === slug)?.slug ?? '';

  return (
    <form className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
      <FilterSidebar
        search=""
        category={selectedPrimary}
        subcategory={selectedSecondary}
        recommended={false}
        hideCategoryFilters
        copy={{
          title: Storefront.products.filters.title,
          searchPlaceholder: Storefront.searchPlaceholder,
          allPrimary: Storefront.products.filters.allPrimary,
          allSecondary: Storefront.products.filters.allSecondary,
          recommendedOnly: Storefront.products.filters.recommendedOnly,
          apply: Storefront.products.filters.apply
        }}
        categoryGroups={payload.categoryGroups}
      />

      <div className="space-y-6">
        <ResultsToolbar
          eyebrow={Storefront.categories.eyebrow}
          title={matchedCategory?.name ?? Storefront.categories.title}
          description={
            matchedCategory?.description ?? Storefront.categories.description
          }
          activeSummary={matchedCategory?.name}
          sortLabel={Storefront.products.sortLabel}
        />

        {payload.products.length === 0 ? (
          <p className="storefront-surface rounded-[var(--store-radius-lg)] p-6 text-sm text-[var(--store-text-muted)]">
            {Storefront.emptyProducts}
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {payload.products.map((product) => (
              <ProductCard
                key={product.id}
                locale={locale}
                product={product}
                ctaLabel={Storefront.productCta}
                stockLabel={Storefront.product.stockAvailable}
              />
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
