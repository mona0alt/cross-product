# 商品类目层级改造实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在前台和后台落地“一级类目 → 二级类目 → 商品”的两层类目结构，商品只能挂在二级类目，后台强制校验层级规则。

**Architecture:** 不改动 Prisma schema，复用 `Category.parentId`；在 `src/features/catalog/category-hierarchy.ts` 集中维护层级判断与校验逻辑；查询层只做最小调整（隐藏父级停用的子类目）；前台按固定两层渲染 Header、类目页、面包屑；后台商品中心的类目树、类目编辑抽屉、商品表单同步适配。

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Prisma 6, Tailwind CSS, Vitest, Playwright.

---

## 文件结构

| 文件 | 变更类型 | 职责 |
| --- | --- | --- |
| `src/features/catalog/category-hierarchy.ts` | 新增 | 类目层级判断、父级选择校验、商品挂载校验 |
| `src/features/admin/category-actions.ts` | 修改 | 创建/更新类目时调用层级校验 |
| `src/features/admin/product-actions.ts` | 修改 | 创建/更新/发布商品时校验类目必须是叶子 |
| `src/features/catalog/queries.ts` | 修改 | 隐藏父级停用的子类目；首页推荐类目改为叶子 |
| `src/components/admin/admin-category-select.tsx` | 新增 | 带 `<optgroup>` 的类目选择器，按一级分组 |
| `src/components/admin/product-center.tsx` | 修改 | 左侧类目树缩进、父级选择限制、商品类目选择 |
| `src/components/admin/product-form.tsx` | 修改 | 商品独立表单使用分组类目选择 |
| `src/components/storefront/header.tsx` | 修改 | 主导航=一级，mega menu=二级（已有结构，主要验证数据） |
| `src/app/[locale]/categories/[slug]/page.tsx` | 修改 | 一级类目页展示子类目，二级页展示商品，加面包屑 |
| `src/app/[locale]/products/[slug]/page.tsx` | 修改 | 商品详情页加完整面包屑 |
| `src/app/[locale]/products/page.tsx` | 修改 | 筛选侧边栏数据传递（基本不变） |
| `src/app/[locale]/page.tsx` | 修改 | 首页分类网格展示叶子类目 |
| `prisma/seed.ts` | 修改 | 新增一级类目 `tech`，现有类目作为子类目创建 |
| `tests/unit/catalog/queries.test.ts` 等 | 修改/新增 | 层级相关单元/集成/E2E 测试 |

---

### Task 1: 新增类目层级校验模块

**Files:**
- Create: `src/features/catalog/category-hierarchy.ts`
- Test: `tests/unit/catalog/category-hierarchy.test.ts`

- [ ] **Step 1: 写失败测试**

```ts
// tests/unit/catalog/category-hierarchy.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { isRootCategory, isLeafCategory, getCategoryLevel, validateCategoryParent, requireLeafCategory, requireCategoryHasNoProducts } from '@/features/catalog/category-hierarchy';
import { db } from '@/lib/db';

vi.mock('@/lib/db', () => ({
  db: {
    category: {
      findUnique: vi.fn(),
      count: vi.fn()
    }
  }
}));

describe('category-hierarchy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('detects root and leaf categories', () => {
    expect(isRootCategory({ parentId: null })).toBe(true);
    expect(isLeafCategory({ parentId: 'parent-1' })).toBe(true);
  });

  it('returns category level from db', async () => {
    vi.mocked(db.category.findUnique).mockResolvedValueOnce({ parentId: 'parent-1' } as never);
    const level = await getCategoryLevel('leaf-1');
    expect(level).toBe('leaf');
  });

  it('rejects parent that is itself a leaf', async () => {
    vi.mocked(db.category.findUnique).mockResolvedValueOnce({ parentId: 'root-1' } as never);
    await expect(validateCategoryParent('invalid-parent')).rejects.toThrow('CATEGORY_PARENT_MUST_BE_ROOT');
  });

  it('allows null parent (root)', async () => {
    await expect(validateCategoryParent(null)).resolves.toBeUndefined();
  });

  it('requires leaf category for products', async () => {
    vi.mocked(db.category.findUnique).mockResolvedValueOnce({ parentId: null } as never);
    await expect(requireLeafCategory('root-1')).rejects.toThrow('PRODUCT_CATEGORY_MUST_BE_LEAF');
  });

  it('rejects category with products when moving to root', async () => {
    vi.mocked(db.product.count).mockResolvedValueOnce(3 as never);
    await expect(requireCategoryHasNoProducts('leaf-1')).rejects.toThrow('CATEGORY_HAS_PRODUCTS');
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
npm test -- tests/unit/catalog/category-hierarchy.test.ts
```

Expected: FAIL，模块未找到或函数未定义。

- [ ] **Step 3: 实现模块**

