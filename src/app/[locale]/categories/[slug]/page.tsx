import React from 'react';
import Link from 'next/link';
import type { Locale } from '@/lib/i18n/config';

import { CategoryChildGrid } from '@/components/storefront/category-child-grid';
import { FilterSidebar } from '@/components/storefront/filter-sidebar';
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
  const selectedPrimary =
    matchedRoot?.slug ?? parentRoot?.slug;
  const selectedSecondary = matchedLeaf?.slug ?? '';

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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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

      {matchedRoot ? (
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
      ) : (
        <form className="mt-6 grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
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
              title={matchedLeaf?.name ?? Storefront.categories.title}
              description={
                matchedLeaf?.description ?? Storefront.categories.description
              }
              activeSummary={matchedLeaf?.name}
              sort={sort}
              sortLabel={Storefront.products.sortLabel}
              sortOptions={[
                {
                  value: 'featured',
                  label: Storefront.products.sortOptions.featured
                },
                {
                  value: 'price-asc',
                  label: Storefront.products.sortOptions.priceAsc
                },
                {
                  value: 'price-desc',
                  label: Storefront.products.sortOptions.priceDesc
                },
                {
                  value: 'name-asc',
                  label: Storefront.products.sortOptions.nameAsc
                }
              ]}
            />

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
                  />
                ))}
              </div>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
