# 首页 Hero 改用一级分类 + 一级分类强制图片 — 设计文档

日期:2026-08-02
状态:已获用户确认

## 背景与问题

商品首页第一行 hero 轮播(`BannerCarousel`)与第二行分类卡片(`HomepageCategoryGrid`)
使用**同一份数据** `featuredCategories`(所有启用二级分类打平),图片、名称、跳转目标
完全相同,仅排版不同,信息增量接近零。

业务定位:B2B 询盘站,有运营人员可制作图片。

## 决策

- hero 轮播改用**一级分类**(`parentId IS NULL`)图片;第二行二级分类卡片**保持不变**。
- 管理员后台在新增/编辑**一级分类**时强制要求图片(`iconImageUrl`);二级分类图片保持可选。

## 设计

### 1. 首页 hero 数据源改为一级分类

- `src/features/catalog/queries.ts` 的 `getHomepagePayload` 增加返回一级分类列表:
  复用现有 `categoryGroups`,取每组根节点,字段与 `featuredCategories` 一致
  (`id / slug / iconImageUrl / name / description`),顺序沿用 `sortOrder asc, createdAt asc`。
  只包含 `isActive` 的分类(沿用 `buildStorefrontCategoryGroupsFromRecords` 的过滤)。
- `src/app/[locale]/page.tsx` 的 `getHomepageHeroBanners`:
  - 改为筛选**一级分类**中有 `iconImageUrl` 的生成 banner;
  - `targetCategoryIsLeaf` 改为 `false`,使主 CTA 跳转 `/{locale}/products?category={slug}`
    (该大类下全部商品);图片点击仍跳 `/{locale}/categories/{slug}` 分类详情页;
  - 兜底不变:没有任何带图一级分类时,回退到 `payload.banners`(后台 Banner 表)。
- `HomepagePayload` 类型(`src/features/catalog/types.ts`)相应增加字段。

### 2. 第二行不动

`featuredCategories`(二级分类)与 `HomepageCategoryGrid` 保持原样。
hero = 一级分类、第二行 = 二级分类,两处数据源分开,重复消除。

### 3. 一级分类强制图片(admin)

- **上传入口**:`src/components/admin/product-center.tsx` 的 `CategoryEditorDrawer`
  去掉 `:1827` 处的 `{parentId ? ... : null}` 条件,一级分类同样渲染
  `AdminImageUploadInput`(上传走现有 `/api/admin/uploads/product-images`,scope=`category`)。
- **服务端校验**:`src/features/admin/category-actions.ts`:
  - `createCategory` / `updateCategory` 中,当 `parentId` 为空(一级分类)时
    `iconImageUrl` 必填,缺失抛错误码 `CATEGORY_IMAGE_REQUIRED`;
  - 注意 update 现有分支:`iconImageUrl` 为 `undefined` 表示"未提交该字段"
    (`category-actions.ts:58`)。上传字段对一级分类放开渲染后,hidden input 始终存在,
    空值会提交为空串,按缺失处理;`undefined` 分支行为不变。
  - 二级分类图片保持可选(现有 `getNullableLocalImagePath` 逻辑不变)。
- **错误提示**:`product-center.tsx` 的 `handleFormAction` 增加 `CATEGORY_IMAGE_REQUIRED`
  特判,copy 键加入 `defaultProductCenterCopy` 及 `messages/en.json`、`messages/es.json`、
  `messages/pt.json`、`messages/zh-CN.json` 四语言。
- **存量数据**:现有无图一级分类不报错、不进 hero;下次编辑时被强制补图。

### 明确不做

- `src/components/admin/category-form.tsx` 是未被引用的遗留组件,不改动。
- `src/app/admin/(protected)/categories/page.tsx` 实际渲染系统设置,与分类无关,不改动。
- 二级分类不强制图片。
- Banner 表兜底逻辑不变。

## 影响文件

| 文件 | 改动 |
| --- | --- |
| `src/features/catalog/queries.ts` | payload 增加一级分类列表 |
| `src/features/catalog/types.ts` | `HomepagePayload` 增加字段 |
| `src/app/[locale]/page.tsx` | hero 改用一级分类,`targetCategoryIsLeaf: false` |
| `src/components/admin/product-center.tsx` | 一级分类显示上传入口;新增错误码特判与 copy |
| `src/features/admin/category-actions.ts` | 一级分类图片必填校验 |
| `messages/en.json` / `es.json` / `pt.json` / `zh-CN.json` | 新错误文案 |

## 测试

- 单元/集成:一级分类 create/update 无图报错、有图通过;二级分类无图仍可通过。
- e2e(如现有覆盖首页):hero 展示一级分类;无带图一级分类时回退 Banner 表。
- 手动:后台编辑存量无图一级分类,验证被强制要求补图。
