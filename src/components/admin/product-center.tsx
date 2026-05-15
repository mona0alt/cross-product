'use client';

import React, { useEffect, useRef, useState } from 'react';
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
  ImagePlus,
  MoreHorizontal,
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
import {
  ADMIN_IMAGE_ACCEPT,
  ADMIN_IMAGE_UPLOAD_HINT,
  getAdminUploadErrorMessage,
  validateAdminUploadFile,
  type AdminUploadStatusTone
} from '@/features/admin/upload-rules';

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

type ProductActionMenuEvent =
  | {
      action: 'toggle';
      productId: string;
    }
  | {
      action: 'outside' | 'escape';
    };

export function getProductFilterUpdate({
  filter,
  activeCategoryId,
  selectedProductIds
}: {
  filter: ProductStatusFilter;
  activeCategoryId: string | null;
  selectedProductIds: string[];
}) {
  return {
    statusFilter: filter,
    activeCategoryId: filter === 'all' ? null : activeCategoryId,
    selectedProductIds: filter === 'all' ? [] : selectedProductIds
  };
}

export function getProductActionMenuState({
  currentOpenProductId,
  ...event
}: {
  currentOpenProductId: string | null;
} & ProductActionMenuEvent) {
  if (event.action === 'toggle') {
    return currentOpenProductId === event.productId ? null : event.productId;
  }

  return null;
}

type ProductCenterCopy = {
  listTitle: string;
  categoryTitle: string;
  searchPlaceholder: string;
  actionsLabel: string;
  filterLabel: string;
  allProducts: string;
  pendingQueue: string;
  recommendedProducts: string;
  exportCsv: string;
  newProduct: string;
  addCategory: string;
  emptyCategoriesTitle: string;
  emptyCategoriesDescription: string;
  selectedProducts: string;
  bulkRecommend: string;
  bulkUnrecommend: string;
  bulkArchive: string;
  scrollAreaLabel: string;
  selectCurrentPage: string;
  columns: {
    name: string;
    category: string;
    status: string;
    price: string;
    recommended: string;
    actions: string;
  };
  yes: string;
  no: string;
  previousPage: string;
  nextPage: string;
  pagination: string;
  editProductLabel: string;
  productActionLabel: string;
  productActionMenuLabel: string;
  editCategoryLabel: string;
  deleteCategoryLabel: string;
  deleteCategoryTitle: string;
  productCount: string;
  emptyProductsTitle: string;
  emptyCategoryProductsTitle: string;
  emptyProductsDescription: string;
};

const defaultProductCenterCopy: ProductCenterCopy = {
  listTitle: '商品管理',
  categoryTitle: '产品类目',
  searchPlaceholder: '搜索商品...',
  actionsLabel: '商品管理操作',
  filterLabel: '商品筛选',
  allProducts: '全部商品',
  pendingQueue: '待审核队列',
  recommendedProducts: '推荐商品',
  exportCsv: '导出 CSV',
  newProduct: '新增商品',
  addCategory: '添加类目',
  emptyCategoriesTitle: '暂无分类',
  emptyCategoriesDescription: '创建分类后，商品可挂载到对应类目。',
  selectedProducts: '已选择 {count} 个商品',
  bulkRecommend: '批量推荐',
  bulkUnrecommend: '取消推荐',
  bulkArchive: '批量归档',
  scrollAreaLabel: '商品列表滚动区域',
  selectCurrentPage: '选择当前页商品',
  columns: {
    name: '产品名称',
    category: '类别',
    status: '状态',
    price: '价格',
    recommended: '推荐',
    actions: '操作'
  },
  yes: '是',
  no: '否',
  previousPage: '上一页',
  nextPage: '下一页',
  pagination: '第 {page} / {totalPages} 页 · 共 {total} 个商品',
  editProductLabel: '编辑商品 {name}',
  productActionLabel: '商品操作 {name}',
  productActionMenuLabel: '商品操作菜单 {name}',
  editCategoryLabel: '编辑类目 {name}',
  deleteCategoryLabel: '删除类目 {name}',
  deleteCategoryTitle: '删除类目',
  productCount: '{count} 个商品',
  emptyProductsTitle: '暂无商品',
  emptyCategoryProductsTitle: '该类目暂无商品',
  emptyProductsDescription: '新增商品并发布后，前台商品展示会同步更新。'
};

