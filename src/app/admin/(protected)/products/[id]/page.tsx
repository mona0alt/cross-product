import React from 'react';
import { notFound } from 'next/navigation';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { ProductForm } from '@/components/admin/product-form';
import { getAdminCategoryTree } from '@/features/catalog/queries';
import { getLocalImagePath } from '@/features/catalog/local-image-paths';
import { getAdminDictionary } from '@/lib/admin-i18n';
import { db } from '@/lib/db';

function flattenCategories(
  nodes: Awaited<ReturnType<typeof getAdminCategoryTree>>,
  prefix = ''
): Array<{ id: string; label: string }> {
  return nodes.flatMap((node) => {
    const label = prefix ? `${prefix} / ${node.nameZh}` : node.nameZh;

    return [
      { id: node.id, label },
      ...flattenCategories(node.children, label)
    ];
  });
}

export default async function AdminEditProductPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, product, { Admin }] = await Promise.all([
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
        categories={flattenCategories(categories)}
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
