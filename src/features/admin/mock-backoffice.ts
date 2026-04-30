export const mockBackoffice = {
  dashboard: {
    heroTitle: '先处理待审核商品，再回看通知和数据',
    heroSummary:
      '首页先展示待审核、抓取异常、通知状态和 AI 提示，帮助单人运营明确今天先处理什么。',
    quickActions: ['新建商品', '发起抓取', '审核队列', '发送通知', '查看报表'],
    todoItems: [
      { label: '待审核商品', value: 26 },
      { label: '抓取异常', value: 3 },
      { label: '待发送通知', value: 1 },
      { label: 'AI 待确认建议', value: 4 }
    ],
    kpis: [
      { label: '今日新增候选商品', value: '18', detail: '抓取 11 / 手动 7' },
      { label: '已发布商品', value: '286', detail: '本周上新 12' },
      { label: '订阅用户', value: '1,284', detail: '近 7 天新增 63' },
      { label: '新品通知打开率', value: '38%', detail: '较上周 +5.6%' }
    ],
    weeklyLaunches: [4, 6, 3, 8, 7, 9, 6],
    hotCategories: [
      { label: 'Cleaning Robots', share: '28%' },
      { label: 'Industrial Arms', share: '22%' },
      { label: 'Inspection Drones', share: '17%' }
    ]
  },
  products: {
    summary: {
      total: 286,
      pending: 26,
      incomingToday: 18
    },
    rows: [
      {
        id: 'product-1',
        name: 'Portable Cleaning Robot X2',
        productCode: 'RC-1038',
        category: '清洁机器人',
        source: '自动抓取',
        status: '待审核',
        completeness: '82%',
        action: '补图后发布'
      },
      {
        id: 'product-2',
        name: 'Warehouse Drone Mini',
        productCode: 'DR-2041',
        category: '巡检无人机',
        source: '手动导入',
        status: '待审核',
        completeness: '76%',
        action: '补英文标题'
      },
      {
        id: 'product-3',
        name: 'Industrial Arm Pro 8',
        productCode: 'IA-7702',
        category: '工业机械臂',
        source: '自动抓取',
        status: '可发布',
        completeness: '96%',
        action: '加入推荐位'
      }
    ],
    review: {
      title: 'Warehouse Drone Mini',
      source: '手动导入',
      status: '待审核',
      completeness: '76%',
      checks: [
        { label: '标题', value: '完整' },
        { label: '图片', value: '3/5' },
        { label: '英文摘要', value: '缺失' },
        { label: '重复风险', value: '低' }
      ],
      advice:
        '当前商品与已发布商品无明显重复，但缺少英文摘要，不建议直接上架。建议先补齐短描述，再进入可发布状态。'
    }
  },
  crawlTasks: {
    headline: '今天已抓取 11 个候选商品',
    summary:
      '其中 8 个解析完整，3 个需要人工修正图片或分类映射，修复后再进入商品中心审核池。',
    sourceSites: [
      {
        label: 'robotmart.example',
        status: '正常',
        detail: '最近抓取 6 条，封面图和分类映射稳定。'
      },
      {
        label: 'industrial-showcase.example',
        status: '需修复',
        detail: '图片字段结构变化，建议更新解析规则。'
      }
    ]
  },
  subscribers: {
    total: '1,284',
    openRate: '38%',
    failed: '12',
    campaigns: [
      {
        title: 'April New Arrivals',
        status: '待发送',
        detail: '包含 4 个新上架商品，等待确认或自动发送。'
      },
      {
        title: '失败重发',
        status: '12 封',
        detail: '查看失败原因并支持一键重发。'
      }
    ]
  },
  analytics: {
    headline: '本周热门类目更偏便携型设备',
    summary:
      '浏览与点击数据显示，portable / mini / compact 类商品在首页推荐位的点击率提升明显。',
    insights: [
      '热门商品 / 分类排行',
      '用户转化路径',
      '推荐位调整建议'
    ]
  }
} as const;

export type MockBackoffice = typeof mockBackoffice;
