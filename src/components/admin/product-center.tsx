'use client';

import React, { useState } from 'react';
import { useFormStatus } from 'react-dom';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Archive,
  Check,
  ChevronLeft,
  ChevronRight,
  CirclePlus,
  Download,
  Edit3,
  Eye,
  FolderTree,
  Package,
  Search,
  Star,
  Trash2,
  X
} from 'lucide-react';
import {
  archiveProductFromListAction,
  bulkUpdateProductsFromListAction,
  createProductFormAction,
  updateProductFormAction
} from '@/features/admin/product-actions';
import {
  createCategoryFormAction,
  deleteCategoryFormAction,
  updateCategoryFormAction
} from '@/features/admin/category-actions';
import { AdminImageUploadInput } from '@/components/admin/admin-image-upload-input';

export type ProductCenterCategory = {
  id: string;
  parentId?: string | null;
  slug: string;
  sortOrder?: number;
  iconImageUrl?: string | null;
  nameZh: string;
  nameEn: string;
  nameEs?: string;
  namePt?: string;
  descriptionZh?: string | null;
  descriptionEn?: string | null;
  descriptionEs?: string | null;
  descriptionPt?: string | null;
  isActive: boolean;
  productCount: number;
};

export type ProductCenterRow = {
  id: string;
  slug: string;
  productCode: string;
  categoryId: string;
  nameZh: string;
  nameEn: string;
  nameEs: string;
  namePt: string;
  introZh: string;
  introEn: string;
  introEs: string;
  introPt: string;
  detailZh: string;
  detailEn: string;
  detailEs: string;
  detailPt: string;
  categoryName: string;
  status: string;
  priceUsd: number;
  coverImageUrl: string;
  isRecommended: boolean;
  sortOrder: number;
  images: Array<{
    imageUrl: string;
    sortOrder?: number;
  }>;
};

const statusStyles: Record<string, string> = {
  published: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  draft: 'bg-slate-100 text-slate-700 ring-slate-200',
  archived: 'bg-rose-50 text-rose-700 ring-rose-200'
};

type ProductStatusFilter =
  | 'all'
  | 'pending'
  | 'draft'
  | 'published'
  | 'archived'
  | 'recommended';

type ProductBulkOperation = 'recommend' | 'unrecommend' | 'archive';

