# 后台可配置前台轮播与商品内容设计规格

日期：2026-05-11

## 背景

当前项目已经具备 Next.js App Router、Prisma、PostgreSQL、四语前台路由、商品/分类/Banner 数据模型，以及后台页面原型。现有后台表单覆盖了 Banner、商品分类、商品多语言内容和图片 URL 字段，但部分表单仍是静态原型，尚未形成可保存、可上传、可发布、可前台展示的完整闭环。

本次目标是在不重建整体数据模型的前提下，把后台配置能力补齐为可用功能：管理员可以配置首页轮播图、商品分类、商品图片、商品描述和商品多语言内容；前台根据当前语言展示对应内容；后台管理页面自身也支持多语言。

## 目标

- 后台可新增、编辑、启停首页 Banner，并支持 Banner 图片上传到本地磁盘。
- 后台可创建和编辑商品，覆盖商品分类、商品编码、slug、价格、状态、推荐、排序、封面图、图库图片，以及四语名称、简介和详情。
- 商品图片支持从网页端上传，第一阶段保存到本地 `public/uploads` 目录，并返回可前台直接访问的 URL。
- 前台首页轮播、商品列表和商品详情继续读取数据库中已发布或启用的数据，并按 `zh-CN`、`en`、`es`、`pt` 展示本地化内容。
- 后台管理界面支持 `zh-CN`、`en`、`es`、`pt` 四种语言。
- 保持单管理员模型，不引入多角色权限。

## 非目标

- 不实现对象存储、CDN、图片裁剪或图片转码。
- 不实现自动翻译。
- 不实现复杂媒体库、拖拽排序工作台或多角色审核流。
- 不改造后台路由为 `/[locale]/admin`。
- 不新增订单、购物车、支付或会员体系。

## 架构方案

采用“补齐现有后台配置闭环”的保守方案。

数据模型继续复用现有 Prisma 表：

- `Banner`：首页轮播图、跳转类型、目标、排序和启停。
- `Category`：商品分类、多语言名称与描述。
- `Product`：商品基础信息、封面图、多语言名称、简介和详情。
- `ProductImage`：商品图库图片、排序和 alt 文案。

本次主要补齐以下层：

- 后台 server actions：处理 Banner、商品和图库的创建/更新。
- 上传 API：处理管理员图片上传、本地保存和 URL 返回。
- 后台表单组件：把静态输入框改为可提交表单，并接入上传控件。
- 后台 i18n：新增 `Admin` 字典区与 cookie 驱动的后台语言切换。
- 测试：覆盖 actions、上传校验、图库更新、后台文案和前台映射。

## 后台多语言设计

后台继续使用 `/admin` 路由，不新增 locale path segment。后台语言由 `ADMIN_LOCALE` cookie 控制，默认语言为 `zh-CN`。

新增服务端工具：

- `getAdminLocale()`：读取 `ADMIN_LOCALE` cookie，校验后返回支持的 locale。
- `getAdminDictionary()`：基于后台 locale 读取 `messages/<locale>.json` 中的 `Admin` 字典。

新增客户端能力：

- `AdminLanguageSwitcher`：放在后台顶部栏，展示四种语言并写入 `ADMIN_LOCALE` cookie。
- 切换后刷新当前后台页面，使 server component 使用新的字典。

字典结构建议：

```json
{
  "Admin": {
    "nav": {
      "analytics": "数据分析",
      "products": "商品管理",
      "banners": "轮播图",
      "categories": "分类管理",
      "messages": "支持中心",
      "subscribers": "邮件订阅"
    },
    "common": {
      "save": "保存",
      "create": "新建",
      "edit": "编辑",
      "enabled": "启用",
      "disabled": "停用",
      "upload": "上传图片"
    }
  }
}
```

后台页面逐步从硬编码中文迁移到字典文案。本次优先覆盖本需求直接涉及的后台布局、顶部栏、Banner 页、商品表单和分类入口；登录页也纳入字典，避免后台首次入口仍是单语言。

## 图片上传设计

新增上传接口：

- `POST /api/admin/uploads/product-images`

请求格式：

- `multipart/form-data`
- 字段名：`file`
- 可选字段：`scope`，取值为 `product` 或 `banner`，默认 `product`

校验规则：

- 必须通过管理员登录校验。
- 只允许 `image/jpeg`、`image/png`、`image/webp`、`image/gif`。
- 单文件大小第一阶段限制为 5MB。
- 文件名由服务端生成，避免使用用户传入文件名作为存储名。

存储规则：

