import React from 'react';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
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
      <AdminSectionHeader
        label="Products"
        title="手动新建商品"
        description="创建后的商品不会直接上架，而是进入统一审核链路，和自动抓取商品一起处理。"
      />
      <ProductForm mode="create" categories={flattenCategories(categories)} />
    </section>
  );
}
