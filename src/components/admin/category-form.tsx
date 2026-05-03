import React from 'react';
import { AdminCard } from './admin-card';
import { AdminButton } from './admin-button';
import { AdminPageHero } from './admin-page-hero';

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
      <AdminPageHero
        eyebrow="Category Management"
        title="分类结构与映射"
        description="用轻首屏解释分类录入、图标管理和多语言映射，保持配置页与核心工作流页风格一致。"
        metrics={[
          {
            label: '分类录入区',
            value: '多语言',
            detail: '支持中文、英文、西语、葡语字段'
          },
          {
            label: '图标素材',
            value: 'URL',
            detail: '保留分类图标管理入口感'
          },
          {
            label: '层级关系',
            value: '父子级',
            detail: '通过父级选择表达层级关系'
          },
          {
            label: '排序字段',
            value: '可控',
            detail: '支持后续展示顺序调整'
          }
        ]}
      />

      <AdminCard delay={1}>
        <p className="admin-kicker">Category Management</p>
        <h2 className="mt-2 text-xl font-semibold text-admin-text-primary font-display">
          分类表单
        </h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
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
            className={`${inputClass} min-h-[100px] resize-y`}
            placeholder="四语描述可在下一步扩展"
          />
          <input className={inputClass} placeholder="排序" type="number" />
        </div>
        <div className="mt-5">
          <AdminButton type="button" variant="primary">
            保存分类
          </AdminButton>
        </div>
      </AdminCard>
    </form>
  );
}
