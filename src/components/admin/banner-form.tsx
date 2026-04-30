import React from 'react';
import { AdminCard } from './admin-card';
import { AdminButton } from './admin-button';
import { StatusBadge } from './status-badge';

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
  const inputClass =
    'w-full rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm text-admin-text-primary outline-none transition-all duration-200 placeholder:text-admin-text-muted focus:border-admin-accent/30 focus:ring-1 focus:ring-admin-accent/20';

  return (
    <div className="space-y-6">
      <AdminCard delay={1}>
        <p className="text-[10px] uppercase tracking-[0.2em] text-admin-text-muted font-body">
          Banner Management
        </p>
        <h2 className="mt-1 text-xl font-semibold text-admin-text-primary font-display">
          横幅管理
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <input className={inputClass} placeholder="Banner 图片 URL" />
          <select className={inputClass}>
            <option value="category">分类</option>
            <option value="product">商品</option>
            <option value="url">外链</option>
          </select>
          <input className={inputClass} placeholder="目标 ID / URL" />
          <input className={inputClass} placeholder="排序" type="number" />
          <label className="flex items-center gap-2 rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm text-admin-text-secondary cursor-pointer hover:border-admin-border-strong md:col-span-2">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-admin-border bg-admin-surface text-admin-accent focus:ring-admin-accent/30"
            />
            启用 Banner
          </label>
        </div>
        <div className="mt-5">
          <AdminButton type="button" variant="primary">
            新建 Banner
          </AdminButton>
        </div>
      </AdminCard>

      <div className="overflow-hidden rounded-lg border border-admin-border">
        <table className="min-w-full divide-y divide-admin-border text-sm">
          <thead className="bg-admin-elevated text-admin-text-muted">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">预览</th>
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">目标</th>
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">排序</th>
              <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-admin-border bg-admin-surface">
            {banners.map((banner) => (
              <tr key={banner.id} className="transition-colors hover:bg-admin-elevated">
                <td className="px-4 py-3 text-admin-text-secondary max-w-[200px] truncate">{banner.imageUrl}</td>
                <td className="px-4 py-3 text-admin-text-secondary">{banner.targetType}</td>
                <td className="px-4 py-3 font-mono text-admin-text-primary">{banner.sortOrder}</td>
                <td className="px-4 py-3">
                  <StatusBadge
                    label={banner.isActive ? '启用' : '停用'}
                    tone={banner.isActive ? 'green' : 'slate'}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
