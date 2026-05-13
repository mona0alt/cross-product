# FBGM Robotics 多语言商品展示与后台管理平台 Spec

## 1. 文档范围

本文档基于当前源码、路由、Prisma schema、组件实现、测试和部署脚本反向整理项目规格，不引用 `docs/superpowers`、`docs/design` 等历史设计文档。

当前项目是一个面向机器人产品展示的多语言站点，同时提供后台商品、类目、图片上传、订阅、留言、分析与系统配置工作台。本文区分两类能力：

- 已落库能力：由 Prisma 数据模型、API、Server Actions 或文件系统上传支撑。
- 展示型能力：页面存在，但数据主要来自 mock 或组件本地状态，尚未形成完整后端闭环。

## 2. 产品定位

### 2.1 目标用户

- 前台访客：浏览 FBGM 机器人产品、按类目筛选、查看详情、联系销售、订阅更新。
- 后台管理员：维护商品目录、类目、产品图片、多语言内容、推荐位与发布状态。
- 运营人员：查看邮件订阅、留言列表、分析面板和系统配置状态。

### 2.2 核心目标

- 支持中文、英文、西班牙语、葡萄牙语四种语言的商品展示。
- 支持公开产品目录、首页推荐、分类导航和商品详情。
- 支持后台登录后管理商品、类目和本地图片资源。
- 支持公开联系表单和邮件订阅表单写入数据库。
- 支持部署到 Node.js + PostgreSQL + PM2 + Nginx 环境。

## 3. 技术栈

- Web 框架：Next.js 15 App Router。
- UI：React 19、TypeScript strict、Tailwind CSS。
- 国际化：next-intl，消息文件位于 `messages/{locale}.json`。
- 数据库：Prisma 6，schema 当前声明 PostgreSQL datasource。
- 鉴权：bcryptjs 校验管理员密码，HMAC 签名 Cookie 保存后台会话。
- 表单校验：zod。
- 图标：lucide-react。
- 测试：Vitest 单元/集成测试，Playwright E2E。
- 部署：`deploy.sh`、`deploy-preview.sh`、`ecosystem.config.js`，生产进程由 PM2 管理。

## 4. 目录结构

- `src/app`：Next.js 路由、布局、API route handlers。
- `src/app/[locale]`：前台多语言页面。
- `src/app/admin`：后台登录页与受保护后台页面。
- `src/app/api`：公开表单 API、后台登录/退出/上传 API。
- `src/components/storefront`：前台 Header、Footer、首页模块、商品卡、筛选、表单、详情图库。
- `src/components/admin`：后台导航、产品中心、抽屉表单、上传控件、表格和工作台组件。
- `src/features/catalog`：商品和类目查询、映射、类型、发布校验、本地图片路径约束。
- `src/features/admin`：商品/类目/Banner Server Actions、上传存储、上传规则、mock 后台数据。
- `src/features/forms`：联系表单和订阅表单 schema 及写库逻辑。
- `src/lib`：数据库客户端、环境变量、鉴权、国际化配置。
- `prisma`：数据库 schema 与 seed 数据。
- `public/show`：内置展示图片。
- `public/uploads`：后台上传图片落盘目录。
- `tests`：unit、integration、e2e 测试。

## 5. 国际化设计

### 5.1 支持语言

系统支持以下 locale：

- `zh-CN`：默认语言。
- `en`。
- `es`。
- `pt`。

### 5.2 路由策略

- 公开页面必须带 locale 前缀，例如 `/zh-CN/products`、`/en/products/sky-cleaner-pro`。
- 根路径 `/` 根据 `Accept-Language` 优先匹配中文、西语、葡语、英文，否则跳转默认 `zh-CN`。
- 非 locale 前缀的公开路径会跳转到 `/{defaultLocale}{pathname}`。
- 后台路径 `/admin/*` 不带 locale 前缀，后台语言通过 `ADMIN_LOCALE` Cookie 控制。

### 5.3 文案策略

- 前台和后台文案集中在 `messages/*.json`。
- 商品和类目多语言内容直接存储为独立字段，例如 `nameZh`、`nameEn`、`nameEs`、`namePt`。
- 查询层根据当前 locale 将多语言字段映射成前台统一字段 `name`、`intro`、`detail`、`description`。

## 6. 数据模型

