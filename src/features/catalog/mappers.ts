import type { LocalizedCategoryFields, LocalizedProductFields } from '@/features/catalog/types';
import type {
  CatalogLocale,
  StorefrontCategory,
  StorefrontProductCard
} from '@/features/catalog/types';

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

function normalizeStorefrontImageUrl(imageUrl: string | null) {
  if (!imageUrl) {
    return imageUrl;
  }

  if (!imageUrl.startsWith('http')) {
    return imageUrl;
  }

  try {
    const url = new URL(imageUrl);

    if (url.hostname !== 'images.unsplash.com') {
      return imageUrl;
    }

    const width = Number(url.searchParams.get('w') ?? 0);
    if (!width || width < 800) {
      url.searchParams.set('w', '800');
    }
    url.searchParams.delete('h');

    return url.toString();
  } catch {
    return imageUrl;
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
    iconImageUrl: normalizeStorefrontImageUrl(value.iconImageUrl),
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
    .map((image) => image.imageUrl);

  return {
    id: value.id,
    slug: value.slug,
    productCode: value.productCode,
    coverImageUrl: value.coverImageUrl,
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
