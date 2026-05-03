# 管理页面按参考稿对齐的企业化重构设计文档

## 1. 背景

当前项目的 `admin` 后台已经具备基本页面与数据入口，包括：

- 商品中心
- 抓取任务
- 订阅与通知
- 客户留言
- AI 数据分析
- 分类管理
- Banner 管理
- 新建商品
- 编辑商品

但当前后台仍然保留明显的 demo 化与过渡态特征：

- UI 风格与用户提供的参考设计稿差异较大
- 页面布局、壳层结构、卡片节奏、表格密度不统一
- 现有后台仍带有暖色调与品牌化表达，不符合本次目标
- 各页面虽然可用，但整体看起来不像同一套成熟企业后台

本轮目标不是继续优化现有风格，而是把当前管理页面整体重构为与参考稿高度一致的企业化后台。

## 2. 已确认约束

本轮设计已经与用户确认以下前提：

- 设计严格参考用户提供的设计文件
- 不做自由发挥，不额外扩展信息架构
- UI、布局、页面整体风格都与设计稿保持一致
- 现有所有 `admin` 页面都纳入本轮重构范围
- 参考稿中没有完全一一对应的页面，也要套用最接近的参考页骨架

换句话说，本轮目标不是“借鉴参考稿”，而是“让现有后台成为参考稿体系下的落地版本”。

## 3. 参考设计来源

本次重构直接参考以下设计文件：

- `docs/superpowers/stitch_lumina_ai_image_studio 2 copy/_1/code.html`
- `docs/superpowers/stitch_lumina_ai_image_studio 2 copy/_2/code.html`
- `docs/superpowers/stitch_lumina_ai_image_studio 2 copy/_3/code.html`
- `docs/superpowers/stitch_lumina_ai_image_studio 2 copy/_4/code.html`
- `docs/superpowers/stitch_lumina_ai_image_studio 2 copy/ai/code.html`
- `docs/superpowers/stitch_lumina_ai_image_studio 2 copy/enterprise_operational_logic/DESIGN.md`

这些文件共同定义了本轮后台应遵循的：

- 侧栏与顶部栏结构
- 企业化页面密度与布局节奏
- 卡片、表格、表单、状态标签样式
- 颜色、字号、边框、圆角、留白规则

## 4. 设计目标

本轮设计目标只有一个主方向：

- 让现有管理页面在视觉、布局、信息组织和交互表达上都与参考稿保持一致

具体成功标准如下：

- 任意 `admin` 页面打开后，第一眼风格明显属于参考稿体系
- 深色侧栏、白色顶栏、浅灰工作区成为统一后台壳层
- 所有核心页面都能明确对应到参考稿中的页面类型
- 没有继续保留现有暖色化 demo 语言
- 现有数据入口、页面职责和路由仍然可用

## 5. 总体设计结论

本次采用的不是“在现有后台上做美化”，而是“以参考稿为标准，对现有后台逐页重构”。

核心结论如下：

- 先统一后台公共壳层
- 再让每个现有页面映射到最接近的参考页
- 页面中保留原有业务职责和数据入口
- 页面外观、布局和模块结构以参考稿为准

不采用的方式包括：

- 保留现有暖色品牌风格再做融合
- 在参考稿基础上继续自定义新的信息架构
- 为没有直接对应关系的页面再发明一套新的页面类型

原因如下：

- 用户明确要求与参考稿保持一致
- 继续折中会让结果偏离“严格对齐参考稿”的目标
- 新设计扩展会增加实现不确定性，也不符合本轮确认边界

## 6. 公共壳层设计

### 6.1 整体壳层

后台整体壳层以参考稿为准，统一采用：

- 深色固定左侧导航
- 白色固定顶部工具栏
- 浅灰主工作区背景
- 白色内容卡片
- 低对比边框分层

这意味着现有后台的暖色背景、品牌感 Hero、浅金棕强调色都不再保留。

### 6.2 左侧导航

左侧导航严格参考稿的企业化侧栏模式：

- 深蓝背景
- 白色后台标题
- 13px 左右的高密度导航文案
- 当前项使用深色高亮底与绿色左边条
- 底部保留文档、系统状态与管理员信息区

