import React from 'react';
import type { Locale } from '@/lib/i18n/config';

import { ProductCard } from '@/components/storefront/product-card';
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

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
          {Storefront.products.eyebrow}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          {Storefront.products.title}
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          {Storefront.products.description}
        </p>
      </section>

      <form className="grid gap-4 rounded-[1.75rem] border border-white/70 bg-white/90 p-5 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.55)] md:grid-cols-4">
        <input
          name="search"
          defaultValue={search}
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          placeholder={Storefront.searchPlaceholder}
        />
        <select
          name="category"
          defaultValue={category ?? ''}
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        >
          <option value="">{Storefront.products.filters.allPrimary}</option>
          {payload.categoryGroups.map((group) => (
            <option key={group.id} value={group.slug}>
              {group.name}
            </option>
          ))}
        </select>
        <select
          name="subcategory"
          defaultValue={subcategory ?? ''}
          className="rounded-2xl border border-slate-200 px-4 py-3 text-sm"
        >
          <option value="">{Storefront.products.filters.allSecondary}</option>
          {payload.categoryGroups.flatMap((group) =>
            group.children.map((child) => (
              <option key={child.id} value={child.slug}>
                {group.name} / {child.name}
              </option>
            ))
          )}
        </select>
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm">
          <label className="flex items-center gap-2 text-slate-700">
            <input
              type="checkbox"
              name="recommended"
              value="1"
              defaultChecked={recommended}
            />
            {Storefront.products.filters.recommendedOnly}
          </label>
          <button
            type="submit"
            className="rounded-full bg-slate-950 px-4 py-2 text-white"
          >
            {Storefront.products.filters.apply}
          </button>
        </div>
      </form>

      {payload.products.length === 0 ? (
        <p className="rounded-[1.5rem] border border-dashed border-slate-300 bg-white/80 p-6 text-sm text-slate-500">
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
  );
}