function formatCopy(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template
  );
}

export type ProductGalleryImageItem = {
  url: string;
  previewUrl?: string | null;
};
type ProductGalleryStatus = {
  tone: AdminUploadStatusTone;
  message: string;
};

export function getProductGalleryPreviewSrc(item: ProductGalleryImageItem) {
  return item.previewUrl || item.url.trim();
}

export function getProductGalleryHiddenValue(items: ProductGalleryImageItem[]) {
  return items
    .map((item) => item.url.trim())
    .filter(Boolean)
    .slice(0, 10)
    .join('\n');
}

function getProductGalleryItems(urls: string[]): ProductGalleryImageItem[] {
  return urls.map((url) => ({ url }));
}

function getFormStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === 'string' ? value.trim() : '';
}

function getGalleryUrlsFromFormData(formData: FormData) {
  return getFormStringValue(formData, 'galleryImageUrls')
    .split(/\r?\n/)
    .map((url) => url.trim())
    .filter((url) => url.startsWith('/') && !url.startsWith('//'))
    .slice(0, 10);
}

export function getProductRowAfterFormSave(
  product: ProductCenterRow,
  formData: FormData
): ProductCenterRow {
  const coverImageUrl =
    getFormStringValue(formData, 'coverImageUrl') || product.coverImageUrl;
  const galleryUrls = getGalleryUrlsFromFormData(formData);

  return {
    ...product,
    coverImageUrl,
    images: galleryUrls.map((imageUrl, sortOrder) => ({
      imageUrl,
      sortOrder
    }))
  };
}

export function getProductEditorSubmitState({
  isUploadPending
}: {
  isUploadPending: boolean;
}) {
  return isUploadPending
    ? {
        disabled: true,
        label: '图片上传中...'
      }
    : {
        disabled: false,
        label: '保存更改'
      };
}

export async function saveCategoryEditorForm({
  formAction,
  formData,
  router,
  onClose,
  onSaved,
  isCreate
}: {
  formAction: (formData: FormData) => Promise<unknown>;
  formData: FormData;
  router: {
    refresh: () => void;
  };
  onClose: () => void;
  onSaved: (message: string) => void;
  isCreate: boolean;
}) {
  await formAction(formData);
  onSaved(isCreate ? '类目已新增。' : '类目已保存。');
  router.refresh();
  onClose();
}

export const NOTICE_AUTO_DISMISS_MS = 4000;

export function scheduleNoticeDismiss(
  onDismiss: () => void,
  timeoutMs = NOTICE_AUTO_DISMISS_MS
) {
  const timeoutId = setTimeout(onDismiss, timeoutMs);

  return () => clearTimeout(timeoutId);
}

const productNameCollator = new Intl.Collator('en', {
  numeric: true,
  sensitivity: 'base'
});

function getProductNameSortValue(product: ProductCenterRow) {
  return (
    product.nameEn.trim() ||
    product.nameZh.trim() ||
    product.slug.trim() ||
    product.productCode.trim()
  );
}

