import React from 'react';

type BannerItem = {
  id: string;
  imageUrl: string;
  targetType: string;
  targetId: string | null;
  targetUrl: string | null;
  sortOrder: number;
  isActive: boolean;
};

export function BannerForm({ banners }: { banners: BannerItem[] }) {
  return (
    <div className="space-y-6">
      <form className="grid gap-4 rounded-3xl border border-white/10 bg-slate-900/70 p-6 md:grid-cols-2">
        <input
          className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          placeholder="Banner 图片 URL"
        />
        <select className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100">
          <option value="category">分类</option>
          <option value="product">商品</option>
          <option value="url">外链</option>
        </select>
        <input
          className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          placeholder="目标 ID / URL"
        />
        <input
          className="rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100"
          placeholder="排序"
        />
        <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-slate-100">
          <input type="checkbox" defaultChecked />
          启用 Banner
        </label>
        <button
          type="button"
          className="rounded-full bg-amber-300 px-5 py-3 text-sm font-medium text-slate-950"
        >
          新建 Banner
        </button>
      </form>

      <div className="overflow-hidden rounded-3xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 bg-slate-900/70 text-sm text-slate-200">
          <thead className="bg-slate-950/70 text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">预览</th>
              <th className="px-4 py-3 text-left">目标</th>
              <th className="px-4 py-3 text-left">排序</th>
              <th className="px-4 py-3 text-left">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {banners.map((banner) => (
              <tr key={banner.id}>
                <td className="px-4 py-3">{banner.imageUrl}</td>
                <td className="px-4 py-3">{banner.targetType}</td>
                <td className="px-4 py-3">{banner.sortOrder}</td>
                <td className="px-4 py-3">
                  {banner.isActive ? '启用' : '停用'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
