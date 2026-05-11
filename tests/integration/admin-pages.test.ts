import { renderToStaticMarkup } from 'react-dom/server';
import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const getAdminProductList = vi.fn();
const getAdminCategoryTree = vi.fn();
const requireAdminSession = vi.fn();
const cookiesMock = vi.fn();
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

vi.mock('next/headers', () => ({
  cookies: cookiesMock
}));

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
    cookiesMock.mockReset();
    cookiesMock.mockResolvedValue({
      get: () => undefined
    });
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
        id: 'cat-wearables',
        slug: 'wearables',
        sortOrder: 1,
        isActive: true,
        nameZh: '智能穿戴设备',
        nameEn: 'Wearables',
        nameEs: 'Wearables',
        namePt: 'Wearables',
        children: []
      },
      {
        id: 'cat-audio',
        slug: 'audio',
        sortOrder: 2,
        isActive: true,
        nameZh: '影音娱乐',
        nameEn: 'Audio',
        nameEs: 'Audio',
        namePt: 'Audio',
        children: []
      }
    ]);

    const ProductsPage =
      (await import('@/app/admin/(protected)/products/page')).default;
    const html = renderToStaticMarkup(ProductsPage());

    expect(html).toContain('商品管理');
    expect(html).toContain('产品类目');
    expect(html).toContain('智能穿戴设备 详情');
    expect(html).toContain('管理产品');
    expect(html).toContain('新增商品');
    expect(html).toContain('编辑商品');
    expect(html).not.toContain('集中管理前台商品目录');
    expect(html).not.toContain('导出 CSV');
  });

  it('renders the manual product creation page with review framing', async () => {
    getAdminCategoryTree.mockResolvedValue([
      {
        id: 'cat-wearables',
        slug: 'wearables',
        sortOrder: 1,
        isActive: true,
        nameZh: '智能穿戴设备',
        nameEn: 'Wearables',
        nameEs: 'Wearables',
        namePt: 'Wearables',
        children: []
      },
      {
        id: 'cat-audio',
        slug: 'audio',
        sortOrder: 2,
        isActive: true,
        nameZh: '影音娱乐',
        nameEn: 'Audio',
        nameEs: 'Audio',
        namePt: 'Audio',
        children: []
      }
    ]);

    const NewProductPage =
      (await import('@/app/admin/(protected)/products/new/page')).default;
    const html = renderToStaticMarkup(await NewProductPage());

    expect(html).toContain('商品管理');
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

    expect(editHtml).toContain('商品管理');
    expect(editHtml).toContain('编辑后重新进入审核');
  });

  it('renders the messages and subscribers pages', async () => {
    getAdminCategoryTree.mockResolvedValue([
      {
        id: 'cat-wearables',
        slug: 'wearables',
        sortOrder: 1,
        isActive: true,
        nameZh: '智能穿戴设备',
        nameEn: 'Wearables',
        nameEs: 'Wearables',
        namePt: 'Wearables',
        children: []
      },
      {
        id: 'cat-audio',
        slug: 'audio',
        sortOrder: 2,
        isActive: true,
        nameZh: '影音娱乐',
        nameEn: 'Audio',
        nameEs: 'Audio',
        namePt: 'Audio',
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
    expect(messagesHtml).toContain('留言清单');
    expect(messagesHtml).toContain('总留言');
    expect(messagesHtml).toContain('待处理');
    expect(messagesHtml).toContain('张明远');
    expect(subscribersHtml).toContain('邮件');
    expect(subscribersHtml).toContain('总订阅数');
    expect(subscribersHtml).toContain('自动化发送规则');
    expect(subscribersHtml).toContain('订阅者列表');
    expect(crawlHtml).toContain('系统设置');
    expect(crawlHtml).toContain('抓取系统配置');
    expect(crawlHtml).toContain('源站任务配置');
    expect(analyticsHtml).toContain('总 PV');
    expect(analyticsHtml).toContain('总商品数量');
    expect(analyticsHtml).toContain('页面访问成功率');
    expect(analyticsHtml).toContain('热门产品排名');
    expect(analyticsHtml).toContain('星河 Pro 手机');
    expect(analyticsHtml).toContain('AI 数据分析助手');
    expect(analyticsHtml).not.toContain('企业级 AI 数据分析概览');
    expect(analyticsHtml).not.toContain('用户转化漏斗 (Sankey 分析)');
    expect(analyticsHtml).not.toContain('本周热门类目更偏便携型设备');
    expect(categoriesHtml).toContain('系统设置');
    expect(categoriesHtml).toContain('数据库配置');
    expect(categoriesHtml).toContain('分类结构与映射');
    expect(bannersHtml).toContain('首页展示素材');
    expect(bannersHtml).toContain('Banner 列表');
  });
});
