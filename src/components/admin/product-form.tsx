import React from 'react';
import { createProductFromForm, updateProductFromForm } from '@/features/admin/product-actions';
import { AdminCard } from './admin-card';
import { AdminButton } from './admin-button';
import { AdminSelect } from './admin-select';
import {
  AdminCategorySelect,
  type AdminCategory
} from './admin-category-select';
import {
  AdminImageUploadInput,
  type AdminImageUploadCopy
} from './admin-image-upload-input';

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
  manualImportDescription: string;
  manualImportSource: string;
  selectCategory: string;
  statusOptions: Record<'draft' | 'pending' | 'published' | 'archived', string>;
  sortOrder: string;
  localizedContentDescription: string;
  nameZhLabel: string;
  nameEnLabel: string;
  nameEsLabel: string;
  namePtLabel: string;
  introZhLabel: string;
  introEnLabel: string;
  introEsLabel: string;
  introPtLabel: string;
  detailZhLabel: string;
  detailEnLabel: string;
  detailEsLabel: string;
  detailPtLabel: string;
  coverPreviewAlt: string;
  removeCoverImage: string;
  reviewNotesDescription: string;
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

function getProductFormUploadCopy(copy: ProductFormCopy): AdminImageUploadCopy {
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

export function ProductForm({
  mode,
  categories,
  product,
  copy,
  uploadLabel = '上传图片'
}: {
  mode: 'create' | 'edit';
  categories: AdminCategory[];
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
    coverImageUrl: '封面主图',
    galleryImageUrls: '更多图片',
    recommended: '推荐商品',
    saveDraft: '保存草稿',
    preview: '提交审核前预览',
    submit: mode === 'create' ? '提交审核' : '保存并重新审核',
    manualImportDescription: '手动录入商品也遵循统一审核规则。页面视觉重点放在信息完整度和提交流程，而不是直接发布。',
    manualImportSource: '来源：手动导入',
    selectCategory: '选择分类',
    statusOptions: {
      draft: '草稿',
      pending: '待审核',
      published: '已发布',
      archived: '已归档'
    },
    sortOrder: '排序',
    localizedContentDescription: '中文优先录入，英文摘要建议作为审核前的必备字段。',
    nameZhLabel: '中文名称',
    nameEnLabel: '英文名称',
    nameEsLabel: '西语名称',
    namePtLabel: '葡语名称',
    introZhLabel: '中文简介',
    introEnLabel: '英文简介',
    introEsLabel: '西语简介',
    introPtLabel: '葡语简介',
    detailZhLabel: '中文详情',
    detailEnLabel: '英文详情',
    detailEsLabel: '西语详情',
    detailPtLabel: '葡语详情',
    coverPreviewAlt: '商品封面',
    removeCoverImage: '移除封面主图',
    reviewNotesDescription: '系统会提示图片数量、英文摘要和重复风险。当前原型默认走“提交审核”而不是直接发布。',
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
  const uploadCopy = getProductFormUploadCopy(labels);
  const statusOptions = [
    { value: 'draft', label: labels.statusOptions.draft },
    { value: 'pending', label: labels.statusOptions.pending },
    { value: 'published', label: labels.statusOptions.published },
    { value: 'archived', label: labels.statusOptions.archived }
  ];
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
          {labels.manualImportDescription}
        </p>
      </AdminCard>

      <AdminCard delay={2}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="admin-kicker">Basic Info</p>
            <h3 className={sectionTitleClass}>{labels.basicInfo}</h3>
          </div>
          <span className="rounded-full border border-admin-border bg-admin-elevated px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-admin-text-secondary">
            {labels.manualImportSource}
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
            <AdminCategorySelect
              name="categoryId"
              categories={categories}
              defaultValue={product?.categoryId ?? ''}
              placeholder={labels.selectCategory}
            />
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
            <label className={labelClass}>{labels.sortOrder}</label>
            <input name="sortOrder" defaultValue={product?.sortOrder ?? 0} className={inputClass} type="number" />
          </div>
        </div>
      </AdminCard>

      <AdminCard delay={3}>
        <div>
          <p className="admin-kicker">Localized Content</p>
          <h3 className={sectionTitleClass}>{labels.localizedContent}</h3>
          <p className="mt-2 text-sm text-admin-text-secondary">
            {labels.localizedContentDescription}
          </p>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {[
            ['nameZh', labels.nameZhLabel, product?.nameZh],
            ['nameEn', labels.nameEnLabel, product?.nameEn],
            ['nameEs', labels.nameEsLabel, product?.nameEs],
            ['namePt', labels.namePtLabel, product?.namePt],
            ['introZh', labels.introZhLabel, product?.introZh],
            ['introEn', labels.introEnLabel, product?.introEn],
            ['introEs', labels.introEsLabel, product?.introEs],
            ['introPt', labels.introPtLabel, product?.introPt]
          ].map(([name, placeholder, value]) => (
            <div key={name}>
              <label className={labelClass}>{placeholder}</label>
              <input name={name} defaultValue={value} className={inputClass} placeholder={placeholder} />
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-4">
          {[
            ['detailZh', labels.detailZhLabel, product?.detailZh],
            ['detailEn', labels.detailEnLabel, product?.detailEn],
            ['detailEs', labels.detailEsLabel, product?.detailEs],
            ['detailPt', labels.detailPtLabel, product?.detailPt]
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
            scope="product"
            showPreview
            previewAlt={product?.nameZh ?? labels.coverPreviewAlt}
            clearLabel={labels.removeCoverImage}
            uploadCopy={uploadCopy}
          />
          <AdminImageUploadInput
            name="galleryImageUrls"
            label={labels.galleryImageUrls}
            uploadLabel={uploadLabel}
            defaultValue={galleryUrls}
            scope="product"
            multiline
            uploadCopy={uploadCopy}
          />
        </div>
      </AdminCard>

      <AdminCard delay={5}>
        <div>
          <p className="admin-kicker">Review Notes</p>
          <h3 className={sectionTitleClass}>{labels.reviewNotes}</h3>
          <p className="mt-2 text-sm leading-relaxed text-admin-text-secondary">
            {labels.reviewNotesDescription}
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-4">
          <AdminSelect
            name="status"
            defaultValue={product?.status ?? 'draft'}
            options={statusOptions}
            className="min-w-[220px]"
          />
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