### 6.1 Admin

管理员账号。

- `username` 唯一。
- `passwordHash` 存储 bcrypt 哈希。
- seed 阶段从 `ADMIN_USERNAME`、`ADMIN_PASSWORD` 创建。

### 6.2 Category

商品类目，支持父子层级。

- 关键字段：`parentId`、`slug`、`sortOrder`、`iconImageUrl`、`isActive`。
- 多语言名称：`nameZh`、`nameEn`、`nameEs`、`namePt`。
- 多语言描述：`descriptionZh`、`descriptionEn`、`descriptionEs`、`descriptionPt`。
- 自关联：父类目删除时级联子类目。
- 商品关联：类目被商品引用时限制删除；当前后台删除动作实际是停用 `isActive=false`。

### 6.3 Product

商品主体。

- 唯一字段：`slug`、`productCode`。
- 关联：必须挂载一个 Category。
- 展示字段：`priceUsd`、`coverImageUrl`、`isRecommended`、`sortOrder`。
- 发布字段：`status`、`publishedAt`。
- 多语言字段：名称、简介、详情各 4 种语言。
- 前台只展示 `status=published` 的商品。

### 6.4 ProductImage

商品图库图片。

- 关联 Product。
- 字段：`imageUrl`、`altText`、`sortOrder`。
- 商品删除时级联删除。
- 更新商品表单时会先删除该商品所有图库，再按表单顺序重建。

### 6.5 Banner

首页展示素材。

- 字段：`imageUrl`、`targetType`、`targetId`、`targetUrl`、`sortOrder`、`isActive`。
- `targetType` 可为 `category`、`product`、`url`。
- 当前有 Banner actions 和模型，但后台 Banner 管理页面当前不存在。

### 6.6 Message

公开联系表单留言。

- 字段：`name`、`email`、`content`。
- 状态：`new`、`processed`。
- `processedAt` 记录处理时间。

### 6.7 Subscriber

邮件订阅者。

- `email` 唯一。
- 状态：`active`、`unsubscribed`。
- `source` 记录来源，例如 `storefront`。
- 订阅接口使用 upsert，重复订阅会重新激活。

## 7. 前台功能

### 7.1 全局布局

`/[locale]/layout.tsx` 负责前台通用外壳：

- 校验 locale，不合法则 404。
- 读取当前语言消息文件。
- 查询启用类目树，用于 Header 导航。
- 渲染 `StorefrontHeader`、主内容、浮动 WhatsApp 按钮、`StorefrontFooter`。
- WhatsApp 号码来自 `WHATSAPP_NUMBER`，缺省为 `15551234567`。

### 7.2 Header 导航

前台 Header 当前以类目作为主导航：

- 桌面端显示一级类目导航。
- 鼠标悬停或键盘聚焦时展开 mega menu。
- mega menu 优先展示子类目，若无子类目则展示当前类目本身。
- 移动端用折叠菜单展示类目链接和联系邮箱。
- 语言切换器会替换当前 URL 的 locale 段。
- 右侧提供邮箱入口和 WhatsApp 入口。

### 7.3 首页 `/{locale}`

首页由以下模块组成：

- Hero Banner：实际优先使用启用类目的图片生成 banner；只有没有类目图片时才使用 Banner 表数据。
- 分类网格：展示最多 4 个 featured categories。
- 产品图片矩阵：展示最多 5 个推荐商品。
- Social Showcase：静态社交媒体展示模块。

首页数据来自 `getHomepagePayload(locale)`：

- 查询启用 Banner。
- 查询类目并构建前台类目树。
- 查询 `status=published` 且 `isRecommended=true` 的商品。
- Banner 若指向 category，会尝试用目标类目或其后代类目的本地图片替换 banner 图片。

### 7.4 商品列表 `/{locale}/products`

支持 query 参数：

- `search`：按商品编码和四种语言名称模糊搜索。
- `category`：按类目 slug 筛选。
- `subcategory`：若存在，优先于 `category`。
- `recommended=1`：只看推荐商品。
- `sort`：`featured`、`price-asc`、`price-desc`、`name-asc`。

当前页面视觉上是纯商品网格，不展示筛选侧栏和排序控件，但参数会传入查询层并影响结果。

### 7.5 分类页 `/{locale}/categories/[slug]`

分类页按 slug 展示某个类目或子类目的商品：

