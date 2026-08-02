'use client';

import React, { useEffect, useRef, useState } from 'react';
import NextImage from 'next/image';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
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
import { AdminSelect, type AdminSelectOption } from '@/components/admin/admin-select';
import { AdminCategorySelect } from '@/components/admin/admin-category-select';
import { defaultLocale, type Locale } from '@/lib/i18n/config';
import {
  bulkUpdateProductsFromListAction,
  createProductFormAction,
  deleteProductFromListAction,
  updateProductFormAction
} from '@/features/admin/product-actions';
import {
  createCategoryFormAction,
  deleteCategoryFormAction,
  updateCategoryFormAction
} from '@/features/admin/category-actions';
import {
  AdminImageUploadInput,
  type AdminImageUploadCopy
} from '@/components/admin/admin-image-upload-input';
import {
  ADMIN_IMAGE_ACCEPT,
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
  localizedName?: string;
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

type ProductBulkOperation = 'recommend' | 'unrecommend';

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
  localizedContent: string;
  productCode: string;
  slug: string;
  slugHelp: string;
  slugPreview: string;
  category: string;
  priceUsd: string;
  coverImageUrl: string;
  recommended: string;
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
  bulkDelete: string;
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
  selectProductLabel: string;
  previewStorefront: string;
  deleteProduct: string;
  deleteProductLabel: string;
  deleteProductConfirmTitle: string;
  deleteProductConfirmDescription: string;
  deleteProductConfirmAction: string;
  bulkRecommendedNotice: string;
  bulkUnrecommendedNotice: string;
  bulkDeletedNotice: string;
  productDeletedNotice: string;
  csvHeaders: string[];
  categoryCreateTitle: string;
  categoryEditTitle: string;
  categoryCreateDescription: string;
  categoryEditDescription: string;
  closeCategoryCreate: string;
  closeCategoryEdit: string;
  parentCategory: string;
  rootCategory: string;
  sortOrder: string;
  categoryHeroImage: string;
  uploadHeroImage: string;
  removeCategoryHeroImage: string;
  categoryHeroPreviewAlt: string;
  nameZhLabel: string;
  nameEnLabel: string;
  nameEsLabel: string;
  namePtLabel: string;
  descriptionZhLabel: string;
  descriptionEnLabel: string;
  descriptionEsLabel: string;
  descriptionPtLabel: string;
  categoryEnabled: string;
  cancel: string;
  saveCategory: string;
  categoryCreatedNotice: string;
  categorySavedNotice: string;
  categorySaveError: string;
  categorySlugConflictError: string;
  productCreateTitle: string;
  productEditTitle: string;
  productCreateDescription: string;
  productEditDescription: string;
  closeProductCreate: string;
  closeProductEdit: string;
  productCreatedNotice: string;
  productSavedNotice: string;
  productSaveError: string;
  productMedia: string;
  coverUpload: string;
  coverPreviewAlt: string;
  removeCoverImage: string;
  productMediaUploadPending: string;
  basicInfo: string;
  statusLabel: string;
  selectCategory: string;
  statusOptions: Record<'draft' | 'pending' | 'published' | 'archived', string>;
  productGalleryManager: string;
  productGallerySubtitle: string;
  uploadGallery: string;
  galleryMaxError: string;
  galleryUploading: string;
  galleryUploaded: string;
  deleteProductImageLabel: string;
  productImageAlt: string;
  localImageLabel: string;
  emptyGallery: string;
  introZhLabel: string;
  introEnLabel: string;
  introEsLabel: string;
  introPtLabel: string;
  detailZhLabel: string;
  detailEnLabel: string;
  detailEsLabel: string;
  detailPtLabel: string;
  saveChanges: string;
  savingChanges: string;
  imageUploading: string;
  uploadHint: string;
  currentImage: string;
  configuredImage: string;
  emptyImage: string;
  imageUploadInProgress: string;
  imageUploaded: string;
  imageUploadedToInput: string;
  removeImage: string;
  uploadErrors: AdminImageUploadCopy['errors'];
};

