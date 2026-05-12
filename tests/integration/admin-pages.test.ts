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
        slug: 'alpha-humanoid',
        productCode: 'P-1001',
        categoryId: 'cat-humanoid',
        nameZh: 'Alpha Humanoid 服务机器人',
        nameEn: 'Alpha Humanoid',
        nameEs: 'Alpha Humanoid',
        namePt: 'Alpha Humanoid',
        introZh: '类人智能，服务未来。',
        introEn: 'Human-like intelligence.',
        introEs: 'Inteligencia humanoide.',
        introPt: 'Inteligencia humanoide.',
        detailZh: '全尺寸双足人形机器人。',
        detailEn: 'Full-size humanoid robot.',
        detailEs: 'Robot humanoide.',
        detailPt: 'Robo humanoide.',
        priceUsd: { toString: () => '12999' },
        coverImageUrl: '/show/robot_humanoid.png',
        status: 'published',
        isRecommended: true,
        sortOrder: 1,
        images: [],
        category: {
          nameZh: '人形机器人'
        }
      }
    ]);
    getAdminCategoryTree.mockResolvedValue([
      {
        id: 'cat-humanoid',
        slug: 'humanoid-robots',
        sortOrder: 1,
        isActive: true,
        nameZh: '人形机器人',
        nameEn: 'Humanoid Robots',
        nameEs: 'Robots humanoides',
        namePt: 'Robos humanoides',
        children: []
      },
      {
        id: 'cat-drones',
        slug: 'drones',
        sortOrder: 2,
        isActive: true,
        nameZh: '无人机',
        nameEn: 'Drones',
        nameEs: 'Drones',
        namePt: 'Drones',
        children: []
      },
      {
        id: 'cat-deleted',
        slug: 'deleted-category',
        sortOrder: 3,
        isActive: false,
        nameZh: '已删除类目',
        nameEn: 'Deleted Category',
        nameEs: 'Categoria eliminada',
        namePt: 'Categoria excluida',
        children: []
      }
    ]);

    const ProductsPage =
      (await import('@/app/admin/(protected)/products/page')).default;
    const html = renderToStaticMarkup(await ProductsPage());

    expect(getAdminProductList).toHaveBeenCalledWith({});
    expect(getAdminCategoryTree).toHaveBeenCalled();
    expect(html).toContain('商品管理');
    expect(html).toContain('产品类目');
    expect(html).toContain('人形机器人');
    expect(html).toContain('无人机');
    expect(html).not.toContain('已删除类目');
    expect(html).toContain('Alpha Humanoid 服务机器人');
    expect(html).toContain('aria-label="编辑 Alpha Humanoid 服务机器人"');
    expect(html).toContain('aria-label="删除类目 人形机器人"');
    expect(html).not.toContain('/admin/products/product-1');
    expect(html).not.toContain('/admin/products/new');
    expect(html).not.toContain('智能穿戴设备');
    expect(html).not.toContain('管理产品');
    expect(html).not.toContain('点击编辑进入真实商品编辑页');
    expect(html).toContain('新增商品');
    expect(html).toContain('编辑商品');
    expect(html).toContain('导出 CSV');
    expect(html).toContain('待审核队列');
    expect(html).toContain('归档商品');
    expect(html).not.toContain('集中管理前台商品目录');
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
    expect(categoriesHtml).toContain('分类管理');
    expect(categoriesHtml).toContain('新建分类');
    expect(categoriesHtml).toContain('智能穿戴设备');
    expect(categoriesHtml).toContain('Slug');
    expect(categoriesHtml).toContain('启用分类');
    expect(categoriesHtml).not.toContain('数据库配置');
    expect(bannersHtml).toContain('首页展示素材');
    expect(bannersHtml).toContain('Banner 列表');
  });
});
