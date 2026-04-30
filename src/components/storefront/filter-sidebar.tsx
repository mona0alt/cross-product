import React from 'react';

import type { StorefrontCategoryGroup } from '@/features/catalog/types';

type FilterSidebarProps = {
  search?: string;
  category?: string;
  subcategory?: string;
  recommended: boolean;
  copy: {
    title: string;
    searchPlaceholder: string;
    allPrimary: string;
    allSecondary: string;
    recommendedOnly: string;
    apply: string;
  };
  categoryGroups: StorefrontCategoryGroup[];
};

export function FilterSidebar({
  search,
  category,
  subcategory,
  recommended,
  copy,
  categoryGroups
}: FilterSidebarProps) {
  return (
    <aside className="storefront-surface h-fit rounded-[var(--store-radius-lg)] p-5">
      <div className="space-y-5">
        <div>
          <p className="storefront-eyebrow">{copy.title}</p>
          <h2 className="text-lg font-bold text-[var(--store-text)]">
            {copy.title}
          </h2>
        </div>

        <div className="space-y-4">
          <input
            name="search"
            defaultValue={search}
            className="w-full rounded-2xl border border-[var(--store-border)] bg-white px-4 py-3 text-sm"
            placeholder={copy.searchPlaceholder}
          />

          <select
            name="category"
            defaultValue={category ?? ''}
            className="w-full rounded-2xl border border-[var(--store-border)] bg-white px-4 py-3 text-sm"
          >
            <option value="">{copy.allPrimary}</option>
            {categoryGroups.map((group) => (
              <option key={group.id} value={group.slug}>
                {group.name}
              </option>
            ))}
          </select>

          <select
            name="subcategory"
            defaultValue={subcategory ?? ''}
            className="w-full rounded-2xl border border-[var(--store-border)] bg-white px-4 py-3 text-sm"
          >
            <option value="">{copy.allSecondary}</option>
            {categoryGroups.flatMap((group) =>
              group.children.map((child) => (
                <option key={child.id} value={child.slug}>
                  {group.name} / {child.name}
                </option>
              ))
            )}
          </select>

          <label className="flex items-center gap-3 rounded-2xl border border-[var(--store-border)] bg-[var(--store-surface-muted)] px-4 py-3 text-sm font-medium text-[var(--store-text)]">
            <input
              type="checkbox"
              name="recommended"
              value="1"
              defaultChecked={recommended}
            />
            {copy.recommendedOnly}
          </label>

          <button
            type="submit"
            className="w-full rounded-full bg-[var(--store-accent)] px-4 py-3 text-sm font-semibold text-white"
          >
            {copy.apply}
          </button>
        </div>
      </div>
    </aside>
  );
}
