# 首页 Hero 一级分类 + 一级分类强制图片 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 首页 hero 轮播改用一级分类图片(第二行二级分类卡片不变),并在后台强制一级分类必须上传图片。

**Architecture:** `getHomepagePayload` 新增 `rootCategories` 字段(复用现有 `categoryGroups` 根节点);`page.tsx` 的 hero 构造改用它并将 `targetCategoryIsLeaf` 置为 `false`;`category-actions.ts` 在 create/update 时校验"一级分类必填图片"并抛 `CATEGORY_IMAGE_REQUIRED`;`product-center.tsx` 的分类编辑抽屉对一级分类也渲染图片上传字段,并映射新错误文案。

**Tech Stack:** Next.js 15(App Router)、Prisma、Vitest、next-intl(messages/*.json)

**设计文档:** `docs/superpowers/specs/2026-08-02-homepage-hero-root-category-design.md`

---

### Task 1: `HomepagePayload` 增加 `rootCategories`

**Files:**
- Modify: `src/features/catalog/types.ts:65-80`
- Modify: `src/features/catalog/queries.ts:247-281`
- Test: `tests/integration/catalog-query.test.ts`

- [ ] **Step 1: 写失败测试**

在 `tests/integration/catalog-query.test.ts` 的 `describe('catalog queries')` 内追加一个新用例(文件顶部已有的 `bannerFindMany / categoryFindMany / productFindMany` mock 直接复用):

```ts
  it('exposes active root categories as rootCategories', async () => {
    bannerFindMany.mockResolvedValue([]);
    categoryFindMany.mockResolvedValue([
      {
        id: 'cat-root',
        parentId: null,
        slug: 'robots',
        sortOrder: 1,
        isActive: true,
        iconImageUrl: '/uploads/category/robots.png',
        nameZh: '机器人',
        nameEn: 'Robots',
        nameEs: 'Robots',
        namePt: 'Robos',
        descriptionZh: '机器人大类',
        descriptionEn: 'Robot group',
        descriptionEs: 'Grupo de robots',
        descriptionPt: 'Grupo de robos'
      },
      {
        id: 'cat-leaf',
        parentId: 'cat-root',
        slug: 'bipedal',
        sortOrder: 1,
        isActive: true,
        iconImageUrl: '/uploads/category/bipedal.png',
        nameZh: '双足',
        nameEn: 'Bipedal',
        nameEs: 'Bipedal',
        namePt: 'Bipedal',
        descriptionZh: null,
        descriptionEn: null,
        descriptionEs: null,
        descriptionPt: null
      },
      {
        id: 'cat-inactive-root',
        parentId: null,
        slug: 'inactive',
        sortOrder: 2,
        isActive: false,
        iconImageUrl: '/uploads/category/inactive.png',
        nameZh: '停用',
        nameEn: 'Inactive',
        nameEs: 'Inactive',
        namePt: 'Inactive',
        descriptionZh: null,
        descriptionEn: null,
        descriptionEs: null,
        descriptionPt: null
      }
    ]);
    productFindMany.mockResolvedValue([]);

    const { getHomepagePayload } = await import('@/features/catalog/queries');
    const payload = await getHomepagePayload('en');

    expect(payload.rootCategories).toEqual([
      {
        id: 'cat-root',
        slug: 'robots',
        iconImageUrl: '/uploads/category/robots.png',
        name: 'Robots',
        description: 'Robot group'
      }
    ]);
    // 二级分类仍在 featuredCategories,rootCategories 只含启用的一级分类
    expect(payload.featuredCategories.map((c) => c.id)).toEqual(['cat-leaf']);
  });
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run tests/integration/catalog-query.test.ts`
Expected: FAIL,`payload.rootCategories` 为 `undefined`

- [ ] **Step 3: 实现**

`src/features/catalog/types.ts`,在 `HomepagePayload` 中 `featuredCategories` 前加一行:

```ts
export type HomepagePayload = {
  banners: Array<{
    id: string;
    imageUrl: string;
    targetType: string;
    targetId: string | null;
    targetUrl: string | null;
    targetCategorySlug?: string | null;
    targetCategoryIsLeaf?: boolean;
    sortOrder: number;
    title?: string | null;
    description?: string | null;
  }>;
  rootCategories: StorefrontCategory[];
  featuredCategories: StorefrontCategory[];
  recommendedProducts: StorefrontProductCard[];
};
```

`src/features/catalog/queries.ts` 的 `getHomepagePayload` return 中,`featuredCategories` 前加:

```ts
    rootCategories: categoryGroups.map((group) => ({
      id: group.id,
      slug: group.slug,
      iconImageUrl: group.iconImageUrl,
      name: group.name,
      description: group.description
    })),
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run tests/integration/catalog-query.test.ts`
Expected: PASS(全部用例,含原有用例)

- [ ] **Step 5: Commit**

```bash
git add src/features/catalog/types.ts src/features/catalog/queries.ts tests/integration/catalog-query.test.ts
git commit -m "feat: expose root categories in homepage payload"
```

---

### Task 2: hero 轮播改用一级分类

**Files:**
- Modify: `src/app/[locale]/page.tsx:14-34`
- Test: `tests/unit/homepage-hero-banners.test.ts`(新建)

- [ ] **Step 1: 写失败测试**

新建 `tests/unit/homepage-hero-banners.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';

// page.tsx 的模块依赖链会引入 @/lib/db(PrismaClient),这里 mock 掉避免副作用
vi.mock('@/lib/db', () => ({
  db: {}
}));

import { getHomepageHeroBanners } from '@/app/[locale]/page';
import type { HomepagePayload } from '@/features/catalog/types';

function buildPayload(overrides: Partial<HomepagePayload> = {}): HomepagePayload {
  return {
    banners: [
      {
        id: 'banner-1',
        imageUrl: '/uploads/banner/fallback.jpg',
        targetType: 'url',
        targetId: null,
        targetUrl: 'https://example.com',
        sortOrder: 1
      }
    ],
    rootCategories: [
      {
        id: 'cat-root-1',
        slug: 'robots',
        iconImageUrl: '/uploads/category/robots.png',
        name: 'Robots',
        description: 'Robot group'
      },
      {
        id: 'cat-root-2',
        slug: 'drones',
        iconImageUrl: null,
        name: 'Drones',
        description: null
      }
    ],
    featuredCategories: [
      {
        id: 'cat-leaf-1',
        slug: 'bipedal',
        iconImageUrl: '/uploads/category/bipedal.png',
        name: 'Bipedal',
        description: null
      }
    ],
    recommendedProducts: [],
    ...overrides
  };
}

describe('getHomepageHeroBanners', () => {
  it('builds hero banners from root categories with images', () => {
    const banners = getHomepageHeroBanners(buildPayload(), 'en');

    expect(banners).toHaveLength(1);
    expect(banners[0]).toMatchObject({
      id: 'category-cat-root-1',
      imageUrl: '/uploads/category/robots.png',
      targetType: 'category',
      targetUrl: '/en/categories/robots',
      targetCategorySlug: 'robots',
      targetCategoryIsLeaf: false,
      title: 'Robots',
      description: 'Robot group'
    });
  });

  it('falls back to banner table entries when no root category has an image', () => {
    const payload = buildPayload({
      rootCategories: [
        {
          id: 'cat-root-2',
          slug: 'drones',
          iconImageUrl: null,
          name: 'Drones',
          description: null
        }
      ]
    });

    const banners = getHomepageHeroBanners(payload, 'en');

    expect(banners).toEqual(payload.banners);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run tests/unit/homepage-hero-banners.test.ts`
Expected: FAIL,`getHomepageHeroBanners` 未导出(import 报错)

- [ ] **Step 3: 实现**

`src/app/[locale]/page.tsx`:给函数加 `export`,数据源从 `featuredCategories` 改为 `rootCategories`,`targetCategoryIsLeaf` 改为 `false`:

```ts
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
```

页面其余部分(含第二行 `HomepageCategoryGrid` 仍传 `payload.featuredCategories`)不变。

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run tests/unit/homepage-hero-banners.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/page.tsx tests/unit/homepage-hero-banners.test.ts
git commit -m "feat: use root category images for homepage hero"
```

---

### Task 3: 一级分类强制图片(服务端校验)

**Files:**
- Modify: `src/features/admin/category-actions.ts:29-65`
- Test: `tests/integration/admin/category-actions.test.ts`

- [ ] **Step 1: 写失败测试**

在 `tests/integration/admin/category-actions.test.ts` 的 describe 内追加(mock 与 `createValidInput` 复用文件顶部现有定义):

```ts
  it('rejects creating a root category without an image', async () => {
    const { createCategory } = await import('@/features/admin/category-actions');

    await expect(createCategory(createValidInput(null))).rejects.toThrow(
      'CATEGORY_IMAGE_REQUIRED'
    );
    expect(categoryCreate).not.toHaveBeenCalled();
  });

  it('creates a root category with an image', async () => {
    categoryCreate.mockResolvedValue({ id: 'cat-new' });

    const { createCategory } = await import('@/features/admin/category-actions');
    await createCategory({
      ...createValidInput(null),
      iconImageUrl: '/uploads/category/robots.png'
    });

    expect(categoryCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({
        parentId: null,
        iconImageUrl: '/uploads/category/robots.png'
      })
    });
  });

  it('still allows creating a leaf category without an image', async () => {
    categoryFindUnique.mockResolvedValue({ parentId: null });
    categoryCreate.mockResolvedValue({ id: 'cat-leaf' });

    const { createCategory } = await import('@/features/admin/category-actions');
    await createCategory(createValidInput('root-1'));

    expect(categoryCreate).toHaveBeenCalled();
  });

  it('rejects clearing the image on a root category update', async () => {
    const { updateCategory } = await import('@/features/admin/category-actions');

    await expect(
      updateCategory('root-1', { parentId: null, iconImageUrl: null })
    ).rejects.toThrow('CATEGORY_IMAGE_REQUIRED');
    expect(categoryUpdate).not.toHaveBeenCalled();
  });

  it('updates a root category when an image is provided', async () => {
    categoryUpdate.mockResolvedValue({ id: 'root-1' });

    const { updateCategory } = await import('@/features/admin/category-actions');
    await updateCategory('root-1', {
      parentId: null,
      iconImageUrl: '/uploads/category/new.png'
    });

    expect(categoryUpdate).toHaveBeenCalled();
  });
```

注意:这些用例里 `updateCategory('root-1', { parentId: null, ... })` 会走到 `requireCategoryHasNoProducts`,依赖 `productCount` mock 默认返回 `undefined`(不抛错),无需额外设置。

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run tests/integration/admin/category-actions.test.ts`
Expected: FAIL —— 无图 root 创建/更新没有抛 `CATEGORY_IMAGE_REQUIRED`

注意:第一个新用例与现有用例 `creates a root category when parentId is null` 冲突——现有用例 `createValidInput(null)` 不带图,实现后它会开始抛错。需要把现有那个用例改为带图:

```ts
  it('creates a root category when parentId is null', async () => {
    categoryCreate.mockResolvedValue({ id: 'cat-new', slug: 'third-level' });

    const { createCategory } = await import('@/features/admin/category-actions');
    const result = await createCategory({
      ...createValidInput(null),
      iconImageUrl: '/uploads/category/root.png'
    });

    expect(categoryCreate).toHaveBeenCalledWith({
      data: expect.objectContaining({ parentId: null, slug: 'third-level' })
    });
    expect(result.id).toBe('cat-new');
    expect(categoryFindUnique).not.toHaveBeenCalled();
  });
```

- [ ] **Step 3: 实现**

`src/features/admin/category-actions.ts`:

`createCategory` 中,`validateCategoryParent` 之后加校验:

```ts
export async function createCategory(input: CategoryInput) {
  await validateCategoryParent(input.parentId);

  if (!input.parentId && !input.iconImageUrl) {
    throw new Error('CATEGORY_IMAGE_REQUIRED');
  }

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
```

`updateCategory` 中,在 `if (input.parentId !== undefined)` 块内、层级检查之后加:

```ts
export async function updateCategory(id: string, input: Partial<CategoryInput>) {
  if (input.parentId !== undefined) {
    await validateCategoryParent(input.parentId, id);

    if (input.parentId) {
      await requireCategoryHasNoChildren(id);
    } else {
      await requireCategoryHasNoProducts(id);

      if (input.iconImageUrl !== undefined && !input.iconImageUrl) {
        throw new Error('CATEGORY_IMAGE_REQUIRED');
      }
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

说明:`iconImageUrl === undefined` 表示表单未提交该字段,跳过校验(兼容旧调用方);表单始终提交 `parentId`,因此从前台抽屉保存一级分类时该校验必然生效。

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run tests/integration/admin/category-actions.test.ts`
Expected: PASS(全部用例)

- [ ] **Step 5: Commit**

```bash
git add src/features/admin/category-actions.ts tests/integration/admin/category-actions.test.ts
git commit -m "feat: require image for root categories in admin actions"
```

---

### Task 4: 分类编辑抽屉对一级分类开放图片上传 + 错误文案

**Files:**
- Modify: `src/components/admin/product-center.tsx:243`(copy 类型)、`:385`(默认 copy)、`:1713-1719`(parentId state)、`:1745-1749`(错误映射)、`:1803-1809`(AdminSelect)、`:1827-1841`(上传字段条件)
- Modify: `messages/zh-CN.json`、`messages/en.json`、`messages/es.json`、`messages/pt.json`(均在 `categorySlugConflictError` 同层,约 :335)
- Test: `tests/unit/admin-product-center.test.tsx`

- [ ] **Step 1: 写失败测试**

在 `tests/unit/admin-product-center.test.tsx` 的 `describe('ProductCenter')` 内追加(`renderToStaticMarkup`、`ProductCenter`、`categories`、`products` 均为文件现有导入/常量):

```tsx
  it('shows the hero image upload field when creating a root category', () => {
    const html = renderToStaticMarkup(
      <ProductCenter
        categories={categories}
        products={products}
        defaultCategoryEditorOpen
        defaultCategoryEditorMode="create"
      />
    );

    expect(html).toContain('role="dialog"');
    expect(html).toContain('name="iconImageUrl"');
  });
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run tests/unit/admin-product-center.test.tsx`
Expected: FAIL —— 一级分类(parentId 为空)时抽屉不渲染 `iconImageUrl` 字段

- [ ] **Step 3: 实现**

`src/components/admin/product-center.tsx`,共 5 处:

(a) copy 类型(:243 附近),`categorySlugConflictError: string;` 后加:

```ts
  categoryImageRequiredError: string;
```

(b) 默认 copy(:385 附近),`categorySlugConflictError: 'Slug 已被其他类目占用，请更换后再保存。',` 后加:

```ts
  categoryImageRequiredError: '一级类目必须上传图片后再保存。',
```

(c) 错误映射(:1745-1749)改为:

```ts
      setFormError(
        message.includes('CATEGORY_IMAGE_REQUIRED')
          ? copy.categoryImageRequiredError
          : message.includes('Unique constraint')
            ? copy.categorySlugConflictError
            : message || copy.categorySaveError
      );
```

(d) 上传字段无条件渲染(:1827-1841),把 `{parentId ? ( ... ) : null}` 改为直接渲染:

```tsx
            <div className="md:col-span-2">
              <AdminImageUploadInput
                name="iconImageUrl"
                label={copy.categoryHeroImage}
                uploadLabel={copy.uploadHeroImage}
                defaultValue={category?.iconImageUrl ?? ''}
                scope="category"
                showPreview
                previewAlt={category?.nameZh ?? copy.categoryHeroPreviewAlt}
                clearLabel={copy.removeCategoryHeroImage}
                uploadCopy={getProductImageUploadCopy(copy)}
              />
            </div>
```

(e) 清理因此不再使用的 `parentId` state(:1713-1719 与 :1808):

- 删除 `const [parentId, setParentId] = useState(category?.parentId ?? '');`
- 删除重置该 state 的 `useEffect`(:1715-1719 整个块)
- 删除 `AdminSelect` 上的 `onValueChange={setParentId}`

删除后确认 `CategoryEditorDrawer` 内不再有任何 `parentId` / `setParentId` 引用(文件其他部分的同名变量不动),并确认 `useEffect` 在文件其他处仍有使用(该文件很大,几乎必然仍有;若没有则从 import 中移除)。

(f) 四个 messages 文件,在各自 `categorySlugConflictError` 同层后加:

`messages/zh-CN.json`:
```json
      "categoryImageRequiredError": "一级类目必须上传图片后再保存。",
```

`messages/en.json`:
```json
      "categoryImageRequiredError": "A top-level category requires an image. Please upload one before saving.",
```

`messages/es.json`:
```json
      "categoryImageRequiredError": "Las categorías de primer nivel requieren una imagen. Sube una antes de guardar.",
```

`messages/pt.json`:
```json
      "categoryImageRequiredError": "As categorias de primeiro nível exigem uma imagem. Envie uma antes de salvar.",
```

注意 JSON 逗号:新行跟在 `categorySlugConflictError` 行后,保证前后行逗号正确。

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run tests/unit/admin-product-center.test.tsx tests/unit/admin-i18n.test.ts`
Expected: PASS(`admin-i18n.test.ts` 会校验 messages 与 copy 的完整性)

- [ ] **Step 5: Commit**

```bash
git add src/components/admin/product-center.tsx messages/zh-CN.json messages/en.json messages/es.json messages/pt.json tests/unit/admin-product-center.test.tsx
git commit -m "feat: require hero image upload for root categories in category editor"
```

---

### Task 5: 全量验证

- [ ] **Step 1: 全部单元/集成测试**

Run: `npm test`
Expected: 全部 PASS

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: 无错误、无警告(`--max-warnings=0`)

- [ ] **Step 3: 构建**

Run: `npm run build`
Expected: 构建成功

- [ ] **Step 4: 手动冒烟(需要本地 dev server 与数据库)**

1. 首页:hero 展示一级分类图片,主 CTA 链接为 `/{locale}/products?category={slug}`;第二行仍为二级分类卡片。
2. 后台商品中心:新增一级分类不上传图片 → 显示"一级类目必须上传图片后再保存。";上传后保存成功。
3. 编辑一个存量无图一级分类 → 被强制要求补图。
4. 新增/编辑二级分类不上传图片 → 仍可保存。
