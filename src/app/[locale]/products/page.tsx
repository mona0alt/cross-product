import React from 'react';
import type { Locale } from '@/lib/i18n/config';

import { FilterSidebar } from '@/components/storefront/filter-sidebar';
import { ProductCard } from '@/components/storefront/product-card';
import { ResultsToolbar } from '@/components/storefront/results-toolbar';
import { getProductListPayload } from '@/features/catalog/queries';
import { defaultLocale, isLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';

type SearchParams = Record<string, string | string[] | undefined>;

export const dynamic = 'force-dynamic';

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function ProductsPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const resolvedSearchParams = await searchParams;
  const category = getSingleParam(resolvedSearchParams.category);
  const subcategory = getSingleParam(resolvedSearchParams.subcategory);
  const search = getSingleParam(resolvedSearchParams.search);
  const recommended = getSingleParam(resolvedSearchParams.recommended) === '1';
  const messages = await getDictionary(locale);
  const { Storefront } = messages;
  const payload = await getProductListPayload(
    {
      search,
      categorySlug: subcategory ?? category,
      recommended
    },
    locale
  );
  const matchedPrimary =
    payload.categoryGroups.find((group) => group.slug === category)?.name ?? category;
  const matchedSecondary =
    payload.categoryGroups
      .flatMap((group) => group.children)
      .find((child) => child.slug === subcategory)?.name ?? subcategory;
  const activeSummary = [
    search,
    matchedPrimary,
    matchedSecondary,
    recommended ? Storefront.products.filters.recommendedOnly : undefined
  ]
    .filter(Boolean)
    .join(' • ');

  return (
    <form className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
      <FilterSidebar
        search={search}
        category={category}
        subcategory={subcategory}
        recommended={recommended}
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
          eyebrow={Storefront.products.eyebrow}
          title={Storefront.products.title}
          description={Storefront.products.description}
          activeSummary={activeSummary}
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
              />
            ))}
          </div>
        )}
      </div>
    </form>
  );
}
