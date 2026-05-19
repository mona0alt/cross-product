import React from 'react';

import {
  ProductCenter,
} from '@/components/admin/product-center';
import {
  getAdminCategoryTree,
  getAdminProductList
} from '@/features/catalog/queries';
import {
  mapAdminProductCenterCategories,
  mapAdminProductCenterRows
} from '@/features/admin/product-center-data';
import { getAdminDictionary } from '@/lib/admin-i18n';

export default async function AdminProductsPage() {
  const [products, categories, { locale, Admin }] = await Promise.all([
    getAdminProductList({}),
    getAdminCategoryTree(),
    getAdminDictionary()
  ]);

  return (
    <ProductCenter
      categories={mapAdminProductCenterCategories(categories, products, locale)}
      products={mapAdminProductCenterRows(products, locale)}
      locale={locale}
      copy={Admin.products}
    />
  );
}
