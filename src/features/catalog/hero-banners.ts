import type { HomepagePayload } from '@/features/catalog/types';
import type { Locale } from '@/lib/i18n/config';

export function getHomepageHeroBanners(
  payload: HomepagePayload,
  locale: Locale
) {
  const categoryBanners = payload.rootCategories
    .filter((category) => Boolean(category.iconImageUrl))
    .map((category, index) => ({
      id: `category-${category.id}`,
      imageUrl: category.iconImageUrl ?? '',
      targetType: 'category',
      targetId: category.id,
      targetUrl: `/${locale}/categories/${category.slug}`,
      targetCategorySlug: category.slug,
      targetCategoryIsLeaf: false,
      sortOrder: index + 1,
      title: category.name,
      description: category.description
    }));

  return categoryBanners.length > 0 ? categoryBanners : payload.banners;
}
