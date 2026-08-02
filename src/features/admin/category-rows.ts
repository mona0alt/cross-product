import type { AdminCategory } from '@/components/admin/admin-category-select';
import type { getAdminCategoryTree } from '@/features/catalog/queries';
import type { Locale } from '@/lib/i18n/config';

type AdminCategoryTree = Awaited<ReturnType<typeof getAdminCategoryTree>>;

type LocalizedCategoryNames = {
  nameZh: string;
  nameEn: string;
  nameEs: string;
  namePt: string;
};

export function getLocalizedCategoryName(
  category: LocalizedCategoryNames,
  locale: Locale
): string {
  return (
    {
      'zh-CN': category.nameZh,
      en: category.nameEn,
      es: category.nameEs,
      pt: category.namePt
    }[locale] ||
    category.nameZh ||
    category.nameEn
  );
}

export function toCategoryRows(
  nodes: AdminCategoryTree,
  locale: Locale
): AdminCategory[] {
  return nodes.flatMap((node) => [
    {
      id: node.id,
      parentId: node.parentId,
      nameZh: getLocalizedCategoryName(node, locale)
    },
    ...toCategoryRows(node.children, locale)
  ]);
}
