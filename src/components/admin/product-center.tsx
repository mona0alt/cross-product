import React from 'react';
import Link from 'next/link';

import { ProductReviewDrawer } from '@/components/admin/product-review-drawer';
import { StatusBadge } from '@/components/admin/status-badge';

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
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Product Center
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                商品中心
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                自动抓取和手动导入统一进入一个商品池，发布前都经过审核。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/crawl-tasks"
                className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
              >
                发起抓取
              </Link>
              <Link
                href="/admin/products/new"
                className="rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-amber-200"
              >
                新建商品
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {[
              ['总商品', String(data.summary.total)],
              ['待审核', String(data.summary.pending)],
              ['今日新增候选', String(data.summary.incomingToday)]
            ].map(([label, value]) => (
              <div key={label} className="rounded-3xl bg-slate-100 px-5 py-4">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap gap-3">
            {['全部来源', '自动抓取', '手动导入', '待审核', '可发布', '已发布'].map(
              (filter) => (
                <span
                  key={filter}
                  className={`rounded-full px-4 py-2 text-sm ${
                    filter === '全部来源'
                      ? 'bg-slate-950 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {filter}
                </span>
              )
            )}
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">商品</th>
                  <th className="px-4 py-3 text-left">来源</th>
                  <th className="px-4 py-3 text-left">状态</th>
                  <th className="px-4 py-3 text-left">内容完整度</th>
                  <th className="px-4 py-3 text-left">建议操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {data.rows.map((row) => (
                  <tr key={row.id}>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-slate-950">{row.name}</p>
                      <p className="mt-1 text-xs text-slate-500">
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
                    <td className="px-4 py-4 text-slate-700">{row.completeness}</td>
                    <td className="px-4 py-4 text-slate-700">{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ProductReviewDrawer review={data.review} />
    </section>
  );
}
