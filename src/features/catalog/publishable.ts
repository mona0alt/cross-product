import type { PublishableProductInput } from '@/features/catalog/types';

function hasText(value: string) {
  return value.trim().length > 0;
}

export function getPublishBlockers(
  product: PublishableProductInput,
  options?: {
    categoryExists?: boolean;
  }
) {
  const blockers: string[] = [];

  if (!hasText(product.categoryId) || options?.categoryExists === false) {
    blockers.push('categoryId');
  }

  if (!hasText(product.productCode)) {
    blockers.push('productCode');
  }

  if (
    product.priceUsd == null ||
    !Number.isFinite(product.priceUsd) ||
    product.priceUsd <= 0
  ) {
    blockers.push('priceUsd');
  }

  if (!hasText(product.coverImageUrl)) {
    blockers.push('coverImageUrl');
  }

  for (const field of [
    'nameZh',
    'nameEn',
    'nameEs',
    'namePt',
    'introZh',
    'introEn',
    'introEs',
    'introPt',
    'detailZh',
    'detailEn',
    'detailEs',
    'detailPt'
  ] as const) {
    if (!hasText(product[field])) {
      blockers.push(field);
    }
  }

  return blockers;
}
