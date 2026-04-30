import React from 'react';

import { StatusBadge } from '@/components/admin/status-badge';

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
    <aside className="rounded-[2rem] bg-slate-950 p-6 text-white shadow-sm">
      <p className="text-xs uppercase tracking-[0.35em] text-slate-400">
        Review Panel
      </p>
      <h3 className="mt-3 text-2xl font-semibold">{review.title}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge label={review.source} tone="slate" />
        <StatusBadge label={review.status} tone="amber" />
        <StatusBadge label={`完整度 ${review.completeness}`} tone="green" />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {review.checks.map((check) => (
          <div key={check.label} className="rounded-3xl bg-white/10 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
              {check.label}
            </p>
            <p className="mt-2 text-lg font-semibold">{check.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-3xl bg-white/10 p-4">
        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
          审核建议
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">{review.advice}</p>
      </div>
    </aside>
  );
}
