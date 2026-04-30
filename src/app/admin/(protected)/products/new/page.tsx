import React from 'react';

import { ProductForm } from '@/components/admin/product-form';
import { getAdminCategoryTree } from '@/features/catalog/queries';

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

export default async function AdminNewProductPage() {
  const categories = await getAdminCategoryTree();

  return (
    <section className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
          Products
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
          手动新建商品
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          创建后的商品不会直接上架，而是进入统一审核链路，和自动抓取商品一起处理。
        </p>
      </div>
      <ProductForm mode="create" categories={flattenCategories(categories)} />
    </section>
  );
}
