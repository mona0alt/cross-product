import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

import {
  NOTICE_AUTO_DISMISS_MS,
  ProductCenter,
  getProductActionMenuState,
  scheduleNoticeDismiss,
  saveCategoryEditorForm,
  getProductFilterUpdate,
  getProductGalleryHiddenValue,
  getProductGalleryPreviewSrc,
  getGeneratedProductSlug,
  getProductEditorFormValidationError,
  getProductEditorSubmitState,
  getProductRowAfterFormSave
} from '@/components/admin/product-center';
import enMessages from '../../messages/en.json';

vi.mock('next/navigation', async () => {
  const actual =
    await vi.importActual<typeof import('next/navigation')>('next/navigation');

  return {
    ...actual,
    useRouter: () => ({
      refresh: vi.fn()
    })
  };
});

const categories = [
  {
    id: 'cat-humanoid',
    slug: 'humanoid-robots',
    nameZh: '人形机器人',
    nameEn: 'Humanoid Robots',
    iconImageUrl: '/show/robot_humanoid.png',
    isActive: true,
    productCount: 1
  },
  {
    id: 'cat-drones',
    slug: 'drones',
    nameZh: '无人机',
    nameEn: 'Drones',
    isActive: true,
    productCount: 1
  }
];

const products = [
  {
    id: 'product-1',
    slug: 'alpha-humanoid',
    productCode: 'P-3001',
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
    categoryName: '人形机器人',
    status: 'published',
    priceUsd: 12999,
    coverImageUrl: '/show/robot_humanoid.png',
    isRecommended: true,
    sortOrder: 1,
    images: [{ imageUrl: '/show/robot_humanoid.png', sortOrder: 0 }]
  },
  {
    id: 'product-2',
    slug: 'aerial-x1',
    productCode: 'P-2001',
    categoryId: 'cat-drones',
    nameZh: 'Aerial X1 航拍无人机',
    nameEn: 'Aerial X1',
    nameEs: 'Aerial X1',
    namePt: 'Aerial X1',
    introZh: '4K航拍，轻巧随行。',
    introEn: '4K aerial filming.',
    introEs: 'Filmacion aerea 4K.',
    introPt: 'Filmagem aerea 4K.',
    detailZh: '消费级航拍无人机。',
    detailEn: 'Consumer aerial drone.',
    detailEs: 'Drone de consumo.',
    detailPt: 'Drone de consumo.',
    categoryName: '无人机',
    status: 'draft',
    priceUsd: 899,
    coverImageUrl: '/show/robot_drone.png',
    isRecommended: false,
    sortOrder: 2,
    images: []
  }
];

const productsWithPending = [
  ...products,
  {
    ...products[1],
    id: 'product-4',
    slug: 'pending-drone',
    productCode: 'P-2004',
    nameZh: '待审核巡检无人机',
    nameEn: 'Pending Drone',
    status: 'pending'
  }
];

const paginatedProducts = [
  ...products,
  {
    ...products[0],
    id: 'product-3',
    slug: 'beta-humanoid',
    productCode: 'P-3002',
    nameZh: 'Beta Humanoid 迎宾机器人',
    nameEn: 'Beta Humanoid',
    isRecommended: false,
    sortOrder: 3
  }
];

const productsWithArchivedCategory = [
  {
    ...products[0],
    id: 'product-archived-category',
    slug: 'archived-category-product',
    categoryId: 'cat-archived',
    categoryName: '已停用分类',
    nameZh: 'Archived Category 商品',
    nameEn: 'Archived Category Product'
  }
];

