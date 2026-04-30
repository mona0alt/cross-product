import React from 'react';

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
  return (
    <form className="space-y-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="rounded-[2rem] bg-slate-950 p-6 text-white">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
          Manual Import
        </p>
        <h2 className="mt-3 text-2xl font-semibold">
          {mode === 'create' ? '创建后进入待审核' : '编辑后重新进入审核确认'}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
          手动导入的商品也不能绕过审核。优先补齐基础信息、英文摘要和封面图，再提交给商品中心统一处理。
        </p>
      </div>

      <section className="space-y-4 rounded-[2rem] border border-slate-200 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              Basic Info
            </p>
            <h3 className="text-xl font-semibold text-slate-950">基础信息</h3>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            来源：手动导入
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            defaultValue={product?.productCode}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
            placeholder="商品编码"
          />
          <input
            defaultValue={product?.slug}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
            placeholder="Slug"
          />
          <select
            defaultValue={product?.categoryId}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
          >
            <option value="">选择分类</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
          <input
            defaultValue={
              typeof product?.priceUsd === 'object'
                ? product.priceUsd.toString()
                : product?.priceUsd
            }
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
            placeholder="价格 USD"
          />
        </div>
      </section>

      <section className="space-y-4 rounded-[2rem] border border-slate-200 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Localized Content
          </p>
          <h3 className="text-xl font-semibold text-slate-950">多语言内容</h3>
          <p className="mt-2 text-sm text-slate-600">
            中文优先录入，英文摘要建议作为审核前的必备字段。
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
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
            <input
              key={name}
              defaultValue={value}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
              placeholder={placeholder}
            />
          ))}
        </div>
        <div className="grid gap-4">
          {[
            ['detailZh', '中文详情', product?.detailZh],
            ['detailEn', '英文详情', product?.detailEn],
            ['detailEs', '西语详情', product?.detailEs],
            ['detailPt', '葡语详情', product?.detailPt]
          ].map(([name, placeholder, value]) => (
            <textarea
              key={name}
              defaultValue={value}
              className="min-h-24 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
              placeholder={placeholder}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4 rounded-[2rem] border border-slate-200 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Media
          </p>
          <h3 className="text-xl font-semibold text-slate-950">图片素材</h3>
        </div>
        <input
          defaultValue={product?.coverImageUrl}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
          placeholder="封面图 URL"
        />
        <textarea
          className="min-h-24 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
          placeholder="更多图片 URL，每行一条"
        />
      </section>

      <section className="space-y-4 rounded-[2rem] border border-slate-200 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Review Notes
          </p>
          <h3 className="text-xl font-semibold text-slate-950">审核提示</h3>
          <p className="mt-2 text-sm leading-7 text-slate-600">
            系统会提示图片数量、英文摘要和重复风险。当前原型默认走“提交审核”而不是直接发布。
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <select
            defaultValue={product?.status ?? 'draft'}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
          >
            <option value="draft">draft</option>
            <option value="pending">pending</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
          <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900">
            <input type="checkbox" defaultChecked={product?.isRecommended} />
            推荐商品
          </label>
        </div>
      </section>

      <div className="flex flex-col gap-3 rounded-[2rem] border border-slate-200 bg-slate-50 p-5 md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700"
        >
          保存草稿
        </button>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700"
          >
            提交审核前预览
          </button>
          <button
            type="button"
            className="rounded-full bg-amber-300 px-5 py-3 text-sm font-semibold text-slate-950"
          >
            {mode === 'create' ? '提交审核' : '保存并重新审核'}
          </button>
        </div>
      </div>
    </form>
  );
}
