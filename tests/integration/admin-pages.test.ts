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
    const html = renderToStaticMarkup(await ProductsPage());

    expect(html).toContain('商品中心');
    expect(html).toContain('自动抓取');
    expect(html).toContain('手动导入');
    expect(html).toContain('新建商品');
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

    expect(html).toContain('手动新建商品');
    expect(html).toContain('审核提示');
    expect(html).toContain('提交审核');
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
    const crawlHtml = renderToStaticMarkup(await CrawlTasksPage());
    const analyticsHtml = renderToStaticMarkup(await AnalyticsPage());
    const categoriesHtml = renderToStaticMarkup(await CategoriesPage());
    const bannersHtml = renderToStaticMarkup(await BannersPage());

    expect(messagesHtml).toContain('客户留言');
    expect(messagesHtml).toContain('客户沟通与线索概览');
    expect(messagesHtml).toContain('Alice');
    expect(subscribersHtml).toContain('订阅规模与通知节奏');
    expect(subscribersHtml).toContain('失败重发');
    expect(crawlHtml).toContain('候选商品入口页');
    expect(crawlHtml).toContain('来源站点');
    expect(analyticsHtml).toContain('本周经营结论');
    expect(analyticsHtml).toContain('用户转化路径');
    expect(categoriesHtml).toContain('分类结构与映射');
    expect(categoriesHtml).toContain('分类录入区');
    expect(bannersHtml).toContain('首页展示素材');
    expect(bannersHtml).toContain('Banner 列表');
  });
});
