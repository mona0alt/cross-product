import { db } from '@/lib/db';
import type {
  AdminCategoryTreeNode,
  AdminProductFilters,
  CatalogLocale,
  HomepagePayload,
  ProductListFilters,
  ProductListPayload,
  StorefrontCategory,
  StorefrontCategoryGroup
} from '@/features/catalog/types';
import { mapLocalizedCategory, mapLocalizedProduct } from '@/features/catalog/mappers';
import { getLocalImagePath } from '@/features/catalog/local-image-paths';

type StorefrontCategoryRecord = {
  id: string;
  parentId: string | null;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  iconImageUrl: string | null;
  nameZh: string;
  nameEn: string;
  nameEs: string;
  namePt: string;
  descriptionZh: string | null;
  descriptionEn: string | null;
  descriptionEs: string | null;
  descriptionPt: string | null;
};

type StorefrontCategoryGroupNode = StorefrontCategory & {
  parentId: string | null;
  children: StorefrontCategory[];
};

function buildStorefrontCategoryGroupsFromRecords(
  categories: StorefrontCategoryRecord[],
  locale: CatalogLocale
): StorefrontCategoryGroup[] {
  const activeCategories = categories.filter((category) => category.isActive);
  const nodes = new Map<string, StorefrontCategoryGroupNode>(
    activeCategories.map((category) => [
      category.id,
      {
        ...mapLocalizedCategory(category, locale),
        parentId: category.parentId,
        children: []
      }
    ])
  );
  const roots: StorefrontCategoryGroupNode[] = [];

  for (const category of activeCategories) {
    const node = nodes.get(category.id);

    if (!node) {
      continue;
    }

    const parentNode = category.parentId ? nodes.get(category.parentId) : null;

    if (parentNode) {
      parentNode.children.push({
        id: node.id,
        slug: node.slug,
        iconImageUrl: node.iconImageUrl,
        name: node.name,
        description: node.description
      });
      continue;
    }

    roots.push(node);
  }

  return roots.map((root) => ({
    id: root.id,
    slug: root.slug,
    iconImageUrl: root.iconImageUrl,
    name: root.name,
    description: root.description,
    children: root.children
  }));
}

function getBannerCategoryImageUrl(
  categories: StorefrontCategoryRecord[],
  targetCategoryId: string | null
) {
  if (!targetCategoryId) {
    return null;
  }

  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const childrenByParentId = new Map<string | null, StorefrontCategoryRecord[]>();

  for (const category of categories) {
    const siblings = childrenByParentId.get(category.parentId) ?? [];
    siblings.push(category);
    childrenByParentId.set(category.parentId, siblings);
  }

  const targetCategory = categoryById.get(targetCategoryId);

  if (!targetCategory) {
    return null;
  }

  const directImageUrl = getLocalImagePath(targetCategory.iconImageUrl);

  if (directImageUrl) {
    return directImageUrl;
  }

  const resolveDescendantImage = (parentId: string): string | null => {
    const children = childrenByParentId.get(parentId) ?? [];

    for (const child of children) {
      if (child.isActive) {
        const childImageUrl = getLocalImagePath(child.iconImageUrl);

        if (childImageUrl) {
          return childImageUrl;
        }
      }

      const descendantImageUrl = resolveDescendantImage(child.id);

      if (descendantImageUrl) {
        return descendantImageUrl;
      }
    }

    return null;
  };

  return resolveDescendantImage(targetCategory.id);
}

export async function getHomepagePayload(
  locale: CatalogLocale
): Promise<HomepagePayload> {
  const [banners, categories, products] = await Promise.all([
    db.banner.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        sortOrder: 'asc'
      }
    }),
    db.category.findMany({
      orderBy: [
        {
          sortOrder: 'asc'
        },
        {
          createdAt: 'asc'
        }
      ]
    }),
    db.product.findMany({
      where: {
        status: 'published',
        isRecommended: true
      },
      include: {
        images: true,
        category: true
      },
      orderBy: [
        {
          sortOrder: 'asc'
        },
        {
          publishedAt: 'desc'
        }
      ]
    })
  ]);
  const categoryGroups = buildStorefrontCategoryGroupsFromRecords(
    categories,
    locale
  );

  return {
    banners: banners.map((banner) => ({
      id: banner.id,
      imageUrl:
        banner.targetType === 'category'
          ? getBannerCategoryImageUrl(categories, banner.targetId) ??
            banner.imageUrl
          : banner.imageUrl,
      targetType: banner.targetType,
      targetId: banner.targetId,
      targetUrl: banner.targetUrl,
      sortOrder: banner.sortOrder
    })),
    featuredCategories: categoryGroups.map((category) => ({
      id: category.id,
      slug: category.slug,
      iconImageUrl: category.iconImageUrl,
      name: category.name,
      description: category.description
    })),
    recommendedProducts: products.map((product) =>
      mapLocalizedProduct(product, locale)
    )
  };
}