```ts
// src/features/catalog/category-hierarchy.ts
import { db } from '@/lib/db';

export type CategoryLevel = 'root' | 'leaf';

type CategoryWithParent = { parentId: string | null };

export function isRootCategory(category: CategoryWithParent): boolean {
  return category.parentId === null;
}

export function isLeafCategory(category: CategoryWithParent): boolean {
  return category.parentId !== null;
}

export async function getCategoryLevel(categoryId: string): Promise<CategoryLevel | null> {
  const category = await db.category.findUnique({
    where: { id: categoryId },
    select: { parentId: true }
  });

  if (!category) {
    return null;
  }

  return isRootCategory(category) ? 'root' : 'leaf';
}

export async function validateCategoryParent(
  parentId: string | null | undefined,
  excludeCategoryId?: string
): Promise<void> {
  if (!parentId) {
    return;
  }

  if (excludeCategoryId && parentId === excludeCategoryId) {
    throw new Error('CATEGORY_CANNOT_BE_OWN_PARENT');
  }

  const parent = await db.category.findUnique({
    where: { id: parentId },
    select: { parentId: true }
  });

  if (!parent) {
    throw new Error('PARENT_CATEGORY_NOT_FOUND');
  }

  if (!isRootCategory(parent)) {
    throw new Error('CATEGORY_PARENT_MUST_BE_ROOT');
  }
}

export async function requireLeafCategory(categoryId: string): Promise<void> {
  const level = await getCategoryLevel(categoryId);

  if (level !== 'leaf') {
    throw new Error('PRODUCT_CATEGORY_MUST_BE_LEAF');
  }
}

export async function requireCategoryHasNoChildren(categoryId: string): Promise<void> {
  const childrenCount = await db.category.count({
    where: { parentId: categoryId }
  });

  if (childrenCount > 0) {
    throw new Error('CATEGORY_HAS_CHILDREN');
  }
}

export async function requireCategoryHasNoProducts(categoryId: string): Promise<void> {
  const productsCount = await db.product.count({
    where: { categoryId }
  });

  if (productsCount > 0) {
    throw new Error('CATEGORY_HAS_PRODUCTS');
  }
}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
npm test -- tests/unit/catalog/category-hierarchy.test.ts
```

Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/features/catalog/category-hierarchy.ts tests/unit/catalog/category-hierarchy.test.ts
git commit -m "feat(catalog): add category hierarchy validation helpers"
```

---

### Task 2: 类目 Action 强制层级规则

**Files:**
- Modify: `src/features/admin/category-actions.ts`
- Test: `tests/integration/admin/category-actions.test.ts`（已有则补充，无则新增）

- [ ] **Step 1: 写失败测试**

```ts
// tests/integration/admin/category-actions.test.ts
import { describe, it, expect } from 'vitest';
import { Prisma } from '@prisma/client';
import { createCategory, updateCategory } from '@/features/admin/category-actions';
import { db } from '@/lib/db';

async function createRoot(name: string) {
  return db.category.create({
    data: {
      slug: `${name}-root`,
      nameZh: name,
      nameEn: name,
      nameEs: name,
      namePt: name
    }
  });
}

async function createLeaf(parentId: string, name: string) {
  return db.category.create({
    data: {
      parentId,
      slug: `${name}-leaf`,
      nameZh: name,
      nameEn: name,
      nameEs: name,
      namePt: name
    }
  });
}

