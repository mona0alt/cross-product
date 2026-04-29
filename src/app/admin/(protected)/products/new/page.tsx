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
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          Products
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          新建商品草稿
        </h2>
      </div>
      <ProductForm mode="create" categories={flattenCategories(categories)} />
    </section>
  );
}
