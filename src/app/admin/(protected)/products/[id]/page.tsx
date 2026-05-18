import React from 'react';
import { notFound } from 'next/navigation';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { ProductForm } from '@/components/admin/product-form';
import { getAdminCategoryTree } from '@/features/catalog/queries';
import { getLocalImagePath } from '@/features/catalog/local-image-paths';
import { getAdminDictionary } from '@/lib/admin-i18n';
import { db } from '@/lib/db';
import type { Locale } from '@/lib/i18n/config';

function getLocalizedCategoryName(
  node: Awaited<ReturnType<typeof getAdminCategoryTree>>[number],
  locale: Locale
) {
  return (
    {
      'zh-CN': node.nameZh,
      en: node.nameEn,
      es: node.nameEs,
      pt: node.namePt
    }[locale] ||
    node.nameZh ||
    node.nameEn
  );
}

function flattenCategories(
  nodes: Awaited<ReturnType<typeof getAdminCategoryTree>>,
  locale: Locale,
  prefix = ''
): Array<{ id: string; label: string }> {
  return nodes.flatMap((node) => {
    const name = getLocalizedCategoryName(node, locale);
    const label = prefix ? `${prefix} / ${name}` : name;

    return [
      { id: node.id, label },
      ...flattenCategories(node.children, locale, label)
    ];
  });
}

export default async function AdminEditProductPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, product, { locale, Admin }] = await Promise.all([
    getAdminCategoryTree(),
    db.product.findUnique({
      where: { id },
      include: {
        images: true
      }
    }),
    getAdminDictionary()
  ]);

  if (!product) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <AdminSectionHeader
        label="Settings"
        title={Admin.products.title}
        description={Admin.products.description}
      />
      <ProductForm
        mode="edit"
        categories={flattenCategories(categories, locale)}
        product={{
          ...product,
          priceUsd: product.priceUsd.toString(),
          coverImageUrl: getLocalImagePath(product.coverImageUrl) ?? '',
          images: product.images
            .map((image) => ({
              ...image,
              imageUrl: getLocalImagePath(image.imageUrl)
            }))
            .filter(
              (image): image is typeof product.images[number] & { imageUrl: string } =>
                Boolean(image.imageUrl)
            )
        }}
        copy={Admin.products}
        uploadLabel={Admin.common.upload}
      />
    </section>
  );
}
