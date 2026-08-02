import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ProductGallery } from '@/components/storefront/product-gallery';
import { ProductRecommendationsCarousel } from '@/components/storefront/product-recommendations-carousel';
import { getRuntimeSystemSettings } from '@/features/admin/system-settings-actions';
import {
  getProductDetailBySlug,
  getRecommendedProducts
} from '@/features/catalog/queries';
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
  const [messages, runtimeSettings, product] = await Promise.all([
    getDictionary(locale),
    getRuntimeSystemSettings(),
    getProductDetailBySlug(slug, locale)
  ]);
  const { Storefront } = messages;

  if (!product) {
    notFound();
  }

  const recommendedProducts = await getRecommendedProducts(locale, product.id);

  const galleryImages =
    product.images.length > 0 ? product.images : [product.coverImageUrl];
  const whatsAppNumber = runtimeSettings.contact.whatsappNumber;
  const whatsAppHref = `https://wa.me/${whatsAppNumber.replace(/[^\d]/g, '')}?text=${encodeURIComponent(product.name)}`;

  const breadcrumbItems: Array<{ label: string; href?: string }> = [
    { label: Storefront.nav.home, href: `/${locale}` }
  ];
  if (product.category) {
    if (product.category.parent) {
      breadcrumbItems.push({
        label: product.category.parent.name,
        href: `/${locale}/categories/${product.category.parent.slug}`
      });
    }
    breadcrumbItems.push({
      label: product.category.name,
      href: `/${locale}/categories/${product.category.slug}`
    });
  }
  breadcrumbItems.push({ label: product.name });

  return (
    <div className="mx-auto max-w-[1440px] px-3 py-4 sm:px-5 lg:px-6">
      <nav
        aria-label="breadcrumb"
        className="mb-4 text-sm text-[var(--store-text-muted)]"
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

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.12fr)_minmax(380px,0.88fr)] lg:items-stretch xl:gap-5">
        <div className="h-full">
          <ProductGallery images={galleryImages} />
        </div>

        <aside className="flex h-full min-h-[360px] flex-col overflow-hidden rounded-[var(--mk-radius-lg)] border border-[var(--mk-border)] bg-white shadow-[0_18px_44px_rgba(112,89,81,0.08)] sm:min-h-[460px] lg:min-h-[560px]">
          <div className="flex flex-1 flex-col justify-center space-y-5 p-5 sm:p-6 lg:p-7">
            <div className="space-y-3 border-b border-[var(--mk-border)] pb-5">
              {product.category?.name ? (
                <p className="inline-flex rounded-full bg-[var(--mk-bg-muted)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--mk-accent)]">
                  {product.category.name}
                </p>
              ) : null}
              <h1 className="text-3xl font-black leading-tight tracking-[-0.03em] text-[var(--mk-text)] sm:text-4xl">
                {product.name}
              </h1>
            </div>

            <div className="space-y-3">
              <div className="rounded-[var(--mk-radius-md)] bg-[var(--mk-bg-muted)] px-4 py-3.5">
                <p className="text-[15px] leading-7 text-[var(--mk-text)]">
                  {product.intro}
                </p>
              </div>
              <p className="border-l-2 border-[var(--mk-accent)] pl-4 text-[15px] leading-7 text-[var(--mk-text-muted)]">
                {product.detail}
              </p>
            </div>
          </div>

          <div className="grid gap-2 border-t border-[var(--mk-border)] bg-[var(--mk-bg-muted)] p-3 sm:grid-cols-2">
            <a
              href={whatsAppHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-[var(--mk-radius-md)] bg-[var(--mk-accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--mk-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mk-accent)]"
            >
              {Storefront.whatsApp}
            </a>
            <a
              href={`/${locale}/subscribe`}
              className="inline-flex min-h-11 items-center justify-center rounded-[var(--mk-radius-md)] border border-[var(--mk-border-strong)] bg-white px-4 py-3 text-sm font-semibold text-[var(--mk-accent)] transition hover:border-[var(--mk-accent)] hover:bg-white/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mk-accent)]"
            >
              {Storefront.nav.subscribe}
            </a>
          </div>
        </aside>
      </section>

      {recommendedProducts.length > 0 ? (
        <section className="mt-8 sm:mt-10">
          <h2 className="mk-display-font mb-5 text-2xl font-semibold text-[var(--mk-accent)] sm:text-3xl">
            {Storefront.productDetail.recommendedTitle}
          </h2>
          <ProductRecommendationsCarousel
            locale={locale}
            products={recommendedProducts}
          />
        </section>
      ) : null}
    </div>
  );
}
