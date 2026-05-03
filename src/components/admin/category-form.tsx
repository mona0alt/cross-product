import React from 'react';
import { AdminButton } from './admin-button';
import { AdminTableShell } from './admin-table-shell';

type CategoryOption = {
  id: string;
  label: string;
};

export function CategoryForm({
  categories
}: {
  categories: CategoryOption[];
}) {
  const inputClass =
    'w-full rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm text-admin-text-primary outline-none transition-all duration-200 placeholder:text-admin-text-muted focus:border-admin-accent/30 focus:ring-1 focus:ring-admin-accent/20';

  return (
    <form className="space-y-6">
      <AdminTableShell title="数据库配置" description="借用参考稿设置页壳层承接分类服务配置。">
        <div className="grid gap-4 p-6 md:grid-cols-2">
          <input className={inputClass} defaultValue="category-db.internal" />
          <input className={inputClass} defaultValue="5432" />
          <input className={inputClass} defaultValue="catalog" />
          <input className={inputClass} defaultValue="admin_service" />
        </div>
      </AdminTableShell>

      <AdminTableShell title="分类结构与映射" description="保持现有字段，但套入统一配置骨架。">
        <div className="grid gap-4 p-6 md:grid-cols-2">
          <select className={inputClass}>
            <option value="">选择一级/二级分类父级</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
          <input className={inputClass} placeholder="图标 URL" />
          <input className={inputClass} placeholder="中文名称" />
          <input className={inputClass} placeholder="英文名称" />
          <input className={inputClass} placeholder="西语名称" />
          <input className={inputClass} placeholder="葡语名称" />
          <textarea
            className={`${inputClass} min-h-[100px] resize-y md:col-span-2`}
            placeholder="四语描述可在下一步扩展"
          />
          <input className={inputClass} placeholder="排序" type="number" />
        </div>
        <div className="border-t border-admin-border px-6 py-4">
          <AdminButton type="button" variant="primary">
            保存分类
          </AdminButton>
        </div>
      </AdminTableShell>
    </form>
  );
}
