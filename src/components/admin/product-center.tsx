'use client';

import React, { useState } from 'react';
import NextImage from 'next/image';
import {
  Cable,
  Camera,
  Check,
  CirclePlus,
  Edit3,
  Eye,
  Headphones,
  Home,
  ImagePlus,
  Laptop,
  Package,
  Plus,
  Search,
  Trash2,
  Upload,
  Watch,
  X,
  type LucideIcon
} from 'lucide-react';

type LangCompletion = {
  en: 'ok' | 'missing';
  es: 'ok' | 'missing';
  pt: 'ok' | 'missing';
};

type ProductCenterRow = {
  id: string;
  name: string;
  productCode: string;
  category: string;
  source: string;
  status: string;
  aiScore: number;
  langCompletion: LangCompletion;
  action: string;
  content?: Record<'zh' | 'en' | 'es' | 'pt', { name: string; copy: string }>;
  gallery?: ReadonlyArray<{ id: string; url: string; isPrimary: boolean }>;
};

type ProductCenterData = {
  summary: {
    pending: number;
    todayProcessed: number;
  };
  rows: ReadonlyArray<ProductCenterRow>;
  createChecklist: ReadonlyArray<{
    label: string;
    detail: string;
    status: string;
  }>;
};

type ProductEditorMode = 'create' | 'edit';

const languageLabels = [
  ['en', 'EN'],
  ['es', 'ES'],
  ['pt', 'PT']
] as const;

const categoryOptions = ['清洁机器人', '巡检无人机', '工业机械臂'] as const;

const productCategories = [
  {
    label: '智能穿戴设备',
    english: 'Wearables',
    slug: 'wearables',
    icon: Watch,
    active: true,
    description: '包含智能手表、运动手环、智能眼镜等各种可穿戴电子产品。'
  },
  {
    label: '影音娱乐',
    english: 'Audio',
    slug: 'audio',
    icon: Headphones,
    active: false,
    description: '用于管理音频设备、影音配件及娱乐硬件。'
  },
  {
    label: '周边配件',
    english: 'Accessories',
    slug: 'accessories',
    icon: Cable,
    active: false,
    description: '用于管理线缆、充电器、收纳和保护类配件。'
  },
  {
    label: '电脑办公',
    english: 'Computing',
    slug: 'computing',
    icon: Laptop,
    active: false,
    description: '用于管理电脑、办公外设和生产力硬件。'
  },
  {
    label: '智能家居',
    english: 'Smart Home',
    slug: 'smart-home',
    icon: Home,
    active: false,
    description: '用于管理家庭自动化、传感器和智能控制设备。'
  }
] as const;

const statusStyles: Record<string, string> = {
  可发布: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  待审核: 'bg-amber-50 text-amber-700 ring-amber-200',
  补充信息: 'bg-sky-50 text-sky-700 ring-sky-200'
};

const editorButton =
  'flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-900';

const formInputClass =
  'w-full rounded-lg border border-admin-border bg-white px-3 py-2 text-sm text-admin-text-primary outline-none transition focus:border-admin-accent focus:ring-2 focus:ring-admin-accent/15';

