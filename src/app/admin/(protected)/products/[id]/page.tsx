import React from 'react';
import { notFound } from 'next/navigation';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { ProductForm } from '@/components/admin/product-form';
import { getAdminCategoryTree } from '@/features/catalog/queries';
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
  const [categories, product] = await Promise.all([
    getAdminCategoryTree(),
    db.product.findUnique({
      where: { id },
      include: {
        images: true
      }
    })
  ]);

  if (!product) {
    notFound();
  }

  return (
    <section className="space-y-6">
      <AdminSectionHeader
        label="Products"
        title="编辑并重新审核商品"
        description="修改现有商品后重新进入审核确认，让演示流程保持与自动抓取商品一致。"
      />
      <ProductForm
        mode="edit"
        categories={flattenCategories(categories)}
        product={{
          ...product,
          priceUsd: product.priceUsd.toString()
        }}
      />
    </section>
  );
}
