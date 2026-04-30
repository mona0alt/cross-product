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
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
          Products
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
          编辑并重新审核商品
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          修改内容后可以重新进入审核链路，确保前台上架商品的字段完整度一致。
        </p>
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
