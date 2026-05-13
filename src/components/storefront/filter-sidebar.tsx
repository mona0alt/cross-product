import React from 'react';

import type { StorefrontCategoryGroup } from '@/features/catalog/types';

type FilterSidebarProps = {
  search?: string;
  category?: string;
  subcategory?: string;
  recommended: boolean;
  hideCategoryFilters?: boolean;
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
  copy,
  categoryGroups
}: FilterSidebarProps) {
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
            className="w-full rounded-[18px] border border-[#d8cec7] bg-white px-4 py-3 text-sm text-[var(--mk-text)] outline-none transition focus:border-[var(--mk-accent)]"
            placeholder={copy.searchPlaceholder}
          />

          {!hideCategoryFilters && (
            <>
              <select
                name="category"
                defaultValue={category ?? ''}
                className="w-full rounded-[18px] border border-[#d8cec7] bg-white px-4 py-3 text-sm text-[var(--mk-text)] outline-none transition focus:border-[var(--mk-accent)]"
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
                className="w-full rounded-[18px] border border-[#d8cec7] bg-white px-4 py-3 text-sm text-[var(--mk-text)] outline-none transition focus:border-[var(--mk-accent)]"
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
            </>
          )}

          <label className="flex items-center gap-3 rounded-[18px] border border-[#d8cec7] bg-[#f8f5f2] px-4 py-3 text-sm font-medium text-[var(--mk-text)]">
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
