import React from 'react';
import type { Locale } from '@/lib/i18n/config';

import { ProductCard } from '@/components/storefront/product-card';
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

  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
          {Storefront.categories.eyebrow}
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
          {matchedCategory?.name ?? Storefront.categories.title}
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-slate-600">
          {matchedCategory?.description ?? Storefront.categories.description}
        </p>
      </section>

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