export function sortProductRowsByName(products: ProductCenterRow[]) {
  return [...products].sort((left, right) => {
    const byName = productNameCollator.compare(
      getProductNameSortValue(left),
      getProductNameSortValue(right)
    );

    if (byName !== 0) {
      return byName;
    }

    return productNameCollator.compare(left.productCode, right.productCode);
  });
}

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
  defaultSelectedProductIds = [],
  defaultOpenActionMenuProductId,
  copy = defaultProductCenterCopy
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
  defaultOpenActionMenuProductId?: string;
  copy?: ProductCenterCopy;
}) {
  const [productRows, setProductRows] = useState(() => sortProductRowsByName(products));
  const firstProductId = productRows[0]?.id ?? null;
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
  const [openActionMenuProductId, setOpenActionMenuProductId] = useState<
    string | null
  >(defaultOpenActionMenuProductId ?? null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setProductRows(sortProductRowsByName(products));
  }, [products]);

  useEffect(() => {
    if (!notice) {
      return;
    }

    return scheduleNoticeDismiss(() => setNotice(''));
  }, [notice]);

  const selectedProduct =
    selectedProductId === null
      ? null
      : productRows.find((product) => product.id === selectedProductId) ?? null;
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
      ? productRows
      : productRows.filter((product) => product.categoryId === activeCategoryId);
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

  useEffect(() => {
    if (openActionMenuProductId === null) {
      return;
    }

    const closeOnPointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (
        target instanceof Element &&
        target.closest('[data-product-action-menu]')
      ) {
        return;
      }

      setOpenActionMenuProductId((currentOpenProductId) =>
        getProductActionMenuState({
          currentOpenProductId,
          action: 'outside'
        })
      );
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      setOpenActionMenuProductId((currentOpenProductId) =>
        getProductActionMenuState({
          currentOpenProductId,
          action: 'escape'
        })
      );
    };

    document.addEventListener('pointerdown', closeOnPointerDown);
    document.addEventListener('keydown', closeOnEscape);

    return () => {
      document.removeEventListener('pointerdown', closeOnPointerDown);
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [openActionMenuProductId]);

  const openCreateEditor = () => {
    setSelectedProductId(null);
    setEditorMode('create');
    setOpenActionMenuProductId(null);
    setIsEditorOpen(true);
  };

  const openEditEditor = (productId: string) => {
    setSelectedProductId(productId);
    setEditorMode('edit');
    setOpenActionMenuProductId(null);
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
    setOpenActionMenuProductId(null);
    setSelectedProductIds([]);
  };

  const archiveProduct = async (productId: string) => {
    setOpenActionMenuProductId(null);
    await archiveProductFromListAction(productId);
    setNotice('商品已归档。');
    setSelectedProductIds((current) => current.filter((id) => id !== productId));
  };

  const updateStatusFilter = (filter: ProductStatusFilter) => {
    const nextFilterState = getProductFilterUpdate({
      filter,
      activeCategoryId,
      selectedProductIds
    });

    setStatusFilter(nextFilterState.statusFilter);
    setActiveCategoryId(nextFilterState.activeCategoryId);
    setSelectedProductIds(nextFilterState.selectedProductIds);
    setOpenActionMenuProductId(null);
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
    <section className="relative flex h-[calc(100vh-104px)] flex-col overflow-hidden rounded-xl border border-admin-border bg-admin-bg shadow-sm">
      <header className="flex shrink-0 flex-col gap-4 border-b border-admin-border bg-white px-4 py-4 xl:flex-row xl:items-center xl:justify-between lg:px-5">
        <div className="flex min-w-0 flex-1 flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-admin-accent">
              <Package className="h-4 w-4" />
            </div>
            <h2 className="shrink-0 text-xl font-bold text-admin-text-primary">
              {copy.listTitle}
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
              placeholder={copy.searchPlaceholder}
              className="h-10 w-full rounded-lg border border-admin-border bg-admin-elevated pl-9 pr-3 text-sm text-admin-text-primary outline-none transition focus:border-admin-accent focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
            />
          </label>
        </div>
        <div
          role="group"
          aria-label={copy.actionsLabel}
          className="flex shrink-0 flex-wrap items-center gap-2 xl:max-w-[680px] xl:justify-end 2xl:max-w-none"
        >
          <div
            role="group"
            aria-label={copy.filterLabel}
            className="inline-flex h-10 items-center gap-1 rounded-lg border border-admin-border bg-admin-elevated p-1"
          >
            <button
              type="button"
              onClick={() => updateStatusFilter('all')}
              className={filterButtonClass(
                statusFilter === 'all' && activeCategoryId === null
              )}
            >
              {copy.allProducts}
            </button>
            <button
              type="button"
              onClick={() => updateStatusFilter('pending')}
              className={filterButtonClass(statusFilter === 'pending')}
            >
              {copy.pendingQueue}
            </button>
            <button
              type="button"
              onClick={() => updateStatusFilter('recommended')}
              className={filterButtonClass(statusFilter === 'recommended')}
            >
              {copy.recommendedProducts}
            </button>
          </div>
          <button
            type="button"
            onClick={exportFilteredProducts}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg border border-admin-border bg-white px-4 text-sm font-semibold text-admin-text-secondary transition hover:border-admin-border-strong hover:bg-admin-elevated focus:outline-none focus:ring-2 focus:ring-admin-accent/20"
          >
            <Download className="h-4 w-4" />
            {copy.exportCsv}
          </button>
          <button
            type="button"
            onClick={openCreateEditor}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-admin-accent px-4 text-sm font-semibold text-white transition hover:bg-admin-accent-hover focus:outline-none focus:ring-2 focus:ring-admin-accent/20"
          >
            <CirclePlus className="h-4 w-4" />
            {copy.newProduct}
          </button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 gap-5 bg-admin-bg p-4 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:p-5">
        <aside className="min-h-0 overflow-y-auto rounded-xl border border-admin-border bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-admin-text-primary">{copy.categoryTitle}</h3>
            <button
              type="button"
              onClick={openCreateCategoryEditor}
              className="inline-flex items-center gap-1.5 rounded-lg bg-admin-accent px-3 py-2 text-sm font-semibold text-white transition hover:bg-admin-accent-hover"
            >
              <CirclePlus className="h-4 w-4" />
              {copy.addCategory}
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
                  copy={copy}
                />
              ))}
            </div>
          ) : (
            <EmptyState title={copy.emptyCategoriesTitle} description={copy.emptyCategoriesDescription} />
          )}
        </aside>

        <main className="flex min-h-0 flex-col gap-3">
            {notice ? (
              <p className="shrink-0 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                {notice}
              </p>
            ) : null}
            {selectedProductIds.length > 0 ? (
              <div className="flex shrink-0 flex-wrap items-center gap-2 rounded-lg border border-admin-border bg-white px-3 py-2 text-sm text-admin-text-secondary shadow-sm">
                <span className="font-semibold">
                  {formatCopy(copy.selectedProducts, { count: selectedProductIds.length })}
                </span>
                <button
                  type="button"
                  onClick={() => void applyBulkOperation('recommend')}
                  className="inline-flex items-center gap-1 rounded-md border border-admin-border bg-white px-3 py-1.5 text-xs font-semibold transition hover:border-admin-border-strong"
                >
                  <Star className="h-3.5 w-3.5" />
                  {copy.bulkRecommend}
                </button>
                <button
                  type="button"
                  onClick={() => void applyBulkOperation('unrecommend')}
                  className="rounded-md border border-admin-border bg-white px-3 py-1.5 text-xs font-semibold transition hover:border-admin-border-strong"
                >
                  {copy.bulkUnrecommend}
                </button>
                <button
                  type="button"
                  onClick={() => void applyBulkOperation('archive')}
                  className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:border-rose-300"
                >
                  <Archive className="h-3.5 w-3.5" />
                  {copy.bulkArchive}
                </button>
              </div>
            ) : null}

          <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-admin-border bg-white shadow-sm">
            {filteredProducts.length > 0 ? (
              <div
                aria-label={copy.scrollAreaLabel}
                className="min-h-0 flex-1 overflow-auto [scrollbar-gutter:stable]"
              >
                <table className="w-full min-w-[1040px] border-separate border-spacing-0 text-left">
                  <thead className="bg-admin-elevated text-admin-text-muted">
                    <tr>
                      <ColumnHeader>
                        <input
                          type="checkbox"
                          aria-label={copy.selectCurrentPage}
                          checked={allVisibleProductsSelected}
                          onChange={toggleVisibleProductSelection}
                          className="h-4 w-4 rounded border-admin-border text-admin-accent"
                        />
                      </ColumnHeader>
                      <ColumnHeader>{copy.columns.name}</ColumnHeader>
                      <ColumnHeader>SKU</ColumnHeader>
                      <ColumnHeader>{copy.columns.category}</ColumnHeader>
                      <ColumnHeader>{copy.columns.status}</ColumnHeader>
                      <ColumnHeader>{copy.columns.price}</ColumnHeader>
                      <ColumnHeader>{copy.columns.recommended}</ColumnHeader>
                      <ColumnHeader align="right" className="w-28 pl-6 pr-8">
                        {copy.columns.actions}
                      </ColumnHeader>
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
                              <button
                                type="button"
                                aria-label={formatCopy(copy.editProductLabel, { name: product.nameZh })}
                                onClick={() => openEditEditor(product.id)}
                                className="block max-w-full truncate rounded text-left text-sm font-semibold text-admin-text-primary transition hover:text-admin-accent hover:underline focus:outline-none focus:ring-2 focus:ring-admin-accent/20"
                              >
                                {product.nameZh}
                              </button>
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
                          {product.isRecommended ? copy.yes : copy.no}
                        </td>
                        <td className="py-3 pl-6 pr-8 text-right">
                          <div className="flex justify-end gap-2">
                            <ProductActionMenu
                              product={product}
                              isOpen={openActionMenuProductId === product.id}
                              onToggle={() =>
                                setOpenActionMenuProductId((currentOpenProductId) =>
                                  getProductActionMenuState({
                                    currentOpenProductId,
                                    action: 'toggle',
                                    productId: product.id
                                  })
                                )
                              }
                              onArchive={() => void archiveProduct(product.id)}
                              copy={copy}
                            />
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
                  title={activeCategory ? copy.emptyCategoryProductsTitle : copy.emptyProductsTitle}
                  description={copy.emptyProductsDescription}
                />
              </div>
            )}
            {showProductPagination ? (
              <footer className="flex shrink-0 flex-col gap-3 border-t border-admin-border bg-admin-elevated px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs font-medium text-admin-text-muted">
                  {formatCopy(copy.pagination, {
                    page: visibleProductPage,
                    totalPages: totalProductPages,
                    total: filteredProducts.length
                  })}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    aria-label={copy.previousPage}
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
                    aria-label={copy.nextPage}
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
        onProductSaved={(productId, formData) => {
          setProductRows((currentRows) =>
            sortProductRowsByName(
              currentRows.map((currentProduct) =>
                currentProduct.id === productId
                  ? getProductRowAfterFormSave(currentProduct, formData)
                  : currentProduct
              )
            )
          );
        }}
        onSaved={(message) => setNotice(message)}
      />
      <CategoryEditorDrawer
        categories={categories}
        category={selectedCategory}
        mode={categoryEditorMode}
        isOpen={isCategoryEditorOpen}
        onClose={() => setIsCategoryEditorOpen(false)}
        onSaved={(message) => setNotice(message)}
      />
    </section>
  );
}

