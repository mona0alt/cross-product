import React from 'react';
import { Globe, Plus, Filter } from 'lucide-react';
import { ProductReviewDrawer } from '@/components/admin/product-review-drawer';
import { StatusBadge } from '@/components/admin/status-badge';
import { AdminCard } from './admin-card';
import { AdminLinkButton } from './admin-button';

type ProductCenterData = {
  summary: {
    total: number;
    pending: number;
    incomingToday: number;
  };
  rows: ReadonlyArray<{
    id: string;
    name: string;
    productCode: string;
    category: string;
    source: string;
    status: string;
    completeness: string;
    action: string;
  }>;
  review: {
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
};

function getTone(label: string) {
  if (label === '自动抓取') return 'blue';
  if (label === '手动导入') return 'slate';
  if (label === '可发布') return 'green';
  return 'amber';
}

export function ProductCenter({
  data
}: {
  data: ProductCenterData;
}) {
  return (
    <section className="grid gap-6 2xl:grid-cols-[1.55fr_0.9fr]">
      <div className="space-y-6">
        <AdminCard delay={1}>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-admin-text-muted font-body">
                Product Center
              </p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-admin-text-primary font-display">
                商品中心
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-admin-text-secondary">
                自动抓取和手动导入统一进入一个商品池，发布前都经过审核。
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <AdminLinkButton href="/admin/crawl-tasks" variant="secondary" size="sm">
                <Globe className="h-3.5 w-3.5" />
                发起抓取
              </AdminLinkButton>
              <AdminLinkButton href="/admin/products/new" variant="primary" size="sm">
                <Plus className="h-3.5 w-3.5" />
                新建商品
              </AdminLinkButton>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {[
              ['总商品', String(data.summary.total)],
              ['待审核', String(data.summary.pending)],
              ['今日新增候选', String(data.summary.incomingToday)]
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-admin-border bg-admin-elevated px-5 py-4">
                <p className="text-sm text-admin-text-secondary">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-admin-text-primary font-mono">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </AdminCard>

        <AdminCard delay={2}>
          <div className="flex flex-wrap gap-2">
            {['全部来源', '自动抓取', '手动导入', '待审核', '可发布', '已发布'].map(
              (filter) => (
                <span
                  key={filter}
                  className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                    filter === '全部来源'
                      ? 'bg-admin-accent/10 text-admin-accent border border-admin-accent/20'
                      : 'bg-admin-elevated text-admin-text-secondary border border-admin-border hover:border-admin-border-strong hover:text-admin-text-primary'
                  }`}
                >
                  {filter !== '全部来源' && <Filter className="h-3 w-3" />}
                  {filter}
                </span>
              )
            )}
          </div>

          <div className="mt-6 overflow-hidden rounded-lg border border-admin-border">
            <table className="min-w-full divide-y divide-admin-border text-sm">
              <thead className="bg-admin-elevated text-admin-text-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">商品</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">来源</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">状态</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">完整度</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">建议操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border bg-admin-surface">
                {data.rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-admin-elevated">
                    <td className="px-4 py-4">
                      <p className="font-medium text-admin-text-primary">{row.name}</p>
                      <p className="mt-1 text-xs text-admin-text-muted">
                        SKU {row.productCode} · {row.category}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge
                        label={row.source}
                        tone={getTone(row.source) as 'blue' | 'slate'}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge
                        label={row.status}
                        tone={getTone(row.status) as 'amber' | 'green'}
                      />
                    </td>
                    <td className="px-4 py-4 text-admin-text-secondary">{row.completeness}</td>
                    <td className="px-4 py-4 text-admin-text-secondary">{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      </div>

      <ProductReviewDrawer review={data.review} />
    </section>
  );
}
