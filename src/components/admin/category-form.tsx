import React from 'react';
import { createCategoryFromForm, updateCategoryFromForm } from '@/features/admin/category-actions';
import { AdminButton } from './admin-button';
import { AdminTableShell } from './admin-table-shell';

export type CategoryOption = {
  id: string;
  label: string;
};

export type CategoryRecord = {
  id: string;
  parentId: string | null;
  slug: string;
  sortOrder: number;
  iconImageUrl: string | null;
  isActive: boolean;
  nameZh: string;
  nameEn: string;
  nameEs: string;
  namePt: string;
  descriptionZh: string | null;
  descriptionEn: string | null;
  descriptionEs: string | null;
  descriptionPt: string | null;
};

const inputClass =
  'w-full rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm text-admin-text-primary outline-none transition-all duration-200 placeholder:text-admin-text-muted focus:border-admin-accent/30 focus:ring-1 focus:ring-admin-accent/20';

const labelClass = 'block text-sm font-medium text-admin-text-secondary mb-1.5';

export function CategoryForm({
  categories,
  records
}: {
  categories: CategoryOption[];
  records: CategoryRecord[];
}) {
  const createAction = async (formData: FormData) => {
    'use server';

    await createCategoryFromForm(formData);
  };

  return (
    <div className="space-y-6">
      <AdminTableShell title="分类管理" description="管理后台分类，前台商品展示会读取启用分类。">
        <form action={createAction} className="space-y-5 p-6">
          <div>
            <p className="admin-kicker">Create Category</p>
            <h3 className="mt-1 text-xl font-semibold text-admin-text-primary font-display">
              新建分类
            </h3>
          </div>
          <CategoryFields categories={categories} />
          <div className="border-t border-admin-border pt-4">
            <AdminButton type="submit" variant="primary">
              保存分类
            </AdminButton>
          </div>
        </form>
      </AdminTableShell>

      <AdminTableShell title="已有分类" description="编辑分类名称、排序、启用状态和多语言描述。">
        <div className="space-y-5 p-6">
          {records.length > 0 ? (
            records.map((category) => (
              <CategoryUpdateForm
                key={category.id}
                category={category}
                categories={categories}
              />
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-admin-border bg-admin-elevated px-6 py-10 text-center">
              <p className="text-sm font-semibold text-admin-text-primary">暂无分类</p>
              <p className="mt-1 text-xs text-admin-text-muted">
                新建分类后，可在商品表单中选择该分类。
              </p>
            </div>
          )}
        </div>
      </AdminTableShell>
    </div>
  );
}

function CategoryUpdateForm({
  category,
  categories
}: {
  category: CategoryRecord;
  categories: CategoryOption[];
}) {
  const updateAction = async (formData: FormData) => {
    'use server';

    await updateCategoryFromForm(category.id, formData);
  };

  return (
    <form
      id={`category-${category.id}`}
      action={updateAction}
      className="rounded-xl border border-admin-border bg-white p-5"
    >
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h4 className="text-base font-bold text-admin-text-primary">
            {category.nameZh}
          </h4>
          <p className="mt-1 font-mono text-xs text-admin-text-muted">
            {category.slug}
          </p>
        </div>
        <AdminButton type="submit" variant="secondary">
          保存更改
        </AdminButton>
      </div>
      <CategoryFields
        categories={categories.filter((item) => item.id !== category.id)}
        category={category}
      />
    </form>
  );
}

function CategoryFields({
  categories,
  category
}: {
  categories: CategoryOption[];
  category?: CategoryRecord;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="父级分类">
        <select name="parentId" defaultValue={category?.parentId ?? ''} className={inputClass}>
          <option value="">一级分类</option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Slug">
        <input
          name="slug"
          defaultValue={category?.slug}
          className={inputClass}
          placeholder="humanoid-robots"
        />
      </Field>
      <Field label="排序">
        <input
          name="sortOrder"
          defaultValue={category?.sortOrder ?? 0}
          className={inputClass}
          type="number"
        />
      </Field>
      <Field label="图标 URL">
        <input
          name="iconImageUrl"
          defaultValue={category?.iconImageUrl ?? ''}
          className={inputClass}
          placeholder="/show/robot_humanoid.png"
        />
      </Field>
      <Field label="中文名称">
        <input name="nameZh" defaultValue={category?.nameZh} className={inputClass} />
      </Field>
      <Field label="英文名称">
        <input name="nameEn" defaultValue={category?.nameEn} className={inputClass} />
      </Field>
      <Field label="西语名称">
        <input name="nameEs" defaultValue={category?.nameEs} className={inputClass} />
      </Field>
      <Field label="葡语名称">
        <input name="namePt" defaultValue={category?.namePt} className={inputClass} />
      </Field>
      <Field label="中文描述" className="md:col-span-2">
        <textarea
          name="descriptionZh"
          defaultValue={category?.descriptionZh ?? ''}
          className={`${inputClass} min-h-[84px] resize-y`}
        />
      </Field>
      <Field label="英文描述" className="md:col-span-2">
        <textarea
          name="descriptionEn"
          defaultValue={category?.descriptionEn ?? ''}
          className={`${inputClass} min-h-[84px] resize-y`}
        />
      </Field>
      <Field label="西语描述" className="md:col-span-2">
        <textarea
          name="descriptionEs"
          defaultValue={category?.descriptionEs ?? ''}
          className={`${inputClass} min-h-[84px] resize-y`}
        />
      </Field>
      <Field label="葡语描述" className="md:col-span-2">
        <textarea
          name="descriptionPt"
          defaultValue={category?.descriptionPt ?? ''}
          className={`${inputClass} min-h-[84px] resize-y`}
        />
      </Field>
      <label className="flex items-center gap-2 rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm text-admin-text-secondary md:col-span-2">
        <input
          name="isActive"
          type="checkbox"
          defaultChecked={category?.isActive ?? true}
          className="h-4 w-4 rounded border-admin-border bg-admin-surface text-admin-accent focus:ring-admin-accent/30"
        />
        启用分类
      </label>
    </div>
  );
}

function Field({
  label,
  className = '',
  children
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}
