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
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <ProductGallery images={product.images.length > 0 ? product.images : [product.coverImageUrl]} />
        <div className="space-y-5 rounded-[1.75rem] border border-white/70 bg-white/90 p-6 shadow-[0_24px_60px_-45px_rgba(15,23,42,0.55)]">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            {product.category?.name}
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-950">
            {product.name}
          </h1>
          <p className="text-sm text-slate-500">{product.productCode}</p>
          <p className="text-base leading-8 text-slate-600">{product.detail}</p>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">
              ${product.priceUsd.toFixed(2)}
            </span>
            <a
              href={`https://wa.me/${whatsAppNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(product.name)}`}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
            >
              {Storefront.whatsApp}
            </a>
          </div>
        </div>
      </section>

      <RecommendedProducts
        locale={locale}
        products={recommendedProducts}
        title={Storefront.sections.related}
        emptyLabel={Storefront.emptyProducts}
        ctaLabel={Storefront.productCta}
      />
    </div>
  );
}
