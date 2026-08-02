# 商品类目层级改造设计文档

## 1. 背景与目标

当前前台商品目录只有“类目 → 商品”一级关系，例如：

```
机器人 → Alpha Humanoid
```

希望增加一个分组层级，形成：

```
科技类 → 机器人 → Alpha Humanoid
```

即：类目固定为 **两层**，商品只能挂在 **第二层（叶子类目）**。

## 2. 设计决策

| 决策项 | 结论 |
| --- | --- |
| 数据模型 | 不修改 Prisma schema，复用 `Category.parentId` |
| 最大层级 | 严格两层：一级类目（无父级）+ 二级类目（父级为一级类目） |
| 商品挂载 | 只能挂载到二级类目，禁止挂到一级类目 |
| URL 策略 | 保持扁平 `/{locale}/categories/{slug}`，slug 全局唯一 |
| 一级类目页 | 只展示其下二级类目入口，不直接列出商品 |
| 二级类目页 | 展示该叶子类目下的商品列表 |
| 面包屑 | 完整路径：首页 > 一级类目 > 二级类目 > 商品 |
| 后台位置 | 类目维护继续放在 `/admin/products`（商品中心），不改独立页面 |
| 首页分类网格 | 展示二级类目，而不是一级类目 |

## 3. 数据模型与业务规则

### 3.1 现有模型

`prisma/schema.prisma` 中的 `Category` 已具备：

```prisma
model Category {
  id       String    @id @default(cuid())
  parentId String?
  slug     String    @unique
  // ... 多语言字段
  parent   Category? @relation("CategoryHierarchy", fields: [parentId], references: [id], onDelete: Cascade)
  children Category[] @relation("CategoryHierarchy")
  products Product[]
}
```

无需迁移。

### 3.2 层级规则（服务端强制校验）

1. 一级类目：`parentId = null`。
2. 二级类目：`parentId` 指向一个 `parentId = null` 的类目。
3. 禁止三级：`parentId` 不能指向一个二级类目。
4. 商品 `categoryId` 必须是二级类目。
5. 一级类目下禁止直接挂载商品。

校验点：

- `createCategoryFromForm` / `updateCategoryFromForm`（`src/features/admin/category-actions.ts`）
- `createProductFromForm` / `updateProductFromForm` / `publishProduct`（`src/features/admin/product-actions.ts`）

## 4. 查询层改造

### 4.1 前台类目树

`src/features/catalog/queries.ts` 中的 `buildStorefrontCategoryGroupsFromRecords` 已经按两层构建，但需调整以下行为：

- 一级类目 `isActive=false` 时，其下所有二级类目 **不再提升为根**，而是整体隐藏。
- 商品聚合：只统计二级类目下 `status=published` 的商品。

### 4.2 商品列表筛选

`getProductListPayload` 当前用 `category.slug = slug OR category.parent.slug = slug` 筛选，正好覆盖：

- 按二级类目筛选：匹配 `category.slug`。
- 按一级类目筛选：匹配 `category.parent.slug`。

无需改动筛选逻辑。

### 4.3 后台类目树

`getAdminCategoryTree` 已经是递归构建，可继续复用。仅在展示层控制缩进和可选父级。

## 5. 前台 UI 改造

### 5.1 Header 导航

- 主导航项 = 一级类目（如“科技类”）。
- Mega menu = 该一级类目下的二级类目卡片矩阵。
- 点击二级类目卡片跳转 `/categories/{二级slug}`。
- 移动端菜单：展开一级类目后显示其二级子项。

涉及文件：

- `src/components/storefront/header.tsx`
- `src/app/[locale]/layout.tsx`（传入 `categoryGroups`）

### 5.2 一级类目页

`src/app/[locale]/categories/[slug]/page.tsx`：

- 若当前 slug 是一级类目，渲染子类目网格（不展示商品）。
- 面包屑：首页 > 一级类目。

### 5.3 二级类目页

- 展示该二级类目下的 published 商品。
- 面包屑：首页 > 一级类目 > 二级类目。
- 左侧筛选组件保留，但隐藏类目选择（当前已隐藏）。

### 5.4 商品详情页面包屑

`src/app/[locale]/products/[slug]/page.tsx`：

- 面包屑：首页 > 一级类目 > 二级类目 > 商品名称。
- 需要从 `product.category.parent` 读取一级类目信息。

### 5.5 商品列表页筛选

`src/app/[locale]/products/page.tsx` + `src/components/storefront/filter-sidebar.tsx`：

- 一级下拉：所有一级类目。
- 二级下拉：按一级类目分组的二级类目。
- query 参数继续使用 `category` 和 `subcategory`。

### 5.6 首页分类网格

`src/app/[locale]/page.tsx`：

- `featuredCategories` 改为展示二级类目，而不是一级类目。
- 这样用户点击后直接进入有商品的二级类目页。

