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
        label="Categories"
        title="分类管理"
        description="维护分类结构、图标和多语言映射，配合前台分类浏览与商品归档。"
      />
      <CategoryForm categories={flattenCategories(categories)} />
    </section>
  );
}