const defaultProductCenterCopy: ProductCenterCopy = {
  localizedContent: '多语言内容',
  productCode: '商品编码',
  slug: '商品网址路径',
  slugHelp: '用于生成商品详情页网址。可自动生成，只能包含小写字母、数字和短横线。',
  slugPreview: '前台链接：/products/{slug}',
  category: '分类',
  priceUsd: '价格 USD',
  coverImageUrl: '封面主图',
  recommended: '推荐商品',
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
  bulkDelete: '删除商品',
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
  emptyProductsDescription: '新增商品并发布后，前台商品展示会同步更新。',
  selectProductLabel: '选择 {name}',
  previewStorefront: '预览前台',
  deleteProduct: '删除商品',
  deleteProductLabel: '删除商品 {name}',
  deleteProductConfirmTitle: '确认删除商品？',
  deleteProductConfirmDescription: '删除后将移除该商品及相关图片资源，此操作无法撤销。',
  deleteProductConfirmAction: '确认删除',
  bulkRecommendedNotice: '已批量设为推荐商品。',
  bulkUnrecommendedNotice: '已批量取消推荐。',
  bulkDeletedNotice: '已删除选中的商品。',
  productDeletedNotice: '商品已删除。',
  csvHeaders: ['商品名称', '英文名称', 'SKU', '类别', '状态', '价格USD', '推荐', 'Slug'],
  categoryCreateTitle: '新建类目',
  categoryEditTitle: '编辑类目',
  categoryCreateDescription: '保存后留在商品管理页继续维护商品。',
  categoryEditDescription: '修改类目信息后同步刷新商品管理页。',
  closeCategoryCreate: '关闭新建类目',
  closeCategoryEdit: '关闭编辑类目',
  parentCategory: '父级类目',
  rootCategory: '一级类目',
  sortOrder: '排序',
  categoryHeroImage: '类目主图',
  uploadHeroImage: '上传主图',
  removeCategoryHeroImage: '移除类目主图',
  categoryHeroPreviewAlt: '类目主图',
  nameZhLabel: '中文名称',
  nameEnLabel: '英文名称',
  nameEsLabel: '西语名称',
  namePtLabel: '葡语名称',
  descriptionZhLabel: '中文描述',
  descriptionEnLabel: '英文描述',
  descriptionEsLabel: '西语描述',
  descriptionPtLabel: '葡语描述',
  categoryEnabled: '启用类目',
  cancel: '取消',
  saveCategory: '保存类目',
  categoryCreatedNotice: '类目已新增。',
  categorySavedNotice: '类目已保存。',
  categorySaveError: '保存失败，请检查表单。',
  categorySlugConflictError: 'Slug 已被其他类目占用，请更换后再保存。',
  productCreateTitle: '新增商品',
  productEditTitle: '编辑商品',
  productCreateDescription: '填写商品信息后保存到后台。',
  productEditDescription: '修改后保存，前台按发布状态展示。',
  closeProductCreate: '关闭新增商品',
  closeProductEdit: '关闭编辑商品',
  productCreatedNotice: '商品已新增。',
  productSavedNotice: '商品已保存。',
  productSaveError: '保存失败，请检查表单。',
  productMedia: '产品媒体',
  coverUpload: '上传封面',
  coverPreviewAlt: '商品封面主图',
  removeCoverImage: '移除封面主图',
  productMediaUploadPending: '图片仍在上传，完成后才能保存商品。',
  basicInfo: '基础信息',
  statusLabel: '状态',
  selectCategory: '选择类别',
  statusOptions: {
    draft: '草稿',
    pending: '待审核',
    published: '已发布',
    archived: '已归档'
  },
  productGalleryManager: '商品图片管理',
  productGallerySubtitle: '图库图片',
  uploadGallery: '上传图库',
  galleryMaxError: '图库最多支持 10 张图片。请先删除一张再上传。',
  galleryUploading: '正在上传图库图片...',
  galleryUploaded: '图库图片已上传。',
  deleteProductImageLabel: '删除商品图片 {index}',
  productImageAlt: '商品图片 {index}',
  localImageLabel: '本地图片 {index}',
  emptyGallery: '暂无图库图片',
  introZhLabel: '中文简介',
  introEnLabel: '英文简介',
  introEsLabel: '西语简介',
  introPtLabel: '葡语简介',
  detailZhLabel: '中文详情',
  detailEnLabel: '英文详情',
  detailEsLabel: '西语详情',
  detailPtLabel: '葡语详情',
  saveChanges: '保存更改',
  savingChanges: '保存中...',
  imageUploading: '图片上传中...',
  uploadHint: '支持 JPG、PNG、WebP、GIF，单张不超过 5MB。',
  currentImage: '当前图片',
  configuredImage: '本地图片已配置',
  emptyImage: '暂未配置图片',
  imageUploadInProgress: '正在上传图片...',
  imageUploaded: '图片已上传。',
  imageUploadedToInput: '图片已上传，地址已写入输入框。',
  removeImage: '移除图片',
  uploadErrors: {
    missingFile: '请选择一张图片后再上传。',
    fileTooLarge: '图片过大，单张图片不能超过 5MB。请压缩后重新上传。',
    unsupportedFileType: '图片格式不支持。请上传 JPG、PNG、WebP 或 GIF。',
    uploadFailed: '上传失败，请稍后重试。'
  }
};

function formatCopy(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template
  );
}

function getProductImageUploadCopy(copy: ProductCenterCopy): AdminImageUploadCopy {
  return {
    hint: copy.uploadHint,
    currentImage: copy.currentImage,
    configuredImage: copy.configuredImage,
    emptyImage: copy.emptyImage,
    uploading: copy.imageUploadInProgress,
    uploaded: copy.imageUploaded,
    uploadedToInput: copy.imageUploadedToInput,
    removeImage: copy.removeImage,
    errors: copy.uploadErrors
  };
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

const requiredProductEditorFields = [
  ['categoryId', 'category'],
  ['productCode', 'productCode'],
  ['slug', 'slug'],
  ['coverImageUrl', 'coverImageUrl'],
  ['nameZh', 'nameZhLabel'],
  ['nameEn', 'nameEnLabel'],
  ['nameEs', 'nameEsLabel'],
  ['namePt', 'namePtLabel'],
  ['introZh', 'introZhLabel'],
  ['introEn', 'introEnLabel'],
  ['introEs', 'introEsLabel'],
  ['introPt', 'introPtLabel'],
  ['detailZh', 'detailZhLabel'],
  ['detailEn', 'detailEnLabel'],
  ['detailEs', 'detailEsLabel'],
  ['detailPt', 'detailPtLabel']
] as const;

export function getProductEditorFormValidationError(
  formData: FormData,
  copy: Pick<
    ProductCenterCopy,
    | 'category'
    | 'productCode'
    | 'coverImageUrl'
    | 'nameZhLabel'
    | 'nameEnLabel'
    | 'nameEsLabel'
    | 'namePtLabel'
    | 'introZhLabel'
    | 'introEnLabel'
    | 'introEsLabel'
    | 'introPtLabel'
    | 'detailZhLabel'
    | 'detailEnLabel'
    | 'detailEsLabel'
    | 'detailPtLabel'
  > & { slug?: string } = defaultProductCenterCopy
) {
  const labels = {
    ...copy,
    slug: copy.slug ?? 'Slug'
  };
  const missingField = requiredProductEditorFields.find(
    ([fieldName]) => !getFormStringValue(formData, fieldName)
  );

  if (!missingField) {
    return '';
  }

  return `请填写${labels[missingField[1]]}。`;
}

export function getGeneratedProductSlug(productCode: string, nameEn: string) {
  const source = productCode.trim() || nameEn.trim();

  return source
    .normalize('NFKD')
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
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
  isUploadPending,
  copy = defaultProductCenterCopy
}: {
  isUploadPending: boolean;
  copy?: Pick<ProductCenterCopy, 'imageUploading' | 'saveChanges'>;
}) {
  return isUploadPending
    ? {
        disabled: true,
        label: copy.imageUploading
      }
    : {
        disabled: false,
        label: copy.saveChanges
      };
}