- 商品图片保存到 `public/uploads/products/YYYY/MM/<id>.<ext>`。
- Banner 图片保存到 `public/uploads/banners/YYYY/MM/<id>.<ext>`。
- 接口返回 `{ "url": "/uploads/products/..." }` 或 `{ "url": "/uploads/banners/..." }`。

说明：

- 本地磁盘方案适合当前单机部署和快速上线。
- 如果未来部署到无状态平台或多实例环境，需要把上传存储层替换为对象存储。

## 商品管理设计

商品表单分为五个区域：

- 基础信息：商品编码、slug、分类、价格、排序、状态、推荐。
- 多语言内容：四语名称、简介和详情。
- 封面图：支持上传图片，也支持手动填写 URL。
- 图库图片：支持上传多张图片，保存为 `ProductImage` 记录；也支持按行粘贴 URL。
- 操作区：保存草稿、保存并提交审核、发布。

服务端 actions：

- `createProductFromForm(formData)`：创建商品草稿或待审核商品。
- `updateProductFromForm(id, formData)`：更新商品基础信息、多语言内容和图库。
- `publishProduct(id)`：沿用现有发布校验，确认四语必填字段和分类完整后发布。

图库更新策略：

- 表单提交时接收有序 URL 列表。
- 服务端在事务中删除当前商品旧图库记录，再按提交顺序重建 `ProductImage`。
- 封面图独立存储在 `Product.coverImageUrl`，不强制同步到图库。

## Banner 管理设计

Banner 表单支持：

- 图片上传或手动填写图片 URL。
- 目标类型：分类、商品、外链。
- 目标 ID 或目标 URL。
- 排序。
- 启用/停用。

服务端 actions：

- `createBannerFromForm(formData)`。
- `updateBannerFromForm(id, formData)`。
- `toggleBanner(id, isActive)`。

前台继续由 `getHomepagePayload(locale)` 查询启用 Banner，并按 `sortOrder` 排序展示。

## 分类管理设计

现有 `Category` 已具备四语名称和描述字段。分类管理保留当前树形结构，补齐表单保存能力时需要覆盖：

- 父级分类。
- slug。
- 排序。
- 图标图片 URL。
- 启用状态。
- 四语名称和描述。

分类本身不需要上传接口的独立 scope；图标图片可复用上传接口返回的 URL，也可以保留手动 URL 输入。

## 数据流

1. 管理员进入后台，后台根据 `ADMIN_LOCALE` cookie 读取对应 `Admin` 字典。
2. 管理员上传图片，上传接口校验登录状态和文件类型，把文件保存到 `public/uploads`，返回 URL。
3. 表单把返回 URL 写入封面图、图库或 Banner 图片字段。
4. 管理员提交表单，server action 校验字段并写入数据库。
5. 前台页面通过既有 catalog queries 读取启用 Banner、已发布商品和启用分类。
6. mapper 根据前台 locale 选择对应语言字段并渲染。

## 错误处理

- 未登录上传返回 `401`。
- 非图片或不支持类型返回 `400` 与稳定错误码 `UNSUPPORTED_FILE_TYPE`。
- 文件过大返回 `400` 与稳定错误码 `FILE_TOO_LARGE`。
- 商品必填字段缺失时返回可展示的字段错误。
- 发布校验失败继续返回现有 blockers 列表。
- 上传写盘失败返回 `500`，前端显示通用失败提示。

## 测试方案

采用测试优先实现。

单元/集成测试覆盖：

- 上传接口拒绝未登录请求。
- 上传接口拒绝不支持的 MIME 类型。
- 上传接口成功写入本地上传目录并返回 `/uploads/...` URL。
- 商品 action 创建时写入四语内容和草稿状态。
- 商品 action 更新时重建图库记录并保持排序。
- Banner action 从表单创建 Banner 并写入上传图片 URL。
- 后台 locale 工具根据 cookie 返回合法语言，非法值回退默认语言。
- 后台布局和关键页面使用 `Admin` 字典渲染导航和按钮。
- 前台 mapper 继续按 locale 返回商品名称、简介、详情和分类名称。

端到端测试可选覆盖：

- 登录后台后切换语言，导航文案更新。
- 上传商品图片并保存商品，前台商品详情页展示上传图片。

## 风险与后续扩展

- 本地磁盘上传在多实例部署或容器重建后可能丢失文件；上线环境如果需要持久化，应挂载持久卷或迁移对象存储。
- 后台页面较多，本次优先让核心后台壳、商品、Banner、分类入口具备多语言。分析页、消息页、订阅页可按同一 `Admin` 字典模式继续迁移。
- 当前工作区已有未提交改动；实施时必须只修改本需求相关文件，不回退用户已有更改。
