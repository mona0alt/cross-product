import React from 'react';
import type { Locale } from '@/lib/i18n/config';

import { ProductCard } from '@/components/storefront/product-card';
import { productListSorts, type ProductListSort } from '@/features/catalog/types';
import { getProductListPayload } from '@/features/catalog/queries';
import { defaultLocale, isLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';

type SearchParams = Record<string, string | string[] | undefined>;

export const dynamic = 'force-dynamic';

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getSortParam(value: string | string[] | undefined): ProductListSort {
  const singleValue = getSingleParam(value);

  return productListSorts.includes(singleValue as ProductListSort)
    ? (singleValue as ProductListSort)
    : 'featured';
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
  const sort = getSortParam(resolvedSearchParams.sort);
  const messages = await getDictionary(locale);
  const { Storefront } = messages;
  const payload = await getProductListPayload(
    {
      search,
      categorySlug: subcategory ?? category,
      recommended,
      sort
    },
    locale
  );

  return (
    <section className="bg-[#f4f0ed] py-6 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {payload.products.length === 0 ? (
          <p className="rounded-[24px] border border-[#d8cec7] bg-white/82 p-6 text-sm text-[var(--mk-text-muted)] shadow-[0_18px_48px_rgba(32,26,25,0.08)]">
            {Storefront.emptyProducts}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {payload.products.map((product) => (
              <ProductCard
                key={product.id}
                locale={locale}
                product={product}
                ctaLabel={Storefront.productCta}
                stockLabel={Storefront.product.stockAvailable}
                fullWidth
                variant="premiumCatalog"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
