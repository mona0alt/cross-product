import React from 'react';
import { createProductFromForm, updateProductFromForm } from '@/features/admin/product-actions';
import { AdminCard } from './admin-card';
import { AdminButton } from './admin-button';
import { AdminImageUploadInput } from './admin-image-upload-input';

type CategoryOption = {
  id: string;
  label: string;
};

type ProductDraft = {
  id?: string;
  productCode?: string;
  slug?: string;
  categoryId?: string;
  priceUsd?: string | number | { toString(): string };
  coverImageUrl?: string;
  status?: string;
  isRecommended?: boolean;
  sortOrder?: number;
  nameZh?: string;
  nameEn?: string;
  nameEs?: string;
  namePt?: string;
  introZh?: string;
  introEn?: string;
  introEs?: string;
  introPt?: string;
  detailZh?: string;
  detailEn?: string;
  detailEs?: string;
  detailPt?: string;
  images?: Array<{
    imageUrl: string;
    sortOrder?: number;
  }>;
};

type ProductFormCopy = {
  createTitle: string;
  editTitle: string;
  basicInfo: string;
  localizedContent: string;
  media: string;
  reviewNotes: string;
  productCode: string;
  slug: string;
  category: string;
  priceUsd: string;
  coverImageUrl: string;
  galleryImageUrls: string;
  recommended: string;
  saveDraft: string;
  preview: string;
  submit: string;
};