- 左侧保留筛选组件，但隐藏类目选择。
- 顶部结果工具条展示分类名称、描述和排序控件。
- 商品网格展示匹配当前类目或父类目的已发布商品。

### 7.6 商品详情 `/{locale}/products/[slug]`

商品详情只允许访问已发布商品：

- 未找到或非 published 商品返回 404。
- 左侧展示图片图库，图库为空时回退封面图。
- 右侧展示分类、商品名称、简介、详情。
- 操作区提供 WhatsApp 咨询链接和订阅入口。
- WhatsApp 链接会把商品名称作为预填文本。

### 7.7 联系页 `/{locale}/contact`

功能：

- 展示支持邮箱和 WhatsApp 入口。
- `ContactForm` 提交 JSON 到 `POST /api/contact`。
- 成功后展示成功文案并重置表单。

后端校验：

- `name` 必填。
- `email` 必须为合法邮箱。
- `content` 必填。
- 写入 Message 表。

### 7.8 订阅页 `/{locale}/subscribe`

功能：

- `SubscribeForm` 提交 JSON 到 `POST /api/subscribe`。
- 默认 source 为 `storefront`。
- 成功后展示成功文案并重置表单。

后端行为：

- 按邮箱 upsert。
- 已存在邮箱会更新为 `active`，并更新 source。

### 7.9 Portal 页 `/{locale}/portal`

当前是支持入口页：

- 展示支持邮箱。
- 提供产品、联系、订阅、WhatsApp 信息卡。
- 提供返回首页和联系入口。

## 8. 后台鉴权

### 8.1 登录

路由：`/admin/login`。

流程：

- 用户输入 username/password。
- `POST /api/admin/login` 查询 Admin 表。
- 使用 bcrypt 校验密码。
- 成功后设置 `ADMIN_SESSION` Cookie。
- 登录表单成功后跳转 `/admin/analytics`。

### 8.2 Session Cookie

Cookie 设计：

- payload 是 base64url 编码 JSON，包含 `adminId` 和 `username`。
- signature 使用 HMAC-SHA256。
- HMAC secret 由 `ADMIN_PASSWORD` 和 `DATABASE_URL` 派生。
- Cookie 属性：`httpOnly`、`sameSite=lax`、`path=/`、`maxAge=ADMIN_SESSION_MAX_AGE`。
- HTTP 登录请求不会强制设置 Secure，HTTPS 请求会设置 Secure。

### 8.3 保护策略

- Middleware 对 `/admin` 和 `/admin/*` 检查 Cookie 是否存在；不存在则跳转 `/admin/login`。
- 受保护后台布局调用 `requireAdminSession()`，会校验 Cookie 签名、查询 Admin 表并比对 username。
- API 路由默认绕过 middleware，因此需要 route handler 自己调用鉴权。
- 当前上传 API 已调用 `requireAdminSession()`。
- 当前 `/api/admin/messages/[id]/process` 未显式鉴权，这是现有安全缺口。

## 9. 后台功能

### 9.1 后台布局

受保护布局 `/admin/(protected)/layout.tsx`：

- 左侧固定导航。
- 顶部 Header 显示语言切换、通知图标、帮助图标、管理员身份和退出入口。
- 导航项：数据分析、商品管理、邮件订阅、支持中心、系统设置。
- `/admin` 页面重定向到 `/admin/products`。

### 9.2 数据分析 `/admin/analytics`

当前为展示型工作台：

- 展示总 PV、总商品数量、页面访问成功率。
- 展示热门产品排名。
- 提供本地状态的 AI 数据分析助手输入框。

当前限制：

- 指标和产品排行是组件内静态数据。
- AI 对话只把用户输入追加到本地消息列表，没有后端或 LLM 调用。

### 9.3 商品管理 `/admin/products`

这是当前后台最完整的核心模块，由 `ProductCenter` 承载。

#### 页面数据

服务端读取：

- `getAdminProductList({})` 获取商品、类目和图库。
- `getAdminCategoryTree()` 获取类目树。

映射逻辑：

- 只把 `isActive=true` 类目展示在左侧类目列表。
- 商品图片路径必须是本地路径，否则展示为空。
- 商品按英文名、中文名、slug、productCode 排序。

#### 商品列表能力

