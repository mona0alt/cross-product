import React from 'react';
import { notFound } from 'next/navigation';

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
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          Products
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          编辑商品
        </h2>
      </div>
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