describe('ProductCenter', () => {
  it('renders the database-backed product management workbench by default', () => {
    const html = renderToStaticMarkup(
      <ProductCenter
        categories={categories}
        products={products}
        defaultSelectedProductIds={['product-1']}
      />
    );

    expect(html).toContain('商品管理');
    expect(html).toContain('产品类目');
    expect(html).toContain('aria-label="添加类目"');
    expect(html).toContain('title="添加类目"');
    expect(html).not.toMatch(/>\s*添加类目\s*</);
    expect(html).not.toContain('href="/admin/categories"');
    expect(html).toContain('人形机器人');
    expect(html).toContain('Humanoid Robots');
    expect(html).toContain('无人机');
    expect(html).not.toContain('>1 个商品</span>');
    expect(html).toContain('aria-label="编辑类目 人形机器人"');
    expect(html).toContain('aria-label="编辑类目 无人机"');
    expect(html).toContain('lucide-pen-line');
    expect(html).not.toContain('智能穿戴设备');
    expect(html).not.toContain('影音娱乐');
    expect(html).not.toContain('管理产品');
    expect(html).not.toContain('分类与商品概览');
    expect(html).not.toContain('点击编辑进入真实商品编辑页');
    expect(html).toContain('h-[calc(100vh-104px)]');
    expect(html).toContain('grid min-h-0 flex-1');
    expect(html).toContain('flex min-h-0 flex-1 flex-col overflow-hidden');
    expect(html).toContain('aria-label="商品列表滚动区域"');
    expect(html).toContain('sticky top-0 z-10');
    expect(html).toContain('[scrollbar-gutter:stable]');
    expect(html).toContain('min-w-[1040px]');
    expect(html).toContain('Alpha Humanoid 服务机器人');
    expect(html).toContain('Aerial X1 航拍无人机');
    expect(html).toContain('P-3001');
    expect(html).toContain('published');
    expect(html).toContain('aria-label="商品管理操作"');
    expect(html).toContain('新增商品');
    expect(html).toContain('导出 CSV');
    expect(html).toContain('待审核队列');
    expect(html).toContain('aria-label="编辑商品 Alpha Humanoid 服务机器人"');
    expect(html).not.toContain('aria-label="编辑 Alpha Humanoid 服务机器人"');
    expect(html).not.toContain('>编辑商品<');
    expect(html).toContain('批量推荐');
    expect(html).toContain('取消推荐');
    expect(html).toContain('批量归档');
    expect(html).toContain('aria-label="商品操作 Alpha Humanoid 服务机器人"');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-haspopup="menu"');
    expect(html).toContain('pr-8');
    expect(html).not.toContain('<details');
    expect(html).not.toContain('<summary');
    expect(html).not.toContain('>更多操作<');
    expect(html).not.toContain('>归档商品<');
    expect(html).not.toContain('>预览前台<');
    expect(html).not.toContain('href="/zh-CN/products/alpha-humanoid"');
    expect(html).not.toContain('分类和商品均来自后台数据库。');
    expect(html).toContain('aria-label="删除类目 人形机器人"');
    expect(html).not.toContain('aria-label="删除类目 人形机器人" disabled');
    expect(html).not.toContain('href="/admin/products/new"');
    expect(html).not.toContain('href="/admin/products/product-1"');
  });

  it('sorts the product table by product name alphabetically', () => {
    const html = renderToStaticMarkup(
      <ProductCenter categories={categories} products={products} />
    );
    const aerialIndex = html.indexOf('Aerial X1 航拍无人机');
    const alphaIndex = html.indexOf('Alpha Humanoid 服务机器人');

    expect(aerialIndex).toBeGreaterThan(-1);
    expect(alphaIndex).toBeGreaterThan(-1);
    expect(aerialIndex).toBeLessThan(alphaIndex);
  });

  it('can render the pending review queue as a product status filter', () => {
    const html = renderToStaticMarkup(
      <ProductCenter
        categories={categories}
        products={productsWithPending}
        defaultStatusFilter="pending"
      />
    );

    expect(html).not.toContain('当前筛选 1 个商品。');
    expect(html).toContain('待审核巡检无人机');
    expect(html).not.toContain('Alpha Humanoid 服务机器人');
  });

  it('uses the same fixed product-list layout for all and recommended filters', () => {
    const allProductsHtml = renderToStaticMarkup(
      <ProductCenter categories={categories} products={products} />
    );
    const recommendedProductsHtml = renderToStaticMarkup(
      <ProductCenter
        categories={categories}
        products={products}
        defaultStatusFilter="recommended"
      />
    );
    const layoutClasses = [
      'h-[calc(100vh-104px)]',
      'grid min-h-0 flex-1',
      'flex min-h-0 flex-1 flex-col overflow-hidden',
      'aria-label="商品列表滚动区域"',
      'sticky top-0 z-10',
      '[scrollbar-gutter:stable]'
    ];

    for (const className of layoutClasses) {
      expect(allProductsHtml).toContain(className);
      expect(recommendedProductsHtml).toContain(className);
    }
  });

  it('renders an empty state without falling back to mock data', () => {
    const html = renderToStaticMarkup(
      <ProductCenter categories={[]} products={[]} />
    );

    expect(html).toContain('暂无分类');
    expect(html).toContain('暂无商品');
    expect(html).not.toContain('Portable Cleaning Robot X2');
    expect(html).not.toContain('智能穿戴设备');
  });

  it('filters the product table by the selected category', () => {
    const html = renderToStaticMarkup(
      <ProductCenter
        categories={categories}
        products={products}
        defaultActiveCategoryId="cat-humanoid"
      />
    );

    expect(html).not.toContain('当前显示人形机器人下的 1 个商品。');
    expect(html).not.toContain('管理产品');
    expect(html).toContain('Alpha Humanoid 服务机器人');
    expect(html).not.toContain('Aerial X1 航拍无人机');
    expect(html).toContain('aria-pressed="true"');
  });

  it('clears the selected category when switching back to all products', () => {
    expect(
      getProductFilterUpdate({
        filter: 'all',
        activeCategoryId: 'cat-humanoid',
        selectedProductIds: ['product-1']
      })
    ).toEqual({
      statusFilter: 'all',
      activeCategoryId: null,
      selectedProductIds: []
    });

    expect(
      getProductFilterUpdate({
        filter: 'pending',
        activeCategoryId: 'cat-humanoid',
        selectedProductIds: ['product-1']
      })
    ).toEqual({
      statusFilter: 'pending',
      activeCategoryId: 'cat-humanoid',
      selectedProductIds: ['product-1']
    });
  });

  it('renders the open product action popover with dashboard menu styling', () => {
    const html = renderToStaticMarkup(
      <ProductCenter
        categories={categories}
        products={products}
        defaultOpenActionMenuProductId="product-1"
      />
    );

    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('role="menu"');
    expect(html).toContain('aria-label="商品操作菜单 Alpha Humanoid 服务机器人"');
    expect(html).toContain('rounded-xl border border-admin-border bg-white p-1.5 text-left shadow-xl');
    expect(html).toContain('role="menuitem"');
    expect(html).toContain('预览前台');
    expect(html).toContain('归档商品');
  });

  it('closes the product action popover on outside click or escape', () => {
    expect(
      getProductActionMenuState({
        currentOpenProductId: null,
        action: 'toggle',
        productId: 'product-1'
      })
    ).toBe('product-1');

    expect(
      getProductActionMenuState({
        currentOpenProductId: 'product-1',
        action: 'toggle',
        productId: 'product-1'
      })
    ).toBeNull();

    expect(
      getProductActionMenuState({
        currentOpenProductId: 'product-1',
        action: 'outside'
      })
    ).toBeNull();

    expect(
      getProductActionMenuState({
        currentOpenProductId: 'product-1',
        action: 'escape'
      })
    ).toBeNull();
  });

  it('keeps gallery local previews separate from submitted image URLs', () => {
    expect(
      getProductGalleryPreviewSrc({
        url: '/uploads/products/one.png',
        previewUrl: 'blob:http://localhost/gallery-preview'
      })
    ).toBe('blob:http://localhost/gallery-preview');

    expect(
      getProductGalleryHiddenValue([
        { url: '/uploads/products/one.png' },
        { url: '', previewUrl: 'blob:http://localhost/pending' },
        { url: '/uploads/products/two.png' }
      ])
    ).toBe('/uploads/products/one.png\n/uploads/products/two.png');
  });

  it('disables product saving while gallery image upload is still pending', () => {
    expect(getProductEditorSubmitState({ isUploadPending: true })).toEqual({
      disabled: true,
      label: '图片上传中...'
    });

    expect(getProductEditorSubmitState({ isUploadPending: false })).toEqual({
      disabled: false,
      label: '保存更改'
    });
  });

  it('closes and refreshes the category drawer after a successful save', async () => {
    const formAction = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();
    const onSaved = vi.fn();
    const refresh = vi.fn();
    const formData = new FormData();

    formData.set('nameZh', '人形机器人');

    await saveCategoryEditorForm({
      formAction,
      formData,
      router: { refresh },
      onClose,
      onSaved,
      isCreate: false
    });

    expect(formAction).toHaveBeenCalledWith(formData);
    expect(onSaved).toHaveBeenCalledWith('类目已保存。');
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('auto-dismisses the top notice after the configured timeout', () => {
    vi.useFakeTimers();

    const dismiss = vi.fn();
    const cleanup = scheduleNoticeDismiss(dismiss);

    vi.advanceTimersByTime(NOTICE_AUTO_DISMISS_MS - 1);
    expect(dismiss).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(dismiss).toHaveBeenCalledTimes(1);

    cleanup();
    vi.useRealTimers();
  });

  it('keeps the saved gallery URLs in the local product row before router refresh returns', () => {
    const formData = new FormData();
    formData.set('coverImageUrl', '/uploads/products/cover-new.png');
    formData.set('galleryImageUrls', '/uploads/products/new-one.png\n/uploads/products/new-two.png');

    expect(getProductRowAfterFormSave(products[0], formData)).toMatchObject({
      coverImageUrl: '/uploads/products/cover-new.png',
      images: [
        { imageUrl: '/uploads/products/new-one.png', sortOrder: 0 },
        { imageUrl: '/uploads/products/new-two.png', sortOrder: 1 }
      ]
    });
  });

  it('returns a field-level validation error before saving a product with no product code', () => {
    const formData = new FormData();
    formData.set('categoryId', 'cat-humanoid');
    formData.set('productCode', ' ');

    expect(getProductEditorFormValidationError(formData)).toBe('请填写商品编码。');
  });

  it('generates product URL paths from product codes and English names', () => {
    expect(getGeneratedProductSlug('P-3001', 'Window Cleaner Pro')).toBe('p-3001');
    expect(getGeneratedProductSlug('', 'Window Cleaner Pro')).toBe('window-cleaner-pro');
  });

  it('keeps the product table fixed-size and paginates overflowing rows', () => {
    const html = renderToStaticMarkup(
      <ProductCenter
        categories={categories}
        products={paginatedProducts}
        productPageSize={1}
      />
    );

    expect(html).toContain('flex min-h-0 flex-1 flex-col overflow-hidden');
    expect(html).toContain('aria-label="商品列表滚动区域"');
    expect(html).toContain('sticky top-0 z-10');
    expect(html).toContain('[scrollbar-gutter:stable]');
    expect(html).toContain('Aerial X1 航拍无人机');
    expect(html).not.toContain('Alpha Humanoid 服务机器人');
    expect(html).toContain('第 1 / 3 页');
    expect(html).toContain('共 3 个商品');
    expect(html).toContain('aria-label="上一页"');
    expect(html).toContain('aria-label="下一页"');
  });

  it('renders the edit drawer for the selected product when requested', () => {
    const html = renderToStaticMarkup(
      <ProductCenter
        categories={categories}
        products={products}
        defaultSelectedProductId="product-1"
        defaultEditorOpen
      />
    );

    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain('fixed inset-y-0 right-0 z-50');
    expect(html).toContain('编辑商品');
    expect(html).toContain('Alpha Humanoid 服务机器人');
    expect(html).toContain('产品媒体');
    expect(html).toContain('封面主图');
    expect(html).toContain('移除封面主图');
    expect(html).toContain('图库图片');
    expect(html).toContain('商品图片管理');
    expect(html).toContain('aria-label="删除商品图片 1"');
    expect(html).toContain('本地图片 1');
    expect(html).toContain('上传封面');
    expect(html).toContain('上传图库');
    expect(html).toContain('保存更改');
    expect(html).toContain('disabled:cursor-wait');
    expect(html).not.toContain('/admin/products/product-1');
  });

  it('keeps the current category selectable when editing a product under an inactive category', () => {
    const html = renderToStaticMarkup(
      <ProductCenter
        categories={categories}
        products={productsWithArchivedCategory}
        defaultSelectedProductId="product-archived-category"
        defaultEditorOpen
      />
    );

    expect(html).toContain('<option value="cat-archived" selected="">已停用分类</option>');
  });

  it('renders the create drawer when requested', () => {
    const html = renderToStaticMarkup(
      <ProductCenter
        categories={categories}
        products={products}
        defaultEditorOpen
        defaultEditorMode="create"
      />
    );

    expect(html).toContain('新增商品');
    expect(html).toContain('选择类别');
    expect(html).toContain('商品网址路径');
    expect(html).toContain('用于生成商品详情页网址');
    expect(html).toContain('前台链接：/products/');
    expect(html).toContain('产品媒体');
    expect(html).toContain('暂无图库图片');
    expect(html).toContain('商品图片管理');
    expect(html).toContain('保存更改');
    expect(html).not.toContain('/admin/products/new');
  });

  it('renders the category create drawer on the product page when requested', () => {
    const html = renderToStaticMarkup(
      <ProductCenter
        categories={categories}
        products={products}
        defaultCategoryEditorOpen
        defaultCategoryEditorMode="create"
      />
    );

    expect(html).toContain('role="dialog"');
    expect(html).toContain('新建类目');
    expect(html).toContain('父级类目');
    expect(html).toContain('类目主图');
    expect(html).toContain('上传主图');
    expect(html).toContain('中文名称');
    expect(html).toContain('保存类目');
    expect(html).not.toContain('href="/admin/categories"');
  });

  it('renders the category edit drawer for the selected category when requested', () => {
    const html = renderToStaticMarkup(
      <ProductCenter
        categories={categories}
        products={products}
        defaultSelectedCategoryId="cat-humanoid"
        defaultCategoryEditorOpen
        defaultCategoryEditorMode="edit"
      />
    );

    expect(html).toContain('编辑类目');
    expect(html).toContain('humanoid-robots');
    expect(html).toContain('人形机器人');
    expect(html).toContain('/show/robot_humanoid.png');
    expect(html).toContain('移除类目主图');
    expect(html).toContain('保存类目');
  });

  it('localizes product management side drawers with the admin product copy', () => {
    const html = renderToStaticMarkup(
      <ProductCenter
        categories={categories}
        products={products}
        copy={enMessages.Admin.products}
        defaultEditorOpen
        defaultEditorMode="create"
        defaultCategoryEditorOpen
        defaultCategoryEditorMode="create"
      />
    );

    expect(html).toContain('New product');
    expect(html).toContain('Product media');
    expect(html).toContain('Upload cover');
    expect(html).toContain('Product image manager');
    expect(html).toContain('Product URL path');
    expect(html).toContain('Used to generate the product detail page URL.');
    expect(html).toContain('<option value="draft" selected="">Draft</option>');
    expect(html).toContain('<option value="pending">Pending review</option>');
    expect(html).toContain('<option value="published">Published</option>');
    expect(html).toContain('<option value="archived">Archived</option>');
    expect(html).toContain('Save changes');
    expect(html).toContain('New category');
    expect(html).toContain('Parent category');
    expect(html).toContain('Save category');
    expect(html).not.toContain('商品图片管理');
    expect(html).not.toContain('保存类目');
    expect(html).not.toContain('新建类目');
    expect(html).not.toContain('新增商品');
  });

  it('localizes the product management category sidebar with the admin product copy', () => {
    const html = renderToStaticMarkup(
      <ProductCenter
        categories={categories}
        products={products}
        copy={enMessages.Admin.products}
      />
    );

    expect(html).toContain('Product categories');
    expect(html).toContain('aria-label="Add category"');
    expect(html).toContain('title="Add category"');
    expect(html).toContain('aria-label="Edit category 人形机器人"');
    expect(html).toContain('aria-label="Edit category 无人机"');
    expect(html).not.toContain('1 products');
    expect(html).toContain('lucide-pen-line');
    expect(html).not.toContain('产品类目');
    expect(html).not.toContain('添加类目');
    expect(html).not.toContain('1 个商品');
  });

  it('uses localized product names in the admin product table controls', () => {
    const localizedProducts = products.map((product) => ({
      ...product,
      localizedName: product.nameEn
    }));
    const html = renderToStaticMarkup(
      <ProductCenter
        categories={categories}
        products={localizedProducts}
        copy={enMessages.Admin.products}
        defaultOpenActionMenuProductId="product-1"
      />
    );

    expect(html).toContain('aria-label="Edit product Alpha Humanoid"');
    expect(html).toContain('aria-label="Select Alpha Humanoid"');
    expect(html).toContain('aria-label="Product actions Alpha Humanoid"');
    expect(html).toContain('aria-label="Product action menu Alpha Humanoid"');
    expect(html).toContain('aria-label="Archive product Alpha Humanoid"');
    expect(html).not.toContain('aria-label="Edit product Alpha Humanoid 服务机器人"');
    expect(html).not.toContain('aria-label="Select Alpha Humanoid 服务机器人"');
  });

  it('localizes product image upload helper text with the admin product copy', () => {
    const html = renderToStaticMarkup(
      <ProductCenter
        categories={categories}
        products={products}
        copy={enMessages.Admin.products}
        defaultSelectedProductId="product-1"
        defaultEditorOpen
        defaultEditorMode="edit"
      />
    );

    expect(html).toContain('Supports JPG, PNG, WebP and GIF. Max 5MB each.');
    expect(html).toContain('Current image');
    expect(html).toContain('Local image configured');
    expect(html).not.toContain('支持 JPG、PNG、WebP、GIF，单张不超过 5MB。');
    expect(html).not.toContain('当前图片');
    expect(html).not.toContain('本地图片已配置');
  });
});
