# 商品与分类真实数据管理设计

日期：2026-05-11

## 背景

当前项目已经有 Prisma `Category`、`Product`、`ProductImage` 数据模型，也有前台 catalog 查询从数据库读取已发布商品和启用分类。但后台 `/admin/products` 仍使用 `mockBackoffice.products`，页面内也硬编码了与机器人业务不一致的类目；`/admin/categories` 的表单仍是静态原型，不能真正保存分类。

本次目标是把后台商品管理和类别管理接入真实数据库，并确保前台首页、商品列表、分类页展示的分类与商品内容和后台设置保持一致。

## 范围

- 后台商品管理页读取真实商品列表和分类树，不再使用 mock 数据。
- 后台类别管理页支持创建与更新分类。
- 商品新增与编辑继续复用现有 `/admin/products/new` 和 `/admin/products/[id]` 表单。
- 默认种子数据聚焦四个一级类别：人形机器人、无人机、扫地机器人、擦窗机器人。
- 前台继续通过现有 catalog queries 读取数据库，不引入单独假数据层。

## 非目标

- 不新增订单、购物车、支付、会员体系。
- 不重写后台整体布局。
- 不引入复杂多角色审核流。
- 不实现拖拽排序或高级媒体库。

## 方案

采用保守的现有模型复用方案。

后台商品中心新增一个面向 UI 的数据映射层，把 `getAdminProductList()` 和 `getAdminCategoryTree()` 返回的数据转换为 `ProductCenter` 需要的结构。`ProductCenter` 改为接受真实分类和商品行数据，类目列表、数量、选中状态、商品表格、编辑入口都来自数据库。

分类管理复用 `Category` 模型和 `createCategory`、`updateCategory` action，补齐表单字段：父级分类、slug、排序、图标 URL、启用状态、四语名称与描述。列表展示真实分类树，并提供每个分类的编辑表单入口。

商品管理保持现有新增/编辑表单作为写入路径。商品中心的“新增商品”和“编辑商品”跳转到现有路由，避免在抽屉里重复实现一套保存逻辑。

## 数据一致性

前台首页、商品列表、商品详情和分类页继续依赖 `getHomepagePayload()`、`getProductListPayload()`、`getProductDetailBySlug()` 和 `getStorefrontCategoryGroups()`。这些查询只读取数据库中的启用分类和已发布商品，因此后台保存并发布后，前台展示自然同步。

默认种子数据调整为四个一级分类：

- `humanoid-robots`：人形机器人
- `drones`：无人机
- `robot-vacuums`：扫地机器人
- `window-cleaning-robots`：擦窗机器人

如需二级分类，后续可由后台分类管理继续新增，不影响前台查询。

## 错误处理

- 分类 slug 为空或四语名称缺失时由 server action 抛出稳定错误。
- 商品发布仍沿用现有 publish blockers。
- 商品或分类为空时后台页面显示空态和新增入口，而不是回退 mock 数据。

## 测试

- 后台商品页测试断言页面调用真实查询并渲染机器人分类与商品。
- `ProductCenter` 单元测试断言不再出现智能穿戴等硬编码类目，新增/编辑入口指向真实路由。
- 分类 action 测试覆盖从表单创建和更新分类。
- 分类页测试断言渲染真实分类树和可提交表单。
- catalog query 既有测试继续保证前台按数据库映射本地化内容。
