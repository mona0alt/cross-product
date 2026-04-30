import React from 'react';

const toneStyles = {
  slate: 'bg-admin-elevated text-admin-text-secondary border-admin-border',
  blue: 'bg-admin-accent/10 text-admin-accent border-admin-accent/20',
  amber: 'bg-admin-warning/10 text-admin-warning border-admin-warning/20',
  green: 'bg-admin-success/10 text-admin-success border-admin-success/20',
  danger: 'bg-admin-danger/10 text-admin-danger border-admin-danger/20'
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
      className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider border ${toneStyles[tone]}`}
    >
      {label}
    </span>
  );
}
