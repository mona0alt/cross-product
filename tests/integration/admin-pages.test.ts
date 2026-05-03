import { renderToStaticMarkup } from 'react-dom/server';
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const getAdminProductList = vi.fn();
const getAdminCategoryTree = vi.fn();
const requireAdminSession = vi.fn();
const bannerFindMany = vi.fn();
const messageFindMany = vi.fn();
const subscriberFindMany = vi.fn();
const productFindUnique = vi.fn();

vi.mock('@/features/catalog/queries', () => ({
  getAdminProductList,
  getAdminCategoryTree
}));

vi.mock('@/lib/auth', async () => {
  const actual = await vi.importActual<typeof import('@/lib/auth')>('@/lib/auth');

  return {
    ...actual,
    requireAdminSession
  };
});

vi.mock('@/lib/db', () => ({
  db: {
    banner: {
      findMany: bannerFindMany
    },
    message: {
      findMany: messageFindMany
    },
    subscriber: {
      findMany: subscriberFindMany
    },
    product: {
      findUnique: productFindUnique
    }
  }
}));

describe('admin pages', () => {
  beforeEach(() => {
    getAdminProductList.mockReset();
    getAdminCategoryTree.mockReset();
    requireAdminSession.mockReset();
    bannerFindMany.mockReset();
    messageFindMany.mockReset();
    subscriberFindMany.mockReset();
    productFindUnique.mockReset();
    requireAdminSession.mockResolvedValue({
      id: 'admin-1',
      username: 'admin'
    });
  });

  it('redirects anonymous visitors away from protected admin routes', async () => {
    const { middleware } = await import('../../middleware');
    const response = middleware(new NextRequest('http://localhost/admin/products'));

    expect(response).toBeDefined();
    if (!response) {
      throw new Error('Expected middleware response');
    }

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('/admin/login');
  });

  it('renders the product center page for authenticated admin', async () => {
    getAdminProductList.mockResolvedValue([
      {
        id: 'product-1',
        productCode: 'P-1001',
        nameZh: '星河 Pro 手机',
        status: 'published',
        isRecommended: true,
        category: {
          nameZh: '电子数码'
        }
      }
    ]);
    getAdminCategoryTree.mockResolvedValue([
      {
        id: 'cat-1',
        slug: 'electronics',
        sortOrder: 1,
        isActive: true,
        nameZh: '电子数码',
        nameEn: 'Electronics',
        nameEs: 'Electronica',
        namePt: 'Eletronicos',
        children: []
      }
    ]);

    const ProductsPage =
      (await import('@/app/admin/(protected)/products/page')).default;
    const html = renderToStaticMarkup(ProductsPage());

    expect(html).toContain('商品审核');
    expect(html).toContain('自动抓取');
    expect(html).toContain('手动导入商品');
    expect(html).toContain('产品审核中心');
  });

  it('renders the manual product creation page with review framing', async () => {
    getAdminCategoryTree.mockResolvedValue([
      {
        id: 'cat-1',
        slug: 'electronics',
        sortOrder: 1,
        isActive: true,
        nameZh: '电子数码',
        nameEn: 'Electronics',
        nameEs: 'Electronica',
        namePt: 'Eletronicos',
        children: []
      }
    ]);

    const NewProductPage =
      (await import('@/app/admin/(protected)/products/new/page')).default;
    const html = renderToStaticMarkup(await NewProductPage());

    expect(html).toContain('系统设置');
    expect(html).toContain('创建后进入审核');
    expect(html).toContain('基础信息');
    expect(html).toContain('图片素材');
    expect(html).toContain('审核提示');

    productFindUnique.mockResolvedValue({
      id: 'product-1',
      categoryId: 'cat-1',
      productCode: 'P-1001',
      slug: 'product-1',
      priceUsd: { toString: () => '199' },
      coverImageUrl: '/cover.jpg',
      status: 'draft',
      isRecommended: false,
      nameZh: '示例商品',
      nameEn: 'Sample Product',
      nameEs: 'Producto',
      namePt: 'Produto',
      introZh: '简介',
      introEn: 'Intro',
      introEs: 'Intro',
      introPt: 'Intro',
      detailZh: '详情',
      detailEn: 'Detail',
      detailEs: 'Detalle',
      detailPt: 'Detalhe',
      images: []
    });

    const EditProductPage =
      (await import('@/app/admin/(protected)/products/[id]/page')).default;
    const editHtml = renderToStaticMarkup(
      await EditProductPage({
        params: Promise.resolve({ id: 'product-1' })
      })
    );

    expect(editHtml).toContain('系统设置');
    expect(editHtml).toContain('编辑后重新进入审核');
  });

  it('renders the messages and subscribers pages', async () => {
    getAdminCategoryTree.mockResolvedValue([
      {
        id: 'cat-1',
        slug: 'electronics',
        sortOrder: 1,
        isActive: true,
        nameZh: '电子数码',
        nameEn: 'Electronics',
        nameEs: 'Electronica',
        namePt: 'Eletronicos',
        children: []
      }
    ]);
    bannerFindMany.mockResolvedValue([
      {
        id: 'banner-1',
        imageUrl: '/banner.jpg',
        targetType: 'product',
        targetId: 'product-1',
        targetUrl: null,
        sortOrder: 1,
        isActive: true
      }
    ]);
    messageFindMany.mockResolvedValue([
      {
        id: 'message-1',
        name: 'Alice',
        email: 'alice@example.com',
        content: 'Need a quote',
        status: 'new',
        createdAt: new Date('2026-04-29T00:00:00.000Z')
      }
    ]);
    subscriberFindMany.mockResolvedValue([
      {
        id: 'subscriber-1',
        email: 'buyer@example.com',
        status: 'active',
        createdAt: new Date('2026-04-29T00:00:00.000Z')
      }
    ]);

    const MessagesPage =
      (await import('@/app/admin/(protected)/messages/page')).default;
    const SubscribersPage =
      (await import('@/app/admin/(protected)/subscribers/page')).default;
    const CrawlTasksPage =
      (await import('@/app/admin/(protected)/crawl-tasks/page')).default;
    const AnalyticsPage =
      (await import('@/app/admin/(protected)/analytics/page')).default;
    const CategoriesPage =
      (await import('@/app/admin/(protected)/categories/page')).default;
    const BannersPage =
      (await import('@/app/admin/(protected)/banners/page')).default;

    const messagesHtml = renderToStaticMarkup(await MessagesPage());
    const subscribersHtml = renderToStaticMarkup(await SubscribersPage());
    const crawlHtml = renderToStaticMarkup(CrawlTasksPage());
    const analyticsHtml = renderToStaticMarkup(AnalyticsPage());
    const categoriesHtml = renderToStaticMarkup(await CategoriesPage());
    const bannersHtml = renderToStaticMarkup(await BannersPage());

    expect(messagesHtml).toContain('支持中心');
    expect(messagesHtml).toContain('待处理收件箱');
    expect(messagesHtml).toContain('回复界面');
    expect(messagesHtml).toContain('系统活动日志');
    expect(messagesHtml).toContain('Alice');
    expect(subscribersHtml).toContain('邮件');
    expect(subscribersHtml).toContain('总订阅数');
    expect(subscribersHtml).toContain('自动化发送规则配置');
    expect(subscribersHtml).toContain('订阅者列表');
    expect(crawlHtml).toContain('系统设置');
    expect(crawlHtml).toContain('抓取系统配置');
    expect(crawlHtml).toContain('源站任务配置');
    expect(analyticsHtml).toContain('企业级 AI 数据分析概览');
    expect(analyticsHtml).toContain('2023年10月01日 - 2023年10月31日');
    expect(analyticsHtml).toContain('总营收 (Total Revenue)');
    expect(analyticsHtml).toContain('用户转化漏斗 (Sankey 分析)');
    expect(analyticsHtml).toContain('热门产品类别排名');
    expect(analyticsHtml).toContain('电子数码');
    expect(analyticsHtml).toContain('AI 数据分析助手');
    expect(analyticsHtml).toContain('© 2023 Enterprise Global Manager. 版权所有。');
    expect(analyticsHtml).toContain('系统连接正常');
    expect(analyticsHtml).not.toContain('实时监控全球业务绩效与 AI 智能决策建议。');
    expect(analyticsHtml).not.toContain('本周热门类目更偏便携型设备');
    expect(categoriesHtml).toContain('系统设置');
    expect(categoriesHtml).toContain('数据库配置');
    expect(categoriesHtml).toContain('分类结构与映射');
    expect(bannersHtml).toContain('首页展示素材');
    expect(bannersHtml).toContain('Banner 列表');
  });
});
