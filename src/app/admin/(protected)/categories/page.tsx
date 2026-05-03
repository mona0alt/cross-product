import React from 'react';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { CategoryForm } from '@/components/admin/category-form';
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

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategoryTree();

  return (
    <section className="space-y-6">
      <AdminSectionHeader
        label="Settings"
        title="系统设置"
        description="管理分类结构与映射。"
      />
      <CategoryForm categories={flattenCategories(categories)} />
    </section>
  );
}
