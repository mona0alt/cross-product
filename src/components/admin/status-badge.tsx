import React from 'react';

const toneStyles = {
  slate: 'bg-slate-200 text-slate-700',
  blue: 'bg-blue-100 text-blue-700',
  amber: 'bg-amber-100 text-amber-800',
  green: 'bg-emerald-100 text-emerald-700'
} as const;

export function StatusBadge({
  label,
  tone = 'slate'
}: {
  label: string;
  tone?: keyof typeof toneStyles;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${toneStyles[tone]}`}
    >
      {label}
    </span>
  );
}
