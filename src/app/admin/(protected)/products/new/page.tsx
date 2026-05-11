import React from 'react';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { ProductForm } from '@/components/admin/product-form';
import { getAdminCategoryTree } from '@/features/catalog/queries';
import { getAdminDictionary } from '@/lib/admin-i18n';

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
  const [categories, { Admin }] = await Promise.all([
    getAdminCategoryTree(),
    getAdminDictionary()
  ]);

  return (
    <section className="space-y-6">
      <AdminSectionHeader
        label="Settings"
        title={Admin.products.title}
        description={Admin.products.description}
      />
      <ProductForm
        mode="create"
        categories={flattenCategories(categories)}
        copy={Admin.products}
        uploadLabel={Admin.common.upload}
      />
    </section>
  );
}
