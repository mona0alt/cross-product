# 社媒展示区块后台化设计

日期：2026-08-09
状态：已确认

## 背景与目标

首页底部的"社交媒体 #FBGM"区块（`src/components/storefront/social-showcase.tsx`）目前完全硬编码：5 个按机器人品类的标签筛选 + 20 张假帖子卡片，品类与现有商品目录不符，卡片也不可点击。

目标：

1. 去掉标签筛选，卡片改为纯图片展示（平台徽标 + 单张封面图），整卡可点击跳转；
2. 卡片内容后台可管理：在后台"社媒卡片"菜单中为每张卡片配置平台、URL 和封面图片（每张卡片一张封面图）；
3. 平台可扩展：未来新增社媒平台只需在注册表和平台选项中各加一项。

## 已确认的产品决策

- 卡片纯图片，不显示标题文案，只保留平台徽标；
- 每张卡片独立配置 URL（点击整卡新窗口跳转）；
- 无需排序和上下架：配置上就是生效的（无 sortOrder / isActive 字段）；
- 现有平台：Facebook（`https://www.facebook.com/p/Fbgm-Decomaterial-61585767212910/`）、Instagram（`https://www.instagram.com/fbgm_decomaterial`）；
- 未来可能新增其他社媒平台。

## 数据模型

`prisma/schema.prisma` 新增：

```prisma
model SocialPost {
  id        String   @id @default(cuid())
  platform  String   // 'facebook' | 'instagram' | 未来扩展
  imageUrl  String   // 封面图（每张卡片一张）
  targetUrl String   // 点击跳转地址
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

前台展示顺序按 `createdAt` 升序（先建先显示）。schema 同步方式沿用部署脚本现有逻辑（无 migrations 目录时 `prisma db push`，仅追加新表，不影响现有数据）。

## 平台注册表

在 `src/features/catalog/social-platforms.ts`（新文件）维护平台注册表：

```ts
export const socialPlatforms = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' }
] as const;
```

后台表单的平台下拉选项、前台卡片的徽标文案都从这里取。新增平台 = 注册表加一项。

## 系统设置改动

- `upload` 组新增 `upload.socialSegment`（默认 `social`），作为社媒封面图的上传目录；
- `RuntimeSystemSettings.upload` 增加 `socialSegment` 字段；
- 今天预先加入的 `social.facebookUrl` / `social.instagramUrl` 两个设置项及 `RuntimeSystemSettings.social` 字段**移除**——URL 改为在社媒卡片上直接配置，避免双数据源。

## 上传链路

- `src/features/admin/upload-storage.ts`：`AdminUploadScope` 增加 `'social'`，`normalizeAdminUploadScope` 识别之，目录段取 `upload.socialSegment`；
- 上传组件 `AdminImageUploadInput` 直接用 `scope="social"`，其余复用现有 `/api/admin/uploads/product-images` 端点，无需改动。

## 后台管理页

- 菜单：`src/app/admin/(protected)/layout.tsx` 的 `navItems` 加"社媒卡片" → `/admin/social-posts`，4 个语言文件补 `Admin.nav` 文案；
- 页面：`src/app/admin/(protected)/social-posts/page.tsx`（`force-dynamic`），查询全部 SocialPost 渲染表单组件；
- 组件：`src/components/admin/social-post-form.tsx`，照搬 `BannerForm` 的单页 CRUD 模式（顶部新建表单 + 列表逐行编辑），字段：平台（下拉）、封面图（`AdminImageUploadInput scope="social"`）、跳转 URL；每行附删除按钮。无排序、无上下架开关；
- Server actions：`src/features/admin/social-post-actions.ts`，`createSocialPost` / `updateSocialPost` / `deleteSocialPost` 及对应 FromForm 包装——带 `requireAdminSession()` 鉴权与 `revalidatePath`（`/` 与 `/admin/social-posts`）。

## 前台

- `SocialShowcase` 重写为服务端组件（去掉 `'use client'`、标签 state 和全部硬编码数据）：
  - props：`copy: { title: string }`、`posts: Array<{ id, platform, imageUrl, targetUrl }>`；
  - 无卡片时整个区块不渲染（`return null`）；
  - 卡片：`<a href={targetUrl} target="_blank" rel="noopener noreferrer">`，内容为封面图 + 左上角平台徽标（label 取自注册表，未知平台原样显示 `platform` 值），无标题等其他文字；沿用现有 9:16 卡片视觉与网格（`grid gap-5 sm:grid-cols-2 lg:grid-cols-4`）；
- `src/app/[locale]/page.tsx`：调用 `getSocialShowcasePosts()`（新增于 `src/features/catalog/queries.ts`，`db.socialPost.findMany({ orderBy: { createdAt: 'asc' } })`）传给组件。

## i18n 文案

- `Storefront.socialShowcase` 只保留 `title`，删除 `handle` 与 `tabs`（4 个语言文件同步）；
- 新增 `Admin.nav.socialPosts` 及社媒卡片表单所需文案（4 个语言文件）。

## 测试

- 更新 `tests/unit/homepage-showcase-components.test.tsx` 中 SocialShowcase 用例（无标签、卡片带链接、空数据不渲染）；
- 更新 `tests/integration/storefront-routes.test.ts` 首页用例（mock `getSocialShowcasePosts`）；
- 新增测试覆盖 social-post actions 的鉴权/增删改；
- 上传 scope 相关测试补 `social` 用例（`admin-upload` / `upload-rules` 视影响面）；
- 系统设置测试补 `upload.socialSegment`。

## 部署与初始数据

实现完成后**先不部署**，由用户在本地测试确认后再同步生产。部署时的步骤预案：

1. `./deploy-preview.sh --code-only` 同步代码（其 `SKIP_DATABASE_SETUP=1` 会跳过 schema 同步）；
2. 生产单独执行 `npx prisma db push`（仅追加 SocialPost 新表，不动业务数据）；
3. 生产库插入 2 张初始卡片（Facebook、Instagram 各一，URL 如上，封面图先用现有 `/show/` 静态图，后台可随时替换为上传图）；
4. 本地库先行同样初始化，供测试确认。

## 不做的事（YAGNI）

- 不做卡片标题/描述/日期字段；
- 不做排序与上下架（配置即生效）；
- 不做真实社媒 API 接入；
- 不改动现有 Banner 实现的缺口（鉴权/删除），仅在新功能里避免同样问题；
- 不保留系统设置中的平台主页链接（URL 由卡片自承载）。
