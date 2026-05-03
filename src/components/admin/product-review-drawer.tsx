import React from 'react';
import { StatusBadge } from '@/components/admin/status-badge';
import { AdminCard } from './admin-card';

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
    <AdminCard delay={3} className="sticky top-28 h-fit">
      <p className="admin-kicker">Review Panel</p>
      <h3 className="mt-2 text-2xl font-semibold text-admin-text-primary font-display">
        {review.title}
      </h3>
      <p className="mt-2 text-sm leading-7 text-admin-text-secondary">
        审核建议集中呈现标题、图片、摘要完整度和下一步动作，作为商品中心右侧的固定工作区。
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge label={review.source} tone="slate" />
        <StatusBadge label={review.status} tone="amber" />
        <StatusBadge label={`完整度 ${review.completeness}`} tone="green" />
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {review.checks.map((check) => (
          <div key={check.label} className="rounded-lg border border-admin-border bg-admin-elevated p-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-admin-text-muted">
              {check.label}
            </p>
            <p className="mt-2 text-lg font-semibold text-admin-text-primary font-mono">
              {check.value}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg border border-admin-border bg-admin-elevated p-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-admin-text-muted">
          审核建议
        </p>
        <p className="mt-3 text-sm leading-relaxed text-admin-text-secondary">
          {review.advice}
        </p>
      </div>
    </AdminCard>
  );
}
