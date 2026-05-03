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
        description="用统一表单节奏展示商品基础信息、多语言内容和图片素材，强调创建后仍需进入审核链路。"
      />
      <ProductForm mode="create" categories={flattenCategories(categories)} />
    </section>
  );
}