function ProductActionMenu({
  product,
  isOpen,
  onToggle,
  onArchive,
  copy
}: {
  product: ProductCenterRow;
  isOpen: boolean;
  onToggle: () => void;
  onArchive: () => void;
  copy: ProductCenterCopy;
}) {
  return (
    <div className="relative inline-flex" data-product-action-menu>
      <button
        type="button"
        aria-label={formatCopy(copy.productActionLabel, { name: product.nameZh })}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={onToggle}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border text-admin-text-secondary transition focus:outline-none focus:ring-2 focus:ring-admin-accent/20 ${
          isOpen
            ? 'border-admin-accent/30 bg-emerald-50 text-admin-accent shadow-sm'
            : 'border-transparent bg-transparent hover:border-admin-border hover:bg-admin-elevated active:bg-slate-100'
        }`}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {isOpen ? (
        <div
          role="menu"
          aria-label={formatCopy(copy.productActionMenuLabel, { name: product.nameZh })}
          className="absolute right-0 top-10 z-30 w-44 rounded-xl border border-admin-border bg-white p-1.5 text-left shadow-xl ring-1 ring-black/5"
        >
          <a
            role="menuitem"
            href={`/zh-CN/products/${product.slug}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-admin-text-secondary transition hover:bg-admin-elevated hover:text-admin-text-primary focus:outline-none focus:ring-2 focus:ring-admin-accent/20"
          >
            <Eye className="h-4 w-4 text-admin-text-muted" />
            预览前台
          </a>
          <button
            type="button"
            role="menuitem"
            aria-label={`归档商品 ${product.nameZh}`}
            onClick={onArchive}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-200"
          >
            <Archive className="h-4 w-4" />
            归档商品
          </button>
        </div>
      ) : null}
    </div>
  );
}

