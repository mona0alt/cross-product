import React from 'react';
import { Globe, Plus } from 'lucide-react';
import { ProductReviewDrawer } from '@/components/admin/product-review-drawer';
import { StatusBadge } from '@/components/admin/status-badge';
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
  const inputClass =
    'w-full rounded border border-admin-border bg-white px-3 py-2 text-[13px] text-admin-text-primary outline-none';

  return (
    <section className="grid grid-cols-12 gap-6">
      <div className="col-span-12 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-semibold text-admin-text-primary">产品审核中心</h2>
          <p className="mt-1 text-[13px] text-admin-text-secondary">
            管理自动抓取源及手动导入的跨语言商品目录。
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <AdminLinkButton href="/admin/products/new" variant="secondary" size="sm">
            <Plus className="h-3.5 w-3.5" />
            手动导入商品
          </AdminLinkButton>
          <AdminLinkButton href="/admin/crawl-tasks" variant="secondary" size="sm">
            <Globe className="h-3.5 w-3.5" />
            日志记录
          </AdminLinkButton>
        </div>
      </div>

      <section className="col-span-12 space-y-6 lg:col-span-4">
        <AdminTableShell
          title="手动新增商品"
          description="严格复刻参考稿左侧录入面板。"
        >
          <div className="grid gap-4 p-4">
            <input className={inputClass} defaultValue={data.review.title} placeholder="输入核心标题" />
            <select className={inputClass} defaultValue={data.rows[0]?.category}>
              <option>{data.rows[0]?.category ?? '电子产品'}</option>
            </select>
            <div className="grid grid-cols-2 gap-4">
              <input className={inputClass} defaultValue="599.00" placeholder="0.00" />
              <input className={inputClass} defaultValue="100" placeholder="100" />
            </div>
            <textarea
              className={`${inputClass} min-h-[120px] resize-none`}
              defaultValue="点击或拖拽图片上传"
            />
            <AdminLinkButton href="/admin/products/new" variant="primary" size="sm">
              保存到待审核列表
            </AdminLinkButton>
          </div>
        </AdminTableShell>

        <AdminTableShell
          title="自动抓取源监控"
          description="保留来源站点状态卡。"
        >
          <div className="grid gap-3 p-4">
            {data.rows.slice(0, 2).map((row, index) => (
              <div key={row.id} className="rounded-md border border-admin-border bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold text-admin-text-primary">
                    {index === 0 ? 'Amazon US Electronics' : 'AliExpress Global'}
                  </span>
                  <StatusBadge label={index === 0 ? '运行中' : '已挂起'} tone={index === 0 ? 'green' : 'slate'} />
                </div>
                <p className="mt-1 text-[11px] text-admin-text-secondary">
                  {index === 0 ? '上次同步: 12分钟前' : '需要重新验证 API'}
                </p>
              </div>
            ))}
          </div>
        </AdminTableShell>
      </section>

      <section className="col-span-12 grid gap-6 lg:col-span-8">
        <AdminTableShell
          title="待审核商品列表"
          description="抓取 + 手动导入统一审核列表。"
        >
          <div className="overflow-hidden rounded-b-xl">
            <table className="min-w-full divide-y divide-admin-border text-sm">
              <thead className="bg-admin-elevated text-admin-text-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">商品标题 / SKU</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">来源 / 类型</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">价格</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">审核状态</th>
                  <th className="px-4 py-3 text-left text-[10px] uppercase tracking-wider font-medium">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-admin-border bg-admin-surface">
                {data.rows.map((row, index) => (
                  <tr key={row.id} className="transition-colors hover:bg-admin-elevated">
                    <td className="px-4 py-4">
                      <p className="font-medium text-admin-text-primary">{row.name}</p>
                      <p className="mt-1 text-xs text-admin-text-muted">
                        SKU {row.productCode}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge
                        label={row.source}
                        tone={getTone(row.source) as 'blue' | 'slate'}
                      />
                    </td>
                    <td className="px-4 py-4 text-admin-text-secondary">
                      {index === 0 ? '$299.00' : index === 1 ? '$599.00' : '$899.00'}
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge
                        label={row.status}
                        tone={getTone(row.status) as 'amber' | 'green'}
                      />
                    </td>
                    <td className="px-4 py-4 text-admin-text-secondary">{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminTableShell>

        <ProductReviewDrawer review={data.review} />
      </section>
    </section>
  );
}
