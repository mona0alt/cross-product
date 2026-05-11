import React from 'react';
import { createBannerFromForm, updateBannerFromForm } from '@/features/admin/banner-actions';
import { AdminCard } from './admin-card';
import { AdminButton } from './admin-button';
import { AdminImageUploadInput } from './admin-image-upload-input';
import { AdminPageHero } from './admin-page-hero';
import { AdminTableShell } from './admin-table-shell';
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

type BannerFormCopy = {
  title: string;
  description: string;
  formTitle: string;
  imageUrl: string;
  targetType: string;
  targetValue: string;
  sortOrder: string;
  create: string;
  list: string;
};

export function BannerForm({
  banners,
  copy,
  uploadLabel = '上传图片',
  common
}: {
  banners: BannerItem[];
  copy?: BannerFormCopy;
  uploadLabel?: string;
  common?: {
    save: string;
    enabled: string;
    disabled: string;
  };
}) {
  const inputClass =
    'w-full rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm text-admin-text-primary outline-none transition-all duration-200 placeholder:text-admin-text-muted focus:border-admin-accent/30 focus:ring-1 focus:ring-admin-accent/20';
  const labels = copy ?? {
    title: '首页展示素材',
    description: '统一管理首页 Banner 的图片、目标类型和启用状态，帮助客户理解展示位配置能力。',
    formTitle: '横幅管理',
    imageUrl: 'Banner 图片 URL',
    targetType: '目标类型',
    targetValue: '目标 ID / URL',
    sortOrder: '排序',
    create: '新建 Banner',
    list: 'Banner 列表'
  };
  const commonLabels = common ?? {
    save: '保存',
    enabled: '启用',
    disabled: '停用'
  };
  const createAction = async (formData: FormData) => {
    'use server';
    await createBannerFromForm(formData);
  };

  return (
    <div className="space-y-6">
      <AdminPageHero
        eyebrow="Banner Management"
        title={labels.title}
        description={labels.description}
        metrics={[
          {
            label: '已配置 Banner',
            value: String(banners.length),
            detail: '按排序顺序管理首页素材'
          },
          {
            label: '目标类型',
            value: '分类 / 商品 / 外链',
            detail: '支持静态确认跳转类型'
          },
          {
            label: '启用状态',
            value: '可见',
            detail: '通过状态标签表达前台展示状态'
          },
          {
            label: '内容位置',
            value: '首页',
            detail: '聚焦首屏与活动横幅素材'
          }
        ]}
      />

      <AdminCard delay={1}>
        <p className="admin-kicker">Banner Management</p>
        <h2 className="mt-2 text-xl font-semibold text-admin-text-primary font-display">
          {labels.formTitle}
        </h2>
        <form action={createAction}>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <AdminImageUploadInput
              name="imageUrl"
              label={labels.imageUrl}
              uploadLabel={uploadLabel}
              placeholder="https://..."
              scope="banner"
            />
            <div>
              <label className="mb-2 block text-sm font-medium text-admin-text-secondary">{labels.targetType}</label>
              <select name="targetType" className={inputClass}>
                <option value="category">category</option>
                <option value="product">product</option>
                <option value="url">url</option>
              </select>
            </div>
            <input name="targetId" className={inputClass} placeholder="Target ID" />
            <input name="targetUrl" className={inputClass} placeholder="https://..." />
            <input name="sortOrder" className={inputClass} placeholder={labels.sortOrder} type="number" />
            <label className="flex items-center gap-2 rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm text-admin-text-secondary cursor-pointer hover:border-admin-border-strong">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-admin-border bg-admin-surface text-admin-accent focus:ring-admin-accent/30"
              />
              {commonLabels.enabled} Banner
            </label>
          </div>
          <div className="mt-5">
            <AdminButton type="submit" variant="primary">
              {labels.create}
            </AdminButton>
          </div>
        </form>
      </AdminCard>

      <AdminTableShell
        title={labels.list}
        description="以统一表格容器展示现有 Banner 配置。"
      >
        <div className="overflow-hidden rounded-b-[24px]">
          <table className="min-w-full divide-y divide-admin-border text-sm">
            <thead className="bg-admin-elevated text-admin-text-muted">
              <tr>
                <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">{labels.imageUrl}</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">{labels.targetType}</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">{labels.sortOrder}</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">Status</th>
                <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">{commonLabels.save}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-admin-border bg-admin-surface">
              {banners.map((banner) => {
                const updateAction = async (formData: FormData) => {
                  'use server';
                  await updateBannerFromForm(banner.id, formData);
                };

                return (
                  <tr key={banner.id} className="transition-colors hover:bg-admin-elevated">
                    <td className="min-w-[260px] px-4 py-3 text-admin-text-secondary">
                      <form id={`banner-${banner.id}`} action={updateAction} className="space-y-2">
                        <AdminImageUploadInput
                          name="imageUrl"
                          label={labels.imageUrl}
                          uploadLabel={uploadLabel}
                          defaultValue={banner.imageUrl}
                          placeholder="https://..."
                          scope="banner"
                        />
                      </form>
                    </td>
                    <td className="min-w-[220px] px-4 py-3 text-admin-text-secondary">
                      <select name="targetType" form={`banner-${banner.id}`} defaultValue={banner.targetType} className={inputClass}>
                        <option value="category">category</option>
                        <option value="product">product</option>
                        <option value="url">url</option>
                      </select>
                      <input name="targetId" form={`banner-${banner.id}`} defaultValue={banner.targetId ?? ''} className={`${inputClass} mt-2`} placeholder="Target ID" />
                      <input name="targetUrl" form={`banner-${banner.id}`} defaultValue={banner.targetUrl ?? ''} className={`${inputClass} mt-2`} placeholder="https://..." />
                    </td>
                    <td className="px-4 py-3 font-mono text-admin-text-primary">
                      <input name="sortOrder" form={`banner-${banner.id}`} defaultValue={banner.sortOrder} className={inputClass} type="number" />
                    </td>
                    <td className="px-4 py-3">
                      <label className="mb-2 flex items-center gap-2 text-sm text-admin-text-secondary">
                        <input
                          name="isActive"
                          form={`banner-${banner.id}`}
                          type="checkbox"
                          defaultChecked={banner.isActive}
                          className="h-4 w-4 rounded border-admin-border bg-admin-surface text-admin-accent focus:ring-admin-accent/30"
                        />
                        <StatusBadge
                          label={banner.isActive ? commonLabels.enabled : commonLabels.disabled}
                          tone={banner.isActive ? 'green' : 'slate'}
                        />
                      </label>
                    </td>
                    <td className="px-4 py-3">
                      <AdminButton type="submit" form={`banner-${banner.id}`} variant="secondary">
                        {commonLabels.save}
                      </AdminButton>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AdminTableShell>
    </div>
  );
}