function CategoryItem({
  category,
  isSelected,
  onSelect,
  onEdit,
  copy
}: {
  category: ProductCenterCategory;
  isSelected: boolean;
  onSelect: (categoryId: string) => void;
  onEdit: (categoryId: string) => void;
  copy: ProductCenterCopy;
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
          {category.iconImageUrl ? (
            <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-admin-border bg-white">
              <NextImage
                src={category.iconImageUrl}
                alt={category.nameZh}
                fill
                sizes="36px"
                className="object-cover"
                unoptimized
              />
            </span>
          ) : (
            <FolderTree className="h-5 w-5 shrink-0" />
          )}
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold">{category.nameZh}</span>
            <span className="block truncate text-xs text-admin-text-muted">
              {category.nameEn}
            </span>
          </span>
        </span>
        <span className="shrink-0 rounded-full bg-white px-2 py-1 text-xs font-semibold text-admin-text-secondary ring-1 ring-admin-border">
          {formatCopy(copy.productCount, { count: category.productCount })}
        </span>
      </button>
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          aria-label={formatCopy(copy.editCategoryLabel, { name: category.nameZh })}
          onClick={() => onEdit(category.id)}
          className="flex h-8 w-8 items-center justify-center rounded-md text-admin-text-muted transition hover:bg-white hover:text-admin-accent"
        >
          <Edit3 className="h-4 w-4" />
        </button>
        <form action={deleteCategoryFormAction.bind(null, category.id)}>
          <button
            type="submit"
            aria-label={formatCopy(copy.deleteCategoryLabel, { name: category.nameZh })}
            title={copy.deleteCategoryTitle}
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
  onClose,
  onSaved
}: {
  categories: ProductCenterCategory[];
  category: ProductCenterCategory | null;
  mode: 'create' | 'edit';
  isOpen: boolean;
  onClose: () => void;
  onSaved: (message: string) => void;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState('');

  if (!isOpen) {
    return null;
  }

  const isCreate = mode === 'create';
  const formAction =
    !isCreate && category
      ? updateCategoryFormAction.bind(null, category.id)
      : createCategoryFormAction;
  const handleFormAction = async (formData: FormData) => {
    try {
      setFormError('');
      await saveCategoryEditorForm({
        formAction,
        formData,
        router,
        onClose,
        onSaved,
        isCreate
      });
    } catch (error) {
      setFormError(error instanceof Error ? error.message : '保存失败，请检查表单。');
    }
  };
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

      <form action={handleFormAction} className="flex min-h-0 flex-1 flex-col">
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
            <div className="md:col-span-2">
              <AdminImageUploadInput
                name="iconImageUrl"
                label="类目主图"
                uploadLabel="上传主图"
                defaultValue={category?.iconImageUrl ?? ''}
                scope="category"
                showPreview
                previewAlt={category?.nameZh ?? '类目主图'}
                clearLabel="移除类目主图"
              />
            </div>
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
  onProductSaved,
  onSaved
}: {
  categories: ProductCenterCategory[];
  product: ProductCenterRow | null;
  mode: 'create' | 'edit';
  isOpen: boolean;
  onClose: () => void;
  onProductSaved: (productId: string, formData: FormData) => void;
  onSaved: (message: string) => void;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <ProductEditorDrawerContent
      categories={categories}
      product={mode === 'create' ? null : product}
      mode={mode}
      onClose={onClose}
      onProductSaved={onProductSaved}
      onSaved={onSaved}
    />
  );
}

