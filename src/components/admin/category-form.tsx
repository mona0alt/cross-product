import React from 'react';

type CategoryOption = {
  id: string;
  label: string;
};

export function CategoryForm({
  categories
}: {
  categories: CategoryOption[];
}) {
  return (
    <form className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/70 p-6">
      <h2 className="text-xl font-semibold text-white">分类表单</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <select className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100">
          <option value="">选择一级/二级分类父级</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label}
            </option>
          ))}
        </select>
        <input
          className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          placeholder="图标 URL"
        />
        <input
          className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          placeholder="中文名称"
        />
        <input
          className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          placeholder="英文名称"
        />
        <input
          className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          placeholder="西语名称"
        />
        <input
          className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          placeholder="葡语名称"
        />
        <textarea
          className="min-h-24 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          placeholder="四语描述可在下一步扩展"
        />
        <input
          className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          placeholder="排序"
        />
      </div>
      <button
        type="button"
        className="rounded-full bg-amber-300 px-5 py-3 text-sm font-medium text-slate-950"
      >
        保存分类
      </button>
    </form>
  );
}