导航命名以参考稿现成标签优先：

- 数据分析
- 商品审核
- 邮件
- 支持中心
- 系统设置

现有页面如果没有完全一一对应，仍归入最接近的导航语义下。

### 6.3 顶部工具栏

顶部工具栏严格参考稿：

- 左侧为系统级标题与搜索框
- 右侧为通知、语言、帮助、快捷操作按钮
- 采用白底、浅边框、紧凑高度

顶部栏承担全局操作与系统上下文，不再承担现有项目里偏展示型的品牌说明职责。

## 7. 视觉规则

### 7.1 色彩

色彩直接沿用参考稿与 `DESIGN.md` 中的企业后台规则：

- 侧栏使用深蓝与 Slate 系颜色
- 主工作区使用浅灰背景
- 卡片使用白底 + 灰色边框
- 主操作使用绿色
- 状态色遵循绿色、灰色、蓝色、红色的克制表达

### 7.2 字体与密度

字体统一使用 `Inter`。

页面信息密度按参考稿执行：

- 正文以 13px 到 14px 为主
- 标题使用 18px 到 24px 的压缩级差
- 表格、标签、导航等都使用偏高密度的企业后台节奏

### 7.3 卡片与边框

容器视觉统一为：

- 白色背景
- 1px 灰色边框
- 轻量圆角
- 少阴影或极弱阴影
- 模块之间靠边框、底色和结构分层，而不是靠装饰性视觉

### 7.4 按钮与状态标签

按钮以参考稿为准：

- 主按钮：绿色实底
- 次按钮：白底 + 灰边
- 操作按钮高度紧凑
- 图标与文字并列时保持企业后台密度

状态标签以参考稿风格统一：

- 胶囊型或紧凑标签
- 低饱和底色 + 高可读文字
- 不再保留当前项目偏演示型的状态样式

## 8. 页面映射策略

### 8.1 数据分析

`src/app/admin/(protected)/analytics/page.tsx`

严格套用 `ai/code.html` 的 `数据分析` 页结构。

该页面作为现有分析数据与洞察的展示页，主要采用：

- 顶部时间范围与导出操作
- KPI 指标卡
- 漏斗或分析主图区
- 类别排名或统计表
- 右侧 AI 洞察面板

页面标题、模块顺序与整体气质都以参考稿为准。

### 8.2 商品审核

`src/app/admin/(protected)/products/page.tsx`

严格套用 `_2/code.html` 的 `商品审核` 页结构。

页面需要保持以下语义不变：

- 自动抓取商品与手动导入商品进入同一审核工作区
- 支持多语言内容审核
- 支持通过或拒绝

但 UI、布局与模块组织要完全贴近参考稿：

- 左侧手动导入与来源监控区
- 主商品审核表格
- 多语言审核与操作面板

### 8.3 邮件

`src/app/admin/(protected)/subscribers/page.tsx`

严格套用 `_3/code.html` 的 `邮件` 页结构。

该页仍承载订阅与通知管理职责，但表现形式变为参考稿里的邮件控制台：

- 订阅统计指标
- 自动化发送规则
- 辅助说明区
- 订阅者表格

原有订阅与通知数据改填入参考稿结构中。

### 8.4 支持中心

`src/app/admin/(protected)/messages/page.tsx`

严格套用 `_1/code.html` 的 `支持中心` 页结构。

该页仍处理客户消息，但整体表现改为：

- 待处理收件箱
- 回复界面
- 系统活动日志
- 右侧辅助内容

即由当前留言列表页升级为参考稿式客服工作台。

### 8.5 系统设置类页面

以下页面都套用 `_4/code.html` 的 `系统设置 / 配置面板` 骨架：

- `crawl-tasks`
- `categories`
- `banners`
- `products/new`
- `products/[id]`

这些页面不再各自维持不同的布局逻辑，而统一采用参考稿里的配置页结构：

- 明确页头
- 分组式卡片区域
- 高密度表单
- 表格或说明区块
- 底部操作按钮

具体映射原则如下：

