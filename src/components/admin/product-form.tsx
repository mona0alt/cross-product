import React from 'react';
import { AdminCard } from './admin-card';
import { AdminButton } from './admin-button';

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
};

export function ProductForm({
  mode,
  categories,
  product
}: {
  mode: 'create' | 'edit';
  categories: CategoryOption[];
  product?: ProductDraft;
}) {
  const inputClass =
    'w-full rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm text-admin-text-primary outline-none transition-all duration-200 placeholder:text-admin-text-muted focus:border-admin-accent/30 focus:ring-1 focus:ring-admin-accent/20';

  const labelClass = 'block text-sm font-medium text-admin-text-secondary mb-1.5';
  const sectionTitleClass = 'text-xl font-semibold text-admin-text-primary font-display';

  return (
    <form className="space-y-6">
      <AdminCard delay={1}>
        <p className="admin-kicker">Manual Import</p>
        <h2 className="mt-2 text-2xl font-semibold text-admin-text-primary font-display">
          {mode === 'create' ? '创建后进入审核' : '编辑后重新进入审核'}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-admin-text-secondary">
          手动录入商品也遵循统一审核规则。页面视觉重点放在信息完整度和提交流程，而不是直接发布。
        </p>
      </AdminCard>

      <AdminCard delay={2}>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="admin-kicker">Basic Info</p>
            <h3 className={sectionTitleClass}>基础信息</h3>
          </div>
          <span className="rounded-full border border-admin-border bg-admin-elevated px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-admin-text-secondary">
            来源：手动导入
          </span>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClass}>商品编码</label>
            <input defaultValue={product?.productCode} className={inputClass} placeholder="SKU-001" />
          </div>
          <div>
            <label className={labelClass}>Slug</label>
            <input defaultValue={product?.slug} className={inputClass} placeholder="product-slug" />
          </div>
          <div>
            <label className={labelClass}>分类</label>
            <select defaultValue={product?.categoryId} className={inputClass}>
              <option value="">选择分类</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>价格 USD</label>
            <input
              defaultValue={
                typeof product?.priceUsd === 'object'
                  ? product.priceUsd.toString()
                  : product?.priceUsd
              }
              className={inputClass}
              placeholder="0.00"
            />
          </div>
        </div>
      </AdminCard>

      <AdminCard delay={3}>
        <div>
          <p className="admin-kicker">Localized Content</p>
          <h3 className={sectionTitleClass}>多语言内容</h3>
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
              <input defaultValue={value} className={inputClass} placeholder={placeholder} />
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
          <h3 className={sectionTitleClass}>图片素材</h3>
        </div>
        <div className="mt-5 space-y-4">
          <div>
            <label className={labelClass}>封面图 URL</label>
            <input defaultValue={product?.coverImageUrl} className={inputClass} placeholder="https://..." />
          </div>
          <div>
            <label className={labelClass}>更多图片 URL</label>
            <textarea
              className={`${inputClass} min-h-[100px] resize-y`}
              placeholder="每行一条 URL"
            />
          </div>
        </div>
      </AdminCard>

      <AdminCard delay={5}>
        <div>
          <p className="admin-kicker">Review Notes</p>
          <h3 className={sectionTitleClass}>审核提示</h3>
          <p className="mt-2 text-sm leading-relaxed text-admin-text-secondary">
            系统会提示图片数量、英文摘要和重复风险。当前原型默认走&ldquo;提交审核&rdquo;而不是直接发布。
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-4">
          <select defaultValue={product?.status ?? 'draft'} className={inputClass}>
            <option value="draft">draft</option>
            <option value="pending">pending</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
          <label className="flex items-center gap-2 rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm text-admin-text-secondary cursor-pointer hover:border-admin-border-strong">
            <input
              type="checkbox"
              defaultChecked={product?.isRecommended}
              className="h-4 w-4 rounded border-admin-border bg-admin-surface text-admin-accent focus:ring-admin-accent/30"
            />
            推荐商品
          </label>
        </div>
      </AdminCard>

      <div className="flex flex-col gap-3 rounded-[24px] border border-admin-border bg-admin-surface p-5 shadow-[0_14px_40px_rgba(15,23,42,0.04)] md:flex-row md:items-center md:justify-between">
        <AdminButton type="button" variant="ghost">
          保存草稿
        </AdminButton>
        <div className="flex flex-wrap gap-2">
          <AdminButton type="button" variant="secondary">
            提交审核前预览
          </AdminButton>
          <AdminButton type="button" variant="primary">
            {mode === 'create' ? '提交审核' : '保存并重新审核'}
          </AdminButton>
        </div>
      </div>
    </form>
  );
}
