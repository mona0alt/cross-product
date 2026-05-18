import React from 'react';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { ProductForm } from '@/components/admin/product-form';
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

function flattenCategories(
  nodes: Awaited<ReturnType<typeof getAdminCategoryTree>>,
  locale: Locale,
  prefix = ''
): Array<{ id: string; label: string }> {
  return nodes.flatMap((node) => {
    const name = getLocalizedCategoryName(node, locale);
    const label = prefix ? `${prefix} / ${name}` : name;

    return [
      { id: node.id, label },
      ...flattenCategories(node.children, locale, label)
    ];
  });
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
        categories={flattenCategories(categories, locale)}
        copy={Admin.products}
        uploadLabel={Admin.common.upload}
      />
    </section>
  );
}
