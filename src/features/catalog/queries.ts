import { db } from '@/lib/db';
import type {
  AdminCategoryTreeNode,
  AdminProductFilters,
  CatalogLocale,
  HomepagePayload,
  ProductListFilters,
  ProductListSort,
  ProductListPayload,
  StorefrontCategory,
  StorefrontProductCard,
  StorefrontCategoryGroup,
  LocalizedCategoryFields,
  LocalizedProductFields
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

type StorefrontNavigationProductRecord = {
  id: string;
  status?: string;
  categoryId: string;
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
} & LocalizedProductFields;

function buildStorefrontCategoryGroupsFromRecords(
  categories: StorefrontCategoryRecord[],
  locale: CatalogLocale,
  products: StorefrontNavigationProductRecord[] = []
): StorefrontCategoryGroup[] {
  const activeCategories = categories.filter((category) => category.isActive);
  const childrenByParentId = new Map<string | null, StorefrontCategoryRecord[]>();

  for (const category of activeCategories) {
    const siblings = childrenByParentId.get(category.parentId) ?? [];
    siblings.push(category);
    childrenByParentId.set(category.parentId, siblings);
  }

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

    if (category.parentId && !parentNode) {
      // 父级未启用或不存在，不展示该子类目
      continue;
    }

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

  const collectCategoryIds = (categoryId: string): string[] => {
    const children = childrenByParentId.get(categoryId) ?? [];

    return [
      categoryId,
      ...children.flatMap((child) => collectCategoryIds(child.id))
    ];
  };

  return roots.map((root) => {
    const categoryIds = new Set(collectCategoryIds(root.id));

    return {
      id: root.id,
      slug: root.slug,
      iconImageUrl: root.iconImageUrl,
      name: root.name,
      description: root.description,
      children: root.children,
      products: products
        .filter(
          (product) =>
            categoryIds.has(product.categoryId) &&
            (product.status === undefined || product.status === 'published')
        )
        .map((product) => mapLocalizedProduct(product, locale))
    };
  });
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
        isRecommended: true,
        category: {
          isActive: true,
          parent: { isActive: true }
        }
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
    banners: banners.map((banner) => {
      const targetCategory =
        banner.targetType === 'category' && banner.targetId
          ? categories.find((category) => category.id === banner.targetId)
          : undefined;

      return {
        id: banner.id,
        imageUrl:
          banner.targetType === 'category'
            ? getBannerCategoryImageUrl(categories, banner.targetId) ??
              banner.imageUrl
            : banner.imageUrl,
        targetType: banner.targetType,
        targetId: banner.targetId,
        targetUrl: banner.targetUrl,
        targetCategorySlug: targetCategory?.slug ?? null,
        targetCategoryIsLeaf: Boolean(targetCategory?.parentId),
        sortOrder: banner.sortOrder
      };
    }),
    featuredCategories: categoryGroups.flatMap((group) =>
      group.children.map((child) => ({
        id: child.id,
        slug: child.slug,
        iconImageUrl: child.iconImageUrl,
        name: child.name,
        description: child.description
      }))
    ),
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
        category: {
          isActive: true,
          parent: { isActive: true }
        },
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

  const mappedProducts = products.map((product) =>
    mapLocalizedProduct(product, locale)
  );

  return {
    filters,
    categoryGroups: buildStorefrontCategoryGroupsFromRecords(
      categoryGroups,
      locale
    ),
    products: sortStorefrontProducts(mappedProducts, filters.sort, locale)
  };
}

function sortStorefrontProducts(
  products: StorefrontProductCard[],
  sort: ProductListSort | undefined,
  locale: CatalogLocale
) {
  if (!sort || sort === 'featured') {
    return products;
  }

  const sortedProducts = [...products];

  switch (sort) {
    case 'price-asc':
      return sortedProducts.sort((left, right) => left.priceUsd - right.priceUsd);
    case 'price-desc':
      return sortedProducts.sort((left, right) => right.priceUsd - left.priceUsd);
    case 'name-asc':
      return sortedProducts.sort((left, right) =>
        left.name.localeCompare(right.name, locale, {
          numeric: true,
          sensitivity: 'base'
        })
      );
    default:
      return products;
  }
}

export async function getStorefrontCategoryGroups(locale: CatalogLocale) {
  const [groups, products] = await Promise.all([
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
        category: {
          isActive: true,
          parent: { isActive: true }
        }
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

  return buildStorefrontCategoryGroupsFromRecords(groups, locale, products);
}

export async function getProductDetailBySlug(
  slug: string,
  locale: CatalogLocale
) {
  const product = await db.product.findFirst({
    where: {
      slug,
      status: 'published',
      category: {
        isActive: true,
        parent: { isActive: true }
      }
    },
    include: {
      images: true,
      category: {
        include: {
          parent: true
        }
      }
    }
  });

  if (!product) {
    return null;
  }

  return mapLocalizedProduct(product, locale);
}

export async function getRecommendedProducts(
  locale: CatalogLocale,
  excludeProductId?: string
): Promise<StorefrontProductCard[]> {
  const products = await db.product.findMany({
    where: {
      status: 'published',
      isRecommended: true,
      ...(excludeProductId ? { id: { not: excludeProductId } } : {}),
      category: {
        isActive: true,
        parent: { isActive: true }
      }
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
  });

  return products.map((product) => mapLocalizedProduct(product, locale));
}

export async function getAdminProductList(filters: AdminProductFilters) {
  const search = filters.search?.trim();
  const isRecommendedFilter =
    filters.recommended === true || filters.status === 'recommended';

  return db.product.findMany({
    where: {
      ...(filters.status && filters.status !== 'recommended'
        ? { status: filters.status as never }
        : {}),
      ...(isRecommendedFilter ? { isRecommended: true } : {}),
      ...(filters.categoryId ? { categoryId: filters.categoryId } : {}),
      ...(search
        ? {
            OR: [
              { productCode: { contains: search, mode: 'insensitive' } },
              { slug: { contains: search, mode: 'insensitive' } },
              { nameZh: { contains: search, mode: 'insensitive' } },
              { nameEn: { contains: search, mode: 'insensitive' } },
              { nameEs: { contains: search, mode: 'insensitive' } },
              { namePt: { contains: search, mode: 'insensitive' } },
              {
                category: {
                  OR: [
                    { nameZh: { contains: search, mode: 'insensitive' } },
                    { nameEn: { contains: search, mode: 'insensitive' } },
                    { nameEs: { contains: search, mode: 'insensitive' } },
                    { namePt: { contains: search, mode: 'insensitive' } }
                  ]
                }
              }
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
