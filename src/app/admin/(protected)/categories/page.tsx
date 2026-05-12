import React from 'react';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { CategoryForm, type CategoryRecord } from '@/components/admin/category-form';
import { getAdminCategoryTree } from '@/features/catalog/queries';
import { getLocalImagePath } from '@/features/catalog/local-image-paths';

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

function flattenCategoryRecords(
  nodes: Awaited<ReturnType<typeof getAdminCategoryTree>>
): CategoryRecord[] {
  return nodes.flatMap((node) => [
    {
      id: node.id,
      parentId: node.parentId,
      slug: node.slug,
      sortOrder: node.sortOrder,
      iconImageUrl: getLocalImagePath(node.iconImageUrl),
      isActive: node.isActive,
      nameZh: node.nameZh,
      nameEn: node.nameEn,
      nameEs: node.nameEs,
      namePt: node.namePt,
      descriptionZh: node.descriptionZh,
      descriptionEn: node.descriptionEn,
      descriptionEs: node.descriptionEs,
      descriptionPt: node.descriptionPt
    },
    ...flattenCategoryRecords(node.children)
  ]);
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
      <CategoryForm
        categories={flattenCategories(categories)}
        records={flattenCategoryRecords(categories)}
      />
    </section>
  );
}
