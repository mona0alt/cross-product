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

    const messagesHtml = renderToStaticMarkup(await MessagesPage());
    const subscribersHtml = renderToStaticMarkup(await SubscribersPage());
    const crawlHtml = renderToStaticMarkup(await CrawlTasksPage());
    const analyticsHtml = renderToStaticMarkup(await AnalyticsPage());

    expect(messagesHtml).toContain('留言管理');
    expect(messagesHtml).toContain('Alice');
    expect(subscribersHtml).toContain('订阅与通知');
    expect(subscribersHtml).toContain('邮件通知');
    expect(subscribersHtml).toContain('失败重发');
    expect(crawlHtml).toContain('抓取任务看板');
    expect(crawlHtml).toContain('来源站点');
    expect(analyticsHtml).toContain('AI 经营分析台');
    expect(analyticsHtml).toContain('用户转化路径');
  });
});
