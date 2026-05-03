import React from 'react';
import { Globe, Plus, Filter } from 'lucide-react';
import { ProductReviewDrawer } from '@/components/admin/product-review-drawer';
import { StatusBadge } from '@/components/admin/status-badge';
import { AdminPageHero } from './admin-page-hero';
import { AdminTableShell } from './admin-table-shell';
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
        <AdminPageHero
          eyebrow="Product Center"
          title="统一商品池"
          description="自动抓取与手动导入商品在同一工作流中汇总，先补齐内容，再进入统一审核与发布节奏。"
          metrics={[
            {
              label: '总商品规模',
              value: String(data.summary.total),
              detail: '包含自动抓取与手动导入来源'
            },
            {
              label: '待审核',
              value: String(data.summary.pending),
              detail: '优先处理字段完整度较高的候选商品'
            },
            {
              label: '今日新增候选',
              value: String(data.summary.incomingToday),
              detail: '抓取和人工导入商品统一入池'
            },
            {
              label: '审核焦点',
              value: data.review.completeness,
              detail: '当前抽屉聚焦商品完整度'
            }
          ]}
          actions={
            <>
              <AdminLinkButton href="/admin/crawl-tasks" variant="secondary" size="sm">
                <Globe className="h-3.5 w-3.5" />
                发起抓取
              </AdminLinkButton>
              <AdminLinkButton href="/admin/products/new" variant="primary" size="sm">
                <Plus className="h-3.5 w-3.5" />
                新建商品
              </AdminLinkButton>
            </>
          }
        />

        <AdminTableShell
          title="审核工作区"
          description="先按来源和状态筛选，再进入商品表格与右侧审核建议。"
          toolbar={
            <>
              {['全部来源', '自动抓取', '手动导入', '待审核', '可发布', '已发布'].map(
                (filter) => (
                  <span
                    key={filter}
                    className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                      filter === '全部来源'
                        ? 'border-admin-accent/20 bg-admin-accent/10 text-admin-accent'
                        : 'border-admin-border bg-admin-elevated text-admin-text-secondary hover:border-admin-border-strong hover:text-admin-text-primary'
                    }`}
                  >
                    {filter !== '全部来源' ? <Filter className="h-3 w-3" /> : null}
                    {filter}
                  </span>
                )
              )}
            </>
          }
        >
          <div className="overflow-hidden rounded-b-[24px]">
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
        </AdminTableShell>
      </div>

      <ProductReviewDrawer review={data.review} />
    </section>
  );
}
