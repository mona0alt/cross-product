import React from 'react';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { ProductForm } from '@/components/admin/product-form';
import { toCategoryRows } from '@/features/admin/category-rows';
import { getAdminCategoryTree } from '@/features/catalog/queries';
import { getAdminDictionary } from '@/lib/admin-i18n';

export default async function AdminNewProductPage() {
  const [categories, { locale, Admin }] = await Promise.all([
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
        categories={toCategoryRows(categories, locale)}
        copy={Admin.products}
        uploadLabel={Admin.common.upload}
      />
    </section>
  );
}