- 搜索：按商品中文名、英文名、西语名、葡语名、SKU、类目名、slug 在前端过滤。
- 状态筛选：全部商品、待审核队列、推荐商品。
- 类目筛选：点击左侧类目筛选商品。
- 分页：默认每页 8 条。
- 固定表格布局：表头 sticky，列表区域滚动。
- 批量选择：支持当前页全选、单个选择。
- 批量操作：设为推荐、取消推荐、归档。
- 单商品操作菜单：预览前台、归档商品。
- CSV 导出：在浏览器生成当前过滤结果的 `products.csv`。

#### 商品新增/编辑抽屉

点击新增商品或商品名称打开右侧抽屉。

字段：

- 媒体：封面主图、图库图片。
- 基础信息：商品编码、slug、类别、价格 USD、排序、状态。
- 状态：`draft`、`pending`、`published`、`archived`。
- 推荐商品：布尔值。
- 多语言内容：四种语言的名称、简介、详情。

保存行为：

- 新增调用 `createProductFormAction`。
- 编辑调用 `updateProductFormAction(id)`。
- 保存成功后刷新路由并关闭抽屉。
- 编辑保存后会先更新当前前端行的封面和图库，减少刷新前的视觉滞后。
- 图库上传未完成时禁用保存按钮。

#### 商品 Server Actions

- `createProductDraft(input)`：创建草稿，补空多语言字段。
- `createProductFromForm(formData)`：从完整表单创建商品和图库。
- `updateProductFromForm(id, formData)`：事务更新商品，并重建图库。
- `archiveProductFromListAction(id)`：软归档商品，设置 `status=archived`。
- `bulkUpdateProductsFromListAction(ids, operation)`：批量推荐、取消推荐或归档。
- `publishProduct(id)`：发布前检查必填字段和类目存在性，失败时抛出 blockers。

发布校验字段：

- `categoryId`。
- `productCode`。
- `priceUsd` 必须为正数。
- `coverImageUrl`。
- 四种语言的 name、intro、detail。

#### 图片约束

- 商品封面和图库路径必须是本地路径，以 `/` 开头且不能是 `//`。
- 远程 URL 会被拒绝保存。
- 图库最多提交 10 张。

### 9.4 类目管理

当前类目维护主要集成在 `/admin/products` 左侧和抽屉中，而不是独立分类页。

能力：

- 新建类目。
- 编辑类目。
- 设置父级类目。
- 维护 slug、排序、类目主图、启用状态。
- 维护四种语言名称和描述。
- 删除按钮实际执行停用，将 `isActive` 设置为 false。
- 保存后 revalidate `/admin/products` 和 `/admin/categories`。

当前 `/admin/categories` 页面实际是系统设置页面，不再是类目 CRUD 页面。

### 9.5 商品独立表单页面

仍存在两个独立页面：

- `/admin/products/new`。
- `/admin/products/[id]`。

它们使用 `ProductForm`：

- 按卡片分组展示基础信息、多语言内容、媒体和审核提示。
- 支持创建和编辑商品。
- 上传控件复用后台图片上传 API。

当前主流程更偏向 `/admin/products` 的抽屉式编辑，但独立页面仍可作为备用入口或深链能力。

### 9.6 邮件订阅 `/admin/subscribers`

当前为展示型工作台：

- 左侧 tab：自动化发送规则、邮件模板管理、订阅者列表。
- 自动化规则：展示触发条件、频率上限和当前队列。
- 模板管理：可在本地状态编辑主题和正文。
- 订阅者列表：搜索、分页、状态展示。

当前限制：

- 页面使用 mock subscribers。
- 自动化规则和模板编辑未落库。
- 未直接读取 Subscriber 表。
- 公开订阅 API 已经会写 Subscriber 表，但后台页面未接入该真实数据。

### 9.7 支持中心 `/admin/messages`

当前为展示型留言清单：

- 展示总留言、待处理、已处理统计。
- 每页 5 条分页。
- 列表展示客户姓名、邮箱、内容、时间、状态。

当前限制：

- 页面使用组件内 mockMessages。
- 未直接读取 Message 表。
- 已存在 `markMessageProcessed(id)` 和 `/api/admin/messages/[id]/process`，但页面未接入真实处理动作。

### 9.8 系统设置 `/admin/categories`

当前页面是只读配置工作台：