export async function getProductListPayload(
  filters: ProductListFilters,
  locale: CatalogLocale
): Promise<ProductListPayload> {
  const [products, categoryGroups] = await Promise.all([
    db.product.findMany({
      where: {
        status: 'published',
        ...(filters.recommended ? { isRecommended: true } : {}),
        ...(filters.search
          ? {
              OR: [
                { productCode: { contains: filters.search, mode: 'insensitive' } },
                { nameZh: { contains: filters.search, mode: 'insensitive' } },
                { nameEn: { contains: filters.search, mode: 'insensitive' } },
                { nameEs: { contains: filters.search, mode: 'insensitive' } },
                { namePt: { contains: filters.search, mode: 'insensitive' } }
              ]
            }
          : {}),
        ...(filters.categorySlug
          ? {
              OR: [
                {
                  category: {
                    slug: filters.categorySlug
                  }
                },
                {
                  category: {
                    parent: {
                      slug: filters.categorySlug
                    }
                  }
                }
              ]
            }
          : {})
      },
      include: {
        images: true,
        category: true
      },
      orderBy: [
        {
          sortOrder: 'asc'
        },
        {
          publishedAt: 'desc'
        }
      ]
    }),
    db.category.findMany({
      orderBy: [
        {
          sortOrder: 'asc'
        },
        {
          createdAt: 'asc'
        }
      ]
    })
  ]);

  return {
    filters,
    categoryGroups: buildStorefrontCategoryGroupsFromRecords(
      categoryGroups,
      locale
    ),
    products: products.map((product) => mapLocalizedProduct(product, locale))
  };
}

export async function getStorefrontCategoryGroups(locale: CatalogLocale) {
  const groups = await db.category.findMany({
    orderBy: [
      {
        sortOrder: 'asc'
      },
      {
        createdAt: 'asc'
      }
    ]
  });

  return buildStorefrontCategoryGroupsFromRecords(groups, locale);
}

export async function getProductDetailBySlug(
  slug: string,
  locale: CatalogLocale
) {
  const product = await db.product.findFirst({
    where: {
      slug,
      status: 'published'
    },
    include: {
      images: true,
      category: true
    }
  });

  if (!product) {
    return null;
  }

  return mapLocalizedProduct(product, locale);
}

export async function getAdminProductList(filters: AdminProductFilters) {
  return db.product.findMany({
    where: {
      ...(filters.status ? { status: filters.status as never } : {}),
      ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(filters.search
        ? {
            OR: [
              { productCode: { contains: filters.search, mode: 'insensitive' } },
              { nameZh: { contains: filters.search, mode: 'insensitive' } },
              { nameEn: { contains: filters.search, mode: 'insensitive' } }
            ]
          }
        : {})
    },
    include: {
      category: true,
      images: true
    },
    orderBy: [
      {
        updatedAt: 'desc'
      }
    ]
  });
}

export async function getAdminCategoryTree(): Promise<AdminCategoryTreeNode[]> {
  const categories = await db.category.findMany({
    orderBy: [
      {
        sortOrder: 'asc'
      }
    ]
  });

  const grouped = new Map<string | null, AdminCategoryTreeNode[]>();

  for (const category of categories) {
    const node: AdminCategoryTreeNode = {
      id: category.id,
      parentId: category.parentId,
      slug: category.slug,
      sortOrder: category.sortOrder,
      iconImageUrl: category.iconImageUrl,
      isActive: category.isActive,
      nameZh: category.nameZh,
      nameEn: category.nameEn,
      nameEs: category.nameEs,
      namePt: category.namePt,
      descriptionZh: category.descriptionZh,
      descriptionEn: category.descriptionEn,
      descriptionEs: category.descriptionEs,
      descriptionPt: category.descriptionPt,
      children: []
    };

    const siblings = grouped.get(category.parentId) ?? [];
    siblings.push(node);
    grouped.set(category.parentId, siblings);
  }

  function attachChildren(parentId: string | null): AdminCategoryTreeNode[] {
    return (grouped.get(parentId) ?? []).map((node) => ({
      ...node,
      children: attachChildren(node.id)
    }));
  }

  return attachChildren(null);
}
