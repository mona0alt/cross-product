import React from 'react';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { ProductForm } from '@/components/admin/product-form';
import type { AdminCategory } from '@/components/admin/admin-category-select';
import { getAdminCategoryTree } from '@/features/catalog/queries';
import { getAdminDictionary } from '@/lib/admin-i18n';
import type { Locale } from '@/lib/i18n/config';

function getLocalizedCategoryName(
  node: Awaited<ReturnType<typeof getAdminCategoryTree>>[number],
  locale: Locale
) {
  return (
    {
      'zh-CN': node.nameZh,
      en: node.nameEn,
      es: node.nameEs,
      pt: node.namePt
    }[locale] ||
    node.nameZh ||
    node.nameEn
  );
}

function toCategoryRows(
  nodes: Awaited<ReturnType<typeof getAdminCategoryTree>>,
  locale: Locale
): AdminCategory[] {
  return nodes.flatMap((node) => [
    {
      id: node.id,
      parentId: node.parentId,
      nameZh: getLocalizedCategoryName(node, locale)
    },
    ...toCategoryRows(node.children, locale)
  ]);
}

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