describe('category hierarchy validation', () => {
  it('rejects creating third-level category', async () => {
    const root = await createRoot('tech');
    const leaf = await createLeaf(root.id, 'robots');

    await expect(
      createCategory({
        parentId: leaf.id,
        slug: 'third-level',
        nameZh: '三级',
        nameEn: 'Third',
        nameEs: 'Third',
        namePt: 'Third'
      })
    ).rejects.toThrow('CATEGORY_PARENT_MUST_BE_ROOT');
  });

  it('rejects turning root with children into leaf', async () => {
    const root = await createRoot('tech');
    await createLeaf(root.id, 'robots');

    await expect(
      updateCategory(root.id, { parentId: (await createRoot('other')).id })
    ).rejects.toThrow('CATEGORY_HAS_CHILDREN');
  });

  it('rejects turning leaf with products into root', async () => {
    const root = await createRoot('tech');
    const leaf = await createLeaf(root.id, 'robots');
    await db.product.create({
      data: {
        categoryId: leaf.id,
        slug: 'p1',
        productCode: 'P1',
        priceUsd: new Prisma.Decimal('99'),
        coverImageUrl: '/uploads/products/2026/01/t.png',
        nameZh: 'p',
        nameEn: 'p',
        nameEs: 'p',
        namePt: 'p',
        introZh: 'i',
        introEn: 'i',
        introEs: 'i',
        introPt: 'i',
        detailZh: 'd',
        detailEn: 'd',
        detailEs: 'd',
        detailPt: 'd'
      }
    });

    await expect(updateCategory(leaf.id, { parentId: null })).rejects.toThrow('CATEGORY_HAS_PRODUCTS');
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
npm test -- tests/integration/admin/category-actions.test.ts
```

Expected: FAIL（三级类目未报错）。

- [ ] **Step 3: 修改 category-actions.ts**

```ts
// src/features/admin/category-actions.ts
import {
  validateCategoryParent,
  requireCategoryHasNoChildren,
  requireCategoryHasNoProducts
} from '@/features/catalog/category-hierarchy';

export async function createCategory(input: CategoryInput) {
  await validateCategoryParent(input.parentId);

  return db.category.create({
    data: {
      sortOrder: 0,
      isActive: true,
      ...input,
      iconImageUrl: input.iconImageUrl
        ? requireLocalImagePath(input.iconImageUrl, 'iconImageUrl')
        : input.iconImageUrl
    }
  });
}

export async function updateCategory(id: string, input: Partial<CategoryInput>) {
  if (input.parentId !== undefined) {
    await validateCategoryParent(input.parentId, id);

    if (input.parentId) {
      // 要变成（或保持）叶子类目，必须没有子类目
      await requireCategoryHasNoChildren(id);
    } else {
      // 要变成（或保持）根类目，必须没有挂载商品
      await requireCategoryHasNoProducts(id);
    }
  }

  return db.category.update({
    where: { id },
    data:
      input.iconImageUrl === undefined || input.iconImageUrl === null
        ? input
        : {
            ...input,
            iconImageUrl: requireLocalImagePath(input.iconImageUrl, 'iconImageUrl')
          }
  });
}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
npm test -- tests/integration/admin/category-actions.test.ts
```

Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/features/admin/category-actions.ts tests/integration/admin/category-actions.test.ts
git commit -m "feat(admin): enforce two-level category hierarchy in actions"
```

---

### Task 3: 商品 Action 强制挂载到叶子类目

**Files:**
- Modify: `src/features/admin/product-actions.ts`
- Test: `tests/integration/admin/product-actions.test.ts`（已有则补充）

- [ ] **Step 1: 写失败测试**

```ts
// tests/integration/admin/product-actions.test.ts
import { describe, it, expect } from 'vitest';
import { createProductFromForm, updateProductFromForm, publishProduct } from '@/features/admin/product-actions';
import { db } from '@/lib/db';

async function makeFormData(values: Record<string, string>) {
  const formData = new FormData();
  Object.entries(values).forEach(([key, value]) => formData.set(key, value));
  return formData;
}

describe('product category hierarchy validation', () => {
  it('rejects creating product on root category', async () => {
    const root = await db.category.create({
      data: {
        slug: 'root-cat',
        nameZh: 'root',
        nameEn: 'root',
        nameEs: 'root',
        namePt: 'root'
      }
    });

    const formData = await makeFormData({
      categoryId: root.id,
      productCode: 'P-ROOT',
      slug: 'root-product',
      priceUsd: '99',
      coverImageUrl: '/uploads/products/2026/01/test.png',
      nameZh: 'root',
      nameEn: 'root',
      nameEs: 'root',
      namePt: 'root',
      introZh: 'i',
      introEn: 'i',
      introEs: 'i',
      introPt: 'i',
      detailZh: 'd',
      detailEn: 'd',
      detailEs: 'd',
      detailPt: 'd',
      status: 'draft'
    });

    await expect(createProductFromForm(formData)).rejects.toThrow('PRODUCT_CATEGORY_MUST_BE_LEAF');
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
npm test -- tests/integration/admin/product-actions.test.ts
```

Expected: FAIL。

- [ ] **Step 3: 修改 product-actions.ts**

```ts
// src/features/admin/product-actions.ts
import { requireLeafCategory } from '@/features/catalog/category-hierarchy';

export async function createProductFromForm(formData: FormData) {
  const payload = getProductFormPayload(formData);
  const galleryUrls = getGalleryUrls(formData);

  await requireLeafCategory(payload.categoryId);

  const product = await db.product.create({
    data: {
      ...payload,
      images: {
        create: galleryUrls.map((imageUrl, sortOrder) => ({
          imageUrl,
          altText: payload.nameEn,
          sortOrder
        }))
      }
    }
  });

  revalidatePath('/admin/products');

  return product;
}

export async function updateProductFromForm(id: string, formData: FormData) {
  const payload = getProductFormPayload(formData);
  const galleryUrls = getGalleryUrls(formData);

  await requireLeafCategory(payload.categoryId);

  const product = await db.$transaction(async (tx) => {
    const product = await tx.product.update({
      where: { id },
      data: payload
    });

    await tx.productImage.deleteMany({
      where: { productId: id }
    });

    const imageData = getImageCreateData(id, payload.nameEn, galleryUrls);
    if (imageData.length > 0) {
      await tx.productImage.createMany({
        data: imageData
      });
    }

    return product;
  });

  revalidatePath('/admin/products');

  return product;
}
```

同时修改 `publishProduct`：

```ts
export async function publishProduct(id: string) {
  const product = await db.product.findUnique({
    where: { id }
  });

  if (!product) {
    throw new Error('PRODUCT_NOT_FOUND');
  }

  await requireLeafCategory(product.categoryId);

  // ... 原有逻辑
}
```

- [ ] **Step 4: 运行测试确认通过**

```bash
npm test -- tests/integration/admin/product-actions.test.ts
```

Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/features/admin/product-actions.ts tests/integration/admin/product-actions.test.ts
git commit -m "feat(admin): enforce products attached to leaf categories"
```

---

### Task 4: 查询层隐藏父级停用的子类目

**Files:**
- Modify: `src/features/catalog/queries.ts`
- Test: `tests/integration/catalog/queries.test.ts`（已有则补充）

- [ ] **Step 1: 写失败测试**

```ts
// tests/integration/catalog/queries.test.ts
import { describe, it, expect } from 'vitest';
import { getStorefrontCategoryGroups, getProductListPayload } from '@/features/catalog/queries';
import { db } from '@/lib/db';

describe('storefront category groups', () => {
  it('hides children when parent is inactive', async () => {
    const root = await db.category.create({
      data: { slug: 'inactive-root', nameZh: 'r', nameEn: 'r', nameEs: 'r', namePt: 'r', isActive: false }
    });
    await db.category.create({
      data: { parentId: root.id, slug: 'active-leaf', nameZh: 'l', nameEn: 'l', nameEs: 'l', namePt: 'l', isActive: true }
    });

    const groups = await getStorefrontCategoryGroups('zh-CN');
    expect(groups.find((g) => g.slug === 'inactive-root')).toBeUndefined();
    expect(groups.flatMap((g) => g.children).find((c) => c.slug === 'active-leaf')).toBeUndefined();
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
npm test -- tests/integration/catalog/queries.test.ts
```

Expected: FAIL（子类目被提升为根）。

- [ ] **Step 3: 修改 buildStorefrontCategoryGroupsFromRecords**

在 `src/features/catalog/queries.ts` 中，找到构建循环：

```ts
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
```

改为：

```ts
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
```

同时，在 `getStorefrontCategoryGroups` 和 `getProductListPayload` 的商品查询中加入 `category.parent.isActive` 校验：

```ts
// getStorefrontCategoryGroups 内的 db.product.findMany where
where: {
  status: 'published',
  category: {
    isActive: true,
    parent: { isActive: true }
  }
}
```

`getProductListPayload` 的商品查询基础条件也加入同样约束（与现有筛选条件合并为 AND）。

- [ ] **Step 4: 运行测试确认通过**

```bash
npm test -- tests/integration/catalog/queries.test.ts
```

Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/features/catalog/queries.ts tests/integration/catalog/queries.test.ts
git commit -m "feat(catalog): hide categories/products under inactive parent"
```

---

### Task 5: 首页推荐类目改为展示叶子类目

**Files:**
- Modify: `src/features/catalog/queries.ts`（`getHomepagePayload`）
- Modify: `src/app/[locale]/page.tsx`（`getHomepageHeroBanners` targetUrl）
- Test: `tests/integration/catalog/queries.test.ts`

- [ ] **Step 1: 写失败测试**

```ts
it('features leaf categories on homepage', async () => {
  const payload = await getHomepagePayload('zh-CN');
  expect(payload.featuredCategories.some((c) => c.slug === 'tech')).toBe(false);
  expect(payload.featuredCategories.some((c) => c.slug === 'humanoid-robots')).toBe(true);
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
npm test -- tests/integration/catalog/queries.test.ts::'features leaf categories on homepage'
```

Expected: FAIL。

- [ ] **Step 3: 修改 getHomepagePayload**

```ts
// src/features/catalog/queries.ts
return {
  banners: banners.map(...),
  featuredCategories: categoryGroups.flatMap((group) =>
    group.children.map((child) => ({
      id: child.id,
      slug: child.slug,
      iconImageUrl: child.iconImageUrl,
      name: child.name,
      description: child.description
    }))
  ),
  recommendedProducts: products.map((product) => mapLocalizedProduct(product, locale))
};
```

- [ ] **Step 4: 调整 banner targetUrl**

`src/app/[locale]/page.tsx` 中 `getHomepageHeroBanners` 的 `targetUrl` 对于叶子类目应指向类目页而不是带 query 参数的商品列表：

```ts
targetUrl: `/${locale}/categories/${category.slug}`
```

- [ ] **Step 5: 运行测试确认通过**

```bash
npm test -- tests/integration/catalog/queries.test.ts
```

Expected: PASS。

- [ ] **Step 6: Commit**

```bash
git add src/features/catalog/queries.ts src/app/[locale]/page.tsx tests/integration/catalog/queries.test.ts
git commit -m "feat(storefront): feature leaf categories on homepage"
```

---

### Task 6: 前台类目页区分一级/二级展示

**Files:**
- Modify: `src/app/[locale]/categories/[slug]/page.tsx`
- Create: `src/components/storefront/category-child-grid.tsx`（如 `HomepageCategoryGrid` 无法满足）
- Test: `tests/e2e/categories.spec.ts`（已有则补充）

- [ ] **Step 1: 写失败测试**

```ts
// tests/integration/app/categories-page.test.ts
import { describe, it, expect } from 'vitest';

describe('category page', () => {
  it('root category page lists child categories', async () => {
    // 通过 render 或请求验证一级类目页展示子类目
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
npm test -- tests/integration/app/categories-page.test.ts
```

Expected: FAIL。

- [ ] **Step 3: 修改 category page**

```tsx
// src/app/[locale]/categories/[slug]/page.tsx
import { HomepageCategoryGrid } from '@/components/storefront/homepage-category-grid';

// ... 在 payload 之后判断层级
const matchedRoot = payload.categoryGroups.find((group) => group.slug === slug);
const matchedLeaf = matchedRoot
  ? null
  : payload.categoryGroups.flatMap((group) => group.children).find((child) => child.slug === slug);
const matchedCategory = matchedRoot ?? matchedLeaf;

const breadcrumbs = [
  { label: Storefront.nav.home, href: `/${locale}` }
];

if (matchedRoot) {
  breadcrumbs.push({ label: matchedRoot.name, href: `/${locale}/categories/${matchedRoot.slug}` });
} else if (matchedLeaf) {
  const parent = payload.categoryGroups.find((group) =>
    group.children.some((child) => child.slug === slug)
  );
  if (parent) {
    breadcrumbs.push({ label: parent.name, href: `/${locale}/categories/${parent.slug}` });
  }
  breadcrumbs.push({ label: matchedLeaf.name, href: `/${locale}/categories/${matchedLeaf.slug}` });
}

// 渲染
return (
  <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <nav aria-label="breadcrumb" className="mb-4 text-sm text-[var(--mk-text-muted)]">
      {breadcrumbs.map((crumb, index) => (
        <span key={crumb.href}>
          {index > 0 && <span className="mx-2">{'>'}</span>}
          <a href={crumb.href} className="hover:text-[var(--mk-accent)]">{crumb.label}</a>
        </span>
      ))}
    </nav>

    {matchedRoot ? (
      <>
        <ResultsToolbar eyebrow={Storefront.categories.eyebrow} title={matchedRoot.name} description={matchedRoot.description} />
        <HomepageCategoryGrid locale={locale} categories={matchedRoot.children} eyebrow="" title="" />
      </>
    ) : (
      <form className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        {/* 原有二级类目页内容 */}
      </form>
    )}
  </div>
);
```

- [ ] **Step 4: 运行测试确认通过**

```bash
npm test -- tests/integration/app/categories-page.test.ts
```

Expected: PASS。

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/categories/[slug]/page.tsx src/components/storefront/category-child-grid.tsx tests/integration/app/categories-page.test.ts
git commit -m "feat(storefront): render root category page with child grid and breadcrumbs"
```

---

### Task 7: 商品详情页加完整面包屑

**Files:**
- Modify: `src/features/catalog/queries.ts`（`getProductDetailBySlug` include parent）
- Modify: `src/features/catalog/mappers.ts`（`mapLocalizedProduct` 返回父级）
- Modify: `src/app/[locale]/products/[slug]/page.tsx`
- Test: `tests/integration/catalog/mappers.test.ts`（已有则补充）

- [ ] **Step 1: 写失败测试**

```ts
it('maps product category with parent', () => {
  const product = {
    id: 'p1',
    slug: 'alpha',
    productCode: 'P1',
    coverImageUrl: '/a.jpg',
    priceUsd: 1,
    isRecommended: false,
    nameZh: 'a',
    nameEn: 'a',
    nameEs: 'a',
    namePt: 'a',
    introZh: 'i',
    introEn: 'i',
    introEs: 'i',
    introPt: 'i',
    detailZh: 'd',
    detailEn: 'd',
    detailEs: 'd',
    detailPt: 'd',
    images: [],
    category: {
      slug: 'humanoid-robots',
      nameZh: '人形机器人',
      nameEn: 'Humanoid',
      nameEs: 'H',
      namePt: 'H',
      parent: {
        slug: 'tech',
        nameZh: '科技类',
        nameEn: 'Technology',
        nameEs: 'T',
        namePt: 'T'
      }
    }
  };

  const mapped = mapLocalizedProduct(product, 'zh-CN');
  expect(mapped.category?.parent).toEqual({ slug: 'tech', name: '科技类' });
});
```

- [ ] **Step 2: 运行测试确认失败**

```bash
npm test -- tests/integration/catalog/mappers.test.ts::'maps product category with parent'
```

Expected: FAIL。

- [ ] **Step 3: 修改查询与映射**

```ts
// src/features/catalog/queries.ts
export async function getProductDetailBySlug(slug: string, locale: CatalogLocale) {
  const product = await db.product.findFirst({
    where: { slug, status: 'published' },
    include: {
      images: true,
      category: {
        include: { parent: true }
      }
    }
  });

  if (!product) {
    return null;
  }

  return mapLocalizedProduct(product, locale);
}
```

```ts
// src/features/catalog/mappers.ts
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
    parent?: {
      slug: string;
      name: string;
    };
  };
};

export function mapLocalizedProduct(...) {
  // ...
  return {
    // ...
    category: value.category
      ? {
          slug: value.category.slug,
          name: getLocalizedPair(value.category, locale, 'name'),
          parent: value.category.parent
            ? {
                slug: value.category.parent.slug,
                name: getLocalizedPair(value.category.parent, locale, 'name')
              }
            : undefined
        }
      : undefined
  };
}
```

- [ ] **Step 4: 修改商品详情页面包屑**

```tsx
// src/app/[locale]/products/[slug]/page.tsx
const breadcrumbs = [
  { label: Storefront.nav.home, href: `/${locale}` }
];

if (product.category?.parent) {
  breadcrumbs.push({
    label: product.category.parent.name,
    href: `/${locale}/categories/${product.category.parent.slug}`
  });
}

if (product.category) {
  breadcrumbs.push({
    label: product.category.name,
    href: `/${locale}/categories/${product.category.slug}`
  });
}

breadcrumbs.push({ label: product.name, href: `/${locale}/products/${product.slug}` });

// 在页面顶部渲染 breadcrumb nav
```

- [ ] **Step 5: 运行测试确认通过**

```bash
npm test -- tests/integration/catalog/mappers.test.ts
```

Expected: PASS。

- [ ] **Step 6: Commit**

```bash
git add src/features/catalog/queries.ts src/features/catalog/mappers.ts src/features/catalog/types.ts src/app/[locale]/products/[slug]/page.tsx tests/integration/catalog/mappers.test.ts
git commit -m "feat(storefront): add parent category to product detail breadcrumbs"
```

---

### Task 8: 商品列表筛选二级下拉按一级分组

**Files:**
- Modify: `src/components/storefront/filter-sidebar.tsx`
- Test: `tests/unit/storefront/filter-sidebar.test.tsx`（已有则补充）

- [ ] **Step 1: 写失败测试**

测试二级下拉选项带有一级分组前缀。

- [ ] **Step 2: 运行测试确认失败**

- [ ] **Step 3: 修改 FilterSidebar**

```tsx
// src/components/storefront/filter-sidebar.tsx
{!hideCategoryFilters && (
  <>
    <select name="category" defaultValue={category ?? ''}>
      <option value="">{copy.allPrimary}</option>
      {categoryGroups.map((group) => (
        <option key={group.id} value={group.slug}>{group.name}</option>
      ))}
    </select>

    <select name="subcategory" defaultValue={subcategory ?? ''}>
      <option value="">{copy.allSecondary}</option>
      {categoryGroups.map((group) => (
        <optgroup key={group.id} label={group.name}>
          {group.children.map((child) => (
            <option key={child.id} value={child.slug}>{child.name}</option>
          ))}
        </optgroup>
      ))}
    </select>
  </>
)}
```

- [ ] **Step 4: 运行测试确认通过**

- [ ] **Step 5: Commit**

```bash
git add src/components/storefront/filter-sidebar.tsx tests/unit/storefront/filter-sidebar.test.tsx
git commit -m "feat(storefront): group subcategory filter by parent category"
```

---

### Task 9: 新增 AdminCategorySelect 组件

**Files:**
- Create: `src/components/admin/admin-category-select.tsx`
- Test: `tests/unit/admin/admin-category-select.test.tsx`

- [ ] **Step 1: 写失败测试**

```ts
it('renders optgroups for root categories', () => {
  render(<AdminCategorySelect name="categoryId" categories={[root, leaf]} />);
  expect(screen.getByRole('combobox')).toHaveTextContent('科技类');
  expect(screen.getByRole('option', { name: '擦窗机器人' })).toBeInTheDocument();
});
```

- [ ] **Step 2: 运行测试确认失败**

- [ ] **Step 3: 实现组件**

```tsx
// src/components/admin/admin-category-select.tsx
'use client';

import React from 'react';

type AdminCategory = {
  id: string;
  parentId?: string | null;
  nameZh: string;
  nameEn?: string;
  nameEs?: string;
  namePt?: string;
};

export function AdminCategorySelect({
  name,
  categories,
  defaultValue = '',
  placeholder = '选择类目',
  disabled = false
}: {
  name: string;
  categories: AdminCategory[];
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
}) {
  const roots = categories.filter((c) => !c.parentId);
  const leavesByRoot = new Map(
    roots.map((root) => [
      root.id,
      categories.filter((c) => c.parentId === root.id)
    ])
  );

  return (
    <select
      name={name}
      defaultValue={defaultValue}
      disabled={disabled}
      className="w-full rounded-lg border border-admin-border bg-admin-surface px-3 py-2 text-sm text-admin-text-primary outline-none focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/15"
    >
      <option value="">{placeholder}</option>
      {roots.map((root) => (
        <optgroup key={root.id} label={root.nameZh}>
          {(leavesByRoot.get(root.id) ?? []).map((leaf) => (
            <option key={leaf.id} value={leaf.id}>
              {leaf.nameZh}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
```

- [ ] **Step 4: 运行测试确认通过**

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/admin-category-select.tsx tests/unit/admin/admin-category-select.test.tsx
git commit -m "feat(admin): add grouped category select component"
```

---

### Task 10: 后台商品中心左侧类目树缩进

**Files:**
- Modify: `src/components/admin/product-center.tsx`
- Test: `tests/unit/admin/product-center.test.tsx`（已有则补充）

- [ ] **Step 1: 写失败测试**

测试 `CategoryItem` 对一级/二级类目的缩进和可点击性。

- [ ] **Step 2: 运行测试确认失败**

- [ ] **Step 3: 修改 CategoryItem**

```tsx
function CategoryItem({
  category,
  isSelected,
  onSelect,
  onEdit,
  copy
}: {
  category: ProductCenterCategory;
  isSelected: boolean;
  onSelect: (categoryId: string) => void;
  onEdit: (categoryId: string) => void;
  copy: ProductCenterCopy;
}) {
  const isRoot = !category.parentId;
  const depth = isRoot ? 0 : 1;
  const paddingLeft = depth === 0 ? '12px' : '32px';

  return (
    <div className={`...`}>
      <button
        type="button"
        aria-pressed={isSelected}
        disabled={isRoot}
        onClick={() => onSelect(category.id)}
        className={`flex min-w-0 flex-1 self-stretch items-center gap-2.5 text-left focus:outline-none ${
          isRoot ? 'cursor-default' : ''
        }`}
        style={{ paddingLeft }}
      >
        {isRoot ? (
          <span className="text-xs font-bold">{category.nameZh}</span>
        ) : (
          <>
            {category.iconImageUrl ? (...) : <FolderTree className="h-5 w-5 shrink-0" />}
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold">{category.nameZh}</span>
              <span className="block truncate text-xs text-admin-text-muted">{category.nameEn}</span>
            </span>
          </>
        )}
      </button>
      {/* 编辑/删除按钮只对二级展示，或一级也允许编辑 */}
    </div>
  );
}
```

同时调整 `activeCategoryId` 过滤逻辑：只过滤二级类目。

- [ ] **Step 4: 运行测试确认通过**

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/product-center.tsx tests/unit/admin/product-center.test.tsx
git commit -m "feat(admin): render indented two-level category tree"
```

---

### Task 11: 后台类目编辑抽屉限制父级选择

**Files:**
- Modify: `src/components/admin/product-center.tsx`

- [ ] **Step 1: 写失败测试**

测试父级下拉中不包含二级类目选项。

- [ ] **Step 2: 运行测试确认失败**

- [ ] **Step 3: 修改 CategoryEditorDrawer 的 parentOptions**

```tsx
// 父级只能是其他一级类目；空值表示作为一级类目
const parentOptions = categories.filter(
  (item) => item.id !== category?.id && !item.parentId
);

const parentCategoryOptions: AdminSelectOption[] = [
  { value: '', label: copy.rootCategory },
  ...parentOptions.map((item) => ({
    value: item.id,
    label: item.nameZh
  }))
];
```

注意：后端 `updateCategory` 已校验“根类目带子类目不能变叶子”和“叶子类目有商品不能变根”，前端只负责过滤可选列表。

- [ ] **Step 4: 运行测试确认通过**

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/product-center.tsx tests/unit/admin/product-center.test.tsx
git commit -m "feat(admin): restrict category parent selection to root categories"
```

---

### Task 12: 后台商品编辑抽屉使用分组类目选择

**Files:**
- Modify: `src/components/admin/product-center.tsx`
- Test: `tests/unit/admin/product-center.test.tsx`

- [ ] **Step 1: 写失败测试**

测试商品编辑抽屉中类目选择器按一级分组。

- [ ] **Step 2: 运行测试确认失败**

- [ ] **Step 3: 修改 ProductEditorDrawerContent**

替换原有 `AdminSelect`：

```tsx
import { AdminCategorySelect } from '@/components/admin/admin-category-select';

// ...
<Field label={copy.category}>
  <AdminCategorySelect
    name="categoryId"
    categories={categoryOptions}
    defaultValue={defaultProductCategoryId}
  />
</Field>
```

- [ ] **Step 4: 运行测试确认通过**

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/product-center.tsx tests/unit/admin/product-center.test.tsx
git commit -m "feat(admin): use grouped category select in product editor drawer"
```

---

### Task 13: 后台独立商品表单使用分组类目选择

**Files:**
- Modify: `src/components/admin/product-form.tsx`
- Test: `tests/unit/admin/product-form.test.tsx`（已有则补充）

- [ ] **Step 1: 写失败测试**

- [ ] **Step 2: 运行测试确认失败**

- [ ] **Step 3: 修改 ProductForm**

```tsx
import { AdminCategorySelect } from '@/components/admin/admin-category-select';

// 替换 AdminSelect categoryId
<AdminCategorySelect
  name="categoryId"
  categories={categories}
  defaultValue={product?.categoryId ?? ''}
  placeholder={labels.selectCategory}
/>
```

- [ ] **Step 4: 运行测试确认通过**

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/product-form.tsx tests/unit/admin/product-form.test.tsx
git commit -m "feat(admin): use grouped category select in standalone product form"
```

---

### Task 14: 更新 Seed 数据

**Files:**
- Modify: `prisma/seed.ts`
- Test: 运行 `npm run prisma:seed` 后验证数据库层级

- [ ] **Step 1: 修改 seed.ts**

```ts
// 在 catalog 数组外层改为可设 parentId 的结构，或循环创建时设置 parentId
const categories = new Map<string, string>();

for (const group of catalog) {
  const parent = await tx.category.create({
    data: {
      slug: group.slug,
      iconImageUrl: group.iconImageUrl,
      isActive: true,
      sortOrder: 0,
      nameZh: group.names.zh,
      nameEn: group.names.en,
      nameEs: group.names.es,
      namePt: group.names.pt,
      descriptionZh: group.descriptions.zh,
      descriptionEn: group.descriptions.en,
      descriptionEs: group.descriptions.es,
      descriptionPt: group.descriptions.pt
    }
  });
  categories.set(group.slug, parent.id);

  for (const child of group.children ?? []) {
    const childRecord = await tx.category.create({
      data: {
        parentId: parent.id,
        slug: child.slug,
        iconImageUrl: child.iconImageUrl,
        isActive: true,
        sortOrder: 0,
        nameZh: child.names.zh,
        nameEn: child.names.en,
        nameEs: child.names.es,
        namePt: child.names.pt,
        descriptionZh: child.descriptions.zh,
        descriptionEn: child.descriptions.en,
        descriptionEs: child.descriptions.es,
        descriptionPt: child.descriptions.pt
      }
    });
    categories.set(child.slug, childRecord.id);
  }
}
```

- [ ] **Step 2: 运行 seed 并验证**

```bash
npm run prisma:seed
npx prisma studio
```

Expected: 出现 `tech` 一级类目，其余为其子类目。

- [ ] **Step 3: Commit**

```bash
git add prisma/seed.ts
git commit -m "feat(seed): create two-level category hierarchy with tech root"
```

---

### Task 15: 更新 E2E 测试

**Files:**
- Modify: `tests/e2e/header.spec.ts`、`tests/e2e/products.spec.ts`、`tests/e2e/admin-products.spec.ts`

- [ ] **Step 1: 新增/修改测试**

```ts
// tests/e2e/header.spec.ts
import { test, expect } from '@playwright/test';

test('desktop mega menu shows leaf categories', async ({ page }) => {
  await page.goto('/zh-CN');
  await page.getByRole('navigation').getByText('科技类').hover();
  await expect(page.getByRole('link', { name: '擦窗机器人' })).toBeVisible();
});
```

```ts
// tests/e2e/products.spec.ts
test('product detail breadcrumb shows two-level category', async ({ page }) => {
  await page.goto('/zh-CN/products/alpha-humanoid');
  await expect(page.getByText('科技类')).toBeVisible();
  await expect(page.getByText('人形机器人')).toBeVisible();
});
```

```ts
// tests/e2e/admin-products.spec.ts
test('admin rejects creating third-level category', async ({ page }) => {
  // 登录后台，打开商品中心，编辑一个二级类目，尝试选另一个二级类目作为父级
});
```

- [ ] **Step 2: 运行 E2E 测试**

```bash
npm run test:e2e
```

Expected: 相关测试通过。

- [ ] **Step 3: Commit**

```bash
git add tests/e2e
git commit -m "test(e2e): add category hierarchy coverage"
```

---

## 自我审查

- [ ] **Spec 覆盖**：逐条核对设计文档，每个需求都有对应 Task。
- [ ] **占位符扫描**：检查无 TBD/TODO/"后续补充"。
- [ ] **类型一致性**：`ProductCenterCategory` 的 `parentId` 字段、`StorefrontProductCard` 的 `category.parent`、`AdminCategorySelect` 的 `categories` 类型前后一致。
- [ ] **命令可运行**：所有 `npm test`、`npm run prisma:seed`、`npm run test:e2e` 均为项目已有脚本。

---

## 执行交接

**Plan complete and saved to `docs/superpowers/plans/2026-08-01-category-hierarchy.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
