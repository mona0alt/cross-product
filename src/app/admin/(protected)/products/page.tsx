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
import type { AdminCategoryTreeNode } from '@/features/catalog/types';

function flattenCategories(nodes: AdminCategoryTreeNode[]): AdminCategoryTreeNode[] {
  return nodes.flatMap((node) => [node, ...flattenCategories(node.children)]);
}

function mapProducts(
  products: Awaited<ReturnType<typeof getAdminProductList>>
): ProductCenterRow[] {
  return products.map((product) => ({
    id: product.id,
    slug: product.slug,
    productCode: product.productCode,
    categoryId: product.categoryId,
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
    categoryName: product.category.nameZh,
    status: product.status,
    priceUsd: Number(product.priceUsd),
    coverImageUrl: product.coverImageUrl,
    isRecommended: product.isRecommended,
    sortOrder: product.sortOrder,
    images: product.images.map((image) => ({
      imageUrl: image.imageUrl,
      sortOrder: image.sortOrder
    }))
  }));
}

function mapCategories(
  categories: AdminCategoryTreeNode[],
  products: Awaited<ReturnType<typeof getAdminProductList>>
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
    iconImageUrl: category.iconImageUrl,
    nameZh: category.nameZh,
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

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    getAdminProductList({}),
    getAdminCategoryTree()
  ]);

  return (
    <ProductCenter
      categories={mapCategories(categories, products)}
      products={mapProducts(products)}
    />
  );
}
