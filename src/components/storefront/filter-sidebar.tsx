import React from 'react';

import { FilterSelect } from '@/components/storefront/filter-select';
import type { StorefrontCategoryGroup } from '@/features/catalog/types';

type FilterSidebarProps = {
  search?: string;
  category?: string;
  subcategory?: string;
  recommended: boolean;
  hideCategoryFilters?: boolean;
  layout?: 'vertical' | 'horizontal';
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
  hideCategoryFilters,
  layout = 'vertical',
  copy,
  categoryGroups
}: FilterSidebarProps) {
  if (layout === 'horizontal') {
    return (
      <div className="w-full rounded-[18px] border border-[#e2d9d3] bg-white/70 p-3 sm:w-auto sm:rounded-full sm:p-1.5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            name="search"
            defaultValue={search}
            className="w-full rounded-full border border-[#e2d9d3] bg-white px-3 py-1.5 text-sm text-[var(--mk-text)] outline-none transition focus:border-[var(--mk-accent)] sm:w-44 sm:border-0 sm:bg-transparent"
            placeholder={copy.searchPlaceholder}
          />

          {!hideCategoryFilters && (
            <>
              <select
                name="category"
                defaultValue={category ?? ''}
                className="w-full rounded-full border border-[#e2d9d3] bg-white px-3 py-1.5 text-sm text-[var(--mk-text)] outline-none transition focus:border-[var(--mk-accent)] sm:w-auto sm:border-0 sm:bg-transparent"
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
                className="w-full rounded-full border border-[#e2d9d3] bg-white px-3 py-1.5 text-sm text-[var(--mk-text)] outline-none transition focus:border-[var(--mk-accent)] sm:w-auto sm:border-0 sm:bg-transparent"
              >
                <option value="">{copy.allSecondary}</option>
                {categoryGroups.map((group) => (
                  <optgroup key={group.id} label={group.name}>
                    {group.children.map((child) => (
                      <option key={child.id} value={child.slug}>
                        {child.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </>
          )}

          <label className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium text-[var(--mk-text-muted)]">
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
            className="w-full rounded-full bg-[#201a19] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[var(--mk-accent)] sm:w-auto"
          >
            {copy.apply}
          </button>
        </div>
      </div>
    );
  }

  return (
    <aside className="h-fit rounded-[24px] border border-[#d8cec7] bg-white/82 p-5 shadow-[0_18px_48px_rgba(32,26,25,0.08)] backdrop-blur xl:sticky xl:top-24">
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-bold text-[var(--store-text)]">
            {copy.title}
          </h2>
        </div>

        <div className="space-y-4">
          <input
            name="search"
            defaultValue={search}
            className="w-full rounded-[18px] border border-[#e2d9d3] bg-[#f8f5f2] px-4 py-3 text-sm text-[var(--mk-text)] outline-none transition focus:border-[var(--mk-accent)] focus:bg-white"
            placeholder={copy.searchPlaceholder}
          />

          {!hideCategoryFilters && (
            <>
              <FilterSelect
                name="category"
                defaultValue={category ?? ''}
                allLabel={copy.allPrimary}
                groups={[
                  {
                    options: categoryGroups.map((group) => ({
                      value: group.slug,
                      label: group.name
                    }))
                  }
                ]}
              />

              <FilterSelect
                name="subcategory"
                defaultValue={subcategory ?? ''}
                allLabel={copy.allSecondary}
                groups={[
                  {
                    options: categoryGroups.flatMap((group) =>
                      group.children.map((child) => ({
                        value: child.slug,
                        label: child.name
                      }))
                    )
                  }
                ]}
              />
            </>
          )}

          <label className="flex items-center gap-3 rounded-[18px] border border-[#e2d9d3] bg-[#f8f5f2] px-4 py-3 text-sm font-medium text-[var(--mk-text)]">
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
            className="w-full rounded-full bg-[#201a19] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--mk-accent)]"
          >
            {copy.apply}
          </button>
        </div>
      </div>
    </aside>
  );
}
