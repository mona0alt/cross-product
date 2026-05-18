import React from 'react';

import {
  ProductCenter,
  type ProductCenterCategory,
  type ProductCenterRow
} from '@/components/admin/product-center';
import {
  getAdminCategoryTree,
  getAdminProductList
} from '@/features/catalog/queries';
import { getLocalImagePath } from '@/features/catalog/local-image-paths';
import type { AdminCategoryTreeNode } from '@/features/catalog/types';
import { getAdminDictionary } from '@/lib/admin-i18n';
import type { Locale } from '@/lib/i18n/config';

function flattenCategories(nodes: AdminCategoryTreeNode[]): AdminCategoryTreeNode[] {
  return nodes.flatMap((node) => [node, ...flattenCategories(node.children)]);
}

function mapProducts(
  products: Awaited<ReturnType<typeof getAdminProductList>>,
  locale: Locale
): ProductCenterRow[] {
  return products.map((product) => ({
    id: product.id,
    slug: product.slug,
    productCode: product.productCode,
    categoryId: product.categoryId,
    localizedName: getLocalizedValue(product, 'name', locale),
    nameZh: product.nameZh,
    nameEn: product.nameEn,
    nameEs: product.nameEs,
    namePt: product.namePt,
    introZh: product.introZh,
    introEn: product.introEn,
    introEs: product.introEs,
    introPt: product.introPt,
    detailZh: product.detailZh,
    detailEn: product.detailEn,
    detailEs: product.detailEs,
    detailPt: product.detailPt,
    categoryName: getLocalizedValue(product.category, 'name', locale),
    status: product.status,
    priceUsd: Number(product.priceUsd),
    coverImageUrl: getLocalImagePath(product.coverImageUrl) ?? '',
    isRecommended: product.isRecommended,
    sortOrder: product.sortOrder,
    images: product.images
      .map((image) => ({
        imageUrl: getLocalImagePath(image.imageUrl),
        sortOrder: image.sortOrder
      }))
      .filter(
        (image): image is { imageUrl: string; sortOrder: number } =>
          Boolean(image.imageUrl)
      )
  }));
}

function mapCategories(
  categories: AdminCategoryTreeNode[],
  products: Awaited<ReturnType<typeof getAdminProductList>>,
  locale: Locale
): ProductCenterCategory[] {
  const allCategories = flattenCategories(categories).filter(
    (category) => category.isActive
  );
  const productCounts = new Map<string, number>();

  for (const product of products) {
    productCounts.set(
      product.categoryId,
      (productCounts.get(product.categoryId) ?? 0) + 1
    );
  }

  return allCategories.map((category) => ({
    id: category.id,
    parentId: category.parentId,
    slug: category.slug,
    sortOrder: category.sortOrder,
    iconImageUrl: getLocalImagePath(category.iconImageUrl),
    nameZh: getLocalizedValue(category, 'name', locale),
    nameEn: category.nameEn,
    nameEs: category.nameEs,
    namePt: category.namePt,
    descriptionZh: category.descriptionZh,
    descriptionEn: category.descriptionEn,
    descriptionEs: category.descriptionEs,
    descriptionPt: category.descriptionPt,
    isActive: category.isActive,
    productCount: productCounts.get(category.id) ?? 0
  }));
}

function getLocalizedValue(
  source: Partial<Record<'nameZh' | 'nameEn' | 'nameEs' | 'namePt', string | null>>,
  field: 'name',
  locale: Locale
) {
  const valueByLocale = {
    'zh-CN': source[`${field}Zh`],
    en: source[`${field}En`],
    es: source[`${field}Es`],
    pt: source[`${field}Pt`]
  }[locale];

  return valueByLocale || source.nameZh || source.nameEn || '';
}

export default async function AdminProductsPage() {
  const [products, categories, { locale, Admin }] = await Promise.all([
    getAdminProductList({}),
    getAdminCategoryTree(),
    getAdminDictionary()
  ]);

  return (
    <ProductCenter
      categories={mapCategories(categories, products, locale)}
      products={mapProducts(products, locale)}
      copy={Admin.products}
    />
  );
}