export function ProductCenter({
  categories,
  products,
  defaultSelectedProductId,
  defaultActiveCategoryId,
  productPageSize = 8,
  defaultEditorOpen = false,
  defaultEditorMode = 'edit',
  defaultSelectedCategoryId,
  defaultCategoryEditorOpen = false,
  defaultCategoryEditorMode = 'edit',
  defaultStatusFilter = 'all',
  defaultSelectedProductIds = []
}: {
  categories: ProductCenterCategory[];
  products: ProductCenterRow[];
  defaultSelectedProductId?: string;
  defaultActiveCategoryId?: string;
  productPageSize?: number;
  defaultEditorOpen?: boolean;
  defaultEditorMode?: 'create' | 'edit';
  defaultSelectedCategoryId?: string;
  defaultCategoryEditorOpen?: boolean;
  defaultCategoryEditorMode?: 'create' | 'edit';
  defaultStatusFilter?: ProductStatusFilter;
  defaultSelectedProductIds?: string[];
}) {
  const firstProductId = products[0]?.id ?? null;
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    defaultSelectedProductId ?? firstProductId
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    defaultSelectedCategoryId ?? null
  );
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
    defaultActiveCategoryId ?? null
  );
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>(
    defaultEditorMode
  );
  const [categoryEditorMode, setCategoryEditorMode] = useState<'create' | 'edit'>(
    defaultCategoryEditorMode
  );
  const [isEditorOpen, setIsEditorOpen] = useState(defaultEditorOpen);
  const [isCategoryEditorOpen, setIsCategoryEditorOpen] = useState(
    defaultCategoryEditorOpen
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<ProductStatusFilter>(defaultStatusFilter);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(
    defaultSelectedProductIds
  );
  const [notice, setNotice] = useState('');
  const selectedProduct =
    selectedProductId === null
      ? null
      : products.find((product) => product.id === selectedProductId) ?? null;
  const selectedCategory =
    selectedCategoryId === null
      ? null
      : categories.find((category) => category.id === selectedCategoryId) ?? null;
  const activeCategory =
    activeCategoryId === null
      ? null
      : categories.find((category) => category.id === activeCategoryId) ?? null;
  const categoryProducts =
    activeCategoryId === null
      ? products
      : products.filter((product) => product.categoryId === activeCategoryId);
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredProducts = categoryProducts.filter((product) => {
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'recommended'
        ? product.isRecommended
        : product.status === statusFilter;
    const matchesSearch = normalizedSearchTerm
      ? [
          product.nameZh,
          product.nameEn,
          product.nameEs,
          product.namePt,
          product.productCode,
          product.categoryName,
          product.slug
        ]
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearchTerm)
      : true;

    return matchesStatus && matchesSearch;
  });
  const overviewDescription =
    activeCategory && statusFilter === 'all' && !normalizedSearchTerm
      ? `当前显示${activeCategory.nameZh}下的 ${filteredProducts.length} 个商品。`
      : statusFilter !== 'all' || normalizedSearchTerm
      ? `当前筛选 ${filteredProducts.length} 个商品。`
      : `当前共有 ${categories.length} 个分类，${products.length} 个商品。`;
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const safePageSize = Math.max(1, productPageSize);
  const totalProductPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / safePageSize)
  );
  const visibleProductPage = Math.min(currentProductPage, totalProductPages);
  const productPageStart = (visibleProductPage - 1) * safePageSize;
  const paginatedProducts = filteredProducts.slice(
    productPageStart,
    productPageStart + safePageSize
  );
  const showProductPagination = filteredProducts.length > safePageSize;
  const selectedVisibleProductCount = paginatedProducts.filter((product) =>
    selectedProductIds.includes(product.id)
  ).length;
  const allVisibleProductsSelected =
    paginatedProducts.length > 0 &&
    selectedVisibleProductCount === paginatedProducts.length;

  const openCreateEditor = () => {
    setSelectedProductId(null);
    setEditorMode('create');
    setIsEditorOpen(true);
  };

  const openEditEditor = (productId: string) => {
    setSelectedProductId(productId);
    setEditorMode('edit');
    setIsEditorOpen(true);
  };

  const openCreateCategoryEditor = () => {
    setSelectedCategoryId(null);
    setCategoryEditorMode('create');
    setIsCategoryEditorOpen(true);
  };

  const openEditCategoryEditor = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCategoryEditorMode('edit');
    setIsCategoryEditorOpen(true);
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId]
    );
  };

  const toggleVisibleProductSelection = () => {
    const visibleIds = paginatedProducts.map((product) => product.id);

    setSelectedProductIds((current) =>
      allVisibleProductsSelected
        ? current.filter((id) => !visibleIds.includes(id))
        : Array.from(new Set([...current, ...visibleIds]))
    );
  };

  const applyBulkOperation = async (operation: ProductBulkOperation) => {
    await bulkUpdateProductsFromListAction(selectedProductIds, operation);
    setNotice(
      operation === 'recommend'
        ? '已批量设为推荐商品。'
        : operation === 'unrecommend'
        ? '已批量取消推荐。'
        : '已批量归档商品。'
    );
    setSelectedProductIds([]);
  };

  const archiveProduct = async (productId: string) => {
    await archiveProductFromListAction(productId);
    setNotice('商品已归档。');
    setSelectedProductIds((current) => current.filter((id) => id !== productId));
  };

  const updateStatusFilter = (filter: ProductStatusFilter) => {
    setStatusFilter(filter);
    setCurrentProductPage(1);
  };

  const exportFilteredProducts = () => {
    const csvRows = [
      ['商品名称', '英文名称', 'SKU', '类别', '状态', '价格USD', '推荐', 'Slug'],
      ...filteredProducts.map((product) => [
        product.nameZh,
        product.nameEn,
        product.productCode,
        product.categoryName,
        product.status,
        String(product.priceUsd),
        product.isRecommended ? '是' : '否',
        product.slug
      ])
    ];
    const csv = csvRows
      .map((row) =>
        row
          .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
          .join(',')
      )
      .join('\n');
    const blob = new Blob([`\uFEFF${csv}`], {
      type: 'text/csv;charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'products.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="relative flex min-h-[calc(100vh-104px)] flex-col overflow-hidden rounded-xl border border-admin-border bg-admin-bg shadow-sm">
      <header className="flex shrink-0 flex-col gap-4 border-b border-admin-border bg-white px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-5">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-admin-accent">
              <Package className="h-4 w-4" />
            </div>
            <h2 className="shrink-0 text-xl font-bold text-admin-text-primary">
              商品管理
            </h2>
          </div>

          <label className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-text-muted" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentProductPage(1);
              }}
              placeholder="搜索商品..."
              className="h-10 w-full rounded-lg border border-admin-border bg-admin-elevated pl-9 pr-3 text-sm text-admin-text-primary outline-none transition focus:border-admin-accent focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
            />
          </label>
        </div>

        <span className="hidden text-xs font-medium text-admin-text-muted lg:block">
          分类和商品均来自后台数据库。
        </span>
      </header>

      <div className="grid min-h-[620px] flex-1 gap-5 bg-admin-bg p-4 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:p-5">
        <aside className="min-h-0 overflow-y-auto rounded-xl border border-admin-border bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-admin-text-primary">产品类目</h3>
            <button
              type="button"
              onClick={openCreateCategoryEditor}
              className="inline-flex items-center gap-1.5 rounded-lg bg-admin-accent px-3 py-2 text-sm font-semibold text-white transition hover:bg-admin-accent-hover"
            >
              <CirclePlus className="h-4 w-4" />
              添加类目
            </button>
          </div>

          {categories.length > 0 ? (
            <div className="space-y-3">
              {categories.map((category) => (
                <CategoryItem
                  key={category.id}
                  category={category}
                  isSelected={category.id === activeCategoryId}
                  onSelect={(categoryId) => {
                    setActiveCategoryId(categoryId);
                    setCurrentProductPage(1);
                    setSelectedProductIds([]);
                  }}
                  onEdit={openEditCategoryEditor}
                />
              ))}
            </div>
          ) : (
            <EmptyState title="暂无分类" description="创建分类后，商品可挂载到对应类目。" />
          )}
        </aside>

        <main className="flex min-h-0 flex-col gap-5">
          <section className="shrink-0 rounded-xl border border-admin-border bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <h3 className="text-2xl font-bold text-admin-text-primary">分类与商品概览</h3>
                <p className="mt-1 text-sm text-admin-text-secondary">
                  {overviewDescription}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateStatusFilter('all')}
                  className={filterButtonClass(statusFilter === 'all')}
                >
                  全部商品
                </button>
                <button
                  type="button"
                  onClick={() => updateStatusFilter('pending')}
                  className={filterButtonClass(statusFilter === 'pending')}
                >
                  待审核队列
                </button>
                <button
                  type="button"
                  onClick={() => updateStatusFilter('recommended')}
                  className={filterButtonClass(statusFilter === 'recommended')}
                >
                  推荐商品
                </button>
                <button
                  type="button"
                  onClick={exportFilteredProducts}
                  className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-admin-border bg-white px-4 text-sm font-semibold text-admin-text-secondary transition hover:border-admin-border-strong"
                >
                  <Download className="h-4 w-4" />
                  导出 CSV
                </button>
                <button
                  type="button"
                  onClick={openCreateEditor}
                  className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-admin-accent px-4 text-sm font-semibold text-white transition hover:bg-admin-accent-hover"
                >
                  <CirclePlus className="h-4 w-4" />
                  新增商品
                </button>
              </div>
            </div>
            {notice ? (
              <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                {notice}
              </p>
            ) : null}
            {selectedProductIds.length > 0 ? (
              <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-admin-border bg-admin-elevated px-3 py-2 text-sm text-admin-text-secondary">
                <span className="font-semibold">
                  已选择 {selectedProductIds.length} 个商品
                </span>
                <button
                  type="button"
                  onClick={() => void applyBulkOperation('recommend')}
                  className="inline-flex items-center gap-1 rounded-md border border-admin-border bg-white px-3 py-1.5 text-xs font-semibold transition hover:border-admin-border-strong"
                >
                  <Star className="h-3.5 w-3.5" />
                  批量推荐
                </button>
                <button
                  type="button"
                  onClick={() => void applyBulkOperation('unrecommend')}
                  className="rounded-md border border-admin-border bg-white px-3 py-1.5 text-xs font-semibold transition hover:border-admin-border-strong"
                >
                  取消推荐
                </button>
                <button
                  type="button"
                  onClick={() => void applyBulkOperation('archive')}
                  className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:border-rose-300"
                >
                  <Archive className="h-3.5 w-3.5" />
                  批量归档
                </button>
              </div>
            ) : null}
          </section>

          <section className="flex min-h-[520px] flex-1 flex-col overflow-hidden rounded-xl border border-admin-border bg-white shadow-sm">
            {filteredProducts.length > 0 ? (
              <div className="min-h-0 flex-1 overflow-auto">
                <table className="w-full min-w-[780px] border-collapse text-left">
                  <thead className="bg-admin-elevated text-admin-text-muted">
                    <tr>
                      <ColumnHeader>
                        <input
                          type="checkbox"
                          aria-label="选择当前页商品"
                          checked={allVisibleProductsSelected}
                          onChange={toggleVisibleProductSelection}
                          className="h-4 w-4 rounded border-admin-border text-admin-accent"
                        />
                      </ColumnHeader>
                      <ColumnHeader>产品名称</ColumnHeader>
                      <ColumnHeader>SKU</ColumnHeader>
                      <ColumnHeader>类别</ColumnHeader>
                      <ColumnHeader>状态</ColumnHeader>
                      <ColumnHeader>价格</ColumnHeader>
                      <ColumnHeader>推荐</ColumnHeader>
                      <ColumnHeader align="right">操作</ColumnHeader>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-admin-border">
                    {paginatedProducts.map((product) => (
                      <tr key={product.id} className="bg-white transition hover:bg-blue-50/50">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            aria-label={`选择 ${product.nameZh}`}
                            checked={selectedProductIds.includes(product.id)}
                            onChange={() => toggleProductSelection(product.id)}
                            className="h-4 w-4 rounded border-admin-border text-admin-accent"
                          />
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <ProductThumb product={product} />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-admin-text-primary">
                                {product.nameZh}
                              </p>
                              <p className="truncate text-xs text-admin-text-muted">
                                {product.nameEn}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 font-mono text-sm text-admin-text-secondary">
                          {product.productCode}
                        </td>
                        <td className="px-5 py-3 text-sm text-admin-text-primary">
                          {product.categoryName}
                        </td>
                        <td className="px-5 py-3">
                          <ProductStatus status={product.status} />
                        </td>
                        <td className="px-5 py-3 text-sm text-admin-text-primary">
                          {formatPrice(product.priceUsd)}
                        </td>
                        <td className="px-5 py-3 text-sm text-admin-text-secondary">
                          {product.isRecommended ? '是' : '否'}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <a
                              href={`/zh-CN/products/${product.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-admin-text-secondary transition hover:bg-slate-100"
                            >
                              <Eye className="h-4 w-4" />
                              预览
                            </a>
                            <button
                              type="button"
                              aria-label={`编辑 ${product.nameZh}`}
                              onClick={() => openEditEditor(product.id)}
                              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-admin-accent transition hover:bg-blue-50"
                            >
                              <Edit3 className="h-4 w-4" />
                              编辑商品
                            </button>
                            <button
                              type="button"
                              aria-label={`归档商品 ${product.nameZh}`}
                              onClick={() => void archiveProduct(product.id)}
                              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
                            >
                              <Archive className="h-4 w-4" />
                              归档商品
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex min-h-0 flex-1 items-center justify-center p-5">
                <EmptyState
                  title={activeCategory ? '该类目暂无商品' : '暂无商品'}
                  description="新增商品并发布后，前台商品展示会同步更新。"
                />
              </div>
            )}
            {showProductPagination ? (
              <footer className="flex shrink-0 flex-col gap-3 border-t border-admin-border bg-admin-elevated px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs font-medium text-admin-text-muted">
                  第 {visibleProductPage} / {totalProductPages} 页 · 共{' '}
                  {filteredProducts.length} 个商品
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label="上一页"
                    disabled={visibleProductPage === 1}
                    onClick={() =>
                      setCurrentProductPage((page) => Math.max(1, page - 1))
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-admin-border bg-white text-admin-text-secondary transition hover:border-admin-border-strong disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="下一页"
                    disabled={visibleProductPage === totalProductPages}
                    onClick={() =>
                      setCurrentProductPage((page) =>
                        Math.min(totalProductPages, page + 1)
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-admin-border bg-white text-admin-text-secondary transition hover:border-admin-border-strong disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </footer>
            ) : null}
          </section>
        </main>
      </div>

      <ProductEditorDrawer
        categories={categories}
        product={selectedProduct}
        mode={editorMode}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSaved={(message) => setNotice(message)}
      />
      <CategoryEditorDrawer
        categories={categories}
        category={selectedCategory}
        mode={categoryEditorMode}
        isOpen={isCategoryEditorOpen}
        onClose={() => setIsCategoryEditorOpen(false)}
      />
    </section>
  );
}

function CategoryItem({
  category,
  isSelected,
  onSelect,
  onEdit
}: {
  category: ProductCenterCategory;
  isSelected: boolean;
  onSelect: (categoryId: string) => void;
  onEdit: (categoryId: string) => void;
}) {
  return (
    <div
      className={`group flex items-center justify-between gap-3 rounded-lg border p-3 transition ${
        isSelected
          ? 'border-admin-accent/25 bg-blue-50 text-admin-accent'
          : category.isActive
          ? 'border-admin-border bg-white text-admin-text-secondary hover:bg-admin-elevated'
          : 'border-admin-border bg-white text-admin-text-secondary hover:bg-admin-elevated'
      }`}
    >
      <button
        type="button"
        aria-pressed={isSelected}
        onClick={() => onSelect(category.id)}
        className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
      >
        <span className="flex min-w-0 items-center gap-3">
          <FolderTree className="h-5 w-5 shrink-0" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold">{category.nameZh}</span>
            <span className="block truncate text-xs text-admin-text-muted">
              {category.nameEn}
            </span>
          </span>
        </span>
        <span className="shrink-0 rounded-full bg-white px-2 py-1 text-xs font-semibold text-admin-text-secondary ring-1 ring-admin-border">
          {category.productCount} 个商品
        </span>
      </button>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label={`编辑类目 ${category.nameZh}`}
          onClick={() => onEdit(category.id)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-admin-text-muted transition hover:bg-white hover:text-admin-accent"
        >
          <Edit3 className="h-4 w-4" />
        </button>
        <form action={deleteCategoryFormAction.bind(null, category.id)}>
          <button
            type="submit"
            aria-label={`删除类目 ${category.nameZh}`}
            title="删除类目"
            className="flex h-8 w-8 items-center justify-center rounded-md text-admin-text-muted transition hover:bg-white hover:text-rose-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

function CategoryEditorDrawer({
  categories,
  category,
  mode,
  isOpen,
  onClose
}: {
  categories: ProductCenterCategory[];
  category: ProductCenterCategory | null;
  mode: 'create' | 'edit';
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) {
    return null;
  }

  const isCreate = mode === 'create';
  const formAction =
    !isCreate && category
      ? updateCategoryFormAction.bind(null, category.id)
      : createCategoryFormAction;
  const parentOptions = categories.filter((item) => item.id !== category?.id);

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-editor-title"
      className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[560px] flex-col border-l border-admin-border bg-white shadow-[-24px_0_48px_rgba(15,23,42,0.12)]"
    >
      <div className="flex items-center justify-between border-b border-admin-border bg-admin-elevated px-5 py-4">
        <div>
          <h3 id="category-editor-title" className="text-base font-bold text-admin-text-primary">
            {isCreate ? '新建类目' : '编辑类目'}
          </h3>
          <p className="mt-0.5 text-xs text-admin-text-muted">
            {isCreate ? '保存后留在商品管理页继续维护商品。' : '修改类目信息后同步刷新商品管理页。'}
          </p>
        </div>
        <button
          type="button"
          aria-label={isCreate ? '关闭新建类目' : '关闭编辑类目'}
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-admin-text-muted transition hover:bg-white hover:text-admin-text-primary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form action={formAction} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="父级类目">
              <select
                name="parentId"
                defaultValue={category?.parentId ?? ''}
                className={drawerInputClass}
              >
                <option value="">一级类目</option>
                {parentOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.nameZh}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Slug">
              <input
                name="slug"
                defaultValue={category?.slug ?? ''}
                className={drawerInputClass}
                placeholder="humanoid-robots"
              />
            </Field>
            <Field label="排序">
              <input
                name="sortOrder"
                defaultValue={category?.sortOrder ?? 0}
                className={drawerInputClass}
                type="number"
              />
            </Field>
            <Field label="图标 URL">
              <input
                name="iconImageUrl"
                defaultValue={category?.iconImageUrl ?? ''}
                className={drawerInputClass}
                placeholder="/show/robot_humanoid.png"
              />
            </Field>
            <Field label="中文名称">
              <input name="nameZh" defaultValue={category?.nameZh ?? ''} className={drawerInputClass} />
            </Field>
            <Field label="英文名称">
              <input name="nameEn" defaultValue={category?.nameEn ?? ''} className={drawerInputClass} />
            </Field>
            <Field label="西语名称">
              <input
                name="nameEs"
                defaultValue={category?.nameEs ?? category?.nameEn ?? ''}
                className={drawerInputClass}
              />
            </Field>
            <Field label="葡语名称">
              <input
                name="namePt"
                defaultValue={category?.namePt ?? category?.nameEn ?? ''}
                className={drawerInputClass}
              />
            </Field>
            <Field label="中文描述" className="md:col-span-2">
              <textarea
                name="descriptionZh"
                defaultValue={category?.descriptionZh ?? ''}
                className={`${drawerInputClass} min-h-[84px] resize-y`}
              />
            </Field>
            <Field label="英文描述" className="md:col-span-2">
              <textarea
                name="descriptionEn"
                defaultValue={category?.descriptionEn ?? ''}
                className={`${drawerInputClass} min-h-[84px] resize-y`}
              />
            </Field>
            <Field label="西语描述" className="md:col-span-2">
              <textarea
                name="descriptionEs"
                defaultValue={category?.descriptionEs ?? ''}
                className={`${drawerInputClass} min-h-[84px] resize-y`}
              />
            </Field>
            <Field label="葡语描述" className="md:col-span-2">
              <textarea
                name="descriptionPt"
                defaultValue={category?.descriptionPt ?? ''}
                className={`${drawerInputClass} min-h-[84px] resize-y`}
              />
            </Field>
            <label className="flex items-center gap-2 rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm text-admin-text-secondary md:col-span-2">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked={category?.isActive ?? true}
                className="h-4 w-4 rounded border-admin-border bg-admin-surface text-admin-accent focus:ring-admin-accent/30"
              />
              启用类目
            </label>
          </div>
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-admin-border bg-admin-elevated px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-admin-border bg-white px-4 py-2 text-sm font-semibold text-admin-text-secondary transition hover:border-admin-border-strong"
          >
            取消
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-admin-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-admin-accent-hover"
          >
            <Check className="h-4 w-4" />
            保存类目
          </button>
        </footer>
      </form>
    </aside>
  );
}

function ProductEditorDrawer({
  categories,
  product,
  mode,
  isOpen,
  onClose,
  onSaved
}: {
  categories: ProductCenterCategory[];
  product: ProductCenterRow | null;
  mode: 'create' | 'edit';
  isOpen: boolean;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <ProductEditorDrawerContent
      categories={categories}
      product={product}
      mode={mode}
      onClose={onClose}
      onSaved={onSaved}
    />
  );
}

function ProductEditorDrawerContent({
  categories,
  product,
  mode,
  onClose,
  onSaved
}: {
  categories: ProductCenterCategory[];
  product: ProductCenterRow | null;
  mode: 'create' | 'edit';
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState('');
  const isCreate = mode === 'create';
  const formAction =
    !isCreate && product
      ? updateProductFormAction.bind(null, product.id)
      : createProductFormAction;
  const handleFormAction = async (formData: FormData) => {
    try {
      setFormError('');
      await formAction(formData);
      onSaved(isCreate ? '商品已新增。' : '商品已保存。');
      router.refresh();
      onClose();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : '保存失败，请检查表单。');
    }
  };
  const galleryUrls = [...(product?.images ?? [])]
    .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0))
    .map((image) => image.imageUrl)
    .join('\n');

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-editor-title"
      className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[620px] flex-col border-l border-admin-border bg-white shadow-[-24px_0_48px_rgba(15,23,42,0.12)]"
    >
      <div className="flex items-center justify-between border-b border-admin-border bg-admin-elevated px-5 py-4">
        <div>
          <h3 id="product-editor-title" className="text-base font-bold text-admin-text-primary">
            {isCreate ? '新增商品' : '编辑商品'}
          </h3>
          <p className="mt-0.5 text-xs text-admin-text-muted">
            {isCreate ? '填写商品信息后保存到后台。' : '修改后保存，前台按发布状态展示。'}
          </p>
        </div>
        <button
          type="button"
          aria-label={isCreate ? '关闭新增商品' : '关闭编辑商品'}
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-admin-text-muted transition hover:bg-white hover:text-admin-text-primary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form action={handleFormAction} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase text-admin-text-muted">产品媒体</h4>
              <span className="text-xs text-admin-text-muted">
                {(product?.images.length ?? 0)}/10
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {product?.coverImageUrl ? (
                <div className="relative aspect-square overflow-hidden rounded-lg border border-admin-border bg-slate-100">
                  <NextImage
                    src={product.coverImageUrl}
                    alt={product.nameZh}
                    fill
                    sizes="160px"
                    className="object-cover"
                    unoptimized
                  />
                  <span className="absolute left-1.5 top-1.5 rounded bg-admin-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
                    主图
                  </span>
                </div>
              ) : null}
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-admin-text-muted">基础信息</h4>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="商品编码">
                <input name="productCode" defaultValue={product?.productCode} className={drawerInputClass} />
              </Field>
              <Field label="Slug">
                <input name="slug" defaultValue={product?.slug} className={drawerInputClass} />
              </Field>
              <Field label="类别">
                <select
                  name="categoryId"
                  defaultValue={product?.categoryId ?? ''}
                  className={drawerInputClass}
                >
                  <option value="">选择类别</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nameZh}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="价格 USD">
                <input
                  name="priceUsd"
                  defaultValue={product?.priceUsd ?? ''}
                  className={drawerInputClass}
                />
              </Field>
              <Field label="排序">
                <input
                  name="sortOrder"
                  defaultValue={product?.sortOrder ?? 0}
                  className={drawerInputClass}
                  type="number"
                />
              </Field>
              <Field label="状态">
                <select name="status" defaultValue={product?.status ?? 'draft'} className={drawerInputClass}>
                  <option value="draft">draft</option>
                  <option value="pending">pending</option>
                  <option value="published">published</option>
                  <option value="archived">archived</option>
                </select>
              </Field>
              <div className="md:col-span-2">
                <AdminImageUploadInput
                  name="coverImageUrl"
                  label="封面图 URL"
                  uploadLabel="上传封面"
                  defaultValue={product?.coverImageUrl ?? ''}
                  placeholder="https://..."
                  scope="product"
                />
              </div>
              <div className="md:col-span-2">
                <AdminImageUploadInput
                  name="galleryImageUrls"
                  label="图库图片 URL"
                  uploadLabel="上传图库"
                  defaultValue={galleryUrls}
                  placeholder="每行一条 URL"
                  scope="product"
                  multiline
                />
              </div>
              <label className="flex items-center gap-2 rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm text-admin-text-secondary md:col-span-2">
                <input
                  name="isRecommended"
                  type="checkbox"
                  defaultChecked={product?.isRecommended ?? false}
                  className="h-4 w-4 rounded border-admin-border bg-admin-surface text-admin-accent focus:ring-admin-accent/30"
                />
                推荐商品
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-admin-text-muted">多语言内容</h4>
            <div className="grid gap-3 md:grid-cols-2">
              {([
                ['nameZh', '中文名称', product?.nameZh],
                ['nameEn', '英文名称', product?.nameEn],
                ['nameEs', '西语名称', product?.nameEs],
                ['namePt', '葡语名称', product?.namePt],
                ['introZh', '中文简介', product?.introZh],
                ['introEn', '英文简介', product?.introEn],
                ['introEs', '西语简介', product?.introEs],
                ['introPt', '葡语简介', product?.introPt]
              ] as Array<[string, string, string | undefined]>).map(([name, label, value]) => (
                <Field key={name} label={label}>
                  <input name={name} defaultValue={value} className={drawerInputClass} />
                </Field>
              ))}
            </div>
            {([
              ['detailZh', '中文详情', product?.detailZh],
              ['detailEn', '英文详情', product?.detailEn],
              ['detailEs', '西语详情', product?.detailEs],
              ['detailPt', '葡语详情', product?.detailPt]
            ] as Array<[string, string, string | undefined]>).map(([name, label, value]) => (
              <Field key={name} label={label}>
                <textarea
                  name={name}
                  defaultValue={value}
                  className={`${drawerInputClass} min-h-[96px] resize-y`}
                />
              </Field>
            ))}
          </section>
        </div>

        <footer className="flex items-center justify-end gap-3 border-t border-admin-border bg-admin-elevated px-5 py-4">
          {formError ? (
            <p className="mr-auto text-sm font-medium text-rose-600">{formError}</p>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-admin-border bg-white px-4 py-2 text-sm font-semibold text-admin-text-secondary transition hover:border-admin-border-strong"
          >
            取消
          </button>
          <ProductEditorSubmitButton />
        </footer>
      </form>
    </aside>
  );
}

function ProductEditorSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-lg bg-admin-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-admin-accent-hover disabled:cursor-wait disabled:opacity-70"
    >
      <Check className="h-4 w-4" />
      {pending ? '保存中...' : '保存更改'}
    </button>
  );
}

const drawerInputClass =
  'w-full rounded-lg border border-admin-border bg-admin-surface px-3 py-2 text-sm text-admin-text-primary outline-none transition focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/15';

function Field({
  label,
  className = '',
  children
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="text-xs font-semibold uppercase text-admin-text-secondary">
        {label}
      </span>
      {children}
    </label>
  );
}

function ColumnHeader({
  children,
  align = 'left'
}: {
  children: React.ReactNode;
  align?: 'left' | 'right';
}) {
  return (
    <th
      className={`px-4 py-3 text-xs font-bold uppercase text-admin-text-muted ${
        align === 'right' ? 'text-right' : 'text-left'
      }`}
    >
      {children}
    </th>
  );
}

function ProductThumb({ product }: { product: ProductCenterRow }) {
  return (
    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-admin-border bg-slate-100">
      {product.coverImageUrl ? (
        <NextImage
          src={product.coverImageUrl}
          alt={product.nameZh}
          fill
          sizes="48px"
          className="object-cover"
          unoptimized
        />
      ) : (
        <Package className="h-5 w-5 text-admin-text-muted" />
      )}
    </div>
  );
}

function ProductStatus({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
        statusStyles[status] ?? 'bg-slate-100 text-slate-700 ring-slate-200'
      }`}
    >
      {status}
    </span>
  );
}

function filterButtonClass(isActive: boolean) {
  return `inline-flex h-10 items-center rounded-lg border px-3 text-sm font-semibold transition ${
    isActive
      ? 'border-admin-accent bg-emerald-50 text-admin-accent'
      : 'border-admin-border bg-white text-admin-text-secondary hover:border-admin-border-strong'
  }`;
}

function EmptyState({
  title,
  description
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-admin-border bg-admin-elevated px-6 py-10 text-center">
      <Package className="h-8 w-8 text-admin-text-muted" />
      <p className="mt-3 text-sm font-semibold text-admin-text-primary">{title}</p>
      <p className="mt-1 text-xs text-admin-text-muted">{description}</p>
    </div>
  );
}

function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}
