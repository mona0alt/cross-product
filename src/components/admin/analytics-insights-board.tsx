import React from 'react';
import { AdminTableShell } from './admin-table-shell';

type AnalyticsInsightsData = {
  headline: string;
  summary: string;
  insights: readonly string[];
};

export function AnalyticsInsightsBoard({
  data
}: {
  data: AnalyticsInsightsData;
}) {
  return (
    <section className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-semibold text-admin-text-primary">
            企业级 AI 数据分析概览
          </h2>
          <p className="mt-1 text-[13px] text-admin-text-secondary">
            实时监控全球业务绩效与 AI 智能决策建议
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="rounded border border-admin-border bg-white px-4 py-2 text-sm text-slate-700">
            2023年10月01日 - 2023年10月31日
          </div>
          <button className="rounded border border-admin-border bg-white px-4 py-2 text-sm text-slate-700">
            导出
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          ['总营收', '¥4,280,000', '+12.5%'],
          ['转化率', '3.48%', '+2.1%'],
          ['跳出率', '24.12%', '0.4%'],
          ['活跃用户', '12,842', '+8.3%']
        ].map(([label, value, trend]) => (
          <div key={label} className="rounded-xl border border-admin-border bg-white p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-admin-text-muted">
              {label}
            </p>
            <p className="mt-4 text-[32px] font-semibold leading-none text-admin-text-primary">
              {value}
            </p>
            <p className="mt-4 text-[11px] font-bold text-admin-accent">{trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          <AdminTableShell title="用户转化漏斗" description="按参考稿保留主分析区。">
            <div className="space-y-4 p-8 text-[13px] text-admin-text-secondary">
              <p>网站总访问量 128,421</p>
              <p>产品列表/搜索 82,189</p>
              <p>加入购物车 28,252</p>
              <p>成功支付完成 4,366</p>
              <p>{data.summary}</p>
            </div>
          </AdminTableShell>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <AdminTableShell title="AI 智能洞察" description="保留右侧建议面板。">
            <div className="grid gap-4 p-6">
              <div className="rounded-xl border border-admin-border bg-emerald-50/40 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.08em] text-admin-accent">
                  本周结论
                </p>
                <p className="mt-2 text-sm font-semibold text-admin-text-primary">{data.headline}</p>
              </div>
              {data.insights.map((insight) => (
                <div key={insight} className="rounded-xl border border-admin-border bg-slate-50 p-4 text-[13px] text-admin-text-secondary">
                  {insight}
                </div>
              ))}
            </div>
          </AdminTableShell>
        </div>
      </div>
    </section>
  );
}
