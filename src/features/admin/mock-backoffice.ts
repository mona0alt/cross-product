export const mockBackoffice = {
  dashboard: {
    heroTitle: '先处理待审核商品，再回看通知和数据',
    heroSummary:
      '首页先展示待审核、抓取异常、通知状态和 AI 提示，帮助单人运营明确今天先处理什么。',
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
    ]
  }
} as const;

export type MockBackoffice = typeof mockBackoffice;
