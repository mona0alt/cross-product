import React from 'react';
import { StatusBadge } from '@/components/admin/status-badge';
import { AdminTableShell } from './admin-table-shell';

type ProductReviewData = {
  title: string;
  source: string;
  status: string;
  completeness: string;
  checks: ReadonlyArray<{
    label: string;
    value: string;
  }>;
  advice: string;
};

export function ProductReviewDrawer({
  review
}: {
  review: ProductReviewData;
}) {
  return (
    <AdminTableShell
      title="多语言内容翻译与审核"
      description="严格对应参考稿右下角审核面板。"
    >
      <div className="grid gap-4 p-4 xl:grid-cols-3">
        {review.checks.map((check) => (
          <div key={check.label} className="rounded-md border border-admin-border bg-white p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.05em] text-admin-text-muted">
              {check.label}
            </p>
            <p className="mt-2 text-sm text-admin-text-primary">{check.value}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-admin-border bg-slate-50 px-4 py-3">
        <div className="mb-3 flex flex-wrap gap-2">
          <StatusBadge label={review.source} tone="slate" />
          <StatusBadge label={review.status} tone="amber" />
          <StatusBadge label={`完整度 ${review.completeness}`} tone="green" />
        </div>
        <p className="text-[13px] leading-6 text-admin-text-secondary">{review.advice}</p>
      </div>
      <div className="flex justify-end gap-3 border-t border-admin-border bg-slate-50 p-4">
        <button className="rounded border border-red-200 px-4 py-2 text-[13px] font-bold text-red-600">
          拒绝此条目
        </button>
        <button className="rounded bg-admin-accent px-4 py-2 text-[13px] font-bold text-white">
          审核通过并上架
        </button>
      </div>
    </AdminTableShell>
  );
}