export function ProductCenter({
  data,
  defaultSelectedProductId
}: {
  data: ProductCenterData;
  defaultSelectedProductId?: string;
  defaultTab?: 'audit' | 'create';
}) {
  const firstProductId = data.rows[0]?.id ?? null;
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    defaultSelectedProductId ?? firstProductId
  );
  const [isEditorOpen, setIsEditorOpen] = useState(Boolean(firstProductId));
  const [editorMode, setEditorMode] = useState<ProductEditorMode>('edit');

  const selectedProduct =
    selectedProductId === null
      ? null
      : data.rows.find((row) => row.id === selectedProductId) ?? data.rows[0] ?? null;

  const openEditor = (productId: string) => {
    setSelectedProductId(productId);
    setEditorMode('edit');
    setIsEditorOpen(true);
  };

  const openCreateEditor = () => {
    setSelectedProductId(null);
    setEditorMode('create');
    setIsEditorOpen(true);
  };

  return (
    <section className="relative overflow-hidden rounded-xl border border-admin-border bg-admin-bg shadow-sm">
      <header className="flex flex-col gap-4 border-b border-admin-border bg-white px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-5">
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
              placeholder="搜索库存..."
              className="h-10 w-full rounded-lg border border-admin-border bg-admin-elevated pl-9 pr-3 text-sm text-admin-text-primary outline-none transition focus:border-admin-accent focus:bg-white focus:ring-2 focus:ring-emerald-500/10"
            />
          </label>
        </div>

        <span className="hidden text-xs font-medium text-admin-text-muted lg:block">
          从类目进入商品，点击行从右侧编辑。
        </span>
      </header>

      <div className="grid min-h-[680px] gap-5 bg-admin-bg p-4 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] lg:p-5">
        <aside className="rounded-xl border border-admin-border bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-admin-text-primary">产品类目</h3>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-lg bg-admin-accent px-3 py-2 text-sm font-semibold text-white transition hover:bg-admin-accent-hover"
            >
              <CirclePlus className="h-4 w-4" />
              添加类目
            </button>
          </div>

          <div className="space-y-3">
            {productCategories.map((category) => (
              <ProductCategoryItem key={category.slug} category={category} />
            ))}
          </div>
        </aside>

        <main className="space-y-5">
          <section className="rounded-xl border border-admin-border bg-white p-5 shadow-sm">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-admin-text-primary">智能穿戴设备 详情</h3>
                <p className="mt-1 text-sm text-admin-text-secondary">
                  管理该类目的基本信息、属性及关联产品。
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-admin-accent">
                状态: 活跃
              </span>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_220px]">
              <div className="grid gap-5 md:grid-cols-2">
                <Field label="类目名称 (CN)">
                  <input className={formInputClass} defaultValue="智能穿戴设备" />
                </Field>
                <Field label="Slug (EN)">
                  <input className={formInputClass} defaultValue="wearables" />
                </Field>
                <Field label="类目描述" className="md:col-span-2">
                  <textarea
                    className={`${formInputClass} min-h-[112px] resize-y leading-6`}
                    defaultValue={productCategories[0].description}
                  />
                </Field>
              </div>

              <Field label="类目封面图">
                <button
                  type="button"
                  className="flex aspect-square w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-admin-border bg-admin-elevated p-4 text-center text-admin-text-muted transition hover:border-admin-accent hover:bg-blue-50 hover:text-admin-accent"
                >
                  <Camera className="h-9 w-9" />
                  <span className="mt-3 text-xs font-semibold">点击或拖拽上传类目图标/封面</span>
                  <span className="mt-2 text-[11px]">支持 JPG, PNG (Max 2MB)</span>
                </button>
              </Field>
            </div>

            <div className="mt-6 flex gap-3 border-t border-admin-border pt-5">
              <button
                type="button"
                className="rounded-lg bg-admin-accent px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-admin-accent-hover"
              >
                保存更改
              </button>
              <button
                type="button"
                className="rounded-lg border border-admin-border bg-white px-8 py-2.5 text-sm font-semibold text-admin-text-secondary transition hover:border-admin-border-strong hover:bg-admin-elevated"
              >
                取消
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-admin-border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-admin-border bg-admin-elevated px-5 py-4">
              <div>
                <h3 className="text-base font-semibold text-admin-text-primary">
                  管理产品 ({data.rows.length})
                </h3>
                <p className="mt-1 text-xs text-admin-text-muted">
                  从类目进入商品列表，点击商品可从右侧编辑。
                </p>
              </div>
              <button
                type="button"
                onClick={openCreateEditor}
                className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-admin-accent px-4 text-sm font-semibold text-white transition hover:bg-admin-accent-hover"
              >
                <Plus className="h-4 w-4" />
                新增商品
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead className="bg-admin-elevated text-admin-text-muted">
                  <tr>
                    <ColumnHeader>产品名称</ColumnHeader>
                    <ColumnHeader>SKU</ColumnHeader>
                    <ColumnHeader>库存</ColumnHeader>
                    <ColumnHeader>状态</ColumnHeader>
                    <ColumnHeader>价格</ColumnHeader>
                    <ColumnHeader align="right">操作</ColumnHeader>
                  </tr>
                </thead>
                <tbody className="divide-y divide-admin-border">
                  {data.rows.map((row, index) => (
                    <tr
                      key={row.id}
                      onClick={() => openEditor(row.id)}
                      className={`cursor-pointer transition hover:bg-blue-50/50 ${
                        selectedProduct?.id === row.id ? 'bg-blue-50/70' : 'bg-white'
                      }`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <ProductThumb product={row} />
                          <span className="text-sm font-medium text-admin-text-primary">
                            {row.content?.zh.name ?? row.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono text-sm text-admin-text-secondary">
                        {row.productCode}
                      </td>
                      <td className="px-5 py-3 text-sm text-admin-text-primary">
                        {formatStock(index)}
                      </td>
                      <td className="px-5 py-3">
                        <ProductStatus status={row.status} />
                      </td>
                      <td className="px-5 py-3 text-sm text-admin-text-primary">
                        {formatPrice(row.aiScore)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button
                          type="button"
                          aria-label={`编辑 ${row.name}`}
                          onClick={(event) => {
                            event.stopPropagation();
                            openEditor(row.id);
                          }}
                          className={editorButton}
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      <ProductEditor
        product={selectedProduct}
        mode={editorMode}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />
    </section>
  );
}

function ProductCategoryItem({
  category
}: {
  category: (typeof productCategories)[number];
}) {
  const Icon = category.icon;

  return (
    <div
      className={`group flex items-center justify-between gap-3 rounded-lg border p-3 transition ${
        category.active
          ? 'border-admin-accent/25 bg-blue-50 text-admin-accent'
          : 'border-transparent text-admin-text-primary hover:bg-admin-elevated'
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <Icon className={`h-5 w-5 shrink-0 ${category.active ? 'text-admin-accent' : 'text-admin-text-muted'}`} />
        <span className={`text-sm ${category.active ? 'font-bold' : 'font-medium'}`}>
          {category.label} ({category.english})
        </span>
      </div>
      <div className={`flex shrink-0 gap-1 ${category.active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
        <IconButton label={`编辑 ${category.label}`} icon={Edit3} />
        <IconButton label={`删除 ${category.label}`} icon={Trash2} />
      </div>
    </div>
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
  const primaryImage = product.gallery?.find((image) => image.isPrimary) ?? product.gallery?.[0];

  return (
    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-admin-border bg-slate-100">
      {primaryImage ? (
        <NextImage
          src={primaryImage.url}
          alt={product.name}
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

function ProductEditor({
  product,
  mode,
  isOpen,
  onClose
}: {
  product: ProductCenterRow | null;
  mode: ProductEditorMode;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) {
    return null;
  }

  const isCreate = mode === 'create';

  if (!product && !isCreate) {
    return (
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-editor-title"
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[560px] flex-col border-l border-admin-border bg-white shadow-[-24px_0_48px_rgba(15,23,42,0.12)]"
      >
        <div className="flex items-center justify-between border-b border-admin-border bg-admin-elevated px-5 py-4">
          <div>
            <h3 id="product-editor-title" className="text-base font-bold text-admin-text-primary">
              编辑商品
            </h3>
            <p className="mt-0.5 text-xs text-admin-text-muted">请选择一个商品继续编辑。</p>
          </div>
          <button
            type="button"
            aria-label="关闭编辑商品"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-admin-text-muted transition hover:bg-white hover:text-admin-text-primary"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-1 items-center justify-center p-5">
          <div className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-admin-border bg-admin-elevated px-6 py-12 text-center">
            <Package className="h-8 w-8 text-admin-text-muted" />
            <p className="mt-3 text-sm font-semibold text-admin-text-primary">暂无商品</p>
            <p className="mt-1 text-xs text-admin-text-muted">新增商品后可在这里编辑详情。</p>
          </div>
        </div>
      </aside>
    );
  }

  const gallery = product?.gallery ?? [];
  const primaryContent = product?.content?.zh;

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-editor-title"
      className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[560px] flex-col border-l border-admin-border bg-white shadow-[-24px_0_48px_rgba(15,23,42,0.12)]"
    >
      <div className="flex items-center justify-between border-b border-admin-border bg-admin-elevated px-5 py-4">
        <div>
          <h3 id="product-editor-title" className="text-base font-bold text-admin-text-primary">
            {isCreate ? '新增商品' : '编辑商品'}
          </h3>
          <p className="mt-0.5 text-xs text-admin-text-muted">
            {isCreate ? '填写商品信息后保存。' : '最后更新时间: 2 小时前'}
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

      <div className="flex-1 space-y-6 overflow-y-auto p-5">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase text-admin-text-muted">产品媒体</h4>
            <span className="text-xs text-admin-text-muted">{gallery.length}/10</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {gallery.slice(0, 5).map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-lg border border-admin-border bg-slate-100"
              >
                <NextImage
                  src={image.url}
                  alt={image.isPrimary ? '主图' : '商品图片'}
                  fill
                  sizes="120px"
                  className="object-cover"
                  unoptimized
                />
                {image.isPrimary ? (
                  <span className="absolute left-1.5 top-1.5 rounded bg-admin-accent px-1.5 py-0.5 text-[10px] font-bold text-white">
                    主图
                  </span>
                ) : null}
                <button
                  type="button"
                  className="absolute inset-0 flex items-center justify-center bg-slate-950/35 text-white opacity-0 transition group-hover:opacity-100"
                  aria-label="删除图片"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-admin-border text-admin-text-muted transition hover:border-admin-accent hover:bg-emerald-50 hover:text-admin-accent"
            >
              <ImagePlus className="h-5 w-5" />
              <span className="text-xs font-semibold">上传</span>
            </button>
          </div>
          <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
            {product?.action ?? '请补充商品信息后保存。'}
          </p>
        </section>

        <section className="space-y-3">
          <h4 className="text-xs font-bold uppercase text-admin-text-muted">基础信息</h4>
          <Field label="产品名称">
            <input
              type="text"
              defaultValue={primaryContent?.name ?? product?.name ?? ''}
              className="w-full rounded-lg border border-admin-border px-3 py-2 text-sm text-admin-text-primary outline-none transition focus:border-admin-accent focus:ring-2 focus:ring-emerald-500/10"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="类别">
              <select
                defaultValue={product?.category ?? ''}
                className="w-full rounded-lg border border-admin-border bg-white px-3 py-2 text-sm text-admin-text-primary outline-none transition focus:border-admin-accent focus:ring-2 focus:ring-emerald-500/10"
              >
                {isCreate ? <option value="">选择类别</option> : null}
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="价格 (美元)">
              <input
                type="text"
                defaultValue={product ? formatPrice(product.aiScore).replace('$', '') : ''}
                className="w-full rounded-lg border border-admin-border px-3 py-2 font-mono text-sm text-admin-text-primary outline-none transition focus:border-admin-accent focus:ring-2 focus:ring-emerald-500/10"
              />
            </Field>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase text-admin-text-muted">产品描述</h4>
            <div className="flex rounded-lg border border-admin-border bg-admin-elevated p-1">
              <EditorIconButton label="预览" icon={Eye} />
              <EditorIconButton label="上传" icon={Upload} />
            </div>
          </div>
          <div className="overflow-hidden rounded-lg border border-admin-border">
            <div className="flex gap-1 border-b border-admin-border bg-admin-elevated px-2 py-1.5">
              {languageLabels.map(([, label]) => (
                <span
                  key={label}
                  className="rounded-md bg-white px-2 py-1 text-[10px] font-bold text-admin-text-secondary ring-1 ring-admin-border"
                >
                  {label}
                </span>
              ))}
            </div>
            <textarea
              rows={6}
              defaultValue={primaryContent?.copy ?? ''}
              className="w-full resize-none border-0 p-3 text-sm leading-6 text-admin-text-primary outline-none focus:ring-0"
            />
          </div>
        </section>

        <section className="space-y-4">
          <Toggle label="店铺可见" detail="在前台商品列表和详情页展示" checked={!isCreate} />
          <Toggle label="推荐展示" detail="允许进入首页轮播或推荐位" checked={product?.status === '可发布'} />
        </section>
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
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-admin-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-admin-accent-hover"
        >
          <Check className="h-4 w-4" />
          保存更改
        </button>
      </footer>
    </aside>
  );
}

function Field({
  label,
  children,
  className = ''
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block space-y-2 ${className}`}>
      <span className="text-xs font-semibold uppercase text-admin-text-secondary">{label}</span>
      {children}
    </label>
  );
}

function IconButton({ label, icon: Icon }: { label: string; icon: LucideIcon }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded-md text-current transition hover:bg-white"
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function ProductStatus({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ${
        statusStyles[status] ?? 'bg-slate-100 text-slate-600 ring-slate-200'
      }`}
    >
      {status}
    </span>
  );
}

function EditorIconButton({ label, icon: Icon }: { label: string; icon: LucideIcon }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-7 w-7 items-center justify-center rounded-md text-admin-text-muted transition hover:bg-white hover:text-admin-text-primary"
    >
      <Icon className="h-3.5 w-3.5" />
    </button>
  );
}

function Toggle({
  label,
  detail,
  checked
}: {
  label: string;
  detail: string;
  checked: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-admin-text-primary">{label}</p>
        <p className="mt-0.5 text-xs text-admin-text-muted">{detail}</p>
      </div>
      <button
        type="button"
        aria-pressed={checked}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? 'bg-admin-accent' : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}

function formatPrice(score: number) {
  return `$${(score * 3 + 49).toFixed(2)}`;
}

function formatStock(index: number) {
  return ['432', '1,024', '89'][index] ?? `${128 + index * 37}`;
}
