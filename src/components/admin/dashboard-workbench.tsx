import React from 'react';

type DashboardWorkbenchData = {
  heroTitle: string;
  heroSummary: string;
  quickActions: readonly string[];
  todoItems: ReadonlyArray<{
    label: string;
    value: number;
  }>;
  kpis: ReadonlyArray<{
    label: string;
    value: string;
    detail: string;
  }>;
  weeklyLaunches: readonly number[];
  hotCategories: ReadonlyArray<{
    label: string;
    share: string;
  }>;
};

export function DashboardWorkbench({
  data
}: {
  data: DashboardWorkbenchData;
}) {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
          Workbench
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
          {data.heroTitle}
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
          {data.heroSummary}
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {data.todoItems.map((item) => (
            <div
              key={item.label}
              className="rounded-3xl bg-slate-950 px-5 py-4 text-white"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                {item.label}
              </p>
              <p className="mt-2 text-3xl font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{kpi.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">
              {kpi.value}
            </p>
            <p className="mt-2 text-sm text-slate-600">{kpi.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
                Quick Actions
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-slate-950">
                快捷操作
              </h3>
            </div>
            <p className="text-sm text-slate-500">工作流优先</p>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3 xl:grid-cols-5">
            {data.quickActions.map((action) => (
              <div
                key={action}
                className="rounded-3xl bg-amber-100 px-4 py-5 text-center text-sm font-semibold text-slate-950"
              >
                {action}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            Launch Rhythm
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">
            本周上新节奏
          </h3>
          <div className="mt-6 flex h-40 items-end gap-3">
            {data.weeklyLaunches.map((value, index) => (
              <div key={`${value}-${index}`} className="flex-1">
                <div
                  className="rounded-t-2xl bg-gradient-to-b from-amber-300 to-orange-400"
                  style={{ height: `${value * 12}px` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            Review Queue
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">
            待审核商品
          </h3>
          <div className="mt-5 space-y-3">
            {[
              'Portable Cleaning Robot X2',
              'Warehouse Drone Mini',
              'Industrial Arm Pro 8'
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-200 px-4 py-4 text-sm text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.35em] text-slate-500">
            Category Heat
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-950">
            热门分类
          </h3>
          <div className="mt-5 space-y-3">
            {data.hotCategories.map((category) => (
              <div
                key={category.label}
                className="flex items-center justify-between rounded-3xl bg-slate-100 px-4 py-4"
              >
                <span className="text-sm font-medium text-slate-700">
                  {category.label}
                </span>
                <span className="text-sm font-semibold text-slate-950">
                  {category.share}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