- 邮箱配置：发件邮箱、SMTP 主机、端口、用户名、发送服务状态。
- 数据库配置：数据库类型、连接地址配置状态、连接状态。
- 本地存储路径：上传根路径、商品图片、分类图片、Banner 图片路径。
- 大模型相关配置：服务商、模型、API 地址、OPENAI_API_KEY 配置状态。

敏感信息策略：

- 数据库连接串不展示明文，只展示“已配置”。
- API key 不展示明文，只展示是否配置。

### 9.9 抓取任务 `/admin/crawl-tasks`

当前路由存在，但不在主导航中。

功能：

- 展示抓取系统配置表单壳。
- 展示源站任务配置和状态。

当前限制：

- 数据来自 `mockBackoffice.crawlTasks`。
- 没有真实抓取任务 API 或持久化。

## 10. API 规格

### 10.1 `POST /api/contact`

公开 API。

请求 JSON：

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "content": "Need a quote"
}
```

成功响应：

```json
{
  "ok": true,
  "id": "message-id"
}
```

行为：校验后写入 Message 表。

### 10.2 `POST /api/subscribe`

公开 API。

请求 JSON：

```json
{
  "email": "buyer@example.com",
  "source": "storefront"
}
```

成功响应：

```json
{
  "ok": true,
  "id": "subscriber-id"
}
```

行为：按 email upsert Subscriber。

### 10.3 `POST /api/admin/login`

公开登录 API。

请求 JSON：

```json
{
  "username": "admin",
  "password": "ChangeMe123!"
}
```

响应：

- `200 { "ok": true }`：登录成功，并设置 session cookie。
- `401 { "error": "INVALID_CREDENTIALS" }`：用户名或密码错误。
- `400 { "error": "INVALID_REQUEST" }`：请求体不合法。
- `500 { "error": "INTERNAL_ERROR" }`：内部异常。

### 10.4 `POST /api/admin/logout`

清空后台 session cookie。

成功响应：

```json
{
  "ok": true
}
```

### 10.5 `POST /api/admin/uploads/product-images`

后台图片上传 API。虽然路径名包含 product-images，但 scope 支持 product、category、banner。

鉴权：需要有效管理员 session。

请求：`multipart/form-data`。

- `file`：图片文件。
- `scope`：`product`、`category`、`banner`，缺省为 `product`。

限制：

- 文件不能为空。
- 单文件最大 5 MB。
- MIME 支持 `image/jpeg`、`image/png`、`image/webp`、`image/gif`。

保存路径：

- 商品：`/public/uploads/products/{year}/{month}/{uuid}.{ext}`。
- 类目：`/public/uploads/categories/{year}/{month}/{uuid}.{ext}`。
- Banner：`/public/uploads/banners/{year}/{month}/{uuid}.{ext}`。

成功响应：

```json
{
  "url": "/uploads/products/2026/05/uuid.png"
}
```

错误：

- `401 UNAUTHORIZED`。
- `400 MISSING_FILE`。
- `400 FILE_TOO_LARGE`。
- `400 UNSUPPORTED_FILE_TYPE`。
- `500 UPLOAD_FAILED`。

### 10.6 `GET /uploads/[...path]`

公开读取上传文件。

安全策略：

- 只允许读取 `public/uploads` 下文件。
- 对路径段 decode 后拒绝空段、`.`、`..`、包含 `/` 或 `\` 的段。
- resolve 后必须仍位于 uploads 根目录下。
- 不存在、目录、非法路径均返回 404。
- 设置 `cache-control: public, max-age=31536000, immutable`。

### 10.7 `POST /api/admin/messages/[id]/process`

当前行为：

- 调用 `markMessageProcessed(id)`。
- 将 Message 状态更新为 `processed` 并写入 `processedAt`。

当前缺口：

- API 未调用 `requireAdminSession()`。
- 因 `/api` 路径被 middleware 跳过，该接口当前缺少显式鉴权。

## 11. 图片和静态资源设计

### 11.1 图片来源

- 内置展示图：`public/show`。
- 后台上传图：`public/uploads`。
- Logo：`public/logo.jpg`。

### 11.2 本地图片路径策略

系统明确拒绝远程图片 URL 进入商品和类目保存流程：

- `getLocalImagePath(value)`：只接受以 `/` 开头且不是 `//` 的路径。
- `requireLocalImagePath(value, key)`：非法时抛出 `INVALID_LOCAL_{key}`。

