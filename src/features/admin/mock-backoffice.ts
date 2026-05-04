export const mockBackoffice = {
  products: {
    summary: {
      pending: 26,
      todayProcessed: 14
    },
    rows: [
      {
        id: 'product-1',
        name: 'Portable Cleaning Robot X2',
        productCode: 'RC-1038',
        category: '清洁机器人',
        source: '自动抓取',
        status: '补充信息',
        aiScore: 82,
        langCompletion: { en: 'ok', es: 'missing', pt: 'ok' },
        action: '封面图数量不足，建议补 2 张细节图',
        content: {
          zh: { name: 'Portable Cleaning Robot X2', copy: '该清洁机器人采用最先进的导航技术，专为家庭环境设计。' },
          en: { name: 'Portable Cleaning Robot X2', copy: 'This cleaning robot uses advanced navigation technology, designed for home environments.' },
          es: { name: 'Robot de Limpieza Portátil X2', copy: 'Este robot de limpieza utiliza tecnología de navegación avanzada, diseñado para entornos domésticos.' },
          pt: { name: 'Robô de Limpeza Portátil X2', copy: 'Este robô de limpeza utiliza tecnologia de navegação avançada, projetado para ambientes domésticos.' }
        },
        gallery: [
          { id: 'img-1', url: '/products/robot-x2-1.jpg', isPrimary: true },
          { id: 'img-2', url: '/products/robot-x2-2.jpg', isPrimary: false }
        ]
      },
      {
        id: 'product-2',
        name: 'Warehouse Drone Mini',
        productCode: 'DR-2041',
        category: '巡检无人机',
        source: '手动导入',
        status: '待审核',
        aiScore: 76,
        langCompletion: { en: 'missing', es: 'ok', pt: 'missing' },
        action: '缺少英文摘要',
        content: {
          zh: { name: 'Warehouse Drone Mini', copy: '紧凑型仓库巡检无人机，支持自动航线规划。' },
          en: { name: 'Warehouse Drone Mini', copy: '' },
          es: { name: 'Dron de Almacén Mini', copy: 'Dron compacto de inspección de almacén con planificación automática de rutas.' },
          pt: { name: 'Drone de Armazém Mini', copy: '' }
        },
        gallery: [
          { id: 'img-3', url: '/products/drone-mini-1.jpg', isPrimary: true }
        ]
      },
      {
        id: 'product-3',
        name: 'Industrial Arm Pro 8',
        productCode: 'IA-7702',
        category: '工业机械臂',
        source: '自动抓取',
        status: '可发布',
        aiScore: 96,
        langCompletion: { en: 'ok', es: 'ok', pt: 'ok' },
        action: '加入推荐位',
        content: {
          zh: { name: 'Industrial Arm Pro 8', copy: '高精度工业机械臂，适用于精密装配任务。' },
          en: { name: 'Industrial Arm Pro 8', copy: 'High-precision industrial robotic arm for precision assembly tasks.' },
          es: { name: 'Brazo Industrial Pro 8', copy: 'Brazo robótico industrial de alta precisión para tareas de ensamblaje de precisión.' },
          pt: { name: 'Braço Industrial Pro 8', copy: 'Braço robótico industrial de alta precisão para tarefas de montagem de precisão.' }
        },
        gallery: [
          { id: 'img-4', url: '/products/arm-pro8-1.jpg', isPrimary: true },
          { id: 'img-5', url: '/products/arm-pro8-2.jpg', isPrimary: false },
          { id: 'img-6', url: '/products/arm-pro8-3.jpg', isPrimary: false }
        ]
      }
    ],
    createChecklist: [
      { label: '基础信息完整', detail: '标题、分类、SKU 已填写', status: '通过' },
      { label: '图片数量', detail: '当前上传 3 张，建议至少 5 张', status: '待补充' },
      { label: '多语言内容', detail: '英文摘要为空时会进入待补充状态', status: '风险提示' },
      { label: '提交结果', detail: '保存后自动进入审核池，可继续回到审核视图处理', status: '说明' }
    ]
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
