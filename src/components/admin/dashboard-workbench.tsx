import React from 'react';

type DashboardWorkbenchData = {
  heroTitle: string;
  heroSummary: string;
  todoItems: Array<{
    label: string;
    value: number;
  }>;
  kpis: Array<{
    label: string;
    value: string;
    detail: string;
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
    </section>
  );
}