function ProductEditorDrawerContent({
  categories,
  product,
  mode,
  onClose,
  onProductSaved,
  onSaved
}: {
  categories: ProductCenterCategory[];
  product: ProductCenterRow | null;
  mode: 'create' | 'edit';
  onClose: () => void;
  onProductSaved: (productId: string, formData: FormData) => void;
  onSaved: (message: string) => void;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState('');
  const [isGalleryUploadPending, setIsGalleryUploadPending] = useState(false);
  const isCreate = mode === 'create';
  const formAction =
    !isCreate && product
      ? updateProductFormAction.bind(null, product.id)
      : createProductFormAction;
  const handleFormAction = async (formData: FormData) => {
    try {
      setFormError('');
      await formAction(formData);
      if (!isCreate && product) {
        onProductSaved(product.id, formData);
      }
      onSaved(isCreate ? '商品已新增。' : '商品已保存。');
      router.refresh();
      onClose();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : '保存失败，请检查表单。');
    }
  };
  const galleryUrls = [...(product?.images ?? [])]
    .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0))
    .map((image) => image.imageUrl);
  const categoryOptions =
    product &&
    product.categoryId &&
    !categories.some((category) => category.id === product.categoryId)
      ? [
          {
            id: product.categoryId,
            nameZh: product.categoryName
          },
          ...categories
        ]
      : categories;

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
                {galleryUrls.length}/10
              </span>
            </div>
            <div className="space-y-4 rounded-xl border border-admin-border bg-admin-surface p-4">
              <AdminImageUploadInput
                name="coverImageUrl"
                label="封面主图"
                uploadLabel="上传封面"
                defaultValue={product?.coverImageUrl ?? ''}
                scope="product"
                showPreview
                previewAlt={product?.nameZh ?? '商品封面主图'}
                clearLabel="移除封面主图"
              />
              <ProductGalleryImageManager
                defaultUrls={galleryUrls}
                onUploadPendingChange={setIsGalleryUploadPending}
              />
            </div>
            {isGalleryUploadPending ? (
              <p role="status" className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
                图片仍在上传，完成后才能保存商品。
              </p>
            ) : null}
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
                  {categoryOptions.map((category) => (
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
          <ProductEditorSubmitButton isUploadPending={isGalleryUploadPending} />
        </footer>
      </form>
    </aside>
  );
}

function ProductGalleryImageManager({
  defaultUrls,
  onUploadPendingChange
}: {
  defaultUrls: string[];
  onUploadPendingChange?: (isPending: boolean) => void;
}) {
  const defaultUrlsKey = defaultUrls.join('\n');
  const [items, setItems] = useState<ProductGalleryImageItem[]>(
    getProductGalleryItems(defaultUrls)
  );
  const [status, setStatus] = useState<ProductGalleryStatus | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const localPreviewUrlsRef = useRef<string[]>([]);
  const visibleItems = items
    .filter((item) => Boolean(getProductGalleryPreviewSrc(item)))
    .slice(0, 10);
  const canAddMore = visibleItems.length < 10;

  const revokePreviewUrl = (previewUrl: string | null | undefined) => {
    if (!previewUrl) {
      return;
    }

    URL.revokeObjectURL(previewUrl);
    localPreviewUrlsRef.current = localPreviewUrlsRef.current.filter(
      (currentUrl) => currentUrl !== previewUrl
    );
  };

  const revokeAllPreviewUrls = () => {
    for (const previewUrl of localPreviewUrlsRef.current) {
      URL.revokeObjectURL(previewUrl);
    }
    localPreviewUrlsRef.current = [];
  };

  useEffect(() => {
    revokeAllPreviewUrls();
    setItems(
      getProductGalleryItems(
        defaultUrlsKey ? defaultUrlsKey.split('\n') : []
      )
    );
  }, [defaultUrlsKey]);

  useEffect(
    () => () => {
      revokeAllPreviewUrls();
    },
    []
  );

  const removeUrl = (index: number) => {
    setItems((current) => {
      const item = visibleItems[index];

      if (item?.previewUrl) {
        revokePreviewUrl(item.previewUrl);
      }

      return current.filter((currentItem) => currentItem !== item);
    });
  };

  const uploadGalleryImage = async (file: File) => {
    if (!canAddMore) {
      setStatus({
        tone: 'error',
        message: '图库最多支持 10 张图片。请先删除一张再上传。'
      });
      return;
    }

    const validationError = validateAdminUploadFile(file);
    if (validationError) {
      setStatus({
        tone: 'error',
        message: getAdminUploadErrorMessage(validationError)
      });
      return;
    }

    const previewUrl =
      typeof URL.createObjectURL === 'function' ? URL.createObjectURL(file) : null;

    if (previewUrl) {
      localPreviewUrlsRef.current.push(previewUrl);
      setItems((current) => [...current, { url: '', previewUrl }].slice(0, 10));
    }

    const formData = new FormData();
    formData.set('file', file);
    formData.set('scope', 'product');
    setStatus({ tone: 'info', message: '正在上传图库图片...' });
    onUploadPendingChange?.(true);

    try {
      const response = await fetch('/api/admin/uploads/product-images', {
        method: 'POST',
        body: formData
      });
      const payload = (await response.json().catch(() => ({}))) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !payload.url) {
        setStatus({
          tone: 'error',
          message: getAdminUploadErrorMessage(payload.error ?? 'UPLOAD_FAILED')
        });
        if (previewUrl) {
          revokePreviewUrl(previewUrl);
          setItems((current) =>
            current.filter((item) => item.previewUrl !== previewUrl)
          );
        }
        return;
      }

      setItems((current) => {
        if (!previewUrl) {
          return [...current, { url: payload.url ?? '' }].slice(0, 10);
        }

        return current.map((item) =>
          item.previewUrl === previewUrl
            ? { ...item, url: payload.url ?? item.url }
            : item
        );
      });
      setStatus({ tone: 'success', message: '图库图片已上传。' });
    } finally {
      onUploadPendingChange?.(false);
    }
  };

  return (
    <div className="space-y-3">
      <input
        name="galleryImageUrls"
        type="hidden"
        value={getProductGalleryHiddenValue(items)}
        readOnly
      />
      <div className="flex items-center justify-between gap-3">
        <div>
          <h5 className="text-sm font-semibold text-admin-text-primary">商品图片管理</h5>
          <p className="text-xs text-admin-text-muted">图库图片</p>
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={!canAddMore}
          className="rounded-lg border border-admin-border bg-white px-3 py-1.5 text-xs font-semibold text-admin-text-secondary transition hover:border-admin-border-strong hover:text-admin-text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          上传图库
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept={ADMIN_IMAGE_ACCEPT}
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void uploadGalleryImage(file);
          }
          event.target.value = '';
        }}
      />
      <p className="text-xs text-admin-text-muted">{ADMIN_IMAGE_UPLOAD_HINT}</p>

      {visibleItems.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {visibleItems.map((item, index) => (
            <div
              key={`${getProductGalleryPreviewSrc(item)}-${index}`}
              className="overflow-hidden rounded-xl border border-admin-border bg-white"
            >
              <div className="relative aspect-[4/3] bg-admin-elevated">
                {/* eslint-disable-next-line @next/next/no-img-element -- Admin upload previews must support local blob URLs before the file is served publicly. */}
                <img
                  data-product-gallery-preview="true"
                  src={getProductGalleryPreviewSrc(item)}
                  alt={`商品图片 ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-2 top-2 rounded bg-slate-950/75 px-2 py-1 text-[10px] font-bold text-white">
                  #{index + 1}
                </span>
                <button
                  type="button"
                  aria-label={`删除商品图片 ${index + 1}`}
                  onClick={() => removeUrl(index)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-rose-700 shadow-sm transition hover:bg-rose-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium text-admin-text-muted">
                  本地图片 {index + 1}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[132px] flex-col items-center justify-center rounded-xl border border-dashed border-admin-border bg-white px-4 py-6 text-center text-sm text-admin-text-muted">
          <ImagePlus className="mb-2 h-5 w-5" />
          暂无图库图片
        </div>
      )}
      {status ? (
        <p
          role={status.tone === 'error' ? 'alert' : 'status'}
          aria-live="polite"
          className={
            status.tone === 'error'
              ? 'rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700'
              : status.tone === 'success'
              ? 'rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700'
              : 'rounded-lg border border-admin-border bg-admin-elevated px-3 py-2 text-xs font-medium text-admin-text-secondary'
          }
        >
          {status.message}
        </p>
      ) : null}
    </div>
  );
}

function ProductEditorSubmitButton({
  isUploadPending = false
}: {
  isUploadPending?: boolean;
}) {
  const { pending } = useFormStatus();
  const submitState = getProductEditorSubmitState({ isUploadPending });

  return (
    <button
      type="submit"
      disabled={pending || submitState.disabled}
      className="inline-flex items-center gap-2 rounded-lg bg-admin-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-admin-accent-hover disabled:cursor-wait disabled:opacity-70"
    >
      <Check className="h-4 w-4" />
      {pending ? '保存中...' : submitState.label}
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
  align = 'left',
  className = ''
}: {
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}) {
  return (
    <th
      className={`sticky top-0 z-10 bg-admin-elevated px-4 py-3 text-xs font-bold uppercase text-admin-text-muted ${
        align === 'right' ? 'text-right' : 'text-left'
      } ${className}`}
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
  return `inline-flex h-8 items-center rounded-md border px-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-admin-accent/20 ${
    isActive
      ? 'border-admin-accent/30 bg-white text-admin-accent shadow-sm'
      : 'border-transparent text-admin-text-secondary hover:bg-white hover:text-admin-text-primary'
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
