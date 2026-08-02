import React from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';

import { CategoryChildGrid } from '@/components/storefront/category-child-grid';
import { ProductCard } from '@/components/storefront/product-card';
import { ResultsToolbar } from '@/components/storefront/results-toolbar';
import { productListSorts, type ProductListSort } from '@/features/catalog/types';
import { getProductListPayload } from '@/features/catalog/queries';
import { defaultLocale, isLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';

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

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const resolvedSearchParams = await searchParams;
  const sort = getSortParam(resolvedSearchParams.sort);
  const messages = await getDictionary(locale);
  const { Storefront } = messages;
  const payload = await getProductListPayload(
    {
      categorySlug: slug,
      sort
    },
    locale
  );

  const matchedRoot = payload.categoryGroups.find(
    (group) => group.slug === slug
  );
  const matchedLeaf = matchedRoot
    ? undefined
    : payload.categoryGroups
        .flatMap((group) => group.children)
        .find((child) => child.slug === slug);
  const parentRoot = matchedLeaf
    ? payload.categoryGroups.find((group) =>
        group.children.some((child) => child.slug === slug)
      )
    : undefined;

  const breadcrumbItems: Array<{ label: string; href?: string }> = [
    { label: Storefront.nav.home, href: `/${locale}` }
  ];
  if (matchedRoot) {
    breadcrumbItems.push({ label: matchedRoot.name });
  } else if (matchedLeaf) {
    if (parentRoot) {
      breadcrumbItems.push({
        label: parentRoot.name,
        href: `/${locale}/categories/${parentRoot.slug}`
      });
    }
    breadcrumbItems.push({ label: matchedLeaf.name });
  } else {
    breadcrumbItems.push({ label: Storefront.categories.title });
  }

  const breadcrumbNav = (
    <nav
      aria-label="breadcrumb"
      className="text-sm text-[var(--store-text-muted)]"
    >
      <ol className="flex flex-wrap items-center">
        {breadcrumbItems.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center">
            {index > 0 ? (
              <span aria-hidden="true" className="mx-2">
                /
              </span>
            ) : null}
            {item.href ? (
              <Link
                href={item.href}
                className="transition hover:text-[var(--store-text)]"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-[var(--store-text)]">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {matchedRoot ? (
        <>
          {breadcrumbNav}
          <div className="mt-6 space-y-6">
            <ResultsToolbar
              eyebrow={Storefront.categories.eyebrow}
              title={matchedRoot.name}
              description={
                matchedRoot.description ?? Storefront.categories.description
              }
            />

            <CategoryChildGrid locale={locale} categories={matchedRoot.children} />
          </div>
        </>
      ) : (
        <>
          {breadcrumbNav}

          <div className="mt-6">
            {payload.products.length === 0 ? (
              <p className="storefront-surface rounded-[var(--store-radius-lg)] p-6 text-sm text-[var(--store-text-muted)]">
                {Storefront.emptyProducts}
              </p>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {payload.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    locale={locale}
                    product={product}
                    ctaLabel={Storefront.productCta}
                    stockLabel={Storefront.product.stockAvailable}
                    fullWidth
                    minimal
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
