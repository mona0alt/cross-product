import type { LocalizedCategoryFields, LocalizedProductFields } from '@/features/catalog/types';
import type {
  CatalogLocale,
  StorefrontCategory,
  StorefrontProductCard
} from '@/features/catalog/types';
import { getLocalImagePath } from '@/features/catalog/local-image-paths';

function getLocalizedPair<
  TValue extends LocalizedCategoryFields | LocalizedProductFields,
  TPrefix extends 'name' | 'description' | 'intro' | 'detail'
>(value: TValue, locale: CatalogLocale, prefix: TPrefix) {
  switch (locale) {
    case 'en':
      return value[`${prefix}En` as keyof TValue] as string;
    case 'es':
      return value[`${prefix}Es` as keyof TValue] as string;
    case 'pt':
      return value[`${prefix}Pt` as keyof TValue] as string;
    case 'zh-CN':
    default:
      return value[`${prefix}Zh` as keyof TValue] as string;
  }
}

export function mapLocalizedCategory<
  TValue extends {
    id: string;
    slug: string;
    iconImageUrl: string | null;
  } & LocalizedCategoryFields
>(value: TValue, locale: CatalogLocale): StorefrontCategory {
  return {
    id: value.id,
    slug: value.slug,
    iconImageUrl: getLocalImagePath(value.iconImageUrl),
    name: getLocalizedPair(value, locale, 'name'),
    description: getLocalizedPair(value, locale, 'description') ?? null
  };
}

export function mapLocalizedProduct<
  TValue extends {
    id: string;
    slug: string;
    productCode: string;
    coverImageUrl: string;
    priceUsd: number | { toString(): string } | string;
    isRecommended: boolean;
    images?: Array<{
      imageUrl: string;
      sortOrder?: number;
    }>;
    category?: {
      slug: string;
    } & LocalizedCategoryFields;
  } & LocalizedProductFields
>(value: TValue, locale: CatalogLocale): StorefrontProductCard {
  const images = [...(value.images ?? [])]
    .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0))
    .map((image) => getLocalImagePath(image.imageUrl))
    .filter((imageUrl): imageUrl is string => Boolean(imageUrl));

  return {
    id: value.id,
    slug: value.slug,
    productCode: value.productCode,
    coverImageUrl: getLocalImagePath(value.coverImageUrl) ?? '',
    priceUsd: Number(value.priceUsd),
    isRecommended: value.isRecommended,
    name: getLocalizedPair(value, locale, 'name'),
    intro: getLocalizedPair(value, locale, 'intro'),
    detail: getLocalizedPair(value, locale, 'detail'),
    images,
    category: value.category
      ? {
          slug: value.category.slug,
          name: getLocalizedPair(value.category, locale, 'name')
        }
      : undefined
  };
}
