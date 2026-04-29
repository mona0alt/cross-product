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
  }>;
  featuredCategories: StorefrontCategory[];
  recommendedProducts: StorefrontProductCard[];
};

export type ProductListPayload = {
  filters: ProductListFilters;
  categoryGroups: StorefrontCategoryGroup[];
  products: StorefrontProductCard[];
};

export type ProductListFilters = {
  search?: string;
  categorySlug?: string;
  recommended?: boolean;
};

export type AdminProductFilters = {
  search?: string;
  status?: string;
  categoryId?: string;
};

export type AdminCategoryTreeNode = {
  id: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  nameZh: string;
  nameEn: string;
  nameEs: string;
  namePt: string;
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
