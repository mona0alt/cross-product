import { db } from '@/lib/db';
import type {
  AdminCategoryTreeNode,
  AdminProductFilters,
  CatalogLocale,
  HomepagePayload,
  ProductListFilters,
  ProductListPayload
} from '@/features/catalog/types';
import { mapLocalizedCategory, mapLocalizedProduct } from '@/features/catalog/mappers';

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
      where: {
        parentId: null,
        isActive: true
      },
      orderBy: {
        sortOrder: 'asc'
      }
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

  return {
    banners: banners.map((banner) => ({
      id: banner.id,
      imageUrl: banner.imageUrl,
      targetType: banner.targetType,
      targetId: banner.targetId,
      targetUrl: banner.targetUrl,
      sortOrder: banner.sortOrder
    })),
    featuredCategories: categories.map((category) =>
      mapLocalizedCategory(category, locale)
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
      where: {
        parentId: null,
        isActive: true
      },
      include: {
        children: {
          where: {
            isActive: true
          },
          orderBy: {
            sortOrder: 'asc'
          }
        }
      },
      orderBy: {
        sortOrder: 'asc'
      }
    })
  ]);

  return {
    filters,
    categoryGroups: categoryGroups.map((group) => ({
      ...mapLocalizedCategory(group, locale),
      children: group.children.map((child) => mapLocalizedCategory(child, locale))
    })),
    products: products.map((product) => mapLocalizedProduct(product, locale))
  };
}

export async function getStorefrontCategoryGroups(locale: CatalogLocale) {
  const groups = await db.category.findMany({
    where: {
      parentId: null,
      isActive: true
    },
    include: {
      children: {
        where: {
          isActive: true
        },
        orderBy: {
          sortOrder: 'asc'
        }
      }
    },
    orderBy: {
      sortOrder: 'asc'
    }
  });

  return groups.map((group) => ({
    ...mapLocalizedCategory(group, locale),
    children: group.children.map((child) => mapLocalizedCategory(child, locale))
  }));
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