影响：

- 前台映射商品/类目时，远程 URL 会被清空。
- 后台保存商品封面、图库和类目主图时，远程 URL 会抛错。
- Banner 表单 actions 当前没有同等本地路径强校验。

### 11.3 上传交互

后台上传控件行为：

- 上传前前端校验 MIME 和大小。
- 支持本地 blob 预览。
- 上传成功后把返回 URL 写入隐藏 input 或文本框。
- 商品图库上传中时禁用商品保存。
- 图库最多 10 张，提交值以换行分隔。

## 12. 查询与业务规则

### 12.1 前台类目树

查询所有类目后：

- 仅保留 `isActive=true` 类目。
- 若父类目 inactive，而子类目 active，子类目会提升为前台根类目。
- 根类目 children 只包含 active 子类目。

### 12.2 首页推荐商品

首页只查询：

- `status=published`。
- `isRecommended=true`。

排序：

1. `sortOrder` 升序。
2. `publishedAt` 降序。

### 12.3 商品列表筛选

前台商品列表只查询 `status=published`。

过滤：

- recommended：`isRecommended=true`。
- search：匹配 `productCode` 或四种语言名称。
- categorySlug：匹配商品类目 slug 或父类目 slug。

排序：

- featured：沿用数据库查询顺序。
- price-asc：价格升序。
- price-desc：价格降序。
- name-asc：当前 locale 下名称升序，使用 localeCompare。

### 12.4 后台商品列表

后台商品列表查询支持：

- status。
- categoryId。
- search：匹配 `productCode`、`nameZh`、`nameEn`。

默认排序：`updatedAt` 降序。进入 ProductCenter 后前端再按名称排序。

## 13. 环境变量

必须项：

- `DATABASE_URL`。
- `ADMIN_USERNAME`。
- `ADMIN_PASSWORD`。
- `WHATSAPP_NUMBER`。

可选项：

- `COOKIE_SECURE=false`：覆盖生产环境 Secure Cookie 默认策略。
- `SMTP_HOST`、`SMTP_USER`、`SMTP_PORT`、`MAIL_FROM`：系统设置页读取。
- `LLM_PROVIDER`、`LLM_MODEL`、`OPENAI_BASE_URL`、`OPENAI_API_KEY`：系统设置页读取。

环境变量通过 zod 校验，`NODE_ENV` 默认为 `development`。

## 14. Seed 数据

`prisma/seed.ts` 会先清空：

- Admin。
- Category。
- Product。
- ProductImage。
- Banner。
- Message。
- Subscriber。

随后创建 Admin、Category、Product、ProductImage 和 Banner 初始数据。Message 与 Subscriber 表当前只清空，不写入示例数据。

初始类目包括：

- 擦窗机器人。
- 无人机。
- 人形机器人。
- 扫地机器人。

初始商品包括：

- Sky Cleaner Pro。
- ClearGlass Max。
- Aerial X1。
- SurveyDrone T20。
- Alpha Humanoid。
- EduBot Mini。
- SweepMaster S8。
- WashVac Pro。
- WindowBot Lite 草稿商品。

初始 Banner 指向若干类目。

注意：seed 中定义了子类目结构，但当前实现只创建了顶层类目，子类目数组未实际写入数据库。

## 15. 部署设计

### 15.1 本地脚本

主要 npm scripts：

- `npm run dev`：Next 开发服务器。
- `npm run build`：生产构建。
- `npm run start`：启动生产服务器。
- `npm run lint`：ESLint。
- `npm test`：Vitest。
- `npm run test:e2e`：Playwright。
- `npm run prisma:generate`。
- `npm run prisma:seed`。

### 15.2 生产部署脚本

`deploy.sh` 执行：

1. 检查 node、npm、psql、nginx、pm2、curl。
2. 检查 Node.js >= 18。
3. 准备 `.env`。
4. 解析 PostgreSQL 连接并确保数据库存在。
5. `npm ci`。
6. `npx prisma generate`。
7. 有 migrations 则 `prisma migrate deploy`，否则 `prisma db push --accept-data-loss`。
8. `prisma db seed`。
9. `npm run build`。
10. 使用 PM2 启动或重启应用。
11. 写入 Nginx 反代配置到 3000 端口。
12. 配置 `/show/` alias。
13. curl 验证首页和静态图片。

