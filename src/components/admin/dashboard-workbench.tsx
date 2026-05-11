import React from 'react';
import Link from 'next/link';

type DashboardWorkbenchData = {
  pendingProducts?: number;
  todayCandidates?: number;
  weeklyPace?: string;
  hotCategories?: ReadonlyArray<string>;
};

export function DashboardWorkbench({
  data
}: {
  data?: DashboardWorkbenchData;
}) {
  return (
    <section className="space-y-6">
      <div className="rounded-[24px] border border-admin-border bg-admin-surface p-6 shadow-[0_14px_40px_rgba(15,23,42,0.04)]">
        <p className="admin-kicker">Dashboard</p>
        <h2 className="mt-2 text-2xl font-semibold text-admin-text-primary font-display">
          先处理待审核商品，再回看通知和数据
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-admin-border bg-admin-surface p-5">
          <p className="text-sm font-semibold text-admin-text-secondary">待审核商品</p>
          <p className="mt-2 text-3xl font-bold text-admin-text-primary">
            {data?.pendingProducts ?? 26}
          </p>
        </div>
        <div className="rounded-xl border border-admin-border bg-admin-surface p-5">
          <p className="text-sm font-semibold text-admin-text-secondary">今日新增候选商品</p>
          <p className="mt-2 text-3xl font-bold text-admin-text-primary">
            {data?.todayCandidates ?? 11}
          </p>
        </div>
        <div className="rounded-xl border border-admin-border bg-admin-surface p-5">
          <p className="text-sm font-semibold text-admin-text-secondary">本周上新节奏</p>
          <p className="mt-2 text-sm text-admin-text-muted">
            {data?.weeklyPace ?? '保持稳定'}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/products/new" className="rounded-lg bg-admin-accent px-4 py-2 text-sm font-semibold text-white">
          新建商品
        </Link>
        <Link href="/admin/crawl-tasks" className="rounded-lg border border-admin-border px-4 py-2 text-sm font-semibold text-admin-text-secondary">
          发起抓取
        </Link>
      </div>

      <div className="rounded-xl border border-admin-border bg-admin-surface p-5">
        <h3 className="text-base font-semibold text-admin-text-primary">热门分类</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {(data?.hotCategories ?? ['清洁机器人', '巡检无人机', '工业机械臂']).map((category) => (
            <span key={category} className="rounded-full bg-admin-elevated px-3 py-1 text-xs font-semibold text-admin-text-secondary">
              {category}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
