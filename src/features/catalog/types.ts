import type { Locale } from '@/lib/i18n/config';

export type CatalogLocale = Locale;

export type LocalizedCategoryFields = {
  nameZh: string;
  nameEn: string;
  nameEs: string;
  namePt: string;
  descriptionZh?: string | null;
  descriptionEn?: string | null;
  descriptionEs?: string | null;
  descriptionPt?: string | null;
};

export type LocalizedProductFields = {
  nameZh: string;
  nameEn: string;
  nameEs: string;
  namePt: string;
  introZh: string;
  introEn: string;
  introEs: string;
  introPt: string;
  detailZh: string;
  detailEn: string;
  detailEs: string;
  detailPt: string;
};

export type StorefrontCategory = {
  id: string;
  slug: string;
  iconImageUrl: string | null;
  name: string;
  description: string | null;
};

export type StorefrontCategoryGroup = StorefrontCategory & {
  children: StorefrontCategory[];
  products?: StorefrontProductCard[];
};

export type StorefrontProductCard = {
  id: string;
  slug: string;
  productCode: string;
  coverImageUrl: string;
  priceUsd: number;
  isRecommended: boolean;
  name: string;
  intro: string;
  detail: string;
  images: string[];
  category?: {
    slug: string;
    name: string;
  };
};

export type HomepagePayload = {
  banners: Array<{
    id: string;
    imageUrl: string;
    targetType: string;
    targetId: string | null;
    targetUrl: string | null;
    sortOrder: number;
    title?: string | null;
    description?: string | null;
  }>;
  featuredCategories: StorefrontCategory[];
  recommendedProducts: StorefrontProductCard[];
};

export const productListSorts = [
  'featured',
  'price-asc',
  'price-desc',
  'name-asc'
] as const;

export type ProductListSort = (typeof productListSorts)[number];

export type ProductListPayload = {
  filters: ProductListFilters;
  categoryGroups: StorefrontCategoryGroup[];
  products: StorefrontProductCard[];
};

export type ProductListFilters = {
  search?: string;
  categorySlug?: string;
  recommended?: boolean;
  sort?: ProductListSort;
};

export type AdminProductFilters = {
  search?: string;
  status?: string;
  categoryId?: string;
};

export type AdminCategoryTreeNode = {
  id: string;
  parentId: string | null;
  slug: string;
  sortOrder: number;
  iconImageUrl: string | null;
  isActive: boolean;
  nameZh: string;
  nameEn: string;
  nameEs: string;
  namePt: string;
  descriptionZh: string | null;
  descriptionEn: string | null;
  descriptionEs: string | null;
  descriptionPt: string | null;
  children: AdminCategoryTreeNode[];
};

export type PublishableProductInput = {
  categoryId: string;
  productCode: string;
  priceUsd: number | null | undefined;
  coverImageUrl: string;
  nameZh: string;
  nameEn: string;
  nameEs: string;
  namePt: string;
  introZh: string;
  introEn: string;
  introEs: string;
  introPt: string;
  detailZh: string;
  detailEn: string;
  detailEs: string;
  detailPt: string;
};