### 15.3 PM2

`ecosystem.config.js`：

- app 名称：`cross`。
- 命令：`npm run start`。
- `NODE_ENV=production`。
- `HOSTNAME=0.0.0.0`。
- `PORT=3000`。
- 日志写入 `logs`。
- 单实例 fork 模式。

## 16. 测试覆盖

### 16.1 单元测试

覆盖点包括：

- 商品中心筛选、分页、抽屉、批量操作、图库隐藏值、保存状态。
- 上传规则和错误文案。
- 发布前必填字段校验。
- 本地图片路径约束。
- 国际化配置。
- 前台布局、首页模块、商品卡、Banner、订阅/联系表单。
- 后台布局、系统设置、商品审核表格等组件。

### 16.2 集成测试

覆盖点包括：

- 前台首页、商品列表、详情页、联系页、订阅页、Portal 页渲染。
- catalog 查询映射、类目树构建、排序、Banner 图片替换。
- 后台登录、Cookie、匿名跳转。
- 后台 Server Actions：商品、类目、Banner、留言处理。
- 上传 API 鉴权、类型、落盘路径。
- 上传读取路由的安全路径检查。
- 后台页面渲染。

### 16.3 E2E 测试

覆盖点包括：

- 前台 locale 跳转、产品列表、语言切换。
- 桌面类目 mega menu hover 交互。
- 后台登录。
- 后台产品新增抽屉。
- 系统设置 tab 切换。
- 商品图库上传预览、错误、保存后重开保持图片。

## 17. 当前能力状态矩阵

| 模块 | 状态 | 说明 |
| --- | --- | --- |
| 前台多语言路由 | 已落地 | Locale 前缀、消息文件、语言切换均已实现。 |
| 前台商品目录 | 已落地 | 从 Product/Category 查询 published 商品。 |
| 商品详情 | 已落地 | 仅 published 可访问，支持图库和 WhatsApp。 |
| 联系表单 | 已落地 | 写入 Message 表。 |
| 订阅表单 | 已落地 | upsert Subscriber。 |
| 后台登录 | 已落地 | bcrypt + HMAC Cookie。 |
| 商品 CRUD | 已落地 | 后台产品中心和独立表单均可写 Product。 |
| 类目 CRUD | 已落地 | 产品中心内抽屉维护，删除为停用。 |
| 图片上传 | 已落地 | 本地文件系统存储，支持 product/category/banner scope。 |
| Banner 管理 | 部分落地 | 模型和 actions 存在，后台页面当前不存在。 |
| 后台订阅者 | 展示型 | 页面使用 mock，本地模板状态未落库。 |
| 后台留言 | 展示型 | 页面使用 mock，处理 API 存在但未接入页面。 |
| 数据分析 | 展示型 | 静态指标和本地 AI 输入框。 |
| 抓取任务 | 展示型 | mock 配置展示，无任务后端。 |
| 系统设置 | 展示型 | 只读展示环境配置状态。 |

## 18. 已知风险和待完善项

- `/api/admin/messages/[id]/process` 需要补充后台鉴权。
- `/admin/messages` 应接入 Message 表，并提供真实处理动作。
- `/admin/subscribers` 应接入 Subscriber 表，模板和自动化规则如需保留应新增数据模型。
- Banner 管理如仍需要，应恢复或重建 `/admin/banners` 页面，并统一图片路径校验。
- `/admin/categories` 当前是系统设置页，命名和导航文案可考虑改为 `/admin/settings`，减少和类目管理混淆。
- `prisma/seed.ts` 定义了子类目但未实际创建 children，应修复 seed 或删除未使用结构。
- 商品发布流程当前既有 `publishProduct()` 校验，也允许后台表单直接选择 `published` 状态。若需要严格审核，应把“发布”收敛到单一受校验动作。
- Contact 和 Subscribe API 当前直接 `parse`，zod 错误未转换成统一 400 JSON 错误响应。
- 远程图片策略对商品/类目严格，但 Banner actions 仍可保存任意 imageUrl，规则不一致。
- 生产部署脚本在无 migrations 时使用 `db push --accept-data-loss`，正式生产需要谨慎使用迁移流程。