export function ProductForm({
  mode,
  categories,
  product,
  copy,
  uploadLabel = '上传图片'
}: {
  mode: 'create' | 'edit';
  categories: CategoryOption[];
  product?: ProductDraft;
  copy?: ProductFormCopy;
  uploadLabel?: string;
}) {
  const inputClass =
    'w-full rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm text-admin-text-primary outline-none transition-all duration-200 placeholder:text-admin-text-muted focus:border-admin-accent/30 focus:ring-1 focus:ring-admin-accent/20';

  const labelClass = 'block text-sm font-medium text-admin-text-secondary mb-1.5';
  const sectionTitleClass = 'text-xl font-semibold text-admin-text-primary font-display';
  const labels: ProductFormCopy = copy ?? {
    createTitle: '创建后进入审核',
    editTitle: '编辑后重新进入审核',
    basicInfo: '基础信息',
    localizedContent: '多语言内容',
    media: '图片素材',
    reviewNotes: '审核提示',
    productCode: '商品编码',
    slug: 'Slug',
    category: '分类',
    priceUsd: '价格 USD',
    coverImageUrl: '封面图 URL',
    galleryImageUrls: '更多图片 URL',
    recommended: '推荐商品',
    saveDraft: '保存草稿',
    preview: '提交审核前预览',
    submit: mode === 'create' ? '提交审核' : '保存并重新审核'
  };
  const galleryUrls = [...(product?.images ?? [])]
    .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0))
    .map((image) => image.imageUrl)
    .join('\n');
  const formAction = async (formData: FormData) => {
    'use server';

    if (mode === 'edit' && product?.id) {
      await updateProductFromForm(product.id, formData);
      return;
    }

    await createProductFromForm(formData);
  };

  return (
    <form action={formAction} className="space-y-6">
      <AdminCard delay={1}>
        <p className="admin-kicker">Manual Import</p>
        <h2 className="mt-2 text-2xl font-semibold text-admin-text-primary font-display">
          {mode === 'create' ? labels.createTitle : labels.editTitle}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-admin-text-secondary">
          手动录入商品也遵循统一审核规则。页面视觉重点放在信息完整度和提交流程，而不是直接发布。
        </p>
      </AdminCard>

      <AdminCard delay={2}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="admin-kicker">Basic Info</p>
            <h3 className={sectionTitleClass}>{labels.basicInfo}</h3>
          </div>
          <span className="rounded-full border border-admin-border bg-admin-elevated px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-admin-text-secondary">
            来源：手动导入
          </span>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>{labels.productCode}</label>
            <input name="productCode" defaultValue={product?.productCode} className={inputClass} placeholder="SKU-001" />
          </div>
          <div>
            <label className={labelClass}>{labels.slug}</label>
            <input name="slug" defaultValue={product?.slug} className={inputClass} placeholder="product-slug" />
          </div>
          <div>
            <label className={labelClass}>{labels.category}</label>
            <select name="categoryId" defaultValue={product?.categoryId} className={inputClass}>
              <option value="">选择分类</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>{labels.priceUsd}</label>
            <input
              name="priceUsd"
              defaultValue={
                typeof product?.priceUsd === 'object'
                  ? product.priceUsd.toString()
                  : product?.priceUsd
              }
              className={inputClass}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className={labelClass}>Sort Order</label>
            <input name="sortOrder" defaultValue={product?.sortOrder ?? 0} className={inputClass} type="number" />
          </div>
        </div>
      </AdminCard>

      <AdminCard delay={3}>
        <div>
          <p className="admin-kicker">Localized Content</p>
          <h3 className={sectionTitleClass}>{labels.localizedContent}</h3>
          <p className="mt-2 text-sm text-admin-text-secondary">
            中文优先录入，英文摘要建议作为审核前的必备字段。
          </p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            ['nameZh', '中文名称', product?.nameZh],
            ['nameEn', '英文名称', product?.nameEn],
            ['nameEs', '西语名称', product?.nameEs],
            ['namePt', '葡语名称', product?.namePt],
            ['introZh', '中文简介', product?.introZh],
            ['introEn', '英文简介', product?.introEn],
            ['introEs', '西语简介', product?.introEs],
            ['introPt', '葡语简介', product?.introPt]
          ].map(([name, placeholder, value]) => (
            <div key={name}>
              <label className={labelClass}>{placeholder}</label>
              <input name={name} defaultValue={value} className={inputClass} placeholder={placeholder} />
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-4">
          {[
            ['detailZh', '中文详情', product?.detailZh],
            ['detailEn', '英文详情', product?.detailEn],
            ['detailEs', '西语详情', product?.detailEs],
            ['detailPt', '葡语详情', product?.detailPt]
          ].map(([name, placeholder, value]) => (
            <div key={name}>
              <label className={labelClass}>{placeholder}</label>
              <textarea
                name={name}
                defaultValue={value}
                className={`${inputClass} min-h-[100px] resize-y`}
                placeholder={placeholder}
              />
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard delay={4}>
        <div>
          <p className="admin-kicker">Media</p>
          <h3 className={sectionTitleClass}>{labels.media}</h3>
        </div>
        <div className="mt-5 space-y-4">
          <AdminImageUploadInput
            name="coverImageUrl"
            label={labels.coverImageUrl}
            uploadLabel={uploadLabel}
            defaultValue={product?.coverImageUrl}
            placeholder="https://..."
            scope="product"
          />
          <AdminImageUploadInput
            name="galleryImageUrls"
            label={labels.galleryImageUrls}
            uploadLabel={uploadLabel}
            defaultValue={galleryUrls}
            placeholder="每行一条 URL"
            scope="product"
            multiline
          />
        </div>
      </AdminCard>

      <AdminCard delay={5}>
        <div>
          <p className="admin-kicker">Review Notes</p>
          <h3 className={sectionTitleClass}>{labels.reviewNotes}</h3>
          <p className="mt-2 text-sm leading-relaxed text-admin-text-secondary">
            系统会提示图片数量、英文摘要和重复风险。当前原型默认走&ldquo;提交审核&rdquo;而不是直接发布。
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-4">
          <select name="status" defaultValue={product?.status ?? 'draft'} className={inputClass}>
            <option value="draft">draft</option>
            <option value="pending">pending</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
          <label className="flex items-center gap-2 rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm text-admin-text-secondary cursor-pointer hover:border-admin-border-strong">
            <input
              name="isRecommended"
              type="checkbox"
              defaultChecked={product?.isRecommended}
              className="h-4 w-4 rounded border-admin-border bg-admin-surface text-admin-accent focus:ring-admin-accent/30"
            />
            {labels.recommended}
          </label>
        </div>
      </AdminCard>

      <div className="flex flex-col gap-3 rounded-[24px] border border-admin-border bg-admin-surface p-5 shadow-[0_14px_40px_rgba(15,23,42,0.04)] md:flex-row md:items-center md:justify-between">
        <AdminButton type="submit" variant="ghost">
          {labels.saveDraft}
        </AdminButton>
        <div className="flex flex-wrap gap-2">
          <AdminButton type="button" variant="secondary">
            {labels.preview}
          </AdminButton>
          <AdminButton type="submit" variant="primary">
            {labels.submit}
          </AdminButton>
        </div>
      </div>
    </form>
  );
}
