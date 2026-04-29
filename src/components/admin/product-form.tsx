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
    <form className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Section
          </p>
          <h2 className="text-xl font-semibold text-white">基础信息区</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            defaultValue={product?.productCode}
            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100"
            placeholder="商品编码"
          />
          <input
            defaultValue={product?.slug}
            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100"
            placeholder="Slug"
          />
          <select
            defaultValue={product?.categoryId}
            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100"
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
            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100"
            placeholder="价格 USD"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Section
          </p>
          <h2 className="text-xl font-semibold text-white">四语内容区</h2>
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
              className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100"
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
              className="min-h-24 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100"
              placeholder={placeholder}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Section
          </p>
          <h2 className="text-xl font-semibold text-white">图片区</h2>
        </div>
        <input
          defaultValue={product?.coverImageUrl}
          className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          placeholder="封面图 URL"
        />
        <textarea
          className="min-h-24 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          placeholder="更多图片 URL，每行一条"
        />
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Section
          </p>
          <h2 className="text-xl font-semibold text-white">发布控制区</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          <select
            defaultValue={product?.status ?? 'draft'}
            className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          >
            <option value="draft">draft</option>
            <option value="pending">pending</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
          <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100">
            <input type="checkbox" defaultChecked={product?.isRecommended} />
            推荐商品
          </label>
          <button
            type="button"
            className="rounded-full bg-amber-300 px-5 py-3 text-sm font-medium text-slate-950"
          >
            {mode === 'create' ? '创建草稿' : '保存修改'}
          </button>
        </div>
      </section>
    </form>
  );
}
