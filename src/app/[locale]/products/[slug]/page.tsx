import React from 'react';
import { notFound } from 'next/navigation';

import { ProductGallery } from '@/components/storefront/product-gallery';
import { RecommendedProducts } from '@/components/storefront/recommended-products';
import { getHomepagePayload, getProductDetailBySlug } from '@/features/catalog/queries';
import { defaultLocale, isLocale, type Locale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/get-dictionary';

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale: Locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const messages = await getDictionary(locale);
  const { Storefront } = messages;
  const product = await getProductDetailBySlug(slug, locale);

  if (!product) {
    notFound();
  }

  const homepagePayload = await getHomepagePayload(locale);
  const recommendedProducts = homepagePayload.recommendedProducts.filter(
    (item) => item.slug !== product.slug
  );
  const whatsAppNumber = process.env.WHATSAPP_NUMBER ?? '15551234567';

  return (
    <div className="space-y-10">
      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_380px]">
        <ProductGallery
          images={
            product.images.length > 0 ? product.images : [product.coverImageUrl]
          }
          label={Storefront.sections.gallery}
        />
        <aside className="storefront-surface h-fit rounded-[var(--store-radius-lg)] p-6">
          <div className="space-y-5">
            <p className="storefront-eyebrow">
              {product.category?.name}
            </p>
            <h1 className="text-4xl font-black tracking-[-0.04em] text-[var(--store-text)]">
              {product.name}
            </h1>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-[var(--store-text-muted)]">
              {product.productCode}
            </p>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-[var(--store-accent)] px-4 py-2 text-sm font-semibold text-white">
                ${product.priceUsd.toFixed(2)}
              </span>
              {product.isRecommended ? (
                <span className="rounded-full border border-[var(--store-border-strong)] px-4 py-2 text-sm font-semibold text-[var(--store-accent)]">
                  {Storefront.products.filters.recommendedOnly}
                </span>
              ) : null}
            </div>
            <p className="text-base leading-8 text-[var(--store-text-muted)]">
              {product.detail}
            </p>
            <div className="grid gap-3">
              <a
                href={`https://wa.me/${whatsAppNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(product.name)}`}
                className="inline-flex items-center justify-center rounded-full bg-[var(--store-accent)] px-4 py-3 text-sm font-semibold text-white"
              >
                {Storefront.whatsApp}
              </a>
            </div>
          </div>
        </aside>
      </section>

      <RecommendedProducts
        locale={locale}
        products={recommendedProducts}
        title={Storefront.sections.related}
        emptyLabel={Storefront.emptyProducts}
        ctaLabel={Storefront.productCta}
        stockLabel={Storefront.product.stockAvailable}
      />
    </div>
  );
}