- `crawl-tasks`：视为抓取系统配置与源站任务配置页
- `categories`：视为分类结构与映射配置页
- `banners`：视为展示素材配置页
- `products/new`：视为新建配置与内容录入页
- `products/[id]`：视为编辑配置与复审页

虽然这些页面的业务内容不同，但视觉壳层和结构模板必须来自同一参考页。

## 9. 内容保留与替换规则

### 9.1 保留内容

以下内容保留：

- 现有 admin 路由
- 现有数据获取入口
- 现有页面职责
- 现有 mock 数据与数据库查询来源

### 9.2 替换内容

以下内容整体替换：

- 当前页头结构
- 当前导航风格
- 当前卡片和表格视觉
- 当前表单布局与操作区
- 当前暖色化展示风格
- 当前 demo 化摘要模块和品牌化装饰结构

### 9.3 新增内容的边界

允许新增公共组件和必要占位模块，但新增内容必须满足两个条件：

- 服务于参考稿复刻
- 不改变当前业务边界

不允许为了“设计更完整”而新增一套用户未确认的新功能路径。

## 10. 受影响文件

### 10.1 公共壳层

- `src/app/admin/(protected)/layout.tsx`
- `src/components/admin/admin-nav.tsx`
- `src/components/admin/admin-shell-header.tsx`
- `src/app/globals.css`
- `tailwind.config.ts`

### 10.2 页面入口

- `src/app/admin/(protected)/products/page.tsx`
- `src/app/admin/(protected)/crawl-tasks/page.tsx`
- `src/app/admin/(protected)/subscribers/page.tsx`
- `src/app/admin/(protected)/messages/page.tsx`
- `src/app/admin/(protected)/analytics/page.tsx`
- `src/app/admin/(protected)/categories/page.tsx`
- `src/app/admin/(protected)/banners/page.tsx`
- `src/app/admin/(protected)/products/new/page.tsx`
- `src/app/admin/(protected)/products/[id]/page.tsx`

### 10.3 页面组件

- `src/components/admin/product-center.tsx`
- `src/components/admin/product-review-drawer.tsx`
- `src/components/admin/crawl-task-board.tsx`
- `src/components/admin/subscriber-notification-board.tsx`
- `src/components/admin/message-table.tsx`
- `src/components/admin/analytics-insights-board.tsx`
- `src/components/admin/category-form.tsx`
- `src/components/admin/banner-form.tsx`
- `src/components/admin/product-form.tsx`
- `src/components/admin/status-badge.tsx`
- `src/components/admin/admin-button.tsx`
- `src/components/admin/admin-card.tsx`
- `src/components/admin/admin-table-shell.tsx`

### 10.4 联动测试

- `tests/integration/admin-pages.test.ts`

## 11. 推荐实施顺序

推荐实施顺序如下：

1. 重做公共壳层与基础视觉令牌
2. 重做 `products`
3. 重做 `subscribers`
4. 重做 `messages`
5. 重做 `analytics`
6. 套用配置页骨架改造 `crawl-tasks`
7. 套用配置页骨架改造 `categories`
8. 套用配置页骨架改造 `banners`
9. 套用配置页骨架改造 `products/new`
10. 套用配置页骨架改造 `products/[id]`
11. 更新测试断言与公共组件收口

这个顺序的目标是先让最重要的参考页映射完成，再统一剩余页面。

## 12. 验收标准

当以下条件成立时，本轮设计视为达标：

- 任意 `admin` 页面打开后，UI、布局和整体风格都明显对齐参考稿
- 左侧导航、顶部工具栏、主工作区结构统一
- `products`、`subscribers`、`messages`、`analytics` 明确对应到参考稿页面
- 其他页面虽然内容不同，但都明显复用最接近的参考稿骨架
- 不再残留当前项目的暖色 demo 风格主基调
- 页面职责、路由和数据入口仍保持可用
- 联动测试能够根据新文案和新结构更新通过

## 13. 明确不做

本轮不涉及：

- 新的真实业务能力扩展
- 新的权限系统设计
- 真实 AI 分析能力补全
- 真实邮件发送与消息编排
- 抓取系统后端重写
- 超出参考稿范围的新后台页面类型设计

本轮只做一件事：

- 按参考稿把现有管理页面重构成一套企业化后台前端
