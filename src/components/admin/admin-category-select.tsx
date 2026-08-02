import React from 'react';

type AdminCategory = {
  id: string;
  parentId?: string | null;
  nameZh: string;
  nameEn?: string;
  nameEs?: string;
  namePt?: string;
};

const inputClass =
  'w-full rounded-lg border border-admin-border bg-admin-surface px-4 py-2.5 text-sm text-admin-text-primary outline-none transition-all duration-200 placeholder:text-admin-text-muted focus:border-admin-accent/30 focus:ring-1 focus:ring-admin-accent/20';

export function AdminCategorySelect({
  name,
  categories,
  defaultValue = '',
  placeholder = '选择类目',
  disabled = false,
  extraOption
}: {
  name: string;
  categories: AdminCategory[];
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  extraOption?: { value: string; label: string };
}) {
  const roots = categories.filter((c) => !c.parentId);
  const leavesByRoot = new Map(
    roots.map((root) => [root.id, categories.filter((c) => c.parentId === root.id)])
  );

  return (
    <select
      name={name}
      defaultValue={defaultValue}
      disabled={disabled}
      className={inputClass}
    >
      <option value="">{placeholder}</option>
      {extraOption ? <option value={extraOption.value}>{extraOption.label}</option> : null}
      {roots.map((root) => (
        <optgroup key={root.id} label={root.nameZh}>
          {(leavesByRoot.get(root.id) ?? []).map((leaf) => (
            <option key={leaf.id} value={leaf.id}>
              {leaf.nameZh}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
}