## 6. 后台 UI 改造

继续放在 `/admin/products` 商品中心内。

### 6.1 左侧类目树

`src/components/admin/product-center.tsx`：

- 按两层缩进渲染：`科技类` 不缩进，`└ 擦窗机器人` 缩进。
- 一级类目不可点击筛选商品（仅作为分组展示）。
- 点击二级类目筛选右侧商品。
- 类目数量只统计直接挂载的商品数。

### 6.2 类目编辑抽屉

`src/components/admin/product-center.tsx` 内的类目编辑表单：

- 父级类目下拉：
  - 空值 = 作为一级类目。
  - 可选列表只包含一级类目。
  - 二级类目灰显并标注“不能再做父级”。
- 保存时若违反层级规则，返回明确错误文案。

### 6.3 商品表单类目选择

`src/components/admin/product-center.tsx` 商品编辑抽屉 + `src/components/admin/product-form.tsx`：

- 类目下拉使用 `<optgroup>` 按一级类目分组。
- 只显示二级类目选项，一级类目灰显或隐藏。
- 后端再次校验 `categoryId` 必须是二级类目。

## 7. Seed 数据

`prisma/seed.ts` 调整：

1. 新增一级类目：
   - slug: `tech`
   - 名称：科技类 / Technology / Tecnología / Tecnologia
2. 将现有四个类目作为 `tech` 的子类目创建：
   - 擦窗机器人（`window-cleaning-robots`）
   - 无人机（`drones`）
   - 人形机器人（`humanoid-robots`）
   - 扫地机器人（`robot-vacuums`）
3. 商品 `categorySlug` 保持不变，仍指向上述二级类目。

> 现有 seed 中虽然定义了 `children` 字段，但创建逻辑只写了顶层，本次一并修复。

## 8. 测试计划

### 8.1 单元测试

- `buildStorefrontCategoryGroupsFromRecords`：
  - 一级 inactive 时，子类目不提升为根。
  - 只返回 `isActive=true` 的类目。
- 层级校验工具函数：
  - 创建三级类目应报错。
  - 把商品挂到一级类目应报错。

### 8.2 集成测试

- `getProductListPayload`：
  - 按一级类目 slug 筛选返回该大类下所有商品。
  - 按二级类目 slug 筛选返回对应商品。
- 类目页渲染：
  - 一级类目页展示子类目入口。
  - 二级类目页展示商品。

### 8.3 E2E 测试

- Header mega menu hover 后展示二级类目，点击跳转正确。
- 二级类目页面包屑展示完整路径。
- 商品详情页面包屑展示完整路径。
- 后台商品中心：
  - 类目树两层缩进正确。
  - 保存三级类目时报错。
  - 商品保存时选择一级类目报错。

## 9. 风险与上线注意

1. **生产数据迁移**：若生产库已有类目数据，需要一次性脚本：
   - 创建一级类目（如“科技类”）。
   - 将现有类目挂到该一级类目下。
   - 更新 Banner `targetId`（若其指向的类目 ID 变化）。
2. **URL 兼容性**：类目页 URL 不变，旧链接和 SEO 不受影响。
3. **图片路径**：类目主图继续走本地路径校验，无变化。
4. **删除/停用**：一级类目停用时，其下二级类目及商品应同步在前台隐藏；后台保留现有“删除即停用”逻辑。

## 10. 不做的范围

- 不支持三层及以上类目。
- 不改为嵌套 URL（如 `/categories/tech/robots`）。
- 不新建独立“类目管理”后台页面。
- 不改 `Banner` 模型或 `targetType` 语义。

## 11. 相关文件清单

- `prisma/schema.prisma`：只读确认，无变更。
- `prisma/seed.ts`：新增一级类目并修复子类目创建。
- `src/features/catalog/queries.ts`：调整类目树构建和 inactive 处理。
- `src/features/catalog/mappers.ts`：视需要补充父级字段映射。
- `src/features/admin/category-actions.ts`：加层级校验。
- `src/features/admin/product-actions.ts`：加商品挂载类目层级校验。
- `src/components/storefront/header.tsx`：主导航改为一级类目，mega menu 展示二级类目。
- `src/app/[locale]/page.tsx`：首页分类网格展示二级类目。
- `src/app/[locale]/categories/[slug]/page.tsx`：一级类目页展示子类目。
- `src/app/[locale]/products/[slug]/page.tsx`：商品详情面包屑补充一级类目。
- `src/components/storefront/filter-sidebar.tsx`：二级下拉按一级分组。
- `src/components/admin/product-center.tsx`：类目树缩进、父级选择限制、商品类目选择分组。
- `src/components/admin/product-form.tsx`：商品类目选择分组。
- `tests/unit/`、`tests/integration/`、`tests/e2e/`：补充/更新相关测试。
