import React from 'react';
import { notFound } from 'next/navigation';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { ProductForm } from '@/components/admin/product-form';
import { getLocalizedCategoryName, toCategoryRows } from '@/features/admin/category-rows';
import { getAdminCategoryTree } from '@/features/catalog/queries';
import { getLocalImagePath } from '@/features/catalog/local-image-paths';
import { getAdminDictionary } from '@/lib/admin-i18n';
import { db } from '@/lib/db';

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
        category: true,
        images: true
      }
    }),
    getAdminDictionary()
  ]);

  if (!product) {
    notFound();
  }

  const categoryRows = toCategoryRows(categories, locale);
  // The category tree only lists active categories; keep a product's
  // deactivated/deleted category selectable so saving cannot silently
  // clear it.
  const missingCategoryOption =
    product.categoryId && !categoryRows.some((category) => category.id === product.categoryId)
      ? {
          value: product.categoryId,
          label: product.category
            ? getLocalizedCategoryName(product.category, locale)
            : product.categoryId
        }
      : undefined;

  return (
    <section className="space-y-6">
      <AdminSectionHeader
        label="Settings"
        title={Admin.products.title}
        description={Admin.products.description}
      />
      <ProductForm
        mode="edit"
        categories={categoryRows}
        missingCategoryOption={missingCategoryOption}
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