export async function saveCategoryEditorForm({
  formAction,
  formData,
  router,
  onClose,
  onSaved,
  isCreate,
  createdMessage = defaultProductCenterCopy.categoryCreatedNotice,
  savedMessage = defaultProductCenterCopy.categorySavedNotice
}: {
  formAction: (formData: FormData) => Promise<unknown>;
  formData: FormData;
  router: {
    refresh: () => void;
  };
  onClose: () => void;
  onSaved: (message: string) => void;
  isCreate: boolean;
  createdMessage?: string;
  savedMessage?: string;
}) {
  await formAction(formData);
  onSaved(isCreate ? createdMessage : savedMessage);
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
    getProductDisplayName(product) ||
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

export function buildAdminProductSearchUrl({
  searchTerm,
  statusFilter,
  activeCategoryId,
  locale
}: {
  searchTerm: string;
  statusFilter: ProductStatusFilter;
  activeCategoryId: string | null;
  locale: Locale;
}) {
  const params = new URLSearchParams();
  const normalizedSearchTerm = searchTerm.trim();

  if (normalizedSearchTerm) {
    params.set('search', normalizedSearchTerm);
  }

  if (statusFilter !== 'all') {
    params.set('status', statusFilter);
  }

  if (activeCategoryId) {
    params.set('categoryId', activeCategoryId);
  }

  params.set('locale', locale);

  return `/api/admin/products?${params.toString()}`;
}

function getProductDisplayName(product: ProductCenterRow) {
  return (
    product.localizedName?.trim() ||
    product.nameZh.trim() ||
    product.nameEn.trim() ||
    product.nameEs.trim() ||
    product.namePt.trim() ||
    product.slug.trim() ||
    product.productCode.trim()
  );
}

function getProductSecondaryName(product: ProductCenterRow) {
  const displayName = getProductDisplayName(product);
  const secondaryName =
    product.nameEn.trim() ||
    product.nameZh.trim() ||
    product.nameEs.trim() ||
    product.namePt.trim();

  return secondaryName && secondaryName !== displayName ? secondaryName : '';
}

export function ProductCenter({
  categories,
  products,
  locale = defaultLocale,
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
  defaultPendingDeleteProductId,
  copy = defaultProductCenterCopy
}: {
  categories: ProductCenterCategory[];
  products: ProductCenterRow[];
  locale?: Locale;
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
  defaultPendingDeleteProductId?: string;
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
    defaultCategoryEditorOpen && !defaultEditorOpen
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
  const [pendingDeleteProductIds, setPendingDeleteProductIds] = useState<string[]>(
    defaultPendingDeleteProductId ? [defaultPendingDeleteProductId] : []
  );
  const [notice, setNotice] = useState('');
  const didMountRef = useRef(false);
  const productSearchRequestRef = useRef(0);

  useEffect(() => {
    setProductRows(sortProductRowsByName(products));
  }, [products]);

  useEffect(() => {
    if (!notice) {
      return;
    }

    return scheduleNoticeDismiss(() => setNotice(''));
  }, [notice]);

  const activeCategory =
    activeCategoryId === null
      ? null
      : categories.find((category) => category.id === activeCategoryId) ?? null;
  // Root categories are group headers and cannot filter products; only leaf
  // categories (or ids not present in the tree) narrow the product list.
  const filterCategoryId =
    activeCategoryId !== null && (!activeCategory || activeCategory.parentId)
      ? activeCategoryId
      : null;

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    const controller = new AbortController();
    const requestId = productSearchRequestRef.current + 1;
    productSearchRequestRef.current = requestId;

    async function fetchProducts() {
      const response = await fetch(
        buildAdminProductSearchUrl({
          searchTerm,
          statusFilter,
          activeCategoryId: filterCategoryId,
          locale
        }),
        {
          signal: controller.signal
        }
      );

      if (!response.ok || productSearchRequestRef.current !== requestId) {
        return;
      }

      const payload = (await response.json()) as {
        products?: ProductCenterRow[];
      };

      if (Array.isArray(payload.products)) {
        setProductRows(sortProductRowsByName(payload.products));
        setSelectedProductIds((current) =>
          current.filter((productId) =>
            payload.products?.some((product) => product.id === productId)
          )
        );
      }
    }

    void fetchProducts().catch((error) => {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return;
      }
    });

    return () => controller.abort();
  }, [filterCategoryId, locale, searchTerm, statusFilter]);

  const selectedProduct =
    selectedProductId === null
      ? null
      : productRows.find((product) => product.id === selectedProductId) ?? null;
  const pendingDeleteProducts = pendingDeleteProductIds
    .map((productId) => productRows.find((product) => product.id === productId))
    .filter((product): product is ProductCenterRow => Boolean(product));
  const selectedCategory =
    selectedCategoryId === null
      ? null
      : categories.find((category) => category.id === selectedCategoryId) ?? null;
  const categoryProducts =
    filterCategoryId === null
      ? productRows
      : productRows.filter((product) => product.categoryId === filterCategoryId);
  const filteredProducts = categoryProducts.filter((product) => {
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'recommended'
        ? product.isRecommended
        : product.status === statusFilter;

    return matchesStatus;
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
    setIsCategoryEditorOpen(false);
    setIsEditorOpen(true);
  };

  const openEditEditor = (productId: string) => {
    setSelectedProductId(productId);
    setEditorMode('edit');
    setOpenActionMenuProductId(null);
    setIsCategoryEditorOpen(false);
    setIsEditorOpen(true);
  };

  const openCreateCategoryEditor = () => {
    setSelectedCategoryId(null);
    setCategoryEditorMode('create');
    setIsEditorOpen(false);
    setIsCategoryEditorOpen(true);
  };

  const openEditCategoryEditor = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setCategoryEditorMode('edit');
    setIsEditorOpen(false);
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
        ? copy.bulkRecommendedNotice
        : copy.bulkUnrecommendedNotice
    );
    setOpenActionMenuProductId(null);
    setSelectedProductIds([]);
  };

  const requestDeleteProduct = (productId: string) => {
    setOpenActionMenuProductId(null);
    setPendingDeleteProductIds([productId]);
  };

  const requestDeleteSelectedProducts = () => {
    setOpenActionMenuProductId(null);
    setPendingDeleteProductIds(selectedProductIds);
  };

  const deleteProducts = async (productIds: string[]) => {
    const uniqueProductIds = Array.from(new Set(productIds));

    await Promise.all(uniqueProductIds.map((productId) => deleteProductFromListAction(productId)));
    setNotice(
      uniqueProductIds.length > 1 ? copy.bulkDeletedNotice : copy.productDeletedNotice
    );
    setPendingDeleteProductIds([]);
    setSelectedProductIds((current) =>
      current.filter((id) => !uniqueProductIds.includes(id))
    );
    setProductRows((current) =>
      current.filter((product) => !uniqueProductIds.includes(product.id))
    );
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
      copy.csvHeaders,
      ...filteredProducts.map((product) => [
        product.nameZh,
        product.nameEn,
        product.productCode,
        product.categoryName,
        product.status,
        String(product.priceUsd),
        product.isRecommended ? copy.yes : copy.no,
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
    <section className="relative flex h-[calc(100vh-104px)] flex-col overflow-hidden rounded-xl border border-admin-border bg-admin-bg text-sm shadow-sm">
      <header className="flex shrink-0 flex-col gap-3 border-b border-admin-border bg-white px-4 py-3 xl:flex-row xl:items-center xl:justify-between lg:px-5">
        <div className="flex min-w-0 flex-1 flex-col gap-2.5 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-admin-accent">
              <Package className="h-4 w-4" />
            </div>
            <h2 className="shrink-0 text-base font-semibold text-admin-text-primary">
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
              className="h-9 w-full rounded-lg border border-admin-border bg-admin-elevated pl-9 pr-3 text-xs text-admin-text-primary outline-none transition focus:border-admin-accent focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
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
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-admin-border bg-admin-elevated p-1"
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
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-admin-border bg-white px-3 text-xs font-semibold text-admin-text-secondary transition hover:border-admin-border-strong hover:bg-admin-elevated focus:outline-none focus:ring-2 focus:ring-admin-accent/20"
          >
            <Download className="h-4 w-4" />
            {copy.exportCsv}
          </button>
          <button
            type="button"
            onClick={openCreateEditor}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-admin-accent px-3 text-xs font-semibold text-white transition hover:bg-admin-accent-hover focus:outline-none focus:ring-2 focus:ring-admin-accent/20"
          >
            <CirclePlus className="h-4 w-4" />
            {copy.newProduct}
          </button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 gap-4 bg-admin-bg p-4 lg:grid-cols-[minmax(272px,336px)_minmax(0,1fr)]">
        <aside className="min-h-0 overflow-y-auto rounded-xl border border-admin-border bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-admin-text-primary">{copy.categoryTitle}</h3>
            <button
              type="button"
              aria-label={copy.addCategory}
              title={copy.addCategory}
              onClick={openCreateCategoryEditor}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-admin-accent text-white transition hover:bg-admin-accent-hover focus:outline-none focus:ring-2 focus:ring-admin-accent/20"
            >
              <CirclePlus className="h-4 w-4" />
            </button>
          </div>

          {categories.length > 0 ? (
            <div className="space-y-2.5">
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
              <p className="shrink-0 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
                {notice}
              </p>
            ) : null}
            {selectedProductIds.length > 0 ? (
              <div className="flex shrink-0 flex-wrap items-center gap-2 rounded-lg border border-admin-border bg-white px-3 py-2 text-xs text-admin-text-secondary shadow-sm">
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
                  onClick={requestDeleteSelectedProducts}
                  className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-700 transition hover:border-rose-300"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  {copy.bulkDelete}
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
                    {paginatedProducts.map((product) => {
                      const productDisplayName = getProductDisplayName(product);
                      const productSecondaryName = getProductSecondaryName(product);

                      return (
                      <tr key={product.id} className="bg-white transition hover:bg-blue-50/50">
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            aria-label={formatCopy(copy.selectProductLabel, { name: productDisplayName })}
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
                                aria-label={formatCopy(copy.editProductLabel, { name: productDisplayName })}
                                onClick={() => openEditEditor(product.id)}
                                className="block max-w-full truncate rounded text-left text-xs font-semibold text-admin-text-primary transition hover:text-admin-accent hover:underline focus:outline-none focus:ring-2 focus:ring-admin-accent/20"
                              >
                                {productDisplayName}
                              </button>
                              {productSecondaryName ? (
                                <p className="truncate text-xs text-admin-text-muted">
                                  {productSecondaryName}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 font-mono text-xs text-admin-text-secondary">
                          {product.productCode}
                        </td>
                        <td className="px-5 py-3 text-xs text-admin-text-primary">
                          {product.categoryName}
                        </td>
                        <td className="px-5 py-3">
                          <ProductStatus status={product.status} />
                        </td>
                        <td className="px-5 py-3 text-xs text-admin-text-primary">
                          {formatPrice(product.priceUsd)}
                        </td>
                        <td className="px-5 py-3 text-xs text-admin-text-secondary">
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
                              onDelete={() => requestDeleteProduct(product.id)}
                              copy={copy}
                            />
                          </div>
                        </td>
                      </tr>
                      );
                    })}
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
        defaultCategoryId={activeCategoryId}
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
        copy={copy}
      />
      <CategoryEditorDrawer
        categories={categories}
        category={selectedCategory}
        mode={categoryEditorMode}
        isOpen={isCategoryEditorOpen}
        onClose={() => setIsCategoryEditorOpen(false)}
        onSaved={(message) => setNotice(message)}
        copy={copy}
      />
      <ProductDeleteConfirmDialog
        products={pendingDeleteProducts}
        copy={copy}
        onCancel={() => setPendingDeleteProductIds([])}
        onConfirm={(productIds) => void deleteProducts(productIds)}
      />
    </section>
  );
}

function ProductDeleteConfirmDialog({
  products,
  copy,
  onCancel,
  onConfirm
}: {
  products: ProductCenterRow[];
  copy: ProductCenterCopy;
  onCancel: () => void;
  onConfirm: (productIds: string[]) => void;
}) {
  useEffect(() => {
    if (products.length === 0) {
      return;
    }

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', closeOnEscape);

    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onCancel, products.length]);

  if (products.length === 0) {
    return null;
  }

  const isSingleProduct = products.length === 1;
  const productDisplayName = isSingleProduct
    ? getProductDisplayName(products[0])
    : formatCopy(copy.selectedProducts, { count: products.length });

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="product-delete-confirm-title"
      aria-describedby="product-delete-confirm-description"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/45 px-4 py-6"
    >
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-admin-border bg-white text-left shadow-2xl ring-1 ring-black/5">
        <div className="flex gap-3 border-b border-admin-border bg-admin-elevated px-5 py-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-rose-200 bg-rose-50 text-rose-700">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h3
              id="product-delete-confirm-title"
              className="text-base font-bold text-admin-text-primary"
            >
              {copy.deleteProductConfirmTitle}
            </h3>
            <p className="mt-1 truncate text-xs font-semibold text-admin-text-secondary">
              {productDisplayName}
            </p>
          </div>
        </div>
        <div className="px-5 py-4">
          <p
            id="product-delete-confirm-description"
            className="text-sm leading-6 text-admin-text-secondary"
          >
            {copy.deleteProductConfirmDescription}
          </p>
        </div>
        <div className="flex justify-end gap-2 border-t border-admin-border bg-white px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex h-9 items-center rounded-lg border border-admin-border bg-white px-4 text-xs font-semibold text-admin-text-secondary transition hover:border-admin-border-strong hover:bg-admin-elevated focus:outline-none focus:ring-2 focus:ring-admin-accent/20"
          >
            {copy.cancel}
          </button>
          <button
            type="button"
            autoFocus
            onClick={() => onConfirm(products.map((product) => product.id))}
            className="inline-flex h-9 items-center rounded-lg bg-rose-600 px-4 text-xs font-semibold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-300"
          >
            {copy.deleteProductConfirmAction}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductActionMenu({
  product,
  isOpen,
  onToggle,
  onDelete,
  copy
}: {
  product: ProductCenterRow;
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
  copy: ProductCenterCopy;
}) {
  return (
    <div className="relative inline-flex" data-product-action-menu>
      <button
        type="button"
        aria-label={formatCopy(copy.productActionLabel, { name: getProductDisplayName(product) })}
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
          aria-label={formatCopy(copy.productActionMenuLabel, { name: getProductDisplayName(product) })}
          className="absolute right-0 top-10 z-30 w-44 rounded-xl border border-admin-border bg-white p-1.5 text-left shadow-xl ring-1 ring-black/5"
        >
          <a
            role="menuitem"
            href={`/${defaultLocale}/products/${product.slug}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-admin-text-secondary transition hover:bg-admin-elevated hover:text-admin-text-primary focus:outline-none focus:ring-2 focus:ring-admin-accent/20"
          >
            <Eye className="h-4 w-4 text-admin-text-muted" />
            {copy.previewStorefront}
          </a>
          <button
            type="button"
            role="menuitem"
            aria-label={formatCopy(copy.deleteProductLabel, { name: getProductDisplayName(product) })}
            onClick={onDelete}
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-700 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-200"
          >
            <Trash2 className="h-4 w-4" />
            {copy.deleteProduct}
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
  const isRoot = !category.parentId;
  const showSelected = isSelected && !isRoot;
  const actionButtons = (
    <div className="flex shrink-0 items-center gap-1">
      <button
        type="button"
        aria-label={formatCopy(copy.editCategoryLabel, { name: category.nameZh })}
        onClick={() => onEdit(category.id)}
        className="flex h-7 w-7 items-center justify-center rounded-md text-admin-text-muted transition hover:bg-white hover:text-admin-accent"
      >
        <Edit3 className="h-3.5 w-3.5" />
      </button>
      <form action={deleteCategoryFormAction.bind(null, category.id)}>
        <button
          type="submit"
          aria-label={formatCopy(copy.deleteCategoryLabel, { name: category.nameZh })}
          title={copy.deleteCategoryTitle}
          className="flex h-7 w-7 items-center justify-center rounded-md text-admin-text-muted transition hover:bg-white hover:text-rose-600"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );

  if (isRoot) {
    return (
      <div className="group flex items-center justify-between gap-2.5 px-2 pb-1 pt-4 first:pt-1">
        <div className="flex min-w-0 flex-1 items-center gap-1.5">
          <FolderTree className="h-3.5 w-3.5 shrink-0 text-admin-text-muted" />
          <span className="truncate text-[11px] font-bold uppercase tracking-[0.08em] text-admin-text-secondary">
            {category.nameZh}
          </span>
        </div>
        {actionButtons}
      </div>
    );
  }

  return (
    <div
      className={`group flex items-center justify-between gap-2.5 rounded-lg border p-2.5 pl-8 transition focus-within:ring-2 focus-within:ring-admin-accent/20 ${
        showSelected
          ? 'border-admin-accent/25 bg-blue-50 text-admin-accent'
          : 'border-admin-border bg-white text-admin-text-secondary hover:bg-admin-elevated'
      }`}
    >
      <button
        type="button"
        aria-pressed={isSelected}
        onClick={() => onSelect(category.id)}
        className="flex min-w-0 flex-1 self-stretch items-center gap-2.5 text-left focus:outline-none"
      >
        {category.iconImageUrl ? (
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-lg border border-admin-border bg-white">
            <NextImage
              src={category.iconImageUrl}
              alt={category.nameZh}
              fill
              sizes="32px"
              className="object-cover"
              unoptimized
            />
          </span>
        ) : (
          <FolderTree className="h-5 w-5 shrink-0" />
        )}
        <span className="min-w-0">
          <span className="block truncate text-xs font-semibold">{category.nameZh}</span>
          <span className="block truncate text-xs text-admin-text-muted">
            {category.nameEn}
          </span>
        </span>
      </button>
      {actionButtons}
    </div>
  );
}

function CategoryEditorDrawer({
  categories,
  category,
  mode,
  isOpen,
  onClose,
  onSaved,
  copy
}: {
  categories: ProductCenterCategory[];
  category: ProductCenterCategory | null;
  mode: 'create' | 'edit';
  isOpen: boolean;
  onClose: () => void;
  onSaved: (message: string) => void;
  copy: ProductCenterCopy;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState('');
  const [parentId, setParentId] = useState(category?.parentId ?? '');

  useEffect(() => {
    if (isOpen) {
      setParentId(category?.parentId ?? '');
    }
  }, [isOpen, category]);

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
        isCreate,
        createdMessage: copy.categoryCreatedNotice,
        savedMessage: copy.categorySavedNotice
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      setFormError(
        message.includes('Unique constraint')
          ? copy.categorySlugConflictError
          : message || copy.categorySaveError
      );
    }
  };
  const parentOptions = categories.filter(
    (item) => item.id !== category?.id && !item.parentId
  );
  const parentCategoryOptions: AdminSelectOption[] = [
    { value: '', label: copy.rootCategory },
    ...parentOptions.map((item) => ({
      value: item.id,
      label: item.nameZh
    }))
  ];

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-slate-900/20"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="category-editor-title"
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[560px] flex-col border-l border-admin-border bg-white shadow-[-24px_0_48px_rgba(15,23,42,0.12)]"
      >
      <div className="flex items-center justify-between border-b border-admin-border bg-admin-elevated px-5 py-4">
        <div>
          <h3 id="category-editor-title" className="text-base font-bold text-admin-text-primary">
            {isCreate ? copy.categoryCreateTitle : copy.categoryEditTitle}
          </h3>
          <p className="mt-0.5 text-xs text-admin-text-muted">
            {isCreate ? copy.categoryCreateDescription : copy.categoryEditDescription}
          </p>
        </div>
        <button
          type="button"
          aria-label={isCreate ? copy.closeCategoryCreate : copy.closeCategoryEdit}
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-admin-text-muted transition hover:bg-white hover:text-admin-text-primary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form
        key={`${mode}:${category?.id ?? 'new'}`}
        action={handleFormAction}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label={copy.parentCategory}>
              <AdminSelect
                name="parentId"
                defaultValue={category?.parentId ?? ''}
                options={parentCategoryOptions}
                compact
                onValueChange={setParentId}
              />
            </Field>
            <Field label="Slug">
              <input
                name="slug"
                defaultValue={category?.slug ?? ''}
                className={drawerInputClass}
                placeholder="humanoid-robots"
              />
            </Field>
            <Field label={copy.sortOrder}>
              <input
                name="sortOrder"
                defaultValue={category?.sortOrder ?? 0}
                className={drawerInputClass}
                type="number"
              />
            </Field>
            {parentId ? (
              <div className="md:col-span-2">
                <AdminImageUploadInput
                  name="iconImageUrl"
                  label={copy.categoryHeroImage}
                  uploadLabel={copy.uploadHeroImage}
                  defaultValue={category?.iconImageUrl ?? ''}
                  scope="category"
                  showPreview
                  previewAlt={category?.nameZh ?? copy.categoryHeroPreviewAlt}
                  clearLabel={copy.removeCategoryHeroImage}
                  uploadCopy={getProductImageUploadCopy(copy)}
                />
              </div>
            ) : null}
            <Field label={copy.nameZhLabel}>
              <input name="nameZh" defaultValue={category?.nameZh ?? ''} className={drawerInputClass} />
            </Field>
            <Field label={copy.nameEnLabel}>
              <input name="nameEn" defaultValue={category?.nameEn ?? ''} className={drawerInputClass} />
            </Field>
            <Field label={copy.nameEsLabel}>
              <input
                name="nameEs"
                defaultValue={category?.nameEs ?? category?.nameEn ?? ''}
                className={drawerInputClass}
              />
            </Field>
            <Field label={copy.namePtLabel}>
              <input
                name="namePt"
                defaultValue={category?.namePt ?? category?.nameEn ?? ''}
                className={drawerInputClass}
              />
            </Field>
            <Field label={copy.descriptionZhLabel} className="md:col-span-2">
              <textarea
                name="descriptionZh"
                defaultValue={category?.descriptionZh ?? ''}
                className={`${drawerInputClass} min-h-[84px] resize-y`}
              />
            </Field>
            <Field label={copy.descriptionEnLabel} className="md:col-span-2">
              <textarea
                name="descriptionEn"
                defaultValue={category?.descriptionEn ?? ''}
                className={`${drawerInputClass} min-h-[84px] resize-y`}
              />
            </Field>
            <Field label={copy.descriptionEsLabel} className="md:col-span-2">
              <textarea
                name="descriptionEs"
                defaultValue={category?.descriptionEs ?? ''}
                className={`${drawerInputClass} min-h-[84px] resize-y`}
              />
            </Field>
            <Field label={copy.descriptionPtLabel} className="md:col-span-2">
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
              {copy.categoryEnabled}
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
            {copy.cancel}
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-admin-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-admin-accent-hover"
          >
            <Check className="h-4 w-4" />
            {copy.saveCategory}
          </button>
        </footer>
      </form>
      </aside>
    </>
  );
}

function ProductEditorDrawer({
  categories,
  product,
  mode,
  defaultCategoryId,
  isOpen,
  onClose,
  onProductSaved,
  onSaved,
  copy
}: {
  categories: ProductCenterCategory[];
  product: ProductCenterRow | null;
  mode: 'create' | 'edit';
  defaultCategoryId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onProductSaved: (productId: string, formData: FormData) => void;
  onSaved: (message: string) => void;
  copy: ProductCenterCopy;
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <ProductEditorDrawerContent
      categories={categories}
      product={mode === 'create' ? null : product}
      mode={mode}
      defaultCategoryId={mode === 'create' ? defaultCategoryId : null}
      onClose={onClose}
      onProductSaved={onProductSaved}
      onSaved={onSaved}
      copy={copy}
    />
  );
}

function ProductEditorDrawerContent({
  categories,
  product,
  mode,
  defaultCategoryId,
  onClose,
  onProductSaved,
  onSaved,
  copy
}: {
  categories: ProductCenterCategory[];
  product: ProductCenterRow | null;
  mode: 'create' | 'edit';
  defaultCategoryId: string | null;
  onClose: () => void;
  onProductSaved: (productId: string, formData: FormData) => void;
  onSaved: (message: string) => void;
  copy: ProductCenterCopy;
}) {
  const router = useRouter();
  const [formError, setFormError] = useState('');
  const [isGalleryUploadPending, setIsGalleryUploadPending] = useState(false);
  const [isProductSaving, setIsProductSaving] = useState(false);
  const isCreate = mode === 'create';
  const [slugValue, setSlugValue] = useState(product?.slug ?? '');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);
  const formAction =
    !isCreate && product
      ? updateProductFormAction.bind(null, product.id)
      : createProductFormAction;
  useEffect(() => {
    setSlugValue(product?.slug ?? '');
    setIsSlugManuallyEdited(false);
  }, [isCreate, product?.id, product?.slug]);

  const updateGeneratedSlug = (form: HTMLFormElement | null) => {
    if (!isCreate || isSlugManuallyEdited || !form) {
      return;
    }

    const productCode = form.elements.namedItem('productCode');
    const nameEn = form.elements.namedItem('nameEn');

    setSlugValue(
      getGeneratedProductSlug(
        productCode instanceof HTMLInputElement ? productCode.value : '',
        nameEn instanceof HTMLInputElement ? nameEn.value : ''
      )
    );
  };
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isProductSaving) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    try {
      setFormError('');
      const validationError = getProductEditorFormValidationError(formData, copy);

      if (validationError) {
        setFormError(validationError);
        return;
      }

      setIsProductSaving(true);
      await formAction(formData);
      if (!isCreate && product) {
        onProductSaved(product.id, formData);
      }
      onSaved(isCreate ? copy.productCreatedNotice : copy.productSavedNotice);
      router.refresh();
      onClose();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : copy.productSaveError);
    } finally {
      setIsProductSaving(false);
    }
  };
  const galleryUrls = [...(product?.images ?? [])]
    .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0))
    .map((image) => image.imageUrl);
  const missingCategoryOption =
    product &&
    product.categoryId &&
    !categories.some((category) => category.id === product.categoryId)
      ? { value: product.categoryId, label: product.categoryName }
      : undefined;
  const defaultProductCategoryId =
    product?.categoryId ??
    (defaultCategoryId && categories.some((category) => category.id === defaultCategoryId)
      ? defaultCategoryId
      : '');
  const productStatusOptions: AdminSelectOption[] = [
    { value: 'draft', label: copy.statusOptions.draft },
    { value: 'published', label: copy.statusOptions.published }
  ];
  const defaultProductStatus = product?.status === 'published' ? 'published' : 'draft';

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 z-40 bg-slate-900/20"
        onClick={onClose}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-editor-title"
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[620px] flex-col border-l border-admin-border bg-white shadow-[-24px_0_48px_rgba(15,23,42,0.12)]"
      >
      <div className="flex items-center justify-between border-b border-admin-border bg-admin-elevated px-5 py-4">
        <div>
          <h3 id="product-editor-title" className="text-base font-bold text-admin-text-primary">
            {isCreate ? copy.productCreateTitle : copy.productEditTitle}
          </h3>
          <p className="mt-0.5 text-xs text-admin-text-muted">
            {isCreate ? copy.productCreateDescription : copy.productEditDescription}
          </p>
        </div>
        <button
          type="button"
          aria-label={isCreate ? copy.closeProductCreate : copy.closeProductEdit}
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full text-admin-text-muted transition hover:bg-white hover:text-admin-text-primary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
        <div className="flex-1 space-y-6 overflow-y-auto p-5">
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase text-admin-text-muted">{copy.productMedia}</h4>
              <span className="text-xs text-admin-text-muted">
                {galleryUrls.length}/10
              </span>
            </div>
            <div className="space-y-4 rounded-xl border border-admin-border bg-admin-surface p-4">
              <AdminImageUploadInput
                name="coverImageUrl"
                label={copy.coverImageUrl}
                uploadLabel={copy.coverUpload}
                defaultValue={product?.coverImageUrl ?? ''}
                scope="product"
                showPreview
                previewAlt={product?.nameZh ?? copy.coverPreviewAlt}
                clearLabel={copy.removeCoverImage}
                uploadCopy={getProductImageUploadCopy(copy)}
              />
              <ProductGalleryImageManager
                defaultUrls={galleryUrls}
                onUploadPendingChange={setIsGalleryUploadPending}
                copy={copy}
              />
            </div>
            {isGalleryUploadPending ? (
              <p role="status" className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800">
                {copy.productMediaUploadPending}
              </p>
            ) : null}
          </section>

          <section className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-admin-text-muted">{copy.basicInfo}</h4>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label={copy.productCode}>
                <input
                  name="productCode"
                  defaultValue={product?.productCode}
                  className={drawerInputClass}
                  onChange={(event) => updateGeneratedSlug(event.currentTarget.form)}
                />
              </Field>
              <Field label={copy.slug}>
                <input
                  name="slug"
                  value={slugValue}
                  onChange={(event) => {
                    setSlugValue(event.currentTarget.value);
                    setIsSlugManuallyEdited(true);
                  }}
                  className={drawerInputClass}
                  placeholder="product-url-path"
                />
                <p className="text-xs font-normal normal-case text-admin-text-muted">
                  {copy.slugHelp}
                </p>
                <p className="truncate text-xs font-normal normal-case text-admin-text-muted">
                  {formatCopy(copy.slugPreview, { slug: slugValue || '' })}
                </p>
              </Field>
              <Field label={copy.category}>
                <AdminCategorySelect
                  name="categoryId"
                  categories={categories}
                  defaultValue={defaultProductCategoryId}
                  placeholder={copy.selectCategory}
                  extraOption={missingCategoryOption}
                />
              </Field>
              <Field label={copy.sortOrder}>
                <input
                  name="sortOrder"
                  defaultValue={product?.sortOrder ?? 0}
                  className={drawerInputClass}
                  type="number"
                />
              </Field>
              <Field label={copy.statusLabel}>
                <AdminSelect
                  name="status"
                  defaultValue={defaultProductStatus}
                  options={productStatusOptions}
                  compact
                />
              </Field>
              <label className="flex items-center gap-2 rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm text-admin-text-secondary md:col-span-2">
                <input
                  name="isRecommended"
                  type="checkbox"
                  defaultChecked={product?.isRecommended ?? false}
                  className="h-4 w-4 rounded border-admin-border bg-admin-surface text-admin-accent focus:ring-admin-accent/30"
                />
                {copy.recommended}
              </label>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-admin-text-muted">{copy.localizedContent}</h4>
            <div className="grid gap-3 md:grid-cols-2">
              {([
                ['nameZh', copy.nameZhLabel, product?.nameZh],
                ['nameEn', copy.nameEnLabel, product?.nameEn],
                ['nameEs', copy.nameEsLabel, product?.nameEs],
                ['namePt', copy.namePtLabel, product?.namePt],
                ['introZh', copy.introZhLabel, product?.introZh],
                ['introEn', copy.introEnLabel, product?.introEn],
                ['introEs', copy.introEsLabel, product?.introEs],
                ['introPt', copy.introPtLabel, product?.introPt]
              ] as Array<[string, string, string | undefined]>).map(([name, label, value]) => (
                <Field key={name} label={label}>
                  <input
                    name={name}
                    defaultValue={value}
                    className={drawerInputClass}
                    onChange={
                      name === 'nameEn'
                        ? (event) => updateGeneratedSlug(event.currentTarget.form)
                        : undefined
                    }
                  />
                </Field>
              ))}
            </div>
            {([
              ['detailZh', copy.detailZhLabel, product?.detailZh],
              ['detailEn', copy.detailEnLabel, product?.detailEn],
              ['detailEs', copy.detailEsLabel, product?.detailEs],
              ['detailPt', copy.detailPtLabel, product?.detailPt]
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
            {copy.cancel}
          </button>
          <ProductEditorSubmitButton
            isSaving={isProductSaving}
            isUploadPending={isGalleryUploadPending}
            copy={copy}
          />
        </footer>
      </form>
      </aside>
    </>
  );
}

function ProductGalleryImageManager({
  defaultUrls,
  onUploadPendingChange,
  copy
}: {
  defaultUrls: string[];
  onUploadPendingChange?: (isPending: boolean) => void;
  copy: ProductCenterCopy;
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
        message: copy.galleryMaxError
      });
      return;
    }

    const validationError = validateAdminUploadFile(file);
    if (validationError) {
      setStatus({
        tone: 'error',
        message: getAdminUploadErrorMessage(validationError, copy.uploadErrors)
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
    setStatus({ tone: 'info', message: copy.galleryUploading });
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
          message: getAdminUploadErrorMessage(
            payload.error ?? 'UPLOAD_FAILED',
            copy.uploadErrors
          )
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
      setStatus({ tone: 'success', message: copy.galleryUploaded });
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
          <h5 className="text-sm font-semibold text-admin-text-primary">{copy.productGalleryManager}</h5>
          <p className="text-xs text-admin-text-muted">{copy.productGallerySubtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={!canAddMore}
          className="rounded-lg border border-admin-border bg-white px-3 py-1.5 text-xs font-semibold text-admin-text-secondary transition hover:border-admin-border-strong hover:text-admin-text-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copy.uploadGallery}
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
      <p className="text-xs text-admin-text-muted">{copy.uploadHint}</p>

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
                  alt={formatCopy(copy.productImageAlt, { index: index + 1 })}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-2 top-2 rounded bg-slate-950/75 px-2 py-1 text-[10px] font-bold text-white">
                  #{index + 1}
                </span>
                <button
                  type="button"
                  aria-label={formatCopy(copy.deleteProductImageLabel, { index: index + 1 })}
                  onClick={() => removeUrl(index)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-rose-700 shadow-sm transition hover:bg-rose-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="p-2">
                <p className="truncate text-xs font-medium text-admin-text-muted">
                  {formatCopy(copy.localImageLabel, { index: index + 1 })}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[132px] flex-col items-center justify-center rounded-xl border border-dashed border-admin-border bg-white px-4 py-6 text-center text-sm text-admin-text-muted">
          <ImagePlus className="mb-2 h-5 w-5" />
          {copy.emptyGallery}
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
  isSaving = false,
  isUploadPending = false,
  copy
}: {
  isSaving?: boolean;
  isUploadPending?: boolean;
  copy: Pick<ProductCenterCopy, 'imageUploading' | 'saveChanges' | 'savingChanges'>;
}) {
  const submitState = getProductEditorSubmitState({ isUploadPending, copy });

  return (
    <button
      type="submit"
      disabled={isSaving || submitState.disabled}
      className="inline-flex items-center gap-2 rounded-lg bg-admin-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-admin-accent-hover disabled:cursor-wait disabled:opacity-70"
    >
      <Check className="h-4 w-4" />
      {isSaving ? copy.savingChanges : submitState.label}
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
    <div className={`block space-y-2 ${className}`}>
      <span className="text-xs font-semibold uppercase text-admin-text-secondary">
        {label}
      </span>
      {children}
    </div>
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
      className={`sticky top-0 z-10 bg-admin-elevated px-4 py-2.5 text-[11px] font-bold uppercase text-admin-text-muted ${
        align === 'right' ? 'text-right' : 'text-left'
      } ${className}`}
    >
      {children}
    </th>
  );
}

function ProductThumb({ product }: { product: ProductCenterRow }) {
  return (
    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-admin-border bg-slate-100">
      {product.coverImageUrl ? (
        <NextImage
          src={product.coverImageUrl}
          alt={getProductDisplayName(product)}
          fill
          sizes="44px"
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
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${
        statusStyles[status] ?? 'bg-slate-100 text-slate-700 ring-slate-200'
      }`}
    >
      {status}
    </span>
  );
}

function filterButtonClass(isActive: boolean) {
  return `inline-flex h-7 items-center rounded-md border px-2.5 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-admin-accent/20 ${
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
