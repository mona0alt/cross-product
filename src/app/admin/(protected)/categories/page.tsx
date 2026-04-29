import React from 'react';

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
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          Categories
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          分类管理
        </h2>
      </div>
      <CategoryForm categories={flattenCategories(categories)} />
    </section>
  );
}
